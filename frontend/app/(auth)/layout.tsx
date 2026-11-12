"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import AuthBackgroundVideo from "@/components/AuthBackgroundVideo";
import AuthSidePanel from "@/components/AuthSidePanel";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Swaps the form and the side panel across the vertical center line when
// navigating between /login and /register. This layout persists across that
// navigation (only the route's page.tsx remounts), which is what makes the
// swap animate instead of just snapping to the new layout.
export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const isRegister = pathname === "/register";

  return (
    <div className="relative flex flex-1 flex-col">
      <AuthBackgroundVideo />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10">
        <h1 className="text-center font-serif text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          {t("auth.welcomeHeading")}
        </h1>
        <div className="flex w-full flex-1 flex-col items-center gap-10 md:flex-row md:items-stretch md:gap-12">
          <div
            className={`flex w-full flex-col justify-center transition-transform duration-500 ease-in-out md:w-1/2 ${
              isRegister ? "md:translate-x-[calc(100%+3rem)]" : "md:translate-x-0"
            }`}
          >
            {children}
          </div>
          <div
            className={`flex w-full flex-col transition-transform duration-500 ease-in-out md:w-1/2 ${
              isRegister ? "md:-translate-x-[calc(100%+3rem)]" : "md:translate-x-0"
            }`}
          >
            <AuthSidePanel
              heading={t("auth.authSideHeading")}
              description={t("auth.authSideDescription")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
