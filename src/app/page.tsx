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
