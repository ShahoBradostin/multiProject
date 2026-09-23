"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleContactClick(e: MouseEvent<HTMLAnchorElement>) {
    // If we're already on "/", the URL hash won't change on a repeat click
    // (e.g. after scrolling back up), so the browser never re-fires the
    // hash-scroll. Scroll manually instead of relying on that.
    if (window.location.pathname !== "/") return;
    e.preventDefault();
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="sticky top-0 z-10 flex justify-center px-4 pt-4">
      <header
        className={`flex w-full items-center justify-between rounded-full border border-border bg-background/80 shadow-sm backdrop-blur transition-all duration-300 ${
          isScrolled ? "max-w-2xl px-4 py-2" : "max-w-3xl px-6 py-3"
        }`}
      >
        <Link
          href="/"
          className="font-serif text-lg font-semibold text-foreground"
        >
          Shapo
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted">
          <Link
            href="/about"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-accent/10 hover:text-accent"
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/#contact"
            onClick={handleContactClick}
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-accent/10 hover:text-accent"
          >
            {t("nav.contact")}
          </Link>
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "sv" : "en")}
            aria-label={t("nav.switchLanguage")}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            {language === "en" ? "SV" : "EN"}
          </button>
          <Link
            href="/"
            className="rounded-full bg-accent px-4 py-1.5 text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {t("nav.home")}
          </Link>
        </nav>
      </header>
    </div>
  );
}
