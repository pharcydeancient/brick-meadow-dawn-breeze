import { useEffect, useState } from "react";
import { WALLPAPERS } from "@/lib/themes";
import { useAether } from "@/lib/store";
import type { Wallpaper } from "@/lib/types";

export function Environment() {
  const wallpaperId = useAether((s) => s.wallpaperId);
  const surface = useAether((s) => s.surface);
  const sendFlash = useAether((s) => s.sendFlash);
  const blurOnSend = useAether((s) => s.blurOnSend);
  const paper = WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];
  const dim = surface !== "home" && surface !== "card";

  const [front, setFront] = useState<Wallpaper>(paper);
  const [back, setBack] = useState<Wallpaper | null>(null);

  useEffect(() => {
    if (paper.id === front.id) return;
    setBack(front);
    setFront(paper);
    const t = window.setTimeout(() => setBack(null), 1300);
    return () => window.clearTimeout(t);
  }, [paper, front]);

  return (
    <div className="env-root" aria-hidden>
      {back ? (
        <div className="env-layer leaving" key={`b-${back.id}`}>
          <img src={back.src} alt="" className={`env-photo motion-${back.motion}`} />
        </div>
      ) : null}
      <div className="env-layer entering" key={`f-${front.id}`}>
        <img src={front.src} alt="" className={`env-photo motion-${front.motion}`} />
      </div>
      {front.motion === "aurora" ? <div className="env-aurora" /> : null}
      <div className="env-veil" />
      <div className="env-grain" />
      <div className={`env-dim${dim ? " on" : ""}`} />
      <div className={`env-send-blur${sendFlash && blurOnSend ? " on" : ""}`} />
    </div>
  );
}
