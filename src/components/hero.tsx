import { site } from "@/config/site";
import { Spark } from "@/components/spark";
import { SparkField, type Mark } from "@/components/spark-field";

const HERO_MARKS: Mark[] = [
  { kind: "spark", className: "left-[7%] top-[22%] h-[22px] w-[22px] rotate-[18deg] text-support opacity-35" },
  { kind: "spark", className: "right-[9%] top-[16%] h-[28px] w-[28px] rotate-[-16deg] text-support opacity-35" },
  { kind: "circle", className: "left-[4.5%] top-[56%] h-[54px] w-[54px] text-support opacity-30" },
  { kind: "plus", className: "right-[22%] top-[67%] text-[19px] text-support opacity-30" },
  { kind: "spark", className: "left-[16%] top-[76%] h-[14px] w-[14px] rotate-[-12deg] text-display opacity-25" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-12 pt-20 sm:px-10 sm:pt-24">
      <SparkField marks={HERO_MARKS} />

      <h1 className="relative z-10 text-center font-display text-[clamp(64px,14vw,150px)] uppercase leading-[0.94] tracking-[0.005em] text-display">
        <span className="relative inline-block">
          {/* small light star above the P, pointed north-west */}
          <Spark className="absolute -left-[0.08em] -top-[0.16em] h-[0.14em] w-[0.14em] rotate-[-45deg] text-support opacity-60" />
          Pulkit
        </span>
        <br />
        <span className="relative mt-[0.05em] inline-block">
          Garg
          {/* the star: slightly below-right of the final G */}
          <Spark className="absolute -bottom-[0.18em] -right-[0.36em] h-[0.38em] w-[0.38em] rotate-[-8deg] text-ink" />
        </span>
      </h1>

      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2.5">
        {site.badges.map((b) => (
          <span
            key={b}
            className="rounded-full bg-badge px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-badge-ink"
          >
            {b}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto mt-14 flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <p className="font-display text-[clamp(20px,2.5vw,27px)] uppercase leading-[1.04] text-ink">
          {site.subHeadline[0]}
          <br />
          {site.subHeadline[1]}
        </p>
        <div className="sm:text-right">
          <p className="mb-3 max-w-[230px] text-xs leading-relaxed text-muted sm:ml-auto">
            {site.positioning}
          </p>
          <a
            href="#work"
            className="inline-block rounded-full bg-display px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-bg transition hover:opacity-90"
          >
            View Projects <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
