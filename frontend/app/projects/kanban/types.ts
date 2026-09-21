export type ColumnId = "todo" | "in-progress" | "done";

export type Card = {
  id: string;
  title: string;
  columnId: ColumnId;
};

export type Column = {
  id: ColumnId;
  title: string;
};
