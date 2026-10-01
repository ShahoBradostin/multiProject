import type { Language } from "@/lib/i18n/translations";
import { apiFetch } from "@/lib/api";

export type FoodDatabaseEntry = {
  number: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
};

// Backed by Livsmedelsverket's open food database (CC BY 4.0), ~2600 items
// in Swedish and English. See backend/scripts/fetch_food_database.py.
export async function searchFoodDatabase(
  query: string,
  lang: Language,
  signal?: AbortSignal,
): Promise<FoodDatabaseEntry[]> {
  const params = new URLSearchParams({ q: query, lang });
  const res = await apiFetch(`/foods?${params}`, { signal });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
