"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame, Gem, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageProvider";
import { useJourney } from "@/context/JourneyProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PRACTICES, TEXTS, VALUES } from "@/data";
import { INTRO_DIALOGUE } from "@/data/intro";
import type { JourneyStage } from "@/types/journey";
import { FinalIslandView } from "@/components/journey/FinalIslandView";
import { IntroHero } from "@/components/journey/IntroHero";
import { MetaphorExplanation } from "@/components/journey/MetaphorExplanation";
import { PageShell } from "@/components/journey/PageShell";
import { PreviousIslandsGallery } from "@/components/journey/PreviousIslandsGallery";
import { ProgressTracker } from "@/components/journey/ProgressTracker";
import { RealmScreen } from "@/components/journey/RealmScreen";
import { ReflectionPanel } from "@/components/journey/ReflectionPanel";
import { ResetJourneyButton } from "@/components/journey/ResetJourneyButton";

function stageRealm(
  stage: JourneyStage,
): "values" | "texts" | "practices" | "neutral" {
  if (stage === "realm-values") return "values";
  if (stage === "realm-texts") return "texts";
  if (stage === "realm-practices") return "practices";
  return "neutral";
}

export function JourneyExperience() {
  const {
    stage,
    setStage,
    selections,
    toggleSelect,
    canAdvanceFromRealm,
    limitRealm,
    reflection,
    setReflection,
    resetJourney,
    clearLimitMessage,
  } = useJourney();

  const [dialogueIndex, setDialogueIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    clearLimitMessage();
  }, [stage, clearLimitMessage]);

  const shellRealm = stageRealm(stage);

  return (
    <PageShell realm={shellRealm}>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[#f4f8ff]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 md:px-8">
          <p className="min-w-0 max-w-[55%] font-display text-sm font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:max-w-none sm:text-base md:text-lg">
            {t("nav.title")}
          </p>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageToggle className="shrink-0" />
            <ResetJourneyButton />
          </div>
        </div>
        {stage !== "intro" && (
          <ProgressTracker
            stage={stage}
            onPostRealmNavigate={setStage}
          />
        )}
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {stage === "intro" && (
            <IntroHero
              dialogueIndex={dialogueIndex}
              onNextDialogue={() =>
                setDialogueIndex((i) =>
                  Math.min(i + 1, INTRO_DIALOGUE.length - 1),
                )
              }
              onStart={() => setStage("metaphor")}
              secondaryAction={
                <MetaphorExplanation
                  variant="dialog-trigger"
                  trigger={
                    <Button size="lg" variant="secondary" type="button">
                      {t("intro.howItWorks")}
                    </Button>
                  }
                />
              }
            />
          )}

          {stage === "metaphor" && (
            <MetaphorExplanation
              variant="full"
              onContinue={() => setStage("realm-values")}
            />
          )}

          {stage === "realm-values" && (
            <RealmScreen
              realm="values"
              title={t("journey.values.title")}
              eyebrow={t("journey.values.eyebrow")}
              description={t("journey.values.description")}
              Icon={Gem}
              accentClass="text-[#8ab4ff]"
              items={VALUES}
              selectedIds={selections.values}
              onToggle={(id) => toggleSelect("values", id)}
              onBack={() => setStage("metaphor")}
              onNext={() => setStage("realm-texts")}
              canAdvance={canAdvanceFromRealm("values")}
              limitRealm={limitRealm}
            />
          )}

          {stage === "realm-texts" && (
            <RealmScreen
              realm="texts"
              title={t("journey.texts.title")}
              eyebrow={t("journey.texts.eyebrow")}
              description={t("journey.texts.description")}
              Icon={ScrollText}
              accentClass="text-[#e8c77b]"
              items={TEXTS}
              selectedIds={selections.texts}
              onToggle={(id) => toggleSelect("texts", id)}
              onBack={() => setStage("realm-values")}
              onNext={() => setStage("realm-practices")}
              canAdvance={canAdvanceFromRealm("texts")}
              limitRealm={limitRealm}
            />
          )}

          {stage === "realm-practices" && (
            <RealmScreen
              realm="practices"
              title={t("journey.practices.title")}
              eyebrow={t("journey.practices.eyebrow")}
              description={t("journey.practices.description")}
              Icon={Flame}
              accentClass="text-[#5eead4]"
              items={PRACTICES}
              selectedIds={selections.practices}
              onToggle={(id) => toggleSelect("practices", id)}
              onBack={() => setStage("realm-texts")}
              onNext={() => setStage("island")}
              canAdvance={canAdvanceFromRealm("practices")}
              limitRealm={limitRealm}
            />
          )}

          {stage === "island" && (
            <FinalIslandView
              onBack={() => setStage("realm-practices")}
              onContinue={() => setStage("reflection")}
            />
          )}

          {stage === "reflection" && (
            <ReflectionPanel
              value={reflection}
              onChange={setReflection}
              onBack={() => setStage("island")}
              onContinue={() => setStage("gallery")}
            />
          )}

          {stage === "gallery" && (
            <PreviousIslandsGallery
              onBackToIsland={() => setStage("island")}
              onBackToReflection={() => setStage("reflection")}
              onReplay={() => {
                resetJourney();
                setDialogueIndex(0);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </PageShell>
  );
}
