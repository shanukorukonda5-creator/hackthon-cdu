import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import Tabs from '../components/ui/Tabs';
import Badge from '../components/ui/Badge';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import { useNotifications } from '../context/NotificationContext';
import documentService from '../services/document.service';
import aiService from '../services/ai.service';
import {
  FiUploadCloud,
  FiFileText,
  FiGlobe,
  FiEdit3,
  FiCheckCircle,
  FiCpu,
  FiSearch,
  FiTrash2,
  FiStar,
  FiMessageSquare,
  FiEye,
  FiRepeat,
  FiZap,
} from 'react-icons/fi';

const UploadPage = () => {
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  const [activeTab, setActiveTab] = useState('file');
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [targetUrl, setTargetUrl] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await documentService.getDocuments();
      const docs = res.data || (Array.isArray(res) ? res : []);
      if (docs && Array.isArray(docs)) setDocuments(docs);
    } catch (err) {
      // Fallback local initial state if offline
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files || e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setProgress(25);

    try {
      const file = files[0];
      const res = await documentService.uploadFile(file);
      const newDoc = res.data || res;
      setProgress(100);

      if (newDoc && newDoc.title) {
        setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
      }

      addToast(`Uploaded and processed "${file.name}"`, 'success');
      fetchDocuments();
    } catch (err) {
      addToast(err.message || 'File upload failed.', 'error');
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleUrlScan = async (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setIsUploading(true);
    try {
      const res = await documentService.processUrl(targetUrl);
      const newDoc = res.data || res;
      if (newDoc && newDoc.title) {
        setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
      }
      addToast('Website URL content scraped successfully!', 'success');
      setTargetUrl('');
      fetchDocuments();
    } catch (err) {
      addToast(err.message || 'URL scraping failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextUpload = async (e) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    setIsUploading(true);
    try {
      const res = await documentService.processText(pastedText, pastedTitle || 'Pasted Content');
      const newDoc = res.data || res;
      if (newDoc && newDoc.title) {
        setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
      }
      addToast('Text document saved and processed!', 'success');
      setPastedText('');
      setPastedTitle('');
      fetchDocuments();
    } catch (err) {
      addToast(err.message || 'Text ingestion failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (selectedDoc?.id === id) setSelectedDoc(null);
      addToast('Document deleted', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete document.', 'error');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await documentService.toggleFavorite(id);
      fetchDocuments();
      addToast('Updated document favorites', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to update favorite status.', 'error');
    }
  };

  // Quick Action Handlers
  const handleOpenAiChat = (doc) => {
    sessionStorage.setItem('activeDocumentContext', JSON.stringify(doc));
    addToast(`Attached "${doc.title}" context to OpenAI Assistant`, 'info');
    navigate('/ai');
  };

  const handleSummarize = async (doc) => {
    setIsAiProcessing(true);
    setSelectedDoc(doc);
    try {
      const res = await aiService.summarizeDocument(doc.extracted_text || doc.title);
      setAiResult({ type: 'summary', data: res.data });
      addToast('Document summarized with OpenAI!', 'success');
    } catch (err) {
      addToast(err.message || 'Summarization failed.', 'error');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSimplify = async (doc) => {
    setIsAiProcessing(true);
    setSelectedDoc(doc);
    try {
      const res = await aiService.simplifyText(doc.extracted_text || doc.title, 'simple');
      setAiResult({ type: 'simplify', data: res.data });
      addToast('Text simplified for easy reading!', 'success');
    } catch (err) {
      addToast(err.message || 'Simplification failed.', 'error');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const filteredDocs = documents.filter((doc) => {
    const titleMatch = (doc.title || doc.file_name || '').toLowerCase().includes(search.toLowerCase());
    const isFav = doc.metadata?.favorite;
    const typeMatch =
      filterType === 'all'
        ? true
        : filterType === 'favorites'
        ? isFav
        : doc.file_type === filterType;
    return titleMatch && typeMatch;
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Smart Document Processing Engine</h1>
        <p className="text-slate-400 text-sm mt-1">Ingest PDFs, Images, URLs, and Markdown text for automated extraction, OCR, and AI context binding.</p>
      </div>

      {/* Input Mode Selector Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'file', label: 'File Upload (PDF/Img/Txt)', icon: FiUploadCloud },
          { id: 'url', label: 'Website Scraper URL', icon: FiGlobe },
          { id: 'text', label: 'Paste Raw Text', icon: FiEdit3 },
        ]}
      />

      {/* Tab 1: File Upload */}
      {activeTab === 'file' && (
        <GlassCard className="space-y-6">
          <div
            onClick={() => document.getElementById('file-upload-input')?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => {
              handleDrag(e);
              handleFileUpload(e);
            }}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer ${
              dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/15 hover:border-indigo-500/40 bg-slate-900/40'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl">
              <FiUploadCloud />
            </div>

            <h3 className="text-base font-bold text-slate-100">Drag & Drop Files Here</h3>
            <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG, WEBP, and TXT files up to 10MB</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge variant="info">PDF</Badge>
              <Badge variant="info">PNG</Badge>
              <Badge variant="info">JPG</Badge>
              <Badge variant="info">WEBP</Badge>
              <Badge variant="info">TXT</Badge>
            </div>

            <input
              type="file"
              className="hidden"
              id="file-upload-input"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
              onChange={handleFileUpload}
            />
            <div className="mt-6">
              <GlassButton
                variant="primary"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('file-upload-input')?.click();
                }}
              >
                Browse Files
              </GlassButton>
            </div>
          </div>

          {isUploading && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-200">Processing file and extracting content...</span>
                <span className="text-indigo-400">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full" />
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Tab 2: URL Scraper */}
      {activeTab === 'url' && (
        <GlassCard>
          <form onSubmit={handleUrlScan} className="space-y-4">
            <InputField
              label="Website or Article URL"
              type="url"
              placeholder="https://example.com/article"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              icon={FiGlobe}
            />
            <div className="flex justify-end">
              <GlassButton type="submit" variant="primary" loading={isUploading} disabled={!targetUrl.trim()}>
                Scrape & Extract Website Content
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Tab 3: Raw Text Input */}
      {activeTab === 'text' && (
        <GlassCard>
          <form onSubmit={handleTextUpload} className="space-y-4">
            <InputField
              label="Document Title"
              type="text"
              placeholder="e.g. Accessibility Guidelines Summary"
              value={pastedTitle}
              onChange={(e) => setPastedTitle(e.target.value)}
              icon={FiFileText}
            />
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Raw Text / Markdown Content</label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste text here for instant extraction and AI accessibility binding..."
                className="glass-input w-full rounded-2xl p-4 text-sm bg-slate-900/60 border border-white/10"
              />
            </div>
            <div className="flex justify-end">
              <GlassButton type="submit" variant="primary" loading={isUploading} disabled={!pastedText.trim()}>
                Save & Bind Text Document
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Processed Document Vault Header & Filters */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
              <FiFileText className="text-indigo-400" />
              <span>Processed Document Vault</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage uploaded files, attached context, and quick AI actions.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input w-full rounded-xl pl-9 pr-3 py-1.5 text-xs bg-slate-900/80 border border-white/10"
              />
            </div>

            <SelectField
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'all', label: 'All Files' },
                { value: 'pdf', label: 'PDFs Only' },
                { value: 'image', label: 'Images Only' },
                { value: 'url', label: 'URLs Only' },
                { value: 'text', label: 'Text Files' },
                { value: 'favorites', label: '★ Favorites' },
              ]}
              className="w-36 text-xs"
            />
          </div>
        </div>

        {/* AI Result Card Display */}
        {aiResult && selectedDoc && (
          <GlassCard className="border-indigo-500/40 bg-indigo-950/20 space-y-3 p-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <FiCpu className="text-indigo-400 text-lg" />
                <h3 className="text-sm font-bold text-slate-100">
                  OpenAI Result for "{selectedDoc.title}"
                </h3>
              </div>
              <button onClick={() => setAiResult(null)} className="text-xs text-slate-400 hover:text-white">
                Dismiss
              </button>
            </div>

            {aiResult.type === 'summary' ? (
              <div className="space-y-2 text-xs text-slate-200">
                <p className="font-semibold text-indigo-300">Executive Summary:</p>
                <p className="leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  {aiResult.data.executiveSummary || aiResult.data.summary}
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-200">
                <p className="font-semibold text-indigo-300">Simplified Text:</p>
                <p className="leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  {aiResult.data.simplifiedText}
                </p>
              </div>
            )}
          </GlassCard>
        )}

        {/* Vault Cards Grid */}
        {filteredDocs.length === 0 ? (
          <GlassCard className="text-center py-12 border-dashed border-white/15">
            <FiFileText className="text-4xl text-slate-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-200">No Documents in Vault</h3>
            <p className="text-xs text-slate-400 mt-1">Upload a PDF, image, URL, or paste text above to see processed document cards here.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <GlassCard key={doc.id} className="p-4 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
                      {doc.file_type === 'pdf' ? <FiFileText /> : doc.file_type === 'url' ? <FiGlobe /> : <FiUploadCloud />}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleFavorite(doc.id)}
                        className={`p-1.5 rounded-lg text-sm transition-colors ${
                          doc.metadata?.favorite ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                        }`}
                        title="Toggle Favorite"
                      >
                        <FiStar />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors text-sm"
                        title="Delete Document"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100 truncate" title={doc.title}>
                      {doc.title || doc.file_name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                      {doc.file_type || 'document'} • {doc.metadata?.wordCount || 0} words • {doc.metadata?.readingTime || '1 min'}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/40 p-2 rounded-xl border border-white/5">
                    {doc.extracted_text || 'No text extracted'}
                  </p>
                </div>

                {/* Quick Actions Row */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1">
                  <button
                    onClick={() => handleOpenAiChat(doc)}
                    className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium transition-colors"
                  >
                    <FiMessageSquare /> <span>AI Chat</span>
                  </button>

                  <button
                    onClick={() => handleSummarize(doc)}
                    className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-[11px] font-medium transition-colors"
                  >
                    <FiZap /> <span>Summarize</span>
                  </button>

                  <button
                    onClick={() => handleSimplify(doc)}
                    className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-[11px] font-medium transition-colors"
                  >
                    <FiRepeat /> <span>Simplify</span>
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
