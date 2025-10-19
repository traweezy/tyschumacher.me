import { getExperiences } from "@/lib/content";
import { Section } from "@/components/layout/section";
import { ExperienceExplorer } from "@/components/sections/experience-explorer";

export const experienceHeadline = "High leverage work across trading, sports, and media";
export const experienceCaption =
  "Explore engagements across locations and teams, filtering to the contexts that matter most.";

export const ExperienceSection = async () => {
  const items = await getExperiences();

  return (
    <Section
      id="experience"
      label="Experience"
      headline={experienceHeadline}
      caption={experienceCaption}
      contentClassName="experience-grid"
    >
      <ExperienceExplorer initialExperiences={items} />
    </Section>
  );
};

export const ExperienceSectionSkeleton = () => (
  <Section
    id="experience"
    label="Experience"
    headline={experienceHeadline}
    caption={experienceCaption}
    contentClassName="experience-grid"
  >
    <ol className="experience-list" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="experience-card experience-card--pending">
          <div className="experience-card__meta type-body-sm">
            <span className="skeleton h-3 w-28 rounded-full" />
            <span className="skeleton h-3 w-32 rounded-full" />
          </div>
          <div className="skeleton h-5 w-2/3 rounded-full" />
          <ul className="experience-card__bullets type-body measure">
            <li>
              <span className="skeleton h-4 w-full rounded-full" />
            </li>
            <li>
              <span className="skeleton h-4 w-5/6 rounded-full" />
            </li>
            <li>
              <span className="skeleton h-4 w-3/4 rounded-full" />
            </li>
          </ul>
        </li>
      ))}
    </ol>
  </Section>
);
