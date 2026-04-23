"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageProvider";
import { Map } from "lucide-react";

type Props = {
  variant?: "dialog-trigger" | "full";
  onContinue?: () => void;
  trigger?: ReactNode;
};

export function MetaphorExplanation({
  variant = "dialog-trigger",
  onContinue,
  trigger,
}: Props) {
  const { t, tList } = useLanguage();
  const bullets = tList("metaphor.bullets");
  const extraPrompts = tList("metaphor.reflectionPrompts");

  const body = (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/50">
        <Image
          src="/journey-map-light.svg"
          alt={t("metaphor.mapAlt")}
          width={1200}
          height={700}
          className="h-auto w-full"
          priority
        />
      </div>
      <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
        <Map className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden />
        <p className="min-w-0 text-sm leading-relaxed text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
          {t("metaphor.explainer")}
        </p>
      </div>
      <ul className="space-y-3">
        {bullets.map((b) => (
          <li
            key={b}
            className="relative pl-6 text-sm leading-relaxed text-[var(--foreground)] [overflow-wrap:anywhere] before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--primary)]"
          >
            {b}
          </li>
        ))}
      </ul>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          {t("metaphor.openReflection")}
        </p>
        <ul className="mt-3 space-y-2">
          {extraPrompts.map((p) => (
            <li
              key={p}
              className="rounded-lg bg-[var(--input)]/80 px-3 py-2 text-sm text-[var(--muted-foreground)] [overflow-wrap:anywhere]"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
      {variant === "full" && onContinue && (
        <div className="flex justify-end pt-2">
          <Button type="button" size="lg" onClick={onContinue}>
            {t("metaphor.enterRealm")}
          </Button>
        </div>
      )}
    </div>
  );

  if (variant === "full") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight [overflow-wrap:anywhere] md:text-4xl">
          {t("metaphor.title")}
        </h2>
        <p className="mt-4 text-pretty text-lg text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
          {t("metaphor.lead")}
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
            {t("intro.howItWorks")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("metaphor.dialogTitle")}</DialogTitle>
          <DialogDescription>{t("metaphor.dialogDescription")}</DialogDescription>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
}
