import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const GREETING = "hi! i'm AI jolin — ask me about my projects, research, classes, or what i do for fun ✨";

const SUGGESTIONS = [
  'What are you working on right now?',
  'Tell me about Ascend.AI',
  'What do you do for fun?',
];

// Cartoon girl with a black ponytail
export const JolinAvatar = ({ size = 40, sway = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className="rounded-full" aria-hidden="true">
    <circle cx="32" cy="32" r="32" fill="#2a1630" />
    {/* ponytail */}
    <g className={sway ? 'ponytail-sway' : undefined} style={{ transformOrigin: '46px 20px' }}>
      <path d="M44 16 C58 14 60 30 54 40 C51 45 47 44 49 38 C52 30 50 24 44 22 Z" fill="#111" />
      <circle cx="45" cy="18" r="3.2" fill="#ec4899" />
    </g>
    {/* neck + shirt */}
    <rect x="28" y="44" width="8" height="8" fill="#f6d2b8" />
    <path d="M14 64 C16 52 24 49 32 49 C40 49 48 52 50 64 Z" fill="#ec4899" />
    {/* face */}
    <ellipse cx="32" cy="32" rx="14" ry="15" fill="#fde2cf" />
    {/* hair: top + bangs */}
    <path d="M17 32 C15 18 24 11 33 11 C42 11 49 17 47 30 C44 23 40 20 36 19 C33 23 25 25 19 26 C18 28 17 30 17 32 Z" fill="#111" />
    {/* eyes */}
    <ellipse cx="26" cy="33" rx="2" ry="2.6" fill="#1f1f1f" />
    <ellipse cx="38" cy="33" rx="2" ry="2.6" fill="#1f1f1f" />
    <circle cx="26.7" cy="32.1" r="0.7" fill="#fff" />
    <circle cx="38.7" cy="32.1" r="0.7" fill="#fff" />
    {/* blush + smile */}
    <ellipse cx="22.5" cy="38" rx="2.6" ry="1.5" fill="#f9a8d4" opacity="0.8" />
    <ellipse cx="41.5" cy="38" rx="2.6" ry="1.5" fill="#f9a8d4" opacity="0.8" />
    <path d="M28.5 39.5 Q32 43 35.5 39.5" stroke="#b4235f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (text) => {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Try again?');
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setError(e.message || 'Something went wrong. Try again?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="chat-panel w-[min(360px,calc(100vw-2.5rem))] h-[min(520px,calc(100vh-7rem))] flex flex-col rounded-2xl border border-pink-500/25 bg-[#0d1220]/95 backdrop-blur shadow-2xl shadow-pink-500/10 overflow-hidden">
          {/* header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
            <JolinAvatar size={36} sway />
            <div className="flex-1 min-w-0">
              <p className="text-slate-100 text-sm font-semibold">AI Jolin</p>
              <p className="font-mono text-[11px] text-pink-400/80">an AI version of me · may make mistakes</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-slate-200 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
            <Bubble role="assistant" content={GREETING} />

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pl-9">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs text-pink-300 border border-pink-500/30 rounded-full px-3 py-1 hover:bg-pink-500/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}

            {loading && (
              <div className="flex items-end gap-2">
                <JolinAvatar size={28} />
                <div className="bg-white/[0.05] rounded-2xl rounded-bl-sm px-3 py-2.5 flex gap-1">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {error && <p className="text-xs text-rose-400 pl-9">{error}</p>}
            <div ref={endRef} />
          </div>

          {/* input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-white/[0.07] px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              placeholder="ask me anything…"
              className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg text-pink-400 hover:bg-pink-500/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="chat-launcher group flex items-center gap-2 rounded-full border border-pink-500/40 bg-[#0d1220] pl-1 pr-4 py-1 shadow-lg shadow-pink-500/20 hover:border-pink-400 transition-colors"
        aria-label={open ? 'Close chat with AI Jolin' : 'Chat with AI Jolin'}
      >
        <JolinAvatar size={44} sway />
        <span className="font-mono text-xs text-pink-300 group-hover:text-pink-200">
          {open ? 'close' : 'chat with me'}
        </span>
      </button>
    </div>
  );
};

const Bubble = ({ role, content }) =>
  role === 'assistant' ? (
    <div className="flex items-end gap-2">
      <div className="shrink-0"><JolinAvatar size={28} /></div>
      <p className="bg-white/[0.05] text-slate-200 text-sm leading-relaxed rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%] whitespace-pre-wrap">
        {content}
      </p>
    </div>
  ) : (
    <div className="flex justify-end">
      <p className="bg-pink-500/20 text-pink-50 text-sm leading-relaxed rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%] whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );

export default ChatBot;
