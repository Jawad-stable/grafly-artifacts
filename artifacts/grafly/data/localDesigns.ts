import type { ImageSourcePropType } from "react-native";

export interface LocalDesign {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  source: ImageSourcePropType;
  /** Filename of the same image as served by the API server at
   *  `/api/critique/design-images/<filename>`. The multimodal LLM fetches
   *  the design image from that public URL. */
  remoteFilename: string;
}

/** Returns the public URL where the API server serves this design's image,
 *  so the multimodal AI mentor (NVIDIA NIM Maverick) can fetch it. */
export function getDesignRemoteUrl(design: LocalDesign): string | undefined {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (!domain) return undefined;
  return `https://${domain}/api/critique/design-images/${design.remoteFilename}`;
}

// Curated set of 4:5 social-media post designs (Instagram-style feed
// posts). Each one represents a distinct genre — product, lifestyle,
// editorial quote, and travel — so a single critique session can stress
// different design fundamentals (hierarchy, type/photo balance,
// negative space, color, narrative).
export const LOCAL_DESIGNS: LocalDesign[] = [
  {
    id: "social_sneaker",
    title: "Sneaker Drop Announcement",
    description:
      "A 4:5 Instagram product post for a running sneaker launch. Bold black sans-serif headline 'AIR FLOW 24' on the left, a coral 'NEW DROP' chip, a hero product photo of the shoe with a soft cast shadow on the right, and a price tag in the bottom corner. Lots of negative space, premium athletic brand feel.",
    difficulty: "intermediate",
    source: require("../assets/designs/social_sneaker.png"),
    remoteFilename: "social_sneaker.png",
  },
  {
    id: "social_coffee",
    title: "Coffee Brand Lifestyle Post",
    description:
      "A 4:5 Instagram lifestyle post for a specialty coffee brand. Top-down photo of a latte with rosetta art on a marble table, layered with a large cream serif headline 'BREW DAILY', a handwritten subtitle 'crafted in small batches', and a small wordmark 'KIN COFFEE EST. 2018' anchored at the bottom. Warm, cozy, premium.",
    difficulty: "beginner",
    source: require("../assets/designs/social_coffee.png"),
    remoteFilename: "social_coffee.png",
  },
  {
    id: "social_quote",
    title: "Editorial Quote Post",
    description:
      "A 4:5 Instagram quote post on a deep ink-blue gradient. Bold cream serif type reading 'STAY CURIOUS.' centered as the focal headline, a thin gold divider beneath, and a tracked uppercase attribution 'JANE GOODALL' below. Minimal logo mark in the bottom right. Pure typography, no photo.",
    difficulty: "beginner",
    source: require("../assets/designs/social_quote.png"),
    remoteFilename: "social_quote.png",
  },
  {
    id: "social_travel",
    title: "Travel Guide Cover Post",
    description:
      "A 4:5 Instagram travel post for a Lisbon weekend guide. A vibrant photo of pastel Lisbon buildings with the iconic yellow tram framed inside an arched window, surrounded by a terracotta block. Bold curved sans-serif headline 'LISBON' wraps the top, a 'WEEKEND GUIDE' label sits below, and a sun-yellow '12 SPOTS' badge anchors the side.",
    difficulty: "advanced",
    source: require("../assets/designs/social_travel.png"),
    remoteFilename: "social_travel.png",
  },
];

export function pickRandomLocalDesign(): LocalDesign {
  return LOCAL_DESIGNS[Math.floor(Math.random() * LOCAL_DESIGNS.length)];
}
