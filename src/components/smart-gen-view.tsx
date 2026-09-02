import { useRef, useState } from "react";
import { Pin, Plus, ArrowUp } from "lucide-react";
import { SMART_KINDS, SMART_LANES, SMART_OBJECTS, SMART_PAGES } from "@/lib/smart";
import { uid, useAether } from "@/lib/store";
import type { SmartBoard, SmartCard, SmartKind, SmartLane, SmartObject } from "@/lib/types";
import { Draggable } from "./draggable";
import { PreviewStage } from "./preview-stage";
import { askModel, imagineEdit, imagineStill } from "@/lib/chat";

export function SmartGenView() {
  const page = useAether((s) => s.smartPage);
  const setPage = useAether((s) => s.setSmartPage);
  const tabsAt = useAether((s) => s.smartTabsAt);
  const setTabsAt = useAether((s) => s.setSmartTabsAt);
  const cards = useAether((s) => s.smartCards);
  const extras = useAether((s) => s.smartBoards);
  const openId = useAether((s) => s.smartOpenId);
  const setOpen = useAether((s) => s.setSmartOpen);
  const moveLane = useAether((s) => s.moveSmartLane);
  const remove = useAether((s) => s.removeSmartCard);
  const genieDocked = useAether((s) => s.genieDocked);
  const setGenieDocked = useAether((s) => s.setGenieDocked);
  const tier = useAether((s) => s.tier);
  const setSurface = useAether((s) => s.setSurface);
  const open = cards.find((c) => c.id === openId) ?? null;
  const boards: SmartBoard[] = [...SMART_LANES, ...extras];

  const nav = (
    <div className="smart-nav">
      {SMART_PAGES.map((p) => (
        <button
          key={p.id}
          type="button"
          className={page === p.id || (p.id === "genie" && genieDocked && page !== "genie") ? "on" : ""}
          onClick={() => {
            if (p.id === "genie" && page !== "hub" && page !== "genie") {
              if (tier === "free") setSurface("upgrade");
              else setGenieDocked(!genieDocked);
              return;
            }
            setGenieDocked(false);
            setPage(p.id);
          }}
        >
          {p.label}
        </button>
      ))}
      <button
        type="button"
        className={`smart-pin${tabsAt === "bottom" ? " on" : ""}`}
        aria-label={tabsAt === "top" ? "Freeze tabs at the bottom" : "Freeze tabs at the top"}
        onClick={() => setTabsAt(tabsAt === "top" ? "bottom" : "top")}
      >
        <Pin size={12} />
      </button>
    </div>
  );

  return (
    <div className={`smart-shell tabs-${tabsAt}`}>
      {page !== "hub" && tabsAt === "top" ? nav : null}
      <div className="smart-body">
        {page === "hub" ? <HubPage /> : null}
        {page === "cards" ? <CardsPage cards={cards} onOpen={setOpen} /> : null}
        {page === "boards" ? <BoardsPage cards={cards} boards={boards} onOpen={setOpen} onLane={moveLane} /> : null}
        {page === "canvas" ? <CanvasPage cards={cards} onOpen={setOpen} /> : null}
        {page === "genie" ? <GeniePage /> : null}
      </div>
      {page !== "hub" && tabsAt === "bottom" ? nav : null}
      {page !== "hub" && page !== "genie" && genieDocked ? (
        <div className="genie-dock">
          <GeniePage docked />
        </div>
      ) : null}
      {open ? (
        <PreviewStage
          title={open.title}
          kicker={open.kind}
          src={open.preview || "/imagine/glass.jpg"}
          onClose={() => setOpen(null)}
          actions={[
            {
              id: "next",
              label: "Advance",
              primary: true,
              onClick: () => {
                const i = SMART_LANES.findIndex((l) => l.id === open.lane);
                const next = SMART_LANES[(i + 1) % SMART_LANES.length];
                moveLane(open.id, next.id);
              },
            },
            {
              id: "board",
              label: "Board",
              onClick: () => {
                setOpen(null);
                setPage("boards");
              },
            },
            {
              id: "rm",
              label: "Delete",
              danger: true,
              onClick: () => remove(open.id),
            },
          ]}
          related={cards.filter((c) => c.id !== open.id && c.preview).slice(0, 6).map((c) => ({
            id: c.id,
            src: c.preview!,
            title: c.title,
          }))}
          onRelated={setOpen}
        >
          {open.body ? <p className="f1-body">{open.body}</p> : null}
        </PreviewStage>
      ) : null}
    </div>
  );
}

function HubPage() {
  const setPage = useAether((s) => s.setSmartPage);
  const tier = useAether((s) => s.tier);
  return (
    <div className="smart-hub">
      <button type="button" className="hub-btn" onClick={() => setPage("cards")}>
        Smart Cards
      </button>
      <button type="button" className="hub-btn" onClick={() => setPage("boards")}>
        Smart Boards
      </button>
      <button type="button" className="hub-btn" onClick={() => setPage("canvas")}>
        Smart Canvas
      </button>
      <button type="button" className="hub-btn" onClick={() => setPage("genie")}>
        Smart Genie{tier === "free" ? " · Pro" : ""}
      </button>
    </div>
  );
}

function CardsPage({ cards, onOpen }: { cards: SmartCard[]; onOpen: (id: string) => void }) {
  const add = useAether((s) => s.addSmartCard);
  const [kind, setKind] = useState<SmartKind>("memory");
  const groups = groupByKind(cards);
  const picked = SMART_KINDS.find((k) => k.id === kind)!;

  return (
    <div className="smart-page">
      <div className="mem-scroll">
        {groups.map(([k, list]) => (
          <section key={k} className="years-block">
            <h2 className="years-label">{labelKind(k)}</h2>
            <div className="mem-grid">
              {list.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className={`mem-card object-${c.kind}${i % 5 === 0 ? " wide" : ""}`}
                  onClick={() => onOpen(c.id)}
                >
                  {c.preview ? <img src={c.preview} alt="" /> : <span className="mem-blank">{c.kind}</span>}
                  <span className="mem-cap">
                    <span>{c.title}</span>
                    <span>{labelKind(c.kind)}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="pop-bar">
        <select
          className="pop-kind"
          value={kind}
          onChange={(e) => setKind(e.target.value as SmartKind)}
          aria-label="Card type"
        >
          {SMART_KINDS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="genie-pop"
          onClick={() =>
            add({
              kind,
              title: `New ${picked.label.toLowerCase()}`,
              body: "",
              lane: "inbox",
              preview: kind === "memory" || kind === "artifact" ? "/imagine/glass.jpg" : undefined,
            })
          }
        >
          <Plus size={14} />
          Pop out
        </button>
      </div>
    </div>
  );
}

function BoardsPage({
  cards,
  boards,
  onOpen,
  onLane,
}: {
  cards: SmartCard[];
  boards: SmartBoard[];
  onOpen: (id: string) => void;
  onLane: (id: string, lane: SmartLane) => void;
}) {
  const addBoard = useAether((s) => s.addSmartBoard);
  const removeBoard = useAether((s) => s.removeSmartBoard);
  const extras = useAether((s) => s.smartBoards);
  const [hold, setHold] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [object, setObject] = useState<SmartObject>("notebook");

  return (
    <div className="board-page">
      <div className="board-track">
        {boards.map((lane) => {
          const list = cards.filter((c) => c.lane === lane.id);
          const custom = extras.some((b) => b.id === lane.id);
          return (
            <section
              key={lane.id}
              className={`board-lane object-${lane.object}`}
              onPointerUp={() => {
                if (hold) onLane(hold, lane.id);
                setHold(null);
              }}
            >
              <span className={`obj-chrome obj-${lane.object}`} aria-hidden />
              <header className="board-head">
                <h3>{lane.label}</h3>
                <span>{list.length}</span>
                {custom ? (
                  <button type="button" className="text-btn" aria-label={`Remove ${lane.label}`} onClick={() => removeBoard(lane.id)}>
                    Remove
                  </button>
                ) : null}
              </header>
              <div className="board-stack">
                {list.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`board-card object-${c.kind}${hold === c.id ? " lifting" : ""}`}
                    onPointerDown={() => setHold(c.id)}
                    onClick={() => onOpen(c.id)}
                  >
                    {c.preview ? <img src={c.preview} alt="" /> : null}
                    <span className="board-title">{c.title}</span>
                    <span className="board-kind">{c.kind}</span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <form
        className="pop-bar"
        onSubmit={(e) => {
          e.preventDefault();
          const label = name.trim();
          if (!label) return;
          addBoard({ label, object });
          setName("");
        }}
      >
        <input
          className="pop-kind"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New board name"
          maxLength={14}
          aria-label="New board name"
        />
        <select className="pop-kind" value={object} onChange={(e) => setObject(e.target.value as SmartObject)} aria-label="Board object">
          {SMART_OBJECTS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="submit" className="genie-pop">
          <Plus size={14} />
          Board
        </button>
      </form>
    </div>
  );
}

function CanvasPage({ cards, onOpen }: { cards: SmartCard[]; onOpen: (id: string) => void }) {
  const place = useAether((s) => s.placeSmartCard);
  const canvases = useAether((s) => s.smartCanvases);
  const activeId = useAether((s) => s.activeCanvasId);
  const setActive = useAether((s) => s.setActiveCanvas);
  const addCanvas = useAether((s) => s.addSmartCanvas);
  const [draft, setDraft] = useState("");
  const swipe = useRef({ x: 0 });
  const scene = canvases.find((c) => c.id === activeId) ?? canvases[0];
  const placed = cards.filter((c) => !c.canvasId || c.canvasId === scene?.id);

  function step(dir: -1 | 1) {
    const i = canvases.findIndex((c) => c.id === scene?.id);
    if (i < 0 || canvases.length < 2) return;
    setActive(canvases[(i + dir + canvases.length) % canvases.length].id);
  }

  return (
    <div
      className="smart-canvas"
      onPointerDown={(e) => {
        swipe.current.x = e.clientX;
      }}
      onPointerUp={(e) => {
        const dx = e.clientX - swipe.current.x;
        if (Math.abs(dx) > 72) step(dx < 0 ? 1 : -1);
      }}
    >
      {placed.map((c) => (
        <Draggable
          key={c.id}
          x={c.x}
          y={c.y}
          armMs={180}
          onMove={(p) => place(c.id, p.x, p.y)}
          onTap={() => onOpen(c.id)}
          className={`canvas-card object-${c.kind}`}
        >
          {c.preview ? <img src={c.preview} alt="" /> : <span className="mem-blank">{c.kind}</span>}
          <span>{c.title}</span>
        </Draggable>
      ))}
      <div className="canvas-scenes">
        {canvases.map((c) => (
          <button
            key={c.id}
            type="button"
            className={c.id === scene?.id ? "on" : ""}
            onClick={() => setActive(c.id)}
          >
            {c.name}
          </button>
        ))}
        {canvases.length < 10 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = draft.trim();
              if (!n) return;
              addCanvas(n);
              setDraft("");
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Name"
              maxLength={12}
              aria-label="New canvas name"
            />
          </form>
        ) : null}
      </div>
    </div>
  );
}

function GeniePage({ docked = false }: { docked?: boolean }) {
  const tier = useAether((s) => s.tier);
  const setSurface = useAether((s) => s.setSurface);
  const messages = useAether((s) => s.genieMessages);
  const addMsg = useAether((s) => s.addGenieMessage);
  const clearGenie = useAether((s) => s.clearGenie);
  const addCard = useAether((s) => s.addSmartCard);
  const addFile = useAether((s) => s.addFile);
  const bumpStat = useAether((s) => s.bumpStat);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [attach, setAttach] = useState<{ name: string; dataUri: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (tier === "free") {
    return (
      <div className="genie-wrap">
        <p className="genie-kicker">Smart Genie</p>
        <p className="genie-hint">The agent that makes cards, boards, and canvases. Pro and above.</p>
        <button type="button" className="genie-pop" onClick={() => setSurface("upgrade")}>
          Unlock
        </button>
      </div>
    );
  }

  async function send() {
    const line = text.trim();
    if ((!line && !attach) || busy) return;
    setText("");
    const held = attach;
    setAttach(null);
    addMsg({
      id: uid("g"),
      role: "user",
      text: line || "Use the attached still.",
      imageUrl: held?.dataUri,
      createdAt: Date.now(),
    });
    setBusy(true);

    const wantsStill =
      Boolean(held) ||
      /\b(image|still|photo|picture|poster|render|imagine|illustration|artwork|scene)\b/i.test(line);

    let stillUrl = held?.dataUri;
    if (wantsStill) {
      const made = held
        ? await imagineEdit({ data: { prompt: line || "Remix this still.", src: held.dataUri } })
        : await imagineStill({ data: { prompt: line } });
      if (made.ok && made.url) {
        stillUrl = made.url;
        bumpStat("images");
        addFile({
          id: uid("f"),
          modelId: "genie",
          name: `${(line || "genie").slice(0, 18)}.png`,
          kind: "image",
          sizeLabel: "1k",
          createdAt: Date.now(),
          preview: made.url,
        });
      }
    }

    const history = useAether
      .getState()
      .genieMessages.slice(-8)
      .map((m) => ({
        role: m.role,
        content: m.imageUrl ? `${m.text}\n[Attached still]` : m.text,
      }));
    const res = await askModel({
      data: {
        modelId: "genie",
        persona:
          "Smart Genie, an agent inside Aether. You make and reorganize Smart Cards, Boards, and Canvas objects. Speak plainly. When you create something, start one line with MADE: then the title and type. If a still was generated, name it.",
        messages: stillUrl
          ? [...history, { role: "user" as const, content: stillUrl === held?.dataUri ? "A still is attached as source." : `A still was generated: ${stillUrl}` }]
          : history,
      },
    });
    const reply = res.ok ? res.text : res.error;
    addMsg({
      id: uid("g"),
      role: "assistant",
      text: reply,
      imageUrl: stillUrl && stillUrl !== held?.dataUri ? stillUrl : undefined,
      createdAt: Date.now(),
    });
    const madeLine = reply.match(/MADE:\s*(.+)/i);
    if (madeLine || stillUrl) {
      addCard({
        kind: stillUrl ? "artifact" : "note",
        title: (madeLine?.[1] ?? line).slice(0, 48),
        body: line,
        lane: "inbox",
        preview: stillUrl,
      });
    }
    setBusy(false);
  }

  return (
    <div className={`genie-chat${docked ? " docked" : ""}`}>
      <div className="genie-head">
        <div>
          <p className="genie-kicker">Smart Genie</p>
          <p className="genie-hint">Ask for a card, a board, or a still. It stays in this canvas.</p>
        </div>
        <button
          type="button"
          className="text-btn"
          aria-label="New conversation"
          onClick={() => {
            clearGenie();
            setText("");
            setAttach(null);
            setBusy(false);
          }}
        >
          New
        </button>
      </div>
      <div className="genie-thread quiet-scroll">
        {messages.length === 0 ? (
          <p className="empty-line">What should we make.</p>
        ) : (
          messages.map((m) => (
            <article key={m.id} className={`line ${m.role === "user" ? "you" : "them"}`}>
              {m.imageUrl ? <img src={m.imageUrl} alt="" className="line-still" /> : null}
              <p className="whitespace-pre-wrap">{m.text}</p>
            </article>
          ))
        )}
      </div>
      {attach ? (
        <div className="attach-row">
          <figure className="attach-chip">
            <img src={attach.dataUri} alt="" />
            <figcaption>{attach.name}</figcaption>
            <button type="button" aria-label="Remove attachment" onClick={() => setAttach(null)}>
              ×
            </button>
          </figure>
        </div>
      ) : null}
      <form
        className="genie-compose"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              const url = String(reader.result || "");
              if (url) setAttach({ name: file.name, dataUri: url });
            };
            reader.readAsDataURL(file);
          }}
        />
        <button
          type="button"
          className="prompt-plus"
          aria-label="Attach"
          title="Attach"
          onClick={() => fileRef.current?.click()}
        >
          <Plus size={16} />
          <span className="ctrl-label">Attach</span>
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={busy ? "Making…" : "Ask Genie"}
          disabled={busy}
        />
        <button
          type="submit"
          className="send-btn imagine-go"
          aria-label="Send"
          disabled={busy || (!text.trim() && !attach)}
        >
          <ArrowUp size={16} />
          <span className="ctrl-label">Send</span>
        </button>
      </form>
    </div>
  );
}

function groupByKind(cards: SmartCard[]): [SmartKind, SmartCard[]][] {
  const order: SmartKind[] = ["memory", "artifact", "task", "note"];
  return order
    .map((k) => [k, cards.filter((c) => c.kind === k)] as [SmartKind, SmartCard[]])
    .filter(([, list]) => list.length);
}

function labelKind(kind: SmartKind) {
  return SMART_KINDS.find((k) => k.id === kind)?.label ?? kind;
}
