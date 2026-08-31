import type { ReactNode } from "react";
import { WinClose } from "./win-close";

export interface PreviewAction {
  id: string;
  label: string;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
}

export interface PreviewRelated {
  id: string;
  src: string;
  video?: string;
  title?: string;
}

export function PreviewStage({
  title,
  kicker,
  src,
  video,
  onClose,
  actions,
  related = [],
  onRelated,
  children,
}: {
  title: string;
  kicker?: string;
  src: string;
  video?: string;
  onClose: () => void;
  actions: PreviewAction[];
  related?: PreviewRelated[];
  onRelated?: (id: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="f1-stage">
      <WinClose corner onClick={onClose} />
      <div className="f1-hero">
        {video ? (
          <video src={video} poster={src} autoPlay muted loop playsInline />
        ) : (
          <img src={src} alt="" />
        )}
        <div className="f1-veil">
          <p className="f1-kicker">{kicker}</p>
          <h2 className="f1-title">{title}</h2>
          <div className="f1-actions">
            {actions.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`f1-act${a.primary ? " primary" : ""}${a.danger ? " danger" : ""}`}
                onClick={a.onClick}
              >
                {a.label}
              </button>
            ))}
          </div>
          {children}
          {related.length ? (
            <div className="f1-related" aria-label="More in view">
              {related.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="f1-rel"
                  onClick={() => onRelated?.(r.id)}
                  aria-label={r.title || "Related"}
                >
                  {r.video ? (
                    <video src={r.video} poster={r.src} muted playsInline />
                  ) : (
                    <img src={r.src} alt="" />
                  )}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
