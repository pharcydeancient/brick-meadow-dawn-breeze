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
  | "upgrade";

export type SettingsTab = "account" | "models" | "prefs";

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
}

export interface Wallpaper {
  id: string;
  name: string;
  category: string;
  premium: boolean;
  purchased: boolean;
  src: string;
  motion: "still" | "drift" | "aurora" | "tide";
  tracks: LiveTrack[];
}

export interface DiscoverItem {
  id: string;
  title: string;
  category: "prompts" | "voices" | "packs" | "agents";
  author: string;
  blurb: string;
  premium: boolean;
}
