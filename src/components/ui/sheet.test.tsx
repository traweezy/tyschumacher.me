import { render, screen } from "@testing-library/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { describe, expect, it } from "vitest";
import { Sheet, SheetContent } from "@/components/ui/sheet";

describe("Sheet primitives", () => {
  it("renders overlay and content when open", () => {
    render(
      <Sheet open>
        <SheetContent>
          <DialogPrimitive.Title>Panel heading</DialogPrimitive.Title>
          <DialogPrimitive.Description>Panel description</DialogPrimitive.Description>
          <p>Panel body</p>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByText("Panel body")).toBeInTheDocument();
    const overlay = document.body.querySelector("[data-state='open']");
    expect(overlay).toBeTruthy();
  });
});
