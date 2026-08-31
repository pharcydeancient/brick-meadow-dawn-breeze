import { useEffect, useRef } from "react";
import { Pause, Play, SkipForward, X } from "lucide-react";
import { WALLPAPERS } from "@/lib/themes";
import { useAether } from "@/lib/store";
import { Draggable } from "./draggable";

export function MusicPlayer() {
  const open = useAether((s) => s.musicOpen);
  const pos = useAether((s) => s.musicPos);
  const setPos = useAether((s) => s.setMusicPos);
  const playing = useAether((s) => s.playing);
  const setPlaying = useAether((s) => s.setPlaying);
  const trackIndex = useAether((s) => s.trackIndex);
  const setTrackIndex = useAether((s) => s.setTrackIndex);
  const wallpaperId = useAether((s) => s.wallpaperId);
  const setMusicOpen = useAether((s) => s.setMusicOpen);
  const paper = WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];
  const tracks = paper.tracks;
  const track = tracks.length ? tracks[trackIndex % tracks.length] : { id: "none", title: paper.name, artist: "", seconds: 0, src: undefined };
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audio.current ?? new Audio();
    audio.current = el;
    if (track.src) el.src = track.src;
    el.loop = true;
    if (playing && track.src) void el.play().catch(() => setPlaying(false));
    else el.pause();
    return () => {
      el.pause();
    };
  }, [playing, track, setPlaying]);

  if (!open) return null;

  return (
    <Draggable x={pos.x} y={pos.y} onMove={setPos} className="music-widget glass-ornament">
      <div data-drag-handle className="flex cursor-grab gap-2">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[12px]">
          <img src={paper.src} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-medium">{track.title}</div>
          <div className="truncate text-[11px]" style={{ color: "var(--color-fg-tertiary)" }}>
            {track.artist}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <button type="button" aria-label={playing ? "Pause" : "Play"} className="gaze" style={iconBtn} onClick={() => setPlaying(!playing)}>
              {playing ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: 1 }} />}
            </button>
            <button
              type="button"
              aria-label="Next"
              className="gaze"
              style={iconBtn}
              onClick={() => {
                if (!tracks.length) return;
                setTrackIndex((trackIndex + 1) % tracks.length);
              }}
            >
              <SkipForward size={13} />
            </button>
            <button type="button" aria-label="Hide player" className="gaze ml-auto" style={iconBtn} onClick={() => setMusicOpen(false)}>
              <X size={13} />
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
}

const iconBtn = {
  width: 28,
  height: 28,
  borderRadius: 999,
  border: 0,
  background: "rgba(255,255,255,0.12)",
  color: "var(--color-fg)",
  display: "grid",
  placeItems: "center",
} as const;
