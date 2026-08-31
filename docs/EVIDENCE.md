# Implementation evidence

Every chrome choice is mapped to a named composition. Inspectors read this plus the live UI.

Sources:
- Community file [Apple visionOS Design Ideas](https://www.figma.com/community/file/1340632222885153874) — Kosmik, Pinterest, Apple TV, Photos-Years, Photos-Days, Formula 1, Memories, Movie Experience
- Kit `j3n1dUwJ8IThM7MDn5FgRm` — ornament, canvas bar, alert
- Zip `A-composer.png` — prompt + consensus
- `Alert (1).png` — settings
- `layout 2.0 visOS.txt` — language and behavior

## Composition map

| Composition | What we took | Lives in | Not this |
|-------------|--------------|----------|----------|
| **Kosmik** | Tint the **wallpaper**, not a plate on the canvas. Canvas is a clear frame. Cards sit in front. Untint in card view. | `.env-veil.veil-home` on the photo; no home `.canvas-plate`; `.veil-untint` in card view | Frosted window fill; tinted card glass; tinted canvas plate |
| **Pinterest** | Home is the card grid. Imagine = search capsule + masonry | `CardCanvas`, `.pin-search`, `.imagine-masonry` | Dashboard widgets |
| **Photos-Years** | Theme selector + Files: large group labels, mosaic stills, scroll | `.years-label`, `.years-grid`, `.mem-scroll` | Ungrouped icon dump |
| **Photos-Days** | Files Days tab next to Years | `filesGroup` | |
| **Apple TV + Movie Experience** | Theme store: cinematic hero + horizontal shelves | `.tv-hero`, `.tv-shelf` | Price grid |
| **Formula 1** | Tap file / pin / wallpaper → preview, actions, related **in view** | `.f1-stage` | Separate page |
| **Memories** | Smart Gen Cards mosaic; Boards are physical objects (notebook with spine + rings, portfolio flap, cork frame + pins, tray rim) | `.mem-card`, `.board-lane.object-*`, `.obj-chrome` | Generic kanban columns |
| **Alert (1).png** | Light glass, dark type, blue Cancel, Account / Models / Settings. App icons on open. Never “Room”. | `.alert-card` | Kosmik-tinted alert |
| **A-composer.png** | Consensus **card** above prompt. Plus. Web / Research / Deep probes. Orb summons. Relocatable cluster, returns to seat. | `.prompt-seat`, `.consensus-card`, `.prompt-plus`, `.probe` | Tiny “Listen” lip; sparkle icon |
| **Kit window bar** | Controls under the canvas, contact shadow ellipse | `.window-bar`, `.window-shadow` | Traffic-light dots |
| **Kit tab ornament** | Leading Files / Themes / Imagine / Smart / History, relocatable via top grip | `.nav-seat`, `.leading-ornament`, `.nav-grip` | Hidden on phone |
| **User override** | Model color on the **name**, not the plate. Cards are clear glass. Long-press glow, no hover-scale. | `.card-name` `color: var(--card-accent)`; `.card-slot.lifted` drop-shadow | White names; hue-washed cards; `scale(1.015)` |

## Language

wallpaper / theme — never “room”. canvas — the product word for the main plate.

## Relocatable ornaments

| Ornament | How | Returns |
|----------|-----|---------|
| Settings alert | Drag from `.alert-grip` | Stays where dropped |
| Music widget | Drag the widget | Stays where dropped |
| Prompt cluster | Long-press consensus card | Seat on send and 3s idle |
| Leading nav | Drag `.nav-grip` | Stays where dropped |
| Card canvas | Does not move | — |
