"use client";

import type { IslandPlacements, JourneyStage, Selections } from "@/types/journey";

const STORAGE_KEY = "global-beit-midrash-island-v1";

export type PersistedJourney = {
  stage: JourneyStage;
  selections: Selections;
  reflection: string;
  placements: IslandPlacements;
  version: 1;
};

export function loadJourney(): Partial<PersistedJourney> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<PersistedJourney>;
  } catch {
    return null;
  }
}

export function saveJourney(data: Partial<PersistedJourney>) {
  if (typeof window === "undefined") return;
  try {
    const prev = loadJourney() ?? {};
    const next: PersistedJourney = {
      version: 1,
      stage: data.stage ?? prev.stage ?? "intro",
      selections: data.selections ?? prev.selections ?? {
        values: [],
        texts: [],
        practices: [],
      },
      reflection: data.reflection ?? prev.reflection ?? "",
      placements: data.placements ?? prev.placements ?? {},
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota / privacy mode
  }
}

export function clearJourney() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* empty */
  }
}

