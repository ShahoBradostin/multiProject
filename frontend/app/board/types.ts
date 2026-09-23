export type ColumnId = "todo" | "in-progress" | "done";

export type Priority = "low" | "medium" | "high";

export type Card = {
  id: string;
  title: string;
  columnId: ColumnId;
  priority: Priority;
};
