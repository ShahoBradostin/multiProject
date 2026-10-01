import type { ReactNode } from "react";
import FadeIn from "@/components/FadeIn";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-10 px-6 py-10 md:flex-row md:items-stretch md:gap-12">
      <div className="flex w-full flex-col justify-center md:w-1/2">
        {children}
      </div>
      <FadeIn delayMs={100} className="hidden w-full md:flex md:w-1/2">
        <div className="flex w-full flex-col justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface/60 p-10 text-left">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Image placeholder
          </span>
          <h2 className="font-serif text-2xl text-foreground">
            Lorem Ipsum Dolor Sit Amet
          </h2>
          <p className="text-sm text-muted">{LOREM}</p>
        </div>
      </FadeIn>
    </div>
  );
}
