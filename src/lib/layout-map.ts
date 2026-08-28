/**
 * VISUAL GUIDE — source of truth.
 *
 * Every region of the app maps to a visionOS component.
 * Do not invent a second layout. If a control has no home here, it does not ship.
 *
 * Shared Space (full-bleed Environment — never chopped, never opaque-covered)
 * │
 * ├── MAIN WINDOW  (system glass, portrait, centered)
 * │     visionOS: Window + glass material + specular lip + drop shadow
 * │     Home:     up to 6 model cards (the canvas)
 * │     Card view: one model, chat — thicker glass (value-added work)
 * │     Working:  Files / History / Themes / Discover / Upgrade
 * │               (thicker glass, environment dims — they block the canvas)
 * │
 * ├── WINDOW BAR   (capsule under the window — move affordance)
 * ├── CLOSE        (top-left of window, outside the glass, hover → X)
 * │
 * ├── LEADING ORNAMENT  (vertical tab bar, left of window)
 * │     visionOS TabView ornament. Symbols always; labels on gaze/hover.
 * │     Files · Themes · Discover · History
 * │
 * ├── BOTTOM ORNAMENT   (overlaps window bottom ~20px)
 * │     Hidden until summoned. Prompt bar lives here.
 * │
 * ├── SETTINGS ORB      (bottom-left of the scene — persistent, tiny)
 * │     Opens a SMALL glass pane (not a page). Tabs: Account · Models · Settings
 * │     Draggable. No environment dim. Translucent on purpose — logistics, not work.
 * │
 * ├── PROMPT ORB        (bottom-center, 3D glass sphere)
 * │     Summons the prompt bar. Bar auto-hides on send and after 3s idle.
 * │
 * └── MUSIC WIDGET      (draggable glass, default lower-right)
 *       visionOS Music now-playing ornament. Stackable with the settings pane.
 */

export const REGIONS = [
  {
    id: "environment",
    label: "Environment",
    mapsTo: "visionOS Environment / passthrough",
    role: "The image is the product. UI never breaks its continuity.",
  },
  {
    id: "window",
    label: "Main window",
    mapsTo: "visionOS Window + glass",
    role: "Card canvas, card view, or a working surface.",
  },
  {
    id: "close",
    label: "Close",
    mapsTo: "Window close affordance (top-left)",
    role: "Dismisses card view / working surface back to home.",
  },
  {
    id: "window-bar",
    label: "Window bar",
    mapsTo: "visionOS window bar",
    role: "Move affordance. Anchors the window in space.",
  },
  {
    id: "leading",
    label: "Leading ornament",
    mapsTo: "visionOS vertical tab bar",
    role: "Files, Themes, Discover, History. Logistics, not content.",
  },
  {
    id: "settings-orb",
    label: "Settings orb",
    mapsTo: "Persistent ornament (bottom leading)",
    role: "Opens Account / Models / Settings pane.",
  },
  {
    id: "prompt-orb",
    label: "Prompt orb",
    mapsTo: "Siri-style spatial orb + bottom ornament",
    role: "Summons the invisible prompt bar.",
  },
  {
    id: "prompt-bar",
    label: "Prompt bar",
    mapsTo: "Bottom toolbar ornament (~20pt overlap)",
    role: "Compose. Auto-hides. Blurs canvas on send.",
  },
  {
    id: "settings-pane",
    label: "Settings pane",
    mapsTo: "Small glass panel / popover",
    role: "Tiny, draggable, no dim. Ember on model toggles.",
  },
  {
    id: "music",
    label: "Music widget",
    mapsTo: "visionOS Music now-playing",
    role: "Draggable. Album art from the active live wallpaper.",
  },
] as const;

export type RegionId = (typeof REGIONS)[number]["id"];
