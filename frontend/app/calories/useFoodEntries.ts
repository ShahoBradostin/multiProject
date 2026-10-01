"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { apiFetch, API_BASE } from "@/lib/api";
import type { FoodEntry } from "./types";

export function useFoodEntries() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    try {
      const res = await apiFetch("/food-entries");
      if (!res.ok) throw new Error("Request failed");
      const data: FoodEntry[] = await res.json();
      setEntries(data);
      setError(null);
    } catch {
      setError(t("calories.backendError", { url: API_BASE }));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Fetching from the backend on mount is the external-sync case useEffect
  // exists for; loadEntries' setState calls happen after the async request
  // resolves, not synchronously in this effect body.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEntries();
  }, [loadEntries]);

  async function addEntry(
    entry: Pick<FoodEntry, "name" | "calories" | "protein" | "carbs">,
  ) {
    try {
      const res = await apiFetch("/food-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error("Request failed");
      const created: FoodEntry = await res.json();
      setEntries((current) => [...current, created]);
    } catch {
      setError(t("calories.addEntryError"));
    }
  }

  async function deleteEntry(id: string) {
    const previous = entries;
    setEntries((current) => current.filter((entry) => entry.id !== id));
    try {
      const res = await apiFetch(`/food-entries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Request failed");
    } catch {
      setEntries(previous);
      setError(t("calories.deleteEntryError"));
    }
  }

  return { entries, loading, error, addEntry, deleteEntry };
}
