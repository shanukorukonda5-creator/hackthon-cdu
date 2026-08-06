import React, { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import Pagination from '../components/ui/Pagination';
import InputField from '../components/forms/InputField';
import { useNotifications } from '../context/NotificationContext';
import {
  FiSearch,
  FiFileText,
  FiEye,
  FiTrash2,
  FiStar,
  FiClock,
} from 'react-icons/fi';

const dummyHistoryRecords = [
  {
    id: '1',
    title: 'Website_Accessibility_Audit_MainSite.pdf',
    type: 'Audit',
    score: 96,
    date: '2026-08-06',
    favorite: true,
  },
  {
    id: '2',
    title: 'Design_System_Accessibility_Tokens.png',
    type: 'OCR',
    score: 88,
    date: '2026-08-05',
    favorite: false,
  },
  {
    id: '3',
    title: 'User_Manual_Spanish_Translation.txt',
    type: 'Translation',
    score: 92,
    date: '2026-08-04',
    favorite: true,
  },
  {
    id: '4',
    title: 'Gemini_Multimodal_Prompt_Session_04.json',
    type: 'AI Prompt',
    score: 98,
    date: '2026-08-03',
    favorite: false,
  },
];

const HistoryPage = () => {
  const { addToast } = useNotifications();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState(dummyHistoryRecords);

  const toggleFavorite = (id) => {
    setRecords((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
    addToast('Updated favorites list', 'info');
  };

  const handleDelete = (id) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
    addToast('Deleted history item', 'danger');
  };

  const filtered = records.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'favorites'
        ? item.favorite
        : item.type.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-3">
          <FiClock className="text-indigo-400" />
          <span>Scan & Audit Execution History</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Review past accessibility scans, document uploads, and AI prompt sessions.</p>
      </div>

      {/* Filter Bar & Search */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        <div className="w-full sm:w-72">
          <InputField
            type="text"
            placeholder="Search history records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={FiSearch}
          />
        </div>

        <Tabs
          activeTab={filter}
          onChange={setFilter}
          tabs={[
            { id: 'all', label: 'All Logs' },
            { id: 'favorites', label: 'Favorites ★' },
            { id: 'audit', label: 'Audits' },
            { id: 'ocr', label: 'OCR' },
          ]}
        />
      </GlassCard>

      {/* History Items Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <GlassCard className="text-center py-12 text-slate-500">
            <p>No history records matching query.</p>
          </GlassCard>
        ) : (
          filtered.map((item) => (
            <GlassCard
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
                  <FiFileText className="text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                    <span>{item.date}</span>
                    <span>•</span>
                    <Badge variant="info">{item.type}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    item.favorite ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-200'
                  }`}
                  title="Favorite"
                >
                  <FiStar className="text-lg" />
                </button>

                <GlassButton size="sm" variant="secondary" onClick={() => addToast('Opening document report preview', 'info')}>
                  <FiEye className="mr-1.5" /> View
                </GlassButton>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete Record"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={3} onPageChange={setCurrentPage} />
    </div>
  );
};

export default HistoryPage;
