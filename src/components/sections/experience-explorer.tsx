"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { ExperienceEntry } from "@/data/experience";
import { useAccessibilityStore } from "@/state/accessibility-store";

const experienceQueryKey = ["experiences"] as const;

const fetchExperiences = async (): Promise<ExperienceEntry[]> => {
  const response = await fetch("/api/experience", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load experiences");
  }
  const payload = (await response.json()) as { experiences: ExperienceEntry[] };
  return payload.experiences;
};

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

type ExperienceExplorerProps = {
  initialExperiences: ExperienceEntry[];
};

export const ExperienceExplorer = ({ initialExperiences }: ExperienceExplorerProps) => {
  const [locationFilter, setLocationFilter] = useState("All");
  const prefersReducedMotion = useAccessibilityStore((state) => state.prefersReducedMotion);
  const [listRef, enableAnimations] = useAutoAnimate<HTMLOListElement>({
    duration: 220,
    easing: "ease-out",
    keyframes: [
      { transform: "translateY(12px)", opacity: 0 },
      { transform: "translateY(0px)", opacity: 1 },
    ],
    disrespectUserMotionPreference: true,
  });

  useEffect(() => {
    enableAnimations(!prefersReducedMotion);
  }, [prefersReducedMotion, enableAnimations]);

  const { data: experiences } = useQuery({
    queryKey: experienceQueryKey,
    queryFn: fetchExperiences,
    initialData: initialExperiences,
    staleTime: 5 * 60 * 1000,
  });

  const availableLocations = useMemo(() => {
    const locations = experiences.map((experience) => experience.location.split(" · ")[0]);
    return ["All", ...dedupe(locations)];
  }, [experiences]);

  const filteredExperiences = useMemo(
    () => filterExperiences(experiences, locationFilter === "All" ? "All" : locationFilter),
    [experiences, locationFilter],
  );

  return (
    <div className="experience-explorer">
      <fieldset className="experience-filters" aria-label="Filter experience by location">
        <legend className="type-body-sm text-[var(--text-secondary)]">View by location</legend>
        <div className="experience-filters__options">
          {availableLocations.map((option) => (
            <button
              key={option}
              type="button"
              className={
                option === locationFilter
                  ? "experience-filter experience-filter--active"
                  : "experience-filter"
              }
              onClick={() => setLocationFilter(option)}
              aria-pressed={option === locationFilter}
              data-observe-click={`experience.filter.${option.toLowerCase().replace(/\s+/g, "_")}`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>
      <ol ref={listRef} className="experience-list" aria-live="polite">
        {filteredExperiences.map((item) => (
          <li key={`${item.company}-${item.start}`} className="experience-card">
            <div className="experience-card__meta type-body-sm">
              <span className="experience-card__company">{item.company}</span>
              <span className="experience-card__dates">
                {item.start}
                {item.end ? ` · ${item.end}` : " · Present"}
                {` · ${item.location}`}
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
    </div>
  );
};
