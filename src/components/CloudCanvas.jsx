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

    // Scene setup with atmospheric deep sky fog (Lower density to prevent grey mist wash)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060a, 0.0004);

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

    // Volumetric Multi-Tone Procedural HD Cloud Texture Generator (512x512 Crisp Cumulus Noise)
    const createRealisticCloudTexture = (variation = 0, type = 'dark') => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      let shadowsColor, puffColors, billowColors;

      if (type === 'dark') {
        // Deep Pitch-Black & Dark Charcoal Storm Cloud
        shadowsColor = { base: 'rgba(0, 0, 0, 0.99)', mid: 'rgba(2, 4, 8, 0.95)' };
        puffColors = [
          'rgba(45, 55, 75, 0.98)',   // Dark Slate Puff Top
          'rgba(25, 32, 45, 0.94)',   // Deep Charcoal Mid
          'rgba(12, 16, 25, 0.88)',   // Near-Black Lower
          'rgba(4, 6, 12, 0.70)',     // Pitch Black Transition
          'rgba(0, 0, 0, 0)'
        ];
        billowColors = [
          'rgba(40, 50, 68, 0.95)',
          'rgba(15, 20, 30, 0.80)',
          'rgba(0, 0, 0, 0)'
        ];
      } else if (type === 'bright') {
        // High-Contrast Fluffy Cumulus Cloud with Dark Base (512x512 HD Quality)
        shadowsColor = { base: 'rgba(15, 20, 32, 0.95)', mid: 'rgba(8, 12, 20, 0.80)' };
        puffColors = [
          'rgba(245, 250, 255, 0.99)', // Crisp Brilliant White Fluffy Top
          'rgba(215, 230, 250, 0.92)', // Fluffy Silver Mid
          'rgba(135, 155, 190, 0.75)', // Blue-Slate Transition
          'rgba(50, 65, 92, 0.45)',    // Dark Base
          'rgba(0, 0, 0, 0)'
        ];
        billowColors = [
          'rgba(230, 240, 255, 0.95)',
          'rgba(155, 175, 208, 0.60)',
          'rgba(0, 0, 0, 0)'
        ];
      } else {
        // Darkened Normal Volumetric Storm Cloud
        shadowsColor = { base: 'rgba(4, 7, 14, 0.98)', mid: 'rgba(2, 4, 9, 0.88)' };
        puffColors = [
          'rgba(110, 132, 165, 0.96)', // Dark Slate-Blue Top
          'rgba(72, 90, 122, 0.91)',   // Mid Tone
          'rgba(40, 54, 78, 0.78)',    // Dark Lower
          'rgba(18, 25, 38, 0.50)',    // Transition
          'rgba(0, 0, 0, 0)'
        ];
        billowColors = [
          'rgba(95, 115, 148, 0.92)',
          'rgba(48, 64, 92, 0.65)',
          'rgba(0, 0, 0, 0)'
        ];
      }

      // 1. Dark bottom shadow base for 3D depth (512x512 scale)
      const shadows = [
        { x: 256, y: 310, r: 170, col: shadowsColor.base },
        { x: 170, y: 330, r: 136, col: shadowsColor.base },
        { x: 344, y: 330, r: 136, col: shadowsColor.base }
      ];

      shadows.forEach(p => {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, p.col);
        grad.addColorStop(0.75, shadowsColor.mid);
        grad.addColorStop(0.95, 'rgba(0, 0, 0, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Multi-Tone Crisp Cumulus Lobes
      const whitePuffs = [
        { x: 256, y: 230, r: 156 },
        { x: 176, y: 240, r: 130 },
        { x: 336, y: 240, r: 130 },
        { x: 116, y: 276, r: 100 },
        { x: 396, y: 276, r: 100 },
        { x: 210, y: 184, r: 110 },
        { x: 300, y: 180, r: 116 },
        { x: 256, y: 160, r: 100 }
      ];

      whitePuffs.forEach(p => {
        const grad = ctx.createRadialGradient(p.x - p.r * 0.2, p.y - p.r * 0.25, 0, p.x, p.y, p.r);
        grad.addColorStop(0, puffColors[0]);
        grad.addColorStop(0.40, puffColors[1]);
        grad.addColorStop(0.75, puffColors[2]);
        grad.addColorStop(0.92, puffColors[3]);
        grad.addColorStop(1, puffColors[4]);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Fluffy Edge Billows with Sharp Contours
      const billowCount = 36;
      for (let i = 0; i < billowCount; i++) {
        const angle = (i / billowCount) * Math.PI * 2;
        const dist = 76 + Math.sin(i * 3 + variation) * 44;
        const bx = 256 + Math.cos(angle) * dist * 1.3;
        const by = 230 + Math.sin(angle) * dist * 0.75;
        const br = 42 + (i % 5) * 8;

        const grad = ctx.createRadialGradient(bx - br * 0.2, by - br * 0.2, 0, bx, by, br);
        grad.addColorStop(0, billowColors[0]);
        grad.addColorStop(0.60, billowColors[1]);
        grad.addColorStop(0.92, 'rgba(0, 0, 0, 0.1)');
        grad.addColorStop(1, billowColors[2]);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }

      return new THREE.CanvasTexture(canvas);
    };

    // Generate 6 Distinct High-Definition Cloud Textures (Dark Pitch-Black Base, Mid Storm, Bright Fluffy Top)
    const cloudTextures = [
      { tex: createRealisticCloudTexture(1, 'dark'), opacity: 0.98 },
      { tex: createRealisticCloudTexture(2, 'dark'), opacity: 0.96 },
      { tex: createRealisticCloudTexture(3, 'dark'), opacity: 0.95 },
      { tex: createRealisticCloudTexture(4, 'medium'), opacity: 0.92 },
      { tex: createRealisticCloudTexture(5, 'medium'), opacity: 0.90 },
      { tex: createRealisticCloudTexture(6, 'bright'), opacity: 0.94 }
    ];

    const cloudMaterials = cloudTextures.map(
      item =>
        new THREE.SpriteMaterial({
          map: item.tex,
          transparent: true,
          opacity: item.opacity,
          blending: THREE.NormalBlending,
          alphaTest: 0.08,
          depthWrite: false,
        })
    );

    const cloudGroup = new THREE.Group();
    const cloudParticles = [];

    // LAYER 1: Full Sky Cover Clouds (40 High-Definition Clouds - Zero GPU Lag)
    const coverCloudCount = 40;
    for (let f = 0; f < coverCloudCount; f++) {
      const baseMat = cloudMaterials[f % cloudMaterials.length];
      const mat = baseMat.clone();
      const sprite = new THREE.Sprite(mat);

      const x = (Math.random() - 0.5) * 2800;
      const y = (Math.random() - 0.5) * 1600;
      const z = 800 - Math.random() * 3200;

      sprite.position.set(x, y, z);
      const scale = 750 + Math.random() * 850;
      sprite.scale.set(scale, scale * (0.65 + Math.random() * 0.25), 1);
      sprite.material.rotation = (Math.random() - 0.5) * 0.4;

      sprite.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.0012,
        initialY: y,
        initialX: x,
        baseOpacity: baseMat.opacity,
        floatOffset: Math.random() * Math.PI * 2
      };

      cloudGroup.add(sprite);
      cloudParticles.push(sprite);
    }

    // LAYER 2: TOP & TOP-LEFT SKY CANOPY CLOUDS (30 Clouds - Top & Top-Left Coverage)
    const topCloudCount = 30;
    for (let t = 0; t < topCloudCount; t++) {
      const baseMat = cloudMaterials[t % cloudMaterials.length];
      const mat = baseMat.clone();
      const sprite = new THREE.Sprite(mat);

      const isTopLeft = Math.random() < 0.60;
      const x = isTopLeft
        ? -Math.random() * 1400 - 100
        : (Math.random() - 0.5) * 2800;
      const y = 150 + Math.random() * 650;
      const z = 700 - Math.random() * 3000;

      sprite.position.set(x, y, z);
      const scale = 750 + Math.random() * 900;
      sprite.scale.set(scale, scale * (0.6 + Math.random() * 0.3), 1);
      sprite.material.rotation = (Math.random() - 0.5) * 0.4;

      sprite.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.0012,
        initialY: y,
        initialX: x,
        baseOpacity: baseMat.opacity,
        floatOffset: Math.random() * Math.PI * 2
      };

      cloudGroup.add(sprite);
      cloudParticles.push(sprite);
    }

    // LAYER 3: Dense Lower Horizon Blanket Clouds (30 Clouds)
    const horizonCloudCount = 30;
    for (let h = 0; h < horizonCloudCount; h++) {
      const baseMat = cloudMaterials[h % cloudMaterials.length];
      const mat = baseMat.clone();
      const sprite = new THREE.Sprite(mat);

      const x = (Math.random() - 0.5) * 3200;
      const y = -350 - Math.random() * 550;
      const z = 800 - Math.random() * 3000;

      sprite.position.set(x, y, z);
      const scale = 850 + Math.random() * 1000;
      sprite.scale.set(scale, scale * 0.6, 1);
      sprite.material.rotation = (Math.random() - 0.5) * 0.3;

      sprite.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.0008,
        initialY: y,
        initialX: x,
        baseOpacity: baseMat.opacity,
        floatOffset: Math.random() * Math.PI * 2
      };

      cloudGroup.add(sprite);
      cloudParticles.push(sprite);
    }

    // LAYER 4: Deep Mid-Atmosphere Background Clouds (20 Clouds)
    const canopyCloudCount = 20;
    for (let c = 0; c < canopyCloudCount; c++) {
      const baseMat = cloudMaterials[c % cloudMaterials.length];
      const mat = baseMat.clone();
      const sprite = new THREE.Sprite(mat);

      const x = (Math.random() - 0.5) * 3000;
      const y = (Math.random() - 0.5) * 1400;
      const z = -200 - Math.random() * 2400;

      sprite.position.set(x, y, z);
      const scale = 800 + Math.random() * 900;
      sprite.scale.set(scale, scale * 0.7, 1);
      sprite.material.rotation = (Math.random() - 0.5) * 0.4;

      sprite.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.001,
        initialY: y,
        initialX: x,
        baseOpacity: baseMat.opacity,
        floatOffset: Math.random() * Math.PI * 2
      };

      cloudGroup.add(sprite);
      cloudParticles.push(sprite);
    }

    scene.add(cloudGroup);

    // Directional Sunlight & Sky Ambient Lighting (Crisp Volumetric Illumination)
    const ambientLight = new THREE.AmbientLight(0x7590b5, 0.55);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xd5e5ff, 1.1);
    sunLight.position.set(300, 600, 500);
    scene.add(sunLight);

    const shadowLight = new THREE.DirectionalLight(0x152030, 1.2);
    shadowLight.position.set(-300, -500, -300);
    scene.add(shadowLight);

    // ----------------------------------------------------
    // SUPERCHARGED OMNIDIRECTIONAL LIGHTNING ENGINE
    // ----------------------------------------------------
    const lightningLightLeft = new THREE.PointLight(0xf0f9ff, 0, 7000);
    lightningLightLeft.position.set(-900, 1000, 300);
    scene.add(lightningLightLeft);

    const lightningLightRight = new THREE.PointLight(0xf0f9ff, 0, 7000);
    lightningLightRight.position.set(900, 1000, 300);
    scene.add(lightningLightRight);

    const lightningFlashLight = new THREE.DirectionalLight(0xffffff, 0);
    lightningFlashLight.position.set(0, 1200, 600);
    scene.add(lightningFlashLight);

    // Dual Lightning Bolt Geometry (White Core + Soft Electric Ice-Blue Shell)
    const maxBoltSegments = 144;
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
    boltCoreLine.frustumCulled = false;
    scene.add(boltCoreLine);

    // Mixed White & Ice-Blue Outer Shell
    const boltGlowMat = new THREE.LineBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const boltGlowLine = new THREE.LineSegments(boltGlowGeo, boltGlowMat);
    boltGlowLine.frustumCulled = false;
    scene.add(boltGlowLine);

    let isFlashing = false;
    let flashIntensity = 0;
    let stormModeActive = true;

    // Generate dynamic multi-branched electric lightning paths with 3D Z-depth layering (front, mid, behind clouds)
    const generateLightningPath = (targetMode) => {
      const coreArray = boltCoreGeo.attributes.position.array;
      const glowArray = boltGlowGeo.attributes.position.array;

      let mode = targetMode;
      if (!mode) {
        const rand = Math.random();
        // 85% single side bolt (left/right/center), 15% dual bolt for cleaner sleek lines
        mode = rand < 0.40 ? 'left' : (rand < 0.80 ? 'right' : (rand < 0.90 ? 'center' : 'both'));
      }

      let boltStartXs = [];
      if (mode === 'left') {
        boltStartXs = [-130 + (Math.random() - 0.5) * 90];
      } else if (mode === 'right') {
        boltStartXs = [130 + (Math.random() - 0.5) * 90];
      } else if (mode === 'center') {
        boltStartXs = [(Math.random() - 0.5) * 80];
      } else {
        // 'both' -> dual strike across left and right
        boltStartXs = [
          130 + (Math.random() - 0.5) * 90,
          -130 + (Math.random() - 0.5) * 90
        ];
      }

      // Clear position arrays so inactive bolt slots don't render
      coreArray.fill(0);
      glowArray.fill(0);

      const segCount = 20; // Sleeker segment count for clean high-definition lines
      const stepY = 1300 / segCount;
      let lastBoltZ = camera.position.z - 250;

      boltStartXs.forEach((startX, boltIdx) => {
        const depthChoice = Math.random();
        let depthOffset = -250;
        if (depthChoice < 0.28) {
          depthOffset = -180; // In front of main clouds
        } else if (depthChoice < 0.58) {
          depthOffset = -600; // Inside middle cloud layer
        } else if (depthChoice < 0.82) {
          depthOffset = -1200; // Behind clouds (backlit cloud flash)
        } else {
          depthOffset = -1800; // Deep background atmosphere
        }

        // Scale X & Y by perspective distance from camera (camera Z ~800)
        const distFromCam = Math.abs(depthOffset);
        const scaleFactor = Math.min(3.2, distFromCam / 250);

        let curX = startX * scaleFactor;
        let curY = camera.position.y + 600;
        let curZ = camera.position.z + depthOffset;
        lastBoltZ = curZ;

        const segmentOffset = boltIdx * 72; // 72 line segments per bolt slot

        for (let i = 0; i < segCount; i++) {
          const nextX = curX + (Math.random() - 0.5) * (90 * scaleFactor);
          const nextY = curY - stepY;
          const nextZ = curZ + (Math.random() - 0.5) * (60 * scaleFactor);

          // Core Trunk Line 1 (Sleek single primary stroke)
          const coreIdx = (segmentOffset + i * 3) * 6;
          coreArray[coreIdx + 0] = curX;
          coreArray[coreIdx + 1] = curY;
          coreArray[coreIdx + 2] = curZ;
          coreArray[coreIdx + 3] = nextX;
          coreArray[coreIdx + 4] = nextY;
          coreArray[coreIdx + 5] = nextZ;

          // Core Trunk Line 2 (Clean parallel connection)
          coreArray[coreIdx + 6] = curX;
          coreArray[coreIdx + 7] = curY;
          coreArray[coreIdx + 8] = curZ;
          coreArray[coreIdx + 9] = nextX;
          coreArray[coreIdx + 10] = nextY;
          coreArray[coreIdx + 11] = nextZ;

          // Glow Shell (Clean soft aura stroke)
          const glowIdx = (segmentOffset + i * 3) * 6;
          glowArray[glowIdx + 0] = curX;
          glowArray[glowIdx + 1] = curY;
          glowArray[glowIdx + 2] = curZ;
          glowArray[glowIdx + 3] = nextX;
          glowArray[glowIdx + 4] = nextY;
          glowArray[glowIdx + 5] = nextZ;

          glowArray[glowIdx + 6] = curX + (Math.random() - 0.5) * (14 * scaleFactor);
          glowArray[glowIdx + 7] = curY;
          glowArray[glowIdx + 8] = curZ + (Math.random() - 0.5) * (14 * scaleFactor);
          glowArray[glowIdx + 9] = nextX + (Math.random() - 0.5) * (14 * scaleFactor);
          glowArray[glowIdx + 10] = nextY;
          glowArray[glowIdx + 11] = nextZ + (Math.random() - 0.5) * (14 * scaleFactor);

          // Branching Thunderbolt Forks (Reduced to ~18% chance for clean minimal lines)
          if (i > 4 && i < 16 && Math.random() > 0.82) {
            const branchDir = startX > 0 ? 1 : -1;
            const branchX = nextX + branchDir * (Math.random() * 100 + 25) * scaleFactor;
            const branchY = nextY - stepY * 0.7;
            const branchZ = nextZ + (Math.random() - 0.5) * (80 * scaleFactor);

            coreArray[coreIdx + 12] = nextX;
            coreArray[coreIdx + 13] = nextY;
            coreArray[coreIdx + 14] = nextZ;
            coreArray[coreIdx + 15] = branchX;
            coreArray[coreIdx + 16] = branchY;
            coreArray[coreIdx + 17] = branchZ;

            glowArray[glowIdx + 12] = nextX;
            glowArray[glowIdx + 13] = nextY;
            glowArray[glowIdx + 14] = nextZ;
            glowArray[glowIdx + 15] = branchX + branchDir * 10 * scaleFactor;
            glowArray[glowIdx + 16] = branchY;
            glowArray[glowIdx + 17] = branchZ + 10 * scaleFactor;
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
      });

      boltCoreGeo.attributes.position.needsUpdate = true;
      boltGlowGeo.attributes.position.needsUpdate = true;
      lightningLightLeft.position.set(-350, camera.position.y + 350, lastBoltZ);
      lightningLightRight.position.set(350, camera.position.y + 350, lastBoltZ);
      lightningFlashLight.position.set(0, camera.position.y + 500, camera.position.z + 100);
    };

    // DYNAMIC STAGGERED MULTI-BURST LIGHTNING STRIKE SEQUENCE
    const triggerLightningStrike = () => {
      if (!stormModeActive) return;

      // Pick staggered sequence of locations (e.g. Left -> Right -> Center)
      const sidesPool = ['left', 'right', 'center'];
      const firstSide = sidesPool[Math.floor(Math.random() * sidesPool.length)];
      const secondSide = firstSide === 'left' ? 'right' : (firstSide === 'right' ? 'left' : (Math.random() > 0.5 ? 'left' : 'right'));
      const finalSide = Math.random() < 0.2 ? 'both' : (Math.random() > 0.5 ? 'left' : 'right');

      // Strike 1 (Initial light burst + sleek bolt line)
      generateLightningPath(firstSide);
      isFlashing = true;
      flashIntensity = 40.0;
      boltCoreMat.opacity = 0.85;
      boltGlowMat.opacity = 0.65;

      window.dispatchEvent(new CustomEvent('trigger-lightning-strike'));

      if (flashOverlayRef.current) {
        flashOverlayRef.current.style.opacity = '0.45';
        setTimeout(() => {
          if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0.15';
        }, 40);
      }

      // Strike 2 (Staggered 70ms later on opposite side!)
      setTimeout(() => {
        generateLightningPath(secondSide);
        flashIntensity = 32.0;
        boltCoreMat.opacity = 0.75;
        boltGlowMat.opacity = 0.55;

        if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0.40';

        // Strike 3 (Climax light burst 60ms later!)
        setTimeout(() => {
          generateLightningPath(finalSide);
          flashIntensity = 65.0;
          boltCoreMat.opacity = 0.90;
          boltGlowMat.opacity = 0.70;

          if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0.70';

          setTimeout(() => {
            if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0.18';
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
          clearRatio = (0.5 - 0.5 * Math.cos(p * Math.PI)) * 0.25; // Subtle 25% max drift
        } else {
          clearRatio = 0.25;
        }

        // Keep clouds 100% crisp, rich & visible throughout all sections
        cloudParticles.forEach((particle) => {
          const bOp = particle.userData.baseOpacity || 0.90;
          particle.material.opacity = bOp;

          const shiftAmount = clearRatio * 80; // Gentle 3D parallax drift
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

      // Dynamically move clouds downward as user scrolls down the entire page
      const scrollMax = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const scrollRatio = window.scrollY / scrollMax;
      cloudGroup.position.y = -scrollRatio * 750;

      cloudParticles.forEach((particle) => {
        particle.material.rotation += particle.userData.rotationSpeed;
        particle.position.y =
          particle.userData.initialY + Math.sin(elapsedTime * 0.5 + particle.userData.floatOffset) * 12;
      });



      // ----------------------------------------------------
      // HIGH-POWER LIGHTNING FLASH LIGHTING (BALANCED OMNIDIRECTIONAL)
      // ----------------------------------------------------
      lightningLightLeft.intensity = flashIntensity * 3.5;
      lightningLightRight.intensity = flashIntensity * 3.5;
      lightningFlashLight.intensity = flashIntensity * 3.5;

      if (isFlashing) {
        scene.fog.color.setHex(flashIntensity > 40 ? 0xbae6fd : 0x1e293b);
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
        className="fixed inset-0 z-15 pointer-events-none bg-sky-50/30 mix-blend-screen transition-opacity duration-75 ease-out"
        style={{ opacity: 0 }}
      />
    </>
  );
}



