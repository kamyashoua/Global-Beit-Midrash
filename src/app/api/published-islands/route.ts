import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { SELECTION_LIMITS } from "@/types/journey";

export const dynamic = "force-dynamic";

const publishBodySchema = z.object({
  groupName: z.string().max(160).optional(),
  selections: z.object({
    values: z.array(z.string()),
    texts: z.array(z.string()),
    practices: z.array(z.string()),
  }),
  reflection: z.string().max(30_000).optional().default(""),
});

/** GET — list published islands (newest first). */
export async function GET() {
  try {
    const rows = await prisma.publishedIsland.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      islands: rows.map((r) => ({
        id: r.id,
        groupName: r.groupName,
        dateISO: r.createdAt.toISOString(),
        valueIds: r.valueIds as unknown as string[],
        textIds: r.textIds as unknown as string[],
        practiceIds: r.practiceIds as unknown as string[],
        reflection: r.reflection,
      })),
    });
  } catch (e) {
    console.error("[published-islands GET]", e);
    return NextResponse.json(
      {
        code: "ARCHIVE_UNAVAILABLE",
        error: "The archive is temporarily unavailable. Try again in a moment.",
      },
      { status: 503 },
    );
  }
}

/** POST — publish one island. */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        error: "Something went wrong. Refresh the page and try again.",
      },
      { status: 400 },
    );
  }

  const parsed = publishBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        code: "VALIDATION",
        error: "Check that your choices are complete, then try again.",
      },
      { status: 400 },
    );
  }

  const { groupName, selections, reflection } = parsed.data;

  if (
    selections.values.length !== SELECTION_LIMITS.values ||
    selections.texts.length !== SELECTION_LIMITS.texts ||
    selections.practices.length !== SELECTION_LIMITS.practices
  ) {
    return NextResponse.json(
      {
        code: "JOURNEY_INCOMPLETE",
        error:
          "Finish the full journey (3 values, 2 texts, 3 practices) before publishing.",
      },
      { status: 400 },
    );
  }

  try {
    const row = await prisma.publishedIsland.create({
      data: {
        groupName: (groupName ?? "").trim() || "Unnamed group",
        valueIds: selections.values,
        textIds: selections.texts,
        practiceIds: selections.practices,
        reflection: reflection ?? "",
      },
    });

    return NextResponse.json({
      id: row.id,
      dateISO: row.createdAt.toISOString(),
    });
  } catch (e) {
    console.error("[published-islands POST]", e);
    return NextResponse.json(
      {
        code: "SAVE_FAILED",
        error: "We couldn't save your island. Try again in a moment.",
      },
      { status: 503 },
    );
  }
}
