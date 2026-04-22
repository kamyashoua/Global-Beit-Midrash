import type { SelectableItem } from "@/types/content";

/** Practices realm — user must pick exactly 3 */
export const PRACTICES: SelectableItem[] = [
  {
    id: "synagogue",
    category: "practices",
    title: "Gathering in synagogue",
    subtitle: "Prayer and presence in community",
    description:
      "Showing up in shared space—whether weekly or occasionally—anchors Jewish life in shared voices, melodies, and relationships across generations.",
    prompt:
      "What is lost when prayer becomes only private—and what is gained when it becomes communal?",
    icon: "building-2",
  },
  {
    id: "shabbat-dinner",
    category: "practices",
    title: "Shabbat dinner",
    subtitle: "Rhythm, food, and blessing",
    description:
      "A weekly pause that can feel like art: candles, bread, wine, conversation. It trains attention and makes time feel different.",
    prompt: "What kind of future needs a protected weekly rhythm?",
    icon: "wine",
  },
  {
    id: "kosher",
    category: "practices",
    title: "Keeping kosher",
    subtitle: "Eating with intention",
    description:
      "Creating boundaries, mindfulness, and discipline in one of the most daily parts of life: what we eat and how we eat it.",
    prompt: "Is this practice mainly personal—or does it shape a wider Jewish culture?",
    icon: "utensils",
  },
  {
    id: "holidays",
    category: "practices",
    title: "Celebrating holidays",
    subtitle: "A calendar of memory and joy",
    description:
      "Holidays turn history into lived time. They build shared stories, jokes, songs, and arguments that children overhear and inherit.",
    prompt: "Which memories would disappear if the calendar disappeared?",
    icon: "calendar-heart",
  },
  {
    id: "fasting",
    category: "practices",
    title: "Fasting",
    subtitle: "Discomfort as a teacher",
    description:
      "Fasting interrupts autopilot. It can sharpen empathy, regret, and seriousness.",
    prompt: "What can bodily discomfort teach that ideas alone cannot?",
    icon: "flame",
  },
  {
    id: "kippah",
    category: "practices",
    title: "Wearing a kippah",
    subtitle: "A visible reminder",
    description:
      "A small garment can change posture. It signals awareness, identity, and sometimes vulnerability in public space.",
    prompt: "What do visible markers do for a people—and for an individual?",
    icon: "circle-dot",
  },
  {
    id: "tefillin",
    category: "practices",
    title: "Tefillin",
    subtitle: "Words bound to body",
    description:
      "Ancient ritual technology: binding words to the arm and head so belief is not only thought but worn.",
    prompt:
      "How might this daily physical ritual shape a person's sense of responsibility and identity?",
    icon: "scroll",
  },
  {
    id: "torah-reading",
    category: "practices",
    title: "Torah (reading or hearing it)",
    subtitle: "The scroll at the center",
    description:
      "Whether you read Hebrew fluently or follow along in translation, Torah as public reading keeps a shared text well known from generation to generation.",
    prompt: "Who is responsible for keeping Torah literate across generations?",
    icon: "scroll-text",
  },
  {
    id: "hebrew",
    category: "practices",
    title: "Learning Hebrew",
    subtitle: "Language as inheritance",
    description:
      "Hebrew connects people across borders and centuries. Even partial literacy can change what feels “ours” versus foreign.",
    prompt: "What is gained—and what is risked—when a sacred language is widely learned?",
    icon: "languages",
  },
  {
    id: "tzedakah",
    category: "practices",
    title: "Tzedakah",
    subtitle: "Justice expressed as giving",
    description:
      "Not “charity” in the optional sense—something closer to expected fairness. It trains the hand to match the conscience.",
    prompt: "How much should giving be private—and how much communal?",
    icon: "coins",
  },
  {
    id: "daily-prayer",
    category: "practices",
    title: "Daily prayer",
    subtitle: "Regular words, regular return",
    description:
      "Daily liturgy can feel repetitive—until you notice repetition as practice: gratitude, confession, praise, petition, woven into ordinary time.",
    prompt: "Can a future stay Jewish without regular spoken prayer?",
    icon: "sunrise",
  },
];
