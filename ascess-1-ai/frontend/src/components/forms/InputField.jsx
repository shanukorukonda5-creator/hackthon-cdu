import React from 'react';

const InputField = React.forwardRef(
  ({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="text-lg" />
            </div>
          )}
          <input
            ref={ref}
            className={`glass-input w-full rounded-xl py-2.5 ${
              Icon ? 'pl-10' : 'pl-4'
            } pr-4 text-sm bg-slate-900/60 border border-white/10 text-slate-100 placeholder-slate-500 focus:border-indigo-500 transition-all ${
              error ? 'border-red-500 focus:border-red-500' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
