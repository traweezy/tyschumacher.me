import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/sections/hero", () => ({
  Hero: () => <div>Hero section</div>,
}));

vi.mock("@/components/sections/experience", () => ({
  ExperienceSection: () => <div>Experience content</div>,
  ExperienceSectionSkeleton: () => <div>Loading experience</div>,
}));

vi.mock("@/components/sections/about", () => ({
  AboutSection: () => <div>About content</div>,
}));

vi.mock("@/components/sections/contact", () => ({
  ContactSection: () => <div>Contact content</div>,
}));

vi.mock("@/components/layout/site-footer", () => ({
  SiteFooter: () => <footer>Footer content</footer>,
}));

describe("Home page", () => {
  it("renders each section and wraps experience in suspense", async () => {
    const pageModule = await import("./page");
    const Home = pageModule.default;

    render(<Home />);

    expect(screen.getByText("Hero section")).toBeInTheDocument();
    expect(screen.getByText("Experience content")).toBeInTheDocument();
    expect(screen.getByText("About content")).toBeInTheDocument();
    expect(screen.getByText("Contact content")).toBeInTheDocument();
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });
});
