import api from '../utils/api';

export const accessibilityService = {
  getPreferences: () => api.get('/accessibility/preferences'),
  updatePreferences: (preferences) => api.put('/accessibility/preferences', preferences),
  getProfile: () => api.get('/accessibility/profile'),
  updateProfile: (profileData) => api.put('/accessibility/profile', profileData),

  runAudit: (text, title) => api.post('/accessibility/audit', { text, title }),
  scanWebsite: (url) => api.post('/accessibility/website', { url }),
  auditDocument: (documentId) => api.post('/accessibility/document', { documentId }),

  getHistory: () => api.get('/accessibility/history'),
  getReportById: (id) => api.get(`/accessibility/report/${id}`),

  exportMarkdown: (reportId) => api.post('/accessibility/export/markdown', { reportId }),
  exportJson: (reportId) => api.post('/accessibility/export/json', { reportId }),
  exportTxt: (reportId) => api.post('/accessibility/export/txt', { reportId }),
  exportPdf: (reportId) => api.post('/accessibility/export/pdf', { reportId }),
};

export default accessibilityService;
