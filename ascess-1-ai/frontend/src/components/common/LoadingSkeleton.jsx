import React from 'react';

const LoadingSkeleton = ({ count = 3, height = 'h-16', className = '' }) => {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`${height} bg-slate-800/60 rounded-xl border border-white/5 ${className}`}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
