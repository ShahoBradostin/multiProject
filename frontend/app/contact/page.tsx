"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-10 sm:px-16">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-none border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent hover:text-accent"
      >
        {t("common.backHome")}
      </Link>

      <FadeIn className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
          {t("contact.underConstructionHeading")}
        </h1>
        <p className="max-w-md text-muted">
          {t("contact.underConstructionBody")}
        </p>
      </FadeIn>
    </div>
  );
}
