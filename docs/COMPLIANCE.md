# Aether spatial — requirement tracker

Sources, in order: this thread, `layout 2.0 visOS.txt`, Collider zip, Alert (1).png,
visionOS copilot kit, community file **Apple visionOS Design Ideas**
`https://www.figma.com/community/file/1340632222885153874`.

Honest statuses. `done` only when the running UI matches the source.

Legend: `done` | `partial` | `open`

## Language

| id | requirement | status |
|----|-------------|--------|
| L1 | wallpaper / theme — never “room” | done |
| L2 | canvas — not “window” in the product language | done — chrome, aria, copy. CSS class names still say window internally |

## Design map (file `1340632222885153874`)

| id | Figma page | Maps to | status |
|----|------------|---------|--------|
| D1 | Kosmik | Tint the wallpaper so cards come forward. Canvas sits on top, clear. Untint in card view | done |
| D2 | Pinterest | Home is the card-grid. Imagine: search + masonry | done |
| D3 | Apple TV | Theme store: hero + horizontal shelves | done |
| D4 | Photos-Years | Theme selector: named wallpapers in categories | done |
| D5 | Formula 1 | Tap file / pin / wallpaper → preview with actions in view | done |
| D6 | Memories | Smart Gen Cards mosaic; Boards as notebook / portfolio / cork / tray | done |
| D8 | Movie Experience | Store hero is a cinematic featured still | done |

## Chrome

| id | requirement | status |
|----|-------------|--------|
| F2 | Canvas is a clear frame over a tinted wallpaper. Cards overlay it with real shadows | done |
| F3 | Contact shadow ellipse under the canvas | done |
| F4 | Controls live below the canvas as a glass bar | done |
| F5 | Leading nav: Files / Themes / Imagine / Smart / History — beside the canvas, not over the cards | done |
| F6 | Settings alert: Account / Models / Settings + app icons. Not a “Room” tab | done |
| F8 | Card names tinted with the model color. Cards themselves are clear glass | done |

## Home canvas

| id | requirement | status |
|----|-------------|--------|
| H-clip | Cards must not clip the canvas. Shadows sit in front of the wallpaper | done |
| H-corners | No square gray corners around the rounded canvas | done |
| H-grid | Phone cards, drag, Align, tap to card view | done |
| H-lift | Long-press glows/lifts; no hover-scale | done |

## Prompt / consensus (zip `A-composer.png` + spec)

| id | requirement | status |
|----|-------------|--------|
| P1 | Prompt summoned by the bottom orb; invisible until then | done |
| P2 | Consensus preview sits **above** the prompt as a glass card, autopopulated | done |
| P3 | Tap consensus → map of each model’s last line | done |
| P4 | Attach (+) on the prompt | done |
| P5 | Web search / Research / Deep research probes | done |
| P6 | Prompt tucks the canvas and returns on send / idle | done |

## History

| id | requirement | status |
|----|-------------|--------|
| Y1 | Independent overlay. Does not change the surface under it | done |
| Y2 | Tints whatever is behind | done |
| Y3 | Card-view history stays in that conversation; picking a thread loads it | done |

## Working surfaces

| id | requirement | status |
|----|-------------|--------|
| W2 | Theme selector + live wallpaper store, swipe between, searchable, labeled | done |
| W3 | Wallpaper fills (`cover`) | done |
| W9 | Smart Gen: Cards with pop-out, Boards as objects, Canvas playground, Genie as agent chat | done |

## Relocatable ornaments

| id | requirement | status |
|----|-------------|--------|
| R1 | Settings pane | done |
| R2 | Music widget | done |
| R3 | Prompt cluster | done — returns on send / 3s idle |
| R4 | Leading nav | done — grip at top; sits beside the canvas |
| R5 | Card canvas itself does not move | done |

## Remaining

- F1 Figma screenshots still blocked by Starter MCP cap — map is from named pages + zip + kit + user shots.
