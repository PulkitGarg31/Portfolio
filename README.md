# Pulkit Garg Portfolio

Single-page portfolio (backend, agentic AI and ML). Next.js 15 static export, Tailwind v4, markdown content.

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
    category: agents        # genai | agents | data | ml | other (or a list of up to 3)
    tech: [FastAPI, Python] # up to 8
    github: https://github.com/you/repo
    demo: https://...       # optional
    demoNote: "..."         # optional; small line under the buttons (e.g. cold-start warning)
    image: /projects/slug.png  # optional; file goes in public/projects/
    featured: false         # at least one project must be true
    order: 4
    highlights:             # optional; up to 3 bullets shown on the card
      - "..."
    ---

Push to `main` → Vercel deploys automatically.

## Keep in sync with the resume

When the general resume changes, update these together:

- `public/Pulkit_Garg_Resume.pdf` (keep the file name; the navbar and footer link to it)
- `skills` in `src/config/site.ts`
- the project files' `tech`, `summary` and `highlights`
