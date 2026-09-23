"use client";

import { useState, type DragEvent, type KeyboardEvent } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { PRIORITIES, PRIORITY_STYLES } from "./constants";
import Select from "./Select";
import type { Card as CardType, Priority } from "./types";

export default function Card({
  card,
  onUpdate,
  onDelete,
}: {
  card: CardType;
  onUpdate: (
    id: string,
    updates: Partial<Pick<CardType, "title" | "priority">>,
  ) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useLanguage();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(card.title);

  function handleDragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", card.id);
    e.dataTransfer.effectAllowed = "move";
  }

  function startEditing() {
    setDraftTitle(card.title);
    setIsEditingTitle(true);
  }

  function commitTitle() {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== card.title) {
      onUpdate(card.id, { title: trimmed });
    }
    setIsEditingTitle(false);
  }

  function handleTitleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTitle();
    } else if (e.key === "Escape") {
      setDraftTitle(card.title);
      setIsEditingTitle(false);
    }
  }

  return (
    <div
      draggable={!isEditingTitle}
      onDragStart={handleDragStart}
      className="group flex cursor-grab items-start justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm active:cursor-grabbing"
    >
      <div className="flex flex-1 flex-col items-start gap-1.5">
        {isEditingTitle ? (
          <input
            type="text"
            value={draftTitle}
            autoFocus
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={handleTitleKeyDown}
            className="w-full rounded border border-accent bg-background px-1 py-0.5 text-sm text-foreground outline-none"
          />
        ) : (
          <div className="max-h-48 w-full overflow-y-auto">
            <span
              onClick={startEditing}
              className="cursor-text break-words text-foreground"
              title={t("board.clickToEdit")}
            >
              {card.title}
            </span>
          </div>
        )}

        <Select
          value={card.priority}
          onChange={(priority: Priority) => onUpdate(card.id, { priority })}
          ariaLabel={t("board.priorityAria")}
          triggerClassName={`cursor-pointer whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${PRIORITY_STYLES[card.priority]}`}
          options={PRIORITIES.map((p) => ({
            value: p,
            label: t(`board.priorities.${p}`),
          }))}
          renderTrigger={(selected) => selected.label}
        />
      </div>
      <button
        type="button"
        onClick={() => onDelete(card.id)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
        aria-label={t("board.deleteCard", { title: card.title })}
      >
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
      </button>
    </div>
  );
}
