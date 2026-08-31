import { useEffect, useState } from "react";
import { WALLPAPERS } from "@/lib/themes";
import { useAether } from "@/lib/store";
import type { Wallpaper } from "@/lib/types";

export function Environment() {
  const wallpaperId = useAether((s) => s.wallpaperId);
  const surface = useAether((s) => s.surface);
  const historyOpen = useAether((s) => s.historyOpen);
  const paper = WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];

  const [front, setFront] = useState<Wallpaper>(paper);
  const [back, setBack] = useState<Wallpaper | null>(null);

  useEffect(() => {
    if (paper.id === front.id) return;
    setBack(front);
    setFront(paper);
    const t = window.setTimeout(() => setBack(null), 1300);
    return () => window.clearTimeout(t);
  }, [paper, front]);

  const veil =
    surface === "card"
      ? "untint"
      : surface === "discover" ||
          surface === "themes" ||
          surface === "upgrade" ||
          surface === "smart" ||
          surface === "files" ||
          historyOpen
        ? "work"
        : "home";

  return (
    <div className="env-root" aria-hidden>
      {back ? (
        <div className="env-layer leaving" key={`b-${back.id}`}>
          <Layer paper={back} />
        </div>
      ) : null}
      <div className="env-layer entering" key={`f-${front.id}`}>
        <Layer paper={front} />
      </div>
      <div className={`env-veil veil-${veil}`} />
      <div className="env-grain" />
    </div>
  );
}

function Layer({ paper }: { paper: Wallpaper }) {
  return (
    <>
      {paper.video ? (
        <video
          className={`env-photo live-${paper.motion}`}
          src={paper.video}
          poster={paper.src}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img src={paper.src} alt="" className={`env-photo live-${paper.motion}`} />
      )}
      <div className={`live-fx live-${paper.motion}`} />
      {paper.motion === "aurora" ? <div className="env-aurora" /> : null}
      {paper.motion === "tide" ? <div className="live-caustic" /> : null}
      {paper.motion === "drift" ? <div className="live-mist" /> : null}
    </>
  );
}
