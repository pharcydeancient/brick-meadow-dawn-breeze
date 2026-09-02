import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { MODELS } from "@/lib/models";
import { uid, useAether } from "@/lib/store";
import type { GenFile } from "@/lib/types";
import { ContextMenu, type CtxItem } from "./context-menu";
import { PreviewStage } from "./preview-stage";

const KINDS: { id: "all" | "image" | "video"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "image", label: "Images" },
  { id: "video", label: "Videos" },
];

export function FilesView() {
  const files = useAether((s) => s.files);
  const remove = useAether((s) => s.removeFile);
  const query = useAether((s) => s.filesQuery);
  const setQuery = useAether((s) => s.setFilesQuery);
  const kind = useAether((s) => s.filesFilter);
  const setKind = useAether((s) => s.setFilesFilter);
  const previewId = useAether((s) => s.previewFileId);
  const setPreview = useAether((s) => s.setPreviewFile);
  const addFile = useAether((s) => s.addFile);
  const setPromptOpen = useAether((s) => s.setPromptOpen);
  const cardModelId = useAether((s) => s.cardModelId);
  const surface = useAether((s) => s.surface);
  const scopedId = surface === "files" ? cardModelId : null;
  const [ctx, setCtx] = useState<{ x: number; y: number; items: CtxItem[] } | null>(null);
  const hold = useRef<number | null>(null);

  const q = query.trim().toLowerCase();
  const scoped = files
    .filter((f) => {
      if (scopedId && f.modelId !== scopedId) return false;
      if (kind !== "all" && f.kind !== kind) return false;
      if (!q) return true;
      const model = MODELS.find((m) => m.id === f.modelId);
      return f.name.toLowerCase().includes(q) || f.kind.includes(q) || (model?.name ?? "").toLowerCase().includes(q);
    })
    .sort((a, b) => b.createdAt - a.createdAt);
  const open = files.find((f) => f.id === previewId) ?? null;
  const heading = scopedId ? MODELS.find((m) => m.id === scopedId)?.name ?? "Files" : "Files";

  function menuFor(f: GenFile, x: number, y: number) {
    setCtx({
      x,
      y,
      items: [
        { id: "open", label: "Open", onSelect: () => setPreview(f.id) },
        {
          id: "dup",
          label: "Duplicate",
          onSelect: () =>
            addFile({
              ...f,
              id: uid("f"),
              name: f.name.replace(/(\.[^.]+)?$/, " copy$1"),
              createdAt: Date.now(),
            }),
        },
        {
          id: "attach",
          label: "Attach to prompt",
          onSelect: () => setPromptOpen(true),
        },
        { id: "rm", label: "Delete", danger: true, onSelect: () => remove(f.id) },
      ],
    });
  }

  return (
    <div className="gallery-wrap">
      <h2 className="surface-label">{heading}</h2>
      <label className="pin-search">
        <Search size={14} />
        <input
          className="pin-search-field"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files"
        />
      </label>
      <div className="files-kinds" role="tablist" aria-label="File kind">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            role="tab"
            className={kind === k.id ? "on" : ""}
            aria-selected={kind === k.id}
            onClick={() => setKind(k.id)}
          >
            {k.label}
          </button>
        ))}
      </div>
      <div className="mem-scroll">
        {scoped.length === 0 ? (
          <p className="empty-line">Nothing filed.</p>
        ) : (
          <div className="files-grid">
            {scoped.map((f) => (
              <button
                key={f.id}
                type="button"
                className="files-tile"
                onClick={() => setPreview(f.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  menuFor(f, e.clientX, e.clientY);
                }}
                onPointerDown={(e) => {
                  hold.current = window.setTimeout(() => menuFor(f, e.clientX, e.clientY), 420);
                }}
                onPointerUp={() => {
                  if (hold.current) window.clearTimeout(hold.current);
                }}
                onPointerMove={() => {
                  if (hold.current) window.clearTimeout(hold.current);
                }}
              >
                {f.preview ? <img src={f.preview} alt="" /> : <span className="mem-blank">{f.kind}</span>}
                {f.kind === "video" ? <span className="play-mark" /> : null}
                <span className="theme-tile-name">{f.name.replace(/\.[^.]+$/, "")}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {open?.preview ? (
        <PreviewStage
          title={open.name.replace(/\.[^.]+$/, "")}
          kicker={MODELS.find((m) => m.id === open.modelId)?.name ?? open.kind}
          src={open.preview}
          onClose={() => setPreview(null)}
          actions={[
            {
              id: "keep",
              label: "Duplicate",
              primary: true,
              onClick: () =>
                addFile({
                  ...open,
                  id: uid("f"),
                  name: open.name.replace(/(\.[^.]+)?$/, " copy$1"),
                  createdAt: Date.now(),
                }),
            },
            {
              id: "rm",
              label: "Delete",
              danger: true,
              onClick: () => remove(open.id),
            },
          ]}
          related={scoped
            .filter((f) => f.id !== open.id && f.preview)
            .slice(0, 8)
            .map((f) => ({ id: f.id, src: f.preview!, title: f.name }))}
          onRelated={setPreview}
        />
      ) : null}
      {ctx ? <ContextMenu {...ctx} onClose={() => setCtx(null)} /> : null}
    </div>
  );
}
