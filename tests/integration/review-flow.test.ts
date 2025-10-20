/**
 * Review Flow Integration Tests
 * End-to-end tests for the complete review aggregation workflow
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  parseDailyLog,
  aggregateDailyToWeekly,
  aggregateWeeklyToMonthly,
  readDailyLogs,
  generateWeeklyReviewMarkdown,
  generateMonthlyReviewMarkdown,
  DailyLog,
  WeeklyReview,
} from '../../src/utils/review-aggregator';
import { parseMarkdown, getAllTasks, getCompletionRate } from '../../src/utils/markdown-parser';

describe('Review Flow Integration', () => {
  let testDir: string;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = join(tmpdir(), `review-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Cleanup test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Complete Review Cycle', () => {
    it('should process daily logs through to monthly review', async () => {
      // Step 1: Create sample daily logs
      const dailyLogs = [
        {
          date: '2025-01-06',
          content: `---
date: 2025-01-06
---

# Daily Log

## Wins
- Completed feature A
- Fixed bug B

## Goals
- [x] Task 1
- [x] Task 2
- [ ] Task 3

## Notes
Productive day
`,
        },
        {
          date: '2025-01-07',
          content: `---
date: 2025-01-07
---

# Daily Log

## Wins
- Deployed to production
- Completed feature B

## Goals
- [x] Task 4
- [x] Task 5
- [x] Task 6

## Notes
Great deployment
`,
        },
        {
          date: '2025-01-08',
          content: `---
date: 2025-01-08
---

# Daily Log

## Wins
- Code review completed

## Goals
- [x] Task 7
- [ ] Task 8

## Notes
Midweek progress
`,
        },
      ];

      // Write daily logs to test directory
      for (const log of dailyLogs) {
        await fs.writeFile(join(testDir, `${log.date}.md`), log.content);
      }

      // Step 2: Read and parse daily logs
      const parsedLogs = await readDailyLogs(testDir);
      expect(parsedLogs).toHaveLength(3);

      // Verify daily log parsing
      expect(parsedLogs[0].date).toBe('2025-01-06');
      expect(parsedLogs[0].wins).toContain('Completed feature A');
      expect(parsedLogs[0].tasks.length).toBeGreaterThan(0);

      // Step 3: Aggregate into weekly review
      const weeklyReview: WeeklyReview = {
        weekNumber: 2,
        ...aggregateDailyToWeekly(parsedLogs),
      };

      expect(weeklyReview.totalTasks).toBe(8);
      expect(weeklyReview.completedTasks).toBe(6);
      expect(weeklyReview.completionRate).toBe(75);
      expect(weeklyReview.topWins.length).toBeGreaterThan(0);

      // Step 4: Generate and save weekly review
      const weeklyMarkdown = generateWeeklyReviewMarkdown(weeklyReview);
      const weeklyPath = join(testDir, 'weekly-review-2.md');
      await fs.writeFile(weeklyPath, weeklyMarkdown);

      // Verify weekly review file
      const weeklyContent = await fs.readFile(weeklyPath, 'utf-8');
      expect(weeklyContent).toContain('# Weekly Review - Week 2');
      expect(weeklyContent).toContain('completion_rate: 75');

      // Step 5: Create multiple weeks for monthly aggregation
      const week1: WeeklyReview = {
        weekNumber: 1,
        startDate: '2025-01-01',
        endDate: '2025-01-05',
        dailyLogs: [],
        totalTasks: 15,
        completedTasks: 12,
        completionRate: 80,
        topWins: ['Major achievement', 'Completed project'],
        patterns: ['Consistent performance'],
        goals: [],
      };

      // Step 6: Aggregate into monthly review
      const monthlyReview = aggregateWeeklyToMonthly([week1, weeklyReview]);

      expect(monthlyReview.month).toBe('January');
      expect(monthlyReview.year).toBe(2025);
      expect(monthlyReview.totalTasks).toBe(23); // 15 + 8
      expect(monthlyReview.completedTasks).toBe(18); // 12 + 6
      expect(monthlyReview.weeklyReviews).toHaveLength(2);

      // Step 7: Generate and save monthly review
      const monthlyMarkdown = generateMonthlyReviewMarkdown(monthlyReview);
      const monthlyPath = join(testDir, 'monthly-review-2025-01.md');
      await fs.writeFile(monthlyPath, monthlyMarkdown);

      // Verify monthly review file
      const monthlyContent = await fs.readFile(monthlyPath, 'utf-8');
      expect(monthlyContent).toContain('# Monthly Review - January 2025');
      expect(monthlyContent).toContain('### Week 1');
      expect(monthlyContent).toContain('### Week 2');
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data integrity through aggregation levels', async () => {
      // Create consistent test data
      const dailyContent = `---
date: 2025-01-06
---

# Daily Log

## Wins
- Win 1
- Win 2

## Goals
- [x] Task A
- [x] Task B
- [ ] Task C
`;

      await fs.writeFile(join(testDir, '2025-01-06.md'), dailyContent);

      // Parse daily log
      const dailyLog = await parseDailyLog(join(testDir, '2025-01-06.md'));

      // Verify daily level
      expect(dailyLog.tasks).toHaveLength(3);
      expect(dailyLog.tasks.filter((t) => t.completed)).toHaveLength(2);
      expect(dailyLog.wins).toHaveLength(2);

      // Aggregate to weekly
      const weeklyReview: WeeklyReview = {
        weekNumber: 1,
        ...aggregateDailyToWeekly([dailyLog]),
      };

      // Verify weekly level consistency
      expect(weeklyReview.totalTasks).toBe(3);
      expect(weeklyReview.completedTasks).toBe(2);
      expect(weeklyReview.completionRate).toBe(67); // 2/3 = 66.67% rounds to 67
      expect(weeklyReview.topWins).toContain('Win 1');
      expect(weeklyReview.topWins).toContain('Win 2');

      // Aggregate to monthly
      const monthlyReview = aggregateWeeklyToMonthly([weeklyReview]);

      // Verify monthly level consistency
      expect(monthlyReview.totalTasks).toBe(3);
      expect(monthlyReview.completedTasks).toBe(2);
      expect(monthlyReview.completionRate).toBe(67);
      expect(monthlyReview.topWins).toContain('Win 1');
      expect(monthlyReview.topWins).toContain('Win 2');
    });

    it('should preserve task details through parsing and aggregation', async () => {
      const content = `---
date: 2025-01-06
---

# Daily Log

## Tasks

- [x] High priority task [!!!]
- [ ] Medium priority task [!!]
- [x] Low priority task [!]
- [ ] Normal task
`;

      await fs.writeFile(join(testDir, '2025-01-06.md'), content);

      // Parse and verify
      const log = await parseDailyLog(join(testDir, '2025-01-06.md'));

      expect(log.tasks).toHaveLength(4);

      const highPriority = log.tasks.find((t) => t.text === 'High priority task');
      expect(highPriority?.priority).toBe('high');
      expect(highPriority?.completed).toBe(true);

      const mediumPriority = log.tasks.find((t) => t.text === 'Medium priority task');
      expect(mediumPriority?.priority).toBe('medium');
      expect(mediumPriority?.completed).toBe(false);

      const lowPriority = log.tasks.find((t) => t.text === 'Low priority task');
      expect(lowPriority?.priority).toBe('low');
      expect(lowPriority?.completed).toBe(true);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle week with varying productivity', async () => {
      // Create realistic week with ups and downs
      const days = [
        {
          date: '2025-01-06',
          wins: ['Started strong', 'Completed planning'],
          tasks: 8,
          completed: 7,
        },
        {
          date: '2025-01-07',
          wins: ['Maintained momentum'],
          tasks: 10,
          completed: 8,
        },
        {
          date: '2025-01-08',
          wins: ['Pushed through difficulties'],
          tasks: 6,
          completed: 3,
        },
        {
          date: '2025-01-09',
          wins: ['Recovered well', 'Team collaboration'],
          tasks: 9,
          completed: 8,
        },
        {
          date: '2025-01-10',
          wins: ['Finished strong', 'Met all deadlines'],
          tasks: 12,
          completed: 11,
        },
      ];

      // Create daily logs
      for (const day of days) {
        const content = `---
date: ${day.date}
---

# Daily Log

## Wins
${day.wins.map((w) => `- ${w}`).join('\n')}

## Goals
${Array(day.tasks)
  .fill(null)
  .map((_, i) => `- [${i < day.completed ? 'x' : ' '}] Task ${i + 1}`)
  .join('\n')}
`;
        await fs.writeFile(join(testDir, `${day.date}.md`), content);
      }

      // Process full week
      const logs = await readDailyLogs(testDir);
      const weeklyReview: WeeklyReview = {
        weekNumber: 2,
        ...aggregateDailyToWeekly(logs),
      };

      // Verify aggregation
      expect(weeklyReview.totalTasks).toBe(45); // 8+10+6+9+12
      expect(weeklyReview.completedTasks).toBe(37); // 7+8+3+8+11
      expect(weeklyReview.completionRate).toBe(82); // 37/45 = 82.22%

      // Check pattern detection
      expect(weeklyReview.patterns).toBeDefined();
      expect(weeklyReview.patterns.some((p) => p.includes('Variable task workload'))).toBe(true);

      // Verify all wins captured
      const allWins = days.flatMap((d) => d.wins);
      weeklyReview.topWins.forEach((win) => {
        expect(allWins).toContain(win);
      });
    });

    it('should generate usable markdown for review workflow', async () => {
      // Create realistic monthly data
      const weeks: WeeklyReview[] = Array(4)
        .fill(null)
        .map((_, i) => ({
          weekNumber: i + 1,
          startDate: `2025-01-${String((i * 7) + 1).padStart(2, '0')}`,
          endDate: `2025-01-${String((i + 1) * 7).padStart(2, '0')}`,
          dailyLogs: [],
          totalTasks: 30 + i * 5,
          completedTasks: 24 + i * 4,
          completionRate: Math.round(((24 + i * 4) / (30 + i * 5)) * 100),
          topWins: [
            `Week ${i + 1} achievement 1`,
            `Week ${i + 1} achievement 2`,
            `Week ${i + 1} achievement 3`,
          ],
          patterns: [`Week ${i + 1} pattern`],
          goals: [`Week ${i + 1} goal`],
        }));

      const monthlyReview = aggregateWeeklyToMonthly(weeks);
      const markdown = generateMonthlyReviewMarkdown(monthlyReview);

      // Verify markdown structure
      const parsed = parseMarkdown(markdown);

      // Check front matter
      expect(parsed.frontMatter.month).toBe('January');
      expect(parsed.frontMatter.year).toBe(2025);

      // Check sections
      expect(parsed.sections.some((s) => s.heading === 'Summary')).toBe(true);
      expect(parsed.sections.some((s) => s.heading === 'Top Achievements')).toBe(true);
      expect(parsed.sections.some((s) => s.heading === 'Weekly Breakdown')).toBe(true);

      // Verify it can be parsed back
      expect(parsed.sections.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing daily log files gracefully', async () => {
      // Attempt to read from empty directory
      const logs = await readDailyLogs(testDir);
      expect(logs).toEqual([]);
    });

    it('should handle corrupted daily log files', async () => {
      // Create corrupted file
      await fs.writeFile(join(testDir, '2025-01-06.md'), 'This is not valid markdown\n\n');

      const logs = await readDailyLogs(testDir);

      // Should still parse but with minimal data
      expect(logs).toHaveLength(1);
      expect(logs[0].date).toBe('2025-01-06');
    });

    it('should handle weekly aggregation with single day', async () => {
      const content = `---
date: 2025-01-06
---

# Single Day

## Wins
- One win

## Goals
- [x] One task
`;

      await fs.writeFile(join(testDir, '2025-01-06.md'), content);

      const logs = await readDailyLogs(testDir);
      const weekly = aggregateDailyToWeekly(logs);

      expect(weekly.startDate).toBe('2025-01-06');
      expect(weekly.endDate).toBe('2025-01-06');
      expect(weekly.dailyLogs).toHaveLength(1);
    });

    it('should handle monthly aggregation with single week', async () => {
      const week: WeeklyReview = {
        weekNumber: 1,
        startDate: '2025-01-01',
        endDate: '2025-01-07',
        dailyLogs: [],
        totalTasks: 10,
        completedTasks: 8,
        completionRate: 80,
        topWins: ['Win'],
        patterns: ['Pattern'],
        goals: [],
      };

      const monthly = aggregateWeeklyToMonthly([week]);

      expect(monthly.weeklyReviews).toHaveLength(1);
      expect(monthly.month).toBe('January');
      expect(monthly.totalTasks).toBe(10);
    });
  });

  describe('Performance', () => {
    it('should handle large number of daily logs efficiently', async () => {
      // Create 30 days of logs
      const promises = [];
      for (let i = 1; i <= 30; i++) {
        const content = `---
date: 2025-01-${String(i).padStart(2, '0')}
---

# Daily Log

## Goals
${Array(10)
  .fill(null)
  .map((_, j) => `- [${j % 2 === 0 ? 'x' : ' '}] Task ${j}`)
  .join('\n')}
`;
        promises.push(fs.writeFile(join(testDir, `2025-01-${String(i).padStart(2, '0')}.md`), content));
      }

      await Promise.all(promises);

      const startTime = Date.now();

      // Read and aggregate
      const logs = await readDailyLogs(testDir);
      expect(logs).toHaveLength(30);

      const weekly = aggregateDailyToWeekly(logs);
      expect(weekly.dailyLogs).toHaveLength(30);

      const duration = Date.now() - startTime;

      // Should complete in reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
    });
  });
});
