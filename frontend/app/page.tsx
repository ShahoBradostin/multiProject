"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

const UPCOMING_PROJECT_NUMBERS = [1, 2];

function iconProps(className: string) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

function CodeIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M8 6 3 12l5 6" />
      <path d="m16 6 5 6-5 6" />
    </svg>
  );
}

function WindowIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9h18" />
    </svg>
  );
}

function ServerIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01" />
      <path d="M7 17h.01" />
    </svg>
  );
}

function DatabaseIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  );
}

function BlueprintIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="4" y="4" width="16" height="16" rx="1.5" strokeDasharray="3 3" />
      <path d="M12 9v6" />
      <path d="M9 12h6" />
    </svg>
  );
}

function SproutIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 21v-9" />
      <path d="M12 12C12 8 9 6 5 6c0 4 3 7 7 7" />
      <path d="M12 12c0-3 2.5-5 6-5 0 3.5-2.5 6-6 6" />
    </svg>
  );
}

const PILLAR_KEYS = [
  {
    heading: "home.pillarFrontendHeading",
    body: "home.pillarFrontendBody",
    Icon: WindowIcon,
  },
  {
    heading: "home.pillarBackendHeading",
    body: "home.pillarBackendBody",
    Icon: ServerIcon,
  },
  {
    heading: "home.pillarDatabaseHeading",
    body: "home.pillarDatabaseBody",
    Icon: DatabaseIcon,
  },
];

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();

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

          <FadeIn delayMs={200}>
            <Link
              href="/expenses"
              className="group relative block aspect-square overflow-hidden bg-surface"
            >
              <img
                src="/projects/expenses.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                <h2 className="font-serif text-lg text-white sm:text-xl">
                  {t("home.expensesTitle")}
                </h2>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-white/80 sm:text-sm">
                  {t("home.openExpenses")} <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </FadeIn>

          {UPCOMING_PROJECT_NUMBERS.map((n, index) => (
            <FadeIn key={n} delayMs={250 + index * 50}>
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
            <CodeIcon className="h-8 w-8 text-accent" />
            <h2 className="font-serif text-3xl text-foreground">
              {t("home.realSoftwareHeading")}
            </h2>
            <p className="text-muted">{t("home.realSoftwareBody")}</p>
          </div>
          <ImagePlaceholder className="aspect-[4/3] w-full flex-1" />
        </FadeIn>
      </section>

      <section className="w-full bg-background">
        <FadeIn className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-20 text-center sm:px-16">
          <h2 className="font-serif text-3xl text-foreground">
            {t("home.howItWorksHeading")}
          </h2>
          <div className="grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-3">
            {PILLAR_KEYS.map((item) => (
              <div key={item.heading} className="flex flex-col gap-2">
                <item.Icon className="h-7 w-7 text-accent" />
                <h3 className="font-serif text-xl text-foreground">
                  {t(item.heading)}
                </h3>
                <p className="text-sm text-muted">{t(item.body)}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <section className="w-full bg-accent/5">
        <FadeIn className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-20 text-left sm:px-16 md:flex-row">
          <ImagePlaceholder className="aspect-[4/3] w-full flex-1 md:order-first" />
          <div className="flex flex-1 flex-col gap-4">
            <BlueprintIcon className="h-8 w-8 text-accent" />
            <h2 className="font-serif text-3xl text-foreground">
              {t("home.moreProjectsHeading")}
            </h2>
            <p className="text-muted">{t("home.moreProjectsBody")}</p>
          </div>
        </FadeIn>
      </section>

      <section className="w-full bg-surface">
        <FadeIn className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-20 text-center sm:px-16">
          <SproutIcon className="h-8 w-8 text-accent" />
          <h2 className="font-serif text-3xl text-foreground">
            {t("home.stillTakingShapeHeading")}
          </h2>
          <p className="max-w-2xl text-muted">{t("home.stillTakingShapeBody")}</p>
          <ImagePlaceholder className="aspect-video w-full" />
        </FadeIn>
      </section>
    </div>
  );
}
