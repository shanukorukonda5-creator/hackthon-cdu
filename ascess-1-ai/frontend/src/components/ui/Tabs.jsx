import React from 'react';

const Tabs = ({ tabs = [], activeTab, onChange }) => {
  return (
    <div className="flex space-x-1 p-1 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {Icon && <Icon className="text-sm" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
