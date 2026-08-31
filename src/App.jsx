import React, { useState, useCallback } from 'react';
import Preloader from './components/Preloader';
import CloudCanvas from './components/CloudCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScrollProgress = useCallback((progress) => {
    setScrollProgress(progress);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* 8-Second BADAL & Cloud Preloader (Locks scroll during loading) */}
      <Preloader />

      {/* Magnetic Inverted Cursor */}
      <CustomCursor />

      {/* 3D Volumetric Cloud Flythrough Background Engine */}
      <CloudCanvas onScrollProgress={handleScrollProgress} />

      {/* Navigation Header (Appears after passing through clouds) */}
      <Navbar scrollProgress={scrollProgress} />

      {/* Main Content Sections */}
      <main className="relative z-20">
        <Hero scrollProgress={scrollProgress} />
        <About scrollProgress={scrollProgress} />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
