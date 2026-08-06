import openaiClient, { generateContent as generateOpenAiContent, parseGeminiJson as parseOpenAiJson } from './openai.client.js';

export const generateContent = generateOpenAiContent;
export const parseGeminiJson = parseOpenAiJson;

export default { generateContent, parseGeminiJson };
