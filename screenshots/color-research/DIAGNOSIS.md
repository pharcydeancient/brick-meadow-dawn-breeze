# Color diagnosis — Aether looks overdone because it paints hue onto chrome

Captured 2026-09-01 against live `http://127.0.0.1:8080/` (`/workspace/screenshots/color-home.png`) plus `/workspace/screenshots/qa-next/{files,smart-hub,smart-cards,smart-cards-dock,smart-boards,smart-canvas}.png`, `/workspace/screenshots/inspect-visual/{01-home-seed,04-type-home-card-1,06-card-view}.png`, `/workspace/screenshots/qa-vis/{d-home,d-files,d-settings-models,d-imagine}.png`.

Pixels were cropped to the phone frame and sampled. Roster hexes `#7fd8c4` `#ffb066` `#f2c14e` `#ff9e6b` hit **exact** matches on home. CSS was read, not guessed. Collider `VOS_PALETTE` / `glass26.ts` was read from `/tmp/collider/collidermergedx3-glm/src/styles/`.

This is not a taste note. The screen is running three color systems at once: the wallpaper, a 24-hex candy roster, and Apple-system tokens (blue / green / orange / red / yellow). visionOS never does that.

---

## 1. What actually looks overdone in the pixels

### 1a. Home is a six-flavor name grid on a teal world

Wallpaper (shore / night water), phone-crop medians:

| Sample | Measured |
|---|---|
| Water, mid | `#2d3b53` / `#0c1320` |
| Card glass fill (wallpaper through 5% white) | `#3d4f69` / `#455167` |
| Saturated field | hue **210°** (~70% of colorful pixels), e.g. `#3d4c65` |

That field is already a strong cyan-teal. Fine. That is the environment doing its job.

Then every card name is a different saturated candy, injected as `--card-accent` on `.model-card` (`src/components/model-card.tsx:25`) and painted onto `.card-name` (`styles.css:1789`). Default six, **exact pixels on `color-home.png`**:

| Card | Roster hex | Hue | Pixel |
|---|---|---|---|
| Gemini 3.6 Flash Lite | `#7fd8c4` | ~160° mint | **exact** @(108,78) in phone crop |
| Mistral Small 3.2 | `#ffb066` | ~20° peach | **exact** @(20,412) |
| Command R | `#f2c14e` | ~40° gold | **exact** @(224,78) |
| MiniMax M3 | `#ff9e6b` | ~15° salmon | **exact** @(188,412) |
| Ling 2.6 Flash | `#9ecbff` | pale blue | in CSS; antialiased on empty card |
| Mistral Nemo | `#67e8f9` | cyan | in CSS; competes with the water |

`inspect-visual/VERDICT.md` already measured the you-lines at those same hexes (`rgb(127,216,196)` etc.). `.card-mini.you` (`styles.css:1348-1350`) and `.line.you p` (`styles.css:1674-1676`) recolor the user's type to the same candy. So Gemini is **mint name + mint “you” on teal water**. Two cyans and a wallpaper cyan. That is why Gemini looks “off” instead of premium — the identity color is the same family as the world, so it turns into a stain.

Command gold `#f2c14e` and MiniMax salmon `#ff9e6b` do the opposite crime: they are the only warm marks in a cold scene, so they scream. Home's remaining saturated pixels after the wallpaper are hue **20°** (`#ffb066`) and hue **40°** (`#f2c14e`). Those are not accents. They are competing light sources.

Card plates themselves are almost right (`rgba(255,255,255,0.05)`, no hue wash). The type on top undoes it.

### 1b. The roster is a 24-hue Skittles bag

`src/lib/roster.ts`: **70** `color:` assignments, **24 unique hexes**. Default-six already spans mint / peach / gold / salmon / blue / cyan. The rest of the bag, waiting behind the Models pane:

| Hex | Used as | Crime |
|---|---|---|
| `#7fd8c4` | Gemini, Gemma, Flash Image | mint, clashes with water |
| `#ffb066` | Mistral Small / Large, Codestral | peach |
| `#f2c14e` | Command R | gold — Collider banned gold as chrome |
| `#ff9e6b` | MiniMax, MiMo, Grok 4.5, Hailuo | salmon |
| `#9ecbff` / `#67e8f9` / `#4dcaff` / `#6bb8ff` / `#3b82f6` | Ling, Nemo, Grok, Sonar, Sora | five blues |
| `#c9a7ff` / `#a78bfa` | Qwen / Wan / MJ | two purples |
| `#8ee878` / `#7ee2a8` / `#4be6b1` / `#84cc16` | Laguna, GLM, Kimi, Kling | four greens, Kling is lime |
| `#f5e000` | Nano Banana, Elite tier | **traffic-light yellow** |
| `#ff6ba0` / `#ff69c8` / `#f6a4c9` | Veo, Lyria, KAT | three pinks |
| `#d9d3c7` | GPT family | beige, collapses into white type |
| `#dc2626` | Pro tier | crimson kicker |

This is the anti-pattern named in `attachments/the-only-frontend-skill-you-need.md`: *“Rainbow or candy-colored palettes without a dominant anchor.”* There is no dominant. Every model is a mascot.

### 1c. Models pane is a rack of colored lightbulbs

`qa-vis/d-settings-models.png`: dark chips (`rgba(8,8,12,0.78)`) with **on-state light-core / light-bloom / light-ring / chip-edge all keyed to `--chip-accent`** (`styles.css:1131-1216`). On-screen at once: mint, peach, gold, salmon, blue, cyan, plus purple (`#c9a7ff`) and beige (`#d9d3c7`) in the lower grid. Each ON chip blooms `opacity: 0.62` of that hex, `box-shadow: 0 0 10px var(--chip-accent)`, and breathes.

Then a **crimson PRO band**: `.tier-band.pro .tier-kicker { background: rgba(220,38,38,0.28) }` over `#dc2626`. Locked Pro is worse: `.tier-band.pro.locked .tier-lock { background: rgba(70,12,16,0.62); color: #fecaca }`. Blood-red veil on a teal world.

Collider `glass26.ts` TIER is the opposite on purpose:

```
pro: "rgba(100,181,246,0.28)"    // premium blue-glow, not orange/gold
elite: "rgba(255,255,255,0.12)"
```

Aether replaced that with crayon red and crayon yellow (`TIER_INFO.elite = #f5e000`).

Ember leftovers still in CSS: `.ember-row.on::before` radial of `rgba(255, 159, 10, 0.38)` → `rgba(255, 69, 58, 0.08)` (`#ff9f0a` / `#ff453a`). Token `--color-ember: #ff9f0a` is sitting in `@theme` doing nothing useful except inviting the next agent to use it.

### 1d. Stacked photos — the same landscapes sold three times

This is the second overdone system, and it is louder than the names.

**Files** (`qa-next/files.png`): Photos-Years mosaic of the **theme pack** (pink dune hall, snow ridge, cyan shore, green forest, purple night, brown dune, more). Measured saturated mix inside the phone:

- 195° / 210° cyan-blue `#2e6b94` `#acd0f0` (the water tile **and** the wallpaper)
- 45° / 60° olive-gold `#77703b` `#c8c83b` `#fdeeb1` (forest + LIVE)
- 15° / 30° sand `#815843` `#9c8052` `#f2cfad` (dune / desert)
- 150° / 165° mint-forest `#5c9e86` `#82c9ba`

LIVE badges read as yellow-gold (`#cdc131` `#c8c83b` `#bca642` sampled). They sit on cyan and pink tiles. Traffic-light on a postcard.

**Smart Cards** (`qa-next/smart-cards.png`) is the **same mosaic again** (Memories composition). Cell-center averages I actually measured:

| Cell | Hex | What it is |
|---|---|---|
| r0c0 | `#476a90` | blue interior |
| r0c1 | `#3c71a5` | blue interior |
| r1c0 | `#736a48` | khaki / dune |
| r1c1 | `#4b4b21` | olive |
| r2c0 | `#b1aaac` | pink-grey cabin |
| r3c0/c1 | `#7aafd8` / `#8fb6dc` | cyan water |
| r4c0/c1 | `#6c9289` / `#3c989a` | teal forest |

**Smart Cards + Genie dock** (`qa-next/smart-cards-dock.png`): that rainbow still occupies the top half. The dock is graphite `#1d1d20` — correct — so the mosaic above it looks even more like a sticker sheet.

**Smart Canvas** (`qa-next/smart-canvas.png`): `.canvas-scene-bg { opacity: 0.55 }` puts a **second wallpaper** inside the window, on top of the environment wallpaper, then drops `.canvas-card` stills (more of the same photos) and a sticky-note object `#f3e27a` on top of that. Measured: 44% hue 210° (water) + 32% hue 45° (`#f3e27a` / `#f8eeb0`). Two environments plus a yellow prop.

**Imagine** (`qa-vis/d-imagine.png`): Pinterest masonry of generated stills — this one is allowed, because the photos **are** the content. The crime is doing the same move on Files / Smart Cards / Canvas **while a full-bleed theme is already the environment**. Apple Photos Years has no wallpaper behind the mosaic. The mosaic *is* the view. Aether shows:

1. environment photo (shore)
2. work-frost `rgba(12,14,20,0.78)`
3. a grid of the other seven themes

You are looking at eight landscapes at once. That is why it feels cheap and loud rather than spatial.

### 1e. Competing system tokens on top of all of that

From `@theme` in `src/styles.css`:

```
--color-accent: #0a84ff;   /* send disc, consensus-mark, ::selection */
--color-ember: #ff9f0a;
--color-ember-deep: #ff453a;
--color-ok: #30d158;       /* .os-switch.on */
--color-danger: #ff453a;
```

Plus:

- `.send-btn { background: var(--color-accent) }` — a 40px **#0a84ff** disc. visionOS send is white on glass.
- `.consensus-mark` 7px `#0a84ff` with `box-shadow: 0 0 8px rgba(10,132,255,0.7)`.
- Probe chips in `prompt-bar.tsx`: Web `#f5e000`, Research `#5dbdff`, Deep `#9ad0f5`. Yellow + two more blues.
- `.os-switch.on { background: #30d158 }` — iOS green, fine **if it were the only chroma in settings**. It is not.
- History tags: `style={{ color: model.accent, borderColor: model.accent+'77' }}`.
- Consensus names: `style={{ color: lead.accent }}` and each node `--node-accent`.
- `.env-aurora` screen-blend blobs: `rgba(80,220,160,0.4)` mint, `rgba(80,140,255,0.3)` blue, `rgba(180,120,255,0.16)` purple, opacity 0.22. `.live-aurora` repeats it at **0.45**. `.live-caustic` adds `rgba(180,230,255,0.5)` and `rgba(30,80,120,0.28)`.

So a single home frame can legally contain: wallpaper teal, six name hues, a blue send, a blue consensus dot, mint/blue/purple aurora, and (if a live theme) caustics. That is not a system. That is residue from every previous pass.

### 1f. Boards are the exception that still overshoots

`qa-next/smart-boards.png` is the only Smart surface that looks like *objects* instead of a sticker sheet. Measured: 58% hue 30° cream/cork `#b7945e` / `#c8c2b7` / `#b9b2a6`. That is material color, which visionOS also allows (a yellow notepad is yellow because it is a notepad).

The overshoot: `.object-task` / sticky fill is **`#f3e27a`** (23.8% of saturated board pixels, brightest `#f3e27a` / `#f3e27a` again on canvas). Cork pins `#c45c4a` and `#3d6ea8`. Notebook spine `#8b3a32` / `#c45c4a`. Fine in isolation. On a teal wallpaper, the yellow notes read as a third accent family. Mute the note to `#e6d9a8` and keep the spine; do not also run `#f5e000` LIVE badges elsewhere.

### 1g. Smart Hub proves the rest is a choice

`qa-next/smart-hub.png`: work-frost `#0c1018` / `#0c0f16`. Saturated pixels are **96.1% hue 210°** — that is wallpaper leak around the window, not chrome. Buttons are colorless glass, white type. This is the correct picture. Every other surface should be this, with content (photos, physical boards) as the only chroma.

---

## 2. What visionOS / Kosmik actually does with color

### visionOS

The world is the hue. Chrome is a material, not a paint.

- Materials (`ultraThin` … `ultraThick`) are **colorless** glass. They pick up the environment by refraction. They do not carry a per-item hex.
- Ornaments, tab bars, window controls: white/black translucency + hairline. No mascot colors.
- System colors (`#0A84FF` blue, `#30D158` green, `#FF9F0A` orange, `#FF453A` red, `#FFD60A` yellow) exist for **semantic controls**, one at a time — a switch, a destructive action, a selected glyph. Never as a 24-item identity palette.
- Photos / TV: the image is the view. Labels are white with a shadow. There is no second wallpaper showing around a mosaic of other wallpapers.
- HIG: do not compete with the user's environment. If the environment is a teal sea, the UI does not also become mint, peach, gold, salmon, blue, cyan.

### Kosmik (the composition we already claimed)

`docs/EVIDENCE.md`:

> Tint the **wallpaper**, not a plate on the canvas. Canvas is a clear frame. Cards sit in front. Untint in card view.

> Frosted window fill; tinted card glass; tinted canvas plate — **Not this.**

Kosmik's color story is one photo, slightly veiled (`rgba(8,10,16, 0.34 / 0.26 / 0.48)`). Cards are clear. Names in the Figma community file are white. We inverted the last part with a “user override”: *model color on the name, not the plate.* That override is what broke the picture. Color-on-the-name at full saturation, times six, times you-lines, times chip lights, times history tags, times consensus nodes, is just a fill by other means.

### Collider VOS_PALETTE (the tokens we are supposed to be)

`/tmp/collider/collidermergedx3-glm/src/styles/glass26.ts`:

```
VOS_PALETTE = {
  aurora: "rgba(60,80,140,0.28)",   // cool field, not a rainbow
  modelGlow: "rgba(255,255,255,0.04)",
  lipGlow: "rgba(255,255,255,0.15)",
  ink: "#eef1f6",
  inkSecondary: "rgba(238,241,246,0.7)",
  inkTertiary: "rgba(238,241,246,0.45)",
  hairline: "rgba(255,255,255,0.12)",
  hairlineActive: "rgba(255,255,255,0.28)",
  hairlineFaint: "rgba(255,255,255,0.07)",
}
```

Glass card stops: `rgba(20,20,30,0.72)` × 3 — **no hue**. `theme.ts`: *“Neutral black/white chrome — no purple/blue tint. Palette rule: black + white as the two base colors.”* `CLAUDE.md`: *“Orange/gold banned as an accent.”* `glass26` TIER pro is blue-glow, elite is white-glow.

Aether `@theme` currently ships `#0a84ff` `#ff9f0a` `#ff453a` `#30d158` plus a 24-hex roster plus `#dc2626` / `#f5e000`. That is the old Collider crayon layer, not VOS.

### The frontend-skill rule (same conclusion, different door)

Near-monochrome base. **One** accent, used on CTAs only. Candy palettes without a dominant are listed as an AI tell. We are that tell.

---

## 3. Recommended system (tight)

**How many hues:** **zero in chrome.** One in the world (the wallpaper). One optional interactive fill, used once. Identity, if it must exist, is a 6px mark, not type.

### Allowed

| Layer | Color | Rule |
|---|---|---|
| Environment photo | whatever the theme is | The only large chroma. Veil may darken (`rgba(8,10,16,…)`), never rehue, never add aurora blobs. |
| Content that **is** a picture | the picture | Files / Imagine / a generated still. Not a mosaic of *other themes* while a theme is already the world — see kill-list. |
| Physical board objects | material (paper cream, cork, leather) | Notebook `#f6edd8` / spine `#8b3a32` stay. Sticky `#f3e27a` mutes toward `#e6d9a8`. |
| Type | `VOS_PALETTE.ink` `#eef1f6` | Secondary `rgba(238,241,246,0.7)`, empty `rgba(238,241,246,0.4)`. User vs model = **weight 600 vs 400**, not hue. |
| Glass | white alpha + hairline | `rgba(255,255,255,0.05–0.14)` fill, `rgba(255,255,255,0.12–0.28)` stroke, dark work-frost `rgba(12,14,20,0.78)` on working surfaces. |
| Interactive fill (pick **one**) | white `#eef2f8` on dark, or system blue `#0A84FF` | Send, primary action, selected tab. visionOS send is white — prefer white. Do not also run green switches *and* yellow probes *and* red kickers. |
| Destructive | `#ff6b6b` / `#ff453a` | Context-menu danger only. |
| Long-press lift | white glow | `rgba(255,255,255,0.35)`, not `--card-accent`. |
| Optional identity mark | one 6×6 disc or 2px left edge | Same luminance, sat ≤ 0.25, **never** on the name, never on the you-line, never as a bloom. If we cannot mute the roster to ~6 related tones, drop identity color entirely. |

### Forbidden

- Any hex on `.card-name`, `.card-view-title`, `.card-mini.you`, `.line.you`, `.hist-tag`, `.consensus-name`, `.consensus-node`.
- Per-model `--chip-accent` lights, edges, blooms.
- Second wallpaper (`.canvas-scene-bg`) under an environment wallpaper.
- Theme-pack mosaics on Files / Smart Cards while home wallpaper is visible around the window. Either (a) the working surface is opaque enough that the environment is gone, and the mosaic is content, or (b) Files shows **generated** stills, not the other seven wallpapers.
- Aurora / caustic / mist overlays as extra hue.
- Token pile: ember orange, elite yellow, pro crimson, probe yellow, lime Kling, Nano Banana `#f5e000`.
- Green switch **plus** blue send **plus** yellow LIVE **plus** red PRO on one product.

### Count, stated once

- Chrome hues: **0**
- Environment hues: **1** (the active theme)
- Interactive hues: **1** (white fill, or `#0A84FF` if a fill is required)
- Semantic danger: **1**, destructive only
- Identity hues: **0 preferred**, else ≤ 6 muted marks, never type

That is a visionOS-correct system. It is also what Smart Hub already is.

---

## 4. Kill-list (remove or mute)

Concrete classes / treatments. Do not “soften” these — they are the overdone.

### Type that should be ink, not candy

| Selector / site | Current | Do |
|---|---|---|
| `.card-name` | `color: var(--card-accent, #f4f6fa)` | `#eef1f6` / `#f4f6fa`. Keep the text-shadow. |
| `.card-view-title` | `var(--card-accent)` (two declarations, last at 2601) | same ink |
| `.card-mini.you` | `color: var(--card-accent)` | `#eef1f6`; keep `font-weight: 600` |
| `.line.you p` | `color: var(--card-accent)` | same |
| `history-view.tsx` `.hist-tag` inline `color: model.accent` | candy + tinted border | ink + `rgba(255,255,255,0.14)` border |
| `consensus-preview.tsx` `lead.accent` / `s.accent` / `--node-accent` | six names in six hues | ink; selected node = white, not hex |
| `styles.canon.css` `.card-mini.you` background mix 38% accent | leftover bubble | already killed in `styles.css`; do not restore |

### Glows, blooms, aurora

| Selector | Current | Do |
|---|---|---|
| `.card-bloom` | 120×120 `var(--card-accent)` @ 0.16 | **delete** (not even in `model-card.tsx` JSX — dead CSS landmine) |
| `.card-aura` | `0 0 18px var(--card-accent), 0 0 40px … 55%` | long-press only, swap to white |
| `.model-chip .chip-edge` / `.light-bloom` / `.light-ring` / `.light-core` | `--chip-accent` `#ff9f0a` default, on-state bloom 0.62 | white core `rgba(255,255,255,0.9)`, bloom `rgba(255,255,255,0.18)`. Edge = hairline. |
| `.ember-row.on::before` / `.off::before` | `#ff9f0a` / `#ff453a` radials | delete; ON is the white light |
| `.env-aurora` | mint+blue+purple screen blobs @ 0.22 | **delete**. The wallpaper is the aurora if the theme is aurora. |
| `.live-aurora` | same @ 0.45 | **delete** or opacity ≤ 0.08 and grayscale |
| `.live-caustic` / `.live-mist` | extra cyan overlays | mute hard or delete |
| `--color-ember` `#ff9f0a` / `--color-ember-deep` | tokens | remove from `@theme` |

### System crayons

| Selector / token | Hex | Do |
|---|---|---|
| `.send-btn` | `#0a84ff` | `#eef2f8` fill, `#0a0c11` glyph (already the pattern on `.f1-act.primary` / `.genie-pop`) |
| `.consensus-mark` | `#0a84ff` + 0.7 glow | white 6px, no glow, or hairline ring |
| `::selection` | accent 45% | `rgba(255,255,255,0.22)` |
| `.os-switch.on` | `#30d158` | `rgba(255,255,255,0.85)` track, dark thumb — one less hue. If a switch must be green, then send cannot be blue. |
| `--color-ok` | `#30d158` | drop or keep only if it is the single interactive |
| Probe `INVESTIGATION[].color` | `#f5e000` `#5dbdff` `#9ad0f5` | all white glyphs; selected = filled white pill, not a third blue |
| `.tier-band.pro .tier-kicker` | `rgba(220,38,38,0.28)` | `rgba(255,255,255,0.08)` + white type (match elite) |
| `.tier-band.pro.locked .tier-lock` | `rgba(70,12,16,0.62)` `#fecaca` | `rgba(8,10,16,0.55)` like free/elite |
| `TIER_INFO.pro` | `#dc2626` | retire; type + lock is enough |
| `TIER_INFO.elite` | `#f5e000` | retire; `rgba(255,255,255,0.12)` as in `glass26` TIER |
| LIVE badge (theme-live on Files tiles) | yellow-gold `#c8c83b` / `#cdc131` | white glyph on `rgba(0,0,0,0.5)` — the class `.theme-live` is already that; whatever is painting yellow, kill it |

### Stacked photos / second environment

| Selector | Current | Do |
|---|---|---|
| `.canvas-scene-bg` | `opacity: 0.55` second wallpaper | **0**. Canvas is a working surface (`work-frost`) or a scene swap that **replaces** the environment, never both. |
| Files Years tiles sourced from `/themes/*` | eight landscapes on a ninth | tile **generated files**, or opaque the window so the environment is not a tenth. Do not show Shore as wallpaper *and* as a tile. |
| `.mem-card` / Smart Cards mosaic | same theme pack | same rule: Smart Cards are cards, not a wallpaper catalog. Use object chrome (already built for boards) or generated thumbs. |
| `.files-tile` `background: #111` | fine | keep the structure (Years labels, 2-col mosaic). Change the **contents**. |
| `.canvas-card img` | theme stills floating on a scene-bg | one photo layer, not three |

### Roster

Collapse or ignore. 24 unique hexes cannot be “muted a bit.” If identity survives, map families to **six** desaturated marks (sat ≤ 0.25, luma ~180), and **stop binding them to type**. `#f5e000` `#84cc16` `#ff6ba0` `#dc2626` are not marks, they are toys — ban even as marks.

---

## 5. Keep-list (this already works)

Do not “improve” these. They are the visionOS picture.

| Thing | Why it works | Evidence |
|---|---|---|
| Kosmik veil on the **photo** | `.env-veil` gradient `rgba(8,10,16, 0.34/0.26/0.48)`, no backdrop-filter | `color-home.png` water reads as one field, not a tinted plate |
| `.veil-untint` in card view | environment gets brighter, chrome stays clear | `inspect-visual/06-card-view.png` |
| `.veil-work` + `.work-frost` | working surfaces go opaque `rgba(12,14,20,0.78)` blur 28 | Smart Hub `#0c1018` |
| Clear canvas / window | `.glass-window` / `.main-window` `background: transparent; backdrop-filter: none`. `.canvas-plate { display: none }` | wallpaper continuity through the frame |
| `.model-card` glass | `rgba(255,255,255,0.05)`, hairline `rgba(255,255,255,0.28)`, inset sheen, **no accent wash** | plates are correct; only the names are wrong |
| Card vs model type pairing | same Manrope, same size, 600 vs 400, no bubbles | keep the **weight** split; drop the hue split |
| `.card-empty` | `rgba(238,241,246,0.4)` | correct tertiary |
| Smart Hub buttons | transparent / `rgba(255,255,255,0.08–0.16)`, white type | `qa-next/smart-hub.png` — 96% of chroma is wallpaper leak |
| `.genie-dock` | `rgba(12,14,20,0.9)` + hairline | `smart-cards-dock.png` dock is graphite; keep, mute the mosaic above it |
| `.genie-pop` / `.f1-act.primary` | `#eef2f8` on `#0a0c11` | this is the correct primary, not `#0a84ff` |
| Window bar + contact shadow | colorless, ellipse `rgba(0,0,0,0.5)` | spatial without hue |
| Text-shadow on type over photos | `0 1px 3px rgba(0,0,0,0.9)` | legibility without a tinted plate |
| Photos-Years **structure** | `.years-label` 22px, 2-col mosaic, LIVE glyph in a dark disc | keep the layout; change what the tiles depict |
| Board **objects** | notebook spine, cork frame, portfolio flap, tray rim | this is Memories done right. Mute `#f3e27a` only. |
| VOS_PALETTE values | ink `#eef1f6`, hairlines, `modelGlow` white 0.04 | adopt them; stop growing `@theme` crayons |
| `glass26` TIER | free silver, pro blue-glow 0.28, elite white 0.12 | if a tier mark is required, use this, not `#dc2626` / `#f5e000` |
| Grain 0.055 overlay | texture, no hue | keep |

---

## Verdict

The plates, the veil, the hub, the dock, the window frame — those are visionOS. The product then panics and tattoos a unique hex onto every name, every you-line, every chip light, every consensus node, every history tag, then dumps the entire theme pack as a mosaic on top of the theme that is already the world, then sprinkles `#0a84ff` `#30d158` `#f5e000` `#dc2626` `#ff9f0a` on controls.

**Overdone** is not “too much glass.” It is **too many light sources**. Kill the candy type, kill the colored bulbs, kill the stacked wallpapers, leave the environment as the only hue. Smart Hub is the proof. Home should look like that, with six clear cards and white names, not a gum display.
