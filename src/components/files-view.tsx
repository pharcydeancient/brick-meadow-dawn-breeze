import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { MODELS } from "@/lib/models";
import { useAether } from "@/lib/store";
import { ContextMenu, type CtxItem } from "./context-menu";
import { RegionTag } from "./guide-overlay";
import type { GenFile } from "@/lib/types";

const KINDS: { id: "all" | GenFile["kind"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "image", label: "Image" },
  { id: "text", label: "Text" },
  { id: "code", label: "Code" },
  { id: "audio", label: "Audio" },
  { id: "video", label: "Video" },
];

export function FilesView() {
  const files = useAether((s) => s.files);
  const q = useAether((s) => s.filesQuery);
  const setQ = useAether((s) => s.setFilesQuery);
  const filter = useAether((s) => s.filesFilter);
  const setFilter = useAether((s) => s.setFilesFilter);
  const remove = useAether((s) => s.removeFile);
  const cardModelId = useAether((s) => s.cardModelId);
  const [ctx, setCtx] = useState<{ x: number; y: number; items: CtxItem[] } | null>(null);

  const scoped = cardModelId ? files.filter((f) => f.modelId === cardModelId) : files;
  const shown = scoped.filter((f) => {
    if (filter !== "all" && f.kind !== filter) return false;
    if (q && !f.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <RegionTag label="Files · working surface" style={{ top: 0, right: 0 }} />
      <h2 className="type-display text-[32px]">Files</h2>
      <p className="mb-3 text-[12px]" style={{ color: "var(--color-fg-secondary)" }}>
        What the models left on the table.
      </p>
      <div className="glass-thin mb-3 flex items-center gap-2 px-3" style={{ height: 40, borderRadius: 14 }}>
        <Search size={14} style={{ color: "var(--color-fg-tertiary)" }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search files"
          className="h-full w-full bg-transparent text-[13px] outline-none"
          style={{ border: 0, color: "var(--color-fg)" }}
        />
      </div>
      <div className="mb-3 flex gap-1 overflow-x-auto">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setFilter(k.id)}
            className={filter === k.id ? "glass-ornament" : "glass-thin"}
            style={{
              height: 28,
              padding: "0 10px",
              borderRadius: 999,
              border: 0,
              color: "var(--color-fg)",
              fontSize: 11,
              flexShrink: 0,
            }}
          >
            {k.label}
          </button>
        ))}
      </div>
      <div className="quiet-scroll min-h-0 flex-1 space-y-2">
        {shown.length === 0 ? (
          <p className="pt-8 text-center text-[13px]" style={{ color: "var(--color-fg-tertiary)" }}>
            Nothing filed yet.
          </p>
        ) : (
          shown.map((f) => {
            const model = MODELS.find((m) => m.id === f.modelId);
            return (
              <article
                key={f.id}
                className="glass-card flex items-center gap-3 p-2"
                onContextMenu={(e) => {
                  e.preventDefault();
                  setCtx({
                    x: e.clientX,
                    y: e.clientY,
                    items: [
                      { id: "dl", label: "Keep", onSelect: () => {} },
                      {
                        id: "rm",
                        label: "Delete",
                        danger: true,
                        onSelect: () => remove(f.id),
                      },
                    ],
                  });
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                >
                  {f.preview ? (
                    <img src={f.preview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div
                      className="grid h-full place-items-center text-[10px] uppercase tracking-widest"
                      style={{ color: "var(--color-fg-tertiary)" }}
                    >
                      {f.kind.slice(0, 3)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{f.name}</div>
                  <div className="text-[11px]" style={{ color: "var(--color-fg-tertiary)" }}>
                    {model?.name} · {f.sizeLabel}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Delete"
                  className="gaze"
                  style={{
                    width: 32,
                    height: 32,
                    border: 0,
                    background: "transparent",
                    color: "var(--color-fg-secondary)",
                  }}
                  onClick={() => remove(f.id)}
                >
                  <Trash2 size={14} />
                </button>
              </article>
            );
          })
        )}
      </div>
      {ctx ? <ContextMenu {...ctx} onClose={() => setCtx(null)} /> : null}
    </div>
  );
}
