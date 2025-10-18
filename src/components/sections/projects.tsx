import clsx from "clsx";
import { getProjects } from "@/lib/content";
import { Section } from "@/components/layout/section";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import styles from "@/components/projects/projects-grid.module.css";
import { PROJECT_SLOTS } from "@/components/projects/layout";

export const projectsHeadline =
  "Recent work that blends realtime UX with resilient delivery";
export const projectsCaption =
  "Curated highlights spanning trading, sports, and platform initiatives—built to survive stress tests and deliver measurable outcomes.";

export const ProjectsSection = async () => {
  const data = await getProjects();
  const slots = [...PROJECT_SLOTS];
  const projectsToShow = data
    .map((project) => ({ project, weight: Math.random() }))
    .sort((a, b) => a.weight - b.weight)
    .slice(0, slots.length)
    .map(({ project }) => project);
  const shuffledSlots = slots
    .map((slot) => ({ slot, weight: Math.random() }))
    .sort((a, b) => a.weight - b.weight)
    .map(({ slot }) => slot);

  const projectsWithLayout = projectsToShow.map((project, index) => ({
    ...project,
    layout: shuffledSlots[index],
  }));

  return (
    <Section
      id="projects"
      label="Projects"
      headline={projectsHeadline}
      caption={projectsCaption}
      contentClassName={styles["projects-grid-wrapper"]}
    >
      <ProjectsGrid projects={projectsWithLayout} />
    </Section>
  );
};

const placeholderCards = PROJECT_SLOTS;

export const ProjectsSectionSkeleton = () => (
  <Section
    id="projects"
    label="Projects"
    headline={projectsHeadline}
    caption={projectsCaption}
    contentClassName={styles["projects-grid-wrapper"]}
  >
    <div className={styles["projects-bento-grid"]} aria-hidden>
      {placeholderCards.map((slot) => (
        <article
          key={slot.id}
          className={clsx(
            styles["projects-card"],
            styles[`tone-${slot.tone}`],
            styles[`area-${slot.area}`],
            styles["projects-card--pending"],
          )}
        >
          <div className={styles["projects-card__header"]}>
            <span className="skeleton h-3 w-16 rounded-full" />
            <span className="skeleton h-6 w-2/3 rounded-full" />
          </div>
          <div className={clsx(styles["projects-card__media"], "skeleton")} />
          <span className="skeleton block h-4 w-11/12 rounded-full" />
          <span className="skeleton block h-4 w-8/12 rounded-full" />
          <div className={styles["projects-card__tech"]}>
            <span className="skeleton h-6 w-20 rounded-full" />
            <span className="skeleton h-6 w-16 rounded-full" />
            <span className="skeleton h-6 w-24 rounded-full" />
          </div>
          <div className={styles["projects-card__cta"]}>
            <span className="skeleton h-4 w-28 rounded-full" />
          </div>
        </article>
      ))}
    </div>
  </Section>
);
