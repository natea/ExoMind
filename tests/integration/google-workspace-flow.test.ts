/**
 * Google Workspace Integration Flow Tests
 * End-to-end tests for Gmail and Calendar integration workflows
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GoogleWorkspaceIntegration } from '../../src/integrations/google-workspace';
import { Task } from '../../src/types/task';

// Mock Google Workspace MCP tools
const mockMCPTools = {
  searchGmailMessages: jest.fn(),
  getGmailMessageContent: jest.fn(),
  getEvents: jest.fn(),
  createEvent: jest.fn(),
  listTaskLists: jest.fn(),
  createTask: jest.fn(),
};

describe('Google Workspace Integration Flow', () => {
  let integration: GoogleWorkspaceIntegration;

  beforeEach(() => {
    integration = new GoogleWorkspaceIntegration(mockMCPTools);
    jest.clearAllMocks();
  });

  describe('Inbox Processing Workflow', () => {
    it('should process inbox and create tasks', async () => {
      // Mock email search results
      mockMCPTools.searchGmailMessages.mockResolvedValue({
        messages: [
          {
            id: 'msg_1',
            threadId: 'thread_1',
            snippet: 'TODO: Review proposal by Friday',
          },
          {
            id: 'msg_2',
            threadId: 'thread_2',
            snippet: 'Please schedule meeting with team',
          },
        ],
      });

      // Mock email content retrieval
      mockMCPTools.getGmailMessageContent
        .mockResolvedValueOnce({
          id: 'msg_1',
          subject: 'Project Proposal',
          from: 'client@example.com',
          body: 'TODO: Review the attached proposal by Friday EOD',
          date: '2024-01-15T10:00:00Z',
        })
        .mockResolvedValueOnce({
          id: 'msg_2',
          subject: 'Team Meeting',
          from: 'manager@example.com',
          body: 'Please schedule a meeting with the team for next week',
          date: '2024-01-15T11:00:00Z',
        });

      // Mock task creation
      mockMCPTools.createTask.mockResolvedValue({
        id: 'task_1',
        title: 'Review proposal',
        status: 'needsAction',
      });

      // Execute workflow
      const result = await integration.processInbox({
        query: 'is:unread category:primary',
        userEmail: 'user@example.com',
      });

      // Verify
      expect(mockMCPTools.searchGmailMessages).toHaveBeenCalledWith({
        query: 'is:unread category:primary',
        user_google_email: 'user@example.com',
      });

      expect(mockMCPTools.getGmailMessageContent).toHaveBeenCalledTimes(2);
      expect(result.tasksCreated).toBeGreaterThan(0);
      expect(result.emailsProcessed).toBe(2);
    });

    it('should filter out automated emails', async () => {
      mockMCPTools.searchGmailMessages.mockResolvedValue({
        messages: [
          {
            id: 'msg_1',
            threadId: 'thread_1',
            snippet: 'Action required',
          },
          {
            id: 'msg_2',
            threadId: 'thread_2',
            snippet: 'Automated notification',
          },
        ],
      });

      mockMCPTools.getGmailMessageContent
        .mockResolvedValueOnce({
          from: 'person@example.com',
          subject: 'Please review',
          body: 'TODO: Review this document',
        })
        .mockResolvedValueOnce({
          from: 'noreply@system.com',
          subject: 'Automated notification',
          body: 'This is an automated message',
        });

      const result = await integration.processInbox({
        userEmail: 'user@example.com',
      });

      expect(result.tasksCreated).toBe(1); // Only from non-automated email
      expect(result.skipped).toBe(1);
    });

    it('should handle errors gracefully', async () => {
      mockMCPTools.searchGmailMessages.mockRejectedValue(
        new Error('Gmail API error')
      );

      const result = await integration.processInbox({
        userEmail: 'user@example.com',
      });

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Gmail API error');
    });

    it('should batch process large inboxes', async () => {
      const manyMessages = Array(50).fill(null).map((_, i) => ({
        id: `msg_${i}`,
        threadId: `thread_${i}`,
        snippet: `TODO: Task ${i}`,
      }));

      mockMCPTools.searchGmailMessages.mockResolvedValue({
        messages: manyMessages,
      });

      mockMCPTools.getGmailMessageContent.mockImplementation(async ({ message_id }) => ({
        id: message_id,
        subject: `Task ${message_id}`,
        body: `TODO: Complete task ${message_id}`,
      }));

      const result = await integration.processInbox({
        userEmail: 'user@example.com',
        batchSize: 10,
      });

      expect(result.emailsProcessed).toBe(50);
      // Should process in batches
      expect(mockMCPTools.getGmailMessageContent).toHaveBeenCalledTimes(50);
    });
  });

  describe('Schedule Analysis Workflow', () => {
    it('should analyze calendar and generate insights', async () => {
      const today = new Date('2024-01-15');
      const weekLater = new Date('2024-01-22');

      mockMCPTools.getEvents.mockResolvedValue({
        events: [
          {
            id: 'event_1',
            summary: 'Team Sync',
            start: { dateTime: '2024-01-15T10:00:00Z' },
            end: { dateTime: '2024-01-15T11:00:00Z' },
          },
          {
            id: 'event_2',
            summary: 'Client Meeting',
            start: { dateTime: '2024-01-15T14:00:00Z' },
            end: { dateTime: '2024-01-15T15:00:00Z' },
          },
          {
            id: 'event_3',
            summary: 'Planning Session',
            start: { dateTime: '2024-01-15T16:00:00Z' },
            end: { dateTime: '2024-01-15T18:00:00Z' },
          },
        ],
      });

      const analysis = await integration.analyzeSchedule({
        userEmail: 'user@example.com',
        startDate: today,
        endDate: weekLater,
      });

      expect(analysis).toMatchObject({
        totalMeetings: 3,
        totalMeetingTime: 240, // 4 hours
        focusTimeAvailable: expect.any(Number),
        insights: expect.any(Array),
      });

      expect(analysis.insights).toContain(
        expect.stringMatching(/meeting load|focus time|schedule/)
      );
    });

    it('should identify scheduling conflicts', async () => {
      mockMCPTools.getEvents.mockResolvedValue({
        events: [
          {
            id: 'event_1',
            summary: 'Meeting A',
            start: { dateTime: '2024-01-15T10:00:00Z' },
            end: { dateTime: '2024-01-15T11:00:00Z' },
          },
          {
            id: 'event_2',
            summary: 'Meeting B (conflict)',
            start: { dateTime: '2024-01-15T10:30:00Z' },
            end: { dateTime: '2024-01-15T11:30:00Z' },
          },
        ],
      });

      const analysis = await integration.analyzeSchedule({
        userEmail: 'user@example.com',
      });

      expect(analysis.conflicts).toHaveLength(1);
      expect(analysis.conflicts[0]).toMatchObject({
        events: ['event_1', 'event_2'],
        overlapMinutes: 30,
      });
    });

    it('should suggest optimal times for focus work', async () => {
      mockMCPTools.getEvents.mockResolvedValue({
        events: [
          {
            id: 'event_1',
            start: { dateTime: '2024-01-15T14:00:00Z' },
            end: { dateTime: '2024-01-15T15:00:00Z' },
          },
        ],
      });

      const analysis = await integration.analyzeSchedule({
        userEmail: 'user@example.com',
        date: new Date('2024-01-15'),
      });

      expect(analysis.focusTimeSlots).toBeInstanceOf(Array);
      expect(analysis.focusTimeSlots.length).toBeGreaterThan(0);
      expect(analysis.focusTimeSlots[0]).toMatchObject({
        start: expect.any(Date),
        end: expect.any(Date),
        duration: expect.any(Number),
      });
    });
  });

  describe('Task Scheduling Workflow', () => {
    it('should schedule tasks in calendar', async () => {
      const tasks: Task[] = [
        {
          id: 'task_1',
          title: 'Write documentation',
          estimatedDuration: 120,
          priority: 'high',
          dueDate: new Date('2024-01-20'),
        },
        {
          id: 'task_2',
          title: 'Code review',
          estimatedDuration: 60,
          priority: 'medium',
        },
      ];

      mockMCPTools.getEvents.mockResolvedValue({
        events: [
          {
            id: 'existing_1',
            start: { dateTime: '2024-01-15T10:00:00Z' },
            end: { dateTime: '2024-01-15T11:00:00Z' },
          },
        ],
      });

      mockMCPTools.createEvent.mockImplementation(async (event) => ({
        id: `event_${Math.random()}`,
        ...event,
      }));

      const result = await integration.scheduleTasks({
        tasks,
        userEmail: 'user@example.com',
        startDate: new Date('2024-01-15'),
      });

      expect(result.scheduled).toHaveLength(2);
      expect(mockMCPTools.createEvent).toHaveBeenCalledTimes(2);

      // Verify high priority task is scheduled first
      const calls = mockMCPTools.createEvent.mock.calls;
      expect(calls[0][0].summary).toContain('Write documentation');
    });

    it('should respect existing calendar events', async () => {
      const task: Task = {
        id: 'task_1',
        title: 'Focus work',
        estimatedDuration: 120,
      };

      mockMCPTools.getEvents.mockResolvedValue({
        events: [
          {
            id: 'meeting_1',
            start: { dateTime: '2024-01-15T10:00:00Z' },
            end: { dateTime: '2024-01-15T11:00:00Z' },
          },
          {
            id: 'meeting_2',
            start: { dateTime: '2024-01-15T14:00:00Z' },
            end: { dateTime: '2024-01-15T15:00:00Z' },
          },
        ],
      });

      mockMCPTools.createEvent.mockResolvedValue({
        id: 'new_event',
        start: { dateTime: '2024-01-15T11:00:00Z' },
        end: { dateTime: '2024-01-15T13:00:00Z' },
      });

      await integration.scheduleTasks({
        tasks: [task],
        userEmail: 'user@example.com',
      });

      const eventCall = mockMCPTools.createEvent.mock.calls[0][0];
      const eventStart = new Date(eventCall.start.dateTime);
      const eventEnd = new Date(eventCall.end.dateTime);

      // Should not overlap with existing meetings
      const meetings = mockMCPTools.getEvents.mock.results[0].value.events;
      meetings.forEach((meeting) => {
        const meetingStart = new Date(meeting.start.dateTime);
        const meetingEnd = new Date(meeting.end.dateTime);

        expect(
          eventEnd <= meetingStart || eventStart >= meetingEnd
        ).toBe(true);
      });
    });

    it('should break large tasks into multiple blocks', async () => {
      const task: Task = {
        id: 'large_task',
        title: 'Large project',
        estimatedDuration: 360, // 6 hours
      };

      mockMCPTools.getEvents.mockResolvedValue({ events: [] });
      mockMCPTools.createEvent.mockImplementation(async (event) => ({
        id: `block_${Math.random()}`,
        ...event,
      }));

      await integration.scheduleTasks({
        tasks: [task],
        userEmail: 'user@example.com',
        maxBlockDuration: 120, // 2 hour blocks
      });

      expect(mockMCPTools.createEvent).toHaveBeenCalledTimes(3);

      // Verify block numbering
      const calls = mockMCPTools.createEvent.mock.calls;
      calls.forEach((call, index) => {
        expect(call[0].summary).toContain(`(${index + 1}/3)`);
      });
    });

    it('should handle scheduling failures', async () => {
      const task: Task = {
        id: 'task_1',
        title: 'Task',
        estimatedDuration: 60,
      };

      mockMCPTools.getEvents.mockResolvedValue({ events: [] });
      mockMCPTools.createEvent.mockRejectedValue(
        new Error('Calendar API error')
      );

      const result = await integration.scheduleTasks({
        tasks: [task],
        userEmail: 'user@example.com',
      });

      expect(result.scheduled).toHaveLength(0);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0].error).toContain('Calendar API error');
    });
  });

  describe('End-to-End Integration', () => {
    it('should complete full workflow: inbox → tasks → calendar', async () => {
      // Step 1: Process inbox
      mockMCPTools.searchGmailMessages.mockResolvedValue({
        messages: [
          { id: 'msg_1', snippet: 'TODO: Complete report by Friday' },
        ],
      });

      mockMCPTools.getGmailMessageContent.mockResolvedValue({
        id: 'msg_1',
        subject: 'Project Report',
        from: 'manager@example.com',
        body: 'TODO: Complete the quarterly report by Friday',
      });

      // Step 2: Create tasks
      mockMCPTools.createTask.mockResolvedValue({
        id: 'task_1',
        title: 'Complete quarterly report',
        dueDate: '2024-01-19',
      });

      // Step 3: Schedule in calendar
      mockMCPTools.getEvents.mockResolvedValue({ events: [] });
      mockMCPTools.createEvent.mockResolvedValue({
        id: 'event_1',
        summary: 'Complete quarterly report',
      });

      // Execute full workflow
      const result = await integration.processInboxToCalendar({
        userEmail: 'user@example.com',
        autoSchedule: true,
      });

      expect(result).toMatchObject({
        emailsProcessed: 1,
        tasksCreated: 1,
        eventsScheduled: 1,
        workflow: 'complete',
      });

      // Verify all steps were called
      expect(mockMCPTools.searchGmailMessages).toHaveBeenCalled();
      expect(mockMCPTools.createTask).toHaveBeenCalled();
      expect(mockMCPTools.createEvent).toHaveBeenCalled();
    });

    it('should handle partial failures in workflow', async () => {
      // Email processing succeeds
      mockMCPTools.searchGmailMessages.mockResolvedValue({
        messages: [{ id: 'msg_1', snippet: 'TODO: Task' }],
      });

      mockMCPTools.getGmailMessageContent.mockResolvedValue({
        id: 'msg_1',
        subject: 'Task',
        body: 'TODO: Do something',
      });

      // Task creation fails
      mockMCPTools.createTask.mockRejectedValue(
        new Error('Tasks API error')
      );

      const result = await integration.processInboxToCalendar({
        userEmail: 'user@example.com',
        autoSchedule: true,
      });

      expect(result.emailsProcessed).toBe(1);
      expect(result.tasksCreated).toBe(0);
      expect(result.errors).toHaveLength(1);
    });

    it('should provide detailed workflow summary', async () => {
      mockMCPTools.searchGmailMessages.mockResolvedValue({
        messages: [
          { id: 'msg_1', snippet: 'TODO: Task 1' },
          { id: 'msg_2', snippet: 'TODO: Task 2' },
        ],
      });

      mockMCPTools.getGmailMessageContent.mockImplementation(
        async ({ message_id }) => ({
          id: message_id,
          subject: `Task ${message_id}`,
          body: `TODO: Complete ${message_id}`,
        })
      );

      mockMCPTools.createTask.mockImplementation(async (task) => ({
        id: `task_${Math.random()}`,
        ...task,
      }));

      mockMCPTools.getEvents.mockResolvedValue({ events: [] });
      mockMCPTools.createEvent.mockImplementation(async (event) => ({
        id: `event_${Math.random()}`,
        ...event,
      }));

      const result = await integration.processInboxToCalendar({
        userEmail: 'user@example.com',
        autoSchedule: true,
      });

      expect(result.summary).toMatchObject({
        duration: expect.any(Number),
        steps: expect.any(Array),
        efficiency: expect.any(Number),
      });
    });
  });

  describe('Error Recovery', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      mockMCPTools.searchGmailMessages.mockImplementation(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary error');
        }
        return { messages: [] };
      });

      const result = await integration.processInbox({
        userEmail: 'user@example.com',
        retryAttempts: 3,
      });

      expect(attempts).toBe(3);
      expect(result.errors).toHaveLength(0);
    });

    it('should rollback on critical failures', async () => {
      mockMCPTools.searchGmailMessages.mockResolvedValue({
        messages: [{ id: 'msg_1' }],
      });

      mockMCPTools.getGmailMessageContent.mockResolvedValue({
        id: 'msg_1',
        subject: 'Task',
        body: 'TODO: Do something',
      });

      mockMCPTools.createTask.mockResolvedValue({
        id: 'task_1',
        title: 'Task',
      });

      mockMCPTools.createEvent.mockRejectedValue(
        new Error('Critical calendar error')
      );

      const result = await integration.processInboxToCalendar({
        userEmail: 'user@example.com',
        autoSchedule: true,
        rollbackOnFailure: true,
      });

      expect(result.rolledBack).toBe(true);
      // Should have attempted to delete created task
    });
  });
});
