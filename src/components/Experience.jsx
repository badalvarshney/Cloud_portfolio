import React from 'react';
import { Briefcase, Calendar, MapPin, Sparkles, CheckCircle } from 'lucide-react';
import GlassWallRainDrip from './GlassWallRainDrip';

const EXPERIENCES = [
  {
    period: '2024 — PRESENT',
    role: 'Lead Web Motion & Front-End Developer',
    company: 'Freelance & Creative Agency',
    location: 'Remote',
    description: 'Engineering interactive WebGL/GSAP web applications, custom 3D cloud portals, and production React/Next.js platforms for international clients.',
    achievements: [
      'Delivered 15+ modern web applications with 98+ Lighthouse performance scores.',
      'Specialized in GSAP ScrollTrigger timeline animations & canvas particle engines.',
      'Architected modular reusable component systems in React and Tailwind CSS.'
    ]
  },
  {
    period: '2023 — 2024',
    role: 'Full-Stack Web Developer',
    company: 'Tech Innovators Studio',
    location: 'India',
    description: 'Developed scalable MERN stack web applications, RESTful APIs, authentication modules, and responsive dashboard user interfaces.',
    achievements: [
      'Built custom Node.js/Express backend APIs handling high concurrent requests.',
      'Integrated payment gateways, database schemas, and cloud deployment pipelines.',
      'Reduced overall initial page load times by 45% through asset optimization.'
    ]
  },
  {
    period: '2022 — 2023',
    role: 'Front-End Developer & UI Specialist',
    company: 'Digital Craft Media',
    location: 'India',
    description: 'Focused on UI design implementation, modern HTML5/CSS3 layouts, JavaScript logic, and cross-browser responsive testing.',
    achievements: [
      'Converted complex Figma UI/UX designs into pixel-perfect web interfaces.',
      'Engineered smooth CSS & JS micro-interactions for enhanced user conversion.'
    ]
  }
];

function Experience() {
  return (
    <section id="experience" className="relative py-32 px-6 md:px-12 section-dimming-4 z-20 overflow-hidden section-divider">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 bg-zinc-900 border border-white/10 px-3 py-1 rounded-full">
              <Briefcase className="w-3.5 h-3.5 text-white" />
              <span>04 // Timeline & Journey</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase">
              Experience & <span className="text-zinc-400">Milestones</span>
            </h2>
          </div>

          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-light">
            Badal Varshney's professional track record in building high-speed web apps, 3D cloud motion interfaces, and full-stack solutions.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-white before:via-zinc-800 before:to-transparent">
          {EXPERIENCES.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
            >
              {/* Timeline Center Dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border-2 border-white flex items-center justify-center z-10 shadow-lg shadow-white/20">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
              </div>

              {/* Content Card */}
              <div className="w-full md:w-1/2 pl-12 md:pl-0">
                <div
                  className="glass-card glass-panel w-full h-auto p-8 rounded-3xl border border-white/15 glass-panel-hover space-y-4 relative overflow-hidden"
                  style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset', transform: 'translateZ(0)' }}
                >
                  <GlassWallRainDrip density="card" />
                  <div className="relative z-10 space-y-4" style={{ transform: 'translateZ(0)' }}>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                      <span className="text-xs font-mono font-bold text-white px-3 py-1 rounded-full bg-zinc-900 border border-white/20">
                        {item.period}
                      </span>
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        {item.location}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-white">
                      {item.role}
                    </h3>

                    <div className="text-sm font-semibold text-zinc-400">
                      {item.company}
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed font-light">
                      {item.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      {item.achievements.map((ach, aIdx) => (
                        <div key={aIdx} className="flex items-start gap-2.5 text-xs text-zinc-400">
                          <CheckCircle className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default React.memo(Experience);
