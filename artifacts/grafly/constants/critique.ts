// Critique-tab constants. Extracted from app/(tabs)/critique.tsx so the
// screen file can focus on layout + lifecycle, and the constants can be
// re-used by sub-components (CritiqueOnboarding references the reward
// numbers in its tooltip copy, etc.).

export const XP_PER_SESSION = 20;
export const COINS_PER_SESSION = 8;
export const MIN_USER_TURNS_FOR_REWARD = 3;
export const TYPEWRITER_SPEED_MS = 14;

export const ONBOARDING_KEY = "grafly:critique_onboarding_seen_v1";

// Quick start prompt chips. Shown above the composer when the user
// has not yet typed anything, so the screen never confronts them
// with an empty input. Tapping a chip pre-fills the composer with a
// concrete starter so they can focus on the design instead of the
// blank page. Labels follow the house rule: no hyphens / em dashes.
export const QUICK_PROMPTS: Array<{
  label: string;
  icon: string;
  prompt: string;
}> = [
  { label: "First impression", icon: "flash", prompt: "First impression: " },
  {
    label: "Color & contrast",
    icon: "color-filter",
    prompt: "How is color and contrast working here? ",
  },
  {
    label: "Hierarchy",
    icon: "layers-outline",
    prompt: "Walk me through the visual hierarchy. ",
  },
  {
    label: "Typography",
    icon: "text-outline",
    prompt: "Critique the typography choices. ",
  },
  {
    label: "Layout",
    icon: "grid-outline",
    prompt: "How does the layout balance the elements? ",
  },
  {
    label: "What to improve",
    icon: "pencil",
    prompt: "If you could change one thing, what would it be and why? ",
  },
];

// Conversation openers for the critique tab. Each one leads with a real
// design prompt — an observation to make, a question to sit with, an
// instruction to look. NO canned greetings ("Hey!", "Oh nice!", "Love
// this!", "Mmm…") — those felt fake and templated. Warmth comes from
// the curiosity in the question itself, not from a sticker at the front.
// Variety in shape matters: some lead with a question, some with an
// invitation to notice, some with a quick framing.
export const OPENER_TEMPLATES: Array<(title: string) => string> = [
  (t) =>
    `Take ten seconds with "${t}" before you read anything else.\n\nWhere does your eye land first, and what do you think pulled it there?`,
  (t) =>
    `Here's "${t}".\n\nWhat feeling does it give you in the first second — before you start analyzing it?`,
  (t) =>
    `Three words for "${t}". The first ones that come to mind, not the polished ones.\n\nWhich of the three is the design earning hardest right now?`,
  (t) =>
    `Look at "${t}" and trace your eye's path: first stop, second stop, third stop.\n\nWhat's the designer using to lead you between them?`,
  (t) =>
    `What problem is "${t}" actually solving for whoever opens it?\n\nThe layout will tell you, if you watch how it's prioritising things.`,
  (t) =>
    `One thing in "${t}" that's working confidently. One thing that still feels like it's figuring itself out.\n\nWhich is which, in your read?`,
  (t) =>
    `If "${t}" had to lose one element to feel cleaner, which would you cut?\n\nAnd what would the screen quietly gain without it?`,
  (t) =>
    `In "${t}", color and typography are splitting the work somehow.\n\nWhich one is doing the heavier lifting — and is that the right call?`,
  (t) =>
    `Of contrast, hierarchy, rhythm, and balance — which one is loudest in "${t}" right now?\n\nPoint me to where you see it.`,
  (t) =>
    `"${t}" is quietly asking the viewer to do something.\n\nWhat action, and what's making the invitation feel obvious (or not)?`,
  (t) =>
    `Cover the bottom half of "${t}" with your hand for a moment. Then the top half.\n\nWhich half could stand on its own, and which one needs the other?`,
  (t) =>
    `If "${t}" landed in your feed at thumbnail size, what would still survive?\n\nThat's usually the real design — the rest is supporting cast.`,
];

// Pick a random opener for the supplied design title. Pure function so
// the screen can call it from inside loadNewDesign without pulling in
// the openers list directly.
export function pickOpener(title: string): string {
  const fn =
    OPENER_TEMPLATES[Math.floor(Math.random() * OPENER_TEMPLATES.length)];
  return fn(title);
}
