import api from '../utils/api';

export const documentService = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  processUrl: (url) => api.post('/documents/url', { url }),

  processText: (text, title) => api.post('/documents/text', { text, title }),

  getDocuments: () => api.get('/documents'),

  getDocumentById: (id) => api.get(`/documents/${id}`),

  deleteDocument: (id) => api.delete(`/documents/${id}`),

  toggleFavorite: (id) => api.post(`/documents/favorite/${id}`),

  setDocumentContext: (documentId) => api.post('/documents/context', { documentId }),
};

export default documentService;
