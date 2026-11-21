export type TransactionType = "income" | "expense";

export type Category =
  | "food"
  | "rent"
  | "transport"
  | "utilities"
  | "subscriptions"
  | "entertainment"
  | "other";

export const CATEGORIES: Category[] = [
  "food",
  "rent",
  "transport",
  "utilities",
  "subscriptions",
  "entertainment",
  "other",
];

export type Transaction = {
  id: string;
  type: TransactionType;
  category: Category;
  description: string;
  amount: number;
  date: string;
};

export type Budget = {
  category: Category;
  monthlyLimit: number;
};
