/**
 * Monthly Review Skill
 *
 * Comprehensive monthly reviews that aggregate insights from weekly reviews,
 * track goal progress, assess life areas, and plan for the next month.
 *
 * @module monthly-review
 */

/**
 * Monthly review phases
 */
export enum ReviewPhase {
  COLLECT = "Phase 1: COLLECT - Gather Monthly Data",
  ANALYZE = "Phase 2: ANALYZE - Identify Patterns",
  ASSESS = "Phase 3: ASSESS - Goal & Life Progress Check",
  PLAN = "Phase 4: PLAN - Next Month Strategy",
}

/**
 * Month theme categories
 */
export enum MonthTheme {
  BUILDING_MOMENTUM = "Building Momentum",
  COURSE_CORRECTION = "Course Correction",
  DEEP_FOCUS = "Deep Focus",
  BALANCE_RESTORATION = "Balance Restoration",
  EXPERIMENTATION = "Experimentation",
  CONSOLIDATION = "Consolidation",
}

/**
 * Trend direction for life areas
 */
export enum Trend {
  UP = "↗️ Trending Up",
  FLAT = "→ Flat",
  DOWN = "↘️ Trending Down",
}

/**
 * Pattern type for analysis
 */
export enum PatternType {
  WIN = "Win Pattern",
  CHALLENGE = "Challenge Pattern",
  ENERGY = "Energy Pattern",
  PRODUCTIVITY = "Productivity Pattern",
}

/**
 * Weekly review summary for aggregation
 */
export interface WeeklySummary {
  weekNumber: number; // e.g., 42
  weekCode: string; // e.g., "2025-W42"
  topWin: string;
  mainChallenge: string;
  completionRate: number; // Percentage
  energyLevel: "High" | "Medium" | "Low";
  goalsCompleted: number;
  goalsTotal: number;
}

/**
 * Pattern detected across multiple weeks
 */
export interface Pattern {
  type: PatternType;
  description: string;
  frequency: number; // Number of weeks it appeared
  weeks: number[]; // Week numbers where it appeared
  rootCause?: string;
  recommendations?: string[];
}

/**
 * OKR progress for a single objective
 */
export interface OKRProgress {
  objective: string;
  score: number; // 0.0-1.0 scale
  keyResults: {
    name: string;
    target: number;
    actual: number;
    score: number; // 0.0-1.0
    status: "On Track" | "Behind" | "Ahead";
    blockers: string[];
  }[];
  onTrack: boolean;
  needsAttention: boolean;
}

/**
 * Life area momentum tracking
 */
export interface LifeAreaMomentum {
  area: string;
  currentScore: number; // 1-10
  previousScore: number; // 1-10
  change: number;
  trend: Trend;
  wins: string[];
  challenges: string[];
  status: "Improving" | "Stable" | "Declining";
}

/**
 * Habit consistency data
 */
export interface HabitConsistency {
  habit: string;
  completions: number;
  daysInMonth: number;
  percentage: number;
  strength: "🟢 Strong" | "🟡 Building" | "🔴 Weak";
  bestStreak: number;
  patterns: string[];
  decision: "KEEP" | "MODIFY" | "DROP";
}

/**
 * Next month priority
 */
export interface MonthlyPriority {
  outcome: string;
  linksTo: string; // OKR/Goal/Life Area
  successMetric: string;
  keyActions: string[];
}

/**
 * Complete monthly review
 */
export interface MonthlyReview {
  month: string; // e.g., "October"
  year: number;
  monthCode: string; // e.g., "2025-10"
  reviewDate: string; // ISO date string
  duration: number; // Minutes
  overallRating: number; // 1-5 stars
  theme: string;
  keyOutcome: string;

  // Phase 1: Collected Data
  weeklySummaries: WeeklySummary[];
  goalProgress: OKRProgress[];
  lifeAreaScores: LifeAreaMomentum[];

  // Phase 2: Pattern Analysis
  patterns: Pattern[];
  completionMetrics: {
    weeklyReviewRate: number;
    dailyPlanningRate: number;
    habitAverageRate: number;
    goalAverageRate: number;
  };

  // Phase 3: Assessment
  okrScores: OKRProgress[];
  monthlyGoalsCompleted: number;
  monthlyGoalsTotal: number;
  habitConsistency: HabitConsistency[];

  // Phase 4: Plan
  nextMonthTheme: MonthTheme;
  priorities: MonthlyPriority[];
  habitAdjustments: {
    keep: string[];
    modify: { habit: string; change: string }[];
    drop: string[];
    add: string[];
  };
  successMetrics: {
    quantitative: string[];
    qualitative: string[];
  };

  // Reflections
  insights: {
    learned: string[];
    surprised: string[];
    grateful: string[];
    lookingForward: string[];
  };

  nextReviewDate: string; // ISO date string
}

/**
 * Calculate month code from date
 */
export function getMonthCode(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Get file path for monthly review
 */
export function getMonthlyReviewPath(date: Date = new Date()): string {
  const monthCode = getMonthCode(date);
  return `memory/monthly/${monthCode}.md`;
}

/**
 * Calculate next monthly review date
 */
export function getNextMonthlyReviewDate(date: Date = new Date()): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  next.setDate(1); // First day of next month
  // Get last day of that month
  next.setMonth(next.getMonth() + 1);
  next.setDate(0); // Last day of previous month
  return next;
}

/**
 * Aggregate win patterns from weekly summaries
 */
export function aggregateWinPatterns(weeklySummaries: WeeklySummary[]): Pattern[] {
  const winCounts = new Map<string, { count: number; weeks: number[] }>();

  weeklySummaries.forEach((week) => {
    const existing = winCounts.get(week.topWin) || { count: 0, weeks: [] };
    winCounts.set(week.topWin, {
      count: existing.count + 1,
      weeks: [...existing.weeks, week.weekNumber],
    });
  });

  return Array.from(winCounts.entries())
    .filter(([_, data]) => data.count >= 2)
    .map(([win, data]) => ({
      type: PatternType.WIN,
      description: win,
      frequency: data.count,
      weeks: data.weeks,
    }));
}

/**
 * Calculate completion rates for the month
 */
export function calculateCompletionRates(
  weeklySummaries: WeeklySummary[],
  _daysInMonth: number
): {
  weeklyReviewRate: number;
  dailyPlanningRate: number;
  goalCompletionRate: number;
} {
  const expectedWeeks = weeklySummaries.length;
  const weeklyReviewRate = expectedWeeks > 0 ? (weeklySummaries.length / expectedWeeks) * 100 : 0;

  // Assuming ~20 workdays in a month for daily planning
  const dailyPlanningRate = 80; // This would come from actual data

  const totalGoals = weeklySummaries.reduce((sum, w) => sum + w.goalsTotal, 0);
  const completedGoals = weeklySummaries.reduce((sum, w) => sum + w.goalsCompleted, 0);
  const goalCompletionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return {
    weeklyReviewRate: Math.round(weeklyReviewRate),
    dailyPlanningRate: Math.round(dailyPlanningRate),
    goalCompletionRate: Math.round(goalCompletionRate),
  };
}

/**
 * Track life area momentum
 */
export function trackLifeAreaMomentum(
  currentScores: { area: string; score: number }[],
  previousScores: { area: string; score: number }[]
): LifeAreaMomentum[] {
  return currentScores.map((current) => {
    const previous = previousScores.find((p) => p.area === current.area);
    const previousScore = previous?.score || current.score;
    const change = current.score - previousScore;

    let trend: Trend;
    if (change > 0) trend = Trend.UP;
    else if (change < 0) trend = Trend.DOWN;
    else trend = Trend.FLAT;

    let status: "Improving" | "Stable" | "Declining";
    if (change > 0) status = "Improving";
    else if (change < 0) status = "Declining";
    else status = "Stable";

    return {
      area: current.area,
      currentScore: current.score,
      previousScore,
      change,
      trend,
      wins: [],
      challenges: [],
      status,
    };
  });
}

/**
 * Format monthly review as markdown
 */
export function formatMonthlyReviewMarkdown(review: MonthlyReview): string {
  return `# Monthly Review: ${review.month} ${review.year}

**Review Date**: ${review.reviewDate}
**Duration**: ${review.duration} minutes
**Overall Rating**: ${"⭐".repeat(review.overallRating)}${"☆".repeat(5 - review.overallRating)} (${review.overallRating}/5)
**Month Theme**: ${review.theme}
**Key Outcome**: ${review.keyOutcome}

---

## 📊 MONTH SNAPSHOT

### Quick Stats
- Weekly Reviews: ${review.weeklySummaries.length}/4-5
- Goal Completion: ${review.monthlyGoalsCompleted}/${review.monthlyGoalsTotal}
- Habit Average: ${review.completionMetrics.habitAverageRate}%
- Life Area Average: ${(review.lifeAreaScores.reduce((sum, a) => sum + a.currentScore, 0) / review.lifeAreaScores.length).toFixed(1)}/10

---

## 🎯 PHASE 1: COLLECTED DATA

### Weekly Review Summary
${review.weeklySummaries
  .map(
    (w) => `**${w.weekCode}**:
- Top Win: ${w.topWin}
- Challenge: ${w.mainChallenge}
- Completion: ${w.completionRate}%
- Energy: ${w.energyLevel}`
  )
  .join("\n\n")}

---

## 🔍 PHASE 2: PATTERN ANALYSIS

### Win Patterns
${review.patterns
  .filter((p) => p.type === PatternType.WIN)
  .map((p) => `- ${p.description} (appeared ${p.frequency} times)`)
  .join("\n")}

### Completion Metrics
- Weekly Reviews: ${review.completionMetrics.weeklyReviewRate}% (Goal: 100%)
- Daily Planning: ${review.completionMetrics.dailyPlanningRate}% (Goal: 80%+)
- Goal Completion: ${review.completionMetrics.goalAverageRate}%

---

## ✅ PHASE 3: GOAL & LIFE ASSESSMENT

### OKR Progress
${review.okrScores
  .map(
    (okr) => `**${okr.objective}** | Score: ${okr.score.toFixed(1)}
${okr.keyResults.map((kr) => `  - ${kr.name}: ${kr.score.toFixed(1)} (${kr.status})`).join("\n")}`
  )
  .join("\n\n")}

### Life Area Momentum
${review.lifeAreaScores
  .map((area) => `- ${area.area}: ${area.currentScore}/10 ${area.trend} (${area.change >= 0 ? "+" : ""}${area.change})`)
  .join("\n")}

---

## 🚀 PHASE 4: NEXT MONTH PLAN

### Month Theme: ${review.nextMonthTheme}

### Top Priorities
${review.priorities
  .map(
    (p, i) => `${i + 1}. **${p.outcome}**
   - Links to: ${p.linksTo}
   - Success: ${p.successMetric}
   - Actions: ${p.keyActions.map((a) => `\n     - ${a}`).join("")}`
  )
  .join("\n\n")}

### Habit Adjustments
**KEEP**: ${review.habitAdjustments.keep.join(", ")}
**MODIFY**: ${review.habitAdjustments.modify.map((h) => `${h.habit} → ${h.change}`).join(", ")}
**DROP**: ${review.habitAdjustments.drop.join(", ")}
**ADD**: ${review.habitAdjustments.add.join(", ")}

### Success Metrics
**Quantitative**:
${review.successMetrics.quantitative.map((m) => `- ${m}`).join("\n")}

**Qualitative**:
${review.successMetrics.qualitative.map((m) => `- ${m}`).join("\n")}

---

## 💭 REFLECTIONS

### What I Learned
${review.insights.learned.map((l) => `- ${l}`).join("\n")}

### What Surprised Me
${review.insights.surprised.map((s) => `- ${s}`).join("\n")}

### Gratitude
${review.insights.grateful.map((g) => `- ${g}`).join("\n")}

### Looking Forward To
${review.insights.lookingForward.map((f) => `- ${f}`).join("\n")}

---

**Next Review**: ${review.nextReviewDate}
**Status**: Complete
`;
}

/**
 * Main skill export
 */
export default {
  name: "Monthly Review",
  version: "1.0.0",
  description: "Comprehensive monthly review aggregating weekly data and planning next month",
  getMonthCode,
  getMonthlyReviewPath,
  getNextMonthlyReviewDate,
  aggregateWinPatterns,
  calculateCompletionRates,
  trackLifeAreaMomentum,
  formatMonthlyReviewMarkdown,
  ReviewPhase,
  MonthTheme,
  Trend,
  PatternType,
};
