import type { DesignScene, SceneRegion } from "@/components/DesignScene";

const C = {
  surface: "#FFFFFF",
  surfaceAlt: "#F5F6FA",
  ink: "#21263F",
  inkSoft: "#646A88",
  inkFaint: "#B7BDD3",
  primary: "#0078BB",
  primaryFg: "#FFFFFF",
  accent: "#E3ED43",
  accentFg: "#21263F",
  pink: "#FF7BD0",
  success: "#138354",
  warning: "#FFB800",
  destructive: "#DC2A3A",
  border: "#DDE1EE",
  badYellow: "#F2C700",
  badBg: "#FFF6CF",
  loud1: "#FF4757",
  loud2: "#7C3AED",
  loud3: "#22C55E",
};

function shell(elements: any[], width = 100, height = 130, bg = C.surface): DesignScene {
  return { width, height, bg, elements };
}

export const SCENES = {
  // ---------- Intro: contrast ----------
  goodContrast: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "text", x: 8, y: 18, w: 84, text: "Save up to 30%", size: 22, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 48, w: 84, text: "On every plan, every month.", size: 11, color: C.inkSoft },
    { kind: "pill", x: 8, y: 70, w: 44, h: 18, label: "Get started", bg: C.ink, fg: C.surface, size: 11, bold: true },
  ]),
  badContrast: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "text", x: 8, y: 18, w: 84, text: "Save up to 30%", size: 22, bold: true, color: C.inkFaint },
    { kind: "text", x: 8, y: 48, w: 84, text: "On every plan, every month.", size: 11, color: C.inkFaint },
    { kind: "pill", x: 8, y: 70, w: 44, h: 18, label: "Get started", bg: "#E0E5F2", fg: "#A8AEC4", size: 11, bold: true },
  ]),

  // ---------- Typography hierarchy ----------
  goodTypeHierarchy: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "text", x: 8, y: 12, w: 84, text: "New arrivals", size: 22, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 36, w: 84, text: "Curated this week for you.", size: 11, color: C.inkSoft },
    { kind: "rect", x: 8, y: 56, w: 84, h: 24, color: C.surfaceAlt, radius: 8 },
    { kind: "text", x: 12, y: 62, w: 76, text: "Limited drops · 6 items", size: 10, bold: true, color: C.ink },
  ]),
  badTypeHierarchy: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "text", x: 8, y: 12, w: 84, text: "New arrivals", size: 13, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 32, w: 84, text: "Curated this week for you.", size: 13, color: C.ink },
    { kind: "text", x: 8, y: 52, w: 84, text: "Limited drops · 6 items", size: 13, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 72, w: 84, text: "Tap to browse", size: 13, color: C.ink },
  ]),

  // ---------- Spacing / proximity ----------
  goodSpacing: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "text", x: 8, y: 8, w: 84, text: "Account", size: 11, bold: true, color: C.inkSoft, letterSpacing: 1 },
    { kind: "rect", x: 8, y: 18, w: 84, h: 18, color: C.surfaceAlt, radius: 8 },
    { kind: "text", x: 12, y: 23, w: 76, text: "Profile", size: 11, color: C.ink },
    { kind: "rect", x: 8, y: 39, w: 84, h: 18, color: C.surfaceAlt, radius: 8 },
    { kind: "text", x: 12, y: 44, w: 76, text: "Notifications", size: 11, color: C.ink },
    { kind: "text", x: 8, y: 64, w: 84, text: "Support", size: 11, bold: true, color: C.inkSoft, letterSpacing: 1 },
    { kind: "rect", x: 8, y: 74, w: 84, h: 18, color: C.surfaceAlt, radius: 8 },
    { kind: "text", x: 12, y: 79, w: 76, text: "Help center", size: 11, color: C.ink },
  ]),
  badSpacing: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "rect", x: 4, y: 4, w: 92, h: 13, color: C.surfaceAlt, radius: 6 },
    { kind: "text", x: 8, y: 7, w: 80, text: "Profile", size: 11, color: C.ink },
    { kind: "rect", x: 4, y: 18, w: 92, h: 13, color: C.surfaceAlt, radius: 6 },
    { kind: "text", x: 8, y: 21, w: 80, text: "Notifications", size: 11, color: C.ink },
    { kind: "rect", x: 4, y: 32, w: 92, h: 13, color: C.surfaceAlt, radius: 6 },
    { kind: "text", x: 8, y: 35, w: 80, text: "Help center", size: 11, color: C.ink },
    { kind: "rect", x: 4, y: 46, w: 92, h: 13, color: C.surfaceAlt, radius: 6 },
    { kind: "text", x: 8, y: 49, w: 80, text: "Privacy", size: 11, color: C.ink },
    { kind: "rect", x: 4, y: 60, w: 92, h: 13, color: C.surfaceAlt, radius: 6 },
    { kind: "text", x: 8, y: 63, w: 80, text: "Logout", size: 11, color: C.ink },
    { kind: "rect", x: 4, y: 74, w: 92, h: 13, color: C.surfaceAlt, radius: 6 },
    { kind: "text", x: 8, y: 77, w: 80, text: "Delete account", size: 11, color: C.ink },
  ]),

  // ---------- Color: 60-30-10 ----------
  goodColor: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surfaceAlt },
    { kind: "rect", x: 8, y: 10, w: 84, h: 32, color: C.surface, radius: 12 },
    { kind: "text", x: 12, y: 16, w: 76, text: "Today", size: 10, bold: true, color: C.inkSoft, letterSpacing: 1 },
    { kind: "text", x: 12, y: 25, w: 76, text: "12 tasks done", size: 14, bold: true, color: C.ink },
    { kind: "rect", x: 8, y: 50, w: 84, h: 22, color: C.surface, radius: 10 },
    { kind: "text", x: 12, y: 56, w: 76, text: "Up next", size: 11, bold: true, color: C.ink },
    { kind: "pill", x: 8, y: 80, w: 84, h: 14, label: "Add task", bg: C.primary, fg: C.surface, size: 10, bold: true },
  ]),
  badColor: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.loud2 },
    { kind: "rect", x: 8, y: 10, w: 84, h: 32, color: C.loud1, radius: 12 },
    { kind: "text", x: 12, y: 16, w: 76, text: "Today", size: 10, bold: true, color: C.accent, letterSpacing: 1 },
    { kind: "text", x: 12, y: 25, w: 76, text: "12 tasks done", size: 14, bold: true, color: C.surface },
    { kind: "rect", x: 8, y: 50, w: 84, h: 22, color: C.loud3, radius: 10 },
    { kind: "text", x: 12, y: 56, w: 76, text: "Up next", size: 11, bold: true, color: C.surface },
    { kind: "pill", x: 8, y: 80, w: 84, h: 14, label: "Add task", bg: C.warning, fg: C.ink, size: 10, bold: true },
  ]),

  // ---------- Hierarchy ----------
  goodHierarchy: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "text", x: 8, y: 8, w: 84, text: "ARTICLE", size: 9, bold: true, color: C.primary, letterSpacing: 1.4 },
    { kind: "text", x: 8, y: 18, w: 84, text: "Why margins matter", size: 20, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 46, w: 84, text: "A short read on whitespace and rhythm.", size: 11, color: C.inkSoft },
    { kind: "pill", x: 8, y: 75, w: 36, h: 16, label: "Read more", bg: C.ink, fg: C.surface, size: 10, bold: true },
  ]),
  badHierarchy: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "text", x: 8, y: 12, w: 84, text: "Article", size: 13, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 30, w: 84, text: "Why margins matter", size: 13, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 48, w: 84, text: "A short read on whitespace.", size: 13, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 66, w: 84, text: "Read more", size: 13, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 84, w: 84, text: "Posted today", size: 13, bold: true, color: C.ink },
  ]),

  // ---------- UX: clear primary CTA ----------
  goodCTA: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "text", x: 8, y: 10, w: 84, text: "Welcome back", size: 16, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 26, w: 84, text: "Pick up where you left off.", size: 11, color: C.inkSoft },
    { kind: "rect", x: 8, y: 42, w: 84, h: 12, color: C.surfaceAlt, radius: 6 },
    { kind: "rect", x: 8, y: 58, w: 84, h: 12, color: C.surfaceAlt, radius: 6 },
    { kind: "pill", x: 8, y: 78, w: 84, h: 16, label: "Continue", bg: C.primary, fg: C.surface, size: 11, bold: true },
  ]),
  badCTA: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "text", x: 8, y: 10, w: 84, text: "Welcome back", size: 16, bold: true, color: C.ink },
    { kind: "text", x: 8, y: 26, w: 84, text: "Pick up where you left off.", size: 11, color: C.inkSoft },
    { kind: "pill", x: 8, y: 44, w: 38, h: 14, label: "Continue", bg: C.surfaceAlt, fg: C.inkSoft, size: 10, bold: true },
    { kind: "pill", x: 50, y: 44, w: 42, h: 14, label: "Settings", bg: C.surfaceAlt, fg: C.inkSoft, size: 10, bold: true },
    { kind: "pill", x: 8, y: 62, w: 38, h: 14, label: "Logout", bg: C.surfaceAlt, fg: C.inkSoft, size: 10, bold: true },
    { kind: "pill", x: 50, y: 62, w: 42, h: 14, label: "Delete", bg: C.surfaceAlt, fg: C.inkSoft, size: 10, bold: true },
    { kind: "pill", x: 8, y: 80, w: 84, h: 12, label: "Help", bg: C.surfaceAlt, fg: C.inkSoft, size: 9, bold: true },
  ]),

  // ---------- Spot the bad design: cramped card ----------
  cardChoices: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surfaceAlt },
    // Card 1 (good)
    { kind: "rect", x: 4, y: 6, w: 28, h: 88, color: C.surface, radius: 12 },
    { kind: "text", x: 7, y: 10, w: 22, text: "Pro plan", size: 9, bold: true, color: C.ink },
    { kind: "text", x: 7, y: 22, w: 22, text: "$12/mo", size: 12, bold: true, color: C.primary },
    { kind: "rect", x: 7, y: 40, w: 22, h: 2, color: C.border, radius: 1 },
    { kind: "text", x: 7, y: 50, w: 22, text: "All features", size: 8, color: C.inkSoft },
    { kind: "pill", x: 7, y: 78, w: 22, h: 11, label: "Pick", bg: C.ink, fg: C.surface, size: 9, bold: true },
    // Card 2 (bad — cramped)
    { kind: "rect", x: 36, y: 6, w: 28, h: 88, color: C.surface, radius: 12 },
    { kind: "text", x: 38, y: 8, w: 24, text: "Premium", size: 9, bold: true, color: C.ink },
    { kind: "text", x: 38, y: 16, w: 24, text: "$24/mo", size: 12, bold: true, color: C.primary },
    { kind: "text", x: 38, y: 26, w: 24, text: "All features", size: 8, color: C.inkSoft },
    { kind: "text", x: 38, y: 32, w: 24, text: "Priority", size: 8, color: C.inkSoft },
    { kind: "text", x: 38, y: 38, w: 24, text: "Email help", size: 8, color: C.inkSoft },
    { kind: "text", x: 38, y: 44, w: 24, text: "Slack help", size: 8, color: C.inkSoft },
    { kind: "text", x: 38, y: 50, w: 24, text: "Onboarding", size: 8, color: C.inkSoft },
    { kind: "text", x: 38, y: 56, w: 24, text: "API access", size: 8, color: C.inkSoft },
    { kind: "pill", x: 38, y: 64, w: 24, h: 9, label: "Pick", bg: C.ink, fg: C.surface, size: 8, bold: true },
    // Card 3 (good)
    { kind: "rect", x: 68, y: 6, w: 28, h: 88, color: C.surface, radius: 12 },
    { kind: "text", x: 71, y: 10, w: 22, text: "Team", size: 9, bold: true, color: C.ink },
    { kind: "text", x: 71, y: 22, w: 22, text: "$48/mo", size: 12, bold: true, color: C.primary },
    { kind: "rect", x: 71, y: 40, w: 22, h: 2, color: C.border, radius: 1 },
    { kind: "text", x: 71, y: 50, w: 22, text: "Up to 10", size: 8, color: C.inkSoft },
    { kind: "pill", x: 71, y: 78, w: 22, h: 11, label: "Pick", bg: C.ink, fg: C.surface, size: 9, bold: true },
  ]),

  // ---------- Find the CTA: app screen ----------
  appScreen: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    // Top bar
    { kind: "rect", x: 0, y: 0, w: 100, h: 12, color: C.surfaceAlt },
    { kind: "text", x: 8, y: 4, w: 30, text: "Inbox", size: 9, bold: true, color: C.ink },
    { kind: "circle", cx: 92, cy: 6, r: 3, color: C.inkFaint },
    // List items
    { kind: "rect", x: 4, y: 18, w: 92, h: 14, color: C.surfaceAlt, radius: 8 },
    { kind: "avatar", cx: 11, cy: 25, r: 5, color: C.primary, initial: "A", initialColor: C.surface },
    { kind: "text", x: 20, y: 21, w: 60, text: "Anna sent a file", size: 9, bold: true, color: C.ink },
    { kind: "text", x: 20, y: 27, w: 60, text: "Tap to view", size: 8, color: C.inkSoft },
    { kind: "rect", x: 4, y: 36, w: 92, h: 14, color: C.surfaceAlt, radius: 8 },
    { kind: "avatar", cx: 11, cy: 43, r: 5, color: C.pink, initial: "M", initialColor: C.surface },
    { kind: "text", x: 20, y: 39, w: 60, text: "Marco mentioned you", size: 9, bold: true, color: C.ink },
    { kind: "text", x: 20, y: 45, w: 60, text: "in #design", size: 8, color: C.inkSoft },
    { kind: "rect", x: 4, y: 54, w: 92, h: 14, color: C.surfaceAlt, radius: 8 },
    { kind: "avatar", cx: 11, cy: 61, r: 5, color: C.warning, initial: "K", initialColor: C.ink },
    { kind: "text", x: 20, y: 57, w: 60, text: "Kira shared a doc", size: 9, bold: true, color: C.ink },
    { kind: "text", x: 20, y: 63, w: 60, text: "Yesterday", size: 8, color: C.inkSoft },
    // Bottom area: secondary nav row + floating primary CTA
    { kind: "pill", x: 4, y: 78, w: 22, h: 12, label: "Filter", bg: C.surfaceAlt, fg: C.ink, size: 9 },
    { kind: "pill", x: 28, y: 78, w: 22, h: 12, label: "Sort", bg: C.surfaceAlt, fg: C.ink, size: 9 },
    { kind: "pill", x: 70, y: 76, w: 26, h: 16, label: "+ Compose", bg: C.primary, fg: C.surface, size: 10, bold: true },
  ]),

  // ---------- Five-second test: dashboard ----------
  dashboardWow: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "rect", x: 0, y: 0, w: 100, h: 14, color: C.ink },
    { kind: "text", x: 6, y: 4, w: 60, text: "Aurora", size: 11, bold: true, color: C.surface, letterSpacing: 0.5 },
    { kind: "circle", cx: 92, cy: 7, r: 3.5, color: C.surface },
    { kind: "text", x: 6, y: 20, w: 88, text: "Good morning, Sam", size: 16, bold: true, color: C.ink },
    { kind: "text", x: 6, y: 36, w: 88, text: "You have 4 tasks today.", size: 10, color: C.inkSoft },
    { kind: "rect", x: 6, y: 48, w: 56, h: 30, color: C.primary, radius: 12 },
    { kind: "text", x: 10, y: 52, w: 48, text: "REVENUE", size: 8, bold: true, color: C.surface, letterSpacing: 1 },
    { kind: "text", x: 10, y: 60, w: 48, text: "$12,480", size: 16, bold: true, color: C.surface },
    { kind: "rect", x: 66, y: 48, w: 28, h: 30, color: C.accent, radius: 12 },
    { kind: "text", x: 70, y: 52, w: 22, text: "ORDERS", size: 8, bold: true, color: C.ink, letterSpacing: 1 },
    { kind: "text", x: 70, y: 60, w: 22, text: "146", size: 16, bold: true, color: C.ink },
    { kind: "pill", x: 6, y: 84, w: 88, h: 12, label: "View all reports", bg: C.ink, fg: C.surface, size: 10, bold: true },
  ]),

  // ---------- Headline test ----------
  headlineWow: shell([
    { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: C.surface },
    { kind: "text", x: 6, y: 14, w: 88, text: "Plant kits delivered weekly", size: 22, bold: true, color: C.ink },
    { kind: "text", x: 6, y: 50, w: 88, text: "Hand-picked seedlings for tiny windowsills.", size: 11, color: C.inkSoft },
    { kind: "rect", x: 6, y: 70, w: 88, h: 22, color: C.success, radius: 14 },
    { kind: "text", x: 0, y: 76, w: 100, text: "Start my kit", size: 12, bold: true, color: C.surface, align: "center" },
  ]),
};

export const REGION_LIBRARY: Record<string, SceneRegion[]> = {
  cardChoices: [
    { x: 4, y: 6, w: 28, h: 88, label: "Card A" },
    { x: 36, y: 6, w: 28, h: 88, label: "Card B" },
    { x: 68, y: 6, w: 28, h: 88, label: "Card C" },
  ],
  appScreenCTAs: [
    { x: 4, y: 78, w: 22, h: 12, label: "Filter" },
    { x: 28, y: 78, w: 22, h: 12, label: "Sort" },
    { x: 70, y: 76, w: 26, h: 16, label: "Compose" },
    { x: 4, y: 18, w: 92, h: 14, label: "Inbox row 1" },
  ],
};
