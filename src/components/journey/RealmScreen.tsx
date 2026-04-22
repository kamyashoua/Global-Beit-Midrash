"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { SelectableItem } from "@/types/content";
import type { RealmId } from "@/types/content";
import { REALM_PROMPTS } from "@/data/reflection-prompts";
import { SELECTION_LIMITS } from "@/types/journey";
import { RealmHeader } from "@/components/journey/RealmHeader";
import { SelectableCard } from "@/components/journey/SelectableCard";
import { SelectionCounter } from "@/components/journey/SelectionCounter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  realm: RealmId;
  title: string;
  eyebrow: string;
  description: string;
  Icon: LucideIcon;
  items: SelectableItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  canAdvance: boolean;
  limitMessage: string | null;
  accentClass?: string;
};

export function RealmScreen({
  realm,
  title,
  eyebrow,
  description,
  Icon,
  items,
  selectedIds,
  onToggle,
  onBack,
  onNext,
  canAdvance,
  limitMessage,
  accentClass,
}: Props) {
  const max = SELECTION_LIMITS[realm];
  const prompts = REALM_PROMPTS[realm];
  const instruction =
    realm === "values"
      ? "Select exactly 3 values to continue."
      : realm === "texts"
        ? "Select exactly 2 texts to continue."
        : "Select exactly 3 practices to continue.";
  const hintText =
    realm === "values"
      ? "Choose values you believe should remain central for Jewish continuity. The reflection prompts below are for thought and discussion, not a separate written assignment."
      : realm === "texts"
        ? "Pick texts that you believe should keep shaping behavior and identity in future Jewish life. The prompts are discussion guides."
        : "Pick practices that are most likely to keep Jewish life active and recognizable across generations. The prompts are there to help discussion.";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <RealmHeader
        title={title}
        eyebrow={eyebrow}
        description={description}
        Icon={Icon}
        accentClass={accentClass}
      />
      <div className="mx-auto mt-8 max-w-3xl space-y-3">
        <p className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
          {instruction}
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          Quick directions: select cards by clicking them. Selected cards will
          glow and show a checkmark. You can deselect anytime before continuing.
        </p>
        <details className="rounded-xl border border-[var(--border)] bg-[var(--card)]/45 px-4 py-3 text-sm text-[var(--muted-foreground)]">
          <summary className="cursor-pointer list-none font-medium text-[var(--foreground)]">
            Hint
          </summary>
          <p className="mt-2">{hintText}</p>
        </details>
      </div>

      <motion.div
        className="mx-auto mt-8 max-w-2xl space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <p className="text-xs font-medium italic text-[var(--muted-foreground)]">
          These reflection questions are prompts for your group conversation.
          You do not need to submit separate answers here.
        </p>
        {prompts.map((p) => (
          <p
            key={p}
            className="rounded-xl border border-[var(--border)] bg-[var(--input)]/40 px-4 py-3 text-sm leading-relaxed text-[var(--muted-foreground)]"
          >
            {p}
          </p>
        ))}
      </motion.div>

      <div className="mx-auto mt-8 max-w-3xl">
        <SelectionCounter
          current={selectedIds.length}
          max={max}
          label={
            realm === "values"
              ? "Values you will carry"
              : realm === "texts"
                ? "Texts you will carry"
                : "Practices you will carry"
          }
        />
        {limitMessage && (
          <p
            className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
            role="status"
          >
            {limitMessage}
          </p>
        )}
      </div>

      <div
        className={cn(
          "mt-10 grid gap-4 md:grid-cols-2",
          realm === "texts" && "md:grid-cols-1 lg:grid-cols-2",
        )}
      >
        {items.map((item, index) => (
          <SelectableCard
            key={item.id}
            item={item}
            index={index}
            realm={realm}
            selected={selectedIds.includes(item.id)}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!canAdvance}
          aria-disabled={!canAdvance}
        >
          Continue
        </Button>
      </div>
      {!canAdvance && (
        <p className="mt-3 text-center text-sm text-[var(--muted-foreground)]">
          {instruction}
        </p>
      )}
    </div>
  );
}
