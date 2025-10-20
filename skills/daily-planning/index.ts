/**
 * Daily Planning Skill
 *
 * Structured daily planning workflow combining morning intention-setting
 * with evening reflection for maximum productivity and continuous learning.
 *
 * @module daily-planning
 */

/**
 * Priority level for tasks
 */
export enum PriorityLevel {
  P1 = "Priority 1 - Most Important + Urgent",
  P2 = "Priority 2 - Important but Less Urgent",
  P3 = "Priority 3 - Important Work",
}

/**
 * Energy level required for a task
 */
export enum EnergyLevel {
  HIGH = "High Energy - Complex problems, creative work, decisions",
  MEDIUM = "Medium Energy - Communication, collaboration, routine",
  LOW = "Low Energy - Administrative, organizing, simple execution",
}

/**
 * Time block in daily schedule
 */
export enum TimeBlock {
  MORNING = "Morning Block (9am-12pm) - Deep Work",
  AFTERNOON = "Afternoon Block (1pm-4pm) - Collaboration",
  LATE_DAY = "Late Day Block (4pm-6pm) - Admin & Planning",
}

/**
 * Daily priority item
 */
export interface DailyPriority {
  level: PriorityLevel;
  task: string;
  estimatedHours: number;
  energyRequired: EnergyLevel;
  timeBlock: TimeBlock;
  completed: boolean;
  notes?: string;
}

/**
 * Morning planning session
 */
export interface MorningPlan {
  date: string; // ISO date string
  intention: string; // 1-2 sentence daily intention
  priorities: DailyPriority[]; // Top 3 priorities
  scheduleReviewed: boolean;
  environmentPrepared: boolean;
  energyLevel?: number; // 1-10 scale, optional morning reading
}

/**
 * Win documented during the day
 */
export interface DailyWin {
  description: string;
  category: "completed" | "progress" | "learning" | "unexpected";
  relatedPriority?: PriorityLevel;
}

/**
 * Evening reflection session
 */
export interface EveningReflection {
  date: string; // ISO date string
  wins: DailyWin[];
  prioritiesCompleted: number; // Count of top 3 completed
  energyLevel: number; // 1-10 scale
  peakHours: string; // e.g., "9am-12pm"
  lowHours: string; // e.g., "3-4pm"
  keyLearning: string;
  tomorrowFocus: string[];
  gratitude: string;
  reflectionQuestions: {
    accomplishedPriorities: string;
    mostProductiveHour: string;
    stopStartContinue: string;
  };
}

/**
 * Complete daily log entry
 */
export interface DailyLog {
  date: string; // ISO date string
  morningPlan: MorningPlan;
  eveningReflection: EveningReflection;
  actualTimeSpent?: { [key: string]: number }; // Task -> hours
}

/**
 * Task prioritization criteria
 */
export interface PrioritizationCriteria {
  impact: "high" | "medium" | "low";
  urgency: "urgent" | "soon" | "later";
  energyMatch: EnergyLevel;
  estimatedTime: number; // in hours
}

/**
 * Calculate priority level from criteria
 */
export function calculatePriority(criteria: PrioritizationCriteria): PriorityLevel {
  if (criteria.impact === "high" && criteria.urgency === "urgent") {
    return PriorityLevel.P1;
  } else if (criteria.impact === "high") {
    return PriorityLevel.P2;
  } else {
    return PriorityLevel.P3;
  }
}

/**
 * Match task to appropriate time block based on energy
 */
export function matchTimeBlock(energyLevel: EnergyLevel): TimeBlock {
  switch (energyLevel) {
    case EnergyLevel.HIGH:
      return TimeBlock.MORNING;
    case EnergyLevel.MEDIUM:
      return TimeBlock.AFTERNOON;
    case EnergyLevel.LOW:
      return TimeBlock.LATE_DAY;
  }
}

/**
 * Calculate priority completion rate
 */
export function calculateCompletionRate(priorities: DailyPriority[]): number {
  if (priorities.length === 0) return 0;
  const completed = priorities.filter((p) => p.completed).length;
  return Math.round((completed / priorities.length) * 100);
}

/**
 * Generate daily log markdown
 */
export function formatDailyLogMarkdown(log: DailyLog): string {
  const { date, morningPlan, eveningReflection } = log;

  return `## ${date} - Daily Review

### Morning Intention
${morningPlan.intention}

### Top 3 Priorities
${morningPlan.priorities
  .map(
    (p, i) =>
      `${i + 1}. ${p.task} - ${p.completed ? "✓" : "✗"} (${p.estimatedHours}h, ${p.energyRequired})`
  )
  .join("\n")}

### Wins Today
${eveningReflection.wins.map((w) => `- ${w.description} [${w.category}]`).join("\n")}

### Energy Level: ${eveningReflection.energyLevel}/10
Peak hours: ${eveningReflection.peakHours}
Low hours: ${eveningReflection.lowHours}

### Key Learning
${eveningReflection.keyLearning}

### Tomorrow Focus
${eveningReflection.tomorrowFocus.map((f) => `- ${f}`).join("\n")}

### Gratitude
${eveningReflection.gratitude}

---

### Reflection Questions

**Did I accomplish my top 3 priorities?**
${eveningReflection.reflectionQuestions.accomplishedPriorities}

**What was my most productive hour?**
${eveningReflection.reflectionQuestions.mostProductiveHour}

**Stop/Start/Continue?**
${eveningReflection.reflectionQuestions.stopStartContinue}
`;
}

/**
 * Generate weekly completion summary
 */
export function generateWeeklySummary(logs: DailyLog[]): {
  averageCompletionRate: number;
  totalWins: number;
  averageEnergyLevel: number;
  topPatterns: string[];
} {
  const completionRates = logs.map((log) =>
    calculateCompletionRate(log.morningPlan.priorities)
  );
  const totalWins = logs.reduce((sum, log) => sum + log.eveningReflection.wins.length, 0);
  const energyLevels = logs.map((log) => log.eveningReflection.energyLevel);

  return {
    averageCompletionRate:
      Math.round((completionRates.reduce((a, b) => a + b, 0) / completionRates.length) * 10) / 10,
    totalWins,
    averageEnergyLevel:
      Math.round((energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length) * 10) / 10,
    topPatterns: [], // Would be calculated from actual data analysis
  };
}

/**
 * Validate daily priorities (max 3, must have unique levels)
 */
export function validatePriorities(priorities: DailyPriority[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (priorities.length > 3) {
    errors.push("Maximum 3 priorities allowed per day");
  }

  if (priorities.length < 1) {
    errors.push("At least 1 priority required");
  }

  const levels = priorities.map((p) => p.level);
  const uniqueLevels = new Set(levels);
  if (levels.length !== uniqueLevels.size) {
    errors.push("Each priority must have a unique level (P1, P2, P3)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Main skill export
 */
export default {
  name: "Daily Planning",
  version: "1.0.0",
  description: "Structured daily planning with morning intention and evening reflection",
  calculatePriority,
  matchTimeBlock,
  calculateCompletionRate,
  formatDailyLogMarkdown,
  generateWeeklySummary,
  validatePriorities,
  PriorityLevel,
  EnergyLevel,
  TimeBlock,
};
