"use client";

import { RotateCcw } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";
import { Button } from "@/components/ui/button";
import { useJourney } from "@/context/JourneyProvider";

export function ResetJourneyButton() {
  const { t } = useLanguage();
  const { resetJourney } = useJourney();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] [overflow-wrap:anywhere]"
      onClick={() => {
        if (typeof window !== "undefined" && window.confirm(t("reset.confirm"))) {
          resetJourney();
        }
      }}
    >
      <RotateCcw className="h-4 w-4" aria-hidden />
      {t("reset.label")}
    </Button>
  );
}
