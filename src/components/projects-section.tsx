"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  activeCategories,
  filterProjects,
  CATEGORY_LABELS,
  type Category,
  type Project,
} from "@/lib/projects-shared";
import { FeaturedCard } from "@/components/featured-card";
import { ProjectCard } from "@/components/project-card";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const cats: (Category | "all")[] = ["all", ...activeCategories(projects)];
  const filtered = filterProjects(projects, category);
  const featuredFirst = filtered[0]?.featured === true;
  const gridItems = featuredFirst ? filtered.slice(1) : filtered;

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
      <h2 className="font-display text-[clamp(34px,5vw,52px)] uppercase leading-none text-ink">
        Selected <span className="text-display">Work</span>
      </h2>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition ${
              category === c
                ? "bg-badge text-badge-ink"
                : "border border-ink text-ink hover:bg-ink/5"
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-5">
        {featuredFirst && (
          <motion.div layout>
            <FeaturedCard project={filtered[0]} />
          </motion.div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          {gridItems.map((p) => (
            <motion.div layout key={p.slug}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-muted">Nothing here yet.</p>}
      </div>
    </section>
  );
}
