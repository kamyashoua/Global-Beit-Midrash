"use client";

import { motion } from "framer-motion";
import type { JourneyStage } from "@/types/journey";
import { JOURNEY_STEPS } from "@/types/journey";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Props = {
  stage: JourneyStage;
  compact?: boolean;
};

export function ProgressTracker({ stage, compact }: Props) {
  const idx = JOURNEY_STEPS.findIndex((s) => s.stage === stage);
  const safeIdx = idx < 0 ? 0 : idx;
  const pct = Math.round((safeIdx / (JOURNEY_STEPS.length - 1)) * 100);

  return (
    <div
      className={cn(
        "border-b border-[var(--border)] bg-[var(--card)]/30 backdrop-blur-md",
        compact ? "px-3 py-3" : "px-4 py-4 md:px-8",
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Journey progress
        </p>
        <div className="flex min-w-0 flex-1 flex-col gap-2 md:max-w-3xl">
          <Progress value={pct} className="h-1.5" />
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-[var(--muted-foreground)] md:justify-between md:text-[11px]">
            {JOURNEY_STEPS.map((s, i) => {
              const active = i === safeIdx;
              const done = i < safeIdx;
              return (
                <motion.span
                  key={s.stage}
                  className={cn(
                    "whitespace-nowrap rounded-full px-2 py-0.5 transition-colors",
                    active &&
                      "bg-[var(--primary)]/15 font-semibold text-[var(--primary)]",
                    done && !active && "text-[var(--foreground)]/70",
                    !done && !active && "opacity-50",
                  )}
                  layout
                >
                  {s.label}
                </motion.span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
