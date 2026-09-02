# visionOS color language — spatial glass chat

Research brief. Do not treat this as a palette of pretty fills. visionOS color is **light through glass**, not paint on plates.

Sources: Apple HIG [Materials](https://developer.apple.com/design/human-interface-guidelines/materials), [Color](https://developer.apple.com/design/human-interface-guidelines/color), [Windows](https://developer.apple.com/design/human-interface-guidelines/windows), [Ornaments](https://developer.apple.com/design/human-interface-guidelines/ornaments), [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode) (“Dark Mode isn’t supported in visionOS”); WWDC23-10072 *Principles of spatial design*; David Smith *Tinting a Glassy Ornament*; Create with Swift *Ensuring interface legibility and contrast in visionOS*. Figma: official [Apple Design Resources — visionOS](https://www.figma.com/community/file/1253443272911187215), [visionOS 26](https://www.figma.com/community/file/1540071341298017505), community [Apple visionOS Design Ideas](https://www.figma.com/community/file/1340632222885153874) (Kosmik, Photos, Apple TV, Memories).

Banned in this product: purple, pastel chip fills, a second wallpaper stacked on the canvas, colored chat bubbles, body copy dyed in accent hexes.

---

## How glass actually uses color

**Windows.** The default window background is an **unmodifiable system material called glass**. It is not a CSS fill you tint. Glass lets light, the current Environment, virtual content, and the physical room show through, then **compresses the background color range** so contrast for app content stays usable while the plate itself gets brighter or darker with the surroundings. Specular highlights and contact shadows tell you the window’s scale and position. HIG: retain the glass; opaque fills feel constricting; removing glass makes type unrelated and illegible.

**Ornaments.** An ornament’s default background is the same glass. Buttons on it should be **borderless** — the system hover highlight is the interactivity cue, not a colored chip. Tinting an ornament by setting `background` kills frost and specular. The method that survives is `.tint(color)` on the control, or a very thin overlay that still leaves glass and highlight intact (Smith, 2023). Do not put a colored view *behind* `.glassBackgroundEffect()` — you get ghost tints that swim in Z.

**System materials vs tinted fills.**

| Layer | What Apple does | What a fill would do |
|---|---|---|
| Window plate | System glass, no hue | Dyed frosted rectangle that fights the room |
| Ornament / toolbar | Glass + hover, optional `.tint` | Pastel capsule |
| Interactive control | **Thin** material | Saturated chip |
| Section / sidebar | **Regular** material | Dark opaque slab |
| Recessed field | **Thick** material | Black well with no frost |
| Foreground type | Vibrancy (label / secondary / tertiary) | Hard-coded hex that dies on a new wallpaper |

visionOS vibrancy has **three** levels, not four: `label` for standard text, `secondaryLabel` for footnotes, `tertiaryLabel` only for inactive things that do not need high legibility. Vibrancy is not decoration — it **pulls light and color forward from the surroundings**, so type stays related to the room.

**Dark / light.** There is no Dark Mode on visionOS. Glass brightness tracks the environment. System colors use the **default dark values**. White type is the readable default on variable glass. Do not ship a light-mode chrome skin.

---

## What “physics-based light” means

WWDC: *“Any object that appears to emit light should shine color onto nearby objects.”* *“Most other objects should cast a shadow.”*

In practice this is **emissive points and bounce**, not pastel fills.

- A selected model is a **small ember / torch / pip** that actually glows — a 6–8 pt point, maybe a 12–20 pt bloom, that can kiss the nearest edge. It is a light source. It is not a mint rectangle.
- A lifted card casts a **deeper contact shadow** and a white specular, as if it came closer to a key light.
- The wallpaper is the **image-based light**. A dark veil on the *photo* is the IBL exposure control. The canvas plate does not get a matching wash.
- Dimming (passthrough / wallpaper darkening) is how you focus a working surface without painting the UI.
- Color that cannot plausibly be a lamp, a highlight, or bounce from the Environment is noise.

If you cannot point to the photon, delete the hue.

---

## Kosmik: tint the environment, not the UI plate

Kosmik (and the visionOS Design Ideas file) keep the landscape as the colored thing. The canvas is a **clear frame** — edge, radius, contact shadow, interior optically empty. Cards float in front as thinner glass. Focus (card view, Imagine, Smart Gen) **untints** or dim-focuses the photo; it does not stack a second image or a milky plate on the canvas.

This is the same idea as Apple’s glass: the room supplies color; the window modulates it. A second wallpaper inside the window is a poster glued to the glass. A hue-washed card is stained glass with no window.

---

## 8 rules

**1. Glass is a system material; hue is not a background.**
Windows and ornaments stay untinted glass; color arrives as environment shine-through, specular, or a rare `.tint` on a control.
- Do: clear canvas frame, white edge, contact shadow.
- Don’t: `background: color-mix(accent, glass)` on the window or the card plate.

**2. There is no light/dark theme; there is only the room.**
Type and fills use the dark-value system tokens and let glass track the wallpaper’s luminance.
- Do: white vibrancy labels; a black-alpha veil on the photo.
- Don’t: a light-mode sheet, a second color-scheme, or swapping chrome hexes per theme.

**3. Use color sparingly, especially on glass, and never in small lightweight type.**
HIG: prefer color in bold text and large areas; color in small type is hard to see; colorful surroundings already leak through the plate.
- Do: color the model **name** (bold) or a 6 pt emissive pip.
- Don’t: dye 12 px body copy in `#7fd8c4` / `#c9a7ff` / any accent hex.

**4. Physics light is a point, not a fill.**
On-state, selection, and “this speaker is live” are lamps. They bloom. They do not flood a chip.
- Do: circular ember, lit rim, white type on dark glass.
- Don’t: pastel chip fills, hue-washed card bodies, mint/peach/lavender capsules.

**5. Tint the wallpaper; leave the canvas optically empty.**
Kosmik. One environment photo. Veil on that photo only. No stacked theme inside the window.
- Do: `.env-veil` on the full-bleed image; canvas `background: transparent`.
- Don’t: a frosted `.canvas-plate`, a second wallpaper, or a matching wash on cards.

**6. Hierarchy is material thickness + vibrancy, not extra hues.**
Thin = interactive. Regular = section. Thick = recessed / working. Primary / secondary / tertiary ink.
- Do: thicker, darker backing on Files, History, Imagine, Smart Gen.
- Don’t: a new accent per surface, or stacking thin-on-thin until type vanishes.

**7. Speakers differ by weight, seat, and a light — not bubbles, not dyed paragraphs.**
User and assistant share family and size. User sits end / 600 / secondary-or-name. Assistant sits start / 400 / primary white. Optional pip. Bare type.
- Do: `font-weight` + alignment + (name or pip).
- Don’t: colored chat bubbles, glass chips on lines, YOU/AI labels, or body text in accent hex.

**8. Overlays that cover work are plates, not more glass.**
If type from the canvas would show through, the overlay failed. Alerts, History, Files, upgrade are working surfaces: near-opaque dark, then white ink.
- Do: `rgba(16,18,24,0.92+)` with a scrim.
- Don’t: a second translucent wallpaper, or readable card copy ghosting through a sheet.

---

## Recommended token set

Chrome is **white/black alpha**. One system accent exists so a link or a true primary action has somewhere to go — and is almost never used. All other color is **environment light** (the wallpaper) or a **physics lamp** (ember pip, never a fill token).

visionOS uses dark-value system colors. These are the dark labels / systemBlue, expressed as alpha so glass can breathe.

```css
:root {
  /* Ink — vibrancy stand-ins (dark label / secondaryLabel / tertiaryLabel) */
  --ink-primary:   rgba(255, 255, 255, 0.92); /* label */
  --ink-secondary: rgba(235, 235, 245, 0.60); /* secondaryLabel */
  --ink-tertiary:  rgba(235, 235, 245, 0.30); /* tertiaryLabel; inactive / placeholder only */

  /* Fills — materials, not hues */
  --fill-thin:     rgba(255, 255, 255, 0.08); /* buttons, selected, hover */
  --fill-regular:  rgba(255, 255, 255, 0.12); /* ornaments, cards */
  --fill-thick:    rgba(8, 10, 16, 0.55);     /* recessed fields */
  --fill-work:     rgba(12, 14, 20, 0.78);    /* working surfaces */
  --fill-overlay:  rgba(16, 18, 24, 0.96);    /* alerts, sheets */

  /* Structure */
  --stroke:        rgba(255, 255, 255, 0.22);
  --stroke-soft:   rgba(255, 255, 255, 0.12);
  --specular:      rgba(255, 255, 255, 0.38); /* top-edge highlight */
  --shadow:        rgba(0, 0, 0, 0.40);

  /* The one system accent — almost never. systemBlue, dark value. */
  --accent:        #0A84FF; /* links, caret, one primary CTA. Not chrome. Not bubbles. */

  /* Environment — applied to the PHOTO, never to the canvas plate */
  --env-veil-top:  rgba(8, 10, 16, 0.22);
  --env-veil-mid:  rgba(8, 10, 16, 0.08);
  --env-veil-bot:  rgba(8, 10, 16, 0.40); /* keep ≤ 0.40; 0.48 already reads as a plate */
  --env-untint:    transparent;           /* card view / focused work */

  /* Physics lamp (not a fill, not a text color) */
  --lamp:          rgba(255, 255, 255, 0.95); /* default pip / lift bloom */
}
```

**Allowed outside this set, and only as lamps or large identity type:**

- Model identity hex → **name** and **6 pt pip**. Never plate, never chip fill, never body.
- Ember (systemOrange `#FF9F0A`) → ON-state of a selector, as emission.
- SystemRed `#FF453A` → destructive / close light (traffic-light red is fine).
- True yellow `#F5E000` / crimson `#DC2626` → Pro/Elite tier marks only, large and bold.

**Never:** purple / lavender / `#c9a7ff` / `#a78bfa` as chrome. Gold-as-luxury. Pastel tints of any hue. A second accent “for fun.”

---

## Surface treatments

### Wallpaper (environment)

The theme **is** the color system. One full-bleed photo (or live wallpaper). Respect its continuity — do not break it with a milky window.

- Veil lives on the image: slight black-alpha gradient so type can sit. Not a color grade, not a brand wash.
- Card view / focused work: **untint** (brighter photo) or dim the *surroundings*, Apple-Photos style — still the same image.
- Themes swap the photo. They do not swap chrome tokens.

### Canvas (home window)

A visionOS window: edge, radius, specular, contact-shadow ellipse. Interior **transparent**. No backdrop-filter on the home plate. No `.canvas-plate`. No second image. Cards are the content; the landscape is visible between them, the way glass shows the room.

### Cards (model chat plates)

Clear glass: `rgba(255,255,255,0.05)` or `--fill-regular` at most, white hairline, inset specular. **No hue wash from the model color.** Identity = name in the model hex (bold, large enough) + optional pip. Long-press = lift + white bloom + deeper shadow, not `scale` and not a colored glow flood.

### Working surfaces (Files, History, Imagine library, Smart Gen, Theme store)

Value-added work gets a **thicker, darker backing** (`--fill-work`) so the landscape recedes and the content is the light. This is Apple’s regular/thick material, and it matches the product rule that logistical chrome is translucent while canvases you *work in* are more opaque. Still one environment behind them — frost the same wallpaper; do not load a second one.

### Overlays (settings alert, context menus, upgrade)

`--fill-overlay` + scrim. Type does not show through. Small, relocatable, dismiss on outside tap. No Cancel barn door. Close affordance is a 14 pt red light, not a giant ghost button.

### Model identity

A lamp and a name. That is the whole vocabulary.

| Place | Treatment |
|---|---|
| Card title | Model hex, weight 600, text-shadow for glass |
| Selector chip | Dark glass, **white** type, circular ember when ON |
| Card plate | Neutral glass, never `background: accent` |
| Body copy | Never the hex |
| Hover | None that recolors. Lift is enough. |

If two models would be indistinguishable without a fill, the pip failed — enlarge the pip, don’t flood the chip.

### User vs assistant text

Same family. Same size on a given surface. No bubbles. No chips. No speaker labels. No mono/sans trick. No accent hex on the paragraph.

| | User | Assistant |
|---|---|---|
| Size | shared | shared |
| Weight | 600 | 400 |
| Color | `--ink-secondary` (or `--ink-primary` if contrast on this wallpaper needs it) | `--ink-primary` |
| Seat | end | start |
| Extra | optional 4–6 pt lamp at the start of the user’s block, in the **model** identity hex | none |

The model’s color is already on the **card name**. Repeating it through every user line is dyeing body text. Weight + seat is enough; the lamp is only if a glance test fails on a given wallpaper. Placeholder / empty uses `--ink-tertiary` and only on empty cards.

### Imagine tiles

The image **is** the color. Tile chrome is neutral glass or none. Search capsule is an ornament (glass, white ink). Category chips: dark glass + white, ember when selected — never pastel. Preview/explode is a working surface (`--fill-work`), wallpaper still the same environment, no nested theme.

### Smart Gen canvas

A working surface: thicker plate, physical objects (notebook, portfolio, cork) carry their **own** material color because they are things, not UI chrome. Hub buttons and nav icons stay neutral glass. Smart Genie chat, when present, follows the same speaker rule (weight + seat, no bubbles). Canvas backgrounds may be scene photos — those are **that canvas’s environment**, not a wallpaper stacked on the home window. Home wallpaper remains one image behind the window.

---

## Figma kits (if useful)

- [Apple Design Resources — visionOS](https://www.figma.com/community/file/1253443272911187215) — official components, text styles, color styles, materials. Glass in the kit is flatter than device glass; add specular + inner shadow + environment photo behind frames.
- [visionOS 26 UI Kit](https://www.figma.com/community/file/1540071341298017505)
- [Apple visionOS Design Ideas](https://www.figma.com/community/file/1340632222885153874) — Kosmik (environment tint), Photos Years/Days, Apple TV shelves, Memories mosaics, F1 in-view preview. Composition map for this app lives in `docs/EVIDENCE.md`.

Mock against a **real environment still** (muted room, not a flat grey artboard). Glass without a room is just a grey box.

---

## Quick rejects

- Purple, lavender, gold-luxury, pastel tints of model hexes.
- Colored chat bubbles; body copy in accent hex.
- Pastel / saturated chip fills; `background: var(--card-accent)` on plates.
- Second wallpaper or frosted plate on the home canvas.
- Light-mode chrome; a per-theme accent swap.
- Stacking thin materials until ink disappears.
- Using `--accent` (#0A84FF) as decoration, card identity, or bubble fill.
