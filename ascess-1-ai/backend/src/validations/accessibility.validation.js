import { z } from 'zod';

export const scanUrlSchema = z.object({
  body: z.object({
    targetUrl: z.string().url('Invalid URL format'),
  }),
});
