# QA report — Collider spatial shell (orchestrator handoff)

Playtester pass after wiring session, caps, archives, card-edge tools, and
search filters. Consensus internals and Smart Gen drop-in excluded.

## Method

1. Source inspection against spec 2 + visionOS brief.
2. Typecheck targeted on patched modules.
3. Visual review of home wallpaper / glass cards (desktop 1920x900).
4. Independent inspector pass on the diff (second reading of store, send
   path, account pane, card tools, history filters).

Live Chrome click-through after the first session reset was incomplete: the
workspace clone was wiped mid-pass. Functional paths were verified in code.
Repeat a Chrome pass on the pushed commit.

## Functional

| Check | Result |
|-------|--------|
| Guest default | Pass — identity starts guest |
| Google / Apple / Email + logout | Pass — local labels, logout returns guest |
| 20/day Free, one send = one count | Pass — claimSend |
| Media credits + Free block | Pass — costs 8/12/40, Free routes to Upgrade |
| Card Files / History / New | Pass — tools on card header |
| Escape with History open | Pass — card view defers to sheet |
| History type + model filters | Pass |
| Archive on New | Pass |
| Upgrade copy | Pass — Switch to Free, twenty/day |
| Consensus + Smart buttons | Pass — destinations open; internals excluded |

## Visual

| Surface | Verdict |
|---------|---------|
| Home | Wallpaper continuous, glass cards, model-colored names. |
| Account pane | Taller 420px plate. Stats row is quiet. Sign-in is three words. |
| Card view | Tools sit on the right; title still ellipsizes. |
| History | Chip filters, one-line empty state. |
| Upgrade | Working-surface plate. No Upgrade to Free. |

## Inspector notes (second pass)

1. Session is not entitlement. Guest on Pro is allowed after a plan switch.
2. Sign-in does not call Google/Apple — session label until native OAuth.
3. claimSend charges media per selected model kind on that send.
4. Motion is press-scale plus existing lift/tuck. Not a spring on every glyph.
5. Imagine generate now respects the same gate as chat media.

## Ship call

Web shell is internally consistent with the visionOS brief for in-scope
surfaces. Not an App Store binary. Smart Gen remains a drop-in. IAP remains
mocked.
