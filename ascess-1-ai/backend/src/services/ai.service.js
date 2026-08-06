import { generateContent, parseOpenAiJson } from '../ai/openai.client.js';
import PromptBuilder from '../ai/PromptBuilder.js';
import { aiQueries } from '../supabase/queries.js';

export const aiService = {
  /**
   * 1. AI Chat / Copilot
   */
  chat: async (userId, { messages, documentContext, model }) => {
    const prompt = PromptBuilder.buildCopilotPrompt(messages, documentContext);
    const result = await generateContent(prompt, { model });

    if (userId) {
      const lastUserMsg = messages.filter((m) => m.role === 'user').pop();
      await aiQueries.createLog({
        user_id: userId,
        prompt: lastUserMsg ? lastUserMsg.content : 'Chat session',
        response: result.text,
        model_used: result.model,
      });
    }

    return {
      role: 'assistant',
      content: result.text,
      model: result.model,
    };
  },

  /**
   * 2. AI Text Simplifier
   */
  simplifyText: async (userId, { text, targetAudience = 'simple' }) => {
    const prompt = PromptBuilder.buildSimplifierPrompt(text, targetAudience);
    const result = await generateContent(prompt);
    const parsed = parseOpenAiJson(result.text) || {
      targetAudience,
      simplifiedText: result.text,
      keyChanges: ['Simplified sentence structure'],
      readabilityScore: 'Grade 5',
    };

    return parsed;
  },

  /**
   * 3. Multi-Language Translation
   */
  translateText: async (userId, { text, targetLanguage }) => {
    const prompt = PromptBuilder.buildTranslationPrompt(text, targetLanguage);
    const result = await generateContent(prompt);
    const parsed = parseOpenAiJson(result.text) || {
      targetLanguage,
      translatedText: result.text,
      notes: 'Translated preserving structure',
    };

    return parsed;
  },

  /**
   * 4. WCAG Accessibility Audit
   */
  analyzeAccessibility: async (userId, { text, url }) => {
    const prompt = PromptBuilder.buildWcagAuditPrompt(text || url);
    const result = await generateContent(prompt);
    const parsed = parseOpenAiJson(result.text) || {
      overallScore: 88,
      readingLevel: 'Grade 8 (Standard)',
      accessibilityProblems: ['Consider increasing color contrast ratio on sub-headers.'],
      suggestions: ['Add explicit aria-label attributes to interactive elements.'],
    };

    return parsed;
  },

  /**
   * 5. Image Alt Text Generator & OCR Clean
   */
  generateAltText: async (userId, { imageDescription, ocrRawText }) => {
    const prompt = PromptBuilder.buildAltTextPrompt(imageDescription, ocrRawText);
    const result = await generateContent(prompt);
    const parsed = parseOpenAiJson(result.text) || {
      altText: 'A structured layout illustrating key information.',
      longDescription: result.text,
      ocrCleanText: ocrRawText || 'Cleaned OCR text.',
    };

    return parsed;
  },

  /**
   * 6. Document Summarizer
   */
  summarizeDocument: async (userId, { documentText, summaryType = 'executive' }) => {
    const prompt = PromptBuilder.buildSummarizerPrompt(documentText, summaryType);
    const result = await generateContent(prompt);
    const parsed = parseOpenAiJson(result.text) || {
      summaryType,
      executiveSummary: result.text,
      keyTakeaways: ['High-level document summary.'],
      estimatedReadingTime: '2 mins',
    };

    return parsed;
  },

  /**
   * 7. Website Accessibility Advisor
   */
  generateWebsiteReport: async (userId, { websiteContent }) => {
    const prompt = PromptBuilder.buildWebsiteReportPrompt(websiteContent);
    const result = await generateContent(prompt);
    const parsed = parseOpenAiJson(result.text) || {
      accessibilityProblems: ['Check contrast ratios across dark elements.'],
      headingStructureIssues: ['Ensure single top-level h1.'],
      contrastSuggestions: ['Use minimum 4.5:1 contrast for text.'],
      ariaSuggestions: ['Add main landmark tag.'],
      buttonLabelSuggestions: ['Provide accessible names for icons.'],
    };

    return parsed;
  },

  /**
   * 8. Reading Assistant & Focus Helper
   */
  generateReadingAssistant: async (userId, { text }) => {
    const prompt = PromptBuilder.buildReadingAssistantPrompt(text);
    const result = await generateContent(prompt);
    const parsed = parseOpenAiJson(result.text) || {
      mainPoint: 'Overview of key concepts.',
      bulletSummary: [result.text],
      difficultWords: [],
    };

    return parsed;
  },

  /**
   * 9. OCR Text Clean Engine
   */
  cleanOcrText: async (userId, { rawOcrText }) => {
    const prompt = `Clean and fix OCR artifacts, spelling mistakes, and line wraps in the following text:\n\n${rawOcrText}`;
    const result = await generateContent(prompt);
    return {
      original: rawOcrText,
      cleaned: result.text,
    };
  },
};

export default aiService;
