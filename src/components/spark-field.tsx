"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Spark } from "@/components/spark";

export type Mark = {
  kind: "spark" | "plus" | "circle" | "dot";
  className: string;
};

// Parent must be `relative` (and ideally `overflow-hidden`) — marks are absolutely positioned and drift ±8px.
export function SparkField({ marks }: { marks: Mark[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [8, -8]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      {marks.map((m, i) => (
        <motion.span key={i} style={{ y }} className={`absolute ${m.className}`}>
          {m.kind === "spark" && <Spark className="h-full w-full" />}
          {m.kind === "plus" && (
            <span className="block font-light leading-none">+</span>
          )}
          {m.kind === "circle" && (
            <span className="block h-full w-full rounded-full border-[1.5px] border-current" />
          )}
          {m.kind === "dot" && (
            <span className="block h-full w-full rounded-full bg-current" />
          )}
        </motion.span>
      ))}
    </div>
  );
}
