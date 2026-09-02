import React from 'react';
import { Cloud, Zap, ShieldCheck, Terminal, Compass, Eye, Sparkles } from 'lucide-react';
import GlassWallRainDrip from './GlassWallRainDrip';

export default function About({ scrollProgress = 1 }) {
  // Reveal About section smoothly after BADAL VARSHNEY name shatter flythrough completes (progress >= 0.78)
  let aboutOpacity = 1;
  let aboutTranslateY = 0;

  if (scrollProgress < 0.78) {
    aboutOpacity = 0;
    aboutTranslateY = 50;
  } else if (scrollProgress >= 0.78 && scrollProgress <= 0.92) {
    const p = (scrollProgress - 0.78) / 0.14;
    const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);
    aboutOpacity = smoothP;
    aboutTranslateY = 50 * (1 - smoothP);
  } else {
    aboutOpacity = 1;
    aboutTranslateY = 0;
  }

  return (
    <section
      id="about"
      className="relative py-32 px-6 md:px-12 section-dimming-1 z-20 overflow-hidden section-divider transition-all duration-150 ease-out"
      style={{
        opacity: aboutOpacity,
        transform: `translateY(${aboutTranslateY}px)`,
        pointerEvents: aboutOpacity > 0.3 ? 'auto' : 'none'
      }}
    >
      {/* 3D Rounded Glass Bevel Edge & Refraction Trim */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/15 via-white/5 to-transparent border-t border-white/35 rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.5),0_-8px_25px_rgba(0,0,0,0.5)] z-30 pointer-events-none"></div>

      {/* Luminous Specular Glass Top Highlight Line */}
      <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-35 pointer-events-none shadow-[0_0_12px_rgba(255,255,255,0.5)]"></div>

      {/* Background Subtle Grid & Light Glow */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-white/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Glass Wall Rain Drip Engine */}
      <GlassWallRainDrip density="full" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 bg-zinc-900 border border-white/10 px-3 py-1 rounded-full rain-target-element">
              <Compass className="w-3.5 h-3.5 text-white" />
              <span>01 // About Badal Varshney</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase">
              Derived from Clouds, <br />
              <span className="text-zinc-500">Built with Precision.</span>
            </h2>
          </div>

          <p className="text-zinc-400 text-base max-w-md leading-relaxed font-light">
            Like clouds taking infinite creative forms, Badal Varshney transforms complex web technologies into seamless, ultra-fast, and visually striking digital experiences.
          </p>
        </div>

        {/* Badal Varshney 3 Core Expertise Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

          {/* Card 1 */}
          <div
            className="glass-card glass-panel w-full h-auto p-8 rounded-3xl glass-panel-hover group relative overflow-hidden"
            style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/15 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              Lightning Fast Speed
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Badal builds web apps prioritizing minimal bundle sizes, optimized DOM rendering, lazy loading, and smooth 60+ FPS frame rates.
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Performance Goal</span>
              <span className="text-white font-bold">100 / 100 Speed</span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="glass-card glass-panel w-full h-auto p-8 rounded-3xl glass-panel-hover group relative overflow-hidden"
            style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/15 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              3D WebGL & Motion Art
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Specialized in crafting immersive 3D cloud portals, Three.js canvas engines, GSAP scroll triggers, and fluid micro-interactions.
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Visual Superpower</span>
              <span className="text-white font-bold">Three.js + GSAP 3</span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="glass-card glass-panel w-full h-auto p-8 rounded-3xl glass-panel-hover group relative overflow-hidden"
            style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/15 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              Clean React Architecture
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Structuring robust React 18 & Next.js platforms with clean modular component libraries, clear state management, and scalability.
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Development Standard</span>
              <span className="text-white font-bold">Production Ready</span>
            </div>
          </div>

        </div>

        {/* Interactive Code Window / Developer Bio */}
        <div
          className="glass-card glass-panel w-full h-auto p-8 md:p-12 rounded-3xl border border-white/15 relative overflow-hidden"
          style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-white" />
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">developer.config.json</span>
              </div>

              <h3 className="font-display text-3xl font-bold text-white leading-tight">
                Hi, I'm <span className="text-zinc-300">Badal</span> 👋
              </h3>

              <p className="text-zinc-200 text-sm md:text-base leading-relaxed font-light">
                Hi, I’m <strong className="text-white font-semibold">Badal</strong>, a <strong className="text-white font-semibold">Frontend Developer</strong> specializing in building modern, responsive web applications. I have a strong focus on creating clean, scalable UI designs and delivering consistent user experiences.
              </p>

              <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-light">
                I’m passionate about writing efficient code and continuously improving the usability and performance of web interfaces.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  ⚡ React & Next.js
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  🎨 Responsive UI/UX
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  🚀 High Performance
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  💻 Clean Scalable Code
                </span>
              </div>
            </div>

            {/* Simulated Code Terminal */}
            <div className="bg-black/90 rounded-2xl border border-white/10 p-6 font-mono text-xs text-zinc-300 shadow-2xl relative">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <span className="ml-auto text-[10px] text-zinc-500">BadalFrontendDeveloper.js</span>
              </div>

              <pre className="space-y-1.5 text-zinc-400 overflow-x-auto leading-relaxed">
                <div><span className="text-zinc-600">// Developer Profile Matrix</span></div>
                <div><span className="text-white font-bold">const</span> developer = &#123;</div>
                <div className="pl-4">name: <span className="text-white">"Badal"</span>,</div>
                <div className="pl-4">role: <span className="text-white">"Frontend Developer"</span>,</div>
                <div className="pl-4">focus: <span className="text-white">"Clean, scalable UI & modern web apps"</span>,</div>
                <div className="pl-4">passion: <span className="text-white font-semibold">"Efficient code & high usability"</span>,</div>
                <div className="pl-4">status: <span className="text-emerald-400">"Ready for new web opportunities"</span></div>
                <div>&#125;;</div>
                <div className="pt-2"><span className="text-white font-bold">function</span> buildResponsiveWeb() &#123;</div>
                <div className="pl-4"><span className="text-zinc-500">return</span> developer.focus + <span className="text-white">" + "</span> + developer.passion;</div>
                <div>&#125;</div>
              </pre>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
