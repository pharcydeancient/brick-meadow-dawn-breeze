import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Investigation } from "./types";

type ChatInput = {
  modelId: string;
  persona: string;
  messages: { role: "user" | "assistant"; content: string }[];
  investigation?: Investigation;
};

const INVESTIGATION_SYS: Record<Exclude<Investigation, "off">, string> = {
  web: "You are performing a web search pass. Prefer current, checkable facts. Name the publication and year. If you cannot verify it is current, say so in one line.",
  research: "You are writing a research brief. Structure: finding, then evidence, then caveats. Name sources. Keep it readable in one sitting.",
  deep: "You are writing a deep research note. Cover competing views, a short bibliography, and a one-paragraph conclusion.",
};

export const askModel = createServerFn({ method: "POST" })
  .validator((input: ChatInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not available in this environment" };
    }

    const mode = data.investigation && data.investigation !== "off" ? INVESTIGATION_SYS[data.investigation] : "";
    const system = `You are ${data.persona}. You live inside Aether, a spatial multi-model canvas. Keep replies tight, concrete, and unadorned. No emoji. No marketing language. 1–3 short paragraphs unless asked for more.${mode ? ` ${mode}` : ""}`;

    if (data.investigation && data.investigation !== "off") {
      const searched = await askWithSearch(apiKey, system, data.messages, data.investigation);
      if (searched) return searched;
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: data.investigation === "deep" ? 900 : data.investigation === "research" ? 640 : 420,
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

async function askWithSearch(
  apiKey: string,
  system: string,
  messages: { role: "user" | "assistant"; content: string }[],
  investigation: Exclude<Investigation, "off">,
) {
  const tools =
    investigation === "deep"
      ? [{ type: "web_search" }, { type: "x_search" }]
      : [{ type: "web_search" }];
  const res = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      input: [{ role: "system", content: system }, ...messages.slice(-8)],
      tools,
    }),
  });
  if (!res.ok && investigation === "deep") {
    return askWithSearch(apiKey, system, messages, "web");
  }
  if (!res.ok) return null;
  const body = (await res.json()) as {
    output_text?: string;
    output?: { type?: string; content?: { type?: string; text?: string }[] }[];
  };
  const chunks: string[] = [];
  if (body.output_text) chunks.push(body.output_text);
  for (const item of body.output ?? []) {
    if (item.type !== "message") continue;
    for (const c of item.content ?? []) {
      if ((c.type === "output_text" || c.type === "text") && c.text) chunks.push(c.text);
    }
  }
  const text = [...new Set(chunks)]
    .join("\n")
    .trim()
    .replace(/\[\[(\d+)\]\]\((https?:\/\/[^)]+)\)/g, (_m, _n, url: string) => {
      try {
        return ` (${new URL(url).hostname.replace(/^www\./, "")})`;
      } catch {
        return "";
      }
    });
  if (!text) return null;
  return { ok: true as const, text };
}

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
        model: "grok-imagine-image-2.0",
        prompt: data.prompt,
        n: 1,
        response_format: "url",
      }),
    });
    if (!res.ok) {
      return { ok: false as const, error: `xAI Imagine error ${res.status}` };
    }
    const body = (await res.json()) as { data: { url: string }[] };
    return { ok: true as const, url: body.data[0]?.url ?? "" };
  });

export const imagineEdit = createServerFn({ method: "POST" })
  .validator((input: { prompt: string; src: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not available in this environment" };
    }

    let image: { url: string; type: "image_url" };
    if (/^https?:\/\//.test(data.src) || data.src.startsWith("data:")) {
      image = { url: data.src, type: "image_url" };
    } else {
      try {
        const file = join(process.cwd(), "public", data.src.replace(/^\//, ""));
        const buf = await readFile(file);
        const mime = data.src.endsWith(".png") ? "image/png" : "image/jpeg";
        image = { url: `data:${mime};base64,${buf.toString("base64")}`, type: "image_url" };
      } catch {
        return imagineStill({ data: { prompt: data.prompt } });
      }
    }

    const res = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt: data.prompt,
        image,
      }),
    });
    if (!res.ok) {
      return imagineStill({ data: { prompt: data.prompt } });
    }
    const body = (await res.json()) as { data: { url: string }[] };
    return { ok: true as const, url: body.data[0]?.url ?? "" };
  });
