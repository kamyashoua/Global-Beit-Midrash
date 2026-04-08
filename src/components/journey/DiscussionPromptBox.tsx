"use client";

import { MessageSquareQuote } from "lucide-react";
import { COMMUNAL_CALLOUT_PROMPTS } from "@/data/reflection-prompts";

export function DiscussionPromptBox() {
  return (
    <aside
      className="rounded-2xl border border-[var(--primary)]/25 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--accent)]/10 p-6 shadow-inner"
      aria-labelledby="communal-heading"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--card)]/60 ring-1 ring-[var(--border)]"
          aria-hidden
        >
          <MessageSquareQuote className="h-5 w-5 text-[var(--primary)]" />
        </div>
        <div className="min-w-0">
          <h3
            id="communal-heading"
            className="font-display text-lg font-semibold text-[var(--foreground)]"
          >
            For the whole group
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
            If you discuss this with others, try questions like these. They are
            meant to sharpen thinking—not to force agreement.
          </p>
          <ul className="mt-4 space-y-2">
            {COMMUNAL_CALLOUT_PROMPTS.map((q) => (
              <li
                key={q}
                className="rounded-lg border border-[var(--border)] bg-[var(--input)]/50 px-3 py-2 text-sm text-[var(--foreground)]/90"
              >
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
