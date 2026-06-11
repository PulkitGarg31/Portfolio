import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { CATEGORIES, type Project } from "@/lib/projects-shared";
import { site } from "@/config/site";

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
  if (JSON.stringify(site).includes("TODO-CONTENT")) {
    console.warn(
      "[content] src/config/site.ts still contains TODO-CONTENT placeholders",
    );
  }

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
