import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const PasswordInput = React.forwardRef(
  ({ label, error, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiLock className="text-lg" />
          </div>

          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`glass-input w-full rounded-xl py-2.5 pl-10 pr-10 text-sm bg-slate-900/60 border border-white/10 text-slate-100 placeholder-slate-500 focus:border-indigo-500 transition-all ${
              error ? 'border-red-500 focus:border-red-500' : ''
            } ${className}`}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
