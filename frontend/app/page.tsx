"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import FadeIn from "@/components/FadeIn";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// TODO: replace with the real address before shipping.
const CONTACT_EMAIL = "######";

const UPCOMING_PROJECT_NUMBERS = [1, 2, 3];

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const LOREM_LONG =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

const FEATURE_BLURBS = [
  {
    heading: "Consectetur Adipiscing",
    body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    heading: "Sed Do Eiusmod",
    body: "Curabitur pretium tincidunt lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit.",
  },
  {
    heading: "Ut Labore Dolore",
    body: "Sit amet mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor posuere praesent.",
  },
];

export default function Home() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(t("contact.subject", { name }));
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-16 px-6 pt-24 text-center sm:px-16">
        <FadeIn className="flex flex-col items-center gap-4">
          <h1 className="font-serif text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
            Shapo
          </h1>
          <p className="max-w-md text-lg text-muted">{t("home.tagline")}</p>
        </FadeIn>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-24 sm:px-10 lg:px-16">
        <FadeIn delayMs={100}>
          <Link
            href="/board"
            className="group flex flex-col rounded-2xl border border-border bg-surface px-6 py-5 text-left shadow-sm transition-all hover:border-accent hover:shadow-md sm:px-8"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl text-foreground transition-colors group-hover:text-accent">
                {t("home.kanbanTitle")}
              </h2>
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {t("home.featured")}
              </span>
            </div>
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="pt-2 text-sm text-muted">
                  {t("home.kanbanDescription")}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {t("home.openBoard")} <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </Link>
        </FadeIn>

        <FadeIn delayMs={150}>
          <Link
            href="/calories"
            className="group flex flex-col rounded-2xl border border-border bg-surface px-6 py-5 text-left shadow-sm transition-all hover:border-accent hover:shadow-md sm:px-8"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl text-foreground transition-colors group-hover:text-accent">
                {t("home.caloriesTitle")}
              </h2>
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {t("home.newTag")}
              </span>
            </div>
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="pt-2 text-sm text-muted">
                  {t("home.caloriesDescription")}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {t("home.openTracker")} <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </Link>
        </FadeIn>

        {UPCOMING_PROJECT_NUMBERS.map((n, index) => (
          <FadeIn key={n} delayMs={200 + index * 50}>
            <div className="group flex cursor-default flex-col rounded-2xl border border-border bg-surface px-6 py-5 text-left shadow-sm transition-all sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-2xl text-foreground">
                  {t("home.projectPlaceholder", { n })}
                </h2>
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted opacity-0 transition-opacity group-hover:opacity-100">
                  {t("home.comingSoon")}
                </span>
              </div>
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="pt-2 text-sm text-muted">
                    {t("home.placeholderDescription")}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <section className="w-full bg-surface">
        <FadeIn className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-20 text-left sm:px-16 md:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="font-serif text-3xl text-foreground">
              Lorem Ipsum Dolor Sit Amet
            </h2>
            <p className="text-muted">{LOREM_LONG}</p>
          </div>
          <ImagePlaceholder className="aspect-[4/3] w-full flex-1" />
        </FadeIn>
      </section>

      <section className="w-full bg-background">
        <FadeIn className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-20 text-center sm:px-16">
          <h2 className="font-serif text-3xl text-foreground">
            Consectetur Adipiscing Elit
          </h2>
          <div className="grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-3">
            {FEATURE_BLURBS.map((item) => (
              <div key={item.heading} className="flex flex-col gap-2">
                <h3 className="font-serif text-xl text-foreground">
                  {item.heading}
                </h3>
                <p className="text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <section className="w-full bg-accent/5">
        <FadeIn className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-20 text-left sm:px-16 md:flex-row">
          <ImagePlaceholder className="aspect-[4/3] w-full flex-1 md:order-first" />
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="font-serif text-3xl text-foreground">
              Sed Do Eiusmod Tempor
            </h2>
            <p className="text-muted">{LOREM_LONG}</p>
          </div>
        </FadeIn>
      </section>

      <section className="w-full bg-surface">
        <FadeIn className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-20 text-center sm:px-16">
          <h2 className="font-serif text-3xl text-foreground">
            Ut Enim Ad Minim Veniam
          </h2>
          <p className="max-w-2xl text-muted">{LOREM_SHORT}</p>
          <ImagePlaceholder className="aspect-video w-full" />
        </FadeIn>
      </section>

      <section id="contact" className="w-full scroll-mt-24 bg-background">
        <FadeIn className="mx-auto flex max-w-xl flex-col items-center gap-8 px-6 py-20 text-center sm:px-16">
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-3xl text-foreground">
              {t("contact.heading")}
            </h2>
            <p className="text-muted">{t("contact.description")}</p>
          </div>
          <form
            onSubmit={handleContactSubmit}
            className="flex w-full flex-col gap-3 text-left"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted">
                {t("contact.nameLabel")}
              </label>
              <input
                type="text"
                required
                placeholder={t("contact.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted">
                {t("contact.emailLabel")}
              </label>
              <input
                type="email"
                required
                placeholder={t("contact.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted">
                {t("contact.messageLabel")}
              </label>
              <textarea
                required
                rows={4}
                placeholder={t("contact.messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="mt-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              {t("contact.submit")}
            </button>
          </form>
        </FadeIn>
      </section>
    </div>
  );
}
