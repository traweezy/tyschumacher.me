import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ExperienceEntry } from "@/data/experience";
import { renderWithProviders } from "@/test-utils/render-with-providers";

const getExperiencesMock = vi.fn<() => Promise<ExperienceEntry[]>>();

vi.mock("@/lib/content", () => ({
  getExperiences: () => getExperiencesMock(),
}));

describe("ExperienceSection", () => {
  const sampleExperiences: ExperienceEntry[] = [
    {
      company: "Company A",
      role: "Role A",
      start: "Jan 2020",
      location: "Remote",
      workTypes: [{ name: "Finance", icon: "finance", accentKey: "finance" }],
      stack: [
        { name: "React", icon: "react", accentKey: "react" },
        { name: "Go", icon: "go", accentKey: "go" },
      ],
      bullets: ["Built features", "Mentored teams"],
    },
    {
      company: "Company B",
      role: "Role B",
      start: "Feb 2018",
      end: "Mar 2020",
      location: "New York, NY",
      stack: [{ name: "Java", icon: "openjdk", accentKey: "java" }],
      bullets: ["Optimized performance"],
    },
  ];

  afterEach(() => {
    getExperiencesMock.mockReset();
  });

  it("renders fetched experience entries", async () => {
    getExperiencesMock.mockResolvedValueOnce(sampleExperiences);
    const { ExperienceSection } = await import("./experience");

    renderWithProviders(await ExperienceSection());

    expect(
      screen.getByRole("heading", {
        name: /experience across live products and internal platforms/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remote" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New York, NY" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Role A")).toBeInTheDocument();
    expect(screen.getByText("Jan 2020 · Present")).toBeInTheDocument();
    expect(screen.getByText("Feb 2018 · Mar 2020")).toBeInTheDocument();
    expect(
      screen.getByRole("list", {
        name: /work types, technologies, and skills used at Company A/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Remote" }));
    await waitFor(() => {
      const cards = Array.from(
        document.querySelectorAll<HTMLElement>(".experience-card"),
      );
      expect(cards).toHaveLength(1);
      expect(cards[0]?.textContent).toContain("Company A");
    });
  });

  it("renders skeleton placeholders", async () => {
    const { ExperienceSectionSkeleton } = await import("./experience");

    renderWithProviders(<ExperienceSectionSkeleton />);

    expect(
      screen.getByRole("region", { name: /experience/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem", { hidden: true })).toHaveLength(16);
  });
});
