import Link from "next/link";

export default function ProjectsLayout({
  children,
}: LayoutProps<"/projects">) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10 sm:px-16">
      <Link
        href="/"
        className="w-fit text-sm font-medium text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
      >
        ← Back to projects
      </Link>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
