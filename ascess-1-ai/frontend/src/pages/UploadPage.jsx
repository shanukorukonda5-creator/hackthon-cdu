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
      if (res.data) setDocuments(res.data);
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
      setProgress(100);
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
      await documentService.processUrl(targetUrl);
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
      await documentService.processText(pastedText, pastedTitle || 'Pasted Content');
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
    addToast(`Loaded document context for AI Chat: "${doc.title}"`, 'info');
    navigate('/ai');
  };

  const handleSummarize = async (doc) => {
    setIsAiProcessing(true);
    setSelectedDoc(doc);
    try {
      const res = await aiService.summarizeDocument(doc.extracted_text || doc.title);
      setAiResult({ type: 'summary', data: res.data });
      addToast('Document summarized with Gemini AI!', 'success');
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
            <h3 className="text-base font-bold text-slate-200">Scrape Website Content</h3>
            <InputField
              label="Target Web Page URL"
              type="url"
              placeholder="https://example.com/article"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              icon={FiGlobe}
            />
            <div className="flex justify-end">
              <GlassButton type="submit" variant="primary" loading={isUploading} disabled={!targetUrl.trim()}>
                Run Website Scraper
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Tab 3: Paste Text */}
      {activeTab === 'text' && (
        <GlassCard>
          <form onSubmit={handleTextUpload} className="space-y-4">
            <h3 className="text-base font-bold text-slate-200">Ingest Plain Text / Markdown</h3>
            <InputField
              label="Document Title (Optional)"
              type="text"
              placeholder="e.g. WCAG Guidelines Summary"
              value={pastedTitle}
              onChange={(e) => setPastedTitle(e.target.value)}
            />
            <textarea
              rows={7}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste raw text or Markdown here..."
              className="glass-input w-full rounded-2xl p-4 text-sm bg-slate-900/60 border border-white/10"
            />
            <div className="flex justify-end">
              <GlassButton type="submit" variant="primary" loading={isUploading} disabled={!pastedText.trim()}>
                Save Text Document
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Document Storage Vault Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-100">Processed Document Vault</h2>

          <div className="w-full sm:w-72">
            <InputField
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={FiSearch}
            />
          </div>
        </div>

        {/* Filter Categories Tabs */}
        <Tabs
          activeTab={filterType}
          onChange={setFilterType}
          tabs={[
            { id: 'all', label: 'All Documents' },
            { id: 'favorites', label: 'Favorites ★' },
            { id: 'pdf', label: 'PDFs' },
            { id: 'image', label: 'Images' },
            { id: 'url', label: 'Web Scrapes' },
            { id: 'text', label: 'Text' },
          ]}
        />

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.length === 0 ? (
            <GlassCard className="col-span-2 text-center py-12 text-slate-500">
              <p>No documents found matching current filter.</p>
            </GlassCard>
          ) : (
            filteredDocs.map((doc) => {
              const meta = doc.metadata || {};
              const isFav = meta.favorite;
              return (
                <GlassCard key={doc.id} className="flex flex-col justify-between space-y-4 p-5 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 text-xl flex-shrink-0">
                        <FiFileText />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-slate-100 truncate">{doc.title || doc.file_name}</h4>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                          <Badge variant="info">{doc.file_type?.toUpperCase()}</Badge>
                          <span>•</span>
                          <span>{meta.readingTime || '1 min read'}</span>
                          <span>•</span>
                          <span>{meta.wordCount || 0} words</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(doc.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isFav ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-200'
                      }`}
                      title="Favorite"
                    >
                      <FiStar className="text-base" />
                    </button>
                  </div>

                  {/* Preview snippet */}
                  <p className="text-xs text-slate-300 line-clamp-2 bg-slate-900/40 p-2.5 rounded-xl border border-white/5 font-mono">
                    {doc.extracted_text || 'Text content extracted and indexed for AI reasoning.'}
                  </p>

                  {/* Quick Actions Bar */}
                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-1">
                      <GlassButton size="xs" variant="primary" onClick={() => handleOpenAiChat(doc)}>
                        <FiMessageSquare className="mr-1" /> AI Chat
                      </GlassButton>
                      <GlassButton size="xs" variant="secondary" onClick={() => handleSummarize(doc)}>
                        <FiZap className="mr-1" /> Summarize
                      </GlassButton>
                      <GlassButton size="xs" variant="secondary" onClick={() => handleSimplify(doc)}>
                        <FiCheckCircle className="mr-1" /> Simplify
                      </GlassButton>
                    </div>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Document"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>

      {/* AI Processing Modal Output Result */}
      {aiResult && selectedDoc && (
        <GlassCard className="space-y-4 border-indigo-500/40 bg-indigo-950/20">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <FiCpu className="text-indigo-400 text-lg" />
              <h3 className="text-sm font-bold text-slate-100">
                Gemini AI Result for "{selectedDoc.title}"
              </h3>
            </div>
            <button onClick={() => setAiResult(null)} className="text-xs text-slate-400 hover:text-white">
              Close
            </button>
          </div>

          <div className="text-xs text-slate-200 space-y-2 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-white/10">
            <p className="font-semibold text-indigo-300">
              {aiResult.data?.shortSummary || aiResult.data?.simplifiedText}
            </p>
            {aiResult.data?.bulletSummary?.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {aiResult.data.bulletSummary.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default UploadPage;
