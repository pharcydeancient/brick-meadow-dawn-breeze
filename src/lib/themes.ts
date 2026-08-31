import type { DiscoverItem, LiveTrack, Wallpaper } from "./types";

const TRACKS: LiveTrack[] = [
  { id: "t1", title: "Driftwood", artist: "Aether", seconds: 184, src: "/themes/tracks/track1_driftwood.mp3" },
  { id: "t2", title: "Glasswing", artist: "North Glass", seconds: 212, src: "/themes/tracks/track2_glasswing.mp3" },
  { id: "t3", title: "Low Tide", artist: "Low Pressure", seconds: 196, src: "/themes/tracks/track3_lowtide.mp3" },
  { id: "t4", title: "Ember Fall", artist: "Aether", seconds: 168, src: "/themes/tracks/track4_emberfall.mp3" },
  { id: "t5", title: "Northlight", artist: "North Glass", seconds: 240, src: "/themes/tracks/track5_northlight.mp3" },
];

const FREE: Array<Pick<Wallpaper, "id" | "name" | "src" | "category">> = [
  { id: "observatory", name: "Observatory", src: "/themes/free/observatory.jpg", category: "Interior" },
  { id: "cabin", name: "Cabin", src: "/themes/free/cabin.jpg", category: "Interior" },
  { id: "cabinspace", name: "Cabin Space", src: "/themes/free/cabinspace.png", category: "Interior" },
  { id: "sanctuary", name: "Sanctuary", src: "/themes/free/sanctuary.jpg", category: "Interior" },
  { id: "deck", name: "Deck", src: "/themes/free/deck.jpg", category: "Interior" },
  { id: "dunehall", name: "Dune Hall", src: "/themes/free/dunehall.jpg", category: "Interior" },
  { id: "ocean", name: "Ocean", src: "/themes/free/ocean.jpg", category: "Horizons" },
  { id: "garden", name: "Garden", src: "/themes/free/garden.jpg", category: "Horizons" },
  { id: "rainfall", name: "Rainfall", src: "/themes/free/rainfall.jpg", category: "Horizons" },
  { id: "twilight", name: "Twilight", src: "/themes/free/twilight.jpg", category: "Horizons" },
  { id: "twinsuns", name: "Twin Suns", src: "/themes/free/twinsuns.jpg", category: "Horizons" },
  { id: "starbridge", name: "Star Bridge", src: "/themes/free/starbridge.jpg", category: "Night" },
  { id: "neoncity", name: "Neon City", src: "/themes/free/neoncity.jpg", category: "Night" },
  { id: "transit", name: "Transit", src: "/themes/free/transit.jpg", category: "Night" },
  { id: "blade", name: "Blade", src: "/themes/free/blade.jpg", category: "Night" },
  { id: "alley1", name: "Alley", src: "/themes/free/alley1.png", category: "Night" },
  { id: "alley3", name: "Alley Night", src: "/themes/free/alley3.jpg", category: "Night" },
  { id: "alley4", name: "Alley Rain", src: "/themes/free/alley4.jpg", category: "Night" },
];

const LIVE: Array<Pick<Wallpaper, "id" | "name" | "src" | "video" | "motion" | "price">> = [
  { id: "aurora_drift", name: "Aurora Drift", src: "/themes/premium/aurora_drift.jpg", video: "/themes/premium/aurora_drift.mp4", motion: "aurora", price: "$4.99" },
  { id: "nebula_bloom", name: "Nebula Bloom", src: "/themes/premium/nebula_bloom.jpg", video: "/themes/premium/nebula_bloom.mp4", motion: "aurora", price: "$5.99" },
  { id: "low_tide", name: "Low Tide", src: "/themes/premium/low_tide.jpg", video: "/themes/premium/low_tide.mp4", motion: "tide", price: "$2.99" },
  { id: "ember_fall", name: "Ember Fall", src: "/themes/premium/ember_fall.jpg", video: "/themes/premium/ember_fall.mp4", motion: "drift", price: "$7.99" },
];

export const WALLPAPERS: Wallpaper[] = [
  ...FREE.map((w) => ({
    ...w,
    premium: false,
    purchased: true,
    motion: "still" as const,
    tracks: [] as LiveTrack[],
  })),
  ...LIVE.map((w) => ({
    ...w,
    category: "Live",
    premium: true,
    purchased: false,
    tracks: TRACKS,
  })),
];

export const THEME_YEARS = ["Interior", "Horizons", "Night", "Live"] as const;

export const DISCOVER: DiscoverItem[] = [
  { id: "i1", title: "Night bloom", category: "photo", author: "Imagine", src: "/imagine/g1.jpg", premium: false, ratio: "9/16" },
  { id: "i2", title: "Alpine hush", category: "photo", author: "Imagine", src: "/imagine/alpine.jpg", premium: false, ratio: "16/9" },
  { id: "i3", title: "Soft figure", category: "photo", author: "Imagine", src: "/imagine/g2.jpg", premium: false, ratio: "3/4" },
  { id: "i5", title: "Aurora drift", category: "motion", author: "Imagine", src: "/themes/premium/aurora_drift.jpg", video: "/themes/premium/aurora_drift.mp4", premium: false, ratio: "9/16" },
  { id: "i6", title: "Low coast", category: "photo", author: "Imagine", src: "/imagine/coast.jpg", premium: false, ratio: "3/2" },
  { id: "i7", title: "Warm still", category: "photo", author: "Imagine", src: "/imagine/g3.jpg", premium: false, ratio: "4/5" },
  { id: "i9", title: "Dusk glass", category: "photo", author: "Imagine", src: "/imagine/dusk.jpg", premium: false, ratio: "16/9" },
  { id: "i10", title: "Portrait hold", category: "photo", author: "Imagine", src: "/imagine/g4.jpg", premium: false, ratio: "3/4" },
  { id: "i12", title: "Field light", category: "photo", author: "Imagine", src: "/imagine/g5.jpg", premium: false, ratio: "2/3" },
  { id: "i13", title: "Glass still", category: "photo", author: "Imagine", src: "/imagine/glass.jpg", premium: false, ratio: "1/1" },
  { id: "i15", title: "Quiet hall", category: "photo", author: "Imagine", src: "/imagine/g7.jpg", premium: false, ratio: "9/16" },
  { id: "i16", title: "Ember fall", category: "motion", author: "Imagine", src: "/themes/premium/ember_fall.jpg", video: "/themes/premium/ember_fall.mp4", premium: false, ratio: "3/4" },
  { id: "i18", title: "Valley mist", category: "photo", author: "Imagine", src: "/imagine/mist.jpg", premium: false, ratio: "16/9" },
  { id: "i19", title: "Close study", category: "photo", author: "Imagine", src: "/imagine/g9.jpg", premium: false, ratio: "4/5" },
  { id: "i21", title: "Open hall", category: "photo", author: "Imagine", src: "/imagine/g10.jpg", premium: false, ratio: "3/4" },
  { id: "i22", title: "Low tide", category: "motion", author: "Imagine", src: "/themes/premium/low_tide.jpg", video: "/themes/premium/low_tide.mp4", premium: false, ratio: "3/2" },
  { id: "i23", title: "Tall dusk", category: "photo", author: "Imagine", src: "/imagine/g11.jpg", premium: false, ratio: "9/16" },
  { id: "i25", title: "Held face", category: "photo", author: "Imagine", src: "/imagine/g12.jpg", premium: false, ratio: "3/4" },
  { id: "i26", title: "Nebula bloom", category: "motion", author: "Imagine", src: "/themes/premium/nebula_bloom.jpg", video: "/themes/premium/nebula_bloom.mp4", premium: false, ratio: "9/16" },
];
