# Functional inspection verdict

**Result:** FAIL
**Pass:** 91
**Fail:** 2
**When:** 2026-09-01T05:26:26Z
**Target:** http://127.0.0.1:8080/ (1280×800)
**Method:** Playwright. Product code not changed. Every reachable control was pressed.

Overall **FAIL** — two functional gaps. Everything else in the must-cover list worked.

## Failures

### 1. Files: Years/Days grouping

Files opens a mosaic of 10 tiles under a single group label **Imagine** (the model/source name). There is no Years tab, no Days tab, and no year buckets (2024 / 2025 / 2026) even though seed files span those dates and the store still holds unused `filesGroup: "years" | "days"`. Photos-Years / Photos-Days grouping from the spec is not on this surface.

Evidence: `37-files.png`, `37c-files-scrolled.png`

### 2. Card view: swipe right between cards

Swipe **left** from the card-view header advances Gemini 3.6 Flash Lite → Mistral Small 3.2. Swipe **right** from the title/header does not return to the previous card; the view stays on Mistral Small 3.2. Retested. Vertical swipe-down from the title does close back to home.

Evidence: `08-card-swipe-left.png` (PASS), `09b-card-swipe-right-retest.png` (FAIL), `13b-card-swipe-down-retest.png` (PASS)

## Must-cover recap

| Required | Result |
|----------|--------|
| Home: tap card opens card view | **PASS** |
| Home: Back returns | **PASS** |
| Home: Escape returns | **PASS** |
| Home: vertical swipe-down closes | **PASS** |
| Home: swipe left/right between cards | **FAIL** |
| Card preview log: wheel without opening | **PASS** |
| Card preview log: tap name opens | **PASS** |
| Composer: orb under the phone | **PASS** |
| Composer: click orb opens with animation | **PASS** |
| Composer: send tucks | **PASS** |
| Composer: idle tuck | **PASS** |
| Composer: Web/Research/Deep selectable | **PASS** |
| Composer: attach present | **PASS** |
| Composer: send labeled | **PASS** |
| Prompt: investigation modes change state | **PASS** |
| Settings: Account / Models / Settings | **PASS** |
| Settings: grid rows 1/2/3 | **PASS** |
| Settings: app icons Files History Themes Imagine Smart Store | **PASS** |
| Settings: no giant Cancel | **PASS** |
| Settings: tap outside dismisses | **PASS** |
| History: named/dated conversations | **PASS** |
| History: click loads conversation, no hijack | **PASS** |
| History: tint/blur behind | **PASS** |
| History: close not eaten as a drag | **PASS** |
| Imagine: tiles | **PASS** |
| Imagine: Like | **PASS** |
| Imagine: Remix | **PASS** |
| Imagine: Library persist | **PASS** |
| Smart/Genie: New | **PASS** |
| Smart/Genie: attach | **PASS** |
| Smart/Genie: Send | **PASS** |
| Smart/Genie: stay on Genie after reply | **PASS** |
| Themes: wallpaper swap | **PASS** |
| Themes: store chip | **PASS** |
| Files: Years/Days grouping | **FAIL** |

## Control → result

| Control | What happened | Result | Evidence |
|---------|---------------|--------|----------|
| Home: cards present | 6 cards: Gemini 3.6 Flash Lite \| Mistral Small 3.2 \| Command R \| MiniMax M3 \| Ling 2.6 Flash \| Mistral Nemo | **PASS** | `01-home.png` |
| Home: wallpaper | src=/themes/free/observatory.jpg | **PASS** | `01-home.png` |
| Home: no permanent side rail | no visible leading nav | **PASS** | `01-home.png` |
| Home: language never “room” | no Room/Rooms copy | **PASS** | `01-home.png` |
| Composer orb visible under the phone | op=1 72x72 aria=Open composer | **PASS** | `01-home.png` |
| Composer orb glued under phone (not a desktop dock) | at (604,730) under stage bottom 710 | **PASS** | `01-home.png` |
| Settings orb present | aria=Settings at (488,734) 44x44 | **PASS** | `01-home.png` |
| Home: overlays covering cards | no overlay sitting on the grid | **PASS** | `01-home.png` |
| Home card log: thread is scrollable | sh=2591 ch=214 lines=22 | **PASS** | `02-card-log-before-wheel.png` |
| Home card log: wheel-scroll does not open the card | stayed on home. scroll 2253 -> 2377. cards=6 | **PASS** | `03-card-log-after-wheel.png` |
| Home: tap card name opens card view | opened 'Gemini 3.6 Flash Lite' from name 'Gemini 3.6 Flash Lite' | **PASS** | `05-after-name-tap.png` |
| Home: tap card opens card view | title=Gemini 3.6 Flash Lite | **PASS** | `07-card-view.png` |
| Card view: Back control present | back='Back' aria ok | **PASS** | `07-card-view.png` |
| Card view: header chrome does not belong | head='Back \| Gemini 3.6 Flash Lite' — Back + title only | **PASS** | `07-card-view.png` |
| Card view: swipe left/right between cards | Swipe left from header advances Gemini 3.6 Flash Lite → Mistral Small 3.2. Swipe right from the title/header does not return to the previous card (stays on Mistral Small 3.2). Left works; right is dead from the header. | **FAIL** | `09b-card-swipe-right-retest.png` |
| Card view: Escape returns home | home cards=6 | **PASS** | `10-card-escape.png` |
| Card view: Back returns home | cards=6 | **PASS** | `12-card-back.png` |
| Card view: vertical swipe-down closes | returned home. cards=6 | **PASS** | `13b-card-swipe-down-retest.png` |
| Card view: swipe left to next card | Swipe left from header: Gemini 3.6 Flash Lite → Mistral Small 3.2 | **PASS** | `08-card-swipe-left.png` |
| Home: tap card 0 opens | Gemini 3.6 Flash Lite | **PASS** | `14-card-tap-0.png` |
| Home: tap card 1 opens | Mistral Small 3.2 | **PASS** | `14-card-tap-1.png` |
| Home: tap card 2 opens | Command R | **PASS** | `14-card-tap-2.png` |
| Home: tap card 3 opens | MiniMax M3 | **PASS** | `14-card-tap-3.png` |
| Home: tap card 4 opens | Ling 2.6 Flash | **PASS** | `14-card-tap-4.png` |
| Home: tap card 5 opens | Mistral Nemo | **PASS** | `14-card-tap-5.png` |
| Composer: invisible until orb | {"op":"0","pe":"none","tf":"matrix(1, 0, 0, 1, -149.688, 28)","open":false} | **PASS** | `15-home-pre-prompt.png` |
| Composer: click orb opens with animation | fade dt=35 op=0.000 → 1.000 | **PASS** | `16-prompt-mid-open.png` |
| Composer: orb summons | prompt-seat.open | **PASS** | `17-prompt-open.png` |
| Composer: consensus sits above prompt | gap=18.0 text=Gemini 3.6 Flash Lite Reply 9. A glass canvas over a live wallpaper. Cards sit in front. line line line line line line line line line line l | **PASS** | `17-prompt-open.png` |
| Composer: attach control present | {"aria":"Attach","label":"Attach","labelVis":true,"present":true} | **PASS** | `17-prompt-open.png` |
| Composer: attach labeled | visible Attach | **PASS** | `17-prompt-open.png` |
| Composer: send control present | {"present":true,"aria":"Send","title":"","text":"","label":"","labelVis":false,"disabled":true} | **PASS** | `17-prompt-open.png` |
| Composer: send labeled | aria='Send' (icon only, no visible Send word — accepted as labeled) | **PASS** | `17-prompt-open.png` |
| Composer: investigation tray (Web / Research / Deep) | rows=["Web search","Research","Deep research"] aboveBar=true | **PASS** | `18-investigate-tray.png` |
| Composer: select Web search changes state | probe='Web search' on=true aria='Investigation: Web search' | **PASS** | `19-probe-web.png` |
| Composer: select Research changes state | probe='Research' on=true aria='Investigation: Research' | **PASS** | `20-probe-research.png` |
| Composer: select Deep research changes state | probe='Deep research' on=true aria='Investigation: Deep research' | **PASS** | `21-probe-deep.png` |
| Settings alert: opens from orb | alert-card visible | **PASS** | `26-settings-apps.png` |
| Settings: Account / Models / Settings tabs | ["Account","Models","Settings"] | **PASS** | `26-settings-apps.png` |
| Settings: app icons Files, History, Themes, Imagine, Smart, Store | ["Files","History","Themes","Imagine","Smart","Store"] | **PASS** | `26-settings-apps.png` |
| Settings: no giant Cancel | no Cancel button | **PASS** | `26-settings-apps.png` |
| Settings: Account tab works | Pro \|  \| $19.99/mo \|  \| Upgrade | **PASS** | `27-settings-account.png` |
| Settings: Models tab — Align | Align present | **PASS** | `28-settings-models.png` |
| Settings: Models tab — chips | Lite,Small,Command,MiniMax,Ling,Nemo,Gemma,Qwen | **PASS** | `28-settings-models.png` |
| Settings: Align click | clicked Align | **PASS** | `28-settings-models.png` |
| Settings: grid rows 1 / 2 / 3 present | [{"n":"1","on":false},{"n":"2","on":true},{"n":"3","on":false}] | **PASS** | `29-settings-prefs.png` |
| Settings: grid rows 3 reflow | changed [{"w":137,"h":280,"x":503,"y":76},{"w":137,"h":280,"x":503,"y":364},{"w":137,"h":280,"x":648,"y":76},{"w":137,"h":280,"x":648,"y":364},{"w":137,"h":280,"x":792,"y":76},{"w":137,"h":280,"x":792,"y":364}] → [{"w":134,"h":207,"x":502,"y":41},{"w":134,"h":207,"x":502,"y":256},{"w":134,"h":207,"x":502,"y":472},{"w":134,"h":207,"x":644,"y":41},{"w":134,"h":207,"x":644,"y":256},{"w":134,"h":207,"x":644,"y":472}] | **PASS** | `31-rows-3.png` |
| Settings: grid rows 1 reflow | [{"w":137,"h":280,"x":503,"y":220},{"w":137,"h":280,"x":648,"y":220},{"w":137,"h":280,"x":792,"y":220},{"w":137,"h":280,"x":937,"y":220},{"w":137,"h":280,"x":1081,"y":220},{"w":137,"h":280,"x":1226,"y":220}] | **PASS** | `32-rows-1.png` |
| Settings: dismiss by tapping outside | closed | **PASS** | `33-settings-tap-outside.png` |
| History overlay: lists as independent overlay | title=History rows=67 | **PASS** | `34-history.png` |
| History: does not hijack the surface under it | canvas=true cardsUnder=6 | **PASS** | `34-history.png` |
| History: lists named/dated conversations | What is home, then? · Lite 22 turns · 17m \|\| Inspect pad 0: keep the wallpaper continuous under the cards and never clip the plate. · Small 20 turns · 17m \|\| How should consensus sit with the prompt? · Command 22 turns · 17m \|\| Keep the wallpaper continuous under the cards. · MiniMax 22 turns · 17m  | **PASS** | `34-history.png` |
| History: tint/blur behind | blur=blur(18px) saturate(1.4) bg=rgba(6, 8, 12, 0.72) | **PASS** | `34-history.png` |
| History: click loads that conversation (does not hijack to a wrong view) | card='Gemini 3.6 Flash Lite' tag=Lite row='What is home, then?' threadHit=true historyClosed=true | **PASS** | `35-history-click-row.png` |
| History: close control present | {"x":773,"y":95,"w":14,"h":14,"bg":"rgb(255, 95, 87)"} | **PASS** | `34-history.png` |
| History: close works (not eaten as a drag) | dismissed {"present":false,"open":false} | **PASS** | `36-history-close.png` |
| History: close returns to home | cards=6 | **PASS** | `36-history-close.png` |
| Files: opens | heading=Files tiles=10 groups=["Imagine"] | **PASS** | `37-files.png` |
| Files: Years/Days grouping | store has filesGroup but UI groups by model. groups=["Imagine"] chips=[] no Years/Days tabs, no 2024/2025/2026 labels. text=Files \| Imagine \| Alpine hush \| Low coast \| Dusk glass \| Aurora drift \| Valley mist \| Glass still \| Night bloom \| Warm still \| Field light \| Ember fall | **FAIL** | `37c-files-scrolled.png` |
| Files: tile opens preview | preview stage | **PASS** | `38-files-preview.png` |
| Files: close returns home | home | **PASS** | `39-files-closed.png` |
| Themes: Store chip present | ["Selector","Store"] | **PASS** | `40-themes.png` |
| Themes: Store chip works | {"gate":false,"shelves":true,"plans":false,"label":"Live wallpapers","text":"Live wallpapers\nSelector\nStore\nFEATURED\nAurora Drift\nLive wallpapers\nAurora Drift\nNebula Bloom\nLow Tide\nEmber Fall\nAurora\nAurora Drift\nNebula Bloom\nTide\nLow Tide\nDrift\nEmber Fall"} | **PASS** | `41-themes-store.png` |
| Themes: wallpaper swap | /themes/free/observatory.jpg → /themes/free/cabin.jpg | **PASS** | `43-theme-swapped.png` |
| Themes: close returns home | home | **PASS** | `44-themes-closed.png` |
| Imagine: tiles | tiles=19 tabs=Discover \| Images \| Videos \| Liked \| Library | **PASS** | `45-imagine.png` |
| Imagine: Like | liked buttons=1 | **PASS** | `46-imagine-liked.png` |
| Imagine: Liked tab persists likes | tiles=1 | **PASS** | `47-imagine-liked-tab.png` |
| Imagine: Remix | Remixing Night bloom \| × | **PASS** | `48-imagine-remix.png` |
| Imagine: Library persist | {"on":true,"tiles":1,"text":"Discover\nImages\nVideos\nLiked\nLibrary\nNight bloom\nGENERATE\n\nIMAGE\n\nNight bloom\nRemix\nLiked\nIn library\nAttach\nUse as source\nDelete"} | **PASS** | `50-imagine-library.png` |
| Imagine: close returns home | home | **PASS** | `51-imagine-closed.png` |
| Smart: hub Cards / Boards / Canvas / Genie | ["Smart Cards","Smart Boards","Smart Canvas","Smart Genie"] | **PASS** | `52-smart-hub.png` |
| Smart: Smart Cards | Cards \| Boards \| Canvas \| Genie \| Memory \| Alpine hush \| Memory \| Low coast \| Memory \| Valley mist \| Memory \| Artifact \| Dusk glass \| Artifact \| Glass still \| Artifact \| Task \| task \| Board the week \| Task \| Note \| note \| Cards vs boards \| Note \| Memory \| Task \| Artifact \| Note \| Pop out | **PASS** | `53b-smart-cards.png` |
| Smart: Smart Boards | Tray \| 2 \| Dusk glass \| artifact \| Board the week \| task \| Cork \| 2 \| Low coast \| memory \| Cards vs boards \| note \| Notebook \| 2 \| Alpine hush \| memory \| Valley mist \| memory \| Portfolio \| 1 \| Glass still \| artifact | **PASS** | `53-smart-boards.png` |
| Smart: Smart Canvas | Alpine hush \| Low coast \| Dusk glass \| Valley mist \| task \| Board the week \| note \| Cards vs boards \| Glass still | **PASS** | `53-smart-canvas.png` |
| Smart: Smart Genie | Cards \| Boards \| Canvas \| Genie \|  \| Smart Genie \|  \| Ask for a card, a board, or a still. It stays in this canvas. \|  \| New \|  \| What should we make. \|  \| Attach \| SEND | **PASS** | `53b-smart-genie.png` |
| Store: plan CTAs | ["UPGRADE TO FREE","CURRENT","UPGRADE TO ELITE"] | **PASS** | `54b-upgrade.png` |
| Smart/Genie: New | New present | **PASS** | `56b-genie.png` |
| Smart/Genie: attach | Attach present | **PASS** | `56b-genie.png` |
| Smart/Genie: Send | Send control present with visible SEND label. Sending 'Make a note titled Inspection desk.' produced assistant reply 'MADE: Inspection desk (note)' and stayed on Genie. Earlier fail was a locator reading Attach's ctrl-label. | **PASS** | `57-genie-reply.png` |
| Composer: consensus click opens map | map opened | **PASS** | `59-consensus-map.png` |
| Sweep: extra home buttons | Gemini 3.6 Flash Lite Reply 9. A glass canvas over a live wa \| Web search \| Research \| Deep research ✓ \| Attach \| Send \| Investigation: Deep research | **PASS** | `60-home-inventory.png` |
| Negatives: invisible/tiny hit targets (home) | no sub-10px controls (aside from specified 14px close) | **PASS** | `60-home-inventory.png` |
| Negatives: invisible/tiny hit targets (settings) | no sub-10px controls (aside from specified 14px close) | **PASS** | `61-settings-inventory.png` |
| Sweep: window bar (ornament, not a dead button) | {"present":true,"tag":"DIV","cls":"window-bar glass-ornament","w":72,"h":18,"clickable":false} | **PASS** | `62-window-bar.png` |
| Tour complete | checks=87 pageErrors=0 | **PASS** | `63-home-final.png` |
| Composer: send enables when text present | send enabled | **PASS** | `17b-prompt-open.png` |
| Composer: send tucks it | tucked with fade mid op=0.894 dt=135. final={"open":false,"op":0,"orbAway":false,"orbOp":1} | **PASS** | `22-prompt-send-mid.png` |
| Composer: orb returns after send tuck | {"open":false,"op":0,"orbAway":false,"orbOp":1} | **PASS** | `23-prompt-after-send.png` |
| Composer: idle tucks it | tucked with animation mid op=0.854 dt=3180 | **PASS** | `24-prompt-idle.png` |
| Smart/Genie: stay on Genie after reply | still genie-chat. you=1 them=1 text=Make a note titled Inspection desk. \|  \| MADE: Inspection desk (note) \|  \| Empty note ready on the canvas. | **PASS** | `57-genie-reply.png` |
| Composer: attach control summons file picker | filechooser opened | **PASS** | `64-attach-chooser.png` |
| Follow-up complete | checks=92 | **PASS** | `65-home-final.png` |

## What was pressed (no tunnel vision)

### Home
- Six phone cards on a wallpapered canvas. No side rail. No “room” copy. Settings orb lower-left of the phone; composer orb glued under the phone, not a desktop-wide dock.
- Wheel on `.card-log` scrolled the thread (2253 → 2377) and did **not** open card view. Tap on `.card-name` opened Gemini 3.6 Flash Lite.
- Tap on each of the six cards opened that model’s card view.

### Card view
- Header is Back + accent title only. No Files / History chrome.
- Back returns home. Escape returns home. Vertical swipe-down from the title returns home.
- Swipe left advances cards. Swipe right does not (FAIL above).

### Composer
- Invisible until the orb. Orb click fades the seat in (op 0.000 → 1.000). Consensus card sits above the prompt (18px gap).
- Attach is present, labeled, and summons a file chooser.
- Send has `aria-label="Send"` (icon only on the home bar; Genie shows a visible SEND word). Empty send is disabled; filling the field enables it.
- Probe opens a tray **above** the bar: Web search, Research, Deep research. Each selection lights the probe and changes its label.
- Send tucks the composer with a mid-fade (op 0.894 @ 135ms); orb returns.
- Idle (~3.5s) tucks with a mid-fade (op 0.854 @ 3180ms). Escape also animates closed — it does not pop out.
- Consensus card opens the constellation map; scrim dismisses it.

### Settings alert
- Opens from the settings orb. Tabs Account / Models / Settings. App icons Files, History, Themes, Imagine, Smart, Store. No Cancel. Dim exists; tap outside dismisses.
- Account shows plan + Upgrade. Models has Align and ember chips. Settings has grid-row pills 1/2/3; 3 and 1 both reflow the home grid. Restored to 2.

### History
- Independent overlay over the home canvas (6 cards still under it). Scrim is `blur(18px) saturate(1.4)` on `rgba(6,8,12,0.72)`.
- Rows are named from the first user line, with short-name chip + relative date (`22 turns · 17m`).
- Clicking “What is home, then?” loaded Gemini card view with that thread. Did not jump to Imagine / Files / Smart.
- 14px red close (`#ff5f57`) dismisses; click is not eaten as a sheet drag. Lands on home.

### Files
- Opens. Tiles preview in-view. Close returns home. Grouping is model-name, not Years/Days (FAIL).

### Themes
- Selector / Store chips. Store chip opens live-wallpaper shelves (Aurora Drift featured). Picking Cabin swapped wallpaper `observatory.jpg` → `cabin.jpg`. Close returns home.

### Imagine
- Masonry tiles with Like and Remix on each. Like marks the heart; Liked tab then shows 1 tile. Remix opens “Remixing Night bloom”. Preview Library action persists the still into Library (1 tile, “In library”). Close returns home.

### Smart / Genie
- Hub: Smart Cards / Boards / Canvas / Genie. Cards mosaic, Boards as Tray/Cork/Notebook/Portfolio objects, Canvas free-placed cards, Genie chat.
- Genie (Pro): New, Attach, Send. Prompt “Make a note titled Inspection desk.” replied `MADE: Inspection desk (note)` and **stayed on Genie** — no hijack to home or Imagine. New is present.

### Store / Upgrade
- Account → Upgrade shows plan CTAs: Upgrade to Free / Current (Pro) / Upgrade to Elite. No giant Cancel anywhere in the settings alert.

## Negatives watched

| Negative | Result |
|----------|--------|
| Dead buttons | **Mostly clear.** Swipe-right on card view is the dead gesture. Window bar is an ornament, not a dead button. |
| Invisible / tiny hit targets | **PASS** on home and settings (no sub-10px controls besides the specified 14px red close). |
| Overlays covering cards | **PASS** on idle home. History correctly tints/blurs. Composer covers cards only while summoned, by spec. |
| Header chrome that does not belong | **PASS** — card view is Back + title only. |
| Composer disappearing without animation | **PASS** — open, send-tuck, idle-tuck, and Escape all show mid-fade samples. |
| Language | **PASS** — no Room/Rooms copy. |
| Permanent 5-item side pane | **PASS** — destinations live as settings app icons. |

## Notes

- Home composer Send is an arrow with `aria-label="Send"`, not a visible SEND word (Genie does show SEND). Counted as labeled.
- Store app icon on a Pro session opens the live-wallpaper store, not the plan stack. Plan CTAs were reached via Account → Upgrade.
- `filesGroup` exists in persisted state and is never wired to the Files UI.
