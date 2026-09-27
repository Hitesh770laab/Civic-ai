import React from 'react';
import { useScrollProgress } from '../hooks/useAnimations';

export default function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        background: 'transparent',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #10B981, #06B6D4, #3B82F6, #10B981)',
          backgroundSize: '200% 100%',
          animation: 'gradientShift 3s ease infinite',
          borderRadius: '0 2px 2px 0',
          boxShadow: `0 0 12px rgba(16, 185, 129, 0.7), 0 0 25px rgba(14, 165, 233, 0.4)`,
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
}
