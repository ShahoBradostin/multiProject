"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Only the home page has a full-bleed dark hero behind the nav, so only
  // there does it make sense to start transparent-on-white and switch to the
  // solid bar once you scroll past it.
  const isTransparent = pathname === "/" && !isScrolled;

  async function handleLogout() {
    await logout();
    router.push("/");
  }

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

  const linkColor = isTransparent
    ? "text-white/80 hover:text-white"
    : "text-muted hover:text-accent";
  const langButtonColor = isTransparent
    ? "border-white/30 text-white/80 hover:border-white hover:bg-white/10 hover:text-white"
    : "border-border text-muted hover:border-accent hover:bg-accent/10 hover:text-accent";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-background/60 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link
          href="/"
          className={`font-serif text-xl font-semibold transition-colors ${
            isTransparent ? "text-white" : "text-foreground"
          }`}
        >
          Shapo
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <Link
            href="/about"
            className={`transition-colors ${linkColor} ${
              pathname === "/about" ? "underline underline-offset-4" : ""
            }`}
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/#contact"
            onClick={handleContactClick}
            className={`transition-colors ${linkColor}`}
          >
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-sm font-medium">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "sv" : "en")}
            aria-label={t("nav.switchLanguage")}
            className={`rounded-none border px-3 py-1 text-xs font-semibold transition-colors ${langButtonColor}`}
          >
            {language === "en" ? "SV" : "EN"}
          </button>
          {!loading &&
            (user ? (
              <button
                type="button"
                onClick={handleLogout}
                className={`hidden transition-colors sm:inline ${linkColor}`}
              >
                {t("nav.logout")}
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hidden transition-colors sm:inline ${linkColor}`}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className={`hidden transition-colors sm:inline ${linkColor}`}
                >
                  {t("nav.register")}
                </Link>
              </>
            ))}
          <Link
            href="/"
            className="rounded-none bg-accent-button px-4 py-1.5 text-accent-button-foreground transition-colors hover:bg-accent-button-hover"
          >
            {t("nav.home")}
          </Link>
        </div>
      </div>
    </header>
  );
}
