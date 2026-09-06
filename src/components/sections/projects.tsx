import { memo } from "react";
import { getProjects } from "@/lib/content";
import { Section } from "@/components/layout/section";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import styles from "@/components/projects/projects-grid.module.css";

export const projectsHeadline = "Selected projects";
export const projectsCaption =
  "Projects I’m building, with screenshots, demos, source code, and notes on the engineering.";

export const ProjectsSection = memo(() => (
  <Section
    id="projects"
    label="Projects"
    headline={projectsHeadline}
    caption={projectsCaption}
    contentClassName={styles.wrapper ?? ""}
  >
    <ProjectsGrid projects={getProjects()} />
  </Section>
));
ProjectsSection.displayName = "ProjectsSection";

export const ProjectsSectionSkeleton = memo(() => (
  <Section
    id="projects-loading"
    label="Projects"
    headline={projectsHeadline}
    caption={projectsCaption}
    contentClassName={styles.wrapper ?? ""}
  >
    <div className={styles.grid} aria-hidden="true">
      {getProjects().map((project) => (
        <div key={project.slug} className={styles.card}>
          <span className="skeleton block aspect-[1.44] w-full" />
          <div className={styles.cardBody}>
            <span className="skeleton block h-8 w-2/3 rounded" />
            <span className="skeleton block h-24 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  </Section>
));
ProjectsSectionSkeleton.displayName = "ProjectsSectionSkeleton";
