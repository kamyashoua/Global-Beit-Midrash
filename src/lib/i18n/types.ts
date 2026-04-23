export type Locale = "en" | "es";

export const LOCALE_STORAGE_KEY = "global-beit-midrash-locale";
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(x: string | null | undefined): x is Locale {
  return x === "en" || x === "es";
}
