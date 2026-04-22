import type { SelectableItem } from "@/types/content";

/** Values realm — user must pick exactly 3 */
export const VALUES: SelectableItem[] = [
  {
    id: "talmud-torah",
    category: "values",
    title: "Talmud Torah",
    subtitle: "Learning as a lifelong path",
    description:
      "Jewish tradition treats learning as sacred work—not only facts, but habits of attention, argument, and humility. It is how ideas stay alive across centuries.",
    prompt:
      "If serious learning thinned out in Jewish life, what else might quietly disappear with it?",
    icon: "book-open",
  },
  {
    id: "shavat-vayinfash",
    category: "values",
    title: "Shavat vayinafash",
    subtitle: "Rest that renews the soul",
    description:
      "This phrase hints that rest is not laziness—it is how a person becomes whole again. In a fast world, Judaism asks for rhythms that protect human dignity.",
    prompt: "What breaks in us when we never stop—and what might Shabbat-style rest repair?",
    icon: "moon",
  },
  {
    id: "tikkun-olam",
    category: "values",
    title: "Tikkun olam",
    subtitle: "Repairing what is broken",
    description:
      "Often translated as “repairing the world,” this value pushes responsibility beyond the self. It asks what we owe neighbors, strangers, and the planet we share.",
    prompt: "Where do you see repair as a Jewish calling—not a slogan, but a daily practice?",
    icon: "heart-handshake",
  },
  {
    id: "yirat-shemayim",
    category: "values",
    title: "Yirat Shemayim",
    subtitle: "Awe and moral seriousness",
    description:
      "Sometimes translated as “fear of Heaven,” it can mean living with humility before something larger than ourselves—so our choices carry weight.",
    prompt: "Can a community stay honest without a sense of accountability bigger than popularity?",
    icon: "sparkles",
  },
  {
    id: "kehillah",
    category: "values",
    title: "Kehillah",
    subtitle: "Community that holds people",
    description:
      "Judaism is not only private belief. It is lived with others—celebrating, mourning, learning, and showing up when it is inconvenient.",
    prompt: "What does a healthy Jewish community owe its members—and what do members owe the community?",
    icon: "users",
  },
  {
    id: "self-preservation",
    category: "values",
    title: "Self-preservation",
    subtitle: "Safety and survival",
    description:
      "Jewish history makes this painfully practical: communities must protect themselves to endure. This value can clash with others—and force honest debate about limits and responsibility.",
    prompt: "When does self-preservation become isolation—or when does openness become risk?",
    icon: "shield",
  },
  {
    id: "rebuke",
    category: "values",
    title: "Tochacha (rebuke)",
    subtitle: "Caring enough to challenge",
    description:
      "Jewish ethics include the idea that love sometimes means naming harm—respectfully, carefully, and for the sake of repair, not humiliation.",
    prompt: "How can disagreement strengthen community instead of splitting it?",
    icon: "message-circle-warning",
  },
  {
    id: "arievet",
    category: "values",
    title: "Areivut",
    subtitle: "Mutual responsibility",
    description:
      "We are answerable for one another as a Jewish people—not in a vague way, but in real obligations of care, honesty, and protection.",
    prompt:
      "What does “we are responsible for each other as a Jewish people” demand in ordinary life?",
    icon: "link",
  },
  {
    id: "kavod-habriyot",
    category: "values",
    title: "Kavod habriyot",
    subtitle: "Honoring each person",
    description:
      "Human dignity is not optional. This value pushes us to notice who is unseen, unheard, or pushed to the margins.",
    prompt: "Which habits make dignity real—not as a poster, but as behavior?",
    icon: "hand-heart",
  },
  {
    id: "ahavat-israel",
    category: "values",
    title: "Ahavat Yisrael",
    subtitle: "Connection to Israel",
    description:
      "This value points to connection with Israel as a place and as part of Jewish continuity. It invites questions about belonging, diversity, and loyalty.",
    prompt: "Is Israel necessary to connect Jews in the diaspora?",
    icon: "map-pin",
  },
];
