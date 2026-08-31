import { useAether } from "@/lib/store";

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
    </button>
  );
}
