import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { Pause, Play, SkipForward, X } from "lucide-react";
import { WALLPAPERS } from "@/lib/themes";
import { useAether } from "@/lib/store";
import { Draggable } from "./draggable";
import { RegionTag } from "./guide-overlay";

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
  const track = paper.tracks[trackIndex % paper.tracks.length];
  const ctxRef = useRef<AudioContext | null>(null);
  const nodes = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  const hue = useMemo(() => 200 + (trackIndex % 5) * 18, [trackIndex]);

  useEffect(() => {
    if (!playing) {
      nodes.current?.gain.gain.linearRampToValueAtTime(0, ctxRef.current ? ctxRef.current.currentTime + 0.2 : 0);
      window.setTimeout(() => {
        nodes.current?.osc.stop();
        nodes.current = null;
      }, 240);
      return;
    }
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new AudioCtx();
    ctxRef.current = ctx;
    void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 110 + (trackIndex % 5) * 18;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.4);
    nodes.current = { osc, gain };
    return () => {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    };
  }, [playing, trackIndex]);

  if (!open) return null;

  return (
    <Draggable
      x={pos.x}
      y={pos.y}
      onMove={setPos}
      className="music-widget glass-ornament"
    >
      <RegionTag label="Music widget" style={{ top: -22, left: 0 }} />
      <div data-drag-handle className="flex cursor-grab gap-2">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            overflow: "hidden",
            flexShrink: 0,
            background: `linear-gradient(135deg, hsl(${hue} 40% 40%), hsl(${hue + 40} 30% 20%))`,
          }}
        >
          <img src={paper.src} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-medium">{track.title}</div>
          <div className="truncate text-[11px]" style={{ color: "var(--color-fg-tertiary)" }}>
            {track.artist}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              className="gaze"
              style={iconBtn}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: 1 }} />}
            </button>
            <button
              type="button"
              aria-label="Next"
              className="gaze"
              style={iconBtn}
              onClick={() => setTrackIndex((trackIndex + 1) % paper.tracks.length)}
            >
              <SkipForward size={13} />
            </button>
            <button
              type="button"
              aria-label="Hide player"
              className="gaze ml-auto"
              style={iconBtn}
              onClick={() => setMusicOpen(false)}
            >
              <X size={13} />
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
}

const iconBtn: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 999,
  border: 0,
  background: "rgba(255,255,255,0.12)",
  color: "var(--color-fg)",
  display: "grid",
  placeItems: "center",
};
