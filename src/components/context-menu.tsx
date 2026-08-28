import { useEffect } from "react";

export interface CtxItem {
  id: string;
  label: string;
  danger?: boolean;
  onSelect: () => void;
}

export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: CtxItem[];
  onClose: () => void;
}) {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [onClose]);

  return (
    <div
      className="glass-ornament"
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 80,
        minWidth: 168,
        padding: 6,
        borderRadius: 16,
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className="gaze"
          onClick={() => {
            it.onSelect();
            onClose();
          }}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            border: 0,
            background: "transparent",
            color: it.danger ? "var(--color-danger)" : "var(--color-fg)",
            fontSize: 13,
            padding: "10px 12px",
            borderRadius: 12,
          }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
