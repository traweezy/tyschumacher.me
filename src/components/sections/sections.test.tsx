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
  it("renders hero with proof points", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { name: /Tyler Schumacher/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Builds software that stays clear under pressure\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/12\+ years/i)).toBeInTheDocument();
  });

  it("lists key skills and approach pillars in the about section", () => {
    render(<AboutSection />);

    expect(screen.getByRole("heading", { name: /Start with the failure point/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Make the system legible/i })).toBeInTheDocument();
    skills.forEach((skill) => {
      expect(screen.getAllByText(skill).length).toBeGreaterThan(0);
    });
  });

  it("details recent experience entries", async () => {
    renderWithProviders(await ExperienceSection());

    experiences.forEach(({ company, bullets }) => {
      expect(screen.getByText(company)).toBeInTheDocument();
      bullets.forEach((bullet) => {
        expect(screen.getByText(bullet)).toBeInTheDocument();
      });
    });
  });

  it("provides contact guidance", () => {
    renderWithProviders(<ContactSection />);

    expect(
      screen.getByRole("heading", { name: /Need an engineer who can steady the work/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/tyschumacher@proton\.me/i),
    ).not.toBeInTheDocument();
  });
});
