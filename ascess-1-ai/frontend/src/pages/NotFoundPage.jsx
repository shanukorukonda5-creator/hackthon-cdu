import React from 'react';
import { Link } from 'react-router-dom';
import GlassButton from '../components/ui/GlassButton';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 text-center">
      <h1 className="text-8xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
        404
      </h1>
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
      <p className="text-sm text-slate-400 mt-2 max-w-md">
        The requested resource path does not exist or has been relocated.
      </p>
      <Link to="/" className="mt-6">
        <GlassButton variant="primary">Return Home</GlassButton>
      </Link>
    </div>
  );
};

export default NotFoundPage;
