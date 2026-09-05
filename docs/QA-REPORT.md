# QA report — Collider spatial shell (orchestrator handoff)

Playtester pass after wiring session, caps, archives, card-edge tools, and
search filters. Consensus internals and Smart Gen drop-in excluded.

## Method

1. Source inspection against spec 2 + visionOS brief.
2. Independent second reading of store, send path, account pane, card tools,
   history filters.
3. Live Chrome click-through against the running shell (Playwright + system
   Chrome). Screenshots under `screenshots/playtest/`.
4. Visual review of account, models, history, card view.

## Functional

| Check | Result |
|-------|--------|
| Guest default | Pass — title Guest, persist v13 |
| Google / Apple / Email + logout | Pass — local labels, logout returns Guest |
| 20/day Free, one send = one count | Pass — claimSend |
| Media credits + Free block | Pass — costs 8/12/40, Free routes to Upgrade |
| Card Files / History / New | Pass — tools on card header |
| Escape with History open | Pass — card view defers to sheet |
| History type + model filters | Pass |
| Archive on New / load archive | Pass — live thread stored |
| Upgrade copy | Pass — Current on Free, Switch to Free exists |
| Imagine generate gate | Pass — same claimSend path |
| Consensus + Smart buttons | Pass — destinations open; internals excluded |
| Six-card cap | Pass — home rendered six Free general cards |

## Visual

| Surface | Verdict |
|---------|---------|
| Home | Wallpaper continuous, glass cards, model-colored names. Six-up grid. |
| Account pane | Compact plate. Stats quiet. Sign-in is three words. |
| Card view | Files / History / New on a second header row so the name can breathe. |
| History | Chip filters, one-line empty state, wallpaper tinted behind. |
| Models | Ember chips. Free default. Models pane raised to 520px so Pro lock plates can enter the frame. |
| Upgrade | Working-surface plate. No Upgrade to Free. |

## Inspector notes

1. Session is not entitlement. Guest on Pro is allowed after a plan switch.
2. Sign-in does not call Google/Apple — session label until native OAuth.
3. claimSend charges media per selected model kind on that send.
4. Motion is press-scale plus existing lift/tuck. Not a spring on every glyph.
5. Hydration warning on hidden file input `caret-color` is platform chrome, not app logic.

## Ship call

Web shell is internally consistent with the visionOS brief for in-scope
surfaces. Not an App Store binary. Smart Gen remains a drop-in. IAP remains
mocked.
