import type { Language } from "@/lib/i18n/translations";
import { apiFetch } from "@/lib/api";

export type FoodDatabaseEntry = {
  number: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
};

// The reference data only changes when someone reruns
// backend/scripts/load_food_database.py, so a day-long cache is safe.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
// Comfortably above the ~2600 real rows, so one request fetches everything.
const ALL_ITEMS_LIMIT = 5000;

type CacheEntry = {
  cachedAt: number;
  foods: FoodDatabaseEntry[];
};

function cacheKey(lang: Language) {
  return `foodDatabase:${lang}`;
}

function readCache(lang: Language): FoodDatabaseEntry[] | null {
  try {
    const raw = localStorage.getItem(cacheKey(lang));
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return null;
    return entry.foods;
  } catch {
    return null;
  }
}

function writeCache(lang: Language, foods: FoodDatabaseEntry[]) {
  try {
    const entry: CacheEntry = { cachedAt: Date.now(), foods };
    localStorage.setItem(cacheKey(lang), JSON.stringify(entry));
  } catch {
    // Storage full or unavailable (private browsing) - caching is just an
    // optimization, fine to skip it.
  }
}

// Backed by Livsmedelsverket's open food database (CC BY 4.0), ~2600 items
// in Swedish and English. See backend/scripts/fetch_food_database.py.
//
// Fetched once per language and cached in localStorage so a page reload, or
// typing a new search term, filters the cached list locally instead of
// calling the backend again.
export async function getFoodDatabase(
  lang: Language,
): Promise<FoodDatabaseEntry[]> {
  const cached = readCache(lang);
  if (cached) return cached;

  const params = new URLSearchParams({
    q: "",
    lang,
    limit: String(ALL_ITEMS_LIMIT),
  });
  const res = await apiFetch(`/foods?${params}`);
  if (!res.ok) throw new Error("Request failed");
  const foods: FoodDatabaseEntry[] = await res.json();
  writeCache(lang, foods);
  return foods;
}
