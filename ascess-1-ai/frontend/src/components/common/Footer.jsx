import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-8 text-center text-sm text-slate-400">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 ascess-1-ai Platform. Production Ready Hackathon Edition.</p>
        <div className="flex items-center space-x-6 text-xs text-slate-400">
          <a href="#privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
          <a href="#accessibility" className="hover:text-indigo-400 transition-colors">Accessibility Commitment</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
