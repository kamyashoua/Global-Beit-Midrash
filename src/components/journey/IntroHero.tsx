"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageProvider";
import { INTRO_DIALOGUE } from "@/data/intro";
import { NPCDialogue } from "@/components/journey/NPCDialogue";

type Props = {
  dialogueIndex: number;
  onNextDialogue: () => void;
  onStart: () => void;
  secondaryAction?: ReactNode;
};

export function IntroHero({
  dialogueIndex,
  onNextDialogue,
  onStart,
  secondaryAction,
}: Props) {
  const { t } = useLanguage();
  const dialogueLines = useMemo(
    () =>
      INTRO_DIALOGUE.map((line) => ({
        id: line.id,
        text: t(`intro.dialogue.${line.id}`),
      })),
    [t],
  );

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
          {t("intro.badge")}
        </div>
        <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--foreground)] [overflow-wrap:anywhere] md:text-6xl">
          {t("intro.h1")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)] [overflow-wrap:anywhere] md:text-lg">
          {t("intro.guide")}
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
          alt={t("intro.mapAlt")}
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
            {t("intro.continue")}
          </Button>
        ) : (
          <Button size="lg" type="button" onClick={onStart}>
            {t("intro.beginJourney")}
          </Button>
        )}
        {secondaryAction}
      </motion.div>
    </div>
  );
}
