import { describe, expect, it } from "vitest";
import { cn, formatDateRange } from "@/lib/utils";

describe("utils", () => {
  it("merges class values and ignores falsey inputs", () => {
    expect(cn("base", false && "hidden", undefined, "mt-2")).toBe("base mt-2");
  });

  it("formats date range with an end date", () => {
    expect(formatDateRange("Jan 2020", "Dec 2021")).toBe("Jan 2020 · Dec 2021");
  });

  it("formats date range with Present when end is omitted", () => {
    expect(formatDateRange("Jan 2022")).toBe("Jan 2022 · Present");
  });
});
