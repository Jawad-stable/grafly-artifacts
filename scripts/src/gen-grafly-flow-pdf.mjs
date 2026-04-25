import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const OUT_DIR = path.join(ROOT, "docs");
const OUT_FILE = path.join(OUT_DIR, "grafly-user-flow.pdf");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// US Letter, points
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 56;
const FOOTER_H = 28;
const CONTENT_W = PAGE_W - MARGIN * 2;
const CONTENT_TOP_Y = PAGE_H - MARGIN; // top of writable area, y measured from bottom
const CONTENT_BOTTOM_Y = MARGIN + FOOTER_H;

const hex = (h) => {
  const s = h.replace("#", "");
  const n = parseInt(s, 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const C = {
  ink:     hex("#0F172A"),
  body:    hex("#1F2937"),
  muted:   hex("#6B7280"),
  rule:    hex("#D1D5DB"),
  accent:  hex("#0EA5E9"),
  pink:    hex("#DB2777"),
  success: hex("#16A34A"),
  warn:    hex("#D97706"),
  danger:  hex("#DC2626"),
  bg:      hex("#F8FAFC"),
  white:   hex("#FFFFFF"),
};

const TONE = {
  null:    C.body,
  ink:     C.ink,
  body:    C.body,
  muted:   C.muted,
  accent:  C.accent,
  warn:    C.warn,
  success: C.success,
  danger:  C.danger,
};

const SECTIONS = [
  {
    id: 1,
    title: "App entry & authentication",
    summary:
      "Cold start runs through the AuthGate, which decides between onboarding, the main app, or the auth screen based on persisted state.",
    blocks: [
      {
        title: "Cold start decision tree",
        rows: [
          ["Splash / app load", "muted"],
          ["  -> Providers mount: SafeArea, QueryClient, Auth, Game", "muted"],
          ["  -> AuthGate evaluates persisted state", "muted"],
          ["", null],
          ["IF onboardingComplete == false", "warn"],
          ["  -> redirect to /onboarding", "ink"],
          ["", null],
          ["IF onboardingComplete == true AND route == /onboarding", "warn"],
          ["  -> redirect to /(tabs)", "ink"],
          ["", null],
          ["IF route in [auth, auth-callback]", "warn"],
          ["  -> always allowed (password recovery deep link)", "ink"],
          ["", null],
          ["ELSE", "warn"],
          ["  -> render requested route", "ink"],
        ],
      },
      {
        title: "Auth screen (/auth) modes",
        rows: [
          ["[Sign in] (default)", "accent"],
          ["  email + password -> Supabase signIn", "ink"],
          ["    success -> replace /(tabs)", "success"],
          ["    error   -> inline error", "danger"],
          ["  Continue with Google -> OAuth flow", "ink"],
          ["    success -> replace /(tabs)", "success"],
          ["", null],
          ["[Sign up]", "accent"],
          ["  email + password (>= 6 chars)", "ink"],
          ["    needsConfirmation -> notice + return to Sign in", "warn"],
          ["    confirmed         -> replace /(tabs)", "success"],
          ["", null],
          ["[Reset password]", "accent"],
          ["  email -> Supabase resetPassword", "ink"],
          ["    success -> show 'check your email' notice", "success"],
          ["    error   -> inline error", "danger"],
          ["", null],
          ["Close (X) shown only if onboardingComplete == true -> /(tabs)", "muted"],
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Onboarding flow",
    summary:
      "Eight ordered steps from welcome to optional account creation. Placement test can be skipped; account creation can be deferred.",
    blocks: [
      {
        title: "Step sequence",
        rows: [
          ["1. welcome", "accent"],
          ["   - Logo, theme toggle (light/dark), Start CTA", "muted"],
          ["   v", "muted"],
          ["2. name", "accent"],
          ["   - TextInput (max 24 chars), required to advance", "muted"],
          ["   v", "muted"],
          ["3. goal", "accent"],
          ["   - Pick 1 of 4: basics | improve | portfolio | career", "muted"],
          ["   v", "muted"],
          ["4. level (self assessed)", "accent"],
          ["   - Beginner | Intermediate | Advanced", "muted"],
          ["   v", "muted"],
          ["5. time (daily commitment)", "accent"],
          ["   - 5 min | 10 min | 15+ min", "muted"],
          ["   v", "muted"],
          ["6. placement", "accent"],
          ["   - Multi choice and true/false questions", "muted"],
          ["   - 'Skip placement' -> jump to results as 'novice'", "warn"],
          ["   v", "muted"],
          ["7. results", "accent"],
          ["   - PlacementLevel: novice | beginner | intermediate | advanced | expert", "muted"],
          ["   - Mascot celebrates", "muted"],
          ["   v", "muted"],
          ["8. signup", "accent"],
          ["   - Continue with Google -> finish", "ink"],
          ["   - Email sign in / sign up / reset -> finish", "ink"],
          ["   - 'Skip / continue without account' -> finish (guest)", "warn"],
          ["   v", "muted"],
          ["completeOnboarding(name, level) -> redirect /(tabs)", "success"],
        ],
      },
      {
        title: "Placement scoring",
        rows: [
          ["score / total", "muted"],
          [">= 0.90 -> expert",       "ink"],
          [">= 0.75 -> advanced",     "ink"],
          [">= 0.55 -> intermediate", "ink"],
          [">= 0.35 -> beginner",     "ink"],
          ["<  0.35 -> novice",       "ink"],
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Main tab navigation overview",
    summary:
      "After onboarding, users land in a 5 tab floating bottom nav. Each tab is a top level screen; lessons, paywall, leaderboard, and auth are presented above it.",
    blocks: [
      {
        title: "Tab bar (left to right)",
        rows: [
          ["[ Home ]     index    -> /(tabs)/index",    "accent"],
          ["[ Tree ]     tree     -> /(tabs)/tree",     "accent"],
          ["[ Critique ] critique -> /(tabs)/critique", "accent"],
          ["[ Shop ]     shop     -> /(tabs)/shop",     "accent"],
          ["[ Profile ]  profile  -> /(tabs)/profile",  "accent"],
        ],
      },
      {
        title: "Modal / above tab routes",
        rows: [
          ["/lesson?nodeId=...   (full screen lesson player)", "ink"],
          ["/paywall             (subscription upsell)", "ink"],
          ["/leaderboard         (weekly XP leaderboard)", "ink"],
          ["/courses             (course library)", "ink"],
          ["/auth                (sign in / up / reset)", "ink"],
          ["/auth-callback       (OAuth + password reset return)", "ink"],
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Home tab flow",
    summary:
      "Daily landing page summarising progress, surfacing the next lesson, and routing to courses, the leaderboard, and the paywall.",
    blocks: [
      {
        title: "Sections (top to bottom)",
        rows: [
          ["Header (fixed, minimal)", "accent"],
          ["  - Logo, streak count (flame icon), coin count", "muted"],
          ["", null],
          ["Greeting + streak status", "accent"],
          ["  - 'Hey {name}', current streak, streak risk warning", "muted"],
          ["", null],
          ["Pro upgrade banner (free users only)", "accent"],
          ["  -> tap -> /paywall", "ink"],
          ["", null],
          ["Continue learning card", "accent"],
          ["  -> tap -> /lesson?nodeId=<lastUnfinished>", "ink"],
          ["", null],
          ["Popular courses carousel", "accent"],
          ["  -> tap card -> /(tabs)/tree?courseId=<id>", "ink"],
          ["", null],
          ["Rank / leaderboard card", "accent"],
          ["  -> tap -> /leaderboard", "ink"],
          ["", null],
          ["Overlays", "accent"],
          ["  - XPPopup on XP gain", "muted"],
          ["  - LevelUpOverlay on level up", "muted"],
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Skill Tree tab flow",
    summary:
      "Course picker plus a vertical node tree. Nodes have three states (locked / unlocked / completed); pressing one opens a sheet that launches the lesson.",
    blocks: [
      {
        title: "Course picker",
        rows: [
          ["Header shows current course + completion %", "muted"],
          ["  -> tap header -> course picker modal", "ink"],
          ["       -> select course -> tree re renders for that course", "ink"],
        ],
      },
      {
        title: "Node states",
        rows: [
          ["For each node:", "muted"],
          ["  IF every prerequisite node id is in completedLessons", "warn"],
          ["    IF every lesson in node is completed", "warn"],
          ["      -> COMPLETED  (success colour, checkmark)", "success"],
          ["    ELSE", "warn"],
          ["      -> UNLOCKED   (course colour, lesson icon)", "ink"],
          ["  ELSE", "warn"],
          ["    -> LOCKED       (muted colour, lock icon)", "danger"],
        ],
      },
      {
        title: "Node press",
        rows: [
          ["Tap node -> NodeSheet (bottom sheet)", "accent"],
          ["  - Title, description, lesson count, XP reward", "muted"],
          ["  IF locked   -> message 'Complete previous lessons' (no CTA)", "danger"],
          ["  IF unlocked -> 'Start lesson' -> /lesson?nodeId=<id>", "success"],
          ["  IF completed -> 'Review'    -> /lesson?nodeId=<id>", "ink"],
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Lesson flow",
    summary:
      "Question by question lesson player. Seven question types share one engine. Wrong answers cost a heart; reaching zero hearts forces the paywall.",
    blocks: [
      {
        title: "Per question loop",
        rows: [
          ["Render question by type:", "accent"],
          ["  - multiple_choice", "muted"],
          ["  - true_false", "muted"],
          ["  - spot_the_difference", "muted"],
          ["  - tap_the_element", "muted"],
          ["  - arrange_in_order", "muted"],
          ["  - drag_to_match", "muted"],
          ["  - fill_in_blank", "muted"],
          ["", null],
          ["User submits answer", "accent"],
          ["  IF correct", "warn"],
          ["    -> success colours, checkmark, success sound", "success"],
          ["    -> mascot 'celebrate'", "success"],
          ["    -> tap Continue -> next question", "ink"],
          ["  IF wrong", "warn"],
          ["    -> destructive colours, shake, error sound", "danger"],
          ["    -> mascot 'wrong'", "danger"],
          ["    -> loseHeart()", "danger"],
          ["    IF hearts == 0", "warn"],
          ["      -> redirect /paywall (out of hearts state)", "danger"],
          ["    ELSE", "warn"],
          ["      -> tap Continue -> next question", "ink"],
        ],
      },
      {
        title: "End of lesson summary",
        rows: [
          ["After last question:", "accent"],
          ["  - completeLesson(nodeId, lessonIdx)", "muted"],
          ["  - Award XP, coins; record completion", "muted"],
          ["  - Show summary: XP earned, coins earned, hearts lost", "muted"],
          ["", null],
          ["Summary CTAs:", "accent"],
          ["  IF more lessons in this node", "warn"],
          ["    -> 'Next Lesson' -> advance lessonIdx, reset state", "ink"],
          ["  ELSE (last lesson in node)", "warn"],
          ["    -> CTA -> router.replace('/(tabs)/tree')", "ink"],
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Critique tab flow",
    summary:
      "AI design mentor. Pick a mockup, chat in turns, earn rewards after enough exchanges. Free users are capped per day; Pro is unlimited.",
    blocks: [
      {
        title: "Session lifecycle",
        rows: [
          ["1. Idle / mockup selection", "accent"],
          ["   - Shuffle mockup deck, tap one to start", "muted"],
          ["   v", "muted"],
          ["2. Mentor chat", "accent"],
          ["   - User submits critique notes", "muted"],
          ["   - AI responds (typewriter animation)", "muted"],
          ["   - Repeat for several turns", "muted"],
          ["   v", "muted"],
          ["3. Reward gate", "accent"],
          ["   IF userTurns >= MIN_USER_TURNS_FOR_REWARD (3)", "warn"],
          ["     -> award XP + coins, mark session complete", "success"],
          ["   ELSE", "warn"],
          ["     -> no reward yet, can keep chatting", "muted"],
          ["   v", "muted"],
          ["4. Session end", "accent"],
          ["   - Reset to idle, show 'sessions remaining today'", "muted"],
        ],
      },
      {
        title: "Free vs Pro gating",
        rows: [
          ["Free tier", "accent"],
          ["  - maxSessions = 2 (per screen mount, local useState)", "muted"],
          ["  - sessionsDone resets if the user leaves and returns", "warn"],
          ["  - On limitReached:", "warn"],
          ["      -> show 'Limit reached' state", "danger"],
          ["      -> CTA 'Unlock Pro' -> /paywall", "ink"],
          ["", null],
          ["Pro tier", "accent"],
          ["  - maxSessions = Infinity (state.isPro == true)", "success"],
          ["  - No paywall trigger from this screen", "success"],
        ],
      },
    ],
  },
  {
    id: 8,
    title: "Shop tab flow",
    summary:
      "Browse power ups and cosmetics. Power ups deduct coins and persist to game state; cosmetics show a confirmation toast only. Insufficient balance shows a friendly fail state.",
    blocks: [
      {
        title: "Categories",
        rows: [
          ["Power ups (persistent)", "accent"],
          ["  - Heart Refill    -> refillHearts() (costs 100 coins)", "muted"],
          ["  - Streak Shield   -> purchaseShield()", "muted"],
          ["  - XP Booster      -> activateBooster()", "muted"],
          ["", null],
          ["Cosmetics (visual only)", "accent"],
          ["  - Avatar Frames -> 'equipped!' toast (no coin deduction,", "muted"],
          ["    no persisted equip state in current build)", "muted"],
        ],
      },
      {
        title: "Purchase flow",
        rows: [
          ["Tap item -> ShopCard checks canAfford = state.coins >= cost", "accent"],
          ["", null],
          ["Power up branch", "accent"],
          ["  IF canAfford", "warn"],
          ["    -> useCoins(cost) + apply effect via GameContext", "ink"],
          ["    -> mascot 'celebrate' + success toast", "success"],
          ["  ELSE", "warn"],
          ["    -> mascot 'wrong' + 'Not enough coins' toast", "danger"],
          ["", null],
          ["Cosmetic branch", "accent"],
          ["  IF canAfford -> 'X equipped!' toast (UI only)", "ink"],
          ["  ELSE         -> 'Not enough coins' toast", "danger"],
          ["", null],
          ["No Pro only gating in current shop build", "muted"],
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Profile tab flow",
    summary:
      "User identity, gamification stats, achievements, app preferences, and account actions in one scroll.",
    blocks: [
      {
        title: "Sections (top to bottom)",
        rows: [
          ["Identity card", "accent"],
          ["  - Mascot, username (tap pencil to edit)", "muted"],
          ["  - Level, division (bronze..diamond), placement label", "muted"],
          ["  - Weekly XP", "muted"],
          ["", null],
          ["Progress", "accent"],
          ["  - Level number, XP bar (current / required)", "muted"],
          ["  - 'X XP to level N+1'", "muted"],
          ["", null],
          ["By the numbers (stats grid)", "accent"],
          ["  - Total XP, current streak, max streak, lessons done", "muted"],
          ["", null],
          ["Achievements / badges (horizontal scroll)", "accent"],
          ["  - Unlocked badges in colour, locked in muted with lock icon", "muted"],
          ["", null],
          ["Preferences", "accent"],
          ["  - Voice feedback toggle (toggleVoice)", "muted"],
          ["", null],
          ["Account", "accent"],
          ["  - Upgrade to Pro -> /paywall", "ink"],
          ["  IF signed in -> Sign out (signOut)", "ink"],
          ["  IF guest    -> 'Save your progress' -> /auth", "ink"],
        ],
      },
    ],
  },
  {
    id: 10,
    title: "Paywall flow",
    summary:
      "Single paywall screen reached from many trigger points. Annual plan is preselected; purchase flips isPro and returns the user to where they came from.",
    blocks: [
      {
        title: "Trigger points",
        rows: [
          ["Home upgrade banner",          "ink"],
          ["Critique 'limit reached' CTA", "ink"],
          ["Lesson hearts == 0 (forced)",  "danger"],
          ["Profile 'Upgrade to Pro' CTA", "ink"],
          ["Shop Pro only item tap",       "ink"],
        ],
      },
      {
        title: "Plans + purchase",
        rows: [
          ["Plan picker", "accent"],
          ["  - Annual  $39.99 / yr  (preselected, 'SAVE 33%' badge)", "ink"],
          ["  - Monthly $4.99  / mo  ('Cancel anytime')", "ink"],
          ["", null],
          ["Sticky CTA", "accent"],
          ["  -> handlePurchase()", "ink"],
          ["     - simulate processing (~1.2s)", "muted"],
          ["     - dispatch SET_PRO { isPro: true }", "success"],
          ["     - router.back() (or replace '/')", "ink"],
          ["", null],
          ["Close (X) -> back / replace '/'", "muted"],
        ],
      },
    ],
  },
  {
    id: 11,
    title: "Cross cutting states",
    summary:
      "Behaviours that span tabs and screens. All flow through GameContext / AuthContext, persisted to AsyncStorage and (if signed in) Supabase.",
    blocks: [
      {
        title: "Hearts",
        rows: [
          ["Wrong answer -> loseHeart()", "ink"],
          ["Hearts only refill via explicit actions:", "muted"],
          ["  - Shop 'Heart Refill' (REFILL_HEARTS, costs 100 coins)", "ink"],
          ["  - No automatic time based refill in current build", "warn"],
          ["IF hearts == 0 mid lesson -> /paywall (out of hearts)", "danger"],
        ],
      },
      {
        title: "Streak",
        rows: [
          ["completeLesson() runs INCREMENT_STREAK", "muted"],
          ["isConsecutive = (lastStreakDate == yesterday.toDateString())", "muted"],
          ["IF isConsecutive -> streak += 1", "success"],
          ["ELSE             -> streak resets to 1", "danger"],
          ["streakMax = max(streakMax, newStreak)", "muted"],
          ["", null],
          ["Streak Shield (Shop) increments shield count on purchase,", "warn"],
          ["but is not auto consumed when a day is missed in current build.", "warn"],
        ],
      },
      {
        title: "Level up",
        rows: [
          ["XP awarded by lesson + critique reward", "muted"],
          ["IF xp crosses threshold for next level", "warn"],
          ["  -> level += 1", "success"],
          ["  -> LevelUpOverlay shown on Home / current screen", "success"],
          ["  -> mascot 'celebrate'", "success"],
        ],
      },
      {
        title: "Badges / achievements",
        rows: [
          ["Each badge has a condition(state) -> bool", "muted"],
          ["Examples:", "muted"],
          ["  - First Step  : completedLessons.length >= 1",  "ink"],
          ["  - On Fire     : streakMax >= 7",                "ink"],
          ["  - Rising      : level >= 5",                    "ink"],
          ["  - Pro         : level >= 10",                   "ink"],
          ["  - Rich        : coins >= 500",                  "ink"],
          ["  - Dedicated   : completedLessons.length >= 10", "ink"],
          ["Recomputed each Profile render; locked ones dimmed", "muted"],
        ],
      },
      {
        title: "Sync",
        rows: [
          ["GameContext writes to AsyncStorage on every change", "muted"],
          ["IF authenticated", "warn"],
          ["  -> debounced (1.5s) push to Supabase", "ink"],
          ["  -> on app open: hydrate from Supabase, fall back to local", "ink"],
          ["IF guest", "warn"],
          ["  -> local only; sign up later migrates local state", "ink"],
        ],
      },
    ],
  },
];

class PageBuilder {
  constructor(pdfDoc, fonts) {
    this.pdfDoc = pdfDoc;
    this.fonts = fonts;
    this.pages = [];
    this.page = null;
    this.cursorY = 0;          // distance from top of writable area
    this.includeFooter = true;
    this.pageNumber = 0;
  }

  newPage({ withFooter = true } = {}) {
    this.page = this.pdfDoc.addPage([PAGE_W, PAGE_H]);
    this.pages.push({ page: this.page, withFooter });
    this.cursorY = 0;
    this.includeFooter = withFooter;
    this.pageNumber += 1;
    return this.page;
  }

  remainingHeight() {
    return CONTENT_TOP_Y - CONTENT_BOTTOM_Y - this.cursorY;
  }

  ensure(needed) {
    if (this.remainingHeight() < needed) {
      this.newPage();
    }
  }

  yFromTop(offsetFromTop) {
    // pdf-lib uses bottom origin; convert top-down offset to absolute y
    return CONTENT_TOP_Y - offsetFromTop;
  }

  drawText(text, { font, size, color, x = MARGIN, dy = 0 }) {
    const baselineY = this.yFromTop(this.cursorY + dy + size); // top of text -> baseline
    this.page.drawText(text, { x, y: baselineY, size, font, color });
  }

  advance(dy) {
    this.cursorY += dy;
  }

  drawHorizontalRule(width = 56, color = C.ink, thickness = 1.2) {
    const y = this.yFromTop(this.cursorY);
    this.page.drawLine({
      start: { x: MARGIN, y },
      end:   { x: MARGIN + width, y },
      thickness,
      color,
    });
  }
}

async function build() {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("Grafly - User Flow Map");
  pdfDoc.setAuthor("Grafly Team");
  pdfDoc.setSubject("Printable user flow reference for the Grafly mobile app");
  pdfDoc.setKeywords(["grafly", "user flow", "mobile", "expo", "design"]);
  pdfDoc.setProducer("pdf-lib");
  pdfDoc.setCreator("scripts/src/gen-grafly-flow-pdf.mjs");

  const fonts = {
    sans:     await pdfDoc.embedFont(StandardFonts.Helvetica),
    sansBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    mono:     await pdfDoc.embedFont(StandardFonts.Courier),
    monoBold: await pdfDoc.embedFont(StandardFonts.CourierBold),
  };

  const b = new PageBuilder(pdfDoc, fonts);

  // ---------------- Title page ----------------
  b.newPage({ withFooter: false });
  // outer frame
  b.page.drawRectangle({
    x: MARGIN, y: MARGIN,
    width: PAGE_W - MARGIN * 2,
    height: PAGE_H - MARGIN * 2,
    borderColor: C.rule,
    borderWidth: 1,
  });

  const centerText = (text, font, size, yFromTopAbs, color = C.ink) => {
    const w = font.widthOfTextAtSize(text, size);
    const x = (PAGE_W - w) / 2;
    const y = PAGE_H - yFromTopAbs - size;
    b.page.drawText(text, { x, y, size, font, color });
  };

  centerText("GRAFLY", fonts.sansBold, 11, PAGE_H / 2 - 110, C.muted);
  centerText("User Flow Map", fonts.sansBold, 40, PAGE_H / 2 - 78, C.ink);

  // small underline rule
  {
    const y = PAGE_H - (PAGE_H / 2 - 18);
    b.page.drawLine({
      start: { x: PAGE_W / 2 - 28, y },
      end:   { x: PAGE_W / 2 + 28, y },
      thickness: 1.4,
      color: C.ink,
    });
  }

  centerText(
    "A printable reference covering every screen, branch,",
    fonts.sans, 13, PAGE_H / 2 - 4, C.body,
  );
  centerText(
    "and gating rule in the Grafly mobile app.",
    fonts.sans, 13, PAGE_H / 2 + 16, C.body,
  );

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  centerText(`Generated ${dateStr}`, fonts.sans, 11, PAGE_H - MARGIN - 36, C.muted);

  // ---------------- Table of contents ----------------
  b.newPage();
  b.drawText("CONTENTS", {
    font: fonts.sansBold, size: 10, color: C.muted, dy: 0,
  });
  b.advance(18);
  b.drawText("Table of contents", {
    font: fonts.sansBold, size: 28, color: C.ink, dy: 0,
  });
  b.advance(36);
  b.drawHorizontalRule();
  b.advance(28);

  for (const s of SECTIONS) {
    const num = String(s.id).padStart(2, "0");
    b.drawText(num, {
      font: fonts.sansBold, size: 11, color: C.muted, x: MARGIN, dy: 0,
    });
    b.drawText(s.title, {
      font: fonts.sansBold, size: 13, color: C.ink, x: MARGIN + 36, dy: 0,
    });
    b.advance(20);
    b.page.drawLine({
      start: { x: MARGIN, y: b.yFromTop(b.cursorY) },
      end:   { x: PAGE_W - MARGIN, y: b.yFromTop(b.cursorY) },
      thickness: 0.5,
      color: C.rule,
    });
    b.advance(14);
  }

  // ---------------- Sections ----------------
  for (const section of SECTIONS) {
    b.newPage();
    // Section eyebrow
    b.drawText(`SECTION ${String(section.id).padStart(2, "0")}`, {
      font: fonts.sansBold, size: 10, color: C.muted, dy: 0,
    });
    b.advance(16);
    // Section title
    b.drawText(section.title, {
      font: fonts.sansBold, size: 22, color: C.ink, dy: 0,
    });
    b.advance(30);
    b.drawHorizontalRule();
    b.advance(20);

    // Summary (wrap manually)
    const summaryLines = wrapText(
      section.summary, fonts.sans, 11, CONTENT_W,
    );
    for (const line of summaryLines) {
      b.ensure(16);
      b.drawText(line, {
        font: fonts.sans, size: 11, color: C.body, dy: 0,
      });
      b.advance(15);
    }
    b.advance(10);

    for (const block of section.blocks) {
      // Block title
      b.ensure(28 + 24); // title + at least one row
      b.drawText(block.title, {
        font: fonts.sansBold, size: 12, color: C.ink, dy: 0,
      });
      b.advance(18);

      // Tree block
      drawTreeBlock(b, block.rows);
      b.advance(14);
    }
  }

  // ---------------- Footers ----------------
  // Re-iterate pages and stamp footer (skip title page)
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const pageInfo = b.pages[i];
    if (!pageInfo.withFooter) continue;
    const pageNumber = i + 1;
    drawFooter(pageInfo.page, fonts, pageNumber);
  }

  const bytes = await pdfDoc.save();
  fs.writeFileSync(OUT_FILE, bytes);
  return OUT_FILE;
}

function wrapText(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const word of words) {
    const trial = cur ? `${cur} ${word}` : word;
    const w = font.widthOfTextAtSize(trial, size);
    if (w > maxWidth && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = trial;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawTreeBlock(b, rows) {
  const lineHeight = 13.5;
  const innerPadX = 12;
  const innerPadY = 10;
  const blockHeight = rows.length * lineHeight + innerPadY * 2;

  b.ensure(blockHeight + 6);

  const topY = b.yFromTop(b.cursorY);
  const bottomY = topY - blockHeight;

  // Background panel
  b.page.drawRectangle({
    x: MARGIN, y: bottomY,
    width: CONTENT_W,
    height: blockHeight,
    color: C.bg,
    borderColor: C.rule,
    borderWidth: 0.75,
  });

  // Accent bar on the left edge
  b.page.drawLine({
    start: { x: MARGIN, y: topY - 6 },
    end:   { x: MARGIN, y: bottomY + 6 },
    thickness: 2,
    color: C.accent,
  });

  // Rows
  let yCursor = topY - innerPadY - 9.5; // baseline-ish for first row (size 9.5)
  for (const [text, tone] of rows) {
    const color = TONE[tone] ?? C.body;
    b.page.drawText(text || " ", {
      x: MARGIN + innerPadX,
      y: yCursor,
      size: 9.5,
      font: b.fonts.mono,
      color,
    });
    yCursor -= lineHeight;
  }

  b.cursorY += blockHeight;
}

function drawFooter(page, fonts, pageNumber) {
  const y = MARGIN - 6;
  page.drawLine({
    start: { x: MARGIN,           y: y + 14 },
    end:   { x: PAGE_W - MARGIN,  y: y + 14 },
    thickness: 0.5,
    color: C.rule,
  });
  page.drawText("Grafly - User Flow Map", {
    x: MARGIN,
    y,
    size: 9,
    font: fonts.sans,
    color: C.muted,
  });
  const numText = String(pageNumber);
  const numWidth = fonts.sans.widthOfTextAtSize(numText, 9);
  page.drawText(numText, {
    x: PAGE_W - MARGIN - numWidth,
    y,
    size: 9,
    font: fonts.sans,
    color: C.muted,
  });
}

build()
  .then((file) => {
    const stat = fs.statSync(file);
    console.log(`PDF written: ${file}`);
    console.log(`Size: ${(stat.size / 1024).toFixed(1)} KB`);
  })
  .catch((err) => {
    console.error("Failed to build PDF:", err);
    process.exit(1);
  });
