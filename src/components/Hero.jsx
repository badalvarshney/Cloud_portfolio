import React, { useRef } from 'react';

export default function Hero({ scrollProgress }) {
  const titleRef = useRef(null);

  // 1. WELCOME 7-Letter Explosion Trajectories (Scroll 0.04 to 0.40)
  // Each letter shatters & flies in a unique 3D vector direction (top-left, bottom-left, straight up, etc.)
  const welcomeLetters = ['W', 'E', 'L', 'C', 'O', 'M', 'E'];
  const letterVectors = [
    { x: -160, y: -90,  r: -45, scale: 1.4 }, // W -> Top-Left
    { x: -100, y: -150, r: 35,  scale: 0.8 }, // E -> Upper-Left
    { x: -140, y: 110,  r: -60, scale: 1.3 }, // L -> Bottom-Left
    { x: 0,    y: -190, r: 15,  scale: 2.1 }, // C -> Straight Up Explosion
    { x: 130,  y: 120,  r: 45,  scale: 1.1 }, // O -> Bottom-Right
    { x: 100,  y: -140, r: -35, scale: 0.9 }, // M -> Upper-Right
    { x: 170,  y: -80,  r: 65,  scale: 1.5 }, // E -> Top-Right
  ];

  let welcomeProgress = 0;
  if (scrollProgress <= 0.04) {
    welcomeProgress = 0;
  } else if (scrollProgress > 0.04 && scrollProgress <= 0.40) {
    welcomeProgress = (scrollProgress - 0.04) / 0.36;
  } else {
    welcomeProgress = 1;
  }

  const welcomeOpacity = Math.max(0, 1 - welcomeProgress * 1.35);

  // 2. BADAL VARSHNEY Title Emergence & Extended Crisp Hold (Scroll 0.35 to 0.93)
  // Emerges from cloud mist (0.35 to 0.55) and STAYS 100% crisp, sharp, unblurred, and clear from 0.55 all the way to 0.93!
  let heroOpacity = 0;
  let heroScale = 0.75;
  let heroBlur = 14;
  let heroY = 60;

  if (scrollProgress <= 0.35) {
    heroOpacity = 0;
    heroScale = 0.75;
    heroBlur = 14;
    heroY = 60;
  } else if (scrollProgress > 0.35 && scrollProgress <= 0.55) {
    const p = (scrollProgress - 0.35) / 0.20;
    heroOpacity = p;
    heroScale = 0.75 + p * 0.25;
    heroBlur = 14 * (1 - p);
    heroY = 60 * (1 - p);
  } else if (scrollProgress > 0.55 && scrollProgress <= 0.93) {
    // Extended Crisp Hold Phase: BADAL VARSHNEY stays 100% clear, 0 blur, 1.0 opacity for long scroll duration
    heroOpacity = 1;
    heroScale = 1.0;
    heroBlur = 0;
    heroY = 0;
  } else {
    const p = (scrollProgress - 0.93) / 0.07;
    heroOpacity = Math.max(0, 1 - p * 2.0);
    heroScale = 1.0 + p * 0.05;
    heroBlur = p * 4;
    heroY = -p * 30;
  }

  // Scroll prompt opacity: visible at initial WELCOME view (0 to 0.22)
  const scrollPromptOpacity = Math.max(0, 1 - scrollProgress * 4.5);

  return (
    <section id="cloud-hero-trigger" className="relative min-h-[320vh] w-full">
      {/* Sticky Hero Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center px-6 md:px-12 py-20 overflow-hidden z-20">
        
        {/* Top Spacer */}
        <div className="h-10"></div>

        {/* 7-LETTER 3D EXPLOSION SHATTER CONTAINER */}
        <div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none transition-all duration-75 ease-out px-2"
          style={{
            opacity: welcomeOpacity,
            display: welcomeOpacity > 0.01 ? 'flex' : 'none'
          }}
        >
          <div className="flex items-center justify-center font-display font-extrabold tracking-tighter text-3xl sm:text-6xl md:text-8xl lg:text-[11rem] uppercase select-none text-white drop-shadow-[0_15px_40px_rgba(255,255,255,0.4)]">
            {welcomeLetters.map((char, index) => {
              const vec = letterVectors[index];
              const lx = vec.x * welcomeProgress;
              const ly = vec.y * welcomeProgress;
              const lr = vec.r * welcomeProgress;
              const ls = 1 + (vec.scale - 1) * welcomeProgress;

              return (
                <span
                  key={index}
                  className="inline-block transition-transform duration-75 ease-out"
                  style={{
                    transform: `translate(${lx}vw, ${ly}vh) rotate(${lr}deg) scale(${ls})`
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Dynamic BADAL VARSHNEY Emergence Section */}
        <div className="text-center max-w-7xl mx-auto my-auto z-20 transition-all duration-100 ease-out px-3">
          <div className="mb-3">
            <h1
              ref={titleRef}
              className="font-display font-extrabold tracking-tight uppercase leading-none select-none drop-shadow-[0_10px_35px_rgba(255,255,255,0.35)] text-white flex flex-col items-center justify-center gap-1 sm:gap-2"
              style={{
                transform: `scale(${heroScale}) translateY(${heroY}px)`,
                opacity: heroOpacity,
                filter: `blur(${heroBlur}px)`,
                pointerEvents: heroOpacity > 0.4 ? 'auto' : 'none'
              }}
            >
              <span className="text-4xl sm:text-6xl md:text-8xl lg:text-[8.5rem] tracking-tighter">BADAL</span>
              <span className="text-2.5xl sm:text-5xl md:text-6xl lg:text-[6.5rem] tracking-tighter text-zinc-100">VARSHNEY</span>
            </h1>
          </div>

          <p
            className="font-display text-xs sm:text-lg md:text-2xl font-light text-zinc-200 tracking-wide max-w-3xl mx-auto mt-3 sm:mt-4 leading-relaxed"
            style={{ 
              opacity: heroOpacity,
              filter: `blur(${heroBlur * 0.5}px)`,
              transform: `translateY(${heroY * 0.5}px)`
            }}
          >
            Creative Web Developer & Visual Front-End Engineer
          </p>

          {/* Action CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-xs sm:max-w-none mx-auto"
            style={{ 
              opacity: heroOpacity,
              pointerEvents: heroOpacity > 0.5 ? 'auto' : 'none'
            }}
          >
            <a
              href="#projects"
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 shadow-xl shadow-white/20 text-center"
            >
              Explore My Work
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full glass-panel hover:bg-zinc-800 border border-white/30 text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all hover:scale-105 text-center"
            >
              Get In Touch
            </a>
          </div>
        </div>

        {/* Initial Welcome Scroll Prompt */}
        <div
          className="flex flex-col items-center gap-2 sm:gap-3 text-zinc-200 text-[10px] sm:text-xs font-mono uppercase tracking-widest transition-all duration-300 z-30 mb-2 sm:mb-0"
          style={{ 
            opacity: scrollPromptOpacity,
            pointerEvents: scrollPromptOpacity > 0.2 ? 'auto' : 'none'
          }}
        >
          <span className="bg-black/60 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/20 backdrop-blur-md shadow-2xl text-white font-semibold flex items-center gap-2 text-[10px] sm:text-xs">
            <span>Scroll down to enter</span>
            <span className="text-sm sm:text-base animate-bounce">☁️</span>
          </span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-white/40 p-1 flex justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-1.5 h-2.5 sm:h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
