/**
 * ContextBuilder module to format selected document into AI context.
 */
export const ContextBuilder = {
  buildDocumentContext(document) {
    if (!document) return '';

    return `
DOCUMENT TITLE: ${document.title || document.file_name}
DOCUMENT TYPE: ${document.file_type || document.type}
WORD COUNT: ${document.word_count || document.words || 0}
PAGES: ${document.page_count || document.pages || 1}

EXTRACTED TEXT CONTENT:
"""
${(document.extracted_text || '').slice(0, 10000)}
"""
`.trim();
  },
};

export default ContextBuilder;
