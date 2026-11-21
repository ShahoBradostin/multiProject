"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { apiFetch } from "@/lib/api";
import type { Budget, Category } from "./types";

export function useBudgets() {
  const { t } = useLanguage();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBudgets = useCallback(async () => {
    try {
      const res = await apiFetch("/budgets");
      if (!res.ok) throw new Error("Request failed");
      const data: Budget[] = await res.json();
      setBudgets(data);
      setError(null);
    } catch {
      setError(t("expenses.backendError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Fetching from the backend on mount is the external-sync case useEffect
  // exists for; loadBudgets' setState calls happen after the async request
  // resolves, not synchronously in this effect body.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBudgets();
  }, [loadBudgets]);

  async function setBudget(category: Category, monthlyLimit: number) {
    const previous = budgets;
    setBudgets((current) => [
      ...current.filter((b) => b.category !== category),
      { category, monthlyLimit },
    ]);
    try {
      const res = await apiFetch(`/budgets/${category}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyLimit }),
      });
      if (!res.ok) throw new Error("Request failed");
    } catch {
      setBudgets(previous);
      setError(t("expenses.setBudgetError"));
    }
  }

  async function deleteBudget(category: Category) {
    const previous = budgets;
    setBudgets((current) => current.filter((b) => b.category !== category));
    try {
      const res = await apiFetch(`/budgets/${category}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Request failed");
    } catch {
      setBudgets(previous);
      setError(t("expenses.deleteBudgetError"));
    }
  }

  return { budgets, loading, error, setBudget, deleteBudget };
}
