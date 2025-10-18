import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { ProjectsSection, ProjectsSectionSkeleton } from "@/components/sections/projects";
import { ExperienceSection, ExperienceSectionSkeleton } from "@/components/sections/experience";
import { AboutSection } from "@/components/sections/about";
import { ContactSection } from "@/components/sections/contact";
import { SiteFooter } from "@/components/layout/site-footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<ProjectsSectionSkeleton />}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={<ExperienceSectionSkeleton />}>
        <ExperienceSection />
      </Suspense>
      <AboutSection />
      <ContactSection />
      <SiteFooter />
    </>
  );
}
