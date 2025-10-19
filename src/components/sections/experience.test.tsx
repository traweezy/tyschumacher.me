import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ExperienceEntry } from "@/data/experience";
import { renderWithProviders } from "@/test-utils/render-with-providers";

const getExperiencesMock = vi.fn<() => Promise<ExperienceEntry[]>>();

const mockFetchResponse = (experiences: ExperienceEntry[]) =>
  Promise.resolve({
    ok: true,
    json: async () => ({ experiences }),
  } as Response);

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
      location: "New York, NY",
      bullets: ["Optimized performance"],
    },
  ];

  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation(() => mockFetchResponse(sampleExperiences));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    getExperiencesMock.mockReset();
  });

  it("renders fetched experience entries", async () => {
    getExperiencesMock.mockResolvedValueOnce(sampleExperiences);
    const { ExperienceSection } = await import("./experience");

    renderWithProviders(await ExperienceSection());

    expect(screen.getByRole("heading", { name: /high leverage work/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remote" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New York, NY" })).toBeInTheDocument();

    expect(screen.getByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Role A")).toBeInTheDocument();
    expect(screen.getByText("Jan 2020 · Present · Remote")).toBeInTheDocument();
    expect(screen.getByText("Feb 2018 · Mar 2020 · New York, NY")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Remote" }));
    await waitFor(() => {
      expect(document.querySelectorAll(".experience-card")).toHaveLength(1);
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
