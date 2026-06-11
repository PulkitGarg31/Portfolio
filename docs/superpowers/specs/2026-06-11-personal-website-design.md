# Personal Website — Design Spec

**Date:** 2026-06-11
**Owner:** Pulkit Garg
**Status:** Approved pending final user review

## 1. Purpose & success criteria

A personal portfolio site for Pulkit Garg, early-career ML engineer.

- **Primary goal:** land an ML/GenAI role. The first audience is recruiters and hiring managers; the site must communicate competence within seconds and make resume access one click from anywhere.
- **Secondary goal:** visibility in the ML community. Served by strong project presentation and outbound links (GitHub, LinkedIn) — explicitly **not** by a blog (decided: no blog, ever).
- **Success looks like:** a recruiter on a phone understands "ML engineer, builds GenAI/agentic systems, here's proof" inside 10 seconds, can reach the resume PDF in one click, and the site is memorable enough to stand out from template portfolios.

## 2. Scope

**In scope (v1):** single-page site, light + dark theme, projects from markdown files, resume PDF download, contact links, deployed free on Vercel.

**Out of scope (v1):** blog, CMS, contact form (mailto link suffices), per-project detail pages (cards link to GitHub), analytics, custom domain (free `.vercel.app` subdomain to start; custom domain can be pointed later without code changes), i18n.

## 3. Tech stack & architecture

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript | Matches Pulkit's existing stack — one stack to learn deeply |
| Rendering | Fully static (`output: 'export'`) | No server features needed; portable to any static host |
| Styling | Tailwind CSS v4 with CSS custom-property design tokens | Tokens make the light/dark twin palettes one source of truth |
| Theme switching | `next-themes` | Class-based dark mode, system-default detection, no flash on load, persisted choice |
| Motion | Framer Motion | Marquee, scroll reveals, spark rotation, background parallax |
| Display/body fonts | Anton + Inter via `next/font/google` | Self-hosted at build time: no layout shift, no runtime font requests |
| Content | Markdown files + `gray-matter`, validated with `zod` at build | "Adding a project = dropping in a markdown file" |
| Hosting | Vercel free tier, auto-deploy on push to `main` | Native Next.js host, zero config |

The site is one route (`/`). All content is read from the filesystem at build time; the only client-side state is the theme toggle, the project category filter, and animations.

## 4. Design system

Visual language: **poster-editorial**, derived from the CARZONE reference (`docs/superpowers/references/design-reference-carzone.png`): giant condensed display type, pill badges, marquee bands, numbered poster cards, and a sparse field of decorative marks. Loud but disciplined.

### 4.1 Palette

User-supplied palette (`docs/superpowers/references/palette.png`): `#111844` navy, `#4B5694` indigo, `#7288AE` steel, `#EAE0CF` cream.

Tokens and their mapping per mode:

| Token | Light | Dark |
|---|---|---|
| `--bg` (page) | `#EAE0CF` cream | `#111844` navy |
| `--surface` (cards) | `#FFFDF8` warm white | `#1A2254` raised navy |
| `--display` (giant type, accent words, numbers, CTAs) | `#4B5694` indigo | `#EAE0CF` cream |
| `--ink` (headings, body strong) | `#111844` navy | `#EAE0CF` cream |
| `--muted` (secondary text) | `#5A678A` | `#9FB0CC` |
| `--badge-bg` / `--badge-text` | `#111844` / `#EAE0CF` | `#EAE0CF` / `#111844` |
| `--accent-support` (borders, faint marks, tech chips) | `#7288AE` | `#4B5694`–`#7288AE` |
| Band/footer background | `#111844` | `#111844` + 1px `#7288AE` top border to separate from page |

Contrast: navy-on-cream ≈ 13:1, indigo-on-cream ≈ 5:1, cream-on-navy ≈ 12:1 — all pass WCAG AA in the roles above. Steel (`#7288AE`) is reserved for large/decorative elements and never used for body text on cream.

**Default mode: follow the visitor's system setting.** Sun/moon toggle in the nav overrides it; the override persists (localStorage via next-themes).

### 4.2 Typography

- **Anton** — display: hero name, section headings, sub-headline, marquee, card numbers/titles, wordmark. Uppercase, line-height ≈ 0.92–1.05, slight positive letter-spacing (Anton must never be fake-condensed or negative-tracked).
- **Inter** — everything else: nav links, badges, body, chips, buttons.

### 4.3 Identity

- **Logo:** wordmark `PULKIT GARG.` in Anton, ink color, with the period in `--display`. Top-left of nav.
- **Favicon:** the four-pointed spark ✦ in indigo on transparent.
- **Signature motif:** the four-pointed spark ✦ — used as marquee separator, the hero's star marks, and background field elements.

### 4.4 Background field

Each section gets a sparse scatter (~3–5 marks) of low-opacity decoration: ✦ sparks, thin `+` marks, 1.5px outline circles, 6–7px dots — steel/indigo at 25–38% opacity, placed near edges, **never behind text blocks**. Approved density: see hero reference (5 marks). Marks drift subtly on scroll (parallax, a few px); all motion gated behind `prefers-reduced-motion`.

## 5. Page structure

Eight sections, one scrolling page. Approved structure reference: `docs/superpowers/references/structure-approved.html` (sky-blue palette in that file is superseded by §4.1; structure unchanged). Approved hero reference (exact, in final palette): `docs/superpowers/references/hero-approved.html`.

### 5.1 Nav (sticky)

Wordmark left; right: PROJECTS / STACK / ABOUT anchor links, indigo **RESUME ↓** pill (downloads `/resume.pdf`), theme toggle. Sticky with backdrop blur once scrolled. On mobile (< 768px): anchor links are simply hidden — no hamburger menu (the page is one scroll; everything is reachable by scrolling). Wordmark, resume pill, and theme toggle remain.

### 5.2 Hero (approved, v5)

- Centered stack `PULKIT` / `GARG`, Anton, both lines equal size (`clamp()`-scaled, ~14vw capped at 140–165px desktop), `--display` color.
- **Big star:** 4-pointed ✦ in `--ink`, rotated −8°, tucked just below and right of the final **G**'s bottom-right corner — anchored relative to the name element (not the viewport) so it stays glued at all widths; size ≈ 0.4× line-height.
- **Small star:** ✦ in steel at 60% opacity, rotated −45° (points NW), floating just above the **P** of PULKIT.
- Badges row centered under the name: `ML ENGINEER` and `GENAI & AGENTIC AI` pills.
- Bottom-left: two-line Anton sub-headline `I BUILD AI SYSTEMS / THAT SHIP DIFFERENT`.
- Bottom-right: short positioning paragraph (≤ 25 words) + `VIEW PROJECTS →` pill (smooth-scrolls to §5.4).
- Background field per §4.4 (5 marks, approved positions in reference file).

### 5.3 Marquee band

Full-width navy band, Anton, auto-scrolling loop: `GENAI ✦ AGENTIC AI ✦ MACHINE LEARNING ✦ MLOPS ✦ …`. Pauses under `prefers-reduced-motion` (renders as static band).

### 5.4 Selected Work

- Heading `SELECTED WORK` (accent word in `--display`).
- Filter chips: `ALL / GENAI / AGENTS / ML` (+ `OTHER` only if any project uses it). Client-side filter, instant, no layout jank (animated reflow via Framer Motion layout).
- **Featured card** (the single project with `featured: true`): large poster card — Anton number `01`, category badge, Anton title, one-paragraph story (problem → what was built → result with a number), tech chips, `GITHUB ↗` + `LIVE DEMO ↗` buttons, screenshot/GIF filling the card's right ~38%.

### 5.5 Project grid

Remaining projects as cards in a responsive grid (2-up desktop, 1-up mobile), numbered `02, 03, …` in display color: number, category badge, title, two-line summary, tech list, GitHub link (+ demo link when present), optional thumbnail.

### 5.6 The Stack

Heading `THE STACK`. Skill chips grouped by category (e.g., Languages / ML & Data / GenAI & Agents / Infra & Tools) — pill chips on `--surface` band. No proficiency bars.

### 5.7 The Human

Heading `THE HUMAN`. 3–4 sentence first-person bio (who, what they're obsessed with building, what they're looking for), education line (degree — school — year), optional casual photo (if omitted, the layout fills with a background-field block instead).

### 5.8 Let's Talk (footer)

Navy band: giant Anton `LET'S TALK` in `--display`-on-dark, one-line availability blurb, buttons: `EMAIL ME` (mailto, cream/primary), `GITHUB`, `LINKEDIN`, `RESUME PDF` (outlined). Bottom line: `PULKIT GARG © <year>` / `BUILT WITH NEXT.JS — DESIGNED LOUD`.

## 6. Content model

```
content/
  projects/
    <slug>.md        # one file per project
public/
  resume.pdf
  projects/<slug>.png  # screenshots (optional per project)
src/
  config/site.ts     # all site-wide strings & links
```

### 6.1 Project frontmatter (zod-validated at build)

```yaml
title: "Agentic Research Assistant"      # required
summary: "Problem → built → result with a number."  # required, 1 short paragraph
category: agents                          # required: genai | agents | ml | other
tech: [LangGraph, Python, FastAPI]        # required, 1–8 items
github: https://github.com/...            # required URL
demo: https://...                         # optional URL
image: /projects/agentic-research.png     # optional; omitted → styled category placeholder
featured: true                            # exactly one project true
order: 1                                  # display order within the grid
```

Markdown body below the frontmatter is allowed but unused in v1 (reserved for future detail pages).

### 6.2 Site config (`src/config/site.ts`)

Name, role line, badge texts, sub-headline lines, positioning paragraph, marquee items, email, GitHub URL, LinkedIn URL, resume path, bio paragraphs, education line, skills grouped by category. **Every user-visible string lives here or in frontmatter — no strings buried in components.**

## 7. Data flow

Build time: `lib/projects.ts` reads `content/projects/*.md` → gray-matter parse → zod validate → sorted array (featured first, then `order`) → rendered into the static page. Updating the site = edit markdown/config → push → Vercel auto-builds. Runtime client state: theme, active filter, animations — nothing else.

## 8. Error handling & edge cases

- **Invalid/missing frontmatter, zero projects, or ≠1 featured project** → build fails with a message naming the file and field. A broken portfolio never deploys.
- **Missing project image** → designed placeholder (category-tinted diagonal stripes + category label), not a broken-image icon.
- **Filter with no matches** (e.g., OTHER hidden) → chip hidden entirely; categories are derived from actual content.
- **Name overflow** → hero name uses `clamp()` sizing tested 360px–4K; the star anchors to the text element so it never detaches.
- **Long titles/tech lists** → cards clamp to 2-line titles, max 8 chips.
- **Reduced motion** → marquee static, parallax/reveals/spin disabled, content fully visible.
- **No-JS / crawler** → full content renders (static HTML); filter chips and toggle are progressive enhancements.

## 9. Accessibility & performance

- WCAG AA contrast per §4.1; visible focus states (indigo ring) on all interactive elements; semantic landmarks (`nav/main/section/footer`); single `h1` (the hero name); badges and decorations `aria-hidden` where purely decorative; marquee content also available to screen readers as a plain list.
- Targets: Lighthouse ≥ 90 all categories (performance ≥ 95), LCP < 1.5s on 4G — realistic for a static page with self-hosted fonts and optimized images (`next/image` with static export config, or pre-sized images).

## 10. Testing & verification

- `tsc --noEmit` and `next build` green (build doubles as content validation).
- Manual visual pass at 360 / 768 / 1280 / 1920 px in both themes.
- Lighthouse run against the production build meets §9 targets.
- All outbound links (GitHub, demo, LinkedIn, resume) resolve.
- `prefers-reduced-motion` spot check.

## 11. Deployment

GitHub repository → Vercel (free) connected to `main`, auto-deploy on push. Site served at `<project>.vercel.app`; custom domain attachable later with zero code change. `.superpowers/` and build outputs are gitignored.

## 12. Inputs Pulkit must supply (during implementation)

1. Project list: for each — title, one-paragraph story with a number, category, tech list, GitHub URL, optional demo URL + screenshot.
2. Which single project is featured (01).
3. Bio (3–4 sentences) + education line — can be drafted together and edited.
4. Email, GitHub, LinkedIn URLs. *(Email on file: gargp6430@gmail.com — confirm which to publish.)*
5. `resume.pdf`.
6. Optional casual photo for The Human.

Implementation proceeds with realistic placeholders wherever these aren't ready; placeholders are clearly marked `TODO-CONTENT` so none ship unnoticed (build warns on any remaining).

## 13. Reference artifacts (committed)

- `docs/superpowers/references/design-reference-carzone.png` — original style reference
- `docs/superpowers/references/palette.png` — user-supplied palette
- `docs/superpowers/references/hero-approved.html` — approved hero (exact, final palette)
- `docs/superpowers/references/structure-approved.html` — approved section structure (pre-palette-swap)
