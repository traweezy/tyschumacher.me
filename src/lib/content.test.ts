import { describe, expect, it } from "vitest";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { getExperiences, getProjects } from "@/lib/content";

describe("content utilities", () => {
  it("returns statically defined projects", () => {
    expect(getProjects()).toEqual(projects);
  });

  it("returns statically defined experiences", () => {
    expect(getExperiences()).toEqual(experiences);
  });
});
