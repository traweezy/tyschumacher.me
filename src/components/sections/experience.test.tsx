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
      focus: "Product systems",
      mark: "CA",
      role: "Role A",
      start: "Jan 2020",
      location: "Remote",
      bullets: ["Built features", "Mentored teams"],
    },
    {
      company: "Company B",
      focus: "Trading tools",
      mark: "CB",
      role: "Role B",
      start: "Feb 2018",
      end: "Mar 2020",
      location: "New York, NY",
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
        name: /experience in trading, sportsbook, and media products/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remote" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New York, NY" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Role A")).toBeInTheDocument();
    expect(screen.getByText("Jan 2020 · Present · Remote")).toBeInTheDocument();
    expect(
      screen.getByText("Feb 2018 · Mar 2020 · New York, NY"),
    ).toBeInTheDocument();
    expect(screen.getByText("Product systems")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Remote" }));
    await waitFor(() => {
      const cards = Array.from(
        document.querySelectorAll<HTMLLIElement>(".experience-card"),
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
