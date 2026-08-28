import { Environment } from "./environment";
import { CardCanvas } from "./card-canvas";
import { CardView } from "./card-view";
import { FilesView } from "./files-view";
import { HistoryView } from "./history-view";
import { ThemeView } from "./theme-view";
import { DiscoverView } from "./discover-view";
import { UpgradeView } from "./upgrade-view";
import { EdgeNav } from "./edge-nav";
import { SettingsOrb } from "./settings-orb";
import { SettingsPane } from "./settings-pane";
import { PromptOrb } from "./prompt-orb";
import { PromptBar } from "./prompt-bar";
import { MusicPlayer } from "./music-player";
import { GuideOverlay, RegionTag } from "./guide-overlay";
import { useAether } from "@/lib/store";

export function SpatialShell() {
  const surface = useAether((s) => s.surface);
  const close = useAether((s) => s.closeToHome);
  const heavy = surface !== "home";

  return (
    <div className="app-root">
      <Environment />
      <GuideOverlay />
      <div className="scene">
        <div className="stage">
          <EdgeNav />
          <section className={`main-window glass-window${heavy ? " glass-heavy" : ""}`}>
            <RegionTag label="Main window · glass" style={{ top: 10, left: 14 }} />
            {surface !== "home" ? (
              <button
                type="button"
                className="close-affordance"
                aria-label="Close"
                onClick={close}
              >
                ×
              </button>
            ) : null}
            <div className="window-body" key={surface}>
              {surface === "home" ? <CardCanvas /> : null}
              {surface === "card" ? <CardView /> : null}
              {surface === "files" ? <FilesView /> : null}
              {surface === "history" ? <HistoryView /> : null}
              {surface === "themes" ? <ThemeView /> : null}
              {surface === "discover" ? <DiscoverView /> : null}
              {surface === "upgrade" ? <UpgradeView /> : null}
            </div>
            <div className="window-bar glass-ornament" />
            <RegionTag
              label="Window bar"
              style={{ bottom: -38, left: "50%", transform: "translateX(-50%)" }}
            />
          </section>
        </div>
        <SettingsPane />
      </div>
      <MusicPlayer />
      <div className="dock">
        <SettingsOrb />
        <PromptOrb />
      </div>
      <PromptBar />
    </div>
  );
}
