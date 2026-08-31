import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { _ as Folder, a as Search, b as Check, c as Pin, d as Lock, f as Library, g as Globe, h as History, i as Settings, l as Pause, m as Image, o as Plus, p as LayoutGrid, r as SkipForward, s as Play, t as X, u as Palette, v as FileText, x as ArrowUp, y as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DTGTxpAF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TRACKS = [
	{
		id: "t1",
		title: "Driftwood",
		artist: "Aether",
		seconds: 184,
		src: "/themes/tracks/track1_driftwood.mp3"
	},
	{
		id: "t2",
		title: "Glasswing",
		artist: "North Glass",
		seconds: 212,
		src: "/themes/tracks/track2_glasswing.mp3"
	},
	{
		id: "t3",
		title: "Low Tide",
		artist: "Low Pressure",
		seconds: 196,
		src: "/themes/tracks/track3_lowtide.mp3"
	},
	{
		id: "t4",
		title: "Ember Fall",
		artist: "Aether",
		seconds: 168,
		src: "/themes/tracks/track4_emberfall.mp3"
	},
	{
		id: "t5",
		title: "Northlight",
		artist: "North Glass",
		seconds: 240,
		src: "/themes/tracks/track5_northlight.mp3"
	}
];
var FREE = [
	{
		id: "observatory",
		name: "Observatory",
		src: "/themes/free/observatory.jpg",
		category: "Interior"
	},
	{
		id: "cabin",
		name: "Cabin",
		src: "/themes/free/cabin.jpg",
		category: "Interior"
	},
	{
		id: "cabinspace",
		name: "Cabin Space",
		src: "/themes/free/cabinspace.png",
		category: "Interior"
	},
	{
		id: "sanctuary",
		name: "Sanctuary",
		src: "/themes/free/sanctuary.jpg",
		category: "Interior"
	},
	{
		id: "deck",
		name: "Deck",
		src: "/themes/free/deck.jpg",
		category: "Interior"
	},
	{
		id: "dunehall",
		name: "Dune Hall",
		src: "/themes/free/dunehall.jpg",
		category: "Interior"
	},
	{
		id: "ocean",
		name: "Ocean",
		src: "/themes/free/ocean.jpg",
		category: "Horizons"
	},
	{
		id: "garden",
		name: "Garden",
		src: "/themes/free/garden.jpg",
		category: "Horizons"
	},
	{
		id: "rainfall",
		name: "Rainfall",
		src: "/themes/free/rainfall.jpg",
		category: "Horizons"
	},
	{
		id: "twilight",
		name: "Twilight",
		src: "/themes/free/twilight.jpg",
		category: "Horizons"
	},
	{
		id: "twinsuns",
		name: "Twin Suns",
		src: "/themes/free/twinsuns.jpg",
		category: "Horizons"
	},
	{
		id: "starbridge",
		name: "Star Bridge",
		src: "/themes/free/starbridge.jpg",
		category: "Night"
	},
	{
		id: "neoncity",
		name: "Neon City",
		src: "/themes/free/neoncity.jpg",
		category: "Night"
	},
	{
		id: "transit",
		name: "Transit",
		src: "/themes/free/transit.jpg",
		category: "Night"
	},
	{
		id: "blade",
		name: "Blade",
		src: "/themes/free/blade.jpg",
		category: "Night"
	},
	{
		id: "alley1",
		name: "Alley",
		src: "/themes/free/alley1.png",
		category: "Night"
	},
	{
		id: "alley3",
		name: "Alley Night",
		src: "/themes/free/alley3.jpg",
		category: "Night"
	},
	{
		id: "alley4",
		name: "Alley Rain",
		src: "/themes/free/alley4.jpg",
		category: "Night"
	}
];
var LIVE = [
	{
		id: "aurora_drift",
		name: "Aurora Drift",
		src: "/themes/premium/aurora_drift.jpg",
		video: "/themes/premium/aurora_drift.mp4",
		motion: "aurora",
		price: "$4.99"
	},
	{
		id: "nebula_bloom",
		name: "Nebula Bloom",
		src: "/themes/premium/nebula_bloom.jpg",
		video: "/themes/premium/nebula_bloom.mp4",
		motion: "aurora",
		price: "$5.99"
	},
	{
		id: "low_tide",
		name: "Low Tide",
		src: "/themes/premium/low_tide.jpg",
		video: "/themes/premium/low_tide.mp4",
		motion: "tide",
		price: "$2.99"
	},
	{
		id: "ember_fall",
		name: "Ember Fall",
		src: "/themes/premium/ember_fall.jpg",
		video: "/themes/premium/ember_fall.mp4",
		motion: "drift",
		price: "$7.99"
	}
];
var WALLPAPERS = [...FREE.map((w) => ({
	...w,
	premium: false,
	purchased: true,
	motion: "still",
	tracks: []
})), ...LIVE.map((w) => ({
	...w,
	category: "Live",
	premium: true,
	purchased: false,
	tracks: TRACKS
}))];
var THEME_YEARS = [
	"Interior",
	"Horizons",
	"Night",
	"Live"
];
var DISCOVER = [
	{
		id: "i1",
		title: "Night bloom",
		category: "photo",
		author: "Imagine",
		src: "/imagine/g1.jpg",
		premium: false,
		ratio: "9/16"
	},
	{
		id: "i2",
		title: "Alpine hush",
		category: "photo",
		author: "Imagine",
		src: "/imagine/alpine.jpg",
		premium: false,
		ratio: "16/9"
	},
	{
		id: "i3",
		title: "Soft figure",
		category: "photo",
		author: "Imagine",
		src: "/imagine/g2.jpg",
		premium: false,
		ratio: "3/4"
	},
	{
		id: "i5",
		title: "Aurora drift",
		category: "motion",
		author: "Imagine",
		src: "/themes/premium/aurora_drift.jpg",
		video: "/themes/premium/aurora_drift.mp4",
		premium: false,
		ratio: "9/16"
	},
	{
		id: "i6",
		title: "Low coast",
		category: "photo",
		author: "Imagine",
		src: "/imagine/coast.jpg",
		premium: false,
		ratio: "3/2"
	},
	{
		id: "i7",
		title: "Warm still",
		category: "photo",
		author: "Imagine",
		src: "/imagine/g3.jpg",
		premium: false,
		ratio: "4/5"
	},
	{
		id: "i9",
		title: "Dusk glass",
		category: "photo",
		author: "Imagine",
		src: "/imagine/dusk.jpg",
		premium: false,
		ratio: "16/9"
	},
	{
		id: "i10",
		title: "Portrait hold",
		category: "photo",
		author: "Imagine",
		src: "/imagine/g4.jpg",
		premium: false,
		ratio: "3/4"
	},
	{
		id: "i12",
		title: "Field light",
		category: "photo",
		author: "Imagine",
		src: "/imagine/g5.jpg",
		premium: false,
		ratio: "2/3"
	},
	{
		id: "i13",
		title: "Glass still",
		category: "photo",
		author: "Imagine",
		src: "/imagine/glass.jpg",
		premium: false,
		ratio: "1/1"
	},
	{
		id: "i15",
		title: "Quiet hall",
		category: "photo",
		author: "Imagine",
		src: "/imagine/g7.jpg",
		premium: false,
		ratio: "9/16"
	},
	{
		id: "i16",
		title: "Ember fall",
		category: "motion",
		author: "Imagine",
		src: "/themes/premium/ember_fall.jpg",
		video: "/themes/premium/ember_fall.mp4",
		premium: false,
		ratio: "3/4"
	},
	{
		id: "i18",
		title: "Valley mist",
		category: "photo",
		author: "Imagine",
		src: "/imagine/mist.jpg",
		premium: false,
		ratio: "16/9"
	},
	{
		id: "i19",
		title: "Close study",
		category: "photo",
		author: "Imagine",
		src: "/imagine/g9.jpg",
		premium: false,
		ratio: "4/5"
	},
	{
		id: "i21",
		title: "Open room",
		category: "photo",
		author: "Imagine",
		src: "/imagine/g10.jpg",
		premium: false,
		ratio: "3/4"
	},
	{
		id: "i22",
		title: "Low tide",
		category: "motion",
		author: "Imagine",
		src: "/themes/premium/low_tide.jpg",
		video: "/themes/premium/low_tide.mp4",
		premium: false,
		ratio: "3/2"
	},
	{
		id: "i23",
		title: "Tall dusk",
		category: "photo",
		author: "Imagine",
		src: "/imagine/g11.jpg",
		premium: false,
		ratio: "9/16"
	},
	{
		id: "i25",
		title: "Held face",
		category: "photo",
		author: "Imagine",
		src: "/imagine/g12.jpg",
		premium: false,
		ratio: "3/4"
	},
	{
		id: "i26",
		title: "Nebula bloom",
		category: "motion",
		author: "Imagine",
		src: "/themes/premium/nebula_bloom.jpg",
		video: "/themes/premium/nebula_bloom.mp4",
		premium: false,
		ratio: "9/16"
	}
];
var CATEGORIES$1 = [
	{
		id: "general",
		label: "General"
	},
	{
		id: "image",
		label: "Image"
	},
	{
		id: "video",
		label: "Video"
	},
	{
		id: "audio",
		label: "Audio"
	},
	{
		id: "coding",
		label: "Coding"
	}
];
var MODELS$1 = [
	{
		id: "free/gemini-3-6-flash-lite",
		label: "Gemini 3.6 Flash Lite",
		short: "G36L",
		desc: "Google's lightweight flash model.",
		tier: "free",
		category: ["general"],
		weight: 1,
		color: "#7fd8c4"
	},
	{
		id: "free/mistral-small",
		label: "Mistral Small 3.2",
		short: "MiSm",
		desc: "Mistral's current small model.",
		tier: "free",
		category: ["general"],
		weight: 1,
		color: "#ffb066"
	},
	{
		id: "free/command-r",
		label: "Command R",
		short: "CmdR",
		desc: "Cohere's generalist model.",
		tier: "free",
		category: ["general"],
		weight: 1,
		color: "#f2c14e"
	},
	{
		id: "free/minimax-m3",
		label: "MiniMax M3",
		short: "MM3",
		desc: "MiniMax's current flagship. 1M ctx.",
		tier: "free",
		category: ["general"],
		weight: 1,
		color: "#ff9e6b"
	},
	{
		id: "free/ling-2-6-flash",
		label: "Ling 2.6 Flash",
		short: "Ling",
		desc: "InclusionAI. Fastest responder in the roster.",
		tier: "free",
		category: ["general"],
		weight: 1,
		color: "#9ecbff"
	},
	{
		id: "free/mistral-nemo",
		label: "Mistral Nemo",
		short: "Nemo",
		desc: "Mistral + NVIDIA. 128k context.",
		tier: "free",
		category: ["general"],
		weight: 1,
		color: "#67e8f9"
	},
	{
		id: "free/gemma-4-31b",
		label: "Gemma 4 31B",
		short: "Gm4",
		desc: "Google's open-weight model.",
		tier: "free",
		category: ["general"],
		weight: 1,
		color: "#7fd8c4"
	},
	{
		id: "free/qwen-3-6-27b",
		label: "Qwen 3.6 27B",
		short: "Q27",
		desc: "Alibaba's mid-size generalist.",
		tier: "free",
		category: ["general"],
		weight: 1,
		color: "#c9a7ff"
	},
	{
		id: "free/gpt-5-nano",
		label: "GPT-5 Nano",
		short: "5Nano",
		desc: "OpenAI's smallest model.",
		tier: "free",
		category: ["general"],
		weight: 1,
		color: "#d9d3c7"
	},
	{
		id: "free/laguna-s-2-1",
		label: "Laguna S 2.1",
		short: "LagS",
		desc: "Poolside. Code-capable generalist.",
		tier: "free",
		category: ["general"],
		weight: 1,
		color: "#8ee878"
	},
	{
		id: "pro/gemini-3-6-flash",
		label: "Gemini 3.6 Flash",
		short: "G3.6F",
		desc: "Google's current flash model. 1M ctx.",
		tier: "pro",
		category: ["general"],
		weight: 1,
		color: "#7fd8c4"
	},
	{
		id: "pro/mercury-2",
		label: "Mercury 2",
		short: "Merc",
		desc: "Inception. Diffusion LLM — very fast output.",
		tier: "pro",
		category: ["general"],
		weight: 1,
		color: "#c9a7ff"
	},
	{
		id: "pro/mimo-v2-5-pro",
		label: "MiMo V2.5 Pro",
		short: "MiMo",
		desc: "Xiaomi's flagship. Long-context generalist.",
		tier: "pro",
		category: ["general"],
		weight: 1,
		color: "#ff9e6b"
	},
	{
		id: "pro/glm-5-2",
		label: "GLM 5.2",
		short: "GLM5",
		desc: "Zhipu's flagship.",
		tier: "pro",
		category: ["general"],
		weight: 2,
		color: "#7ee2a8"
	},
	{
		id: "pro/gpt-5-6-luna",
		label: "GPT-5.6 Luna",
		short: "Luna",
		desc: "OpenAI's reasoning tier at a mid-tier price.",
		tier: "pro",
		category: ["general"],
		weight: 2,
		color: "#d9d3c7"
	},
	{
		id: "pro/qwen-3-6-plus",
		label: "Qwen 3.6 Plus",
		short: "Q36",
		desc: "Alibaba's generalist.",
		tier: "pro",
		category: ["general"],
		weight: 1,
		color: "#c9a7ff"
	},
	{
		id: "pro/grok-latest",
		label: "Grok 4.3",
		short: "Gr43",
		desc: "xAI's latest. Real-time knowledge, 2:1 pricing.",
		tier: "pro",
		category: ["general"],
		weight: 2,
		color: "#4dcaff"
	},
	{
		id: "pro/grok-4-5",
		label: "Grok 4.5",
		short: "Gr4.5",
		desc: "xAI's flagship. Real-time knowledge.",
		tier: "pro",
		category: ["general"],
		weight: 3,
		color: "#ff9e6b"
	},
	{
		id: "pro/sonar-reasoning-pro",
		label: "Sonar Reasoning Pro",
		short: "Sonr",
		desc: "Perplexity's reasoning model. Live web-grounded.",
		tier: "pro",
		category: ["general"],
		weight: 4,
		color: "#6bb8ff"
	},
	{
		id: "pro/mistral-large",
		label: "Mistral Large 2512",
		short: "MiLg",
		desc: "Mistral's current flagship.",
		tier: "pro",
		category: ["general"],
		weight: 3,
		color: "#ffb066"
	},
	{
		id: "pro/laguna-s-2-1",
		label: "Laguna S 2.1",
		short: "LagS",
		desc: "Poolside. Purpose-built for code.",
		tier: "pro",
		category: ["coding"],
		weight: 1,
		color: "#8ee878"
	},
	{
		id: "pro/kat-coder-air",
		label: "KAT Coder Air 2.5",
		short: "KATa",
		desc: "Kwaipilot. Agentic coding, low latency.",
		tier: "pro",
		category: ["coding"],
		weight: 1,
		color: "#f6a4c9"
	},
	{
		id: "pro/codestral-2508",
		label: "Codestral 2508",
		short: "Cst",
		desc: "Mistral's dedicated coder. 256k ctx.",
		tier: "pro",
		category: ["coding"],
		weight: 1,
		color: "#ffb066"
	},
	{
		id: "pro/qwen-3-coder-plus",
		label: "Qwen3 Coder Plus",
		short: "Q3C+",
		desc: "Alibaba's coding flagship.",
		tier: "pro",
		category: ["coding"],
		weight: 2,
		color: "#c9a7ff"
	},
	{
		id: "pro/gpt-5-3-codex",
		label: "GPT-5.3 Codex",
		short: "Cdx",
		desc: "OpenAI's coding model. Deep reasoning.",
		tier: "pro",
		category: ["coding"],
		weight: 4,
		color: "#d9d3c7"
	},
	{
		id: "pro/glm-5v-turbo",
		label: "GLM 5V Turbo",
		short: "G5vT",
		desc: "Zhipu. Vision-capable coder, fast.",
		tier: "pro",
		category: ["coding"],
		weight: 2,
		color: "#7ee2a8"
	},
	{
		id: "elite/kat-coder-pro",
		label: "KAT Coder Pro 2.5",
		short: "KATp",
		desc: "Kwaipilot's flagship. Multi-file refactors.",
		tier: "elite",
		category: ["coding"],
		weight: 2,
		color: "#f6a4c9"
	},
	{
		id: "elite/kimi-k2-7-code",
		label: "Kimi K2.7 Code",
		short: "K2.7C",
		desc: "Moonshot's dedicated coding model.",
		tier: "elite",
		category: ["coding"],
		weight: 2,
		color: "#4be6b1"
	},
	{
		id: "elite/kimi-k3",
		label: "Kimi K3",
		short: "K3",
		desc: "Moonshot's flagship. Deepest code reasoning.",
		tier: "elite",
		category: ["coding"],
		weight: 8,
		color: "#4be6b1"
	},
	{
		id: "elite/qwen-3-7-max",
		label: "Qwen 3.7 Max",
		short: "Q37M",
		desc: "Alibaba's top coder. Flat.",
		tier: "elite",
		category: ["coding"],
		weight: 2,
		color: "#c9a7ff"
	},
	{
		id: "img/flux-free",
		label: "FLUX",
		short: "Flux",
		desc: "Fast, free-to-generate image model.",
		tier: "pro",
		category: ["image"],
		weight: 1,
		color: "#8ee878"
	},
	{
		id: "img/gemini-3-1-flash-image",
		label: "Gemini 3.1 Flash Image",
		short: "G3.1I",
		desc: "Google's fast image generator.",
		tier: "pro",
		category: ["image"],
		weight: 5,
		color: "#7fd8c4"
	},
	{
		id: "img/gpt-5-image-mini",
		label: "GPT-5 Image Mini",
		short: "5Img-",
		desc: "OpenAI's compact image model.",
		tier: "pro",
		category: ["image"],
		weight: 2,
		color: "#d9d3c7"
	},
	{
		id: "img/flux-2-klein",
		label: "FLUX.2 Klein",
		short: "FlxK",
		desc: "Fastest FLUX.2 tier; high-throughput.",
		tier: "pro",
		category: ["image"],
		weight: 5,
		color: "#8ee878"
	},
	{
		id: "img/nano-banana-2",
		label: "Nano Banana 2",
		short: "NB2",
		desc: "Google's image model.",
		tier: "pro",
		category: ["image"],
		weight: 19,
		color: "#f5e000"
	},
	{
		id: "img/kling-3-image",
		label: "Kling 3.0 Image",
		short: "Kl3I",
		desc: "Kuaishou. Fast image generation.",
		tier: "pro",
		category: ["image"],
		weight: 13,
		color: "#84cc16"
	},
	{
		id: "img/gpt-image-2",
		label: "GPT Image 2",
		short: "GI2",
		desc: "OpenAI's current image model.",
		tier: "pro",
		category: ["image"],
		weight: 19,
		color: "#d9d3c7"
	},
	{
		id: "img/seedream-5-0",
		label: "Seedream 5.0",
		short: "Sd5",
		desc: "ByteDance's newest.",
		tier: "pro",
		category: ["image"],
		weight: 16,
		color: "#f0a35e"
	},
	{
		id: "img/qwen-image-2-0",
		label: "Qwen Image 2.0",
		short: "QwI",
		desc: "Alibaba.",
		tier: "pro",
		category: ["image"],
		weight: 15,
		color: "#c9a7ff"
	},
	{
		id: "img/dall-e-3",
		label: "DALL·E 3",
		short: "DE3",
		desc: "OpenAI's classic.",
		tier: "elite",
		category: ["image"],
		weight: 20,
		color: "#d9d3c7"
	},
	{
		id: "img/mj-upscale",
		label: "Midjourney Upscale",
		short: "MJUp",
		desc: "Upscales a Midjourney render.",
		tier: "elite",
		category: ["image"],
		weight: 25,
		color: "#a78bfa"
	},
	{
		id: "img/nano-banana-pro",
		label: "Nano Banana Pro",
		short: "NBP",
		desc: "Top Nano Banana tier.",
		tier: "elite",
		category: ["image"],
		weight: 37,
		color: "#f5e000"
	},
	{
		id: "img/gemini-3-pro-image",
		label: "Gemini 3 Pro Image",
		short: "G3Img",
		desc: "Google's flagship image model.",
		tier: "elite",
		category: ["image"],
		weight: 67,
		color: "#7fd8c4"
	},
	{
		id: "img/flux-2-max",
		label: "FLUX.2 Max",
		short: "FlxM",
		desc: "Black Forest Labs' top tier; peak fidelity.",
		tier: "elite",
		category: ["image"],
		weight: 10,
		color: "#8ee878"
	},
	{
		id: "img/gpt-5-4-image-2",
		label: "GPT-5.4 Image 2",
		short: "54Im",
		desc: "OpenAI's newest image model, GPT Image 2.",
		tier: "elite",
		category: ["image"],
		weight: 10,
		color: "#d9d3c7"
	},
	{
		id: "img/seedream-4-5",
		label: "Seedream 4.5",
		short: "Seed",
		desc: "ByteDance; strong editing consistency.",
		tier: "elite",
		category: ["image"],
		weight: 20,
		color: "#f0a35e"
	},
	{
		id: "vid/veo-3-1-lite",
		label: "Veo 3.1 Lite",
		short: "VeoL",
		desc: "Lightweight video generation.",
		tier: "pro",
		category: ["video"],
		weight: 75,
		color: "#ff6ba0"
	},
	{
		id: "vid/wan-2-6",
		label: "Wan 2.6",
		short: "Wan",
		desc: "Multi-shot, native audio, 480p–1080p.",
		tier: "pro",
		category: ["video"],
		weight: 100,
		color: "#a78bfa"
	},
	{
		id: "vid/grok-imagine-video",
		label: "Grok Imagine Video",
		short: "Grk",
		desc: "xAI; 7 aspect ratios, 1–15s clips.",
		tier: "pro",
		category: ["video"],
		weight: 125,
		color: "#4dcaff"
	},
	{
		id: "vid/kling-3-standard",
		label: "Kling Video v3.0",
		short: "Klin",
		desc: "Start+end keyframes, native audio, to 15s.",
		tier: "pro",
		category: ["video"],
		weight: 211,
		color: "#84cc16"
	},
	{
		id: "vid/wan-2-2-flash",
		label: "Wan 2.2 Flash",
		short: "W22F",
		desc: "480p–1080p, image-to-video.",
		tier: "pro",
		category: ["video"],
		weight: 36,
		color: "#a78bfa"
	},
	{
		id: "vid/wan-2-2-plus",
		label: "Wan 2.2 Plus",
		short: "W22P",
		desc: "Text-to-video, 480p and 1080p.",
		tier: "pro",
		category: ["video"],
		weight: 50,
		color: "#a78bfa"
	},
	{
		id: "vid/kling-2-5-turbo",
		label: "Kling 2.5 Turbo",
		short: "K25T",
		desc: "720p–4K. t2v, i2v, keyframes and reference.",
		tier: "pro",
		category: ["video"],
		weight: 90,
		color: "#84cc16"
	},
	{
		id: "vid/hailuo-2-3",
		label: "Hailuo 2.3",
		short: "Hail",
		desc: "MiniMax; native 1080p, 6s and 10s.",
		tier: "elite",
		category: ["video"],
		weight: 205,
		color: "#ff9e6b"
	},
	{
		id: "vid/veo-3-1-fast",
		label: "Veo 3.1 Fast",
		short: "VeoF",
		desc: "Veo quality with 4K.",
		tier: "elite",
		category: ["video"],
		weight: 200,
		color: "#ff6ba0"
	},
	{
		id: "vid/veo-3",
		label: "Veo 3.1",
		short: "Veo",
		desc: "Flagship fidelity. 4K, native synced audio.",
		tier: "elite",
		category: ["video"],
		weight: 500,
		color: "#ff6ba0"
	},
	{
		id: "vid/sora-2",
		label: "Sora 2 Pro",
		short: "Sora",
		desc: "Up to 20s, synced audio. The longest clips.",
		tier: "elite",
		category: ["video"],
		weight: 750,
		color: "#3b82f6"
	},
	{
		id: "vid/wan-2-5-preview",
		label: "Wan 2.5 Preview",
		short: "W25",
		desc: "Newest Wan. 480p–1080p text-to-video.",
		tier: "elite",
		category: ["video"],
		weight: 108,
		color: "#a78bfa"
	},
	{
		id: "vid/kling-3-turbo",
		label: "Kling 3.0 Turbo",
		short: "K30T",
		desc: "Kling's flagship. Up to 4K, keyframes.",
		tier: "elite",
		category: ["video"],
		weight: 179,
		color: "#84cc16"
	},
	{
		id: "aud/lyria-3-clip",
		label: "Lyria 3 Clip",
		short: "LyC",
		desc: "30s AI-generated instrumental/vocal clip.",
		tier: "pro",
		category: ["audio"],
		weight: 15,
		color: "#ff69c8"
	},
	{
		id: "aud/kokoro-82m",
		label: "Kokoro 82M",
		short: "Koko",
		desc: "Lightweight TTS; 8 languages, 54 preset voices.",
		tier: "pro",
		category: ["audio"],
		weight: 1,
		color: "#8ee878"
	},
	{
		id: "aud/gpt-audio-mini",
		label: "GPT Audio Mini",
		short: "GAuM",
		desc: "Conversational voice output, low latency.",
		tier: "pro",
		category: ["audio"],
		weight: 5,
		color: "#d9d3c7"
	},
	{
		id: "aud/sesame-csm-1b",
		label: "Sesame CSM 1B",
		short: "CSM",
		desc: "Conversational speech — dialogue-tuned, not narration.",
		tier: "pro",
		category: ["audio"],
		weight: 4,
		color: "#9ecbff"
	},
	{
		id: "aud/lyria-3-pro",
		label: "Lyria 3 Pro",
		short: "LyP",
		desc: "Full AI-generated song, up to ~3 min, vocals.",
		tier: "elite",
		category: ["audio"],
		weight: 30,
		color: "#ff8a65"
	},
	{
		id: "aud/gemini-3-1-flash-tts",
		label: "Gemini 3.1 Flash TTS",
		short: "G3TT",
		desc: "70+ languages, 200+ emotion tags, 2 speakers.",
		tier: "elite",
		category: ["audio"],
		weight: 5,
		color: "#7fd8c4"
	},
	{
		id: "aud/voxtral-mini-tts",
		label: "Voxtral Mini TTS",
		short: "Voxt",
		desc: "Zero-shot voice cloning, multilingual.",
		tier: "elite",
		category: ["audio"],
		weight: 6,
		color: "#f0a35e"
	},
	{
		id: "aud/gpt-audio",
		label: "GPT Audio",
		short: "GAud",
		desc: "OpenAI's flagship conversational audio model.",
		tier: "elite",
		category: ["audio"],
		weight: 25,
		color: "#d9d3c7"
	}
];
var TIER_RANK = {
	free: 0,
	pro: 1,
	elite: 2
};
var TIER_INFO = {
	free: {
		label: "Free",
		pool: 0,
		price: "$0",
		color: "#e2e8f0"
	},
	pro: {
		label: "Pro",
		pool: 3e3,
		price: "$19.99/mo",
		color: "#dc2626"
	},
	elite: {
		label: "Elite",
		pool: 7500,
		price: "$49.99/mo",
		color: "#f5e000"
	}
};
var KIND = {
	general: "text",
	image: "image",
	audio: "audio",
	video: "video",
	coding: "code"
};
var CATEGORY_MIN = {
	image: "pro",
	video: "pro",
	audio: "pro",
	coding: "pro"
};
function minTier(model) {
	const catMin = model.category.reduce((min, c) => {
		const m = CATEGORY_MIN[c];
		return m && TIER_RANK[m] > TIER_RANK[min] ? m : min;
	}, "free");
	return TIER_RANK[catMin] > TIER_RANK[model.tier] ? catMin : model.tier;
}
function toAi(model) {
	const category = model.category[0];
	return {
		id: model.id,
		name: model.label,
		short: CHIP[model.id] ?? model.label.split(/[\s·]+/)[0],
		category,
		kind: KIND[category],
		minTier: minTier(model),
		accent: model.color,
		blurb: model.desc
	};
}
var CHIP = {
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
	"aud/gpt-audio": "GPT Audio"
};
var MODELS = MODELS$1.map(toAi);
var CATEGORIES = CATEGORIES$1.map((c) => ({
	id: c.id,
	label: c.label
}));
var DEFAULT_ENABLED = MODELS.filter((m) => m.category === "general" && m.minTier === "free").slice(0, 6).map((m) => m.id);
function canUse(model, tier) {
	return TIER_RANK[tier] >= TIER_RANK[model.minTier];
}
function groupByTier(models) {
	const free = [];
	const pro = [];
	const elite = [];
	for (const m of models) if (m.minTier === "free") free.push(m);
	else if (m.minTier === "pro") pro.push(m);
	else elite.push(m);
	return {
		free,
		pro,
		elite
	};
}
var SMART_PAGES = [
	{
		id: "cards",
		label: "Cards"
	},
	{
		id: "boards",
		label: "Boards"
	},
	{
		id: "canvas",
		label: "Canvas"
	},
	{
		id: "genie",
		label: "Genie"
	}
];
var SMART_KINDS = [
	{
		id: "memory",
		label: "Memory",
		hint: "A moment, still, or conversation to keep"
	},
	{
		id: "task",
		label: "Task",
		hint: "Something to move across the board"
	},
	{
		id: "artifact",
		label: "Artifact",
		hint: "A made thing — image, note, cut"
	},
	{
		id: "note",
		label: "Note",
		hint: "A thought that belongs on the wall"
	}
];
var SMART_LANES = [
	{
		id: "inbox",
		label: "Inbox"
	},
	{
		id: "play",
		label: "In play"
	},
	{
		id: "ready",
		label: "Ready"
	},
	{
		id: "archive",
		label: "Kept"
	}
];
function seedSmartCards() {
	const day = 864e5;
	const now = Date.UTC(2026, 7, 28);
	return [
		{
			id: "sm-alpine",
			kind: "memory",
			title: "Alpine hush",
			body: "Still air above the ridge. Keep this light.",
			lane: "ready",
			x: 16,
			y: 20,
			preview: "/imagine/alpine.jpg",
			createdAt: now - 40 * day
		},
		{
			id: "sm-coast",
			kind: "memory",
			title: "Low coast",
			body: "Tide line after the send. Remix later.",
			lane: "play",
			x: 148,
			y: 36,
			preview: "/imagine/coast.jpg",
			createdAt: now - 18 * day
		},
		{
			id: "sm-dusk",
			kind: "artifact",
			title: "Dusk glass",
			body: "Warm window, long hold. Variant of the observatory still.",
			lane: "inbox",
			x: 28,
			y: 168,
			preview: "/imagine/dusk.jpg",
			createdAt: now - 9 * day
		},
		{
			id: "sm-mist",
			kind: "memory",
			title: "Valley mist",
			body: "Soft morning, no prompt. Just the room.",
			lane: "ready",
			x: 152,
			y: 188,
			preview: "/imagine/mist.jpg",
			createdAt: now - 4 * day
		},
		{
			id: "sm-task",
			kind: "task",
			title: "Board the week",
			body: "Freeze tabs at the bottom. One lane per day.",
			lane: "inbox",
			x: 18,
			y: 320,
			createdAt: now - 2 * day
		},
		{
			id: "sm-note",
			kind: "note",
			title: "Cards vs boards",
			body: "Same objects. Swap the board, keep the type — or freeze the type and swap days.",
			lane: "play",
			x: 140,
			y: 340,
			createdAt: now - day
		},
		{
			id: "sm-glass",
			kind: "artifact",
			title: "Glass still",
			body: "Held from Imagine. Attach when the thread needs it.",
			lane: "archive",
			x: 84,
			y: 96,
			preview: "/imagine/glass.jpg",
			createdAt: now - 70 * day
		}
	];
}
function seedConversations() {
	const seed = {};
	for (const m of MODELS) seed[m.id] = {
		modelId: m.id,
		messages: []
	};
	const now = Date.now();
	for (const [id, text] of Object.entries({
		"free/minimax-m3": "A glass canvas over a live wallpaper. Cards sit in front and never clip the plate they rest on.",
		"free/command-r": "Tint the canvas, not the cards. Names carry the model color. Prompt brings consensus with it.",
		"free/gemini-3-6-flash-lite": "Home is a card grid. Themes and Imagine are working surfaces with a heavier plate."
	})) if (seed[id]) seed[id].messages = [{
		id: `seed-${id}`,
		role: "assistant",
		text,
		createdAt: now - 6e4
	}];
	return seed;
}
function seedFiles() {
	const day = 864e5;
	const y26 = Date.UTC(2026, 6, 12);
	const y25 = Date.UTC(2025, 10, 3);
	const y24 = Date.UTC(2024, 8, 18);
	return [
		{
			id: "sf-alpine",
			modelId: "imagine",
			name: "Alpine hush.png",
			kind: "image",
			sizeLabel: "1k",
			createdAt: y26,
			preview: "/imagine/alpine.jpg"
		},
		{
			id: "sf-coast",
			modelId: "imagine",
			name: "Low coast.png",
			kind: "image",
			sizeLabel: "1k",
			createdAt: y26 - 4 * day,
			preview: "/imagine/coast.jpg"
		},
		{
			id: "sf-dusk",
			modelId: "imagine",
			name: "Dusk glass.png",
			kind: "image",
			sizeLabel: "1k",
			createdAt: y26 - 11 * day,
			preview: "/imagine/dusk.jpg"
		},
		{
			id: "sf-aurora",
			modelId: "imagine",
			name: "Aurora drift.mp4",
			kind: "video",
			sizeLabel: "live",
			createdAt: y26 - 2 * day,
			preview: "/themes/premium/aurora_drift.jpg"
		},
		{
			id: "sf-mist",
			modelId: "imagine",
			name: "Valley mist.png",
			kind: "image",
			sizeLabel: "1k",
			createdAt: y25,
			preview: "/imagine/mist.jpg"
		},
		{
			id: "sf-glass",
			modelId: "imagine",
			name: "Glass still.png",
			kind: "image",
			sizeLabel: "1k",
			createdAt: y25 - 20 * day,
			preview: "/imagine/glass.jpg"
		},
		{
			id: "sf-g1",
			modelId: "imagine",
			name: "Night bloom.png",
			kind: "image",
			sizeLabel: "1k",
			createdAt: y25 - 40 * day,
			preview: "/imagine/g1.jpg"
		},
		{
			id: "sf-g3",
			modelId: "imagine",
			name: "Warm still.png",
			kind: "image",
			sizeLabel: "1k",
			createdAt: y24,
			preview: "/imagine/g3.jpg"
		},
		{
			id: "sf-g5",
			modelId: "imagine",
			name: "Field light.png",
			kind: "image",
			sizeLabel: "1k",
			createdAt: y24 - 30 * day,
			preview: "/imagine/g5.jpg"
		},
		{
			id: "sf-ember",
			modelId: "imagine",
			name: "Ember fall.mp4",
			kind: "video",
			sizeLabel: "live",
			createdAt: y24 - 8 * day,
			preview: "/themes/premium/ember_fall.jpg"
		}
	];
}
function defaultCardLayout() {
	return DEFAULT_ENABLED.map((id) => ({
		id,
		x: 0,
		y: 0
	}));
}
var WORKING$1 = [
	"themes",
	"discover",
	"upgrade",
	"smart",
	"files"
];
var useAether = create()(persist((set, get) => ({
	tier: "pro",
	surface: "home",
	cardModelId: null,
	enabledModelIds: DEFAULT_ENABLED,
	conversations: seedConversations(),
	files: seedFiles(),
	cardLayout: defaultCardLayout(),
	cardRows: 2,
	gridSnap: false,
	rearranging: false,
	alignRequest: 0,
	draggingCardId: null,
	settingsOpen: false,
	settingsTab: "account",
	settingsPos: {
		x: 61,
		y: 210
	},
	modelCategory: "general",
	promptOpen: false,
	promptText: "",
	sending: false,
	hidePromptOnSend: true,
	hidePromptAfterIdle: false,
	blurOnSend: false,
	sendFlash: false,
	consensusOpen: false,
	investigation: "off",
	wallpaperId: "observatory",
	themeMarketTab: 0,
	explodedWallpaperId: null,
	purchasedWallpaperIds: WALLPAPERS.filter((w) => w.purchased).map((w) => w.id),
	musicOpen: false,
	musicPos: {
		x: 0,
		y: 0
	},
	playing: false,
	trackIndex: 0,
	discoverQuery: "",
	discoverFilter: "all",
	historyQuery: "",
	filesQuery: "",
	filesFilter: "all",
	filesGroup: "years",
	previewFileId: null,
	smartPage: "cards",
	smartTabsAt: "top",
	smartCards: seedSmartCards(),
	smartOpenId: null,
	guideOn: false,
	upgradeFromLock: false,
	stats: {
		messages: 128,
		images: 14,
		minutes: 46
	},
	setSurface: (s) => set({
		surface: s,
		settingsOpen: false,
		cardModelId: WORKING$1.includes(s) || s === "home" ? null : get().cardModelId,
		previewFileId: s === "files" ? get().previewFileId : null,
		explodedWallpaperId: s === "themes" ? get().explodedWallpaperId : null,
		smartOpenId: s === "smart" ? get().smartOpenId : null
	}),
	openCard: (id) => set({
		surface: "card",
		cardModelId: id,
		settingsOpen: false
	}),
	closeToHome: () => set({
		surface: "home",
		cardModelId: null,
		explodedWallpaperId: null,
		previewFileId: null,
		smartOpenId: null,
		upgradeFromLock: false,
		consensusOpen: false
	}),
	toggleModel: (id) => {
		const { enabledModelIds, cardLayout, gridSnap, cardRows } = get();
		if (enabledModelIds.includes(id)) set({
			enabledModelIds: enabledModelIds.filter((x) => x !== id),
			cardLayout: cardLayout.filter((c) => c.id !== id)
		});
		else {
			if (enabledModelIds.length >= 9) return;
			const next = [...enabledModelIds, id];
			const layout = [...cardLayout, {
				id,
				x: 0,
				y: 0
			}];
			set({
				enabledModelIds: next,
				cardLayout: gridSnap ? snapLayout(layout, cardRows) : layout
			});
		}
	},
	setTier: (t) => {
		const enabled = get().enabledModelIds.filter((id) => {
			const m = MODELS.find((x) => x.id === id);
			return m ? canUse(m, t) : false;
		});
		set({
			tier: t,
			enabledModelIds: enabled.length ? enabled : [DEFAULT_ENABLED[0]],
			cardLayout: get().cardLayout.filter((c) => enabled.includes(c.id))
		});
	},
	setSettingsOpen: (v) => set({ settingsOpen: v }),
	setSettingsTab: (t) => set({ settingsTab: t }),
	setSettingsPos: (p) => set({ settingsPos: p }),
	setModelCategory: (c) => set({ modelCategory: c }),
	setPromptOpen: (v) => set({ promptOpen: v }),
	setPromptText: (t) => set({ promptText: t }),
	setSending: (v) => set({ sending: v }),
	flashSend: () => {
		set({ sendFlash: true });
		window.setTimeout(() => set({ sendFlash: false }), 700);
	},
	addMessage: (modelId, msg) => set((s) => {
		const conv = s.conversations[modelId] ?? {
			modelId,
			messages: []
		};
		return { conversations: {
			...s.conversations,
			[modelId]: {
				...conv,
				messages: [...conv.messages, msg]
			}
		} };
	}),
	hideMessage: (modelId, msgId) => set((s) => {
		const conv = s.conversations[modelId];
		if (!conv) return {};
		return { conversations: {
			...s.conversations,
			[modelId]: {
				...conv,
				messages: conv.messages.filter((m) => m.id !== msgId)
			}
		} };
	}),
	setGridSnap: (v) => {
		set({ gridSnap: v });
		if (v) set({ cardLayout: snapLayout(get().cardLayout, get().cardRows) });
	},
	setCardRows: (n) => set({ cardRows: n }),
	setRearranging: (v) => set({ rearranging: v }),
	requestAlign: () => set({ alignRequest: Date.now() }),
	setCardLayout: (layout) => set({ cardLayout: layout }),
	snapCards: () => set({ alignRequest: Date.now() }),
	setDraggingCard: (id) => set({ draggingCardId: id }),
	moveCard: (id, x, y) => set((s) => ({ cardLayout: s.cardLayout.map((c) => c.id === id ? {
		...c,
		x,
		y
	} : c) })),
	setWallpaper: (id) => set({
		wallpaperId: id,
		trackIndex: 0
	}),
	setThemeMarketTab: (n) => set({
		themeMarketTab: n,
		explodedWallpaperId: null
	}),
	setExplodedWallpaper: (id) => set({ explodedWallpaperId: id }),
	purchaseWallpaper: (id) => set((s) => ({ purchasedWallpaperIds: s.purchasedWallpaperIds.includes(id) ? s.purchasedWallpaperIds : [...s.purchasedWallpaperIds, id] })),
	setMusicOpen: (v) => set({ musicOpen: v }),
	setMusicPos: (p) => set({ musicPos: p }),
	setPlaying: (v) => set({ playing: v }),
	setTrackIndex: (n) => set({ trackIndex: n }),
	setDiscoverQuery: (q) => set({ discoverQuery: q }),
	setDiscoverFilter: (f) => set({ discoverFilter: f }),
	setHistoryQuery: (q) => set({ historyQuery: q }),
	setFilesQuery: (q) => set({ filesQuery: q }),
	setFilesFilter: (f) => set({ filesFilter: f }),
	setFilesGroup: (g) => set({ filesGroup: g }),
	setPreviewFile: (id) => set({ previewFileId: id }),
	addFile: (file) => set((s) => ({ files: [file, ...s.files] })),
	removeFile: (id) => set((s) => ({
		files: s.files.filter((f) => f.id !== id),
		previewFileId: s.previewFileId === id ? null : s.previewFileId
	})),
	setSmartPage: (p) => set({
		smartPage: p,
		smartOpenId: null
	}),
	setSmartTabsAt: (v) => set({ smartTabsAt: v }),
	setSmartOpen: (id) => set({ smartOpenId: id }),
	addSmartCard: (card) => set((s) => {
		const id = card.id ?? uid("sm");
		return {
			smartCards: [{
				id,
				kind: card.kind,
				title: card.title,
				body: card.body,
				lane: card.lane,
				preview: card.preview,
				x: 16 + s.smartCards.length % 3 * 28,
				y: 14 + s.smartCards.length % 4 * 18,
				createdAt: Date.now()
			}, ...s.smartCards],
			smartOpenId: id,
			smartPage: "cards"
		};
	}),
	moveSmartLane: (id, lane) => set((s) => ({ smartCards: s.smartCards.map((c) => c.id === id ? {
		...c,
		lane
	} : c) })),
	placeSmartCard: (id, x, y) => set((s) => ({ smartCards: s.smartCards.map((c) => c.id === id ? {
		...c,
		x,
		y
	} : c) })),
	removeSmartCard: (id) => set((s) => ({
		smartCards: s.smartCards.filter((c) => c.id !== id),
		smartOpenId: s.smartOpenId === id ? null : s.smartOpenId
	})),
	setGuideOn: (v) => set({ guideOn: v }),
	setUpgradeFromLock: (v) => set({ upgradeFromLock: v }),
	setHidePromptOnSend: (v) => set({ hidePromptOnSend: v }),
	setHidePromptAfterIdle: (v) => set({ hidePromptAfterIdle: v }),
	setBlurOnSend: (v) => set({ blurOnSend: v }),
	setConsensusOpen: (v) => set({ consensusOpen: v }),
	setInvestigation: (v) => set({ investigation: v === get().investigation ? "off" : v }),
	bumpStat: (k, n = 1) => set((s) => ({ stats: {
		...s.stats,
		[k]: s.stats[k] + n
	} }))
}), {
	name: "collider-spatial-v8",
	partialize: (s) => ({
		tier: s.tier,
		enabledModelIds: s.enabledModelIds,
		conversations: s.conversations,
		files: s.files,
		cardLayout: s.cardLayout,
		cardRows: s.cardRows,
		gridSnap: s.gridSnap,
		wallpaperId: s.wallpaperId,
		purchasedWallpaperIds: s.purchasedWallpaperIds,
		hidePromptOnSend: s.hidePromptOnSend,
		hidePromptAfterIdle: s.hidePromptAfterIdle,
		promptText: s.promptText,
		smartCards: s.smartCards,
		smartPage: s.smartPage,
		smartTabsAt: s.smartTabsAt
	})
}));
function snapLayout(layout, _rows = 2) {
	return [...layout].sort((a, b) => a.x - b.x || a.y - b.y);
}
function uid(prefix = "m") {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
function Environment() {
	const wallpaperId = useAether((s) => s.wallpaperId);
	const paper = WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];
	const [front, setFront] = (0, import_react.useState)(paper);
	const [back, setBack] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (paper.id === front.id) return;
		setBack(front);
		setFront(paper);
		const t = window.setTimeout(() => setBack(null), 1300);
		return () => window.clearTimeout(t);
	}, [paper, front]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "env-root",
		"aria-hidden": true,
		children: [
			back ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "env-layer leaving",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, { paper: back })
			}, `b-${back.id}`) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "env-layer entering",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, { paper: front })
			}, `f-${front.id}`),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "env-veil" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "env-grain" })
		]
	});
}
function Layer({ paper }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		paper.video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			className: `env-photo live-${paper.motion}`,
			src: paper.video,
			poster: paper.src,
			autoPlay: true,
			muted: true,
			loop: true,
			playsInline: true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: paper.src,
			alt: "",
			className: `env-photo live-${paper.motion}`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `live-fx live-${paper.motion}` }),
		paper.motion === "aurora" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "env-aurora" }) : null,
		paper.motion === "tide" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "live-caustic" }) : null,
		paper.motion === "drift" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "live-mist" }) : null
	] });
}
var RATIO_MIN = 1.55;
var RATIO_MAX = 2.05;
function pageColumns(rows) {
	return rows === 3 ? 3 : 2;
}
function metrics(viewW, viewH, rows, count) {
	const pageCols = pageColumns(rows);
	const colCount = Math.max(1, Math.ceil(Math.max(count, 1) / rows));
	const visCols = Math.min(colCount, pageCols);
	const maxW = Math.max(1, (viewW - 8 * (visCols - 1)) / visCols);
	const maxH = Math.max(1, (viewH - 8 * (rows - 1)) / rows);
	const ideal = maxH / maxW;
	const ratio = Math.min(RATIO_MAX, Math.max(RATIO_MIN, ideal));
	let cardW = maxW;
	let cardH = cardW * ratio;
	if (cardH > maxH) {
		cardH = maxH;
		cardW = cardH / ratio;
	}
	const clusterW = visCols * cardW + (visCols - 1) * 8;
	const clusterH = rows * cardH + (rows - 1) * 8;
	const scrolling = colCount > visCols;
	const padX = scrolling ? 4 : Math.max(0, (viewW - clusterW) / 2);
	const padY = Math.max(0, (viewH - clusterH) / 2);
	const contentW = colCount * cardW + Math.max(0, colCount - 1) * 8 + padX * 2;
	return {
		cardW,
		cardH,
		colCount,
		visCols,
		pageCols,
		rows,
		padX,
		padY,
		contentW,
		scrolling,
		gap: 8
	};
}
function cellForIndex(i, rows, m) {
	const col = Math.floor(i / rows);
	const row = i % rows;
	return {
		col,
		row,
		x: m.padX + col * (m.cardW + m.gap),
		y: m.padY + row * (m.cardH + m.gap)
	};
}
/**
* Free 2D drag. One component for cards, settings, music.
* armMs > 0: long-press to pick up. Release drops. Glow lives on the child.
*/
function Draggable({ x, y, onMove, onTap, onArm, onDrop, armMs = 0, enabled = true, handleSelector, className, style, children }) {
	const origin = (0, import_react.useRef)({
		x: 0,
		y: 0,
		px: 0,
		py: 0
	});
	const moved = (0, import_react.useRef)(false);
	const armed = (0, import_react.useRef)(false);
	const timer = (0, import_react.useRef)(null);
	function clearTimer() {
		if (timer.current) {
			window.clearTimeout(timer.current);
			timer.current = null;
		}
	}
	function onPointerDown(e) {
		if (!enabled) return;
		const t = e.target;
		if (handleSelector && !t.closest(handleSelector)) return;
		if ((t.closest("button") || t.closest("input") || t.closest("a")) && handleSelector) return;
		moved.current = false;
		armed.current = armMs <= 0;
		origin.current = {
			x,
			y,
			px: e.clientX,
			py: e.clientY
		};
		e.currentTarget.setPointerCapture(e.pointerId);
		if (armMs > 0) timer.current = window.setTimeout(() => {
			armed.current = true;
			onArm?.();
		}, armMs);
	}
	function onPointerMove(e) {
		if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
		const dx = e.clientX - origin.current.px;
		const dy = e.clientY - origin.current.py;
		if (Math.hypot(dx, dy) > 8) {
			moved.current = true;
			if (!armed.current && armMs > 0) {
				clearTimer();
				return;
			}
		}
		if (!armed.current) return;
		onMove({
			x: origin.current.x + dx,
			y: origin.current.y + dy
		});
	}
	function onPointerUp() {
		const wasArmed = armed.current;
		const wasMoved = moved.current;
		clearTimer();
		armed.current = false;
		if (wasArmed) onDrop?.();
		if (!wasMoved && !wasArmed) onTap?.();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		style: {
			...style,
			transform: `translate3d(${x}px, ${y}px, 0)`
		},
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel: onPointerUp,
		children
	});
}
function ModelCard({ id, lifted }) {
	const model = MODELS.find((x) => x.id === id);
	const conv = useAether((s) => s.conversations[id]);
	const dragging = useAether((s) => s.draggingCardId === id);
	const thread = (conv?.messages ?? []).slice(-8);
	if (!model) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `model-card${lifted || dragging ? " lifted" : ""}`,
		style: { ["--card-accent"]: model.accent },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "card-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "card-name",
				children: model.name
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card-log",
			children: thread.length ? thread.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `card-mini ${msg.role === "user" ? "you" : "them"}`,
				children: msg.text
			}, msg.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "card-empty",
				children: "Tap to start a conversation."
			})
		})]
	});
}
function CardCanvas() {
	const layout = useAether((s) => s.cardLayout);
	const enabled = useAether((s) => s.enabledModelIds);
	const rows = useAether((s) => s.cardRows);
	const draggingId = useAether((s) => s.draggingCardId);
	const setDraggingCard = useAether((s) => s.setDraggingCard);
	const alignRequest = useAether((s) => s.alignRequest);
	const moveCard = useAether((s) => s.moveCard);
	const setCardLayout = useAether((s) => s.setCardLayout);
	const openCard = useAether((s) => s.openCard);
	const cards = layout.filter((c) => enabled.includes(c.id));
	const host = (0, import_react.useRef)(null);
	const prevRows = (0, import_react.useRef)(rows);
	const prevCount = (0, import_react.useRef)(cards.length);
	const [box, setBox] = (0, import_react.useState)({
		w: 0,
		h: 0
	});
	(0, import_react.useEffect)(() => {
		const el = host.current;
		if (!el) return;
		const apply = () => {
			const w = Math.round(el.clientWidth);
			const h = Math.round(el.clientHeight);
			if (w < 40 || h < 40) return;
			setBox((prev) => prev.w === w && prev.h === h ? prev : {
				w,
				h
			});
		};
		apply();
		const ro = new ResizeObserver(apply);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	const fallback = box.w < 40 ? {
		w: 360,
		h: 640
	} : box;
	const m = metrics(fallback.w, fallback.h, rows, cards.length);
	(0, import_react.useEffect)(() => {
		if (box.w < 40) return;
		setCardLayout(cards.map((c, i) => {
			const cell = cellForIndex(i, rows, m);
			if (!alignRequest && cards.length && c.x !== 0 && c.y !== 0 && prevRows.current === rows && prevCount.current === cards.length) return c;
			return {
				id: c.id,
				x: cell.x,
				y: cell.y
			};
		}));
		prevRows.current = rows;
		prevCount.current = cards.length;
	}, [
		box.w,
		box.h,
		rows,
		cards.length,
		alignRequest
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: host,
		className: `card-canvas${draggingId ? " rearranging" : ""}`,
		children: cards.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-full items-center justify-center px-8 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "empty-line",
				children: "Models, then light one."
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card-strip",
			style: {
				width: Math.max(fallback.w, m.contentW),
				height: "100%"
			},
			children: cards.map((c, i) => {
				const cell = cellForIndex(i, rows, m);
				const x = c.x || cell.x;
				const y = c.y || cell.y;
				const held = draggingId === c.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Draggable, {
					x,
					y,
					onMove: (p) => moveCard(c.id, p.x, p.y),
					armMs: 420,
					onArm: () => setDraggingCard(c.id),
					onDrop: () => setDraggingCard(null),
					onTap: () => openCard(c.id),
					className: "card-slot",
					style: {
						width: m.cardW,
						height: m.cardH,
						zIndex: held ? 8 : 1
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelCard, {
						id: c.id,
						lifted: held
					})
				}, c.id);
			})
		})
	});
}
function ContextMenu({ x, y, items, onClose }) {
	(0, import_react.useEffect)(() => {
		const close = () => onClose();
		window.addEventListener("pointerdown", close);
		return () => window.removeEventListener("pointerdown", close);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ctx-menu",
		style: {
			left: x,
			top: y
		},
		onPointerDown: (e) => e.stopPropagation(),
		children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: it.danger ? "danger" : "",
			onClick: () => {
				it.onSelect();
				onClose();
			},
			children: it.label
		}, it.id))
	});
}
function CardView() {
	const id = useAether((s) => s.cardModelId);
	const enabled = useAether((s) => s.enabledModelIds);
	const conv = useAether((s) => id ? s.conversations[id] : void 0);
	const setSurface = useAether((s) => s.setSurface);
	const openCard = useAether((s) => s.openCard);
	const hideMessage = useAether((s) => s.hideMessage);
	const close = useAether((s) => s.closeToHome);
	const model = MODELS.find((m) => m.id === id);
	const [ctx, setCtx] = (0, import_react.useState)(null);
	const [slide, setSlide] = (0, import_react.useState)(null);
	const hold = (0, import_react.useRef)(null);
	const start = (0, import_react.useRef)({
		x: 0,
		y: 0,
		scroll: 0
	});
	const scrolled = (0, import_react.useRef)(false);
	const list = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") close();
			if (e.key === "ArrowLeft") step(-1);
			if (e.key === "ArrowRight") step(1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		id,
		enabled,
		close
	]);
	if (!model || !id) return null;
	const messages = conv?.messages ?? [];
	function step(dir) {
		if (!id) return;
		const i = enabled.indexOf(id);
		if (i < 0 || enabled.length < 2) return;
		const next = enabled[(i + dir + enabled.length) % enabled.length];
		setSlide(dir === 1 ? "left" : "right");
		window.setTimeout(() => {
			openCard(next);
			setSlide(null);
		}, 160);
	}
	function openMenu(x, y, msgId, text) {
		setCtx({
			x,
			y,
			items: [{
				id: "copy",
				label: "Copy",
				onSelect: () => navigator.clipboard.writeText(text)
			}, {
				id: "hide",
				label: "Hide",
				danger: true,
				onSelect: () => hideMessage(id, msgId)
			}]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `card-view${slide ? ` slide-${slide}` : ""}`,
		style: { ["--card-accent"]: model.accent },
		onPointerDown: (e) => {
			start.current = {
				x: e.clientX,
				y: e.clientY,
				scroll: list.current?.scrollTop ?? 0
			};
			scrolled.current = false;
		},
		onPointerMove: () => {
			if (list.current && Math.abs(list.current.scrollTop - start.current.scroll) > 8) scrolled.current = true;
		},
		onPointerUp: (e) => {
			const dx = e.clientX - start.current.x;
			const dy = e.clientY - start.current.y;
			const absX = Math.abs(dx);
			const absY = Math.abs(dy);
			if (absX < 56 && absY < 72) return;
			if (absX > absY * 1.15) {
				step(dx < 0 ? 1 : -1);
				return;
			}
			if (!scrolled.current && absY > 72) close();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "card-view-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "card-view-title",
					children: model.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						label: "Files",
						onClick: () => setSurface("files"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { size: 16 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						label: "History",
						onClick: () => setSurface("history"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { size: 16 })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: list,
				className: "quiet-scroll card-view-thread",
				children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: m.role === "user" ? "ml-8" : "mr-6",
					onContextMenu: (e) => {
						e.preventDefault();
						openMenu(e.clientX, e.clientY, m.id, m.text);
					},
					onPointerDown: () => {
						hold.current = window.setTimeout(() => openMenu(start.current.x, start.current.y, m.id, m.text), 420);
					},
					onPointerUp: () => {
						if (hold.current) window.clearTimeout(hold.current);
					},
					onPointerMove: () => {
						if (hold.current) window.clearTimeout(hold.current);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: m.role === "user" ? "bubble you" : "bubble",
						children: [m.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: m.imageUrl,
							alt: "",
							className: "mb-2 w-full rounded-[12px] object-cover"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap text-[14px] leading-relaxed",
							children: m.text
						})]
					})
				}, m.id))
			}),
			ctx ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextMenu, {
				...ctx,
				onClose: () => setCtx(null)
			}) : null
		]
	});
}
function IconBtn({ children, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: "icon-btn",
		children
	});
}
function WinClose({ onClick, label = "Close", corner = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: corner ? "win-x" : "win-close",
		"aria-label": label,
		onClick,
		children: corner ? "×" : null
	});
}
function PreviewStage({ title, kicker, src, video, onClose, actions, related = [], onRelated, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "f1-stage",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WinClose, {
			corner: true,
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "f1-hero",
			children: [video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: video,
				poster: src,
				autoPlay: true,
				muted: true,
				loop: true,
				playsInline: true
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: ""
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "f1-veil",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "f1-kicker",
						children: kicker
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "f1-title",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "f1-actions",
						children: actions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `f1-act${a.primary ? " primary" : ""}${a.danger ? " danger" : ""}`,
							onClick: a.onClick,
							children: a.label
						}, a.id))
					}),
					children,
					related.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "f1-related",
						"aria-label": "More in view",
						children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "f1-rel",
							onClick: () => onRelated?.(r.id),
							"aria-label": r.title || "Related",
							children: r.video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: r.video,
								poster: r.src,
								muted: true,
								playsInline: true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: r.src,
								alt: ""
							})
						}, r.id))
					}) : null
				]
			})]
		})]
	});
}
function FilesView() {
	const files = useAether((s) => s.files);
	const remove = useAether((s) => s.removeFile);
	const query = useAether((s) => s.filesQuery);
	const setQuery = useAether((s) => s.setFilesQuery);
	const group = useAether((s) => s.filesGroup);
	const setGroup = useAether((s) => s.setFilesGroup);
	const previewId = useAether((s) => s.previewFileId);
	const setPreview = useAether((s) => s.setPreviewFile);
	const addFile = useAether((s) => s.addFile);
	const q = query.trim().toLowerCase();
	const scoped = files.filter((f) => {
		if (!f.preview) return false;
		if (!q) return true;
		return f.name.toLowerCase().includes(q) || f.kind.includes(q);
	});
	const open = files.find((f) => f.id === previewId) ?? null;
	const buckets = group === "days" ? groupByDay(scoped) : groupByYear(scoped);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "gallery-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "pin-search",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "pin-search-field",
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search files"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "imagine-tabs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: group === "years" ? "on" : "",
					onClick: () => setGroup("years"),
					children: "Years"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: group === "days" ? "on" : "",
					onClick: () => setGroup("days"),
					children: "Days"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mem-scroll",
				children: buckets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "empty-line",
					children: "Nothing filed."
				}) : buckets.map(([label, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "years-block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "years-label",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "years-grid",
						children: list.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: `years-tile${i % 5 === 2 ? " wide" : ""}`,
							onClick: () => setPreview(f.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: f.preview,
								alt: ""
							}), f.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "play-mark" }) : null]
						}, f.id))
					})]
				}, label))
			}),
			open?.preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewStage, {
				title: open.name.replace(/\.[^.]+$/, ""),
				kicker: MODELS.find((m) => m.id === open.modelId)?.name ?? open.kind,
				src: open.preview,
				onClose: () => setPreview(null),
				actions: [{
					id: "keep",
					label: "Duplicate",
					primary: true,
					onClick: () => addFile({
						...open,
						id: uid("f"),
						name: open.name.replace(/(\.[^.]+)?$/, " copy$1"),
						createdAt: Date.now()
					})
				}, {
					id: "rm",
					label: "Delete",
					danger: true,
					onClick: () => remove(open.id)
				}],
				related: scoped.filter((f) => f.id !== open.id && f.preview).slice(0, 8).map((f) => ({
					id: f.id,
					src: f.preview,
					title: f.name
				})),
				onRelated: setPreview
			}) : null
		]
	});
}
function groupByYear(files) {
	const map = /* @__PURE__ */ new Map();
	for (const f of files) {
		const y = String(new Date(f.createdAt).getFullYear());
		const list = map.get(y) ?? [];
		list.push(f);
		map.set(y, list);
	}
	return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
}
function groupByDay(files) {
	const map = /* @__PURE__ */ new Map();
	for (const f of files) {
		const label = new Date(f.createdAt).toLocaleDateString(void 0, {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
		const list = map.get(label) ?? [];
		list.push(f);
		map.set(label, list);
	}
	return [...map.entries()].sort((a, b) => {
		const ta = files.find((f) => a[1].includes(f))?.createdAt ?? 0;
		return (files.find((f) => b[1].includes(f))?.createdAt ?? 0) - ta;
	});
}
function HistoryView() {
	const conversations = useAether((s) => s.conversations);
	const openCard = useAether((s) => s.openCard);
	const rows = Object.values(conversations).filter((c) => c.messages.length).sort((a, b) => (b.messages.at(-1)?.createdAt ?? 0) - (a.messages.at(-1)?.createdAt ?? 0));
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "empty-line",
		children: "No threads yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: rows.map((c) => {
		const model = MODELS.find((m) => m.id === c.modelId);
		const last = c.messages.at(-1);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "list-row",
			onClick: () => openCard(c.modelId),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "list-kind",
				children: model?.short.slice(0, 1)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "list-main",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: model?.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "list-sub line-clamp-1",
					children: last?.text
				})]
			})]
		}, c.modelId);
	}) });
}
function ThemeView() {
	const tab = useAether((s) => s.themeMarketTab);
	const setTab = useAether((s) => s.setThemeMarketTab);
	const tier = useAether((s) => s.tier);
	const purchased = useAether((s) => s.purchasedWallpaperIds);
	const wallpaperId = useAether((s) => s.wallpaperId);
	const setWallpaper = useAether((s) => s.setWallpaper);
	const exploded = useAether((s) => s.explodedWallpaperId);
	const setExploded = useAether((s) => s.setExplodedWallpaper);
	const purchase = useAether((s) => s.purchaseWallpaper);
	const setTrackIndex = useAether((s) => s.setTrackIndex);
	const setPlaying = useAether((s) => s.setPlaying);
	const setMusicOpen = useAether((s) => s.setMusicOpen);
	const setSurface = useAether((s) => s.setSurface);
	const swipe = (0, import_react.useRef)({
		x: 0,
		t: 0
	});
	const [q, setQ] = (0, import_react.useState)("");
	const marketLocked = tab === 1 && !(tier !== "free");
	const list = (tab === 0 ? WALLPAPERS.filter((w) => !w.premium || purchased.includes(w.id)) : WALLPAPERS.filter((w) => w.premium)).filter((w) => !q.trim() || w.name.toLowerCase().includes(q.toLowerCase()) || w.category.toLowerCase().includes(q.toLowerCase()));
	const open = WALLPAPERS.find((w) => w.id === exploded);
	const onPointerDown = (e) => {
		swipe.current = {
			x: e.clientX,
			t: Date.now()
		};
	};
	const onPointerUp = (e) => {
		const dx = e.clientX - swipe.current.x;
		if (Math.abs(dx) < 56 || Date.now() - swipe.current.t > 600) return;
		if (dx < 0 && tab === 0) setTab(1);
		if (dx > 0 && tab === 1) setTab(0);
	};
	function listen(w, i = 0) {
		setWallpaper(w.id);
		setTrackIndex(i);
		setMusicOpen(true);
		setPlaying(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "gallery-wrap",
		onPointerDown,
		onPointerUp,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chip-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `chip${tab === 0 ? " on" : ""}`,
					onClick: () => setTab(0),
					children: "Selector"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `chip${tab === 1 ? " on" : ""}`,
					onClick: () => setTab(1),
					children: "Store"
				})]
			}),
			tab === 1 && !marketLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "pin-search",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "pin-search-field",
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search live wallpapers"
				})]
			}) : null,
			marketLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "gate",
				onClick: () => setSurface("upgrade"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Store needs a paid plan. Wallpapers you own stay in Themes." })]
			}) : open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewStage, {
				title: open.name,
				kicker: open.premium ? open.price ?? "Live" : open.category,
				src: open.src,
				video: open.video,
				onClose: () => setExploded(null),
				actions: [{
					id: "set",
					label: wallpaperId === open.id ? "Current" : "Set wallpaper",
					primary: true,
					onClick: () => {
						if (open.premium && !purchased.includes(open.id)) purchase(open.id);
						setWallpaper(open.id);
						setExploded(null);
					}
				}, ...open.tracks.length ? [{
					id: "listen",
					label: "Listen",
					onClick: () => listen(open)
				}] : []],
				related: list.filter((w) => w.id !== open.id).slice(0, 8).map((w) => ({
					id: w.id,
					src: w.src,
					video: w.video,
					title: w.name
				})),
				onRelated: setExploded,
				children: open.tracks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "f1-tracks",
					children: open.tracks.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "f1-track",
						onClick: () => listen(open, i),
						children: t.title
					}, t.id))
				}) : null
			}) : tab === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreShelves, {
				list,
				wallpaperId,
				onOpen: (id) => {
					const w = WALLPAPERS.find((x) => x.id === id);
					if (w?.premium && !purchased.includes(w.id)) purchase(w.id);
					setExploded(id);
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YearsGallery, {
				list,
				wallpaperId,
				onPick: (w) => {
					setWallpaper(w.id);
					setExploded(w.id);
				}
			})
		]
	});
}
function YearsGallery({ list, wallpaperId, onPick }) {
	const groups = THEME_YEARS.map((year) => [year, list.filter((w) => w.category === year)]).filter(([, items]) => items.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mem-scroll",
		children: groups.map(([year, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "years-block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "years-label",
				children: year
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "years-grid",
				children: items.map((w, i) => {
					const live = wallpaperId === w.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `years-tile${i % 5 === 0 ? " wide" : ""}${live ? " live" : ""}`,
						onClick: () => onPick(w),
						children: [
							w.video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: w.video,
								poster: w.src,
								muted: true,
								loop: true,
								playsInline: true,
								autoPlay: true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: w.src,
								alt: ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "theme-tile-name",
								children: w.name
							}),
							live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "theme-live",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 11 })
							}) : null
						]
					}, w.id);
				})
			})]
		}, year))
	});
}
function StoreShelves({ list, wallpaperId, onOpen }) {
	const hero = list[0];
	const shelves = [
		{
			title: "Live wallpapers",
			items: list
		},
		{
			title: "Aurora",
			items: list.filter((w) => w.motion === "aurora")
		},
		{
			title: "Tide",
			items: list.filter((w) => w.motion === "tide")
		},
		{
			title: "Drift",
			items: list.filter((w) => w.motion === "drift")
		}
	].filter((s) => s.items.length);
	if (!hero) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "empty-line",
		children: "Nothing in the store."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mem-scroll tv-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "tv-hero",
			onClick: () => onOpen(hero.id),
			children: [hero.video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: hero.video,
				poster: hero.src,
				muted: true,
				loop: true,
				playsInline: true,
				autoPlay: true
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero.src,
				alt: ""
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tv-hero-meta",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tv-kicker",
					children: "Featured"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tv-title",
					children: hero.name
				})]
			})]
		}), shelves.map((shelf) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "tv-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: shelf.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "tv-shelf",
				children: shelf.items.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `tv-card${wallpaperId === w.id ? " live" : ""}`,
					onClick: () => onOpen(w.id),
					children: [w.video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: w.video,
						poster: w.src,
						muted: true,
						loop: true,
						playsInline: true,
						autoPlay: true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: w.src,
						alt: ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: w.name })]
				}, w.id))
			})]
		}, shelf.title))]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askModel = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("14f0d2feed25f22b6c4feeb9784f1bc07da5e951b0e138a6c68c3e05234c3dd7"));
var imagineStill = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("400b6391bce8c3acc16e7eea09f867dd0d2f5631646278ae36701e3c7fa98ff0"));
function DiscoverView() {
	const filter = useAether((s) => s.discoverFilter);
	const setFilter = useAether((s) => s.setDiscoverFilter);
	const query = useAether((s) => s.discoverQuery);
	const setQuery = useAether((s) => s.setDiscoverQuery);
	const addFile = useAether((s) => s.addFile);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [mine, setMine] = (0, import_react.useState)([]);
	const catalog = [...mine, ...DISCOVER];
	const q = query.trim().toLowerCase();
	const items = catalog.filter((d) => {
		if (filter === "photo" && d.category === "motion") return false;
		if (filter === "motion" && d.category !== "motion") return false;
		if (filter === "edit" && !mine.some((m) => m.id === d.id)) return false;
		if (q && !(d.title || "").toLowerCase().includes(q)) return false;
		return true;
	});
	const selected = items.find((i) => i.id === openId) ?? catalog.find((i) => i.id === openId) ?? null;
	async function generate(prompt) {
		const text = prompt.trim();
		if (!text || busy) return;
		setBusy(true);
		const res = await imagineStill({ data: { prompt: text } });
		setBusy(false);
		if (res.ok && res.url) {
			const id = uid("im");
			setMine((m) => [{
				id,
				src: res.url,
				title: text,
				ratio: "3/4",
				category: "photo"
			}, ...m]);
			addFile({
				id: uid("f"),
				modelId: "imagine",
				name: `${text.slice(0, 18)}.png`,
				kind: "image",
				sizeLabel: "1k",
				createdAt: Date.now(),
				preview: res.url
			});
			setDraft("");
			setOpenId(id);
		}
	}
	function attach(item) {
		addFile({
			id: uid("f"),
			modelId: "imagine",
			name: (item.title || "imagine").slice(0, 18) + ".png",
			kind: item.category === "motion" ? "video" : "image",
			sizeLabel: "1k",
			createdAt: Date.now(),
			preview: item.src
		});
		setOpenId(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "imagine-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "pin-search",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "pin-search-field",
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search Imagine"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "imagine-tabs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: filter === "all" ? "on" : "",
						onClick: () => setFilter("all"),
						children: "All"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: filter === "photo" ? "on" : "",
						onClick: () => setFilter("photo"),
						children: "Images"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: filter === "motion" ? "on" : "",
						onClick: () => setFilter("motion"),
						children: "Videos"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "imagine-masonry",
				children: items.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "imagine-tile",
					onClick: () => setOpenId(d.id),
					children: ["video" in d && d.video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: d.video,
						poster: d.src,
						muted: true,
						loop: true,
						playsInline: true,
						autoPlay: true,
						style: { aspectRatio: d.ratio ?? "3/4" }
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: d.src,
						alt: "",
						style: { aspectRatio: d.ratio ?? "3/4" }
					}), d.category === "motion" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "play-mark" }) : null]
				}, d.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "imagine-composer",
				onSubmit: (e) => {
					e.preventDefault();
					generate(draft);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: busy ? "Making…" : "What do you want to imagine?",
					disabled: busy
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "send-btn",
					disabled: busy || !draft.trim(),
					"aria-label": "Generate",
					children: "↑"
				})]
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewStage, {
				title: selected.title || "Untitled still",
				kicker: selected.category === "motion" ? "Video" : "Image",
				src: selected.src,
				video: selected.video,
				onClose: () => setOpenId(null),
				actions: [
					{
						id: "remix",
						label: "Remix",
						primary: true,
						onClick: () => {
							setDraft(selected.title ? `Remix: ${selected.title}` : "Remix this still, keep the subject, new light");
							setOpenId(null);
						}
					},
					{
						id: "video",
						label: "Video",
						onClick: () => {
							setFilter("motion");
							setDraft(selected.title ? `Make a video of ${selected.title}` : "Make a short video of this");
							setOpenId(null);
						}
					},
					{
						id: "attach",
						label: "Attach",
						onClick: () => attach(selected)
					}
				],
				related: items.filter((i) => i.id !== selected.id).slice(0, 8).map((i) => ({
					id: i.id,
					src: i.src,
					video: i.video,
					title: i.title
				})),
				onRelated: setOpenId
			}) : null
		]
	});
}
var FEATURES = {
	free: ["Six general models", "Unlimited general chat"],
	pro: [
		"All general models",
		"Image, audio, video, coding",
		"3,000 credits / month"
	],
	elite: [
		"Flagship models",
		"Live wallpapers",
		"7,500 credits / month"
	]
};
function UpgradeView() {
	const tier = useAether((s) => s.tier);
	const setTier = useAether((s) => s.setTier);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "plan-stack",
		children: [[
			"free",
			"pro",
			"elite"
		].map((id) => {
			const info = TIER_INFO[id];
			const current = id === tier;
			const featured = id === "pro";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: `plan-card${current ? " on" : ""}${featured ? " hot" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "plan-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "plan-name",
							children: info.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "plan-price",
							children: [info.price === "$0" ? "Included" : info.price.replace("/mo", ""), info.price.includes("/mo") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: " /mo" }) : null]
						})] }), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "plan-badge",
							children: "Active"
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "plan-features",
						children: FEATURES[id].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: f }, f))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `plan-cta${featured && !current ? " lit" : ""}`,
						disabled: current,
						onClick: () => setTier(id),
						children: current ? "Current" : `Upgrade to ${info.label}`
					})
				]
			}, id);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "plan-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "plan-head",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "plan-name",
					children: "Enterprise"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "plan-price",
					children: "Custom"
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "plan-features",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Dedicated hosting" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "SLA and a named manager" })]
			})]
		})]
	});
}
function SmartGenView() {
	const page = useAether((s) => s.smartPage);
	const setPage = useAether((s) => s.setSmartPage);
	const tabsAt = useAether((s) => s.smartTabsAt);
	const setTabsAt = useAether((s) => s.setSmartTabsAt);
	const cards = useAether((s) => s.smartCards);
	const openId = useAether((s) => s.smartOpenId);
	const setOpen = useAether((s) => s.setSmartOpen);
	const moveLane = useAether((s) => s.moveSmartLane);
	const remove = useAether((s) => s.removeSmartCard);
	const open = cards.find((c) => c.id === openId) ?? null;
	const nav = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "smart-nav",
		children: [SMART_PAGES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: page === p.id ? "on" : "",
			onClick: () => setPage(p.id),
			children: p.label
		}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: `smart-pin${tabsAt === "bottom" ? " on" : ""}`,
			"aria-label": tabsAt === "top" ? "Freeze tabs at the bottom" : "Freeze tabs at the top",
			onClick: () => setTabsAt(tabsAt === "top" ? "bottom" : "top"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { size: 12 })
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `smart-shell tabs-${tabsAt}`,
		children: [
			tabsAt === "top" ? nav : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "smart-body",
				children: [
					page === "cards" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardsPage, {
						cards,
						onOpen: setOpen
					}) : null,
					page === "boards" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardsPage, {
						cards,
						onOpen: setOpen,
						onLane: moveLane
					}) : null,
					page === "canvas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasPage, {
						cards,
						onOpen: setOpen
					}) : null,
					page === "genie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeniePage, {}) : null
				]
			}),
			tabsAt === "bottom" ? nav : null,
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewStage, {
				title: open.title,
				kicker: open.kind,
				src: open.preview || "/imagine/glass.jpg",
				onClose: () => setOpen(null),
				actions: [
					{
						id: "next",
						label: "Advance",
						primary: true,
						onClick: () => {
							const next = SMART_LANES[(SMART_LANES.findIndex((l) => l.id === open.lane) + 1) % SMART_LANES.length];
							moveLane(open.id, next.id);
						}
					},
					{
						id: "board",
						label: "Board",
						onClick: () => {
							setOpen(null);
							setPage("boards");
						}
					},
					{
						id: "rm",
						label: "Delete",
						danger: true,
						onClick: () => remove(open.id)
					}
				],
				related: cards.filter((c) => c.id !== open.id && c.preview).slice(0, 6).map((c) => ({
					id: c.id,
					src: c.preview,
					title: c.title
				})),
				onRelated: setOpen,
				children: open.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "f1-body",
					children: open.body
				}) : null
			}) : null
		]
	});
}
function CardsPage({ cards, onOpen }) {
	const groups = groupByKind(cards);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mem-scroll",
		children: groups.map(([kind, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "years-block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "years-label",
				children: labelKind(kind)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mem-grid",
				children: list.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `mem-card${i % 5 === 0 ? " wide" : ""}`,
					onClick: () => onOpen(c.id),
					children: [c.preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.preview,
						alt: ""
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mem-blank",
						children: c.kind
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mem-cap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.lane })]
					})]
				}, c.id))
			})]
		}, kind))
	});
}
function BoardsPage({ cards, onOpen, onLane }) {
	const [hold, setHold] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "board-track",
		children: SMART_LANES.map((lane) => {
			const list = cards.filter((c) => c.lane === lane.id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "board-lane",
				onPointerUp: () => {
					if (hold) onLane(hold, lane.id);
					setHold(null);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "board-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: lane.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: list.length })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "board-stack",
					children: list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `board-card${hold === c.id ? " lifting" : ""}`,
						onPointerDown: () => setHold(c.id),
						onClick: () => onOpen(c.id),
						children: [
							c.preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.preview,
								alt: ""
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "board-title",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "board-kind",
								children: c.kind
							})
						]
					}, c.id))
				})]
			}, lane.id);
		})
	});
}
function CanvasPage({ cards, onOpen }) {
	const place = useAether((s) => s.placeSmartCard);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "smart-canvas",
		children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Draggable, {
			x: c.x,
			y: c.y,
			armMs: 180,
			onMove: (p) => place(c.id, p.x, p.y),
			onTap: () => onOpen(c.id),
			className: "canvas-card",
			children: [c.preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: c.preview,
				alt: ""
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mem-blank",
				children: c.kind
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.title })]
		}, c.id))
	});
}
function GeniePage() {
	const add = useAether((s) => s.addSmartCard);
	const [kind, setKind] = (0, import_react.useState)("memory");
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const picked = SMART_KINDS.find((k) => k.id === kind);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "genie-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "genie-kicker",
				children: "Pop a card"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "genie-hint",
				children: picked.hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "genie-kinds",
				children: SMART_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: kind === k.id ? "on" : "",
					onClick: () => setKind(k.id),
					children: k.label
				}, k.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "pin-search-field",
				value: title,
				onChange: (e) => setTitle(e.target.value),
				placeholder: "Title"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "genie-body",
				value: body,
				onChange: (e) => setBody(e.target.value),
				placeholder: "What belongs on this card",
				rows: 4
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "genie-pop",
				onClick: () => {
					const name = title.trim() || `New ${picked.label.toLowerCase()}`;
					add({
						id: uid("sm"),
						kind,
						title: name,
						body: body.trim(),
						lane: "inbox",
						preview: kind === "memory" || kind === "artifact" ? "/imagine/glass.jpg" : void 0
					});
					setTitle("");
					setBody("");
				},
				children: "Pop out"
			})
		]
	});
}
function groupByKind(cards) {
	return [
		"memory",
		"artifact",
		"task",
		"note"
	].map((k) => [k, cards.filter((c) => c.kind === k)]).filter(([, list]) => list.length);
}
function labelKind(kind) {
	return SMART_KINDS.find((k) => k.id === kind)?.label ?? kind;
}
function RegionTag({ label, style }) {
	if (!useAether((s) => s.guideOn)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "guide-tag",
		style,
		children: label
	});
}
function SettingsOrb() {
	const open = useAether((s) => s.settingsOpen);
	const setOpen = useAether((s) => s.setSettingsOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "settings-orb glass-ornament gaze-scale",
		"aria-label": "Settings",
		"aria-pressed": open,
		onClick: () => setOpen(!open),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegionTag, {
			label: "Settings orb",
			style: {
				top: -26,
				left: 0
			}
		})]
	});
}
var APPS = [
	{
		id: "files",
		label: "Files",
		icon: Folder
	},
	{
		id: "history",
		label: "History",
		icon: History
	},
	{
		id: "themes",
		tab: 0,
		label: "Themes",
		icon: Palette
	},
	{
		id: "discover",
		label: "Imagine",
		icon: Image
	},
	{
		id: "smart",
		label: "Smart",
		icon: LayoutGrid
	}
];
function SettingsPane() {
	const open = useAether((s) => s.settingsOpen);
	const setOpen = useAether((s) => s.setSettingsOpen);
	const category = useAether((s) => s.modelCategory);
	const pos = useAether((s) => s.settingsPos);
	const setPos = useAether((s) => s.setSettingsPos);
	const [pane, setPane] = (0, import_react.useState)("apps");
	(0, import_react.useEffect)(() => {
		if (open) setPane("apps");
	}, [open]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Draggable, {
		x: pos.x,
		y: pos.y,
		onMove: setPos,
		handleSelector: ".alert-grip",
		className: `alert-card${pane === "models" ? " models" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "alert-grip",
				"data-drag-handle": true,
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "alert-tabs",
				children: [
					"account",
					"models",
					"settings"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `alert-tab${pane === t ? " on" : ""}`,
					onClick: () => setPane(t),
					children: t[0].toUpperCase() + t.slice(1)
				}, t))
			}),
			pane === "apps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppsTab, { onClose: () => setOpen(false) }) : null,
			pane === "account" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountTab, {}) : null,
			pane === "models" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelsTab, {}, category) : null,
			pane === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsTabView, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "alert-cancel",
				onClick: () => setOpen(false),
				children: "Cancel"
			})
		]
	});
}
function AppsTab({ onClose }) {
	const setSurface = useAether((s) => s.setSurface);
	const setThemeTab = useAether((s) => s.setThemeMarketTab);
	const tier = useAether((s) => s.tier);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "alert-body apps-grid",
		children: [APPS.map((a) => {
			const Icon = a.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "app-icon",
				onClick: () => {
					if (a.tab !== void 0) setThemeTab(a.tab);
					onClose();
					setSurface(a.id);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.label })]
			}, a.label);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "app-icon",
			onClick: () => {
				onClose();
				if (tier === "free") setSurface("upgrade");
				else {
					setThemeTab(1);
					setSurface("themes");
				}
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Store" })]
		})]
	});
}
function AccountTab() {
	const tier = useAether((s) => s.tier);
	const setSurface = useAether((s) => s.setSurface);
	const setSettingsOpen = useAether((s) => s.setSettingsOpen);
	const info = TIER_INFO[tier];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "alert-body",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "alert-title",
				children: info.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "alert-desc",
				children: info.price === "$0" ? "General chat" : info.price
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "alert-action",
				onClick: () => {
					setSettingsOpen(false);
					setSurface("upgrade");
				},
				children: tier === "elite" ? "Manage" : "Upgrade"
			})
		]
	});
}
function ModelsTab() {
	const category = useAether((s) => s.modelCategory);
	const setCategory = useAether((s) => s.setModelCategory);
	const tier = useAether((s) => s.tier);
	const enabled = useAether((s) => s.enabledModelIds);
	const toggle = useAether((s) => s.toggleModel);
	const setSurface = useAether((s) => s.setSurface);
	const setUpgradeFromLock = useAether((s) => s.setUpgradeFromLock);
	const setSettingsOpen = useAether((s) => s.setSettingsOpen);
	const requestAlign = useAether((s) => s.requestAlign);
	const [openCat, setOpenCat] = (0, import_react.useState)(false);
	const [dying, setDying] = (0, import_react.useState)(null);
	const groups = groupByTier(MODELS.filter((m) => m.category === category));
	function onToggle(id) {
		if (enabled.includes(id)) {
			setDying(id);
			window.setTimeout(() => {
				toggle(id);
				setDying(null);
			}, 320);
		} else toggle(id);
	}
	function lockedTap() {
		setUpgradeFromLock(true);
		setSettingsOpen(false);
		setSurface("upgrade");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "alert-body",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "alert-row",
				onClick: () => requestAlign(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Align" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "alert-row cat-row",
				onClick: () => setOpenCat((v) => !v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: CATEGORIES.find((c) => c.id === category)?.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 14 })]
			}),
			openCat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "alert-menu",
				children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "alert-row",
					onClick: () => {
						setCategory(c.id);
						setOpenCat(false);
					},
					children: c.label
				}, c.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierGrid, {
				title: "Free",
				band: "free",
				models: groups.free,
				locked: false,
				enabled,
				dying,
				onToggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierGrid, {
				title: "Pro",
				band: "pro",
				models: groups.pro,
				locked: tier === "free",
				enabled,
				dying,
				onToggle,
				onLocked: lockedTap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierGrid, {
				title: "Elite",
				band: "elite",
				models: groups.elite,
				locked: tier !== "elite",
				enabled,
				dying,
				onToggle,
				onLocked: lockedTap
			})
		]
	});
}
function TierGrid({ title, band, models, locked, enabled, dying, onToggle, onLocked }) {
	if (!models.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `tier-band ${band}${locked ? " locked" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "tier-kicker",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "model-grid",
				children: models.map((m) => {
					const on = enabled.includes(m.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `model-chip${on ? " on" : ""}${dying === m.id ? " dying" : ""}`,
						style: on ? {
							background: m.accent,
							color: "#fff",
							["--chip-accent"]: m.accent
						} : { ["--chip-accent"]: m.accent },
						onClick: () => onToggle(m.id),
						children: m.short
					}, m.id);
				})
			}),
			locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "tier-lock",
				onClick: onLocked,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 16 })
			}) : null
		]
	});
}
function SettingsTabView() {
	const hideOnSend = useAether((s) => s.hidePromptOnSend);
	const setHideOnSend = useAether((s) => s.setHidePromptOnSend);
	const hideIdle = useAether((s) => s.hidePromptAfterIdle);
	const setHideIdle = useAether((s) => s.setHidePromptAfterIdle);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "alert-body",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "alert-row",
			onClick: () => setHideOnSend(!hideOnSend),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tuck after send" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "alert-val",
				children: hideOnSend ? "On" : "Off"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "alert-row",
			onClick: () => setHideIdle(!hideIdle),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tuck when idle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "alert-val",
				children: hideIdle ? "On" : "Off"
			})]
		})]
	});
}
function PromptOrb() {
	const open = useAether((s) => s.promptOpen);
	const setPromptOpen = useAether((s) => s.setPromptOpen);
	if (open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "prompt-orb",
		"aria-label": "Summon prompt",
		onClick: () => setPromptOpen(true),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orb-sphere" })
	});
}
var INVESTIGATION = [
	{
		id: "web",
		label: "Web search",
		Icon: Globe
	},
	{
		id: "research",
		label: "Research",
		Icon: FileText
	},
	{
		id: "deep",
		label: "Deep research",
		Icon: Library
	}
];
function PromptBar() {
	const open = useAether((s) => s.promptOpen);
	const text = useAether((s) => s.promptText);
	const setText = useAether((s) => s.setPromptText);
	const setOpen = useAether((s) => s.setPromptOpen);
	const sending = useAether((s) => s.sending);
	const idle = useAether((s) => s.hidePromptAfterIdle);
	const investigation = useAether((s) => s.investigation);
	const setInvestigation = useAether((s) => s.setInvestigation);
	const inputRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const idleTimer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) inputRef.current?.focus();
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, setOpen]);
	(0, import_react.useEffect)(() => {
		if (!open || !idle) return;
		const bump = () => {
			if (idleTimer.current) window.clearTimeout(idleTimer.current);
			idleTimer.current = window.setTimeout(() => setOpen(false), 3e3);
		};
		bump();
		const el = inputRef.current;
		el?.addEventListener("input", bump);
		el?.addEventListener("focus", bump);
		return () => {
			if (idleTimer.current) window.clearTimeout(idleTimer.current);
			el?.removeEventListener("input", bump);
			el?.removeEventListener("focus", bump);
		};
	}, [
		open,
		idle,
		setOpen,
		text
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: `prompt-bar glass-ornament${open ? " open" : ""}`,
		onSubmit: (e) => {
			e.preventDefault();
			sendPrompt();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegionTag, {
				label: "Prompt bar · bottom ornament",
				style: {
					top: -22,
					left: 8
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/*",
				hidden: true,
				onChange: (e) => {
					const file = e.target.files?.[0];
					e.target.value = "";
					if (!file) return;
					const reader = new FileReader();
					reader.onload = () => {
						const url = String(reader.result || "");
						if (url) useAether.getState().addFile({
							id: uid("f"),
							modelId: "prompt",
							name: file.name,
							kind: "image",
							sizeLabel: "1k",
							createdAt: Date.now(),
							preview: url
						});
					};
					reader.readAsDataURL(file);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "prompt-plus",
				"aria-label": "Attach",
				onClick: () => fileRef.current?.click(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 18 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				value: text,
				placeholder: sending ? "" : "Message",
				onChange: (e) => setText(e.target.value),
				disabled: sending
			}),
			INVESTIGATION.map((opt) => {
				const Icon = opt.Icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `probe${investigation === opt.id ? " on" : ""}`,
					"aria-label": opt.label,
					"aria-pressed": investigation === opt.id,
					onClick: () => setInvestigation(opt.id),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 })
				}, opt.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				className: "send-btn",
				"aria-label": "Send",
				disabled: sending || !text.trim(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { size: 18 })
			})
		]
	});
}
async function sendPrompt() {
	const s = useAether.getState();
	const text = s.promptText.trim();
	if (!text || s.sending) return;
	const payload = (s.investigation === "web" ? "Web search. " : s.investigation === "research" ? "Research report. " : s.investigation === "deep" ? "Deep research with sources. " : "") + text;
	s.setSending(true);
	s.flashSend();
	s.setPromptText("");
	if (s.hidePromptOnSend) s.setPromptOpen(false);
	const targets = s.surface === "card" && s.cardModelId ? [s.cardModelId] : s.enabledModelIds.slice(0, 6);
	for (const id of targets) s.addMessage(id, {
		id: uid("u"),
		role: "user",
		text,
		createdAt: Date.now()
	});
	s.bumpStat("messages", targets.length);
	await Promise.all(targets.map(async (id) => {
		const model = MODELS.find((m) => m.id === id);
		if (!model) return;
		const history = (s.conversations[id]?.messages ?? []).slice(-8).map((m) => ({
			role: m.role,
			content: m.text
		}));
		history.push({
			role: "user",
			content: payload
		});
		if (model.kind === "image") {
			const res = await imagineStill({ data: { prompt: payload } });
			if (res.ok && res.url) {
				s.addMessage(id, {
					id: uid("a"),
					role: "assistant",
					text: "Still from the brief.",
					imageUrl: res.url,
					createdAt: Date.now()
				});
				s.addFile({
					id: uid("f"),
					modelId: id,
					name: `${model.short.toLowerCase()}-${Date.now().toString().slice(-4)}.png`,
					kind: "image",
					sizeLabel: "1k",
					createdAt: Date.now(),
					preview: res.url
				});
				s.bumpStat("images");
			} else s.addMessage(id, {
				id: uid("a"),
				role: "assistant",
				text: res.ok ? "No still returned." : res.error,
				createdAt: Date.now()
			});
			return;
		}
		if (model.kind === "audio" || model.kind === "video") {
			s.addMessage(id, {
				id: uid("a"),
				role: "assistant",
				text: model.kind === "audio" ? "A short bed is queued in Files — a low tone under the last line." : "A five-second clip is queued in Files. Open it from the card.",
				createdAt: Date.now()
			});
			s.addFile({
				id: uid("f"),
				modelId: id,
				name: `${model.short.toLowerCase()}-clip.${model.kind === "audio" ? "wav" : "mp4"}`,
				kind: model.kind,
				sizeLabel: "queued",
				createdAt: Date.now()
			});
			return;
		}
		const res = await askModel({ data: {
			modelId: id,
			persona: `${model.name} — ${model.blurb}`,
			messages: history
		} });
		s.addMessage(id, {
			id: uid("a"),
			role: "assistant",
			text: res.ok ? res.text : res.error,
			createdAt: Date.now()
		});
	}));
	useAether.getState().setSending(false);
}
function ConsensusPreview() {
	const promptOpen = useAether((s) => s.promptOpen);
	const open = useAether((s) => s.consensusOpen);
	const setOpen = useAether((s) => s.setConsensusOpen);
	const enabled = useAether((s) => s.enabledModelIds);
	const convs = useAether((s) => s.conversations);
	const startY = (0, import_react.useRef)(0);
	const voices = enabled.map((id) => {
		const model = MODELS.find((m) => m.id === id);
		const last = convs[id]?.messages.filter((m) => m.role === "assistant").at(-1);
		if (!last?.text || !model) return null;
		return {
			id,
			name: model.name,
			short: model.short,
			accent: model.accent,
			text: last.text
		};
	}).filter(Boolean);
	const lead = voices[0];
	if (!promptOpen && !open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [promptOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "consensus-card",
		onClick: () => {
			if (voices.length) setOpen(true);
		},
		children: lead ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "consensus-name",
			style: { color: lead.accent },
			children: lead.name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "consensus-line",
			children: lead.text
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "consensus-line",
			children: "Consensus fills in after a reply."
		})
	}) : null, open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "consensus-root",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "sheet-scrim",
			"aria-label": "Dismiss",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "consensus-map",
			onPointerDown: (e) => {
				startY.current = e.clientY;
				e.currentTarget.setPointerCapture(e.pointerId);
			},
			onPointerUp: (e) => {
				if (e.clientY - startY.current > 72) setOpen(false);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "consensus-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Consensus" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WinClose, { onClick: () => setOpen(false) })]
			}), voices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "consensus-node",
				style: { ["--node-accent"]: s.accent },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					style: { color: s.accent },
					children: s.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.text })]
			}, s.id))]
		})]
	}) : null] });
}
function MusicPlayer() {
	const open = useAether((s) => s.musicOpen);
	const pos = useAether((s) => s.musicPos);
	const setPos = useAether((s) => s.setMusicPos);
	const playing = useAether((s) => s.playing);
	const setPlaying = useAether((s) => s.setPlaying);
	const trackIndex = useAether((s) => s.trackIndex);
	const setTrackIndex = useAether((s) => s.setTrackIndex);
	const wallpaperId = useAether((s) => s.wallpaperId);
	const setMusicOpen = useAether((s) => s.setMusicOpen);
	const paper = WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];
	const tracks = paper.tracks;
	const track = tracks.length ? tracks[trackIndex % tracks.length] : {
		id: "none",
		title: paper.name,
		artist: "",
		seconds: 0,
		src: void 0
	};
	const audio = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = audio.current ?? new Audio();
		audio.current = el;
		if (track.src) el.src = track.src;
		el.loop = true;
		if (playing && track.src) el.play().catch(() => setPlaying(false));
		else el.pause();
		return () => {
			el.pause();
		};
	}, [
		playing,
		track,
		setPlaying
	]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Draggable, {
		x: pos.x,
		y: pos.y,
		onMove: setPos,
		className: "music-widget glass-ornament",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-drag-handle": true,
			className: "flex cursor-grab gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-12 w-12 shrink-0 overflow-hidden rounded-[12px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: paper.src,
					alt: "",
					className: "h-full w-full object-cover"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-[12.5px] font-medium",
						children: track.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-[11px]",
						style: { color: "var(--color-fg-tertiary)" },
						children: track.artist
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": playing ? "Pause" : "Play",
								className: "gaze",
								style: iconBtn,
								onClick: () => setPlaying(!playing),
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { size: 13 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									size: 13,
									style: { marginLeft: 1 }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Next",
								className: "gaze",
								style: iconBtn,
								onClick: () => {
									if (!tracks.length) return;
									setTrackIndex((trackIndex + 1) % tracks.length);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { size: 13 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Hide player",
								className: "gaze ml-auto",
								style: iconBtn,
								onClick: () => setMusicOpen(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 13 })
							})
						]
					})
				]
			})]
		})
	});
}
var iconBtn = {
	width: 28,
	height: 28,
	borderRadius: 999,
	border: 0,
	background: "rgba(255,255,255,0.12)",
	color: "var(--color-fg)",
	display: "grid",
	placeItems: "center"
};
function OverlaySheet({ open, title, onClose, children, size = "list" }) {
	const [mounted, setMounted] = (0, import_react.useState)(open);
	const [shown, setShown] = (0, import_react.useState)(open);
	const startY = (0, import_react.useRef)(0);
	const dragging = (0, import_react.useRef)(false);
	const sheetRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) {
			setMounted(true);
			const id = requestAnimationFrame(() => setShown(true));
			return () => cancelAnimationFrame(id);
		}
		setShown(false);
		const t = window.setTimeout(() => setMounted(false), 480);
		return () => window.clearTimeout(t);
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!mounted) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `float-root${shown ? " open" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "sheet-scrim",
			"aria-label": "Dismiss",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: sheetRef,
			className: `float-window sheet-${size}`,
			onPointerDown: (e) => {
				const head = e.target.closest("[data-sheet-handle]");
				const rect = e.currentTarget.getBoundingClientRect();
				const fromTop = e.clientY - rect.top < 56;
				if (!head && !fromTop) return;
				dragging.current = true;
				startY.current = e.clientY;
				e.currentTarget.setPointerCapture(e.pointerId);
			},
			onPointerMove: (e) => {
				if (!dragging.current || !sheetRef.current) return;
				const dy = e.clientY - startY.current;
				sheetRef.current.style.transform = `translate(-50%, calc(-50% + ${dy}px))`;
			},
			onPointerUp: (e) => {
				if (!dragging.current || !sheetRef.current) return;
				dragging.current = false;
				const dy = e.clientY - startY.current;
				sheetRef.current.style.transform = "";
				if (dy > 72) onClose();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "float-head",
				"data-sheet-handle": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WinClose, {
					corner: true,
					onClick: onClose
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "float-title",
					children: title || "\xA0"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sheet-body",
				children
			})]
		})]
	});
}
var TABS = [
	{
		id: "files",
		label: "Files",
		icon: Folder
	},
	{
		id: "themes",
		label: "Themes",
		icon: Palette
	},
	{
		id: "discover",
		label: "Imagine",
		icon: Image
	},
	{
		id: "smart",
		label: "Smart",
		icon: LayoutGrid
	},
	{
		id: "history",
		label: "History",
		icon: History
	}
];
function EdgeNav() {
	const surface = useAether((s) => s.surface);
	const setSurface = useAether((s) => s.setSurface);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "leading-ornament glass-ornament",
		"aria-label": "Canvas",
		children: TABS.map((t) => {
			const Icon = t.icon;
			const active = surface === t.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `tab-btn${active ? " active" : ""}`,
				"aria-label": t.label,
				"aria-current": active ? "page" : void 0,
				onClick: () => setSurface(active ? "home" : t.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					size: 18,
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label",
					"aria-hidden": true,
					children: t.label
				})]
			}, t.id);
		})
	});
}
var WORKING = /* @__PURE__ */ new Set([
	"discover",
	"themes",
	"upgrade",
	"smart",
	"files"
]);
function SpatialShell() {
	const surface = useAether((s) => s.surface);
	const close = useAether((s) => s.closeToHome);
	const setSurface = useAether((s) => s.setSurface);
	const settingsOpen = useAether((s) => s.settingsOpen);
	const setSettingsOpen = useAether((s) => s.setSettingsOpen);
	const cardModelId = useAether((s) => s.cardModelId);
	const promptOpen = useAether((s) => s.promptOpen);
	const inCard = Boolean(cardModelId) && surface === "card";
	const working = WORKING.has(surface);
	const swipe = (0, import_react.useRef)({
		x: 0,
		y: 0,
		fromTop: false
	});
	function backFromSheet() {
		if (cardModelId) setSurface("card");
		else close();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `app-root${promptOpen ? " prompting" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scene",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "stage",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EdgeNav, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "window-shadow",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: `main-window glass-window${promptOpen && !working ? " tucked" : ""}${working ? " work" : ""}${inCard ? " clear" : ""}`,
								onPointerDown: (e) => {
									const rect = e.currentTarget.getBoundingClientRect();
									swipe.current = {
										x: e.clientX,
										y: e.clientY,
										fromTop: e.clientY - rect.top < 56
									};
								},
								onPointerUp: (e) => {
									if (!working || !swipe.current.fromTop) return;
									const dy = e.clientY - swipe.current.y;
									const dx = e.clientX - swipe.current.x;
									if (Math.abs(dy) > 72 && Math.abs(dy) > Math.abs(dx) * 1.15) close();
								},
								children: [
									inCard || working ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "canvas-plate",
										"aria-hidden": true
									}),
									working ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "canvas-plate work",
										"aria-hidden": true
									}) : null,
									inCard || working ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WinClose, {
										corner: true,
										onClick: close
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "window-body",
										children: surface === "discover" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscoverView, {}) : surface === "themes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeView, {}) : surface === "upgrade" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpgradeView, {}) : surface === "smart" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartGenView, {}) : surface === "files" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilesView, {}) : inCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardView, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardCanvas, {})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "window-bar glass-ornament",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "window-grip" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverlaySheet, {
								open: surface === "history",
								title: "History",
								size: "list",
								onClose: backFromSheet,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryView, {})
							})
						]
					}),
					settingsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "alert-dim",
						"aria-label": "Dismiss settings",
						onClick: () => setSettingsOpen(false)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPane, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicPlayer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "dock",
				children: [working ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptOrb, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsOrb, {})]
			}),
			working ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsensusPreview, {}),
			working ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptBar, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpatialShell, {});
}
//#endregion
export { Home as component };
