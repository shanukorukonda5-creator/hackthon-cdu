import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
      <span>
        Page <strong className="text-slate-200">{currentPage}</strong> of{' '}
        <strong className="text-slate-200">{totalPages}</strong>
      </span>

      <div className="flex items-center space-x-2">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-xl bg-slate-900/60 border border-white/10 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronLeft className="text-sm text-slate-200" />
        </button>

        <span className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30">
          {currentPage}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-xl bg-slate-900/60 border border-white/10 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronRight className="text-sm text-slate-200" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
