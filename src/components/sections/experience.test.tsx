import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ExperienceEntry } from "@/data/experience";

const getExperiencesMock = vi.fn<[], Promise<ExperienceEntry[]>>();

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
      bullets: ["Built features", "Mentored teams"],
    },
    {
      company: "Company B",
      role: "Role B",
      start: "Feb 2018",
      end: "Mar 2020",
      location: "NYC",
      bullets: ["Optimized performance"],
    },
  ];

  it("renders fetched experience entries", async () => {
    getExperiencesMock.mockResolvedValueOnce(sampleExperiences);
    const { ExperienceSection } = await import("./experience");

    render(await ExperienceSection());

    expect(screen.getByRole("heading", { name: /high leverage work/i })).toBeInTheDocument();
    expect(screen.getByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Role A")).toBeInTheDocument();
    expect(
      screen.getByText("Jan 2020 · Present · Remote"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Feb 2018 · Mar 2020 · NYC"),
    ).toBeInTheDocument();
  });

  it("renders skeleton placeholders", async () => {
    const { ExperienceSectionSkeleton } = await import("./experience");

    render(<ExperienceSectionSkeleton />);

    expect(
      screen.getByRole("region", { name: /experience/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem", { hidden: true })).toHaveLength(16);
  });
});
