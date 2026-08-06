import { z } from 'zod';

export const chatSchema = z.object({
  body: z.object({
    messages: z.array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1, 'Message content cannot be empty'),
      })
    ).min(1, 'At least one message is required'),
    documentContext: z.string().optional(),
    model: z.string().optional(),
  }),
});

export const simplifySchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text to simplify is required').max(15000, 'Text exceeds maximum length of 15,000 characters'),
    targetAudience: z.enum(['simple', 'easy', 'child', 'senior', 'eli10', 'summarized']).optional(),
  }),
});

export const translateSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text to translate is required').max(15000, 'Text exceeds maximum length of 15,000 characters'),
    targetLanguage: z.string().min(2, 'Target language is required'),
  }),
});

export const analyzeSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text to analyze is required').max(15000, 'Text exceeds maximum length of 15,000 characters'),
  }),
});

export const summarizeSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Document text to summarize is required').max(15000, 'Text exceeds maximum length of 15,000 characters'),
  }),
});

export const altTextSchema = z.object({
  body: z.object({
    imageDescription: z.string().min(1, 'Image description is required').max(5000, 'Description too long'),
  }),
});

export const ocrCleanSchema = z.object({
  body: z.object({
    ocrRawText: z.string().min(1, 'OCR raw text is required').max(15000, 'Text exceeds maximum length of 15,000 characters'),
  }),
});

export const accessibilityReportSchema = z.object({
  body: z.object({
    websiteContent: z.string().min(1, 'Website content or HTML structure is required').max(15000, 'Content too long'),
  }),
});

export const readingAssistantSchema = z.object({
  body: z.object({
    documentContent: z.string().min(1, 'Document content is required').max(15000, 'Document content too long'),
    question: z.string().min(1, 'Question is required'),
  }),
});
