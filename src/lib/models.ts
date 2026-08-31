import type { AiModel, ModelCategory, ModelKind, Tier } from "./types";
import {
  CATEGORIES as ROSTER_CATEGORIES,
  MODELS as ROSTER,
  TIER_INFO,
  TIER_RANK,
  type Category,
  type ModelDef,
} from "./roster";

export { TIER_INFO, TIER_RANK };

const KIND: Record<Category, ModelKind> = {
  general: "text",
  image: "image",
  audio: "audio",
  video: "video",
  coding: "code",
};

const CATEGORY_MIN: Partial<Record<Category, Tier>> = {
  image: "pro",
  video: "pro",
  audio: "pro",
  coding: "pro",
};

function minTier(model: ModelDef): Tier {
  const catMin = model.category.reduce<Tier>((min, c) => {
    const m = CATEGORY_MIN[c];
    return m && TIER_RANK[m] > TIER_RANK[min] ? m : min;
  }, "free");
  return TIER_RANK[catMin] > TIER_RANK[model.tier] ? catMin : model.tier;
}

export function toAi(model: ModelDef): AiModel {
  const category = model.category[0];
  return {
    id: model.id,
    name: model.label,
    short: CHIP[model.id] ?? model.label.split(/[\s·]+/)[0],
    category,
    kind: KIND[category],
    minTier: minTier(model),
    accent: model.color,
    blurb: model.desc,
  };
}

const CHIP: Record<string, string> = {
  "free/gemini-3-6-flash-lite": "Lite",
  "free/mistral-small": "Small",
  "free/command-r": "Command",
  "free/minimax-m3": "MiniMax",
  "free/ling-2-6-flash": "Ling",
  "free/mistral-nemo": "Nemo",
  "free/gemma-4-31b": "Gemma",
  "free/qwen-3-6-27b": "Qwen",
  "free/gpt-5-nano": "Nano",
  "free/laguna-s-2-1": "Laguna",
  "pro/gemini-3-6-flash": "Flash",
  "pro/mercury-2": "Mercury",
  "pro/mimo-v2-5-pro": "MiMo",
  "pro/glm-5-2": "GLM",
  "pro/gpt-5-6-luna": "Luna",
  "pro/qwen-3-6-plus": "Plus",
  "pro/grok-latest": "Grok",
  "pro/grok-4-5": "Grok 4.5",
  "pro/sonar-reasoning-pro": "Sonar",
  "pro/mistral-large": "Large",
  "pro/laguna-s-2-1": "Laguna",
  "pro/kat-coder-air": "Air",
  "pro/codestral-2508": "Codestral",
  "pro/qwen-3-coder-plus": "Coder",
  "pro/gpt-5-3-codex": "Codex",
  "pro/glm-5v-turbo": "Turbo",
  "elite/kat-coder-pro": "KAT",
  "elite/kimi-k2-7-code": "Kimi",
  "elite/kimi-k3": "Kimi 3",
  "elite/qwen-3-7-max": "Max",
  "img/flux-free": "FLUX",
  "img/gemini-3-1-flash-image": "Gemini",
  "img/gpt-5-image-mini": "Mini",
  "img/flux-2-klein": "Klein",
  "img/nano-banana-2": "Banana",
  "img/kling-3-image": "Kling",
  "img/gpt-image-2": "GPT Img",
  "img/seedream-5-0": "Seedream",
  "img/qwen-image-2-0": "Qwen Img",
  "img/dall-e-3": "DALL·E",
  "img/mj-upscale": "Midjourney",
  "img/nano-banana-pro": "Banana+",
  "img/gemini-3-pro-image": "Gemini+",
  "img/flux-2-max": "FLUX Max",
  "img/gpt-5-4-image-2": "GPT 5.4",
  "img/seedream-4-5": "Seed 4.5",
  "vid/veo-3-1-lite": "Veo Lite",
  "vid/wan-2-6": "Wan",
  "vid/grok-imagine-video": "Imagine",
  "vid/kling-3-standard": "Kling",
  "vid/wan-2-2-flash": "Wan Flash",
  "vid/wan-2-2-plus": "Wan Plus",
  "vid/kling-2-5-turbo": "Kling 2.5",
  "vid/hailuo-2-3": "Hailuo",
  "vid/veo-3-1-fast": "Veo Fast",
  "vid/veo-3": "Veo",
  "vid/sora-2": "Sora",
  "vid/wan-2-5-preview": "Wan 2.5",
  "vid/kling-3-turbo": "Kling 3",
  "aud/lyria-3-clip": "Lyria",
  "aud/kokoro-82m": "Kokoro",
  "aud/gpt-audio-mini": "Audio",
  "aud/sesame-csm-1b": "Sesame",
  "aud/lyria-3-pro": "Lyria+",
  "aud/gemini-3-1-flash-tts": "Gemini TTS",
  "aud/voxtral-mini-tts": "Voxtral",
  "aud/gpt-audio": "GPT Audio",
};

export const MODELS: AiModel[] = ROSTER.map(toAi);

export const CATEGORIES: { id: ModelCategory; label: string }[] = ROSTER_CATEGORIES.map((c) => ({
  id: c.id,
  label: c.label,
}));

export const DEFAULT_ENABLED = MODELS.filter((m) => m.category === "general" && m.minTier === "free")
  .slice(0, 6)
  .map((m) => m.id);

export function canUse(model: AiModel, tier: Tier) {
  return TIER_RANK[tier] >= TIER_RANK[model.minTier];
}

export function groupByTier(models: AiModel[]) {
  const free: AiModel[] = [];
  const pro: AiModel[] = [];
  const elite: AiModel[] = [];
  for (const m of models) {
    if (m.minTier === "free") free.push(m);
    else if (m.minTier === "pro") pro.push(m);
    else elite.push(m);
  }
  return { free, pro, elite };
}
