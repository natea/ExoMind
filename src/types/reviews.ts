/**
 * TypeScript type definitions for review aggregation system
 */

/**
 * Task status in daily logs and reviews
 */
export type TaskStatus = 'completed' | 'pending' | 'in-progress' | 'blocked' | 'cancelled';

/**
 * Task item extracted from markdown
 */
export interface Task {
  description: string;
  status: TaskStatus;
  context?: string;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * A win/achievement extracted from reviews
 */
export interface Win {
  description: string;
  date: string;
  source: 'daily' | 'weekly' | 'monthly';
  category?: string;
}

/**
 * A pattern detected across multiple reviews
 */
export interface Pattern {
  type: 'productivity' | 'challenge' | 'habit' | 'goal' | 'blocker';
  description: string;
  frequency: number;
  dates: string[];
  confidence: number; // 0-1 score
}

/**
 * Front matter metadata from markdown files
 */
export interface FrontMatter {
  date?: string;
  week?: string;
  month?: string;
  year?: number;
  tags?: string[];
  mood?: string;
  energy?: string;
  focus?: string;
  [key: string]: any;
}

/**
 * Parsed section from markdown
 */
export interface MarkdownSection {
  heading: string;
  level: number;
  content: string;
  subsections?: MarkdownSection[];
}

/**
 * Daily log structure
 */
export interface DailyLog {
  date: string;
  filePath: string;
  frontMatter: FrontMatter;
  sections: MarkdownSection[];
  tasks: Task[];
  wins: Win[];
  notes: string[];
  mood?: string;
  energy?: string;
  focus?: string;
}

/**
 * Aggregated weekly data
 */
export interface WeeklyData {
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  dailyLogs: DailyLog[];
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  topWins: Win[];
  commonPatterns: Pattern[];
  moodTrend?: string[];
  energyTrend?: string[];
  focusAreas: string[];
}

/**
 * Weekly review structure
 */
export interface WeeklyReview {
  week: string;
  filePath: string;
  frontMatter: FrontMatter;
  sections: MarkdownSection[];
  wins: Win[];
  lessons: string[];
  goals: string[];
  nextWeekFocus: string[];
  aggregatedData?: WeeklyData;
}

/**
 * Aggregated monthly data
 */
export interface MonthlyData {
  month: string;
  year: number;
  weeklyReviews: WeeklyReview[];
  totalWeeks: number;
  overallCompletionRate: number;
  topWins: Win[];
  recurringPatterns: Pattern[];
  goalProgress: {
    goal: string;
    progress: number;
    status: 'on-track' | 'at-risk' | 'achieved' | 'not-started';
  }[];
  insights: string[];
}

/**
 * Monthly review structure
 */
export interface MonthlyReview {
  month: string;
  year: number;
  filePath: string;
  frontMatter: FrontMatter;
  sections: MarkdownSection[];
  wins: Win[];
  achievements: string[];
  lessons: string[];
  goals: string[];
  nextMonthFocus: string[];
  aggregatedData?: MonthlyData;
}

/**
 * Aggregation result with metadata
 */
export interface AggregationResult<T> {
  success: boolean;
  data?: T;
  errors: Array<{
    file: string;
    error: string;
    severity: 'warning' | 'error';
  }>;
  warnings: string[];
  metadata: {
    filesProcessed: number;
    filesMissing: number;
    processingTime: number;
    timestamp: string;
  };
}

/**
 * Configuration for aggregation
 */
export interface AggregationConfig {
  includeIncomplete?: boolean;
  patternThreshold?: number; // Minimum frequency to detect pattern
  deduplicationSimilarity?: number; // 0-1 threshold for considering items duplicate
  maxWins?: number;
  sortBy?: 'date' | 'importance' | 'category';
}

/**
 * Statistics for a period
 */
export interface PeriodStats {
  totalDays: number;
  daysWithLogs: number;
  loggingRate: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageTasksPerDay: number;
  totalWins: number;
  patternsDetected: number;
}
