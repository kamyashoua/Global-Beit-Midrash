"use client";

import { useMemo } from "react";
import type { SelectableItem } from "@/types/content";
import { useLanguage } from "@/context/LanguageProvider";

type Field = "title" | "subtitle" | "description" | "prompt" | "quote";

/**
 * Resolves `content.{realm}.{id}.{field}` for Spanish, then English (data) fallbacks.
 */
export function useItemCopy(item: SelectableItem) {
  const { t } = useLanguage();
  return useMemo(() => {
    const base = (field: Field) => {
      const key = `content.${item.category}.${item.id}.${field}`;
      const translated = t(key);
      if (translated && translated !== key) return translated;
      const v = (item as Record<string, string | undefined>)[field];
      return v ?? "";
    };
    return {
      title: base("title"),
      subtitle: base("subtitle"),
      description: base("description"),
      prompt: item.prompt ? base("prompt") : undefined,
      quote: item.quote ? base("quote") : undefined,
    };
  }, [item, t]);
}
