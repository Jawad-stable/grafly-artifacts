// All theme tokens are tuned for WCAG 2.1 AA contrast.
// - Body text on backgrounds: >= 4.5:1
// - Large/UI text on backgrounds: >= 3:1
// - Foreground-on-fill pairs (e.g. primaryForeground on primary): >= 4.5:1
// When pairing brand tints with text dynamically, use onBrand() from constants/contrast
// (white on blue/pink, navy on yellow). Use getContrastOn() for arbitrary colors needing WCAG.
//
// Brand palette (Grafly 2026):
// - Cyan        #00A4FA  primary brand (logo, hero, CTA fills)
// - Cyan deep   #0078BB  AA-safe deep variant for white text on small surfaces
// - Lime        #E3ED43  energetic accent (badges, highlights)
// - Pink        #FF7BD0  warm secondary accent
// - Navy        #21263F  brand text / dark backgrounds
// - Off-white   #F5F6FA  app background (light mode)
const BRAND = {
  cyan: "#00A4FA",
  cyanDeep: "#0078BB",
  lime: "#E3ED43",
  pink: "#FF7BD0",
  navy: "#21263F",
  navyDeep: "#181C30",
  offWhite: "#F5F6FA",
} as const;

const colors = {
  dark: {
    text: "#DEE0ED",
    tint: BRAND.cyan,
    background: BRAND.navy,
    foreground: "#DEE0ED",
    card: "#2D3355",
    cardForeground: "#DEE0ED",
    // Bright brand cyan with navy text (AA-safe ~5.9:1).
    primary: BRAND.cyan,
    primaryForeground: BRAND.navy,
    // Deeper cyan for surfaces that must use white text.
    primaryDeep: BRAND.cyanDeep,
    primaryDeepForeground: "#FFFFFF",
    secondary: "#353B5A",
    secondaryForeground: "#DEE0ED",
    muted: "#353B5A",
    mutedForeground: "#969CBC",
    accent: BRAND.lime,
    accentForeground: BRAND.navy,
    pink: BRAND.pink,
    pinkForeground: BRAND.navy,
    destructive: "#DC2A3A",
    destructiveForeground: "#FFFFFF",
    border: "#3A4068",
    input: "#2D3355",
    success: "#22DD88",
    warning: "#FFB800",
  },
  light: {
    text: BRAND.navy,
    tint: BRAND.cyan,
    background: BRAND.offWhite,
    foreground: BRAND.navy,
    card: "#FFFFFF",
    cardForeground: BRAND.navy,
    // Bright brand cyan with navy text (AA-safe ~5.9:1).
    primary: BRAND.cyan,
    primaryForeground: BRAND.navy,
    // Deeper cyan for surfaces that must use white text.
    primaryDeep: BRAND.cyanDeep,
    primaryDeepForeground: "#FFFFFF",
    secondary: "#E8EBF5",
    secondaryForeground: BRAND.navy,
    muted: "#ECEEF5",
    mutedForeground: "#646A88",
    accent: BRAND.lime,
    accentForeground: BRAND.navy,
    pink: BRAND.pink,
    pinkForeground: BRAND.navy,
    destructive: "#DC2A3A",
    destructiveForeground: "#FFFFFF",
    border: "#DDE1EE",
    input: "#FFFFFF",
    success: "#138354",
    warning: "#A36E00",
  },
  brand: BRAND,
  radius: 20,
};

export default colors;
