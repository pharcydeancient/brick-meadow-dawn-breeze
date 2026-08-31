/**
 * Composition map — source of truth.
 *
 * Every live chrome choice maps to a named composition. Do not invent a
 * second layout. If a control has no home here, it does not ship.
 *
 * Shared Space (full-bleed wallpaper — never chopped, never opaque-covered)
 * │
 * ├── CANVAS  (Kosmik tinted plate, portrait, centered)
 * │     Home:     up to 6 model cards (Pinterest grid)
 * │     Card view: one model, chat — plate untinted
 * │     Working:  Files / Themes / Imagine / Smart / Upgrade (frosted plate)
 * │
 * ├── CANVAS BAR   (kit capsule under the canvas)
 * ├── CLOSE        (top-left of working / card view)
 * │
 * ├── LEADING ORNAMENT  (kit TabView — Files · Themes · Imagine · Smart · History)
 * │
 * ├── PROMPT CLUSTER    (A-composer.png — consensus card above prompt)
 * │     Invisible until the 3D orb summons it. Relocatable. Returns on send / idle.
 * │
 * ├── SETTINGS ORB + ALERT  (Alert (1).png — Account / Models / Settings)
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
    mapsTo: "Kosmik tinted plate + Pinterest card grid",
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
    id: "leading",
    label: "Leading ornament",
    mapsTo: "Kit vertical tab bar",
    role: "Files, Themes, Imagine, Smart, History. Relocatable.",
  },
  {
    id: "settings-orb",
    label: "Settings orb",
    mapsTo: "Persistent ornament (bottom trailing)",
    role: "Opens Account / Models / Settings alert.",
  },
  {
    id: "prompt-orb",
    label: "Prompt orb",
    mapsTo: "A-composer summon orb",
    role: "Summons the invisible prompt cluster.",
  },
  {
    id: "prompt-bar",
    label: "Prompt cluster",
    mapsTo: "A-composer.png — consensus card + plus + probes",
    role: "Compose. Relocatable. Returns on send and 3s idle.",
  },
  {
    id: "settings-pane",
    label: "Settings alert",
    mapsTo: "Alert (1).png",
    role: "Account / Models / Settings + app icons. Never Room. Relocatable.",
  },
  {
    id: "music",
    label: "Music widget",
    mapsTo: "visionOS Music now-playing",
    role: "Relocatable. Album art from the active live wallpaper.",
  },
] as const;

export type RegionId = (typeof REGIONS)[number]["id"];
