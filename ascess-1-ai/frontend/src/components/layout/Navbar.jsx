import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSidebar } from '../../context/SidebarContext';
import Dropdown from '../ui/Dropdown';
import {
  FiSun,
  FiMoon,
  FiBell,
  FiSearch,
  FiMenu,
  FiUser,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const { togglePanel, notifications } = useNotifications();
  const { toggleMobileSidebar } = useSidebar();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const triggerCommandPalette = () => {
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
    window.dispatchEvent(event);
  };

  return (
    <header className="h-16 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Toggle & Search Bar */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/60 border border-white/10"
        >
          <FiMenu className="text-lg" />
        </button>

        {/* Global Search / Command Palette Trigger */}
        <button
          onClick={triggerCommandPalette}
          className="flex items-center space-x-3 px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 text-slate-400 hover:text-slate-200 transition-all text-xs w-48 sm:w-64 md:w-80 justify-between"
        >
          <div className="flex items-center space-x-2">
            <FiSearch className="text-slate-400 text-sm" />
            <span className="truncate">Search commands or features...</span>
          </div>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-white/5">
            Ctrl+K
          </span>
        </button>
      </div>

      {/* Right Action Widgets */}
      <div className="flex items-center space-x-2.5">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-all"
          title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {mode === 'dark' ? <FiSun className="text-amber-400 text-sm" /> : <FiMoon className="text-sm" />}
        </button>

        {/* Notifications Drawer Bell */}
        <button
          onClick={togglePanel}
          className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-all relative"
          title="Notifications"
        >
          <FiBell className="text-sm" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Dropdown Menu */}
        <div className="border-l border-white/10 pl-2.5">
          <Dropdown
            trigger={
              <div className="flex items-center space-x-2 p-1 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md overflow-hidden border border-white/20">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    user?.full_name ? user.full_name[0].toUpperCase() : <FiUser />
                  )}
                </div>
              </div>
            }
          >
            <div className="px-3 py-2 border-b border-white/10 mb-1">
              <p className="text-xs font-bold text-slate-100">{user?.full_name || 'User Account'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>

            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiUser />
              <span>Profile Settings</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiSettings />
              <span>Preferences</span>
            </Link>

            <div className="border-t border-white/10 my-1 pt-1">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
              >
                <FiLogOut />
                <span>Sign Out</span>
              </button>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
