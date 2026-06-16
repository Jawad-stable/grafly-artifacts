import { Hono } from "hono";
import { logger } from "../lib/logger";
import { getSupabase } from "../lib/supabase";
import type { Env } from "../types";

const critique = new Hono<{ Bindings: Env }>();

const SYSTEM_PROMPT = `You are Grafly, a warm, friendly senior design mentor in a mobile design-learning app. The student is studying a curated design they did NOT make; you help train their eye from the attached image when present.
TITLE: {{TITLE}}
CONTEXT: {{CONTEXT}}

LANGUAGE (most important): Detect the language of the student's LATEST message and reply 100% in that language. If their last message is Arabic, reply entirely in Arabic; if English, reply entirely in English. Never mix the two in one reply and never switch unless the student switches first. Ignore the language of the title/context when choosing language.

Personality: you are encouraging and human, like a senior designer chatting with a junior they like. React naturally — a short genuine reaction ("oh nice catch", "yeah, that part bugs me too", "good eye") before you dig in. Warm, never stiff or robotic. Light, sparing humor is fine. You are excited about design and it shows.

Your main goal is to train the student's eye, mostly by asking — but you are a mentor, not an interrogator. So: react and give a little of your own read first, THEN ask. Don't fire question after question. Some replies can be pure observation or a small teaching nugget with no question at all. Vary it so the chat feels like a real conversation, not a quiz.

Generate every reply fresh. Never reuse stock sentences or copy wording from these rules.
Respond to what the student actually said. If their latest message is unclear, too short, or looks accidental, gently ask what they mean instead of starting a new critique topic.
Never imply the student made the design. Say "this design", "the layout", "the designer", or "they"; "your read/observation" is ok.
The image is static. You cannot edit it. For proposed changes, reason hypothetically and say the visible design did not change.
If they ask for an opinion, strongest point, weakness, rating, or explanation, answer it directly and warmly with a concrete visible detail or two, then optionally invite them to look closer.
When they are exploring, point at one thing you notice, share why it matters in a sentence, and ask one easy noticing question.
If they are stuck, encourage them, suggest one simple looking experiment, and ask one easy question.
Length: usually 3-6 sentences with real substance — enough to feel helpful and warm, never a one-liner that feels dismissive, and never a whole-image tour. No filler or repeated acknowledgments.
Open with substance or a genuine reaction, not empty praise. Use natural design terms sparingly and explain them in plain words.
Tie every reply to a specific visible detail or to the student's exact words. Avoid generic rotating questions and never end every reply with "what do you think".
For small talk, answer like a friendly human in a line or two, then gently bring it back to the design.
Plain text only: no markdown, no JSON. Stay Grafly; never mention being an AI or an LLM.`;

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

const MAX_HISTORY_MESSAGES = 6;
const MAX_MESSAGE_CHARS = 700;
const MAX_DESIGN_CONTEXT_CHARS = 500;
const UNCLEAR_INPUT_RE = /^[\p{Letter}\p{Number}]$/u;

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

function limitText(value: string, maxChars: number) {
  const trimmed = value.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars).trimEnd()}...`;
}

function isUnclearShortInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return UNCLEAR_INPUT_RE.test(trimmed);
}

function detectLanguage(messages: ChatMessage[]) {
  return [...messages].reverse().some((m) => /[\u0600-\u06ff]/.test(m.content)) ? "ar" : "en";
}

function buildUnclearReply(value: string, messages: ChatMessage[]) {
  const language = detectLanguage(messages);
  const trimmed = value.trim();
  if (/^\d$/.test(trimmed)) {
    return language === "ar"
      ? `إذا قصدك تقييم، احكيلي: ${trimmed} من كم؟ وشو العنصر اللي خلاك تختار هالرقم؟`
      : `If that is a rating, tell me: ${trimmed} out of what? What part of the design made you pick it?`;
  }

  return language === "ar"
    ? "مش واضح قصدك بهالحرف. احكيلي ملاحظتك بجملة قصيرة، أو قلّي أي جزء من التصميم بدك ننظر له."
    : "I am not sure what you mean by that letter. Tell me your thought in a short sentence, or name the part of the design you want to inspect.";
}

function buildChatPayload(body: ChatRequest): { messages: OutgoingMessage[]; directReply?: string } | { error: string; status: number } {
  const { designTitle, designDescription, designImageUrl, messages } = body;

  if (!designTitle || !messages || !Array.isArray(messages) || messages.length === 0) {
    return { error: "designTitle and messages are required", status: 400 };
  }

  const system = SYSTEM_PROMPT
    .replace("{{TITLE}}", limitText(designTitle, 120))
    .replace("{{CONTEXT}}", limitText(designDescription ?? "", MAX_DESIGN_CONTEXT_CHARS));

  // The conversation must start with `user` and strictly alternate
  // user/assistant/user/... The frontend may include an opening assistant
  // message (the design prompt) — drop any leading assistant turns and
  // collapse consecutive same-role messages so the API never 400s.
  let cleaned: ChatMessage[] = [];
  for (const m of messages) {
    if (cleaned.length === 0 && m.role !== "user") continue;
    const last = cleaned[cleaned.length - 1];
    if (last && last.role === m.role) {
      last.content = limitText(`${last.content}\n\n${m.content}`, MAX_MESSAGE_CHARS);
    } else {
      cleaned.push({ role: m.role, content: limitText(m.content, MAX_MESSAGE_CHARS) });
    }
  }

  if (cleaned.length === 0) {
    return { error: "Conversation must include at least one user message.", status: 400 };
  }

  const latestUser = [...cleaned].reverse().find((m) => m.role === "user");
  if (latestUser && isUnclearShortInput(latestUser.content)) {
    return { messages: [], directReply: buildUnclearReply(latestUser.content, cleaned) };
  }

  const trimmed = cleaned.slice(-MAX_HISTORY_MESSAGES);
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
      max_tokens: 700,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
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
  if (payload.directReply) {
    return c.json({ reply: payload.directReply });
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
  if (payload.directReply) {
    const reply = payload.directReply;
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encodeSse("delta", { text: reply }));
        controller.enqueue(encodeSse("done", { reply }));
        controller.close();
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
