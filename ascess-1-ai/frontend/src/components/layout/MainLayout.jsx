import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationsPanel from './NotificationsPanel';
import CommandPalette from './CommandPalette';
import Breadcrumbs from './Breadcrumbs';
import ToastContainer from '../ui/ToastContainer';
import AccessibilityToolbar from '../accessibility/AccessibilityToolbar';
import ReadingRuler from '../accessibility/ReadingRuler';
import KeyboardShortcutsModal from '../accessibility/KeyboardShortcutsModal';
import { speakAnnouncement } from '../../context/AccessibilityContext';

const routeNames = {
  '/dashboard': 'Dashboard Overview',
  '/ai': 'AI Assistant Studio',
  '/upload': 'Upload and Document Vault',
  '/accessibility': 'Accessibility Compliance Scanner',
  '/translation': 'Multi-Language Translation Studio',
  '/voice': 'Voice Reader Studio',
  '/history': 'Audit Execution History',
  '/settings': 'System and Accessibility Preferences',
  '/profile': 'User Profile Page',
};

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = routeNames[location.pathname];
    if (pageTitle) {
      speakAnnouncement(`Navigated to ${pageTitle}`);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 relative">
      {/* Skip to Main Content Link for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-2xl"
      >
        Skip to Main Content
      </a>

      {/* Left Collapsible & Mobile Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main id="main-content" className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Breadcrumbs />
          <div className="animate-fadeIn">
            <Outlet />
          </div>
        </main>

        <AccessibilityToolbar />
        <ReadingRuler />
        <KeyboardShortcutsModal />
      </div>

      {/* Slide-out Notifications Panel */}
      <NotificationsPanel />

      {/* Ctrl + K Command Palette */}
      <CommandPalette />

      {/* Floating Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
