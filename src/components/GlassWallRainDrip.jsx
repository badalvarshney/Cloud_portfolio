import React, { useEffect, useRef } from 'react';

export default function GlassWallRainDrip({ density = 'full' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;

    // PRE-RENDERED HARDWARE-ACCELERATED OFFSCREEN CANVASES (60 FPS BUTTERY SMOOTH PERFORMANCE)
    // 1. Micro Dew Sprite (16x16)
    const microSprite = document.createElement('canvas');
    microSprite.width = 16;
    microSprite.height = 16;
    const microCtx = microSprite.getContext('2d');
    const mr = 4;
    const mcx = 8, mcy = 8;
    microCtx.beginPath();
    microCtx.arc(mcx + mr * 0.2, mcy + mr * 0.2, mr * 0.9, 0, Math.PI * 2);
    microCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    microCtx.fill();
    microCtx.beginPath();
    microCtx.arc(mcx, mcy, mr, 0, Math.PI * 2);
    microCtx.fillStyle = 'rgba(210, 230, 245, 0.65)';
    microCtx.fill();
    microCtx.beginPath();
    microCtx.arc(mcx - mr * 0.3, mcy - mr * 0.3, mr * 0.35, 0, Math.PI * 2);
    microCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    microCtx.fill();

    // 2. 3D Water Bead Sprite (32x32)
    const beadSprite = document.createElement('canvas');
    beadSprite.width = 32;
    beadSprite.height = 32;
    const beadCtx = beadSprite.getContext('2d');
    const br = 10;
    const bcx = 16, bcy = 16;
    beadCtx.beginPath();
    beadCtx.ellipse(bcx + br * 0.25, bcy + br * 0.3, br * 1.05, br * 0.95, 0, 0, Math.PI * 2);
    beadCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    beadCtx.fill();
    const beadGrad = beadCtx.createRadialGradient(bcx - br * 0.35, bcy - br * 0.4, br * 0.05, bcx, bcy, br);
    beadGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    beadGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.02)');
    beadGrad.addColorStop(0.75, 'rgba(255, 255, 255, 0.02)');
    beadGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    beadCtx.beginPath();
    beadCtx.ellipse(bcx, bcy, br, br * 0.9, 0, 0, Math.PI * 2);
    beadCtx.fillStyle = beadGrad;
    beadCtx.fill();
    beadCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    beadCtx.lineWidth = Math.max(0.6, br * 0.11);
    beadCtx.stroke();
    beadCtx.beginPath();
    beadCtx.ellipse(bcx - br * 0.35, bcy - br * 0.38, br * 0.28, br * 0.22, -Math.PI / 6, 0, Math.PI * 2);
    beadCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    beadCtx.fill();

    // Helper to generate 4 distinct multi-tier droplet sizes
    const getRandomDewRadius = () => {
      const roll = Math.random();
      if (roll < 0.40) {
        return Math.random() * 1.0 + 0.8;
      } else if (roll < 0.70) {
        return Math.random() * 1.6 + 2.0;
      } else if (roll < 0.90) {
        return Math.random() * 2.4 + 3.8;
      } else {
        return Math.random() * 3.0 + 6.5;
      }
    };

    // Helper to draw realistic 3D static water bead
    const drawStaticWaterBead = (targetCtx, x, y, rx, ry, opacity = 1) => {
      targetCtx.save();
      targetCtx.globalAlpha = opacity;
      const r = Math.max(rx, ry);
      const scale = r / 10;
      targetCtx.drawImage(beadSprite, x - 16 * scale, y - 16 * scale, 32 * scale, 32 * scale);
      targetCtx.restore();
    };

    // Helper to draw realistic liquid teardrop
    const drawRealDrippingWaterDrop = (targetCtx, x, y, r, length, opacity = 1) => {
      targetCtx.save();
      targetCtx.globalAlpha = opacity;

      const headY = y;
      const headR = r;
      const tailY = y - Math.max(18, length);
      const tailW = Math.max(0.8, r * 0.22);

      // 1. Shadow
      targetCtx.beginPath();
      targetCtx.moveTo(x - tailW + 1, tailY + 1);
      targetCtx.quadraticCurveTo(x - headR * 1.05 + 1, headY - headR * 0.7 + 1, x - headR + 1, headY + 1);
      targetCtx.arc(x + 1, headY + 1, headR, Math.PI, 0, true);
      targetCtx.quadraticCurveTo(x + headR * 1.05 + 1, headY - headR * 0.7 + 1, x + tailW + 1, tailY + 1);
      targetCtx.closePath();
      targetCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      targetCtx.fill();

      // 2. Teardrop Main Water Contour Path
      targetCtx.beginPath();
      targetCtx.moveTo(x - tailW, tailY);
      targetCtx.quadraticCurveTo(x - headR * 1.05, headY - headR * 0.7, x - headR, headY);
      targetCtx.arc(x, headY, headR, Math.PI, 0, true);
      targetCtx.quadraticCurveTo(x + headR * 1.05, headY - headR * 0.7, x + tailW, tailY);
      targetCtx.closePath();

      // 3. Clear Transparent Water Refraction Gradient
      const grad = targetCtx.createLinearGradient(x, tailY, x, headY + headR);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.02)');
      grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');

      targetCtx.fillStyle = grad;
      targetCtx.fill();

      // 4. Dark Rim Edge
      targetCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      targetCtx.lineWidth = Math.max(0.7, headR * 0.11);
      targetCtx.stroke();

      // 5. Soft Inner Glow
      targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      targetCtx.lineWidth = Math.max(0.5, headR * 0.07);
      targetCtx.stroke();

      // 6. Cone Specular Highlight
      targetCtx.beginPath();
      targetCtx.moveTo(x - tailW * 0.5, tailY + 2);
      targetCtx.lineTo(x - headR * 0.45, headY - headR * 0.3);
      targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      targetCtx.lineWidth = Math.max(0.6, headR * 0.08);
      targetCtx.stroke();

      // 7. Specular Glint Spot
      targetCtx.beginPath();
      targetCtx.ellipse(
        x - headR * 0.35,
        headY - headR * 0.35,
        headR * 0.28,
        headR * 0.2,
        -Math.PI / 6,
        0,
        Math.PI * 2
      );
      targetCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      targetCtx.fill();

      targetCtx.restore();
    };

    // 1. DYNAMIC LIFECYCLE MULTI-TIER DEW DROPS ENGINE
    const dynamicDewDrops = [];
    const staticBeads = [];

    const initDewEngine = () => {
      const w = canvas.width || window.innerWidth;
      const h = canvas.height || window.innerHeight;

      dynamicDewDrops.length = 0;
      staticBeads.length = 0;

      let dewDivisor = 1400;
      let beadDivisor = 28;

      if (density === 'full') {
        dewDivisor = 320;   // 2.5x More Lifecycle Dew Drops
        beadDivisor = 7;    // 2.3x More 3D Water Beads
      } else if (density === 'moderate') {
        dewDivisor = 550;
        beadDivisor = 12;
      } else if (density === 'low') {
        dewDivisor = 900;
        beadDivisor = 18;
      } else if (density === 'minimal') {
        dewDivisor = 1500;
        beadDivisor = 25;
      } else if (density === 'micro') {
        dewDivisor = 2200;
        beadDivisor = 35;
      }

      const dewCount = Math.floor((w * h) / dewDivisor);
      for (let i = 0; i < dewCount; i++) {
        const r = getRandomDewRadius();
        dynamicDewDrops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: r,
          maxOpacity: Math.random() * 0.45 + 0.30,
          opacity: 0,
          state: 'fadeIn',
          staggerTimer: Math.floor(Math.random() * 180),
          holdTimer: Math.floor(Math.random() * 60 + 50),
          baseFadeSpeed: Math.random() * 0.015 + 0.01
        });
      }

      const beadCount = Math.floor(w / beadDivisor);
      for (let j = 0; j < beadCount; j++) {
        staticBeads.push({
          x: Math.random() * w,
          y: Math.random() * h,
          rx: Math.random() * 4.5 + 3.0,
          ry: (Math.random() * 4.5 + 3.0) * (Math.random() * 0.3 + 0.85),
          opacity: Math.random() * 0.35 + 0.55
        });
      }
    };

    // 2. Dynamic Sliding Heavy Rain Drops Engine
    const slidingDrops = [];
    const ambientRainStreaks = [];

    const initDynamicEngine = () => {
      const w = canvas.width || window.innerWidth;
      const h = canvas.height || window.innerHeight;

      slidingDrops.length = 0;
      ambientRainStreaks.length = 0;

      let slidingCount = Math.floor(w / 18) + 32; // Double sliding water drops
      if (density === 'moderate') {
        slidingCount = Math.floor(w / 40) + 16;
      } else if (density === 'low') {
        slidingCount = Math.floor(w / 80) + 8;
      } else if (density === 'minimal') {
        slidingCount = Math.floor(w / 180) + 5;
      } else if (density === 'micro') {
        slidingCount = 4;
      }

      for (let i = 0; i < slidingCount; i++) {
        slidingDrops.push({
          x: Math.random() * w,
          y: Math.random() * (h + 400) - 200,
          r: Math.random() * 4.5 + 3.2,
          length: Math.random() * 12 + 7,
          baseVy: Math.random() * 3.2 + 1.8,
          vx: (Math.random() - 0.5) * 0.15,
          trail: [],
          pauseTimer: Math.floor(Math.random() * 40),
          staggerDelay: Math.floor(Math.random() * 120),
          isSliding: false
        });
      }

      for (let k = 0; k < 75; k++) {
        ambientRainStreaks.push({
          x: Math.random() * w,
          y: Math.random() * h - h,
          baseVy: Math.random() * 7 + 5,
          length: Math.random() * 7 + 4,
          baseOpacity: Math.random() * 0.16 + 0.06
        });
      }
    };

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initDewEngine();
      initDynamicEngine();
    };

    resize();
    window.addEventListener('resize', resize);

    // Render Main Canvas Animation Loop
    const render = () => {
      if (!isVisible) return;

      animationFrameId = requestAnimationFrame(render);

      const w = canvas.width;
      const h = canvas.height;
      const now = performance.now();

      const cycleTime = (now * 0.001) % 24;
      let rawStorm = 0;
      if (cycleTime < 10) {
        rawStorm = 0;
      } else if (cycleTime < 14) {
        rawStorm = (cycleTime - 10) / 4;
      } else if (cycleTime < 20) {
        rawStorm = 1.0;
      } else {
        rawStorm = 1.0 - (cycleTime - 20) / 4;
      }
      const smoothStorm = 0.5 - 0.5 * Math.cos(rawStorm * Math.PI);

      ctx.clearRect(0, 0, w, h);

      // A. Ambient Background Rain Streaks
      ctx.lineCap = 'round';
      const activeStreakCount = Math.floor(ambientRainStreaks.length * (0.25 + smoothStorm * 0.75));
      for (let k = 0; k < activeStreakCount; k++) {
        const streak = ambientRainStreaks[k];
        const currentVy = streak.baseVy * (1.0 + smoothStorm * 1.4);
        streak.y += currentVy;

        if (streak.y > h + streak.length) {
          streak.y = -streak.length;
          streak.x = Math.random() * w;
        }

        const verticalFade = Math.max(0.2, 1.0 - (Math.max(0, streak.y) / h) * 0.45);
        ctx.beginPath();
        ctx.moveTo(streak.x, streak.y);
        ctx.lineTo(streak.x, streak.y + streak.length * (1.0 + smoothStorm * 0.6));
        ctx.strokeStyle = `rgba(180, 215, 245, ${(streak.baseOpacity + smoothStorm * 0.12) * verticalFade})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // B. MULTI-TIER DYNAMIC LIFECYCLE DEW DROPS (HARDWARE ACCELERATED SPRITE BLITTING)
      const activeDewCount = Math.floor(dynamicDewDrops.length * (0.20 + smoothStorm * 0.80));
      const currentFadeSpeedMult = 1.0 + smoothStorm * 2.5;
      const currentHoldStep = 1 + Math.floor(smoothStorm * 2.0);

      for (let d = 0; d < activeDewCount; d++) {
        const dew = dynamicDewDrops[d];

        if (dew.staggerTimer > 0) {
          dew.staggerTimer--;
          continue;
        }

        const effectiveFadeSpeed = dew.baseFadeSpeed * currentFadeSpeedMult;

        if (dew.state === 'fadeIn') {
          dew.opacity += effectiveFadeSpeed;
          if (dew.opacity >= dew.maxOpacity) {
            dew.opacity = dew.maxOpacity;
            dew.state = 'hold';
          }
        } else if (dew.state === 'hold') {
          dew.holdTimer -= currentHoldStep;
          if (dew.holdTimer <= 0) {
            dew.state = 'fadeOut';
          }
        } else if (dew.state === 'fadeOut') {
          dew.opacity -= effectiveFadeSpeed;
          if (dew.opacity <= 0) {
            dew.opacity = 0;
            dew.x = Math.random() * w;
            dew.y = Math.random() * h;
            dew.r = getRandomDewRadius();
            dew.maxOpacity = Math.random() * 0.38 + 0.22;
            dew.staggerTimer = Math.floor(Math.random() * 90);
            dew.holdTimer = Math.floor(Math.random() * 60 + 50);
            dew.state = 'fadeIn';
          }
        }

        if (dew.opacity > 0) {
          const verticalDewFade = Math.max(0.3, 1.0 - (dew.y / h) * 0.35);
          const effectiveDewOpacity = dew.opacity * verticalDewFade;

          ctx.save();
          ctx.globalAlpha = effectiveDewOpacity;

          if (dew.r >= 3.5) {
            const scale = dew.r / 10;
            ctx.drawImage(beadSprite, dew.x - 16 * scale, dew.y - 16 * scale, 32 * scale, 32 * scale);
          } else {
            const scale = dew.r / 4;
            ctx.drawImage(microSprite, dew.x - 8 * scale, dew.y - 8 * scale, 16 * scale, 16 * scale);
          }

          ctx.restore();
        }
      }

      // C. Render Static Water Beads (Hardware Accelerated)
      const activeBeadCount = Math.floor(staticBeads.length * (0.25 + smoothStorm * 0.75));
      for (let b = 0; b < activeBeadCount; b++) {
        const bead = staticBeads[b];
        drawStaticWaterBead(ctx, bead.x, bead.y, bead.rx, bead.ry, bead.opacity);
      }

      // D. Render & Update Dynamic Dripping Teardrop Water Drops on Glass
      for (let i = 0; i < slidingDrops.length; i++) {
        const drop = slidingDrops[i];

        if (drop.staggerDelay > 0) {
          drop.staggerDelay--;
          continue;
        }

        const currentVy = drop.baseVy * (1.0 + smoothStorm * 1.25);

        if (drop.pauseTimer > 0) {
          drop.pauseTimer -= (1 + Math.floor(smoothStorm * 2));
          drop.isSliding = false;
        } else {
          drop.isSliding = true;
          drop.y += currentVy;
          drop.x += drop.vx;

          drop.trail.push({ x: drop.x, y: drop.y });
          if (drop.trail.length > 25) {
            drop.trail.shift();
          }

          if (Math.random() < 0.012) {
            drop.pauseTimer = Math.floor(Math.random() * 45 + 15);
          }
        }

        let dropOpacity = 0.95;

        if (dropOpacity > 0.02 && drop.y + drop.length > -10 && drop.y - drop.length < h + 50) {
          if (drop.trail.length > 1) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(drop.trail[0].x, drop.trail[0].y);
            for (let t = 1; t < drop.trail.length; t++) {
              ctx.lineTo(drop.trail[t].x, drop.trail[t].y);
            }
            ctx.strokeStyle = `rgba(160, 200, 235, ${(0.08 + smoothStorm * 0.05) * (dropOpacity / 0.95)})`;
            ctx.lineWidth = Math.max(1.2, drop.r * 0.45);
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();
          }

          drawRealDrippingWaterDrop(ctx, drop.x, drop.y, drop.r, drop.length * (1.0 + smoothStorm * 0.4), dropOpacity);
        }

        if (drop.y > h + drop.length + 50) {
          drop.y = -Math.random() * 150 - 60;
          drop.x = Math.random() * w;
          drop.trail = [];
          drop.pauseTimer = Math.floor(Math.random() * 40);

          const isCalm = Math.random() > (0.25 + smoothStorm * 0.75);
          drop.staggerDelay = isCalm ? Math.floor(Math.random() * 160 + 40) : 0;
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            animationFrameId = requestAnimationFrame(render);
          }
        } else {
          isVisible = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
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
  }, [density]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
}
