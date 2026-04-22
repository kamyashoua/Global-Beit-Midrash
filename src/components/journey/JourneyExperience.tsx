"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame, Gem, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useJourney } from "@/context/JourneyProvider";
import { INTRO_DIALOGUE } from "@/data/intro";
import { PRACTICES, TEXTS, VALUES } from "@/data";
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
    limitMessage,
    reflection,
    setReflection,
    resetJourney,
    clearLimitMessage,
  } = useJourney();

  const [dialogueIndex, setDialogueIndex] = useState(0);

  useEffect(() => {
    clearLimitMessage();
  }, [stage, clearLimitMessage]);

  const shellRealm = stageRealm(stage);

  return (
    <PageShell realm={shellRealm}>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[#f4f8ff]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <p className="font-display text-base font-semibold tracking-tight text-[var(--foreground)] md:text-lg">
            The Island We Carry
          </p>
          <ResetJourneyButton />
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          {stage === "intro" && (
            <IntroHero
              dialogueLines={INTRO_DIALOGUE}
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
                      How it works
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
              title="The Values Realm"
              eyebrow="Realm I of III"
              description="Values are the compass. They shape what a community rewards, protects, and refuses to compromise."
              Icon={Gem}
              accentClass="text-[#8ab4ff]"
              items={VALUES}
              selectedIds={selections.values}
              onToggle={(id) => toggleSelect("values", id)}
              onBack={() => setStage("metaphor")}
              onNext={() => setStage("realm-texts")}
              canAdvance={canAdvanceFromRealm("values")}
              limitMessage={limitMessage}
            />
          )}

          {stage === "realm-texts" && (
            <RealmScreen
              realm="texts"
              title="The Texts Realm"
              eyebrow="Realm II of III"
              description="Texts help us carry core ideas into real life choices. Select the teachings you believe should continue shaping Jewish life."
              Icon={ScrollText}
              accentClass="text-[#e8c77b]"
              items={TEXTS}
              selectedIds={selections.texts}
              onToggle={(id) => toggleSelect("texts", id)}
              onBack={() => setStage("realm-values")}
              onNext={() => setStage("realm-practices")}
              canAdvance={canAdvanceFromRealm("texts")}
              limitMessage={limitMessage}
            />
          )}

          {stage === "realm-practices" && (
            <RealmScreen
              realm="practices"
              title="The Practices Realm"
              eyebrow="Realm III of III"
              description="Practices are how values become lived habits across generations. Choose the practices that should continue in daily Jewish life."
              Icon={Flame}
              accentClass="text-[#5eead4]"
              items={PRACTICES}
              selectedIds={selections.practices}
              onToggle={(id) => toggleSelect("practices", id)}
              onBack={() => setStage("realm-texts")}
              onNext={() => setStage("island")}
              canAdvance={canAdvanceFromRealm("practices")}
              limitMessage={limitMessage}
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
