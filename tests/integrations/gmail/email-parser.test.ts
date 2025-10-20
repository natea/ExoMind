/**
 * Email Parser Tests
 * Tests for extracting action items, dates, and cleaning HTML from emails
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { EmailParser } from '../../../src/integrations/gmail/email-parser';

describe('EmailParser', () => {
  let parser: EmailParser;

  beforeEach(() => {
    parser = new EmailParser();
  });

  describe('Action Item Extraction', () => {
    it('should extract action items from plain text', () => {
      const emailBody = `
        Hi there,

        TODO: Review the proposal by Friday
        Action: Schedule meeting with team
        Please complete the report

        Thanks!
      `;

      const actionItems = parser.extractActionItems(emailBody);

      expect(actionItems).toHaveLength(3);
      expect(actionItems).toContainEqual({
        text: 'Review the proposal by Friday',
        type: 'todo',
        dueDate: expect.any(Date),
      });
      expect(actionItems).toContainEqual({
        text: 'Schedule meeting with team',
        type: 'action',
        dueDate: null,
      });
      expect(actionItems).toContainEqual({
        text: 'Complete the report',
        type: 'request',
        dueDate: null,
      });
    });

    it('should detect action items with various markers', () => {
      const emailBody = `
        [ ] Fix the bug
        [x] Review PR
        - [ ] Write tests
        TODO: Update documentation
        ACTION ITEM: Deploy to staging
      `;

      const actionItems = parser.extractActionItems(emailBody);

      expect(actionItems.length).toBeGreaterThanOrEqual(4);
      expect(actionItems.some(item => item.text.includes('Fix the bug'))).toBe(true);
      expect(actionItems.some(item => item.text.includes('Write tests'))).toBe(true);
    });

    it('should handle emails with no action items', () => {
      const emailBody = `
        This is just an informational email.
        No actions required.
        Have a great day!
      `;

      const actionItems = parser.extractActionItems(emailBody);

      expect(actionItems).toHaveLength(0);
    });

    it('should extract action items from bullet lists', () => {
      const emailBody = `
        Please complete the following:
        • Review the contract
        • Sign the NDA
        • Send feedback by EOD
      `;

      const actionItems = parser.extractActionItems(emailBody);

      expect(actionItems.length).toBeGreaterThanOrEqual(3);
    });

    it('should ignore completed checkboxes', () => {
      const emailBody = `
        [x] Already done
        [ ] Still pending
        ☑ Completed task
        ☐ Open task
      `;

      const actionItems = parser.extractActionItems(emailBody);

      expect(actionItems).toHaveLength(2);
      expect(actionItems.every(item =>
        !item.text.includes('Already done') &&
        !item.text.includes('Completed task')
      )).toBe(true);
    });
  });

  describe('Date Parsing', () => {
    it('should parse absolute dates', () => {
      const testCases = [
        { text: 'by March 15, 2024', expected: new Date('2024-03-15') },
        { text: 'due 03/15/2024', expected: new Date('2024-03-15') },
        { text: 'deadline: 2024-03-15', expected: new Date('2024-03-15') },
      ];

      testCases.forEach(({ text, expected }) => {
        const date = parser.extractDate(text);
        expect(date?.toDateString()).toBe(expected.toDateString());
      });
    });

    it('should parse relative dates', () => {
      const today = new Date();

      const testCases = [
        { text: 'by tomorrow', daysOffset: 1 },
        { text: 'due next week', daysOffset: 7 },
        { text: 'in 3 days', daysOffset: 3 },
      ];

      testCases.forEach(({ text, daysOffset }) => {
        const date = parser.extractDate(text);
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() + daysOffset);

        expect(date?.toDateString()).toBe(expectedDate.toDateString());
      });
    });

    it('should parse day-of-week dates', () => {
      const testCases = [
        'by Friday',
        'due Monday',
        'next Wednesday',
      ];

      testCases.forEach(text => {
        const date = parser.extractDate(text);
        expect(date).toBeInstanceOf(Date);
        expect(date!.getTime()).toBeGreaterThan(Date.now());
      });
    });

    it('should handle end-of-day/week/month', () => {
      const testCases = [
        { text: 'by EOD', type: 'day' },
        { text: 'by end of week', type: 'week' },
        { text: 'by EOM', type: 'month' },
      ];

      testCases.forEach(({ text }) => {
        const date = parser.extractDate(text);
        expect(date).toBeInstanceOf(Date);
      });
    });

    it('should return null for no date found', () => {
      const text = 'Please review this when you can';
      const date = parser.extractDate(text);
      expect(date).toBeNull();
    });

    it('should handle multiple dates and pick earliest', () => {
      const text = 'Review by March 15 or April 1 at the latest';
      const date = parser.extractDate(text);
      expect(date?.getMonth()).toBe(2); // March (0-indexed)
    });
  });

  describe('HTML Cleaning', () => {
    it('should remove HTML tags', () => {
      const html = '<p>Hello <strong>world</strong>!</p>';
      const cleaned = parser.cleanHtml(html);
      expect(cleaned).toBe('Hello world!');
    });

    it('should preserve line breaks', () => {
      const html = '<p>Line 1</p><p>Line 2</p><br/><p>Line 3</p>';
      const cleaned = parser.cleanHtml(html);
      expect(cleaned).toContain('Line 1');
      expect(cleaned).toContain('Line 2');
      expect(cleaned).toContain('Line 3');
    });

    it('should remove inline styles and scripts', () => {
      const html = `
        <div style="color: red;">Text</div>
        <script>alert('xss')</script>
        <style>.class { color: blue; }</style>
      `;
      const cleaned = parser.cleanHtml(html);
      expect(cleaned).toBe('Text');
    });

    it('should handle nested HTML', () => {
      const html = `
        <div>
          <p>Outer <span>inner <em>nested</em></span></p>
        </div>
      `;
      const cleaned = parser.cleanHtml(html);
      expect(cleaned).toBe('Outer inner nested');
    });

    it('should decode HTML entities', () => {
      const html = 'Hello &amp; goodbye &lt;tag&gt; &quot;quoted&quot;';
      const cleaned = parser.cleanHtml(html);
      expect(cleaned).toBe('Hello & goodbye <tag> "quoted"');
    });

    it('should remove email signatures', () => {
      const html = `
        <p>Email content</p>
        <div class="gmail_signature">
          Signature content
        </div>
      `;
      const cleaned = parser.cleanHtml(html);
      expect(cleaned).toBe('Email content');
      expect(cleaned).not.toContain('Signature');
    });

    it('should collapse multiple whitespaces', () => {
      const html = '<p>Too    many     spaces</p>';
      const cleaned = parser.cleanHtml(html);
      expect(cleaned).toBe('Too many spaces');
    });
  });

  describe('Thread Handling', () => {
    it('should extract latest message from thread', () => {
      const thread = {
        messages: [
          { id: '1', snippet: 'Original message', internalDate: '1000' },
          { id: '2', snippet: 'Reply 1', internalDate: '2000' },
          { id: '3', snippet: 'Reply 2', internalDate: '3000' },
        ],
      };

      const latest = parser.extractLatestMessage(thread);

      expect(latest.id).toBe('3');
      expect(latest.snippet).toBe('Reply 2');
    });

    it('should identify thread participants', () => {
      const thread = {
        messages: [
          { from: 'alice@example.com', to: ['bob@example.com'] },
          { from: 'bob@example.com', to: ['alice@example.com', 'charlie@example.com'] },
          { from: 'charlie@example.com', to: ['bob@example.com'] },
        ],
      };

      const participants = parser.extractParticipants(thread);

      expect(participants).toHaveLength(3);
      expect(participants).toContain('alice@example.com');
      expect(participants).toContain('bob@example.com');
      expect(participants).toContain('charlie@example.com');
    });

    it('should detect thread subject changes', () => {
      const thread = {
        messages: [
          { subject: 'Original Subject' },
          { subject: 'Re: Original Subject' },
          { subject: 'Re: Original Subject' },
          { subject: 'New Topic' },
        ],
      };

      const hasSubjectChange = parser.hasSubjectChange(thread);

      expect(hasSubjectChange).toBe(true);
    });

    it('should calculate thread response time', () => {
      const thread = {
        messages: [
          { internalDate: '1000000000000' }, // Base time
          { internalDate: '1000003600000' }, // +1 hour
          { internalDate: '1000007200000' }, // +2 hours
        ],
      };

      const avgResponseTime = parser.calculateAvgResponseTime(thread);

      expect(avgResponseTime).toBe(5400000); // 1.5 hours in ms
    });

    it('should identify automated messages', () => {
      const testCases = [
        { from: 'noreply@example.com', expected: true },
        { from: 'no-reply@example.com', expected: true },
        { from: 'donotreply@example.com', expected: true },
        { from: 'notifications@github.com', expected: true },
        { from: 'user@example.com', expected: false },
      ];

      testCases.forEach(({ from, expected }) => {
        const isAutomated = parser.isAutomatedMessage({ from });
        expect(isAutomated).toBe(expected);
      });
    });

    it('should extract quoted text', () => {
      const emailBody = `
        New message content

        On Mon, Jan 1, 2024 at 10:00 AM, User <user@example.com> wrote:
        > This is the quoted text
        > From the previous message
      `;

      const { newContent, quotedContent } = parser.separateQuotedText(emailBody);

      expect(newContent).toContain('New message content');
      expect(newContent).not.toContain('quoted text');
      expect(quotedContent).toContain('quoted text');
    });
  });

  describe('Priority Detection', () => {
    it('should detect urgent emails', () => {
      const testCases = [
        { subject: 'URGENT: Server down', expected: 'high' },
        { subject: 'Important: Please review', expected: 'high' },
        { body: 'This is urgent and needs immediate attention', expected: 'high' },
        { subject: 'FYI: Meeting notes', expected: 'low' },
      ];

      testCases.forEach(({ subject, body, expected }) => {
        const priority = parser.detectPriority({ subject, body });
        expect(priority).toBe(expected);
      });
    });

    it('should consider importance headers', () => {
      const email = {
        subject: 'Regular email',
        headers: { 'X-Priority': '1', 'Importance': 'high' },
      };

      const priority = parser.detectPriority(email);

      expect(priority).toBe('high');
    });
  });

  describe('Category Detection', () => {
    it('should categorize emails by content', () => {
      const testCases = [
        { subject: 'Meeting tomorrow at 2pm', expected: 'meeting' },
        { body: 'Can you review this PR?', expected: 'review' },
        { subject: 'Invoice #12345', expected: 'finance' },
        { body: 'Deploy to production', expected: 'deployment' },
      ];

      testCases.forEach(({ subject, body, expected }) => {
        const category = parser.detectCategory({ subject, body });
        expect(category).toBe(expected);
      });
    });
  });
});
