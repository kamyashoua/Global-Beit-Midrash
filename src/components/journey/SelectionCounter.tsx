"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  current: number;
  max: number;
  label: string;
};

export function SelectionCounter({ current, max, label }: Props) {
  const complete = current === max;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 md:px-5",
        complete
          ? "border-[var(--primary)]/40 bg-[var(--primary)]/10"
          : "border-[var(--border)] bg-[var(--card)]/50",
      )}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-sm tabular-nums",
            complete ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]",
          )}
        >
          {current} of {max} selected
        </span>
        {complete && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-[var(--primary)]/20 px-2 py-0.5 text-xs font-semibold text-[var(--primary)]"
          >
            Ready
          </motion.span>
        )}
      </div>
    </div>
  );
}
