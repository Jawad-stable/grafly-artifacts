import {
  House as PhHouse,
  Tree as PhTree,
  Palette as PhPalette,
  ShoppingBag as PhShoppingBag,
  User as PhUser,
  Fire as PhFire,
  Coins as PhCoins,
  Lightning as PhLightning,
  Star as PhStar,
  Heart as PhHeart,
  ArrowRight as PhArrowRight,
  X as PhX,
  Check as PhCheck,
  MagnifyingGlass as PhSearch,
  Diamond as PhDiamond,
} from "@phosphor-icons/react";

import {
  Home as LuHome,
  GitBranch as LuGitBranch,
  Palette as LuPalette,
  ShoppingBag as LuShoppingBag,
  User as LuUser,
  Flame as LuFlame,
  Coins as LuCoins,
  Zap as LuZap,
  Star as LuStar,
  Heart as LuHeart,
  ArrowRight as LuArrowRight,
  X as LuX,
  Check as LuCheck,
  Search as LuSearch,
  Diamond as LuDiamond,
} from "lucide-react";

import {
  IconHome2,
  IconBinaryTree,
  IconPalette,
  IconShoppingBag,
  IconUser,
  IconFlame,
  IconCoin,
  IconBolt,
  IconStar,
  IconHeart,
  IconArrowRight,
  IconX,
  IconCheck,
  IconSearch,
  IconDiamond,
} from "@tabler/icons-react";

import {
  HomeAltSlimHoriz as IoHome,
  GitFork as IoGitFork,
  ColorFilter as IoPalette,
  Cart as IoCart,
  User as IoUser,
  FireFlame as IoFire,
  Coins as IoCoins,
  Flash as IoBolt,
  Star as IoStar,
  Heart as IoHeart,
  ArrowRight as IoArrowRight,
  Xmark as IoX,
  Check as IoCheck,
  Search as IoSearch,
  BadgeCheck as IoDiamond,
} from "iconoir-react";

const NAV = "#21263F";
const MUTED = "#6B7090";
const BORDER = "#DDE1EE";
const CARD = "#FFFFFF";
const BG = "#F5F6FA";
const ACCENT = "#E3ED43";
const PRIMARY = "#00A4FA";
const PINK = "#FF7BD0";

const NUNITO_LINK =
  "https://fonts.googleapis.com/css2?family=Nunito:wght@600;800&display=swap";

const ICON_LABELS = [
  "Home",
  "Tree",
  "Critique",
  "Shop",
  "Profile",
  "Streak",
  "Coin",
  "XP",
  "Star",
  "Heart",
  "Forward",
  "Close",
  "Check",
  "Search",
  "Premium",
] as const;

type IconRow = React.ComponentType<{ size?: number; color?: string }>[];

function IconGrid({ icons, color = NAV }: { icons: IconRow; color?: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 14,
        marginTop: 22,
      }}
    >
      {icons.map((Icon, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: BG,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={26} color={color} />
          </div>
          <span
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 600,
              fontSize: 10,
              color: MUTED,
              letterSpacing: 0.4,
            }}
          >
            {ICON_LABELS[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

function PackCard({
  name,
  tagline,
  notes,
  recommended,
  swatch,
  children,
}: {
  name: string;
  tagline: string;
  notes: string[];
  recommended?: boolean;
  swatch: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: CARD,
        borderRadius: 28,
        border: `1px solid ${BORDER}`,
        padding: 24,
        position: "relative",
        boxShadow: recommended
          ? `0 18px 36px ${ACCENT}55`
          : "0 8px 24px rgba(33,38,63,0.06)",
        outline: recommended ? `3px solid ${ACCENT}` : "none",
        outlineOffset: -3,
      }}
    >
      {recommended && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: 24,
            backgroundColor: ACCENT,
            color: NAV,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: 1.4,
            padding: "6px 12px",
            borderRadius: 100,
          }}
        >
          RECOMMENDED
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: swatch,
          }}
        />
        <span
          style={{
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: 11,
            color: MUTED,
            letterSpacing: 1.6,
          }}
        >
          {tagline}
        </span>
      </div>

      <h2
        style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 800,
          fontSize: 26,
          color: NAV,
          letterSpacing: -0.6,
          marginTop: 6,
          marginBottom: 0,
          lineHeight: 1.1,
        }}
      >
        {name}
      </h2>

      {children}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "20px 0 0 0",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {notes.map((n, i) => (
          <li
            key={i}
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 600,
              fontSize: 12,
              color: NAV,
              opacity: 0.78,
              lineHeight: 1.4,
              display: "flex",
              gap: 8,
            }}
          >
            <span style={{ color: PRIMARY, fontWeight: 800 }}>•</span>
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Compare() {
  const phosphorIcons: IconRow = [
    (p) => <PhHouse {...p} weight="bold" />,
    (p) => <PhTree {...p} weight="bold" />,
    (p) => <PhPalette {...p} weight="bold" />,
    (p) => <PhShoppingBag {...p} weight="bold" />,
    (p) => <PhUser {...p} weight="bold" />,
    (p) => <PhFire {...p} weight="bold" />,
    (p) => <PhCoins {...p} weight="bold" />,
    (p) => <PhLightning {...p} weight="bold" />,
    (p) => <PhStar {...p} weight="bold" />,
    (p) => <PhHeart {...p} weight="bold" />,
    (p) => <PhArrowRight {...p} weight="bold" />,
    (p) => <PhX {...p} weight="bold" />,
    (p) => <PhCheck {...p} weight="bold" />,
    (p) => <PhSearch {...p} weight="bold" />,
    (p) => <PhDiamond {...p} weight="bold" />,
  ];

  const lucideIcons: IconRow = [
    (p) => <LuHome {...p} strokeWidth={2.25} />,
    (p) => <LuGitBranch {...p} strokeWidth={2.25} />,
    (p) => <LuPalette {...p} strokeWidth={2.25} />,
    (p) => <LuShoppingBag {...p} strokeWidth={2.25} />,
    (p) => <LuUser {...p} strokeWidth={2.25} />,
    (p) => <LuFlame {...p} strokeWidth={2.25} />,
    (p) => <LuCoins {...p} strokeWidth={2.25} />,
    (p) => <LuZap {...p} strokeWidth={2.25} />,
    (p) => <LuStar {...p} strokeWidth={2.25} />,
    (p) => <LuHeart {...p} strokeWidth={2.25} />,
    (p) => <LuArrowRight {...p} strokeWidth={2.25} />,
    (p) => <LuX {...p} strokeWidth={2.25} />,
    (p) => <LuCheck {...p} strokeWidth={2.25} />,
    (p) => <LuSearch {...p} strokeWidth={2.25} />,
    (p) => <LuDiamond {...p} strokeWidth={2.25} />,
  ];

  const tablerIcons: IconRow = [
    (p) => <IconHome2 {...p} stroke={2.25} />,
    (p) => <IconBinaryTree {...p} stroke={2.25} />,
    (p) => <IconPalette {...p} stroke={2.25} />,
    (p) => <IconShoppingBag {...p} stroke={2.25} />,
    (p) => <IconUser {...p} stroke={2.25} />,
    (p) => <IconFlame {...p} stroke={2.25} />,
    (p) => <IconCoin {...p} stroke={2.25} />,
    (p) => <IconBolt {...p} stroke={2.25} />,
    (p) => <IconStar {...p} stroke={2.25} />,
    (p) => <IconHeart {...p} stroke={2.25} />,
    (p) => <IconArrowRight {...p} stroke={2.25} />,
    (p) => <IconX {...p} stroke={2.25} />,
    (p) => <IconCheck {...p} stroke={2.25} />,
    (p) => <IconSearch {...p} stroke={2.25} />,
    (p) => <IconDiamond {...p} stroke={2.25} />,
  ];

  const iconoirIcons: IconRow = [
    (p) => <IoHome {...p} strokeWidth={2} />,
    (p) => <IoGitFork {...p} strokeWidth={2} />,
    (p) => <IoPalette {...p} strokeWidth={2} />,
    (p) => <IoCart {...p} strokeWidth={2} />,
    (p) => <IoUser {...p} strokeWidth={2} />,
    (p) => <IoFire {...p} strokeWidth={2} />,
    (p) => <IoCoins {...p} strokeWidth={2} />,
    (p) => <IoBolt {...p} strokeWidth={2} />,
    (p) => <IoStar {...p} strokeWidth={2} />,
    (p) => <IoHeart {...p} strokeWidth={2} />,
    (p) => <IoArrowRight {...p} strokeWidth={2} />,
    (p) => <IoX {...p} strokeWidth={2} />,
    (p) => <IoCheck {...p} strokeWidth={2} />,
    (p) => <IoSearch {...p} strokeWidth={2} />,
    (p) => <IoDiamond {...p} strokeWidth={2} />,
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: BG,
        padding: "48px 40px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <link rel="stylesheet" href={NUNITO_LINK} />

      {/* Header */}
      <div style={{ maxWidth: 1400, margin: "0 auto 36px auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: PRIMARY,
            }}
          />
          <span
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 800,
              fontSize: 11,
              color: MUTED,
              letterSpacing: 1.6,
            }}
          >
            ICON PACK SHORTLIST FOR GRAFLY
          </span>
        </div>
        <h1
          style={{
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: 46,
            color: NAV,
            letterSpacing: -1.2,
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          Pick the icon set
        </h1>
        <p
          style={{
            fontFamily: "Nunito, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: MUTED,
            marginTop: 10,
            marginBottom: 0,
            maxWidth: 720,
            lineHeight: 1.5,
          }}
        >
          The same fifteen icons currently used across the app, rendered in four
          of the most respected icon systems available today. All are open
          source and supported in React Native via dedicated packages.
        </p>
      </div>

      {/* Comparison row */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        <PackCard
          name="Phosphor"
          tagline="BOLD WEIGHT"
          swatch={ACCENT}
          recommended
          notes={[
            "Six weights total. Bold weight matches Nunito ExtraBold beautifully.",
            "Used by Linear, Vercel, and serious editorial product teams.",
            "Native package: phosphor-react-native. Free, MIT licensed.",
          ]}
        >
          <IconGrid icons={phosphorIcons} />
        </PackCard>

        <PackCard
          name="Lucide"
          tagline="STROKE 2.25"
          swatch={PRIMARY}
          notes={[
            "Single weight, very crisp and uniform geometric grid.",
            "Default in Vercel, shadcn, and most Tailwind-based products.",
            "Native package: lucide-react-native. Free, ISC licensed.",
          ]}
        >
          <IconGrid icons={lucideIcons} />
        </PackCard>

        <PackCard
          name="Tabler"
          tagline="4500+ ICONS"
          swatch={PINK}
          notes={[
            "Largest catalogue, very rigorous 24x24 grid system.",
            "Stroke and Filled variants, perfect for active vs idle tab states.",
            "RN support via SVG. Free, MIT licensed.",
          ]}
        >
          <IconGrid icons={tablerIcons} />
        </PackCard>

        <PackCard
          name="Iconoir"
          tagline="FRIENDLY GRID"
          swatch={"#22DD88"}
          notes={[
            "Softer corners, friendlier silhouettes. Pairs well with mascots.",
            "Single weight, hand-tuned 24x24 grid.",
            "Native package: react-native-iconoir. Free, MIT licensed.",
          ]}
        >
          <IconGrid icons={iconoirIcons} />
        </PackCard>
      </div>

      {/* Footer rationale */}
      <div
        style={{
          maxWidth: 1400,
          margin: "32px auto 0 auto",
          padding: 22,
          backgroundColor: NAV,
          borderRadius: 24,
          color: "#FFFFFF",
          display: "flex",
          gap: 24,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: ACCENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PhDiamond size={28} color={NAV} weight="bold" />
        </div>
        <div>
          <div
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: 1.6,
              color: ACCENT,
              marginBottom: 4,
            }}
          >
            WHY PHOSPHOR FOR GRAFLY
          </div>
          <div
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              lineHeight: 1.5,
              color: "#FFFFFF",
              opacity: 0.92,
            }}
          >
            Grafly is built on Nunito ExtraBold and bold flat color blocks.
            Phosphor Bold is the only one of these that visually matches that
            weight without looking thin or generic. Six weights also gives room
            to grow: Bold for primary, Regular for secondary content, Fill for
            active tab states.
          </div>
        </div>
      </div>
    </div>
  );
}
