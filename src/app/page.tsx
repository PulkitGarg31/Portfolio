import { loadProjects } from "@/lib/projects";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { ProjectsSection } from "@/components/projects-section";
import { StackSection } from "@/components/stack-section";
import { AboutSection } from "@/components/about-section";
import { Footer } from "@/components/footer";

export default function Home() {
  const projects = loadProjects();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <ProjectsSection projects={projects} />
        <StackSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
