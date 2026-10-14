import { useState, useEffect, useRef } from 'react';
import JolinAvatar from './JolinAvatar';

// Each stop is a "route" on the jolin server. The visitor picks where to go next.
const STOPS = [
  {
    route: '/about',
    section: 'about',
    pick: 'who you are',
    tour: "i'm at UC Berkeley double-majoring in IEOR + EECS, graduating May 2028. the combo is on purpose: i love problems where optimization meets software.",
    deeper: 'What classes have you taken?',
  },
  {
    route: '/experience',
    section: 'experience',
    pick: "where you've worked",
    tour: "this summer i built an AI chatbot at BuildBee that cut response time 60%. right now i'm doing LLM research at ACE Labs, building a site through URAP, running data pipelines at IISE, and teaching CS10.",
    deeper: 'What do you do at ACE Labs?',
  },
  {
    route: '/projects',
    section: 'projects',
    pick: "what you've built",
    tour: 'Ascend.AI is an AI nutrition coach 50+ club members use daily, Campus WiFi Monitor maps live signal across campus, and FocusFlow is the pomodoro app i still use every day 🍅',
    deeper: 'Tell me more about Ascend.AI',
  },
  {
    route: '/skills',
    section: 'skills',
    pick: 'your tech stack',
    tour: "mostly Python and JavaScript/TypeScript with React, Node and Flask. i also do SQL + pandas for data, Pyomo/AMPL for optimization, and yes, RISC-V from computer architecture.",
    deeper: "Which project uses the most of your stack?",
  },
  {
    route: '/about/fun',
    section: 'about',
    pick: 'what you do for fun',
    tour: "tennis, pickleball and spikeball, art and editing, the beach, escape rooms, and way too much Identity V ✨",
    deeper: "How did you build this website?",
  },
  {
    route: '/contact',
    section: 'contact',
    pick: 'how to reach you',
    tour: "i'm open to internships! email is best: jolinwang@berkeley.edu. there's also a form right here and links to my LinkedIn and GitHub.",
    deeper: 'Are you open to internships?',
  },
];

const STORAGE_KEY = 'jolin-guide-v1';
const NEW_SESSION = { visited: [], log: [] };

const loadSession = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.visited) && Array.isArray(saved.log)) return saved;
  } catch {
    // storage blocked or corrupt: start fresh
  }
  return NEW_SESSION;
};

const goTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.remove('quest-target');
  void el.offsetWidth; // restart the highlight animation
  el.classList.add('quest-target');
};

const Quest = ({ onAskJolin }) => {
  const [session, setSession] = useState(loadSession);
  const logRef = useRef(null);
  const endRef = useRef(null);
  const { visited, log } = session;
  const current = STOPS.find((s) => s.route === visited[visited.length - 1]);
  const remaining = STOPS.filter((s) => !visited.includes(s.route));
  const finished = remaining.length === 0;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); } catch { /* ignore */ }
  }, [session]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [log]);

  const visit = (stop) => {
    const done = visited.length + 1 === STOPS.length;
    setSession((s) => ({
      visited: [...s.visited, stop.route],
      log: [
        ...s.log,
        { kind: 'req', text: `GET ${stop.route} HTTP/1.1` },
        { kind: 'ok', text: '200 OK' },
        ...(done ? [{ kind: 'ok', text: '201 Created: friendship' }] : []),
      ],
    }));
    goTo(stop.section);
  };

  const restart = () => {
    setSession(NEW_SESSION);
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* progress */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex justify-between font-mono text-[11px] text-slate-500 mb-1.5">
          <span>routes explored</span>
          <span className="text-pink-300">{visited.length}/{STOPS.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-400 transition-all duration-500"
            style={{ width: `${(visited.length / STOPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* server log */}
      <div
        ref={logRef}
        className="mx-4 h-[72px] shrink-0 overflow-y-auto rounded-lg bg-black/40 border border-white/[0.06] px-3 py-2 font-mono text-[11px] leading-5"
        aria-label="server log"
      >
        <p className="text-slate-600">jolin-server v1.0 listening on :2028</p>
        {log.map((l, i) => (
          <p key={i} className={l.kind === 'req' ? 'text-slate-300' : 'text-emerald-400 pl-3'}>
            {l.kind === 'req' ? '> ' : '← '}{l.text}
          </p>
        ))}
        <span className="quest-cursor text-pink-400">▍</span>
      </div>

      {/* guide */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
        {!current && (
          <Say>
            hi, welcome to my server! i'm your guide. pick what you want to learn about me first and
            i'll take you there.
          </Say>
        )}

        {current && (
          <>
            <Say>{current.tour}</Say>
            <div className="pl-9">
              <button
                onClick={() => onAskJolin(current.deeper)}
                className="text-xs font-mono text-slate-400 hover:text-pink-300 transition-colors"
              >
                ↳ ask me: “{current.deeper}”
              </button>
            </div>
          </>
        )}

        {!finished && (
          <>
            {current && <Say>what do you want to learn about next?</Say>}
            <div className="flex flex-wrap gap-2 pl-9">
              {remaining.map((stop) => (
                <button
                  key={stop.route}
                  onClick={() => visit(stop)}
                  className="text-xs text-left rounded-full border border-pink-500/30 px-3 py-1.5 text-pink-200 hover:bg-pink-500/10 transition-colors"
                >
                  <span className="font-mono text-pink-400/70">GET {stop.route}</span> · {stop.pick}
                </button>
              ))}
            </div>
          </>
        )}

        {finished && (
          <>
            <div className="ml-9 rounded-xl border border-pink-500/30 bg-pink-500/[0.06] px-4 py-3 text-center">
              <p className="font-mono text-[11px] text-pink-400/80">status</p>
              <p className="font-mono text-xl font-bold text-pink-300">fully explored 🔑</p>
            </div>
            <Say>
              that's every route! thanks for exploring. got something specific you're curious about?
              ask the AI version of me anything.
            </Say>
            <div className="flex flex-wrap gap-2 pl-9">
              <ActionButton onClick={() => onAskJolin()}>ask AI jolin →</ActionButton>
              <a
                href="mailto:jolinwang@berkeley.edu"
                className="text-xs font-mono text-pink-300 border border-pink-500/30 rounded-full px-3 py-1.5 hover:bg-pink-500/10 transition-colors"
              >
                email me
              </a>
              <button
                onClick={restart}
                className="text-xs font-mono text-slate-500 hover:text-slate-300 px-2 py-1.5 transition-colors"
              >
                start over
              </button>
            </div>
          </>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

const Say = ({ children }) => (
  <div className="flex items-end gap-2">
    <div className="shrink-0"><JolinAvatar size={28} /></div>
    <p className="bg-white/[0.05] text-slate-200 text-sm leading-relaxed rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]">
      {children}
    </p>
  </div>
);

const ActionButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-xs font-mono text-pink-200 bg-pink-500/20 border border-pink-500/40 rounded-full px-3 py-1.5 hover:bg-pink-500/30 transition-colors"
  >
    {children}
  </button>
);

export default Quest;
