export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "image_id"
  | "spot_the_difference"
  | "tap_the_element"
  | "arrange_in_order"
  | "drag_to_match"
  | "fill_in_blank"
  | "spot_bad_design"
  | "choose_better_design"
  | "drag_drop_layout"
  | "five_second_test"
  | "find_the_cta"
  | "color_match"
  | "contrast_check"
  | "palette_build"
  | "drag_match";

export interface MatchPair {
  left: string;
  right: string;
}

// ---------------------------------------------------------------------------
// Scene DSL — lightweight, declarative descriptions of in-lesson UI samples.
// Rendered with React Native primitives by components/LessonScenes.tsx so the
// course needs zero new image assets while still feeling like real screens.
// ---------------------------------------------------------------------------

export type SceneBlock =
  | { kind: "title"; text: string; size?: number; color?: string; align?: "left" | "center"; weight?: "bold" | "black" | "regular"; tapId?: string }
  | { kind: "subtitle"; text: string; size?: number; color?: string; opacity?: number; align?: "left" | "center"; weight?: "bold" | "black" | "regular"; tapId?: string }
  | { kind: "body"; text: string; size?: number; color?: string; opacity?: number; align?: "left" | "center"; lines?: number; weight?: "bold" | "black" | "regular"; tapId?: string }
  | { kind: "button"; text: string; bg: string; fg: string; large?: boolean; outline?: boolean; tapId?: string; rounded?: number }
  | { kind: "tag"; text: string; bg: string; fg: string }
  | { kind: "image"; bg: string; height: number; emoji?: string; rounded?: number; tapId?: string }
  | { kind: "spacer"; size: number }
  | { kind: "row"; gap?: number; align?: "center" | "start" | "end" | "between"; children: SceneBlock[] }
  | { kind: "card"; bg?: string; padding?: number; border?: string; rounded?: number; children: SceneBlock[] }
  | { kind: "divider"; color?: string }
  | { kind: "stat"; label: string; value: string; bg?: string; fg?: string };

export interface ScreenSpec {
  bg: string;
  padding?: number;
  blocks: SceneBlock[];
}

export type Scene =
  | { kind: "good_vs_bad"; good: ScreenSpec; bad: ScreenSpec; goodNote: string; badNote: string }
  | { kind: "spot_bad"; screen: ScreenSpec; targetTapId: string; prompt?: string }
  | {
      kind: "ab_compare";
      left: ScreenSpec;
      right: ScreenSpec;
      correctIndex: 0 | 1;
      prompt?: string;
      leftLabel?: string;
      rightLabel?: string;
    }
  | {
      kind: "drag_layout";
      cards: { id: string; label: string; sub?: string; tone?: string }[];
      correctOrder: string[];
      prompt?: string;
    }
  | {
      kind: "five_sec";
      screen: ScreenSpec;
      followUp: { question: string; options: string[]; correctIndex: number; explanation: string };
      durationMs?: number;
    }
  | { kind: "find_cta"; screen: ScreenSpec; correctTapId: string; prompt?: string }
  | { kind: "preview"; screen: ScreenSpec }
  | {
      // Tap the swatch that matches a target color, a harmony rule, or a
      // semantic role (e.g. "the warm one", "the complement of teal").
      kind: "color_match";
      targetHex: string;
      targetLabel?: string;
      choices: string[];
      correctIndex: number;
      prompt?: string;
    }
  | {
      // Live contrast adjuster: user nudges text lightness up/down on a
      // sample card. Renderer computes WCAG ratio in real time and only
      // accepts a lock-in when ratio >= targetMinRatio.
      kind: "contrast_check";
      bgHex: string;
      startTextHex: string;
      sampleHeading: string;
      sampleBody: string;
      targetMinRatio: number; // 4.5 = AA body, 3.0 = AA large, 7.0 = AAA
      prompt?: string;
    }
  | {
      // Pick exactly N swatches that complete a harmony from a base color
      // (e.g. "pick the two analogous neighbours of this teal").
      kind: "palette_build";
      baseHex: string;
      baseLabel?: string;
      choices: string[];
      correctIndices: number[];
      selectCount: number;
      ruleLabel: string;
      prompt?: string;
    }
  | {
      // True drag-and-drop. The player drags each chip from a tray onto one
      // of the labeled slots. Slots can show a colored backdrop (so the
      // player drops a label onto a swatch) or just a label (so the player
      // drops a colored chip onto a role). `correctMap` is chipId → slotId.
      kind: "drag_match";
      slots: { id: string; label: string; sub?: string; bgHex?: string; fgHex?: string }[];
      chips: { id: string; label: string; bgHex?: string; fgHex?: string }[];
      correctMap: Record<string, string>;
      prompt?: string;
    };

export interface LessonIntro {
  headline: string;
  body: string;
  scene?: Scene;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctIndex?: number;
  correctBool?: boolean;
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  correctOrder?: number[];
  pairs?: MatchPair[];
  blanks?: string[];
  acceptedAnswers?: string[];
  template?: string;
  scene?: Scene;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  questions: Question[];
  critiquePrompt?: string;
  intro?: LessonIntro;
}

export interface SkillNode {
  id: string;
  title: string;
  icon: string;
  description: string;
  lessons: Lesson[];
  prerequisites: string[];
  courseId: string;
}

export interface Course {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  nodes: SkillNode[];
}

export const COURSES: Course[] = [
  {
    id: "design-principles",
    title: "Design Principles",
    icon: "grid-outline",
    description: "Six modules, real mini-games, and the why behind every rule of good design.",
    color: "#00A4FA",
    nodes: [
      // ========== MODULE 1: CONTRAST ==========
      {
        id: "dp-contrast",
        courseId: "design-principles",
        title: "Contrast",
        icon: "contrast-outline",
        description: "Make the right thing impossible to miss.",
        prerequisites: [],
        lessons: [
          {
            id: "dp-contrast-1",
            title: "Why Contrast Matters",
            description: "The single biggest readability lever you have.",
            xpReward: 20,
            coinReward: 5,
            intro: {
              headline: "Contrast is how design speaks.",
              body: "Without it, everything blends. With it, the eye knows where to land first.",
              scene: {
                kind: "good_vs_bad",
                goodNote: "High contrast: the headline pops, the action is unmissable.",
                badNote: "Low contrast: the eye gets lost, and nothing feels primary.",
                good: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "title", text: "Welcome back", size: 24, color: "#21263F", weight: "bold" },
                    { kind: "body", text: "Your dashboard is ready.", size: 14, color: "#646A88" },
                    { kind: "spacer", size: 16 },
                    { kind: "button", text: "Open dashboard", bg: "#0078BB", fg: "#FFFFFF", large: true },
                  ],
                },
                bad: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "title", text: "Welcome back", size: 24, color: "#C8CCD9", weight: "bold" },
                    { kind: "body", text: "Your dashboard is ready.", size: 14, color: "#DEE0ED" },
                    { kind: "spacer", size: 16 },
                    { kind: "button", text: "Open dashboard", bg: "#E8EBF5", fg: "#C8CCD9", large: true },
                  ],
                },
              },
            },
            questions: [
              {
                id: "dp-c1-q1",
                type: "multiple_choice",
                question: "What does contrast primarily do for a layout?",
                options: [
                  "Makes the screen look busy",
                  "Tells the eye what's most important",
                  "Adds extra colors for variety",
                  "Slows the user down on purpose",
                ],
                correctIndex: 1,
                explanation: "Contrast is signal — it tells the eye where to start.",
                difficulty: 1,
              },
              {
                id: "dp-c1-q2",
                type: "true_false",
                question: "Contrast can come from size, weight, or shape — not just color.",
                correctBool: true,
                explanation: "Size and weight carry contrast too. Mix them to feel layered.",
                difficulty: 1,
              },
              {
                id: "dp-c1-q3",
                type: "multiple_choice",
                question: "WCAG AA requires body text to hit at least which contrast ratio?",
                options: ["2:1", "3:1", "4.5:1", "7:1"],
                correctIndex: 2,
                explanation: "4.5:1 is the floor. Below it, body text gets unreadable for many.",
                difficulty: 2,
              },
            ],
          },
          {
            id: "dp-contrast-2",
            title: "Spot the Bad Design",
            description: "Find the contrast problem in a real-looking screen.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Train your eye.",
              body: "One element on this screen would fail in production. Tap it.",
            },
            questions: [
              {
                id: "dp-c2-q1",
                type: "spot_bad_design",
                question: "Tap the element with a contrast problem.",
                explanation: "'Save changes' is under 2:1 — way too quiet for a primary action.",
                difficulty: 2,
                scene: {
                  kind: "spot_bad",
                  prompt: "One of these is unreadable for a lot of users. Tap it.",
                  targetTapId: "save",
                  screen: {
                    bg: "#FFFFFF", padding: 16,
                    blocks: [
                      { kind: "title", text: "Account settings", size: 22, color: "#21263F", weight: "bold" },
                      { kind: "spacer", size: 12 },
                      { kind: "card", bg: "#F5F6FA", padding: 14, rounded: 14, children: [
                        { kind: "body", text: "Email", size: 12, color: "#646A88" },
                        { kind: "body", text: "designer@grafly.app", size: 16, color: "#21263F" },
                      ]},
                      { kind: "spacer", size: 12 },
                      { kind: "card", bg: "#F5F6FA", padding: 14, rounded: 14, children: [
                        { kind: "body", text: "Plan", size: 12, color: "#646A88" },
                        { kind: "body", text: "Pro", size: 16, color: "#21263F" },
                      ]},
                      { kind: "spacer", size: 20 },
                      { kind: "row", gap: 12, children: [
                        { kind: "button", text: "Cancel", bg: "#F5F6FA", fg: "#21263F", tapId: "cancel" },
                        { kind: "button", text: "Save changes", bg: "#F5F6FA", fg: "#DEE0ED", tapId: "save" },
                      ]},
                    ],
                  },
                },
              },
              {
                id: "dp-c2-q2",
                type: "multiple_choice",
                question: "When fixing a low-contrast button, the safest move is to:",
                options: [
                  "Add a subtle border around it",
                  "Make the fill darker and the text white",
                  "Increase the corner radius",
                  "Use a lighter shade of the brand color",
                ],
                correctIndex: 1,
                explanation: "Dark fill + white text is the cleanest way past 4.5:1.",
                difficulty: 2,
              },
            ],
          },
          {
            id: "dp-contrast-3",
            title: "Choose the Better Design",
            description: "Pick the version that actually works.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Two takes. One winner.",
              body: "Same content, two takes. Pick the one that earned its hierarchy.",
            },
            questions: [
              {
                id: "dp-c3-q1",
                type: "choose_better_design",
                question: "Which onboarding screen leads the eye better?",
                explanation: "B wins. One dark CTA + muted text = clear path. Two bold buttons split attention.",
                difficulty: 2,
                scene: {
                  kind: "ab_compare",
                  prompt: "Same content, different contrast choices. Pick the stronger one.",
                  correctIndex: 1,
                  leftLabel: "A",
                  rightLabel: "B",
                  left: {
                    bg: "#FFFFFF", padding: 14,
                    blocks: [
                      { kind: "title", text: "Get started", size: 20, color: "#21263F", weight: "bold" },
                      { kind: "body", text: "Build your first project today.", size: 13, color: "#21263F" },
                      { kind: "spacer", size: 14 },
                      { kind: "button", text: "Create project", bg: "#0078BB", fg: "#FFFFFF" },
                      { kind: "spacer", size: 8 },
                      { kind: "button", text: "Browse templates", bg: "#0078BB", fg: "#FFFFFF" },
                    ],
                  },
                  right: {
                    bg: "#FFFFFF", padding: 14,
                    blocks: [
                      { kind: "title", text: "Get started", size: 20, color: "#21263F", weight: "bold" },
                      { kind: "body", text: "Build your first project today.", size: 13, color: "#646A88" },
                      { kind: "spacer", size: 14 },
                      { kind: "button", text: "Create project", bg: "#0078BB", fg: "#FFFFFF" },
                      { kind: "spacer", size: 8 },
                      { kind: "button", text: "Browse templates", bg: "#FFFFFF", fg: "#0078BB", outline: true },
                    ],
                  },
                },
              },
            ],
          },
          {
            // NEW: live contrast game inside Design Principles. Learner
            // dials the text lightness on a real preview card until the
            // WCAG ratio passes 4.5:1. They learn by actually fixing it.
            id: "dp-contrast-4",
            title: "Tune Until It Passes",
            description: "Adjust the text until WCAG accepts it.",
            xpReward: 30,
            coinReward: 10,
            intro: {
              headline: "Don't guess — measure.",
              body: "Pros don't eyeball contrast. They measure it. Nudge the text until the ratio crosses 4.5:1.",
            },
            questions: [
              {
                id: "dp-c4-q1",
                type: "contrast_check",
                question: "Push the body text until it passes WCAG AA.",
                explanation: "4.5:1 is the AA bar for body text. Below it, real users — especially in sunlight — start to lose words.",
                difficulty: 2,
                scene: {
                  kind: "contrast_check",
                  bgHex: "#FFFFFF",
                  startTextHex: "#A8B0C8",
                  sampleHeading: "Plan your week",
                  sampleBody: "Drag tasks across days. We'll keep your weekend free.",
                  targetMinRatio: 4.5,
                  prompt: "The body text is too pale. Make it darker until WCAG accepts it.",
                },
              },
            ],
          },
        ],
      },

      // ========== MODULE 2: TYPOGRAPHY ==========
      {
        id: "dp-typography",
        courseId: "design-principles",
        title: "Typography",
        icon: "text-outline",
        description: "Set type that earns trust at a glance.",
        prerequisites: ["dp-contrast"],
        lessons: [
          {
            id: "dp-typo-1",
            title: "Type Has a Job",
            description: "Headlines lead. Body explains. Labels orient.",
            xpReward: 20,
            coinReward: 5,
            intro: {
              headline: "Every text style is a promise.",
              body: "Bigger says 'start here.' Smaller says 'detail.' Match sizes to priorities.",
              scene: {
                kind: "good_vs_bad",
                goodNote: "Three sizes, clear roles — eye lands on the headline first.",
                badNote: "Everything is the same size. The page has no entry point.",
                good: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "title", text: "New in Grafly", size: 24, color: "#21263F", weight: "bold" },
                    { kind: "subtitle", text: "Faster lessons, better feedback", size: 14, color: "#646A88" },
                    { kind: "spacer", size: 12 },
                    { kind: "body", text: "We rebuilt the lesson engine to react in under 50ms — taps feel instant.", size: 13, color: "#21263F" },
                  ],
                },
                bad: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "body", text: "New in Grafly", size: 14, color: "#21263F" },
                    { kind: "body", text: "Faster lessons, better feedback", size: 14, color: "#21263F" },
                    { kind: "spacer", size: 8 },
                    { kind: "body", text: "We rebuilt the lesson engine to react in under 50ms — taps feel instant.", size: 14, color: "#21263F" },
                  ],
                },
              },
            },
            questions: [
              {
                id: "dp-t1-q1",
                type: "multiple_choice",
                question: "What's the main job of a typographic hierarchy?",
                options: [
                  "Show off the font you bought",
                  "Tell the reader where to look first, second, third",
                  "Fill the page with variety",
                  "Match a competitor's look",
                ],
                correctIndex: 1,
                explanation: "Hierarchy is a roadmap — headline, subhead, body, no thinking required.",
                difficulty: 1,
              },
              {
                id: "dp-t1-q2",
                type: "true_false",
                question: "Body text usually reads best between 14 and 18px on mobile.",
                correctBool: true,
                explanation: "14–18px is the sweet spot. Smaller cramps, bigger shouts.",
                difficulty: 1,
              },
              {
                id: "dp-t1-q3",
                type: "multiple_choice",
                question: "A comfortable line height for body text is about:",
                options: ["1.0× the font size", "1.2× the font size", "1.5× the font size", "2.5× the font size"],
                correctIndex: 2,
                explanation: "~1.5 breathes without falling apart. 1.0 is a wall, 2.5 disconnects.",
                difficulty: 2,
              },
            ],
          },
          {
            id: "dp-typo-2",
            title: "Pick the Better Headline",
            description: "Two headlines, one is doing its job.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Headlines earn the rest of the page.",
              body: "If the headline doesn't land, no one reads the body.",
            },
            questions: [
              {
                id: "dp-t2-q1",
                type: "choose_better_design",
                question: "Which headline treatment carries more confidence?",
                explanation: "B wins. Headline is 2–3× the body — a clear lead.",
                difficulty: 2,
                scene: {
                  kind: "ab_compare",
                  correctIndex: 1,
                  leftLabel: "A",
                  rightLabel: "B",
                  left: {
                    bg: "#FFFFFF", padding: 14,
                    blocks: [
                      { kind: "title", text: "Design that ships.", size: 18, color: "#21263F", weight: "bold" },
                      { kind: "spacer", size: 6 },
                      { kind: "body", text: "From idea to production in one tool.", size: 16, color: "#21263F" },
                    ],
                  },
                  right: {
                    bg: "#FFFFFF", padding: 14,
                    blocks: [
                      { kind: "title", text: "Design that ships.", size: 28, color: "#21263F", weight: "black" },
                      { kind: "spacer", size: 6 },
                      { kind: "body", text: "From idea to production in one tool.", size: 14, color: "#646A88" },
                    ],
                  },
                },
              },
              {
                id: "dp-t2-q2",
                type: "true_false",
                question: "Mixing 4+ fonts on one screen usually strengthens hierarchy.",
                correctBool: false,
                explanation: "Two font families, max. Hierarchy is size and weight — not more typefaces.",
                difficulty: 2,
              },
            ],
          },
          {
            id: "dp-typo-3",
            title: "Stack the Hierarchy",
            description: "Reorder the blocks so the most important one leads.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Order is hierarchy.",
              body: "Order matters before fonts do. Sort these the way a user scans.",
            },
            questions: [
              {
                id: "dp-t3-q1",
                type: "drag_drop_layout",
                question: "Order this product card so the eye lands the right way.",
                explanation: "Name → price → description → action. Buttons first ask users to commit blind.",
                difficulty: 3,
                scene: {
                  kind: "drag_layout",
                  prompt: "Tap the arrows to put these blocks in the order a buyer would scan them.",
                  correctOrder: ["name", "price", "desc", "cta"],
                  cards: [
                    { id: "cta", label: "Add to cart", sub: "Primary action", tone: "accent" },
                    { id: "desc", label: "Hand-bound notebook", sub: "Body description" },
                    { id: "name", label: "Field Journal", sub: "Product name" },
                    { id: "price", label: "$28", sub: "Price" },
                  ],
                },
              },
            ],
          },
        ],
      },

      // ========== MODULE 3: SPACING ==========
      {
        id: "dp-spacing",
        courseId: "design-principles",
        title: "Spacing",
        icon: "expand-outline",
        description: "Whitespace isn't empty — it's structure.",
        prerequisites: ["dp-typography"],
        lessons: [
          {
            id: "dp-space-1",
            title: "Whitespace Works",
            description: "Why breathing room is a design tool.",
            xpReward: 20,
            coinReward: 5,
            intro: {
              headline: "Space is a tool, not leftover.",
              body: "Whitespace groups, separates, and lets the eye rest.",
              scene: {
                kind: "good_vs_bad",
                goodNote: "Generous spacing: each item has room. Easy to scan.",
                badNote: "No spacing: items collide. The eye doesn't know where one ends.",
                good: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "card", bg: "#F5F6FA", padding: 14, rounded: 14, children: [
                      { kind: "body", text: "Inbox", size: 16, color: "#21263F", weight: "bold" },
                      { kind: "body", text: "12 unread messages", size: 13, color: "#646A88" },
                    ]},
                    { kind: "spacer", size: 12 },
                    { kind: "card", bg: "#F5F6FA", padding: 14, rounded: 14, children: [
                      { kind: "body", text: "Drafts", size: 16, color: "#21263F", weight: "bold" },
                      { kind: "body", text: "3 saved", size: 13, color: "#646A88" },
                    ]},
                  ],
                },
                bad: {
                  bg: "#FFFFFF", padding: 4,
                  blocks: [
                    { kind: "card", bg: "#F5F6FA", padding: 4, rounded: 4, children: [
                      { kind: "body", text: "Inbox", size: 16, color: "#21263F", weight: "bold" },
                      { kind: "body", text: "12 unread messages", size: 13, color: "#646A88" },
                    ]},
                    { kind: "card", bg: "#F5F6FA", padding: 4, rounded: 4, children: [
                      { kind: "body", text: "Drafts", size: 16, color: "#21263F", weight: "bold" },
                      { kind: "body", text: "3 saved", size: 13, color: "#646A88" },
                    ]},
                  ],
                },
              },
            },
            questions: [
              {
                id: "dp-s1-q1",
                type: "multiple_choice",
                question: "Whitespace between two elements primarily signals:",
                options: [
                  "That you ran out of content",
                  "That those elements are unrelated, or that one is finished",
                  "That the screen needs more padding everywhere",
                  "That the design isn't done yet",
                ],
                correctIndex: 1,
                explanation: "Proximity = relationship. Close items group, distant items separate.",
                difficulty: 1,
              },
              {
                id: "dp-s1-q2",
                type: "true_false",
                question: "Items in the same group should have less space between them than between groups.",
                correctBool: true,
                explanation: "Tight inside groups, loose between them. No contrast, no structure.",
                difficulty: 1,
              },
              {
                id: "dp-s1-q3",
                type: "multiple_choice",
                question: "A consistent spacing scale (4, 8, 12, 16, 24…) helps because:",
                options: [
                  "It looks more mathematical",
                  "It removes guesswork and creates visual rhythm",
                  "It makes the file size smaller",
                  "It's required by accessibility",
                ],
                correctIndex: 1,
                explanation: "A scale answers every spacing choice. Same rhythm = designed system.",
                difficulty: 2,
              },
            ],
          },
          {
            id: "dp-space-2",
            title: "Spot the Spacing Mistake",
            description: "Find the cramped element.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "When spacing breaks, hierarchy breaks.",
              body: "Look at this card. One element is suffocating. Tap it.",
            },
            questions: [
              {
                id: "dp-s2-q1",
                type: "spot_bad_design",
                question: "Tap the element with a spacing problem.",
                explanation: "'Continue' has no breathing room. A primary action needs space around it.",
                difficulty: 2,
                scene: {
                  kind: "spot_bad",
                  prompt: "Something here doesn't have enough room. Tap it.",
                  targetTapId: "continue",
                  screen: {
                    bg: "#FFFFFF", padding: 16,
                    blocks: [
                      { kind: "card", bg: "#F5F6FA", padding: 18, rounded: 16, children: [
                        { kind: "title", text: "Verify your email", size: 18, color: "#21263F", weight: "bold", tapId: "title" },
                        { kind: "spacer", size: 10 },
                        { kind: "body", text: "We sent a code to your inbox. Enter it to keep going.", size: 13, color: "#646A88", tapId: "body" },
                        { kind: "button", text: "Continue", bg: "#0078BB", fg: "#FFFFFF", tapId: "continue" },
                      ]},
                    ],
                  },
                },
              },
            ],
          },
          {
            id: "dp-space-3",
            title: "Reorder for Clarity",
            description: "Group these list items by relationship.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Order tells a story.",
              body: "Settings screens with no logic feel chaotic. Drag these into a sensible flow.",
            },
            questions: [
              {
                id: "dp-s3-q1",
                type: "drag_drop_layout",
                question: "Order these settings the way a user would expect them.",
                explanation: "Profile → notifications → privacy → sign out. Sign out up top invites accidents.",
                difficulty: 3,
                scene: {
                  kind: "drag_layout",
                  prompt: "Tap the arrows to put settings in the order users expect.",
                  correctOrder: ["profile", "notif", "privacy", "signout"],
                  cards: [
                    { id: "signout", label: "Sign out", sub: "Destructive", tone: "danger" },
                    { id: "notif", label: "Notifications", sub: "App behavior" },
                    { id: "profile", label: "Profile", sub: "Identity" },
                    { id: "privacy", label: "Privacy", sub: "Account" },
                  ],
                },
              },
            ],
          },
        ],
      },

      // ========== MODULE 4: COLOR ==========
      {
        id: "dp-color",
        courseId: "design-principles",
        title: "Color",
        icon: "color-filter-outline",
        description: "Use color with intent — not as decoration.",
        prerequisites: ["dp-contrast"],
        lessons: [
          {
            id: "dp-color-1",
            title: "Color Has a Job",
            description: "Brand, mood, and meaning, all at once.",
            xpReward: 20,
            coinReward: 5,
            intro: {
              headline: "Color is a signal, not paint.",
              body: "Red stops. Green goes. Your brand color means 'tap here.' Every color does a job.",
              scene: {
                kind: "good_vs_bad",
                goodNote: "One brand color, used only for primary actions. Easy to find what to tap.",
                badNote: "Color used everywhere — nothing stands out, and the brand color loses meaning.",
                good: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "title", text: "Your trip", size: 22, color: "#21263F", weight: "bold" },
                    { kind: "body", text: "3 days in Lisbon", size: 14, color: "#646A88" },
                    { kind: "spacer", size: 14 },
                    { kind: "button", text: "Book now", bg: "#0078BB", fg: "#FFFFFF" },
                  ],
                },
                bad: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "title", text: "Your trip", size: 22, color: "#0078BB", weight: "bold" },
                    { kind: "body", text: "3 days in Lisbon", size: 14, color: "#FF7BD0" },
                    { kind: "spacer", size: 14 },
                    { kind: "button", text: "Book now", bg: "#0078BB", fg: "#FFFFFF" },
                  ],
                },
              },
            },
            questions: [
              {
                id: "dp-co1-q1",
                type: "multiple_choice",
                question: "Why use only one accent color for primary actions?",
                options: [
                  "Because designers like minimalism",
                  "So the user instantly knows where to tap",
                  "Because more colors cost more to print",
                  "It's required by app stores",
                ],
                correctIndex: 1,
                explanation: "Accent everywhere = accent nowhere. Reserve it for the primary action.",
                difficulty: 1,
              },
              {
                id: "dp-co1-q2",
                type: "true_false",
                question: "Red is generally associated with destructive or warning actions.",
                correctBool: true,
                explanation: "Red reads as caution. Reserve it for delete, error, or stop.",
                difficulty: 1,
              },
              {
                id: "dp-co1-q3",
                type: "multiple_choice",
                question: "A solid neutral palette usually contains:",
                options: [
                  "One grey",
                  "5–6 greys at different values",
                  "Only pure black and pure white",
                  "Every color in the rainbow at low saturation",
                ],
                correctIndex: 1,
                explanation: "Real interfaces need 5–6 greys: backgrounds, surfaces, dividers, two text shades.",
                difficulty: 2,
              },
            ],
          },
          {
            id: "dp-color-2",
            title: "Pick the Right Palette",
            description: "Two takes on the same brand.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "The right color can carry the brand.",
              body: "Same product, two palettes. Pick the one that feels considered.",
            },
            questions: [
              {
                id: "dp-co2-q1",
                type: "choose_better_design",
                question: "Which palette feels more like a real product?",
                explanation: "B commits: one accent, neutral background. A spreads three colors — nothing leads.",
                difficulty: 2,
                scene: {
                  kind: "ab_compare",
                  correctIndex: 1,
                  leftLabel: "A",
                  rightLabel: "B",
                  left: {
                    bg: "#E3ED43", padding: 14,
                    blocks: [
                      { kind: "title", text: "Today's plan", size: 22, color: "#FF7BD0", weight: "bold" },
                      { kind: "body", text: "3 tasks left", size: 13, color: "#0078BB" },
                      { kind: "spacer", size: 12 },
                      { kind: "button", text: "Start", bg: "#FF7BD0", fg: "#FFFFFF" },
                    ],
                  },
                  right: {
                    bg: "#FFFFFF", padding: 14,
                    blocks: [
                      { kind: "title", text: "Today's plan", size: 22, color: "#21263F", weight: "bold" },
                      { kind: "body", text: "3 tasks left", size: 13, color: "#646A88" },
                      { kind: "spacer", size: 12 },
                      { kind: "button", text: "Start", bg: "#0078BB", fg: "#FFFFFF" },
                    ],
                  },
                },
              },
            ],
          },
          {
            id: "dp-color-3",
            title: "5-Second Brand Recall",
            description: "Glance, then answer.",
            xpReward: 30,
            coinReward: 10,
            intro: {
              headline: "First impressions are real.",
              body: "We'll flash a screen for five seconds. Glance — then we'll ask what stuck.",
            },
            questions: [
              {
                id: "dp-co3-q1",
                type: "five_second_test",
                question: "Glance at this screen, then answer.",
                explanation: "The lime headline is biggest and brightest — that's where the eye lands first.",
                difficulty: 2,
                scene: {
                  kind: "five_sec",
                  durationMs: 5000,
                  screen: {
                    bg: "#21263F", padding: 24,
                    blocks: [
                      { kind: "spacer", size: 40 },
                      { kind: "title", text: "Lift Off", size: 36, color: "#E3ED43", weight: "black" },
                      { kind: "spacer", size: 8 },
                      { kind: "body", text: "Your weekly product roadmap, in one place.", size: 14, color: "#DEE0ED" },
                      { kind: "spacer", size: 32 },
                      { kind: "button", text: "Launch dashboard", bg: "#FF7BD0", fg: "#FFFFFF", large: true },
                    ],
                  },
                  followUp: {
                    question: "What was the dominant brand color?",
                    options: ["Green", "Pink", "Yellow / lime", "Orange"],
                    correctIndex: 2,
                    explanation: "The lime headline is biggest and brightest — it lands first.",
                  },
                },
              },
            ],
          },
          {
            // NEW interactive lesson: tap the brand color from a row of
            // candidates. Trains the eye to spot a specific hue fast.
            id: "dp-color-4",
            title: "Spot the Brand Color",
            description: "Learn to recognize a hue at a glance.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Designers see hue, not just 'blue.'",
              body: "Two blues can feel completely different. Train your eye to find the exact one.",
            },
            questions: [
              {
                id: "dp-co4-q1",
                type: "color_match",
                question: "Tap the swatch that matches the target.",
                explanation: "Same family of blues, but only one is a true cyan. Look for the cooler, greener tilt.",
                difficulty: 2,
                scene: {
                  kind: "color_match",
                  targetHex: "#00A4FA",
                  targetLabel: "TARGET",
                  choices: ["#1E5BFF", "#00A4FA", "#5B7FFF", "#0066B8"],
                  correctIndex: 1,
                  prompt: "Find the exact target hue.",
                },
              },
              {
                id: "dp-co4-q2",
                type: "color_match",
                question: "Pick the warmest swatch.",
                explanation: "Reds, oranges and warm yellows feel hot. The terracotta is the warmest of these.",
                difficulty: 2,
                scene: {
                  kind: "color_match",
                  targetHex: "#21263F",
                  targetLabel: "WARMEST OF THE SET",
                  choices: ["#5BC0EB", "#7DD181", "#E07A5F", "#9D4EDD"],
                  correctIndex: 2,
                  prompt: "Which one feels the warmest to the eye?",
                },
              },
            ],
          },
          {
            // NEW: build a 60-30-10 palette by selecting the right
            // supporting colors next to a brand base.
            id: "dp-color-5",
            title: "Build the Palette",
            description: "Pick the supporting colors that work with the brand.",
            xpReward: 30,
            coinReward: 10,
            intro: {
              headline: "Color systems beat color picks.",
              body: "A brand is a system, not a single color. Pick the two supporting tones that hold the brand together.",
            },
            questions: [
              {
                id: "dp-co5-q1",
                type: "palette_build",
                question: "Pick the two neutrals that complete this brand system.",
                explanation: "A brand needs a near-black for text and a near-white for surfaces. Saturated greens and pinks would fight the brand color.",
                difficulty: 3,
                scene: {
                  kind: "palette_build",
                  baseHex: "#FF7BD0",
                  baseLabel: "BRAND COLOR",
                  choices: [
                    "#21263F", // good — near-black for text
                    "#7DD181", // bad — competes with brand
                    "#F5F6FA", // good — surface neutral
                    "#FFB400", // bad — second saturated color
                    "#5BC0EB", // bad — second saturated color
                    "#9C24A4", // bad — too close to brand hue
                  ],
                  correctIndices: [0, 2],
                  selectCount: 2,
                  ruleLabel: "neutral support",
                  prompt: "Brand color set. Which two neutrals support it without fighting it?",
                },
              },
            ],
          },
        ],
      },

      // ========== MODULE 5: HIERARCHY ==========
      {
        id: "dp-hierarchy",
        courseId: "design-principles",
        title: "Hierarchy",
        icon: "layers-outline",
        description: "Tell the eye where to go, in what order.",
        prerequisites: ["dp-typography", "dp-spacing"],
        lessons: [
          {
            id: "dp-hier-1",
            title: "The Eye Path",
            description: "Most layouts have a 'first read.' Yours should too.",
            xpReward: 20,
            coinReward: 5,
            intro: {
              headline: "Every screen has a first read.",
              body: "The eye lands somewhere first. Hierarchy makes that landing intentional.",
              scene: {
                kind: "good_vs_bad",
                goodNote: "Clear first-read: big number, then label, then context.",
                badNote: "Three competing emphasis levels — none of them wins.",
                good: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "body", text: "REVENUE", size: 11, color: "#646A88" },
                    { kind: "title", text: "$48,210", size: 36, color: "#21263F", weight: "black" },
                    { kind: "body", text: "+12% from last month", size: 13, color: "#138354" },
                  ],
                },
                bad: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "title", text: "REVENUE", size: 18, color: "#21263F", weight: "bold" },
                    { kind: "title", text: "$48,210", size: 18, color: "#21263F", weight: "bold" },
                    { kind: "title", text: "+12% from last month", size: 18, color: "#21263F", weight: "bold" },
                  ],
                },
              },
            },
            questions: [
              {
                id: "dp-h1-q1",
                type: "multiple_choice",
                question: "Visual hierarchy primarily uses what to lead the eye?",
                options: [
                  "Animations",
                  "Differences in size, weight, color, and position",
                  "More text",
                  "Drop shadows on everything",
                ],
                correctIndex: 1,
                explanation: "Hierarchy is contrast — bigger, bolder, brighter, higher.",
                difficulty: 1,
              },
              {
                id: "dp-h1-q2",
                type: "true_false",
                question: "If everything on a screen is bold, hierarchy gets stronger.",
                correctBool: false,
                explanation: "If everything's bold, nothing is. Hierarchy needs a high–low contrast.",
                difficulty: 1,
              },
              {
                id: "dp-h1-q3",
                type: "multiple_choice",
                question: "Which is usually the strongest position for the most important element?",
                options: [
                  "Bottom-right corner",
                  "Top-left or upper-center, where reading begins",
                  "Anywhere with a drop shadow",
                  "Inside a footer",
                ],
                correctIndex: 1,
                explanation: "Left-to-right eyes start top-left. Put the important thing where they land.",
                difficulty: 2,
              },
            ],
          },
          {
            id: "dp-hier-2",
            title: "Find the CTA",
            description: "Tap the primary action on this fake screen.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "A real screen has one main action.",
              body: "Hierarchy makes the next step obvious. Tap what the user should do first.",
            },
            questions: [
              {
                id: "dp-h2-q1",
                type: "find_the_cta",
                question: "Tap the primary call-to-action.",
                explanation: "'Start free trial' wins — solid fill, brand color, top of the zone.",
                difficulty: 2,
                scene: {
                  kind: "find_cta",
                  prompt: "Where's the next step? Tap it.",
                  correctTapId: "primary",
                  screen: {
                    bg: "#FFFFFF", padding: 16,
                    blocks: [
                      { kind: "spacer", size: 12 },
                      { kind: "title", text: "Build faster.", size: 28, color: "#21263F", weight: "black", tapId: "headline" },
                      { kind: "spacer", size: 6 },
                      { kind: "body", text: "Design, prototype, and ship — all in one place.", size: 14, color: "#646A88", tapId: "subhead" },
                      { kind: "spacer", size: 18 },
                      { kind: "button", text: "Start free trial", bg: "#0078BB", fg: "#FFFFFF", large: true, tapId: "primary" },
                      { kind: "spacer", size: 10 },
                      { kind: "button", text: "Sign in", bg: "#FFFFFF", fg: "#21263F", outline: true, tapId: "signin" },
                      { kind: "spacer", size: 12 },
                      { kind: "body", text: "Learn more", size: 13, color: "#646A88", align: "center", tapId: "learn" },
                    ],
                  },
                },
              },
              {
                id: "dp-h2-q2",
                type: "true_false",
                question: "A screen should usually have one primary action, with secondary actions visibly quieter.",
                correctBool: true,
                explanation: "Two loud buttons split attention. Pick one primary, demote the other to outline.",
                difficulty: 1,
              },
            ],
          },
          {
            id: "dp-hier-3",
            title: "Order the Layout",
            description: "Sequence sections of a landing page.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Order is half of hierarchy.",
              body: "Section order shapes the story. Sort these into a flow that converts.",
            },
            questions: [
              {
                id: "dp-h3-q1",
                type: "drag_drop_layout",
                question: "Order these landing-page sections from top to bottom.",
                explanation: "Hero → proof → features → CTA. Features first asks for details before users know the product.",
                difficulty: 3,
                scene: {
                  kind: "drag_layout",
                  prompt: "Order these from top of the page to bottom.",
                  correctOrder: ["hero", "proof", "features", "cta"],
                  cards: [
                    { id: "features", label: "Feature grid", sub: "How it works" },
                    { id: "cta", label: "Final CTA", sub: "Close the deal", tone: "accent" },
                    { id: "hero", label: "Hero headline", sub: "What & why" },
                    { id: "proof", label: "Logos / testimonials", sub: "Trust" },
                  ],
                },
              },
            ],
          },
        ],
      },

      // ========== MODULE 6: UX BASICS ==========
      {
        id: "dp-ux",
        courseId: "design-principles",
        title: "UX Basics",
        icon: "compass-outline",
        description: "Design the path, not just the picture.",
        prerequisites: ["dp-hierarchy", "dp-color"],
        lessons: [
          {
            id: "dp-ux-1",
            title: "Users Scan, Not Read",
            description: "Build for skim, not study.",
            xpReward: 20,
            coinReward: 5,
            intro: {
              headline: "Nobody reads the whole screen.",
              body: "Users scan, they don't read. If they can't find it fast, you've lost them.",
              scene: {
                kind: "good_vs_bad",
                goodNote: "Scannable: big label, clear value, obvious action.",
                badNote: "Wall of text: no entry point, no escape route.",
                good: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "title", text: "Free shipping", size: 22, color: "#21263F", weight: "bold" },
                    { kind: "body", text: "On orders over $50.", size: 14, color: "#646A88" },
                    { kind: "spacer", size: 12 },
                    { kind: "button", text: "Shop now", bg: "#0078BB", fg: "#FFFFFF" },
                  ],
                },
                bad: {
                  bg: "#FFFFFF", padding: 16,
                  blocks: [
                    { kind: "body", text: "We are excited to announce that you may be eligible for our free shipping promotion which applies to qualifying orders over $50 placed between today and the end of this month, subject to terms and conditions.", size: 13, color: "#21263F", lines: 6 },
                  ],
                },
              },
            },
            questions: [
              {
                id: "dp-u1-q1",
                type: "multiple_choice",
                question: "What's the single biggest UX win in most layouts?",
                options: [
                  "Adding more animations",
                  "Reducing the words and amplifying the structure",
                  "Using more fonts",
                  "Filling every pixel with information",
                ],
                correctIndex: 1,
                explanation: "Cut copy, surface structure. Most UX wins are 'remove enough,' not 'add more.'",
                difficulty: 1,
              },
              {
                id: "dp-u1-q2",
                type: "true_false",
                question: "A user's first action on a screen should be obvious within a few seconds.",
                correctBool: true,
                explanation: "Find-it-fast or lose them. Loud primary action, quiet secondary ones.",
                difficulty: 1,
              },
              {
                id: "dp-u1-q3",
                type: "multiple_choice",
                question: "An empty state is best treated as:",
                options: [
                  "Wasted space — fill it with marketing",
                  "An invitation to take the first action",
                  "An error to apologize for",
                  "A reason to hide the screen",
                ],
                correctIndex: 1,
                explanation: "Empty states are the cheapest onboarding. Show what success looks like, give one action.",
                difficulty: 2,
              },
            ],
          },
          {
            id: "dp-ux-2",
            title: "5-Second First Impression",
            description: "Glance at this landing screen, then answer.",
            xpReward: 30,
            coinReward: 10,
            intro: {
              headline: "Five seconds decide the rest.",
              body: "First impressions form in under five seconds. Glance, then we'll ask what stuck.",
            },
            questions: [
              {
                id: "dp-u2-q1",
                type: "five_second_test",
                question: "Glance at this landing page, then answer.",
                explanation: "One message lands first. The huge 'Plan your week' headline is what people remember.",
                difficulty: 2,
                scene: {
                  kind: "five_sec",
                  durationMs: 5000,
                  screen: {
                    bg: "#FFFFFF", padding: 24,
                    blocks: [
                      { kind: "spacer", size: 30 },
                      { kind: "title", text: "Plan your week.", size: 34, color: "#21263F", weight: "black" },
                      { kind: "spacer", size: 8 },
                      { kind: "body", text: "Three minutes on Monday. The rest of your week, sorted.", size: 14, color: "#646A88" },
                      { kind: "spacer", size: 24 },
                      { kind: "button", text: "Try it free", bg: "#0078BB", fg: "#FFFFFF", large: true },
                      { kind: "spacer", size: 10 },
                      { kind: "body", text: "No credit card needed", size: 12, color: "#646A88", align: "center" },
                    ],
                  },
                  followUp: {
                    question: "What was the main thing that screen wanted you to do?",
                    options: [
                      "Read a long article",
                      "Plan your week",
                      "Buy a hardware product",
                      "Sign up for a newsletter",
                    ],
                    correctIndex: 1,
                    explanation: "Headline says it, button reinforces it. Same job, twice — message lands.",
                  },
                },
              },
            ],
          },
          {
            id: "dp-ux-3",
            title: "Spot the UX Trap",
            description: "Find the friction in this checkout step.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Friction kills good intentions.",
              body: "Friction kills conversions. Find the trap on this checkout screen.",
            },
            questions: [
              {
                id: "dp-u3-q1",
                type: "spot_bad_design",
                question: "Tap the element that adds unnecessary friction.",
                explanation: "'Cancel' is loud red beside 'Pay now' — one wrong tap loses everything. Destructive actions should be quieter.",
                difficulty: 3,
                scene: {
                  kind: "spot_bad",
                  prompt: "Something here will cost conversions. Tap it.",
                  targetTapId: "cancel",
                  screen: {
                    bg: "#FFFFFF", padding: 16,
                    blocks: [
                      { kind: "title", text: "Confirm payment", size: 22, color: "#21263F", weight: "bold", tapId: "title" },
                      { kind: "spacer", size: 8 },
                      { kind: "body", text: "Total: $48.00", size: 16, color: "#21263F", tapId: "total" },
                      { kind: "spacer", size: 18 },
                      { kind: "row", gap: 10, children: [
                        { kind: "button", text: "Cancel", bg: "#DC2A3A", fg: "#FFFFFF", large: true, tapId: "cancel" },
                        { kind: "button", text: "Pay now", bg: "#0078BB", fg: "#FFFFFF", large: true, tapId: "pay" },
                      ]},
                    ],
                  },
                },
              },
              {
                id: "dp-u3-q2",
                type: "multiple_choice",
                question: "On a destructive screen, the safer pattern is:",
                options: [
                  "Two equally bold buttons side-by-side",
                  "Primary action prominent, destructive action quiet or separated",
                  "Hide the destructive action behind a long-press",
                  "Use the same color for both buttons",
                ],
                correctIndex: 1,
                explanation: "Destructive actions deserve respect, not equal billing. Demote them to outline or move them out.",
                difficulty: 2,
              },
            ],
          },
        ],
      },
    ],
  },

  // 4 modules of color fundamentals taught through interactive games:
  // tap-the-target swatches, live WCAG contrast tuners, and harmony builders.
  // ===========================================================================
  {
    id: "color-theory",
    title: "Color Theory",
    icon: "color-palette-outline",
    description: "Learn color by actually picking, mixing, and tuning it.",
    color: "#7B5CFF",
    nodes: [
      // ========== MODULE 1: COLOR FOUNDATIONS ==========
      {
        id: "ct-basics",
        courseId: "color-theory",
        title: "Color Foundations",
        icon: "water-outline",
        description: "Hue, saturation, lightness — the building blocks.",
        prerequisites: [],
        lessons: [
          {
            id: "ct-basics-1",
            title: "Hue, Saturation, Lightness",
            description: "Three dials describe every color you'll ever use.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Every color is three dials.",
              body: "Hue is the family (red, blue, green). Saturation is how vivid. Lightness is how bright. Master the three and you can tune any color on demand.",
            },
            questions: [
              {
                id: "ct-b1-q1",
                type: "multiple_choice",
                question: "Which property describes whether a color is red, blue, or green?",
                options: ["Saturation", "Hue", "Lightness", "Opacity"],
                correctIndex: 1,
                explanation: "Hue is the color family — its position on the color wheel. Saturation and lightness modify it.",
                difficulty: 1,
              },
              {
                id: "ct-b1-q2",
                type: "color_match",
                question: "Tap the most saturated swatch.",
                explanation: "Saturation = how vivid the color is. The pure pink pops because it has no grey mixed in.",
                difficulty: 2,
                scene: {
                  kind: "color_match",
                  targetHex: "#FF7BD0",
                  targetLabel: "MOST SATURATED",
                  choices: ["#C49AB6", "#FF7BD0", "#7B6571", "#A87BA1"],
                  correctIndex: 1,
                  prompt: "Three are muted versions of one base. Pick the original.",
                },
              },
              {
                id: "ct-b1-q3",
                type: "true_false",
                question: "Lowering a color's saturation moves it toward grey.",
                correctBool: true,
                explanation: "Saturation is the dial between full color and pure grey. Drop it all the way and any hue becomes grey.",
                difficulty: 1,
              },
            ],
          },
          {
            id: "ct-basics-2",
            title: "Warm vs Cool",
            description: "Half the wheel feels hot. The other half feels calm.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Color has temperature.",
              body: "Reds, oranges and yellows feel warm and energetic. Blues, greens and purples feel cool and calm. Designers use this to set mood before words ever land.",
            },
            questions: [
              {
                id: "ct-b2-q1",
                type: "color_match",
                question: "Tap the coolest swatch.",
                explanation: "Cool colors live on the blue/green/purple side of the wheel. The teal sits squarely there.",
                difficulty: 1,
                scene: {
                  kind: "color_match",
                  targetHex: "#21263F",
                  targetLabel: "COOLEST",
                  choices: ["#FFB400", "#E07A5F", "#00A4FA", "#FF7BD0"],
                  correctIndex: 2,
                  prompt: "Which swatch feels coldest to the eye?",
                },
              },
              {
                id: "ct-b2-q2",
                type: "multiple_choice",
                question: "Why do designers often pick a warm accent on a cool background?",
                options: [
                  "Warm colors are always brighter",
                  "It's a brand convention required by Apple",
                  "Temperature contrast makes the accent pop without needing huge saturation",
                  "Cool backgrounds are easier to print",
                ],
                correctIndex: 2,
                explanation: "Temperature contrast is one of the strongest ways to make an element jump forward — it works even when saturation is restrained.",
                difficulty: 2,
              },
            ],
          },
        ],
      },

      // ========== MODULE 2: COLOR WHEEL & HARMONY ==========
      {
        id: "ct-wheel",
        courseId: "color-theory",
        title: "Color Wheel & Harmony",
        icon: "sync-outline",
        description: "Use the wheel to build palettes that just work.",
        prerequisites: ["ct-basics"],
        lessons: [
          {
            id: "ct-wheel-1",
            title: "Complementary Colors",
            description: "Opposite sides of the wheel. Maximum punch.",
            xpReward: 30,
            coinReward: 10,
            intro: {
              headline: "Opposites attract — loudly.",
              body: "Complementary colors sit across from each other on the wheel. They create the strongest possible vibration. Use sparingly — they fight if both go full strength.",
            },
            questions: [
              {
                id: "ct-w1-q1",
                type: "color_match",
                question: "Tap the complement of this orange.",
                explanation: "Orange's complement is blue. They sit directly opposite on the wheel and create the strongest contrast.",
                difficulty: 2,
                scene: {
                  kind: "color_match",
                  targetHex: "#FF8A3D",
                  targetLabel: "COMPLEMENT OF",
                  choices: ["#FFB400", "#7DD181", "#3D8AFF", "#FF3D8A"],
                  correctIndex: 2,
                  prompt: "Which swatch sits directly opposite the target on the wheel?",
                },
              },
              {
                id: "ct-w1-q2",
                type: "true_false",
                question: "Pairing two complementary colors at 100% saturation usually feels comfortable to read.",
                correctBool: false,
                explanation: "Two full-saturation complements vibrate hard and cause eye strain. Pros pull one color's saturation down so the other can lead.",
                difficulty: 2,
              },
            ],
          },
          {
            id: "ct-wheel-2",
            title: "Analogous Harmony",
            description: "Three neighbours on the wheel. Calm, cohesive.",
            xpReward: 30,
            coinReward: 10,
            intro: {
              headline: "Neighbours sing together.",
              body: "Analogous palettes pick three colors that sit next to each other on the wheel. They feel calm and unified — perfect for backgrounds, gradients, and moods.",
            },
            questions: [
              {
                id: "ct-w2-q1",
                type: "palette_build",
                question: "Pick the two analogous neighbours of this teal.",
                explanation: "Analogous colors live next to each other on the wheel. The blue and the green are the teal's wheel neighbours; the pink and yellow are far away.",
                difficulty: 3,
                scene: {
                  kind: "palette_build",
                  baseHex: "#00C2A8",
                  baseLabel: "BASE TEAL",
                  choices: [
                    "#00A4FA", // good — adjacent blue
                    "#FF7BD0", // bad — opposite side
                    "#7DD181", // good — adjacent green
                    "#FFB400", // bad — far away
                    "#9D4EDD", // bad — far away
                    "#FF3D3D", // bad — opposite side
                  ],
                  correctIndices: [0, 2],
                  selectCount: 2,
                  ruleLabel: "analogous harmony",
                  prompt: "Build an analogous trio with this teal.",
                },
              },
              {
                id: "ct-w2-q2",
                type: "multiple_choice",
                question: "Which palette type uses three colors evenly spaced around the wheel?",
                options: ["Analogous", "Complementary", "Triadic", "Monochromatic"],
                correctIndex: 2,
                explanation: "Triadic palettes pick three colors equally spaced (120° apart). They feel vibrant and balanced — think red/yellow/blue.",
                difficulty: 2,
              },
            ],
          },
        ],
      },

      // ========== MODULE 3: CONTRAST & ACCESSIBILITY ==========
      {
        id: "ct-contrast",
        courseId: "color-theory",
        title: "Contrast & Accessibility",
        icon: "contrast-outline",
        description: "Color choices that real users can actually read.",
        prerequisites: ["ct-basics"],
        lessons: [
          {
            id: "ct-contrast-1",
            title: "WCAG in Plain English",
            description: "The rules every product designer should know cold.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Pretty doesn't ship. Readable does.",
              body: "WCAG is the worldwide standard for color contrast. Body text needs at least 4.5:1. Big headlines can get away with 3:1. Anything below fails real users.",
            },
            questions: [
              {
                id: "ct-c1-q1",
                type: "multiple_choice",
                question: "What's the minimum WCAG AA contrast ratio for body text?",
                options: ["2:1", "3:1", "4.5:1", "7:1"],
                correctIndex: 2,
                explanation: "4.5:1 is the AA bar for body text. Large text (18pt+) can drop to 3:1. AAA bumps body text to 7:1.",
                difficulty: 2,
              },
              {
                id: "ct-c1-q2",
                type: "contrast_check",
                question: "Tune this CTA text until it passes WCAG AA.",
                explanation: "When text sits in the same brightness range as its background, contrast collapses. Pushing the label darker pulls it away from the pink's luminance until it clears 4.5:1.",
                difficulty: 2,
                scene: {
                  kind: "contrast_check",
                  bgHex: "#FF7BD0",
                  startTextHex: "#B85A9F",
                  sampleHeading: "Get started",
                  sampleBody: "Free for the first 14 days",
                  targetMinRatio: 4.5,
                  prompt: "This label is barely readable on the pink. Push it darker until it clears WCAG AA.",
                },
              },
            ],
          },
          {
            id: "ct-contrast-2",
            title: "Hands-on Contrast",
            description: "Tune two real cards until they ship-ready.",
            xpReward: 30,
            coinReward: 10,
            intro: {
              headline: "Designers fix contrast every day.",
              body: "This is the most common edit you'll make in real product work. Train the muscle now.",
            },
            questions: [
              {
                id: "ct-c2-q1",
                type: "contrast_check",
                question: "Push this body copy until it passes on a dark background.",
                explanation: "On dark backgrounds you usually need to lighten the text — pure white isn't always required, but you need to clear 4.5:1.",
                difficulty: 2,
                scene: {
                  kind: "contrast_check",
                  bgHex: "#21263F",
                  startTextHex: "#5B6285",
                  sampleHeading: "Welcome back",
                  sampleBody: "Pick up where you left off — your draft is saved.",
                  targetMinRatio: 4.5,
                  prompt: "The body text is too dim against the navy. Lighten it.",
                },
              },
              {
                id: "ct-c2-q2",
                type: "contrast_check",
                question: "Tune the header until it clears the AA-large bar (3:1).",
                explanation: "Large headline text only needs 3:1 to pass AA. The bar is lower because big shapes are easier to read.",
                difficulty: 1,
                scene: {
                  kind: "contrast_check",
                  bgHex: "#F5F6FA",
                  startTextHex: "#C8CCDD",
                  sampleHeading: "Big numbers, easy reads",
                  sampleBody: "Trends at a glance.",
                  targetMinRatio: 3.0,
                  prompt: "Push the headline darker until it passes the large-text bar.",
                },
              },
            ],
          },
        ],
      },

      // ========== MODULE 4: BRAND COLOR SYSTEMS ==========
      {
        id: "ct-systems",
        courseId: "color-theory",
        title: "Brand Color Systems",
        icon: "layers-outline",
        description: "Turn one brand color into a working palette.",
        prerequisites: ["ct-wheel"],
        lessons: [
          {
            id: "ct-systems-1",
            title: "The 60-30-10 Rule",
            description: "A simple recipe for balanced color.",
            xpReward: 30,
            coinReward: 10,
            intro: {
              headline: "60% calm. 30% support. 10% punch.",
              body: "Most great interfaces follow the 60-30-10 rule: a dominant neutral, a secondary tone, and a tiny dose of brand accent. The accent only works because the rest is restrained.",
            },
            questions: [
              {
                id: "ct-s1-q1",
                type: "multiple_choice",
                question: "In the 60-30-10 rule, what should the 10% color be used for?",
                options: [
                  "Backgrounds and large surfaces",
                  "Body text and section dividers",
                  "Primary actions and accents that need attention",
                  "Borders around every component",
                ],
                correctIndex: 2,
                explanation: "The 10% is your loudest color — reserved for the action you want users to take. Spread it everywhere and it loses meaning.",
                difficulty: 2,
              },
              {
                id: "ct-s1-q2",
                type: "color_match",
                question: "Pick the swatch that should be the 10% accent.",
                explanation: "Neutrals make up the 60% and 30%. The saturated brand pink is the 10% — used only for the primary action.",
                difficulty: 2,
                scene: {
                  kind: "color_match",
                  targetHex: "#FF7BD0",
                  targetLabel: "10% ACCENT ROLE",
                  choices: ["#F5F6FA", "#646A88", "#FF7BD0", "#21263F"],
                  correctIndex: 2,
                  prompt: "Three are neutrals. One is the accent. Tap the accent.",
                },
              },
              {
                id: "ct-s1-q3",
                type: "drag_match",
                question: "Drag each color into the role it plays in a 60-30-10 system.",
                explanation: "The off-white sits behind everything (60%). The mid-grey carries support text and chrome (30%). The pink is the loud accent — saved for the one action you want users to take (10%).",
                difficulty: 3,
                scene: {
                  kind: "drag_match",
                  prompt: "Drag the swatches into 60%, 30%, and 10%.",
                  slots: [
                    { id: "slot-60", label: "60% — Surface", sub: "The dominant tone", bgHex: "#F5F6FA", fgHex: "#21263F" },
                    { id: "slot-30", label: "30% — Support", sub: "Text and chrome", bgHex: "#21263F", fgHex: "#FFFFFF" },
                    { id: "slot-10", label: "10% — Action", sub: "The one bold color", bgHex: "#FFFFFF", fgHex: "#21263F" },
                  ],
                  chips: [
                    { id: "chip-cream", label: "Off-white", bgHex: "#F5F6FA", fgHex: "#21263F" },
                    { id: "chip-grey", label: "Mid-grey", bgHex: "#646A88", fgHex: "#FFFFFF" },
                    { id: "chip-pink", label: "Brand pink", bgHex: "#FF7BD0", fgHex: "#21263F" },
                  ],
                  correctMap: {
                    "chip-cream": "slot-60",
                    "chip-grey": "slot-30",
                    "chip-pink": "slot-10",
                  },
                },
              },
            ],
          },
          {
            id: "ct-systems-2",
            title: "Semantic Colors",
            description: "Colors that mean something — across every product.",
            xpReward: 30,
            coinReward: 10,
            intro: {
              headline: "Some colors come with meaning attached.",
              body: "Red means stop or destroy. Green means go or success. Yellow means caution. Use them on purpose — and never use red for a non-destructive button.",
            },
            questions: [
              {
                id: "ct-s2-q1",
                type: "color_match",
                question: "Tap the swatch you'd use for a 'Delete' button.",
                explanation: "Red signals destruction across cultures and platforms. Use it for delete, archive, and similar irreversible actions.",
                difficulty: 1,
                scene: {
                  kind: "color_match",
                  targetHex: "#21263F",
                  targetLabel: "DESTRUCTIVE ACTION",
                  choices: ["#7DD181", "#FFB400", "#FF3D3D", "#00A4FA"],
                  correctIndex: 2,
                  prompt: "Which color sends 'this is irreversible — be sure'?",
                },
              },
              {
                id: "ct-s2-q1b",
                type: "drag_match",
                question: "Match each semantic role to its universal color.",
                explanation: "Across cultures and platforms, green = success, amber = warning, red = danger. Get this wrong and users panic when they shouldn't — or stay calm when they shouldn't.",
                difficulty: 2,
                scene: {
                  kind: "drag_match",
                  prompt: "Drag each role onto the matching swatch.",
                  slots: [
                    { id: "slot-green", label: "Green", sub: "Universal calm signal", bgHex: "#7DD181", fgHex: "#0E2A14" },
                    { id: "slot-amber", label: "Amber", sub: "Universal caution signal", bgHex: "#FFB400", fgHex: "#3A2700" },
                    { id: "slot-red", label: "Red", sub: "Universal stop signal", bgHex: "#FF3D3D", fgHex: "#FFFFFF" },
                  ],
                  chips: [
                    { id: "chip-success", label: "Success", bgHex: "#FFFFFF", fgHex: "#21263F" },
                    { id: "chip-warning", label: "Warning", bgHex: "#FFFFFF", fgHex: "#21263F" },
                    { id: "chip-danger", label: "Danger", bgHex: "#FFFFFF", fgHex: "#21263F" },
                  ],
                  correctMap: {
                    "chip-success": "slot-green",
                    "chip-warning": "slot-amber",
                    "chip-danger": "slot-red",
                  },
                },
              },
              {
                id: "ct-s2-q2",
                type: "palette_build",
                question: "Build a semantic set: success, warning, and danger.",
                explanation: "Green = success, yellow/amber = warning, red = danger. The blues and pinks are brand colors, not semantic ones.",
                difficulty: 3,
                scene: {
                  kind: "palette_build",
                  baseHex: "#21263F",
                  baseLabel: "PRODUCT NAVY",
                  choices: [
                    "#7DD181", // good — success
                    "#FF7BD0", // bad — brand
                    "#FFB400", // good — warning
                    "#00A4FA", // bad — brand
                    "#FF3D3D", // good — danger
                    "#9D4EDD", // bad — brand
                  ],
                  correctIndices: [0, 2, 4],
                  selectCount: 3,
                  ruleLabel: "semantic states",
                  prompt: "Pick the three colors that carry universal meaning.",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "typography",
    title: "Typography",
    icon: "text-outline",
    description: "Master type to communicate with clarity and style.",
    color: "#E3ED43",
    nodes: [
      {
        id: "typo-basics",
        courseId: "typography",
        title: "Type Basics",
        icon: "text-outline",
        description: "The foundational vocabulary of typography.",
        prerequisites: [],
        lessons: [
          {
            id: "typo-basics-1",
            title: "Serif vs Sans-Serif",
            description: "Understand the two main type families.",
            xpReward: 20,
            coinReward: 5,
            intro: {
              headline: "Two families, two voices.",
              body: "Serifs whisper editorial trust. Sans-serifs speak modern clarity. The right choice sets the tone before a single word is read.",
            },
            questions: [
              {
                id: "tb1",
                type: "multiple_choice",
                question: "Serif typefaces are characterized by:",
                options: ["Clean, stroke-free letterforms", "Small decorative strokes at letter ends", "All-caps styling", "Variable line widths only"],
                correctIndex: 1,
                explanation: "Serifs are the small decorative strokes or feet at the ends of letterforms, found in fonts like Times New Roman and Georgia.",
                difficulty: 1,
              },
              {
                id: "tb2",
                type: "true_false",
                question: "Sans-serif fonts are generally considered more modern and clean than serif fonts.",
                correctBool: true,
                explanation: "Sans-serif fonts lack the traditional decorative strokes of serifs, giving them a cleaner, more modern appearance — hence their popularity in digital UI design.",
                difficulty: 1,
              },
              {
                id: "tb3",
                type: "multiple_choice",
                question: "For long-form digital reading, which is recommended?",
                options: ["Display fonts only", "Script fonts", "High-legibility sans-serif or readable serif", "Condensed typefaces"],
                correctIndex: 2,
                explanation: "Long-form digital content performs best with fonts optimized for screen legibility — high-quality sans-serifs or screen-optimized serifs designed at reading sizes.",
                difficulty: 2,
              },
              {
                id: "tb4",
                type: "true_false",
                question: "Mixing a serif headline with a sans-serif body text is a classic typographic pairing.",
                correctBool: true,
                explanation: "Pairing a serif for headlines with a sans-serif for body text creates strong contrast and is a beloved typographic convention used in editorial and web design.",
                difficulty: 2,
              },
            ],
          },
        ],
      },
      {
        id: "typo-scale",
        courseId: "typography",
        title: "Type Scale",
        icon: "resize-outline",
        description: "Create consistent typographic rhythm and scale.",
        prerequisites: ["typo-basics"],
        lessons: [
          {
            id: "typo-scale-1",
            title: "Modular Scale",
            description: "Build harmonious type systems with mathematical ratios.",
            xpReward: 25,
            coinReward: 8,
            questions: [
              {
                id: "ts1",
                type: "multiple_choice",
                question: "The Major Third type scale uses a ratio of:",
                options: ["1.125", "1.250", "1.333", "1.618"],
                correctIndex: 1,
                explanation: "The Major Third scale uses a 1.250 ratio, creating gentle progression between type sizes — ideal for body-heavy content with modest hierarchy needs.",
                difficulty: 3,
              },
              {
                id: "ts2",
                type: "true_false",
                question: "A modular scale ensures typographic sizes are related by a consistent ratio.",
                correctBool: true,
                explanation: "Modular scales use a consistent multiplier ratio between each size step, creating mathematical harmony throughout a type system.",
                difficulty: 2,
              },
              {
                id: "ts3",
                type: "multiple_choice",
                question: "Line height (leading) for body text should typically be:",
                options: ["Equal to font size (1x)", "1.4–1.6x the font size", "2.0–2.5x the font size", "0.8x the font size"],
                correctIndex: 1,
                explanation: "A line height of 1.4–1.6x the font size provides comfortable reading rhythm. Too tight feels cramped; too loose breaks paragraph cohesion.",
                difficulty: 2,
              },
            ],
          },
        ],
      },
      {
        id: "typo-pairing",
        courseId: "typography",
        title: "Font Pairing",
        icon: "swap-horizontal-outline",
        description: "Combine typefaces for powerful visual contrast.",
        prerequisites: ["typo-scale"],
        lessons: [
          {
            id: "typo-pair-1",
            title: "The Art of Pairing",
            description: "Learn how to choose complementary typefaces.",
            xpReward: 25,
            coinReward: 8,
            intro: {
              headline: "Pairs aren't twins.",
              body: "Two fonts on a page should feel like a duet — different enough to give each a job, similar enough to belong together.",
            },
            questions: [
              {
                id: "tp1",
                type: "multiple_choice",
                question: "The most important rule when pairing fonts is:",
                options: ["Use fonts from different centuries", "Create clear contrast while maintaining harmony", "Always use three or more fonts", "Match exactly — use fonts from the same family only"],
                correctIndex: 1,
                explanation: "Great font pairings balance contrast (different enough to feel intentional) with harmony (complementary in personality, proportion, or period).",
                difficulty: 2,
              },
              {
                id: "tp2",
                type: "true_false",
                question: "Using two fonts from the same superfamily (e.g., Roboto and Roboto Slab) is a safe pairing strategy.",
                correctBool: true,
                explanation: "Superfamily pairings are reliable because the fonts share proportions and character, ensuring visual cohesion while providing serif/sans contrast.",
                difficulty: 3,
              },
            ],
          },
          {
            // NEW: hands-on game — pick the headline treatment that
            // actually carries weight. Reuses choose_better_design so
            // we don't need new font assets to ship this.
            id: "typo-pair-2",
            title: "Pick the Stronger Headline",
            description: "Spot the pairing that earns its hierarchy.",
            xpReward: 30,
            coinReward: 10,
            intro: {
              headline: "Hierarchy is a duet.",
              body: "Headline + body is the most-used pair on the planet. Pick the take that uses contrast on purpose.",
            },
            questions: [
              {
                id: "tp3",
                type: "choose_better_design",
                question: "Which headline pair carries more confidence?",
                explanation: "B wins. A heavy headline with quiet body copy creates a clear first read. Two equal weights flatten the page.",
                difficulty: 2,
                scene: {
                  kind: "ab_compare",
                  prompt: "Same words, two pairings. Pick the one with intentional contrast.",
                  correctIndex: 1,
                  leftLabel: "A",
                  rightLabel: "B",
                  left: {
                    bg: "#FFFFFF", padding: 18,
                    blocks: [
                      { kind: "title", text: "Plan your week", size: 22, color: "#21263F", weight: "bold" },
                      { kind: "spacer", size: 6 },
                      { kind: "body", text: "Drag tasks across days. We'll keep your weekend free.", size: 15, color: "#21263F" },
                    ],
                  },
                  right: {
                    bg: "#FFFFFF", padding: 18,
                    blocks: [
                      { kind: "title", text: "Plan your week", size: 32, color: "#21263F", weight: "black" },
                      { kind: "spacer", size: 6 },
                      { kind: "body", text: "Drag tasks across days. We'll keep your weekend free.", size: 13, color: "#646A88" },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ui-design",
    title: "UI Design",
    icon: "phone-portrait-outline",
    description: "Build beautiful, functional digital interfaces.",
    color: "#FF7BD0",
    nodes: [
      {
        id: "ui-grids",
        courseId: "ui-design",
        title: "Grid Systems",
        icon: "grid-outline",
        description: "Structure your layouts with mathematical precision.",
        prerequisites: [],
        lessons: [
          {
            id: "ui-grid-1",
            title: "Columns & Gutters",
            description: "Master the building blocks of grid-based layout.",
            xpReward: 20,
            coinReward: 5,
            questions: [
              {
                id: "ug1",
                type: "multiple_choice",
                question: "In a standard 12-column grid, content spanning 6 columns occupies:",
                options: ["25% of the container", "50% of the container", "75% of the container", "100% of the container"],
                correctIndex: 1,
                explanation: "6 columns out of 12 equals exactly 50% of the container width, making 12-column grids ideal for creating clean halves, thirds, and quarters.",
                difficulty: 1,
              },
              {
                id: "ug2",
                type: "true_false",
                question: "Gutters are the spaces between grid columns.",
                correctBool: true,
                explanation: "Gutters define the spacing between columns, preventing content from touching and creating breathing room throughout the layout.",
                difficulty: 1,
              },
              {
                id: "ug3",
                type: "multiple_choice",
                question: "Which grid system is most commonly used in mobile UI design?",
                options: ["24-column grid", "12-column grid", "4-column grid", "Baseline grid only"],
                correctIndex: 2,
                explanation: "Mobile screens typically use a 4-column grid due to their narrow width, which maps cleanly to full-width, half-width, and quarter-width components.",
                difficulty: 2,
              },
            ],
          },
        ],
      },
      {
        id: "ui-patterns",
        courseId: "ui-design",
        title: "UI Patterns",
        icon: "browsers-outline",
        description: "Learn proven solutions to common UI problems.",
        prerequisites: ["ui-grids"],
        lessons: [
          {
            id: "ui-patterns-1",
            title: "Navigation Patterns",
            description: "Design navigation that users understand instinctively.",
            xpReward: 25,
            coinReward: 8,
            questions: [
              {
                id: "up1",
                type: "multiple_choice",
                question: "A bottom tab bar in mobile apps is optimal for:",
                options: ["More than 7 primary sections", "2–5 primary destinations", "Only single-page apps", "E-commerce checkout flows"],
                correctIndex: 1,
                explanation: "Bottom tab bars work best for 2–5 primary destinations. More than 5 tabs become hard to reach and visually cluttered; fewer than 2 doesn't warrant a tab bar.",
                difficulty: 2,
              },
              {
                id: "up2",
                type: "true_false",
                question: "The hamburger menu is the most accessible navigation pattern for mobile.",
                correctBool: false,
                explanation: "Hamburger menus hide navigation, reducing discoverability. Studies show bottom tab bars lead to higher engagement because options are always visible.",
                difficulty: 2,
              },
              {
                id: "up3",
                type: "multiple_choice",
                question: "Which navigation pattern is best for deep content hierarchies on mobile?",
                options: ["Bottom tab bar", "Floating action button", "Push navigation stack", "Breadcrumb trail"],
                correctIndex: 2,
                explanation: "Push navigation (drill-down stacks) handles deep hierarchies well on mobile, allowing users to navigate forward and back through content levels.",
                difficulty: 3,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "branding",
    title: "Branding",
    icon: "diamond-outline",
    description: "Craft identities that resonate and endure.",
    color: "#FF7BD0",
    nodes: [
      {
        id: "brand-identity",
        courseId: "branding",
        title: "Brand Identity",
        icon: "star-outline",
        description: "The core elements that define a brand.",
        prerequisites: [],
        lessons: [
          {
            id: "brand-1",
            title: "What Makes a Brand",
            description: "Understand brand identity beyond just a logo.",
            xpReward: 20,
            coinReward: 5,
            questions: [
              {
                id: "bi1",
                type: "multiple_choice",
                question: "Brand identity is best described as:",
                options: ["Just the logo and color palette", "The complete visual and verbal expression of a brand", "The company's marketing budget", "The product's packaging only"],
                correctIndex: 1,
                explanation: "Brand identity is the holistic system of visual, verbal, and experiential elements that communicate who a brand is — logo, color, typography, tone, imagery, and more.",
                difficulty: 1,
              },
              {
                id: "bi2",
                type: "true_false",
                question: "A strong brand identity must remain completely static and never evolve.",
                correctBool: false,
                explanation: "Strong brands evolve while maintaining their core essence. Consider Google, Apple, and Nike — all have updated their identities significantly while staying recognizable.",
                difficulty: 2,
              },
              {
                id: "bi3",
                type: "multiple_choice",
                question: "Which element is considered the anchor of most brand identity systems?",
                options: ["Brand photography", "Color palette", "The logo", "Website layout"],
                correctIndex: 2,
                explanation: "The logo is the cornerstone of brand identity — it's the most compact symbol of the brand and informs the visual language of all other elements.",
                difficulty: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "golden-ratio",
    title: "The Golden Ratio",
    icon: "infinite-outline",
    description: "Unlock nature's most beautiful proportion.",
    color: "#E3ED43",
    nodes: [
      {
        id: "gr-intro",
        courseId: "golden-ratio",
        title: "Phi & Beauty",
        icon: "infinite-outline",
        description: "Discover the mathematical basis of aesthetic harmony.",
        prerequisites: [],
        lessons: [
          {
            id: "gr-1",
            title: "The Golden Ratio Explained",
            description: "What is phi and why do humans find it beautiful?",
            xpReward: 20,
            coinReward: 5,
            questions: [
              {
                id: "gr1",
                type: "multiple_choice",
                question: "The golden ratio (phi) is approximately equal to:",
                options: ["1.414", "1.618", "2.718", "3.141"],
                correctIndex: 1,
                explanation: "Phi (φ) ≈ 1.618. This irrational number appears throughout nature and has been used by artists and architects for millennia to create aesthetically pleasing proportions.",
                difficulty: 1,
              },
              {
                id: "gr2",
                type: "true_false",
                question: "The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13...) approximates the golden ratio.",
                correctBool: true,
                explanation: "Dividing any Fibonacci number by the previous one approaches 1.618 as the sequence progresses. This is why the golden spiral appears in nautilus shells and sunflowers.",
                difficulty: 2,
              },
              {
                id: "gr3",
                type: "multiple_choice",
                question: "The golden rectangle has proportions of:",
                options: ["1:2", "1:1.618", "2:3", "3:4"],
                correctIndex: 1,
                explanation: "A golden rectangle has width-to-height ratio of 1:1.618. If you remove a square from it, the remaining rectangle has the same golden ratio — infinitely recursive.",
                difficulty: 2,
              },
              {
                id: "gr4",
                type: "multiple_choice",
                question: "Which of these logo designs is said to use golden ratio proportions?",
                options: ["Twitter (early bird)", "Apple logo", "Microsoft logo", "Amazon logo"],
                correctIndex: 1,
                explanation: "The Apple logo's proportions are famously analyzed through golden ratio geometry, with many of its circular curves and spacing based on phi-derived measurements.",
                difficulty: 3,
              },
            ],
          },
        ],
      },
      {
        id: "gr-application",
        courseId: "golden-ratio",
        title: "Applying Phi",
        icon: "compass-outline",
        description: "Use the golden ratio in real design work.",
        prerequisites: ["gr-intro"],
        lessons: [
          {
            id: "gr-2",
            title: "Golden Ratio in Layout",
            description: "Structure compositions using phi-based proportions.",
            xpReward: 25,
            coinReward: 8,
            questions: [
              {
                id: "gra1",
                type: "multiple_choice",
                question: "To apply the golden ratio to a 1000px wide layout, the main column should be approximately:",
                options: ["500px", "618px", "750px", "800px"],
                correctIndex: 1,
                explanation: "1000 ÷ 1.618 ≈ 618px. The primary content column would be 618px with a 382px sidebar — a classic golden ratio layout.",
                difficulty: 3,
              },
              {
                id: "gra2",
                type: "true_false",
                question: "The rule of thirds is an approximation of the golden ratio.",
                correctBool: true,
                explanation: "The rule of thirds (dividing into 1/3 and 2/3) approximates the golden ratio (0.382 and 0.618), making it a practical shortcut for achieving phi-like compositions.",
                difficulty: 2,
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // COURSE 6: COLOR THEORY (NEW)
];

export const PLACEMENT_QUESTIONS: Question[] = [
  {
    id: "p1",
    type: "multiple_choice",
    question: "Which design principle refers to the perceived 'heaviness' of elements in a composition?",
    options: ["Visual rhythm", "Visual weight", "Typographic contrast", "Color temperature"],
    correctIndex: 1,
    explanation: "Visual weight is the perceived heaviness or lightness of elements based on size, color, texture, and placement.",
    difficulty: 2,
  },
  {
    id: "p2",
    type: "true_false",
    question: "A typeface classified as 'italic' is the same as one classified as 'oblique'.",
    correctBool: false,
    explanation: "Italic is a specially drawn version of a typeface; oblique is simply the roman version slanted mechanically. They look similar but are technically different.",
    difficulty: 3,
  },
  {
    id: "p3",
    type: "multiple_choice",
    question: "The Gestalt principle of 'proximity' states that:",
    options: ["Similar elements appear related", "Elements close together appear grouped", "Enclosed elements form a unit", "The mind fills in missing information"],
    correctIndex: 1,
    explanation: "Proximity holds that objects near each other are perceived as related, which is why menu items are grouped and spacing separates unrelated content.",
    difficulty: 2,
  },
  {
    id: "p4",
    type: "true_false",
    question: "In color theory, complementary colors sit opposite each other on the color wheel.",
    correctBool: true,
    explanation: "Complementary colors (red/green, blue/orange, yellow/purple) create maximum contrast when placed together, making each color appear more vibrant.",
    difficulty: 1,
  },
  {
    id: "p5",
    type: "multiple_choice",
    question: "What is kerning in typography?",
    options: ["The space between lines of text", "The thickness of a letterform's stroke", "Adjusting space between specific letter pairs", "The height of capital letters"],
    correctIndex: 2,
    explanation: "Kerning is the process of adjusting space between specific pairs of letters (like 'AV' or 'WA') to achieve optically even spacing.",
    difficulty: 3,
  },
  {
    id: "p6",
    type: "multiple_choice",
    question: "A 'hero' section in web design refers to:",
    options: ["The navigation bar", "The prominent header area at the top of the page", "The footer content", "A featured product card"],
    correctIndex: 1,
    explanation: "The hero section is the large prominent area at the top of a webpage — typically the first thing users see, often containing a headline, subhead, and CTA.",
    difficulty: 1,
  },
  {
    id: "p7",
    type: "true_false",
    question: "CMYK is the color model used for screen/digital design.",
    correctBool: false,
    explanation: "RGB is the color model for screens (Red, Green, Blue light mixing). CMYK (Cyan, Magenta, Yellow, Key/Black) is used for print production.",
    difficulty: 2,
  },
  {
    id: "p8",
    type: "multiple_choice",
    question: "The '60-30-10 rule' in color design refers to:",
    options: ["Frame rates for animation", "Proportional color distribution (dominant, secondary, accent)", "Grid column ratios", "A typeface classification system"],
    correctIndex: 1,
    explanation: "The 60-30-10 rule: 60% dominant color (backgrounds), 30% secondary color (cards/surfaces), 10% accent color (CTAs, highlights) — a formula for balanced palettes.",
    difficulty: 3,
  },
  {
    id: "p9",
    type: "multiple_choice",
    question: "What does 'affordance' mean in UX/product design?",
    options: ["The cost of a design tool subscription", "Visual cues that suggest how an element can be interacted with", "The loading performance of an interface", "Color contrast accessibility rating"],
    correctIndex: 1,
    explanation: "Affordance describes visual properties that suggest interaction possibilities. A button looks pressable; a slider looks draggable. Good affordances reduce cognitive load.",
    difficulty: 3,
  },
  {
    id: "p10",
    type: "true_false",
    question: "Whitespace (or negative space) is wasted space that should be filled with content.",
    correctBool: false,
    explanation: "Whitespace is a powerful design tool that improves readability, creates focus, suggests elegance, and reduces cognitive load. Premium brands use whitespace deliberately.",
    difficulty: 1,
  },
];

export function getAllLessons(): Lesson[] {
  return COURSES.flatMap((c) => c.nodes.flatMap((n) => n.lessons));
}

export function findNodeById(nodeId: string): SkillNode | undefined {
  return COURSES.flatMap((c) => c.nodes).find((n) => n.id === nodeId);
}

export function findCourseByNodeId(nodeId: string): Course | undefined {
  return COURSES.find((c) => c.nodes.some((n) => n.id === nodeId));
}

export interface CurrentPosition {
  courseId: string;
  nodeId: string;
  courseIdx: number;
  nodeIdx: number;
  allComplete: boolean;
}

/**
 * Returns the user's current learning position based on completed lessons.
 * "Current" = the first module (in course → node order) that still has at
 * least one unfinished lesson. If everything is finished, returns the very
 * first node so the user can review/practice.
 */
export function getCurrentPosition(completedLessons: string[]): CurrentPosition {
  for (let ci = 0; ci < COURSES.length; ci++) {
    const course = COURSES[ci];
    for (let ni = 0; ni < course.nodes.length; ni++) {
      const node = course.nodes[ni];
      const allDone = node.lessons.every((l) => completedLessons.includes(l.id));
      if (!allDone) {
        return {
          courseId: course.id,
          nodeId: node.id,
          courseIdx: ci,
          nodeIdx: ni,
          allComplete: false,
        };
      }
    }
  }
  const firstCourse = COURSES[0];
  const firstNode = firstCourse?.nodes[0];
  return {
    courseId: firstCourse?.id ?? "",
    nodeId: firstNode?.id ?? "",
    courseIdx: 0,
    nodeIdx: 0,
    allComplete: true,
  };
}

export const MODULE_UNLOCK_MESSAGES: Record<string, string> = {
  "dp-contrast": "Contrast unlocked. Your designs will pop.",
  "dp-typography": "Typography unlocked. Your words now carry weight.",
  "dp-spacing": "Spacing unlocked. Your layouts can breathe.",
  "dp-color": "Color unlocked. Palettes that work for you.",
  "dp-hierarchy": "Hierarchy unlocked. Guide every eye.",
  "dp-ux-basics": "UX basics down. Your screens feel obvious.",
  "ct-basics": "Color foundations unlocked. The dials are yours.",
  "ct-wheel": "Color wheel unlocked. Harmony on demand.",
  "ct-contrast": "Contrast unlocked. Real users can read your work.",
  "ct-systems": "Brand systems unlocked. One color, full palette.",
};
