/**
 * Template Structure Tests
 *
 * Tests for validating Life OS template structure and content
 */

import * as fs from 'fs';
import * as path from 'path';

const MEMORY_ROOT = path.resolve(__dirname, '../../memory');

describe('Template Structure Tests', () => {
  describe('Daily Log Template', () => {
    const templatePath = path.join(MEMORY_ROOT, 'reviews/daily/.template.md');
    let content: string;

    beforeAll(() => {
      content = fs.readFileSync(templatePath, 'utf-8');
    });

    test('template file exists', () => {
      expect(fs.existsSync(templatePath)).toBe(true);
    });

    test('template is not empty', () => {
      expect(content.trim().length).toBeGreaterThan(0);
    });

    test('contains Morning Planning section', () => {
      expect(content).toMatch(/##\s+Morning Planning/i);
    });

    test('contains Evening Review section', () => {
      expect(content).toMatch(/##\s+Evening Review/i);
    });

    test('contains Today\'s Priorities', () => {
      expect(content).toMatch(/###\s+Today'?s Priorities/i);
    });

    test('contains What Got Done section', () => {
      expect(content).toMatch(/###\s+What Got Done/i);
    });

    test('contains Gratitude section', () => {
      expect(content).toMatch(/###\s+Gratitude/i);
    });

    test('has checkbox format for tasks', () => {
      expect(content).toMatch(/- \[ \]/);
    });

    test('has date placeholder', () => {
      expect(content).toMatch(/YYYY-MM-DD/);
    });
  });

  describe('Life Assessment Template', () => {
    const templatePath = path.join(MEMORY_ROOT, 'assessments/.template.md');
    let content: string;

    beforeAll(() => {
      content = fs.readFileSync(templatePath, 'utf-8');
    });

    test('template file exists', () => {
      expect(fs.existsSync(templatePath)).toBe(true);
    });

    test('contains all major life domains', () => {
      const domains = [
        'Career & Work',
        'Financial Health',
        'Health & Fitness',
        'Relationships',
        'Personal Growth',
        'Fun & Recreation',
        'Environment & Space',
        'Contribution & Purpose',
      ];

      for (const domain of domains) {
        expect(content).toMatch(new RegExp(domain, 'i'));
      }
    });

    test('each domain has rating field', () => {
      const ratingPattern = /\*\*Current Rating\*\*:.*?\/10/gi;
      const matches = content.match(ratingPattern);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBeGreaterThanOrEqual(8); // At least 8 domains
    });

    test('each domain has trend indicator', () => {
      const trendPattern = /\*\*Trend\*\*:.*?↑.*?↓/gi;
      const matches = content.match(trendPattern);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBeGreaterThanOrEqual(8);
    });

    test('contains Strategic Insights section', () => {
      expect(content).toMatch(/##\s+.*Strategic Insights/i);
    });

    test('contains Action Planning section', () => {
      expect(content).toMatch(/##\s+.*Action Planning/i);
    });

    test('contains Values Alignment section', () => {
      expect(content).toMatch(/###\s+Values Alignment/i);
    });

    test('has reasonable length (comprehensive)', () => {
      const lines = content.split('\n').length;
      expect(lines).toBeGreaterThan(200);
    });
  });

  describe('Weekly Review Template', () => {
    const templatePath = path.join(MEMORY_ROOT, 'reviews/weekly/.template.md');

    test('template file exists', () => {
      expect(fs.existsSync(templatePath)).toBe(true);
    });

    test('template is not empty', () => {
      const content = fs.readFileSync(templatePath, 'utf-8');
      expect(content.trim().length).toBeGreaterThan(0);
    });
  });

  describe('Monthly Review Template', () => {
    const templatePath = path.join(MEMORY_ROOT, 'reviews/monthly/.template.md');

    test('template file exists', () => {
      expect(fs.existsSync(templatePath)).toBe(true);
    });

    test('template is not empty', () => {
      const content = fs.readFileSync(templatePath, 'utf-8');
      expect(content.trim().length).toBeGreaterThan(0);
    });
  });

  describe('Quarterly Review Template', () => {
    const templatePath = path.join(MEMORY_ROOT, 'reviews/quarterly/.template.md');

    test('template file exists', () => {
      expect(fs.existsSync(templatePath)).toBe(true);
    });

    test('template is not empty', () => {
      const content = fs.readFileSync(templatePath, 'utf-8');
      expect(content.trim().length).toBeGreaterThan(0);
    });
  });

  describe('OKR Template', () => {
    const templatePath = path.join(MEMORY_ROOT, 'objectives/okrs/.template.md');

    test('template file exists', () => {
      expect(fs.existsSync(templatePath)).toBe(true);
    });
  });

  describe('Active Plan Template', () => {
    const templatePath = path.join(MEMORY_ROOT, 'objectives/active-plans/.template.md');

    test('template file exists', () => {
      expect(fs.existsSync(templatePath)).toBe(true);
    });
  });

  describe('Decision Log Template', () => {
    const templatePath = path.join(MEMORY_ROOT, 'reference/decisions/.template.md');

    test('template file exists', () => {
      expect(fs.existsSync(templatePath)).toBe(true);
    });
  });

  describe('Template Consistency', () => {
    const templates = [
      'reviews/daily/.template.md',
      'reviews/weekly/.template.md',
      'reviews/monthly/.template.md',
      'reviews/quarterly/.template.md',
      'assessments/.template.md',
    ];

    test('all templates use consistent markdown header format', () => {
      for (const template of templates) {
        const content = fs.readFileSync(path.join(MEMORY_ROOT, template), 'utf-8');
        // Check for proper markdown headers (# followed by space)
        const headers = content.match(/^#+\s+/gm);
        expect(headers).not.toBeNull();
        expect(headers!.length).toBeGreaterThan(0);
      }
    });

    test('all templates use UTF-8 encoding', () => {
      for (const template of templates) {
        const filePath = path.join(MEMORY_ROOT, template);
        const buffer = fs.readFileSync(filePath);
        const content = buffer.toString('utf-8');

        // Should be able to read without errors
        expect(content).toBeTruthy();

        // Should not contain replacement characters (indicating encoding issues)
        expect(content).not.toContain('�');
      }
    });

    test('all templates end with newline', () => {
      for (const template of templates) {
        const content = fs.readFileSync(path.join(MEMORY_ROOT, template), 'utf-8');
        expect(content.endsWith('\n')).toBe(true);
      }
    });
  });
});
