import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../hooks/useAuth';
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
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from 'react-icons/fi';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'AI Assistant', path: '/ai', icon: FiCpu },
  { name: 'Upload', path: '/upload', icon: FiUploadCloud },
  { name: 'Accessibility Reports', path: '/accessibility', icon: FiEye },
  { name: 'Translation', path: '/translation', icon: FiGlobe },
  { name: 'Voice Reader', path: '/voice', icon: FiVolume2 },
  { name: 'History', path: '/history', icon: FiClock },
  { name: 'Settings', path: '/settings', icon: FiSettings },
  { name: 'Profile', path: '/profile', icon: FiUser },
];

const Sidebar = () => {
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar } = useSidebar();
  const { logout } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full py-4">
      <div>
        {/* Brand & Collapse Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-white/10 mb-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <FiCpu className="text-xl" />
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-base bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent tracking-wide truncate">
                ascess-1-ai
              </span>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>

          <button
            onClick={closeMobileSidebar}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="text-lg flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="px-2 pt-4 border-t border-white/10">
        <button
          onClick={logout}
          className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <FiLogOut className="text-lg flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden md:block border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl h-screen sticky top-0 transition-all duration-300 z-40 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/80 backdrop-blur-md">
          <div className="w-64 h-full bg-slate-950 border-r border-white/15 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
