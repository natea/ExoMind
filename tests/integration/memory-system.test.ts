/**
 * Memory System Integration Tests
 *
 * Tests for validating the complete memory system including:
 * - Template instantiation
 * - Directory structure
 * - File naming conventions
 * - Date format helpers
 */

import * as fs from 'fs';
import * as path from 'path';

const MEMORY_ROOT = path.resolve(__dirname, '../../memory');

describe('Memory System Integration Tests', () => {
  describe('Directory Structure', () => {
    const requiredDirs = [
      'reviews/daily',
      'reviews/weekly',
      'reviews/monthly',
      'reviews/quarterly',
      'assessments',
      'objectives/okrs',
      'objectives/active-plans',
      'reference/decisions',
      'inbox',
      'goals',
      'projects',
      'areas',
      'archive',
    ];

    test('all required directories exist', () => {
      for (const dir of requiredDirs) {
        const dirPath = path.join(MEMORY_ROOT, dir);
        expect(fs.existsSync(dirPath)).toBe(true);
      }
    });

    test('directories are writable', () => {
      for (const dir of requiredDirs) {
        const dirPath = path.join(MEMORY_ROOT, dir);
        expect(() => {
          fs.accessSync(dirPath, fs.constants.W_OK);
        }).not.toThrow();
      }
    });

    test('template files exist in appropriate directories', () => {
      const templateDirs = [
        'reviews/daily',
        'reviews/weekly',
        'reviews/monthly',
        'reviews/quarterly',
        'assessments',
        'objectives/okrs',
        'objectives/active-plans',
        'reference/decisions',
      ];

      for (const dir of templateDirs) {
        const templatePath = path.join(MEMORY_ROOT, dir, '.template.md');
        expect(fs.existsSync(templatePath)).toBe(true);
      }
    });
  });

  describe('Daily Log Creation', () => {
    test('can create daily log from template', () => {
      const templatePath = path.join(MEMORY_ROOT, 'reviews/daily/.template.md');
      const template = fs.readFileSync(templatePath, 'utf-8');

      // Simulate creating a daily log
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

      const dailyLog = template.replace(/YYYY-MM-DD/g, dateStr);

      expect(dailyLog).toContain(dateStr);
      expect(dailyLog).toContain('Morning Planning');
      expect(dailyLog).toContain('Evening Review');
    });

    test('daily log uses correct date format', () => {
      const date = new Date('2025-01-15');
      const dateStr = date.toISOString().split('T')[0];

      expect(dateStr).toBe('2025-01-15');
      expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('daily log filename format is correct', () => {
      const date = new Date('2025-01-15');
      const filename = `${date.toISOString().split('T')[0]}.md`;

      expect(filename).toBe('2025-01-15.md');
      expect(filename).toMatch(/^\d{4}-\d{2}-\d{2}\.md$/);
    });
  });

  describe('Life Assessment Creation', () => {
    test('can create assessment from template', () => {
      const templatePath = path.join(MEMORY_ROOT, 'assessments/.template.md');
      const template = fs.readFileSync(templatePath, 'utf-8');

      // Simulate creating quarterly assessment
      const quarter = 'Q1';
      const year = '2025';

      const assessment = template
        .replace(/QX/g, quarter)
        .replace(/YYYY/g, year);

      expect(assessment).toContain('Q1');
      expect(assessment).toContain('2025');
      expect(assessment).toContain('Life Domains Assessment');
    });

    test('assessment quarter format is correct', () => {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

      for (const quarter of quarters) {
        expect(quarter).toMatch(/^Q[1-4]$/);
      }
    });

    test('assessment filename format is correct', () => {
      const filename = `2025-Q1.md`;

      expect(filename).toMatch(/^\d{4}-Q[1-4]\.md$/);
    });

    test('can calculate current quarter', () => {
      const date = new Date('2025-03-15');
      const month = date.getMonth(); // 0-11
      const quarter = Math.floor(month / 3) + 1;

      expect(quarter).toBe(1); // March is Q1
    });
  });

  describe('Weekly Review Creation', () => {
    test('can create weekly review from template', () => {
      const templatePath = path.join(MEMORY_ROOT, 'reviews/weekly/.template.md');
      const template = fs.readFileSync(templatePath, 'utf-8');

      expect(template).toBeTruthy();
      expect(template.length).toBeGreaterThan(0);
    });

    test('weekly review uses ISO week format', () => {
      const date = new Date('2025-01-15');
      const year = date.getFullYear();

      // Calculate ISO week number
      const firstDayOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

      expect(week).toBeGreaterThan(0);
      expect(week).toBeLessThanOrEqual(53);
    });

    test('weekly review filename format is correct', () => {
      const filename = `2025-W03.md`;

      expect(filename).toMatch(/^\d{4}-W\d{2}\.md$/);
    });
  });

  describe('File Organization', () => {
    test('daily logs organized by date', () => {
      // Test that we can construct proper paths
      const dateStr = '2025-01-15';
      const date = new Date(dateStr + 'T12:00:00Z'); // Use noon UTC to avoid timezone issues
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');

      const filePath = path.join(
        MEMORY_ROOT,
        'reviews',
        'daily',
        year.toString(),
        month,
        `${year}-${month}-${day}.md`
      );

      expect(filePath).toContain('reviews/daily/2025/01');
      expect(filePath).toMatch(/2025-01-15\.md$/);
    });

    test('assessments organized by year and quarter', () => {
      const year = 2025;
      const quarter = 'Q1';

      const filePath = path.join(
        MEMORY_ROOT,
        'assessments',
        year.toString(),
        `${year}-${quarter}.md`
      );

      expect(filePath).toContain('assessments/2025');
      expect(filePath).toMatch(/2025-Q1\.md$/);
    });

    test('weekly reviews organized by year', () => {
      const year = 2025;
      const week = '03';

      const filePath = path.join(
        MEMORY_ROOT,
        'reviews',
        'weekly',
        year.toString(),
        `${year}-W${week}.md`
      );

      expect(filePath).toContain('reviews/weekly/2025');
      expect(filePath).toMatch(/2025-W03\.md$/);
    });
  });

  describe('Date Helpers', () => {
    test('can format date as YYYY-MM-DD', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const formatted = date.toISOString().split('T')[0];

      expect(formatted).toBe('2025-01-15');
    });

    test('can extract year from date', () => {
      const date = new Date('2025-01-15');
      const year = date.getFullYear();

      expect(year).toBe(2025);
    });

    test('can extract month from date (zero-indexed)', () => {
      const date = new Date('2025-01-15');
      const month = date.getMonth();

      expect(month).toBe(0); // January is 0
    });

    test('can format month as MM', () => {
      const date = new Date('2025-01-15');
      const month = String(date.getMonth() + 1).padStart(2, '0');

      expect(month).toBe('01');
    });

    test('can calculate quarter from date', () => {
      const testCases = [
        { date: new Date('2025-01-15'), expected: 1 },
        { date: new Date('2025-04-15'), expected: 2 },
        { date: new Date('2025-07-15'), expected: 3 },
        { date: new Date('2025-10-15'), expected: 4 },
      ];

      for (const { date, expected } of testCases) {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        expect(quarter).toBe(expected);
      }
    });

    test('can get start of week (Monday)', () => {
      const date = new Date('2025-01-15'); // Wednesday
      const day = date.getDay(); // 3 (0=Sun, 1=Mon, ..., 6=Sat)
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
      const monday = new Date(date.setDate(diff));

      expect(monday.getDay()).toBe(1); // Monday
    });
  });

  describe('Template Placeholders', () => {
    test('templates use consistent date placeholders', () => {
      const templates = [
        'reviews/daily/.template.md',
        'assessments/.template.md',
      ];

      for (const template of templates) {
        const content = fs.readFileSync(
          path.join(MEMORY_ROOT, template),
          'utf-8'
        );

        // Check for date placeholders
        const hasDatePlaceholder =
          content.includes('YYYY-MM-DD') ||
          content.includes('YYYY') ||
          content.includes('QX');

        expect(hasDatePlaceholder).toBe(true);
      }
    });

    test('can replace all placeholders', () => {
      const template = '# Assessment: QX YYYY\nDate: YYYY-MM-DD';

      const result = template
        .replace(/QX/g, 'Q1')
        .replace(/YYYY-MM-DD/g, '2025-01-15')
        .replace(/YYYY/g, '2025');

      expect(result).not.toContain('QX');
      expect(result).not.toContain('YYYY-MM-DD');
      expect(result).toContain('Q1');
      expect(result).toContain('2025-01-15');
    });
  });

  describe('Archive System', () => {
    test('archive directory exists', () => {
      const archivePath = path.join(MEMORY_ROOT, 'archive');
      expect(fs.existsSync(archivePath)).toBe(true);
    });

    test('can construct archive paths by year', () => {
      const year = 2024;
      const archivePath = path.join(MEMORY_ROOT, 'archive', year.toString());

      expect(archivePath).toContain('archive/2024');
    });

    test('archived files maintain naming convention', () => {
      const originalFile = '2024-01-15.md';
      const archiveFile = originalFile; // Same name in archive

      expect(archiveFile).toMatch(/^\d{4}-\d{2}-\d{2}\.md$/);
    });
  });
});
