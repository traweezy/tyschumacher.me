import { describe, expect, it } from "vitest";
import { getExperiences, getProjects } from "@/lib/content";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";

describe("content utilities", () => {
  it("returns statically defined projects", () => {
    expect(getProjects()).toEqual(projects);
  });

  it("returns statically defined experiences", () => {
    expect(getExperiences()).toEqual(experiences);
  });
});
