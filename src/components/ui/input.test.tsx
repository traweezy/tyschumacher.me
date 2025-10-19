import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input, Textarea } from "@/components/ui/input";

describe("Input primitives", () => {
  it("renders an input with merged classes", () => {
    render(<Input placeholder="Email" className="custom" />);

    const input = screen.getByPlaceholderText("Email");
    expect(input).toHaveClass("custom");
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders a textarea", () => {
    render(<Textarea placeholder="Message" className="textarea-extra" />);

    const textarea = screen.getByPlaceholderText("Message");
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveClass("textarea-extra");
  });
});
