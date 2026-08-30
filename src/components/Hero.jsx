import React, { useRef } from 'react';

export default function Hero({ scrollProgress }) {
  const titleRef = useRef(null);

  // 1. WELCOME 7-Letter Explosion Trajectories (Scroll 0.04 to 0.40)
  // Each letter shatters & flies in a unique 3D direction
  const welcomeLetters = ['W', 'E', 'L', 'C', 'O', 'M', 'E'];
  const letterVectors = [
    { x: -160, y: -90, r: -45, scale: 1.4 }, // W -> Top-Left
    { x: -100, y: -150, r: 35, scale: 0.8 }, // E -> Upper-Left
    { x: -140, y: 110, r: -60, scale: 1.3 }, // L -> Bottom-Left
    { x: 0, y: -190, r: 15, scale: 2.1 }, // C -> Straight Up Explosion
    { x: 130, y: 120, r: 45, scale: 1.1 }, // O -> Bottom-Right
    { x: 100, y: -140, r: -35, scale: 0.9 }, // M -> Upper-Right
    { x: 170, y: -80, r: 65, scale: 1.5 }, // E -> Top-Right
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

  // 2. BADAL VARSHNEY 3D CENTER ZOOM & 360-DEGREE MULTI-DIRECTION EXPANSION (Scroll 0.42 to 1.00)
  const badalLetters = ['B', 'A', 'D', 'A', 'L'];
  const badalVectors = [
    { x: -170, y: -140, r: -55, scale: 5.2 }, // B -> Top-Left
    { x: -130, y: 130, r: 45, scale: 4.8 }, // A -> Bottom-Left
    { x: -10, y: -190, r: 15, scale: 5.6 }, // D -> Straight Up
    { x: 150, y: -150, r: 60, scale: 5.0 }, // A -> Top-Right
    { x: 180, y: 120, r: -40, scale: 4.7 }  // L -> Bottom-Right
  ];

  const varshneyLetters = ['V', 'A', 'R', 'S', 'H', 'N', 'E', 'Y'];
  const varshneyVectors = [
    { x: -210, y: -40, r: -75, scale: 5.4 }, // V -> Far Middle-Left
    { x: 190, y: -130, r: 50, scale: 4.9 }, // A -> Top-Far-Right
    { x: -160, y: 180, r: -35, scale: 5.3 }, // R -> Deep Bottom-Left
    { x: -90, y: -170, r: -25, scale: 4.6 }, // S -> Upper-Left
    { x: 80, y: 190, r: 35, scale: 5.5 }, // H -> Deep Bottom-Center-Right
    { x: 195, y: 140, r: 65, scale: 5.1 }, // N -> Bottom-Far-Right
    { x: -140, y: -110, r: -45, scale: 4.7 }, // E -> Upper-Left Diagonal
    { x: 220, y: 30, r: 80, scale: 5.8 }  // Y -> Far Middle-Right
  ];

  // Calculate Zoom & Emergence Parameters based on Scroll
  let heroOpacity = 0;
  let heroBlur = 0;
  let centerZoomProgress = 0; // 0 = start emergence, 1 = focused in center
  let flythroughProgress = 0; // 0 = at center focus, 1 = full hyper zoom flythrough

  if (scrollProgress <= 0.38) {
    heroOpacity = 0;
    centerZoomProgress = 0;
    flythroughProgress = 0;
    heroBlur = 20;
  } else if (scrollProgress > 0.38 && scrollProgress <= 0.62) {
    // Stage 1: Emergence from deep center fog, zooming in to center stage (0.38 -> 0.62)
    const p = (scrollProgress - 0.38) / 0.24;
    centerZoomProgress = p;
    flythroughProgress = 0;
    heroOpacity = p;
    heroBlur = 20 * (1 - p);
  } else if (scrollProgress > 0.62 && scrollProgress <= 0.76) {
    // Stage 2: Sharp focal hold at screen center (0.62 -> 0.76)
    centerZoomProgress = 1;
    flythroughProgress = 0;
    heroOpacity = 1;
    heroBlur = 0;
  } else {
    // Stage 3: Hyper 3D Zoom & 360° Shatter Flythrough outward from center (0.76 -> 0.90)
    centerZoomProgress = 1;
    const p = (scrollProgress - 0.76) / 0.14;
    flythroughProgress = p;
    heroOpacity = p > 0.6 ? Math.max(0, 1 - (p - 0.6) / 0.4) : 1;
    heroBlur = p * 5;
  }

  // Base scale during emergence (zooms in from center: 0.2 -> 1.0)
  const emergenceScale = 0.2 + centerZoomProgress * 0.8;

  // Subtitle & Buttons Opacity during hyper zoom flythrough
  const subContentOpacity = flythroughProgress > 0
    ? Math.max(0, 1 - flythroughProgress * 2.2)
    : heroOpacity;

  // Scroll prompt opacity
  const scrollPromptOpacity = Math.max(0, 1 - scrollProgress * 3.5);

  return (
    <section id="cloud-hero-trigger" className="relative min-h-[350vh] w-full">
      {/* Sticky Hero Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center px-6 md:px-12 py-20 overflow-hidden z-20">

        {/* Top Spacer */}
        <div className="h-10"></div>

        {/* 1. WELCOME 7-LETTER 3D EXPLOSION SHATTER CONTAINER */}
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none transition-all duration-75 ease-out px-2"
          style={{
            opacity: welcomeOpacity,
            display: welcomeOpacity > 0.01 ? 'flex' : 'none'
          }}
        >
          <div className="flex items-center justify-center font-display font-black tracking-tighter text-4xl sm:text-7xl md:text-9xl lg:text-[11rem] uppercase select-none text-white drop-shadow-[0_20px_60px_rgba(255,255,255,0.5)]">
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
          <p
            className="font-mono text-xs sm:text-base tracking-[0.4em] sm:tracking-[0.6em] text-zinc-300 uppercase mt-4 bg-black/40 px-6 py-2 rounded-full border border-white/20 backdrop-blur-md transition-opacity duration-150"
            style={{ opacity: Math.max(0, 1 - welcomeProgress * 2) }}
          >
            TO THE CLOUD EXPERIENCE
          </p>
        </div>

        {/* 2. DYNAMIC BADAL VARSHNEY 3D CENTER-ZOOM CONTAINER */}
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center max-w-7xl mx-auto px-4 pointer-events-none transition-all duration-75 ease-out"
          style={{
            opacity: heroOpacity,
            filter: `blur(${heroBlur}px)`,
            display: heroOpacity > 0.005 ? 'flex' : 'none'
          }}
        >
          <h1
            ref={titleRef}
            className="font-display font-extrabold tracking-tight uppercase leading-none select-none drop-shadow-[0_15px_45px_rgba(255,255,255,0.45)] text-white flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            {/* BADAL WORD (Center Zoom + Letter Separation) */}
            <div className="flex items-center justify-center text-4xl sm:text-7xl md:text-9xl lg:text-[9.5rem] tracking-tighter drop-shadow-[0_0_35px_rgba(255,255,255,0.5)]">
              {badalLetters.map((char, index) => {
                const vec = badalVectors[index];

                // During Flythrough: letters zoom & spread outward from center
                const lx = vec.x * flythroughProgress;
                const ly = vec.y * flythroughProgress;
                const lr = vec.r * flythroughProgress;
                const ls = emergenceScale * (1 + (vec.scale - 1) * flythroughProgress);

                return (
                  <span
                    key={index}
                    className="inline-block transition-transform duration-75 ease-out"
                    style={{
                      transform: `translate(${lx}vw, ${ly}vh) rotate(${lr}deg) scale(${ls})`,
                      transformOrigin: 'center center'
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* VARSHNEY WORD (Center Zoom + Letter Separation) */}
            <div className="flex items-center justify-center text-2xl sm:text-5xl md:text-7xl lg:text-[7.5rem] tracking-tighter text-zinc-100 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
              {varshneyLetters.map((char, index) => {
                const vec = varshneyVectors[index];

                // During Flythrough: letters zoom & spread outward from center
                const lx = vec.x * flythroughProgress;
                const ly = vec.y * flythroughProgress;
                const lr = vec.r * flythroughProgress;
                const ls = emergenceScale * (1 + (vec.scale - 1) * flythroughProgress);

                return (
                  <span
                    key={index}
                    className="inline-block transition-transform duration-75 ease-out"
                    style={{
                      transform: `translate(${lx}vw, ${ly}vh) rotate(${lr}deg) scale(${ls})`,
                      transformOrigin: 'center center'
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </h1>

          {/* Subtitle */}
          <p
            className="font-display text-sm sm:text-xl md:text-2xl font-light text-zinc-200 tracking-wide max-w-3xl mx-auto mt-4 sm:mt-6 leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-all duration-75"
            style={{
              opacity: subContentOpacity,
              transform: `scale(${1 + flythroughProgress * 0.4})`,
              filter: `blur(${flythroughProgress * 4}px)`,
              pointerEvents: subContentOpacity > 0.4 ? 'auto' : 'none'
            }}
          >
            Creative Web Developer & Visual Front-End Engineer
          </p>

          {/* Action CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full max-w-xs sm:max-w-none mx-auto transition-all duration-75"
            style={{
              opacity: subContentOpacity,
              transform: `scale(${1 + flythroughProgress * 0.3})`,
              pointerEvents: subContentOpacity > 0.5 ? 'auto' : 'none'
            }}
          >
            <a
              href="#projects"
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 shadow-2xl shadow-white/30 text-center"
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
            <span>Scroll down to enter the clouds</span>
            {/* <span className="text-sm sm:text-base animate-bounce">☁️</span> */}
          </span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-white/40 p-1 flex justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-1.5 h-2.5 sm:h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>

      </div>
    </section>
  );
}

