import { site } from "@/config/site";

export function StackSection() {
  return (
    <section id="stack" className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <h2 className="font-display text-[clamp(34px,5vw,52px)] uppercase leading-none text-ink">
          The <span className="text-display">Stack</span>
        </h2>
        <div className="mt-8 space-y-6">
          {site.skills.map((group) => (
            <div key={group.group}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                {group.group}
              </h3>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-bg px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
