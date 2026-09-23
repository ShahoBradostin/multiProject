"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:px-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
            <span className="font-serif text-lg font-semibold text-foreground">
              Shapo
            </span>
            <p className="text-sm text-muted">{t("footer.tagline")}</p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t("footer.navHeading")}
            </span>
            <Link
              href="/about"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/#contact"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {t("nav.contact")}
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t("footer.projectsHeading")}
            </span>
            <Link
              href="/board"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {t("home.kanbanTitle")}
            </Link>
            <Link
              href="/calories"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {t("home.caloriesTitle")}
            </Link>
            <span
              className="cursor-default text-sm text-muted opacity-70"
              title="Placeholder"
            >
              {t("footer.moreComingSoon")}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t("footer.socialHeading")}
            </span>
            <span
              className="cursor-default text-sm text-muted opacity-70"
              title="Placeholder link"
            >
              GitHub
            </span>
            <span
              className="cursor-default text-sm text-muted opacity-70"
              title="Placeholder link"
            >
              LinkedIn
            </span>
            <span
              className="cursor-default text-sm text-muted opacity-70"
              title="Placeholder link"
            >
              {t("footer.email")}
            </span>
          </div>
        </div>

        <p className="border-t border-border pt-6 text-sm text-muted">
          &copy; {new Date().getFullYear()} Shapo. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
