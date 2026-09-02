# Visual inspect — Aether home / type / tint / negatives

Live app: `http://127.0.0.1:8080/` (1280×820 Chromium).
Store key used: `collider-spatial-v12`.
Seed threads were 2 turns. Injected 12 user/model turns (24 messages) into Gemini 3.6 Flash Lite, 3 turns into Mistral Small 3.2, then reloaded.

No product code was changed.

---

## 1. HOME CARDS — scrollable full thread

**PASS**

The preview is the full thread in a scrollable `.card-log`, not a last-N clip.

What I did:
- Seed home (`01-home-seed.png`, `01b-home-card-seed.png`): Gemini / Command R / MiniMax show a 2-line exchange. Ling / Nemo empty. Nothing to scroll.
- Injected 24 messages into Gemini via `localStorage["collider-spatial-v12"]`, reloaded.
- After reload (`02-home-long-bottom.png`, `02b-card-long-bottom.png`): Gemini log holds **24** `.card-mini` nodes. `scrollHeight 2922` / `clientHeight 224`. At rest it sits at the bottom (`scrollTop 2584`) and the visible lines are Turn 11–12. That is a chat-stick-to-bottom viewport, not last-N truncation — Turn 1 is still in the DOM.
- Forced `scrollTop = 0` (`03-home-long-scrolled-top.png`, `03b-card-scrolled-top.png`): **Turn 1 user** and **Turn 1 model** are on screen. Earlier turns become visible.
- Mid scroll (`03c-card-scrolled-mid.png`): **Turn 6** is on screen. Intermediate turns exist.
- Real wheel over the Gemini log (`03d-home-after-wheel.png`, `03e-card-after-wheel.png`): `scrollTop` 40 → 360 (`logDelta +320`). `window.scrollY` stayed 0. Canvas `scrollLeft` stayed 0. `.window-body` did not move. `overscroll-behavior: contain`. Wheel on the card log moves the thread, not the page.

No bubbles. No fade-mask hiding earlier lines — the top of the log simply clips the in-view line the way any overflow:auto box does.

Not last-N. Not a static snippet. Full thread, scrollable, wheel-contained.

Screenshots: `01-home-seed.png`, `01b-home-card-seed.png`, `02-home-long-bottom.png`, `02b-card-long-bottom.png`, `03-home-long-scrolled-top.png`, `03b-card-scrolled-top.png`, `03c-card-scrolled-mid.png`, `03d-home-after-wheel.png`, `03e-card-after-wheel.png`.

---

## 2. TYPE — user vs model

**PASS** (weakest pairing noted)

Intent, verified in computed style **and** on the pixels:

| | family | size (home) | size (card view) | weight | color | chrome |
|---|---|---|---|---|---|---|
| user `.you` | Manrope | 12.5px | 16px | 600 | `var(--card-accent)` | none — no pad, no bg, no border, no radius |
| model `.them` | Manrope | 12.5px | 16px | 400 | `#fff` | same: bare type |

Same family. Same size on a given surface. No colored bubbles, no glass chips on the lines, no YOU/LITE speaker labels, no mono-vs-sans trick.

Home, one glance:
- Gemini (`04-type-home-card-1.png`): mint `#7fd8c4` / `rgb(127,216,196)` 600 vs white 400. Reads.
- Mistral Small (`04-type-home-card-2.png`): orange `#ffb066`. Reads immediately — best pairing of the six.
- Command R (`04-type-home-card-3.png`): gold `#f2c14e`. Reads.
- MiniMax (`04-type-home-card-4.png`): peach `#ff9e6b`. Reads.
- Ling / Nemo (`04-type-home-card-5.png`, `04-type-home-card-6.png`): empty. Placeholder “Tap to start a conversation.” at `rgba(238,241,246,0.4)` / 12px / 400. That grey is **only** on empty cards, not on real messages.

Card view (`06-card-view.png`, `06d-card-view-scrolled-top.png`, `07-type-cardview-you.png`, `07-type-cardview-them.png`, `07b-type-cardview-thread.png`):
- User line: mint, 16px, 600, transparent article, no bubble.
- Model line: white, 16px, 400, same.
- Header is Back + `Gemini 3.6 Flash Lite` in the accent. No Files, no History, no YOU.

Accent-on-user vs this wallpaper:
- Wallpaper is teal/cyan water. Gemini accent `#7fd8c4` is the closest of the six — mint on teal. In card view the veil is **off** (`veil-untint`), so the water is brighter. The mint still separates from white because (a) it is greener than the water, (b) weight 600 vs 400, (c) `text-shadow: 0 1px 3px rgba(0,0,0,0.9)`. I can tell the speaker in one glance. Not a fail.
- Orange / gold / peach user type is unambiguous on this wallpaper.
- Not on home: GPT-5 Nano `#d9d3c7` is near-white. If that card were lit, accent-on-user would collapse into the model’s white. Callout only — it is not in the default six.

No credit for CSS comments. The pixels match: same Manrope, same size, accent+600 vs white+400, no bubbles.

Screenshots: `04-type-home-card-1.png` … `04-type-home-card-6.png`, `06-card-view.png`, `06c-card-view-head.png`, `06d-card-view-scrolled-top.png`, `07-type-cardview-you.png`, `07-type-cardview-them.png`, `07b-type-cardview-thread.png`.

---

## 3. WALLPAPER TINT — Kosmik

**PASS**

Home (`01-home-seed.png`, `05-canvas-frame.png`, `13-home-final.png`):
- `.env-veil.veil-home` sits on the **photo**, full-bleed. Gradient `rgba(8,10,16, 0.34 / 0.26 / 0.48)`. Opacity 1. No backdrop-filter on the veil.
- `.main-window` / `.glass-window`: `background: rgba(0,0,0,0)`, `backdrop-filter: none`. Canvas is a clear rounded frame with an edge, not a frosted plate. The ridge and water show through the canvas interior.
- `.canvas-plate` is absent (`display` not in DOM).
- Cards sit in front: `rgba(255,255,255,0.05)` glass, 1px white edge, drop-shadow. They do not pick up a hue wash from the model color.

Card view (`06-card-view.png`): veil class `env-veil veil-untint`, root `app-root untint`. The water is visibly brighter and more saturated than home. Untint happens.

Harsh note: 48% black at the bottom of the veil is more than “slight.” The wash is a real darkening, heaviest in the lower third. It is still a wash **on the photo**, not a milky plate on the canvas. Kosmik is met. I am not failing a moderate wash that leaves the landscape readable and the canvas optically clear.

Screenshots: `01-home-seed.png`, `05-canvas-frame.png`, `06-card-view.png`, `08-home-after-card.png`, `13-home-final.png`.

---

## 4. NEGATIVES

**PASS** — none of the listed sins are on screen.

| Rejected thing | What I actually saw |
|---|---|
| Side pane | No `.leading-ornament`, no `.side-pane`, no rail. Home is wallpaper + centered canvas + orbs. `01-home-seed.png`, `13-home-final.png`. |
| Giant Cancel / WinClose | Settings pane has **no Cancel** (`09-settings-apps.png`, `09b-settings-pane.png`). Buttons are Account / Models / Settings + app icons. `.win-close` / `.win-x` not in the tree. History close is a 14×14 red light (`.sheet-close`, `#ff5f57`) — `11b-history-sheet.png`. Files close is a 14×14 red light at the canvas top-left (`.close-affordance`) — `12-files.png`. Card view uses a 15px “Back” chevron, not an × — `06c-card-view-head.png`. |
| Files / History in card header | Card view head text: `Back` + `Gemini 3.6 Flash Lite`. Spacer only on the right. `headHasFiles: false`, `headHasHistory: false`. `06c-card-view-head.png`. Files/History live as settings **app icons**, not on the card. |
| Pastel model chips | Models pane (`10-settings-models.png`, `10b-models-pane.png`, `10c-model-chip.png`): chips are dark glass `rgba(10,10,14,0.88)` / `rgba(8,8,12,0.78)`, white type, lit edge, circular ember. Not a pastel fill. Short name “Lite” is the model nickname in the picker, not a speaker label on messages. |
| Text showing through overlays | History sheet `background: rgba(16,18,24,0.98)`, scrim `rgba(6,8,12,0.72)`. Sheet type is white on a solid plate. Card copy is not readable through the sheet. Settings pane `rgba(28,28,32,0.97)`. `11-history-overlay.png`, `09-settings-apps.png`. |
| Placeholder ink on real messages | Real `.card-mini` / `.line` are accent or white. The 40% grey is only `.card-empty` on Ling / Nemo. `04-type-home-card-5.png`. |
| Identical user / AI type | Home and card view: accent+600 vs white+400, same size. Not identical. |

Screenshots: `06c-card-view-head.png`, `09-settings-apps.png`, `09b-settings-pane.png`, `10-settings-models.png`, `10b-models-pane.png`, `10c-model-chip.png`, `11-history-overlay.png`, `11b-history-sheet.png`, `12-files.png`.

---

## Score

| Item | Result |
|---|---|
| 1. HOME cards — scrollable full thread | **PASS** |
| 2. TYPE — user vs model | **PASS** |
| 3. WALLPAPER TINT | **PASS** |
| 4. NEGATIVES | **PASS** |

Overall: **PASS**

Watch (not fails): Gemini mint `#7fd8c4` on this teal wallpaper is the tightest accent-on-user pairing; GPT-5 Nano `#d9d3c7` would fail if enabled; veil bottom stop is 48% not “slight.”
