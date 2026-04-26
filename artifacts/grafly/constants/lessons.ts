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
  | "find_the_cta";

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
  | { kind: "preview"; screen: ScreenSpec };

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
                explanation: "Contrast is signal. Without it, every element competes equally. The right contrast tells the eye where to start.",
                difficulty: 1,
              },
              {
                id: "dp-c1-q2",
                type: "true_false",
                question: "Contrast can come from size, weight, or shape — not just color.",
                correctBool: true,
                explanation: "Color is the loudest tool, but size and weight carry plenty too. Mixing types is what makes a screen feel layered.",
                difficulty: 1,
              },
              {
                id: "dp-c1-q3",
                type: "multiple_choice",
                question: "WCAG AA requires body text to hit at least which contrast ratio?",
                options: ["2:1", "3:1", "4.5:1", "7:1"],
                correctIndex: 2,
                explanation: "4.5:1 is the floor for body text. Below that, low vision and screen glare make it unreadable for many.",
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
                explanation: "'Save changes' is pale grey on white — under 2:1. A primary action should be the loudest thing on screen, not the quietest.",
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
                explanation: "Dark fill + white text is the cleanest way past 4.5:1. Borders and radius don't change weight — color does.",
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
                explanation: "B wins. One dark CTA against muted text creates a clear path. Two equally bold buttons just split attention.",
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
              body: "Bigger and bolder says 'start here.' Smaller and calmer says 'detail.' Match sizes to priorities or users feel the friction.",
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
                explanation: "Hierarchy is a roadmap. The eye should hop from headline to subhead to body without thinking.",
                difficulty: 1,
              },
              {
                id: "dp-t1-q2",
                type: "true_false",
                question: "Body text usually reads best between 14 and 18px on mobile.",
                correctBool: true,
                explanation: "Below 14 feels cramped, above 18 feels like an alert. 14–18 is the sweet spot for paragraph text.",
                difficulty: 1,
              },
              {
                id: "dp-t1-q3",
                type: "multiple_choice",
                question: "A comfortable line height for body text is about:",
                options: ["1.0× the font size", "1.2× the font size", "1.5× the font size", "2.5× the font size"],
                correctIndex: 2,
                explanation: "~1.5 gives lines breathing room without losing cohesion. 1.0 reads as a wall, 2.5 falls apart.",
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
              body: "If the headline doesn't land, no one reads the body. Pick the version that gives it real weight.",
            },
            questions: [
              {
                id: "dp-t2-q1",
                type: "choose_better_design",
                question: "Which headline treatment carries more confidence?",
                explanation: "B wins. Headline is 2–3× the body — a clear lead. When sizes are close, neither one leads.",
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
                explanation: "More fonts means more competing voices. Two families is the cap. Hierarchy comes from size and weight, not extra typefaces.",
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
              body: "Before you change a font, the order you stack things in sets the tone. Sort these the way a user would scan them.",
            },
            questions: [
              {
                id: "dp-t3-q1",
                type: "drag_drop_layout",
                question: "Order this product card so the eye lands the right way.",
                explanation: "Name first (identity), price (the decision), description (justification), then action (commit). Buttons first ask users to commit before they understand.",
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
              body: "Whitespace groups, separates, and lets the eye rest. Used well, a screen feels calm — not empty.",
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
                explanation: "Proximity creates relationship. Things close together read as a group; apart, they read as separate. Use space to express structure.",
                difficulty: 1,
              },
              {
                id: "dp-s1-q2",
                type: "true_false",
                question: "Items in the same group should have less space between them than between groups.",
                correctBool: true,
                explanation: "Law of proximity: tight inside a group, loose between groups. Without that contrast, structure disappears.",
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
                explanation: "A scale gives every spacing choice an answer. Same rhythm everywhere is what makes a system feel designed.",
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
                explanation: "'Continue' sits flush against the text — no breathing room. A primary action needs space around it so users feel invited, not crowded.",
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
                explanation: "Identity first (profile), then behavior (notifications), then account (privacy). Sign out lives last — putting it up top invites accidents.",
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
              body: "Red means stop. Green means go. Your brand color means 'tap here.' Every color should do a job — never just decorate.",
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
                explanation: "If your accent shows up everywhere, it stops meaning 'tap here.' Reserve it for the primary action.",
                difficulty: 1,
              },
              {
                id: "dp-co1-q2",
                type: "true_false",
                question: "Red is generally associated with destructive or warning actions.",
                correctBool: true,
                explanation: "Red reads as caution. Reserve it for delete, error, or stop — using it elsewhere teaches users to ignore the warning.",
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
                explanation: "Real interfaces need backgrounds, surfaces, dividers, and two text shades — all greys. A handful of values is a working system.",
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
                explanation: "B commits: one accent, neutral background, calm supporting text. A spreads three brand colors equally — nothing leads.",
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
              body: "We'll flash a screen for five seconds. Just glance — don't memorize. Then we'll ask what stuck.",
            },
            questions: [
              {
                id: "dp-co3-q1",
                type: "five_second_test",
                question: "Glance at this screen, then answer.",
                explanation: "The lime headline carries the page — biggest, brightest. The pink button is loud, but lime lands first. Hierarchy doing its job.",
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
                    explanation: "The lime headline is biggest and brightest. Even with a loud pink button, lime is where the eye lands first.",
                  },
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
              body: "The eye lands somewhere first whether you planned it or not. Hierarchy is the choice to make that landing intentional.",
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
                explanation: "Hierarchy is built from contrast — bigger, bolder, brighter, higher. Take those away and there's no hierarchy to read.",
                difficulty: 1,
              },
              {
                id: "dp-h1-q2",
                type: "true_false",
                question: "If everything on a screen is bold, hierarchy gets stronger.",
                correctBool: false,
                explanation: "If everything's bold, nothing is. Hierarchy needs a high–low contrast: bold against regular, big against small.",
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
                explanation: "In left-to-right cultures, the eye starts top-left. Put the most important thing where the eye already lands.",
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
              body: "Hierarchy makes the next step obvious. Look at this screen and tap what the user should do first.",
            },
            questions: [
              {
                id: "dp-h2-q1",
                type: "find_the_cta",
                question: "Tap the primary call-to-action.",
                explanation: "'Start free trial' wins — solid fill, brand color, top of the action zone. Secondary actions use lighter weights so they don't compete.",
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
                explanation: "Two equally loud buttons split attention. Pick one as primary, demote the other to outline. Same options, clearer path.",
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
              body: "Before sizes and colors, section order shapes the story. Sort these into a flow that converts.",
            },
            questions: [
              {
                id: "dp-h3-q1",
                type: "drag_drop_layout",
                question: "Order these landing-page sections from top to bottom.",
                explanation: "Hero leads (what & why), proof builds trust, features explain how, final CTA closes. Features first asks readers for details before they know the product.",
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
              body: "Users scan for what they came to do. If they have to read every word to find it, you've lost them.",
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
                explanation: "Cutting copy and surfacing structure lets users find what they need at a glance. Most UX wins are 'remove enough,' not 'add more.'",
                difficulty: 1,
              },
              {
                id: "dp-u1-q2",
                type: "true_false",
                question: "A user's first action on a screen should be obvious within a few seconds.",
                correctBool: true,
                explanation: "If the next step takes more than a couple seconds to find, users hesitate. Loud primary action, quiet secondary ones.",
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
                explanation: "Empty states are the cheapest onboarding you have. Show what success looks like and give one clear action.",
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
              body: "First impressions form in under five seconds. We'll flash a real-looking landing screen and ask what stuck.",
            },
            questions: [
              {
                id: "dp-u2-q1",
                type: "five_second_test",
                question: "Glance at this landing page, then answer.",
                explanation: "Strong landing pages let one message land first. The huge 'Plan your week' headline is what most people walk away with — hierarchy doing its job.",
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
                    explanation: "The headline says it, the button reinforces it. When the headline and the primary action point at the same job, your message lands even on a quick glance.",
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
              body: "Even users who want to convert will bail when something feels off. Find the trap on this checkout screen.",
            },
            questions: [
              {
                id: "dp-u3-q1",
                type: "spot_bad_design",
                question: "Tap the element that adds unnecessary friction.",
                explanation: "'Cancel' sits beside 'Pay now' — same size, loud red. One wrong tap and the user loses their place. Destructive actions should be quieter or moved away.",
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
                explanation: "Destructive actions deserve respect, not equal billing. Make the safe path obvious; demote the destructive one to outline or move it out of the row.",
                difficulty: 2,
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

export const MODULE_UNLOCK_MESSAGES: Record<string, string> = {
  "dp-contrast": "Contrast unlocked. Your designs will pop.",
  "dp-typography": "Typography unlocked. Your words now carry weight.",
  "dp-spacing": "Spacing unlocked. Your layouts can breathe.",
  "dp-color": "Color unlocked. Palettes that work for you.",
  "dp-hierarchy": "Hierarchy unlocked. Guide every eye.",
  "dp-ux-basics": "UX basics down. Your screens feel obvious.",
};
