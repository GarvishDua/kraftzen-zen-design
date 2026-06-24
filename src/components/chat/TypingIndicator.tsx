const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-white/70 backdrop-blur border border-[#001F4F]/10 w-fit shadow-sm">
    <span className="sr-only">Assistant is thinking</span>
    <span
      className="w-2 h-2 rounded-full bg-[#367E30] animate-bounce"
      style={{ animationDelay: "0ms", animationDuration: "1s" }}
    />
    <span
      className="w-2 h-2 rounded-full bg-[#367E30] animate-bounce"
      style={{ animationDelay: "150ms", animationDuration: "1s" }}
    />
    <span
      className="w-2 h-2 rounded-full bg-[#367E30] animate-bounce"
      style={{ animationDelay: "300ms", animationDuration: "1s" }}
    />
    <span className="ml-2 text-xs text-[#001F4F]/60 tracking-wide">thinking…</span>
  </div>
);

export default TypingIndicator;
