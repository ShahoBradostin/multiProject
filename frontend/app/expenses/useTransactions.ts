"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { apiFetch } from "@/lib/api";
import type { Transaction } from "./types";

export function useTransactions() {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    try {
      const res = await apiFetch("/transactions");
      if (!res.ok) throw new Error("Request failed");
      const data: Transaction[] = await res.json();
      setTransactions(data);
      setError(null);
    } catch {
      setError(t("expenses.backendError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Fetching from the backend on mount is the external-sync case useEffect
  // exists for; loadTransactions' setState calls happen after the async
  // request resolves, not synchronously in this effect body.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTransactions();
  }, [loadTransactions]);

  async function addTransaction(
    transaction: Pick<
      Transaction,
      "type" | "category" | "description" | "amount" | "date"
    >,
  ) {
    try {
      const res = await apiFetch("/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
      if (!res.ok) throw new Error("Request failed");
      const created: Transaction = await res.json();
      setTransactions((current) => [created, ...current]);
    } catch {
      setError(t("expenses.addTransactionError"));
    }
  }

  async function updateTransaction(
    id: string,
    updates: Partial<
      Pick<Transaction, "type" | "category" | "description" | "amount" | "date">
    >,
  ) {
    const previous = transactions;
    setTransactions((current) =>
      current.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx)),
    );
    try {
      const res = await apiFetch(`/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Request failed");
    } catch {
      setTransactions(previous);
      setError(t("expenses.updateTransactionError"));
    }
  }

  async function deleteTransaction(id: string) {
    const previous = transactions;
    setTransactions((current) => current.filter((tx) => tx.id !== id));
    try {
      const res = await apiFetch(`/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Request failed");
    } catch {
      setTransactions(previous);
      setError(t("expenses.deleteTransactionError"));
    }
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
