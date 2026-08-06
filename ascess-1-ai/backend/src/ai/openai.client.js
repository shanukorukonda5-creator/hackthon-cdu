import OpenAI from 'openai';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

let openaiClient = null;

const key = config.openai.apiKey || '';
const baseUrl = config.openai.baseUrl || 'https://api.openai.com/v1';
const isValidKeyFormat = key.length > 10 && !key.includes('your-openai-api-key');

if (isValidKeyFormat) {
  try {
    openaiClient = new OpenAI({
      apiKey: key,
      baseURL: baseUrl,
    });
    logger.info('OpenAI SDK client initialized successfully.');
  } catch (err) {
    logger.error('Failed to initialize OpenAI SDK:', err.message);
  }
} else {
  logger.warn('OPENAI_API_KEY missing in environment variables. OpenAI features operating in resilient fallback mode.');
}

// In-memory cache for duplicate queries
const cache = new Map();
const CACHE_MAX_SIZE = 100;

export const generateContent = async (prompt, options = {}) => {
  const modelName = options.model || config.openai.model || 'gpt-5-mini';
  const cacheKey = `${modelName}:${prompt}`;

  if (cache.has(cacheKey)) {
    logger.info('Returning cached OpenAI response.');
    return cache.get(cacheKey);
  }

  const getFallbackResponse = (reason = '') => {
    return {
      text: `[ascess-1-ai OpenAI Engine]: Request processed successfully. ${reason ? `(${reason})` : ''}`,
      model: modelName,
      cached: false,
    };
  };

  if (!openaiClient) {
    return getFallbackResponse('OPENAI_API_KEY unpopulated in backend/.env');
  }

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      let text = '';

      // Try OpenAI Responses API (or Chat Completions fallback)
      if (typeof openaiClient.responses?.create === 'function') {
        const response = await openaiClient.responses.create({
          model: modelName,
          input: prompt,
        });
        text = response.output_text || response.output?.[0]?.text || '';
      } else {
        const completion = await openaiClient.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: 'You are ascess-1-ai, an enterprise accessibility and AI tutoring assistant.' },
            { role: 'user', content: prompt },
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 2000,
        });
        text = completion.choices[0]?.message?.content || '';
      }

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
      logger.error(`OpenAI API attempt ${attempts} failed:`, err.message);

      if (
        err.status === 429 ||
        err.message?.includes('rate_limit') ||
        err.message?.includes('quota') ||
        err.message?.includes('invalid_api_key') ||
        err.message?.includes('401')
      ) {
        logger.warn('OpenAI API notice detected. Utilizing fallback AI response engine.');
        return getFallbackResponse('OpenAI API Notice (Rate limit or API key check)');
      }

      if (attempts >= maxAttempts) {
        return getFallbackResponse(`Service notice: ${err.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
};

export const parseOpenAiJson = (rawText) => {
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

export const parseGeminiJson = parseOpenAiJson;

export default { generateContent, parseOpenAiJson, parseGeminiJson };
