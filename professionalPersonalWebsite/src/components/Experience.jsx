const EXPERIENCE = [
  {
    title: 'Undergraduate Research Assistant',
    org: 'UC Berkeley ACE Labs',
    location: 'Berkeley, CA',
    period: 'Feb 2026 – Present',
    bullets: [
      'Evaluated 10+ LLM outputs for correctness, reasoning quality, and alignment with course objectives across Berkeley CS/EECS curricula',
      'Participated in weekly research meetings to evaluate and discuss newly developed AI chatbot systems for Berkeley CS/EECS courses',
    ],
  },
  {
    title: 'Systems Analyst',
    org: 'Institute of Industrial and Systems Engineering',
    location: 'Berkeley, CA',
    period: 'Aug 2025 – Present',
    bullets: [
      'Designed structured data workflows to replace manual processes for a real estate brokerage (AZ Elite Brokers), reducing processing time by 40%',
      'Built a centralized recruiting pipeline system tracking 100+ candidates, improving efficiency by 35%',
    ],
  },
  {
    title: 'Operations Intern',
    org: 'EditPK',
    location: 'Irvine, CA',
    period: 'May 2024 – Aug 2025',
    bullets: [
      'Managed a backend database of 200+ clients and manuscripts, ensuring data accuracy and operational continuity for non-native English speakers in publishing',
      'Recruited and led a 5-person freelance editing team, reducing revision cycles by 25% through structured workflow and quality control',
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl" data-reveal>
        <p className="font-mono text-pink-400 text-xs tracking-widest mb-3">// 02 experience</p>
        <h2 className="text-4xl font-bold text-slate-100 mb-16">Where I've worked</h2>

        <div className="relative">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-white/[0.07]" />

          <div className="space-y-14">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="pl-8 relative">
                <div className="absolute left-[-4px] top-[7px] w-2 h-2 rounded-full bg-pink-500 ring-4 ring-[#080c18]" />

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <h3 className="text-[17px] font-semibold text-slate-100">{exp.title}</h3>
                  <span className="font-mono text-xs text-slate-600 shrink-0">{exp.period}</span>
                </div>

                <p className="text-pink-400 text-sm mb-5">
                  {exp.org} &middot; {exp.location}
                </p>

                <ul className="space-y-3">
                  {exp.bullets.map((b, j) => (
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
      </div>
    </section>
  );
};

export default Experience;
