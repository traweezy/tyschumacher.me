import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "@/components/layout/container";

describe("Container", () => {
  it("applies base and custom class names", () => {
    render(
      <Container className="custom-class" data-testid="container">
        Content
      </Container>,
    );

    const element = screen.getByTestId("container");
    expect(element).toHaveClass("mx-auto");
    expect(element).toHaveClass("custom-class");
    expect(element).toHaveTextContent("Content");
  });
});
