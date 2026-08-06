import React from 'react';
import { Link } from 'react-router-dom';
import { FiCpu } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <FiCpu className="text-white text-xl" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          ascess-1-ai
        </span>
      </Link>
      <div className="flex items-center space-x-4">
        <Link to="/auth/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
          Sign In
        </Link>
        <Link to="/auth/register" className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/25 transition-all">
          Get Started
        </Link>
      </div>
    </header>
  );
};

export default Header;
