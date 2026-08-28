import { useAether } from "@/lib/store";
import { ModelCard } from "./model-card";
import { RegionTag } from "./guide-overlay";

export function CardCanvas() {
  const layout = useAether((s) => s.cardLayout);
  const enabled = useAether((s) => s.enabledModelIds);
  const cards = layout.filter((c) => enabled.includes(c.id));

  return (
    <div className="card-canvas">
      <RegionTag label="Card canvas · phone cards · long-press to lift" style={{ top: 0, left: 0 }} />
      {cards.length === 0 ? (
        <div className="flex h-full items-center justify-center px-8 text-center" style={{ gridColumn: "1 / -1" }}>
          <div>
            <p className="type-display text-[28px]">Empty room</p>
            <p className="mt-2 text-[13px]" style={{ color: "var(--color-fg-secondary)" }}>
              Open settings, Models, and light a model.
            </p>
          </div>
        </div>
      ) : (
        cards.map((c) => (
          <div key={c.id} className="card-slot">
            <ModelCard id={c.id} x={c.x} y={c.y} />
          </div>
        ))
      )}
    </div>
  );
}
