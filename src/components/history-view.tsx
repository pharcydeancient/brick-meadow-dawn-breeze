import { Search } from "lucide-react";
import { MODELS } from "@/lib/models";
import { useAether } from "@/lib/store";
import type { HistoryKind } from "@/lib/types";

function when(ts: number) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

const KINDS: { id: HistoryKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "archive", label: "Archive" },
  { id: "files", label: "Files" },
];

export function HistoryView() {
  const conversations = useAether((s) => s.conversations);
  const archives = useAether((s) => s.archives);
  const files = useAether((s) => s.files);
  const openCard = useAether((s) => s.openCard);
  const loadArchive = useAether((s) => s.loadArchive);
  const setHistoryOpen = useAether((s) => s.setHistoryOpen);
  const setSurface = useAether((s) => s.setSurface);
  const setPreviewFile = useAether((s) => s.setPreviewFile);
  const surface = useAether((s) => s.surface);
  const cardModelId = useAether((s) => s.cardModelId);
  const query = useAether((s) => s.historyQuery);
  const setQuery = useAether((s) => s.setHistoryQuery);
  const kind = useAether((s) => s.historyKind);
  const setKind = useAether((s) => s.setHistoryKind);
  const modelFilter = useAether((s) => s.historyModel);
  const setModelFilter = useAether((s) => s.setHistoryModel);
  const scoped = surface === "card" && cardModelId ? cardModelId : null;
  const q = query.trim().toLowerCase();

  const live = Object.values(conversations)
    .map((c) => {
      const firstUser = c.messages.find((m) => m.role === "user" && m.text.trim());
      const last = c.messages.at(-1);
      return {
        key: `live-${c.modelId}`,
        type: "live" as const,
        modelId: c.modelId,
        title: (firstUser?.text || "").trim() || "Untitled conversation",
        lastTs: last?.createdAt ?? 0,
        turns: c.messages.length,
      };
    })
    .filter((r) => r.turns > 0);

  const archived = archives.map((a) => ({
    key: `arch-${a.id}`,
    type: "archive" as const,
    modelId: a.modelId,
    title: a.title,
    lastTs: a.closedAt,
    turns: a.messages.length,
    archiveId: a.id,
  }));

  const fileRows = files.map((f) => ({
    key: `file-${f.id}`,
    type: "files" as const,
    modelId: f.modelId,
    title: f.name,
    lastTs: f.createdAt,
    turns: 0,
    fileId: f.id,
  }));

  const pool =
    kind === "live" ? live : kind === "archive" ? archived : kind === "files" ? fileRows : [...live, ...archived, ...fileRows];

  const modelIds = Array.from(new Set(pool.map((r) => r.modelId))).filter((id) => MODELS.some((m) => m.id === id));

  const rows = pool
    .filter((r) => (scoped ? r.modelId === scoped : true))
    .filter((r) => (modelFilter ? r.modelId === modelFilter : true))
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
      <div className="hist-chips">
        {KINDS.map((k) => (
          <button key={k.id} type="button" className={`hist-chip${kind === k.id ? " on" : ""}`} onClick={() => setKind(k.id)}>
            {k.label}
          </button>
        ))}
      </div>
      {modelIds.length > 1 && !scoped ? (
        <div className="hist-chips models">
          <button type="button" className={`hist-chip${modelFilter === null ? " on" : ""}`} onClick={() => setModelFilter(null)}>
            Any model
          </button>
          {modelIds.map((id) => {
            const model = MODELS.find((m) => m.id === id);
            if (!model) return null;
            return (
              <button
                key={id}
                type="button"
                className={`hist-chip${modelFilter === id ? " on" : ""}`}
                style={{ color: model.accent }}
                onClick={() => setModelFilter(modelFilter === id ? null : id)}
              >
                {model.short}
              </button>
            );
          })}
        </div>
      ) : null}
      {rows.length === 0 ? (
        <p className="empty-line">{q ? "Nothing matches that." : "No conversations yet."}</p>
      ) : (
        rows.map((r) => {
          const model = MODELS.find((m) => m.id === r.modelId);
          return (
            <button
              key={r.key}
              type="button"
              className="hist-row"
              onClick={() => {
                if (r.type === "files" && "fileId" in r && r.fileId) {
                  setPreviewFile(r.fileId);
                  setSurface("files");
                  setHistoryOpen(false);
                  return;
                }
                if (r.type === "archive" && "archiveId" in r && r.archiveId) loadArchive(r.archiveId);
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
                  {r.type === "files"
                    ? when(r.lastTs)
                    : `${r.turns} turns · ${when(r.lastTs)}${r.type === "archive" ? " · archived" : ""}`}
                </span>
              </span>
            </button>
          );
        })
      )}
    </>
  );
}
