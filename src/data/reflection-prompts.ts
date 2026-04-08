/** Reusable reflection copy for modals, panels, and discussion boxes */

export const METAPHOR_BULLETS: string[] = [
  "The island represents the Jewish future we are building together—not a fantasy escape, but a direction.",
  "What you take to the island symbolizes what you choose to preserve, practice, and pass on.",
  "What you leave behind raises uncomfortable questions about limits, loss, and responsibility.",
  "This experience is meant to spark conversation about continuity, identity, values, and communal obligation.",
];

export const METAPHOR_REFLECTION_PROMPTS: string[] = [
  "What does Jewish life need in order to remain alive and meaningful?",
  "Which parts of Judaism are personally meaningful to you?",
  "Which parts feel necessary not only for you, but for the entire community?",
  "If something disappears from communal life, can it be replaced—or is something essential lost?",
];

export const REALM_PROMPTS = {
  values: [
    "Which values sustain not just individuals, but an entire people?",
    "Which values guide how Jewish life should grow?",
    "Which values would be most dangerous to lose?",
  ],
  texts: [
    "Which teachings most deserve to survive into the future?",
    "Which text best captures a core Jewish idea for you?",
    "Which text shapes not just belief, but behavior?",
  ],
  practices: [
    "Which practices keep Judaism lived rather than abstract?",
    "Which practices create identity across generations?",
    "Which practices hold communities together in real life?",
  ],
} as const;

export const OPTIONAL_TEXTAREA_PROMPTS: string[] = [
  "Why did these choices feel most essential?",
  "Which choice was hardest to make?",
  "What did you leave behind that still felt important?",
  "How would the Jewish future change if your community chose differently?",
  "Are your selections personally meaningful, communally necessary, or both?",
];

export const COMMUNAL_CALLOUT_PROMPTS: string[] = [
  "If all Jews left this behind, what would change?",
  "Could Jewish life remain meaningful without this?",
  "Is there a replacement—or would something essential be lost?",
  "Are your choices universal, particular, or both?",
  "How does a value become real in daily practice?",
];
