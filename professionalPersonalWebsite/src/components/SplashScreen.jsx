import { useState, useEffect } from 'react';

const LINES = [
  { prompt: '$', text: 'initializing portfolio.exe...' },
  { prompt: '>', text: 'name: ', highlight: 'Jolin Wang' },
  { prompt: '>', text: 'degree: ', plain: 'IEOR + EECS @ UC Berkeley' },
  { prompt: '>', text: 'focus: ', warning: 'AI · Data Systems · Full-Stack Dev' },
  { prompt: '>', text: 'status: ', success: 'open to internship opportunities ✓' },
];

const FLOAT_SNIPPETS = [
  'const solve = (x) => x ** 2;',
  'import numpy as np',
  'SELECT * FROM projects;',
  'git commit -m "ship it"',
  'while (learning) { grow(); }',
  'export default Portfolio;',
  '01001010 01010111',
  'npm run build',
  '<Component />',
  'def optimize(model):',
  '{ "status": "ready" }',
  'git push origin main',
];

const SplashScreen = ({ onEnter }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [showReady, setShowReady] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    LINES.forEach((_, i) => {
      setTimeout(() => setVisibleLines((v) => Math.max(v, i + 1)), 400 + i * 650);
    });
    const loadingStart = 400 + LINES.length * 650;
    setTimeout(() => setShowLoading(true), loadingStart);
    setTimeout(() => setShowReady(true), loadingStart + 1100);
    setTimeout(() => setShowButton(true), loadingStart + 1300);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 700);
  };

  return (
    <div className={`splash-screen${exiting ? ' splash-exit' : ''}`}>
      <div className="splash-grid" />

      {FLOAT_SNIPPETS.map((snippet, i) => (
        <div
          key={i}
          className="splash-float"
          style={{
            left: `${(i * 8.7 + 2) % 95}%`,
            animationDelay: `${(i * 1.4) % 9}s`,
            animationDuration: `${11 + (i % 5) * 2.5}s`,
          }}
        >
          {snippet}
        </div>
      ))}

      <div className="splash-content">
        <div className="splash-name">
          JOLIN WANG<span className="splash-cursor">_</span>
        </div>
        <div className="splash-subtitle">
          SOFTWARE ENGINEER · AI RESEARCHER · BUILDER
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
            <span className="terminal-title">portfolio.exe — bash — 80×24</span>
          </div>
          <div className="terminal-body">
            {LINES.map((line, i) => (
              <div key={i} className={`terminal-line${visibleLines > i ? ' visible' : ''}`}>
                <span className="terminal-prompt">{line.prompt}</span>
                <span className="terminal-text">
                  {line.text}
                  {line.highlight && <span className="terminal-highlight">{line.highlight}</span>}
                  {line.plain && <span>{line.plain}</span>}
                  {line.warning && <span className="terminal-warning">{line.warning}</span>}
                  {line.success && <span className="terminal-success">{line.success}</span>}
                </span>
              </div>
            ))}

            {showLoading && (
              <div className="terminal-line visible">
                <span className="terminal-prompt">{'>'}</span>
                <span className="terminal-text">
                  {'loading '}
                  <span className="loading-bar-fill">████████████████████</span>
                  {'  '}
                  <span className="terminal-success">100%</span>
                </span>
              </div>
            )}

            {showReady && (
              <div className="terminal-line visible">
                <span className="terminal-prompt">$</span>
                <span className="terminal-text terminal-success">
                  {'system ready. '}
                  <span className="blink-cursor">▋</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          className={`splash-enter-btn${showButton ? ' btn-visible' : ''}`}
          onClick={handleEnter}
        >
          <span>// CHECK OUT MORE</span>
          <span className="btn-arrow"> ▶</span>
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
