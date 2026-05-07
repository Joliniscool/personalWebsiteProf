import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'projects', label: 'projects' },
  { id: 'skills', label: 'skills' },
  { id: 'contact', label: 'contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which section is in view
  useEffect(() => {
    const sections = ['home', ...NAV_LINKS.map((l) => l.id)];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#080c18]/95 backdrop-blur-sm border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <button
          onClick={() => scroll('home')}
          className="font-mono font-bold text-pink-400 text-lg tracking-tight hover:text-pink-300 transition-colors"
        >
          jw._
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scroll(id)}
              className={`font-mono text-sm transition-colors ${
                active === id
                  ? 'text-pink-400'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              {active === id ? `// ${label}` : label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-400 hover:text-slate-100 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#080c18]/98 border-t border-white/5 px-6 py-4 space-y-1">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scroll(id)}
              className={`block w-full text-left font-mono text-sm py-2 transition-colors ${
                active === id ? 'text-pink-400' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {active === id ? `// ${label}` : label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
