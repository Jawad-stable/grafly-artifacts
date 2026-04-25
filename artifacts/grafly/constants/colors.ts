// All theme tokens are tuned for WCAG 2.1 AA contrast.
// - Body text on backgrounds: >= 4.5:1
// - Large/UI text on backgrounds: >= 3:1
// - Foreground-on-fill pairs (e.g. primaryForeground on primary): >= 4.5:1
// When pairing brand tints with text dynamically, use getContrastOn() from constants/contrast.
const colors = {
  dark: {
    text: "#DEE0ED",
    tint: "#0078BB",
    background: "#21263F",
    foreground: "#DEE0ED",
    card: "#2D3355",
    cardForeground: "#DEE0ED",
    primary: "#0078BB",
    primaryForeground: "#FFFFFF",
    secondary: "#353B5A",
    secondaryForeground: "#DEE0ED",
    muted: "#353B5A",
    mutedForeground: "#969CBC",
    accent: "#E3ED43",
    accentForeground: "#21263F",
    pink: "#FF7BD0",
    pinkForeground: "#21263F",
    destructive: "#DC2A3A",
    destructiveForeground: "#FFFFFF",
    border: "#3A4068",
    input: "#2D3355",
    success: "#22DD88",
    warning: "#FFB800",
  },
  light: {
    text: "#21263F",
    tint: "#0078BB",
    background: "#F5F6FA",
    foreground: "#21263F",
    card: "#FFFFFF",
    cardForeground: "#21263F",
    primary: "#0078BB",
    primaryForeground: "#FFFFFF",
    secondary: "#E8EBF5",
    secondaryForeground: "#21263F",
    muted: "#ECEEF5",
    mutedForeground: "#646A88",
    accent: "#E3ED43",
    accentForeground: "#21263F",
    pink: "#FF7BD0",
    pinkForeground: "#21263F",
    destructive: "#DC2A3A",
    destructiveForeground: "#FFFFFF",
    border: "#DDE1EE",
    input: "#FFFFFF",
    success: "#138354",
    warning: "#A36E00",
  },
  radius: 20,
};

export default colors;
