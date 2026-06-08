import { Hono } from "hono";
import { logger } from "../lib/logger";
import { getSupabase } from "../lib/supabase";
import type { Env } from "../types";

const critique = new Hono<{ Bindings: Env }>();

const SYSTEM_PROMPT = `You are Grafly — a warm, patient design mentor in a mobile design-education app. You talk like a friend who's a senior designer: curious, grounded, never preachy. The student is studying a design from a curated library that THEY DID NOT MAKE; they're here to train their own eye. The image is attached so you can see it.
TITLE: {{TITLE}}
CONTEXT: {{CONTEXT}}

CRITICAL: Generate every reply fresh for THIS image and THIS message. Never reuse a stock sentence. The rules below tell you what to DO — never copy their wording back.

LANGUAGE: Reply in the exact language of the student's latest message (Arabic, Spanish, French, etc.). TITLE/CONTEXT are English for system reasons — ignore them when choosing language; only the student's words decide it. If they switch languages, switch on your next reply. Use the design terms native speakers actually use.

ATTRIBUTION: The student did NOT make this design. Never say "your design / your layout / you chose / you picked." Call it "this design / the layout / the designer / they." Their own observations and instincts ARE theirs — "your read / what you noticed" is fine.

STATIC IMAGE: You cannot edit it and it never changes. Never claim a change happened ("now it's bigger / the updated version"). When the student proposes a change, explore it hypothetically in future/conditional tense and make clear nothing actually moved. If they say "go ahead," say you can't push pixels from here, then reason through the imagined version. Stay honest that the visible design is unchanged.

YOUR JOB — build their eye, don't deliver verdicts:
- Lead with ONE question that makes them notice something, then stop and let them answer.
- Build on their observations Socratically ("what makes you say that?"). Give a direct insight only when they ask, or when they're close but missed an angle — and frame it as a way of looking, not a final verdict.
- More question than answer. Pick ONE thing worth looking at; never describe the whole design.
- If they're STUCK ("I don't know"), don't stack open questions — hand them ONE concrete experiment (cover or isolate an element) plus one question with an obvious, answerable shape.
- When asked for your honest read, name real weaknesses kindly and truthfully. Don't flatter, don't invent flaws.

LENGTH: Default ~3–5 sentences plus one follow-up question (~6–8 short phone lines) — enough to teach something real, never padded. Use more structure (a few bullets or two mini-sections) only when there are 2+ genuinely parallel points. Go longer only if they ask to go deep. No filler. Never so short it feels dismissive.

VOICE:
- Open with substance — a sharp observation or a real question. Never open with empty fillers ("Hey", "Hi", "Great question", "Great observation", "Your design is…").
- Warmth lives in HOW you say things, not in a sticker up front. Use plain, everyday language and contractions. Don't lecture. Don't mirror their words back to seem nice.
- Slip in design vocabulary naturally (hierarchy, contrast, balance, rhythm, white space, type pairing, alignment) — one or two terms max, explained plainly the first time.
- Ask ONE short question at a time. It's fine to end without a question if you just answered a direct one.

OFF-TOPIC / SMALL TALK: If they mention being tired, a rough day, coffee, etc., react like a real friend — one short, genuinely human line, then a smaller-than-usual nudge back to the design. Avoid cold/corporate replies ("got it", "noted", "understood") AND saccharine wellness-bot lines ("I'm sorry to hear that", "sending good vibes", "you've got this"). Stay warm but stay a design mentor.

EARNED ACKNOWLEDGMENT: Only when the student genuinely catches a real tension, names a tradeoff, or answers with insight, you MAY open with ONE short (1–4 word) recognition in their language that POINTS at what was sharp. Skip it for greetings, openers, generic comments, "I don't know", off-topic chat, change-suggestions, and wrong guesses. Never use the same acknowledgment phrase twice in a row. Roughly 1 in 3 replies, not every turn.

FORMAT: Plain text only — no markdown (no *, _, #, >, no "- " / "* " bullets, no code fences, no JSON). Paragraph break = one blank line (\\n\\n). For lists use Unicode "• " bullets, one per line, 3–5 max, only for 2+ parallel points. You may use at most two emoji section labels when content truly splits: 👀 notice, ✨ working, 💡 push further, 📐 principle, ✍️ try this. Use 1–3 fitting emojis per reply, never more, matched to their content.

HARD RULES: Always stay in character as Grafly. Never break the fourth wall or say "as an AI / language model." If asked what model you are, don't name any LLM — say "I'm Grafly, your design mentor here" and steer back to the design. If asked for something off-scope (write code, unrelated homework, roleplay), warmly redirect to looking at the design.`;

const BASE = "https://graflyapisec.khmaystjwad.workers.dev/api/critique/design-images";

const FALLBACK_DESIGNS = [
  { id: "instagram-004",  image_url: `${BASE}/instagram-004.jpg` },
  { id: "instagram-006",  image_url: `${BASE}/instagram-006.jpg` },
  { id: "instagram-011",  image_url: `${BASE}/instagram-011.webp` },
  { id: "instagram-046",  image_url: `${BASE}/instagram-046.webp` },
  { id: "instagram-049",  image_url: `${BASE}/instagram-049.jpg` },
  { id: "instagram-050",  image_url: `${BASE}/instagram-050.jpg` },
  { id: "instagram-054",  image_url: `${BASE}/instagram-054.jpg` },
  { id: "instagram-056",  image_url: `${BASE}/instagram-056.jpg` },
  { id: "instagram-057",  image_url: `${BASE}/instagram-057.jpg` },
  { id: "instagram-058",  image_url: `${BASE}/instagram-058.jpg` },
  { id: "instagram-063",  image_url: `${BASE}/instagram-063.jpg` },
  { id: "instagram-083",  image_url: `${BASE}/instagram-083.jpg` },
  { id: "instagram-087",  image_url: `${BASE}/instagram-087.webp` },
  { id: "instagram-103",  image_url: `${BASE}/instagram-103.jpg` },
  { id: "instagram-109",  image_url: `${BASE}/instagram-109.jpg` },
  { id: "instagram-112",  image_url: `${BASE}/instagram-112.jpg` },
  { id: "instagram-117",  image_url: `${BASE}/instagram-117.jpg` },
  { id: "instagram-118",  image_url: `${BASE}/instagram-118.jpg` },
  { id: "instagram-123",  image_url: `${BASE}/instagram-123.jpg` },
  { id: "instagram-126",  image_url: `${BASE}/instagram-126.jpg` },
  { id: "instagram-127",  image_url: `${BASE}/instagram-127.jpg` },
  { id: "instagram-133",  image_url: `${BASE}/instagram-133.jpg` },
  { id: "instagram-139",  image_url: `${BASE}/instagram-139.webp` },
  { id: "instagram-147",  image_url: `${BASE}/instagram-147.jpg` },
  { id: "instagram-148",  image_url: `${BASE}/instagram-148.jpg` },
  { id: "instagram-160",  image_url: `${BASE}/instagram-160.jpg` },
  { id: "instagram-164",  image_url: `${BASE}/instagram-164.jpg` },
  { id: "instagram-174",  image_url: `${BASE}/instagram-174.jpg` },
  { id: "instagram-192",  image_url: `${BASE}/instagram-192.jpg` },
  { id: "instagram-194",  image_url: `${BASE}/instagram-194.jpg` },
  { id: "instagram-196",  image_url: `${BASE}/instagram-196.jpg` },
  { id: "instagram-197",  image_url: `${BASE}/instagram-197.jpg` },
  { id: "instagram-198",  image_url: `${BASE}/instagram-198.jpg` },
  { id: "instagram-200",  image_url: `${BASE}/instagram-200.jpg` },
  { id: "instagram-204",  image_url: `${BASE}/instagram-204.jpg` },
  { id: "instagram-218",  image_url: `${BASE}/instagram-218.jpg` },
  { id: "instagram-227",  image_url: `${BASE}/instagram-227.jpg` },
  { id: "instagram-240",  image_url: `${BASE}/instagram-240.jpg` },
  { id: "instagram-251",  image_url: `${BASE}/instagram-251.jpg` },
  { id: "instagram-253",  image_url: `${BASE}/instagram-253.webp` },
  { id: "instagram-306",  image_url: `${BASE}/instagram-306.jpg` },
  { id: "instagram-307",  image_url: `${BASE}/instagram-307.jpg` },
  { id: "instagram-326",  image_url: `${BASE}/instagram-326.jpg` },
  { id: "instagram-332",  image_url: `${BASE}/instagram-332.jpg` },
  { id: "instagram-354",  image_url: `${BASE}/instagram-354.webp` },
  { id: "instagram-374",  image_url: `${BASE}/instagram-374.jpg` },
  { id: "instagram-416",  image_url: `${BASE}/instagram-416.jpg` },
  { id: "instagram-512",  image_url: `${BASE}/instagram-512.jpg` },
  { id: "social_coffee",  image_url: `${BASE}/social_coffee.png` },
  { id: "social_quote",   image_url: `${BASE}/social_quote.png` },
  { id: "social_sneaker", image_url: `${BASE}/social_sneaker.png` },
  { id: "social_travel",  image_url: `${BASE}/social_travel.png` },
];

async function loadDesignsFromSupabase(env: Env) {
  const supabase = getSupabase(env);
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("critique_designs")
      .select("id, title, image_url, difficulty, description")
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

critique.get("/critique/designs/random", async (c) => {
  const pool = (await loadDesignsFromSupabase(c.env)) ?? FALLBACK_DESIGNS;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return c.json(pick);
});

critique.get("/critique/designs", async (c) => {
  return c.json((await loadDesignsFromSupabase(c.env)) ?? FALLBACK_DESIGNS);
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type ChatRequest = {
  designTitle?: string;
  designDescription?: string;
  designImageUrl?: string;
  messages?: ChatMessage[];
};

type OutgoingMessage =
  | { role: "system" | "assistant"; content: string }
  | {
      role: "user";
      content:
        | string
        | Array<
            | { type: "text"; text: string }
            | { type: "image_url"; image_url: { url: string } }
          >;
    };

function sanitizeReply(raw: string) {
  return raw
    .trim()
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(^|\W)\*(?!\s)([^*\n]+?)\*(?!\w)/g, "$1$2")
    .replace(/(^|\W)_(?!\s)([^_\n]+?)_(?!\w)/g, "$1$2")
    .replace(/^\s*[#>\-*]+\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildChatPayload(body: ChatRequest): { messages: OutgoingMessage[] } | { error: string; status: number } {
  const { designTitle, designDescription, designImageUrl, messages } = body;

  if (!designTitle || !messages || !Array.isArray(messages) || messages.length === 0) {
    return { error: "designTitle and messages are required", status: 400 };
  }

  const system = SYSTEM_PROMPT
    .replace("{{TITLE}}", designTitle)
    .replace("{{CONTEXT}}", designDescription ?? "");

  // The conversation must start with `user` and strictly alternate
  // user/assistant/user/... The frontend may include an opening assistant
  // message (the design prompt) — drop any leading assistant turns and
  // collapse consecutive same-role messages so the API never 400s.
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
    return { error: "Conversation must include at least one user message.", status: 400 };
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
  const outgoing: OutgoingMessage[] = [{ role: "system", content: system }];

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

  return { messages: outgoing };
}

function buildGroqRequest(apiKey: string, messages: OutgoingMessage[], stream: boolean) {
  return {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages,
      temperature: 0.8,
      max_tokens: 500,
      top_p: 0.9,
      frequency_penalty: 0.5,
      presence_penalty: 0.4,
      stream,
    }),
  };
}

function encodeSse(event: string, data: unknown) {
  return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function extractDelta(line: string) {
  const payload = line.replace(/^data:\s*/, "").trim();
  if (!payload || payload === "[DONE]") return null;
  try {
    const parsed = JSON.parse(payload) as {
      choices?: Array<{ delta?: { content?: string }; text?: string }>;
    };
    return parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.text ?? "";
  } catch {
    return "";
  }
}

critique.post("/critique/chat", async (c) => {
  const body = await c.req.json<ChatRequest>().catch(() => ({} as ChatRequest));
  const payload = buildChatPayload(body);
  if ("error" in payload) {
    return c.json({ error: payload.error }, payload.status as 400);
  }

  const apiKey = c.env.GROQ_API_KEY;
  if (!apiKey) {
    return c.json({ error: "AI service not configured" }, 500);
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      buildGroqRequest(apiKey, payload.messages, false)
    );

    if (!response.ok) {
      const errText = await response.text();
      logger.error({ status: response.status, body: errText }, "Groq API error");
      return c.json({ error: "Could not reach the AI mentor right now." }, 502);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const reply = sanitizeReply(data.choices?.[0]?.message?.content ?? "");
    return c.json({ reply });
  } catch (err) {
    logger.error({ err }, "Critique chat route error");
    return c.json({ error: "Internal server error" }, 500);
  }
});

critique.post("/critique/chat/stream", async (c) => {
  const body = await c.req.json<ChatRequest>().catch(() => ({} as ChatRequest));
  const payload = buildChatPayload(body);
  if ("error" in payload) {
    return c.json({ error: payload.error }, payload.status as 400);
  }

  const apiKey = c.env.GROQ_API_KEY;
  if (!apiKey) {
    return c.json({ error: "AI service not configured" }, 500);
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      buildGroqRequest(apiKey, payload.messages, true)
    );

    if (!response.ok || !response.body) {
      const errText = await response.text();
      logger.error({ status: response.status, body: errText }, "Groq streaming API error");
      return c.json({ error: "Could not reach the AI mentor right now." }, 502);
    }

    const upstream = response.body.getReader();
    const decoder = new TextDecoder();
    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        let fullReply = "";
        try {
          while (true) {
            const { done, value } = await upstream.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const delta = extractDelta(line);
              if (!delta) continue;
              fullReply += delta;
              controller.enqueue(encodeSse("delta", { text: delta }));
            }
          }

          const tail = decoder.decode();
          if (tail) {
            buffer += tail;
          }
          for (const line of buffer.split(/\r?\n/)) {
            if (!line.startsWith("data:")) continue;
            const delta = extractDelta(line);
            if (!delta) continue;
            fullReply += delta;
            controller.enqueue(encodeSse("delta", { text: delta }));
          }

          controller.enqueue(encodeSse("done", { reply: sanitizeReply(fullReply) }));
        } catch (err) {
          logger.error({ err }, "Critique chat stream error");
          controller.enqueue(encodeSse("error", { error: "Internal server error" }));
        } finally {
          upstream.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    logger.error({ err }, "Critique chat stream route error");
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Legacy single-shot endpoint kept for backward compatibility
critique.post("/critique", async (_c) => {
  return _c.json({ error: "This endpoint is deprecated. Use /api/critique/chat." }, 410);
});

export default critique;
