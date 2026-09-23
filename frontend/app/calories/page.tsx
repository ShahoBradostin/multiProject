"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import FadeIn from "@/components/FadeIn";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import FoodSearch from "./FoodSearch";
import type { FoodDatabaseEntry } from "./foodDatabase";
import { useFoodEntries } from "./useFoodEntries";

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function CaloriesPage() {
  const { t } = useLanguage();
  const { entries, loading, error, addEntry, deleteEntry } = useFoodEntries();
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");

  const todaysEntries = entries.filter((entry) => entry.date === todayISO());
  const totals = todaysEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
    }),
    { calories: 0, protein: 0, carbs: 0 },
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !calories) return;
    addEntry({
      name: name.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
    });
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
  }

  function handleSelectFood(food: FoodDatabaseEntry) {
    setName(food.name);
    setCalories(String(food.calories));
    setProtein(String(food.protein));
    setCarbs(String(food.carbs));
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10 lg:px-16">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent hover:text-accent"
      >
        {t("common.backHome")}
      </Link>

      <FadeIn className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
          {t("calories.title")}
        </h1>
        <p className="text-sm text-muted">{t("calories.description")}</p>
      </FadeIn>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">{t("calories.loading")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-8">
            <FadeIn
              delayMs={100}
              className="grid grid-cols-3 gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-semibold text-foreground">
                  {totals.calories}
                </span>
                <span className="text-xs uppercase tracking-wide text-muted">
                  {t("calories.totalsCalories")}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-semibold text-foreground">
                  {totals.protein}g
                </span>
                <span className="text-xs uppercase tracking-wide text-muted">
                  {t("calories.totalsProtein")}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-semibold text-foreground">
                  {totals.carbs}g
                </span>
                <span className="text-xs uppercase tracking-wide text-muted">
                  {t("calories.totalsCarbs")}
                </span>
              </div>
            </FadeIn>

            <FadeIn delayMs={150}>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-end sm:flex-wrap"
              >
                <div className="flex flex-1 flex-col gap-1 sm:min-w-[10rem]">
                  <label className="text-xs text-muted">
                    {t("calories.formNameLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("calories.formNamePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:w-28">
                  <label className="text-xs text-muted">
                    {t("calories.formCaloriesLabel")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:w-28">
                  <label className="text-xs text-muted">
                    {t("calories.formProteinLabel")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:w-28">
                  <label className="text-xs text-muted">
                    {t("calories.formCarbsLabel")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
                >
                  {t("calories.addButton")}
                </button>
              </form>
            </FadeIn>

            <FadeIn delayMs={200} className="flex flex-col gap-2">
              {todaysEntries.length === 0 ? (
                <p className="text-sm text-muted">{t("calories.emptyToday")}</p>
              ) : (
                todaysEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm"
                  >
                    <span className="text-foreground">{entry.name}</span>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span>
                        {entry.calories} {t("calories.calSuffix")}
                      </span>
                      <span>
                        {entry.protein}
                        {t("calories.proteinSuffix")}
                      </span>
                      <span>
                        {entry.carbs}
                        {t("calories.carbsSuffix")}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteEntry(entry.id)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted transition-all hover:bg-red-500/10 hover:text-red-500"
                        aria-label={t("calories.deleteEntry", {
                          name: entry.name,
                        })}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                        >
                          <path d="M18 6 6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </FadeIn>
          </div>

          <FadeIn delayMs={150}>
            <FoodSearch onSelect={handleSelectFood} />
          </FadeIn>
        </div>
      )}
    </div>
  );
}
