"use client";

import Link from "next/link";
import { useMemo } from "react";
import FadeIn from "@/components/FadeIn";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import BudgetPanel from "./BudgetPanel";
import SpendingCharts from "./SpendingCharts";
import { useTransactions } from "./useTransactions";
import { useBudgets } from "./useBudgets";
import type { Transaction } from "./types";

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function startOfWeekISO() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  const offset = monday.getTimezoneOffset() * 60000;
  return new Date(monday.getTime() - offset).toISOString().slice(0, 10);
}

function startOfMonthISO() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const offset = first.getTimezoneOffset() * 60000;
  return new Date(first.getTime() - offset).toISOString().slice(0, 10);
}

function sumsSince(transactions: Transaction[], fromISO: string) {
  return transactions.reduce(
    (acc, tx) => {
      if (tx.date < fromISO) return acc;
      if (tx.type === "income") acc.income += tx.amount;
      else acc.expense += tx.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );
}

export default function ExpensesPage() {
  const { t } = useLanguage();
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();
  const { budgets, setBudget, deleteBudget } = useBudgets();

  const periods = useMemo(
    () => [
      { key: "today", label: t("expenses.periodToday"), from: todayISO() },
      { key: "week", label: t("expenses.periodWeek"), from: startOfWeekISO() },
      { key: "month", label: t("expenses.periodMonth"), from: startOfMonthISO() },
    ],
    [t],
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10 lg:px-16">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-none border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent hover:text-accent"
      >
        {t("common.backHome")}
      </Link>

      <FadeIn className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
          {t("expenses.title")}
        </h1>
        <p className="text-sm text-muted">{t("expenses.description")}</p>
      </FadeIn>

      {transactionsError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {transactionsError}
        </div>
      )}

      {transactionsLoading ? (
        <p className="text-sm text-muted">{t("expenses.loading")}</p>
      ) : (
        <>
          <FadeIn delayMs={100} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {periods.map(({ key, label, from }) => {
              const { income, expense } = sumsSince(transactions, from);
              const net = income - expense;
              return (
                <div
                  key={key}
                  className="flex flex-col gap-3 rounded-none border border-border bg-surface p-6"
                >
                  <span className="text-sm font-semibold uppercase tracking-wide text-muted">
                    {label}
                  </span>
                  <span
                    className={`text-4xl font-semibold ${
                      net >= 0 ? "text-status-done" : "text-status-todo"
                    }`}
                  >
                    {net >= 0 ? "+" : ""}
                    {net.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted">
                    {t("expenses.incomeShort")} {income.toFixed(2)} ·{" "}
                    {t("expenses.expenseShort")} {expense.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </FadeIn>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
            <div className="flex flex-col gap-8">
              <FadeIn delayMs={150}>
                <TransactionForm onAdd={addTransaction} />
              </FadeIn>
              <FadeIn delayMs={200}>
                <TransactionList
                  transactions={transactions}
                  onUpdate={updateTransaction}
                  onDelete={deleteTransaction}
                />
              </FadeIn>
            </div>

            <FadeIn delayMs={150}>
              <SpendingCharts transactions={transactions} />
            </FadeIn>

            <FadeIn delayMs={200}>
              <BudgetPanel
                budgets={budgets}
                transactions={transactions}
                onSetBudget={setBudget}
                onDeleteBudget={deleteBudget}
              />
            </FadeIn>
          </div>
        </>
      )}
    </div>
  );
}
