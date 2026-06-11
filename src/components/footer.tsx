import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-support/30 bg-band text-band-ink">
      <div className="mx-auto max-w-6xl px-6 pb-6 pt-14 sm:px-10">
        <h2 className="font-display text-[clamp(48px,8vw,90px)] uppercase leading-[0.9]">
          Let&apos;s Talk
        </h2>
        <p className="mt-3 text-sm text-band-ink/70">{site.availability}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${site.email}`}
            className="rounded-full bg-band-ink px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-band transition hover:opacity-90"
          >
            Email Me
          </a>
          {[
            { href: site.github, label: "GitHub" },
            { href: site.linkedin, label: "LinkedIn" },
            { href: site.resumePath, label: "Resume PDF" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noreferrer" : undefined}
              className="rounded-full border border-support px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-band-ink/90 transition hover:border-band-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-2 text-[10px] uppercase tracking-[0.12em] text-band-ink/50">
          <span>
            {site.name} © {new Date().getFullYear()}
          </span>
          <span>{site.footerTag}</span>
        </div>
      </div>
    </footer>
  );
}
