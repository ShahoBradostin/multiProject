"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Card, ColumnId, Priority } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_KANBAN_API_URL ?? "http://localhost:8000";

export function useCards() {
  const { t } = useLanguage();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/cards`);
      if (!res.ok) throw new Error("Request failed");
      const data: Card[] = await res.json();
      setCards(data);
      setError(null);
    } catch {
      setError(t("board.backendError", { url: API_BASE }));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Fetching from the backend on mount is the external-sync case useEffect
  // exists for; loadCards' setState calls happen after the async request
  // resolves, not synchronously in this effect body.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCards();
  }, [loadCards]);

  async function addCard(
    columnId: ColumnId,
    title: string,
    priority: Priority,
  ) {
    try {
      const res = await fetch(`${API_BASE}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, columnId, priority }),
      });
      if (!res.ok) throw new Error("Request failed");
      const card: Card = await res.json();
      setCards((current) => [...current, card]);
    } catch {
      setError(t("board.addCardError"));
    }
  }

  async function updateCard(
    id: string,
    updates: Partial<Pick<Card, "title" | "columnId" | "priority">>,
  ) {
    const previous = cards;
    setCards((current) =>
      current.map((card) => (card.id === id ? { ...card, ...updates } : card)),
    );
    try {
      const res = await fetch(`${API_BASE}/cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Request failed");
    } catch {
      setCards(previous);
      setError(t("board.updateCardError"));
    }
  }

  function moveCard(id: string, columnId: ColumnId) {
    return updateCard(id, { columnId });
  }

  async function deleteCard(id: string) {
    const previous = cards;
    setCards((current) => current.filter((card) => card.id !== id));
    try {
      const res = await fetch(`${API_BASE}/cards/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Request failed");
    } catch {
      setCards(previous);
      setError(t("board.deleteCardError"));
    }
  }

  return { cards, loading, error, addCard, moveCard, updateCard, deleteCard };
}
