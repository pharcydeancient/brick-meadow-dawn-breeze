import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MODELS, canUse, DEFAULT_ENABLED } from "./models";
import { seedSmartCards } from "./smart";
import { WALLPAPERS } from "./themes";
import type {
  CardPos,
  ChatMessage,
  Conversation,
  DiscoverFilter,
  GenFile,
  ModelCategory,
  SettingsTab,
  SmartCard,
  SmartLane,
  SmartPage,
  Surface,
  Tier,
  Investigation,
} from "./types";
import type { CardRows } from "./card-layout";

function seedConversations(): Record<string, Conversation> {
  const seed: Record<string, Conversation> = {};
  for (const m of MODELS) {
    seed[m.id] = { modelId: m.id, messages: [] };
  }
  const now = Date.now();
  const seeds: Record<string, { user: string; assistant: string; ago: number }> = {
    "free/minimax-m3": {
      user: "Keep the wallpaper continuous under the cards.",
      assistant: "A glass canvas over a live wallpaper. Cards sit in front and never clip the plate they rest on.",
      ago: 12 * 60_000,
    },
    "free/command-r": {
      user: "How should consensus sit with the prompt?",
      assistant: "Tint the wallpaper, not the cards. Names carry the model color. Prompt brings consensus with it.",
      ago: 46 * 60_000,
    },
    "free/gemini-3-6-flash-lite": {
      user: "What is home, then?",
      assistant: "Home is a card grid. Themes and Imagine are working surfaces with a heavier plate.",
      ago: 2 * 86_400_000,
    },
  };
  for (const [id, line] of Object.entries(seeds)) {
    if (seed[id]) {
      seed[id].messages = [
        { id: `seed-u-${id}`, role: "user", text: line.user, createdAt: now - line.ago },
        { id: `seed-a-${id}`, role: "assistant", text: line.assistant, createdAt: now - line.ago + 20_000 },
      ];
    }
  }
  return seed;
}

function seedFiles(): GenFile[] {
  const day = 86_400_000;
  const y26 = Date.UTC(2026, 6, 12);
  const y25 = Date.UTC(2025, 10, 3);
  const y24 = Date.UTC(2024, 8, 18);
  return [
    { id: "sf-alpine", modelId: "imagine", name: "Alpine hush.png", kind: "image", sizeLabel: "1k", createdAt: y26, preview: "/imagine/alpine.jpg" },
    { id: "sf-coast", modelId: "imagine", name: "Low coast.png", kind: "image", sizeLabel: "1k", createdAt: y26 - 4 * day, preview: "/imagine/coast.jpg" },
    { id: "sf-dusk", modelId: "imagine", name: "Dusk glass.png", kind: "image", sizeLabel: "1k", createdAt: y26 - 11 * day, preview: "/imagine/dusk.jpg" },
    { id: "sf-aurora", modelId: "imagine", name: "Aurora drift.mp4", kind: "video", sizeLabel: "live", createdAt: y26 - 2 * day, preview: "/themes/premium/aurora_drift.jpg" },
    { id: "sf-mist", modelId: "imagine", name: "Valley mist.png", kind: "image", sizeLabel: "1k", createdAt: y25, preview: "/imagine/mist.jpg" },
    { id: "sf-glass", modelId: "imagine", name: "Glass still.png", kind: "image", sizeLabel: "1k", createdAt: y25 - 20 * day, preview: "/imagine/glass.jpg" },
    { id: "sf-g1", modelId: "imagine", name: "Night bloom.png", kind: "image", sizeLabel: "1k", createdAt: y25 - 40 * day, preview: "/imagine/g1.jpg" },
    { id: "sf-g3", modelId: "imagine", name: "Warm still.png", kind: "image", sizeLabel: "1k", createdAt: y24, preview: "/imagine/g3.jpg" },
    { id: "sf-g5", modelId: "imagine", name: "Field light.png", kind: "image", sizeLabel: "1k", createdAt: y24 - 30 * day, preview: "/imagine/g5.jpg" },
    { id: "sf-ember", modelId: "imagine", name: "Ember fall.mp4", kind: "video", sizeLabel: "live", createdAt: y24 - 8 * day, preview: "/themes/premium/ember_fall.jpg" },
  ];
}

function defaultCardLayout(): CardPos[] {
  return DEFAULT_ENABLED.map((id) => ({ id, x: 0, y: 0 }));
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
  cardRows: CardRows;
  gridSnap: boolean;
  rearranging: boolean;
  alignRequest: number;
  draggingCardId: string | null;

  settingsOpen: boolean;
  historyOpen: boolean;
  settingsTab: SettingsTab;
  settingsPos: PanePos;
  navPos: PanePos;
  promptPos: PanePos;
  modelCategory: ModelCategory;

  promptOpen: boolean;
  promptText: string;
  sending: boolean;
  hidePromptOnSend: boolean;
  hidePromptAfterIdle: boolean;
  blurOnSend: boolean;
  sendFlash: boolean;
  consensusOpen: boolean;
  investigation: Investigation;

  wallpaperId: string;
  themeMarketTab: 0 | 1;
  explodedWallpaperId: string | null;
  purchasedWallpaperIds: string[];

  musicOpen: boolean;
  musicPos: PanePos;
  playing: boolean;
  trackIndex: number;

  discoverQuery: string;
  discoverFilter: DiscoverFilter;
  historyQuery: string;
  filesQuery: string;
  filesFilter: "all" | GenFile["kind"];
  filesGroup: "years" | "days";
  previewFileId: string | null;

  smartPage: SmartPage;
  smartTabsAt: "top" | "bottom";
  smartCards: SmartCard[];
  smartOpenId: string | null;
  genieMessages: ChatMessage[];

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
  setHistoryOpen: (v: boolean) => void;
  setSettingsTab: (t: SettingsTab) => void;
  setSettingsPos: (p: PanePos) => void;
  setNavPos: (p: PanePos) => void;
  setPromptPos: (p: PanePos) => void;
  setModelCategory: (c: ModelCategory) => void;
  setPromptOpen: (v: boolean) => void;
  setPromptText: (t: string) => void;
  setSending: (v: boolean) => void;
  flashSend: () => void;
  addMessage: (modelId: string, msg: ChatMessage) => void;
  hideMessage: (modelId: string, msgId: string) => void;
  setGridSnap: (v: boolean) => void;
  setCardRows: (n: CardRows) => void;
  setRearranging: (v: boolean) => void;
  requestAlign: () => void;
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
  setFilesGroup: (g: AetherState["filesGroup"]) => void;
  setPreviewFile: (id: string | null) => void;
  addFile: (file: GenFile) => void;
  removeFile: (id: string) => void;
  setSmartPage: (p: SmartPage) => void;
  setSmartTabsAt: (v: AetherState["smartTabsAt"]) => void;
  setSmartOpen: (id: string | null) => void;
  addSmartCard: (card: Omit<SmartCard, "id" | "createdAt" | "x" | "y"> & { id?: string }) => void;
  addGenieMessage: (msg: ChatMessage) => void;
  moveSmartLane: (id: string, lane: SmartLane) => void;
  placeSmartCard: (id: string, x: number, y: number) => void;
  removeSmartCard: (id: string) => void;
  setGuideOn: (v: boolean) => void;
  setUpgradeFromLock: (v: boolean) => void;
  setHidePromptOnSend: (v: boolean) => void;
  setHidePromptAfterIdle: (v: boolean) => void;
  setBlurOnSend: (v: boolean) => void;
  setConsensusOpen: (v: boolean) => void;
  setInvestigation: (v: Investigation) => void;
  bumpStat: (k: "messages" | "images" | "minutes", n?: number) => void;
}

const WORKING: Surface[] = ["themes", "discover", "upgrade", "smart", "files"];

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
      cardRows: 2,
      gridSnap: false,
      rearranging: false,
      alignRequest: 0,
      draggingCardId: null,

      settingsOpen: false,
      historyOpen: false,
      settingsTab: "account",
      settingsPos: { x: 61, y: 210 },
      navPos: { x: 0, y: 0 },
      promptPos: { x: 0, y: 0 },
      modelCategory: "general",

      promptOpen: false,
      promptText: "",
      sending: false,
      hidePromptOnSend: true,
      hidePromptAfterIdle: true,
      blurOnSend: false,
      sendFlash: false,
      consensusOpen: false,
      investigation: "off",

      wallpaperId: "observatory",
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
      filesGroup: "years",
      previewFileId: null,

      smartPage: "cards",
      smartTabsAt: "top",
      smartCards: seedSmartCards(),
      smartOpenId: null,
      genieMessages: [],

      guideOn: false,
      upgradeFromLock: false,

      stats: { messages: 128, images: 14, minutes: 46 },

      setSurface: (s) =>
        set({
          surface: s,
          settingsOpen: false,
          historyOpen: s === "home" ? false : get().historyOpen,
          cardModelId: s === "home" ? null : get().cardModelId,
          previewFileId: s === "files" ? get().previewFileId : null,
          explodedWallpaperId: s === "themes" ? get().explodedWallpaperId : null,
          smartOpenId: s === "smart" ? get().smartOpenId : null,
        }),
      openCard: (id) => set({ surface: "card", cardModelId: id, settingsOpen: false, historyOpen: false }),
      closeToHome: () =>
        set({
          surface: "home",
          cardModelId: null,
          explodedWallpaperId: null,
          previewFileId: null,
          smartOpenId: null,
          upgradeFromLock: false,
          consensusOpen: false,
          historyOpen: false,
        }),
      toggleModel: (id) => {
        const { enabledModelIds, cardLayout, gridSnap, cardRows } = get();
        const on = enabledModelIds.includes(id);
        if (on) {
          const next = enabledModelIds.filter((x) => x !== id);
          const layout = cardLayout.filter((c) => c.id !== id);
          set({ enabledModelIds: next, cardLayout: layout });
        } else {
          if (enabledModelIds.length >= 9) return;
          const next = [...enabledModelIds, id];
          const layout = [...cardLayout, { id, x: 0, y: 0 }];
          set({
            enabledModelIds: next,
            cardLayout: gridSnap ? snapLayout(layout, cardRows) : layout,
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
          cardLayout: get().cardLayout.filter((c) => enabled.includes(c.id)),
        });
      },
      setSettingsOpen: (v) => set({ settingsOpen: v }),
      setHistoryOpen: (v) => set({ historyOpen: v }),
      setSettingsTab: (t) => set({ settingsTab: t }),
      setSettingsPos: (p) => set({ settingsPos: p }),
      setNavPos: (p) => set({ navPos: p }),
      setPromptPos: (p) => set({ promptPos: p }),
      setModelCategory: (c) => set({ modelCategory: c }),
      setPromptOpen: (v) =>
        set(v ? { promptOpen: true } : { promptOpen: false, promptPos: { x: 0, y: 0 } }),
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
      hideMessage: (modelId, msgId) =>
        set((s) => {
          const conv = s.conversations[modelId];
          if (!conv) return {};
          return {
            conversations: {
              ...s.conversations,
              [modelId]: { ...conv, messages: conv.messages.filter((m) => m.id !== msgId) },
            },
          };
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
      moveCard: (id, x, y) =>
        set((s) => ({
          cardLayout: s.cardLayout.map((c) => (c.id === id ? { ...c, x, y } : c)),
        })),
      setWallpaper: (id) => set({ wallpaperId: id, trackIndex: 0 }),
      setThemeMarketTab: (n) => set({ themeMarketTab: n, explodedWallpaperId: null }),
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
      setFilesGroup: (g) => set({ filesGroup: g }),
      setPreviewFile: (id) => set({ previewFileId: id }),
      addFile: (file) => set((s) => ({ files: [file, ...s.files] })),
      removeFile: (id) =>
        set((s) => ({
          files: s.files.filter((f) => f.id !== id),
          previewFileId: s.previewFileId === id ? null : s.previewFileId,
        })),
      setSmartPage: (p) => set({ smartPage: p, smartOpenId: null }),
      setSmartTabsAt: (v) => set({ smartTabsAt: v }),
      setSmartOpen: (id) => set({ smartOpenId: id }),
      addSmartCard: (card) =>
        set((s) => {
          const id = card.id ?? uid("sm");
          const next: SmartCard = {
            id,
            kind: card.kind,
            title: card.title,
            body: card.body,
            lane: card.lane,
            preview: card.preview,
            x: 16 + (s.smartCards.length % 3) * 28,
            y: 14 + (s.smartCards.length % 4) * 18,
            createdAt: Date.now(),
          };
          return { smartCards: [next, ...s.smartCards], smartOpenId: id, smartPage: "cards" };
        }),
      addGenieMessage: (msg) =>
        set((s) => ({ genieMessages: [...s.genieMessages, msg] })),
      moveSmartLane: (id, lane) =>
        set((s) => ({
          smartCards: s.smartCards.map((c) => (c.id === id ? { ...c, lane } : c)),
        })),
      placeSmartCard: (id, x, y) =>
        set((s) => ({
          smartCards: s.smartCards.map((c) => (c.id === id ? { ...c, x, y } : c)),
        })),
      removeSmartCard: (id) =>
        set((s) => ({
          smartCards: s.smartCards.filter((c) => c.id !== id),
          smartOpenId: s.smartOpenId === id ? null : s.smartOpenId,
        })),
      setGuideOn: (v) => set({ guideOn: v }),
      setUpgradeFromLock: (v) => set({ upgradeFromLock: v }),
      setHidePromptOnSend: (v) => set({ hidePromptOnSend: v }),
      setHidePromptAfterIdle: (v) => set({ hidePromptAfterIdle: v }),
      setBlurOnSend: (v) => set({ blurOnSend: v }),
      setConsensusOpen: (v) => set({ consensusOpen: v }),
      setInvestigation: (v) => set({ investigation: v === get().investigation ? "off" : v }),
      bumpStat: (k, n = 1) =>
        set((s) => ({ stats: { ...s.stats, [k]: s.stats[k] + n } })),
    }),
    {
      name: "collider-spatial-v10",
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
        smartTabsAt: s.smartTabsAt,
      }),
    },
  ),
);

export function snapLayout(layout: CardPos[], _rows: CardRows = 2): CardPos[] {
  return [...layout].sort((a, b) => a.x - b.x || a.y - b.y);
}

export function uid(prefix = "m") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
