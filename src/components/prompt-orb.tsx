import { useAether } from "@/lib/store";
import { RegionTag } from "./guide-overlay";

export function PromptOrb() {
  const open = useAether((s) => s.promptOpen);
  const setPromptOpen = useAether((s) => s.setPromptOpen);
  if (open) return null;
  return (
    <button
      type="button"
      className="prompt-orb"
      aria-label="Summon prompt"
      onClick={() => setPromptOpen(true)}
    >
      <span className="orb-sphere" />
      <RegionTag label="Prompt orb" style={{ top: -28, left: "50%", transform: "translateX(-50%)" }} />
    </button>
  );
}
