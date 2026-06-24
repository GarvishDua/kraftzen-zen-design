# Kraftzen AI Assistant — Floating Chatbot

Integrate the n8n webhook (`https://n8n.garvishdua.me/webhook/kraftzen-chatbot`) as a floating chat bubble available on every page, with a smooth typing/thinking animation and one ongoing conversation persisted in `localStorage`.

## Scope

- Floating round button bottom-right on all routes (mounted in `App.tsx`).
- Click to open a chat panel (≈380×560, glassmorphism in the Kraftzen Digital Zen style: Deep Navy `#001F4F`, Bamboo Green `#367E30` accents, Soft Sand `#F0E8D9` surfaces, subtle noise + orb).
- Header: "Kraftzen Assistant" + close + clear-chat (resets messages & sessionId).
- Message list rendering user/assistant bubbles with markdown (`react-markdown`).
- Composer textarea + send button; Enter sends, Shift+Enter newline; autofocus.
- Thinking state: animated 3-dot pulse + subtle shimmer "Thinking…" bubble while awaiting reply.
- Smooth open/close (scale+fade) and message enter (fade-in-up) using existing Tailwind animations.

## Data flow

- One ongoing conversation. Generate `sessionId` (uuid) once and store in `localStorage` under `kraftzen.chat.sessionId`.
- Store messages array under `kraftzen.chat.messages` (`{id, role, content, ts}[]`).
- On send: POST to webhook
  ```json
  { "message": "...", "sessionId": "..." }
  ```
  Expect `{ "reply": "..." }` (also tolerate `{output}` / `{text}` as fallback).
- Show toast on network/HTTP errors; keep user message, allow retry.

## Files

- `src/components/chat/ChatWidget.tsx` — floating button + panel container, open state.
- `src/components/chat/ChatPanel.tsx` — header, message list, composer.
- `src/components/chat/ChatMessage.tsx` — bubble with markdown.
- `src/components/chat/TypingIndicator.tsx` — animated dots.
- `src/hooks/useKraftzenChat.ts` — state, localStorage persistence, sendMessage to webhook, loading/error.
- `src/App.tsx` — mount `<ChatWidget />` once globally.
- `package.json` — add `react-markdown`.

## Technical notes

- Pure client-side fetch (no backend needed since n8n webhook is public). No secrets.
- Markdown rendered with `react-markdown`, links open in new tab.
- Auto-scroll on new message; preserve scroll-up if user scrolled back.
- Accessible: `role="dialog"`, `aria-label`s, focus trap not required but autofocus textarea on open.
- Respects `prefers-reduced-motion` for animations.

No changes to existing pages beyond mounting the widget.