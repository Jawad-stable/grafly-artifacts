import colors from "@/constants/colors";
import { useProfile } from "@/context/ProfileContext";

/**
 * Returns the design tokens for the user-selected theme.
 *
 * The theme is locked at onboarding via the welcome screen toggle and
 * persisted in ProfileState.themeMode. Device color scheme is intentionally
 * ignored so the chosen theme stays consistent everywhere.
 */
export function useColors() {
  const { state } = useProfile();
  const palette = state.themeMode === "light" ? colors.light : colors.dark;
  return { ...palette, radius: colors.radius, brand: colors.brand };
}
