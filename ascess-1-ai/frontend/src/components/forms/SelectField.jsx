import React from 'react';

const SelectField = React.forwardRef(
  ({ label, error, options = [], className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`glass-input w-full rounded-xl py-2.5 px-4 text-sm bg-slate-900/60 border border-white/10 text-slate-100 focus:border-indigo-500 transition-all ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

export default SelectField;
