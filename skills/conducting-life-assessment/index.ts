/**
 * Conducting Life Assessment Skill
 *
 * Interactive questionnaire system to assess satisfaction across 10 key life areas,
 * identify priorities, and generate actionable recommendations.
 *
 * @module conducting-life-assessment
 */

/**
 * Life area categories for assessment
 */
export enum LifeArea {
  HEALTH_FITNESS = "Health & Fitness",
  PERSONAL_GROWTH = "Personal Growth",
  CAREER_BUSINESS = "Career/Business",
  FINANCES = "Finances",
  RELATIONSHIPS = "Relationships",
  FUN_RECREATION = "Fun & Recreation",
  PHYSICAL_ENVIRONMENT = "Physical Environment",
  CONTRIBUTION_SERVICE = "Contribution/Service",
  SPIRITUALITY_MEANING = "Spirituality/Meaning",
  LIFE_VISION = "Life Vision",
}

/**
 * Assessment score for a single life area
 */
export interface AreaScore {
  area: LifeArea;
  score: number; // 1-10 scale
  notes: string;
  improvementIdeas: string;
}

/**
 * Complete life assessment result
 */
export interface LifeAssessment {
  date: string; // ISO date string
  quarter: string; // e.g., "2025-Q1"
  context: string; // User's reason for assessment
  scores: AreaScore[];
  overallAverage: number;
  topThreeAreas: AreaScore[];
  bottomThreeAreas: AreaScore[];
  recommendations: Recommendation[];
  commitments: string[];
  nextReviewDate: string; // ISO date string
}

/**
 * Recommendation for improving a life area
 */
export interface Recommendation {
  area: LifeArea;
  currentScore: number;
  whyItMatters: string;
  quickWins: string[];
  longTermStrategies: string[];
  interdependencies: string[];
  nextSteps: string[];
}

/**
 * Assessment question for a life area
 */
export interface AssessmentQuestion {
  area: LifeArea;
  description: string;
  reflectionQuestions: string[];
  ratingPrompt: string;
  followUpPrompt: string;
}

/**
 * Configuration for conducting an assessment
 */
export interface AssessmentConfig {
  saveToMemory: boolean;
  memoryPath?: string; // Default: memory/assessments/YYYY-QN-assessment.md
  generateRecommendations: boolean;
  priorityAreasCount: number; // Default: 3
}

/**
 * Default assessment questions for all 10 life areas
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    area: LifeArea.HEALTH_FITNESS,
    description: "Physical health, energy levels, exercise, nutrition, sleep, medical care",
    reflectionQuestions: [
      "How would you describe your current energy levels and physical vitality?",
      "Are you satisfied with your exercise routine and eating habits?",
      "Do you feel you're taking good care of your body?",
    ],
    ratingPrompt: "On a scale of 1-10, how satisfied are you with your Health & Fitness?",
    followUpPrompt: "What would it take to move this to a {score + 2}?",
  },
  {
    area: LifeArea.PERSONAL_GROWTH,
    description: "Learning, skills development, self-awareness, emotional intelligence",
    reflectionQuestions: [
      "Are you actively learning and developing new skills?",
      "Do you feel you're growing as a person and expanding your capabilities?",
      "Are you stepping outside your comfort zone regularly?",
    ],
    ratingPrompt: "On a scale of 1-10, how satisfied are you with your Personal Growth?",
    followUpPrompt: "What would it take to move this to a {score + 2}?",
  },
  // Additional areas would be defined here...
];

/**
 * Calculate overall average score from all area scores
 */
export function calculateOverallAverage(scores: AreaScore[]): number {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, score) => sum + score.score, 0);
  return Math.round((total / scores.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Identify top N performing areas
 */
export function identifyTopAreas(scores: AreaScore[], count: number = 3): AreaScore[] {
  return [...scores].sort((a, b) => b.score - a.score).slice(0, count);
}

/**
 * Identify bottom N priority areas
 */
export function identifyPriorityAreas(scores: AreaScore[], count: number = 3): AreaScore[] {
  return [...scores].sort((a, b) => a.score - b.score).slice(0, count);
}

/**
 * Generate quarter code from date (e.g., "2025-Q1")
 */
export function getQuarterCode(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-indexed
  const quarter = Math.ceil(month / 3);
  return `${year}-Q${quarter}`;
}

/**
 * Generate file path for assessment storage
 */
export function getAssessmentFilePath(date: Date = new Date()): string {
  const quarterCode = getQuarterCode(date);
  return `memory/assessments/${quarterCode}-assessment.md`;
}

/**
 * Calculate next assessment date (3 months from now)
 */
export function getNextAssessmentDate(date: Date = new Date()): Date {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + 3);
  return nextDate;
}

/**
 * Format assessment as Markdown for storage
 */
export function formatAssessmentMarkdown(assessment: LifeAssessment): string {
  return `# Life Assessment - ${assessment.quarter}

**Date Completed**: ${assessment.date}
**Context**: ${assessment.context}

---

## Assessment Scores

| Life Area | Score | Notes |
|-----------|-------|-------|
${assessment.scores.map(s => `| ${s.area} | ${s.score}/10 | ${s.notes} |`).join('\n')}

**Overall Average**: ${assessment.overallAverage}/10

---

## Priority Areas (Bottom 3)

${assessment.bottomThreeAreas.map((area, i) => `### ${i + 1}. ${area.area} - ${area.score}/10
**Current State**: ${area.notes}
**What would make it better**: ${area.improvementIdeas}
`).join('\n')}

---

## Strengths (Top 3)

${assessment.topThreeAreas.map((area, i) => `### ${i + 1}. ${area.area} - ${area.score}/10
**Why it's working**: ${area.notes}
`).join('\n')}

---

## Recommendations & Action Plan

${assessment.recommendations.map(rec => `### Priority Area: ${rec.area}

**Why This Matters**:
${rec.whyItMatters}

**Quick Wins**:
${rec.quickWins.map(w => `- ${w}`).join('\n')}

**Long-term Strategies**:
${rec.longTermStrategies.map(s => `- ${s}`).join('\n')}

**Next Steps This Week**:
${rec.nextSteps.map(s => `- [ ] ${s}`).join('\n')}

**Interdependencies**:
${rec.interdependencies.map(i => `- ${i}`).join('\n')}
`).join('\n---\n\n')}

---

## Commitments for Next Quarter

${assessment.commitments.map((c, i) => `${i + 1}. ${c}`).join('\n')}

---

*Next assessment due*: ${assessment.nextReviewDate}
`;
}

/**
 * Main skill export
 */
export default {
  name: "Conducting Life Assessment",
  version: "1.0.0",
  description: "Interactive questionnaire system for comprehensive life assessment",
  calculateOverallAverage,
  identifyTopAreas,
  identifyPriorityAreas,
  getQuarterCode,
  getAssessmentFilePath,
  getNextAssessmentDate,
  formatAssessmentMarkdown,
  ASSESSMENT_QUESTIONS,
};
