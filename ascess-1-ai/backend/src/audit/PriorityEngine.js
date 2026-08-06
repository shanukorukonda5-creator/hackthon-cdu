/**
 * PriorityEngine module to classify accessibility violations by severity.
 */
export const PriorityEngine = {
  categorizeIssues(issuesList = []) {
    return issuesList.map((issue, idx) => {
      const text = typeof issue === 'string' ? issue : issue.message || issue.description || '';
      const lower = text.toLowerCase();

      let severity = 'Medium';
      if (lower.includes('contrast') || lower.includes('critical') || lower.includes('missing alt') || lower.includes('keyboard trap')) {
        severity = 'Critical';
      } else if (lower.includes('heading') || lower.includes('landmark') || lower.includes('label') || lower.includes('aria')) {
        severity = 'High';
      } else if (lower.includes('passive') || lower.includes('long sentence') || lower.includes('complex')) {
        severity = 'Medium';
      } else if (lower.includes('formatting') || lower.includes('spelling')) {
        severity = 'Low';
      } else {
        severity = 'Informational';
      }

      return {
        id: `issue-${idx + 1}`,
        title: text.slice(0, 60),
        severity,
        reason: text,
        impact: `Impacts screen reader users and cognitive accessibility.`,
        suggestedFix: `Rephrase text or add explicit aria-label/alt attribute.`,
        improvedSentence: `Simplified, accessible alternative phrasing.`,
      };
    });
  },
};

export default PriorityEngine;
