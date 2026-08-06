/**
 * ContentCleaner utility for cleaning raw text and OCR artifacts.
 */
export const ContentCleaner = {
  cleanText(rawText = '') {
    if (typeof rawText !== 'string') return '';

    return rawText
      // Replace null or non-printable control characters
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
      // Fix broken OCR line wraps (word-\nbreak -> wordbreak)
      .replace(/(\w+)-\n(\w+)/g, '$1$2')
      // Normalize multiple newlines to max double newlines
      .replace(/\n{3,}/g, '\n\n')
      // Replace multiple spaces with a single space
      .replace(/[ \t]{2,}/g, ' ')
      // Fix space before punctuation (. , ! ?)
      .replace(/\s+([.,!?])/g, '$1')
      // Trim overall text
      .trim();
  },

  removeGarbageChars(text = '') {
    return text.replace(/[^\w\s.,!?:;\-–—()'"/%\$\&\@\n]/g, '');
  },
};

export default ContentCleaner;
