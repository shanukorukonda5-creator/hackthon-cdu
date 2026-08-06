import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ToastContainer = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  const icons = {
    success: <FiCheckCircle className="text-emerald-400 text-lg" />,
    error: <FiAlertCircle className="text-rose-400 text-lg" />,
    info: <FiInfo className="text-indigo-400 text-lg" />,
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto glass-panel p-3.5 rounded-2xl border border-white/15 shadow-2xl flex items-center justify-between space-x-3 text-xs text-slate-200 animate-slideInLeft"
        >
          <div className="flex items-center space-x-2.5">
            {icons[toast.type] || icons.info}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
