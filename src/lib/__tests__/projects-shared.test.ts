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
  categories: ["ml"],
  tech: ["Python"],
  github: "https://github.com/x/x",
  featured: false,
  order: 1,
  ...over,
});

describe("filterProjects", () => {
  const projects = [
    p({ slug: "a", categories: ["agents"] }),
    p({ slug: "b", categories: ["genai"] }),
    p({ slug: "c", categories: ["agents"] }),
  ];

  it("returns everything for 'all'", () => {
    expect(filterProjects(projects, "all")).toEqual(projects);
  });

  it("returns only the matching category", () => {
    expect(filterProjects(projects, "agents").map((x) => x.slug)).toEqual(["a", "c"]);
  });

  it("returns empty array when nothing matches", () => {
    expect(filterProjects(projects, "other")).toEqual([]);
  });

  it("matches a project under every category it carries", () => {
    const multi = [p({ slug: "m", categories: ["other", "genai"] })];
    expect(filterProjects(multi, "other").map((x) => x.slug)).toEqual(["m"]);
    expect(filterProjects(multi, "genai").map((x) => x.slug)).toEqual(["m"]);
    expect(filterProjects(multi, "ml")).toEqual([]);
  });
});

describe("activeCategories", () => {
  it("returns only categories present, in canonical order", () => {
    const projects = [p({ categories: ["ml"] }), p({ categories: ["genai"] })];
    expect(activeCategories(projects)).toEqual(["genai", "ml"]);
  });

  it("includes every category of a multi-category project", () => {
    const projects = [p({ categories: ["other", "genai"] })];
    expect(activeCategories(projects)).toEqual(["genai", "other"]);
  });

  it("returns empty array for no projects", () => {
    expect(activeCategories([])).toEqual([]);
  });
});
