export function relLuminance(hex: string): number {
  const c = hex.replace("#", "").slice(0, 6);
  if (c.length < 6) return 1;
  const toLin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLin(parseInt(c.slice(0, 2), 16));
  const g = toLin(parseInt(c.slice(2, 4), 16));
  const b = toLin(parseInt(c.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

export function getContrastOn(
  hex: string,
  options?: { dark?: string; light?: string },
): string {
  const dark = options?.dark ?? "#21263F";
  const light = options?.light ?? "#FFFFFF";
  return contrastRatio(dark, hex) >= contrastRatio(light, hex) ? dark : light;
}

export function meetsAA(fg: string, bg: string, large = false): boolean {
  return contrastRatio(fg, bg) >= (large ? 3 : 4.5);
}

/**
 * Brand-color foreground rule. Uses a luminance heuristic so that:
 *   - Blue and pink brand fills get white text
 *   - Yellow brand fill gets dark navy text
 * The threshold of 0.55 was chosen so the project palette
 * (#00A4FA, #FF7BD0, #E3ED43) lands on the user-preferred side.
 */
export function onBrand(
  hex: string,
  options?: { dark?: string; light?: string },
): string {
  const dark = options?.dark ?? "#21263F";
  const light = options?.light ?? "#FFFFFF";
  return relLuminance(hex) > 0.55 ? dark : light;
}
