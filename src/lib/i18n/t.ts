import type { Locale } from "./types";
import { getString, getStringArray, interpolate } from "./resolve-path";
import { getEnglishFallback, getEnglishList } from "./english-fallback";
import en from "../../../locales/en.json";
import esBase from "../../../locales/es.json";
import esItemContent from "../../../locales/es-content.json";

/** Spanish UI + content blocks merged; English curriculum stays in TS for EN locale. */
const es = { ...esBase, content: esItemContent } as Record<string, unknown>;

const messages: Record<Locale, Record<string, unknown>> = { en, es };

/**
 * String translation for the active locale, with:
 * 1) es.json (when locale is es)
 * 2) en.json
 * 3) English from TS data modules (curriculum, prompts, etc.)
 * 4) the key as last resort (surfaces missing copy in dev)
 */
export function makeT(locale: Locale) {
  function t(
    key: string,
    vars?: Record<string, string | number | undefined>,
  ): string {
    const directEs = locale === "es" ? getString(messages.es, key) : undefined;
    const directEn = getString(messages.en, key);
    const fromData = getEnglishFallback(key);
    const raw = directEs ?? directEn ?? fromData;
    if (raw === undefined) return key;
    return interpolate(raw, vars);
  }

  function tList(key: string): string[] {
    if (locale === "es") {
      const a = getStringArray(messages.es, key);
      if (a && a.length > 0) return a;
      const b = getStringArray(messages.en, key);
      if (b && b.length > 0) return b;
    } else {
      const a = getStringArray(messages.en, key);
      if (a && a.length > 0) return a;
    }
    return getEnglishList(key);
  }

  return { t, tList };
}
