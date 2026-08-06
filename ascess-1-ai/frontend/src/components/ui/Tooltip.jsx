import React, { useState } from 'react';

const Tooltip = ({ text, children, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`absolute ${positionClasses[position]} px-2.5 py-1 text-xs font-medium text-white bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none animate-fadeIn`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
