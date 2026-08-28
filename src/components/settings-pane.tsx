import { useState } from "react";
import { Lock, ChevronDown } from "lucide-react";
import { CATEGORIES, MODELS, groupByTier } from "@/lib/models";
import { useAether } from "@/lib/store";
import { Draggable } from "./draggable";
import { RegionTag } from "./guide-overlay";
import type { SettingsTab } from "@/lib/types";

export function SettingsPane() {
  const open = useAether((s) => s.settingsOpen);
  const tab = useAether((s) => s.settingsTab);
  const pos = useAether((s) => s.settingsPos);
  const setPos = useAether((s) => s.setSettingsPos);
  const setTab = useAether((s) => s.setSettingsTab);
  const category = useAether((s) => s.modelCategory);

  if (!open) return null;

  return (
    <Draggable
      x={pos.x}
      y={pos.y}
      onMove={setPos}
      className={`settings-pane glass-ornament${tab === "models" ? " models" : ""}`}
    >
      <RegionTag label="Settings pane · logistics · no dim" style={{ top: -22, left: 0 }} />
      <div data-drag-handle className="mb-2 flex cursor-grab items-center justify-center">
        <span
          style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            background: "rgba(255,255,255,0.35)",
          }}
        />
      </div>
      <div className="pane-tabs glass-thin">
        {(["account", "models", "prefs"] as SettingsTab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`pane-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "prefs" ? "Settings" : t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === "account" ? <AccountTab /> : null}
      {tab === "models" ? <ModelsTab key={category} /> : null}
      {tab === "prefs" ? <PrefsTab /> : null}
    </Draggable>
  );
}

function AccountTab() {
  const tier = useAether((s) => s.tier);
  const stats = useAether((s) => s.stats);
  const setSurface = useAether((s) => s.setSurface);
  const setSettingsOpen = useAether((s) => s.setSettingsOpen);

  return (
    <div className="space-y-3 px-1 pb-1">
      <div>
        <div className="type-meta">Plan</div>
        <p className="type-display text-[28px] capitalize">{tier}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Notes" value={String(stats.messages)} />
        <Stat label="Stills" value={String(stats.images)} />
        <Stat label="Min" value={String(stats.minutes)} />
      </div>
      <button
        type="button"
        className="gaze"
        onClick={() => {
          setSettingsOpen(false);
          setSurface("upgrade");
        }}
        style={{
          width: "100%",
          height: 40,
          borderRadius: 14,
          border: 0,
          background: "rgba(255,255,255,0.88)",
          color: "#12141a",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        {tier === "elite" ? "Manage plan" : "Upgrade"}
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-thin" style={{ padding: "8px 8px 10px", borderRadius: 14 }}>
      <div className="type-meta">{label}</div>
      <div className="mono mt-1 text-[18px]">{value}</div>
    </div>
  );
}

function ModelsTab() {
  const category = useAether((s) => s.modelCategory);
  const setCategory = useAether((s) => s.setModelCategory);
  const tier = useAether((s) => s.tier);
  const enabled = useAether((s) => s.enabledModelIds);
  const toggle = useAether((s) => s.toggleModel);
  const setSurface = useAether((s) => s.setSurface);
  const setUpgradeFromLock = useAether((s) => s.setUpgradeFromLock);
  const setSettingsOpen = useAether((s) => s.setSettingsOpen);
  const snap = useAether((s) => s.gridSnap);
  const setSnap = useAether((s) => s.setGridSnap);
  const [openCat, setOpenCat] = useState(false);
  const [dying, setDying] = useState<string | null>(null);

  const list = MODELS.filter((m) => m.category === category);
  const groups = groupByTier(list);
  const showFree = category === "general";

  function onToggle(id: string) {
    const wasOn = enabled.includes(id);
    if (wasOn) {
      setDying(id);
      window.setTimeout(() => {
        toggle(id);
        setDying(null);
      }, 520);
    } else {
      toggle(id);
    }
  }

  function lockedTap() {
    setUpgradeFromLock(true);
    setSettingsOpen(false);
    setSurface("upgrade");
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <button
          type="button"
          className="glass-thin gaze flex w-full items-center justify-between px-3"
          style={{ height: 36, borderRadius: 12, border: 0, color: "var(--color-fg)", fontSize: 12 }}
          onClick={() => setOpenCat((v) => !v)}
        >
          {CATEGORIES.find((c) => c.id === category)?.label}
          <ChevronDown size={14} />
        </button>
        {openCat ? (
          <div className="glass-ornament absolute left-0 right-0 top-10 z-10 p-1" style={{ borderRadius: 14 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className="gaze block w-full rounded-[10px] px-3 py-2 text-left text-[12px]"
                style={{ border: 0, background: "transparent", color: "var(--color-fg)" }}
                onClick={() => {
                  setCategory(c.id);
                  setOpenCat(false);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <label className="flex items-center justify-between px-1 py-1 text-[12px]" style={{ color: "var(--color-fg-secondary)" }}>
        Grid snap
        <input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} />
      </label>

      {showFree ? (
        <TierBlock
          title="Free"
          models={groups.free}
          locked={false}
          enabled={enabled}
          dying={dying}
          onToggle={onToggle}
        />
      ) : null}

      <TierBlock
        title="Pro"
        models={groups.pro}
        locked={tier === "free"}
        enabled={enabled}
        dying={dying}
        onToggle={onToggle}
        onLocked={lockedTap}
      />

      {category !== "general" || groups.elite.length ? (
        <TierBlock
          title="Elite"
          models={groups.elite}
          locked={tier !== "elite"}
          enabled={enabled}
          dying={dying}
          onToggle={onToggle}
          onLocked={lockedTap}
        />
      ) : null}
    </div>
  );
}

function TierBlock({
  title,
  models,
  locked,
  enabled,
  dying,
  onToggle,
  onLocked,
}: {
  title: string;
  models: typeof MODELS;
  locked: boolean;
  enabled: string[];
  dying: string | null;
  onToggle: (id: string) => void;
  onLocked?: () => void;
}) {
  if (!models.length) return null;
  return (
    <div className={`lock-veil${locked ? " locked" : ""}`}>
      <div className="mb-1 flex items-center justify-between px-1">
        <span className="type-meta">{title}</span>
        {locked ? <Lock size={12} style={{ color: "var(--color-fg-tertiary)" }} /> : null}
      </div>
      <div
        className="space-y-1"
        onClick={
          locked
            ? (e) => {
                e.preventDefault();
                onLocked?.();
              }
            : undefined
        }
      >
        {models.map((m) => {
          const on = enabled.includes(m.id);
          const rowClass = dying === m.id ? "ember-row off" : on ? "ember-row on" : "ember-row";
          return (
            <div key={m.id} className={rowClass}>
              <div>
                <div className="text-[13px] font-medium">{m.name}</div>
                <div className="mono text-[10px]" style={{ color: "var(--color-fg-tertiary)" }}>
                  {m.short}
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                disabled={locked}
                onClick={() => onToggle(m.id)}
                style={{
                  width: 40,
                  height: 24,
                  borderRadius: 999,
                  border: 0,
                  background: on ? "var(--color-ember)" : "rgba(255,255,255,0.18)",
                  boxShadow: on ? "0 0 14px rgba(255,159,10,0.65)" : "none",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: on ? 19 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: "#fff",
                    transition: "left 180ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrefsTab() {
  const s = useAether();
  return (
    <div className="space-y-1 px-1">
      <Toggle
        label="Hide prompt on send"
        value={s.hidePromptOnSend}
        onChange={s.setHidePromptOnSend}
      />
      <Toggle
        label="Hide prompt after 3s"
        value={s.hidePromptAfterIdle}
        onChange={s.setHidePromptAfterIdle}
      />
      <Toggle label="Blur canvas on send" value={s.blurOnSend} onChange={s.setBlurOnSend} />
      <Toggle label="Layout map" value={s.guideOn} onChange={s.setGuideOn} />
      <Toggle label="Music widget" value={s.musicOpen} onChange={s.setMusicOpen} />
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-2 text-[12.5px]">
      {label}
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}


