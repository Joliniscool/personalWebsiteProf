import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import JolinAvatar from './JolinAvatar';
import Quest from './Quest';
import { localAnswer, OFFLINE_REPLY } from './jolinFaq';

const GREETING = "hi! i'm AI jolin — ask me about my projects, research, classes, or what i do for fun ✨";

// Cap real API calls per visit; after that, offline answers only
const MAX_AI_CALLS = 15;

const SUGGESTIONS = [
  'What are you working on right now?',
  'Tell me about Ascend.AI',
  'What do you do for fun?',
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('quest');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const aiCalls = useRef(0);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open && tab === 'chat') inputRef.current?.focus();
  }, [open, tab]);

  const send = async (text) => {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    const reply = (text) => setMessages([...next, { role: 'assistant', content: text }]);

    // Common questions are answered instantly, no API tokens needed
    const quick = localAnswer(content, { quick: true });
    if (quick || aiCalls.current >= MAX_AI_CALLS) {
      reply(quick || localAnswer(content) || OFFLINE_REPLY);
      return;
    }

    setLoading(true);
    aiCalls.current += 1;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(data.error);
      reply(data.reply);
    } catch {
      // API down, out of credits, or rate limited: fall back to offline answers
      reply(localAnswer(content) || OFFLINE_REPLY);
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
              <p className="font-mono text-[11px] text-pink-400/80">
                {tab === 'quest' ? 'your guide to this site' : 'an AI version of me · may make mistakes'}
              </p>
            </div>
            <div className="flex rounded-full border border-white/[0.08] p-0.5 font-mono text-[11px]" role="tablist">
              {['quest', 'chat'].map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    tab === t ? 'bg-pink-500/20 text-pink-200' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-slate-200 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {tab === 'quest' && <Quest onAskJolin={(q) => { setTab('chat'); if (q) send(q); }} />}

          {tab === 'chat' && <>
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
          </>}
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
          {open ? 'close' : 'explore with me'}
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
