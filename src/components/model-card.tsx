import { MODELS } from "@/lib/models";
import { useAether } from "@/lib/store";

export function ModelCard({ id, lifted }: { id: string; lifted?: boolean }) {
  const model = MODELS.find((x) => x.id === id);
  const conv = useAether((s) => s.conversations[id]);
  const dragging = useAether((s) => s.draggingCardId === id);
  const thread = (conv?.messages ?? []).slice(-8);

  if (!model) return null;

  return (
    <article
      className={`model-card${lifted || dragging ? " lifted" : ""}`}
      style={{ ["--card-accent" as string]: model.accent }}
    >
      <header className="card-head">
        <h3 className="card-name">{model.name}</h3>
      </header>
      <div className="card-log">
        {thread.length ? (
          thread.map((msg) => (
            <p key={msg.id} className={`card-mini ${msg.role === "user" ? "you" : "them"}`}>
              {msg.text}
            </p>
          ))
        ) : (
          <p className="card-empty">Tap to start a conversation.</p>
        )}
      </div>
    </article>
  );
}
