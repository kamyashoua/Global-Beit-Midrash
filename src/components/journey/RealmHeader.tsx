"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  eyebrow: string;
  description: string;
  Icon: LucideIcon;
  accentClass?: string;
};

export function RealmHeader({
  title,
  eyebrow,
  description,
  Icon,
  accentClass,
}: Props) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]"
      >
        <Icon
          className={cn("h-4 w-4", accentClass ?? "text-[var(--primary)]")}
          aria-hidden
        />
        {eyebrow}
      </motion.div>
      <motion.h2
        className="mt-6 font-display text-3xl font-semibold tracking-tight md:text-4xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        {description}
      </motion.p>
    </header>
  );
}
