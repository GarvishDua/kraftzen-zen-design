import { useCallback, useEffect, useRef, useState } from "react";

const WEBHOOK_URL = "https://n8n.garvishdua.me/webhook/kraftzen-chatbot";
const LS_MESSAGES = "kraftzen.chat.messages";
const LS_SESSION = "kraftzen.chat.sessionId";

export type ChatRole = "user" | "assistant";
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  ts: number;
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(LS_MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function loadSession(): string {
  try {
    const existing = localStorage.getItem(LS_SESSION);
    if (existing) return existing;
  } catch {}
  const id = uid();
  try {
    localStorage.setItem(LS_SESSION, id);
  } catch {}
  return id;
}

export function useKraftzenChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    typeof window === "undefined" ? [] : loadMessages()
  );
  const [sessionId, setSessionId] = useState<string>(() =>
    typeof window === "undefined" ? "" : loadSession()
  );
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LS_MESSAGES, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content,
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, sessionId }),
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ct = res.headers.get("content-type") || "";
        let reply = "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          reply =
            (typeof data === "string" ? data : null) ??
            data?.reply ??
            data?.output ??
            data?.text ??
            data?.message ??
            data?.response ??
            (Array.isArray(data) ? data[0]?.reply ?? data[0]?.output ?? data[0]?.text : "") ??
            "";
        } else {
          reply = await res.text();
        }
        if (!reply) reply = "(no response)";
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: String(reply), ts: Date.now() },
        ]);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content: "Sorry — I couldn't reach the assistant. Please try again.",
            ts: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId]
  );

  const clear = useCallback(() => {
    setMessages([]);
    const id = uid();
    setSessionId(id);
    try {
      localStorage.setItem(LS_SESSION, id);
      localStorage.removeItem(LS_MESSAGES);
    } catch {}
  }, []);

  return { messages, loading, sendMessage, clear, sessionId };
}
