"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Line = { id: string; text: string };

type Props = {
  lines: Line[];
  activeIndex: number;
  className?: string;
};

export function NPCDialogue({ lines, activeIndex, className }: Props) {
  const line = lines[activeIndex];
  return (
    <Card
      className={cn(
        "border-[var(--border)] bg-[var(--card)]/80 shadow-[0_0_0_1px_rgba(201,162,39,0.15)]",
        className,
      )}
    >
      <CardContent className="flex gap-4 p-6 md:p-8">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/25 to-transparent ring-1 ring-[var(--primary)]/30"
          aria-hidden
        >
          <Quote className="h-6 w-6 text-[var(--primary)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Guide
          </p>
          <AnimatePresence mode="wait">
            {line && (
              <motion.p
                key={line.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="mt-2 font-display text-lg leading-relaxed text-[var(--foreground)] md:text-xl"
              >
                {line.text}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {lines.map((l, i) => (
              <span
                key={l.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i === activeIndex
                    ? "bg-[var(--primary)]"
                    : "bg-[var(--muted)]/60",
                )}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
