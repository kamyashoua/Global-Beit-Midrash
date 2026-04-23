"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { makeT } from "@/lib/i18n/t";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n/types";

type LanguageContextValue = {
  t: ReturnType<typeof makeT>["t"];
  tList: ReturnType<typeof makeT>["tList"];
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(raw)) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(readInitialLocale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const { t, tList } = useMemo(() => makeT(locale), [locale]);

  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es" : "en";
  }, [locale]);

  useEffect(() => {
    const title = t("meta.title");
    if (title && title !== "meta.title") {
      document.title = title;
    }
    const desc = t("meta.description");
    if (desc && desc !== "meta.description") {
      const el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute("content", desc);
    }
  }, [t, locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t, tList }),
    [locale, setLocale, t, tList],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

/** Safe for use outside provider (e.g. rare edge); falls back to English. */
export function useOptionalLanguage(): LanguageContextValue | null {
  return useContext(LanguageContext);
}
