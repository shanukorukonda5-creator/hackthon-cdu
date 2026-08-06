import { z } from 'zod';

export const urlScanSchema = z.object({
  body: z.object({
    url: z.string().url('Please provide a valid website URL starting with http:// or https://'),
  }),
});

export const textUploadSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text content cannot be empty').max(50000, 'Text exceeds maximum length of 50,000 characters'),
    title: z.string().optional(),
  }),
});

export const contextSchema = z.object({
  body: z.object({
    documentId: z.string().min(1, 'Document ID is required'),
  }),
});
