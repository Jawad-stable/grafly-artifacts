const DOMAIN = process.env.EXPO_PUBLIC_DOMAIN ?? "";

export interface DesignBrief {
  id: string;
  title: string;
  description: string;
  image_url: string;
  difficulty: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function ensureDomain() {
  if (!DOMAIN) throw new Error("Domain not configured");
}

export async function fetchRandomDesign(): Promise<DesignBrief> {
  ensureDomain();
  const res = await fetch(`https://${DOMAIN}/api/critique/designs/random`);
  if (!res.ok) throw new Error("Could not load a design.");
  return (await res.json()) as DesignBrief;
}

export async function sendCritiqueMessage(args: {
  designTitle: string;
  designDescription: string;
  messages: ChatMessage[];
}): Promise<string> {
  ensureDomain();
  const res = await fetch(`https://${DOMAIN}/api/critique/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const parsed = JSON.parse(text);
      throw new Error(parsed.error ?? "Chat failed");
    } catch {
      throw new Error(text || "Chat failed");
    }
  }
  const data = (await res.json()) as { reply: string };
  return data.reply;
}
