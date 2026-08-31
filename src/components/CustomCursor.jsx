import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return; // Disable custom cursor on mobile touch devices
    }

    let mouseX = -100;
    let mouseY = -100;
    let rafId = null;

    const updateDOM = () => {
      const scale = isHoveredRef.current ? 2.2 : 1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${mouseX - 16}px, ${mouseY - 16}px, 0) scale(${scale})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      }
      rafId = null;
    };

    const updatePosition = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(updateDOM);
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        (target.classList && target.classList.contains('glass-panel-hover'));

      isHoveredRef.current = !!isInteractive;
      if (!rafId) {
        rafId = requestAnimationFrame(updateDOM);
      }
    };

    const handleMouseLeave = () => {
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (ringRef.current) ringRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      {/* Outer Magnetic Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-transform duration-150 ease-out border border-white/60 bg-white/10 opacity-100 will-change-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        style={{
          width: '32px',
          height: '32px',
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      />
      {/* Inner Crisp Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-50 w-2 h-2 rounded-full bg-white opacity-100 will-change-transform shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        style={{
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      />
    </>
  );
}

