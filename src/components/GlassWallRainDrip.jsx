import React, { useEffect, useRef } from 'react';

export default function GlassWallRainDrip({ density = 'full' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const isStatic = density === 'static' || density === 'static-dew';
    const isMinimal = density === 'minimal';

    const maxDrops = isStatic ? 0 : (isMinimal ? 6 : 40);
    const spawnFreq = isMinimal ? 36 : 9;
    const dewDivisor = isStatic ? 75 : (isMinimal ? 45 : 22);

    // Condensation Dew Drops bounded to section container
    const dewDrops = [];
    const dewCount = Math.floor((canvas.width || window.innerWidth) / dewDivisor);
    for (let i = 0; i < dewCount; i++) {
      dewDrops.push({
        x: Math.random() * (canvas.width || window.innerWidth),
        y: Math.random() * (canvas.height || window.innerHeight),
        r: Math.random() * 3 + 1.8,
        alpha: isStatic ? Math.random() * 0.2 + 0.2 : (isMinimal ? Math.random() * 0.25 + 0.25 : Math.random() * 0.35 + 0.4)
      });
    }

    // Trickling Rain Droplets
    const tricklingDrops = [];
    const splashes = [];
    let frameCount = 0;

    // Helper to draw clean, subtle glass raindrop
    const drawGlassDrop = (x, y, r, opacity = 1) => {
      ctx.save();
      ctx.globalAlpha = opacity;

      // Subtle Liquid Body Gradient
      const grad = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.1, x, y, r);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.4, 'rgba(210, 235, 255, 0.55)');
      grad.addColorStop(1, 'rgba(40, 60, 90, 0.4)');

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Soft Rim Outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Subtle Specular Reflection Highlight
      ctx.beginPath();
      ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Spawn subtle raindrops inside section bounds (DISABLED for static mode)
      if (!isStatic && frameCount % spawnFreq === 0) {
        const impactX = Math.random() * canvas.width;
        const impactY = Math.random() * (canvas.height * 0.3);

        if (!isMinimal) {
          splashes.push({
            x: impactX,
            y: impactY,
            r: 2,
            maxR: Math.random() * 12 + 8,
            opacity: 0.75
          });
        }

        tricklingDrops.push({
          x: impactX,
          y: impactY,
          r: isMinimal ? Math.random() * 3 + 2 : Math.random() * 4 + 2.5,
          vy: isMinimal ? Math.random() * 1.4 + 0.8 : Math.random() * 2.0 + 1.2,
          trail: [],
          pauseTimer: Math.floor(Math.random() * 35 + 10)
        });

        if (tricklingDrops.length > maxDrops) {
          tricklingDrops.shift();
        }
      }

      // Draw Dew Drops
      dewDrops.forEach(d => drawGlassDrop(d.x, d.y, d.r, d.alpha));

      // Draw Impact Splash Rings
      for (let s = splashes.length - 1; s >= 0; s--) {
        const splash = splashes[s];
        splash.r += 0.75;
        splash.opacity -= 0.03;

        if (splash.opacity <= 0 || splash.r >= splash.maxR) {
          splashes.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(splash.x, splash.y, splash.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(220, 240, 255, ${splash.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // Draw Trickling Rain Drops & Wet Trails
      for (let j = 0; j < tricklingDrops.length; j++) {
        const drop = tricklingDrops[j];

        // Draw Wet Trail
        if (drop.trail.length > 1) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(drop.trail[0].x, drop.trail[0].y);
          for (let t = 1; t < drop.trail.length; t++) {
            ctx.lineTo(drop.trail[t].x, drop.trail[t].y);
          }
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = drop.r * 0.4;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();
        }

        if (drop.pauseTimer > 0) {
          drop.pauseTimer--;
        } else {
          drop.y += drop.vy;
          drop.trail.push({ x: drop.x, y: drop.y });
          if (drop.trail.length > 25) {
            drop.trail.shift();
          }

          if (Math.random() < 0.008) {
            drop.pauseTimer = Math.floor(Math.random() * 35 + 10);
          }
        }

        drawGlassDrop(drop.x, drop.y, drop.r, 0.9);

        if (drop.y > canvas.height + 20) {
          drop.y = -10;
          drop.x = Math.random() * canvas.width;
          drop.trail = [];
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
}
