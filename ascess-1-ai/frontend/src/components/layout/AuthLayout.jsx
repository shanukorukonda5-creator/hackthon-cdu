import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FiCpu } from 'react-icons/fi';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background glow graphics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <FiCpu className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              ascess-1-ai
            </span>
          </Link>
          <p className="mt-2 text-sm text-slate-400">Universal Accessibility & AI Platform</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
