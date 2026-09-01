import React, { useState } from 'react';
import { Mail, Send, Copy, Check, Github, Linkedin, Twitter, MessageSquare, Sparkles, Globe } from 'lucide-react';
import GlassWallRainDrip from './GlassWallRainDrip';

function Contact() {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Web Application',
    message: ''
  });

  const emailAddress = "badal.developer.official@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', projectType: 'Web Application', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="relative py-32 px-6 md:px-12 section-dimming-5 z-20 overflow-hidden section-divider">
      {/* Micro sliding drops (1 or 2 drops) */}
      <GlassWallRainDrip density="micro" />

      {/* Ambient background light */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Column: Direct Info */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 bg-zinc-900 border border-white/10 px-3 py-1 rounded-full">
                <Mail className="w-3.5 h-3.5 text-white" />
                <span>05 // Get In Touch</span>
              </div>
              <h2 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-white uppercase leading-none">
                Let's Build <br />
                <span className="text-zinc-500">Together.</span>
              </h2>
            </div>

            <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
              Have a web development project, freelance inquiry, or full-time opportunity? Let's turn your vision into a cloud-fast, motion-enhanced reality.
            </p>

            {/* Quick Email Copy Card */}
            <div className="glass-panel p-6 rounded-3xl border border-white/15 space-y-3">
              <div className="text-xs font-mono uppercase text-zinc-400">Direct Contact Email</div>
              <div className="flex items-center justify-between gap-4 bg-zinc-900/90 p-4 rounded-2xl border border-white/10">
                <span className="font-mono text-sm sm:text-base text-white truncate">
                  {emailAddress}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-2 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-zinc-400">Connect Across Platforms</div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl glass-panel border border-white/15 text-white hover:bg-white hover:text-black transition-all flex items-center gap-2 text-xs font-mono"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl glass-panel border border-white/15 text-white hover:bg-white hover:text-black transition-all flex items-center gap-2 text-xs font-mono"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl glass-panel border border-white/15 text-white hover:bg-white hover:text-black transition-all flex items-center gap-2 text-xs font-mono"
                >
                  <Twitter className="w-4 h-4" />
                  <span>X / Twitter</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl relative">

            {submitted ? (
              <div className="py-16 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="font-display text-3xl font-bold text-white">Message Sent!</h3>
                <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                  Thank you for reaching out to Badal Varshney. I will review your inquiry and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white mb-1">
                    Send a Direct Message
                  </h3>
                  <p className="text-xs text-zinc-400">Fill out the details below to initiate contact.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                      Project Category
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-white transition-colors text-sm"
                    >
                      <option value="Web Application">React / Next.js Web App</option>
                      <option value="GSAP Animation Site">GSAP 3D / Motion Portfolio</option>
                      <option value="Full-Stack System">Full-Stack MERN System</option>
                      <option value="Freelance Role">Freelance / Full-Time Hire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                      Message Details
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your project goals, scope, and timeline..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm resize-none"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-white/10"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

export default React.memo(Contact);
