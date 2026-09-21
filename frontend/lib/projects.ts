export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: "kanban",
    title: "Kanban Board",
    description: "A drag-and-drop task board with To Do, In Progress, and Done columns.",
    tags: ["board", "drag-and-drop"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
