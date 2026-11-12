import FadeIn from "@/components/FadeIn";

export default function AuthSidePanel({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) {
  return (
    <FadeIn delayMs={100} className="hidden h-full w-full md:flex">
      <div className="relative flex w-full flex-col justify-center gap-3 overflow-hidden rounded-2xl border border-border bg-surface p-10 text-left">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-12 -top-12 h-56 w-56 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-accent-button-hover/50 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-3">
          <h2 className="font-serif text-2xl text-foreground">{heading}</h2>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
    </FadeIn>
  );
}
