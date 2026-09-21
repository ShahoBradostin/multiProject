export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-16">
        <p>&copy; {new Date().getFullYear()} Site Name. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="cursor-default opacity-70" title="Placeholder link">
            GitHub
          </span>
          <span className="cursor-default opacity-70" title="Placeholder link">
            LinkedIn
          </span>
          <span className="cursor-default opacity-70" title="Placeholder link">
            Email
          </span>
        </div>
      </div>
    </footer>
  );
}
