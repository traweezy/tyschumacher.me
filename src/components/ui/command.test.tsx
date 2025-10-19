import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

describe("Command primitives", () => {
  it("shows empty state when no results are available", () => {
    render(
      <CommandDialog open>
        <Command data-testid="command-root">
          <CommandInput placeholder="Search commands" />
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
          </CommandList>
        </Command>
      </CommandDialog>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search commands")).toBeInTheDocument();
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("renders grouped items and separators", () => {
    render(
      <CommandDialog open>
        <Command data-testid="command-root">
          <CommandInput placeholder="Search commands" />
          <CommandList>
            <CommandGroup heading="General">
              <CommandItem value="item-1">Item one</CommandItem>
            </CommandGroup>
            <CommandSeparator data-testid="separator" />
          </CommandList>
        </Command>
      </CommandDialog>,
    );

    const item = screen.getByText("Item one");
    fireEvent.focus(item);
    expect(item).toBeInTheDocument();
    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });
});
