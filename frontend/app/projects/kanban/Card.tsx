"use client";

import type { DragEvent } from "react";
import type { Card as CardType } from "./types";

export default function Card({
  card,
  onDelete,
}: {
  card: CardType;
  onDelete: (id: string) => void;
}) {
  function handleDragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", card.id);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group flex cursor-grab items-start justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-950"
    >
      <span className="text-zinc-800 dark:text-zinc-100">{card.title}</span>
      <button
        type="button"
        onClick={() => onDelete(card.id)}
        className="text-xs text-zinc-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
        aria-label={`Delete ${card.title}`}
      >
        ✕
      </button>
    </div>
  );
}
