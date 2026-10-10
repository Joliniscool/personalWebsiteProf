const EXPERIENCE = [
  {
    title: 'Software Engineer Intern',
    org: 'BuildBee',
    location: 'Berkeley, CA',
    period: 'May 2026 – Aug 2026',
    bullets: [
      'Built an AI-powered chatbot using the Anthropic API and Node.js, cutting average response time by 60% for field teams',
      'Integrated the chatbot with internal project databases, enabling instant data retrieval across 15+ active construction sites',
      'Designed AI integrations closely with the engineering and QA team, improving data accessibility for 20+ field and office staff',
    ],
  },
  {
    title: 'Undergraduate Research Apprentice',
    org: 'Undergraduate Research Apprentice Program (URAP)',
    location: 'Berkeley, CA',
    period: 'Aug 2026 – Present',
    bullets: [
      "Designed and built a website using React and Node.js/Flask to showcase an archaeology professor's research findings and publications",
      'Collaborated directly with faculty to translate academic research into an accessible, public-facing web platform',
    ],
  },
  {
    title: 'Undergraduate Research Assistant',
    org: 'UC Berkeley ACE Labs',
    location: 'Berkeley, CA',
    period: 'Feb 2026 – Present',
    bullets: [
      'Curated a 500+ case dataset and fine-tuned an LLM in Python to detect the necessity of MRI/CT scans in ER triage',
      'Evaluated 10+ LLM outputs weekly for correctness, reasoning quality, and alignment with Berkeley CS course objectives',
      'Discussed newly developed AI chatbot systems weekly with an 8-person research team supporting Berkeley CS/EECS courses',
    ],
  },
  {
    title: 'Process & Data Analyst',
    org: 'Institute of Industrial and Systems Engineering',
    location: 'Berkeley, CA',
    period: 'Aug 2025 – Present',
    bullets: [
      'Redesigned a manual client-processing workflow into a structured SQL-based system, cutting processing time by 10+ hours weekly',
      'Automated a manual data pipeline with custom Python scripts, reducing operations turnaround time by 40%',
      'Built and maintained a SQL-based pipeline tracking 100+ candidates end-to-end, improving throughput efficiency by 35%',
    ],
  },
  {
    title: 'Software Engineering & Data Operations Intern',
    org: 'EditPK',
    location: 'Irvine, CA',
    period: 'May 2024 – Aug 2025',
    bullets: [
      'Managed a PostgreSQL backend database of 200+ clients and manuscripts, ensuring data accuracy and continuity',
      "Maintained EditPK's React frontend and contributed to a new site build for parent company Elxigen",
      'Recruited and led a 5-person freelance editing team, reducing revision cycles by 25% through structured workflow',
    ],
  },
  {
    title: 'Teaching Intern',
    org: 'UC Berkeley – CS10: The Beauty and Joy of Computing',
    location: 'Berkeley, CA',
    period: 'Aug 2026 – Present',
    bullets: [
      'Hold 3–4 hours of weekly office hours, supporting 50+ students via the OH queue with Python and coding debugging',
      'Lead 3+ lab sections weekly, guiding students through hands-on programming exercises to reinforce core CS concepts',
      'Help students build foundational Python and computational thinking skills through 1-on-1 instruction',
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
