# Personal Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Pulkit Garg's single-page poster-editorial portfolio (spec: `docs/superpowers/specs/2026-06-11-personal-website-design.md`) — Next.js static export, markdown-driven projects, light/dark twin themes.

**Architecture:** One static route (`/`) assembled from section components. All content comes from markdown files (`content/projects/`) and one config module (`src/config/site.ts`), read at build time and validated with zod so a broken portfolio can never deploy. Client-side state is limited to theme toggle, category filter, and motion.

**Tech Stack:** Next.js 15 (App Router, `output: 'export'`), React 19, TypeScript, Tailwind CSS v4 (CSS-variable design tokens), next-themes, Framer Motion, gray-matter + zod, Vitest. Deploy: Vercel free tier.

**Conventions for every task:** run commands from the repo root (`C:\My Work\Personal Website`) in Git Bash; commit messages are plain — **never add a Co-Authored-By line or any Claude attribution** (user requirement).

---

## File structure (end state)

```
next.config.ts              # static export config
postcss.config.mjs          # Tailwind v4 PostCSS plugin
tsconfig.json
vitest.config.ts
package.json
content/projects/*.md       # one file per project (frontmatter)
public/favicon.svg          # indigo spark
public/projects/            # project screenshots (empty until content arrives)
src/app/layout.tsx          # fonts, ThemeProvider, metadata
src/app/globals.css         # tokens, dark variant, marquee keyframes
src/app/page.tsx            # loads projects, assembles sections
src/config/site.ts          # every user-visible string & link
src/lib/projects-shared.ts  # types + pure filter helpers (client-safe, no fs)
src/lib/projects.ts         # build-time loader: gray-matter + zod validation
src/lib/__tests__/          # vitest tests + fixtures
src/components/
  theme-provider.tsx  theme-toggle.tsx  navbar.tsx
  spark.tsx  spark-field.tsx  hero.tsx  marquee.tsx
  project-image.tsx  featured-card.tsx  project-card.tsx  projects-section.tsx
  stack-section.tsx  about-section.tsx  footer.tsx
```

---

### Task 1: Toolchain scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Delete: root `Screenshot 2026-06-11 130518.png`, `Screenshot 2026-06-11 132356.png` (committed copies live in `docs/superpowers/references/`)

- [ ] **Step 1: Remove duplicate screenshots from root**

```bash
rm "Screenshot 2026-06-11 130518.png" "Screenshot 2026-06-11 132356.png"
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "pulkit-portfolio",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install next@15 react@19 react-dom@19 next-themes@^0.4 framer-motion@^11 gray-matter@^4 zod@^3
npm install -D typescript@^5 @types/node @types/react @types/react-dom tailwindcss@^4 @tailwindcss/postcss@^4 vitest@^3
```

Expected: both commands end with `added N packages` and no `ERESOLVE` errors.

- [ ] **Step 4: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 5: Create `postcss.config.mjs`**

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

- [ ] **Step 6: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out"]
}
```

- [ ] **Step 7: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: { include: ["src/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```

- [ ] **Step 8: Create minimal `src/app/globals.css`** (tokens come in Task 2)

```css
@import "tailwindcss";
```

- [ ] **Step 9: Create minimal `src/app/layout.tsx`**

```tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Create minimal `src/app/page.tsx`**

```tsx
export default function Home() {
  return <main>Pulkit Garg — under construction</main>;
}
```

- [ ] **Step 11: Verify the build works end-to-end**

```bash
npm run build
```

Expected: `✓ Compiled successfully`, `✓ Exporting`, route `/` listed as static (`○`), and an `out/` directory exists containing `index.html`.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js 15 static-export toolchain"
```

---

### Task 2: Design tokens, fonts, base styles

**Files:**
- Modify: `src/app/globals.css` (replace entirely)
- Modify: `src/app/layout.tsx` (replace entirely)

- [ ] **Step 1: Replace `src/app/globals.css` with the token system**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: #eae0cf;
  --surface: #fffdf8;
  --display: #4b5694;
  --ink: #111844;
  --muted: #5a678a;
  --badge-bg: #111844;
  --badge-text: #eae0cf;
  --support: #7288ae;
  --band: #111844;
  --band-ink: #eae0cf;
}

.dark {
  --bg: #111844;
  --surface: #1a2254;
  --display: #eae0cf;
  --ink: #eae0cf;
  --muted: #9fb0cc;
  --badge-bg: #eae0cf;
  --badge-text: #111844;
  --support: #7288ae;
  --band: #111844;
  --band-ink: #eae0cf;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-display: var(--display);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-badge: var(--badge-bg);
  --color-badge-ink: var(--badge-text);
  --color-support: var(--support);
  --color-band: var(--band);
  --color-band-ink: var(--band-ink);
  --font-display: var(--font-anton);
  --font-body: var(--font-inter);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--ink);
}

/* marquee */
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee { animation: marquee 30s linear infinite; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .animate-marquee { animation: none; }
}

/* visible focus ring everywhere */
:focus-visible {
  outline: 2px solid var(--display);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Replace `src/app/layout.tsx` with fonts + metadata** (ThemeProvider is added in Task 3)

```tsx
import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Pulkit Garg — ML Engineer",
  description:
    "GenAI, agentic systems & ML — built end-to-end and shipped, not just notebooked.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anton.variable} ${inter.variable} font-body bg-bg text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify tokens compile and fonts load**

```bash
npm run build
```

Expected: `✓ Compiled successfully` (fonts are downloaded at build time; requires network).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add design tokens, twin-theme palette, and display/body fonts"
```

---

### Task 3: Theme switching (system default + toggle)

**Files:**
- Create: `src/components/theme-provider.tsx`, `src/components/theme-toggle.tsx`
- Modify: `src/app/layout.tsx` (wrap children)
- Modify: `src/app/page.tsx` (temporarily mount toggle to verify)

- [ ] **Step 1: Create `src/components/theme-provider.tsx`**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Create `src/components/theme-toggle.tsx`** (mounted-guard avoids hydration mismatch)

```tsx
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
```

- [ ] **Step 3: Wrap the app in `src/app/layout.tsx`** — change the body contents:

```tsx
import { ThemeProvider } from "@/components/theme-provider";
```

and replace `{children}` inside `<body>` with:

```tsx
<ThemeProvider>{children}</ThemeProvider>
```

- [ ] **Step 4: Temporarily mount the toggle in `src/app/page.tsx`**

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="p-10">
      <ThemeToggle />
      <p className="font-display text-6xl uppercase text-display">Pulkit Garg</p>
      <p className="text-muted">token check: muted on bg</p>
    </main>
  );
}
```

- [ ] **Step 5: Verify in the browser**

```bash
npm run dev
```

Open http://localhost:3000 — clicking the toggle flips cream page/indigo type ⇄ navy page/cream type with no flash on reload; OS dark-mode setting is respected on first visit (check in a private window). Stop the dev server after checking.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add system-default theme switching with persisted toggle"
```

---

### Task 4: Site config — single source for all strings

**Files:**
- Create: `src/config/site.ts`

- [ ] **Step 1: Create `src/config/site.ts`** (TODO-CONTENT marks what Pulkit must replace)

```ts
export const site = {
  name: "Pulkit Garg",
  role: "ML Engineer",
  badges: ["ML Engineer", "GenAI & Agentic AI"],
  subHeadline: ["I build AI systems", "that ship different"],
  positioning:
    "GenAI, agentic systems & ML — built end-to-end and shipped, not just notebooked.",
  marquee: ["GenAI", "Agentic AI", "Machine Learning", "MLOps"],
  email: "pulkit3110@gmail.com",
  github: "https://github.com/TODO-CONTENT",
  linkedin: "https://www.linkedin.com/in/TODO-CONTENT",
  resumePath: "/resume.pdf",
  availability: "Open to ML / GenAI roles — reply within 24h.",
  footerTag: "Built with Next.js — designed loud",
  bio: [
    "TODO-CONTENT: 3–4 confident first-person sentences — who you are, what you are obsessed with building, what you are looking for.",
  ],
  education: "TODO-CONTENT: B.Tech — Your School — Year",
  skills: [
    { group: "Languages", items: ["Python", "TypeScript", "SQL"] },
    { group: "ML & Data", items: ["PyTorch", "scikit-learn", "Pandas", "XGBoost"] },
    { group: "GenAI & Agents", items: ["LangChain", "LangGraph", "RAG", "Vector DBs", "Claude/OpenAI APIs"] },
    { group: "Infra & Tools", items: ["Docker", "Git", "FastAPI", "Vercel", "Linux"] },
  ],
};

export type Site = typeof site;
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/config/site.ts
git commit -m "Add site config as single source of user-visible strings"
```

---

### Task 5: Project types + pure filter helpers (TDD)

**Files:**
- Create: `src/lib/projects-shared.ts`
- Test: `src/lib/__tests__/projects-shared.test.ts`

- [ ] **Step 1: Write the failing test** — `src/lib/__tests__/projects-shared.test.ts`

```ts
import { describe, expect, it } from "vitest";
import {
  activeCategories,
  filterProjects,
  type Project,
} from "@/lib/projects-shared";

const p = (over: Partial<Project>): Project => ({
  slug: "x",
  title: "X",
  summary: "S",
  category: "ml",
  tech: ["Python"],
  github: "https://github.com/x/x",
  featured: false,
  order: 1,
  ...over,
});

describe("filterProjects", () => {
  const projects = [
    p({ slug: "a", category: "agents" }),
    p({ slug: "b", category: "genai" }),
    p({ slug: "c", category: "agents" }),
  ];

  it("returns everything for 'all'", () => {
    expect(filterProjects(projects, "all")).toHaveLength(3);
  });

  it("returns only the matching category", () => {
    expect(filterProjects(projects, "agents").map((x) => x.slug)).toEqual(["a", "c"]);
  });

  it("returns empty array when nothing matches", () => {
    expect(filterProjects(projects, "other")).toEqual([]);
  });
});

describe("activeCategories", () => {
  it("returns only categories present, in canonical order", () => {
    const projects = [p({ category: "ml" }), p({ category: "genai" })];
    expect(activeCategories(projects)).toEqual(["genai", "ml"]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '@/lib/projects-shared'` (or equivalent resolve error).

- [ ] **Step 3: Implement `src/lib/projects-shared.ts`**

```ts
export const CATEGORIES = ["genai", "agents", "ml", "other"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Project = {
  slug: string;
  title: string;
  summary: string;
  category: Category;
  tech: string[];
  github: string;
  demo?: string;
  image?: string;
  featured: boolean;
  order: number;
};

export function filterProjects(
  projects: Project[],
  category: Category | "all",
): Project[] {
  return category === "all"
    ? projects
    : projects.filter((p) => p.category === category);
}

export function activeCategories(projects: Project[]): Category[] {
  return CATEGORIES.filter((c) => projects.some((p) => p.category === c));
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib
git commit -m "Add project types and pure filter helpers"
```

---

### Task 6: Markdown loader with build-failing validation (TDD)

**Files:**
- Create: `src/lib/projects.ts`
- Test: `src/lib/__tests__/projects.test.ts`
- Create fixtures under `src/lib/__tests__/fixtures/`

- [ ] **Step 1: Create fixture files**

`src/lib/__tests__/fixtures/valid/alpha.md`:

```markdown
---
title: "Alpha Agent"
summary: "Solved X by building Y, cutting latency 40%."
category: agents
tech: [LangGraph, Python]
github: https://github.com/example/alpha
featured: true
order: 1
---
```

`src/lib/__tests__/fixtures/valid/beta.md`:

```markdown
---
title: "Beta RAG"
summary: "RAG pipeline answering 1k docs at 92% accuracy."
category: genai
tech: [LangChain, Pinecone]
github: https://github.com/example/beta
demo: https://beta.example.com
image: /projects/beta.png
order: 2
---
```

`src/lib/__tests__/fixtures/valid/gamma.md`:

```markdown
---
title: "Gamma Churn"
summary: "TODO-CONTENT: churn model story with a number."
category: ml
tech: [XGBoost]
github: https://github.com/example/gamma
order: 3
---
```

`src/lib/__tests__/fixtures/invalid-frontmatter/bad.md` (missing `title`, bad URL):

```markdown
---
summary: "No title here."
category: ml
tech: [Python]
github: not-a-url
order: 1
---
```

`src/lib/__tests__/fixtures/no-featured/only.md`:

```markdown
---
title: "Only"
summary: "S."
category: ml
tech: [Python]
github: https://github.com/example/only
order: 1
---
```

`src/lib/__tests__/fixtures/two-featured/one.md`:

```markdown
---
title: "One"
summary: "S."
category: ml
tech: [Python]
github: https://github.com/example/one
featured: true
order: 1
---
```

`src/lib/__tests__/fixtures/two-featured/two.md`:

```markdown
---
title: "Two"
summary: "S."
category: genai
tech: [Python]
github: https://github.com/example/two
featured: true
order: 2
---
```

`src/lib/__tests__/fixtures/empty/.gitkeep`: empty file.

- [ ] **Step 2: Write the failing test** — `src/lib/__tests__/projects.test.ts`

```ts
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadProjects } from "@/lib/projects";

const fx = (name: string) =>
  path.join(process.cwd(), "src", "lib", "__tests__", "fixtures", name);

afterEach(() => vi.restoreAllMocks());

describe("loadProjects", () => {
  it("loads valid projects sorted featured-first then by order", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const projects = loadProjects(fx("valid"));
    expect(projects.map((p) => p.slug)).toEqual(["alpha", "beta", "gamma"]);
    expect(projects[0].featured).toBe(true);
    expect(projects[1].demo).toBe("https://beta.example.com");
  });

  it("warns when a file still contains TODO-CONTENT", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    loadProjects(fx("valid"));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("gamma.md"));
  });

  it("throws naming the file and fields on invalid frontmatter", () => {
    expect(() => loadProjects(fx("invalid-frontmatter"))).toThrowError(
      /bad\.md.*title.*github/s,
    );
  });

  it("throws when no project is featured", () => {
    expect(() => loadProjects(fx("no-featured"))).toThrowError(/featured/);
  });

  it("throws when two projects are featured", () => {
    expect(() => loadProjects(fx("two-featured"))).toThrowError(/found 2/);
  });

  it("throws on an empty content directory", () => {
    expect(() => loadProjects(fx("empty"))).toThrowError(/No projects found/);
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

```bash
npm test
```

Expected: FAIL — cannot find module `@/lib/projects`.

- [ ] **Step 4: Implement `src/lib/projects.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { CATEGORIES, type Project } from "@/lib/projects-shared";

const projectSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.enum(CATEGORIES),
  tech: z.array(z.string().min(1)).min(1).max(8),
  github: z.string().url(),
  demo: z.string().url().optional(),
  image: z.string().startsWith("/").optional(),
  featured: z.boolean().default(false),
  order: z.number().int().positive(),
});

const DEFAULT_DIR = path.join(process.cwd(), "content", "projects");

export function loadProjects(dir: string = DEFAULT_DIR): Project[] {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const projects = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    if (raw.includes("TODO-CONTENT")) {
      console.warn(`[content] ${file} still contains TODO-CONTENT placeholders`);
    }
    const { data } = matter(raw);
    const parsed = projectSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("; ");
      throw new Error(`Invalid frontmatter in ${file} — ${issues}`);
    }
    const project: Project = { ...parsed.data, slug: file.replace(/\.md$/, "") };
    return project;
  });

  if (projects.length === 0) {
    throw new Error(`No projects found in ${dir} — add at least one .md file`);
  }

  const featured = projects.filter((p) => p.featured);
  if (featured.length !== 1) {
    throw new Error(
      `Exactly one project must set featured: true (found ${featured.length}` +
        (featured.length ? `: ${featured.map((p) => p.slug).join(", ")})` : ")"),
    );
  }

  return projects.sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order,
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test
```

Expected: `10 passed` (4 from Task 5 + 6 new).

- [ ] **Step 6: Commit**

```bash
git add src/lib
git commit -m "Add markdown project loader with build-failing validation"
```

---

### Task 7: Real content directory + page wiring

**Files:**
- Create: `content/projects/agentic-research-assistant.md`, `content/projects/rag-knowledge-base.md`, `content/projects/churn-prediction.md`
- Create: `public/projects/.gitkeep`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create three placeholder projects** (Pulkit replaces details later; structure is real)

`content/projects/agentic-research-assistant.md`:

```markdown
---
title: "Agentic Research Assistant"
summary: "TODO-CONTENT: problem → what you built → result with a number."
category: agents
tech: [LangGraph, Python, FastAPI]
github: https://github.com/TODO-CONTENT/agentic-research-assistant
featured: true
order: 1
---
```

`content/projects/rag-knowledge-base.md`:

```markdown
---
title: "RAG Knowledge Base"
summary: "TODO-CONTENT: problem → what you built → result with a number."
category: genai
tech: [LangChain, Pinecone, Next.js]
github: https://github.com/TODO-CONTENT/rag-knowledge-base
order: 2
---
```

`content/projects/churn-prediction.md`:

```markdown
---
title: "Churn Prediction Engine"
summary: "TODO-CONTENT: problem → what you built → result with a number."
category: ml
tech: [PyTorch, XGBoost, Pandas]
github: https://github.com/TODO-CONTENT/churn-prediction
order: 3
---
```

- [ ] **Step 2: Create `public/projects/.gitkeep`** (empty file — screenshots land here later)

- [ ] **Step 3: Wire the loader into `src/app/page.tsx`** (replace entirely; sections still placeholder)

```tsx
import { loadProjects } from "@/lib/projects";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const projects = loadProjects();
  return (
    <main className="p-10">
      <ThemeToggle />
      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            {p.title} — {p.category} {p.featured && "★"}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 4: Verify the build reads content** (and the TODO warning fires)

```bash
npm run build
```

Expected: build succeeds; output contains `[content] ... TODO-CONTENT` warnings for all three files.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add project content directory wired into the page"
```

---

### Task 8: Spark + SparkField (background decoration system)

**Files:**
- Create: `src/components/spark.tsx`, `src/components/spark-field.tsx`

- [ ] **Step 1: Create `src/components/spark.tsx`** — the four-pointed ✦ as crisp SVG

```tsx
export function Spark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M50 0 C54 28 72 46 100 50 C72 54 54 72 50 100 C46 72 28 54 0 50 C28 46 46 28 50 0 Z" />
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/components/spark-field.tsx`** — edge marks with gentle scroll drift

```tsx
"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Spark } from "@/components/spark";

export type Mark = {
  kind: "spark" | "plus" | "circle" | "dot";
  className: string;
};

export function SparkField({ marks }: { marks: Mark[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [8, -8]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {marks.map((m, i) => (
        <motion.span key={i} style={reduce ? undefined : { y }} className={`absolute ${m.className}`}>
          {m.kind === "spark" && <Spark className="h-full w-full" />}
          {m.kind === "plus" && <span className="block font-light leading-none">+</span>}
          {m.kind === "circle" && (
            <span className="block h-full w-full rounded-full border-[1.5px] border-current" />
          )}
          {m.kind === "dot" && <span className="block h-full w-full rounded-full bg-current" />}
        </motion.span>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/spark.tsx src/components/spark-field.tsx
git commit -m "Add spark motif and parallax background field"
```

---

### Task 9: Navbar

**Files:**
- Create: `src/components/navbar.tsx`

- [ ] **Step 1: Create `src/components/navbar.tsx`**

```tsx
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
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:text-display"
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
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/navbar.tsx
git commit -m "Add sticky navbar with wordmark, resume pill, and theme toggle"
```

---

### Task 10: Hero (approved v5 geometry)

**Files:**
- Create: `src/components/hero.tsx`

Geometry source: `docs/superpowers/references/hero-approved.html`. Both stars anchor to the name in `em` units so they scale with the clamp()ed font and never detach.

- [ ] **Step 1: Create `src/components/hero.tsx`**

```tsx
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
    <section id="top" className="relative overflow-hidden px-6 pb-12 pt-12 sm:px-10">
      <SparkField marks={HERO_MARKS} />

      <h1 className="relative z-10 text-center font-display text-[clamp(64px,14vw,150px)] uppercase leading-[0.94] tracking-[0.005em] text-display">
        <span className="relative inline-block">
          {/* small light star above the P, pointed north-west */}
          <Spark className="absolute -left-[0.08em] -top-[0.16em] h-[0.14em] w-[0.14em] rotate-[-45deg] text-support opacity-60" />
          Pulkit
        </span>
        <br />
        <span className="relative inline-block">
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
            View Projects →
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero.tsx
git commit -m "Add hero with approved name stack and star placement"
```

---

### Task 11: Marquee band

**Files:**
- Create: `src/components/marquee.tsx`

- [ ] **Step 1: Create `src/components/marquee.tsx`** (CSS keyframes from Task 2; duplicated row loops seamlessly; screen readers get a plain list)

```tsx
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
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/marquee.tsx
git commit -m "Add auto-scrolling marquee band"
```

---

### Task 12: Project cards (image fallback, featured poster, grid card)

**Files:**
- Create: `src/components/project-image.tsx`, `src/components/featured-card.tsx`, `src/components/project-card.tsx`

- [ ] **Step 1: Create `src/components/project-image.tsx`** — screenshot or designed placeholder

```tsx
import Image from "next/image";
import type { Project } from "@/lib/projects-shared";

export function ProjectImage({ project, className = "" }: { project: Project; className?: string }) {
  if (project.image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[repeating-linear-gradient(45deg,transparent,transparent_12px,color-mix(in_srgb,var(--support)_18%,transparent)_12px,color-mix(in_srgb,var(--support)_18%,transparent)_24px)] ${className}`}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {project.category}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/featured-card.tsx`**

```tsx
import type { Project } from "@/lib/projects-shared";
import { ProjectImage } from "@/components/project-image";

export function FeaturedCard({ project, number }: { project: Project; number: string }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-surface shadow-[0_6px_20px_rgba(17,24,68,0.10)] sm:flex">
      <div className="flex-1 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="font-display text-3xl text-display">{number}</span>
          <span className="rounded-full bg-badge px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-badge-ink">
            {project.category}
          </span>
        </div>
        <h3 className="mt-3 font-display text-[clamp(22px,3vw,32px)] uppercase leading-tight text-ink">
          {project.title}
        </h3>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t} className="rounded border border-support px-2 py-0.5 text-[11px] text-display">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-badge px-5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-badge-ink transition hover:opacity-90"
          >
            GitHub ↗
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink px-5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink transition hover:bg-ink/5"
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
      <ProjectImage project={project} className="min-h-[220px] sm:w-[38%]" />
    </article>
  );
}
```

- [ ] **Step 3: Create `src/components/project-card.tsx`** (thumbnail only when an image exists)

```tsx
import type { Project } from "@/lib/projects-shared";
import { ProjectImage } from "@/components/project-image";

export function ProjectCard({ project, number }: { project: Project; number: string }) {
  return (
    <article className="overflow-hidden rounded-xl bg-surface shadow-[0_4px_14px_rgba(17,24,68,0.08)]">
      {project.image && <ProjectImage project={project} className="aspect-video" />}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl text-display">{number}</span>
          <span className="rounded-full bg-badge px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-badge-ink">
            {project.category}
          </span>
        </div>
        <h3 className="mt-2 font-display text-lg uppercase leading-tight text-ink">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-support">
          <span>{project.tech.join(" · ")}</span>
        </div>
        <div className="mt-4 flex gap-4 text-[11px] font-bold uppercase tracking-[0.1em]">
          <a href={project.github} target="_blank" rel="noreferrer" className="text-ink transition hover:text-display">
            GitHub ↗
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="text-ink transition hover:text-display">
              Demo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/project-image.tsx src/components/featured-card.tsx src/components/project-card.tsx
git commit -m "Add featured poster card, grid card, and image fallback"
```

---

### Task 13: Projects section with category filter

**Files:**
- Create: `src/components/projects-section.tsx`

- [ ] **Step 1: Create `src/components/projects-section.tsx`**

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  activeCategories,
  filterProjects,
  type Category,
  type Project,
} from "@/lib/projects-shared";
import { FeaturedCard } from "@/components/featured-card";
import { ProjectCard } from "@/components/project-card";

const LABELS: Record<Category | "all", string> = {
  all: "All",
  genai: "GenAI",
  agents: "Agents",
  ml: "ML",
  other: "Other",
};

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const cats: (Category | "all")[] = ["all", ...activeCategories(projects)];
  const filtered = filterProjects(projects, category);
  const featuredFirst = filtered[0]?.featured === true;
  const gridItems = featuredFirst ? filtered.slice(1) : filtered;
  const num = (p: Project) => String(filtered.indexOf(p) + 1).padStart(2, "0");

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
      <h2 className="font-display text-[clamp(34px,5vw,52px)] uppercase leading-none text-ink">
        Selected <span className="text-display">Work</span>
      </h2>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition ${
              category === c
                ? "bg-badge text-badge-ink"
                : "border border-ink text-ink hover:bg-ink/5"
            }`}
          >
            {LABELS[c]}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-5">
        {featuredFirst && (
          <motion.div layout>
            <FeaturedCard project={filtered[0]} number="01" />
          </motion.div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          {gridItems.map((p) => (
            <motion.div layout key={p.slug}>
              <ProjectCard project={p} number={num(p)} />
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-muted">Nothing here yet.</p>}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects-section.tsx
git commit -m "Add projects section with category filter"
```

---

### Task 14: Stack + About sections

**Files:**
- Create: `src/components/stack-section.tsx`, `src/components/about-section.tsx`

- [ ] **Step 1: Create `src/components/stack-section.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/components/about-section.tsx`**

```tsx
import { site } from "@/config/site";
import { SparkField, type Mark } from "@/components/spark-field";

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
        <h2 className="font-display text-[clamp(34px,5vw,52px)] uppercase leading-none text-ink">
          The <span className="text-display">Human</span>
        </h2>
        <div className="mt-6 max-w-xl space-y-4">
          {site.bio.map((para) => (
            <p key={para} className="text-sm leading-relaxed text-muted">
              {para}
            </p>
          ))}
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-support">
            {site.education}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/stack-section.tsx src/components/about-section.tsx
git commit -m "Add stack and about sections"
```

---

### Task 15: Footer, favicon, full page assembly

**Files:**
- Create: `src/components/footer.tsx`, `public/favicon.svg`
- Modify: `src/app/page.tsx` (final assembly)

- [ ] **Step 1: Create `src/components/footer.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="#4B5694" d="M50 0C54 28 72 46 100 50 72 54 54 72 50 100 46 72 28 54 0 50 28 46 46 28 50 0Z"/></svg>
```

- [ ] **Step 3: Assemble the full page — replace `src/app/page.tsx`**

```tsx
import { loadProjects } from "@/lib/projects";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { ProjectsSection } from "@/components/projects-section";
import { StackSection } from "@/components/stack-section";
import { AboutSection } from "@/components/about-section";
import { Footer } from "@/components/footer";

export default function Home() {
  const projects = loadProjects();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <ProjectsSection projects={projects} />
        <StackSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Build and inspect**

```bash
npm run build
npx serve out
```

Open the printed URL. Verify against `docs/superpowers/references/hero-approved.html` and the spec: name stack with both stars placed correctly, badges row, marquee scrolling, featured card `01` + grid `02 03`, filter chips work, stack chips, about, navy footer. Toggle dark mode — twin palette everywhere. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Assemble full single-page portfolio with footer and favicon"
```

---

### Task 16: Verification sweep

**Files:** none created — this task verifies the whole spec.

- [ ] **Step 1: Run the full check suite**

```bash
npm run typecheck && npm test && npm run build
```

Expected: zero type errors, `10 passed`, build succeeds with TODO-CONTENT warnings only.

- [ ] **Step 2: Responsive pass**

```bash
npx serve out
```

In Chrome DevTools device toolbar check 360, 768, 1280, 1920 px in **both themes**: no horizontal scroll at 360 (the clamp()ed name fits), nav collapses links below 768 but keeps wordmark + resume + toggle, grid goes 1-col on mobile, footer buttons wrap.

- [ ] **Step 3: Reduced-motion pass**

DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce". Verify: marquee static, no parallax drift, page fully readable.

- [ ] **Step 4: Lighthouse**

DevTools → Lighthouse → run on the served `out/` build (production). Expected: ≥90 all categories, performance ≥95. If accessibility flags contrast or names, fix before proceeding.

- [ ] **Step 5: Keyboard pass**

Tab through the page: every link/button/chip/toggle shows the indigo focus ring; filter chips expose `aria-pressed`.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "Fix issues found in verification sweep"
```

(Skip the commit if nothing changed.)

---

### Task 17: README + deployment

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# pulkitgarg — portfolio

Single-page ML engineer portfolio. Next.js 15 static export, Tailwind v4, markdown content.
Design spec: `docs/superpowers/specs/2026-06-11-personal-website-design.md`.

## Develop

    npm install
    npm run dev        # http://localhost:3000
    npm test           # content pipeline tests
    npm run build      # static export to out/ (fails on invalid content)

## Add a project

Create `content/projects/<slug>.md`:

    ---
    title: "Project Name"
    summary: "Problem → what you built → result with a number."
    category: agents        # genai | agents | ml | other
    tech: [LangGraph, Python]
    github: https://github.com/you/repo
    demo: https://...       # optional
    image: /projects/slug.png  # optional; file goes in public/projects/
    featured: false         # exactly ONE project may be true
    order: 4
    ---

Push to `main` → Vercel deploys automatically.

## Content TODO before launch

- [ ] Replace TODO-CONTENT in `content/projects/*.md` (real stories with numbers)
- [ ] Replace TODO-CONTENT in `src/config/site.ts` (GitHub/LinkedIn URLs, bio, education)
- [ ] Drop `resume.pdf` into `public/`
- [ ] Project screenshots into `public/projects/` + `image:` frontmatter
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "Add README with content workflow"
```

- [ ] **Step 3: Create the GitHub repository and push** (needs Pulkit's GitHub account; use `gh` if authenticated, otherwise create the repo at github.com/new and follow its push instructions)

```bash
gh repo create personal-website --public --source . --push
```

Expected: repo visible on GitHub with full history.

- [ ] **Step 4: Connect Vercel (user-assisted, web UI)**

1. vercel.com → Add New Project → Import the `personal-website` repo (sign in with GitHub).
2. Framework preset auto-detects Next.js — accept defaults, Deploy.
3. Expected: live URL `https://personal-website-<hash>.vercel.app` serving the site; every push to `main` redeploys.

- [ ] **Step 5: Post-deploy smoke test**

Open the production URL on a phone: theme follows system, resume pill 404s until the PDF is added (expected — listed in README TODO), everything else works.

---

## Self-review notes

- **Spec coverage:** §3 stack → Tasks 1–2; §4 tokens/fonts/identity/field → Tasks 2, 8, 15; §5.1–5.8 sections → Tasks 9–15; §6 content model → Tasks 4, 6, 7; §7 data flow → Task 7/15; §8 error handling → Task 6 (validation), Task 12 (image fallback), Task 13 (empty state), Task 16 (reduced motion/responsive); §9–10 a11y/perf/testing → Tasks 5, 6, 16; §11 deployment → Task 17; §12 inputs → TODO-CONTENT markers + README checklist.
- **Featured-during-filter behavior:** featured poster shows whenever the featured project survives the filter (it sorts first); otherwise plain grid. Matches spec §5.4/§5.5.
- **Out of scope honored:** no blog, no contact form, no analytics, no detail pages.
