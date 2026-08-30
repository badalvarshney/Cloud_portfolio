import React from 'react';
import { Cloud, Zap, ShieldCheck, Terminal, Compass, Eye, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="relative py-32 px-6 md:px-12 section-dimming-1 z-20 overflow-hidden section-divider">
      {/* Background Subtle Grid & Light Glow */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-white/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 bg-zinc-900 border border-white/10 px-3 py-1 rounded-full">
              <Compass className="w-3.5 h-3.5 text-white" />
              <span>01 // About Badal Varshney</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase">
              Derived from Clouds, <br />
              <span className="text-zinc-500">Built with Precision.</span>
            </h2>
          </div>

          <p className="text-zinc-400 text-base max-w-md leading-relaxed font-light">
            Like clouds taking infinite creative forms, I sculpt raw web technologies into seamless, fast, and visually striking digital experiences.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-3xl glass-panel-hover group relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/15 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              Lightning Fast Performance
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Prioritizing minimal bundle sizes, optimized DOM rendering, lazy asset loading, and smooth 60+ FPS animation frame rates.
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Lighthouse Score</span>
              <span className="text-white font-bold">100 / 100</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-3xl glass-panel-hover group relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/15 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              GSAP & Motion Dynamics
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Crafting immersive scroll triggers, volumetric fly-throughs, magnetic micro-interactions, and cinematic motion graphics.
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Animation Engine</span>
              <span className="text-white font-bold">GSAP 3 + Motion</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-3xl glass-panel-hover group relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/15 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              Clean Architecture
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Structuring robust React/Next.js codebases with reusable modular component libraries, clear state management, and scalability.
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Code Standard</span>
              <span className="text-white font-bold">Production Ready</span>
            </div>
          </div>

        </div>

        {/* Interactive Code Window / Developer Bio */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/15 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-white" />
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">developer.config.json</span>
              </div>
              
              <h3 className="font-display text-3xl font-bold text-white leading-tight">
                "Code is art that executes."
              </h3>
              
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                As a web developer named <strong className="text-white font-semibold">Badal Varshney</strong> (Hindi for Cloud), I embrace fluid flexibility in code. My goal is to build web applications that leave a lasting visual impact while maintaining enterprise-grade reliability and speed.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  ⚡ React 18 & Next.js
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  ☁️ 3D Three.js / WebGL
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  🎬 GSAP ScrollTrigger
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  🎨 Tailwind CSS
                </span>
              </div>
            </div>

            {/* Simulated Code Terminal */}
            <div className="bg-black/90 rounded-2xl border border-white/10 p-6 font-mono text-xs text-zinc-300 shadow-2xl relative">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <span className="ml-auto text-[10px] text-zinc-500">BadalVarshneyDeveloper.js</span>
              </div>

              <pre className="space-y-1.5 text-zinc-400 overflow-x-auto leading-relaxed">
                <div><span className="text-zinc-600">// Developer Profile Matrix</span></div>
                <div><span className="text-white font-bold">const</span> developer = &#123;</div>
                <div className="pl-4">name: <span className="text-white">"Badal Varshney"</span>,</div>
                <div className="pl-4">role: <span className="text-white">"Creative Web Developer"</span>,</div>
                <div className="pl-4">superpower: <span className="text-white">"Transforming ideas into cloud-fast web apps"</span>,</div>
                <div className="pl-4">coreTech: [<span className="text-white">"React"</span>, <span className="text-white font-semibold">"Next.js"</span>, <span className="text-white font-semibold">"GSAP"</span>, <span className="text-white">"Three.js"</span>],</div>
                <div className="pl-4">status: <span className="text-emerald-400">"Ready for high-impact projects"</span></div>
                <div>&#125;;</div>
                <div className="pt-2"><span className="text-white font-bold">function</span> buildFutureWeb() &#123;</div>
                <div className="pl-4"><span className="text-zinc-500">return</span> developer.coreTech.map(tech =&gt; createMasterpiece(tech));</div>
                <div>&#125;</div>
              </pre>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
