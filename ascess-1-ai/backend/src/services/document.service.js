import PDFProcessor from '../document/PDFProcessor.js';
import ImageProcessor from '../document/ImageProcessor.js';
import WebsiteProcessor from '../document/WebsiteProcessor.js';
import ContentCleaner from '../document/ContentCleaner.js';
import MetadataExtractor from '../document/MetadataExtractor.js';
import ContextBuilder from '../document/ContextBuilder.js';
import { documentQueries } from '../supabase/queries.js';

export const documentService = {
  /**
   * Process File Upload (PDF, Image, Text)
   */
  async uploadFile(userId, file) {
    if (!file) throw new Error('No file attached to upload request');

    const mimeType = file.mimetype || 'application/octet-stream';
    const originalName = file.originalname || 'uploaded_file';
    const startTime = Date.now();

    let processed = null;

    if (mimeType.includes('pdf') || originalName.endsWith('.pdf')) {
      processed = await PDFProcessor.processBuffer(file.buffer, originalName);
    } else if (mimeType.includes('image')) {
      processed = ImageProcessor.processImageMetadata(file.buffer, originalName, mimeType);
    } else {
      // Plain text or markdown file
      const rawText = file.buffer ? file.buffer.toString('utf-8') : '';
      const cleanText = ContentCleaner.cleanText(rawText);
      const metrics = MetadataExtractor.extractMetrics(cleanText, 1);
      processed = {
        type: 'text',
        originalName,
        title: originalName,
        extractedText: cleanText,
        ...metrics,
      };
    }

    const processingTime = `${Date.now() - startTime}ms`;

    const docRecord = await documentQueries.create({
      user_id: userId,
      title: processed.title,
      file_name: originalName,
      file_path: `/uploads/${originalName}`,
      file_size: file.size || 1024,
      file_type: processed.type,
      extracted_text: processed.extractedText,
      ocr_status: 'completed',
      metadata: {
        wordCount: processed.wordCount,
        pageCount: processed.pageCount,
        characterCount: processed.characterCount,
        readingTime: processed.readingTime,
        processingTime,
        favorite: false,
      },
    });

    return docRecord;
  },

  /**
   * Process Website URL Scraping
   */
  async processUrl(userId, url) {
    const startTime = Date.now();
    const processed = await WebsiteProcessor.processUrl(url);
    const processingTime = `${Date.now() - startTime}ms`;

    const docRecord = await documentQueries.create({
      user_id: userId,
      title: processed.title,
      file_name: processed.url,
      file_path: processed.url,
      file_size: processed.characterCount,
      file_type: 'url',
      extracted_text: processed.extractedText,
      ocr_status: 'completed',
      metadata: {
        wordCount: processed.wordCount,
        pageCount: 1,
        characterCount: processed.characterCount,
        readingTime: processed.readingTime,
        processingTime,
        favorite: false,
      },
    });

    return docRecord;
  },

  /**
   * Process Plain Text Ingestion
   */
  async processText(userId, text, title = 'Pasted Text Document') {
    const startTime = Date.now();
    const cleanText = ContentCleaner.cleanText(text);
    const metrics = MetadataExtractor.extractMetrics(cleanText, 1);
    const processingTime = `${Date.now() - startTime}ms`;

    const docRecord = await documentQueries.create({
      user_id: userId,
      title,
      file_name: `${title.toLowerCase().replace(/\s+/g, '_')}.txt`,
      file_path: '/uploads/pasted_text.txt',
      file_size: metrics.characterCount,
      file_type: 'text',
      extracted_text: cleanText,
      ocr_status: 'completed',
      metadata: {
        wordCount: metrics.wordCount,
        pageCount: 1,
        characterCount: metrics.characterCount,
        readingTime: metrics.readingTime,
        processingTime,
        favorite: false,
      },
    });

    return docRecord;
  },

  /**
   * Fetch User Documents
   */
  async getUserDocuments(userId) {
    return documentQueries.getByUserId(userId);
  },

  /**
   * Fetch Document Details by ID
   */
  async getDocumentById(userId, documentId) {
    const doc = await documentQueries.getById(documentId, userId);
    if (!doc) throw new Error('Document not found or access denied');
    return doc;
  },

  /**
   * Delete Document by ID
   */
  async deleteDocument(userId, documentId) {
    return documentQueries.delete(documentId, userId);
  },

  /**
   * Toggle Document Favorite
   */
  async toggleFavorite(userId, documentId) {
    return documentQueries.toggleFavorite(documentId, userId);
  },

  /**
   * Build Document Context for AI Assistant
   */
  async buildContext(userId, documentId) {
    const doc = await this.getDocumentById(userId, documentId);
    return ContextBuilder.buildDocumentContext(doc);
  },
};

export default documentService;
