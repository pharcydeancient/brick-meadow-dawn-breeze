import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { MODELS } from "@/lib/models";
import { useAether } from "@/lib/store";
import { ContextMenu, type CtxItem } from "./context-menu";

export function CardView() {
  const id = useAether((s) => s.cardModelId);
  const enabled = useAether((s) => s.enabledModelIds);
  const conv = useAether((s) => (id ? s.conversations[id] : undefined));
  const openCard = useAether((s) => s.openCard);
  const hideMessage = useAether((s) => s.hideMessage);
  const close = useAether((s) => s.closeToHome);
  const model = MODELS.find((m) => m.id === id);
  const [ctx, setCtx] = useState<{ x: number; y: number; items: CtxItem[] } | null>(null);
  const [slide, setSlide] = useState<"left" | "right" | null>(null);
  const hold = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0, scroll: 0 });
  const scrolled = useRef(false);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [id, enabled, close]);

  if (!model || !id) return null;
  const messages = conv?.messages ?? [];

  function step(dir: -1 | 1) {
    if (!id) return;
    const i = enabled.indexOf(id);
    if (i < 0 || enabled.length < 2) return;
    const next = enabled[(i + dir + enabled.length) % enabled.length];
    setSlide(dir === 1 ? "left" : "right");
    window.setTimeout(() => {
      openCard(next);
      setSlide(null);
    }, 160);
  }

  function openMenu(x: number, y: number, msgId: string, text: string) {
    setCtx({
      x,
      y,
      items: [
        { id: "copy", label: "Copy", onSelect: () => navigator.clipboard.writeText(text) },
        {
          id: "hide",
          label: "Hide",
          danger: true,
          onSelect: () => hideMessage(id!, msgId),
        },
      ],
    });
  }

  return (
    <div
      className={`card-view${slide ? ` slide-${slide}` : ""}`}
      style={{ ["--card-accent" as string]: model.accent }}
      onPointerDown={(e) => {
        start.current = { x: e.clientX, y: e.clientY, scroll: list.current?.scrollTop ?? 0 };
        scrolled.current = false;
      }}
      onPointerMove={() => {
        if (list.current && Math.abs(list.current.scrollTop - start.current.scroll) > 8) {
          scrolled.current = true;
        }
      }}
      onPointerUp={(e) => {
        const dx = e.clientX - start.current.x;
        const dy = e.clientY - start.current.y;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        if (absX < 56 && absY < 72) return;
        if (absX > absY * 1.15) {
          step(dx < 0 ? 1 : -1);
          return;
        }
        if (!scrolled.current && absY > 72) close();
      }}
    >
      <header className="card-view-head">
        <button type="button" className="card-back" onClick={close} aria-label="Back">
          <ChevronLeft size={18} strokeWidth={2.25} />
          <span>Back</span>
        </button>
        <h2 className="card-view-title">{model.name}</h2>
        <span className="card-head-spacer" aria-hidden />
      </header>
      <div ref={list} className="quiet-scroll card-view-thread">
        {messages.map((m) => (
          <article
            key={m.id}
            className={`line ${m.role === "user" ? "you" : "them"}`}
            onContextMenu={(e) => {
              e.preventDefault();
              openMenu(e.clientX, e.clientY, m.id, m.text);
            }}
            onPointerDown={() => {
              hold.current = window.setTimeout(
                () => openMenu(start.current.x, start.current.y, m.id, m.text),
                420,
              );
            }}
            onPointerUp={() => {
              if (hold.current) window.clearTimeout(hold.current);
            }}
            onPointerMove={() => {
              if (hold.current) window.clearTimeout(hold.current);
            }}
          >
            {m.imageUrl ? <img src={m.imageUrl} alt="" className="line-still" /> : null}
            <p className="whitespace-pre-wrap">{m.text}</p>
          </article>
        ))}
      </div>
      {ctx ? <ContextMenu {...ctx} onClose={() => setCtx(null)} /> : null}
    </div>
  );
}
