import { site } from "@/config/site";
import { Reveal } from "@/components/reveal";

const BUTTON =
  "rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition";

export function ResearchSection() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
      <Reveal>
        <h2 className="font-display text-[clamp(34px,5vw,52px)] uppercase leading-none text-ink">
          Research &amp; <span className="text-display">Recognition</span>
        </h2>
      </Reveal>

      {site.research.map((paper) => (
        <Reveal key={paper.title} delay={0.05}>
          <article className="mt-8 rounded-2xl bg-surface p-6 shadow-[0_6px_20px_rgba(17,24,68,0.10)] sm:p-8">
            <span className="rounded-full bg-badge px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-badge-ink">
              Conference paper · {paper.date}
            </span>
            <h3 className="mt-3 font-display text-[clamp(20px,2.6vw,28px)] uppercase leading-tight text-ink">
              {paper.title}
            </h3>
            <p className="mt-3 text-sm text-muted">
              {paper.authors.map((a, i) => (
                <span key={a}>
                  {a === site.name ? <strong className="text-ink">{a}</strong> : a}
                  {i < paper.authors.length - 1 && ", "}
                </span>
              ))}
            </p>
            <p className="mt-1 text-sm text-muted">{paper.venue}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {paper.url && (
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${BUTTON} bg-badge text-badge-ink hover:opacity-90`}
                >
                  Read the paper <span aria-hidden="true">↗</span>
                </a>
              )}
              {paper.projectSlug && (
                <a
                  href={`#${paper.projectSlug}`}
                  className={`${BUTTON} border border-ink text-ink hover:bg-ink/5`}
                >
                  See the project
                </a>
              )}
            </div>
          </article>
        </Reveal>
      ))}

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        {site.achievements.map((a, i) => (
          <Reveal key={a.title} delay={0.05 * (i + 1)}>
            <div className="h-full rounded-xl bg-surface p-5 shadow-[0_4px_14px_rgba(17,24,68,0.08)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{a.date}</p>
              <h3 className="mt-2 font-display text-lg uppercase leading-tight text-ink">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.detail}</p>
              {a.url && (
                <a
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-[11px] font-bold uppercase tracking-[0.1em] text-ink transition hover:text-display"
                >
                  Verify <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
