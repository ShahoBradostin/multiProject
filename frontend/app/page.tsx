"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import FadeIn from "@/components/FadeIn";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

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
  const { user } = useAuth();
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
      <section className="relative -mt-20 flex min-h-screen w-full items-end overflow-hidden bg-foreground">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/hero-background.mp4"
          poster="/video/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        <FadeIn className="relative z-10 flex w-full flex-col gap-8 px-6 pb-16 sm:px-10 lg:px-16">
          <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t("home.welcomeHeading", { username: user?.username ?? "" })}
          </h1>
          <div className="h-px w-full bg-white/20" />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-lg text-base text-white/70 sm:text-lg">
              {t("home.heroSubheading")}
            </p>
            <a
              href="#projects"
              className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-none bg-accent-button px-6 py-3 text-sm font-medium text-accent-button-foreground transition-colors hover:bg-accent-button-hover"
            >
              {t("home.heroCta")}
              <span
                aria-hidden
                className="transition-transform group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </a>
          </div>
        </FadeIn>
      </section>

      <div
        id="projects"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-16"
      >
        <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3">
          <FadeIn delayMs={100}>
            <Link
              href="/board"
              className="group relative block aspect-square overflow-hidden bg-surface"
            >
              <img
                src="/projects/kanban.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                <h2 className="font-serif text-lg text-white sm:text-xl">
                  {t("home.kanbanTitle")}
                </h2>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-white/80 sm:text-sm">
                  {t("home.openBoard")} <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </FadeIn>

          <FadeIn delayMs={150}>
            <Link
              href="/calories"
              className="group relative block aspect-square overflow-hidden bg-surface"
            >
              <img
                src="/projects/calories.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                <h2 className="font-serif text-lg text-white sm:text-xl">
                  {t("home.caloriesTitle")}
                </h2>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-white/80 sm:text-sm">
                  {t("home.openTracker")} <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </FadeIn>

          {UPCOMING_PROJECT_NUMBERS.map((n, index) => (
            <FadeIn key={n} delayMs={200 + index * 50}>
              <div className="group relative flex aspect-square cursor-default flex-col justify-end overflow-hidden border border-border bg-surface p-4 sm:p-5">
                <ImagePlaceholder
                  className="absolute inset-0 border-none uppercase tracking-wide"
                  label={t("home.comingSoon")}
                />
                <div className="relative">
                  <h2 className="font-serif text-lg text-foreground sm:text-xl">
                    {t("home.projectPlaceholder", { n })}
                  </h2>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
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
              className="mt-2 rounded-none bg-accent-button px-4 py-2 text-sm font-medium text-accent-button-foreground transition-colors hover:bg-accent-button-hover"
            >
              {t("contact.submit")}
            </button>
          </form>
        </FadeIn>
      </section>
    </div>
  );
}
