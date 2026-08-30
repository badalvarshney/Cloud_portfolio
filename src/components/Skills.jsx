import React from 'react';
import { Cpu, Code2, Database, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';

const SKILL_CATEGORIES = [
  {
    title: 'Frontend Architecture',
    icon: Code2,
    skills: [
      { name: 'React 18', level: '95%', desc: 'Hooks, Context, Custom Hooks, Performance' },
      { name: 'Next.js 14', level: '90%', desc: 'App Router, Server Components, SSR/SSG' },
      { name: 'GSAP 3', level: '92%', desc: 'ScrollTrigger, MotionPath, Timeline, Canvas' },
      { name: 'JavaScript (ES6+)', level: '95%', desc: 'Async/Await, Closures, DOM Architecture' },
      { name: 'Three.js / WebGL', level: '85%', desc: '3D Scenes, Volumetric Particle Systems' },
      { name: 'Tailwind CSS', level: '98%', desc: 'Custom Tokens, Dark Mode, Utility Design' }
    ]
  },
  {
    title: 'Backend & APIs',
    icon: Database,
    skills: [
      { name: 'Node.js', level: '88%', desc: 'Event Loop, Streams, NPM Package Ecosystem' },
      { name: 'Express.js', level: '90%', desc: 'Middleware, REST Architecture, Auth' },
      { name: 'MongoDB / Mongoose', level: '85%', desc: 'Document Modeling, Aggregations' },
      { name: 'REST APIs & WebSockets', level: '92%', desc: 'JSON Endpoints, Real-Time Sockets' }
    ]
  },
  {
    title: 'Development Tools',
    icon: Wrench,
    skills: [
      { name: 'Git & GitHub', level: '94%', desc: 'Branching, PR Workflows, CI/CD Actions' },
      { name: 'Vite & Webpack', level: '90%', desc: 'Hot Reloading, Build Bundling' },
      { name: 'Vercel / Netlify', level: '95%', desc: 'Production Deployment & DNS' },
      { name: 'Postman & DevTools', level: '92%', desc: 'API Testing, DOM/Network Debugging' }
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 px-6 md:px-12 section-dimming-3 z-20 overflow-hidden section-divider">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 bg-zinc-900 border border-white/10 px-3 py-1 rounded-full">
              <Cpu className="w-3.5 h-3.5 text-white" />
              <span>03 // Skills & Stack</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase">
              Tech Stack & <span className="text-zinc-500">Toolkit</span>
            </h2>
          </div>

          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-light">
            Empowered with modern frameworks and animation engines to engineer high-speed, robust web applications.
          </p>
        </div>

        {/* Skill Category Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SKILL_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="glass-panel p-8 rounded-3xl border border-white/15 glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-zinc-900 border border-white/15 text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">{cat.title}</h3>
                      <span className="text-[11px] font-mono text-zinc-500">0{idx + 1} // Proficiency Matrix</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {cat.skills.map((skill) => (
                      <div key={skill.name} className="group">
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                            {skill.name}
                          </span>
                          <span className="font-mono text-xs text-zinc-500 group-hover:text-zinc-300">
                            {skill.level}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden mb-1">
                          <div
                            className="h-full bg-gradient-to-r from-zinc-500 to-white rounded-full transition-all duration-1000 ease-out group-hover:from-white group-hover:to-white"
                            style={{ width: skill.level }}
                          ></div>
                        </div>

                        <span className="text-[11px] text-zinc-500 block font-light">
                          {skill.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs font-mono text-zinc-500">
                  <span>Continuous Learning & Optimization</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
