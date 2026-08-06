import React from 'react';
import GlassCard from '../ui/GlassCard';

const StatCard = ({ title, value, icon: Icon, trend, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'from-indigo-500 to-purple-600 shadow-indigo-500/20',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
    amber: 'from-amber-500 to-orange-600 shadow-amber-500/20',
    rose: 'from-rose-500 to-pink-600 shadow-rose-500/20',
  };

  return (
    <GlassCard className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-100 mt-1">{value}</h3>
        {trend && <p className="text-xs text-emerald-400 mt-1 font-medium">{trend}</p>}
      </div>
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${colorMap[color] || colorMap.indigo} flex items-center justify-center text-white text-xl shadow-lg`}
      >
        {Icon && <Icon />}
      </div>
    </GlassCard>
  );
};

export default StatCard;
