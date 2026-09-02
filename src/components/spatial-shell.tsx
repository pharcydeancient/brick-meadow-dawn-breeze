import { Environment } from "./environment";
import { CardCanvas } from "./card-canvas";
import { CardView } from "./card-view";
import { FilesView } from "./files-view";
import { HistoryView } from "./history-view";
import { ThemeView } from "./theme-view";
import { DiscoverView } from "./discover-view";
import { UpgradeView } from "./upgrade-view";
import { SmartGenView } from "./smart-gen-view";
import { SettingsOrb } from "./settings-orb";
import { SettingsPane } from "./settings-pane";
import { PromptOrb } from "./prompt-orb";
import { PromptBar } from "./prompt-bar";
import { ConsensusPreview, ConsensusMap } from "./consensus-preview";
import { MusicPlayer } from "./music-player";
import { OverlaySheet } from "./overlay-sheet";
import { Draggable } from "./draggable";
import { useAether } from "@/lib/store";
import { useRef } from "react";

const WORKING = new Set(["discover", "themes", "upgrade", "smart", "files"]);

export function SpatialShell() {
  const surface = useAether((s) => s.surface);
  const close = useAether((s) => s.closeToHome);
  const setSurface = useAether((s) => s.setSurface);
  const settingsOpen = useAether((s) => s.settingsOpen);
  const setSettingsOpen = useAether((s) => s.setSettingsOpen);
  const historyOpen = useAether((s) => s.historyOpen);
  const setHistoryOpen = useAether((s) => s.setHistoryOpen);
  const cardModelId = useAether((s) => s.cardModelId);
  const promptOpen = useAether((s) => s.promptOpen);
  const sending = useAether((s) => s.sending);
  const blurOnSend = useAether((s) => s.blurOnSend);
  const inCard = Boolean(cardModelId) && surface === "card";
  const working = WORKING.has(surface);
  const swipe = useRef({ x: 0, y: 0, fromTop: false });

  function backFromWork() {
    if (cardModelId) setSurface("card");
    else close();
  }

  const rootMode = inCard ? " untint" : working || historyOpen ? " work-tint" : " home-tint";

  return (
    <div className={`app-root${promptOpen ? " prompting" : ""}${rootMode}${sending && blurOnSend ? " send-blur" : ""}`}>
      <Environment />
      <div className="scene">
        <div className="stage">
          <span className="window-shadow" aria-hidden />
          {working ? (
            <button
              type="button"
              className="close-affordance"
              aria-label="Close"
              onClick={backFromWork}
            />
          ) : null}
          <section
            className={`main-window glass-window${promptOpen && !working ? " tucked" : ""}${working ? " work" : ""}${inCard ? " clear" : ""}`}
            onPointerDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              swipe.current = {
                x: e.clientX,
                y: e.clientY,
                fromTop: e.clientY - rect.top < 56,
              };
            }}
            onPointerUp={(e) => {
              if (!working || !swipe.current.fromTop) return;
              const dy = e.clientY - swipe.current.y;
              const dx = e.clientX - swipe.current.x;
              if (Math.abs(dy) > 72 && Math.abs(dy) > Math.abs(dx) * 1.15) backFromWork();
            }}
          >
            {working ? <div className="work-frost" aria-hidden /> : null}
            <div className="window-body">
              {surface === "discover" ? (
                <DiscoverView />
              ) : surface === "themes" ? (
                <ThemeView />
              ) : surface === "upgrade" ? (
                <UpgradeView />
              ) : surface === "smart" ? (
                <SmartGenView />
              ) : surface === "files" ? (
                <FilesView />
              ) : inCard ? (
                <CardView />
              ) : (
                <CardCanvas />
              )}
            </div>
          </section>
          <div className="window-bar glass-ornament">
            <span className="window-grip" />
          </div>
          {working ? null : <PromptOrb />}
          <SettingsOrb />
          {working ? null : <PromptCluster />}
        </div>
        <OverlaySheet
          open={historyOpen}
          title={cardModelId && inCard ? "This model" : "History"}
          size="list"
          onClose={() => setHistoryOpen(false)}
        >
          <HistoryView />
        </OverlaySheet>
        {settingsOpen ? (
          <button
            type="button"
            className="alert-dim"
            aria-label="Dismiss settings"
            onClick={() => setSettingsOpen(false)}
          />
        ) : null}
        <SettingsPane />
      </div>
      <MusicPlayer />
      {working ? null : <ConsensusMap />}
    </div>
  );
}

function PromptCluster() {
  const open = useAether((s) => s.promptOpen);
  const pos = useAether((s) => s.promptPos);
  const setPos = useAether((s) => s.setPromptPos);

  return (
    <div className={`prompt-seat${open ? " open" : ""}`}>
      <Draggable x={pos.x} y={pos.y} onMove={setPos} armMs={240} className="prompt-drag">
        <ConsensusPreview />
        <PromptBar />
      </Draggable>
    </div>
  );
}
