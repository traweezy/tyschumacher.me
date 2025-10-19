import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ExperienceSection, ExperienceSectionSkeleton } from "@/components/sections/experience";
import { ContactSection } from "@/components/sections/contact";
import { SiteFooter } from "@/components/layout/site-footer";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Suspense fallback={<ExperienceSectionSkeleton />}>
        <ExperienceSection />
      </Suspense>
      <ContactSection />
      <SiteFooter />
    </>
  );
}
