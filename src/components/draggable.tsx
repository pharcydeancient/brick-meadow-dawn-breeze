import { useRef, type ReactNode, type PointerEvent, type CSSProperties } from "react";

function isInteractive(t: HTMLElement) {
  return Boolean(
    t.closest("button") ||
      t.closest("input") ||
      t.closest("textarea") ||
      t.closest("select") ||
      t.closest("a") ||
      t.closest("label") ||
      t.closest("[contenteditable='true']") ||
      t.closest("[data-scroll]"),
  );
}

/**
 * Free 2D drag. One component for cards, settings, music.
 * armMs > 0: long-press to pick up. Release drops. Glow lives on the child.
 * Buttons / fields never arm the drag — capturing them is why clicks died.
 */
export function Draggable({
  x,
  y,
  onMove,
  onTap,
  onArm,
  onDrop,
  armMs = 0,
  enabled = true,
  handleSelector,
  className,
  style,
  children,
}: {
  x: number;
  y: number;
  onMove: (p: { x: number; y: number }) => void;
  onTap?: () => void;
  onArm?: () => void;
  onDrop?: () => void;
  armMs?: number;
  enabled?: boolean;
  handleSelector?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const origin = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const moved = useRef(false);
  const armed = useRef(false);
  const timer = useRef<number | null>(null);

  function clearTimer() {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const t = e.target as HTMLElement;
    if (isInteractive(t)) return;
    if (handleSelector && !t.closest(handleSelector)) return;
    moved.current = false;
    armed.current = armMs <= 0;
    origin.current = { x, y, px: e.clientX, py: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    if (armMs > 0) {
      timer.current = window.setTimeout(() => {
        armed.current = true;
        onArm?.();
      }, armMs);
    }
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - origin.current.px;
    const dy = e.clientY - origin.current.py;
    if (Math.hypot(dx, dy) > 8) {
      moved.current = true;
      if (!armed.current && armMs > 0) {
        clearTimer();
        return;
      }
    }
    if (!armed.current) return;
    onMove({
      x: origin.current.x + dx,
      y: origin.current.y + dy,
    });
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const wasArmed = armed.current;
    const wasMoved = moved.current;
    clearTimer();
    armed.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (wasArmed) onDrop?.();
    if (!wasMoved && !wasArmed) onTap?.();
  }

  return (
    <div
      className={className}
      style={{ ...style, transform: `translate3d(${x}px, ${y}px, 0)` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {children}
    </div>
  );
}
