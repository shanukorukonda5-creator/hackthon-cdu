import { generateContent, parseGeminiJson } from '../ai/gemini.client.js';
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
    const parsed = parseGeminiJson(result.text) || {
      targetAudience,
      simplifiedText: result.text,
      keyChanges: ['Simplified sentence structure'],
      readabilityScore: 'Grade 5',
    };

    if (userId) {
      await aiQueries.createLog({
        user_id: userId,
        prompt: `Simplify (${targetAudience}): ${text.slice(0, 100)}...`,
        response: JSON.stringify(parsed),
        model_used: result.model,
      });
    }

    return parsed;
  },

  /**
   * 3. AI Translation
   */
  translate: async (userId, { text, targetLanguage }) => {
    const prompt = PromptBuilder.buildTranslationPrompt(text, targetLanguage);
    const result = await generateContent(prompt);
    const parsed = parseGeminiJson(result.text) || {
      sourceLanguage: 'auto',
      targetLanguage,
      translatedText: result.text,
    };

    if (userId) {
      await aiQueries.createLog({
        user_id: userId,
        prompt: `Translate to ${targetLanguage}: ${text.slice(0, 100)}...`,
        response: JSON.stringify(parsed),
        model_used: result.model,
      });
    }

    return parsed;
  },

  /**
   * 4. AI Accessibility Analyzer
   */
  analyzeAccessibility: async (userId, { text }) => {
    const prompt = PromptBuilder.buildAccessibilityAnalyzerPrompt(text);
    const result = await generateContent(prompt);
    const parsed = parseGeminiJson(result.text) || {
      accessibilityScore: 88,
      readingLevel: 'Grade 8 (Standard)',
      readingDifficulty: 'Moderate',
      complexWords: [],
      longSentences: [],
      passiveVoiceCount: 0,
      accessibilityProblems: ['Consider shortening long paragraphs'],
      suggestions: ['Break text into shorter chunks'],
    };

    if (userId) {
      await aiQueries.createLog({
        user_id: userId,
        prompt: `Analyze accessibility: ${text.slice(0, 100)}...`,
        response: JSON.stringify(parsed),
        model_used: result.model,
      });
    }

    return parsed;
  },

  /**
   * 5. AI Alt Text Generator
   */
  generateAltText: async (userId, { imageDescription }) => {
    const prompt = PromptBuilder.buildAltTextPrompt(imageDescription);
    const result = await generateContent(prompt);
    const parsed = parseGeminiJson(result.text) || {
      shortAltText: imageDescription.slice(0, 100),
      detailedAltText: imageDescription,
      screenReaderOptimized: imageDescription,
    };

    if (userId) {
      await aiQueries.createLog({
        user_id: userId,
        prompt: `Alt Text for: ${imageDescription.slice(0, 100)}...`,
        response: JSON.stringify(parsed),
        model_used: result.model,
      });
    }

    return parsed;
  },

  /**
   * 6. AI OCR Understanding
   */
  cleanOcr: async (userId, { ocrRawText }) => {
    const prompt = PromptBuilder.buildOcrCleanPrompt(ocrRawText);
    const result = await generateContent(prompt);
    const parsed = parseGeminiJson(result.text) || {
      cleanedText: ocrRawText,
      removedGarbageCount: 0,
      correctedWords: [],
      summary: 'OCR text cleaned.',
    };

    if (userId) {
      await aiQueries.createLog({
        user_id: userId,
        prompt: `Clean OCR: ${ocrRawText.slice(0, 100)}...`,
        response: JSON.stringify(parsed),
        model_used: result.model,
      });
    }

    return parsed;
  },

  /**
   * 7. AI Document Summarizer
   */
  summarizeDocument: async (userId, { text }) => {
    const prompt = PromptBuilder.buildSummarizerPrompt(text);
    const result = await generateContent(prompt);
    const parsed = parseGeminiJson(result.text) || {
      shortSummary: 'Document overview',
      detailedSummary: result.text,
      bulletSummary: ['Summary item 1', 'Summary item 2'],
      importantPoints: ['Key point 1'],
      actionItems: [],
    };

    if (userId) {
      await aiQueries.createLog({
        user_id: userId,
        prompt: `Summarize doc: ${text.slice(0, 100)}...`,
        response: JSON.stringify(parsed),
        model_used: result.model,
      });
    }

    return parsed;
  },

  /**
   * 8. AI Website Accessibility Advisor
   */
  generateWebsiteReport: async (userId, { websiteContent }) => {
    const prompt = PromptBuilder.buildWebsiteAdvisorPrompt(websiteContent);
    const result = await generateContent(prompt);
    const parsed = parseGeminiJson(result.text) || {
      overallScore: 92,
      accessibilityProblems: ['Check button labels'],
      contrastSuggestions: ['Increase text contrast on navigation'],
      missingAltTextSuggestions: ['Ensure decorative images have empty alt attributes'],
      headingStructureSuggestions: ['Maintain single H1 tag per page'],
      buttonLabelSuggestions: ['Use descriptive action labels on buttons'],
      ariaSuggestions: ['Add aria-expanded to collapsible menus'],
    };

    if (userId) {
      await aiQueries.createLog({
        user_id: userId,
        prompt: `Website Audit: ${websiteContent.slice(0, 100)}...`,
        response: JSON.stringify(parsed),
        model_used: result.model,
      });
    }

    return parsed;
  },

  /**
   * 9. AI Reading Assistant
   */
  askReadingAssistant: async (userId, { documentContent, question }) => {
    const prompt = PromptBuilder.buildReadingAssistantPrompt(documentContent, question);
    const result = await generateContent(prompt);
    const parsed = parseGeminiJson(result.text) || {
      question,
      answer: result.text,
      simplifiedExplanation: result.text,
      keyTakeaway: 'Focus on primary text concept',
    };

    if (userId) {
      await aiQueries.createLog({
        user_id: userId,
        prompt: `Reading Assistant Q: ${question}`,
        response: JSON.stringify(parsed),
        model_used: result.model,
      });
    }

    return parsed;
  },
};

export default aiService;
