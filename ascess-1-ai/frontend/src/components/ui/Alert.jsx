import React from 'react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';

const Alert = ({ type = 'info', title, children, className = '' }) => {
  const styles = {
    info: {
      bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
      icon: FiInfo,
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
      icon: FiCheckCircle,
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      icon: FiAlertTriangle,
    },
    danger: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
      icon: FiAlertCircle,
    },
  };

  const current = styles[type] || styles.info;
  const Icon = current.icon;

  return (
    <div className={`p-4 rounded-2xl border ${current.bg} flex items-start space-x-3 text-sm ${className}`}>
      <Icon className="text-xl flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && <h4 className="font-bold text-slate-100">{title}</h4>}
        <div className="text-xs opacity-90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
