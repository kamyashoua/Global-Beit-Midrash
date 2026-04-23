"use client";

import { useLanguage } from "@/context/LanguageProvider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/types";

const OPTIONS: { id: Locale; labelKey: string }[] = [
  { id: "en", labelKey: "language.en" },
  { id: "es", labelKey: "language.es" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)]/50 text-xs font-medium shadow-sm backdrop-blur-sm md:text-sm",
        className,
      )}
      role="group"
      aria-label={t("language.switch")}
    >
      {OPTIONS.map(({ id, labelKey }, i) => {
        const active = locale === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setLocale(id)}
            className={cn(
              "min-w-0 max-w-[10rem] shrink px-2.5 py-1.5 transition-colors sm:px-3",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset",
              "whitespace-nowrap",
              i > 0 && "border-l border-[var(--border)]",
              active
                ? "bg-[var(--primary)]/15 font-semibold text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/40 hover:text-[var(--foreground)]",
            )}
            aria-pressed={active}
            aria-label={t("language.aria", { current: t(labelKey) })}
          >
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}
