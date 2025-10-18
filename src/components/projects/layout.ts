export type ProjectSlotId = "flare" | "orbit" | "pulse" | "vector" | "nova";

export type ProjectTone =
  | "violet"
  | "cyan"
  | "pink"
  | "blue"
  | "indigo";

export type ProjectSlot = {
  id: ProjectSlotId;
  area: ProjectSlotId;
  tone: ProjectTone;
};

export const PROJECT_SLOTS: readonly ProjectSlot[] = [
  { id: "flare", area: "flare", tone: "violet" },
  { id: "orbit", area: "orbit", tone: "cyan" },
  { id: "pulse", area: "pulse", tone: "pink" },
  { id: "vector", area: "vector", tone: "indigo" },
  { id: "nova", area: "nova", tone: "blue" },
];
