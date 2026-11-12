"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Only the home page has a full-bleed dark hero behind the nav, so only
  // there does it make sense to start transparent-on-white and switch to the
  // solid bar once you scroll past it.
  const isTransparent = pathname === "/" && !isScrolled;

  // Keep the auth pages focused on the form: just the logo, no nav links or
  // auth buttons, until the user actually lands back on a real page.
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Don't let the mobile menu stay open behind the next page after a link
  // inside it is followed. Adjusted during render (React's recommended
  // pattern for resetting state on a prop change) rather than in an effect,
  // so it can't cause an extra render pass.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMobileMenuOpen(false);
  }

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

  const linkColor = isTransparent
    ? "text-white/80 hover:text-white"
    : "text-muted hover:text-accent";
  const langButtonColor = isTransparent
    ? "border-white/30 text-white/80 hover:border-white hover:bg-white/10 hover:text-white"
    : "border-border text-muted hover:border-accent hover:bg-accent/10 hover:text-accent";
  const menuButtonColor = isTransparent ? "text-white" : "text-foreground";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isTransparent ? "bg-transparent" : "bg-background/60 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link
          href="/"
          className={`font-serif text-xl font-semibold transition-colors ${
            isTransparent ? "text-white" : "text-foreground"
          }`}
        >
          Shapo
        </Link>

        {!isAuthPage && (
          <>
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
                href="/contact"
                className={`transition-colors ${linkColor} ${
                  pathname === "/contact" ? "underline underline-offset-4" : ""
                }`}
              >
                {t("nav.contact")}
              </Link>
            </nav>

            <div className="hidden items-center gap-4 text-sm font-medium sm:flex">
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
                    className={`transition-colors ${linkColor}`}
                  >
                    {t("nav.logout")}
                  </button>
                ) : (
                  <>
                    <Link href="/login" className={`transition-colors ${linkColor}`}>
                      {t("nav.login")}
                    </Link>
                    <Link
                      href="/register"
                      className={`transition-colors ${linkColor}`}
                    >
                      {t("nav.register")}
                    </Link>
                  </>
                ))}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={t(mobileMenuOpen ? "nav.closeMenu" : "nav.openMenu")}
              aria-expanded={mobileMenuOpen}
              className={`flex h-9 w-9 items-center justify-center transition-colors sm:hidden ${menuButtonColor}`}
            >
              <div className="flex h-4 w-5 flex-col justify-between">
                <span
                  className={`h-0.5 w-full origin-center rounded-full bg-current transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full rounded-full bg-current transition-opacity duration-200 ease-in-out ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`h-0.5 w-full origin-center rounded-full bg-current transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </>
        )}
      </div>

      {!isAuthPage && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out sm:hidden ${
            mobileMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <nav
            className={`flex flex-col gap-1 overflow-hidden border-t border-border bg-background px-6 py-4 text-sm font-medium transition-opacity duration-300 ease-in-out ${
              mobileMenuOpen ? "opacity-100 delay-75" : "opacity-0"
            }`}
          >
            <Link
              href="/about"
              className={`rounded-lg px-3 py-2 transition-colors hover:bg-surface ${
                pathname === "/about" ? "text-accent" : "text-foreground"
              }`}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/contact"
              className={`rounded-lg px-3 py-2 transition-colors hover:bg-surface ${
                pathname === "/contact" ? "text-accent" : "text-foreground"
              }`}
            >
              {t("nav.contact")}
            </Link>
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "sv" : "en")}
              className="rounded-lg px-3 py-2 text-left text-foreground transition-colors hover:bg-surface"
            >
              {t("nav.switchLanguage")} ({language === "en" ? "EN" : "SV"})
            </button>
            {!loading &&
              (user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-foreground transition-colors hover:bg-surface"
                >
                  {t("nav.logout")}
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-surface"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-surface"
                  >
                    {t("nav.register")}
                  </Link>
                </>
              ))}
          </nav>
        </div>
      )}
    </header>
  );
}
