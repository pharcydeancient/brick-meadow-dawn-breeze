import { Search } from "lucide-react";
import { MODELS } from "@/lib/models";
import { useAether } from "@/lib/store";

/** HistoryPane.tsx WHEN() — relative age, not a clock. */
function when(ts: number) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

export function HistoryView() {
  const conversations = useAether((s) => s.conversations);
  const openCard = useAether((s) => s.openCard);
  const setHistoryOpen = useAether((s) => s.setHistoryOpen);
  const surface = useAether((s) => s.surface);
  const cardModelId = useAether((s) => s.cardModelId);
  const query = useAether((s) => s.historyQuery);
  const setQuery = useAether((s) => s.setHistoryQuery);
  const scoped = surface === "card" && cardModelId ? cardModelId : null;

  const q = query.trim().toLowerCase();
  const rows = Object.values(conversations)
    .map((c) => {
      const firstUser = c.messages.find((m) => m.role === "user" && m.text.trim());
      const last = c.messages.at(-1);
      const title = (firstUser?.text || "").trim() || "Untitled conversation";
      return {
        modelId: c.modelId,
        title,
        lastTs: last?.createdAt ?? 0,
        turns: c.messages.length,
      };
    })
    .filter((r) => r.turns > 0)
    .filter((r) => (scoped ? r.modelId === scoped : true))
    .filter((r) => {
      if (!q) return true;
      const model = MODELS.find((m) => m.id === r.modelId);
      return r.title.toLowerCase().includes(q) || (model?.name ?? "").toLowerCase().includes(q);
    })
    .sort((a, b) => b.lastTs - a.lastTs);

  return (
    <>
      <label className="pin-search" style={{ margin: "0 8px 8px" }}>
        <Search size={14} />
        <input
          className="pin-search-field"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search history"
        />
      </label>
      {rows.length === 0 ? (
        <p className="empty-line">{q ? "Nothing matches that." : "No conversations yet."}</p>
      ) : (
        rows.map((r) => {
          const model = MODELS.find((m) => m.id === r.modelId);
          return (
            <button
              key={r.modelId}
              type="button"
              className="hist-row"
              onClick={() => {
                openCard(r.modelId);
                setHistoryOpen(false);
              }}
            >
              <span className="hist-title">{r.title}</span>
              <span className="hist-meta">
                {model ? (
                  <span className="hist-tag" style={{ color: model.accent, borderColor: `${model.accent}77` }}>
                    {model.short}
                  </span>
                ) : null}
                <span>
                  {r.turns} turns · {when(r.lastTs)}
                </span>
              </span>
            </button>
          );
        })
      )}
    </>
  );
}
