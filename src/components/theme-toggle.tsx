"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      aria-label={mounted && resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex w-8 justify-center rounded-full border border-support px-0 py-1 text-sm leading-none text-ink transition hover:border-display"
    >
      {mounted ? (resolvedTheme === "dark" ? "☀" : "☾") : "·"}
    </button>
  );
}
