import React, { useState, useEffect } from 'react';
import { Cloud, Sparkles, ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar({ scrollProgress = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Scrolled sticky bar activates only after passing hero section (scrollY > 700)
      if (window.scrollY > 700) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Header opacity: 0 on initial cloud view, fades in smoothly as clouds clear (scrollProgress > 0.35)
  const isVisible = scrollProgress > 0.35 || scrolled;
  const navOpacity = isVisible 
    ? (scrolled ? 1 : Math.min(1, (scrollProgress - 0.35) / 0.20)) 
    : 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black'
          : 'py-6 bg-transparent'
      }`}
      style={{
        opacity: navOpacity,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: `translateY(${isVisible ? 0 : -25}px)`
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={scrollToTop}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-105 group-hover:bg-white group-hover:text-black transition-all duration-300">
            <Cloud className="w-5 h-5 transition-colors" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-wider text-white block group-hover:tracking-widest transition-all">
              BADAL VARSHNEY
            </span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono block">
              Web Developer
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <button
            onClick={() => scrollToSection('about')}
            aria-label="Navigate to About section"
            className="hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            aria-label="Navigate to Projects section"
            className="hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection('skills')}
            aria-label="Navigate to Skills section"
            className="hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all"
          >
            Skills
          </button>

          <button
            onClick={() => scrollToSection('experience')}
            aria-label="Navigate to Experience section"
            className="hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all"
          >
            Experience
          </button>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => scrollToSection('contact')}
            className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-lg hover:shadow-white/20 flex items-center gap-2 group"
          >
            <span>Let's Connect</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-zinc-900 border border-white/10 text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 border-b border-white/10 px-6 py-6 space-y-4 backdrop-blur-2xl">
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-white font-display text-lg"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-white font-display text-lg"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection('skills')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-white font-display text-lg"
          >
            Skills
          </button>
          <button
            onClick={() => scrollToSection('experience')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-white font-display text-lg"
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider text-center block mt-4"
          >
            Let's Connect
          </button>
        </div>
      )}
    </header>
  );
}
