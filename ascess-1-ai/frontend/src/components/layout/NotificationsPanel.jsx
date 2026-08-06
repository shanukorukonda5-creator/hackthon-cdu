import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { FiX, FiCheckCircle, FiInfo, FiAlertCircle, FiCheck } from 'react-icons/fi';

const NotificationsPanel = () => {
  const { isPanelOpen, togglePanel, notifications, markAllAsRead } = useNotifications();

  if (!isPanelOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm glass-panel border-l border-white/15 shadow-2xl flex flex-col justify-between animate-slideInRight">
      <div>
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-100 text-base">Notifications</h3>
            <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-400 font-semibold">
              {notifications.filter((n) => !n.read).length} New
            </span>
          </div>
          <button onClick={togglePanel} className="text-slate-400 hover:text-white transition-colors">
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                n.read
                  ? 'bg-slate-900/30 border-white/5 opacity-75'
                  : 'bg-indigo-600/10 border-indigo-500/30 shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-bold text-slate-200">{n.title}</h4>
                <span className="text-[10px] text-slate-400">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{n.message}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={markAllAsRead}
          className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center space-x-2 border border-white/10 transition-all"
        >
          <FiCheck className="text-indigo-400" />
          <span>Mark All as Read</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
