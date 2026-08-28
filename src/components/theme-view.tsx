import { Check, Lock, Play } from "lucide-react";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { WALLPAPERS } from "@/lib/themes";
import { useAether } from "@/lib/store";
import { RegionTag } from "./guide-overlay";

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

  const marketLocked = tier === "free";
  const list =
    tab === 0
      ? WALLPAPERS.filter((w) => !w.premium || purchased.includes(w.id))
      : WALLPAPERS.filter((w) => w.premium);
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

  return (
    <div className="flex h-full min-h-0 flex-col surface-in" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <RegionTag label="Themes · real rooms · tap to live in" style={{ top: 0, right: 0 }} />
      <h2 className="type-display text-[32px]">Themes</h2>
      <p className="mb-2 mt-1 text-[12px]" style={{ color: "var(--color-fg-tertiary)" }}>
        Photographs. Tap one — the room becomes it.
      </p>
      <div className="mb-3 mt-1 flex items-center justify-center gap-2">
        <button type="button" className={tab === 0 ? "glass-ornament" : "glass-thin"} style={dotTab} onClick={() => setTab(0)}>
          Room
        </button>
        <button
          type="button"
          className={tab === 1 ? "glass-ornament" : "glass-thin"}
          style={dotTab}
          onClick={() => setTab(1)}
        >
          Market
        </button>
      </div>
      <div className="mb-2 flex justify-center gap-1.5">
        <span style={dot(tab === 0)} />
        <span style={dot(tab === 1)} />
      </div>

      {tab === 1 && marketLocked ? (
        <button
          type="button"
          className="glass-heavy mb-3 flex items-center justify-between px-3 py-2 text-left"
          style={{ borderRadius: 16, border: 0, color: "var(--color-fg)", width: "100%" }}
          onClick={() => setSurface("upgrade")}
        >
          <span className="text-[12px]">Market needs a paid plan. Rooms you own stay.</span>
          <Lock size={14} />
        </button>
      ) : null}

      {open ? (
        <div className="quiet-scroll min-h-0 flex-1 surface-in">
          <button
            type="button"
            onClick={() => setExploded(null)}
            className="mb-2 text-[12px]"
            style={{ border: 0, background: "transparent", color: "var(--color-fg-secondary)" }}
          >
            Back
          </button>
          <div className="theme-hero overflow-hidden">
            <img src={open.src} alt="" />
          </div>
          <h3 className="mt-3 text-[18px] font-medium">{open.name}</h3>
          <p className="mb-3 text-[12px]" style={{ color: "var(--color-fg-tertiary)" }}>
            {open.category} · five rooms of sound
          </p>
          <button
            type="button"
            className="glass-ornament mb-3 w-full"
            style={{ height: 40, borderRadius: 14, border: 0, color: "var(--color-fg)" }}
            onClick={() => {
              if (!purchased.includes(open.id) && open.premium && marketLocked) {
                setSurface("upgrade");
                return;
              }
              setWallpaper(open.id);
              setExploded(null);
            }}
          >
            Live in this room
          </button>
          <div className="space-y-1.5">
            {open.tracks.map((t, i) => (
              <button
                key={t.id}
                type="button"
                className="glass-thin flex w-full items-center gap-3 px-2 py-2 text-left"
                style={{ borderRadius: 14, border: 0, color: "var(--color-fg)" }}
                onClick={() => {
                  if (!purchased.includes(open.id) && open.premium && marketLocked) {
                    setSurface("upgrade");
                    return;
                  }
                  setWallpaper(open.id);
                  setTrackIndex(i);
                  setMusicOpen(true);
                  setPlaying(true);
                }}
              >
                <img src={open.src} alt="" className="h-10 w-10 rounded-[10px] object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px]">{t.title}</div>
                  <div className="text-[11px]" style={{ color: "var(--color-fg-tertiary)" }}>
                    {t.artist}
                  </div>
                </div>
                <Play size={14} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="quiet-scroll min-h-0 flex-1">
          <div className="grid grid-cols-2 gap-2">
            {list.map((w) => {
              const owned = purchased.includes(w.id);
              const locked = w.premium && !owned && marketLocked && tab === 1;
              const live = wallpaperId === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  className={`theme-tile${live ? " live" : ""}`}
                  onClick={() => {
                    if (locked) {
                      setSurface("upgrade");
                      return;
                    }
                    if (tab === 1 && w.premium && !owned) purchase(w.id);
                    if (owned || !w.premium || !marketLocked) setWallpaper(w.id);
                  }}
                  onDoubleClick={() => {
                    if (locked) return;
                    setExploded(w.id);
                  }}
                >
                  <img src={w.src} alt="" />
                  <div className="theme-tile-meta">
                    <div className="text-[12px] font-medium">{w.name}</div>
                    <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--color-fg-tertiary)" }}>
                      {w.category}
                    </div>
                  </div>
                  {live ? (
                    <span className="theme-live">
                      <Check size={12} />
                    </span>
                  ) : null}
                  {locked ? (
                    <span className="theme-lock">
                      <Lock size={12} />
                    </span>
                  ) : null}
                  <span
                    className="theme-listen"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (locked) {
                        setSurface("upgrade");
                        return;
                      }
                      setExploded(w.id);
                    }}
                  >
                    <Play size={11} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const dotTab: CSSProperties = {
  height: 30,
  padding: "0 14px",
  borderRadius: 999,
  border: 0,
  color: "var(--color-fg)",
  fontSize: 12,
};

function dot(on: boolean): CSSProperties {
  return {
    width: on ? 14 : 6,
    height: 6,
    borderRadius: 999,
    background: on ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
    display: "inline-block",
    transition: "width 280ms cubic-bezier(0.22, 1, 0.36, 1)",
  };
}
