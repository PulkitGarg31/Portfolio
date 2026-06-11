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
