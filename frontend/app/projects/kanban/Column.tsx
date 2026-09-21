"use client";

import { useState, type DragEvent, type FormEvent } from "react";
import Card from "./Card";
import type { Card as CardType, Column as ColumnType, ColumnId } from "./types";

const COLUMN_ACCENTS: Record<ColumnId, string> = {
  todo: "bg-indigo-500",
  "in-progress": "bg-amber-500",
  done: "bg-emerald-500",
};

export default function Column({
  column,
  cards,
  onDropCard,
  onAddCard,
  onDeleteCard,
}: {
  column: ColumnType;
  cards: CardType[];
  onDropCard: (id: string, columnId: ColumnType["id"]) => void;
  onAddCard: (columnId: ColumnType["id"], title: string) => void;
  onDeleteCard: (id: string) => void;
}) {
  const [isOver, setIsOver] = useState(false);
  const [title, setTitle] = useState("");

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsOver(false);
    const id = e.dataTransfer.getData("text/plain");
    if (id) onDropCard(id, column.id);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAddCard(column.id, title.trim());
    setTitle("");
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className={`flex w-full flex-col gap-3 rounded-2xl border p-4 transition-colors sm:w-72 ${
        isOver
          ? "border-indigo-400 bg-indigo-50/50 dark:border-indigo-600 dark:bg-indigo-500/5"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${COLUMN_ACCENTS[column.id]}`}
          />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {column.title}
          </h2>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {cards.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <Card key={card.id} card={card} onDelete={onDeleteCard} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a card"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Add
        </button>
      </form>
    </div>
  );
}
