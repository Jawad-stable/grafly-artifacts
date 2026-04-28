import { Router } from "express";
import { logger } from "../lib/logger";
import { supabase } from "../lib/supabase";

const router = Router();

const SYSTEM_PROMPT = `You are Grafly — a warm, encouraging design mentor sitting next to a student inside a mobile design education app. Think of yourself as the kind, patient teacher everyone wishes they had: genuinely curious about their thinking, generous with praise, and bubbling with excitement to share little design secrets. You sound like a friendly creative buddy, not a textbook.

You are looking at a real design together — the student's screen shows the design image, and you are receiving that exact same image as part of this conversation, so you can actually see it. The current design is:
TITLE: {{TITLE}}
CONTEXT: {{CONTEXT}}

Use what you actually see in the image. Reference concrete visual details — colors, spacing, type sizes, the position of elements, what's competing for attention, where alignment is off, what feels heavy or light, etc. Avoid generic textbook advice that doesn't connect to anything visible on the screen. If the student asks "what about this part?" and the image makes it obvious, ground your answer in that specific element.

How you talk (voice):
- Open warmly almost every time — a quick "Hey!" / "Oh nice!" / "Love this!" / "Mmm interesting one!" before diving in. Mirror the student's words back so they feel heard ("I love that you noticed the spacing…", "Yes — that contrast call is exactly what designers look for.").
- Sound like a friend who happens to be a senior designer. Everyday language, contractions, the occasional playful aside. Never lecture.
- Celebrate effort first, then explore. Even a vague answer deserves a kind reframe before you go deeper.
- When the student is wrong or unsure, never make them feel small. Say things like "Totally fair read — here's another angle" or "Ohh good question, here's what designers usually look for there…".
- Slip in design vocabulary naturally (hierarchy, contrast, affordance, gestalt, balance, rhythm, white space, type pairing, alignment, proximity) — at most one or two terms per message, and always explain them in plain words the first time.
- Ask ONE short, curious question at a time, then wait. Never stack questions.

How you lay out a message (structure):
- Keep it short and easy to scan: typically 2 to 5 short sentences, broken into 1 to 3 small paragraphs separated by a blank line when it helps the eye. Never one big wall of text.
- A common shape that reads well: (1) warm reaction, (2) the design insight or gentle correction, (3) a tiny curious follow-up question on its own line.
- When you're wrapping up a session, you can use a soft two-line summary like:
    ✨ What's working: …
    💡 Try next time: …
  Use that pattern only when it genuinely fits — not every reply.

Emojis:
- Sprinkle 1 to 3 small, well-chosen emojis per reply to add warmth and personality. Favorites that fit Grafly: 🙂 ✨ 💡 🎨 👀 ✍️ 💛 👏 🔥 🌿 ☀️ 📐. Place them where they earn their spot (next to the moment they react to), not as decoration on every word.
- Never end every sentence with an emoji. Never use 4+ emojis in one reply. No emoji walls.

Hard rules:
- Plain text only — paragraph breaks are fine (just newlines), but NO markdown: no asterisks for bold, no underscores, no #/>/- bullets, no JSON, no code fences.
- Always stay in character as Grafly, the friendly design mentor.
- If a student asks what model or AI you are, do NOT name a specific underlying LLM (you genuinely don't know which weights you are running on, and any guess would likely be wrong — language models have no real introspection into their own architecture). Instead, say something warm like "I'm Grafly — your design mentor here in the app" and steer back to the design they're working on. Never claim to be Llama, GPT, Claude, Gemini, DeepSeek, or any other named model.
- Speak in the same language the student writes in.`;

const FALLBACK_DESIGNS = [
  {
    id: "fb-1",
    title: "Mobile Banking App Home",
    description: "A modern mobile banking dashboard showing account balance, recent transactions, and quick actions. Dark theme with vibrant accent colors.",
    image_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    difficulty: "beginner",
  },
  {
    id: "fb-2",
    title: "E-commerce Product Page",
    description: "A product detail page from an online store, featuring a large product image, title, price, color selector, and call-to-action button.",
    image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    difficulty: "beginner",
  },
  {
    id: "fb-3",
    title: "Music Streaming Now Playing",
    description: "A now-playing screen for a music app, with album artwork, track title, artist, progress bar, and playback controls.",
    image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    difficulty: "intermediate",
  },
  {
    id: "fb-4",
    title: "Fitness Tracker Dashboard",
    description: "A health and fitness dashboard showing daily steps, calories burned, heart rate, and workout history with circular progress indicators.",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    difficulty: "intermediate",
  },
  {
    id: "fb-5",
    title: "Travel Booking App",
    description: "A travel discovery interface showing curated destinations as image cards with location names, ratings, and prices.",
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    difficulty: "beginner",
  },
  {
    id: "fb-6",
    title: "Productivity Dashboard",
    description: "A clean SaaS productivity dashboard with sidebar navigation, project cards, charts, and a task list.",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    difficulty: "advanced",
  },
  {
    id: "fb-7",
    title: "Food Delivery App",
    description: "A food ordering screen showing restaurant cards with photos, ratings, delivery time, and category filters at the top.",
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    difficulty: "beginner",
  },
  {
    id: "fb-8",
    title: "Crypto Portfolio Tracker",
    description: "A cryptocurrency portfolio screen with total balance, line chart, and a list of holdings with price changes.",
    image_url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    difficulty: "intermediate",
  },
];

async function loadDesignsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("critique_designs")
      .select("id, title, description, image_url, difficulty")
      .eq("active", true);
    if (error) {
      logger.warn({ err: error.message }, "Supabase designs fetch failed");
      return null;
    }
    if (!data || data.length === 0) return null;
    return data;
  } catch (err) {
    logger.warn({ err }, "Supabase designs fetch threw");
    return null;
  }
}

router.get("/critique/designs/random", async (_req, res) => {
  const fromDb = await loadDesignsFromSupabase();
  const pool = fromDb && fromDb.length > 0 ? fromDb : FALLBACK_DESIGNS;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  res.json(pick);
});

router.get("/critique/designs", async (_req, res) => {
  const fromDb = await loadDesignsFromSupabase();
  res.json(fromDb && fromDb.length > 0 ? fromDb : FALLBACK_DESIGNS);
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

router.post("/critique/chat", async (req, res) => {
  const { designTitle, designDescription, designImageUrl, messages } = req.body as {
    designTitle?: string;
    designDescription?: string;
    designImageUrl?: string;
    messages?: ChatMessage[];
  };

  if (!designTitle || !messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "designTitle and messages are required" });
    return;
  }

  const apiKey = process.env["NVIDIA_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "AI service not configured" });
    return;
  }

  const system = SYSTEM_PROMPT
    .replace("{{TITLE}}", designTitle)
    .replace("{{CONTEXT}}", designDescription ?? "");

  // The conversation must start with `user` and strictly alternate
  // user/assistant/user/... The frontend may include an opening assistant
  // message (the design prompt) — drop any leading assistant turns and
  // collapse consecutive same-role messages so the API never 400s.
  // (This was originally needed for Gemma; we keep the constraint in
  // place because it's also a common requirement for instruct models on
  // the NIM API and never hurts.)
  let cleaned: ChatMessage[] = [];
  for (const m of messages) {
    if (cleaned.length === 0 && m.role !== "user") continue;
    const last = cleaned[cleaned.length - 1];
    if (last && last.role === m.role) {
      last.content = `${last.content}\n\n${m.content}`;
    } else {
      cleaned.push({ role: m.role, content: m.content });
    }
  }

  if (cleaned.length === 0) {
    res.status(400).json({ error: "Conversation must include at least one user message." });
    return;
  }

  const trimmed = cleaned.slice(-12);
  // After slicing we may again start with assistant — re-trim from the front
  while (trimmed.length > 0 && trimmed[0].role !== "user") {
    trimmed.shift();
  }

  // Build the outgoing messages. If we have a design image AND the last turn
  // is a user turn, attach the image to ONLY that final user message as a
  // multimodal content block. We deliberately don't attach the image to every
  // historical user turn — Maverick charges ~1000 tokens per image, and the
  // model only needs the picture in scope for the CURRENT question. The
  // text-only history of earlier turns is plenty of context for continuity.
  const outgoing: Array<
    | { role: "system" | "assistant"; content: string }
    | {
        role: "user";
        content:
          | string
          | Array<
              | { type: "text"; text: string }
              | { type: "image_url"; image_url: { url: string } }
            >;
      }
  > = [{ role: "system", content: system }];

  for (let i = 0; i < trimmed.length; i++) {
    const m = trimmed[i];
    const isLast = i === trimmed.length - 1;
    if (isLast && m.role === "user" && designImageUrl) {
      outgoing.push({
        role: "user",
        content: [
          { type: "text", text: m.content },
          { type: "image_url", image_url: { url: designImageUrl } },
        ],
      });
    } else {
      outgoing.push({ role: m.role, content: m.content });
    }
  }

  try {
    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Llama 4 Maverick 17B/128E on NVIDIA NIM. Multimodal Llama 4 MoE
          // (17B activated of ~400B), natively trained on text + images, so
          // it can actually SEE the design we're critiquing — which is the
          // whole point of the Grafly mentor. Inherits the warm Llama
          // Instruct chat tone, fast inference thanks to MoE routing.
          // Model history on this project: started on `google/gemma-3-27b-it`
          // (NVIDIA marked DEGRADED) → `meta/llama-3.3-70b-instruct` →
          // `deepseek-ai/deepseek-v4-pro` (text-only, slower) → upgraded to
          // Maverick to give the mentor real vision.
          model: "meta/llama-4-maverick-17b-128e-instruct",
          messages: outgoing,
          temperature: 0.7,
          max_tokens: 350,
          top_p: 0.9,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      logger.error({ status: response.status, body: errText }, "NVIDIA API error");
      res.status(502).json({ error: "Could not reach the AI mentor right now." });
      return;
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const raw = (data.choices?.[0]?.message?.content ?? "").trim();
    // Belt-and-braces: strip markdown the model sometimes leaks through
    // (bold/italic asterisks, underscores, leading bullet/heading symbols).
    const reply = raw
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/(^|\W)\*(?!\s)([^*\n]+?)\*(?!\w)/g, "$1$2")
      .replace(/(^|\W)_(?!\s)([^_\n]+?)_(?!\w)/g, "$1$2")
      .replace(/^\s*[#>\-*]+\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    res.json({ reply });
  } catch (err) {
    logger.error({ err }, "Critique chat route error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Legacy single-shot endpoint kept for backward compatibility
router.post("/critique", async (req, res) => {
  const { prompt, userCritique } = req.body as {
    prompt?: string;
    userCritique?: string;
  };

  if (!prompt || !userCritique) {
    res.status(400).json({ error: "prompt and userCritique are required" });
    return;
  }

  const wordCount = userCritique.trim().split(/\s+/).length;
  if (wordCount < 20) {
    res.status(400).json({ error: "Please write at least 20 words so the AI can give meaningful feedback." });
    return;
  }

  const apiKey = process.env["NVIDIA_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "AI service not configured" });
    return;
  }

  res.status(410).json({ error: "This endpoint is deprecated. Use /api/critique/chat." });
});

export default router;
