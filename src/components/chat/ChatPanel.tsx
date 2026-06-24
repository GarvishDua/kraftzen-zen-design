import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Send, X, RotateCcw, Bot } from "lucide-react";
import { useKraftzenChat } from "@/hooks/useKraftzenChat";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

const ChatPanel = ({ onClose }: { onClose: () => void }) => {
  const { messages, loading, sendMessage, clear } = useKraftzenChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    sendMessage(text);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Kraftzen Assistant"
      className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[380px] h-[560px] max-h-[calc(100vh-7rem)] rounded-2xl overflow-hidden shadow-2xl border border-[#001F4F]/15 bg-[#F0E8D9]/95 backdrop-blur-xl flex flex-col animate-scale-in origin-bottom-right"
    >
      {/* decorative orb */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#367E30]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 w-48 h-48 rounded-full bg-[#001F4F]/15 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-[#001F4F]/10 bg-white/40 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#001F4F] flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#001F4F] leading-tight">
              Kraftzen Assistant
            </div>
            <div className="text-[11px] text-[#367E30] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#367E30] animate-pulse" />
              Online
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clear}
            aria-label="Clear conversation"
            className="p-2 rounded-lg hover:bg-[#001F4F]/10 text-[#001F4F]/70 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="p-2 rounded-lg hover:bg-[#001F4F]/10 text-[#001F4F]/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {messages.length === 0 && (
          <div className="text-center mt-10 animate-fade-in">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#001F4F] flex items-center justify-center text-white mb-3 shadow-lg">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-[#001F4F]">
              Hi, I'm Kraftzen Assistant
            </h3>
            <p className="text-xs text-[#001F4F]/60 mt-1 px-4">
              Ask me anything about Kraftzen — products, services, or Bro AI.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <TypingIndicator />
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="relative border-t border-[#001F4F]/10 bg-white/60 backdrop-blur p-3">
        <div className="flex items-end gap-2 bg-white rounded-xl border border-[#001F4F]/15 focus-within:border-[#367E30]/60 transition-colors px-3 py-2 shadow-sm">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Type your message…"
            className="flex-1 resize-none bg-transparent outline-none text-sm text-[#001F4F] placeholder:text-[#001F4F]/40 max-h-32 leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="shrink-0 w-9 h-9 rounded-lg bg-[#001F4F] text-white flex items-center justify-center hover:bg-[#367E30] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
