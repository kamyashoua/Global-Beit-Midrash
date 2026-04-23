"use client";

import { motion } from "framer-motion";
import { Calendar, Loader2, Users } from "lucide-react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { SAMPLE_ISLANDS } from "@/data/islands";
import { useJourney } from "@/context/JourneyProvider";
import { useLanguage } from "@/context/LanguageProvider";
import { findSelectableById } from "@/lib/resolve-selections";
import { useItemCopy } from "@/hooks/useItemCopy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SelectableItem } from "@/types/content";

type ApiIsland = {
  id: string;
  groupName: string;
  dateISO: string;
  valueIds: string[];
  textIds: string[];
  practiceIds: string[];
  reflection: string;
};

type ApiErrorJson = { error?: string; code?: string };

function ItemTitleResolved({ item }: { item: SelectableItem }) {
  const copy = useItemCopy(item);
  return <>{copy.title}</>;
}

function IdTitlesLine({ ids }: { ids: string[] }) {
  const items = ids
    .map((id) => findSelectableById(id))
    .filter((x): x is SelectableItem => x !== undefined);
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={item.id}>
          {i > 0 ? " · " : null}
          <ItemTitleResolved item={item} />
        </Fragment>
      ))}
    </>
  );
}

export function PreviousIslandsGallery({
  onBackToIsland,
  onBackToReflection,
  onReplay,
}: {
  onBackToIsland: () => void;
  onBackToReflection: () => void;
  onReplay: () => void;
}) {
  const { locale, t } = useLanguage();
  const { selections, reflection } = useJourney();
  const [groupName, setGroupName] = useState("");
  const [islands, setIslands] = useState<ApiIsland[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ok" | "error">(
    "loading",
  );
  const [loadErrorKey, setLoadErrorKey] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const dateLocale = locale === "es" ? "es" : "en";

  const excerptFromReflection = useCallback(
    (raw: string, max = 200) => {
      const s = raw.trim();
      if (!s) return t("gallery.emptyExcerpt");
      return s.length > max ? `${s.slice(0, max)}…` : s;
    },
    [t],
  );

  const loadIslands = useCallback(async () => {
    setLoadState("loading");
    setLoadErrorKey(null);
    try {
      const res = await fetch("/api/published-islands", { method: "GET" });
      const data = (await res.json()) as ApiErrorJson & {
        islands?: ApiIsland[];
      };
      if (!res.ok) {
        setLoadState("error");
        setLoadErrorKey(
          data.code && data.code.length ? data.code : "LOAD_LIST_FAILED",
        );
        return;
      }
      setIslands(data.islands ?? []);
      setLoadState("ok");
    } catch {
      setLoadState("error");
      setLoadErrorKey("LOAD_LIST_NETWORK");
    }
  }, []);

  useEffect(() => {
    void loadIslands();
  }, [loadIslands]);

  const rows = useMemo(() => {
    const fromApi = islands.map((r) => ({
      id: r.id,
      groupName: r.groupName,
      dateISO: r.dateISO,
      valueIds: r.valueIds,
      textIds: r.textIds,
      practiceIds: r.practiceIds,
      reflectionExcerpt: excerptFromReflection(r.reflection),
      source: "api" as const,
    }));
    const seed = SAMPLE_ISLANDS.map((s) => ({
      id: s.id,
      groupName: s.groupName,
      dateISO: s.dateISO,
      valueIds: s.valueIds,
      textIds: s.textIds,
      practiceIds: s.practiceIds,
      reflectionExcerpt: s.reflectionExcerpt,
      source: "seed" as const,
    }));
    return [...fromApi, ...seed];
  }, [islands, excerptFromReflection]);

  const handlePublish = async () => {
    setPublishError(null);
    setPublishSuccess(false);
    setPublishing(true);
    try {
      const res = await fetch("/api/published-islands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupName: groupName.trim() || undefined,
          selections,
          reflection,
        }),
      });
      const data = (await res.json()) as ApiErrorJson;
      if (!res.ok) {
        const code = data.code?.length
          ? data.code
          : "PUBLISH_FAILED";
        setPublishError(t(`errors.${code}`));
        return;
      }
      setGroupName("");
      setPublishSuccess(true);
      await loadIslands();
      window.setTimeout(() => setPublishSuccess(false), 4000);
    } catch {
      setPublishError(t("errors.PUBLISH_NETWORK"));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-semibold tracking-tight [overflow-wrap:anywhere] md:text-4xl">
          {t("gallery.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
          {t("gallery.lead1")}
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
          {t("gallery.lead2")}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onBackToIsland}
            className="[overflow-wrap:anywhere]"
          >
            {t("gallery.backIsland")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onBackToReflection}
            className="[overflow-wrap:anywhere]"
          >
            {t("gallery.backReflection")}
          </Button>
        </div>
      </motion.div>

      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-5">
        <p className="text-sm font-medium text-[var(--foreground)] [overflow-wrap:anywhere]">
          {t("gallery.addTitle")}
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
          {t("gallery.addDescription")}
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <Input
            aria-label={t("gallery.groupNameLabel")}
            placeholder={t("gallery.groupPlaceholder")}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={publishing}
            className="min-w-0 [overflow-wrap:anywhere]"
          />
          <Button
            type="button"
            onClick={() => void handlePublish()}
            disabled={publishing}
            className="inline-flex min-w-0 shrink-0 items-center justify-center gap-2 [overflow-wrap:anywhere]"
          >
            {publishing ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                {t("gallery.publishing")}
              </>
            ) : (
              t("gallery.publish")
            )}
          </Button>
        </div>
        {publishSuccess && (
          <p
            className="mt-3 text-sm font-medium text-[var(--accent)] [overflow-wrap:anywhere]"
            role="status"
          >
            {t("gallery.success")}
          </p>
        )}
        {publishError && (
          <p
            className="mt-3 text-sm text-red-600 [overflow-wrap:anywhere] dark:text-red-400"
            role="alert"
          >
            {publishError}
          </p>
        )}
      </div>

      {loadState === "loading" && (
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          {t("gallery.loading")}
        </p>
      )}

      {loadState === "error" && loadErrorKey && (
        <p className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 [overflow-wrap:anywhere] dark:text-amber-100">
          {t(`errors.${loadErrorKey}`)}
        </p>
      )}

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {rows.map((row, i) => (
          <motion.div
            key={`${row.source}-${row.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="h-full border-[var(--border)] bg-[var(--card)]/60">
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <span className="inline-flex min-w-0 max-w-full items-center gap-1 [overflow-wrap:anywhere]">
                    <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {row.groupName}
                  </span>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {new Date(row.dateISO).toLocaleDateString(dateLocale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {row.source === "seed" && (
                    <span className="rounded-full bg-[var(--muted)]/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                      {t("gallery.sample")}
                    </span>
                  )}
                  {row.source === "api" && (
                    <span className="rounded-full bg-[var(--primary)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                      {t("gallery.published")}
                    </span>
                  )}
                </div>
                <CardTitle className="font-display text-xl [overflow-wrap:anywhere]">
                  {t("gallery.cardTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                <p className="[overflow-wrap:anywhere]">
                  <span className="font-semibold text-[var(--foreground)]">
                    {t("gallery.valuesLabel")}{" "}
                  </span>
                  <IdTitlesLine ids={row.valueIds} />
                </p>
                <p className="[overflow-wrap:anywhere]">
                  <span className="font-semibold text-[var(--foreground)]">
                    {t("gallery.textsLabel")}{" "}
                  </span>
                  <IdTitlesLine ids={row.textIds} />
                </p>
                <p className="[overflow-wrap:anywhere]">
                  <span className="font-semibold text-[var(--foreground)]">
                    {t("gallery.practicesLabel")}{" "}
                  </span>
                  <IdTitlesLine ids={row.practiceIds} />
                </p>
                <blockquote className="rounded-xl border border-[var(--border)] bg-[var(--input)]/40 p-3 text-[var(--foreground)]/90 [overflow-wrap:anywhere]">
                  “{row.reflectionExcerpt}”
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onReplay}
          className="[overflow-wrap:anywhere]"
        >
          {t("gallery.replay")}
        </Button>
      </div>
    </div>
  );
}
