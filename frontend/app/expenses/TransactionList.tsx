"use client";

import { useMemo, useState, type UIEvent } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Select from "@/components/Select";
import { CATEGORIES, type Category, type Transaction } from "./types";
import TransactionRow from "./TransactionRow";

const FIELD_TRIGGER_CLASSES =
  "flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm outline-none transition-colors focus:border-accent";

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-muted"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

type CategoryFilter = Category | "all";

export default function TransactionList({
  transactions,
  onUpdate,
  onDelete,
}: {
  transactions: Transaction[];
  onUpdate: (
    id: string,
    updates: Partial<
      Pick<Transaction, "type" | "category" | "description" | "amount" | "date">
    >,
  ) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const filtered = useMemo(
    () =>
      transactions.filter((tx) => {
        if (categoryFilter !== "all" && tx.category !== categoryFilter) return false;
        if (fromDate && tx.date < fromDate) return false;
        if (toDate && tx.date > toDate) return false;
        return true;
      }),
    [transactions, categoryFilter, fromDate, toDate],
  );

  const hasActiveFilters = categoryFilter !== "all" || !!fromDate || !!toDate;

  function clearFilters() {
    setCategoryFilter("all");
    setFromDate("");
    setToDate("");
  }

  function handleListScroll(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    setAtTop(el.scrollTop <= 1);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
  }

  const isScrollable = filtered.length > 6;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3 rounded-none border border-border bg-surface p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">{t("expenses.filterCategory")}</label>
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            ariaLabel={t("expenses.filterCategory")}
            triggerClassName={FIELD_TRIGGER_CLASSES}
            options={[
              { value: "all" as CategoryFilter, label: t("expenses.allCategories") },
              ...CATEGORIES.map((value) => ({
                value: value as CategoryFilter,
                label: t(`expenses.categories.${value}`),
              })),
            ]}
            renderTrigger={(selected) => (
              <>
                <span>{selected.label}</span>
                <ChevronIcon />
              </>
            )}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">{t("expenses.filterFrom")}</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">{t("expenses.filterTo")}</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-accent hover:underline"
          >
            {t("expenses.clearFilters")}
          </button>
        )}
      </div>

      <div className="relative">
        <div
          onScroll={isScrollable ? handleListScroll : undefined}
          className={`flex flex-col gap-2 ${
            isScrollable ? "themed-scroll max-h-[22rem] overflow-y-auto pr-2" : ""
          }`}
          {...(isScrollable
            ? {
                tabIndex: 0,
                role: "region",
                "aria-label": t("expenses.transactionListLabel"),
              }
            : {})}
        >
          {filtered.length === 0 ? (
            <p className="text-sm text-muted">{t("expenses.emptyTransactions")}</p>
          ) : (
            filtered.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          )}
        </div>

        {isScrollable && (
          <>
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-background to-transparent transition-opacity ${
                atTop ? "opacity-0" : "opacity-100"
              }`}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent transition-opacity ${
                atBottom ? "opacity-0" : "opacity-100"
              }`}
            />
          </>
        )}
      </div>
    </div>
  );
}
