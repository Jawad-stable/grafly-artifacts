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
  | { kind: "title"; text: string; size?: number; color?: string; align?: "left" | "center"; weight?: "bold" | "black" | "regular" }
  | { kind: "subtitle"; text: string; size?: number; color?: string; opacity?: number; align?: "left" | "center" }
  | { kind: "body"; text: string; size?: number; color?: string; opacity?: number; align?: "left" | "center"; lines?: number }
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
    description: "Master the foundational rules that guide all great design.",
    color: "#00A4FA",
    nodes: [
      {
        id: "dp-balance",
        courseId: "design-principles",
        title: "Balance",
        icon: "scale-outline",
        description: "Achieve visual equilibrium in your designs.",
        prerequisites: [],
        lessons: [
          {
            id: "dp-balance-1",
            title: "Symmetry vs Asymmetry",
            description: "Learn how balance creates harmony in design.",
            xpReward: 20,
            coinReward: 5,
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                question: "Which type of balance creates a mirror-image layout?",
                options: ["Asymmetrical balance", "Radial balance", "Symmetrical balance", "Dynamic balance"],
                correctIndex: 2,
                explanation: "Symmetrical balance creates identical or near-identical elements on both sides of an axis, producing a stable, formal feel.",
                difficulty: 1,
              },
              {
                id: "q2",
                type: "true_false",
                question: "Asymmetrical balance always feels less professional than symmetrical balance.",
                correctBool: false,
                explanation: "Asymmetrical balance can feel dynamic and modern. Many premium brands use asymmetry to appear energetic and contemporary.",
                difficulty: 1,
              },
              {
                id: "q3",
                type: "multiple_choice",
                question: "A heavy dark element on the left can be balanced by:",
                options: ["Adding more dark elements", "Placing multiple smaller light elements on the right", "Removing all contrast", "Using only one color"],
                correctIndex: 1,
                explanation: "Visual weight isn't just about size — multiple smaller, lighter elements can balance one heavy element, like small coins balancing a large rock.",
                difficulty: 2,
              },
              {
                id: "q4",
                type: "true_false",
                question: "Radial balance radiates from a central point outward.",
                correctBool: true,
                explanation: "Radial balance distributes design elements equally around a center point, like a sunflower or circular mandala.",
                difficulty: 2,
              },
            ],
            critiquePrompt: "Find a poster or app screen and critique how it achieves (or fails to achieve) visual balance. Consider both the visual weight distribution and how it affects the viewer's eye movement.",
          },
          {
            id: "dp-balance-2",
            title: "Visual Weight",
            description: "Understand what makes elements feel heavy or light.",
            xpReward: 20,
            coinReward: 5,
            questions: [
              {
                id: "q5",
                type: "multiple_choice",
                question: "Which factor contributes most to visual weight?",
                options: ["File size of the image", "Size and darkness of an element", "Number of fonts used", "Page loading speed"],
                correctIndex: 1,
                explanation: "Larger and darker elements carry more visual weight, drawing the eye more strongly than smaller, lighter elements.",
                difficulty: 2,
              },
              {
                id: "q6",
                type: "true_false",
                question: "Isolated elements appear lighter than elements surrounded by content.",
                correctBool: false,
                explanation: "Isolated elements actually carry MORE visual weight because they have more white space around them, making them stand out.",
                difficulty: 2,
              },
              {
                id: "q7",
                type: "multiple_choice",
                question: "Which placement gives an element the most visual prominence?",
                options: ["Bottom-left corner", "Dead center of the composition", "Top-right area", "Along the left edge"],
                correctIndex: 1,
                explanation: "The center of a composition naturally draws the most attention and visual weight, though off-center placements can be equally powerful through contrast.",
                difficulty: 1,
              },
            ],
          },
        ],
      },
      {
        id: "dp-hierarchy",
        courseId: "design-principles",
        title: "Visual Hierarchy",
        icon: "layers-outline",
        description: "Guide your viewer's eye with intentional hierarchy.",
        prerequisites: ["dp-balance"],
        lessons: [
          {
            id: "dp-hierarchy-1",
            title: "Size & Scale",
            description: "Use scale to establish hierarchy instantly.",
            xpReward: 20,
            coinReward: 5,
            questions: [
              {
                id: "q8",
                type: "multiple_choice",
                question: "What is the primary purpose of visual hierarchy?",
                options: ["To make designs look complex", "To guide the viewer through content in a meaningful order", "To use as many fonts as possible", "To fill empty space"],
                correctIndex: 1,
                explanation: "Visual hierarchy directs the viewer's eye to information in order of importance, making content easier to understand and navigate.",
                difficulty: 1,
              },
              {
                id: "q9",
                type: "true_false",
                question: "Making everything the same size creates a strong visual hierarchy.",
                correctBool: false,
                explanation: "Uniformity destroys hierarchy. Variation in size, weight, and color is essential for establishing clear information priority.",
                difficulty: 1,
              },
              {
                id: "q10",
                type: "multiple_choice",
                question: "Which technique does NOT effectively create hierarchy?",
                options: ["Increasing contrast", "Varying font sizes", "Using random colors", "Adding whitespace"],
                correctIndex: 2,
                explanation: "Random color choice undermines hierarchy. Intentional color contrast and variation communicates importance, but randomness creates visual noise.",
                difficulty: 3,
              },
            ],
            critiquePrompt: "Look at a news website homepage and critique its visual hierarchy. Which story demands your attention first? Is this intentional? How do size, color, and placement guide your eye?",
          },
          {
            id: "dp-hierarchy-2",
            title: "Color & Contrast",
            description: "Leverage color to create visual priority.",
            xpReward: 25,
            coinReward: 5,
            questions: [
              {
                id: "q11",
                type: "multiple_choice",
                question: "High contrast between elements creates:",
                options: ["Visual confusion", "A sense of harmony", "Visual emphasis and importance", "A monotonous design"],
                correctIndex: 2,
                explanation: "High contrast draws attention and signals importance, which is why call-to-action buttons often use the highest contrast color combination on a page.",
                difficulty: 1,
              },
              {
                id: "q12",
                type: "true_false",
                question: "Warm colors (red, orange) typically advance while cool colors (blue, green) recede.",
                correctBool: true,
                explanation: "Warm colors appear to come forward visually while cool colors recede, which is why warnings use red/orange and calm states use blue/green.",
                difficulty: 2,
              },
            ],
          },
        ],
      },
      {
        id: "dp-contrast",
        courseId: "design-principles",
        title: "Contrast",
        icon: "contrast-outline",
        description: "Create visual interest and clarity through contrast.",
        prerequisites: ["dp-hierarchy"],
        lessons: [
          {
            id: "dp-contrast-1",
            title: "Contrast Fundamentals",
            description: "Learn the types and uses of contrast in design.",
            xpReward: 20,
            coinReward: 5,
            questions: [
              {
                id: "q13",
                type: "multiple_choice",
                question: "WCAG AA accessibility requires a minimum contrast ratio of:",
                options: ["2:1", "3:1", "4.5:1", "7:1"],
                correctIndex: 2,
                explanation: "WCAG AA standard requires a minimum 4.5:1 contrast ratio for normal text to ensure readability for users with visual impairments.",
                difficulty: 3,
              },
              {
                id: "q14",
                type: "true_false",
                question: "Color is the only way to create contrast in design.",
                correctBool: false,
                explanation: "Contrast can be achieved through size, shape, texture, direction, and weight — not just color. Relying solely on color also excludes colorblind users.",
                difficulty: 2,
              },
              {
                id: "q15",
                type: "multiple_choice",
                question: "Which pairing has the highest contrast?",
                options: ["Light grey on white", "Black on yellow", "Navy on dark blue", "Red on green"],
                correctIndex: 1,
                explanation: "Black on yellow provides extremely high contrast (approximately 11:1), which is why it's used for warning signs worldwide.",
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
