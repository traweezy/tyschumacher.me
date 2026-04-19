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
      screen.getByText(/Builds calm software for high-pressure teams\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/12\+ years across finance, sports, and media/i)).toBeInTheDocument();
  });

  it("lists key skills and approach pillars in the about section", () => {
    render(<AboutSection />);

    expect(screen.getByRole("heading", { name: /Start with the operating moment/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Make failure instructive/i })).toBeInTheDocument();
    skills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
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
      screen.getByRole("heading", { name: /Need someone who can steady the product, the system, and the team/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/tyschumacher@proton\.me/i),
    ).not.toBeInTheDocument();
  });
});
