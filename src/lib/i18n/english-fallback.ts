/**
 * When en.json has no string for a key, we derive English from existing data modules
 * so we do not duplicate the entire curriculum in JSON.
 */
import { INTRO_DIALOGUE, GUIDE_INTRO } from "@/data/intro";
import { VALUES } from "@/data/values";
import { TEXTS } from "@/data/texts";
import { PRACTICES } from "@/data/practices";
import {
  METAPHOR_BULLETS,
  METAPHOR_REFLECTION_PROMPTS,
  REALM_PROMPTS,
  OPTIONAL_TEXTAREA_PROMPTS,
  COMMUNAL_CALLOUT_PROMPTS,
} from "@/data/reflection-prompts";
const REALM_LIST = { values: VALUES, texts: TEXTS, practices: PRACTICES } as const;

type ContentField =
  | "title"
  | "subtitle"
  | "description"
  | "prompt"
  | "quote";

function contentItem(
  realm: keyof typeof REALM_LIST,
  id: string,
  field: ContentField,
): string | undefined {
  const list = REALM_LIST[realm];
  const item = list.find((x) => x.id === id);
  if (!item) return undefined;
  if (field === "quote" && "quote" in item && item.quote) return item.quote;
  const v = (item as Record<string, string | undefined>)[field];
  return typeof v === "string" ? v : undefined;
}

export function getEnglishFallback(path: string): string | undefined {
  const m = path.match(
    /^content\.(values|texts|practices)\.([a-z0-9-]+)\.(title|subtitle|description|prompt|quote)$/,
  );
  if (m) {
    const [, realm, id, field] = m;
    return contentItem(
      realm as "values" | "texts" | "practices",
      id,
      field as ContentField,
    );
  }

  if (path === "intro.guide") return GUIDE_INTRO;

  const d = path.match(/^intro\.dialogue\.(line-\d+)$/);
  if (d) {
    const idMatch = d[1]!;
    const line = INTRO_DIALOGUE.find((l) => l.id === idMatch);
    return line?.text;
  }

  return undefined;
}

const LIST_KEY_MAP: Record<string, string[] | undefined> = {
  "metaphor.bullets": [...METAPHOR_BULLETS],
  "metaphor.reflectionPrompts": [...METAPHOR_REFLECTION_PROMPTS],
  "prompts.realm.values": [...REALM_PROMPTS.values],
  "prompts.realm.texts": [...REALM_PROMPTS.texts],
  "prompts.realm.practices": [...REALM_PROMPTS.practices],
  "prompts.reflection.optional": [...OPTIONAL_TEXTAREA_PROMPTS],
  "prompts.communal": [...COMMUNAL_CALLOUT_PROMPTS],
};

export function getEnglishList(key: string): string[] {
  return LIST_KEY_MAP[key] ?? [];
}
