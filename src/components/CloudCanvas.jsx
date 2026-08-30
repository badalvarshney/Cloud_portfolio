import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CloudCanvas({ onScrollProgress }) {
  const mountRef = useRef(null);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Volumetric Procedural Cloud Texture Generator
    const createRealisticCloudTexture = (variation = 0) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 512, 512);

      // Dark bottom shadow base for 3D depth
      const shadows = [
        { x: 256, y: 310, r: 170, col: 'rgba(40, 50, 70, 0.7)' },
        { x: 170, y: 330, r: 135, col: 'rgba(35, 45, 65, 0.6)' },
        { x: 345, y: 330, r: 135, col: 'rgba(35, 45, 65, 0.6)' }
      ];

      shadows.forEach(p => {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, p.col);
        grad.addColorStop(0.7, 'rgba(25, 35, 55, 0.25)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // White Cumulus Lobes
      const whitePuffs = [
        { x: 256, y: 230, r: 155 },
        { x: 175, y: 240, r: 130 },
        { x: 335, y: 240, r: 130 },
        { x: 115, y: 275, r: 100 },
        { x: 395, y: 275, r: 100 },
        { x: 210, y: 185, r: 110 },
        { x: 300, y: 180, r: 115 },
        { x: 256, y: 160, r: 100 }
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
      const billowCount = 28;
      for (let i = 0; i < billowCount; i++) {
        const angle = (i / billowCount) * Math.PI * 2;
        const dist = 75 + Math.sin(i * 3 + variation) * 45;
        const bx = 256 + Math.cos(angle) * dist * 1.3;
        const by = 230 + Math.sin(angle) * dist * 0.75;
        const br = 42 + (i % 5) * 8;

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

    // LAYER 1: Dense Full-Screen Cover Cloud Deck (Z: +900 to -3600)
    const coverCloudCount = 110;
    for (let f = 0; f < coverCloudCount; f++) {
      const mat = cloudMaterials[f % cloudMaterials.length];
      const sprite = new THREE.Sprite(mat.clone());

      const x = (Math.random() - 0.5) * 2600;
      const y = (Math.random() - 0.5) * 1600;
      const z = 900 - Math.random() * 3800; // Deep Z distribution from +900 down to -2900

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

    // LAYER 2: Upward & Background Canopy Clouds
    const canopyCloudCount = 50;
    for (let c = 0; c < canopyCloudCount; c++) {
      const mat = cloudMaterials[c % cloudMaterials.length];
      const sprite = new THREE.Sprite(mat.clone());

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

    // GSAP ScrollTrigger Camera Animation & Sideways Cloud Parting:
    // Phase 1 (0 to 0.38): Clouds & WELCOME split left & right sideways
    // Phase 2 (0.38 to 0.93): Camera stays enveloped inside clouds behind BADAL VARSHNEY title
    // Phase 3 (0.93 to 1.0): Canvas opacity fades out ONLY when transitioning into About section
    const st = ScrollTrigger.create({
      trigger: '#cloud-hero-trigger',
      start: 'top top',
      end: '+=2400',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Sideways 3D Cloud Parting (0 to 0.38)
        if (progress <= 0.38) {
          const partRatio = progress / 0.38;
          cloudParticles.forEach((particle) => {
            if (particle.userData.initialX < 0) {
              particle.position.x = particle.userData.initialX - partRatio * 450;
            } else {
              particle.position.x = particle.userData.initialX + partRatio * 450;
            }
          });
        }

        if (progress <= 0.35) {
          // Ascent & initial flight
          const p = progress / 0.35;
          camera.position.y = p * 180;
          camera.position.z = 800 - p * 350;
          camera.rotation.x = p * 0.15;
          camera.fov = 60 + p * 5;
        } else if (progress > 0.35 && progress <= 0.93) {
          // BADAL VARSHNEY state: camera stays inside cloud deck so clouds fill background
          const p = (progress - 0.35) / 0.58;
          camera.position.y = 180 * (1 - p);
          camera.position.z = 450 - p * 550;
          camera.rotation.x = 0.15 * (1 - p);
          camera.fov = 65;
        } else {
          // Transition phase into next section (About section)
          const p = (progress - 0.93) / 0.07;
          camera.position.z = -100 - p * 300;
          camera.rotation.x = 0;
          camera.fov = 70;
        }

        camera.updateProjectionMatrix();

        // Canvas opacity fadeout ONLY when transitioning into the next section (About section: progress > 0.93)
        if (mountRef.current) {
          if (progress > 0.93) {
            const fade = (progress - 0.93) / 0.07;
            mountRef.current.style.opacity = Math.max(0, 1 - fade).toString();
            mountRef.current.style.pointerEvents = 'none';
          } else {
            mountRef.current.style.opacity = '1';
          }
        }

        if (onScrollProgress) {
          onScrollProgress(progress);
        }
      }
    });

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 0.4;

      // Slow organic rotation & floating of cloud particles
      cloudParticles.forEach((particle) => {
        particle.material.rotation += particle.userData.rotationSpeed;
        particle.position.y =
          particle.userData.initialY + Math.sin(elapsedTime * 0.5 + particle.userData.floatOffset) * 12;
      });

      renderer.render(scene, camera);
    };

    animate();

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
      cancelAnimationFrame(animationFrameId);
      st.kill();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [onScrollProgress]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-300 ease-out"
      style={{ opacity: 1 }}
    />
  );
}

