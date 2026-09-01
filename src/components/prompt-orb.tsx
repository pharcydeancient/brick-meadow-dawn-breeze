import { useAether } from "@/lib/store";

/** Glyphless glowing orb. Tap summons the composer. Always mounted so it can crossfade. */
export function PromptOrb() {
  const open = useAether((s) => s.promptOpen);
  const setPromptOpen = useAether((s) => s.setPromptOpen);
  return (
    <button
      type="button"
      className={`prompt-orb${open ? " away" : ""}`}
      aria-label="Open composer"
      aria-hidden={open}
      tabIndex={open ? -1 : 0}
      onClick={() => {
        if (!open) setPromptOpen(true);
      }}
    >
      <span className="orb-halo" aria-hidden />
      <span className="orb-sphere">
        <span className="orb-sheen" aria-hidden />
      </span>
    </button>
  );
}
