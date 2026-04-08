"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJourney } from "@/context/JourneyProvider";

export function ResetJourneyButton() {
  const { resetJourney } = useJourney();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      onClick={() => {
        if (
          typeof window !== "undefined" &&
          window.confirm(
            "Start over? Your local selections and reflection will be cleared.",
          )
        ) {
          resetJourney();
        }
      }}
    >
      <RotateCcw className="h-4 w-4" aria-hidden />
      Start over
    </Button>
  );
}
