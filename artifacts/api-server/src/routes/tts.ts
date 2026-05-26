import { Hono } from "hono";
import { logger } from "../lib/logger";
import type { Env } from "../types";

const tts = new Hono<{ Bindings: Env }>();

tts.post("/tts", async (c) => {
  const body = await c.req.json<{ text?: string }>().catch(() => ({} as { text?: string }));
  const { text } = body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return c.json({ error: "text is required" }, 400);
  }

  const apiKey = c.env.ELEVENLABS_API_KEY;
  const voiceId = c.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID ?? "MFZUKuGQUsGJPQjTS4wC";

  if (!apiKey) {
    return c.json({ error: "Voice service not configured" }, 500);
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text.slice(0, 500),
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      logger.error({ status: response.status }, "ElevenLabs API error");
      return c.json({ error: "Voice service error" }, 502);
    }

    const buffer = await response.arrayBuffer();
    // Convert to base64 in chunks to avoid stack overflow on large audio
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);
    return c.json({ audio: base64 });
  } catch (err) {
    logger.error({ err }, "TTS route error");
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default tts;
