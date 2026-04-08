/**
 * Shared content types for the island journey.
 * Edit copy in src/data/* without touching UI logic.
 */

export type RealmId = "values" | "texts" | "practices";

export type SelectableItem = {
  id: string;
  category: RealmId;
  title: string;
  subtitle: string;
  description: string;
  /** Primary quote or excerpt (texts realm) */
  quote?: string;
  /** Extra reflection prompt shown on card or in realm */
  prompt?: string;
  /** Lucide icon name key — resolved in UI */
  icon?: string;
};

export type PublishedIsland = {
  id: string;
  groupName: string;
  dateISO: string;
  valueIds: string[];
  textIds: string[];
  practiceIds: string[];
  reflectionExcerpt: string;
};
