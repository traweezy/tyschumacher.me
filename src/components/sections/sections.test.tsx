import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ExperienceSection } from "@/components/sections/experience";
import { ContactSection } from "@/components/sections/contact";
import { experiences } from "@/data/experience";
import { skills } from "@/data/skills";
import { renderWithProviders } from "@/test-utils/render-with-providers";

describe("Section components", () => {
  it("renders hero with working principles", () => {
    render(<Hero />);

    expect(
      screen.getByRole("heading", { name: /Tyler Schumacher/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Software for teams that work live\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/State people can act on/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile snapshot/i)).toBeInTheDocument();
    expect(screen.queryByText(/Working console/i)).not.toBeInTheDocument();
  });

  it("lists key skills and approach pillars in the about section", () => {
    render(<AboutSection />);

    expect(
      screen.getByRole("heading", { name: /Find the pressure point/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Make the work readable/i }),
    ).toBeInTheDocument();
    skills.forEach((skill) => {
      expect(screen.getAllByText(skill).length).toBeGreaterThan(0);
    });
  });

  it("details recent experience entries", async () => {
    renderWithProviders(await ExperienceSection());

    experiences.forEach(({ company, bullets, stack, workTypes }) => {
      expect(screen.getByText(company)).toBeInTheDocument();
      workTypes?.forEach((workType) => {
        expect(screen.getAllByText(workType.name).length).toBeGreaterThan(0);
      });
      stack?.forEach((technology) => {
        expect(screen.getAllByText(technology.name).length).toBeGreaterThan(0);
      });
      bullets.forEach((bullet) => {
        expect(screen.getByText(bullet)).toBeInTheDocument();
      });
    });
  });

  it("provides contact guidance", () => {
    renderWithProviders(<ContactSection />);

    expect(
      screen.getByRole("heading", {
        name: /Have a product or platform problem worth untangling/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/tyschumacher@proton\.me/i),
    ).not.toBeInTheDocument();
  });
});
