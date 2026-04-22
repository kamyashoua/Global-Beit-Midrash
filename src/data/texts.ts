import type { SelectableItem } from "@/types/content";

/** Texts realm — user must pick exactly 2 */
export const TEXTS: SelectableItem[] = [
  {
    id: "text-deuteronomy-open-hand",
    category: "texts",
    title: "Care for the vulnerable",
    subtitle: "Deuteronomy 15:7",
    quote:
      "Do not harden your heart and do not close your hand to your needy brother.",
    description:
      "Context: wealth is not only private success—it comes with a stubborn obligation to stay open-hearted and open-handed when others are struggling.",
    prompt:
      "If a society stops feeling this as a moral pressure, what kind of people do we become?",
    icon: "hand-heart",
  },
  {
    id: "text-pirkei-mighty",
    category: "texts",
    title: "Mastery of the self",
    subtitle: "Pirkei Avot 4:1",
    quote:
      "Who is mighty? He who subdues his evil inclination. He that rules his spirit is better than he that takes a city.",
    description:
      "Context: real strength is not domination of others—it is learning to govern anger, fear, ego, and impulse when it is hardest.",
    prompt: "Where is self-control a communal issue—not only a private one?",
    icon: "swords",
  },
  {
    id: "text-kiddushin-study-action",
    category: "texts",
    title: "Study that leads to action",
    subtitle: "Kiddushin 40b",
    quote:
      "In a debate of which is more important, study or action, the Rabbis determined that study is greater than action, because study leads to action.",
    description:
      "Context: learning matters because it changes behavior. Ideas are measured by what they produce in real life.",
    prompt: "What is something you believe only because you have not lived it yet?",
    icon: "book-marked",
  },
  {
    id: "text-bava-metzia-water",
    category: "texts",
    title: "The ethics of survival",
    subtitle: "Bava Metzia 62a",
    quote:
      "If two people are traveling in the desert and there is only enough water for one to survive, the owner drinks it—his life takes precedence.",
    description:
      "Context: this is a hard teaching about limits. It forces questions about responsibility, triage, and what law can and cannot demand in impossible situations.",
    prompt: "When survival clashes with sharing, how should a community decide—and who gets heard?",
    icon: "droplets",
  },
  {
    id: "text-eruvin-these-and-these",
    category: "texts",
    title: "Sacred disagreement and humility",
    subtitle: "Eruvin 13b (teaching story)",
    quote:
      "In a debate between Beit Shammai and Beit Hillel, the Divine favored B. Hillel, because they learned the opinions of B. Shammai before their own.",
    description:
      "Context: disagreement can be holy—and humility means you can hold your view while honoring the dignity of an opposing one.",
    prompt: "What would it look like to argue like people who believe truth is bigger than winning?",
    icon: "scale",
  },
];
