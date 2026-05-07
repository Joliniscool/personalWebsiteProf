import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import './index.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);

  const handleSplashExit = () => {
    setMainVisible(true);
    setTimeout(() => setShowSplash(false), 800);
  };

  // Scroll-reveal: fire once the main site is visible
  useEffect(() => {
    if (!mainVisible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    // Small delay so elements are in DOM before we observe
    const t = setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    }, 100);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, [mainVisible]);

  return (
    <>
      {showSplash && <SplashScreen onEnter={handleSplashExit} />}
      <div
        className={`bg-[#080c18] min-h-screen transition-opacity duration-700 ${
          mainVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </div>
    </>
  );
}

export default App;
