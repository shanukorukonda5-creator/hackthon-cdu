import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import GlassButton from './GlassButton';

const ErrorState = ({
  title = 'System Error Occurred',
  message = 'We encountered an error loading this component.',
  onRetry,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3 my-4">
      <FiAlertCircle className="text-rose-400 text-3xl mx-auto" />
      <h4 className="text-sm font-bold text-slate-100">{title}</h4>
      <p className="text-xs text-slate-400 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <GlassButton size="sm" variant="danger" onClick={onRetry} className="mt-2">
          Retry Request
        </GlassButton>
      )}
    </div>
  );
};

export default ErrorState;
