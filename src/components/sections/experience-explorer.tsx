"use client";

import { memo, useCallback, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import type { ExperienceEntry } from "@/data/experience";

const EXPERIENCE_FILTER_SELECTOR = "[data-location-filter]";

const dedupe = (values: string[]): string[] => Array.from(new Set(values));

const filterExperiences = (
  experiences: ExperienceEntry[],
  filter: string,
): ExperienceEntry[] => {
  if (filter === "All") {
    return experiences;
  }
  return experiences.filter((experience) =>
    experience.location.includes(filter),
  );
};

type ExperienceExplorerProps = {
  initialExperiences: ExperienceEntry[];
};

const ExperienceExplorerComponent = ({
  initialExperiences,
}: ExperienceExplorerProps) => {
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
      filterExperiences(
        experiences,
        locationFilter === "All" ? "All" : locationFilter,
      ),
    [experiences, locationFilter],
  );

  const handleFilterClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const filterButton =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>(EXPERIENCE_FILTER_SELECTOR)
        : null;
    const nextFilter = filterButton?.dataset.locationFilter;

    if (!nextFilter) {
      return;
    }

    setLocationFilter(nextFilter);
  }, []);

  return (
    <div className="experience-explorer">
      <fieldset
        className="experience-filters"
        aria-label="Filter experience by location"
      >
        <div
          className="experience-filters__options"
          onClick={handleFilterClick}
        >
          {availableLocations.map((option) => (
            <button
              key={option}
              type="button"
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
      <ol className="experience-list experience-timeline" aria-live="polite">
        {filteredExperiences.map((item) => (
          <li key={`${item.company}-${item.start}`} className="experience-card">
            <div className="experience-card__rail" aria-hidden="true">
              <span className="experience-card__mark">{item.mark}</span>
            </div>
            <article className="experience-card__content">
              <div className="experience-card__meta type-body-sm">
                <span className="experience-card__company">{item.company}</span>
                <span className="experience-card__dates">
                  {item.start}
                  {item.end ? ` · ${item.end}` : " · Present"}
                  {` · ${item.location}`}
                </span>
              </div>
              <h3 className="experience-card__role type-heading-3">
                {item.role}
              </h3>
              <ul className="experience-card__bullets type-body measure">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="text-pretty">
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
            <div className="experience-card__brand" aria-hidden="true">
              <span className="experience-card__brand-mark">{item.mark}</span>
              <span className="experience-card__brand-label">{item.focus}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export const ExperienceExplorer = memo<ExperienceExplorerProps>(
  ExperienceExplorerComponent,
);

ExperienceExplorer.displayName = "ExperienceExplorer";
