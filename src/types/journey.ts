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

/** Ordered journey steps — `labelKey` is looked up in locales (e.g. progress.steps.welcome) */
export const JOURNEY_STEPS: { stage: JourneyStage; labelKey: string }[] = [
  { stage: "intro", labelKey: "progress.steps.intro" },
  { stage: "metaphor", labelKey: "progress.steps.metaphor" },
  { stage: "realm-values", labelKey: "progress.steps.values" },
  { stage: "realm-texts", labelKey: "progress.steps.texts" },
  { stage: "realm-practices", labelKey: "progress.steps.practices" },
  { stage: "island", labelKey: "progress.steps.island" },
  { stage: "reflection", labelKey: "progress.steps.reflection" },
  { stage: "gallery", labelKey: "progress.steps.gallery" },
];

/**
 * After finishing the three realms, users can move freely among these
 * (build island, write reflection, preview archive) before publishing.
 */
export const POST_REALM_STAGES: readonly JourneyStage[] = [
  "island",
  "reflection",
  "gallery",
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

/** Percent (0–100) of island box — anchor is bottom center of the sign (post in sand) */
export type IslandPoint = { x: number; y: number };

/** Placed signs: item id → position on island */
export type IslandPlacements = Record<string, IslandPoint>;

/** Previous slot index (0–7) → percent position when migrating from older saves */
export const LEGACY_SLOT_TO_POINT: readonly IslandPoint[] = [
  { x: 28, y: 52 },
  { x: 38, y: 45 },
  { x: 50, y: 42 },
  { x: 62, y: 45 },
  { x: 72, y: 52 },
  { x: 64, y: 60 },
  { x: 50, y: 64 },
  { x: 36, y: 60 },
];

const MIN = 2;
const MAX = 98;

export function clampIslandPoint(p: IslandPoint): IslandPoint {
  return {
    x: Math.min(MAX, Math.max(MIN, p.x)),
    y: Math.min(MAX, Math.max(MIN, p.y)),
  };
}

/** Hydrate from localStorage: supports old slot index (number) and current {x,y} */
export function normalizePlacements(raw: unknown): IslandPlacements {
  if (!raw || typeof raw !== "object") return {};
  const out: IslandPlacements = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "number" && Number.isInteger(v) && v >= 0 && v < LEGACY_SLOT_TO_POINT.length) {
      out[k] = { ...LEGACY_SLOT_TO_POINT[v] };
    } else if (v && typeof v === "object" && "x" in v && "y" in v) {
      const p = v as { x: unknown; y: unknown };
      const x = Number(p.x);
      const y = Number(p.y);
      if (Number.isFinite(x) && Number.isFinite(y)) {
        out[k] = clampIslandPoint({ x, y });
      }
    }
  }
  return out;
}
