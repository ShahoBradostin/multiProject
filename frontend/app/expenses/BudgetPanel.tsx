"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CATEGORIES, type Budget, type Category, type Transaction } from "./types";

function startOfMonthISO() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const offset = first.getTimezoneOffset() * 60000;
  return new Date(first.getTime() - offset).toISOString().slice(0, 10);
}

function spentThisMonth(transactions: Transaction[], category: Category): number {
  const from = startOfMonthISO();
  return transactions
    .filter((tx) => tx.type === "expense" && tx.category === category && tx.date >= from)
    .reduce((sum, tx) => sum + tx.amount, 0);
}

export default function BudgetPanel({
  budgets,
  transactions,
  onSetBudget,
  onDeleteBudget,
}: {
  budgets: Budget[];
  transactions: Transaction[];
  onSetBudget: (category: Category, monthlyLimit: number) => void;
  onDeleteBudget: (category: Category) => void;
}) {
  const { t } = useLanguage();
  const [drafts, setDrafts] = useState<Partial<Record<Category, string>>>({});

  function handleSave(category: Category) {
    const raw = drafts[category];
    const parsed = Number(raw);
    if (!raw || !parsed || parsed <= 0) return;
    onSetBudget(category, parsed);
    setDrafts((d) => ({ ...d, [category]: "" }));
  }

  return (
    <div className="flex flex-col gap-4 rounded-none border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-foreground">{t("expenses.budgetsHeading")}</h2>
      <div className="flex flex-col gap-4">
        {CATEGORIES.map((category) => {
          const budget = budgets.find((b) => b.category === category);
          const spent = spentThisMonth(transactions, category);
          const limit = budget?.monthlyLimit ?? 0;
          const percent = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
          const overBudget = limit > 0 && spent > limit;

          return (
            <div key={category} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-foreground">{t(`expenses.categories.${category}`)}</span>
                {budget ? (
                  <span className={overBudget ? "text-xs text-status-todo" : "text-xs text-muted"}>
                    {spent.toFixed(2)} / {limit.toFixed(2)}
                    {overBudget && ` ${t("expenses.overBudget")}`}
                  </span>
                ) : (
                  <span className="text-xs text-muted">{t("expenses.noBudget")}</span>
                )}
              </div>
              {budget && (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
                  <div
                    className={`h-full rounded-full transition-all ${
                      overBudget ? "bg-status-todo" : "bg-accent"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={
                    budget ? budget.monthlyLimit.toFixed(2) : t("expenses.budgetPlaceholder")
                  }
                  value={drafts[category] ?? ""}
                  onChange={(e) =>
                    setDrafts((d) => ({ ...d, [category]: e.target.value }))
                  }
                  className="w-28 rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => handleSave(category)}
                  className="text-xs font-medium text-accent hover:underline"
                >
                  {t("expenses.setBudget")}
                </button>
                {budget && (
                  <button
                    type="button"
                    onClick={() => onDeleteBudget(category)}
                    className="text-xs font-medium text-muted transition-colors hover:text-red-500"
                  >
                    {t("expenses.removeBudget")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
