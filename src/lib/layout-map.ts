/**
 * Composition map — source of truth.
 *
 * Every live chrome choice maps to a named composition. Do not invent a
 * second layout. If a control has no home here, it does not ship.
 *
 * Shared Space (full-bleed wallpaper — never chopped, never opaque-covered)
 * │
 * ├── CANVAS  (Kosmik tinted wallpaper, portrait, centered)
 * │     Home:     up to 6 model cards (Pinterest grid)
 * │     Card view: one model, chat — plate untinted
 * │     Working:  Files / Themes / Imagine / Smart / Upgrade (frosted plate)
 * │
 * ├── CANVAS BAR   (kit capsule under the canvas)
 * ├── CLOSE        (top-left of working / card view)
 * │
 * ├── SETTINGS ORB + ALERT  (Alert (1).png — Account / Models / Settings)
 * │     Apps live here: Files · History · Themes · Imagine · Smart · Store
 * │     Rule of 3: never a permanent 5-item side pane of those destinations
 * │
 * ├── PROMPT CLUSTER    (A-composer.png — consensus card above prompt)
 * │     Invisible until the 3D orb summons it. Relocatable. Returns on send / idle.
 * │
 * └── MUSIC WIDGET      (visionOS now-playing, relocatable)
 */

export const REGIONS = [
  {
    id: "environment",
    label: "Wallpaper",
    mapsTo: "Kosmik continuous environment / passthrough",
    role: "The image is the product. UI never breaks its continuity.",
  },
  {
    id: "canvas",
    label: "Canvas",
    mapsTo: "Kosmik tinted wallpaper + Pinterest card grid",
    role: "Card canvas, card view, or a working surface.",
  },
  {
    id: "close",
    label: "Close",
    mapsTo: "Kit window close (top-left)",
    role: "Dismisses card view / working surface back to home.",
  },
  {
    id: "canvas-bar",
    label: "Canvas bar",
    mapsTo: "Kit window bar",
    role: "Move affordance. Anchors the canvas in space.",
  },
  {
    id: "settings-orb",
    label: "Settings orb",
    mapsTo: "Alert (1).png — Account / Models / Settings + app icons",
    role: "One package. Files, History, Themes, Imagine, Smart, Store live as apps inside it. Not a 5-item side pane.",
  },
  {
    id: "prompt-orb",
    label: "Prompt orb",
    mapsTo: "A-composer.png 3D sphere",
    role: "Summons the prompt cluster.",
  },
  {
    id: "prompt",
    label: "Prompt cluster",
    mapsTo: "A-composer.png",
    role: "Consensus preview above composer. Relocatable. Returns on send / idle.",
  },
  {
    id: "music",
    label: "Music",
    mapsTo: "visionOS now-playing",
    role: "Relocatable widget. Bundled with live wallpapers.",
  },
];
