import { useState, type ReactNode } from "react";
import { Folder, History } from "lucide-react";
import { MODELS } from "@/lib/models";
import { useAether } from "@/lib/store";
import { ContextMenu, type CtxItem } from "./context-menu";
import { RegionTag } from "./guide-overlay";

export function CardView() {
  const id = useAether((s) => s.cardModelId);
  const conv = useAether((s) => (id ? s.conversations[id] : undefined));
  const setSurface = useAether((s) => s.setSurface);
  const model = MODELS.find((m) => m.id === id);
  const [ctx, setCtx] = useState<{ x: number; y: number; items: CtxItem[] } | null>(null);

  if (!model) return null;
  const messages = conv?.messages ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <RegionTag label="Card view · one model · opaque work" style={{ top: 0, right: 0 }} />
      <header className="mb-3 flex items-center justify-between gap-3 px-1">
        <div>
          <div className="type-meta">{model.category}</div>
          <h2 className="type-display text-[32px]">{model.name}</h2>
        </div>
        <div className="flex gap-2">
          <IconBtn label="Files" onClick={() => setSurface("files")}>
            <Folder size={16} />
          </IconBtn>
          <IconBtn label="History" onClick={() => setSurface("history")}>
            <History size={16} />
          </IconBtn>
        </div>
      </header>
      <div className="quiet-scroll min-h-0 flex-1 space-y-3 pr-1">
        {messages.length === 0 ? (
          <p className="pt-10 text-center text-[13px]" style={{ color: "var(--color-fg-tertiary)" }}>
            Summon the orb. Speak to {model.name} alone.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={m.role === "user" ? "ml-8" : "mr-6"}
              onContextMenu={(e) => {
                e.preventDefault();
                const text = m.text;
                setCtx({
                  x: e.clientX,
                  y: e.clientY,
                  items: [
                    {
                      id: "copy",
                      label: "Copy",
                      onSelect: () => navigator.clipboard.writeText(text),
                    },
                    {
                      id: "hide",
                      label: "Hide",
                      danger: true,
                      onSelect: () => {},
                    },
                  ],
                });
              }}
            >
              <div className="type-meta mb-1">{m.role === "user" ? "You" : model.short}</div>
              <div
                className={m.role === "user" ? "glass-thin" : "glass-card"}
                style={{ padding: "10px 12px", borderRadius: 16 }}
              >
                {m.imageUrl ? (
                  <img
                    src={m.imageUrl}
                    alt=""
                    className="mb-2 w-full rounded-[12px] object-cover"
                    style={{ outline: "1px solid rgba(255,255,255,0.12)", outlineOffset: -1 }}
                  />
                ) : null}
                <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {ctx ? <ContextMenu {...ctx} onClose={() => setCtx(null)} /> : null}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="glass-thin gaze"
      style={{
        width: 40,
        height: 40,
        borderRadius: 14,
        display: "grid",
        placeItems: "center",
        border: 0,
        color: "var(--color-fg)",
      }}
    >
      {children}
    </button>
  );
}


