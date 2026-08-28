import type { AiModel, Tier } from "./types";

export const TIER_RANK: Record<Tier, number> = { free: 0, pro: 1, elite: 2 };

export const MODELS: AiModel[] = [
  {
    id: "grok",
    name: "Grok",
    short: "GRK",
    category: "general",
    kind: "text",
    minTier: "free",
    accent: "#0A84FF",
    blurb: "Direct, fast, current.",
  },
  {
    id: "pulse",
    name: "Pulse",
    short: "PLS",
    category: "general",
    kind: "text",
    minTier: "free",
    accent: "#64D2FF",
    blurb: "Warm, concise companion.",
  },
  {
    id: "claude",
    name: "Claude",
    short: "CLD",
    category: "general",
    kind: "text",
    minTier: "pro",
    accent: "#D4A574",
    blurb: "Careful long-form thought.",
  },
  {
    id: "atlas",
    name: "Atlas",
    short: "ATL",
    category: "general",
    kind: "text",
    minTier: "pro",
    accent: "#30D158",
    blurb: "Structured, citation-minded.",
  },
  {
    id: "flux",
    name: "Flux",
    short: "FLX",
    category: "image",
    kind: "image",
    minTier: "pro",
    accent: "#BF5AF2",
    blurb: "Still image, photographic.",
  },
  {
    id: "lumen",
    name: "Lumen",
    short: "LMN",
    category: "image",
    kind: "image",
    minTier: "elite",
    accent: "#FF9F0A",
    blurb: "Editorial, high fidelity.",
  },
  {
    id: "echo",
    name: "Echo",
    short: "ECO",
    category: "audio",
    kind: "audio",
    minTier: "pro",
    accent: "#64D2FF",
    blurb: "Voice, score, ambience.",
  },
  {
    id: "aria",
    name: "Aria",
    short: "ARI",
    category: "audio",
    kind: "audio",
    minTier: "elite",
    accent: "#FF453A",
    blurb: "Studio-grade performance.",
  },
  {
    id: "reel",
    name: "Reel",
    short: "REL",
    category: "video",
    kind: "video",
    minTier: "pro",
    accent: "#FF9F0A",
    blurb: "Short motion clips.",
  },
  {
    id: "sora",
    name: "Sora",
    short: "SRA",
    category: "video",
    kind: "video",
    minTier: "elite",
    accent: "#0A84FF",
    blurb: "Cinematic sequences.",
  },
  {
    id: "forge",
    name: "Forge",
    short: "FRG",
    category: "coding",
    kind: "code",
    minTier: "pro",
    accent: "#30D158",
    blurb: "Code, diffs, reviews.",
  },
  {
    id: "devin",
    name: "Devin",
    short: "DVN",
    category: "coding",
    kind: "code",
    minTier: "elite",
    accent: "#BF5AF2",
    blurb: "Agentic engineering.",
  },
];

export const CATEGORIES: { id: AiModel["category"]; label: string }[] = [
  { id: "general", label: "General" },
  { id: "image", label: "Image" },
  { id: "audio", label: "Audio" },
  { id: "video", label: "Video" },
  { id: "coding", label: "Coding" },
];

export function tierForCategory(category: AiModel["category"]): {
  unlocked: Tier[];
  locked: Tier[];
} {
  if (category === "general") return { unlocked: ["free", "pro"], locked: ["elite"] };
  return { unlocked: ["pro", "elite"], locked: ["free"] };
}

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
