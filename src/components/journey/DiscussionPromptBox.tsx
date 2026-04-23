"use client";

import { MessageSquareQuote } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

export function DiscussionPromptBox() {
  const { t, tList } = useLanguage();
  const prompts = tList("prompts.communal");

  return (
    <aside
      className="rounded-2xl border border-[var(--primary)]/25 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--accent)]/10 p-6 shadow-inner"
      aria-labelledby="communal-heading"
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--card)]/60 ring-1 ring-[var(--border)]"
          aria-hidden
        >
          <MessageSquareQuote className="h-5 w-5 text-[var(--primary)]" />
        </div>
        <div className="min-w-0">
          <h3
            id="communal-heading"
            className="font-display text-lg font-semibold text-[var(--foreground)] [overflow-wrap:anywhere]"
          >
            {t("discussion.title")}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
            {t("discussion.lead")}
          </p>
          <ul className="mt-4 space-y-2">
            {prompts.map((q) => (
              <li
                key={q}
                className="rounded-lg border border-[var(--border)] bg-[var(--input)]/50 px-3 py-2 text-sm text-[var(--foreground)]/90 [overflow-wrap:anywhere]"
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
