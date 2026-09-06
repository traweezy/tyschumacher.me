import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { ProjectsGrid } from "./projects-grid";

describe("ProjectsGrid", () => {
  it("shows curated projects in order with honest status and source links", () => {
    render(<ProjectsGrid projects={projects} />);
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((el) => el.textContent),
    ).toEqual([
      "Stackctl",
      "Remorseless Records",
      "Relantern",
      "QuantHelm",
      "tyschumacher.me",
    ]);
    expect(screen.getAllByText("Work in progress")).toHaveLength(3);
    expect(screen.getAllByText("Source private")).toHaveLength(1);
    expect(screen.getByText("Live", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("Released", { exact: true })).toBeInTheDocument();
    expect(screen.queryByText("Waypoint")).not.toBeInTheDocument();
    for (const project of projects) {
      expect(screen.getByText(project.availability)).toBeInTheDocument();
      expect(screen.getByText(project.contribution)).toBeInTheDocument();
      for (const link of project.links)
        expect(
          screen.getByRole("link", {
            name: `${link.label} for ${project.name}`,
          }),
        ).toHaveAttribute("href", link.href);
    }
    expect(screen.getAllByRole("img")).toHaveLength(5);
    for (const project of projects) {
      expect(
        screen.getByRole("img", { name: project.image.alt }),
      ).toHaveAttribute("src", project.image.src);
      expect(
        screen.getByRole("link", {
          name: `Open full screenshot of ${project.name}`,
        }),
      ).toHaveAttribute("href", project.image.src);
    }
    expect(
      screen.queryByRole("link", {
        name: /source for QuantHelm/,
      }),
    ).not.toBeInTheDocument();
  });
  it("ships engineering notes in HTML with native progressive disclosure", () => {
    const { container } = render(<ProjectsGrid projects={projects} />);
    expect(container.querySelectorAll("details")).toHaveLength(5);
    expect(container.querySelectorAll("details[open]")).toHaveLength(0);
    expect(
      screen.getByText(projects[0].decisions[0].detail),
    ).toBeInTheDocument();
    expect(container.querySelector('a[href="#"]')).toBeNull();
  });
});
