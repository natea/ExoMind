/**
 * Email to Task Conversion Tests
 * Tests for converting emails into actionable tasks
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { EmailToTaskConverter } from '../../../src/integrations/gmail/email-to-task';
import { Task } from '../../../src/types/task';

describe('EmailToTaskConverter', () => {
  let converter: EmailToTaskConverter;

  beforeEach(() => {
    converter = new EmailToTaskConverter();
  });

  describe('Email to Task Conversion', () => {
    it('should convert simple email to task', () => {
      const email = {
        id: 'msg_123',
        threadId: 'thread_123',
        subject: 'Review quarterly report',
        from: 'boss@example.com',
        body: 'Please review the Q4 report by Friday',
        receivedAt: new Date('2024-01-15'),
      };

      const task = converter.convertToTask(email);

      expect(task).toMatchObject({
        title: 'Review quarterly report',
        description: expect.stringContaining('Please review'),
        dueDate: expect.any(Date),
        priority: expect.any(String),
        source: 'gmail',
        metadata: {
          emailId: 'msg_123',
          threadId: 'thread_123',
          from: 'boss@example.com',
        },
      });
    });

    it('should extract multiple tasks from single email', () => {
      const email = {
        id: 'msg_456',
        subject: 'Action items from meeting',
        body: `
          TODO: Update the presentation
          TODO: Schedule follow-up meeting
          TODO: Send summary to team
        `,
      };

      const tasks = converter.convertToTasks(email);

      expect(tasks).toHaveLength(3);
      expect(tasks[0].title).toContain('Update the presentation');
      expect(tasks[1].title).toContain('Schedule follow-up meeting');
      expect(tasks[2].title).toContain('Send summary to team');
    });

    it('should preserve email context in task', () => {
      const email = {
        id: 'msg_789',
        threadId: 'thread_789',
        subject: 'Project update needed',
        from: 'manager@example.com',
        to: ['me@example.com'],
        cc: ['team@example.com'],
        body: 'Can you provide a project update?',
        labels: ['Work', 'Important'],
      };

      const task = converter.convertToTask(email);

      expect(task.metadata).toMatchObject({
        emailId: 'msg_789',
        threadId: 'thread_789',
        from: 'manager@example.com',
        labels: ['Work', 'Important'],
      });
      expect(task.context).toContain('Email from manager@example.com');
    });

    it('should handle email attachments', () => {
      const email = {
        id: 'msg_999',
        subject: 'Review documents',
        body: 'Please review the attached files',
        attachments: [
          { filename: 'report.pdf', mimeType: 'application/pdf', size: 1024 },
          { filename: 'data.xlsx', mimeType: 'application/vnd.ms-excel', size: 2048 },
        ],
      };

      const task = converter.convertToTask(email);

      expect(task.attachments).toHaveLength(2);
      expect(task.description).toContain('Attachments: report.pdf, data.xlsx');
    });

    it('should skip automated notifications', () => {
      const email = {
        id: 'msg_auto',
        from: 'noreply@example.com',
        subject: 'Automated notification',
        body: 'This is an automated message',
      };

      const task = converter.convertToTask(email);

      expect(task).toBeNull();
    });
  });

  describe('Priority Detection', () => {
    it('should assign high priority to urgent emails', () => {
      const email = {
        subject: 'URGENT: Production issue',
        body: 'Critical bug needs immediate fix',
        headers: { 'X-Priority': '1' },
      };

      const task = converter.convertToTask(email);

      expect(task.priority).toBe('high');
    });

    it('should assign priority based on sender', () => {
      const converter = new EmailToTaskConverter({
        vipSenders: ['ceo@example.com', 'manager@example.com'],
      });

      const email = {
        from: 'ceo@example.com',
        subject: 'Quick question',
        body: 'Can you help with this?',
      };

      const task = converter.convertToTask(email);

      expect(task.priority).toBe('high');
    });

    it('should assign medium priority by default', () => {
      const email = {
        from: 'colleague@example.com',
        subject: 'Regular request',
        body: 'Please review when you have time',
      };

      const task = converter.convertToTask(email);

      expect(task.priority).toBe('medium');
    });

    it('should assign low priority to FYI emails', () => {
      const email = {
        subject: 'FYI: Meeting notes',
        body: 'Here are the notes from today',
      };

      const task = converter.convertToTask(email);

      expect(task.priority).toBe('low');
    });

    it('should boost priority for deadlines', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const email = {
        subject: 'Task for tomorrow',
        body: `Please complete this by ${tomorrow.toDateString()}`,
      };

      const task = converter.convertToTask(email);

      expect(task.priority).toBe('high');
    });
  });

  describe('Due Date Extraction', () => {
    it('should extract explicit due dates', () => {
      const email = {
        subject: 'Report due March 15',
        body: 'Please submit by 2024-03-15',
      };

      const task = converter.convertToTask(email);

      expect(task.dueDate).toBeInstanceOf(Date);
      expect(task.dueDate?.getDate()).toBe(15);
      expect(task.dueDate?.getMonth()).toBe(2); // March (0-indexed)
    });

    it('should parse relative dates', () => {
      const email = {
        subject: 'Task',
        body: 'Complete this by tomorrow',
      };

      const task = converter.convertToTask(email);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(task.dueDate?.toDateString()).toBe(tomorrow.toDateString());
    });

    it('should handle end-of-day deadlines', () => {
      const email = {
        subject: 'Urgent',
        body: 'Need this by EOD',
      };

      const task = converter.convertToTask(email);
      const today = new Date();

      expect(task.dueDate?.toDateString()).toBe(today.toDateString());
      expect(task.dueDate?.getHours()).toBe(17); // 5 PM
    });

    it('should default to null if no date found', () => {
      const email = {
        subject: 'Whenever you can',
        body: 'No rush on this',
      };

      const task = converter.convertToTask(email);

      expect(task.dueDate).toBeNull();
    });
  });

  describe('Categorization', () => {
    it('should categorize by email labels', () => {
      const email = {
        subject: 'Task',
        body: 'Do something',
        labels: ['Work/Projects', 'Client/Acme'],
      };

      const task = converter.convertToTask(email);

      expect(task.category).toBe('Work');
      expect(task.project).toBe('Acme');
    });

    it('should infer category from content', () => {
      const testCases = [
        { body: 'Deploy to production', expected: 'Engineering' },
        { body: 'Schedule team meeting', expected: 'Meetings' },
        { body: 'Review contract', expected: 'Legal' },
        { body: 'Process invoice', expected: 'Finance' },
      ];

      testCases.forEach(({ body, expected }) => {
        const task = converter.convertToTask({ subject: 'Task', body });
        expect(task.category).toBe(expected);
      });
    });

    it('should handle custom category rules', () => {
      const converter = new EmailToTaskConverter({
        categoryRules: [
          { pattern: /github\.com/, category: 'Code Review' },
          { pattern: /figma\.com/, category: 'Design' },
        ],
      });

      const email = {
        subject: 'Review PR',
        body: 'Please review https://github.com/user/repo/pull/123',
      };

      const task = converter.convertToTask(email);

      expect(task.category).toBe('Code Review');
    });
  });

  describe('Task Metadata', () => {
    it('should include email thread information', () => {
      const email = {
        id: 'msg_1',
        threadId: 'thread_1',
        subject: 'Re: Project discussion',
        from: 'user@example.com',
      };

      const task = converter.convertToTask(email);

      expect(task.metadata).toMatchObject({
        emailId: 'msg_1',
        threadId: 'thread_1',
      });
    });

    it('should track email participants', () => {
      const email = {
        from: 'sender@example.com',
        to: ['me@example.com'],
        cc: ['team@example.com', 'manager@example.com'],
      };

      const task = converter.convertToTask(email);

      expect(task.metadata.participants).toContain('sender@example.com');
      expect(task.metadata.participants).toContain('team@example.com');
    });

    it('should link to original email', () => {
      const email = {
        id: 'msg_123',
        webLink: 'https://mail.google.com/mail/u/0/#inbox/msg_123',
      };

      const task = converter.convertToTask(email);

      expect(task.sourceUrl).toBe(email.webLink);
    });
  });

  describe('Batch Conversion', () => {
    it('should convert multiple emails to tasks', () => {
      const emails = [
        { id: '1', subject: 'Task 1', body: 'Do something' },
        { id: '2', subject: 'Task 2', body: 'Do another thing' },
        { id: '3', subject: 'Task 3', body: 'Do one more thing' },
      ];

      const tasks = converter.convertBatch(emails);

      expect(tasks).toHaveLength(3);
      expect(tasks[0].title).toContain('Task 1');
      expect(tasks[1].title).toContain('Task 2');
      expect(tasks[2].title).toContain('Task 3');
    });

    it('should filter out invalid conversions', () => {
      const emails = [
        { id: '1', subject: 'Valid task', body: 'TODO: Do this' },
        { id: '2', from: 'noreply@example.com', subject: 'Automated' },
        { id: '3', subject: 'Another valid task', body: 'Please review' },
      ];

      const tasks = converter.convertBatch(emails);

      expect(tasks).toHaveLength(2);
    });

    it('should preserve order by priority', () => {
      const emails = [
        { subject: 'Low priority', body: 'FYI' },
        { subject: 'URGENT', body: 'Do now' },
        { subject: 'Medium', body: 'Please review' },
      ];

      const tasks = converter.convertBatch(emails, { sortByPriority: true });

      expect(tasks[0].priority).toBe('high');
      expect(tasks[tasks.length - 1].priority).toBe('low');
    });
  });

  describe('Custom Rules', () => {
    it('should apply custom conversion rules', () => {
      const converter = new EmailToTaskConverter({
        customRules: [
          {
            condition: (email) => email.from === 'bot@example.com',
            transform: (email) => ({
              title: `[BOT] ${email.subject}`,
              automated: true,
            }),
          },
        ],
      });

      const email = {
        from: 'bot@example.com',
        subject: 'Deploy completed',
      };

      const task = converter.convertToTask(email);

      expect(task.title).toContain('[BOT]');
      expect(task.metadata.automated).toBe(true);
    });

    it('should skip emails matching skip rules', () => {
      const converter = new EmailToTaskConverter({
        skipRules: [
          (email) => email.subject.includes('Newsletter'),
          (email) => email.labels?.includes('Social'),
        ],
      });

      const email = {
        subject: 'Monthly Newsletter',
        labels: ['Social'],
      };

      const task = converter.convertToTask(email);

      expect(task).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed emails gracefully', () => {
      const email = {
        // Missing required fields
        body: 'Some content',
      };

      expect(() => converter.convertToTask(email)).not.toThrow();
    });

    it('should handle invalid date formats', () => {
      const email = {
        subject: 'Task',
        body: 'Due on invalid-date',
      };

      const task = converter.convertToTask(email);

      expect(task.dueDate).toBeNull();
    });

    it('should handle empty email bodies', () => {
      const email = {
        subject: 'Empty email',
        body: '',
      };

      const task = converter.convertToTask(email);

      expect(task.description).toBe('');
      expect(task.title).toBe('Empty email');
    });
  });
});
