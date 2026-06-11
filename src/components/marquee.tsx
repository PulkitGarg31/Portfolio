import { site } from "@/config/site";
import { Spark } from "@/components/spark";

// The item sequence repeats so one Row is wider than any viewport (up to 4K);
// the track holds two Rows and slides -50%, so the belt is always full and loops seamlessly.
const REPEATS = 3;

function Row() {
  const items = Array.from({ length: REPEATS }, () => site.marquee).flat();
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-12 pr-12">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-12">
          <span className="font-display text-3xl uppercase tracking-[0.06em]">{item}</span>
          <Spark className="h-5 w-5 opacity-70" />
        </span>
      ))}
    </span>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-support/30 bg-band py-3 text-band-ink">
      <span className="sr-only">{site.marquee.join(", ")}</span>
      <div className="flex w-max animate-marquee">
        <Row />
        <Row />
      </div>
    </div>
  );
}
