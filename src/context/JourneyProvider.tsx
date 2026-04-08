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
import {
  clearJourney,
  loadJourney,
  loadPublished,
  publishIsland,
  saveJourney,
  type StoredPublished,
} from "@/lib/journey-storage";
import type { IslandPlacements, JourneyStage, Selections } from "@/types/journey";
import { SELECTION_LIMITS } from "@/types/journey";

type JourneyContextValue = {
  stage: JourneyStage;
  setStage: (s: JourneyStage) => void;
  selections: Selections;
  toggleSelect: (realm: RealmId, id: string) => void;
  reflection: string;
  setReflection: (t: string) => void;
  placements: IslandPlacements;
  setPlacements: (p: IslandPlacements) => void;
  /** Place an item on a slot index (0–7); swaps with occupant if needed */
  assignSlot: (itemId: string, slotIndex: number) => void;
  limitMessage: string | null;
  clearLimitMessage: () => void;
  canAdvanceFromRealm: (realm: RealmId) => boolean;
  resetJourney: () => void;
  publishCurrent: (groupName: string) => void;
  publishedLocal: StoredPublished[];
  refreshPublished: () => void;
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

const defaultSelections: Selections = {
  values: [],
  texts: [],
  practices: [],
};

function initialPlacements(sel: Selections): IslandPlacements {
  const order = [...sel.values, ...sel.texts, ...sel.practices];
  const next: IslandPlacements = {};
  order.forEach((id, i) => {
    next[id] = i;
  });
  return next;
}

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStageState] = useState<JourneyStage>("intro");
  const [selections, setSelections] = useState<Selections>(defaultSelections);
  const [reflection, setReflection] = useState("");
  const [placements, setPlacementsState] = useState<IslandPlacements>({});
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [publishedLocal, setPublishedLocal] = useState<StoredPublished[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refreshPublished = useCallback(() => {
    setPublishedLocal(loadPublished());
  }, []);

  useEffect(() => {
    const saved = loadJourney();
    startTransition(() => {
      if (saved?.selections) setSelections(saved.selections);
      if (saved?.stage) setStageState(saved.stage);
      if (typeof saved?.reflection === "string") setReflection(saved.reflection);
      if (saved?.placements && Object.keys(saved.placements).length > 0) {
        setPlacementsState(saved.placements);
      }
      refreshPublished();
      setHydrated(true);
    });
  }, [refreshPublished]);

  useEffect(() => {
    if (!hydrated) return;
    saveJourney({ stage, selections, reflection, placements });
  }, [hydrated, stage, selections, reflection, placements]);

  const setStage = useCallback((s: JourneyStage) => {
    setStageState(s);
  }, []);

  const clearLimitMessage = useCallback(() => setLimitMessage(null), []);

  useEffect(() => {
    if (!limitMessage) return;
    const t = window.setTimeout(() => setLimitMessage(null), 4200);
    return () => window.clearTimeout(t);
  }, [limitMessage]);

  const toggleSelect = useCallback((realm: RealmId, id: string) => {
    setSelections((prev) => {
      const list = prev[realm];
      const limit = SELECTION_LIMITS[realm];
      if (list.includes(id)) {
        return { ...prev, [realm]: list.filter((x) => x !== id) };
      }
      if (list.length >= limit) {
        setLimitMessage(
          realm === "values"
            ? "You can carry only three values. Remove one to choose another."
            : realm === "texts"
              ? "You can carry only two texts. Remove one to choose another."
              : "You can carry only three practices. Remove one to choose another.",
        );
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

  const assignSlot = useCallback((itemId: string, slotIndex: number) => {
    setPlacementsState((prev) => {
      const next = { ...prev };
      const fromSlot = next[itemId];
      const occupant = Object.keys(next).find(
        (k) => k !== itemId && next[k] === slotIndex,
      );
      if (occupant !== undefined) {
        if (fromSlot !== undefined) {
          next[occupant] = fromSlot;
        } else {
          delete next[occupant];
        }
      }
      next[itemId] = slotIndex;
      return next;
    });
  }, []);

  const resetJourney = useCallback(() => {
    clearJourney();
    setSelections(defaultSelections);
    setReflection("");
    setPlacementsState({});
    setStageState("intro");
    setLimitMessage(null);
  }, []);

  const publishCurrent = useCallback(
    (groupName: string) => {
      const entry: StoredPublished = {
        id: `local-${Date.now()}`,
        savedAt: new Date().toISOString(),
        groupName: groupName.trim() || "Unnamed group",
        selections: { ...selections },
        reflection,
      };
      publishIsland(entry);
      refreshPublished();
    },
    [reflection, selections, refreshPublished],
  );

  // When leaving realms toward island, ensure placements exist
  useEffect(() => {
    if (stage !== "island" && stage !== "reflection" && stage !== "gallery")
      return;
    const total =
      selections.values.length +
      selections.texts.length +
      selections.practices.length;
    if (total < 8) return;
    startTransition(() => {
      setPlacementsState((prev) => {
        if (Object.keys(prev).length >= 8) return prev;
        return { ...initialPlacements(selections), ...prev };
      });
    });
  }, [stage, selections]);

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
      assignSlot,
      limitMessage,
      clearLimitMessage,
      canAdvanceFromRealm,
      resetJourney,
      publishCurrent,
      publishedLocal,
      refreshPublished,
    }),
    [
      stage,
      setStage,
      selections,
      toggleSelect,
      reflection,
      placements,
      setPlacements,
      assignSlot,
      limitMessage,
      clearLimitMessage,
      canAdvanceFromRealm,
      resetJourney,
      publishCurrent,
      publishedLocal,
      refreshPublished,
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
