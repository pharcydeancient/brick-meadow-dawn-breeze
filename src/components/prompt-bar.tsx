import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { MODELS } from "@/lib/models";
import { askModel, imagineStill } from "@/lib/chat";
import { uid, useAether } from "@/lib/store";
import { RegionTag } from "./guide-overlay";

export function PromptBar() {
  const open = useAether((s) => s.promptOpen);
  const text = useAether((s) => s.promptText);
  const setText = useAether((s) => s.setPromptText);
  const setOpen = useAether((s) => s.setPromptOpen);
  const sending = useAether((s) => s.sending);
  const idle = useAether((s) => s.hidePromptAfterIdle);
  const hideOnSend = useAether((s) => s.hidePromptOnSend);
  const inputRef = useRef<HTMLInputElement>(null);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || !idle) return;
    const bump = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setOpen(false), 3000);
    };
    bump();
    const el = inputRef.current;
    el?.addEventListener("input", bump);
    el?.addEventListener("focus", bump);
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      el?.removeEventListener("input", bump);
      el?.removeEventListener("focus", bump);
    };
  }, [open, idle, setOpen, text]);

  return (
    <form
      className={`prompt-bar glass-ornament${open ? " open" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        void sendPrompt();
      }}
    >
      <RegionTag label="Prompt bar · bottom ornament" style={{ top: -22, left: 8 }} />
      <input
        ref={inputRef}
        value={text}
        placeholder={sending ? "Listening…" : "Ask the room"}
        onChange={(e) => setText(e.target.value)}
        disabled={sending}
      />
      <button type="submit" className="send-btn" aria-label="Send" disabled={sending || !text.trim()}>
        <ArrowUp size={18} />
      </button>
    </form>
  );
}

async function sendPrompt() {
  const s = useAether.getState();
  const text = s.promptText.trim();
  if (!text || s.sending) return;
  s.setSending(true);
  s.flashSend();
  s.setPromptText("");
  if (s.hidePromptOnSend) s.setPromptOpen(false);

  const targets =
    s.surface === "card" && s.cardModelId ? [s.cardModelId] : s.enabledModelIds.slice(0, 6);

  for (const id of targets) {
    s.addMessage(id, {
      id: uid("u"),
      role: "user",
      text,
      createdAt: Date.now(),
    });
  }
  s.bumpStat("messages", targets.length);

  await Promise.all(
    targets.map(async (id) => {
      const model = MODELS.find((m) => m.id === id);
      if (!model) return;
      const history = (s.conversations[id]?.messages ?? []).slice(-8).map((m) => ({
        role: m.role,
        content: m.text,
      }));
      history.push({ role: "user", content: text });

      if (model.kind === "image") {
        const res = await imagineStill({ data: { prompt: text } });
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
              ? "A short bed is queued in Files — a low room tone under the last line."
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
