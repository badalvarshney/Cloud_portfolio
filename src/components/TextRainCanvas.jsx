import React, { useEffect, useRef } from 'react';

export default function TextRainCanvas({ letterRects = [], isTextVisible = true }) {
  const canvasRef = useRef(null);
  const letterRectsRef = useRef(letterRects);

  useEffect(() => {
    letterRectsRef.current = letterRects;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastTime = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Dynamic Rain Particle Pool (300 drops)
    const maxDropCount = 300;
    const drops = [];
    for (let i = 0; i < maxDropCount; i++) {
      drops.push({
        x: Math.random() * (window.innerWidth + 240) - 120,
        y: Math.random() * window.innerHeight,
        baseVy: Math.random() * 5 + 8,
        baseVx: -1.4 - Math.random() * 0.8,
        baseLength: Math.random() * 8 + 6,
        width: Math.random() * 1.4 + 0.8,
        opacity: Math.random() * 0.45 + 0.45,
        lastSplashedY: -999
      });
    }

    // Splash Particles (droplets bouncing off name letters & cards)
    const splashParticles = [];
    // Splash Rings (water ripples)
    const splashRings = [];

    const spawnLetterSplash = (impactX, impactY) => {
      splashRings.push({
        x: impactX,
        y: impactY,
        r: 2,
        maxR: Math.random() * 10 + 8,
        opacity: 0.95
      });

      const particleCount = Math.floor(Math.random() * 3) + 4;
      for (let p = 0; p < particleCount; p++) {
        splashParticles.push({
          x: impactX,
          y: impactY,
          vx: (Math.random() - 0.5) * 5.0,
          vy: -(Math.random() * 4.0 + 1.5),
          r: Math.random() * 1.6 + 0.8,
          gravity: 0.24,
          life: 1.0,
          decay: Math.random() * 0.04 + 0.03
        });
      }
    };

    const render = (now) => {
      animationFrameId = requestAnimationFrame(render);

      const delta = Math.min(32, now - lastTime);
      lastTime = now;
      const speedFactor = delta / 16.66;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentRects = letterRectsRef.current;

      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';

      for (let i = 0; i < maxDropCount; i++) {
        const drop = drops[i];
        const prevY = drop.y;

        const currentVy = drop.baseVy;
        const currentVx = drop.baseVx;
        const currentLength = drop.baseLength;

        drop.x += currentVx * speedFactor;
        drop.y += currentVy * speedFactor;

        // Collision detection for Name letters, Action Buttons, All Cards, and Footer line
        if (currentRects && currentRects.length > 0) {
          for (let r = 0; r < currentRects.length; r++) {
            const rect = currentRects[r];
            if (!rect) continue;

            const relLeft = rect.left;
            const relRight = rect.right;
            const relTop = rect.top;

            if (
              Math.abs(relTop - drop.lastSplashedY) > 15 &&
              drop.x >= relLeft - 4 &&
              drop.x <= relRight + 4 &&
              prevY <= relTop + 4 &&
              drop.y >= relTop - 4
            ) {
              spawnLetterSplash(drop.x, relTop);
              drop.lastSplashedY = relTop;
              break;
            }
          }
        }

        if (drop.y > canvas.height + 25) {
          drop.y = -Math.random() * 120 - 20;
          drop.x = Math.random() * (canvas.width + 200) - 100;
          drop.lastSplashedY = -999;
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - currentVx * 1.5, drop.y - currentLength);
        ctx.strokeStyle = `rgba(224, 242, 254, ${drop.opacity})`;
        ctx.lineWidth = drop.width;
        ctx.stroke();
        ctx.restore();
      }

      // Update & Draw Bouncing Splash Particles off Name Letters & Cards
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
        ctx.fillStyle = `rgba(224, 242, 254, ${sp.life * 0.85})`;
        ctx.fill();
        ctx.restore();
      }

      // Update & Draw Expanding Splash Ripple Rings on Name Letters & Cards
      for (let r = splashRings.length - 1; r >= 0; r--) {
        const ring = splashRings[r];
        ring.r += 0.6 * speedFactor;
        ring.opacity -= 0.04 * speedFactor;

        if (ring.opacity <= 0 || ring.r >= ring.maxR) {
          splashRings.splice(r, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(ring.x, ring.y, ring.r, ring.r * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(186, 230, 253, ${ring.opacity * 0.85})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
}
