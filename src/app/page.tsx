import { Suspense } from "react";
import { connection } from "next/server";
import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ExperienceSection, ExperienceSectionSkeleton } from "@/components/sections/experience";
import { ContactSection } from "@/components/sections/contact";
import { SiteFooter } from "@/components/layout/site-footer";

export default async function Home() {
  await connection();

  return (
    <>
      <Hero />
      <Suspense fallback={<ExperienceSectionSkeleton />}>
        <ExperienceSection />
      </Suspense>
      <AboutSection />
      <ContactSection />
      <SiteFooter />
    </>
  );
}
