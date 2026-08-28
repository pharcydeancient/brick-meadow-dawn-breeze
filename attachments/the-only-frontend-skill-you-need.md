name: the-only-frontend-skill-you-need-for-beautiful-websites

description: The only frontend skill you need for Beautiful Websites. Opinionated design system for creating distinctive, production-grade frontend interfaces. Use when users ask to build a website, landing page, hero section, marketing page, dashboard, React component, or any web UI. Combines bold creative direction with restrained professional execution. Overrides default AI aesthetic tendencies (purple gradients, glowy buttons, Inter font, bloated layouts) with intentional design. Inspired by Vercel, Raycast, Linear — but always context-specific and never templated.
Frontend Design Skill
Guides creation of distinctive, production-grade frontends that avoid generic "AI slop" aesthetics. Every design should feel like a senior designer reviewed it.

Phase 1 — Design Thinking (do this before writing any code)
Answer these before touching code:

1.
Purpose: What problem does this interface solve? Who uses it?
2.
Tone: Pick ONE direction and commit fully:
brutally minimal — surgical whitespace, 1–2 colors, zero decoration
editorial / magazine — strong typography, asymmetric layouts, column grids
dark & technical — deep backgrounds, monospace accents, data-dense
soft & refined — muted pastels, generous spacing, serif type
bold & playful — saturated color, large type, kinetic energy
retro / vintage — textured backgrounds, serif stacks, warm palettes
luxury — tight typography, gold/ivory, restrained motion
brutalist / raw — high contrast, distorted scale, intentional clashing
1.
Differentiation: What is the ONE thing someone will remember about this design?
2.
Complexity match: Maximalist vision → elaborate code. Minimalist vision → restraint and precision.
CRITICAL: Commit to the direction. Vague or hedged directions produce forgettable output.

Anti-Patterns — Never Do These
These are the "AI tells." Avoid them unconditionally.

Typography

Inter, Roboto, Open Sans, Lato, system-ui as the primary typeface
Using the same font across multiple projects (Space Grotesk is a specific trap)
400 vs 600 weight contrast — use extremes: 200 vs 800, or 100 vs 900
Uniform font sizes — use dramatic jumps (3x+), not 1.5x steps
Color

Purple/violet gradients on white or light backgrounds (the #1 AI tell)
Rainbow or candy-colored palettes without a dominant anchor
Timid, evenly-distributed color — pick a dominant, punctuate with one sharp accent
Gradients as filler — only use them when they serve the aesthetic
Layout & Components

Pill-shaped cards and buttons on everything (excessive border-radius)
"Wall of cards" feature sections — 6+ identical cards in a row
Perfectly centered everything — it reads as a template
More than 4–5 sections on a landing page without good reason
Icon spam — 8 icons in a row without spatial breathing room
Heavy box-shadow stacking (shadow on shadow on shadow)
Frosted glass everywhere (use once, with purpose, or not at all)
Copy & Structure

Filler headlines: "Unlock the power of…", "Revolutionize your workflow"
Auto-playing animations on every element
Decorative gradients that communicate nothing
Flat white (#ffffff) or pure black (#000000) backgrounds — always offset
Typography
Typography is the single highest-leverage design decision. Choose distinctively.

Display / Heading font options by mood:

Category	Fonts
Editorial / Prestigious	Playfair Display, Fraunces, Crimson Pro, Newsreader
Bold Startup	Clash Display, Cabinet Grotesk, Satoshi, Bricolage Grotesque
Technical / Engineered	IBM Plex Sans, Source Sans 3, Geist, Sora
Geometric / Confident	Manrope, Plus Jakarta Sans, General Sans, Instrument Sans
Distinctive / Unusual	Obviously, Ohno Blazeface, Anybody, Unbounded
Monospace Accents	JetBrains Mono, Fira Code, IBM Plex Mono
Pairing rule: High contrast = interesting.

Display + monospace (editorial + technical)
Serif + geometric sans (warmth + precision)
Variable font across extreme weights (same family, 100 vs 900)
Weight rule: Never 400 vs 600. Use 200 vs 800, or 100 vs 900. Size jumps of 3x minimum.

Load from Google Fonts or Bunny Fonts. One display font, one body font, max.

Color System
Start with a near-monochrome base. Add one accent. Execute with precision.

Dark theme baseline:

css


:root {

--bg: #0a0a0a; /* not pure black */

--bg-subtle: #141414;

--bg-raised: #1c1c1c;

--border: #262626;

--text: #ededed;

--text-muted: #a1a1a1;

--text-faint: #525252;

--accent: /* one per project — see below */;

--accent-mute: /* accent at 15% opacity */;

--radius: 8px;

}
Light theme baseline:

css


:root {

--bg: #fafafa; /* not pure white */

--bg-subtle: #f0f0f0;

--bg-raised: #ffffff;

--border: #e5e5e5;

--text: #171717;

--text-muted: #6b6b6b;

--text-faint: #a3a3a3;

--accent: /* one per project */;

}
Accent color selection:

Draw from IDE themes, cultural palettes, brand context — not generic presets.

Examples of non-generic accents: amber (#f59e0b), electric cyan (#06b6d4), coral (#f97316), forest green (#16a34a), slate blue (#6366f1 used sparingly), warm sand (#d4a853).

Pick ONE. Use it for CTAs, key links, and highlights only.

Motion
Animations should feel inevitable, not decorative.

Page load:

css


/* One staggered reveal for above-the-fold — this is enough */

@keyframes fadeUp {

from { opacity: 0; transform: translateY(24px); }

to { opacity: 1; transform: translateY(0); }

}

.hero-element { animation: fadeUp 0.45s ease-out both; }

.hero-element:nth-child(2) { animation-delay: 0.1s; }

.hero-element:nth-child(3) { animation-delay: 0.2s; }
Hover states:

Subtle scale: transform: scale(1.02) on cards
Color shifts on links: 150ms ease-out
Never bounce, shake, or rubber-band
Scroll animations:

Only when they reveal content meaningfully
No gratuitous parallax or every-element triggers
Timing rule: 150–250ms for micro-interactions. Never longer unless intentionally cinematic.

React: Use Motion (formerly Framer Motion) when available.

HTML/CSS: CSS animations only — no JS animation libraries.

Spatial Composition & Backgrounds
Layout principles:

Asymmetry when intentional — the eye should have a clear path
Grid-breaking elements to signal creative confidence
Generous negative space OR controlled density — never mediocre middle ground
Break long pages with background tone shifts (light → subtle gray → light), not dividers
Max content width: 1100–1280px, centered, generous side margins
Spacing scale:

css


--space-section: clamp(64px, 8vw, 120px);

--space-content: clamp(32px, 4vw, 64px);

--space-gap: clamp(16px, 2vw, 32px);
Typography scale:

css


--text-hero: clamp(2.5rem, 5vw, 4.5rem);
--text-h2: clamp(1.75rem, 3vw, 2.75rem);
--text-h3: clamp(1.25rem, 2vw, 1.875rem);
--text-body: 1.0625rem; /* 17px */
--leading: 1.6;
Background techniques (pick what fits the aesthetic):

Gradient mesh: multiple radial-gradients layered at low opacity
Noise texture: SVG filter or CSS url("data:image/svg+xml...") grain overlay
Geometric pattern: CSS background with repeating-linear-gradient
Dot grid: radial-gradient repeated pattern
Vignette: radial-gradient dark-to-transparent on dark themes
Solid + one textured section to break rhythm
Component Rules
Buttons:

Primary: solid fill, accent color, 6–8px radius
Secondary: ghost/outline variant, same radius
Never pill-shaped by default (unless the aesthetic demands it)
Hover: subtle brightness shift or border color change
Cards:

Minimal: light border (var(--border)) or subtle background (var(--bg-subtle))
Shadow: one, subtle — box-shadow: 0 1px 3px rgba(0,0,0,0.12)
Never stack multiple shadows
Navigation:

Clean and minimal: logo left, links center or right, one CTA
Backdrop blur if sticky: backdrop-filter: blur(12px) with semi-transparent bg
No mega-menus unless truly warranted
Forms:

Inputs: var(--bg-subtle) fill, var(--border) border, focus ring in accent color
Labels above inputs, not placeholder-only
Footer:

Simple link grid, muted text, don't over-design
Complexity Matching
This is non-negotiable:

Aesthetic direction	Implementation requirement
Maximalist / Expressive	Elaborate code: multiple animations, texture layers, dramatic type, dense effects
Bold / Confident	Strong type hierarchy, clear color story, a few well-timed interactions
Refined / Minimal	Surgical precision: exact spacing, perfectly balanced whitespace, subtle details
Technical / Dark	Data-rich components, monospace accents, grid density, crisp borders
Minimalism is not an excuse for low effort. Restraint requires more precision, not less.

Final Check Before Shipping
Before considering any design done, verify:

 Is the font choice distinctive for this project? (Not Inter, not Space Grotesk again)
 Is there exactly ONE accent color, used sparingly?
 Does the background have depth, not just a flat fill?
 Is the type scale dramatic enough to create real hierarchy?
 Are animations purposeful — not on every element?
 Would a designer look at this and think it was made by a human?
 Is there one thing about this design someone will remember?
If any answer is "no" — revise before outputting.

Remember: This skill enables extraordinary creative work. Don't default to safe choices. Commit fully to a direction and execute it with precision.