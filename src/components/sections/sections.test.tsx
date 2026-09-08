import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutSection } from "@/components/sections/about";
import { ContactSection } from "@/components/sections/contact";
import { ExperienceSection } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { experiences } from "@/data/experience";
import { skills } from "@/data/skills";
import { renderWithProviders } from "@/test-utils/render-with-providers";

describe("Section components", () => {
  it("renders hero with clear role and professional links", () => {
    const { container } = render(<Hero />);

    expect(
      screen.getByRole("heading", { name: /Tyler Schumacher/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Software for teams that work live\./i)).toBeInTheDocument();
    expect(screen.queryByText(/At a glance/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Professional profiles and resume" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download resume (PDF)" })).toHaveAttribute(
      "download",
    );
    expect(screen.queryByText(/Working console/i)).not.toBeInTheDocument();

    const art = container.querySelector(".hero__art");
    expect(art).toHaveAttribute("aria-hidden", "true");
    expect(art?.querySelectorAll(".hero__layer")).toHaveLength(3);
    expect(art?.querySelector(".hero__layer--backdrop")).toBeInTheDocument();
    expect(art?.querySelector(".hero__layer--technology")).toBeInTheDocument();
    expect(art?.querySelector(".hero__layer--skyline")).toBeInTheDocument();
  });

  it("lists key skills and approach pillars in the about section", () => {
    render(<AboutSection />);

    expect(
      screen.getByRole("heading", { name: /Understand the workflow/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Make behavior clear/i }),
    ).toBeInTheDocument();
    skills.forEach((skill) => {
      expect(screen.getAllByText(skill).length).toBeGreaterThan(0);
    });
  });

  it("details recent experience entries", async () => {
    renderWithProviders(<ExperienceSection />);

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
        name: /Let’s talk about your team/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
    expect(screen.queryByText(/tyschumacher@proton\.me/i)).not.toBeInTheDocument();
  });
});
