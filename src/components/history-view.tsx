import { Search } from "lucide-react";
import { MODELS } from "@/lib/models";
import { useAether } from "@/lib/store";
import { RegionTag } from "./guide-overlay";

export function HistoryView() {
  const conversations = useAether((s) => s.conversations);
  const q = useAether((s) => s.historyQuery);
  const setQ = useAether((s) => s.setHistoryQuery);
  const openCard = useAether((s) => s.openCard);
  const enabled = useAether((s) => s.enabledModelIds);

  const rows = Object.values(conversations)
    .filter((c) => c.messages.length)
    .filter((c) => {
      if (!q) return true;
      const m = MODELS.find((x) => x.id === c.modelId);
      const blob = `${m?.name ?? ""} ${c.messages.map((x) => x.text).join(" ")}`.toLowerCase();
      return blob.includes(q.toLowerCase());
    })
    .sort((a, b) => (b.messages.at(-1)?.createdAt ?? 0) - (a.messages.at(-1)?.createdAt ?? 0));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <RegionTag label="History · working surface" style={{ top: 0, right: 0 }} />
      <h2 className="type-display text-[32px]">History</h2>
      <p className="mb-3 text-[12px]" style={{ color: "var(--color-fg-secondary)" }}>
        Threads, still in the room.
      </p>
      <div className="glass-thin mb-3 flex items-center gap-2 px-3" style={{ height: 40, borderRadius: 14 }}>
        <Search size={14} style={{ color: "var(--color-fg-tertiary)" }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search history"
          className="h-full w-full bg-transparent text-[13px] outline-none"
          style={{ border: 0, color: "var(--color-fg)" }}
        />
      </div>
      <div className="quiet-scroll min-h-0 flex-1 space-y-2">
        {rows.map((c) => {
          const model = MODELS.find((m) => m.id === c.modelId);
          const last = c.messages.at(-1);
          return (
            <button
              key={c.modelId}
              type="button"
              className="glass-card w-full p-3 text-left"
              onClick={() => openCard(c.modelId)}
              style={{ border: 0 }}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] font-medium">{model?.name}</span>
                <span className="mono text-[10px]" style={{ color: "var(--color-fg-tertiary)" }}>
                  {enabled.includes(c.modelId) ? "on" : "off"}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-[12px]" style={{ color: "var(--color-fg-secondary)" }}>
                {last?.text}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
