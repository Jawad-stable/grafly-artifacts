import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowsOut,
  ArrowsOutSimple,
  Book,
  BookOpen,
  Briefcase,
  Browsers,
  CaretDown,
  CaretRight,
  CaretUp,
  ChatCircleDots,
  Check,
  CheckCircle,
  CircleIcon as Circle,
  CircleHalf,
  Clock,
  CloudArrowUp,
  Compass,
  DeviceMobile,
  Diamond,
  Envelope,
  Flame,
  GitBranch,
  GoogleLogo,
  GridFour,
  Headset,
  Heart,
  House,
  InfinityIcon,
  Lightning,
  Lock,
  LockOpen,
  Medal,
  Moon,
  Palette,
  Pencil,
  Rocket,
  Scales,
  ShieldCheck,
  ShoppingCart,
  Shuffle,
  SignOut,
  SpeakerHigh,
  SquaresFour,
  Stack,
  Star,
  Sun,
  Swap,
  TextT,
  TrendUp,
  Trophy,
  UserCircle,
  Warning,
  X,
  XCircle,
} from "phosphor-react-native";
import type { IconProps as PhosphorIconProps, IconWeight } from "phosphor-react-native";

export type IconName =
  | "alert-circle"
  | "apps"
  | "arrow-back"
  | "arrow-forward"
  | "arrow-up"
  | "book"
  | "book-outline"
  | "briefcase-outline"
  | "browsers-outline"
  | "cart"
  | "cart-outline"
  | "chatbubble-ellipses"
  | "checkmark"
  | "checkmark-circle"
  | "chevron-down"
  | "close-circle"
  | "cloud-upload"
  | "chevron-forward"
  | "chevron-up"
  | "close"
  | "cloud-upload-outline"
  | "color-filter"
  | "color-filter-outline"
  | "compass-outline"
  | "contrast-outline"
  | "diamond"
  | "diamond-outline"
  | "ellipse"
  | "expand-outline"
  | "flame"
  | "flash"
  | "flash-outline"
  | "git-network"
  | "git-network-outline"
  | "grid-outline"
  | "headset"
  | "heart"
  | "heart-outline"
  | "home"
  | "home-outline"
  | "infinite"
  | "infinite-outline"
  | "layers-outline"
  | "lock-closed"
  | "lock-closed-outline"
  | "lock-open"
  | "log-out-outline"
  | "logo-google"
  | "mail"
  | "mail-outline"
  | "medal"
  | "moon"
  | "pencil"
  | "person-circle"
  | "person-circle-outline"
  | "phone-portrait-outline"
  | "resize-outline"
  | "ribbon"
  | "rocket-outline"
  | "scale-outline"
  | "shield-checkmark"
  | "shield-checkmark-outline"
  | "shuffle"
  | "star"
  | "star-outline"
  | "sunny"
  | "swap-horizontal-outline"
  | "text-outline"
  | "time-outline"
  | "trending-up"
  | "trophy"
  | "trophy-outline"
  | "volume-high-outline";

type PhosphorComp = React.ComponentType<PhosphorIconProps>;

const MAP: Record<IconName, PhosphorComp> = {
  "alert-circle": Warning,
  "apps": SquaresFour,
  "arrow-back": ArrowLeft,
  "arrow-forward": ArrowRight,
  "arrow-up": ArrowUp,
  "book": BookOpen,
  "book-outline": BookOpen,
  "briefcase-outline": Briefcase,
  "browsers-outline": Browsers,
  "cart": ShoppingCart,
  "cart-outline": ShoppingCart,
  "chatbubble-ellipses": ChatCircleDots,
  "checkmark": Check,
  "checkmark-circle": CheckCircle,
  "chevron-down": CaretDown,
  "chevron-forward": CaretRight,
  "chevron-up": CaretUp,
  "close": X,
  "close-circle": XCircle,
  "cloud-upload": CloudArrowUp,
  "cloud-upload-outline": CloudArrowUp,
  "color-filter": Palette,
  "color-filter-outline": Palette,
  "compass-outline": Compass,
  "contrast-outline": CircleHalf,
  "diamond": Diamond,
  "diamond-outline": Diamond,
  "ellipse": Circle,
  "expand-outline": ArrowsOut,
  "flame": Flame,
  "flash": Lightning,
  "flash-outline": Lightning,
  "git-network": GitBranch,
  "git-network-outline": GitBranch,
  "grid-outline": GridFour,
  "headset": Headset,
  "heart": Heart,
  "heart-outline": Heart,
  "home": House,
  "home-outline": House,
  "infinite": InfinityIcon,
  "infinite-outline": InfinityIcon,
  "layers-outline": Stack,
  "lock-closed": Lock,
  "lock-closed-outline": Lock,
  "lock-open": LockOpen,
  "log-out-outline": SignOut,
  "logo-google": GoogleLogo,
  "mail": Envelope,
  "mail-outline": Envelope,
  "medal": Medal,
  "moon": Moon,
  "pencil": Pencil,
  "person-circle": UserCircle,
  "person-circle-outline": UserCircle,
  "phone-portrait-outline": DeviceMobile,
  "resize-outline": ArrowsOutSimple,
  "ribbon": Medal,
  "rocket-outline": Rocket,
  "scale-outline": Scales,
  "shield-checkmark": ShieldCheck,
  "shield-checkmark-outline": ShieldCheck,
  "shuffle": Shuffle,
  "star": Star,
  "star-outline": Star,
  "sunny": Sun,
  "swap-horizontal-outline": Swap,
  "text-outline": TextT,
  "time-outline": Clock,
  "trending-up": TrendUp,
  "trophy": Trophy,
  "trophy-outline": Trophy,
  "volume-high-outline": SpeakerHigh,
};

export interface IconComponentProps {
  name: IconName | string;
  size?: number;
  color?: string;
  weight?: IconWeight;
  style?: StyleProp<ViewStyle>;
}

export function Icon({
  name,
  size = 24,
  color,
  weight = "bold",
  style,
}: IconComponentProps) {
  const map = MAP as Record<string, PhosphorComp | undefined>;
  let Comp = map[name];
  if (!Comp && name.endsWith("-outline")) {
    Comp = map[name.slice(0, -"-outline".length)];
  }
  if (!Comp) {
    if (__DEV__) {
      console.warn(`[Icon] Unmapped icon name: "${name}"`);
    }
    return null;
  }
  return <Comp size={size} color={color} weight={weight} style={style as any} />;
}

export default Icon;
