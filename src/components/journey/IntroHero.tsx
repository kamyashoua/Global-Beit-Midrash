"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NPCDialogue } from "@/components/journey/NPCDialogue";
import { GUIDE_INTRO, INTRO_DIALOGUE } from "@/data/intro";

type IntroLine = (typeof INTRO_DIALOGUE)[number];

type Props = {
  dialogueLines: IntroLine[];
  dialogueIndex: number;
  onNextDialogue: () => void;
  onStart: () => void;
  /** Optional secondary control (e.g. “How it works” dialog trigger) */
  secondaryAction?: ReactNode;
};

export function IntroHero({
  dialogueLines,
  dialogueIndex,
  onNextDialogue,
  onStart,
  secondaryAction,
}: Props) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center px-4 pb-16 pt-10 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          <Compass className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
          Interactive Beit Midrash
        </div>
        <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--foreground)] md:text-6xl">
          The Island We Carry
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          {GUIDE_INTRO}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mx-auto mt-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/55 shadow-sm"
      >
        <Image
          src="/journey-map-light.svg"
          alt="Journey-themed map illustration"
          width={1200}
          height={700}
          className="h-auto w-full"
          priority
        />
      </motion.div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <NPCDialogue lines={dialogueLines} activeIndex={dialogueIndex} />
      </motion.div>

      <motion.div
        className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        {dialogueIndex < dialogueLines.length - 1 ? (
          <Button size="lg" type="button" onClick={onNextDialogue}>
            Continue
          </Button>
        ) : (
          <Button size="lg" type="button" onClick={onStart}>
            Begin the journey
          </Button>
        )}
        {secondaryAction}
      </motion.div>
    </div>
  );
}
