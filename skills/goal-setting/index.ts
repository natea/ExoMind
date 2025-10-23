/**
 * Goal Setting Skill
 *
 * Creates actionable SMART goals and OKRs from life assessment insights,
 * breaking them down into quarterly objectives, monthly milestones, and weekly actions.
 *
 * @module goal-setting
 */

/**
 * Goal category
 */
export enum GoalCategory {
  CAREER_PROFESSIONAL = "Career & Professional",
  HEALTH_WELLNESS = "Health & Wellness",
  RELATIONSHIPS = "Relationships",
  PERSONAL_GROWTH = "Personal Growth",
  FINANCIAL = "Financial",
}

/**
 * Goal timeframe
 */
export enum GoalTimeframe {
  QUARTERLY = "Quarterly (12 weeks)",
  MONTHLY = "Monthly (4 weeks)",
  WEEKLY = "Weekly (7 days)",
}

/**
 * SMART goal criteria
 */
export interface SMARTCriteria {
  specific: boolean; // Clear and unambiguous
  measurable: boolean; // Quantifiable success metrics
  achievable: boolean; // Realistic given resources
  relevant: boolean; // Aligned with values
  timeBound: boolean; // Clear deadline
}

/**
 * Key Result for an OKR
 */
export interface KeyResult {
  name: string;
  target: number;
  current: number;
  unit: string; // e.g., "hours", "count", "percentage"
  trackingMethod: string; // e.g., "RescueTime", "manual log", "app"
  score?: number; // 0.0-1.0, calculated from current/target
  status?: "On Track" | "Behind" | "Ahead";
  blockers?: string[];
}

/**
 * Monthly milestone
 */
export interface Milestone {
  month: string; // e.g., "January", "February"
  deliverables: string[];
  completed: boolean;
  notes?: string;
}

/**
 * Weekly action
 */
export interface WeeklyAction {
  task: string;
  estimatedHours: number;
  dueDay: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}

/**
 * Complete OKR (Objective and Key Results)
 */
export interface OKR {
  objective: string; // Inspirational statement
  why: string; // Connection to life assessment
  timeline: string; // e.g., "Q1 2025"
  category: GoalCategory;
  keyResults: KeyResult[];
  monthlyMilestones: Milestone[];
  weeklyActions: WeeklyAction[][]; // Actions per week
  relatedLifeArea?: string; // From life assessment
  overallScore?: number; // Average of key result scores
}

/**
 * Quarterly goal plan
 */
export interface QuarterlyGoalPlan {
  quarter: string; // e.g., "Q1 2025"
  startDate: string; // ISO date
  endDate: string; // ISO date
  theme?: string; // e.g., "Health Quarter"
  objectives: OKR[];
  reviewSchedule: {
    weekly: string[]; // Day of week, e.g., ["Friday"]
    monthly: string[]; // Dates, e.g., ["2025-01-31", "2025-02-28"]
    quarterly: string; // Date, e.g., "2025-03-31"
  };
}

/**
 * Validate SMART criteria for a goal
 */
export function validateSMARTGoal(goal: {
  description: string;
  metrics: string[];
  deadline: string;
  relevance: string;
}): SMARTCriteria {
  return {
    specific: goal.description.length > 20 && !goal.description.includes("better") && !goal.description.includes("improve"),
    measurable: goal.metrics.length > 0,
    achievable: true, // Would require more complex logic
    relevant: goal.relevance.length > 0,
    timeBound: goal.deadline.length > 0,
  };
}

/**
 * Calculate key result score
 */
export function calculateKeyResultScore(kr: KeyResult): number {
  if (kr.target === 0) return 0;
  const score = kr.current / kr.target;
  return Math.min(Math.max(score, 0), 1.0); // Clamp between 0 and 1
}

/**
 * Calculate overall OKR score
 */
export function calculateOKRScore(okr: OKR): number {
  if (okr.keyResults.length === 0) return 0;

  const scores = okr.keyResults.map(kr =>
    kr.score !== undefined ? kr.score : calculateKeyResultScore(kr)
  );

  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(average * 100) / 100; // Round to 2 decimals
}

/**
 * Determine status from score
 */
export function getStatusFromScore(score: number): "On Track" | "Behind" | "Ahead" {
  if (score >= 0.7 && score <= 0.9) return "On Track";
  if (score < 0.7) return "Behind";
  return "Ahead";
}

/**
 * Get quarter code from date
 */
export function getQuarterCode(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const quarter = Math.ceil(month / 3);
  return `Q${quarter} ${year}`;
}

/**
 * Get quarter start and end dates
 */
export function getQuarterDates(date: Date = new Date()): { start: Date; end: Date } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const quarter = Math.ceil(month / 3);

  const startMonth = (quarter - 1) * 3;
  const endMonth = quarter * 3 - 1;

  const start = new Date(year, startMonth, 1);
  const end = new Date(year, endMonth + 1, 0); // Last day of month

  return { start, end };
}

/**
 * Validate OKR structure
 */
export function validateOKR(okr: OKR): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!okr.objective || okr.objective.trim().length === 0) {
    errors.push("Objective is required");
  }

  if (okr.keyResults.length < 3) {
    errors.push("At least 3 key results required");
  }

  if (okr.keyResults.length > 5) {
    errors.push("Maximum 5 key results recommended");
  }

  okr.keyResults.forEach((kr, i) => {
    if (!kr.name || kr.name.trim().length === 0) {
      errors.push(`Key Result ${i + 1}: Name is required`);
    }
    if (kr.target <= 0) {
      errors.push(`Key Result ${i + 1}: Target must be positive`);
    }
    if (!kr.trackingMethod || kr.trackingMethod.trim().length === 0) {
      errors.push(`Key Result ${i + 1}: Tracking method is required`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format OKR as markdown
 */
export function formatOKRMarkdown(okr: OKR): string {
  return `## ${okr.objective}

**Category**: ${okr.category}
**Timeline**: ${okr.timeline}
**Why**: ${okr.why}
${okr.relatedLifeArea ? `**Life Area**: ${okr.relatedLifeArea}\n` : ""}
**Overall Score**: ${okr.overallScore !== undefined ? okr.overallScore.toFixed(2) : "Not scored yet"}

### Key Results

${okr.keyResults
  .map(
    (kr, i) => `${i + 1}. **${kr.name}**
   - Current: ${kr.current} ${kr.unit}
   - Target: ${kr.target} ${kr.unit}
   - Score: ${kr.score !== undefined ? kr.score.toFixed(2) : calculateKeyResultScore(kr).toFixed(2)}
   - Status: ${kr.status || getStatusFromScore(calculateKeyResultScore(kr))}
   - Tracking: ${kr.trackingMethod}${kr.blockers && kr.blockers.length > 0 ? `\n   - Blockers: ${kr.blockers.join(", ")}` : ""}`
  )
  .join("\n\n")}

### Monthly Milestones

${okr.monthlyMilestones
  .map(
    (m) => `**${m.month}**:
${m.deliverables.map((d) => `- [${m.completed ? "x" : " "}] ${d}`).join("\n")}${m.notes ? `\n*Notes*: ${m.notes}` : ""}`
  )
  .join("\n\n")}

### Weekly Actions (Current Week)

${okr.weeklyActions.length > 0
  ? okr.weeklyActions[0]
      .map(
        (a) => `- [${a.completed ? "x" : " "}] ${a.task} (${a.estimatedHours}h) - Due: ${a.dueDay} - Priority: ${a.priority}`
      )
      .join("\n")
  : "*No actions defined yet*"}
`;
}

/**
 * Format quarterly goal plan as markdown
 */
export function formatQuarterlyPlanMarkdown(plan: QuarterlyGoalPlan): string {
  return `# ${plan.quarter} Goal Plan${plan.theme ? ` - ${plan.theme}` : ""}

**Period**: ${plan.startDate} to ${plan.endDate}
**Objectives**: ${plan.objectives.length}

---

${plan.objectives.map((okr) => `${formatOKRMarkdown(okr)}\n---\n`).join("\n")}

## Review Schedule

**Weekly Reviews**: ${plan.reviewSchedule.weekly.join(", ")}
**Monthly Reviews**: ${plan.reviewSchedule.monthly.join(", ")}
**Quarterly Review**: ${plan.reviewSchedule.quarterly}
`;
}

/**
 * Main skill export
 */
export default {
  name: "Goal Setting",
  version: "1.0.0",
  description: "Create SMART goals and OKRs aligned with life assessment",
  validateSMARTGoal,
  calculateKeyResultScore,
  calculateOKRScore,
  getStatusFromScore,
  getQuarterCode,
  getQuarterDates,
  validateOKR,
  formatOKRMarkdown,
  formatQuarterlyPlanMarkdown,
  GoalCategory,
  GoalTimeframe,
};
