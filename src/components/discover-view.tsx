import { useRef, useState } from "react";
import { ArrowUp, Heart, RefreshCw, Search } from "lucide-react";
import { DISCOVER } from "@/lib/themes";
import { imagineEdit, imagineStill } from "@/lib/chat";
import { uid, useAether } from "@/lib/store";
import type { DiscoverItem } from "@/lib/types";
import { PreviewStage } from "./preview-stage";

export function DiscoverView() {
  const filter = useAether((s) => s.discoverFilter);
  const setFilter = useAether((s) => s.setDiscoverFilter);
  const query = useAether((s) => s.discoverQuery);
  const setQuery = useAether((s) => s.setDiscoverQuery);
  const made = useAether((s) => s.imagineMade);
  const likedIds = useAether((s) => s.imagineLikedIds);
  const addMade = useAether((s) => s.addImagineMade);
  const toggleLike = useAether((s) => s.toggleImagineLike);
  const removeMade = useAether((s) => s.removeImagineMade);
  const addFile = useAether((s) => s.addFile);
  const bumpStat = useAether((s) => s.bumpStat);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [remix, setRemix] = useState<DiscoverItem | null>(null);

  const catalog: DiscoverItem[] = [
    ...made,
    ...DISCOVER.filter((d) => !made.some((m) => m.id === d.id)),
  ];
  const q = query.trim().toLowerCase();
  const items = catalog.filter((d) => {
    if (filter === "photo" && d.category === "motion") return false;
    if (filter === "motion" && d.category !== "motion") return false;
    if (filter === "liked" && !likedIds.includes(d.id)) return false;
    if (filter === "edit" && !made.some((m) => m.id === d.id)) return false;
    if (q && !(`${d.title} ${d.author}`).toLowerCase().includes(q)) return false;
    return true;
  });
  const selected = catalog.find((i) => i.id === openId) ?? null;
  const inLibrary = (id: string) => made.some((m) => m.id === id);

  function startRemix(item: DiscoverItem) {
    setRemix(item);
    setDraft(item.title ? `Keep the subject of “${item.title}”. New light.` : "Keep the subject. New light.");
    setOpenId(null);
    setErr("");
    window.setTimeout(() => inputRef.current?.focus(), 40);
  }

  function fileFrom(item: DiscoverItem, name?: string) {
    addFile({
      id: uid("f"),
      modelId: "imagine",
      name: `${(name || item.title || "imagine").slice(0, 22)}.png`,
      kind: item.category === "motion" ? "video" : "image",
      sizeLabel: "1k",
      createdAt: Date.now(),
      preview: item.src,
    });
  }

  async function generate(prompt: string) {
    const text = prompt.trim();
    if (!text || busy) return;
    setBusy(true);
    setErr("");
    const res = remix
      ? await imagineEdit({ data: { prompt: text, src: remix.src } })
      : await imagineStill({ data: { prompt: text } });
    setBusy(false);
    if (!res.ok || !res.url) {
      setErr(res.ok ? "No still returned." : res.error);
      return;
    }
    const id = uid("im");
    const item: DiscoverItem = {
      id,
      title: text.slice(0, 48),
      category: remix ? "edit" : "photo",
      author: "You",
      src: res.url,
      premium: false,
      ratio: remix?.ratio ?? "3/4",
    };
    addMade(item);
    fileFrom(item, text);
    bumpStat("images");
    setDraft("");
    setRemix(null);
    setFilter("edit");
    setOpenId(id);
  }

  return (
    <div className="imagine-wrap">
      <label className="pin-search">
        <Search size={14} />
        <input
          className="pin-search-field"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Imagine"
        />
      </label>
      <div className="imagine-tabs">
        <button type="button" className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
          Discover
        </button>
        <button type="button" className={filter === "photo" ? "on" : ""} onClick={() => setFilter("photo")}>
          Images
        </button>
        <button type="button" className={filter === "motion" ? "on" : ""} onClick={() => setFilter("motion")}>
          Videos
        </button>
        <button type="button" className={filter === "liked" ? "on" : ""} onClick={() => setFilter("liked")}>
          Liked
        </button>
        <button type="button" className={filter === "edit" ? "on" : ""} onClick={() => setFilter("edit")}>
          Library
        </button>
      </div>
      <div className="imagine-masonry">
        {items.length === 0 ? (
          <p className="empty-line">
            {filter === "liked" ? "Nothing liked yet." : filter === "edit" ? "Nothing made yet." : "Nothing matches."}
          </p>
        ) : (
          items.map((d) => {
            const liked = likedIds.includes(d.id);
            return (
              <div key={d.id} className="imagine-tile">
                <button type="button" className="imagine-hit" onClick={() => setOpenId(d.id)} aria-label={d.title}>
                  {d.video ? (
                    <video src={d.video} poster={d.src} muted loop playsInline autoPlay style={{ aspectRatio: d.ratio ?? "3/4" }} />
                  ) : (
                    <img src={d.src} alt="" style={{ aspectRatio: d.ratio ?? "3/4" }} />
                  )}
                </button>
                {d.category === "motion" ? <span className="play-mark" /> : null}
                <div className="imagine-shade">
                  <span className="theme-tile-name">{d.title}</span>
                  <div className="imagine-embs">
                    <button
                      type="button"
                      className={`imagine-emb${liked ? " liked" : ""}`}
                      aria-label={liked ? "Unlike" : "Like"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(d.id);
                      }}
                    >
                      <Heart size={13} fill={liked ? "currentColor" : "none"} />
                    </button>
                    <button
                      type="button"
                      className="imagine-emb"
                      aria-label="Remix"
                      onClick={(e) => {
                        e.stopPropagation();
                        startRemix(d);
                      }}
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {remix ? (
        <div className="imagine-source">
          <img src={remix.src} alt="" />
          <span>Remixing {remix.title || "this still"}</span>
          <button type="button" aria-label="Cancel remix" onClick={() => setRemix(null)}>
            ×
          </button>
        </div>
      ) : null}
      {err ? <p className="imagine-err">{err}</p> : null}
      <form
        className="imagine-composer"
        onSubmit={(e) => {
          e.preventDefault();
          void generate(draft);
        }}
      >
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={busy ? "Making…" : remix ? "How should this change?" : "What do you want to imagine?"}
          disabled={busy}
        />
        <button type="submit" className="send-btn imagine-go" disabled={busy || !draft.trim()} aria-label="Generate">
          <ArrowUp size={16} strokeWidth={2.4} />
          <span className="ctrl-label">Generate</span>
        </button>
      </form>
      {selected ? (
        <PreviewStage
          title={selected.title || "Untitled still"}
          kicker={selected.category === "motion" ? "Video" : selected.category === "edit" ? "Remix" : "Image"}
          src={selected.src}
          video={selected.video}
          onClose={() => setOpenId(null)}
          actions={[
            {
              id: "remix",
              label: "Remix",
              primary: true,
              onClick: () => startRemix(selected),
            },
            {
              id: "like",
              label: likedIds.includes(selected.id) ? "Liked" : "Like",
              onClick: () => toggleLike(selected.id),
            },
            {
              id: "library",
              label: inLibrary(selected.id) ? "In library" : "Library",
              onClick: () => {
                if (!inLibrary(selected.id)) addMade({ ...selected, author: selected.author || "You" });
                setFilter("edit");
              },
            },
            {
              id: "attach",
              label: "Attach",
              onClick: () => {
                fileFrom(selected);
                setOpenId(null);
              },
            },
            {
              id: "source",
              label: "Use as source",
              onClick: () => startRemix(selected),
            },
            ...(inLibrary(selected.id)
              ? [
                  {
                    id: "rm",
                    label: "Delete",
                    danger: true,
                    onClick: () => {
                      removeMade(selected.id);
                      setOpenId(null);
                    },
                  },
                ]
              : []),
          ]}
          related={items
            .filter((i) => i.id !== selected.id)
            .slice(0, 8)
            .map((i) => ({ id: i.id, src: i.src, video: i.video, title: i.title }))}
          onRelated={setOpenId}
        />
      ) : null}
    </div>
  );
}
