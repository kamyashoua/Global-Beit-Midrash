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
    "from-[#f4f8ff] via-[#eaf3ff] to-[#eef8ff]",
  values:
    "from-[#f3f7ff] via-[#e0ecff] to-[#e8f5ff]",
  texts:
    "from-[#f9f7f1] via-[#f6f2e7] to-[#eff7f3]",
  practices:
    "from-[#edf8f6] via-[#e3f7f3] to-[#edf7ff]",
};

export function PageShell({ children, className, realm = "neutral" }: Props) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-x-hidden bg-[#f4f8ff] text-[var(--foreground)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(54,120,212,0.16),transparent_58%),radial-gradient(ellipse_at_bottom,rgba(46,169,154,0.12),transparent_52%)]"
        aria-hidden
      />
      <motion.div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b opacity-95",
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
