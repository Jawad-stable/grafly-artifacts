import { Dimensions } from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

// Gutter on each side of the floating bottom bar. Wider than the chat
// content gutter (14) so the nav reads as a floating pill with clear
// breathing room on the left and right, not as a wall-to-wall bar.
export const BOTTOM_BAR_GUTTER = 24;

// Single shared width used by BOTH the floating tab bar and the critique
// composer input pill. Capped at 380 so it doesn't stretch absurdly on
// tablets, with a sane minimum so it never collapses on tiny screens.
export const BOTTOM_BAR_WIDTH = Math.max(
  Math.min(SCREEN_W - BOTTOM_BAR_GUTTER * 2, 380),
  240,
);
