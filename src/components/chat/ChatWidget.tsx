import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatPanel from "./ChatPanel";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-4 sm:right-6 z-[60] w-14 h-14 rounded-full bg-[#001F4F] text-white shadow-2xl flex items-center justify-center hover:scale-105 hover:bg-[#367E30] transition-all duration-300 group"
      >
        <span className="absolute inset-0 rounded-full bg-[#367E30]/40 animate-ping opacity-60 group-hover:opacity-0" />
        <span className="relative">
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </span>
      </button>
    </>
  );
};

export default ChatWidget;
