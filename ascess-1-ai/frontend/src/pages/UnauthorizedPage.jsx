import React from 'react';
import { Link } from 'react-router-dom';
import GlassButton from '../components/ui/GlassButton';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 text-center">
      <h1 className="text-8xl font-black bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
        403
      </h1>
      <h2 className="text-2xl font-bold mt-4">Access Denied</h2>
      <p className="text-sm text-slate-400 mt-2 max-w-md">
        You do not have permission to view this resource. Authentication or elevated privileges required.
      </p>
      <Link to="/auth/login" className="mt-6">
        <GlassButton variant="primary">Go to Login</GlassButton>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
