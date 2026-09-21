"use client";

import Column from "./Column";
import { COLUMNS } from "./constants";
import { useCards } from "./useCards";

export default function KanbanPage() {
  const { cards, loading, error, addCard, moveCard, deleteCard } =
    useCards();

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Kanban Board
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Drag cards between columns. Stored on the backend as a CSV file.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading board…
        </p>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={cards.filter((card) => card.columnId === column.id)}
              onDropCard={moveCard}
              onAddCard={addCard}
              onDeleteCard={deleteCard}
            />
          ))}
        </div>
      )}
    </div>
  );
}
