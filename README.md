# pulkitgarg portfolio

Single-page ML engineer portfolio. Next.js 15 static export, Tailwind v4, markdown content.

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

## Content TODO before sharing the link

- [ ] Project screenshots into `public/projects/` + `image:` frontmatter
- [ ] Publish the Sellari, YouTube Chat, and Voca repos (their cards currently link to the GitHub profile)
