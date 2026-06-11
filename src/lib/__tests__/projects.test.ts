import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadProjects } from "@/lib/projects";

vi.mock("@/config/site", () => ({
  site: { github: "https://github.com/TODO-CONTENT" },
}));

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

  it("warns when the site config still contains TODO-CONTENT", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    loadProjects(fx("valid"));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("site.ts"));
  });

  it("throws naming the file and fields on invalid frontmatter", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => loadProjects(fx("invalid-frontmatter"))).toThrowError(
      /bad\.md.*title.*github/s,
    );
  });

  it("throws when no project is featured", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => loadProjects(fx("no-featured"))).toThrowError(/featured/);
  });

  it("throws when two projects are featured", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => loadProjects(fx("two-featured"))).toThrowError(/found 2/);
  });

  it("throws on an empty content directory", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => loadProjects(fx("empty"))).toThrowError(/No projects found/);
  });
});
