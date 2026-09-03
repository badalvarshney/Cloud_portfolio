import React from 'react';
import { Cloud, ArrowUp } from 'lucide-react';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative py-12 px-6 md:px-12 bg-black/95 text-zinc-400 text-xs z-20 section-divider">
      {/* Luminous Specular Glass Top Highlight Line for Rain Splash */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none shadow-[0_0_12px_rgba(255,255,255,0.4)]"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
            ☁️
          </div>
          <div>
            <span className="font-display font-bold text-white text-sm tracking-wider">BADAL VARSHNEY</span>
            <span className="block text-[10px] text-zinc-500 font-mono">Web Developer Portfolio</span>
          </div>
        </div>

        {/* Tagline */}
        <div className="font-mono text-center md:text-left text-zinc-500">
          © {new Date().getFullYear()} BADAL VARSHNEY. Designed & Built with React, Three.js & GSAP.
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="px-4 py-2 rounded-full glass-panel border border-white/15 text-white hover:bg-white hover:text-black transition-all flex items-center gap-2 font-mono uppercase text-[11px] group"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
        </button>

      </div>
    </footer>
  );
}

export default React.memo(Footer);
