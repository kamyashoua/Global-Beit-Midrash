"use client";

import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { useMemo, useState } from "react";
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

export function PreviousIslandsGallery({
  onReplay,
}: {
  onReplay: () => void;
}) {
  const { publishedLocal, publishCurrent, refreshPublished } = useJourney();
  const [groupName, setGroupName] = useState("");

  const rows = useMemo(() => {
    const local = publishedLocal.map((p) => {
      const excerpt =
        p.reflection.trim().length > 0
          ? p.reflection.length > 180
            ? `${p.reflection.slice(0, 180)}…`
            : p.reflection
          : "No reflection text saved.";
      return {
        id: p.id,
        groupName: p.groupName,
        dateISO: p.savedAt,
        valueIds: p.selections.values,
        textIds: p.selections.texts,
        practiceIds: p.selections.practices,
        reflectionExcerpt: excerpt,
        source: "local" as const,
      };
    });
    const seed = SAMPLE_ISLANDS.map((s) => ({ ...s, source: "seed" as const }));
    return [...local, ...seed];
  }, [publishedLocal]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Published islands &amp; previous groups
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)]">
          A small archive of what other groups carried—plus your own if you
          publish locally (demo: saved in this browser).
        </p>
      </motion.div>

      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 p-5">
        <p className="text-sm font-medium text-[var(--foreground)]">
          Publish this island (local demo)
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Stored in <code className="rounded bg-[var(--input)] px-1">localStorage</code>{" "}
          for prototyping—swap this hook for an API later.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            aria-label="Group or cohort name"
            placeholder="Group name (optional)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Button
            type="button"
            onClick={() => {
              publishCurrent(groupName);
              setGroupName("");
              refreshPublished();
            }}
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {rows.map((row, i) => (
          <motion.div
            key={row.id}
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
                  {"source" in row && row.source === "seed" && (
                    <span className="rounded-full bg-[var(--muted)]/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                      Sample
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
