import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

const ReadingRuler = () => {
  const { readingRuler } = useAccessibility();
  const [mousePosY, setMousePosY] = useState(0);

  useEffect(() => {
    if (!readingRuler) return;

    const handleMouseMove = (e) => {
      setMousePosY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingRuler]);

  if (!readingRuler) return null;

  return (
    <div
      style={{ top: `${mousePosY - 20}px` }}
      className="fixed left-0 right-0 h-10 pointer-events-none z-50 bg-amber-400/20 border-y-2 border-amber-400/60 backdrop-blur-[1px] shadow-lg transition-all duration-75"
    />
  );
};

export default ReadingRuler;
