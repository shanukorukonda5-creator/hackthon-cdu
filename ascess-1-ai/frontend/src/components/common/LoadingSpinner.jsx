import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} border-indigo-500 border-t-transparent rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          {spinner}
          <p className="text-slate-400 font-medium text-sm">Loading ascess-1-ai...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
