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

## Prompt / consensus (zip A-composer.png)

| id | requirement | status |
|----|-------------|--------|
| P1 | Prompt summoned by the bottom orb; invisible until then | done |
| P2 | Consensus preview sits above the prompt | done |
| P4 | Attach (+) on the prompt | done — chips in the composer. Not a full file library. |
| P5 | Web search / Research / Deep research probes | done as labeled tray. Not live backends. |
| P6 | Prompt tucks the canvas and returns on send / idle | done |

## History

| id | requirement | status |
|----|-------------|--------|
| Y1 | Independent overlay. Does not change the surface under it | done |
| Y2 | Tints whatever is behind it. Sheet is opaque. Type does not show through | done |
| Y3 | Named from first user line, short-name chip, turns · relative date. Tap loads that conversation | done |

## Working surfaces

| id | requirement | status |
|----|-------------|--------|
| W2 | Theme selector + live wallpaper store | partial — labeled shelves exist; purchase is mocked |
| W-imagine | Grok Imagine-class market (generate, remix, collections, likes, library) | partial — Discover / Library masonry with names. No generate/remix/likes yet |
| W9 | Smart Gen hub: full-width Cards / Boards / Canvas / Genie. Boards as objects. Genie as agent | partial — hub + objects + in-canvas Genie chat. Not a full agent desk (attachments, thread list, mass edits) |

## Relocatable ornaments

| id | requirement | status |
|----|-------------|--------|
| R1 | Settings pane | done |
| R2 | Music widget | done |
| R3 | Prompt cluster | done — returns on send / 3s idle |
| R4 | No leading nav. Destinations are settings apps | done |
| R5 | Card canvas itself does not move | done |
