"use client";

import { useMemo, useState, type MouseEvent } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CATEGORIES, type Category, type Transaction } from "./types";

// Validated against this site's dark surface (#161b22) with
// scripts/validate_palette.js from the dataviz skill: all 6 categorical
// checks pass for these 7 slots in the CATEGORIES order (adjacent-pair CVD
// delta E 8.4, normal-vision delta E 19.3, both above the required floors).
const CATEGORY_COLORS: Record<Category, string> = {
  food: "#3987e5",
  rent: "#d95926",
  transport: "#199e70",
  utilities: "#c98500",
  subscriptions: "#d55181",
  entertainment: "#008300",
  other: "#9085e9",
};

function startOfMonthISO() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const offset = first.getTimezoneOffset() * 60000;
  return new Date(first.getTime() - offset).toISOString().slice(0, 10);
}

function lastNDaysISO(n: number): string[] {
  const now = new Date();
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const offset = d.getTimezoneOffset() * 60000;
    days.push(new Date(d.getTime() - offset).toISOString().slice(0, 10));
  }
  return days;
}

function monthlyCategoryTotals(transactions: Transaction[]) {
  const from = startOfMonthISO();
  const totals = new Map<Category, number>();
  for (const tx of transactions) {
    if (tx.type !== "expense" || tx.date < from) continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  }
  return CATEGORIES.map((category) => ({
    category,
    amount: totals.get(category) ?? 0,
  })).filter((row) => row.amount > 0);
}

function CategoryBarChart({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState<Category | null>(null);

  const data = useMemo(() => monthlyCategoryTotals(transactions), [transactions]);

  const maxAmount = Math.max(1, ...data.map((row) => row.amount));

  if (data.length === 0) {
    return <p className="text-sm text-muted">{t("expenses.emptyChart")}</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((row) => (
        <div
          key={row.category}
          onMouseEnter={() => setHovered(row.category)}
          onMouseLeave={() => setHovered(null)}
          className="flex items-center gap-3 text-sm"
        >
          <span className="w-24 shrink-0 truncate text-muted">
            {t(`expenses.categories.${row.category}`)}
          </span>
          <div className="relative flex min-w-0 flex-1 items-center">
            <div
              className={`h-6 rounded-r transition-[filter] ${
                hovered === row.category ? "brightness-110" : ""
              }`}
              style={{
                width: `${(row.amount / maxAmount) * 100}%`,
                backgroundColor: CATEGORY_COLORS[row.category],
              }}
            />
            <span className="ml-2 shrink-0 text-xs font-medium text-foreground">
              {row.amount.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryDonutChart({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState<Category | null>(null);

  const data = useMemo(() => monthlyCategoryTotals(transactions), [transactions]);
  const total = data.reduce((sum, row) => sum + row.amount, 0);

  if (data.length === 0) {
    return <p className="text-sm text-muted">{t("expenses.emptyChart")}</p>;
  }

  const radius = 70;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  const gapPct = 0.6;

  const segments = data.reduce<
    { category: Category; amount: number; pct: number; offsetPct: number }[]
  >((acc, row) => {
    const previous = acc[acc.length - 1];
    const offsetPct = previous ? previous.offsetPct + previous.pct : 0;
    const pct = (row.amount / total) * 100;
    return [...acc, { category: row.category, amount: row.amount, pct, offsetPct }];
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <svg
        viewBox="0 0 200 200"
        className="h-40 w-40 shrink-0"
        role="img"
        aria-label={t("expenses.spendingShare")}
      >
        <g transform="rotate(-90 100 100)">
          {segments.map((segment) => {
            const gap = Math.min(gapPct, segment.pct * 0.15);
            const dash = (segment.pct - gap) / 100 * circumference;
            const remainder = circumference - dash;
            return (
              <circle
                key={segment.category}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={CATEGORY_COLORS[segment.category]}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${remainder}`}
                strokeDashoffset={-(segment.offsetPct / 100) * circumference}
                className={`transition-[filter] ${
                  hovered && hovered !== segment.category ? "opacity-40" : ""
                }`}
              />
            );
          })}
        </g>
        <text
          x="100"
          y="96"
          textAnchor="middle"
          className="fill-foreground text-[22px] font-semibold"
        >
          {total.toFixed(0)}
        </text>
        <text
          x="100"
          y="116"
          textAnchor="middle"
          className="fill-muted text-[11px]"
        >
          {t("expenses.periodMonth")}
        </text>
      </svg>

      <ul className="flex w-full flex-col gap-2">
        {segments.map((segment) => (
          <li
            key={segment.category}
            onMouseEnter={() => setHovered(segment.category)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-2 text-sm"
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[segment.category] }}
            />
            <span className="min-w-0 flex-1 truncate text-foreground">
              {t(`expenses.categories.${segment.category}`)}
            </span>
            <span className="shrink-0 text-xs text-muted">
              {segment.amount.toFixed(2)} ({segment.pct.toFixed(0)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SpendingOverTimeChart({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = useMemo(() => {
    const days = lastNDaysISO(30);
    const totals = new Map<string, number>();
    for (const tx of transactions) {
      if (tx.type !== "expense") continue;
      totals.set(tx.date, (totals.get(tx.date) ?? 0) + tx.amount);
    }
    return days.map((date) => ({ date, amount: totals.get(date) ?? 0 }));
  }, [transactions]);

  const width = 600;
  const height = 160;
  const padding = 8;
  const maxAmount = Math.max(1, ...data.map((d) => d.amount));

  function xFor(index: number) {
    return padding + (index / (data.length - 1)) * (width - padding * 2);
  }
  function yFor(amount: number) {
    return height - padding - (amount / maxAmount) * (height - padding * 2);
  }

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.amount)}`)
    .join(" ");

  function handleMouseMove(e: MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    const index = Math.round(fraction * (data.length - 1));
    setHoveredIndex(Math.min(data.length - 1, Math.max(0, index)));
  }

  const hovered = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {[0, 0.5, 1].map((fraction) => (
          <line
            key={fraction}
            x1={padding}
            x2={width - padding}
            y1={padding + fraction * (height - padding * 2)}
            y2={padding + fraction * (height - padding * 2)}
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {hoveredIndex !== null && (
          <>
            <line
              x1={xFor(hoveredIndex)}
              x2={xFor(hoveredIndex)}
              y1={padding}
              y2={height - padding}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <circle
              cx={xFor(hoveredIndex)}
              cy={yFor(data[hoveredIndex].amount)}
              r={5}
              fill="var(--accent)"
              stroke="var(--surface)"
              strokeWidth={2}
            />
          </>
        )}
      </svg>
      {hovered && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-border bg-surface px-2 py-1 text-xs shadow-md"
          style={{ left: `${(xFor(hoveredIndex!) / width) * 100}%` }}
        >
          <div className="font-medium text-foreground">{hovered.amount.toFixed(2)}</div>
          <div className="text-muted">{hovered.date}</div>
        </div>
      )}
      <p className="mt-2 text-xs text-muted">{t("expenses.last30Days")}</p>
    </div>
  );
}

export default function SpendingCharts({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-6 rounded-none border border-border bg-surface p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          {t("expenses.spendingByCategory")}
        </h2>
        <CategoryBarChart transactions={transactions} />
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <h2 className="text-sm font-semibold text-foreground">
          {t("expenses.spendingShare")}
        </h2>
        <CategoryDonutChart transactions={transactions} />
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <h2 className="text-sm font-semibold text-foreground">
          {t("expenses.spendingOverTime")}
        </h2>
        <SpendingOverTimeChart transactions={transactions} />
      </div>
    </div>
  );
}
