"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import AddCardForm from "./AddCardForm";
import Column from "./Column";
import { COLUMN_IDS } from "./constants";
import { useCards } from "./useCards";

export default function BoardPage() {
  const { t } = useLanguage();
  const { cards, loading, error, addCard, moveCard, updateCard, deleteCard } =
    useCards();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10 lg:px-16">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent hover:text-accent"
      >
        {t("common.backHome")}
      </Link>

      <FadeIn className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
          {t("board.title")}
        </h1>
        <p className="text-sm text-muted">{t("board.description")}</p>
      </FadeIn>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">{t("board.loading")}</p>
      ) : (
        <FadeIn
          className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4"
          delayMs={100}
        >
          <AddCardForm onAddCard={addCard} />
          {COLUMN_IDS.map((columnId) => (
            <Column
              key={columnId}
              columnId={columnId}
              cards={cards.filter((card) => card.columnId === columnId)}
              onDropCard={moveCard}
              onUpdateCard={updateCard}
              onDeleteCard={deleteCard}
            />
          ))}
        </FadeIn>
      )}
    </div>
  );
}
