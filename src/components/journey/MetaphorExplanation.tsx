"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  METAPHOR_BULLETS,
  METAPHOR_REFLECTION_PROMPTS,
} from "@/data/reflection-prompts";
import { Map } from "lucide-react";

type Props = {
  /** When used as the full metaphor stage, show primary CTA */
  variant?: "dialog-trigger" | "full";
  onContinue?: () => void;
  trigger?: ReactNode;
};

export function MetaphorExplanation({
  variant = "dialog-trigger",
  onContinue,
  trigger,
}: Props) {
  const body = (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
        <Map className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden />
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          The island is not a vacation fantasy. It is a metaphor for the Jewish
          future: limited space, limited time, and the weight of choosing what
          continues—and what does not.
        </p>
      </div>
      <ul className="space-y-3">
        {METAPHOR_BULLETS.map((b) => (
          <li
            key={b}
            className="relative pl-6 text-sm leading-relaxed text-[var(--foreground)] before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--primary)]"
          >
            {b}
          </li>
        ))}
      </ul>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Reflection prompts
        </p>
        <ul className="mt-3 space-y-2">
          {METAPHOR_REFLECTION_PROMPTS.map((p) => (
            <li
              key={p}
              className="rounded-lg bg-[var(--input)]/80 px-3 py-2 text-sm text-[var(--muted-foreground)]"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
      {variant === "full" && onContinue && (
        <div className="flex justify-end pt-2">
          <Button type="button" size="lg" onClick={onContinue}>
            Enter the first realm
          </Button>
        </div>
      )}
    </div>
  );

  if (variant === "full") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          The island is a metaphor
        </h2>
        <p className="mt-4 text-pretty text-lg text-[var(--muted-foreground)]">
          Before you choose what to carry, read this slowly. The point is not a
          perfect answer—it is a clearer question.
        </p>
        <div className="mt-10">{body}</div>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" type="button">
            How it works
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>The island is a metaphor</DialogTitle>
          <DialogDescription>
            A short map for how to read this experience.
          </DialogDescription>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
}
