import type { SmartBoard, SmartCanvas, SmartCard, SmartKind, SmartObject, SmartPage } from "./types";

export const SMART_PAGES: { id: SmartPage; label: string }[] = [
  { id: "cards", label: "Cards" },
  { id: "boards", label: "Boards" },
  { id: "canvas", label: "Canvas" },
  { id: "genie", label: "Genie" },
];

export const SMART_KINDS: { id: SmartKind; label: string; hint: string }[] = [
  { id: "memory", label: "Memory", hint: "A moment, still, or conversation to keep" },
  { id: "task", label: "Task", hint: "Something to move across the board" },
  { id: "artifact", label: "Artifact", hint: "A made thing — image, note, cut" },
  { id: "note", label: "Note", hint: "A thought that belongs on the wall" },
];

export const SMART_OBJECTS: { id: SmartObject; label: string }[] = [
  { id: "notebook", label: "Notebook" },
  { id: "portfolio", label: "Portfolio" },
  { id: "cork", label: "Cork" },
  { id: "tray", label: "Tray" },
];

export const SMART_LANES: SmartBoard[] = [
  { id: "inbox", label: "Tray", object: "tray" },
  { id: "play", label: "Cork", object: "cork" },
  { id: "ready", label: "Notebook", object: "notebook" },
  { id: "archive", label: "Portfolio", object: "portfolio" },
];

export function seedCanvases(): SmartCanvas[] {
  return [
    { id: "desk", name: "Desk", wallpaperId: "observatory" },
    { id: "hunt", name: "Job hunt", wallpaperId: "cabin" },
    { id: "night", name: "Night", wallpaperId: "neoncity" },
  ];
}

export function seedSmartCards(): SmartCard[] {
  const day = 86_400_000;
  const now = Date.UTC(2026, 7, 28);
  return [
    {
      id: "sm-alpine",
      kind: "memory",
      title: "Alpine hush",
      body: "Still air above the ridge. Keep this light.",
      lane: "ready",
      canvasId: "desk",
      x: 16,
      y: 20,
      preview: "/imagine/alpine.jpg",
      createdAt: now - 40 * day,
    },
    {
      id: "sm-coast",
      kind: "memory",
      title: "Low coast",
      body: "Tide line after the send. Remix later.",
      lane: "play",
      canvasId: "desk",
      x: 148,
      y: 36,
      preview: "/imagine/coast.jpg",
      createdAt: now - 18 * day,
    },
    {
      id: "sm-dusk",
      kind: "artifact",
      title: "Dusk glass",
      body: "Warm window, long hold. Variant of the observatory still.",
      lane: "inbox",
      canvasId: "hunt",
      x: 28,
      y: 168,
      preview: "/imagine/dusk.jpg",
      createdAt: now - 9 * day,
    },
    {
      id: "sm-mist",
      kind: "memory",
      title: "Valley mist",
      body: "Soft morning, no prompt. Just the still.",
      lane: "ready",
      canvasId: "night",
      x: 152,
      y: 188,
      preview: "/imagine/mist.jpg",
      createdAt: now - 4 * day,
    },
    {
      id: "sm-task",
      kind: "task",
      title: "Board the week",
      body: "Freeze tabs at the bottom. One lane per day.",
      lane: "inbox",
      canvasId: "desk",
      x: 18,
      y: 320,
      createdAt: now - 2 * day,
    },
    {
      id: "sm-note",
      kind: "note",
      title: "Cards vs boards",
      body: "Same objects. Swap the board, keep the type — or freeze the type and swap days.",
      lane: "play",
      canvasId: "hunt",
      x: 140,
      y: 340,
      createdAt: now - day,
    },
    {
      id: "sm-glass",
      kind: "artifact",
      title: "Glass still",
      body: "Held from Imagine. Attach when the thread needs it.",
      lane: "archive",
      canvasId: "night",
      x: 84,
      y: 96,
      preview: "/imagine/glass.jpg",
      createdAt: now - 70 * day,
    },
  ];
}
