import { useRef } from "react";
import { MODELS } from "@/lib/models";
import { useAether } from "@/lib/store";
import { RegionTag } from "./guide-overlay";

const LONG_MS = 420;

export function ModelCard({
  id,
  x,
  y,
}: {
  id: string;
  x: number;
  y: number;
}) {
  const model = MODELS.find((m) => m.id === id);
  const conv = useAether((s) => s.conversations[id]);
  const dragging = useAether((s) => s.draggingCardId === id);
  const setDragging = useAether((s) => s.setDraggingCard);
  const moveCard = useAether((s) => s.moveCard);
  const gridSnap = useAether((s) => s.gridSnap);
  const snapCards = useAether((s) => s.snapCards);
  const openCard = useAether((s) => s.openCard);
  const last = conv?.messages.at(-1);
  const timer = useRef<number | null>(null);
  const origin = useRef({ x: 0, y: 0, px: 0, py: 0, lifted: false });
  const moved = useRef(false);

  if (!model) return null;

  return (
    <article
      className={`model-card glass-card${dragging ? " lifted" : ""}`}
      style={
        dragging
          ? {
              left: `calc(${x}% + 3px)`,
              top: `calc(${y}% + 4px)`,
              zIndex: 5,
            }
          : undefined
      }
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        moved.current = false;
        origin.current = {
          x,
          y,
          px: e.clientX,
          py: e.clientY,
          lifted: false,
        };
        const el = e.currentTarget;
        el.setPointerCapture(e.pointerId);
        timer.current = window.setTimeout(() => {
          origin.current.lifted = true;
          setDragging(id);
        }, LONG_MS);
      }}
      onPointerMove={(e) => {
        const dx = e.clientX - origin.current.px;
        const dy = e.clientY - origin.current.py;
        if (Math.hypot(dx, dy) > 8) moved.current = true;
        if (!origin.current.lifted) return;
        const parent = (e.currentTarget.parentElement?.getBoundingClientRect() ??
          null);
        if (!parent) return;
        const nx = origin.current.x + (dx / parent.width) * 100;
        const ny = origin.current.y + (dy / parent.height) * 100;
        moveCard(id, Math.min(66.6, Math.max(0, nx)), Math.min(50, Math.max(0, ny)));
      }}
      onPointerUp={() => {
        if (timer.current) window.clearTimeout(timer.current);
        if (origin.current.lifted) {
          setDragging(null);
          if (gridSnap) snapCards();
        } else if (!moved.current) {
          openCard(id);
        }
        origin.current.lifted = false;
      }}
    >
      <div className="phone-island" />
      <header className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <div className="type-meta">{model.category}</div>
          <h3
            className="type-display mt-0.5 truncate text-[15px]"
            style={{ color: "var(--color-fg)" }}
          >
            {model.name}
          </h3>
        </div>
        <span
          className="mono text-[9px] tracking-widest"
          style={{
            color: model.accent,
            width: 22,
            height: 22,
            borderRadius: 8,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.16)",
            flexShrink: 0,
          }}
        >
          {model.short.slice(0, 1)}
        </span>
      </header>
      <p
        className="mt-auto line-clamp-4 text-[11px] leading-relaxed"
        style={{ color: "var(--color-fg-secondary)" }}
      >
        {last?.text ?? model.blurb}
      </p>
      <div className="phone-home" />
      {dragging ? (
        <RegionTag label="Lifted · drag to place" style={{ top: 8, right: 8 }} />
      ) : null}
    </article>
  );
}
