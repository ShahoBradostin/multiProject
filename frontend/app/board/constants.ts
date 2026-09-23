import type { ColumnId, Priority } from "./types";

export const COLUMN_IDS: ColumnId[] = ["todo", "in-progress", "done"];

export const COLUMN_ACCENTS: Record<ColumnId, string> = {
  todo: "bg-accent",
  "in-progress": "bg-amber-600",
  done: "bg-emerald-700",
};

export const PRIORITIES: Priority[] = ["low", "medium", "high"];

export const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-status-done/10 text-status-done",
  medium: "bg-status-progress/10 text-status-progress",
  high: "bg-status-todo/10 text-status-todo",
};
