import type { Language } from "@/lib/i18n/translations";

export type FoodDatabaseEntry = {
  number: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_KANBAN_API_URL ?? "http://localhost:8000";

// Backed by Livsmedelsverket's open food database (CC BY 4.0), ~2600 items
// in Swedish and English. See backend/scripts/fetch_food_database.py.
export async function searchFoodDatabase(
  query: string,
  lang: Language,
  signal?: AbortSignal,
): Promise<FoodDatabaseEntry[]> {
  const params = new URLSearchParams({ q: query, lang });
  const res = await fetch(`${API_BASE}/foods?${params}`, { signal });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
