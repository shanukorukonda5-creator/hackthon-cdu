import React from 'react';
import { FiInbox } from 'react-icons/fi';
import GlassButton from './GlassButton';

const EmptyState = ({
  title = 'No Items Found',
  description = 'There are no records matching your current filter criteria.',
  icon: Icon = FiInbox,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card border border-white/10 my-4 space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl">
        <Icon />
      </div>
      <h3 className="text-base font-bold text-slate-100">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <GlassButton size="sm" variant="primary" onClick={onAction} className="mt-2">
          {actionLabel}
        </GlassButton>
      )}
    </div>
  );
};

export default EmptyState;
