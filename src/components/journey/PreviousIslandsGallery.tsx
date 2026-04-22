"use client";

import { motion } from "framer-motion";
import { Calendar, Loader2, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SAMPLE_ISLANDS } from "@/data/islands";
import { useJourney } from "@/context/JourneyProvider";
import { findSelectableById } from "@/lib/resolve-selections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function titlesForIds(ids: string[]) {
  return ids
    .map((id) => findSelectableById(id)?.title)
    .filter(Boolean)
    .join(" · ");
}

type ApiIsland = {
  id: string;
  groupName: string;
  dateISO: string;
  valueIds: string[];
  textIds: string[];
  practiceIds: string[];
  reflection: string;
};

function excerptFromReflection(reflection: string, max = 200) {
  const t = reflection.trim();
  if (!t) return "—";
  return t.length > max ? `${t.slice(0, max)}…` : t;
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
  const { selections, reflection } = useJourney();
  const [groupName, setGroupName] = useState("");
  const [islands, setIslands] = useState<ApiIsland[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ok" | "error">(
    "loading",
  );
  const [loadMessage, setLoadMessage] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const loadIslands = useCallback(async () => {
    setLoadState("loading");
    setLoadMessage(null);
    try {
      const res = await fetch("/api/published-islands", { method: "GET" });
      const data = (await res.json()) as {
        islands?: ApiIsland[];
        error?: string;
      };
      if (!res.ok) {
        setLoadState("error");
        setLoadMessage(
          data.error ?? "We couldn't load the list. Try refreshing the page.",
        );
        return;
      }
      setIslands(data.islands ?? []);
      setLoadState("ok");
    } catch {
      setLoadState("error");
      setLoadMessage("We couldn't load the list. Check your connection and try again.");
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
  }, [islands]);

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
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setPublishError(
          data.error ?? "We couldn't publish. Try again in a moment.",
        );
        return;
      }
      setGroupName("");
      setPublishSuccess(true);
      await loadIslands();
      window.setTimeout(() => setPublishSuccess(false), 4000);
    } catch {
      setPublishError("We couldn't connect. Check your network and try again.");
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
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Published islands
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)]">
          Below is a shared list: groups can add their island so others can see
          what they carried and why.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted-foreground)]">
          You can go back to your island or reflection to make changes, then
          return here to publish when you are ready.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onBackToIsland}
          >
            Back to island
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onBackToReflection}
          >
            Back to reflection
          </Button>
        </div>
      </motion.div>

      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-5">
        <p className="text-sm font-medium text-[var(--foreground)]">
          Add your group to the list
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Optional: name your group. This saves your choices and reflection for
          everyone on this site to read—like pinning your island to a public
          board.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <Input
            aria-label="Group or cohort name"
            placeholder="Group name (optional)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={publishing}
          />
          <Button
            type="button"
            onClick={() => void handlePublish()}
            disabled={publishing}
            className="inline-flex shrink-0 items-center justify-center gap-2"
          >
            {publishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Publishing
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
        {publishSuccess && (
          <p
            className="mt-3 text-sm font-medium text-[var(--accent)]"
            role="status"
          >
            You’re on the list. Scroll down to see your island.
          </p>
        )}
        {publishError && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
            {publishError}
          </p>
        )}
      </div>

      {loadState === "loading" && (
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading archive…
        </p>
      )}

      {loadState === "error" && loadMessage && (
        <p className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          {loadMessage}
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
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    {row.groupName}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                    {new Date(row.dateISO).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {row.source === "seed" && (
                    <span className="rounded-full bg-[var(--muted)]/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                      Sample
                    </span>
                  )}
                  {row.source === "api" && (
                    <span className="rounded-full bg-[var(--primary)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                      Published
                    </span>
                  )}
                </div>
                <CardTitle className="font-display text-xl">
                  What they carried
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                <p>
                  <span className="font-semibold text-[var(--foreground)]">
                    Values:{" "}
                  </span>
                  {titlesForIds(row.valueIds)}
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">
                    Texts:{" "}
                  </span>
                  {titlesForIds(row.textIds)}
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">
                    Practices:{" "}
                  </span>
                  {titlesForIds(row.practiceIds)}
                </p>
                <blockquote className="rounded-xl border border-[var(--border)] bg-[var(--input)]/40 p-3 text-[var(--foreground)]/90">
                  “{row.reflectionExcerpt}”
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button type="button" variant="secondary" size="lg" onClick={onReplay}>
          Replay the journey
        </Button>
      </div>
    </div>
  );
}
