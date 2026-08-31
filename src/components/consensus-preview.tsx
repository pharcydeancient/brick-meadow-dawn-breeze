import { useRef } from "react";
import { MODELS } from "@/lib/models";
import { useAether } from "@/lib/store";
import { WinClose } from "./win-close";

function useVoices() {
  const enabled = useAether((s) => s.enabledModelIds);
  const convs = useAether((s) => s.conversations);
  return enabled
    .map((id) => {
      const model = MODELS.find((m) => m.id === id);
      const last = convs[id]?.messages.filter((m) => m.role === "assistant").at(-1);
      if (!last?.text || !model) return null;
      return { id, name: model.name, short: model.short, accent: model.accent, text: last.text };
    })
    .filter(Boolean) as { id: string; name: string; short: string; accent: string; text: string }[];
}

export function ConsensusPreview() {
  const promptOpen = useAether((s) => s.promptOpen);
  const setOpen = useAether((s) => s.setConsensusOpen);
  const voices = useVoices();
  const lead = voices[0];

  if (!promptOpen) return null;

  return (
    <button
      type="button"
      className="consensus-card"
      onClick={() => {
        if (voices.length) setOpen(true);
      }}
    >
      {lead ? (
        <>
          <span className="consensus-name" style={{ color: lead.accent }}>
            {lead.name}
          </span>
          <span className="consensus-line">{lead.text}</span>
        </>
      ) : (
        <span className="consensus-line">Consensus fills in after a reply.</span>
      )}
    </button>
  );
}

export function ConsensusMap() {
  const open = useAether((s) => s.consensusOpen);
  const setOpen = useAether((s) => s.setConsensusOpen);
  const voices = useVoices();
  const startY = useRef(0);

  if (!open) return null;

  return (
    <div className="consensus-root">
      <button type="button" className="sheet-scrim" aria-label="Dismiss" onClick={() => setOpen(false)} />
      <div
        className="consensus-map"
        onPointerDown={(e) => {
          startY.current = e.clientY;
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        }}
        onPointerUp={(e) => {
          if (e.clientY - startY.current > 72) setOpen(false);
        }}
      >
        <div className="consensus-head">
          <p>Consensus</p>
          <WinClose onClick={() => setOpen(false)} />
        </div>
        {voices.map((s) => (
          <div key={s.id} className="consensus-node" style={{ ["--node-accent" as string]: s.accent }}>
            <b style={{ color: s.accent }}>{s.name}</b>
            <span>{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
