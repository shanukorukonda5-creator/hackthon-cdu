import api from '../utils/api';

export const aiService = {
  chat: (messages, documentContext) =>
    api.post('/ai/chat', { messages, documentContext }),

  simplifyText: (text, targetAudience = 'simple') =>
    api.post('/ai/simplify', { text, targetAudience }),

  translate: (text, targetLanguage) =>
    api.post('/ai/translate', { text, targetLanguage }),

  analyzeAccessibility: (text) =>
    api.post('/ai/analyze', { text }),

  summarizeDocument: (text) =>
    api.post('/ai/summarize', { text }),

  generateAltText: (imageDescription) =>
    api.post('/ai/alt-text', { imageDescription }),

  cleanOcr: (ocrRawText) =>
    api.post('/ai/ocr-clean', { ocrRawText }),

  generateAccessibilityReport: (websiteContent) =>
    api.post('/ai/accessibility-report', { websiteContent }),

  askReadingAssistant: (documentContent, question) =>
    api.post('/ai/reading-assistant', { documentContent, question }),
};

export default aiService;
