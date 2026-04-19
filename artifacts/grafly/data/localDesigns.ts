import type { ImageSourcePropType } from "react-native";

export interface LocalDesign {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  source: ImageSourcePropType;
}

export const LOCAL_DESIGNS: LocalDesign[] = [
  {
    id: "banking_home",
    title: "Mobile Banking Home",
    description:
      "A dark theme mobile banking dashboard with a balance card at the top, a list of recent transactions with merchant icons, and a five item bottom tab bar. Purple and blue accents.",
    difficulty: "beginner",
    source: require("../assets/designs/banking_home.png"),
  },
  {
    id: "food_detail",
    title: "Food Delivery Restaurant Page",
    description:
      "A light theme restaurant detail screen with a large hero food photo, restaurant name and rating, menu category tabs, a list of menu items with prices and thumbnails, and a floating cart button. Warm orange accents.",
    difficulty: "intermediate",
    source: require("../assets/designs/food_detail.png"),
  },
  {
    id: "fitness_dash",
    title: "Fitness Tracker Dashboard",
    description:
      "A dark theme fitness dashboard with neon green accents, a circular progress ring for daily steps, a weekly activity bar chart, heart rate and calorie stat cards, and a workout history list.",
    difficulty: "intermediate",
    source: require("../assets/designs/fitness_dash.png"),
  },
  {
    id: "music_player",
    title: "Music Player Now Playing",
    description:
      "A dark purple gradient now playing screen with a large square album art, song title and artist, a scrubber timeline, playback controls, and a lyrics preview at the bottom.",
    difficulty: "beginner",
    source: require("../assets/designs/music_player.png"),
  },
];

export function pickRandomLocalDesign(): LocalDesign {
  return LOCAL_DESIGNS[Math.floor(Math.random() * LOCAL_DESIGNS.length)];
}
