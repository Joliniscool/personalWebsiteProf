const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const ExternalLinkIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const PROJECTS = [
  {
    title: 'PlexAscend',
    period: 'Jan 2026 – Present',
    stack: ['Next.js', 'Python', 'Flask', 'OpenAI API', 'MongoDB'],
    bullets: [
      'AI-powered nutrition tracking platform with photo-based meal recognition — snap a photo and get instant macro breakdowns',
      'GPT-integrated coaching system provides personalized feedback and motivation based on user progress and goals',
      'Full-stack app with a Next.js frontend, Python/Flask API, and MongoDB for user data and meal history',
    ],
    link: 'https://plexascend.com',
    github: 'https://github.com/joliniscool',
  },
  {
    title: 'Campus WiFi Monitor',
    period: 'Jan 2026 – Present',
    stack: ['React', 'Express.js', 'Material UI', 'Leaflet.js', 'SQLite'],
    bullets: [
      'WiFi monitoring dashboard for UC Berkeley — users submit, store, and visualize real-time signal strength data across campus',
      'Interactive campus map built with Leaflet.js displaying live WiFi readings by location',
      'SQLite backend via an Express.js REST API handles all data ingestion and retrieval',
    ],
    github: 'https://github.com/joliniscool',
  },
  {
    title: 'FocusFlow',
    period: 'May 2025 – Aug 2025',
    stack: ['SwiftUI', 'Xcode'],
    bullets: [
      'iOS productivity app built around the Pomodoro technique with customizable focus and break intervals',
      "State management done with SwiftUI reactive data flow — timers, session logs, and UI all stay in sync",
      "Built it to use myself; the fact that I still do is probably the best review it's gotten",
    ],
    github: 'https://github.com/joliniscool',
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-28 px-6 md:px-12 lg:px-24 bg-[#0d1220]">
      <div className="max-w-4xl" data-reveal>
        <p className="font-mono text-pink-400 text-xs tracking-widest mb-3">// 03 projects</p>
        <h2 className="text-4xl font-bold text-slate-100 mb-16">Things I've built</h2>

        <div className="space-y-6">
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-8 hover:border-pink-500/25 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-slate-100">{p.title}</h3>
                <div className="flex items-center gap-4 shrink-0 mt-0.5">
                  <span className="font-mono text-xs text-slate-600">{p.period}</span>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-pink-400 transition-colors"
                      aria-label="Live site"
                    >
                      <ExternalLinkIcon size={16} />
                    </a>
                  )}
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-300 transition-colors"
                    aria-label="GitHub"
                  >
                    <GithubIcon size={16} />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {p.stack.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <ul className="space-y-3">
                {p.bullets.map((b, j) => (
                  <li key={j} className="text-slate-400 text-sm leading-relaxed flex gap-3">
                    <span className="text-pink-700 mt-[3px] shrink-0">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
