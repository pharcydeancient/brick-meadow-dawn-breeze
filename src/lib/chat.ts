import { createServerFn } from "@tanstack/react-start";

type ChatInput = {
  modelId: string;
  persona: string;
  messages: { role: "user" | "assistant"; content: string }[];
};

export const askModel = createServerFn({ method: "POST" })
  .validator((input: ChatInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not available in this environment" };
    }

    const system = `You are ${data.persona}. You live inside Aether, a spatial multi-model room. Keep replies tight, concrete, and unadorned. No emoji. No marketing language. 1–3 short paragraphs unless asked for more.`;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 420,
        messages: [{ role: "system", content: system }, ...data.messages.slice(-8)],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `xAI API error ${res.status}` };
    }
    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
  });

export const imagineStill = createServerFn({ method: "POST" })
  .validator((input: { prompt: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not available in this environment" };
    }
    const res = await fetch("https://api.x.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image",
        prompt: data.prompt,
        n: 1,
        resolution: "1k",
        response_format: "url",
      }),
    });
    if (!res.ok) {
      return { ok: false as const, error: `xAI Imagine error ${res.status}` };
    }
    const body = (await res.json()) as { data: { url: string }[] };
    return { ok: true as const, url: body.data[0]?.url ?? "" };
  });
