const COURSEWORK = [
  'Computer Architecture',
  'Structure & Interpretation of Computer Programs',
  'Data Structures',
  'Optimization Modeling',
  'Linear Programming',
  'Discrete Math & Probability',
  'Business Statistics',
  'Signal & Info Processing',
  'Linear Algebra & ODEs',
];

const ACTIVITIES = [
  'PlexTech',
  'Society of Women Engineers',
  'GBO Orientation Leader',
  'Institute of Industrial & Systems Engineers',
];

// To add an image: replace the placeholder div with:
// <img src="/your-image.jpg" alt="description" className="w-full h-full object-cover" />

const ImageSlot = ({ label }) => (
  <div className="relative rounded-xl border border-dashed border-pink-500/25 bg-white/[0.02] overflow-hidden group hover:border-pink-500/50 transition-colors aspect-[4/5]">
    {/* ↓ Replace this entire div with your <img> tag */}
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div className="w-9 h-9 rounded-full border border-pink-500/25 flex items-center justify-center group-hover:border-pink-500/50 transition-colors">
        <span className="text-pink-500/40 text-xl leading-none group-hover:text-pink-500/70 transition-colors">+</span>
      </div>
      <p className="font-mono text-xs text-slate-700 group-hover:text-slate-600 transition-colors">{label}</p>
    </div>
  </div>
);

const About = () => {
  return (
    <section id="about" className="py-28 px-6 md:px-12 lg:px-24 bg-[#0d1220]">
      <div className="max-w-4xl" data-reveal>
        <p className="font-mono text-pink-400 text-xs tracking-widest mb-3">// 01 about</p>
        <h2 className="text-4xl font-bold text-slate-100 mb-14">Who I am</h2>

        {/* Bio + images */}
        <div className="grid md:grid-cols-5 gap-10 items-start mb-10">
          <div className="md:col-span-3 space-y-5 text-slate-300 leading-relaxed text-[15px]">
            <p>
              I'm at UC Berkeley double-majoring in Industrial Engineering & Operations
              Research and Electrical Engineering & Computer Science. The combo isn't
              accidental — I'm drawn to problems where optimization meets software.
            </p>
            <p>
              This summer I built an AI chatbot with the Anthropic API at BuildBee. Right now
              I'm fine-tuning LLMs for ER triage at ACE Labs, building a research website for
              an archaeology professor through URAP, building data pipelines at IISE, and
              teaching Python as a CS10 intern.
            </p>
            <p>
              I'm interested in building — software, tools, products, and things that don't
              fit neatly into one category. Outside of CS I do art and editing, play tennis,
              pickleball, and spikeball, and I'm always down for the beach, an escape room,
              or a round of Identity V.
            </p>
          </div>

          {/* Art image placeholders */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            <ImageSlot label="artwork" />
            <ImageSlot label="artwork" />
          </div>
        </div>

        {/* Education + coursework */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6">
            <p className="font-mono text-pink-400 text-xs tracking-wider mb-4">education</p>
            <p className="text-slate-100 font-semibold text-[15px]">UC Berkeley</p>
            <p className="text-slate-400 text-sm mt-1">BS Industrial Engineering & Operations Research</p>
            <p className="text-slate-400 text-sm">BS Electrical Engineering & Computer Science</p>
            <p className="text-slate-600 text-sm mt-3 font-mono">Expected May 2028</p>

            <p className="font-mono text-pink-400 text-xs tracking-wider mt-6 mb-3">activities</p>
            <ul className="space-y-1">
              {ACTIVITIES.map((a) => (
                <li key={a} className="text-slate-400 text-sm">{a}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6">
            <p className="font-mono text-pink-400 text-xs tracking-wider mb-4">coursework</p>
            <div className="flex flex-wrap gap-2">
              {COURSEWORK.map((c) => (
                <span key={c} className="text-xs text-slate-400 bg-white/[0.05] px-2.5 py-1 rounded-md">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
