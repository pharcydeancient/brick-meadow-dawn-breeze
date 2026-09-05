# Collider tracker

Sources scanned: this thread, `layout 2.0 visOS.txt`, Functional Requirements spec 2,
repo docs, Drive URS / store listings. No Collider 1 chat transcript exists in
the public repo or Drive under that name. Recovered intent is the attached
specs plus the June URS.

Legend: done verified · partial · open · excluded · accounted

## Unaddressed user messages (this pass)

| id | user ask | status | note |
|----|----------|--------|------|
| U1 | Guest default, Google / Apple / email, logout | done | Local session labels. Real OAuth is platform-gated. |
| U2 | Account stats + upgrade | done | Sent + remaining today or credits. |
| U3 | Free 20 messages / day, one send = one message | done | `claimSend` increments once per send. |
| U4 | Media credits, Pro/Elite only | done | Image 8, audio 12, video 40. Free blocked. |
| U5 | Card view files for that model | done | Files keeps `cardModelId`. |
| U6 | History from card view and home | done | Card tool + Settings → History. |
| U7 | New conversation archives the live thread | done | Card New writes archives. |
| U8 | Search with type/model filters | done | History: All/Live/Archive/Files + model chips. |
| U9 | Theme drop folders | done | `public/themes` and `public/themes/premium`. |
| U10 | Small settings, no Cancel | done | Compact alert. Models pane taller so lock plates can enter view. |
| U11 | Prompt orb + consensus preview + blur on send | done | Existing. |
| U12 | Long-press lift, Align | done | Existing. |
| U13 | Locked bands open Upgrade | done | Visible on Free default. |
| U14 | Relocatable settings / music / prompt | done | Existing. |
| U15 | Consensus button | done | Internals excluded. |
| U16 | Smart Gen destinations | excluded | Hub buttons live. Drop-in later. |
| U17 | Native Expo | accounted | This repo is the spatial web shell. |
| U18 | Real IAP / remote market feed | accounted | Purchase mocked by spec. |
| U19 | Imagine market parity | partial | Generate gated by credits/tier. No live remote feed. |
| U20 | Physical motion on every control | partial | Press scale on apps, chips, tools, CTAs. Not a spring on every glyph. |
| U21 | Hermes named voice + greet | accounted | URS v36. Not in spec 2 this pass. |
| U22 | Voice input | accounted | URS. Not in spec 2 this pass. |
| U23 | Up to 6 cards on home | done | Cap 6. Default Free general six. |

## Strategic / philosophical read

Spec 2 law: remove cognitive effort. A prior tracker marked guest, caps,
archives, and card-edge tools done while `store.ts` still defaulted to Pro,
capped cards at 9, and had no session / `claimSend` / archives. That break
in the logical chain is what this pass closed.

Accounted, not fake-done:
- Native iOS/Android wrap is a different product surface.
- Google/Apple are session labels until the native client owns OAuth.
- Smart Gen agent and consensus constellation internals stay drop-ins.
- Imagine is a local market, not Grok live catalog.
- Hermes / mic belong to the earlier URS.

Intent check: no sparkle icons added, Free copy does not claim unlimited
chat, default identity is Guest, default tier is Free so lock plates can
show, stats are not vanity counters.
