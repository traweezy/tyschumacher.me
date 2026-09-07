import { connection } from "next/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { AboutSection } from "@/components/sections/about";
import { ContactSection } from "@/components/sections/contact";
import { ExperienceSection } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";

export default async function Home() {
  await connection();

  return (
    <>
      <Hero />
      <ProjectsSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
      <SiteFooter />
    </>
  );
}
