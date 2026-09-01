import { Check, Lock, Search } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { THEME_YEARS, WALLPAPERS } from "@/lib/themes";
import { useAether } from "@/lib/store";
import type { Wallpaper } from "@/lib/types";
import { PreviewStage } from "./preview-stage";

export function ThemeView() {
  const tab = useAether((s) => s.themeMarketTab);
  const setTab = useAether((s) => s.setThemeMarketTab);
  const tier = useAether((s) => s.tier);
  const purchased = useAether((s) => s.purchasedWallpaperIds);
  const wallpaperId = useAether((s) => s.wallpaperId);
  const setWallpaper = useAether((s) => s.setWallpaper);
  const exploded = useAether((s) => s.explodedWallpaperId);
  const setExploded = useAether((s) => s.setExplodedWallpaper);
  const purchase = useAether((s) => s.purchaseWallpaper);
  const setTrackIndex = useAether((s) => s.setTrackIndex);
  const setPlaying = useAether((s) => s.setPlaying);
  const setMusicOpen = useAether((s) => s.setMusicOpen);
  const setSurface = useAether((s) => s.setSurface);
  const swipe = useRef({ x: 0, t: 0 });
  const [q, setQ] = useState("");

  const paid = tier !== "free";
  const marketLocked = tab === 1 && !paid;
  const list = (tab === 0
      ? WALLPAPERS.filter((w) => !w.premium || purchased.includes(w.id))
      : WALLPAPERS.filter((w) => w.premium)
    ).filter(
      (w) =>
        !q.trim() ||
        w.name.toLowerCase().includes(q.toLowerCase()) ||
        w.category.toLowerCase().includes(q.toLowerCase()),
    );
  const open = WALLPAPERS.find((w) => w.id === exploded);

  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, t: Date.now() };
  };
  const onPointerUp = (e: PointerEvent) => {
    const dx = e.clientX - swipe.current.x;
    if (Math.abs(dx) < 56 || Date.now() - swipe.current.t > 600) return;
    if (dx < 0 && tab === 0) setTab(1);
    if (dx > 0 && tab === 1) setTab(0);
  };

  function listen(w: Wallpaper, i = 0) {
    setWallpaper(w.id);
    setTrackIndex(i);
    setMusicOpen(true);
    setPlaying(true);
  }

  return (
    <div className="gallery-wrap" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <h2 className="surface-label">{tab === 0 ? "Wallpapers" : "Live wallpapers"}</h2>
      <div className="chip-row">
        <button
          type="button"
          className={`chip${tab === 0 ? " on" : ""}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setTab(0);
          }}
        >
          Selector
        </button>
        <button
          type="button"
          className={`chip${tab === 1 ? " on" : ""}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setTab(1);
          }}
        >
          Store
        </button>
      </div>
      <div className="dots" aria-hidden>
        <span className={tab === 0 ? "on" : ""} />
        <span className={tab === 1 ? "on" : ""} />
      </div>
      {tab === 1 && !marketLocked ? (
        <label className="pin-search">
          <Search size={14} />
          <input
            className="pin-search-field"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search live wallpapers"
          />
        </label>
      ) : null}

      {marketLocked ? (
        <button type="button" className="gate" onClick={() => setSurface("upgrade")}>
          <Lock size={14} />
          <span>Store needs a paid plan. Wallpapers you own stay in Themes.</span>
        </button>
      ) : open ? (
        <PreviewStage
          title={open.name}
          kicker={open.premium ? open.price ?? "Live" : open.category}
          src={open.src}
          video={open.video}
          onClose={() => setExploded(null)}
          actions={[
            {
              id: "set",
              label: wallpaperId === open.id ? "Current" : "Set wallpaper",
              primary: true,
              onClick: () => {
                if (open.premium && !purchased.includes(open.id)) purchase(open.id);
                setWallpaper(open.id);
                setExploded(null);
              },
            },
            ...(open.tracks.length
              ? [{ id: "listen", label: "Listen", onClick: () => listen(open) }]
              : []),
          ]}
          related={list
            .filter((w) => w.id !== open.id)
            .slice(0, 8)
            .map((w) => ({ id: w.id, src: w.src, video: w.video, title: w.name }))}
          onRelated={setExploded}
        >
          {open.tracks.length ? (
            <div className="f1-tracks">
              {open.tracks.map((t, i) => (
                <button key={t.id} type="button" className="f1-track" onClick={() => listen(open, i)}>
                  {t.title}
                </button>
              ))}
            </div>
          ) : null}
        </PreviewStage>
      ) : tab === 1 ? (
        <StoreShelves
          list={list}
          wallpaperId={wallpaperId}
          onOpen={(id) => {
            const w = WALLPAPERS.find((x) => x.id === id);
            if (w?.premium && !purchased.includes(w.id)) purchase(w.id);
            setExploded(id);
          }}
        />
      ) : (
        <YearsGallery
          list={list}
          wallpaperId={wallpaperId}
          onPick={(w) => {
            setWallpaper(w.id);
            setExploded(w.id);
          }}
        />
      )}
    </div>
  );
}

function YearsGallery({
  list,
  wallpaperId,
  onPick,
}: {
  list: Wallpaper[];
  wallpaperId: string;
  onPick: (w: Wallpaper) => void;
}) {
  const groups = THEME_YEARS.map((year) => [year, list.filter((w) => w.category === year)] as const).filter(
    ([, items]) => items.length,
  );
  return (
    <div className="mem-scroll">
      {groups.map(([year, items]) => (
        <section key={year} className="years-block">
          <h2 className="years-label">{year}</h2>
          <div className="years-grid">
            {items.map((w, i) => {
              const live = wallpaperId === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  className={`years-tile${i % 5 === 0 ? " wide" : ""}${live ? " live" : ""}`}
                  onClick={() => onPick(w)}
                >
                  {w.video ? (
                    <video src={w.video} poster={w.src} muted loop playsInline autoPlay />
                  ) : (
                    <img src={w.src} alt="" />
                  )}
                  <span className="theme-tile-name">{w.name}</span>
                  {live ? (
                    <span className="theme-live">
                      <Check size={11} />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function StoreShelves({
  list,
  wallpaperId,
  onOpen,
}: {
  list: Wallpaper[];
  wallpaperId: string;
  onOpen: (id: string) => void;
}) {
  const hero = list[0];
  const shelves = [
    { title: "Live wallpapers", items: list },
    { title: "Aurora", items: list.filter((w) => w.motion === "aurora") },
    { title: "Tide", items: list.filter((w) => w.motion === "tide") },
    { title: "Drift", items: list.filter((w) => w.motion === "drift") },
  ].filter((s) => s.items.length);

  if (!hero) return <p className="empty-line">Nothing in the store.</p>;

  return (
    <div className="mem-scroll tv-wrap">
      <button type="button" className="tv-hero" onClick={() => onOpen(hero.id)}>
        {hero.video ? (
          <video src={hero.video} poster={hero.src} muted loop playsInline autoPlay />
        ) : (
          <img src={hero.src} alt="" />
        )}
        <span className="tv-hero-meta">
          <span className="tv-kicker">Featured</span>
          <span className="tv-title">{hero.name}</span>
        </span>
      </button>
      {shelves.map((shelf) => (
        <section key={shelf.title} className="tv-row">
          <h3>{shelf.title}</h3>
          <div className="tv-shelf">
            {shelf.items.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`tv-card${wallpaperId === w.id ? " live" : ""}`}
                onClick={() => onOpen(w.id)}
              >
                {w.video ? (
                  <video src={w.video} poster={w.src} muted loop playsInline autoPlay />
                ) : (
                  <img src={w.src} alt="" />
                )}
                <span>{w.name}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
