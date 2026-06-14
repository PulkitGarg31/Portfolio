import { site } from "@/config/site";
import { SparkField, type Mark } from "@/components/spark-field";
import { Reveal } from "@/components/reveal";

const ABOUT_MARKS: Mark[] = [
  { kind: "spark", className: "right-[8%] top-[18%] h-[20px] w-[20px] rotate-[14deg] text-support opacity-30" },
  { kind: "plus", className: "right-[16%] top-[64%] text-[18px] text-support opacity-28" },
  { kind: "dot", className: "left-[6%] top-[70%] h-[6px] w-[6px] text-support opacity-30" },
];

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden">
      <SparkField marks={ABOUT_MARKS} />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <Reveal>
          <h2 className="font-display text-[clamp(34px,5vw,52px)] uppercase leading-none text-ink">
            The <span className="text-display">Human</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-6 max-w-xl space-y-4">
            {site.bio.map((para) => (
              <p key={para} className="text-sm leading-relaxed text-muted">
                {para}
              </p>
            ))}
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              {site.education}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
