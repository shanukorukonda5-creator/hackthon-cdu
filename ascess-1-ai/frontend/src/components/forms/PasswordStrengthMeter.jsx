import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const PasswordStrengthMeter = ({ password = '' }) => {
  const criteria = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'At least 1 uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'At least 1 lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { label: 'At least 1 number (0-9)', valid: /[0-9]/.test(password) },
    { label: 'At least 1 special character (!@#$%^&*)', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const passedCount = criteria.filter((c) => c.valid).length;

  const strengthColors = {
    0: 'bg-slate-700',
    1: 'bg-red-500',
    2: 'bg-red-500',
    3: 'bg-amber-500',
    4: 'bg-indigo-500',
    5: 'bg-emerald-500',
  };

  const strengthLabels = ['Enter Password', 'Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Password Strength:</span>
        <span className="font-semibold text-slate-200">{strengthLabels[passedCount]}</span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-full transition-all duration-300 ${
              level <= passedCount ? strengthColors[passedCount] : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      <div className="space-y-1 pt-1">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-center space-x-2 text-xs">
            {c.valid ? (
              <FiCheck className="text-emerald-400 flex-shrink-0" />
            ) : (
              <FiX className="text-slate-600 flex-shrink-0" />
            )}
            <span className={c.valid ? 'text-slate-300' : 'text-slate-500'}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
