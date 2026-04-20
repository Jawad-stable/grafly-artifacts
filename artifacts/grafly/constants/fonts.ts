/**
 * Font mapping for Grafly.
 *
 * Latin / default text uses Nunito (loaded from @expo-google-fonts/nunito).
 * Arabic text automatically swaps to Teshrin AR+LT (loaded as TTF assets).
 *
 * Use the `pickFont(text, weight)` helper or the `<AText />` and
 * `<ATextInput />` wrapper components so the right font is used
 * everywhere the user can type or paste Arabic.
 */

export const TESHRIN_FONTS = {
  Teshrin_Regular: require("../assets/fonts/Teshrin_Regular.ttf"),
  Teshrin_Medium: require("../assets/fonts/Teshrin_Medium.ttf"),
  Teshrin_Bold: require("../assets/fonts/Teshrin_Bold.ttf"),
};

export type FontWeight = "regular" | "semibold" | "bold" | "black";

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

export function hasArabic(text: unknown): boolean {
  if (typeof text !== "string") return false;
  return ARABIC_RE.test(text);
}

const NUNITO_BY_WEIGHT: Record<FontWeight, string> = {
  regular: "Nunito_600SemiBold",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_800ExtraBold",
  black: "Nunito_800ExtraBold",
};

const TESHRIN_BY_WEIGHT: Record<FontWeight, string> = {
  regular: "Teshrin_Regular",
  semibold: "Teshrin_Medium",
  bold: "Teshrin_Bold",
  black: "Teshrin_Black",
};

const NUNITO_TO_WEIGHT: Record<string, FontWeight> = {
  Nunito_600SemiBold: "semibold",
  Nunito_800ExtraBold: "bold",
};

/**
 * Returns the Teshrin family if the text contains Arabic characters,
 * otherwise returns the Nunito family for the given weight.
 */
export function pickFont(text: unknown, weight: FontWeight = "regular"): string {
  return hasArabic(text) ? TESHRIN_BY_WEIGHT[weight] : NUNITO_BY_WEIGHT[weight];
}

/**
 * Resolves a font family for a given text and current Nunito family.
 * Useful when you want to keep your existing fontFamily and only switch
 * on Arabic content.
 */
export function resolveFontFamily(text: unknown, currentFamily?: string): string | undefined {
  if (!hasArabic(text)) return currentFamily;
  const weight: FontWeight =
    (currentFamily && NUNITO_TO_WEIGHT[currentFamily]) || "regular";
  return TESHRIN_BY_WEIGHT[weight];
}
