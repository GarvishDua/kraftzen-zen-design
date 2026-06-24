import ReactMarkdown from "react-markdown";
import type { ChatMessage as ChatMsg } from "@/hooks/useKraftzenChat";

const ChatMessage = ({ message }: { message: ChatMsg }) => {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex w-full animate-fade-in ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={
          isUser
            ? "max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-[#001F4F] text-white shadow-sm text-sm leading-relaxed whitespace-pre-wrap"
            : "max-w-[85%] px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white/80 backdrop-blur border border-[#001F4F]/10 text-[#001F4F] shadow-sm text-sm leading-relaxed"
        }
      >
        {isUser ? (
          message.content
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-a:text-[#367E30] prose-headings:text-[#001F4F]">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
