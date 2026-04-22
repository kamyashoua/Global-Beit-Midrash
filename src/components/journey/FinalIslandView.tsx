"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type CollisionDetection,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Anchor, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJourney } from "@/context/JourneyProvider";
import { expandSelections, findSelectableById } from "@/lib/resolve-selections";
import { ItemIcon } from "@/lib/item-icons";
import type { SelectableItem } from "@/types/content";
import { cn } from "@/lib/utils";

const REALM_LABEL: Record<string, string> = {
  values: "Value",
  texts: "Text",
  practices: "Practice",
};

const islandPointerCollision: CollisionDetection = (args) => {
  const hit = pointerWithin(args);
  if (hit.length) return hit;
  return closestCenter(args);
};

function TokenFace({ item, sign }: { item: SelectableItem; sign?: boolean }) {
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
            {REALM_LABEL[item.category] ?? item.category}
          </span>
          <span className="block text-sm font-semibold leading-snug text-[var(--foreground)]">
            {item.title}
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
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none cursor-grab active:cursor-grabbing rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 text-left shadow-sm backdrop-blur-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        sign
          ? "relative w-full max-w-[200px] rounded-lg border-[#9a7a35]/45 bg-[#fffaf0]/90 p-2 shadow-[0_8px_18px_rgba(90,70,30,0.22)] md:max-w-[220px]"
          : compact
            ? "w-full max-w-[200px] p-2"
            : "w-[220px] p-3",
        isDragging && "z-50 shadow-xl ring-2 ring-[var(--primary)]/40",
      )}
      {...listeners}
      {...attributes}
      aria-label={`Move ${item.title}`}
    >
      <TokenFace item={item} sign={sign} />
    </button>
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const islandRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => expandSelections(selections), [selections]);

  const updatePointer = useCallback((e: PointerEvent) => {
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    window.addEventListener("pointermove", updatePointer, { capture: true });
    return () => window.removeEventListener("pointermove", updatePointer, { capture: true });
  }, [activeId, updatePointer]);

  const placedItems = useMemo(
    () => items.filter((it) => placements[it.id] !== undefined),
    [items, placements],
  );
  const unplacedItems = useMemo(
    () => items.filter((it) => placements[it.id] === undefined),
    [items, placements],
  );
  const placedCount = placedItems.length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const { setNodeRef: setTrayRef, isOver: trayIsOver } = useDroppable({
    id: "tray",
  });

  const { setNodeRef: setIslandDroppableRef, isOver: islandIsOver } = useDroppable({
    id: "island-canvas",
  });

  const setIslandRef = useCallback(
    (el: HTMLDivElement | null) => {
      islandRef.current = el;
      setIslandDroppableRef(el);
    },
    [setIslandDroppableRef],
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    const ev = event.activatorEvent;
    if (ev && "clientX" in ev && "clientY" in ev) {
      const pe = ev as PointerEvent;
      lastPointerRef.current = { x: pe.clientX, y: pe.clientY };
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const overId = String(over.id);
    if (overId === "tray") {
      unassignItem(String(active.id));
      return;
    }
    if (overId !== "island-canvas" || !islandRef.current) return;
    const rect = islandRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const p = lastPointerRef.current;
    const x = ((p.x - rect.left) / rect.width) * 100;
    const y = ((p.y - rect.top) / rect.height) * 100;
    placeItemAt(String(active.id), x, y);
  };

  const activeItem = activeId ? findSelectableById(activeId) : undefined;
  const onIsland = activeItem ? placements[activeItem.id] !== undefined : false;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          <Anchor className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
          Final assembly
        </p>
        <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight md:text-5xl">
          This is the future you chose to carry
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          Drag your eight choices onto the island. When placed, each one becomes
          a standing sign on the island. You can place them anywhere on the sand
          and drag again to move them.
        </p>
      </motion.div>

      <DndContext
        sensors={sensors}
        collisionDetection={islandPointerCollision}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="relative mx-auto mt-10 max-w-6xl">
          <motion.div
            className="relative overflow-visible rounded-[2rem] border border-[var(--border)] bg-gradient-to-b from-[#edf5ff] via-[#e5f0ff] to-[#f8fcff] p-6 pt-8 shadow-[0_20px_60px_rgba(54,120,212,0.14)] md:p-10 md:pt-12"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(circle_at_30%_20%,rgba(54,120,212,0.18),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(46,169,154,0.16),transparent_40%)]" />
            <div className="relative mx-auto flex min-h-[520px] max-w-5xl flex-col items-center justify-center">
              <div className="relative h-[360px] w-full max-w-[620px] overflow-visible py-2 md:h-[430px] md:max-w-[860px]">
                <svg
                  viewBox="0 0 400 240"
                  className="pointer-events-none h-full w-full drop-shadow-[0_24px_58px_rgba(0,0,0,0.28)]"
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
                    Your island
                  </div>
                </div>
                <div
                  ref={setIslandRef}
                  className={cn(
                    "absolute inset-0 z-20 touch-none rounded-[0.5rem] transition-shadow",
                    islandIsOver && "ring-2 ring-[var(--accent)]/60 ring-offset-2 ring-offset-transparent",
                  )}
                  aria-label="Island — drop signs anywhere on the sand"
                />
                <div className="absolute inset-0 z-30 pointer-events-none">
                  {placedItems.map((item) => {
                    const pos = placements[item.id]!;
                    const dimmed = activeId === item.id;
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
                        <div className={cn(dimmed && "opacity-40")}>
                          <DraggableToken item={item} compact sign />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="mb-2 text-center text-sm text-[var(--muted-foreground)]">
              Tip: place what matters most where your eye lands first, or keep it
              clustered — the layout is yours.
            </p>
            <p className="text-center text-xs font-medium text-[var(--muted-foreground)]">
              {placedCount} / 8 signs placed on the island
            </p>
          </motion.div>
        </div>

        <div
          ref={setTrayRef}
          className={cn("mx-auto mt-8 max-w-5xl", trayIsOver && "rounded-2xl")}
        >
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {unplacedItems.map((item) => (
              <DraggableToken key={item.id} item={item} />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={{ duration: 180 }}>
          {activeItem ? (
            <div
              className={cn(
                "cursor-grabbing rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 text-left shadow-xl ring-2 ring-[var(--primary)]/40 backdrop-blur-sm",
                onIsland
                  ? "relative w-full max-w-[200px] rounded-lg border-[#9a7a35]/45 bg-[#fffaf0]/90 p-2 shadow-[0_8px_18px_rgba(90,70,30,0.22)] md:max-w-[220px]"
                  : "w-[220px] p-3",
              )}
            >
              <TokenFace item={activeItem} sign={onIsland} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          disabled={placedCount < 8}
          aria-disabled={placedCount < 8}
        >
          Continue to reflection
        </Button>
      </div>
      {placedCount < 8 && (
        <p className="mt-3 text-center text-sm text-[var(--muted-foreground)]">
          Place all 8 signs on the island to continue.
        </p>
      )}
    </div>
  );
}
