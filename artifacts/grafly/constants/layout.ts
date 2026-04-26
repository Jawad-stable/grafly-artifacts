// Gutter on each side of the floating bottom bar. Wider than the chat
// content gutter (14) so the nav reads as a floating pill with clear
// breathing room on the left and right, not as a wall-to-wall bar.
export const BOTTOM_BAR_GUTTER = 24;

// Hard cap so the bar doesn't stretch absurdly on tablets, with a sane
// minimum so it never collapses on tiny screens.
export const BOTTOM_BAR_MAX_WIDTH = 380;
export const BOTTOM_BAR_MIN_WIDTH = 240;

// Compute the floating bar / composer pill width from the LIVE viewport
// width. Both the tab bar and the critique composer call this with the
// value from `useWindowDimensions()`, so the two stay perfectly in sync
// AND re-center when the iframe / device viewport resizes (a static
// `Dimensions.get(...)` snapshot taken at module load time is stale on
// Expo web inside a resizable canvas iframe).
export function getBottomBarWidth(screenWidth: number): number {
  return Math.max(
    Math.min(screenWidth - BOTTOM_BAR_GUTTER * 2, BOTTOM_BAR_MAX_WIDTH),
    BOTTOM_BAR_MIN_WIDTH,
  );
}
