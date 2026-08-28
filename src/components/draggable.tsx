import { useRef, type ReactNode, type PointerEvent } from "react";

export function Draggable({
  x,
  y,
  onMove,
  handleSelector = "[data-drag-handle]",
  children,
  className,
  style,
}: {
  x: number;
  y: number;
  onMove: (p: { x: number; y: number }) => void;
  handleSelector?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const origin = useRef({ x: 0, y: 0, px: 0, py: 0 });

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    const t = e.target as HTMLElement;
    if (!t.closest(handleSelector)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    origin.current = { x, y, px: e.clientX, py: e.clientY };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    onMove({
      x: origin.current.x + (e.clientX - origin.current.px),
      y: origin.current.y + (e.clientY - origin.current.py),
    });
  }

  return (
    <div
      className={className}
      style={{ ...style, transform: `translate3d(${x}px, ${y}px, 0)` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      {children}
    </div>
  );
}
