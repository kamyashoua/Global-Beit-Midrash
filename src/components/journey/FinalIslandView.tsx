"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
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

function Slot({
  slotIndex,
  item,
  activeDragId,
}: {
  slotIndex: number;
  item?: SelectableItem;
  activeDragId: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${slotIndex}` });
  const draggingThis = item && activeDragId === item.id;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex min-h-[88px] flex-col items-center justify-center rounded-2xl border border-dashed p-2 transition-colors md:min-h-[100px]",
        isOver
          ? "border-[var(--accent)] bg-[var(--accent)]/10"
          : "border-[var(--border)] bg-[var(--card)]/30",
        draggingThis && "opacity-40",
      )}
      aria-label={`Island slot ${slotIndex + 1}`}
    >
      {!item && (
        <span className="text-center text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
          Drop here
        </span>
      )}
      {item && !draggingThis && (
        <DraggableToken item={item} compact slotIndex={slotIndex} />
      )}
    </div>
  );
}

function DraggableToken({
  item,
  compact,
  slotIndex,
}: {
  item: SelectableItem;
  compact?: boolean;
  slotIndex?: number;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: { slotIndex },
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 text-left shadow-sm backdrop-blur-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        compact ? "w-full max-w-[200px] p-2" : "w-[220px] p-3",
        isDragging && "z-50 shadow-xl ring-2 ring-[var(--primary)]/40",
      )}
      {...listeners}
      {...attributes}
      aria-label={`Move ${item.title}`}
    >
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
  const { selections, placements, assignSlot } = useJourney();
  const [activeId, setActiveId] = useState<string | null>(null);

  const items = useMemo(() => expandSelections(selections), [selections]);

  const itemBySlot = useMemo(() => {
    const map: (SelectableItem | undefined)[] = Array.from(
      { length: 8 },
      () => undefined,
    );
    for (const it of items) {
      const s = placements[it.id];
      if (s !== undefined && s >= 0 && s < 8) {
        map[s] = it;
      }
    }
    // fill gaps if placements missing (hydration edge case)
    const unplaced = items.filter((it) => placements[it.id] === undefined);
    let u = 0;
    for (let i = 0; i < 8; i++) {
      if (!map[i] && unplaced[u]) {
        map[i] = unplaced[u];
        u++;
      }
    }
    return map;
  }, [items, placements]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const overId = String(over.id);
    if (!overId.startsWith("slot-")) return;
    const slotIndex = parseInt(overId.replace("slot-", ""), 10);
    if (Number.isNaN(slotIndex)) return;
    assignSlot(String(active.id), slotIndex);
  };

  const activeItem = activeId ? findSelectableById(activeId) : undefined;

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
          Drag your eight choices onto the island rings. Where you place them is
          part of the story—what sits at the center, what sits at the edge?
        </p>
      </motion.div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(String(e.active.id))}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="relative mx-auto mt-12 max-w-4xl">
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-gradient-to-b from-[#0f2038]/80 via-[#0b1628]/90 to-[#071018]/95 p-6 shadow-[0_0_80px_rgba(201,162,39,0.12)] md:p-10"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(201,162,39,0.25),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(94,234,212,0.15),transparent_40%)]" />
            <div className="relative mx-auto flex min-h-[320px] max-w-xl flex-col items-center justify-center">
              <div className="relative h-48 w-72 md:h-56 md:w-96">
                <svg
                  viewBox="0 0 400 240"
                  className="h-full w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="sand" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#c9a227" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#1c2b45" stopOpacity="0.9" />
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
                    stroke="rgba(201,162,39,0.35)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M120 150 C 150 130, 180 125, 210 128 C 250 132, 280 150, 290 175"
                    fill="none"
                    stroke="rgba(94,234,212,0.35)"
                    strokeWidth="1.2"
                    strokeDasharray="4 6"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--card)]/70 px-4 py-2 text-xs font-medium text-[var(--foreground)] shadow-lg backdrop-blur-md">
                    <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                    Your island
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Slot
                  key={i}
                  slotIndex={i}
                  item={itemBySlot[i]}
                  activeDragId={activeId}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <DragOverlay dropAnimation={{ duration: 180 }}>
          {activeItem ? <DraggableToken item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onContinue}>
          Continue to reflection
        </Button>
      </div>
    </div>
  );
}
