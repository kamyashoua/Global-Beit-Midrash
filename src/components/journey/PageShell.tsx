"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Optional realm tint for subtle atmosphere */
  realm?: "values" | "texts" | "practices" | "neutral";
};

const realmBg: Record<NonNullable<Props["realm"]>, string> = {
  neutral:
    "from-[#070b14] via-[#0c1428] to-[#0a1620]",
  values:
    "from-[#070b18] via-[#0f1c3a] to-[#0a1a28]",
  texts:
    "from-[#120f0a] via-[#1a1610] to-[#0f1816]",
  practices:
    "from-[#071412] via-[#0f2420] to-[#0a1a18]",
};

export function PageShell({ children, className, realm = "neutral" }: Props) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-x-hidden bg-[#070b14] text-[var(--foreground)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.12),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(94,234,212,0.08),transparent_50%)]"
        aria-hidden
      />
      <motion.div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b opacity-90",
          realmBg[realm],
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.95 }}
        transition={{ duration: 0.8 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cg fill=%22%23fff%22 fill-opacity=%220.35%22%3E%3Cpath d=%22M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 9.09l-5.83 5.83 1.41 1.41L20 11.91l4.42 4.42 1.41-1.41L20 9.09z%22/%3E%3C/g%3E%3C/svg%3E')]"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
