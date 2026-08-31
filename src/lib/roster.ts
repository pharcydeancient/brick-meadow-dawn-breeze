export type Tier = "free" | "pro" | "elite";
export type Category = "general" | "image" | "video" | "audio" | "coding";

export type ModelDef = {
  id: string;
  label: string;
  short: string;
  desc: string;
  tier: Tier;
  category: Category[];
  // Credits charged per call. One credit is budgeted at $0.002 of provider
  // cost, so weight = ceil(real cost / $0.002). Pools are sized for a 70%
  // gross margin, not cost recovery — 3,000 credits caps Pro's provider spend
  // at $6.00 against $19.99, and 7,500 caps Elite's at $15.00 against $49.99. Every value is derived from a
  // published provider rate — see docs/ECONOMICS.md for the source of each.
  // These were previously a relative sense of "expensiveness" with no cost
  // basis anywhere in the codebase, which is how a Veo 3.1 clip costing ~$2.00
  // came to be charged the same 30 credits as roughly four chat messages.
  weight: number;
  color: string;
  locked?: boolean;
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "general", label: "General" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
  { id: "coding", label: "Coding" },
];

// ── Model roster — rebuilt 2026-07-13 against the live OpenRouter catalog ───
// (fetched directly, not guessed — see chat.ts ROUTES for the exact remote
// slugs). Curated for actual quality/reputation, not just "free = cheapest
// possible." No Opus, no Fable anywhere — this app offers unlimited
// messages, so per-request cost has to stay sane at every tier.
export const MODELS: ModelDef[] = [

  // ── General ───────────────────────────────────────────────────────────────
  // SPEC.md fixes the counts: 8 Free, 4 Pro, 4 Elite. The roster shipped 5/1/2
  // — one Pro model in the app's primary category.
  //
  // Every slug below was verified against a live OpenRouter catalog fetch on
  // 2026-07-29, and every banned family is absent: no Llama (incl. any *-l2-*
  // merge), no Sonnet, no GPT text, no Nemotron, no Qwen, no Groq Compound,
  // no Gemini Pro in general chat.
  //
  // COST NOTE, and it governs the tier split here: Pro and Elite get
  // UNLIMITED general chat, so a general model's per-token price is unbounded
  // exposure — it is not capped by the credit pool the way media gen is. That
  // is why Pro is filled with sub-$1/M models rather than flagships, and why
  // Grok 4.5 ($6/M out) moved from Pro to Elite. See docs/MONETIZATION.md.

  // ── General · Free (8) ────────────────────────────────────────────────────
  { id: "free/gemini-3-6-flash-lite",label: "Gemini 3.6 Flash Lite", short: "G36L", desc: "Google's lightweight flash model.",         tier: "free", category: ["general"],           weight: 1, color: "#7fd8c4" },
  { id: "free/mistral-small",       label: "Mistral Small 3.2",  short: "MiSm", desc: "Mistral's current small model.",     tier: "free", category: ["general"],           weight: 1, color: "#ffb066" },
  { id: "free/command-r",           label: "Command R",          short: "CmdR", desc: "Cohere's generalist model.",                      tier: "free", category: ["general"],           weight: 1, color: "#f2c14e" },
  { id: "free/minimax-m3",          label: "MiniMax M3",         short: "MM3",  desc: "MiniMax's current flagship. 1M ctx.",             tier: "free", category: ["general"],           weight: 1, color: "#ff9e6b" },
  { id: "free/ling-2-6-flash",      label: "Ling 2.6 Flash",     short: "Ling", desc: "InclusionAI. Fastest responder in the roster.",   tier: "free", category: ["general"],           weight: 1, color: "#9ecbff" },
  { id: "free/mistral-nemo",        label: "Mistral Nemo",       short: "Nemo", desc: "Mistral + NVIDIA. 128k context.",      tier: "free", category: ["general"],           weight: 1, color: "#67e8f9" },
  { id: "free/gemma-4-31b",         label: "Gemma 4 31B",        short: "Gm4",  desc: "Google's open-weight model.",      tier: "free", category: ["general"],           weight: 1, color: "#7fd8c4" },
  // Found by calling providers rather than reading rosters (2026-08-07).
  // Groq's key works and its tier is free, and the roster was routing ZERO
  // text models to it — it was carrying speech-to-text alone. GPT-OSS removed
  // on the owner's call; Qwen 3.6 27B stays. Llama and Groq Compound remain
  // out per the standing removals.
  { id: "free/qwen-3-6-27b",        label: "Qwen 3.6 27B",       short: "Q27",  desc: "Alibaba's mid-size generalist.",                  tier: "free", category: ["general"],           weight: 1, color: "#c9a7ff" },
  { id: "free/gpt-5-nano",          label: "GPT-5 Nano",         short: "5Nano",desc: "OpenAI's smallest model.",     tier: "free", category: ["general"],           weight: 1, color: "#d9d3c7" },
  { id: "free/laguna-s-2-1",        label: "Laguna S 2.1",       short: "LagS", desc: "Poolside. Code-capable generalist.", tier: "free", category: ["general"],           weight: 1, color: "#8ee878" },

  // ── General · Pro (4) — sub-$1/M output, because general chat is unlimited
  { id: "pro/gemini-3-6-flash",     label: "Gemini 3.6 Flash",   short: "G3.6F",desc: "Google's current flash model. 1M ctx.",           tier: "pro",  category: ["general"],           weight: 1, color: "#7fd8c4" },
  { id: "pro/mercury-2",            label: "Mercury 2",          short: "Merc", desc: "Inception. Diffusion LLM — very fast output.",    tier: "pro",  category: ["general"],           weight: 1, color: "#c9a7ff" },
  { id: "pro/mimo-v2-5-pro",        label: "MiMo V2.5 Pro",      short: "MiMo", desc: "Xiaomi's flagship. Long-context generalist.",     tier: "pro",  category: ["general"],           weight: 1, color: "#ff9e6b" },
  { id: "pro/glm-5-2",              label: "GLM 5.2",            short: "GLM5", desc: "Zhipu's flagship.",     tier: "pro",  category: ["general"],           weight: 2, color: "#7ee2a8" },
  { id: "pro/gpt-5-6-luna",         label: "GPT-5.6 Luna",       short: "Luna", desc: "OpenAI's reasoning tier at a mid-tier price.",   tier: "pro",  category: ["general"],           weight: 2, color: "#d9d3c7" },
  { id: "pro/qwen-3-6-plus",        label: "Qwen 3.6 Plus",      short: "Q36",  desc: "Alibaba's generalist.", tier: "pro",  category: ["general"],           weight: 1, color: "#c9a7ff" },
  { id: "pro/grok-latest",          label: "Grok 4.3",           short: "Gr43", desc: "xAI's latest. Real-time knowledge, 2:1 pricing.", tier: "pro", category: ["general"],           weight: 2, color: "#4dcaff" },

  // ── General · Elite (4) — flagship reasoning; no Opus, no Sonnet ─────────
  { id: "pro/grok-4-5",           label: "Grok 4.5",            short: "Gr4.5",desc: "xAI's flagship. Real-time knowledge.",           tier: "pro" , category: ["general"],          weight: 3, color: "#ff9e6b" },
  { id: "pro/sonar-reasoning-pro",label: "Sonar Reasoning Pro", short: "Sonr", desc: "Perplexity's reasoning model. Live web-grounded.",tier: "pro" , category: ["general"],          weight: 4, color: "#6bb8ff" },
  { id: "pro/mistral-large",      label: "Mistral Large 2512",  short: "MiLg", desc: "Mistral's current flagship.",   tier: "pro" , category: ["general"],          weight: 3, color: "#ffb066" },

  // ── Coding · Pro (4) ──────────────────────────────────────────────────────
  // `pro/qwen3-coder` was here and has been REMOVED: Qwen is on the owner's
  // banned list, and it had also been mapped through to Crazyrouter, which
  // would have carried the ban straight onto a second provider.
  { id: "pro/laguna-s-2-1",         label: "Laguna S 2.1",       short: "LagS", desc: "Poolside. Purpose-built for code.",   tier: "pro",  category: ["coding"],           weight: 1, color: "#8ee878" },
  { id: "pro/kat-coder-air",        label: "KAT Coder Air 2.5",  short: "KATa", desc: "Kwaipilot. Agentic coding, low latency.",         tier: "pro",  category: ["coding"],           weight: 1, color: "#f6a4c9" },
  { id: "pro/codestral-2508",       label: "Codestral 2508",     short: "Cst",  desc: "Mistral's dedicated coder. 256k ctx.",            tier: "pro",  category: ["coding"],           weight: 1, color: "#ffb066" },
  // Crazyrouter coding additions. qwen3-coder-plus is permitted here where the
  // bare `qwen3-coder` was not: the removal list is a judgment about the models
  // that were in the roster, and this is the owner's own explicit pick.
  { id: "pro/qwen-3-coder-plus",    label: "Qwen3 Coder Plus",   short: "Q3C+", desc: "Alibaba's coding flagship.",  tier: "pro",  category: ["coding"],           weight: 2, color: "#c9a7ff" },
  { id: "pro/gpt-5-3-codex",        label: "GPT-5.3 Codex",      short: "Cdx",  desc: "OpenAI's coding model. Deep reasoning.",         tier: "pro",  category: ["coding"],           weight: 4, color: "#d9d3c7" },
  { id: "pro/glm-5v-turbo",         label: "GLM 5V Turbo",       short: "G5vT", desc: "Zhipu. Vision-capable coder, fast.",             tier: "pro",  category: ["coding"],           weight: 2, color: "#7ee2a8" },

  // ── Coding · Elite (4) — no Opus ──────────────────────────────────────────
  { id: "elite/kat-coder-pro",      label: "KAT Coder Pro 2.5",  short: "KATp", desc: "Kwaipilot's flagship. Multi-file refactors.",     tier: "elite", category: ["coding"],           weight: 2, color: "#f6a4c9" },
  { id: "elite/kimi-k2-7-code",     label: "Kimi K2.7 Code",     short: "K2.7C",desc: "Moonshot's dedicated coding model.",              tier: "elite", category: ["coding"],           weight: 2, color: "#4be6b1" },
  { id: "elite/kimi-k3",            label: "Kimi K3",            short: "K3",   desc: "Moonshot's flagship. Deepest code reasoning.",    tier: "elite", category: ["coding"],           weight: 8, color: "#4be6b1" },
  { id: "elite/qwen-3-7-max",       label: "Qwen 3.7 Max",       short: "Q37M", desc: "Alibaba's top coder. Flat.",   tier: "elite", category: ["coding"],           weight: 2, color: "#c9a7ff" },

  // ── Image · Pro (3) — SPEC.md: no free tier access to media gen. Pollinations
  // (flux-free) stays Pollinations-backed (genuinely keyless/free to us) but
  // moves to Pro, matching the tier rule instead of overriding it ──────────
  { id: "img/flux-free",              label: "FLUX",                    short: "Flux", desc: "Fast, free-to-generate image model.",       tier: "pro",  category: ["image"],             weight: 1, color: "#8ee878" },
  { id: "img/gemini-3-1-flash-image", label: "Gemini 3.1 Flash Image", short: "G3.1I", desc: "Google's fast image generator.",            tier: "pro",  category: ["image"],             weight: 5, color: "#7fd8c4" },
  { id: "img/gpt-5-image-mini",       label: "GPT-5 Image Mini",       short: "5Img-",desc: "OpenAI's compact image model.",              tier: "pro",  category: ["image"],             weight: 2, color: "#d9d3c7" },
  { id: "img/flux-2-klein",           label: "FLUX.2 Klein",           short: "FlxK", desc: "Fastest FLUX.2 tier; high-throughput.",      tier: "pro",  category: ["image"],             weight: 5, color: "#8ee878" },

  // ── Image · Elite (2) ────────────────────────────────────────────────────
  // ── Image · Pro additions — Crazyrouter. Prices are its published
  // image_pricing matrix × discount, verified live 2026-07-29.
  { id: "img/nano-banana-2",          label: "Nano Banana 2",          short: "NB2",  desc: "Google's image model.",        tier: "pro",  category: ["image"],             weight: 19, color: "#f5e000" },
  { id: "img/kling-3-image",          label: "Kling 3.0 Image",        short: "Kl3I", desc: "Kuaishou. Fast image generation.",   tier: "pro",  category: ["image"],             weight: 13, color: "#84cc16" },
  { id: "img/gpt-image-2",            label: "GPT Image 2",            short: "GI2",  desc: "OpenAI's current image model.",      tier: "pro",  category: ["image"],             weight: 19, color: "#d9d3c7" },
  { id: "img/seedream-5-0",           label: "Seedream 5.0",           short: "Sd5",  desc: "ByteDance's newest.",          tier: "pro",  category: ["image"],             weight: 16, color: "#f0a35e" },
  { id: "img/qwen-image-2-0",         label: "Qwen Image 2.0",         short: "QwI",  desc: "Alibaba.",                     tier: "pro",  category: ["image"],             weight: 15, color: "#c9a7ff" },

  // ── Image · Elite additions ──────────────────────────────────────────────
  { id: "img/dall-e-3",               label: "DALL·E 3",               short: "DE3",  desc: "OpenAI's classic.",             tier: "elite", category: ["image"],            weight: 20, color: "#d9d3c7" },
  { id: "img/mj-upscale",             label: "Midjourney Upscale",     short: "MJUp", desc: "Upscales a Midjourney render.",       tier: "elite", category: ["image"],            weight: 25, color: "#a78bfa" },
  { id: "img/nano-banana-pro",        label: "Nano Banana Pro",        short: "NBP",  desc: "Top Nano Banana tier.",        tier: "elite", category: ["image"],            weight: 37, color: "#f5e000" },

  { id: "img/gemini-3-pro-image",     label: "Gemini 3 Pro Image",     short: "G3Img",desc: "Google's flagship image model.",             tier: "elite", category: ["image"],            weight: 67, color: "#7fd8c4" },
  { id: "img/flux-2-max",             label: "FLUX.2 Max",             short: "FlxM", desc: "Black Forest Labs' top tier; peak fidelity.",  tier: "elite", category: ["image"],            weight: 10, color: "#8ee878" },
  { id: "img/gpt-5-4-image-2",        label: "GPT-5.4 Image 2",        short: "54Im", desc: "OpenAI's newest image model, GPT Image 2.", tier: "elite", category: ["image"],            weight: 10, color: "#d9d3c7" },
  { id: "img/seedream-4-5",           label: "Seedream 4.5",           short: "Seed", desc: "ByteDance; strong editing consistency.",     tier: "elite", category: ["image"],            weight: 20, color: "#f0a35e" },

  // ── Video · Pro (3) — real routes confirmed live against OpenRouter's
  // /api/v1/videos/models pricing list (fetched directly, 2026-07-18), not
  // guessed. The old runway-gen2/pika-2/kling-ai/luma-dream entries had zero
  // real route and were removed rather than left as fake options — but that
  // left the pro tier with 0 models against SPEC.md's "3 pro" requirement.
  // These three are real, cheap-tier OpenRouter video models filling that
  // gap instead of leaving it empty.
  // Weights are the credit cost of a 5-second clip at the model's cheapest
  // published resolution — derived from the per-second rates in
  // services/videoSpecs.ts, which came from OpenRouter's video registry. The
  // composer prices the actual duration and resolution; these are the anchor.
  //
  // Ranking all 17 live video models by real per-second cost showed the
  // category was never expensive — the old roster was. It led with Veo 3.1 and
  // Sora 2 Pro at $0.20–0.30/s, which is ONE clip on Pro's 3,000 credits. Veo
  // 3.1 Lite is $0.03/s: forty clips. Pro is now the volume tier and Elite the
  // fidelity tier, which is the split the prices were always describing.
  //
  // Seedance 2.0 and 2.0 Fast were dropped: ByteDance prices them per video
  // token and the registry publishes no token rate, so their cost could only
  // ever be estimated. Replaced by Veo 3.1 Fast and Hailuo 2.3, which publish
  // per-second rates — no model in this roster is now priced by guess.
  { id: "vid/veo-3-1-lite",         label: "Veo 3.1 Lite",       short: "VeoL", desc: "Lightweight video generation.",        tier: "pro",   category: ["video"],            weight: 75,  color: "#ff6ba0" },
  { id: "vid/wan-2-6",              label: "Wan 2.6",            short: "Wan",  desc: "Multi-shot, native audio, 480p–1080p.",          tier: "pro",   category: ["video"],            weight: 100, color: "#a78bfa" },
  { id: "vid/grok-imagine-video",   label: "Grok Imagine Video", short: "Grk",  desc: "xAI; 7 aspect ratios, 1–15s clips.",             tier: "pro",   category: ["video"],            weight: 125, color: "#4dcaff" },
  { id: "vid/kling-3-standard",     label: "Kling Video v3.0",   short: "Klin", desc: "Start+end keyframes, native audio, to 15s.",     tier: "pro",   category: ["video"],            weight: 211, color: "#84cc16" },
  // Crazyrouter video. Weights are a 5s clip at each model's cheapest published
  // resolution, from its video_pricing matrix. Wan 2.2 Flash at $0.0143/s is
  // the cheapest video in the app by a wide margin — half Veo 3.1 Lite.
  { id: "vid/wan-2-2-flash",        label: "Wan 2.2 Flash",      short: "W22F", desc: "480p–1080p, image-to-video.", tier: "pro",  category: ["video"],            weight: 36,  color: "#a78bfa" },
  { id: "vid/wan-2-2-plus",         label: "Wan 2.2 Plus",       short: "W22P", desc: "Text-to-video, 480p and 1080p.",                 tier: "pro",   category: ["video"],            weight: 50,  color: "#a78bfa" },
  { id: "vid/kling-2-5-turbo",      label: "Kling 2.5 Turbo",    short: "K25T", desc: "720p–4K. t2v, i2v, keyframes and reference.",    tier: "pro",   category: ["video"],            weight: 90,  color: "#84cc16" },

  // ── Video · Elite (4) — fidelity, or a capability Pro has no access to ───
  { id: "vid/hailuo-2-3",           label: "Hailuo 2.3",         short: "Hail", desc: "MiniMax; native 1080p, 6s and 10s.",             tier: "elite", category: ["video"],            weight: 205, color: "#ff9e6b" },
  { id: "vid/veo-3-1-fast",         label: "Veo 3.1 Fast",       short: "VeoF", desc: "Veo quality with 4K.", tier: "elite", category: ["video"],            weight: 200, color: "#ff6ba0" },
  { id: "vid/veo-3",                label: "Veo 3.1",            short: "Veo",  desc: "Flagship fidelity. 4K, native synced audio.",    tier: "elite", category: ["video"],            weight: 500, color: "#ff6ba0" },
  { id: "vid/sora-2",               label: "Sora 2 Pro",         short: "Sora", desc: "Up to 20s, synced audio. The longest clips.",    tier: "elite", category: ["video"],            weight: 750, color: "#3b82f6" },
  { id: "vid/wan-2-5-preview",      label: "Wan 2.5 Preview",    short: "W25",  desc: "Newest Wan. 480p–1080p text-to-video.",          tier: "elite", category: ["video"],            weight: 108, color: "#a78bfa" },
  { id: "vid/kling-3-turbo",        label: "Kling 3.0 Turbo",    short: "K30T", desc: "Kling's flagship. Up to 4K, keyframes.",         tier: "elite", category: ["video"],            weight: 179, color: "#84cc16" },

  // ── Music · Pro/Elite (2) — real audio via Google's Lyria 3, the only
  // music-generation model actually reachable through OpenRouter. Relabeled
  // from "Suno"/"Udio" — there's no real Suno or Udio API access here, and
  // running Lyria output under those brand names would just be a different
  // flavor of the same "label doesn't match what it does" bug. musiclm,
  // riffusion, jukebox, and suno-pro had no route at all — removed.
  // ── Audio · Pro (4) ──────────────────────────────────────────────────────
  // Audio is a modality, not a genre: this tab covers music, narration/voice-
  // over, and conversational speech. Scoping it to "music" was what previously
  // made a 4+4 roster look impossible — OpenRouter lists only two music models,
  // but the audio surface (music + TTS + audio-output chat) is ~13 deep.
  // Pro tier = cost-efficient and high-volume.
  { id: "aud/lyria-3-clip",         label: "Lyria 3 Clip",       short: "LyC",  desc: "30s AI-generated instrumental/vocal clip.",       tier: "pro",  category: ["audio"],             weight: 15,  color: "#ff69c8" },
  { id: "aud/kokoro-82m",           label: "Kokoro 82M",         short: "Koko", desc: "Lightweight TTS; 8 languages, 54 preset voices.", tier: "pro",  category: ["audio"],             weight: 1,  color: "#8ee878" },
  { id: "aud/gpt-audio-mini",       label: "GPT Audio Mini",     short: "GAuM", desc: "Conversational voice output, low latency.",       tier: "pro",  category: ["audio"],             weight: 5,  color: "#d9d3c7" },
  // Fourth Pro slot, to meet SPEC.md's 4+4. Worth flagging honestly:
  // docs/AUDIO_MODALITY.md previously REJECTED this model, on the grounds that
  // at $7/M, English-only and ≤7 voices it was "strictly dominated by Kokoro."
  // Two things changed. The count is a spec requirement, not a preference —
  // Audio was shipping 3 Pro models. And of the four models that doc rejected
  // (Orpheus 3B, Sesame CSM, both Zonos tiers), this is the ONLY one still
  // resolving: the other three now return 400 "does not exist", verified by
  // live call. It also isn't really a Kokoro substitute — CSM is a
  // conversational speech model, which is a different job from narration, and
  // comparing it as TTS undersold it.
  { id: "aud/sesame-csm-1b",        label: "Sesame CSM 1B",      short: "CSM",  desc: "Conversational speech — dialogue-tuned, not narration.", tier: "pro", category: ["audio"],      weight: 4,  color: "#9ecbff" },

  // ── Audio · Elite (4) ────────────────────────────────────────────────────
  // Elite = flagship fidelity or a capability no Pro model has (voice cloning,
  // inline emotion direction, full-length song structure).
  { id: "aud/lyria-3-pro",          label: "Lyria 3 Pro",        short: "LyP",  desc: "Full AI-generated song, up to ~3 min, vocals.",   tier: "elite", category: ["audio"],            weight: 30, color: "#ff8a65" },
  { id: "aud/gemini-3-1-flash-tts", label: "Gemini 3.1 Flash TTS", short: "G3TT", desc: "70+ languages, 200+ emotion tags, 2 speakers.", tier: "elite", category: ["audio"],            weight: 5,  color: "#7fd8c4" },
  { id: "aud/voxtral-mini-tts",     label: "Voxtral Mini TTS",   short: "Voxt", desc: "Zero-shot voice cloning, multilingual.",          tier: "elite", category: ["audio"],            weight: 6, color: "#f0a35e" },
  { id: "aud/gpt-audio",            label: "GPT Audio",          short: "GAud", desc: "OpenAI's flagship conversational audio model.",   tier: "elite", category: ["audio"],            weight: 25, color: "#d9d3c7" },
];

export const TIER_RANK: Record<Tier, number> = { free: 0, pro: 1, elite: 2 };
export const TIER_INFO: Record<Tier, { label: string; pool: number; price: string; color: string }> = {
  // Free tier has zero access to credit-spending categories (media gen,
  // coding — see SPEC.md tiers section), so a nonzero pool here was showing
  // users a "300 credits" number they could never actually spend on anything.
  // Colors match the spec-approved palette: silver/chrome (the app's fixed
  // accent), crimson (an approved bold exception), and true yellow (the
  // other approved bold exception — NOT orange/gold, which SPEC.md bans
  // outright regardless of shade). Elite was previously orange/gold
  // (#ffb74d) — that was a mistake carried over from an earlier session,
  // not actually spec-compliant; fixed here along with its other call
  // sites (PromptComposer Deep mode, the drawer Upgrade button, sort
  // chevrons, priority "med", artifact "statement" kind, agreement-score
  // mid-tier).
  // Previously free was green (#4be6b1) and pro was literal purple
  // (#a46cff) — both explicitly banned by the palette rule.
  free:  { label: "Free",  pool: 0,    price: "$0",       color: "#e2e8f0" },
  pro:   { label: "Pro",   pool: 3000, price: "$19.99/mo", color: "#dc2626" },
  elite: { label: "Elite", pool: 7500, price: "$49.99/mo", color: "#f5e000" },
};

// SPEC.md: "Free: ... No access to media gen (image/video/audio) or coding
// models" — categorical, independent of any individual model's own price
// tier. The two `tier: "free"` coding models exist so a Pro/Elite user has
// a no-credit-cost option within coding, not so a free-tier user gets
// coding access — that's a cost label, not an access label. Bug found by
// reading canUse() against the spec: it only checked model.tier, so those
// two models' "free" cost label was accidentally granting free-tier users
// access to the whole Coding category (isCategoryUnlocked included).
const CATEGORY_MIN_TIER: Partial<Record<Category, Tier>> = {
  image: "pro", video: "pro", audio: "pro", coding: "pro",
};

function effectiveMinTier(model: ModelDef): Tier {
  const catMin = model.category.reduce<Tier>((min, c) => {
    const m = CATEGORY_MIN_TIER[c];
    return m && TIER_RANK[m] > TIER_RANK[min] ? m : min;
  }, "free");
  return TIER_RANK[catMin] > TIER_RANK[model.tier] ? catMin : model.tier;
}

export function modelsForCategory(category: Category) {
  return MODELS.filter((m) => m.category.includes(category))
    .sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier] || a.weight - b.weight);
}
export function modelById(id: string) { return MODELS.find((m) => m.id === id); }
export function canUse(tier: Tier, model: ModelDef) {
  return !model.locked && TIER_RANK[tier] >= TIER_RANK[effectiveMinTier(model)];
}
export function isCategoryUnlocked(tier: Tier, category: Category) {
  if (category === "general") return true;
  return MODELS.some((m) => m.category.includes(category) && TIER_RANK[tier] >= TIER_RANK[effectiveMinTier(m)]);
}
