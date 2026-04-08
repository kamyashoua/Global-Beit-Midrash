"use client";

import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { OPTIONAL_TEXTAREA_PROMPTS } from "@/data/reflection-prompts";
import { DiscussionPromptBox } from "@/components/journey/DiscussionPromptBox";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function ReflectionPanel({
  value,
  onChange,
  onBack,
  onContinue,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="text-center"
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          <PenLine className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
          Reflection
        </p>
        <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Say it in your own words
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)]">
          There is no rubric. The goal is clarity: what you chose, what you
          refused, and what you are still unsure about.
        </p>
      </motion.div>

      <div className="mt-10 space-y-4">
        <label
          htmlFor="reflection-main"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Your reasoning
        </label>
        <Textarea
          id="reflection-main"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start anywhere. You might describe the story your island tells, what you protected, what you mourned leaving behind, or what surprised you."
          className="min-h-[200px] resize-y"
        />
        <p className="text-xs text-[var(--muted-foreground)]">
          Tip: write for five minutes without editing. You can refine later.
        </p>
      </div>

      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Optional prompts
        </p>
        <ul className="mt-3 space-y-2">
          {OPTIONAL_TEXTAREA_PROMPTS.map((p) => (
            <li
              key={p}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)]/40 px-3 py-2 text-sm text-[var(--muted-foreground)]"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <DiscussionPromptBox />
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onContinue}>
          View archive and publish
        </Button>
      </div>
    </div>
  );
}
