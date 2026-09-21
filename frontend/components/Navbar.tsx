import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
            S
          </span>
          Site Name
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link
            href="/"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Projects
          </Link>
          <span className="cursor-default opacity-50" title="Placeholder page">
            About
          </span>
          <span className="cursor-default opacity-50" title="Placeholder page">
            Contact
          </span>
        </nav>
      </div>
    </header>
  );
}
