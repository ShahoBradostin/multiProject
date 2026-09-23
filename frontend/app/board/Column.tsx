"use client";

import { useState, type DragEvent } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Card from "./Card";
import { COLUMN_ACCENTS } from "./constants";
import type { Card as CardType, ColumnId } from "./types";

export default function Column({
  columnId,
  cards,
  onDropCard,
  onUpdateCard,
  onDeleteCard,
}: {
  columnId: ColumnId;
  cards: CardType[];
  onDropCard: (id: string, columnId: ColumnId) => void;
  onUpdateCard: (
    id: string,
    updates: Partial<Pick<CardType, "title" | "columnId" | "priority">>,
  ) => void;
  onDeleteCard: (id: string) => void;
}) {
  const { t } = useLanguage();
  const [isOver, setIsOver] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsOver(false);
    const id = e.dataTransfer.getData("text/plain");
    if (id) onDropCard(id, columnId);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className={`flex w-full flex-col gap-3 rounded-2xl border p-4 transition-colors ${
        isOver ? "border-accent bg-accent/5" : "border-border bg-surface"
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${COLUMN_ACCENTS[columnId]}`}
          />
          <h2 className="text-sm font-semibold text-foreground">
            {t(`board.columns.${columnId}`)}
          </h2>
        </div>
        <span className="text-xs text-muted">{cards.length}</span>
      </div>

      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
          />
        ))}
      </div>
    </div>
  );
}
