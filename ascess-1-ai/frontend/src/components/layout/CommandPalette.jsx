import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiCpu,
  FiUploadCloud,
  FiEye,
  FiGlobe,
  FiVolume2,
  FiClock,
  FiSettings,
  FiUser,
  FiSearch,
  FiX,
} from 'react-icons/fi';

const commandItems = [
  { name: 'Dashboard Overview', path: '/dashboard', icon: FiGrid, category: 'Navigation' },
  { name: 'OpenAI Assistant', path: '/ai', icon: FiCpu, category: 'AI Tools' },
  { name: 'Upload & Process Documents', path: '/upload', icon: FiUploadCloud, category: 'Tools' },
  { name: 'Accessibility Reports', path: '/accessibility', icon: FiEye, category: 'Audit' },
  { name: 'Multi-Language Translation', path: '/translation', icon: FiGlobe, category: 'Tools' },
  { name: 'Voice Reader Studio', path: '/voice', icon: FiVolume2, category: 'Accessibility' },
  { name: 'Audit & Scan History', path: '/history', icon: FiClock, category: 'Logs' },
  { name: 'Preferences & Settings', path: '/settings', icon: FiSettings, category: 'Account' },
  { name: 'User Profile', path: '/profile', icon: FiUser, category: 'Account' },
];

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const filtered = commandItems.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-slate-900/80">
          <FiSearch className="text-slate-400 text-lg mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search feature... (ESC to close)"
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm outline-none"
          />
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No matching commands found.</p>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all text-left text-sm text-slate-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="text-base" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 group-hover:text-indigo-300">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-900/60 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-[10px]">Ctrl + K</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
