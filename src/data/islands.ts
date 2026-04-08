import type { PublishedIsland } from "@/types/content";

/** Seed gallery data — merged with localStorage “published” entries in the UI */
export const SAMPLE_ISLANDS: PublishedIsland[] = [
  {
    id: "seed-westchester-2025",
    groupName: "Westchester Teen Fellows",
    dateISO: "2025-11-14",
    valueIds: ["talmud-torah", "kehillah", "kavod-habriyot"],
    textIds: ["text-pirkei-mighty", "text-kiddushin-study-action"],
    practiceIds: ["shabbat-dinner", "holidays", "tzedakah"],
    reflectionExcerpt:
      "We kept learning because without it everything else feels like performance. The hardest cut was texts—we wanted more room for disagreement and humility.",
  },
  {
    id: "seed-chicago-2025",
    groupName: "Chicago Hillel Cohort",
    dateISO: "2025-10-02",
    valueIds: ["tikkun-olam", "arievet", "ahavat-israel"],
    textIds: ["text-deuteronomy-open-hand", "text-bava-metzia-water"],
    practiceIds: ["synagogue", "torah-reading", "daily-prayer"],
    reflectionExcerpt:
      "Our island looks outward: repair, responsibility, and a love that can hold critique. Survival ethics forced a real conversation about what we owe strangers.",
  },
  {
    id: "seed-online-2026",
    groupName: "Online Beit Midrash Night",
    dateISO: "2026-01-21",
    valueIds: ["shavat-vayinfash", "yirat-shemayim", "rebuke"],
    textIds: ["text-eruvin-these-and-these", "text-kiddushin-study-action"],
    practiceIds: ["shabbat-dinner", "hebrew", "kippah"],
    reflectionExcerpt:
      "We chose humility and rhythm over noise. Hebrew won narrowly over kosher—language felt like the key to access, not just rules.",
  },
  {
    id: "seed-camp-2025",
    groupName: "Summer Camp Staff-in-Training",
    dateISO: "2025-08-07",
    valueIds: ["kehillah", "self-preservation", "talmud-torah"],
    textIds: ["text-deuteronomy-open-hand", "text-pirkei-mighty"],
    practiceIds: ["holidays", "fasting", "tzedakah"],
    reflectionExcerpt:
      "Camp is loud, so we chose community and safety first. Fasting stayed because it marks time differently—kids notice when adults take discomfort seriously.",
  },
];
