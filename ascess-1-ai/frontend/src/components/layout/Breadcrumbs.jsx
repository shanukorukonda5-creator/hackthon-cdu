import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const routeNames = {
  dashboard: 'Dashboard',
  ai: 'AI Assistant',
  upload: 'Upload',
  accessibility: 'Accessibility Reports',
  translation: 'Translation',
  voice: 'Voice Reader',
  history: 'History & Logs',
  settings: 'Settings',
  profile: 'Profile',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || pathnames[0] === 'auth') return null;

  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
      <Link to="/dashboard" className="hover:text-slate-200 flex items-center space-x-1 transition-colors">
        <FiHome className="text-sm" />
        <span>Home</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNames[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={name}>
            <FiChevronRight className="text-slate-600 text-xs" />
            {isLast ? (
              <span className="font-semibold text-indigo-400">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-200 transition-colors">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
