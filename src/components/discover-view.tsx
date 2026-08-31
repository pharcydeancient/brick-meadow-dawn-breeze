import { useState } from "react";
import { Search } from "lucide-react";
import { DISCOVER } from "@/lib/themes";
import { imagineStill } from "@/lib/chat";
import { uid, useAether } from "@/lib/store";
import { PreviewStage } from "./preview-stage";

type Mine = { id: string; src: string; title: string; ratio: string; category: "photo" | "motion"; video?: string };

export function DiscoverView() {
  const filter = useAether((s) => s.discoverFilter);
  const setFilter = useAether((s) => s.setDiscoverFilter);
  const query = useAether((s) => s.discoverQuery);
  const setQuery = useAether((s) => s.setDiscoverQuery);
  const addFile = useAether((s) => s.addFile);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mine, setMine] = useState<Mine[]>([]);

  const catalog = [...mine, ...DISCOVER];
  const q = query.trim().toLowerCase();
  const items = catalog.filter((d) => {
    if (filter === "photo" && d.category === "motion") return false;
    if (filter === "motion" && d.category !== "motion") return false;
    if (filter === "edit" && !mine.some((m) => m.id === d.id)) return false;
    if (q && !(d.title || "").toLowerCase().includes(q)) return false;
    return true;
  });
  const selected = items.find((i) => i.id === openId) ?? catalog.find((i) => i.id === openId) ?? null;

  async function generate(prompt: string) {
    const text = prompt.trim();
    if (!text || busy) return;
    setBusy(true);
    const res = await imagineStill({ data: { prompt: text } });
    setBusy(false);
    if (res.ok && res.url) {
      const id = uid("im");
      setMine((m) => [{ id, src: res.url!, title: text, ratio: "3/4", category: "photo" }, ...m]);
      addFile({
        id: uid("f"),
        modelId: "imagine",
        name: `${text.slice(0, 18)}.png`,
        kind: "image",
        sizeLabel: "1k",
        createdAt: Date.now(),
        preview: res.url,
      });
      setDraft("");
      setOpenId(id);
    }
  }

  function attach(item: (typeof catalog)[number]) {
    addFile({
      id: uid("f"),
      modelId: "imagine",
      name: (item.title || "imagine").slice(0, 18) + ".png",
      kind: item.category === "motion" ? "video" : "image",
      sizeLabel: "1k",
      createdAt: Date.now(),
      preview: item.src,
    });
    setOpenId(null);
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
        <button type="button" className={filter === "edit" ? "on" : ""} onClick={() => setFilter("edit")}>
          Library
        </button>
      </div>
      <div className="imagine-masonry">
        {items.map((d) => (
          <button key={d.id} type="button" className="imagine-tile" onClick={() => setOpenId(d.id)}>
            {"video" in d && d.video ? (
              <video src={d.video} poster={d.src} muted loop playsInline autoPlay style={{ aspectRatio: d.ratio ?? "3/4" }} />
            ) : (
              <img src={d.src} alt="" style={{ aspectRatio: d.ratio ?? "3/4" }} />
            )}
            {d.category === "motion" ? <span className="play-mark" /> : null}
            <span className="theme-tile-name">{d.title}</span>
          </button>
        ))}
      </div>
      <form
        className="imagine-composer"
        onSubmit={(e) => {
          e.preventDefault();
          void generate(draft);
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={busy ? "Making…" : "What do you want to imagine?"}
          disabled={busy}
        />
        <button type="submit" className="send-btn" disabled={busy || !draft.trim()} aria-label="Generate">
          ↑
        </button>
      </form>
      {selected ? (
        <PreviewStage
          title={selected.title || "Untitled still"}
          kicker={selected.category === "motion" ? "Video" : "Image"}
          src={selected.src}
          video={selected.video}
          onClose={() => setOpenId(null)}
          actions={[
            {
              id: "remix",
              label: "Remix",
              primary: true,
              onClick: () => {
                setDraft(selected.title ? `Remix: ${selected.title}` : "Remix this still, keep the subject, new light");
                setOpenId(null);
              },
            },
            {
              id: "video",
              label: "Video",
              onClick: () => {
                setFilter("motion");
                setDraft(selected.title ? `Make a video of ${selected.title}` : "Make a short video of this");
                setOpenId(null);
              },
            },
            {
              id: "library",
              label: mine.some((m) => m.id === selected.id) ? "In library" : "Library",
              onClick: () => {
                if (!mine.some((m) => m.id === selected.id)) {
                  setMine((m) => [
                    {
                      id: uid("im"),
                      src: selected.src,
                      title: selected.title,
                      ratio: selected.ratio ?? "3/4",
                      category: selected.category === "motion" ? "motion" : "photo",
                      video: selected.video,
                    },
                    ...m,
                  ]);
                }
                setFilter("edit");
              },
            },
            {
              id: "attach",
              label: "Attach",
              onClick: () => attach(selected),
            },
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
