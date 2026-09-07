"use client";

import type { MouseEvent } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import { TechnologyIcon } from "@/components/ui/technology-icons";
import type { ExperienceEntry } from "@/data/experience";
import { runViewTransition } from "@/lib/view-transitions";

const dedupe = (values: string[]): string[] => Array.from(new Set(values));

const filterExperiences = (
  experiences: ExperienceEntry[],
  filter: string,
): ExperienceEntry[] => {
  if (filter === "All") {
    return experiences;
  }
  return experiences.filter((experience) => experience.location.includes(filter));
};

const getExperienceDates = (experience: ExperienceEntry): string =>
  `${experience.start} to ${experience.end ?? "Present"}`;

const getExperienceChips = (experience: ExperienceEntry) => [
  ...(experience.workTypes ?? []),
  ...(experience.stack ?? []),
];

type ExperienceExplorerProps = {
  initialExperiences: ExperienceEntry[];
};

const ExperienceExplorerComponent = ({ initialExperiences }: ExperienceExplorerProps) => {
  const [locationFilter, setLocationFilter] = useState("All");
  const experiences = initialExperiences;

  const availableLocations = useMemo(() => {
    const locations = experiences.map((experience) => {
      const [location] = experience.location.split(" · ");
      return location ?? experience.location;
    });
    return ["All", ...dedupe(locations)];
  }, [experiences]);

  const filteredExperiences = useMemo(
    () =>
      filterExperiences(experiences, locationFilter === "All" ? "All" : locationFilter),
    [experiences, locationFilter],
  );

  const handleFilterClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const nextFilter = event.currentTarget.dataset.locationFilter;

      if (!nextFilter || nextFilter === locationFilter) {
        return;
      }

      runViewTransition(() => setLocationFilter(nextFilter));
    },
    [locationFilter],
  );

  return (
    <div className="experience-explorer">
      <fieldset className="experience-filters" aria-label="Filter experience by location">
        <div className="experience-filters__options">
          {availableLocations.map((option) => (
            <button
              key={option}
              type="button"
              onClick={handleFilterClick}
              data-location-filter={option}
              className={
                option === locationFilter
                  ? "experience-filter experience-filter--active"
                  : "experience-filter"
              }
              aria-pressed={option === locationFilter}
              data-observe-click={`experience.filter.${option.toLowerCase().replace(/\s+/g, "_")}`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="experience-timeline" aria-live="polite">
        <ol className="career-list" aria-label="Experience timeline">
          {filteredExperiences.map((item) => {
            const chips = getExperienceChips(item);

            return (
              <li
                key={`${item.company}-${item.start}`}
                className="career-entry"
                data-current={item.end ? undefined : "true"}
              >
                <div className="career-entry__period">
                  <p className="career-entry__dates">{getExperienceDates(item)}</p>
                  {!item.end && (
                    <span className="career-entry__current">Current role</span>
                  )}
                </div>
                <article className="experience-card">
                  <div className="experience-card__meta type-body-sm">
                    <span className="experience-card__company">{item.company}</span>
                    <span className="experience-card__location">{item.location}</span>
                  </div>
                  <h3 className="experience-card__role type-heading-3">{item.role}</h3>
                  {item.caseLog ? (
                    <dl className="experience-card__case-log">
                      {item.caseLog.map((entry) => (
                        <div key={entry.label} className="experience-card__case">
                          <dt>{entry.label}</dt>
                          <dd>{entry.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  <ul className="experience-card__bullets type-body measure">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="text-pretty">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  {chips.length ? (
                    <ul
                      className="experience-card__tech-list"
                      aria-label={`Work types, technologies, and skills used at ${item.company}`}
                    >
                      {chips.map((technology) => (
                        <li
                          key={`${technology.kind ?? "technology"}-${technology.name}`}
                          className="experience-card__tech"
                          data-chip-kind={technology.kind ?? "technology"}
                          data-skill-accent={technology.accentKey}
                        >
                          <span className="experience-card__tech-mark" aria-hidden="true">
                            <TechnologyIcon
                              name={technology.icon}
                              className="experience-card__tech-icon"
                            />
                          </span>
                          <span className="experience-card__tech-label">
                            {technology.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export const ExperienceExplorer = memo<ExperienceExplorerProps>(
  ExperienceExplorerComponent,
);

ExperienceExplorer.displayName = "ExperienceExplorer";
