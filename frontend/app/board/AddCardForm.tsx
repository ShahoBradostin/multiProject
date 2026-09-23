"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Select from "./Select";
import { COLUMN_IDS, PRIORITIES } from "./constants";
import type { ColumnId, Priority } from "./types";

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

export default function AddCardForm({
  onAddCard,
}: {
  onAddCard: (columnId: ColumnId, title: string, priority: Priority) => void;
}) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [columnId, setColumnId] = useState<ColumnId>(COLUMN_IDS[0]);
  const [priority, setPriority] = useState<Priority>("medium");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAddCard(columnId, title.trim(), priority);
    setTitle("");
    setPriority("medium");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-surface p-4"
    >
      <h2 className="text-sm font-semibold text-foreground">
        {t("board.newCardHeading")}
      </h2>
      <input
        type="text"
        placeholder={t("board.cardTitlePlaceholder")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <Select
        value={columnId}
        onChange={setColumnId}
        ariaLabel={t("board.columnAria")}
        triggerClassName={FIELD_TRIGGER_CLASSES}
        options={COLUMN_IDS.map((id) => ({
          value: id,
          label: t(`board.columns.${id}`),
        }))}
        renderTrigger={(selected) => (
          <>
            <span>{selected.label}</span>
            <ChevronIcon />
          </>
        )}
      />
      <Select
        value={priority}
        onChange={setPriority}
        ariaLabel={t("board.priorityAria")}
        triggerClassName={FIELD_TRIGGER_CLASSES}
        options={PRIORITIES.map((p) => ({
          value: p,
          label: t(`board.priorities.${p}`),
        }))}
        renderTrigger={(selected) => (
          <>
            <span>{selected.label}</span>
            <ChevronIcon />
          </>
        )}
      />
      <button
        type="submit"
        className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        {t("board.addCard")}
      </button>
    </form>
  );
}
