import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

router.post("/tts", async (req, res) => {
  const { text } = req.body as { text?: string };

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const apiKey = process.env["ELEVENLABS_API_KEY"];
  const voiceId =
    process.env["EXPO_PUBLIC_ELEVENLABS_VOICE_ID"] ?? "MFZUKuGQUsGJPQjTS4wC";

  if (!apiKey) {
    res.status(500).json({ error: "Voice service not configured" });
    return;
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
      res.status(502).json({ error: "Voice service error" });
      return;
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    res.json({ audio: base64 });
  } catch (err) {
    logger.error({ err }, "TTS route error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
