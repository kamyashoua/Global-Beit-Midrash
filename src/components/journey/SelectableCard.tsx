"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { SelectableItem } from "@/types/content";
import { cn } from "@/lib/utils";
import { ItemIcon } from "@/lib/item-icons";

type Props = {
  item: SelectableItem;
  selected: boolean;
  onToggle: () => void;
  realm: "values" | "texts" | "practices";
  index: number;
};

const realmStyles = {
  values: {
    ring: "ring-[#6ea8ff]/35",
    glow: "shadow-[0_0_0_1px_rgba(110,168,255,0.2)]",
    selectedBg: "bg-gradient-to-br from-[#1a2a4a]/90 to-[#0f1729]/90",
  },
  texts: {
    ring: "ring-[#e8c77b]/40",
    glow: "shadow-[0_0_0_1px_rgba(232,199,123,0.25)]",
    selectedBg: "bg-gradient-to-br from-[#2a2418]/95 to-[#14110c]/95",
  },
  practices: {
    ring: "ring-[#5eead4]/35",
    glow: "shadow-[0_0_0_1px_rgba(94,234,212,0.2)]",
    selectedBg: "bg-gradient-to-br from-[#0f2622]/95 to-[#0a1816]/95",
  },
} as const;

export function SelectableCard({
  item,
  selected,
  onToggle,
  realm,
  index,
}: Props) {
  const rs = realmStyles[realm];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="h-full"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        className={cn(
          "group relative flex h-full w-full flex-col rounded-2xl border text-left transition-all duration-300",
          "border-[var(--border)] bg-[var(--card)]/55 backdrop-blur-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]",
          "hover:-translate-y-0.5 hover:shadow-lg",
          selected &&
            cn(
              "ring-2 ring-offset-2 ring-offset-[#070b14]",
              rs.ring,
              rs.glow,
              rs.selectedBg,
            ),
        )}
      >
        <span className="flex items-start justify-between gap-3 p-5 md:p-6">
          <span className="flex min-w-0 items-start gap-3">
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 text-[var(--primary)] transition-colors",
                selected && "border-[var(--primary)]/40 bg-[var(--primary)]/15",
              )}
              aria-hidden
            >
              <ItemIcon name={item.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg font-semibold leading-snug text-[var(--foreground)]">
                {item.title}
              </span>
              <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                {item.subtitle}
              </span>
            </span>
          </span>
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all",
              selected
                ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border-[var(--border)] bg-transparent text-transparent group-hover:border-[var(--muted-foreground)]/40",
            )}
            aria-hidden={!selected}
          >
            <Check className={cn("h-4 w-4", !selected && "opacity-0")} />
          </span>
        </span>

        <span className="px-5 pb-2 text-sm leading-relaxed text-[var(--muted-foreground)] md:px-6">
          {item.description}
        </span>

        {item.quote && (
          <blockquote className="mx-5 mb-2 rounded-xl border border-[var(--border)] bg-[var(--input)]/50 px-4 py-3 text-sm italic leading-relaxed text-[var(--foreground)]/90 md:mx-6">
            “{item.quote}”
          </blockquote>
        )}

        {item.prompt && (
          <p className="mt-auto border-t border-[var(--border)]/80 px-5 py-4 text-xs leading-relaxed text-[var(--muted-foreground)] md:px-6">
            <span className="font-semibold text-[var(--accent)]/90">
              Reflect:{" "}
            </span>
            {item.prompt}
          </p>
        )}
      </button>
    </motion.div>
  );
}
