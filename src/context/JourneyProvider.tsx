"use client";

import React, {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { RealmId } from "@/types/content";
import { clearJourney, loadJourney, saveJourney } from "@/lib/journey-storage";
import type { IslandPlacements, JourneyStage, Selections } from "@/types/journey";
import { SELECTION_LIMITS, clampIslandPoint, normalizePlacements } from "@/types/journey";

type JourneyContextValue = {
  stage: JourneyStage;
  setStage: (s: JourneyStage) => void;
  selections: Selections;
  toggleSelect: (realm: RealmId, id: string) => void;
  reflection: string;
  setReflection: (t: string) => void;
  placements: IslandPlacements;
  setPlacements: (p: IslandPlacements) => void;
  /** Place an item on the island at the given position (percent of drop area) */
  placeItemAt: (itemId: string, x: number, y: number) => void;
  /** Remove item from island and send back to tray */
  unassignItem: (itemId: string) => void;
  /** When a realm selection limit is hit, which realm (translate with journey.limit.{realm}) */
  limitRealm: RealmId | null;
  clearLimitMessage: () => void;
  canAdvanceFromRealm: (realm: RealmId) => boolean;
  resetJourney: () => void;
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

const defaultSelections: Selections = {
  values: [],
  texts: [],
  practices: [],
};

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStageState] = useState<JourneyStage>("intro");
  const [selections, setSelections] = useState<Selections>(defaultSelections);
  const [reflection, setReflection] = useState("");
  const [placements, setPlacementsState] = useState<IslandPlacements>({});
  const [limitRealm, setLimitRealm] = useState<RealmId | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadJourney();
    startTransition(() => {
      if (saved?.selections) setSelections(saved.selections);
      if (saved?.stage) setStageState(saved.stage);
      if (typeof saved?.reflection === "string") setReflection(saved.reflection);
      if (saved?.placements && Object.keys(saved.placements).length > 0) {
        setPlacementsState(normalizePlacements(saved.placements));
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJourney({ stage, selections, reflection, placements });
  }, [hydrated, stage, selections, reflection, placements]);

  const setStage = useCallback((s: JourneyStage) => {
    setStageState(s);
  }, []);

  const clearLimitMessage = useCallback(() => setLimitRealm(null), []);

  useEffect(() => {
    if (!limitRealm) return;
    const t = window.setTimeout(() => setLimitRealm(null), 4200);
    return () => window.clearTimeout(t);
  }, [limitRealm]);

  const toggleSelect = useCallback((realm: RealmId, id: string) => {
    setSelections((prev) => {
      const list = prev[realm];
      const limit = SELECTION_LIMITS[realm];
      if (list.includes(id)) {
        return { ...prev, [realm]: list.filter((x) => x !== id) };
      }
      if (list.length >= limit) {
        setLimitRealm(realm);
        return prev;
      }
      return { ...prev, [realm]: [...list, id] };
    });
  }, []);

  const canAdvanceFromRealm = useCallback(
    (realm: RealmId) => {
      return selections[realm].length === SELECTION_LIMITS[realm];
    },
    [selections],
  );

  const setPlacements = useCallback((p: IslandPlacements) => {
    setPlacementsState(p);
  }, []);

  const placeItemAt = useCallback((itemId: string, x: number, y: number) => {
    setPlacementsState((prev) => ({
      ...prev,
      [itemId]: clampIslandPoint({ x, y }),
    }));
  }, []);

  const unassignItem = useCallback((itemId: string) => {
    setPlacementsState((prev) => {
      if (prev[itemId] === undefined) return prev;
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }, []);

  const resetJourney = useCallback(() => {
    clearJourney();
    setSelections(defaultSelections);
    setReflection("");
    setPlacementsState({});
    setStageState("intro");
    setLimitRealm(null);
  }, []);

  const value = useMemo(
    () => ({
      stage,
      setStage,
      selections,
      toggleSelect,
      reflection,
      setReflection,
      placements,
      setPlacements,
      placeItemAt,
      unassignItem,
      limitRealm,
      clearLimitMessage,
      canAdvanceFromRealm,
      resetJourney,
    }),
    [
      stage,
      setStage,
      selections,
      toggleSelect,
      reflection,
      placements,
      setPlacements,
      placeItemAt,
      unassignItem,
      limitRealm,
      clearLimitMessage,
      canAdvanceFromRealm,
      resetJourney,
    ],
  );

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used within JourneyProvider");
  return ctx;
}
