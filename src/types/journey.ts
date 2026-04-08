import type { RealmId } from "./content";

/** Major stages through the experience */
export type JourneyStage =
  | "intro"
  | "metaphor"
  | "realm-values"
  | "realm-texts"
  | "realm-practices"
  | "island"
  | "reflection"
  | "gallery";

/** Ordered journey steps for navigation and progress UI */
export const JOURNEY_STEPS: { stage: JourneyStage; label: string }[] = [
  { stage: "intro", label: "Welcome" },
  { stage: "metaphor", label: "Metaphor" },
  { stage: "realm-values", label: "Values" },
  { stage: "realm-texts", label: "Texts" },
  { stage: "realm-practices", label: "Practices" },
  { stage: "island", label: "Island" },
  { stage: "reflection", label: "Reflection" },
  { stage: "gallery", label: "Archive" },
];

export const REALM_ORDER: RealmId[] = ["values", "texts", "practices"];

export const SELECTION_LIMITS: Record<RealmId, number> = {
  values: 3,
  texts: 2,
  practices: 3,
};

export type Selections = {
  values: string[];
  texts: string[];
  practices: string[];
};

/** Optional drag placements: item id → slot index on island (0–7) */
export type IslandPlacements = Record<string, number>;
