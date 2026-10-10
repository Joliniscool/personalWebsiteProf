import { useState, useEffect } from 'react';
import { Mail, ArrowDown } from 'lucide-react';
import NetworkBackground from './NetworkBackground';
import PixelGame from './PixelGame';

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ROLES = ['AI researcher', 'systems designer', 'full-stack developer', 'optimizer'];

const useTyping = () => {
  const [displayed, setDisplayed] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const role = ROLES[roleIdx];
    const speed = isDeleting ? 45 : 90;

    const t = setTimeout(() => {
      if (!isDeleting) {
        const next = role.slice(0, displayed.length + 1);
        setDisplayed(next);
        if (next === role) {
          setPaused(true);
          setTimeout(() => { setPaused(false); setIsDeleting(true); }, 1800);
        }
      } else {
        const next = role.slice(0, displayed.length - 1);
        setDisplayed(next);
        if (next === '') {
          setIsDeleting(false);
          setRoleIdx((i) => (i + 1) % ROLES.length);
        }
      }
    }, speed);

    return () => clearTimeout(t);
  }, [displayed, isDeleting, paused, roleIdx]);

  return displayed;
};

const NAME = 'Jolin Wang';
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\[]{}#$%&*+=';

// Decodes the name from random glyphs, left to right
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const useScramble = (text) => {
  const [chars, setChars] = useState(() => {
    const done = prefersReducedMotion();
    return text.split('').map((c) => ({ c, done }));
  });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      const revealed = Math.floor(frame / 3);
      setChars(text.split('').map((c, i) => {
        if (i < revealed || c === ' ') return { c, done: true };
        return { c: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], done: false };
      }));
      if (revealed >= text.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [text]);

  return chars;
};

const Hero = () => {
  const typedRole = useTyping();
  const nameChars = useScramble(NAME);
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-16 overflow-hidden">
      <NetworkBackground />

      <div className="relative z-10 max-w-2xl">
        <p className="font-mono text-pink-400 text-sm tracking-widest mb-6">hi, i'm</p>

        <h1 className="hero-name text-5xl sm:text-6xl md:text-7xl font-black leading-none mb-5" aria-label={NAME}>
          {nameChars.map(({ c, done }, i) => (
            <span key={i} aria-hidden="true" className={done ? undefined : 'scrambling'}>{c}</span>
          ))}
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 font-light mb-3">
          IEOR + EECS @ UC Berkeley &mdash; class of '28
        </p>

        <p className="font-mono text-pink-400 text-base mb-8 h-6">
          {typedRole}
          <span className="animate-pulse">|</span>
        </p>

        <p className="text-slate-300 text-lg leading-relaxed max-w-xl mb-12">
          I study industrial engineering and computer science, fine-tune LLMs at ACE Labs,
          teach Python in CS10, and build AI-powered products — most recently an Anthropic-powered
          chatbot at BuildBee. Most interested in AI systems, optimization, and full-stack development.
        </p>

        <div className="flex flex-wrap items-center gap-6 mb-20">
          <a
            href="mailto:jolinwang@berkeley.edu"
            className="flex items-center gap-2 font-mono text-sm text-pink-400 hover:text-pink-300 transition-colors"
          >
            <Mail size={15} />
            jolinwang@berkeley.edu
          </a>
          <a
            href="https://github.com/joliniscool"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-200 transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon size={20} />
          </a>
          <a
            href="https://linkedin.com/in/jolintwang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-200 transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={20} />
          </a>
        </div>

        <button
          onClick={() => scroll('about')}
          className="flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          <ArrowDown size={14} />
          scroll down
        </button>

        <PixelGame />
      </div>
    </section>
  );
};

export default Hero;
