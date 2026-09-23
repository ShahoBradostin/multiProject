"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const EXPERIENCE = [
  {
    role: "Frontend Developer",
    company: "Precise Biometrics",
    location: "Lund",
    period: "Sept 2025 – Jan 2026",
    bullets: [
      "Solo developer responsible for redesigning an existing website.",
      "Fixed front-end bugs and improved UI responsiveness across mobile and desktop.",
      "Worked with legacy systems to achieve the new design.",
      "Provided visual presentations using Figma.",
    ],
    link: "https://precise-biometrics.starwebserver.se/",
  },
  {
    role: "Project Manager",
    company: "Cura-Ami",
    location: "Malmö",
    period: "Sept 2025 – Jan 2026",
    bullets: [
      "Formally responsible for the project: planning, budgeting, risk management, timelines, team coordination, and delivery.",
      "Led project meetings, facilitated communication, and ensured smooth collaboration within the team.",
      "Defined project goals, scope, and requirements together with the team and stakeholders.",
      "Contributed to both frontend and backend development of the app and admin page.",
    ],
    link: "https://apps.apple.com/gm/app/cura-ami/id6743929376",
  },
  {
    role: "Fullstack Developer",
    company: "DoskiFlix",
    location: "Malmö",
    period: "Sept 2024 – Dec 2024",
    bullets: [
      "Developed a movie application using Next.js and Tailwind CSS.",
      "Built a mashup service integrating RESTful APIs, including OMDB and the ChatGPT API.",
      "Users receive five recommended movies based on their likes and dislikes.",
    ],
    link: "https://github.com/RayanDoski/DoskiFlix",
  },
  {
    role: "Database Specialist",
    company: "Schedular",
    location: "Malmö",
    period: "Sept 2024 – Dec 2024",
    bullets: [
      "Shared responsibility across all sections of the project, with a particular focus on the database.",
      "Fixed code across the stack: frontend (CSS), backend (Python), and database (PostgreSQL).",
      "Took part in daily scrum meetings to keep development moving smoothly.",
    ],
    link: "https://github.com/Sharqawi02/Schedular",
  },
];

const SKILL_GROUPS = [
  {
    heading: "Languages",
    items: ["Python", "SQL", "JavaScript", "TypeScript", "C#", "HTML", "CSS"],
  },
  {
    heading: "Tools & Frameworks",
    items: ["Bootstrap", "React", "Next.js", "Tailwind CSS"],
  },
  {
    heading: "Other Skills",
    items: [
      "User Research",
      "Data Analysis",
      "Prototyping",
      "Figma",
      "Information Security",
      "AJAX",
      "jQuery",
      "Tableau",
      "Git",
    ],
  },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-6 py-10 sm:px-16">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent hover:text-accent"
      >
        {t("common.backHome")}
      </Link>

      <FadeIn className="flex flex-col items-center gap-6 text-center">
        <ImagePlaceholder
          label="Profile picture placeholder"
          className="aspect-square w-40 rounded-full"
        />
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
            Shapo
          </h1>
          <p className="text-muted">Software Developer · Malmö, Sweden</p>
        </div>
      </FadeIn>

      <FadeIn delayMs={100} className="flex flex-col gap-4 text-muted">
        <p>
          Hi, I&apos;m Shapo, a software developer finishing my Bachelor&apos;s
          in Computer and Information Science at Malmö University. I care about
          building products that are genuinely pleasant to use, and I&apos;m
          endlessly curious about how AI can make both the software we build and
          the way we build it better.
        </p>
        <p>
          My background spans the full stack, from pixel-level frontend polish
          to backend logic and database design, with a healthy dose of UX
          research and prototyping mixed in. I like being the person who can sit
          with a messy legacy codebase, understand what it&apos;s actually
          trying to do, and quietly make it better, whether that&apos;s fixing a
          stubborn responsiveness bug, redesigning a page in Figma, or
          untangling a gnarly SQL query.
        </p>
        <p>
          I&apos;ve had the chance to wear a lot of hats: leading a project end
          to end as a project manager, going deep on a single feature as a solo
          frontend developer, and everything in between. What ties it together
          is that I show up, ask good questions, and don&apos;t stop until the
          thing actually works.
        </p>
      </FadeIn>

      <FadeIn delayMs={150} className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-foreground">Experience</h2>
        <div className="flex flex-col gap-4">
          {EXPERIENCE.map((job) => (
            <a
              key={`${job.role}-${job.company}`}
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 text-left shadow-sm transition-all hover:border-accent hover:shadow-md"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-serif text-xl text-foreground transition-colors group-hover:text-accent">
                  {job.role}
                </h3>
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  {job.period}
                </span>
              </div>
              <p className="text-sm font-medium text-accent">
                {job.company} · {job.location}
              </p>
              <ul className="flex flex-col gap-1 text-sm text-muted">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span aria-hidden>·</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </a>
          ))}
        </div>
      </FadeIn>

      <FadeIn delayMs={200} className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-foreground">Education</h2>
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-serif text-xl text-foreground">
              Malmö University
            </h3>
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Sept 2023 – Jun 2026
            </span>
          </div>
          <p className="text-sm font-medium text-accent">
            B.Sc. Computer and Information Science
          </p>
          <p className="text-sm text-muted">
            Covers the full software development lifecycle, from structured and
            object-oriented programming, web development, and database design to
            information architecture, UX research, and data visualization,
            alongside repeated work in cross-functional project teams handling
            everything from requirements and prototyping to implementation and
            evaluation.
          </p>
        </div>
      </FadeIn>

      <FadeIn delayMs={250} className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-foreground">Skills</h2>
        <div className="flex flex-col gap-4">
          {SKILL_GROUPS.map((group) => (
            <div key={group.heading} className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {group.heading}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn
        delayMs={300}
        className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center"
      >
        <p className="text-muted">Want to work together or just say hi?</p>
        <Link
          href="/#contact"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          {t("nav.contact")}
        </Link>
      </FadeIn>
    </div>
  );
}
