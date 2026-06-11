import Image from "next/image";
import { CATEGORY_LABELS, type Project } from "@/lib/projects-shared";

export function ProjectImage({ project, className = "" }: { project: Project; className?: string }) {
  if (project.image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-contain p-2"
        />
      </div>
    );
  }
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[repeating-linear-gradient(45deg,transparent,transparent_12px,color-mix(in_srgb,var(--support)_18%,transparent)_12px,color-mix(in_srgb,var(--support)_18%,transparent)_24px)] ${className}`}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {CATEGORY_LABELS[project.category]}
      </span>
    </div>
  );
}
