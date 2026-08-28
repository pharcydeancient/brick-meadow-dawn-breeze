import { useAether } from "@/lib/store";
import type { CSSProperties } from "react";

export function GuideOverlay() {
  const on = useAether((s) => s.guideOn);
  const setGuideOn = useAether((s) => s.setGuideOn);
  if (!on) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setGuideOn(false)}
        className="glass-ornament"
        style={{
          position: "fixed",
          top: 14,
          right: 14,
          zIndex: 50,
          height: 32,
          padding: "0 12px",
          borderRadius: 999,
          border: 0,
          color: "var(--color-fg)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        Hide map
      </button>
      <div className="guide-tag" style={{ top: 16, left: 16 }}>
        Environment · visionOS passthrough
      </div>
    </>
  );
}

export function RegionTag({
  label,
  style,
}: {
  label: string;
  style?: CSSProperties;
}) {
  const on = useAether((s) => s.guideOn);
  if (!on) return null;
  return (
    <span className="guide-tag" style={style}>
      {label}
    </span>
  );
}
