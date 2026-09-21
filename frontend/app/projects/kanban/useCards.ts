"use client";

import { useCallback, useEffect, useState } from "react";
import type { Card, ColumnId } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_KANBAN_API_URL ?? "http://localhost:8000";

export function useCards() {
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
      setError(
        "Could not reach the backend. Make sure it's running at " +
          API_BASE,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetching from the backend on mount is the external-sync case useEffect
  // exists for; loadCards' setState calls happen after the async request
  // resolves, not synchronously in this effect body.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCards();
  }, [loadCards]);

  async function addCard(columnId: ColumnId, title: string) {
    try {
      const res = await fetch(`${API_BASE}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, columnId }),
      });
      if (!res.ok) throw new Error("Request failed");
      const card: Card = await res.json();
      setCards((current) => [...current, card]);
    } catch {
      setError("Couldn't add the card. Is the backend running?");
    }
  }

  async function moveCard(id: string, columnId: ColumnId) {
    const previous = cards;
    setCards((current) =>
      current.map((card) => (card.id === id ? { ...card, columnId } : card)),
    );
    try {
      const res = await fetch(`${API_BASE}/cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId }),
      });
      if (!res.ok) throw new Error("Request failed");
    } catch {
      setCards(previous);
      setError("Couldn't move the card. Is the backend running?");
    }
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
      setError("Couldn't delete the card. Is the backend running?");
    }
  }

  return { cards, loading, error, addCard, moveCard, deleteCard };
}
