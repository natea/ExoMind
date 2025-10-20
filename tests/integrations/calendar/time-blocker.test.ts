/**
 * Time Blocker Tests
 * Tests for creating and managing time blocks in calendar
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { TimeBlocker } from '../../../src/integrations/calendar/time-blocker';
import { Task } from '../../../src/types/task';
import { CalendarEvent } from '../../../src/types/calendar';

describe('TimeBlocker', () => {
  let blocker: TimeBlocker;

  beforeEach(() => {
    blocker = new TimeBlocker();
  });

  describe('Focus Time Creation', () => {
    it('should create focus time block', () => {
      const request = {
        title: 'Deep Work',
        duration: 120,
        date: new Date('2024-01-15'),
        preferredTime: 'morning',
      };

      const block = blocker.createFocusBlock(request);

      expect(block).toMatchObject({
        title: 'Deep Work',
        start: expect.any(Date),
        end: expect.any(Date),
        type: 'focus',
      });

      const duration = (block.end.getTime() - block.start.getTime()) / (1000 * 60);
      expect(duration).toBe(120);
    });

    it('should find best time slot for focus block', () => {
      const existingEvents: CalendarEvent[] = [
        {
          id: '1',
          start: new Date('2024-01-15T10:00:00'),
          end: new Date('2024-01-15T11:00:00'),
        },
        {
          id: '2',
          start: new Date('2024-01-15T14:00:00'),
          end: new Date('2024-01-15T15:00:00'),
        },
      ];

      const block = blocker.findBestSlot(existingEvents, {
        duration: 120,
        date: new Date('2024-01-15'),
        workHours: { start: 9, end: 17 },
      });

      expect(block.start.getHours()).toBeGreaterThanOrEqual(9);
      expect(block.end.getHours()).toBeLessThanOrEqual(17);

      // Should not overlap with existing events
      existingEvents.forEach(event => {
        expect(
          block.end <= event.start || block.start >= event.end
        ).toBe(true);
      });
    });

    it('should respect user preferences for focus time', () => {
      const preferences = {
        morningFocus: true,
        avoidAfternoons: true,
        minimumDuration: 90,
      };

      const blocker = new TimeBlocker(preferences);
      const block = blocker.createFocusBlock({
        duration: 120,
        date: new Date('2024-01-15'),
      });

      expect(block.start.getHours()).toBeLessThan(12);
    });

    it('should add buffer time around focus blocks', () => {
      const block = blocker.createFocusBlock({
        duration: 60,
        date: new Date('2024-01-15'),
        bufferBefore: 15,
        bufferAfter: 15,
      });

      expect(block.metadata.bufferBefore).toBe(15);
      expect(block.metadata.bufferAfter).toBe(15);
    });
  });

  describe('Task Scheduling', () => {
    it('should schedule task in calendar', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Complete report',
        estimatedDuration: 90,
        priority: 'high',
        dueDate: new Date('2024-01-20'),
      };

      const existingEvents: CalendarEvent[] = [];

      const block = blocker.scheduleTask(task, existingEvents);

      expect(block).toMatchObject({
        title: expect.stringContaining('Complete report'),
        duration: 90,
        metadata: {
          taskId: 'task-1',
        },
      });
    });

    it('should break large tasks into multiple blocks', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Large project',
        estimatedDuration: 360, // 6 hours
        priority: 'high',
      };

      const blocks = blocker.scheduleTask(task, [], {
        maxBlockDuration: 120,
        breakBetweenBlocks: 15,
      });

      expect(blocks).toHaveLength(3); // 3 x 2-hour blocks
      expect(blocks[0].metadata.blockNumber).toBe(1);
      expect(blocks[1].metadata.blockNumber).toBe(2);
    });

    it('should schedule tasks based on priority', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Low priority',
          priority: 'low',
          estimatedDuration: 60,
        },
        {
          id: '2',
          title: 'High priority',
          priority: 'high',
          estimatedDuration: 60,
        },
        {
          id: '3',
          title: 'Medium priority',
          priority: 'medium',
          estimatedDuration: 60,
        },
      ];

      const blocks = blocker.scheduleBatch(tasks);

      expect(blocks[0].metadata.taskId).toBe('2'); // High priority first
      expect(blocks[blocks.length - 1].metadata.taskId).toBe('1'); // Low priority last
    });

    it('should respect task dependencies', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          title: 'Setup',
          estimatedDuration: 30,
        },
        {
          id: 'task-2',
          title: 'Implementation',
          estimatedDuration: 120,
          dependencies: ['task-1'],
        },
        {
          id: 'task-3',
          title: 'Testing',
          estimatedDuration: 60,
          dependencies: ['task-2'],
        },
      ];

      const blocks = blocker.scheduleBatch(tasks);

      const task1End = blocks.find(b => b.metadata.taskId === 'task-1')!.end;
      const task2Start = blocks.find(b => b.metadata.taskId === 'task-2')!.start;
      const task2End = blocks.find(b => b.metadata.taskId === 'task-2')!.end;
      const task3Start = blocks.find(b => b.metadata.taskId === 'task-3')!.start;

      expect(task2Start.getTime()).toBeGreaterThanOrEqual(task1End.getTime());
      expect(task3Start.getTime()).toBeGreaterThanOrEqual(task2End.getTime());
    });

    it('should consider task due dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const task: Task = {
        id: 'urgent-task',
        title: 'Urgent task',
        estimatedDuration: 60,
        dueDate: tomorrow,
        priority: 'high',
      };

      const block = blocker.scheduleTask(task, []);

      expect(block.start.toDateString()).toBe(new Date().toDateString());
    });
  });

  describe('Conflict Avoidance', () => {
    it('should avoid overlapping with existing events', () => {
      const existingEvents: CalendarEvent[] = [
        {
          id: '1',
          start: new Date('2024-01-15T10:00:00'),
          end: new Date('2024-01-15T11:00:00'),
        },
        {
          id: '2',
          start: new Date('2024-01-15T14:00:00'),
          end: new Date('2024-01-15T16:00:00'),
        },
      ];

      const block = blocker.findAvailableSlot(existingEvents, {
        duration: 60,
        date: new Date('2024-01-15'),
      });

      existingEvents.forEach(event => {
        expect(
          block.end <= event.start || block.start >= event.end
        ).toBe(true);
      });
    });

    it('should respect buffer time between events', () => {
      const existingEvents: CalendarEvent[] = [
        {
          id: '1',
          start: new Date('2024-01-15T10:00:00'),
          end: new Date('2024-01-15T11:00:00'),
        },
      ];

      const block = blocker.findAvailableSlot(existingEvents, {
        duration: 60,
        bufferMinutes: 15,
      });

      const timeDiff = Math.abs(
        (block.start.getTime() - existingEvents[0].end.getTime()) / (1000 * 60)
      );

      if (block.start > existingEvents[0].end) {
        expect(timeDiff).toBeGreaterThanOrEqual(15);
      }
    });

    it('should handle no available slots', () => {
      const existingEvents: CalendarEvent[] = [
        {
          id: '1',
          start: new Date('2024-01-15T09:00:00'),
          end: new Date('2024-01-15T17:00:00'),
        },
      ];

      const result = blocker.findAvailableSlot(existingEvents, {
        duration: 60,
        date: new Date('2024-01-15'),
        workHours: { start: 9, end: 17 },
      });

      expect(result).toBeNull();
    });

    it('should suggest alternative times when blocked', () => {
      const existingEvents: CalendarEvent[] = [
        {
          id: '1',
          start: new Date('2024-01-15T09:00:00'),
          end: new Date('2024-01-15T17:00:00'),
        },
      ];

      const alternatives = blocker.findAlternativeSlots(existingEvents, {
        duration: 60,
        requestedDate: new Date('2024-01-15'),
        numberOfAlternatives: 3,
      });

      expect(alternatives.length).toBeGreaterThan(0);
      expect(alternatives[0].date.toDateString()).not.toBe(
        new Date('2024-01-15').toDateString()
      );
    });
  });

  describe('Recurring Blocks', () => {
    it('should create daily recurring block', () => {
      const request = {
        title: 'Morning review',
        duration: 30,
        recurrence: {
          frequency: 'daily',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-01-19'),
        },
      };

      const blocks = blocker.createRecurringBlock(request);

      expect(blocks).toHaveLength(5); // 5 weekdays
      expect(blocks[0].start.toDateString()).toBe('Mon Jan 15 2024');
    });

    it('should create weekly recurring block', () => {
      const request = {
        title: 'Weekly planning',
        duration: 60,
        recurrence: {
          frequency: 'weekly',
          daysOfWeek: ['Monday'],
          startDate: new Date('2024-01-15'),
          occurrences: 4,
        },
      };

      const blocks = blocker.createRecurringBlock(request);

      expect(blocks).toHaveLength(4);
      blocks.forEach(block => {
        expect(block.start.getDay()).toBe(1); // Monday
      });
    });

    it('should handle exceptions in recurring blocks', () => {
      const request = {
        title: 'Daily standup',
        duration: 15,
        recurrence: {
          frequency: 'daily',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-01-19'),
          exceptions: [new Date('2024-01-17')], // Skip Wednesday
        },
      };

      const blocks = blocker.createRecurringBlock(request);

      expect(blocks).toHaveLength(4);
      expect(
        blocks.some(b => b.start.toDateString() === 'Wed Jan 17 2024')
      ).toBe(false);
    });

    it('should respect working hours for recurring blocks', () => {
      const request = {
        title: 'Recurring task',
        duration: 60,
        preferredTime: { hour: 9, minute: 0 },
        recurrence: {
          frequency: 'daily',
          startDate: new Date('2024-01-15'),
          occurrences: 5,
        },
      };

      const blocks = blocker.createRecurringBlock(request);

      blocks.forEach(block => {
        expect(block.start.getHours()).toBe(9);
        expect(block.start.getMinutes()).toBe(0);
      });
    });
  });

  describe('Smart Scheduling', () => {
    it('should optimize for energy levels', () => {
      const blocker = new TimeBlocker({
        energyProfile: {
          morning: 'high',
          afternoon: 'medium',
          evening: 'low',
        },
      });

      const task: Task = {
        id: '1',
        title: 'Complex problem',
        estimatedDuration: 120,
        complexity: 'high',
      };

      const block = blocker.scheduleTask(task, []);

      expect(block.start.getHours()).toBeLessThan(12); // Morning for high energy
    });

    it('should batch similar tasks', () => {
      const tasks: Task[] = [
        { id: '1', title: 'Email 1', category: 'email', estimatedDuration: 15 },
        { id: '2', title: 'Email 2', category: 'email', estimatedDuration: 15 },
        { id: '3', title: 'Code review', category: 'review', estimatedDuration: 30 },
        { id: '4', title: 'Email 3', category: 'email', estimatedDuration: 15 },
      ];

      const blocks = blocker.scheduleBatch(tasks, { batchSimilar: true });

      // Email tasks should be consecutive
      const emailBlocks = blocks.filter(b =>
        tasks.find(t => t.id === b.metadata.taskId)?.category === 'email'
      );

      for (let i = 1; i < emailBlocks.length; i++) {
        const timeDiff = emailBlocks[i].start.getTime() - emailBlocks[i - 1].end.getTime();
        expect(timeDiff).toBeLessThan(1000 * 60 * 30); // Within 30 minutes
      }
    });

    it('should consider meeting patterns', () => {
      const existingEvents: CalendarEvent[] = [
        // Lots of meetings on Tuesday
        ...Array(5).fill(null).map((_, i) => ({
          id: `${i}`,
          start: new Date(`2024-01-16T${10 + i}:00:00`),
          end: new Date(`2024-01-16T${11 + i}:00:00`),
        })),
      ];

      const task: Task = {
        id: '1',
        title: 'Focus work',
        estimatedDuration: 180,
        requiresFocus: true,
      };

      const block = blocker.scheduleTask(task, existingEvents);

      // Should avoid Tuesday
      expect(block.start.getDay()).not.toBe(2);
    });
  });

  describe('Calendar Integration', () => {
    it('should format block for Google Calendar API', () => {
      const block = blocker.createFocusBlock({
        title: 'Deep Work',
        duration: 120,
        date: new Date('2024-01-15T10:00:00'),
      });

      const calendarEvent = blocker.formatForGoogleCalendar(block);

      expect(calendarEvent).toMatchObject({
        summary: 'Deep Work',
        start: {
          dateTime: expect.any(String),
          timeZone: expect.any(String),
        },
        end: {
          dateTime: expect.any(String),
          timeZone: expect.any(String),
        },
        colorId: expect.any(String),
      });
    });

    it('should include task metadata in calendar event', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Important task',
        description: 'Task details',
        project: 'Project X',
      };

      const block = blocker.scheduleTask(task, []);
      const calendarEvent = blocker.formatForGoogleCalendar(block);

      expect(calendarEvent.description).toContain('Task details');
      expect(calendarEvent.extendedProperties).toMatchObject({
        private: {
          taskId: 'task-1',
          project: 'Project X',
        },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid duration', () => {
      expect(() => {
        blocker.createFocusBlock({
          duration: -30,
          date: new Date(),
        });
      }).toThrow('Invalid duration');
    });

    it('should handle past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const result = blocker.findAvailableSlot([], {
        duration: 60,
        date: yesterday,
      });

      expect(result).toBeNull();
    });

    it('should handle conflicting preferences', () => {
      const task: Task = {
        id: '1',
        title: 'Task',
        estimatedDuration: 300, // 5 hours
        dueDate: new Date(), // Due today
      };

      const existingEvents: CalendarEvent[] = [
        {
          id: '1',
          start: new Date('2024-01-15T09:00:00'),
          end: new Date('2024-01-15T16:00:00'),
        },
      ];

      const result = blocker.scheduleTask(task, existingEvents);

      expect(result).not.toBeNull();
      // Should break into multiple days or suggest alternatives
    });
  });
});
