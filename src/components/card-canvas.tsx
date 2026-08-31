import { useEffect, useRef, useState } from "react";
import { useAether } from "@/lib/store";
import { cellForIndex, metrics } from "@/lib/card-layout";
import { Draggable } from "./draggable";
import { ModelCard } from "./model-card";

export function CardCanvas() {
  const layout = useAether((s) => s.cardLayout);
  const enabled = useAether((s) => s.enabledModelIds);
  const rows = useAether((s) => s.cardRows);
  const draggingId = useAether((s) => s.draggingCardId);
  const setDraggingCard = useAether((s) => s.setDraggingCard);
  const alignRequest = useAether((s) => s.alignRequest);
  const moveCard = useAether((s) => s.moveCard);
  const setCardLayout = useAether((s) => s.setCardLayout);
  const openCard = useAether((s) => s.openCard);
  const cards = layout.filter((c) => enabled.includes(c.id));
  const host = useRef<HTMLDivElement>(null);
  const prevRows = useRef(rows);
  const prevCount = useRef(cards.length);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const apply = () => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      if (w < 40 || h < 40) return;
      setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fallback = box.w < 40 ? { w: 360, h: 640 } : box;
  const m = metrics(fallback.w, fallback.h, rows, cards.length);

  useEffect(() => {
    if (box.w < 40) return;
    setCardLayout(
      cards.map((c, i) => {
        const cell = cellForIndex(i, rows, m);
        if (!alignRequest && cards.length && c.x !== 0 && c.y !== 0 && prevRows.current === rows && prevCount.current === cards.length) {
          return c;
        }
        return { id: c.id, x: cell.x, y: cell.y };
      }),
    );
    prevRows.current = rows;
    prevCount.current = cards.length;
  }, [box.w, box.h, rows, cards.length, alignRequest]);

  return (
    <div ref={host} className={`card-canvas${draggingId ? " rearranging" : ""}`}>
      {cards.length === 0 ? (
        <div className="flex h-full items-center justify-center px-8 text-center">
          <p className="empty-line">Models, then light one.</p>
        </div>
      ) : (
        <div className="card-strip" style={{ width: Math.max(fallback.w, m.contentW), height: "100%" }}>
          {cards.map((c, i) => {
            const cell = cellForIndex(i, rows, m);
            const x = c.x || cell.x;
            const y = c.y || cell.y;
            const held = draggingId === c.id;
            return (
              <Draggable
                key={c.id}
                x={x}
                y={y}
                onMove={(p) => moveCard(c.id, p.x, p.y)}
                armMs={420}
                onArm={() => setDraggingCard(c.id)}
                onDrop={() => setDraggingCard(null)}
                onTap={() => openCard(c.id)}
                className={`card-slot${held ? " lifted" : ""}`}
                style={{ width: m.cardW, height: m.cardH, zIndex: held ? 8 : 1 }}
              >
                <ModelCard id={c.id} lifted={held} />
              </Draggable>
            );
          })}
        </div>
      )}
    </div>
  );
}
