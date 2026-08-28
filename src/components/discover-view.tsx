import { Search } from "lucide-react";
import { DISCOVER } from "@/lib/themes";
import { useAether } from "@/lib/store";
import { RegionTag } from "./guide-overlay";

const FILTERS = ["all", "prompts", "voices", "packs", "agents"] as const;

export function DiscoverView() {
  const q = useAether((s) => s.discoverQuery);
  const setQ = useAether((s) => s.setDiscoverQuery);
  const filter = useAether((s) => s.discoverFilter);
  const setFilter = useAether((s) => s.setDiscoverFilter);
  const tier = useAether((s) => s.tier);
  const setSurface = useAether((s) => s.setSurface);

  const items = DISCOVER.filter((d) => {
    if (filter !== "all" && d.category !== filter) return false;
    if (q && !`${d.title} ${d.blurb} ${d.author}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <RegionTag label="Discover market" style={{ top: 0, right: 0 }} />
      <h2 className="type-display text-[32px]">Discover</h2>
      <div className="glass-thin mb-3 mt-2 flex items-center gap-2 px-3" style={{ height: 40, borderRadius: 14 }}>
        <Search size={14} style={{ color: "var(--color-fg-tertiary)" }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the market"
          className="h-full w-full bg-transparent text-[13px] outline-none"
          style={{ border: 0, color: "var(--color-fg)" }}
        />
      </div>
      <div className="mb-3 flex gap-1 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={filter === f ? "glass-ornament" : "glass-thin"}
            style={{
              height: 28,
              padding: "0 10px",
              borderRadius: 999,
              border: 0,
              color: "var(--color-fg)",
              fontSize: 11,
              textTransform: "capitalize",
              flexShrink: 0,
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="quiet-scroll min-h-0 flex-1">
        <div className="grid grid-cols-1 gap-2">
          {items.map((d) => (
            <article key={d.id} className="glass-card p-3">
              <div className="type-meta">{d.category}</div>
              <h3 className="mt-1 text-[16px] font-medium">{d.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "var(--color-fg-secondary)" }}>
                {d.blurb}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px]" style={{ color: "var(--color-fg-tertiary)" }}>
                  {d.author}
                </span>
                <button
                  type="button"
                  className="glass-thin"
                  style={{
                    height: 28,
                    padding: "0 12px",
                    borderRadius: 999,
                    border: 0,
                    color: "var(--color-fg)",
                    fontSize: 11,
                  }}
                  onClick={() => {
                    if (d.premium && tier === "free") setSurface("upgrade");
                  }}
                >
                  {d.premium && tier === "free" ? "Pro" : "Add"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
