"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { FOOD_DATABASE, type FoodDatabaseEntry } from "./foodDatabase";

export default function FoodSearch({
  onSelect,
}: {
  onSelect: (food: FoodDatabaseEntry) => void;
}) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FOOD_DATABASE;
    return FOOD_DATABASE.filter((food) => food.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-foreground">
        {t("foodSearch.heading")}
      </h2>
      <input
        type="text"
        placeholder={t("foodSearch.placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <p className="text-xs text-muted">{t("foodSearch.helper")}</p>
      <div className="flex max-h-[28rem] flex-col gap-2 overflow-y-auto">
        {results.length === 0 ? (
          <p className="text-sm text-muted">{t("foodSearch.noMatches")}</p>
        ) : (
          results.map((food) => (
            <button
              key={food.name}
              type="button"
              onClick={() => onSelect(food)}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm shadow-sm transition-colors hover:border-accent"
            >
              <span className="text-foreground">{food.name}</span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-muted">
                <span>
                  {food.calories} {t("foodSearch.calSuffix")}
                </span>
                <span>
                  {food.protein}
                  {t("foodSearch.proteinSuffix")}
                </span>
                <span>
                  {food.carbs}
                  {t("foodSearch.carbsSuffix")}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
