import {
  ExternalLink,
  FlaskConical,
  Globe,
  LockKeyhole,
  PackageOpen,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { GitHubIcon } from "@/components/ui/brand-icons";
import { TechnologyIcon } from "@/components/ui/technology-icons";
import type { Project, ProjectTechnology } from "@/data/projects";
import { newTabLinkProps } from "@/lib/link-behavior";
import styles from "./projects-grid.module.css";

type ProjectsGridProps = { projects: readonly Project[] };
type ProjectCardProps = { project: Project; index: number };
type ProjectScreenshotProps = {
  project: Project;
  theme: "light" | "dark" | "both";
};

const linkIcons = {
  source: GitHubIcon,
  staging: FlaskConical,
  demo: Globe,
  site: Globe,
  release: PackageOpen,
} as const;

export const ProjectTechnologies = memo<{
  technologies: readonly ProjectTechnology[];
  name: string;
}>(({ technologies, name }) => (
  <ul className={styles.tags} aria-label={`${name} technologies`}>
    {technologies.map((technology) => (
      <li key={technology.name} data-skill-accent={technology.icon}>
        <TechnologyIcon name={technology.icon} className={styles.technologyIcon} />
        <span>{technology.name}</span>
      </li>
    ))}
  </ul>
));
ProjectTechnologies.displayName = "ProjectTechnologies";

const ProjectScreenshot = memo<ProjectScreenshotProps>(({ project, theme }) => {
  const src =
    theme === "light" ? (project.image.lightSrc ?? project.image.src) : project.image.src;

  return (
    <a
      href={src}
      {...newTabLinkProps}
      aria-label={`Open full screenshot of ${project.name}`}
      className={styles.imageLink}
      data-screenshot-theme={theme}
      data-observe-click={`projects.${project.slug}.screenshot`}
    >
      <Image
        src={src}
        alt={project.image.alt}
        width={project.image.width}
        height={project.image.height}
        unoptimized={project.image.preoptimized ?? false}
        sizes="(min-width: 1280px) 720px, (min-width: 784px) 50vw, 100vw"
        className={styles.image}
      />
      <span className={styles.imageAction} aria-hidden="true">
        <ExternalLink size={15} /> View screenshot
      </span>
    </a>
  );
});
ProjectScreenshot.displayName = "ProjectScreenshot";

const ProjectCard = memo<ProjectCardProps>(({ project, index }) => (
  <article
    className={styles.card}
    id={`project-${project.slug}`}
    aria-labelledby={`${project.slug}-title`}
    data-project={project.slug}
  >
    <div className={styles.cardHeader}>
      <span className={styles.eyebrow}>
        {String(index + 1).padStart(2, "0")} / {project.category}
      </span>
      <span className={styles.status} data-status={project.status}>
        <span aria-hidden="true" />
        {project.status}
      </span>
    </div>
    <figure className={styles.figure}>
      {project.image.lightSrc ? (
        <>
          <ProjectScreenshot project={project} theme="light" />
          <ProjectScreenshot project={project} theme="dark" />
        </>
      ) : (
        <ProjectScreenshot project={project} theme="both" />
      )}
      <figcaption>{project.image.caption}</figcaption>
    </figure>
    <div className={styles.cardBody}>
      <div className={styles.titleRow}>
        <h3 id={`${project.slug}-title`} className={styles.title}>
          {project.name}
        </h3>
        <span className={styles.stage}>{project.stage}</span>
      </div>
      <p className={styles.summary}>{project.summary}</p>
      <p className={styles.description}>{project.description}</p>
      <ProjectTechnologies technologies={project.tech} name={project.name} />
      <div className={styles.access}>
        <div className={styles.links}>
          {project.links.map((link, linkIndex) => {
            const Icon = linkIcons[link.kind];
            return (
              <a
                key={link.href}
                href={link.href}
                {...newTabLinkProps}
                className={styles.link}
                aria-label={`${link.label} for ${project.name}`}
                data-observe-click={`projects.${project.slug}.link_${linkIndex}`}
              >
                <Icon width={17} height={17} aria-hidden="true" /> {link.label}
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            );
          })}
          {project.sourceVisibility === "private" ? (
            <span className={styles.privateSource}>
              <LockKeyhole size={15} aria-hidden="true" /> Source private
            </span>
          ) : null}
        </div>
        <p className={styles.availability}>{project.availability}</p>
      </div>
    </div>
    <details className={styles.notes}>
      <summary data-observe-click={`projects.${project.slug}.engineering_notes`}>
        My contribution & engineering notes
        <Plus size={18} className={styles.expandIcon} aria-hidden="true" />
      </summary>
      <div className={styles.notesBody}>
        <p className={styles.contribution}>{project.contribution}</p>
        <dl>
          {project.decisions.map((decision) => (
            <div key={decision.title}>
              <dt>{decision.title}</dt>
              <dd>{decision.detail}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.evidence}>
          <strong>Current state:</strong> {project.evidence}
        </p>
      </div>
    </details>
  </article>
));
ProjectCard.displayName = "ProjectCard";

export const ProjectsGrid = memo<ProjectsGridProps>(({ projects }) => (
  <div className={styles.grid}>
    {projects.map((project, index) => (
      <ProjectCard key={project.slug} project={project} index={index} />
    ))}
  </div>
));
ProjectsGrid.displayName = "ProjectsGrid";
