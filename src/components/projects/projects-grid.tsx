"use client";

import Image from "next/image";
import clsx from "clsx";
import type { Project } from "@/data/projects";
import type { ProjectSlot } from "./layout";
import styles from "./projects-grid.module.css";

type ProjectsGridProps = {
  projects: ProjectWithSlot[];
};

type ProjectWithSlot = Project & { layout: ProjectSlot };

const isExternalLink = (href: string) => /^https?:\/\//.test(href);

export const ProjectsGrid = ({ projects }: ProjectsGridProps) => (
  <div className={styles["projects-bento-grid"]}>
    {projects.map((project) => {
      const primaryLink = project.links[0];
      const tech = project.tech.slice(0, 3);

      return (
        <article
          key={project.slug}
          className={clsx(
            styles["projects-card"],
            styles[`tone-${project.layout.tone}`],
            styles[`area-${project.layout.area}`],
          )}
        >
          <header className={styles["projects-card__header"]}>
            <span className={styles["projects-card__eyebrow"]}>{project.year}</span>
            <h3 className={styles["projects-card__title"]}>{project.name}</h3>
          </header>
          <div className={styles["projects-card__media"]}>
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles["projects-card__image"]}
            />
          </div>
          <p className={styles["projects-card__summary"]}>{project.summary}</p>
          <p className={styles["projects-card__role"]}>{project.role}</p>
          {tech.length > 0 ? (
            <div className={styles["projects-card__tech"]}>
              {tech.map((item) => (
                <span key={item} className={styles["projects-card__chip"]}>
                  {item}
                </span>
              ))}
            </div>
          ) : null}
          {primaryLink ? (
            <div className={styles["projects-card__cta"]}>
              {primaryLink.href === "#" ? (
                <span className={styles["projects-card__link"]} aria-disabled="true">
                  {primaryLink.label}
                </span>
              ) : (
                <a
                  href={primaryLink.href}
                  className={styles["projects-card__link"]}
                  target={isExternalLink(primaryLink.href) ? "_blank" : undefined}
                  rel={isExternalLink(primaryLink.href) ? "noreferrer" : undefined}
                >
                  {primaryLink.label}
                </a>
              )}
            </div>
          ) : null}
        </article>
      );
    })}
  </div>
);
