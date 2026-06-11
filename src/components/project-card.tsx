import { CATEGORY_LABELS, type Project } from "@/lib/projects-shared";
import { ProjectImage } from "@/components/project-image";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-xl bg-surface shadow-[0_4px_14px_rgba(17,24,68,0.08)]">
      {project.image && <ProjectImage project={project} className="aspect-video" />}
      <div className="p-5">
        <div className="flex items-center">
          <span className="rounded-full bg-badge px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-badge-ink">
            {CATEGORY_LABELS[project.category]}
          </span>
        </div>
        <h3 className="mt-2 font-display text-lg uppercase leading-tight text-ink">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
          <span>{project.tech.join(" · ")}</span>
        </div>
        <div className="mt-4 flex gap-4 text-[11px] font-bold uppercase tracking-[0.1em]">
          <a href={project.github} target="_blank" rel="noreferrer" className="text-ink transition hover:text-display">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="text-ink transition hover:text-display">
              Demo <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
