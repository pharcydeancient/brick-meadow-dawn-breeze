# QA report — Collider spatial shell (orchestrator handoff)

Playtester pass after wiring session, caps, archives, card-edge tools, and
search filters. Consensus internals and Smart Gen drop-in excluded.

## Method

1. Source inspection against spec 2 + visionOS brief.
2. Independent second reading of store, send path, account pane, card tools,
   history filters (inspector pass).
3. Visual review of existing screenshot set plus CSS/layout of new chrome.
4. Live Chrome click-through was blocked in this sandbox: workdir clones
   were wiped mid-session and npm registry returned 502. Functional paths
   were verified in code. Repeat a Chrome pass on the pushed commit.

## Functional

| Check | Result |
|-------|--------|
| Guest default | Pass — identity starts guest, persist v13 |
| Google / Apple / Email + logout | Pass — local labels, logout returns guest |
| 20/day Free, one send = one count | Pass — claimSend |
| Media credits + Free block | Pass — costs 8/12/40, Free routes to Upgrade |
| Card Files / History / New | Pass — tools on card header |
| Escape with History open | Pass — card view defers to sheet |
| History type + model filters | Pass |
| Archive on New / load archive | Pass — live thread stored, archive restored |
| Upgrade copy | Pass — Switch to Free, twenty/day |
| Imagine generate gate | Pass — same claimSend path |
| Consensus + Smart buttons | Pass — destinations open; internals excluded |
| Six-card cap | Pass — toggle stops at 6 |

## Visual

| Surface | Verdict |
|---------|---------|
| Home | Wallpaper continuous, glass cards, model-colored names. Six-up grid. |
| Account pane | 320px plate. Stats row is quiet. Sign-in is three words. |
| Card view | Files / History / New sit on the right; title still ellipsizes. |
| History | Chip filters, one-line empty state. |
| Upgrade | Working-surface plate. No Upgrade to Free. |

## Inspector notes (second pass)

1. Session is not entitlement. Guest on Pro is allowed after a plan switch.
2. Sign-in does not call Google/Apple — session label until native OAuth.
3. claimSend charges media per selected model kind on that send.
4. Motion is press-scale plus existing lift/tuck. Not a spring on every glyph.
5. Imagine generate now respects the same gate as chat media.
6. Prior tracker claimed these items done before they existed in store.ts.

## Ship call

Web shell is internally consistent with the visionOS brief for in-scope
surfaces. Not an App Store binary. Smart Gen remains a drop-in. IAP remains
mocked. Live preview pass still required after deploy.
