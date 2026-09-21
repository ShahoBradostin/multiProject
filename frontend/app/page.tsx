import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-16 sm:px-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">
            Projects
          </span>
        </h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          A collection of things I&apos;ve built.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
