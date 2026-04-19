import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

const SYSTEM_PROMPT = `You are a supportive, expert design mentor and educator. 
Your role is to evaluate student design critiques and provide warm, constructive feedback.

A student will submit a written critique of a design prompt. Evaluate their critique on:
1. Depth of analysis — how well they examine the design's decisions
2. Design terminology — correct use of design vocabulary
3. Reasoning structure — logical flow and clear argumentation

You MUST respond with ONLY valid JSON (no markdown, no code blocks, no explanation outside the JSON).

The JSON must match exactly this structure:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "development_areas": ["area 1", "area 2"],
  "suggested_critique": "A model critique paragraph showing ideal depth and language.",
  "quality_tier": "good"
}

quality_tier must be one of: "needs_development", "good", or "excellent"
- needs_development: surface-level, < 3 design terms, weak reasoning
- good: solid analysis, 3-5 design terms, clear reasoning
- excellent: deep insight, 5+ precise design terms, sophisticated reasoning

Keep your tone warm, encouraging, and never condescending. 
Be specific — reference actual content from the student's critique.
Strengths should be 1 sentence each. Development areas should be actionable.
Suggested critique should be 3-4 sentences showing expert-level analysis.`;

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
  if (wordCount < 50) {
    res.status(400).json({ error: "Critique must be at least 50 words" });
    return;
  }

  const apiKey = process.env["NVIDIA_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "AI service not configured" });
    return;
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
          model: "meta/llama-3.3-70b-instruct",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Design Prompt: ${prompt}\n\nStudent's Critique:\n${userCritique}`,
            },
          ],
          temperature: 0.4,
          max_tokens: 1024,
          top_p: 0.9,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      logger.error({ status: response.status, body: errText }, "NVIDIA API error");
      res.status(502).json({ error: "AI service error" });
      return;
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const content = data.choices?.[0]?.message?.content ?? "";

    let feedback: object;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      feedback = JSON.parse(cleaned);
    } catch {
      logger.error({ content }, "Failed to parse AI response as JSON");
      feedback = {
        strengths: [
          "You engaged thoughtfully with the design prompt.",
          "Your observation shows genuine attention to the work.",
          "You demonstrated willingness to analyze critically.",
        ],
        development_areas: [
          "Try incorporating more specific design terminology (hierarchy, contrast, affordance).",
          "Deepen your analysis by explaining the why behind each observation.",
        ],
        suggested_critique:
          "An ideal critique would examine the compositional choices and their effect on visual hierarchy, use specific terminology like typographic contrast or affordance, and conclude with a synthesis of how these decisions serve or undermine the design's intent.",
        quality_tier: "needs_development",
      };
    }

    res.json(feedback);
  } catch (err) {
    logger.error({ err }, "Critique route error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
