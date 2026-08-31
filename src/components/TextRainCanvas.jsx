import React, { useEffect, useRef } from 'react';

export default function TextRainCanvas({ letterRects = [], isTextVisible = false }) {
  const canvasRef = useRef(null);
  const letterRectsRef = useRef(letterRects);
  const isTextVisibleRef = useRef(isTextVisible);

  // Synchronize latest props into refs without re-starting the animation canvas or loop
  useEffect(() => {
    letterRectsRef.current = letterRects;
    isTextVisibleRef.current = isTextVisible;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;
    let lastTime = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Dynamic Rain Particle Pool (350 max drops)
    const maxDropCount = 350;
    const drops = [];
    for (let i = 0; i < maxDropCount; i++) {
      drops.push({
        x: Math.random() * (window.innerWidth + 240) - 120,
        y: Math.random() * window.innerHeight,
        baseVy: Math.random() * 6 + 10, // Natural steady rain speed (10 to 16 px/frame)
        baseVx: -1.6 - Math.random() * 1.0,
        baseLength: Math.random() * 26 + 18,
        width: Math.random() * 1.6 + 0.9,
        opacity: Math.random() * 0.45 + 0.45,
        hasSplashed: false
      });
    }

    // Splash Particles (droplets bouncing off letters)
    const splashParticles = [];
    // Splash Rings (water ripples on letter impact)
    const splashRings = [];

    const spawnLetterSplash = (impactX, impactY, stormFactor = 0) => {
      // 1. Water Ripple Ring on Letter
      splashRings.push({
        x: impactX,
        y: impactY,
        r: 2,
        maxR: Math.random() * (8 * stormFactor + 12) + 8,
        opacity: 0.9 + stormFactor * 0.1
      });

      // 2. Bouncing Water Droplet Particles (4-8 droplets depending on storm intensity)
      const particleCount = Math.floor(Math.random() * 3) + 4 + Math.floor(stormFactor * 3);
      for (let p = 0; p < particleCount; p++) {
        splashParticles.push({
          x: impactX,
          y: impactY,
          vx: (Math.random() - 0.5) * (5.0 + stormFactor * 2.0),
          vy: -(Math.random() * (4.0 + stormFactor * 2.0) + 1.5),
          r: Math.random() * (1.6 + stormFactor * 0.8) + 0.8,
          gravity: 0.24 + stormFactor * 0.04,
          life: 1.0,
          decay: Math.random() * 0.04 + 0.03
        });
      }
    };

    const render = (now) => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(render);

      // Smooth delta time step so rain speed remains 100% constant regardless of FPS/scroll
      const delta = Math.min(32, now - lastTime);
      lastTime = now;
      const speedFactor = delta / 16.66; // 1.0 at 60 FPS

      // DYNAMIC STORM CYCLE (Oscillates between Normal Steady Rain & Heavy Storm Surge)
      // 24s Cycle: 10s Normal -> 4s Ramp Up -> 6s Heavy Surge -> 4s Ease Down
      const cycleTime = (now * 0.001) % 24;
      let rawStorm = 0;
      if (cycleTime < 10) {
        rawStorm = 0; // Calm Phase (Normal rain)
      } else if (cycleTime < 14) {
        rawStorm = (cycleTime - 10) / 4; // Ramp Up
      } else if (cycleTime < 20) {
        rawStorm = 1.0; // Heavy Storm Downpour Surge
      } else {
        rawStorm = 1.0 - (cycleTime - 20) / 4; // Ease Back Down
      }

      // Smooth cosine easing curve for natural atmospheric transition
      const smoothStorm = 0.5 - 0.5 * Math.cos(rawStorm * Math.PI);

      // Dynamic Active Drops Count (160 drops in normal rain -> 350 drops in heavy storm surge)
      const activeDropCount = Math.floor(160 + smoothStorm * 190);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentRects = letterRectsRef.current;
      const currentTextVisible = isTextVisibleRef.current;

      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';

      for (let i = 0; i < activeDropCount; i++) {
        const drop = drops[i];
        const prevY = drop.y;

        // Dynamic Speed & Streak Length scaling based on storm intensity
        const currentVy = drop.baseVy * (1.0 + smoothStorm * 1.35); // 10-16 -> 23-37 px/frame
        const currentVx = drop.baseVx * (1.0 + smoothStorm * 0.6);
        const currentLength = drop.baseLength * (1.0 + smoothStorm * 0.8);

        // Move rain drops by constant physical speed delta
        drop.x += currentVx * speedFactor;
        drop.y += currentVy * speedFactor;

        // Collision detection ONLY when BADAL VARSHNEY text is visible on screen
        if (currentTextVisible && !drop.hasSplashed && currentRects && currentRects.length > 0) {
          for (let r = 0; r < currentRects.length; r++) {
            const rect = currentRects[r];
            if (!rect) continue;

            const relLeft = rect.left;
            const relRight = rect.right;
            const relTop = rect.top;

            if (
              drop.x >= relLeft - 8 &&
              drop.x <= relRight + 8 &&
              prevY <= relTop + 8 &&
              drop.y >= relTop - 4
            ) {
              spawnLetterSplash(drop.x, relTop, smoothStorm);
              drop.hasSplashed = true;
              break;
            }
          }
        }

        // Reset drop ONLY when it passes bottom of viewport
        if (drop.y > canvas.height + 25) {
          drop.y = -Math.random() * 120 - 20;
          drop.x = Math.random() * (canvas.width + 200) - 100;
          drop.hasSplashed = false;
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - currentVx * 1.5, drop.y - currentLength);
        ctx.strokeStyle = `rgba(224, 242, 254, ${drop.opacity + smoothStorm * 0.15})`;
        ctx.lineWidth = drop.width + smoothStorm * 0.5;
        ctx.stroke();
        ctx.restore();
      }

      // Update & Draw Bouncing Splash Particles off Letters
      for (let s = splashParticles.length - 1; s >= 0; s--) {
        const sp = splashParticles[s];
        sp.x += sp.vx * speedFactor;
        sp.y += sp.vy * speedFactor;
        sp.vy += sp.gravity * speedFactor;
        sp.life -= sp.decay * speedFactor;

        if (sp.life <= 0) {
          splashParticles.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 249, 255, ${sp.life * 0.9})`;
        ctx.fill();
        ctx.restore();
      }

      // Update & Draw Water Splash Rings on Letter Impact
      for (let r = splashRings.length - 1; r >= 0; r--) {
        const ring = splashRings[r];
        ring.r += 0.8 * speedFactor;
        ring.opacity -= 0.05 * speedFactor;

        if (ring.opacity <= 0 || ring.r >= ring.maxR) {
          splashRings.splice(r, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(ring.x, ring.y, ring.r * 1.4, ring.r * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(224, 242, 254, ${ring.opacity})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
        ctx.restore();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(render);
          }
        } else {
          isVisible = false;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(canvas);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []); // Run ONLY ONCE on mount -> Never re-initializes on scroll!

  return (
    <div className="fixed inset-0 pointer-events-none z-15 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
}
