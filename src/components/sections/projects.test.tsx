import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectsSection, ProjectsSectionSkeleton } from "./projects";

describe("ProjectsSection", () => {
  it("presents one curated selection with clear preview availability", () => {
    render(<ProjectsSection />);
    expect(
      screen.getByRole("region", { name: "Projects" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(
      screen.getByRole("link", {
        name: "View staging for Remorseless Records",
      }),
    ).toHaveAttribute(
      "href",
      "https://storefront-staging-41f0.up.railway.app/",
    );
    expect(
      screen.queryByRole("heading", { name: "More projects" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("TacticBoard")).not.toBeInTheDocument();
    expect(screen.queryByText("FlashOdds")).not.toBeInTheDocument();
    expect(
      screen.getByText("Public demo · synthetic data · no live trading"),
    ).toBeInTheDocument();
  });
  it("reserves a five-card loading structure", () => {
    const { container } = render(<ProjectsSectionSkeleton />);
    expect(
      screen.getByRole("region", { name: "Projects" }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".skeleton")).toHaveLength(15);
  });
});
