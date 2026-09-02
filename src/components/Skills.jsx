import React from 'react';
import { Cpu, Code2, Layers, Palette, Smartphone, Wrench, Bot, Monitor, CheckCircle2, Sparkles } from 'lucide-react';
import GlassWallRainDrip from './GlassWallRainDrip';

const TECH_CATEGORIES = [
  {
    category: 'Programming Languages',
    icon: Code2,
    badge: '🚀 Core',
    skills: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3']
  },
  {
    category: 'Frontend Development',
    icon: Layers,
    badge: '🎨 Architecture',
    skills: ['React', 'Next.js', 'Redux', 'Redux Toolkit']
  },
  {
    category: 'UI Libraries & Tools',
    icon: Palette,
    badge: '🧩 Design Systems',
    skills: [
      'TailwindCSS',
      'Bootstrap',
      'Material UI',
      'Ant Design',
      'Mantine',
      'Radix UI',
      'DaisyUI',
      'Aceternity UI'
    ]
  },
  {
    category: 'Other Frontend Skills',
    icon: Smartphone,
    badge: '📱 UX & Performance',
    skills: ['Responsive Design', 'Web Animations', 'UI/UX']
  },
  {
    category: 'Tools & Workflow',
    icon: Wrench,
    badge: '⚙️ Environment',
    skills: [
      'Git',
      'GitHub',
      'VS Code',
      'Figma',
      'Postman',
      'Vercel',
      'NPM',
      'Notion',
      'Google Antigravity'
    ]
  },
  {
    category: 'AI Tools',
    icon: Bot,
    badge: '🤖 Productivity',
    skills: ['ChatGPT', 'Google Gemini', 'GitHub Copilot', 'Claude', 'Perplexity']
  },
  {
    category: 'Operating Systems',
    icon: Monitor,
    badge: '💻 Platforms',
    skills: ['Windows', 'macOS', 'Ubuntu']
  }
];

function Skills() {
  return (
    <section id="skills" className="relative py-32 px-6 md:px-12 section-dimming-3 z-20 overflow-hidden section-divider">
      {/* Low sliding water droplets */}
      <GlassWallRainDrip density="low" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 bg-zinc-900 border border-white/10 px-3 py-1 rounded-full">
              <Cpu className="w-3.5 h-3.5 text-white" />
              <span>03 // Skills & Tech Stack</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase">
              Comprehensive <span className="text-zinc-500">Tech Stack</span>
            </h2>
          </div>

          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-light">
            Badal's complete technical arsenal: languages, frontend frameworks, UI design libraries, workflow tools, and AI technologies.
          </p>
        </div>

        {/* Tech Stack Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TECH_CATEGORIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.category}
                className="glass-card glass-panel w-full h-auto p-8 rounded-3xl border border-white/15 glass-panel-hover flex flex-col justify-between group relative overflow-hidden"
                style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}
              >
                {/* Background Subtle Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none"></div>

                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-zinc-900 border border-white/15 text-white group-hover:bg-white group-hover:text-black transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-white">{item.category}</h3>
                        <span className="text-[10px] font-mono text-zinc-500">0{idx + 1} // Stack Category</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-white/10 px-2.5 py-1 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  {/* Skills Pill Badges */}
                  <div className="flex flex-wrap gap-2.5">
                    {item.skills.map((skill) => (
                      <div
                        key={skill}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-200 group-hover:border-white/30 hover:bg-white hover:text-black transition-all cursor-default"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>{item.skills.length} Technologies</span>
                  <span className="text-zinc-400 font-semibold">Production Ready</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default React.memo(Skills);
