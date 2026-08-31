import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CloudCanvas({ onScrollProgress }) {
  const mountRef = useRef(null);
  const flashOverlayRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup with atmospheric deep sky fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c101c, 0.001);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      3500
    );
    camera.position.set(0, 0, 800);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Volumetric Procedural Cloud Texture Generator (Optimized 256x256 canvas for zero TBT)
    const createRealisticCloudTexture = (variation = 0) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Dark bottom shadow base for 3D depth
      const shadows = [
        { x: 128, y: 155, r: 85, col: 'rgba(30, 40, 60, 0.75)' },
        { x: 85, y: 165, r: 68, col: 'rgba(25, 35, 55, 0.65)' },
        { x: 172, y: 165, r: 68, col: 'rgba(25, 35, 55, 0.65)' }
      ];

      shadows.forEach(p => {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, p.col);
        grad.addColorStop(0.7, 'rgba(20, 30, 50, 0.3)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // White Cumulus Lobes
      const whitePuffs = [
        { x: 128, y: 115, r: 78 },
        { x: 88, y: 120, r: 65 },
        { x: 168, y: 120, r: 65 },
        { x: 58, y: 138, r: 50 },
        { x: 198, y: 138, r: 50 },
        { x: 105, y: 92, r: 55 },
        { x: 150, y: 90, r: 58 },
        { x: 128, y: 80, r: 50 }
      ];

      whitePuffs.forEach(p => {
        const grad = ctx.createRadialGradient(p.x - p.r * 0.2, p.y - p.r * 0.25, 0, p.x, p.y, p.r);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
        grad.addColorStop(0.35, 'rgba(240, 246, 255, 0.85)');
        grad.addColorStop(0.7, 'rgba(180, 195, 220, 0.4)');
        grad.addColorStop(0.9, 'rgba(120, 138, 170, 0.12)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Fluffy Edge Billows
      const billowCount = 24;
      for (let i = 0; i < billowCount; i++) {
        const angle = (i / billowCount) * Math.PI * 2;
        const dist = 38 + Math.sin(i * 3 + variation) * 22;
        const bx = 128 + Math.cos(angle) * dist * 1.3;
        const by = 115 + Math.sin(angle) * dist * 0.75;
        const br = 21 + (i % 5) * 4;

        const grad = ctx.createRadialGradient(bx - br * 0.2, by - br * 0.2, 0, bx, by, br);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        grad.addColorStop(0.5, 'rgba(220, 232, 250, 0.35)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }

      return new THREE.CanvasTexture(canvas);
    };

    const cloudTextures = [
      createRealisticCloudTexture(1),
      createRealisticCloudTexture(2),
      createRealisticCloudTexture(3)
    ];

    const cloudMaterials = cloudTextures.map(
      tex =>
        new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          opacity: 0.94,
          blending: THREE.NormalBlending,
          depthWrite: false,
        })
    );

    const cloudGroup = new THREE.Group();
    const cloudParticles = [];

    // LAYER 1: Dense Cover Clouds (Using cloned materials for individual opacity control)
    const coverCloudCount = 90;
    for (let f = 0; f < coverCloudCount; f++) {
      const baseMat = cloudMaterials[f % cloudMaterials.length];
      const mat = baseMat.clone();
      const sprite = new THREE.Sprite(mat);

      const x = (Math.random() - 0.5) * 2600;
      const y = (Math.random() - 0.5) * 1600;
      const z = 900 - Math.random() * 3800;

      sprite.position.set(x, y, z);
      const scale = 750 + Math.random() * 850;
      sprite.scale.set(scale, scale * (0.65 + Math.random() * 0.25), 1);
      sprite.material.rotation = (Math.random() - 0.5) * 0.5;

      sprite.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.0012,
        initialY: y,
        initialX: x,
        floatOffset: Math.random() * Math.PI * 2
      };

      cloudGroup.add(sprite);
      cloudParticles.push(sprite);
    }

    // LAYER 2: Background Canopy Clouds
    const canopyCloudCount = 40;
    for (let c = 0; c < canopyCloudCount; c++) {
      const baseMat = cloudMaterials[c % cloudMaterials.length];
      const mat = baseMat.clone();
      const sprite = new THREE.Sprite(mat);

      const x = (Math.random() - 0.5) * 2400;
      const y = (Math.random() - 0.5) * 1400;
      const z = -200 - Math.random() * 2400;

      sprite.position.set(x, y, z);
      const scale = 750 + Math.random() * 800;
      sprite.scale.set(scale, scale * 0.7, 1);
      sprite.material.rotation = (Math.random() - 0.5) * 0.4;

      sprite.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.001,
        initialY: y,
        initialX: x,
        floatOffset: Math.random() * Math.PI * 2
      };

      cloudGroup.add(sprite);
      cloudParticles.push(sprite);
    }

    scene.add(cloudGroup);

    // Directional Sunlight & Sky Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xd4e4ff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaee, 1.9);
    sunLight.position.set(300, 600, 500);
    scene.add(sunLight);

    const shadowLight = new THREE.DirectionalLight(0x354565, 1.0);
    shadowLight.position.set(-300, -500, -300);
    scene.add(shadowLight);

    // ----------------------------------------------------
    // SUPERCHARGED HIGH-POWER LIGHTNING (BIJLI) ENGINE
    // ----------------------------------------------------
    const lightningLight = new THREE.PointLight(0xe0f2fe, 0, 6000);
    lightningLight.position.set(0, 1000, 300);
    scene.add(lightningLight);

    const lightningFlashLight = new THREE.DirectionalLight(0xf0f9ff, 0);
    lightningFlashLight.position.set(0, 1200, 600);
    scene.add(lightningFlashLight);

    // Dual Lightning Bolt Geometry (White Core + Glowing Electric Cyan Shell)
    const maxBoltSegments = 72;
    const boltCorePositions = new Float32Array(maxBoltSegments * 6);
    const boltGlowPositions = new Float32Array(maxBoltSegments * 6);

    const boltCoreGeo = new THREE.BufferGeometry();
    boltCoreGeo.setAttribute('position', new THREE.BufferAttribute(boltCorePositions, 3));

    const boltGlowGeo = new THREE.BufferGeometry();
    boltGlowGeo.setAttribute('position', new THREE.BufferAttribute(boltGlowPositions, 3));

    // Pure White Inner Thunderbolt Core
    const boltCoreMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const boltCoreLine = new THREE.LineSegments(boltCoreGeo, boltCoreMat);
    scene.add(boltCoreLine);

    // Cyan Outer Electric Aura Shell
    const boltGlowMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const boltGlowLine = new THREE.LineSegments(boltGlowGeo, boltGlowMat);
    scene.add(boltGlowLine);

    let isFlashing = false;
    let flashIntensity = 0;
    let stormModeActive = true;

    // Generate heavy multi-branched electric lightning path right in front of camera
    const generateLightningPath = () => {
      const startX = (Math.random() - 0.5) * 1000;
      const startY = camera.position.y + 600;
      const startZ = camera.position.z - 250;

      let curX = startX;
      let curY = startY;
      let curZ = startZ;

      const coreArray = boltCoreGeo.attributes.position.array;
      const glowArray = boltGlowGeo.attributes.position.array;

      const segCount = 24;
      const stepY = 1300 / segCount;

      for (let i = 0; i < segCount; i++) {
        const nextX = curX + (Math.random() - 0.5) * 240;
        const nextY = curY - stepY;
        const nextZ = curZ + (Math.random() - 0.5) * 140;

        // Core Trunk (Thick 3D jittered stroke bundle)
        const coreIdx = (i * 3) * 6;
        coreArray[coreIdx + 0] = curX;
        coreArray[coreIdx + 1] = curY;
        coreArray[coreIdx + 2] = curZ;
        coreArray[coreIdx + 3] = nextX;
        coreArray[coreIdx + 4] = nextY;
        coreArray[coreIdx + 5] = nextZ;

        coreArray[coreIdx + 6] = curX + (Math.random() - 0.5) * 8;
        coreArray[coreIdx + 7] = curY;
        coreArray[coreIdx + 8] = curZ + (Math.random() - 0.5) * 8;
        coreArray[coreIdx + 9] = nextX + (Math.random() - 0.5) * 8;
        coreArray[coreIdx + 10] = nextY;
        coreArray[coreIdx + 11] = nextZ + (Math.random() - 0.5) * 8;

        // Glow Shell (Expanded 3D aura stroke bundle)
        const glowIdx = (i * 3) * 6;
        glowArray[glowIdx + 0] = curX + (Math.random() - 0.5) * 20;
        glowArray[glowIdx + 1] = curY;
        glowArray[glowIdx + 2] = curZ + (Math.random() - 0.5) * 20;
        glowArray[glowIdx + 3] = nextX + (Math.random() - 0.5) * 20;
        glowArray[glowIdx + 4] = nextY;
        glowArray[glowIdx + 5] = nextZ + (Math.random() - 0.5) * 20;

        glowArray[glowIdx + 6] = curX + (Math.random() - 0.5) * 35;
        glowArray[glowIdx + 7] = curY;
        glowArray[glowIdx + 8] = curZ + (Math.random() - 0.5) * 35;
        glowArray[glowIdx + 9] = nextX + (Math.random() - 0.5) * 35;
        glowArray[glowIdx + 10] = nextY;
        glowArray[glowIdx + 11] = nextZ + (Math.random() - 0.5) * 35;

        // Branching Thunderbolt Forks
        if (i > 3 && i < 20 && Math.random() > 0.3) {
          const branchX = nextX + (Math.random() - 0.5) * 320;
          const branchY = nextY - stepY * 0.8;
          const branchZ = nextZ + (Math.random() - 0.5) * 180;

          coreArray[coreIdx + 12] = nextX;
          coreArray[coreIdx + 13] = nextY;
          coreArray[coreIdx + 14] = nextZ;
          coreArray[coreIdx + 15] = branchX;
          coreArray[coreIdx + 16] = branchY;
          coreArray[coreIdx + 17] = branchZ;

          glowArray[glowIdx + 12] = nextX;
          glowArray[glowIdx + 13] = nextY;
          glowArray[glowIdx + 14] = nextZ;
          glowArray[glowIdx + 15] = branchX + 20;
          glowArray[glowIdx + 16] = branchY;
          glowArray[glowIdx + 17] = branchZ + 20;
        } else {
          coreArray[coreIdx + 12] = nextX;
          coreArray[coreIdx + 13] = nextY;
          coreArray[coreIdx + 14] = nextZ;
          coreArray[coreIdx + 15] = nextX;
          coreArray[coreIdx + 16] = nextY;
          coreArray[coreIdx + 17] = nextZ;

          glowArray[glowIdx + 12] = nextX;
          glowArray[glowIdx + 13] = nextY;
          glowArray[glowIdx + 14] = nextZ;
          glowArray[glowIdx + 15] = nextX;
          glowArray[glowIdx + 16] = nextY;
          glowArray[glowIdx + 17] = nextZ;
        }

        curX = nextX;
        curY = nextY;
        curZ = nextZ;
      }

      boltCoreGeo.attributes.position.needsUpdate = true;
      boltGlowGeo.attributes.position.needsUpdate = true;
      lightningLight.position.set(startX, camera.position.y + 300, startZ);
      lightningFlashLight.position.set(0, camera.position.y + 400, camera.position.z);
    };

    // HIGH-POWER TRIPLE-BURST LIGHTNING STRIKE SEQUENCE
    const triggerLightningStrike = () => {
      if (!stormModeActive) return;
      generateLightningPath();
      isFlashing = true;

      // Dispatch event to render sharp electric lightning bolt lines on overlay
      window.dispatchEvent(new CustomEvent('trigger-lightning-strike'));

      // Trigger Screen Flash Overlay
      if (flashOverlayRef.current) {
        flashOverlayRef.current.style.opacity = '0.55';
        setTimeout(() => {
          if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0.15';
        }, 50);
      }

      // Strike 1 (Sudden Massive Shockwave: 40 Power)
      flashIntensity = 40.0;
      boltCoreMat.opacity = 1.0;
      boltGlowMat.opacity = 0.9;

      setTimeout(() => {
        flashIntensity = 8.0;
        boltCoreMat.opacity = 0.3;
        boltGlowMat.opacity = 0.3;

        // Strike 2 (Secondary Pre-Shock Burst: 25 Power)
        setTimeout(() => {
          generateLightningPath();
          flashIntensity = 25.0;
          boltCoreMat.opacity = 0.8;
          boltGlowMat.opacity = 0.8;

          if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0.4';

          // Strike 3 (SUPER POWER MAIN THUNDERBOLT BURST: 65.0 MAX POWER!)
          setTimeout(() => {
            generateLightningPath();
            flashIntensity = 65.0;
            boltCoreMat.opacity = 1.0;
            boltGlowMat.opacity = 1.0;

            if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0.75';

            setTimeout(() => {
              if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0.2';
              const fadeOut = setInterval(() => {
                flashIntensity *= 0.62;
                boltCoreMat.opacity *= 0.62;
                boltGlowMat.opacity *= 0.62;

                if (flashOverlayRef.current) {
                  const curOp = parseFloat(flashOverlayRef.current.style.opacity || '0');
                  flashOverlayRef.current.style.opacity = Math.max(0, curOp * 0.6).toString();
                }

                if (flashIntensity < 0.2) {
                  flashIntensity = 0;
                  boltCoreMat.opacity = 0;
                  boltGlowMat.opacity = 0;
                  isFlashing = false;
                  if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0';
                  clearInterval(fadeOut);
                }
              }, 30);
            }, 80);
          }, 40);
        }, 60);
      }, 70);
    };

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.3;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // GSAP ScrollTrigger Cinematic 3D Cloud & Storm Animation
    const st = ScrollTrigger.create({
      trigger: '#cloud-hero-trigger',
      start: 'top top',
      end: '+=2800',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        cloudGroup.rotation.y = Math.sin(progress * Math.PI * 0.8) * 0.35;
        cloudGroup.rotation.x = Math.sin(progress * Math.PI) * 0.08;

        let clearRatio = 0;
        if (progress <= 0.28) {
          clearRatio = 0;
        } else if (progress > 0.28 && progress <= 0.74) {
          const p = (progress - 0.28) / 0.46;
          clearRatio = 0.5 - 0.5 * Math.cos(p * Math.PI);
        } else if (progress > 0.74 && progress <= 0.84) {
          clearRatio = 1.0;
        } else {
          // Continuous Cosine Smooth Transition from 1.0 -> 0.45 without any jerk
          const p = Math.min(1.0, (progress - 0.84) / 0.16);
          const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);
          clearRatio = 1.0 - smoothP * 0.55;
        }

        // Keep cloud brightness rich & visible as user enters About section (progress > 0.65)
        let sectionDim = 1.0;
        if (progress > 0.65) {
          const dimProgress = Math.min(1.0, (progress - 0.65) / 0.25);
          const smoothDim = 0.5 - 0.5 * Math.cos(dimProgress * Math.PI);
          sectionDim = 1.0 - smoothDim * 0.25; // Smoothly dims to 0.75 rich cloud opacity
        }

        cloudParticles.forEach((particle) => {
          particle.position.y = particle.userData.initialY + progress * 480;
          particle.material.opacity = (0.94 - clearRatio * 0.50) * sectionDim;

          const shiftAmount = clearRatio * 320;
          if (particle.userData.initialX < 0) {
            particle.position.x = particle.userData.initialX - shiftAmount;
          } else {
            particle.position.x = particle.userData.initialX + shiftAmount;
          }
        });

        let targetCamZ = 850;
        let targetCamY = 0;
        let targetCamRotX = 0;
        let targetCamFov = 60;

        if (progress <= 0.35) {
          const p = progress / 0.35;
          const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);
          targetCamZ = 850 - smoothP * 300;
          targetCamY = smoothP * 80;
          targetCamRotX = smoothP * 0.05;
          targetCamFov = 60 + smoothP * 4;
        } else if (progress > 0.35 && progress <= 0.72) {
          const p = (progress - 0.35) / 0.37;
          const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);
          targetCamZ = 550 - smoothP * 300;
          targetCamY = 80 - smoothP * 160;
          targetCamRotX = 0.05 - smoothP * 0.08;
          targetCamFov = 64 + smoothP * 3;
        } else if (progress > 0.72 && progress <= 0.84) {
          const p = (progress - 0.72) / 0.12;
          const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);
          targetCamZ = 250 - smoothP * 200;
          targetCamY = -80 + smoothP * 40;
          targetCamRotX = 0;
          targetCamFov = 67;
        } else {
          // Smooth continuous camera easing into About section
          const p = Math.min(1.0, (progress - 0.84) / 0.16);
          const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);
          targetCamZ = 50 - smoothP * 150;
          targetCamY = -40 - smoothP * 20;
          targetCamRotX = 0;
          targetCamFov = 67 + smoothP * 3;
        }

        camera.position.z = targetCamZ;
        camera.position.y = targetCamY;
        camera.rotation.x = targetCamRotX;
        camera.fov = targetCamFov;

        stormModeActive = true;

        camera.updateProjectionMatrix();

        if (mountRef.current) {
          mountRef.current.style.opacity = '1';
          mountRef.current.style.pointerEvents = 'none';
        }

        let lastReportedProgress = -1;
        if (onScrollProgress && Math.abs(progress - lastReportedProgress) > 0.002) {
          lastReportedProgress = progress;
          onScrollProgress(progress);
        }
      }
    });

    // HIGH-FREQUENCY LIGHTNING TIMER (Triggers every 1.8s to 3.8s for intense storm action!)
    let lightningTimer = null;
    const scheduleNextLightning = () => {
      const delay = 1800 + Math.random() * 2000;
      lightningTimer = setTimeout(() => {
        if (stormModeActive) {
          triggerLightningStrike();
        }
        scheduleNextLightning();
      }, delay);
    };
    scheduleNextLightning();

    // Animation Loop
    let animationFrameId;
    let isTabActive = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isTabActive) return;
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      camera.position.x = mouseX * 0.4;

      cloudParticles.forEach((particle) => {
        particle.material.rotation += particle.userData.rotationSpeed;
        particle.position.y =
          particle.userData.initialY + Math.sin(elapsedTime * 0.5 + particle.userData.floatOffset) * 12;
      });



      // ----------------------------------------------------
      // HIGH-POWER LIGHTNING FLASH LIGHTING
      // ----------------------------------------------------
      lightningLight.intensity = flashIntensity * 4.5;
      lightningFlashLight.intensity = flashIntensity * 3.5;

      if (isFlashing) {
        scene.fog.color.setHex(flashIntensity > 40 ? 0x38bdf8 : 0x1e293b);
        ambientLight.intensity = 0.8 + flashIntensity * 0.45;
      } else {
        scene.fog.color.setHex(0x0c101c);
        ambientLight.intensity = 0.8;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Visibility change handler (pauses Three.js loop when tab is hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isTabActive = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        if (!isTabActive) {
          isTabActive = true;
          clock.getDelta(); // reset delta to prevent jump
          animate();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (lightningTimer) clearTimeout(lightningTimer);
      cancelAnimationFrame(animationFrameId);
      st.kill();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };

  }, [onScrollProgress]);

  return (
    <>
      {/* 3D WebGL Canvas Engine */}
      <div
        ref={mountRef}
        className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-300 ease-out"
        style={{ opacity: 1 }}
      />
      {/* Lightning Screen Flash Burst Overlay */}
      <div
        ref={flashOverlayRef}
        className="fixed inset-0 z-15 pointer-events-none bg-sky-200/40 mix-blend-screen transition-opacity duration-75 ease-out"
        style={{ opacity: 0 }}
      />
    </>
  );
}



