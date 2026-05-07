const SKILLS = {
  Languages: ['Python', 'JavaScript', 'SQL', 'Java', 'HTML/CSS', 'SwiftUI', 'Pyomo', 'AMPL'],
  Frameworks: ['React', 'Node.js', 'Flask', 'FastAPI', 'Material-UI', 'JUnit', 'WordPress'],
  Tools: ['GitHub', 'Google Cloud Platform', 'VS Code', 'IntelliJ', 'Visual Studio', 'DataHub'],
  Libraries: ['pandas', 'NumPy', 'Matplotlib'],
};

const Skills = () => {
  return (
    <section id="skills" className="py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl" data-reveal>
        <p className="font-mono text-pink-400 text-xs tracking-widest mb-3">// 04 skills</p>
        <h2 className="text-4xl font-bold text-slate-100 mb-16">What I work with</h2>

        <div className="grid sm:grid-cols-2 gap-12">
          {Object.entries(SKILLS).map(([category, items]) => (
            <div key={category}>
              <p className="font-mono text-xs text-slate-600 tracking-widest uppercase mb-4">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-slate-300 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-lg hover:border-pink-500/30 hover:text-slate-100 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
