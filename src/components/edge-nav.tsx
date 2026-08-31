import { Folder, Palette, Image, History, LayoutGrid } from "lucide-react";
import { useAether } from "@/lib/store";
import type { Surface } from "@/lib/types";
import { Draggable } from "./draggable";

const TABS: { id: Surface; label: string; icon: typeof Folder }[] = [
  { id: "files", label: "Files", icon: Folder },
  { id: "themes", label: "Themes", icon: Palette },
  { id: "discover", label: "Imagine", icon: Image },
  { id: "smart", label: "Smart", icon: LayoutGrid },
  { id: "history", label: "History", icon: History },
];

export function EdgeNav() {
  const surface = useAether((s) => s.surface);
  const setSurface = useAether((s) => s.setSurface);
  const historyOpen = useAether((s) => s.historyOpen);
  const setHistoryOpen = useAether((s) => s.setHistoryOpen);
  const pos = useAether((s) => s.navPos);
  const setPos = useAether((s) => s.setNavPos);

  return (
    <div className="nav-seat">
      <Draggable x={pos.x} y={pos.y} onMove={setPos} handleSelector=".nav-grip" className="nav-drag">
        <nav className="leading-ornament glass-ornament" aria-label="Canvas">
          <span className="nav-grip" aria-hidden />
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = t.id === "history" ? historyOpen : surface === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`tab-btn${active ? " active" : ""}`}
                aria-label={t.label}
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  if (t.id === "history") {
                    setHistoryOpen(!historyOpen);
                    return;
                  }
                  setHistoryOpen(false);
                  setSurface(active ? "home" : t.id);
                }}
              >
                <Icon size={18} strokeWidth={1.75} />
                <span className="label">
                  {t.label}
                </span>
              </button>
            );
          })}
        </nav>
      </Draggable>
    </div>
  );
}
