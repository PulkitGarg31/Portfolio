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
    expect(filterProjects(projects, "all")).toEqual(projects);
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

  it("returns empty array for no projects", () => {
    expect(activeCategories([])).toEqual([]);
  });
});
