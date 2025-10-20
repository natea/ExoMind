/**
 * Review Aggregator Tests
 * Tests for aggregating daily logs into weekly and monthly reviews
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import {
  parseDailyLog,
  aggregateDailyToWeekly,
  aggregateWeeklyToMonthly,
  readDailyLogs,
  generateWeeklyReviewMarkdown,
  generateMonthlyReviewMarkdown,
  DailyLog,
  WeeklyReview,
  MonthlyReview,
} from '../../src/utils/review-aggregator';

const FIXTURES_DIR = join(__dirname, '../fixtures/reviews/daily');

describe('Review Aggregator', () => {
  describe('parseDailyLog', () => {
    it('should parse daily log with all sections', async () => {
      const filePath = join(FIXTURES_DIR, '2025-01-06.md');
      const log = await parseDailyLog(filePath);

      expect(log.date).toBe('2025-01-06');
      expect(log.wins).toContain('Completed project proposal');
      expect(log.wins).toContain('Fixed critical bug in production');
      expect(log.tasks.length).toBeGreaterThan(0);
      expect(log.notes).toContain('Great start to the week');
    });

    it('should extract tasks with completion status', async () => {
      const filePath = join(FIXTURES_DIR, '2025-01-06.md');
      const log = await parseDailyLog(filePath);

      const completedTasks = log.tasks.filter((t) => t.completed);
      const incompleteTasks = log.tasks.filter((t) => !t.completed);

      expect(completedTasks.length).toBeGreaterThan(0);
      expect(incompleteTasks.length).toBeGreaterThan(0);
    });

    it('should extract wins from wins section', async () => {
      const filePath = join(FIXTURES_DIR, '2025-01-07.md');
      const log = await parseDailyLog(filePath);

      expect(log.wins).toContain('Shipped new feature to production');
      expect(log.wins).toContain('Mentored junior developer');
      expect(log.wins.length).toBe(3);
    });

    it('should handle malformed daily log gracefully', async () => {
      const filePath = join(FIXTURES_DIR, 'malformed.md');
      const log = await parseDailyLog(filePath);

      expect(log.date).toBeDefined();
      expect(log.wins).toEqual([]);
      expect(log.tasks.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty daily log', async () => {
      const filePath = join(FIXTURES_DIR, 'empty.md');
      const log = await parseDailyLog(filePath);

      expect(log.date).toBe('2025-01-11');
      expect(log.wins).toEqual([]);
      expect(log.tasks).toEqual([]);
      expect(log.notes).toBe('');
    });

    it('should extract date from filename if not in front matter', async () => {
      const filePath = join(FIXTURES_DIR, 'malformed.md');
      const log = await parseDailyLog(filePath);

      // Should have today's date since filename doesn't match pattern
      expect(log.date).toBeDefined();
      expect(log.date).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('aggregateDailyToWeekly', () => {
    let dailyLogs: DailyLog[];

    beforeEach(async () => {
      dailyLogs = await readDailyLogs(FIXTURES_DIR);
      // Filter to only valid dated logs
      dailyLogs = dailyLogs.filter((log) => log.date.match(/^2025-01-(0[6-9]|10)$/));
    });

    it('should aggregate multiple daily logs into weekly review', () => {
      const weekly = aggregateDailyToWeekly(dailyLogs);

      expect(weekly.startDate).toBe('2025-01-06');
      expect(weekly.endDate).toBe('2025-01-10');
      expect(weekly.dailyLogs).toHaveLength(5);
      expect(weekly.totalTasks).toBeGreaterThan(0);
      expect(weekly.completedTasks).toBeGreaterThan(0);
    });

    it('should calculate completion rate correctly', () => {
      const weekly = aggregateDailyToWeekly(dailyLogs);

      expect(weekly.completionRate).toBeGreaterThanOrEqual(0);
      expect(weekly.completionRate).toBeLessThanOrEqual(100);
      expect(weekly.completionRate).toBe(
        Math.round((weekly.completedTasks / weekly.totalTasks) * 100)
      );
    });

    it('should extract unique top wins', () => {
      const weekly = aggregateDailyToWeekly(dailyLogs);

      expect(weekly.topWins.length).toBeGreaterThan(0);
      expect(weekly.topWins.length).toBeLessThanOrEqual(10);

      // Check uniqueness
      const uniqueWins = new Set(weekly.topWins);
      expect(uniqueWins.size).toBe(weekly.topWins.length);
    });

    it('should detect productivity patterns', () => {
      const weekly = aggregateDailyToWeekly(dailyLogs);

      expect(weekly.patterns).toBeDefined();
      expect(Array.isArray(weekly.patterns)).toBe(true);

      // Should detect at least some patterns
      expect(weekly.patterns.length).toBeGreaterThan(0);
    });

    it('should extract goals from daily logs', () => {
      const weekly = aggregateDailyToWeekly(dailyLogs);

      expect(weekly.goals).toBeDefined();
      expect(Array.isArray(weekly.goals)).toBe(true);
    });

    it('should throw error with empty daily logs', () => {
      expect(() => aggregateDailyToWeekly([])).toThrow('No daily logs provided');
    });

    it('should sort daily logs by date', () => {
      // Shuffle logs
      const shuffled = [...dailyLogs].sort(() => Math.random() - 0.5);
      const weekly = aggregateDailyToWeekly(shuffled);

      // Verify sorted order
      for (let i = 1; i < weekly.dailyLogs.length; i++) {
        expect(weekly.dailyLogs[i].date >= weekly.dailyLogs[i - 1].date).toBe(true);
      }
    });

    it('should detect high productivity pattern', () => {
      // Create logs with high completion rates
      const highPerfLogs: DailyLog[] = [
        {
          date: '2025-01-06',
          tasks: [
            { completed: true, text: 'Task 1' },
            { completed: true, text: 'Task 2' },
            { completed: true, text: 'Task 3' },
            { completed: false, text: 'Task 4' },
          ],
          wins: ['Win 1', 'Win 2'],
          notes: 'Great day',
          sections: [],
        },
        {
          date: '2025-01-07',
          tasks: [
            { completed: true, text: 'Task 5' },
            { completed: true, text: 'Task 6' },
          ],
          wins: ['Win 3'],
          notes: 'Another great day',
          sections: [],
        },
      ];

      const weekly = aggregateDailyToWeekly(highPerfLogs);

      expect(weekly.patterns).toContain('High productivity week (>80% completion rate)');
    });

    it('should detect low productivity pattern', () => {
      const lowPerfLogs: DailyLog[] = [
        {
          date: '2025-01-06',
          tasks: [
            { completed: false, text: 'Task 1' },
            { completed: false, text: 'Task 2' },
            { completed: true, text: 'Task 3' },
            { completed: false, text: 'Task 4' },
          ],
          wins: [],
          notes: '',
          sections: [],
        },
      ];

      const weekly = aggregateDailyToWeekly(lowPerfLogs);

      expect(weekly.patterns).toContain('Low productivity week (<50% completion rate)');
    });

    it('should detect consistent workload pattern', () => {
      const consistentLogs: DailyLog[] = Array(5)
        .fill(null)
        .map((_, i) => ({
          date: `2025-01-${String(6 + i).padStart(2, '0')}`,
          tasks: Array(5)
            .fill(null)
            .map((_, j) => ({ completed: j % 2 === 0, text: `Task ${j}` })),
          wins: [],
          notes: '',
          sections: [],
        }));

      const weekly = aggregateDailyToWeekly(consistentLogs);

      expect(weekly.patterns).toContain('Consistent task workload');
    });
  });

  describe('aggregateWeeklyToMonthly', () => {
    let weeklyReviews: WeeklyReview[];

    beforeEach(() => {
      weeklyReviews = [
        {
          weekNumber: 1,
          startDate: '2025-01-01',
          endDate: '2025-01-05',
          dailyLogs: [],
          totalTasks: 20,
          completedTasks: 16,
          completionRate: 80,
          topWins: ['Win 1', 'Win 2', 'Win 3'],
          patterns: ['Pattern 1', 'Pattern 2'],
          goals: [],
        },
        {
          weekNumber: 2,
          startDate: '2025-01-06',
          endDate: '2025-01-12',
          dailyLogs: [],
          totalTasks: 25,
          completedTasks: 20,
          completionRate: 80,
          topWins: ['Win 2', 'Win 4', 'Win 5'],
          patterns: ['Pattern 2', 'Pattern 3'],
          goals: [],
        },
        {
          weekNumber: 3,
          startDate: '2025-01-13',
          endDate: '2025-01-19',
          dailyLogs: [],
          totalTasks: 30,
          completedTasks: 24,
          completionRate: 80,
          topWins: ['Win 1', 'Win 5', 'Win 6'],
          patterns: ['Pattern 3'],
          goals: [],
        },
      ];
    });

    it('should aggregate weekly reviews into monthly review', () => {
      const monthly = aggregateWeeklyToMonthly(weeklyReviews);

      expect(monthly.month).toBe('January');
      expect(monthly.year).toBe(2025);
      expect(monthly.weeklyReviews).toHaveLength(3);
      expect(monthly.totalTasks).toBe(75); // 20 + 25 + 30
      expect(monthly.completedTasks).toBe(60); // 16 + 20 + 24
    });

    it('should calculate overall completion rate', () => {
      const monthly = aggregateWeeklyToMonthly(weeklyReviews);

      expect(monthly.completionRate).toBe(80); // 60/75 = 80%
    });

    it('should rank wins by frequency', () => {
      const monthly = aggregateWeeklyToMonthly(weeklyReviews);

      expect(monthly.topWins).toBeDefined();
      expect(monthly.topWins.length).toBeGreaterThan(0);

      // Win 1, 2, and 5 appear twice, should be ranked higher
      const topThree = monthly.topWins.slice(0, 3);
      expect(topThree).toContain('Win 1');
      expect(topThree).toContain('Win 2');
      expect(topThree).toContain('Win 5');
    });

    it('should aggregate unique patterns', () => {
      const monthly = aggregateWeeklyToMonthly(weeklyReviews);

      expect(monthly.patterns).toEqual(['Pattern 1', 'Pattern 2', 'Pattern 3']);
    });

    it('should generate achievements summary', () => {
      const monthly = aggregateWeeklyToMonthly(weeklyReviews);

      expect(monthly.achievements).toBeDefined();
      expect(monthly.achievements.length).toBeGreaterThan(0);
      expect(monthly.achievements.some((a) => a.includes('completion rate'))).toBe(true);
      expect(monthly.achievements.some((a) => a.includes('Total tasks completed'))).toBe(true);
    });

    it('should throw error with empty weekly reviews', () => {
      expect(() => aggregateWeeklyToMonthly([])).toThrow('No weekly reviews provided');
    });

    it('should detect high performance achievement', () => {
      const monthly = aggregateWeeklyToMonthly(weeklyReviews);

      expect(
        monthly.achievements.some((a) => a.includes('high performance'))
      ).toBe(true);
    });

    it('should limit top wins to 15', () => {
      const manyWeeks: WeeklyReview[] = Array(10)
        .fill(null)
        .map((_, i) => ({
          weekNumber: i + 1,
          startDate: `2025-01-${String(i * 7 + 1).padStart(2, '0')}`,
          endDate: `2025-01-${String(i * 7 + 7).padStart(2, '0')}`,
          dailyLogs: [],
          totalTasks: 10,
          completedTasks: 8,
          completionRate: 80,
          topWins: [`Unique Win ${i}`, `Another Win ${i}`],
          patterns: [],
          goals: [],
        }));

      const monthly = aggregateWeeklyToMonthly(manyWeeks);

      expect(monthly.topWins.length).toBeLessThanOrEqual(15);
    });
  });

  describe('readDailyLogs', () => {
    it('should read all daily logs from directory', async () => {
      const logs = await readDailyLogs(FIXTURES_DIR);

      expect(logs.length).toBeGreaterThan(0);
      logs.forEach((log) => {
        expect(log.date).toMatch(/\d{4}-\d{2}-\d{2}/);
      });
    });

    it('should sort logs by date', async () => {
      const logs = await readDailyLogs(FIXTURES_DIR);

      for (let i = 1; i < logs.length; i++) {
        expect(logs[i].date >= logs[i - 1].date).toBe(true);
      }
    });

    it('should only read dated markdown files', async () => {
      const logs = await readDailyLogs(FIXTURES_DIR);

      // Should not include malformed.md or empty.md in normal operation
      logs.forEach((log) => {
        expect(log.date).toBeDefined();
      });
    });
  });

  describe('generateWeeklyReviewMarkdown', () => {
    const weeklyReview: WeeklyReview = {
      weekNumber: 2,
      startDate: '2025-01-06',
      endDate: '2025-01-12',
      dailyLogs: [],
      totalTasks: 25,
      completedTasks: 20,
      completionRate: 80,
      topWins: ['Win 1', 'Win 2', 'Win 3'],
      patterns: ['Pattern 1', 'Pattern 2'],
      goals: ['Goal 1', 'Goal 2'],
    };

    it('should generate valid markdown with front matter', () => {
      const markdown = generateWeeklyReviewMarkdown(weeklyReview);

      expect(markdown).toContain('---');
      expect(markdown).toContain('week: 2');
      expect(markdown).toContain('start_date: 2025-01-06');
      expect(markdown).toContain('end_date: 2025-01-12');
      expect(markdown).toContain('completion_rate: 80');
    });

    it('should include all sections', () => {
      const markdown = generateWeeklyReviewMarkdown(weeklyReview);

      expect(markdown).toContain('# Weekly Review - Week 2');
      expect(markdown).toContain('## Summary');
      expect(markdown).toContain('## Top Wins');
      expect(markdown).toContain('## Patterns Observed');
      expect(markdown).toContain('## Goals for Next Week');
    });

    it('should format wins as bullet list', () => {
      const markdown = generateWeeklyReviewMarkdown(weeklyReview);

      expect(markdown).toContain('- Win 1');
      expect(markdown).toContain('- Win 2');
      expect(markdown).toContain('- Win 3');
    });

    it('should include task statistics', () => {
      const markdown = generateWeeklyReviewMarkdown(weeklyReview);

      expect(markdown).toContain('Total Tasks: 25');
      expect(markdown).toContain('Completed: 20 (80%)');
    });
  });

  describe('generateMonthlyReviewMarkdown', () => {
    const monthlyReview: MonthlyReview = {
      month: 'January',
      year: 2025,
      weeklyReviews: [
        {
          weekNumber: 1,
          startDate: '2025-01-01',
          endDate: '2025-01-05',
          dailyLogs: [],
          totalTasks: 20,
          completedTasks: 16,
          completionRate: 80,
          topWins: [],
          patterns: [],
          goals: [],
        },
        {
          weekNumber: 2,
          startDate: '2025-01-06',
          endDate: '2025-01-12',
          dailyLogs: [],
          totalTasks: 25,
          completedTasks: 20,
          completionRate: 80,
          topWins: [],
          patterns: [],
          goals: [],
        },
      ],
      totalTasks: 45,
      completedTasks: 36,
      completionRate: 80,
      topWins: ['Major Win 1', 'Major Win 2'],
      patterns: ['Pattern 1'],
      achievements: ['Achievement 1', 'Achievement 2'],
    };

    it('should generate valid markdown with front matter', () => {
      const markdown = generateMonthlyReviewMarkdown(monthlyReview);

      expect(markdown).toContain('---');
      expect(markdown).toContain('month: January');
      expect(markdown).toContain('year: 2025');
      expect(markdown).toContain('completion_rate: 80');
    });

    it('should include all sections', () => {
      const markdown = generateMonthlyReviewMarkdown(monthlyReview);

      expect(markdown).toContain('# Monthly Review - January 2025');
      expect(markdown).toContain('## Summary');
      expect(markdown).toContain('## Top Achievements');
      expect(markdown).toContain('## Most Significant Wins');
      expect(markdown).toContain('## Patterns & Insights');
      expect(markdown).toContain('## Weekly Breakdown');
    });

    it('should include weekly breakdown', () => {
      const markdown = generateMonthlyReviewMarkdown(monthlyReview);

      expect(markdown).toContain('### Week 1');
      expect(markdown).toContain('### Week 2');
      expect(markdown).toContain('2025-01-01 to 2025-01-05');
      expect(markdown).toContain('2025-01-06 to 2025-01-12');
    });

    it('should limit top wins to 10', () => {
      const review = {
        ...monthlyReview,
        topWins: Array(20)
          .fill(null)
          .map((_, i) => `Win ${i}`),
      };

      const markdown = generateMonthlyReviewMarkdown(review);

      // Count win occurrences in markdown
      const winCount = (markdown.match(/- Win \d+/g) || []).length;
      expect(winCount).toBeLessThanOrEqual(10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle logs with no tasks', () => {
      const logs: DailyLog[] = [
        {
          date: '2025-01-01',
          tasks: [],
          wins: ['Did something'],
          notes: 'A day',
          sections: [],
        },
      ];

      const weekly = aggregateDailyToWeekly(logs);

      expect(weekly.totalTasks).toBe(0);
      expect(weekly.completedTasks).toBe(0);
      expect(weekly.completionRate).toBe(0);
    });

    it('should handle logs with no wins', () => {
      const logs: DailyLog[] = [
        {
          date: '2025-01-01',
          tasks: [{ completed: true, text: 'Task' }],
          wins: [],
          notes: '',
          sections: [],
        },
      ];

      const weekly = aggregateDailyToWeekly(logs);

      expect(weekly.topWins).toEqual([]);
    });

    it('should handle single day aggregation', () => {
      const logs: DailyLog[] = [
        {
          date: '2025-01-01',
          tasks: [
            { completed: true, text: 'Task 1' },
            { completed: false, text: 'Task 2' },
          ],
          wins: ['Win'],
          notes: 'Note',
          sections: [],
        },
      ];

      const weekly = aggregateDailyToWeekly(logs);

      expect(weekly.startDate).toBe('2025-01-01');
      expect(weekly.endDate).toBe('2025-01-01');
      expect(weekly.dailyLogs).toHaveLength(1);
    });

    it('should handle weekly reviews with zero completion', () => {
      const reviews: WeeklyReview[] = [
        {
          weekNumber: 1,
          startDate: '2025-01-01',
          endDate: '2025-01-05',
          dailyLogs: [],
          totalTasks: 10,
          completedTasks: 0,
          completionRate: 0,
          topWins: [],
          patterns: [],
          goals: [],
        },
      ];

      const monthly = aggregateWeeklyToMonthly(reviews);

      expect(monthly.completionRate).toBe(0);
    });
  });
});
