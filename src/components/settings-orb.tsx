import { Settings } from "lucide-react";
import { useAether } from "@/lib/store";
import { RegionTag } from "./guide-overlay";

export function SettingsOrb() {
  const open = useAether((s) => s.settingsOpen);
  const setOpen = useAether((s) => s.setSettingsOpen);
  return (
    <button
      type="button"
      className="settings-orb glass-ornament gaze-scale"
      aria-label="Settings"
      aria-pressed={open}
      onClick={() => setOpen(!open)}
    >
      <Settings size={18} />
      <RegionTag label="Settings orb" style={{ top: -26, left: 0 }} />
    </button>
  );
}
