import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Project } from "@/data/projects";
import type { ProjectSlot } from "@/components/projects/layout";
import { ProjectsGrid } from "@/components/projects/projects-grid";

const baseProject: Project = {
  slug: "test-project",
  name: "Test Project",
  summary: "Summary",
  description: "Description",
  role: "Engineer",
  tech: ["React", "TypeScript", "Vitest"],
  year: "2024",
  image: { src: "/image.svg", alt: "Screenshot" },
  links: [{ label: "View", href: "https://example.com" }],
};

const slot: ProjectSlot = { id: "flare", area: "flare", tone: "violet" };

describe("ProjectsGrid", () => {
  it("renders project content and external link", () => {
    render(
      <ProjectsGrid
        projects={[
          {
            ...baseProject,
            layout: slot,
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Test Project" })).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View" })).toHaveAttribute("target", "_blank");
    expect(screen.getAllByText(/React|TypeScript|Vitest/)).toHaveLength(3);
  });

  it("renders disabled call-to-action when link is unavailable", () => {
    render(
      <ProjectsGrid
        projects={[
          {
            ...baseProject,
            slug: "placeholder",
            name: "Placeholder",
            links: [{ label: "Coming soon", href: "#" }],
            tech: [],
            layout: slot,
          },
        ]}
      />,
    );

    expect(
      screen.getByText("Coming soon").getAttribute("aria-disabled"),
    ).toBe("true");
  });
});
