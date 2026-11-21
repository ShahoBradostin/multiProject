"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Select from "@/components/Select";
import { CATEGORIES, type Category, type Transaction, type TransactionType } from "./types";

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

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

type Draft = {
  type: TransactionType;
  category: Category;
  description: string;
  amount: string;
  date: string;
};

function draftFromTransaction(transaction: Transaction): Draft {
  return {
    type: transaction.type,
    category: transaction.category,
    description: transaction.description,
    amount: String(transaction.amount),
    date: transaction.date,
  };
}

export default function TransactionRow({
  transaction,
  onUpdate,
  onDelete,
}: {
  transaction: Transaction;
  onUpdate: (
    id: string,
    updates: Partial<
      Pick<Transaction, "type" | "category" | "description" | "amount" | "date">
    >,
  ) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => draftFromTransaction(transaction));

  function startEditing() {
    setDraft(draftFromTransaction(transaction));
    setIsEditing(true);
  }

  function commit() {
    const parsedAmount = Number(draft.amount);
    if (!draft.description.trim() || !parsedAmount || parsedAmount <= 0) return;
    onUpdate(transaction.id, {
      type: draft.type,
      category: draft.category,
      description: draft.description.trim(),
      amount: parsedAmount,
      date: draft.date,
    });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 rounded-none border border-accent bg-background p-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={draft.type}
            onChange={(type: TransactionType) => setDraft((d) => ({ ...d, type }))}
            ariaLabel={t("expenses.typeAria")}
            triggerClassName={FIELD_TRIGGER_CLASSES}
            options={(["expense", "income"] as TransactionType[]).map((value) => ({
              value,
              label: t(`expenses.types.${value}`),
            }))}
            renderTrigger={(selected) => (
              <>
                <span>{selected.label}</span>
                <ChevronIcon />
              </>
            )}
          />
          <Select
            value={draft.category}
            onChange={(category: Category) => setDraft((d) => ({ ...d, category }))}
            ariaLabel={t("expenses.categoryAria")}
            triggerClassName={FIELD_TRIGGER_CLASSES}
            options={CATEGORIES.map((value) => ({
              value,
              label: t(`expenses.categories.${value}`),
            }))}
            renderTrigger={(selected) => (
              <>
                <span>{selected.label}</span>
                <ChevronIcon />
              </>
            )}
          />
        </div>
        <input
          type="text"
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={draft.amount}
            onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            type="date"
            value={draft.date}
            onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={commit}
            className="rounded-none bg-accent-button px-3 py-1.5 text-xs font-medium text-accent-button-foreground transition-colors hover:bg-accent-button-hover"
          >
            {t("expenses.save")}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-none border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {t("expenses.cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between gap-3 rounded-none border border-border bg-background px-3 py-2 text-sm shadow-sm">
      <div className="flex flex-1 flex-col items-start gap-0.5">
        <span className="text-foreground">{transaction.description}</span>
        <span className="text-xs text-muted">
          {transaction.date} · {t(`expenses.categories.${transaction.category}`)}
        </span>
      </div>
      <span
        className={`shrink-0 font-medium ${
          transaction.type === "income" ? "text-status-done" : "text-status-todo"
        }`}
      >
        {transaction.type === "income" ? "+" : "-"}
        {transaction.amount.toFixed(2)}
      </span>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
        <button
          type="button"
          onClick={startEditing}
          aria-label={t("expenses.editTransaction", { description: transaction.description })}
          className="flex h-6 w-6 items-center justify-center rounded-none text-muted transition-colors hover:bg-accent/10 hover:text-accent"
        >
          <EditIcon />
        </button>
        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          aria-label={t("expenses.deleteTransaction", { description: transaction.description })}
          className="flex h-6 w-6 items-center justify-center rounded-none text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
