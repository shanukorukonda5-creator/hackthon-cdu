import React from 'react';

const GlassCard = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`glass-card p-6 ${hover ? 'hover:border-indigo-500/40 hover:-translate-y-1' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
