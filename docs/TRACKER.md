# Collider tracker

Sources: this thread, `layout 2.0 visOS.txt`, Functional Requirements spec 2,
repo `docs/COMPLIANCE.md`, screenshots, live click-through.

Legend: `done` verified · `partial` · `open` · `excluded` (consensus drawer
internals + Smart Gen drop-in) · `accounted` (platform).

## Unaddressed user messages

No chat transcript for “Collider 1” lives in the public repo. Recovered
intent is the attached specs plus the visionOS conversion brief.

| id | user ask | status | note |
|----|----------|--------|------|
| U1 | Guest default, Google / Apple / email, logout | done | Local session. Real OAuth is platform-gated. |
| U2 | Account stats + upgrade | done | Today / stills / credits. |
| U3 | Free 20 messages / day, one send = one message | done | |
| U4 | Media credits, Pro/Elite only | done | Image 8, audio 12, video 40. |
| U5 | Card view files for that model | done | Folder tool scopes Files. |
| U6 | History from card view and home | done | Card tool + Settings → History. |
| U7 | New conversation archives the live thread | done | |
| U8 | Search with type/model filters | partial | History chips + query; Files kinds + query. |
| U9 | Theme drop folders | done | `public/themes/free`, `premium`, `DROP.md`. |
| U10 | Small settings, no Cancel | done | |
| U11 | Prompt orb + consensus preview + blur on send | done | Existing. |
| U12 | Long-press lift, Align | done | Existing. |
| U13 | Locked bands open Upgrade | done | Visible on Free. |
| U14 | Relocatable settings / music / prompt | done | |
| U15 | Consensus button | done | Internals excluded. |
| U16 | Smart Gen destinations | excluded | Hub buttons live. |
| U17 | Native Expo | accounted | This repo is the spatial web shell. |
| U18 | Real IAP / remote market feed | accounted | Purchase mocked by spec. |
| U19 | Imagine market parity | partial | Generate / remix / like / library. |
| U20 | Physical motion on every control | partial | Press, lift, tuck, fade exist. |

## Strategic read

Spec 2’s law is: remove cognitive effort. Home already does that
(wallpaper first, glass cards, summoned chrome). Remaining contradictions
were Free “unlimited chat” copy vs a 20/day cap, and Escape in card view
closing the card while History was open. Both are corrected.

Native wrap, live IAP, and the Smart Gen agent remain outside this shell.
