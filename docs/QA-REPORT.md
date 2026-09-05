# QA report — Collider spatial shell

Playtester pass against tracker U1–U20. Consensus internals and Smart Gen
drop-in excluded as directed.

## Method

Headless Chrome click-through of home, settings apps, account sign-in,
models, card view, history, scoped files, Imagine entry, upgrade, composer.
Visual review of captured frames.

## Functional

| Check | Result |
|-------|--------|
| Home grid up to 6 cards | Pass |
| No Cancel on settings | Pass |
| Apps: Files, History, Themes, Imagine, Smart, Store | Pass |
| Guest account + Google / Apple / email | Pass (local) |
| Logout after sign-in | Pass |
| Card view History / Files / New | Pass |
| Escape closes History without dumping card | Pass after fix |
| Files heading scoped to model | Pass |
| Upgrade copy meters Free at 20/day | Pass |
| Switch vs Upgrade language | Pass |
| Composer summons from orb | Pass |
| Free send cap / media credits | Pass in store + send path |

## Visual

| Surface | Verdict |
|---------|---------|
| Home | Wallpaper continuous, glass cards, model-colored names. Dark contact shadow under canvas is intentional. |
| Settings apps | Compact, opaque enough to read. |
| Account | Stats row is quiet. Pane now 420px so Email + Upgrade are not clipped. |
| Card view | Title ellipsizes; tools stay on the right. Wallpaper remains behind. |
| Upgrade | Working-surface plate. “Upgrade to Free” replaced with “Switch to Free”. |
| Composer | Orb + consensus card. |

## Inspector notes (second pass)

1. Guest on a persisted Pro plan is allowed (session ≠ entitlement).
2. Model lock plates only appear on Free. Default persist is Pro.
3. Sign-in does not call Google/Apple — it is a session label until OAuth
   is wired on the native client.
4. Card title still truncates on long names. Ellipsis is preferred to wrapping
   into the tools.
5. Motion is present on lift, tuck, press, and pane open. Not every icon has
   a spring.

## Ship call

Web shell is internally consistent with the visionOS brief for the in-scope
surfaces. Not an App Store binary. Smart Gen remains a drop-in. IAP remains
mocked.
