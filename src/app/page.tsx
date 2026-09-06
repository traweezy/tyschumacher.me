import { connection } from "next/server";
import { Hero } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";
import { AboutSection } from "@/components/sections/about";
import { ExperienceSection } from "@/components/sections/experience";
import { ContactSection } from "@/components/sections/contact";
import { SiteFooter } from "@/components/layout/site-footer";

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
