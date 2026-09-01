import { useEffect, useRef, useState, type ReactNode } from "react";

export function OverlaySheet({
  open,
  title,
  onClose,
  children,
  size = "list",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "list" | "gallery" | "market";
}) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(open);
  const startY = useRef(0);
  const dragging = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = window.setTimeout(() => setMounted(false), 480);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className={`float-root${shown ? " open" : ""}`}>
      <button type="button" className="sheet-scrim" aria-label="Dismiss" onClick={onClose} />
      <div
        ref={sheetRef}
        className={`float-window sheet-${size}`}
        onPointerDown={(e) => {
          const t = e.target as HTMLElement;
          if (t.closest("button, a, input, textarea")) return;
          const head = t.closest("[data-sheet-handle]");
          const rect = e.currentTarget.getBoundingClientRect();
          const fromTop = e.clientY - rect.top < 56;
          if (!head && !fromTop) return;
          dragging.current = true;
          startY.current = e.clientY;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current || !sheetRef.current) return;
          const dy = e.clientY - startY.current;
          sheetRef.current.style.transform = `translate(-50%, calc(-50% + ${dy}px))`;
        }}
        onPointerUp={(e) => {
          if (!dragging.current || !sheetRef.current) return;
          dragging.current = false;
          const dy = e.clientY - startY.current;
          sheetRef.current.style.transform = "";
          if (dy > 72) onClose();
        }}
      >
        <div className="float-head" data-sheet-handle>
          <span className="float-title">{title || "\u00a0"}</span>
          <button
            type="button"
            className="sheet-close"
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}
