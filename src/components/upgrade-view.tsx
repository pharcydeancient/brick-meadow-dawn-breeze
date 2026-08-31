import { TIER_INFO } from "@/lib/roster";
import { useAether } from "@/lib/store";
import type { Tier } from "@/lib/types";

const FEATURES: Record<Tier, string[]> = {
  free: ["Six general models", "Unlimited general chat"],
  pro: ["All general models", "Image, audio, video, coding", "3,000 credits / month"],
  elite: ["Flagship models", "Live wallpapers", "7,500 credits / month"],
};

export function UpgradeView() {
  const tier = useAether((s) => s.tier);
  const setTier = useAether((s) => s.setTier);

  return (
    <div className="plan-stack">
      {(["free", "pro", "elite"] as Tier[]).map((id) => {
        const info = TIER_INFO[id];
        const current = id === tier;
        const featured = id === "pro";
        return (
          <article key={id} className={`plan-card${current ? " on" : ""}${featured ? " hot" : ""}`}>
            <header className="plan-head">
              <div>
                <p className="plan-name">{info.label}</p>
                <p className="plan-price">
                  {info.price === "$0" ? "Included" : info.price.replace("/mo", "")}
                  {info.price.includes("/mo") ? <span> /mo</span> : null}
                </p>
              </div>
              {current ? <span className="plan-badge">Active</span> : null}
            </header>
            <ul className="plan-features">
              {FEATURES[id].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              type="button"
              className={`plan-cta${featured && !current ? " lit" : ""}`}
              disabled={current}
              onClick={() => setTier(id)}
            >
              {current ? "Current" : `Upgrade to ${info.label}`}
            </button>
          </article>
        );
      })}
      <article className="plan-card">
        <header className="plan-head">
          <div>
            <p className="plan-name">Enterprise</p>
            <p className="plan-price">Custom</p>
          </div>
        </header>
        <ul className="plan-features">
          <li>Dedicated hosting</li>
          <li>SLA and a named manager</li>
        </ul>
      </article>
    </div>
  );
}
