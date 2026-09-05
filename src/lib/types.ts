export type Tier = "free" | "pro" | "elite";

export type ModelCategory = "general" | "image" | "audio" | "video" | "coding";

export type ModelKind = "text" | "image" | "audio" | "video" | "code";

export type Surface =
  | "home"
  | "card"
  | "files"
  | "history"
  | "themes"
  | "discover"
  | "upgrade"
  | "smart";

export type Investigation = "off" | "web" | "research" | "deep";

export type SettingsTab = "account" | "models" | "settings";

export type Identity = "guest" | "google" | "apple" | "email";

export type HistoryKind = "all" | "live" | "archive" | "files";

export interface DailyUse {
  date: string;
  messages: number;
}

export interface CreditPool {
  daily: number;
  weekly: number;
  monthly: number;
  usedDaily: number;
  usedWeekly: number;
  usedMonthly: number;
  weekKey: string;
  monthKey: string;
}

export type MessageRole = "user" | "assistant";

export interface AiModel {
  id: string;
  name: string;
  short: string;
  category: ModelCategory;
  kind: ModelKind;
  minTier: Tier;
  accent: string;
  blurb: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  createdAt: number;
  imageUrl?: string;
  fileId?: string;
}

export interface Conversation {
  modelId: string;
  messages: ChatMessage[];
}

export interface ArchivedThread {
  id: string;
  modelId: string;
  title: string;
  messages: ChatMessage[];
  closedAt: number;
}

export interface GenFile {
  id: string;
  modelId: string;
  name: string;
  kind: "image" | "text" | "audio" | "code" | "video";
  sizeLabel: string;
  createdAt: number;
  preview?: string;
}

export interface CardPos {
  id: string;
  x: number;
  y: number;
}

export interface LiveTrack {
  id: string;
  title: string;
  artist: string;
  seconds: number;
  src?: string;
}

export interface Wallpaper {
  id: string;
  name: string;
  category: string;
  premium: boolean;
  purchased: boolean;
  src: string;
  video?: string;
  price?: string;
  motion: "still" | "drift" | "aurora" | "tide";
  tracks: LiveTrack[];
}

export type DiscoverFilter = "all" | "photo" | "motion" | "liked" | "edit";

export interface DiscoverItem {
  id: string;
  title: string;
  category: "photo" | "motion" | "edit";
  author: string;
  src: string;
  video?: string;
  premium: boolean;
  ratio?: string;
}

export type SmartPage = "hub" | "cards" | "boards" | "canvas" | "genie";

export type SmartKind = "memory" | "task" | "artifact" | "note";

export type SmartObject = "notebook" | "portfolio" | "cork" | "tray";

export type SmartLane = string;

export interface SmartBoard {
  id: string;
  label: string;
  object: SmartObject;
}

export interface SmartCanvas {
  id: string;
  name: string;
  wallpaperId: string;
}

export interface SmartCard {
  id: string;
  kind: SmartKind;
  title: string;
  body: string;
  lane: SmartLane;
  canvasId: string;
  x: number;
  y: number;
  preview?: string;
  createdAt: number;
}
