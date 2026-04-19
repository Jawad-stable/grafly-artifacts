const DOMAIN = process.env.EXPO_PUBLIC_DOMAIN ?? "";

export interface CritiqueFeedback {
  strengths: string[];
  development_areas: string[];
  suggested_critique: string;
  quality_tier: "needs_development" | "good" | "excellent";
}

export async function submitCritique(
  prompt: string,
  userCritique: string
): Promise<CritiqueFeedback> {
  if (!DOMAIN) {
    throw new Error("Domain not configured");
  }

  const res = await fetch(`https://${DOMAIN}/api/critique`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, userCritique }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Critique failed");
  }

  return (await res.json()) as CritiqueFeedback;
}
