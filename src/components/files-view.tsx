import { Search } from "lucide-react";
import { MODELS } from "@/lib/models";
import { uid, useAether } from "@/lib/store";
import type { GenFile } from "@/lib/types";
import { PreviewStage } from "./preview-stage";

export function FilesView() {
  const files = useAether((s) => s.files);
  const remove = useAether((s) => s.removeFile);
  const query = useAether((s) => s.filesQuery);
  const setQuery = useAether((s) => s.setFilesQuery);
  const previewId = useAether((s) => s.previewFileId);
  const setPreview = useAether((s) => s.setPreviewFile);
  const addFile = useAether((s) => s.addFile);
  const cardModelId = useAether((s) => s.cardModelId);
  const surface = useAether((s) => s.surface);
  const scopedId = surface === "files" ? cardModelId : null;

  const q = query.trim().toLowerCase();
  const scoped = files.filter((f) => {
    if (!f.preview) return false;
    if (scopedId && f.modelId !== scopedId) return false;
    if (!q) return true;
    const model = MODELS.find((m) => m.id === f.modelId);
    return f.name.toLowerCase().includes(q) || f.kind.includes(q) || (model?.name ?? "").toLowerCase().includes(q);
  });
  const open = files.find((f) => f.id === previewId) ?? null;
  const buckets = groupByModel(scoped);
  const heading = scopedId ? MODELS.find((m) => m.id === scopedId)?.name ?? "Files" : "Files";

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
      <div className="mem-scroll">
        {buckets.length === 0 ? (
          <p className="empty-line">Nothing filed.</p>
        ) : (
          buckets.map(([label, list]) => (
            <section key={label} className="years-block">
              <h3 className="years-label">{label}</h3>
              <div className="years-grid">
                {list.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="years-tile"
                    onClick={() => setPreview(f.id)}
                  >
                    <img src={f.preview} alt="" />
                    {f.kind === "video" ? <span className="play-mark" /> : null}
                    <span className="theme-tile-name">{f.name.replace(/\.[^.]+$/, "")}</span>
                  </button>
                ))}
              </div>
            </section>
          ))
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
    </div>
  );
}

function groupByModel(files: GenFile[]): [string, GenFile[]][] {
  const map = new Map<string, GenFile[]>();
  for (const f of files) {
    const model = MODELS.find((m) => m.id === f.modelId);
    const label = model?.name ?? (f.modelId === "imagine" ? "Imagine" : "Files");
    const list = map.get(label) ?? [];
    list.push(f);
    map.set(label, list);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}
