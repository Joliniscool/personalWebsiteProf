import { useState, useEffect, useRef } from 'react';
import JolinAvatar from './JolinAvatar';

// Each stop is a "route" on the jolin server. Answer right -> 200 OK.
const STOPS = [
  {
    route: '/about',
    section: 'about',
    intro: "first stop: my about page. i'm at UC Berkeley doing a double major. which two?",
    options: ['CS + Data Science', 'IEOR + EECS', 'Mechanical Eng + Econ', 'Bioengineering + CS'],
    answer: 1,
    hint: 'the answer is in the "who I am" bio. think optimization meets software.',
    win: "yep! industrial engineering & operations research + EECS. optimization meets software 🤝",
  },
  {
    route: '/about/fun',
    section: 'about',
    intro: "same page, side quest: which of these is NOT something i do for fun?",
    options: ['spikeball', 'escape rooms', 'skydiving', 'Identity V'],
    answer: 2,
    hint: 'look at the last paragraph of my bio. one of these is way too high up.',
    win: "correct, i stay on the ground. tennis, pickleball, the beach and art are more my speed",
  },
  {
    route: '/experience',
    section: 'experience',
    intro: 'this summer i built an AI chatbot at BuildBee. how much did it cut average response time for field teams?',
    options: ['15%', '25%', '40%', '60%'],
    answer: 3,
    hint: 'check the first bullet of my BuildBee internship.',
    win: '60%! it pulled data from 15+ construction sites instantly. that one was fun to build',
  },
  {
    route: '/projects',
    section: 'projects',
    intro: "i've built a few things. which project do i still use myself every day?",
    options: ['Ascend.AI', 'Campus WiFi Monitor', 'FocusFlow', 'this website'],
    answer: 2,
    hint: 'it\'s the SwiftUI one with a timer.',
    win: 'FocusFlow, my pomodoro app. best review it\'s gotten is that i haven\'t deleted it 🍅',
  },
  {
    route: '/skills',
    section: 'skills',
    intro: 'skills check. which of these is an assembly language i know?',
    options: ['RISC-V', 'Rust', 'Kotlin', 'Haskell'],
    answer: 0,
    hint: 'it\'s at the end of my languages list. thanks, computer architecture.',
    win: 'RISC-V! learned it in computer architecture. registers are my friends now',
  },
  {
    route: '/contact',
    section: 'contact',
    intro: "last request. what's the best way to reach me?",
    options: ['carrier pigeon', 'email', 'a DM on Identity V', 'smoke signals'],
    answer: 1,
    hint: 'it says so right under "get in touch" 📬',
    win: 'email it is: jolinwang@berkeley.edu. i\'m open to internships, so say hi!',
  },
];

const XP_FIRST_TRY = 20;
const XP_RETRY = 10;
const MAX_XP = STOPS.length * XP_FIRST_TRY;
const STORAGE_KEY = 'jolin-quest-v1';

const RANKS = [
  { min: MAX_XP, title: 'root', line: 'sudo access granted. you know me better than my LinkedIn does 🔑' },
  { min: MAX_XP * 0.7, title: 'admin', line: "admin privileges unlocked. you were paying attention!" },
  { min: 0, title: 'guest', line: 'session complete. you made it through every route!' },
];

const NEW_SESSION = { step: -1, xp: 0, missed: [], log: [] };

const loadSession = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.step === 'number') return { ...NEW_SESSION, ...saved };
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
  const [solved, setSolved] = useState(false);
  const logRef = useRef(null);
  const { step, xp, missed, log } = session;
  const stop = STOPS[step];
  const finished = step >= STOPS.length;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); } catch { /* ignore */ }
  }, [session]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  const advance = () => {
    const next = step + 1;
    setSolved(false);
    setSession((s) => ({
      ...s,
      step: next,
      missed: [],
      log: next < STOPS.length
        ? [...s.log, { kind: 'req', text: `GET ${STOPS[next].route} HTTP/1.1` }]
        : [...s.log, { kind: 'ok', text: '201 Created: friendship' }],
    }));
    if (next < STOPS.length) goTo(STOPS[next].section);
  };

  const choose = (i) => {
    if (solved || missed.includes(i)) return;
    if (i === stop.answer) {
      const gained = missed.length ? XP_RETRY : XP_FIRST_TRY;
      setSolved(true);
      setSession((s) => ({
        ...s,
        xp: s.xp + gained,
        log: [...s.log, { kind: 'ok', text: `200 OK  +${gained}xp` }],
      }));
    } else {
      setSession((s) => ({
        ...s,
        missed: [...s.missed, i],
        log: [...s.log, { kind: 'err', text: '400 Bad Request' }],
      }));
    }
  };

  const restart = () => {
    setSolved(false);
    setSession(NEW_SESSION);
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  const rank = RANKS.find((r) => xp >= r.min);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* xp bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex justify-between font-mono text-[11px] text-slate-500 mb-1.5">
          <span>routes {Math.max(0, Math.min(step, STOPS.length))}/{STOPS.length}</span>
          <span className="text-pink-300">{xp}/{MAX_XP} xp</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-400 transition-all duration-500"
            style={{ width: `${(xp / MAX_XP) * 100}%` }}
          />
        </div>
      </div>

      {/* server log */}
      <div
        ref={logRef}
        className="mx-4 h-[84px] shrink-0 overflow-y-auto rounded-lg bg-black/40 border border-white/[0.06] px-3 py-2 font-mono text-[11px] leading-5"
        aria-label="server log"
      >
        <p className="text-slate-600">jolin-server v1.0 listening on :2028</p>
        {log.map((l, i) => (
          <p
            key={i}
            className={
              l.kind === 'req' ? 'text-slate-300'
                : l.kind === 'ok' ? 'text-emerald-400 pl-3'
                  : 'text-rose-400 pl-3'
            }
          >
            {l.kind === 'req' ? '> ' : '← '}{l.text}
          </p>
        ))}
        <span className="quest-cursor text-pink-400">▍</span>
      </div>

      {/* guide */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
        {step < 0 && (
          <>
            <Say>
              welcome, client! this site is a server and i'm your guide. i'll send you to {STOPS.length} routes;
              answer each one to get a 200 OK and earn xp. ready?
            </Say>
            <div className="pl-9"><ActionButton onClick={advance}>connect →</ActionButton></div>
          </>
        )}

        {stop && (
          <>
            <Say>{stop.intro}</Say>
            <div className="grid grid-cols-2 gap-2 pl-9">
              {stop.options.map((opt, i) => {
                const wrong = missed.includes(i);
                const right = solved && i === stop.answer;
                return (
                  <button
                    key={opt}
                    onClick={() => choose(i)}
                    disabled={solved || wrong}
                    className={`text-xs text-left rounded-lg border px-3 py-2 transition-colors ${
                      right ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                        : wrong ? 'border-rose-500/30 text-rose-300/60 line-through'
                          : 'border-pink-500/25 text-slate-200 hover:bg-pink-500/10 disabled:opacity-50'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {missed.length > 0 && !solved && <Say>hmm, not quite. hint: {stop.hint}</Say>}
            {solved && (
              <>
                <Say>{stop.win}</Say>
                <div className="pl-9">
                  <ActionButton onClick={advance}>
                    {step + 1 < STOPS.length ? `GET ${STOPS[step + 1].route} →` : 'close connection →'}
                  </ActionButton>
                </div>
              </>
            )}
          </>
        )}

        {finished && (
          <>
            <div className="ml-9 rounded-xl border border-pink-500/30 bg-pink-500/[0.06] px-4 py-3 text-center">
              <p className="font-mono text-[11px] text-pink-400/80">access level</p>
              <p className="font-mono text-2xl font-bold text-pink-300">{rank.title}</p>
              <p className="font-mono text-[11px] text-slate-500 mt-1">{xp}/{MAX_XP} xp</p>
            </div>
            <Say>{rank.line} got more questions? ask the AI version of me anything.</Say>
            <div className="flex flex-wrap gap-2 pl-9">
              <ActionButton onClick={onAskJolin}>ask AI jolin →</ActionButton>
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
                replay
              </button>
            </div>
          </>
        )}
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
