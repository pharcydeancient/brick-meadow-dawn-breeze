import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MODELS, canUse } from "./models";
import { WALLPAPERS } from "./themes";
import type {
  CardPos,
  ChatMessage,
  Conversation,
  GenFile,
  ModelCategory,
  SettingsTab,
  Surface,
  Tier,
} from "./types";

const DEFAULT_ENABLED = ["grok", "pulse", "claude", "atlas", "flux", "forge"];

function seedConversations(): Record<string, Conversation> {
  const now = Date.now();
  const seed: Record<string, Conversation> = {};
  for (const m of MODELS) {
    seed[m.id] = { modelId: m.id, messages: [] };
  }
  seed.grok.messages = [
    {
      id: "g1",
      role: "user",
      text: "Keep the reply short. What is this room for?",
      createdAt: now - 1000 * 60 * 18,
    },
    {
      id: "g2",
      role: "assistant",
      text: "A quiet place to talk to several models at once. The scenery stays. The chrome disappears when you don’t need it.",
      createdAt: now - 1000 * 60 * 17,
    },
  ];
  seed.pulse.messages = [
    {
      id: "p1",
      role: "assistant",
      text: "I’m here when you want a softer read. Tap in when you’re ready.",
      createdAt: now - 1000 * 60 * 40,
    },
  ];
  seed.claude.messages = [
    {
      id: "c1",
      role: "user",
      text: "Outline a travel essay about a valley at dusk, 3 beats.",
      createdAt: now - 1000 * 60 * 50,
    },
    {
      id: "c2",
      role: "assistant",
      text: "1. Arrival — the road drops and the light goes amber.\n2. Pause — wind in dry grass, no one speaking.\n3. Leave — you take the color with you, not the view.",
      createdAt: now - 1000 * 60 * 49,
    },
  ];
  seed.flux.messages = [
    {
      id: "x1",
      role: "user",
      text: "A glass window floating over a mountain valley at last light.",
      createdAt: now - 1000 * 60 * 12,
    },
  ];
  seed.forge.messages = [
    {
      id: "f1",
      role: "user",
      text: "Name this spatial shell in one word.",
      createdAt: now - 1000 * 60 * 8,
    },
    {
      id: "f2",
      role: "assistant",
      text: "`Aether` — the medium the windows sit in.",
      createdAt: now - 1000 * 60 * 7,
    },
  ];
  return seed;
}

function seedFiles(): GenFile[] {
  const now = Date.now();
  return [
    {
      id: "file-1",
      modelId: "flux",
      name: "valley-glass.png",
      kind: "image",
      sizeLabel: "2.4 MB",
      createdAt: now - 1000 * 60 * 12,
      preview: "/env/valley.jpg",
    },
    {
      id: "file-2",
      modelId: "forge",
      name: "spatial-shell.ts",
      kind: "code",
      sizeLabel: "18 KB",
      createdAt: now - 1000 * 60 * 7,
    },
    {
      id: "file-3",
      modelId: "grok",
      name: "room-notes.md",
      kind: "text",
      sizeLabel: "4 KB",
      createdAt: now - 1000 * 60 * 17,
    },
    {
      id: "file-4",
      modelId: "echo",
      name: "meadow-loop.wav",
      kind: "audio",
      sizeLabel: "6.1 MB",
      createdAt: now - 1000 * 60 * 90,
    },
  ];
}

function defaultCardLayout(): CardPos[] {
  const ids = DEFAULT_ENABLED;
  return ids.map((id, i) => ({
    id,
    x: (i % 3) * (100 / 3),
    y: Math.floor(i / 3) * 50,
  }));
}

interface PanePos {
  x: number;
  y: number;
}

interface AetherState {
  tier: Tier;
  surface: Surface;
  cardModelId: string | null;
  enabledModelIds: string[];
  conversations: Record<string, Conversation>;
  files: GenFile[];
  cardLayout: CardPos[];
  gridSnap: boolean;
  draggingCardId: string | null;

  settingsOpen: boolean;
  settingsTab: SettingsTab;
  settingsPos: PanePos;
  modelCategory: ModelCategory;

  promptOpen: boolean;
  promptText: string;
  sending: boolean;
  hidePromptOnSend: boolean;
  hidePromptAfterIdle: boolean;
  blurOnSend: boolean;
  sendFlash: boolean;

  wallpaperId: string;
  themeMarketTab: 0 | 1;
  explodedWallpaperId: string | null;
  purchasedWallpaperIds: string[];

  musicOpen: boolean;
  musicPos: PanePos;
  playing: boolean;
  trackIndex: number;

  discoverQuery: string;
  discoverFilter: "all" | DiscoverFilter;
  historyQuery: string;
  filesQuery: string;
  filesFilter: "all" | GenFile["kind"];

  guideOn: boolean;
  upgradeFromLock: boolean;

  stats: {
    messages: number;
    images: number;
    minutes: number;
  };

  setSurface: (s: Surface) => void;
  openCard: (id: string) => void;
  closeToHome: () => void;
  toggleModel: (id: string) => void;
  setTier: (t: Tier) => void;
  setSettingsOpen: (v: boolean) => void;
  setSettingsTab: (t: SettingsTab) => void;
  setSettingsPos: (p: PanePos) => void;
  setModelCategory: (c: ModelCategory) => void;
  setPromptOpen: (v: boolean) => void;
  setPromptText: (t: string) => void;
  setSending: (v: boolean) => void;
  flashSend: () => void;
  addMessage: (modelId: string, msg: ChatMessage) => void;
  setGridSnap: (v: boolean) => void;
  setCardLayout: (layout: CardPos[]) => void;
  snapCards: () => void;
  setDraggingCard: (id: string | null) => void;
  moveCard: (id: string, x: number, y: number) => void;
  setWallpaper: (id: string) => void;
  setThemeMarketTab: (n: 0 | 1) => void;
  setExplodedWallpaper: (id: string | null) => void;
  purchaseWallpaper: (id: string) => void;
  setMusicOpen: (v: boolean) => void;
  setMusicPos: (p: PanePos) => void;
  setPlaying: (v: boolean) => void;
  setTrackIndex: (n: number) => void;
  setDiscoverQuery: (q: string) => void;
  setDiscoverFilter: (f: AetherState["discoverFilter"]) => void;
  setHistoryQuery: (q: string) => void;
  setFilesQuery: (q: string) => void;
  setFilesFilter: (f: AetherState["filesFilter"]) => void;
  addFile: (file: GenFile) => void;
  removeFile: (id: string) => void;
  setGuideOn: (v: boolean) => void;
  setUpgradeFromLock: (v: boolean) => void;
  setHidePromptOnSend: (v: boolean) => void;
  setHidePromptAfterIdle: (v: boolean) => void;
  setBlurOnSend: (v: boolean) => void;
  bumpStat: (k: "messages" | "images" | "minutes", n?: number) => void;
}

type DiscoverFilter = "prompts" | "voices" | "packs" | "agents";

export const useAether = create<AetherState>()(
  persist(
    (set, get) => ({
      tier: "pro",
      surface: "home",
      cardModelId: null,
      enabledModelIds: DEFAULT_ENABLED,
      conversations: seedConversations(),
      files: seedFiles(),
      cardLayout: defaultCardLayout(),
      gridSnap: true,
      draggingCardId: null,

      settingsOpen: false,
      settingsTab: "account",
      settingsPos: { x: 16, y: 0 },
      modelCategory: "general",

      promptOpen: false,
      promptText: "",
      sending: false,
      hidePromptOnSend: true,
      hidePromptAfterIdle: true,
      blurOnSend: true,
      sendFlash: false,

      wallpaperId: "ridge",
      themeMarketTab: 0,
      explodedWallpaperId: null,
      purchasedWallpaperIds: WALLPAPERS.filter((w) => w.purchased).map((w) => w.id),

      musicOpen: false,
      musicPos: { x: 0, y: 0 },
      playing: false,
      trackIndex: 0,

      discoverQuery: "",
      discoverFilter: "all",
      historyQuery: "",
      filesQuery: "",
      filesFilter: "all",

      guideOn: false,
      upgradeFromLock: false,

      stats: { messages: 128, images: 14, minutes: 46 },

      setSurface: (s) => set({ surface: s, cardModelId: s === "card" ? get().cardModelId : null }),
      openCard: (id) => set({ surface: "card", cardModelId: id, settingsOpen: false }),
      closeToHome: () =>
        set({
          surface: "home",
          cardModelId: null,
          explodedWallpaperId: null,
          upgradeFromLock: false,
        }),
      toggleModel: (id) => {
        const { enabledModelIds, cardLayout, gridSnap } = get();
        const on = enabledModelIds.includes(id);
        if (on) {
          const next = enabledModelIds.filter((x) => x !== id);
          const layout = cardLayout.filter((c) => c.id !== id);
          set({ enabledModelIds: next, cardLayout: layout });
        } else {
          if (enabledModelIds.length >= 6) return;
          const next = [...enabledModelIds, id];
          const layout = [
            ...cardLayout,
            { id, x: (cardLayout.length % 3) * (100 / 3), y: Math.floor(cardLayout.length / 3) * 50 },
          ];
          set({ enabledModelIds: next, cardLayout: gridSnap ? snapLayout(layout) : layout });
        }
      },
      setTier: (t) => {
        const enabled = get().enabledModelIds.filter((id) => {
          const m = MODELS.find((x) => x.id === id);
          return m ? canUse(m, t) : false;
        });
        set({
          tier: t,
          enabledModelIds: enabled.length ? enabled : ["grok"],
          cardLayout: get().cardLayout.filter((c) => enabled.includes(c.id) || (enabled.length === 0 && c.id === "grok")),
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
      addMessage: (modelId, msg) =>
        set((s) => {
          const conv = s.conversations[modelId] ?? { modelId, messages: [] };
          return {
            conversations: {
              ...s.conversations,
              [modelId]: { ...conv, messages: [...conv.messages, msg] },
            },
          };
        }),
      setGridSnap: (v) => {
        set({ gridSnap: v });
        if (v) set({ cardLayout: snapLayout(get().cardLayout) });
      },
      setCardLayout: (layout) => set({ cardLayout: layout }),
      snapCards: () => set({ cardLayout: snapLayout(get().cardLayout) }),
      setDraggingCard: (id) => set({ draggingCardId: id }),
      moveCard: (id, x, y) =>
        set((s) => ({
          cardLayout: s.cardLayout.map((c) => (c.id === id ? { ...c, x, y } : c)),
        })),
      setWallpaper: (id) => set({ wallpaperId: id, trackIndex: 0 }),
      setThemeMarketTab: (n) => set({ themeMarketTab: n }),
      setExplodedWallpaper: (id) => set({ explodedWallpaperId: id }),
      purchaseWallpaper: (id) =>
        set((s) => ({
          purchasedWallpaperIds: s.purchasedWallpaperIds.includes(id)
            ? s.purchasedWallpaperIds
            : [...s.purchasedWallpaperIds, id],
        })),
      setMusicOpen: (v) => set({ musicOpen: v }),
      setMusicPos: (p) => set({ musicPos: p }),
      setPlaying: (v) => set({ playing: v }),
      setTrackIndex: (n) => set({ trackIndex: n }),
      setDiscoverQuery: (q) => set({ discoverQuery: q }),
      setDiscoverFilter: (f) => set({ discoverFilter: f }),
      setHistoryQuery: (q) => set({ historyQuery: q }),
      setFilesQuery: (q) => set({ filesQuery: q }),
      setFilesFilter: (f) => set({ filesFilter: f }),
      addFile: (file) => set((s) => ({ files: [file, ...s.files] })),
      removeFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),
      setGuideOn: (v) => set({ guideOn: v }),
      setUpgradeFromLock: (v) => set({ upgradeFromLock: v }),
      setHidePromptOnSend: (v) => set({ hidePromptOnSend: v }),
      setHidePromptAfterIdle: (v) => set({ hidePromptAfterIdle: v }),
      setBlurOnSend: (v) => set({ blurOnSend: v }),
      bumpStat: (k, n = 1) =>
        set((s) => ({ stats: { ...s.stats, [k]: s.stats[k] + n } })),
    }),
    {
      name: "aether-spatial-v2",
      partialize: (s) => ({
        tier: s.tier,
        enabledModelIds: s.enabledModelIds,
        conversations: s.conversations,
        files: s.files,
        cardLayout: s.cardLayout,
        gridSnap: s.gridSnap,
        wallpaperId: s.wallpaperId,
        purchasedWallpaperIds: s.purchasedWallpaperIds,
        hidePromptOnSend: s.hidePromptOnSend,
        hidePromptAfterIdle: s.hidePromptAfterIdle,
        blurOnSend: s.blurOnSend,
        stats: s.stats,
        guideOn: s.guideOn,
        musicOpen: s.musicOpen,
      }),
    },
  ),
);

export function snapLayout(layout: CardPos[]): CardPos[] {
  const cols = 3;
  const sorted = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);
  return sorted.map((c, i) => ({
    ...c,
    x: (i % cols) * (100 / 3),
    y: Math.floor(i / cols) * 50,
  }));
}

export function uid(prefix = "m") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
