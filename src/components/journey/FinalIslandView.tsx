"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDndContext,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type CollisionDetection,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";
import { Anchor, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageProvider";
import { useJourney } from "@/context/JourneyProvider";
import { useItemCopy } from "@/hooks/useItemCopy";
import { expandSelections, findSelectableById } from "@/lib/resolve-selections";
import { ItemIcon } from "@/lib/item-icons";
import type { SelectableItem } from "@/types/content";
import { cn } from "@/lib/utils";

const ISLAND_DROP_ID = "island-canvas";

/** True if coordinates lie inside a client rect (inclusive of edges with tiny epsilon for float math). */
function isPointerInRect(
  p: { x: number; y: number } | null,
  rect: DOMRect,
): p is { x: number; y: number } {
  if (!p) return false;
  const pad = 1;
  return (
    p.x >= rect.left - pad &&
    p.x <= rect.right + pad &&
    p.y >= rect.top - pad &&
    p.y <= rect.bottom + pad
  );
}

/**
 * Drop detection must not lose the island to closestCenter when `pointerWithin`
 * is empty (seen on some touch/scroll cases), and must treat the full island
 * rect as a target even when signs sit above the sand in z-index.
 */
function makeIslandFirstCollision(
  islandElRef: RefObject<HTMLDivElement | null>,
): CollisionDetection {
  return (args) => {
    const { pointerCoordinates, droppableContainers } = args;
    const island = droppableContainers.find((c) => c.id === ISLAND_DROP_ID);
    const fromDom = islandElRef.current?.getBoundingClientRect();
    if (island && fromDom && isPointerInRect(pointerCoordinates, fromDom)) {
      return [
        {
          id: ISLAND_DROP_ID,
          data: { droppableContainer: island, value: 1 },
        },
      ];
    }
    return pointerWithin(args);
  };
}

function TokenFace({ item, sign }: { item: SelectableItem; sign?: boolean }) {
  const { t } = useLanguage();
  const copy = useItemCopy(item);
  const cat = t(`island.category.${item.category}`);
  return (
    <>
      {sign && (
        <span
          className="pointer-events-none absolute left-1/2 top-full h-8 w-[3px] -translate-x-1/2 rounded-full bg-[#8b6d2a]"
          aria-hidden
        />
      )}
      <span className="flex items-start gap-2">
        <ItemIcon name={item.icon} className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            {cat}
          </span>
          <span className="block text-sm font-semibold leading-snug text-[var(--foreground)] [overflow-wrap:anywhere]">
            {copy.title}
          </span>
        </span>
      </span>
    </>
  );
}

function DraggableToken({
  item,
  compact,
  sign,
}: {
  item: SelectableItem;
  compact?: boolean;
  sign?: boolean;
}) {
  const { t } = useLanguage();
  const copy = useItemCopy(item);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none select-none cursor-grab active:cursor-grabbing rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 text-left shadow-sm backdrop-blur-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        sign
          ? "relative w-full max-w-[200px] rounded-lg border-[#9a7a35]/45 bg-[#fffaf0]/90 p-2 shadow-[0_8px_18px_rgba(90,70,30,0.22)] md:max-w-[220px]"
          : compact
            ? "w-full max-w-[200px] p-2"
            : "w-[220px] p-3",
        isDragging && sign && "opacity-50",
        isDragging && "z-50 shadow-xl ring-2 ring-[var(--primary)]/40",
      )}
      {...listeners}
      {...attributes}
      aria-label={t("island.moveItem", { title: copy.title })}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") e.preventDefault();
      }}
    >
      <TokenFace item={item} sign={sign} />
    </div>
  );
}

/** DragOverlay reads from DnD context; keep outside parents that use setState on drag, which can cancel drags. */
function IslandDragOverlay() {
  const { active } = useDndContext();
  const { placements } = useJourney();
  const item = active ? findSelectableById(String(active.id)) : undefined;
  const onIsland = item ? placements[item.id] !== undefined : false;
  return (
    <DragOverlay dropAnimation={{ duration: 180 }}>
      {item ? (
        <div
          className={cn(
            "cursor-grabbing touch-none select-none rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 text-left shadow-xl ring-2 ring-[var(--primary)]/40 backdrop-blur-sm",
            onIsland
              ? "relative w-full max-w-[200px] rounded-lg border-[#9a7a35]/45 bg-[#fffaf0]/90 p-2 shadow-[0_8px_18px_rgba(90,70,30,0.22)] md:max-w-[220px]"
              : "w-[220px] p-3",
          )}
        >
          <TokenFace item={item} sign={onIsland} />
        </div>
      ) : null}
    </DragOverlay>
  );
}

export function FinalIslandView({
  onContinue,
  onBack,
}: {
  onContinue: () => void;
  onBack: () => void;
}) {
  const { selections, placements, placeItemAt, unassignItem } = useJourney();
  const { t } = useLanguage();
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const pointerCleanupRef = useRef<(() => void) | null>(null);
  const islandRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => expandSelections(selections), [selections]);

  const clearPointerTracker = useCallback(() => {
    pointerCleanupRef.current?.();
    pointerCleanupRef.current = null;
  }, []);

  useEffect(() => () => clearPointerTracker(), [clearPointerTracker]);

  const installPointerTracker = useCallback(() => {
    clearPointerTracker();
    const move = (e: PointerEvent) => {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    const end = () => {
      window.removeEventListener("pointermove", move, { capture: true });
      window.removeEventListener("pointerup", end, { capture: true });
      window.removeEventListener("pointercancel", end, { capture: true });
      pointerCleanupRef.current = null;
    };
    window.addEventListener("pointermove", move, { capture: true });
    window.addEventListener("pointerup", end, { capture: true });
    window.addEventListener("pointercancel", end, { capture: true });
    pointerCleanupRef.current = end;
  }, [clearPointerTracker]);

  const placedItems = useMemo(
    () => items.filter((it) => placements[it.id] !== undefined),
    [items, placements],
  );
  const unplacedItems = useMemo(
    () => items.filter((it) => placements[it.id] === undefined),
    [items, placements],
  );
  const placedCount = placedItems.length;

  // No activationConstraint: drag starts on pointer down (no “move N px first” / hold-then-drag feel).
  // A distance constraint would defer activation until the first move event, even with distance: 0.
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const islandCollision = useMemo(
    () => makeIslandFirstCollision(islandRef),
    [],
  );

  const { setNodeRef: setTrayRef, isOver: trayIsOver } = useDroppable({
    id: "tray",
  });

  const { setNodeRef: setIslandDroppableRef, isOver: islandIsOver } = useDroppable({
    id: ISLAND_DROP_ID,
  });

  const setIslandRef = useCallback(
    (el: HTMLDivElement | null) => {
      islandRef.current = el;
      setIslandDroppableRef(el);
    },
    [setIslandDroppableRef],
  );

  const handleDragStart = (event: DragStartEvent) => {
    const ev = event.activatorEvent;
    if (ev && "clientX" in ev && "clientY" in ev) {
      const pe = ev as PointerEvent;
      lastPointerRef.current = { x: pe.clientX, y: pe.clientY };
    }
    installPointerTracker();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    clearPointerTracker();
    const { active, over } = event;
    const activeIdStr = String(active.id);

    let overId: string | null = over ? String(over.id) : null;
    if (!overId && islandRef.current) {
      const rect = islandRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (isPointerInRect(lastPointerRef.current, rect)) {
          overId = ISLAND_DROP_ID;
        }
      }
    }
    if (!overId) return;
    if (overId === "tray") {
      unassignItem(activeIdStr);
      return;
    }
    if (overId !== ISLAND_DROP_ID || !islandRef.current) return;
    const rect = islandRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const p = lastPointerRef.current;
    const x = ((p.x - rect.left) / rect.width) * 100;
    const y = ((p.y - rect.top) / rect.height) * 100;
    placeItemAt(activeIdStr, x, y);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          <Anchor className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
          {t("island.eyebrow")}
        </p>
        <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight [overflow-wrap:anywhere] md:text-5xl">
          {t("island.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)] [overflow-wrap:anywhere] md:text-lg">
          {t("island.lead")}
        </p>
      </motion.div>

      <DndContext
        sensors={sensors}
        collisionDetection={islandCollision}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={clearPointerTracker}
      >
        <div className="relative mx-auto mt-10 max-w-6xl">
          {/*
            Avoid transform-based motion (y/scale) on ancestors of dnd-kit:
            translated/scaled parents break PointerSensor hit-testing and drags
            (e.g. tokens in the tray would not start dragging).
            Fade-only is safe.
          */}
          <motion.div
            className="relative overflow-visible rounded-[2rem] border border-[var(--border)] bg-gradient-to-b from-[#edf5ff] via-[#e5f0ff] to-[#f8fcff] p-6 pt-8 shadow-[0_20px_60px_rgba(54,120,212,0.14)] md:p-10 md:pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(circle_at_30%_20%,rgba(54,120,212,0.18),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(46,169,154,0.16),transparent_40%)]" />
            <div className="relative mx-auto flex min-h-[560px] max-w-6xl flex-col items-center justify-center md:min-h-[640px]">
              <div className="relative w-full min-h-[420px] h-[min(56vh,560px)] max-w-[min(100%,720px)] overflow-visible py-2 md:min-h-[500px] md:h-[min(60vh,640px)] md:max-w-[min(100%,1000px)]">
                <svg
                  viewBox="0 0 400 240"
                  preserveAspectRatio="xMidYMid meet"
                  className="pointer-events-none h-full w-full min-h-[320px] drop-shadow-[0_24px_58px_rgba(0,0,0,0.28)]"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="sand" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#fff0c9" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#d7e8ff" stopOpacity="0.92" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M60 180 C 80 120, 120 90, 200 88 C 280 86, 330 120, 350 175 C 360 200, 320 215, 200 218 C 100 220, 50 210, 60 180 Z"
                    fill="url(#sand)"
                    stroke="rgba(163,133,57,0.45)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M120 150 C 150 130, 180 125, 210 128 C 250 132, 280 150, 290 175"
                    fill="none"
                    stroke="rgba(46,169,154,0.4)"
                    strokeWidth="1.2"
                    strokeDasharray="4 6"
                  />
                </svg>
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                  <div className="flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--card)]/70 px-4 py-2 text-xs font-medium text-[var(--foreground)] shadow-lg backdrop-blur-md">
                    <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                    {t("island.yourIsland")}
                  </div>
                </div>
                <div
                  ref={setIslandRef}
                  className={cn(
                    "absolute inset-0 z-20 touch-none rounded-[0.5rem] transition-shadow",
                    islandIsOver && "ring-2 ring-[var(--accent)]/60 ring-offset-2 ring-offset-transparent",
                  )}
                  aria-label={t("island.dropAreaLabel")}
                />
                <div className="absolute inset-0 z-30 pointer-events-none">
                  {placedItems.map((item) => {
                    const pos = placements[item.id]!;
                    return (
                      <div
                        key={item.id}
                        className="pointer-events-auto absolute"
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                          transform: "translate(-50%, -100%)",
                        }}
                      >
                        <DraggableToken item={item} compact sign />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="mb-2 text-center text-sm text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
              {t("island.tip")}
            </p>
            <p className="text-center text-xs font-medium text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
              {t("island.placedCount", { count: placedCount })}
            </p>
          </motion.div>
        </div>

        <div
          ref={setTrayRef}
          className={cn(
            "relative z-20 mx-auto mt-8 max-w-5xl",
            trayIsOver && "rounded-2xl",
          )}
        >
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {unplacedItems.map((item) => (
              <DraggableToken key={item.id} item={item} />
            ))}
          </div>
        </div>

        <IslandDragOverlay />
      </DndContext>

      <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          {t("common.back")}
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          disabled={placedCount < 8}
          aria-disabled={placedCount < 8}
          className="[overflow-wrap:anywhere]"
        >
          {t("island.continueReflection")}
        </Button>
      </div>
      {placedCount < 8 && (
        <p className="mt-3 text-center text-sm text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
          {t("island.placeAll")}
        </p>
      )}
    </div>
  );
}
