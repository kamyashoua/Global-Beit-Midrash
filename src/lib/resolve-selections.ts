import { PRACTICES, TEXTS, VALUES } from "@/data";
import type { SelectableItem } from "@/types/content";
import type { Selections } from "@/types/journey";

export function findSelectableById(id: string): SelectableItem | undefined {
  return (
    VALUES.find((v) => v.id === id) ??
    TEXTS.find((t) => t.id === id) ??
    PRACTICES.find((p) => p.id === id)
  );
}

export function expandSelections(sel: Selections): SelectableItem[] {
  const list: SelectableItem[] = [];
  for (const id of sel.values) {
    const v = VALUES.find((x) => x.id === id);
    if (v) list.push(v);
  }
  for (const id of sel.texts) {
    const t = TEXTS.find((x) => x.id === id);
    if (t) list.push(t);
  }
  for (const id of sel.practices) {
    const p = PRACTICES.find((x) => x.id === id);
    if (p) list.push(p);
  }
  return list;
}
