import { site } from "@/config/site";
import { Spark } from "@/components/spark";

function Row() {
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-6 pr-6">
      {site.marquee.map((item) => (
        <span key={item} className="flex items-center gap-6">
          <span className="font-display text-xl uppercase tracking-[0.06em]">{item}</span>
          <Spark className="h-3.5 w-3.5 opacity-70" />
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
