import { getExperiences } from "@/lib/content";
import { Section } from "@/components/layout/section";
import { formatDateRange } from "@/lib/utils";

export const experienceHeadline = "High-leverage work across trading, sports, and media";
export const experienceCaption =
  "Recent roles where I’ve paired realtime systems with resilient delivery.";

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
      <ol className="experience-list">
        {items.map((item) => (
          <li key={`${item.company}-${item.start}`} className="experience-card">
            <div className="experience-card__meta type-body-sm">
              <span className="experience-card__company">{item.company}</span>
              <span className="experience-card__dates">
                {formatDateRange(item.start, item.end)} · {item.location}
              </span>
            </div>
            <h3 className="experience-card__role type-heading-3">{item.role}</h3>
            <ul className="experience-card__bullets type-body measure">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="text-pretty">
                  {bullet}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
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
