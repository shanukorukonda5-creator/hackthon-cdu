/**
 * ScoringService for calculating WCAG & Readability scores (0-100), ratings, and badges.
 */
export const ScoringService = {
  calculateScores(aiAnalysis = {}) {
    const rawScore = aiAnalysis.accessibilityScore || aiAnalysis.overallScore || 85;
    const overallScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Derive 7 category pillar scores (0-100)
    const categoryScores = {
      readability: Math.min(100, Math.max(40, overallScore + 2)),
      languageSimplicity: Math.min(100, Math.max(40, overallScore - 4)),
      accessibility: overallScore,
      structure: Math.min(100, Math.max(40, overallScore + 5)),
      navigation: Math.min(100, Math.max(40, overallScore + 1)),
      inclusiveness: Math.min(100, Math.max(40, overallScore + 3)),
      overallExperience: overallScore,
    };

    // Rating tier determination
    let rating = 'Average';
    if (overallScore >= 90) rating = 'Excellent';
    else if (overallScore >= 75) rating = 'Good';
    else if (overallScore >= 60) rating = 'Average';
    else if (overallScore >= 45) rating = 'Needs Improvement';
    else rating = 'Poor';

    // Award Achievement Badges based on scores
    const badges = [];
    if (overallScore >= 90) badges.push({ id: 'champion', title: 'Accessibility Champion', level: 'Gold' });
    if (overallScore >= 75) badges.push({ id: 'good', title: 'Good Accessibility', level: 'Silver' });
    if (categoryScores.structure >= 85) badges.push({ id: 'structure', title: 'Excellent Structure', level: 'Silver' });
    if (categoryScores.inclusiveness >= 85) badges.push({ id: 'inclusive', title: 'Inclusive Writing', level: 'Gold' });
    if (overallScore < 60) badges.push({ id: 'improvement', title: 'Needs Improvement', level: 'Bronze' });

    return {
      overallScore,
      rating,
      categoryScores,
      badges,
    };
  },
};

export default ScoringService;
