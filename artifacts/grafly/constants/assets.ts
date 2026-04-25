export const MASCOT = {
  idle: require("../assets/mascot/idle.png"),
  celebrate: require("../assets/mascot/celebrate.png"),
  think: require("../assets/mascot/think.png"),
  oops: require("../assets/mascot/oops.png"),
  correct: require("../assets/mascot/correct.png"),
  wrong: require("../assets/mascot/wrong.png"),
} as const;

export type MascotState = keyof typeof MASCOT;

export const LOGO = {
  icon_white: require("../assets/logo/icon_white.png"),
  icon_colored: require("../assets/logo/icon_colored.png"),
  wordmark_white: require("../assets/logo/wordmark_white.png"),
  wordmark_primary: require("../assets/logo/wordmark_primary.png"),
} as const;

export const AI_BOT = require("../assets/ai/bot.png");
