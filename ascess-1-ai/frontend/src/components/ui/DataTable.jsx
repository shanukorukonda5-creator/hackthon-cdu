import React from 'react';
import EmptyState from './EmptyState';

const DataTable = ({ columns = [], data = [], keyField = 'id', emptyTitle, emptyDescription }) => {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 glass-panel">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-slate-900/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {columns.map((col, idx) => (
              <th key={idx} className="p-4">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-slate-200">
          {data.map((row) => (
            <tr key={row[keyField]} className="hover:bg-slate-800/40 transition-colors">
              {columns.map((col, idx) => (
                <td key={idx} className="p-4">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
