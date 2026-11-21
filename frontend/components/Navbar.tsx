"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

const PROJECTS: { href: string; labelKey: string }[] = [
  { href: "/board", labelKey: "home.kanbanTitle" },
  { href: "/calories", labelKey: "home.caloriesTitle" },
  { href: "/expenses", labelKey: "home.expensesTitle" },
];

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3.5 w-3.5 ${className}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);
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
  const isProjectPath = PROJECTS.some((p) => p.href === pathname);

  // Don't let the mobile menu or the projects dropdown stay open behind the
  // next page after a link inside them is followed. Adjusted during render
  // (React's recommended pattern for resetting state on a prop change)
  // rather than in an effect, so it can't cause an extra render pass.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMobileMenuOpen(false);
    setProjectsOpen(false);
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

  useEffect(() => {
    if (!projectsOpen) return;

    function handlePointerDown(e: MouseEvent) {
      if (
        projectsRef.current &&
        !projectsRef.current.contains(e.target as Node)
      ) {
        setProjectsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setProjectsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [projectsOpen]);

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
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-px origin-center scale-x-0 bg-white/60 transition-transform duration-300 ease-out ${
          isScrolled ? "scale-x-100" : ""
        }`}
      />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Shapo"
            width={1305}
            height={335}
            unoptimized
            priority
            className="h-8 w-auto"
          />
        </Link>

        {!isAuthPage && (
          <>
            <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
              <div ref={projectsRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProjectsOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={projectsOpen}
                  className={`flex items-center gap-1 transition-colors ${linkColor} ${
                    isProjectPath ? "underline underline-offset-4" : ""
                  }`}
                >
                  {t("nav.projects")}
                  <ChevronIcon
                    className={`transition-transform duration-200 ${
                      projectsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-0 top-full z-10 mt-3 w-48 origin-top border border-border bg-background shadow-lg transition-all duration-200 ease-out ${
                    projectsOpen
                      ? "translate-y-0 scale-100 opacity-100"
                      : "pointer-events-none -translate-y-1 scale-95 opacity-0"
                  }`}
                >
                  <div className="flex flex-col py-1">
                    {PROJECTS.map((project) => (
                      <Link
                        key={project.href}
                        href={project.href}
                        className={`px-4 py-2 text-sm transition-colors hover:bg-surface hover:text-accent ${
                          pathname === project.href ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {t(project.labelKey)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
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
              <div className="flex items-center gap-1.5">
                <Image
                  src="/translation.png"
                  alt=""
                  aria-hidden="true"
                  width={16}
                  height={16}
                  unoptimized
                  className="h-4 w-4 shrink-0 invert"
                />
                <button
                  type="button"
                  onClick={() => setLanguage(language === "en" ? "sv" : "en")}
                  aria-label={t("nav.switchLanguage")}
                  className={`rounded-none border px-3 py-1 text-xs font-semibold transition-colors ${langButtonColor}`}
                >
                  {language === "en" ? "SV" : "EN"}
                </button>
              </div>
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
            <span className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {t("nav.projects")}
            </span>
            {PROJECTS.map((project) => (
              <Link
                key={project.href}
                href={project.href}
                className={`rounded-lg px-3 py-2 transition-colors hover:bg-surface ${
                  pathname === project.href ? "text-accent" : "text-foreground"
                }`}
              >
                {t(project.labelKey)}
              </Link>
            ))}
            <div className="my-1 border-t border-border" />
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
