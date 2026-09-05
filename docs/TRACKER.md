# Collider tracker

Sources: this thread, layout 2.0 visOS.txt, Functional Requirements spec 2,
repo docs, live inspection. No Collider 1 chat transcript exists in the
public repo or Drive under that name. Recovered intent is the attached specs.

Legend: done verified · partial · open · excluded · accounted

## Unaddressed user messages

| id | user ask | status | note |
|----|----------|--------|------|
| U1 | Guest default, Google / Apple / email, logout | done | Local session labels. Real OAuth is platform-gated. |
| U2 | Account stats + upgrade | done | Left today / stills / credits. |
| U3 | Free 20 messages / day, one send = one message | done | claimSend increments once per send. |
| U4 | Media credits, Pro/Elite only | done | Image 8, audio 12, video 40. Free blocked. |
| U5 | Card view files for that model | done | Folder tool keeps cardModelId and opens Files. |
| U6 | History from card view and home | done | Card tool + Settings to History. |
| U7 | New conversation archives the live thread | done | Card tool writes archives. |
| U8 | Search with type/model filters | done | History: All/Live/Archive/Files + model chips. |
| U9 | Theme drop folders | done | Existing public/themes. |
| U10 | Small settings, no Cancel | done | Existing. |
| U11 | Prompt orb + consensus preview + blur on send | done | Existing. |
| U12 | Long-press lift, Align | done | Existing. |
| U13 | Locked bands open Upgrade | done | Visible on Free default. |
| U14 | Relocatable settings / music / prompt | done | Existing. |
| U15 | Consensus button | done | Internals excluded. |
| U16 | Smart Gen destinations | excluded | Hub buttons live. |
| U17 | Native Expo | accounted | This repo is the spatial web shell. |
| U18 | Real IAP / remote market feed | accounted | Purchase mocked by spec. |
| U19 | Imagine market parity | partial | Generate gated by credits/tier. No live remote feed. |
| U20 | Physical motion on every control | partial | Press scale on apps, chips, tools, CTAs. |

## Strategic read

Spec 2 law: remove cognitive effort. The prior tracker marked guest, caps,
archives, and card-edge tools done while those types sat unwired. That is
now closed in the shell.

Accounted, not fake-done:
- Native iOS/Android wrap is a different product surface.
- Google/Apple are session labels until the native client owns OAuth.
- Smart Gen agent and consensus constellation internals stay drop-ins.
- Imagine is a local market, not Grok live catalog.

Intent check: no sparkle icons added, no Upgrade to Free, Free copy no
longer claims unlimited chat, default identity is Guest, default tier is Free
so lock plates are visible.
