import { Folder, Palette, Compass, History } from "lucide-react";
import { useAether } from "@/lib/store";
import type { Surface } from "@/lib/types";
import { RegionTag } from "./guide-overlay";

const TABS: { id: Surface; label: string; icon: typeof Folder }[] = [
  { id: "files", label: "Files", icon: Folder },
  { id: "themes", label: "Themes", icon: Palette },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "history", label: "History", icon: History },
];

export function EdgeNav() {
  const surface = useAether((s) => s.surface);
  const setSurface = useAether((s) => s.setSurface);

  return (
    <nav className="leading-ornament glass-ornament" aria-label="Room">
      <RegionTag label="Leading ornament" style={{ top: -22, left: 0 }} />
      {TABS.map((t) => {
        const Icon = t.icon;
        const active = surface === t.id;
        return (
          <button
            key={t.id}
            type="button"
            className={`tab-btn${active ? " active" : ""}`}
            onClick={() => setSurface(active ? "home" : t.id)}
          >
            <Icon size={18} />
            <span className="label">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
