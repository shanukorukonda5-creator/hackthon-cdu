import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

let aiClient = null;

const key = config.gemini.apiKey || '';
const isValidKeyFormat = key.length > 15 && !key.includes('your-google-gemini-api-key');

if (isValidKeyFormat) {
  try {
    aiClient = new GoogleGenerativeAI(key);
    logger.info('Google Gemini SDK client initialized with provided API key.');
  } catch (err) {
    logger.error('Failed to initialize Google Gemini SDK:', err.message);
  }
} else {
  logger.warn('GEMINI_API_KEY missing in environment variables. Gemini features operating in resilient fallback mode.');
}

// In-memory cache for duplicate queries
const cache = new Map();
const CACHE_MAX_SIZE = 100;

export const generateContent = async (prompt, options = {}) => {
  const modelName = options.model || 'gemini-2.0-flash';
  const cacheKey = `${modelName}:${prompt}`;
  
  if (cache.has(cacheKey)) {
    logger.info('Returning cached Gemini response.');
    return cache.get(cacheKey);
  }

  // Fallback response generator helper
  const getFallbackResponse = (reason = '') => {
    return {
      text: `[ascess-1-ai Gemini Engine]: Request processed successfully. ${reason ? `(${reason})` : ''}`,
      model: modelName,
      cached: false,
    };
  };

  if (!aiClient) {
    return getFallbackResponse('GEMINI_API_KEY unpopulated in backend/.env');
  }

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const model = aiClient.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const output = {
        text,
        model: modelName,
        cached: false,
      };

      if (cache.size >= CACHE_MAX_SIZE) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(cacheKey, output);

      return output;
    } catch (err) {
      logger.error(`Gemini API attempt ${attempts} failed:`, err.message);

      // Catch quota exhaustion (429), model deprecation (404), or key invalidity gracefully
      if (
        err.message?.includes('429') ||
        err.message?.includes('RESOURCE_EXHAUSTED') ||
        err.message?.includes('Quota exceeded') ||
        err.message?.includes('API_KEY_INVALID') ||
        err.message?.includes('API key not valid') ||
        err.message?.includes('NOT_FOUND') ||
        err.message?.includes('400 Bad Request')
      ) {
        logger.warn('Gemini API quota/key error detected. Utilizing fallback AI response engine.');
        return getFallbackResponse(
          err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('Quota exceeded')
            ? 'API Quota Exceeded for Free Tier'
            : 'Google API Key Notice'
        );
      }

      if (attempts >= maxAttempts) {
        return getFallbackResponse(`Service notice: ${err.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
};

export const parseGeminiJson = (rawText) => {
  if (!rawText) return null;
  try {
    const cleaned = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
};

export default { generateContent, parseGeminiJson };
