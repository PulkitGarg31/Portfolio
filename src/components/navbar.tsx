import { site } from "@/config/site";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "#work", label: "Projects" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-support/20 bg-bg/80 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 sm:px-10">
        <a href="#top" className="font-display text-lg uppercase tracking-[0.02em] text-ink">
          {site.name}
          <span className="text-display">.</span>
        </a>
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="hidden items-center gap-5 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:text-display dark:hover:opacity-70"
              >
                {l.label}
              </a>
            ))}
          </div>
          <a
            href={site.resumePath}
            download
            className="rounded-full bg-display px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-bg transition hover:opacity-90"
          >
            Resume ↓
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
