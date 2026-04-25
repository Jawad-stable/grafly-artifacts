import { Dimensions } from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

export const BOTTOM_BAR_GUTTER = 14;

export const BOTTOM_BAR_WIDTH = Math.max(
  Math.min(SCREEN_W - BOTTOM_BAR_GUTTER * 2, 720),
  240,
);
