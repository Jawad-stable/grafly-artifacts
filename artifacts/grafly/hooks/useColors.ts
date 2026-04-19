import colors from "@/constants/colors";
import { useGame } from "@/context/GameContext";

/**
 * Returns the design tokens for the user-selected theme.
 *
 * The theme is locked at onboarding via the welcome screen toggle and
 * persisted in GameState.themeMode. Device color scheme is intentionally
 * ignored so the chosen theme stays consistent everywhere.
 */
export function useColors() {
  const { state } = useGame();
  const palette = state.themeMode === "light" ? colors.light : colors.dark;
  return { ...palette, radius: colors.radius };
}
