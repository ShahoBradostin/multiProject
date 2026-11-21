"use client";

import { useState, type FormEvent } from "react";
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

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function TransactionForm({
  onAdd,
}: {
  onAdd: (
    transaction: Pick<Transaction, "type" | "category" | "description" | "amount" | "date">,
  ) => void;
}) {
  const { t } = useLanguage();
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<Category>("food");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!description.trim() || !parsedAmount || parsedAmount <= 0) return;
    onAdd({ type, category, description: description.trim(), amount: parsedAmount, date });
    setDescription("");
    setAmount("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-none border border-border bg-surface p-4"
    >
      <h2 className="text-sm font-semibold text-foreground">
        {t("expenses.newTransactionHeading")}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <Select
          value={type}
          onChange={setType}
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
          value={category}
          onChange={setCategory}
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
        placeholder={t("expenses.descriptionPlaceholder")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder={t("expenses.amountPlaceholder")}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        className="rounded-none bg-accent-button px-3 py-2 text-sm font-medium text-accent-button-foreground transition-colors hover:bg-accent-button-hover"
      >
        {t("expenses.addTransaction")}
      </button>
    </form>
  );
}
