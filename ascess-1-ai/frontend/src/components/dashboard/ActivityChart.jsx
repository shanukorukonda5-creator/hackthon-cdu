import React from 'react';
import GlassCard from '../ui/GlassCard';

const ActivityChart = ({ activities = [] }) => {
  return (
    <GlassCard>
      <h3 className="text-base font-bold text-slate-200 mb-4">Recent Activity Stream</h3>
      {activities.length === 0 ? (
        <p className="text-sm text-slate-500 py-6 text-center">No recent activities recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {activities.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-white/5">
              <div>
                <p className="text-sm font-medium text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-400 capitalize">{item.type} event</p>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {new Date(item.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default ActivityChart;
