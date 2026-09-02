# Aether spatial — requirement tracker

Sources, in order: this thread, `layout 2.0 visOS.txt`, Collider zip, Alert (1).png,
visionOS copilot kit, Functional Requirements, Smart Gen UI.

Honest statuses. `done` only when the running UI matches the source.

Legend: `done` | `partial` | `open`

## Language

| id | requirement | status |
|----|-------------|--------|
| L1 | wallpaper / theme — never “room” | done |
| L2 | canvas — not “window” in the product language | done — chrome, aria, copy. CSS class names still say window internally |

## Chrome

| id | requirement | status |
|----|-------------|--------|
| F2 | Canvas is a clear frame over a tinted wallpaper. Cards overlay it with real shadows | done |
| F3 | Contact shadow ellipse under the canvas | done |
| F4 | Controls live below the canvas as a glass bar | done |
| F5 | No permanent 5-item side pane. Destinations are settings app icons. Rule of 3. | done |
| F6 | Settings alert: Account / Models / Settings + app icons. No Cancel. Close is the 14px light, not a 36px × | done |
| F8 | Card names tinted with the model color. Cards themselves are clear glass | done |
| F9 | Overlay that blocks the canvas tints/blurs the background. Sheet opaque enough that type does not show through | done |
| F10 | Model chips: dark glass, lit edge, circular ember. Category menu overlays, does not reflow | done |

## Home canvas

| id | requirement | status |
|----|-------------|--------|
| H-grid | Phone cards, drag, Align, tap to card view | done |
| H-lift | Long-press glows/lifts; no hover-scale | done |
| H-thread | Full conversation scrollable in the card preview. User type = model color; model type = white | done |

## Prompt / consensus (zip A-composer.png)

| id | requirement | status |
|----|-------------|--------|
| P1 | Prompt summoned by the bottom orb; invisible until then | done |
| P2 | Consensus preview sits above the prompt | done |
| P4 | Attach (+) on the prompt | done — chips in the composer. Not a full file library pick. |
| P5 | Web search / Research / Deep research probes | done as labeled tray. Live web_search on web/deep. |
| P6 | Prompt tucks the canvas and returns on send / idle | done |
| P7 | Blur wallpaper on send | done — default on; Settings toggle |

## History

| id | requirement | status |
|----|-------------|--------|
| Y1 | Independent overlay. Does not change the surface under it | done |
| Y2 | Tints whatever is behind it. Sheet is opaque. Type does not show through | done |
| Y3 | Named from first user line, short-name chip, turns · relative date. Tap loads that conversation | done |

## Working surfaces

| id | requirement | status |
|----|-------------|--------|
| W-files | Files is a library of generated files. Search, kind chips, open, duplicate, delete, context menu. Not Years/Days | done |
| W2 | Theme selector + live wallpaper store | partial — labeled shelves exist; purchase is mocked |
| W-imagine | Grok Imagine-class market (generate, remix, likes, library) | done — generate/remix/like/library persist. No live remote market feed |
| W9 | Smart Gen hub: Cards / Boards / Canvas / Genie | partial — hub, physical boards, custom boards, canvas scenes (up to 10, swipe, named), Genie full page + docked helpdesk on Cards/Boards/Canvas. Not mass field edits / card-type refactor |
| W-genie | Genie: New, attach, Send, stay, creates cards/stills | done as agent desk. Not elite custom agents |

## Relocatable ornaments

| id | requirement | status |
|----|-------------|--------|
| R1 | Settings pane | done |
| R2 | Music widget | done |
| R3 | Prompt cluster | done — returns on send / 3s idle |
| R4 | No leading nav. Destinations are settings apps | done |
| R5 | Card canvas itself does not move | done |
