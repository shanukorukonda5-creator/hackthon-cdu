/**
 * MetadataExtractor utility for document metrics.
 */
export const MetadataExtractor = {
  extractMetrics(text = '', pageCount = 1) {
    const cleanText = text.trim();
    const characterCount = cleanText.length;
    const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;

    // Standard average reading speed: 200 words per minute
    const estimatedReadingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    return {
      wordCount,
      characterCount,
      pageCount: Math.max(1, pageCount),
      readingTime: `${estimatedReadingTimeMinutes} min read`,
      readingTimeMinutes: estimatedReadingTimeMinutes,
    };
  },
};

export default MetadataExtractor;
