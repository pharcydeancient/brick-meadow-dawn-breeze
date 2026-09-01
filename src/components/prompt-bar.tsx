import { useEffect, useRef, useState } from "react";
import { ArrowUp, FileText, Globe, Library, Plus, Telescope } from "lucide-react";
import { MODELS } from "@/lib/models";
import { askModel, imagineStill } from "@/lib/chat";
import { uid, useAether } from "@/lib/store";
import type { Investigation } from "@/lib/types";

/** PromptComposer.tsx — full phrases, never abbreviations. */
const INVESTIGATION: { id: Investigation; label: string; Icon: typeof Globe; color: string }[] = [
  { id: "web", label: "Web search", Icon: Globe, color: "#f5e000" },
  { id: "research", label: "Research", Icon: FileText, color: "#5dbdff" },
  { id: "deep", label: "Deep research", Icon: Library, color: "#9ad0f5" },
];

type PromptAttach = { id: string; name: string; kind: "image"; dataUri: string };

export function PromptBar() {
  const open = useAether((s) => s.promptOpen);
  const text = useAether((s) => s.promptText);
  const setText = useAether((s) => s.setPromptText);
  const setOpen = useAether((s) => s.setPromptOpen);
  const sending = useAether((s) => s.sending);
  const idle = useAether((s) => s.hidePromptAfterIdle);
  const investigation = useAether((s) => s.investigation);
  const setInvestigation = useAether((s) => s.setInvestigation);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<number | null>(null);
  const [tray, setTray] = useState(false);
  const [attaches, setAttaches] = useState<PromptAttach[]>([]);

  const active = INVESTIGATION.find((o) => o.id === investigation);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setTray(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (tray) setTray(false);
        else setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen, tray]);

  useEffect(() => {
    if (!open || !idle) return;
    const bump = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        if (useAether.getState().promptOpen) setOpen(false);
      }, 3500);
    };
    bump();
    const host = rootRef.current?.closest(".prompt-seat") ?? rootRef.current;
    const events = ["pointerdown", "pointermove", "keydown", "input", "focusin"] as const;
    events.forEach((ev) => host?.addEventListener(ev, bump));
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      events.forEach((ev) => host?.removeEventListener(ev, bump));
    };
  }, [open, idle, setOpen, tray]);

  return (
    <div ref={rootRef} className="composer">
      {attaches.length ? (
        <div className="attach-row">
          {attaches.map((a) => (
            <figure key={a.id} className="attach-chip">
              <img src={a.dataUri} alt="" />
              <figcaption>{a.name}</figcaption>
              <button type="button" aria-label="Remove attachment" onClick={() => setAttaches((xs) => xs.filter((x) => x.id !== a.id))}>
                ×
              </button>
            </figure>
          ))}
        </div>
      ) : null}

      <div className={`investigate-tray${tray ? " open" : ""}`} aria-hidden={!tray} inert={!tray || undefined}>
        {INVESTIGATION.map((opt) => {
          const Icon = opt.Icon;
          const on = investigation === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={`investigate-row${on ? " on" : ""}`}
              style={on ? { color: opt.color, borderColor: `${opt.color}59`, background: `${opt.color}1f` } : undefined}
              onClick={() => {
                setInvestigation(opt.id);
                setTray(false);
              }}
            >
              <Icon size={15} />
              <span>{opt.label}</span>
              {on ? <span className="investigate-check">✓</span> : null}
            </button>
          );
        })}
      </div>

      <form
        className={`prompt-bar glass-ornament${open ? " open" : ""}`}
        onPointerDown={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          void sendPrompt(attaches, () => setAttaches([]));
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
              if (!url) return;
              setAttaches((xs) => [
                ...xs,
                { id: uid("a"), name: file.name, kind: "image", dataUri: url },
              ]);
            };
            reader.readAsDataURL(file);
          }}
        />
        <button type="button" className="prompt-plus" aria-label="Attach" title="Attach" onClick={() => fileRef.current?.click()}>
          <Plus size={18} />
          <span className="ctrl-label">Attach</span>
        </button>
        <input
          ref={inputRef}
          value={text}
          placeholder={sending ? "" : "Ask anything…"}
          onChange={(e) => setText(e.target.value)}
          disabled={sending}
        />
        <button type="submit" className="send-btn" aria-label="Send" disabled={sending || (!text.trim() && !attaches.length)}>
          <ArrowUp size={16} strokeWidth={2.4} />
        </button>
        <button
          type="button"
          className={`probe${active ? " on" : ""}`}
          aria-label={active ? `Investigation: ${active.label}` : "Investigation"}
          aria-expanded={tray}
          style={active ? { color: active.color, background: `${active.color}22` } : undefined}
          onClick={() => setTray((v) => !v)}
        >
          <Telescope size={16} />
          <span className="ctrl-label">{active ? active.label : "Search"}</span>
        </button>
      </form>
    </div>
  );
}

async function sendPrompt(attaches: PromptAttach[], clearAttaches: () => void) {
  const s = useAether.getState();
  const text = s.promptText.trim();
  if ((!text && !attaches.length) || s.sending) return;
  const prefix =
    s.investigation === "web"
      ? "Web search. "
      : s.investigation === "research"
        ? "Research report. "
        : s.investigation === "deep"
          ? "Deep research with sources. "
          : "";
  const payload = prefix + (text || "Look at the attached still.");
  s.setSending(true);
  s.flashSend();
  s.setPromptText("");
  if (s.hidePromptOnSend) s.setPromptOpen(false);
  const imageUrl = attaches[0]?.dataUri;
  clearAttaches();

  const targets =
    s.surface === "card" && s.cardModelId ? [s.cardModelId] : s.enabledModelIds.slice(0, 6);

  for (const id of targets) {
    s.addMessage(id, {
      id: uid("u"),
      role: "user",
      text: text || "Attached still.",
      imageUrl,
      createdAt: Date.now(),
    });
  }
  s.bumpStat("messages", targets.length);

  if (imageUrl) {
    s.addFile({
      id: uid("f"),
      modelId: "prompt",
      name: attaches[0]?.name || "attach.png",
      kind: "image",
      sizeLabel: "1k",
      createdAt: Date.now(),
      preview: imageUrl,
    });
  }

  await Promise.all(
    targets.map(async (id) => {
      const model = MODELS.find((m) => m.id === id);
      if (!model) return;
      const history = (s.conversations[id]?.messages ?? []).slice(-8).map((m) => ({
        role: m.role,
        content: m.text,
      }));
      history.push({ role: "user", content: payload });

      if (model.kind === "image") {
        const res = await imagineStill({ data: { prompt: payload } });
        if (res.ok && res.url) {
          s.addMessage(id, {
            id: uid("a"),
            role: "assistant",
            text: "Still from the brief.",
            imageUrl: res.url,
            createdAt: Date.now(),
          });
          s.addFile({
            id: uid("f"),
            modelId: id,
            name: `${model.short.toLowerCase()}-${Date.now().toString().slice(-4)}.png`,
            kind: "image",
            sizeLabel: "1k",
            createdAt: Date.now(),
            preview: res.url,
          });
          s.bumpStat("images");
        } else {
          s.addMessage(id, {
            id: uid("a"),
            role: "assistant",
            text: res.ok ? "No still returned." : res.error,
            createdAt: Date.now(),
          });
        }
        return;
      }

      if (model.kind === "audio" || model.kind === "video") {
        s.addMessage(id, {
          id: uid("a"),
          role: "assistant",
          text:
            model.kind === "audio"
              ? "A short bed is queued in Files — a low tone under the last line."
              : "A five-second clip is queued in Files. Open it from the card.",
          createdAt: Date.now(),
        });
        s.addFile({
          id: uid("f"),
          modelId: id,
          name: `${model.short.toLowerCase()}-clip.${model.kind === "audio" ? "wav" : "mp4"}`,
          kind: model.kind,
          sizeLabel: "queued",
          createdAt: Date.now(),
        });
        return;
      }

      const res = await askModel({
        data: {
          modelId: id,
          persona: `${model.name} — ${model.blurb}`,
          messages: history,
          investigation: s.investigation,
        },
      });
      s.addMessage(id, {
        id: uid("a"),
        role: "assistant",
        text: res.ok ? res.text : res.error,
        createdAt: Date.now(),
      });
    }),
  );

  useAether.getState().setSending(false);
}
