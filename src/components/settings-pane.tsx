import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Folder, History, Lock, Palette, Image, LayoutGrid, ChevronDown } from "lucide-react";
import { CATEGORIES, MODELS, groupByTier } from "@/lib/models";
import { TIER_INFO } from "@/lib/roster";
import { useAether } from "@/lib/store";
import type { SettingsTab, Surface } from "@/lib/types";
import { Draggable } from "./draggable";

type Pane = "apps" | SettingsTab;

const APPS: { id: Surface | "history"; tab?: 0 | 1; label: string; icon: typeof Folder }[] = [
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <Draggable
      x={pos.x}
      y={pos.y}
      onMove={setPos}
      handleSelector=".alert-grip"
      className={`alert-card${pane === "models" ? " models" : pane === "settings" ? " prefs" : ""}`}
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
    </Draggable>
  );
}

function AppsTab({ onClose }: { onClose: () => void }) {
  const setSurface = useAether((s) => s.setSurface);
  const setThemeTab = useAether((s) => s.setThemeMarketTab);
  const setHistoryOpen = useAether((s) => s.setHistoryOpen);
  const setSmartPage = useAether((s) => s.setSmartPage);
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
              if (a.id === "smart") setSmartPage("hub");
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
  const [menuBox, setMenuBox] = useState<{ top: number; left: number; width: number } | null>(null);
  const catBtnRef = useRef<HTMLButtonElement>(null);

  const list = MODELS.filter((m) => m.category === category);
  const groups = groupByTier(list);
  const catLabel = CATEGORIES.find((c) => c.id === category)?.label ?? "General";

  useLayoutEffect(() => {
    if (!openCat) return;
    const r = catBtnRef.current?.getBoundingClientRect();
    if (r) setMenuBox({ top: r.bottom + 8, left: r.left, width: r.width });
  }, [openCat]);

  useEffect(() => {
    if (!openCat) return;
    const onDoc = (e: PointerEvent) => {
      const t = e.target as Node;
      if (catBtnRef.current?.contains(t)) return;
      if ((e.target as HTMLElement).closest?.(".cat-overlay")) return;
      setOpenCat(false);
    };
    window.addEventListener("pointerdown", onDoc);
    return () => window.removeEventListener("pointerdown", onDoc);
  }, [openCat]);

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
      <div className="cat-wrap">
        <button
          ref={catBtnRef}
          type="button"
          className={`cat-row${openCat ? " open" : ""}`}
          aria-haspopup="listbox"
          aria-expanded={openCat}
          onClick={() => setOpenCat((v) => !v)}
        >
          <span>{catLabel}</span>
          <ChevronDown size={14} />
        </button>
      </div>
      {openCat && menuBox
        ? createPortal(
            <div
              className="cat-overlay"
              role="listbox"
              style={{ top: menuBox.top, left: menuBox.left, width: menuBox.width }}
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={c.id === category}
                  className={`cat-option${c.id === category ? " on" : ""}`}
                  onClick={() => {
                    setCategory(c.id);
                    setOpenCat(false);
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
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
              style={{ ["--chip-accent" as string]: m.accent }}
              onClick={() => onToggle(m.id)}
            >
              <span className="chip-edge" aria-hidden />
              <span className="chip-name">{m.short}</span>
              <span className="light" aria-hidden>
                <span className="light-bloom" />
                <span className="light-ring" />
                <span className="light-core" />
              </span>
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
  const blurOnSend = useAether((s) => s.blurOnSend);
  const setBlurOnSend = useAether((s) => s.setBlurOnSend);
  const rows = useAether((s) => s.cardRows);
  const setRows = useAether((s) => s.setCardRows);

  return (
    <div className="alert-body">
      <div className="alert-row rows-row">
        <span>Grid rows</span>
        <div className="row-pills" role="group" aria-label="Grid rows">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              className={`row-pill${rows === n ? " on" : ""}`}
              aria-pressed={rows === n}
              onClick={() => setRows(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <button type="button" className="alert-row" onClick={() => setHideOnSend(!hideOnSend)}>
        <span>Tuck after send</span>
        <span className="alert-val">{hideOnSend ? "On" : "Off"}</span>
      </button>
      <button type="button" className="alert-row" onClick={() => setHideIdle(!hideIdle)}>
        <span>Tuck when idle</span>
        <span className="alert-val">{hideIdle ? "On" : "Off"}</span>
      </button>
      <button type="button" className="alert-row" onClick={() => setBlurOnSend(!blurOnSend)}>
        <span>Blur on send</span>
        <span className="alert-val">{blurOnSend ? "On" : "Off"}</span>
      </button>
    </div>
  );
}
