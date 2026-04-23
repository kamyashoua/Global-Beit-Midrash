"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { SelectableItem } from "@/types/content";
import type { RealmId } from "@/types/content";
import { useLanguage } from "@/context/LanguageProvider";
import { RealmHeader } from "@/components/journey/RealmHeader";
import { SelectableCard } from "@/components/journey/SelectableCard";
import { SelectionCounter } from "@/components/journey/SelectionCounter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SELECTION_LIMITS } from "@/types/journey";

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
  limitRealm: RealmId | null;
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
  limitRealm,
  accentClass,
}: Props) {
  const { t, tList } = useLanguage();
  const max = SELECTION_LIMITS[realm];
  const prompts = tList(`prompts.realm.${realm}`);
  const instruction = t(`journey.selectInstruction.${realm}`);
  const hintText = t(`journey.hint.${realm}`);

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
          {t("journey.quickDirections")}
        </p>
        <details className="rounded-xl border border-[var(--border)] bg-[var(--card)]/45 px-4 py-3 text-sm text-[var(--muted-foreground)]">
          <summary className="cursor-pointer list-none font-medium text-[var(--foreground)]">
            {t("journey.hintTitle")}
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
          {t("journey.promptCaption")}
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
          label={t(`journey.selectionLabel.${realm}`)}
        />
        {limitRealm === realm && (
          <p
            className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
            role="status"
          >
            {t(`journey.limit.${realm}`)}
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
          {t("common.back")}
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!canAdvance}
          aria-disabled={!canAdvance}
        >
          {t("common.continue")}
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
