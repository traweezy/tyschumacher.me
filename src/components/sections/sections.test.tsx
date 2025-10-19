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
  it("renders hero with focus areas", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { name: /Tyler Schumacher/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Full-stack engineer building realtime, high performance products./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Realtime platforms/i)).toBeInTheDocument();
  });

  it("lists key skills in the about section", () => {
    render(<AboutSection />);

    skills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it("details recent experience entries", async () => {
    render(await ExperienceSection());

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
      screen.getByRole("heading", { name: /Let’s build resilient/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/reach me directly/i)).toBeInTheDocument();
  });
});
