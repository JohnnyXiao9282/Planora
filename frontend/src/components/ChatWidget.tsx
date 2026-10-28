import React, { useEffect, useRef, useState } from "react";
import "./ChatWidget.css";

type Msg = { role: "user" | "assistant"; content: string };

const API_URL = "http://localhost:5050/agent/chat";
const MIN_WIDTH = 280;

const ChatWidget: React.FC = () => {
  // Remember open/closed across pages and reloads; open by default on first visit
  const [open, setOpen] = useState<boolean>(
    () => localStorage.getItem("chatPanelOpen") !== "false"
  );
  useEffect(() => {
    localStorage.setItem("chatPanelOpen", String(open));
  }, [open]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your resume advisor. Fill out your Profile and ask \"Which template suits me?\" — I'll read it and find your best match. You can also tell me your target role or paste part of your resume for feedback.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(() => {
    const saved = Number(localStorage.getItem("chatPanelWidth"));
    return saved >= MIN_WIDTH ? saved : 400;
  });
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Shift page content so the panel doesn't cover it. Fixed-position
  // elements (e.g. the cart's bottom bar) use the --chat-panel-width variable.
  useEffect(() => {
    const offset = open ? `${width}px` : "0px";
    document.body.style.marginRight = offset;
    document.documentElement.style.setProperty("--chat-panel-width", offset);
    localStorage.setItem("chatPanelWidth", String(width));
    return () => {
      document.body.style.marginRight = "0px";
      document.documentElement.style.setProperty("--chat-panel-width", "0px");
    };
  }, [open, width]);

  // Drag-to-resize from the left edge
  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: MouseEvent) => {
      const max = Math.max(MIN_WIDTH, window.innerWidth * 0.8);
      setWidth(
        Math.min(max, Math.max(MIN_WIDTH, window.innerWidth - e.clientX))
      );
    };
    const onUp = () => setResizing(false);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [resizing]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends session so the agent can read the user's profile
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "No response.",
        },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry, I couldn't reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        className="chat-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open resume advisor"
      >
        💬
      </button>
    );
  }

  return (
    <div className="chat-widget" style={{ width }}>
      <div
        className={`chat-resizer${resizing ? " active" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          setResizing(true);
        }}
        onDoubleClick={() => setWidth(400)}
        title="Drag to resize (double-click to reset)"
      />
      <div className="chat-header">
        <span>Resume Advisor</span>
        <button onClick={() => setOpen(false)} aria-label="Close">
          ×
        </button>
      </div>
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="chat-msg assistant">Thinking…</div>}
        <div ref={endRef} />
      </div>
      <div className="chat-input">
        <textarea
          value={input}
          placeholder="e.g. I'm a new grad applying for SWE roles…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
        />
        <button onClick={send} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
