import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('glass-panel-hover')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null; // Disable custom cursor on mobile touch devices
  }

  return (
    <>
      {/* Outer Magnetic Ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-transform duration-300 ease-out border border-white ${
          isHovered ? 'scale-[2.5] bg-white/10' : 'scale-100'
        } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          width: '32px',
          height: '32px',
          transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0) scale(${
            isHovered ? 2.2 : 1
          })`,
          mixBlendMode: 'difference'
        }}
      />
      {/* Inner Crisp Dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 w-2 h-2 rounded-full bg-white transition-opacity duration-150 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
          mixBlendMode: 'difference'
        }}
      />
    </>
  );
}
