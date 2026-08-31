import { useEffect, useState } from "react";
import { Folder, History, Lock, Palette, Image, LayoutGrid, ChevronDown } from "lucide-react";
import { CATEGORIES, MODELS, groupByTier } from "@/lib/models";
import { TIER_INFO } from "@/lib/roster";
import { useAether } from "@/lib/store";
import type { SettingsTab, Surface } from "@/lib/types";
import { Draggable } from "./draggable";

type Pane = "apps" | SettingsTab;

const APPS: { id: Surface; tab?: 0 | 1; label: string; icon: typeof Folder }[] = [
  { id: "files", label: "Files", icon: Folder },
  { id: "history", label: "History", icon: History },
  { id: "themes", tab: 0, label: "Themes", icon: Palette },
  { id: "discover", label: "Imagine", icon: Image },
  { id: "smart", label: "Smart", icon: LayoutGrid },
];

export function SettingsPane() {
  const open = useAether((s) => s.settingsOpen);
  const setOpen = useAether((s) => s.setSettingsOpen);
  const category = useAether((s) => s.modelCategory);
  const pos = useAether((s) => s.settingsPos);
  const setPos = useAether((s) => s.setSettingsPos);
  const [pane, setPane] = useState<Pane>("apps");

  useEffect(() => {
    if (open) setPane("apps");
  }, [open]);

  if (!open) return null;

  return (
    <Draggable
      x={pos.x}
      y={pos.y}
      onMove={setPos}
      handleSelector=".alert-grip"
      className={`alert-card${pane === "models" ? " models" : ""}`}
    >
      <div className="alert-grip" data-drag-handle aria-hidden />
      <div className="alert-tabs">
        {(["account", "models", "settings"] as SettingsTab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`alert-tab${pane === t ? " on" : ""}`}
            onClick={() => setPane(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {pane === "apps" ? <AppsTab onClose={() => setOpen(false)} /> : null}
      {pane === "account" ? <AccountTab /> : null}
      {pane === "models" ? <ModelsTab key={category} /> : null}
      {pane === "settings" ? <SettingsTabView /> : null}
      <button type="button" className="alert-cancel" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </Draggable>
  );
}

function AppsTab({ onClose }: { onClose: () => void }) {
  const setSurface = useAether((s) => s.setSurface);
  const setThemeTab = useAether((s) => s.setThemeMarketTab);
  const setHistoryOpen = useAether((s) => s.setHistoryOpen);
  const tier = useAether((s) => s.tier);

  return (
    <div className="alert-body apps-grid">
      {APPS.map((a) => {
        const Icon = a.icon;
        return (
          <button
            key={a.label}
            type="button"
            className="app-icon"
            onClick={() => {
              onClose();
              if (a.id === "history") {
                setHistoryOpen(true);
                return;
              }
              if (a.tab !== undefined) setThemeTab(a.tab);
              setSurface(a.id);
            }}
          >
            <Icon size={18} />
            <span>{a.label}</span>
          </button>
        );
      })}
      <button
        type="button"
        className="app-icon"
        onClick={() => {
          onClose();
          if (tier === "free") setSurface("upgrade");
          else {
            setThemeTab(1);
            setSurface("themes");
          }
        }}
      >
        <Lock size={18} />
        <span>Store</span>
      </button>
    </div>
  );
}

function AccountTab() {
  const tier = useAether((s) => s.tier);
  const setSurface = useAether((s) => s.setSurface);
  const setSettingsOpen = useAether((s) => s.setSettingsOpen);
  const info = TIER_INFO[tier];

  return (
    <div className="alert-body">
      <p className="alert-title">{info.label}</p>
      <p className="alert-desc">{info.price === "$0" ? "General chat" : info.price}</p>
      <button
        type="button"
        className="alert-action"
        onClick={() => {
          setSettingsOpen(false);
          setSurface("upgrade");
        }}
      >
        {tier === "elite" ? "Manage" : "Upgrade"}
      </button>
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
  const requestAlign = useAether((s) => s.requestAlign);
  const [openCat, setOpenCat] = useState(false);
  const [dying, setDying] = useState<string | null>(null);

  const list = MODELS.filter((m) => m.category === category);
  const groups = groupByTier(list);

  function onToggle(id: string) {
    const wasOn = enabled.includes(id);
    if (wasOn) {
      setDying(id);
      window.setTimeout(() => {
        toggle(id);
        setDying(null);
      }, 320);
    } else toggle(id);
  }

  function lockedTap() {
    setUpgradeFromLock(true);
    setSettingsOpen(false);
    setSurface("upgrade");
  }

  return (
    <div className="alert-body">
      <button type="button" className="alert-row" onClick={() => requestAlign()}>
        <span>Align</span>
      </button>
      <button type="button" className="alert-row cat-row" onClick={() => setOpenCat((v) => !v)}>
        <span>{CATEGORIES.find((c) => c.id === category)?.label}</span>
        <ChevronDown size={14} />
      </button>
      {openCat ? (
        <div className="alert-menu">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="alert-row"
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
      <TierGrid
        title="Free"
        band="free"
        models={groups.free}
        locked={false}
        enabled={enabled}
        dying={dying}
        onToggle={onToggle}
      />
      <TierGrid
        title="Pro"
        band="pro"
        models={groups.pro}
        locked={tier === "free"}
        enabled={enabled}
        dying={dying}
        onToggle={onToggle}
        onLocked={lockedTap}
      />
      <TierGrid
        title="Elite"
        band="elite"
        models={groups.elite}
        locked={tier !== "elite"}
        enabled={enabled}
        dying={dying}
        onToggle={onToggle}
        onLocked={lockedTap}
      />
    </div>
  );
}

function TierGrid({
  title,
  band,
  models,
  locked,
  enabled,
  dying,
  onToggle,
  onLocked,
}: {
  title: string;
  band: "free" | "pro" | "elite";
  models: typeof MODELS;
  locked: boolean;
  enabled: string[];
  dying: string | null;
  onToggle: (id: string) => void;
  onLocked?: () => void;
}) {
  if (!models.length) return null;
  return (
    <div className={`tier-band ${band}${locked ? " locked" : ""}`}>
      <p className="tier-kicker">{title}</p>
      <div className="model-grid">
        {models.map((m) => {
          const on = enabled.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              className={`model-chip${on ? " on" : ""}${dying === m.id ? " dying" : ""}`}
              style={on ? { background: m.accent, color: "#fff", ["--chip-accent" as string]: m.accent } : { ["--chip-accent" as string]: m.accent }}
              onClick={() => onToggle(m.id)}
            >
              {m.short}
            </button>
          );
        })}
      </div>
      {locked ? (
        <button type="button" className="tier-lock" onClick={onLocked}>
          <Lock size={16} />
        </button>
      ) : null}
    </div>
  );
}

function SettingsTabView() {
  const hideOnSend = useAether((s) => s.hidePromptOnSend);
  const setHideOnSend = useAether((s) => s.setHidePromptOnSend);
  const hideIdle = useAether((s) => s.hidePromptAfterIdle);
  const setHideIdle = useAether((s) => s.setHidePromptAfterIdle);

  return (
    <div className="alert-body">
      <button type="button" className="alert-row" onClick={() => setHideOnSend(!hideOnSend)}>
        <span>Tuck after send</span>
        <span className="alert-val">{hideOnSend ? "On" : "Off"}</span>
      </button>
      <button type="button" className="alert-row" onClick={() => setHideIdle(!hideIdle)}>
        <span>Tuck when idle</span>
        <span className="alert-val">{hideIdle ? "On" : "Off"}</span>
      </button>
    </div>
  );
}
