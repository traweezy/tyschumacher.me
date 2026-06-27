import { describe, expect, it } from "vitest";
import { cn, formatDateRange } from "@/lib/utils";

describe("utils", () => {
  it("merges class values and ignores falsey inputs", () => {
    expect(cn("base", false && "hidden", undefined, "mt-2")).toBe("base mt-2");
  });

  it("resolves Tailwind v4 arbitrary token conflicts", () => {
    expect(
      cn(
        "bg-[var(--surface-0)] text-[var(--text-secondary)]",
        "bg-[var(--accent)] text-[var(--accent-foreground)]",
      ),
    ).toBe("bg-[var(--accent)] text-[var(--accent-foreground)]");
  });

  it("resolves logical spacing and focus variant conflicts", () => {
    expect(
      cn(
        "scroll-mbs-20 px-4 focus-visible:ring-2",
        "scroll-mbs-24 px-6 focus-visible:ring-4",
      ),
    ).toBe("scroll-mbs-24 px-6 focus-visible:ring-4");
  });

  it("keeps independent state and motion variants intact", () => {
    expect(
      cn(
        "transition-all data-[state=open]:opacity-100 motion-reduce:transition-none",
        "data-[state=open]:opacity-0",
      ),
    ).toBe(
      "transition-all motion-reduce:transition-none data-[state=open]:opacity-0",
    );
  });

  it("formats date range with an end date", () => {
    expect(formatDateRange("Jan 2020", "Dec 2021")).toBe("Jan 2020 · Dec 2021");
  });

  it("formats date range with Present when end is omitted", () => {
    expect(formatDateRange("Jan 2022")).toBe("Jan 2022 · Present");
  });
});
