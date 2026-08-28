import { useAether } from "@/lib/store";
import { RegionTag } from "./guide-overlay";
import type { Tier } from "@/lib/types";

const PLANS: { id: Tier; name: string; price: string; lines: string[] }[] = [
  {
    id: "free",
    name: "Free",
    price: "0",
    lines: ["Grok and Pulse", "Room themes", "History and files"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "16",
    lines: ["General, image, audio, video, code", "Theme market", "Six cards in the room"],
  },
  {
    id: "elite",
    name: "Elite",
    price: "36",
    lines: ["Every model, including locked rooms", "Live wallpapers you buy, kept", "Priority stills"],
  },
];

export function UpgradeView() {
  const tier = useAether((s) => s.tier);
  const setTier = useAether((s) => s.setTier);
  const fromLock = useAether((s) => s.upgradeFromLock);
  const close = useAether((s) => s.closeToHome);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <RegionTag label="Upgrade · dignified, not loud" style={{ top: 0, right: 0 }} />
      <h2 className="type-display text-[32px]">{fromLock ? "This room is locked" : "Plan"}</h2>
      <p className="mb-4 text-[12px] leading-relaxed" style={{ color: "var(--color-fg-secondary)" }}>
        {fromLock
          ? "The group you touched needs a higher plan. Nothing here shouts. Pick quietly."
          : "Change the plan. The room rearranges itself."}
      </p>
      <div className="quiet-scroll min-h-0 flex-1 space-y-2">
        {PLANS.map((p) => {
          const current = p.id === tier;
          return (
            <article
              key={p.id}
              className="glass-card p-4"
              style={{
                outline: current ? "1px solid rgba(255,255,255,0.55)" : undefined,
              }}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-[18px] font-medium">{p.name}</h3>
                <span className="mono text-[18px]">
                  {p.price}
                  <span className="text-[11px]" style={{ color: "var(--color-fg-tertiary)" }}>
                    {p.price === "0" ? "" : " /mo"}
                  </span>
                </span>
              </div>
              <ul className="mt-2 space-y-1">
                {p.lines.map((l) => (
                  <li key={l} className="text-[12px]" style={{ color: "var(--color-fg-secondary)" }}>
                    {l}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-3"
                onClick={() => {
                  setTier(p.id);
                  close();
                }}
                style={{
                  width: "100%",
                  height: 36,
                  borderRadius: 12,
                  border: 0,
                  background: current ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.88)",
                  color: current ? "var(--color-fg)" : "#12141a",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {current ? "Current" : `Use ${p.name}`}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
