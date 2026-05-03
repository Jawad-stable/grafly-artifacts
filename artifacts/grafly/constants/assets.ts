export const MASCOT = {
  idle: require("../assets/mascot/idle.webp"),
  celebrate: require("../assets/mascot/celebrate.webp"),
  think: require("../assets/mascot/think.webp"),
  oops: require("../assets/mascot/oops.webp"),
  correct: require("../assets/mascot/correct.webp"),
  wrong: require("../assets/mascot/wrong.webp"),
} as const;

export type MascotState = keyof typeof MASCOT;

export const LOGO = {
  icon_white: require("../assets/logo/icon_white.webp"),
  icon_colored: require("../assets/logo/icon_colored.webp"),
  wordmark_white: require("../assets/logo/wordmark_white.webp"),
  wordmark_primary: require("../assets/logo/wordmark_primary.webp"),
} as const;

export const AI_BOT = require("../assets/ai/bot.webp");
