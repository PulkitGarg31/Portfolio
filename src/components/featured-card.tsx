import { CATEGORY_LABELS, type Project } from "@/lib/projects-shared";
import { ProjectImage } from "@/components/project-image";

export function FeaturedCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-surface shadow-[0_6px_20px_rgba(17,24,68,0.10)] sm:flex">
      <div className="flex-1 p-6 sm:p-8">
        <div className="flex items-center">
          <span className="rounded-full bg-badge px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-badge-ink">
            {CATEGORY_LABELS[project.category]}
          </span>
        </div>
        <h3 className="mt-3 font-display text-[clamp(22px,3vw,32px)] uppercase leading-tight text-ink">
          {project.title}
        </h3>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t} className="rounded border border-support px-2 py-0.5 text-[11px] text-display">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-badge px-5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-badge-ink transition hover:opacity-90"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink px-5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink transition hover:bg-ink/5"
            >
              Live Demo <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
      <ProjectImage project={project} className="min-h-[240px] sm:w-[52%]" />
    </article>
  );
}
