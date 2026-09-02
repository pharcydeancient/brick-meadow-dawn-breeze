import { useEffect, useRef } from "react";
import { MODELS } from "@/lib/models";
import { useAether } from "@/lib/store";

export function ModelCard({ id, lifted }: { id: string; lifted?: boolean }) {
  const model = MODELS.find((x) => x.id === id);
  const conv = useAether((s) => s.conversations[id]);
  const dragging = useAether((s) => s.draggingCardId === id);
  const openCard = useAether((s) => s.openCard);
  const thread = conv?.messages ?? [];
  const log = useRef<HTMLDivElement>(null);
  const startScroll = useRef(0);

  useEffect(() => {
    const el = log.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [thread.length, id]);

  if (!model) return null;

  return (
    <article
      className={`model-card${lifted || dragging ? " lifted" : ""}`}
      style={{ ["--card-accent" as string]: model.accent }}
    >
      <header className="card-head">
        <span className="card-bloom" aria-hidden />
        <h3 className="card-name">{model.name}</h3>
      </header>
      <div
        ref={log}
        className="card-log quiet-scroll"
        data-scroll
        onWheel={(e) => {
          const el = log.current;
          if (!el || el.scrollHeight <= el.clientHeight + 1) return;
          e.stopPropagation();
        }}
        onPointerDown={() => {
          startScroll.current = log.current?.scrollTop ?? 0;
        }}
        onClick={() => {
          const now = log.current?.scrollTop ?? 0;
          if (Math.abs(now - startScroll.current) < 8) openCard(id);
        }}
      >
        {thread.length ? (
          thread.map((msg) => (
            <p key={msg.id} className={`card-mini ${msg.role === "user" ? "you" : "them"}`}>
              {msg.text}
            </p>
          ))
        ) : (
          <p className="card-empty">Tap to start a conversation.</p>
        )}
      </div>
    </article>
  );
}
