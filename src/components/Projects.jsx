import React, { useState } from 'react';
import { ExternalLink, Github, Layers, ArrowUpRight, Eye, Code, X } from 'lucide-react';

const PROJECTS_DATA = [
  {
    id: 1,
    title: 'CloudVerse 3D Engine',
    category: 'React / GSAP / WebGL',
    tag: 'React / GSAP',
    description: 'An interactive 3D WebGL particle cloud environment with real-time GSAP camera flythrough controls and dark monochrome luxury interface.',
    metrics: '60+ FPS // Three.js // GSAP',
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    tech: ['React', 'GSAP 3', 'Three.js', 'Tailwind CSS']
  },
  {
    id: 2,
    title: 'Aether Motion Studio',
    category: 'Next.js App / Framer Motion',
    tag: 'Full Stack',
    description: 'Ultra-fast Next.js platform for visual artists, featuring silky smooth page transitions, magnetic custom cursor, and dynamic asset gallery.',
    metrics: '99 Lighthouse // SSR // Tailwind',
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    tech: ['Next.js', 'TypeScript', 'Framer Motion', 'Stripe']
  },
  {
    id: 3,
    title: 'Monochrome Luxe E-Commerce',
    category: 'E-Commerce Platform',
    tag: 'Full Stack',
    description: 'Minimalist high-fashion web app built with React, Node.js API backend, GSAP product viewer, and instantaneous search filtering.',
    metrics: 'React 18 // Node.js // MongoDB',
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    tech: ['React', 'Node.js', 'Express', 'GSAP', 'MongoDB']
  },
  {
    id: 4,
    title: 'Pulse AI Analytics Dashboard',
    category: '3D WebGL Data Viz',
    tag: '3D WebGL',
    description: 'Real-time AI metrics monitoring dashboard with custom chart visualizations, particle canvas effects, and responsive mobile architecture.',
    metrics: 'Real-Time WebSockets // Chart.js',
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    tech: ['React', 'Chart.js', 'WebSockets', 'Tailwind CSS']
  }
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const filters = ['All', 'React / GSAP', 'Full Stack', '3D WebGL'];

  const filteredProjects = activeFilter === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.tag === activeFilter);

  return (
    <section id="projects" className="relative py-32 px-6 md:px-12 section-dimming-2 z-20 overflow-hidden section-divider">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 bg-zinc-900 border border-white/10 px-3 py-1 rounded-full">
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>02 // Selected Works</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase">
              Featured <span className="text-zinc-500">Projects</span>
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all border ${activeFilter === filter
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:text-white hover:border-white/30'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel rounded-3xl overflow-hidden glass-panel-hover group flex flex-col justify-between border border-white/15 relative"
            >
              {/* Thumbnail Container */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-zinc-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                {/* Metrics Pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-zinc-300">
                  {project.metrics}
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    aria-label={`View details for ${project.title}`}
                    className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform shadow-xl"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-8 flex flex-col justify-between flex-grow">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">
                    {project.category}
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-zinc-200 transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Tech Badges & Links */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md bg-zinc-900 border border-white/10 text-[11px] font-mono text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors"
                      title="Source Code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Modal Preview */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="glass-panel max-w-2xl w-full rounded-3xl p-8 border border-white/20 relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-800 text-white hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-mono text-zinc-400 mb-2 uppercase">{activeModalProject.category}</div>
            <h3 className="font-display text-3xl font-bold text-white mb-4">{activeModalProject.title}</h3>

            <img
              src={activeModalProject.image}
              alt={activeModalProject.title}
              className="w-full h-56 object-cover rounded-2xl mb-6 border border-white/10"
            />

            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              {activeModalProject.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {activeModalProject.tech.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-zinc-900 border border-white/15 text-xs font-mono text-white">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <a
                href={activeModalProject.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-2"
              >
                <span>Visit Live Project</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={activeModalProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-zinc-900 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center gap-2"
              >
                <span>GitHub Repository</span>
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
