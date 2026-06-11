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
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full border border-support px-2.5 py-1 text-sm leading-none text-ink transition hover:border-display"
    >
      {mounted ? (resolvedTheme === "dark" ? "☀" : "☾") : "·"}
    </button>
  );
}
