const theme = {
  colors: {
    background: "#21263F",
    surface: "#2D3355",
    surfaceRaised: "#353B5A",
    border: "#3A4068",
    foreground: "#DEE0ED",
    muted: "#8A90B0",
    primary: "#00A4FA",
    primaryForeground: "#21263F",
    accent: "#E3ED43",
    accentForeground: "#21263F",
    pink: "#FF7BD0",
    pinkForeground: "#21263F",
    success: "#22DD88",
    error: "#FF4757",
    warning: "#FFB800",
    coin: "#FFB800",
    flame: "#FF7B00",
  },
  radius: {
    sm: 12,
    md: 20,
    lg: 28,
    full: 999,
  },
  font: {
    heavy: "Nunito_800ExtraBold",
    semi: "Nunito_600SemiBold",
  },
};

export type ThemeColors = typeof theme.colors;
export default theme;
