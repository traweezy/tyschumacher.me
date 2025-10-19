import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "@/data/projects";
import { PROJECT_SLOTS } from "@/components/projects/layout";

const getProjectsMock = vi.fn<() => Promise<Project[]>>();
const projectsGridSpy = vi.fn(({ projects }: { projects: Array<Project & { layout: (typeof PROJECT_SLOTS)[number] }> }) => (
  <div data-testid="projects-grid" data-count={projects.length} />
));

vi.mock("@/lib/content", () => ({
  getProjects: () => getProjectsMock(),
}));

vi.mock("@/components/projects/projects-grid", () => ({
  ProjectsGrid: projectsGridSpy,
}));

describe("ProjectsSection", () => {
  const sampleProjects: Project[] = Array.from({ length: 6 }).map((_, index) => ({
    slug: `project-${index}`,
    name: `Project ${index}`,
    summary: "Summary",
    description: "Description",
    role: "Engineer",
    tech: [],
    year: "2024",
    image: { src: `/image-${index}.svg`, alt: "Alt" },
    links: [],
  }));

  beforeEach(() => {
    getProjectsMock.mockResolvedValue(sampleProjects);
    projectsGridSpy.mockClear();
  });

  it("shuffles projects and assigns slot layouts", async () => {
    const sequence = [
      0.9, 0.7, 0.1, 0.4, 0.2, 0.6, // project ordering
      0.3, 0.5, 0.8, 0.05, 0.95, // slot shuffling
    ];
    const randomSpy = vi.spyOn(Math, "random").mockImplementation(() => sequence.shift() ?? 0);

    const { ProjectsSection } = await import("./projects");
    render(await ProjectsSection());

    expect(screen.getByTestId("projects-grid")).toHaveAttribute(
      "data-count",
      PROJECT_SLOTS.length.toString(),
    );
    expect(projectsGridSpy).toHaveBeenCalledTimes(1);
    const [{ projects }] = projectsGridSpy.mock.calls[0] as [
      { projects: Array<Project & { layout: (typeof PROJECT_SLOTS)[number] }> },
    ];
    expect(projects).toHaveLength(PROJECT_SLOTS.length);
    const layoutIds = new Set(projects.map((item) => item.layout.id));
    expect(layoutIds.size).toBe(PROJECT_SLOTS.length);
    randomSpy.mockRestore();
  });

  it("renders skeleton placeholders", async () => {
    const { ProjectsSectionSkeleton } = await import("./projects");
    render(<ProjectsSectionSkeleton />);

    expect(
      screen.getByRole("region", { name: /projects/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("article", { hidden: true }),
    ).toHaveLength(PROJECT_SLOTS.length);
  });
});
