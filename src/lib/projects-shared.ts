export const CATEGORIES = ["genai", "agents", "ml", "other"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category | "all", string> = {
  all: "All",
  genai: "GenAI",
  agents: "Agents",
  ml: "ML",
  other: "Full Stack & GenAI",
};

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
