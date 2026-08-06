import React, { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import Badge from '../components/ui/Badge';
import { documentService } from '../services/document.service';
import { FiUploadCloud, FiFileText, FiTrash2 } from 'react-icons/fi';
import { formatFileSize, formatDate } from '../utils/helpers';

const DocumentPage = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await documentService.getAll();
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    setUploading(true);
    try {
      await documentService.upload(formData);
      fetchDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.delete(id);
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Document Vault & OCR</h1>
        <p className="text-slate-400 text-sm mt-1">Upload PDF, images, or plain text files for text extraction and AI indexing.</p>
      </div>

      <GlassCard className="text-center py-10 border-dashed border-2 border-white/20 hover:border-indigo-500/50 transition-colors cursor-pointer">
        <label className="cursor-pointer flex flex-col items-center">
          <FiUploadCloud className="text-4xl text-indigo-400 mb-3" />
          <span className="text-slate-200 font-semibold text-base">Click or Drag PDF/Image to Upload</span>
          <span className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG, WEBP, TXT (Max 10MB)</span>
          <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-bold text-slate-200 mb-4">Your Uploaded Documents</h3>
        {documents.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No documents in vault yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {documents.map((doc) => (
              <div key={doc.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
                    <FiFileText className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{doc.title}</h4>
                    <p className="text-xs text-slate-400">
                      {formatFileSize(doc.file_size)} • Uploaded {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant="success">{doc.ocr_status}</Badge>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default DocumentPage;
