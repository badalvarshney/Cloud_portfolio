import React, { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Lock scroll during preloading
    document.body.style.overflow = 'hidden';

    // 8-Second Loader (8000ms)
    const duration = 8000;
    const intervalTime = 40;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;

        if (next >= 100) {
          clearInterval(timer);
          setIsDone(true);
          
          // Unlock scroll and trigger curtain split
          setTimeout(() => {
            document.body.style.overflow = '';
            setRemoved(true);
            if (onComplete) onComplete();
          }, 1100);

          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  if (removed) return null;

  return (
    <>
      {/* TOP CURTAIN HALF (Slides UP on finish) */}
      <div
        className={`fixed top-0 left-0 right-0 h-1/2 bg-black z-50 border-b border-white/10 shadow-2xl transition-transform duration-1000 ease-in-out ${
          isDone ? '-translate-y-full' : 'translate-y-0'
        }`}
      />

      {/* BOTTOM CURTAIN HALF (Slides DOWN on finish) */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-1/2 bg-black z-50 border-t border-white/10 shadow-2xl transition-transform duration-1000 ease-in-out ${
          isDone ? 'translate-y-full' : 'translate-y-0'
        }`}
      />

      {/* PURE BLACK & WHITE MINIMAL CENTERED EMBLEM (NO BOX) */}
      <div
        className={`fixed inset-0 z-[55] flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ease-in-out px-4 ${
          isDone ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'
        }`}
      >
        {/* Minimal Cloud Icon */}
        <div className="mb-4 sm:mb-6">
          <Cloud className="w-14 h-14 sm:w-20 sm:h-20 text-white stroke-[1.2] animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
        </div>

        {/* Minimal Spaced CLOUD Text */}
        <h2 className="font-mono text-xs sm:text-sm tracking-[0.4em] sm:tracking-[0.6em] font-bold text-white uppercase select-none mb-6 sm:mb-8">
          CLOUD
        </h2>

        {/* Crisp Percentage Ticker */}
        <div className="flex flex-col items-center gap-2.5 sm:gap-3">
          <span className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tighter font-mono">
            {Math.min(100, Math.floor(progress))}%
          </span>

          {/* Minimalist 1px White Progress Bar Line */}
          <div className="w-28 sm:w-36 h-[2px] bg-zinc-900 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75 ease-out"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

