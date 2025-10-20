/**
 * Weekly Review Skill
 *
 * Comprehensive GTD weekly review to maintain system integrity,
 * clear your mind, and plan effectively.
 *
 * @module weekly-review
 */

/**
 * GTD list types
 */
export enum GTDList {
  INBOX = "inbox",
  NEXT_ACTIONS = "next-actions",
  PROJECTS = "projects",
  WAITING_FOR = "waiting",
  SOMEDAY_MAYBE = "someday",
  REFERENCE = "reference",
  CALENDAR = "calendar",
}

/**
 * Context tags for next actions
 */
export enum ActionContext {
  HOME = "@home",
  WORK = "@work",
  COMPUTER = "@computer",
  PHONE = "@phone",
  ERRANDS = "@errands",
  WAITING_FOR = "@waiting-for",
}

/**
 * GTD horizons of focus
 */
export enum GTDHorizon {
  RUNWAY = "Runway - Current Actions",
  TEN_K = "10,000 ft - Current Projects",
  TWENTY_K = "20,000 ft - Areas of Focus",
  THIRTY_K = "30,000 ft - 1-2 Year Goals",
  FORTY_K = "40,000 ft - 3-5 Year Vision",
  FIFTY_K = "50,000 ft - Life Purpose",
}

/**
 * Weekly review phase
 */
export enum ReviewPhase {
  GET_CLEAR = "Phase 1: Get Clear (Empty Collection Points)",
  GET_CURRENT = "Phase 2: Get Current (Update Lists)",
  REVIEW_CALENDAR = "Phase 3: Review Calendar",
  GET_CREATIVE = "Phase 4: Get Creative (Big Picture)",
  PLAN_WEEK = "Phase 5: Plan Next Week",
  CLEAN_UP = "Phase 6: Clean Up & Complete",
}

/**
 * Statistics from weekly review
 */
export interface WeeklyReviewStats {
  inboxItemsProcessed: number;
  nextActionsReviewed: number;
  projectsUpdated: number;
  waitingForChecked: number;
  somedayMaybeReviewed: number;
  calendarEventsReviewed: number;
  tasksCompletedLastWeek: number;
  projectsAdvanced: number;
  newActionsCaptured: number;
  itemsArchived: number;
}

/**
 * Weekly priority
 */
export interface WeeklyPriority {
  outcome: string; // What needs to be achieved
  context: ActionContext[];
  estimatedHours: number;
  linkedToGoal?: string; // Optional goal/OKR link
}

/**
 * Complete weekly review session
 */
export interface WeeklyReview {
  weekStartDate: string; // ISO date string (Monday)
  weekEndDate: string; // ISO date string (Sunday)
  reviewDate: string; // ISO date string (when review was done)
  duration: number; // Minutes spent on review
  phasesCompleted: ReviewPhase[];
  stats: WeeklyReviewStats;
  priorities: WeeklyPriority[]; // Top 3 for next week
  insights: {
    wentWell: string[];
    couldImprove: string[];
    learned: string[];
    grateful: string[];
  };
  nextReviewDate: string; // ISO date string
}

/**
 * Collection point to process
 */
export interface CollectionPoint {
  name: string;
  type: "physical" | "digital" | "email" | "messaging";
  itemCount: number;
  processed: boolean;
}

/**
 * Time block for next week
 */
export interface TimeBlock {
  day: string; // Day of week
  startTime: string; // e.g., "9:00"
  endTime: string; // e.g., "12:00"
  purpose: "deep-work" | "admin" | "meetings" | "planning" | "review";
  linkedToPriority?: number; // Index of priority (0-2)
}

/**
 * Calculate week number from date
 */
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Get Monday of the week for a given date
 */
export function getWeekStart(date: Date = new Date()): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff));
}

/**
 * Get Sunday of the week for a given date
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
}

/**
 * Format week range as string
 */
export function formatWeekRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString(
    "en-US",
    options
  )}`;
}

/**
 * Calculate completion rate for review phases
 */
export function calculatePhaseCompletion(completedPhases: ReviewPhase[]): number {
  const totalPhases = Object.keys(ReviewPhase).length;
  return Math.round((completedPhases.length / totalPhases) * 100);
}

/**
 * Generate weekly review markdown
 */
export function formatWeeklyReviewMarkdown(review: WeeklyReview): string {
  const weekRange = formatWeekRange(new Date(review.weekStartDate), new Date(review.weekEndDate));

  return `# Weekly Review - ${weekRange}

**Review Date**: ${review.reviewDate}
**Duration**: ${review.duration} minutes
**Completion**: ${calculatePhaseCompletion(review.phasesCompleted)}%

---

## Completed This Session

✅ Inbox processed: ${review.stats.inboxItemsProcessed} items
✅ Next Actions reviewed: ${review.stats.nextActionsReviewed} items
✅ Projects updated: ${review.stats.projectsUpdated} items
✅ Waiting For checked: ${review.stats.waitingForChecked} items
✅ Someday/Maybe reviewed: ${review.stats.somedayMaybeReviewed} items
✅ Calendar reviewed: Past 7 days + Next 14 days
✅ Weekly plan created

---

## Statistics

- **Tasks completed last week**: ${review.stats.tasksCompletedLastWeek}
- **Projects advanced**: ${review.stats.projectsAdvanced}
- **New actions captured**: ${review.stats.newActionsCaptured}
- **Items archived**: ${review.stats.itemsArchived}

---

## Next Week Focus

${review.priorities
  .map(
    (p, i) =>
      `${i + 1}. **${p.outcome}**
   - Contexts: ${p.context.join(", ")}
   - Estimated: ${p.estimatedHours} hours${p.linkedToGoal ? `\n   - Goal: ${p.linkedToGoal}` : ""}`
  )
  .join("\n\n")}

---

## Insights & Reflection

### What Went Well
${review.insights.wentWell.map((item) => `- ${item}`).join("\n")}

### Could Be Improved
${review.insights.couldImprove.map((item) => `- ${item}`).join("\n")}

### Key Learnings
${review.insights.learned.map((item) => `- ${item}`).join("\n")}

### Gratitude
${review.insights.grateful.map((item) => `- ${item}`).join("\n")}

---

**Next weekly review**: ${review.nextReviewDate}
**Phase completion**: ${review.phasesCompleted.map((p) => `\n- ✓ ${p}`).join("")}
`;
}

/**
 * Validate weekly review priorities
 */
export function validatePriorities(priorities: WeeklyPriority[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (priorities.length > 3) {
    errors.push("Maximum 3 weekly priorities recommended");
  }

  if (priorities.length < 1) {
    errors.push("At least 1 priority required");
  }

  priorities.forEach((p, i) => {
    if (!p.outcome || p.outcome.trim().length === 0) {
      errors.push(`Priority ${i + 1}: Outcome is required`);
    }
    if (p.context.length === 0) {
      errors.push(`Priority ${i + 1}: At least one context required`);
    }
    if (p.estimatedHours <= 0) {
      errors.push(`Priority ${i + 1}: Estimated hours must be positive`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate next weekly review date (7 days from now)
 */
export function getNextReviewDate(date: Date = new Date()): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 7);
  return next;
}

/**
 * Main skill export
 */
export default {
  name: "Weekly Review",
  version: "1.0.0",
  description: "Comprehensive GTD weekly review for system maintenance and planning",
  getWeekNumber,
  getWeekStart,
  getWeekEnd,
  formatWeekRange,
  calculatePhaseCompletion,
  formatWeeklyReviewMarkdown,
  validatePriorities,
  getNextReviewDate,
  GTDList,
  ActionContext,
  GTDHorizon,
  ReviewPhase,
};
