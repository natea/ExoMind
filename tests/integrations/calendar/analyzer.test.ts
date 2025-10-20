/**
 * Calendar Analyzer Tests
 * Tests for analyzing calendar data and extracting insights
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { CalendarAnalyzer } from '../../../src/integrations/calendar/analyzer';
import { CalendarEvent } from '../../../src/types/calendar';

describe('CalendarAnalyzer', () => {
  let analyzer: CalendarAnalyzer;

  beforeEach(() => {
    analyzer = new CalendarAnalyzer();
  });

  describe('Time Allocation Calculation', () => {
    it('should calculate total meeting time', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          title: 'Meeting 1',
          start: new Date('2024-01-15T10:00:00'),
          end: new Date('2024-01-15T11:00:00'),
        },
        {
          id: '2',
          title: 'Meeting 2',
          start: new Date('2024-01-15T14:00:00'),
          end: new Date('2024-01-15T15:30:00'),
        },
      ];

      const totalTime = analyzer.calculateTotalMeetingTime(events);

      expect(totalTime).toBe(150); // 60 + 90 minutes
    });

    it('should calculate time by category', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          title: 'Team Sync',
          start: new Date('2024-01-15T10:00:00'),
          end: new Date('2024-01-15T11:00:00'),
          category: 'Internal',
        },
        {
          id: '2',
          title: 'Client Call',
          start: new Date('2024-01-15T14:00:00'),
          end: new Date('2024-01-15T15:00:00'),
          category: 'External',
        },
        {
          id: '3',
          title: 'Team Planning',
          start: new Date('2024-01-15T16:00:00'),
          end: new Date('2024-01-15T17:00:00'),
          category: 'Internal',
        },
      ];

      const timeByCategory = analyzer.calculateTimeByCategory(events);

      expect(timeByCategory).toEqual({
        Internal: 120,
        External: 60,
      });
    });

    it('should calculate daily distribution', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          title: 'Morning Meeting',
          start: new Date('2024-01-15T09:00:00'),
          end: new Date('2024-01-15T10:00:00'),
        },
        {
          id: '2',
          title: 'Afternoon Meeting',
          start: new Date('2024-01-15T14:00:00'),
          end: new Date('2024-01-15T15:00:00'),
        },
        {
          id: '3',
          title: 'Evening Meeting',
          start: new Date('2024-01-15T18:00:00'),
          end: new Date('2024-01-15T19:00:00'),
        },
      ];

      const distribution = analyzer.calculateDailyDistribution(events);

      expect(distribution).toMatchObject({
        morning: 60,
        afternoon: 60,
        evening: 60,
      });
    });

    it('should handle overlapping events', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          title: 'Meeting 1',
          start: new Date('2024-01-15T10:00:00'),
          end: new Date('2024-01-15T11:00:00'),
        },
        {
          id: '2',
          title: 'Meeting 2 (overlap)',
          start: new Date('2024-01-15T10:30:00'),
          end: new Date('2024-01-15T11:30:00'),
        },
      ];

      const totalTime = analyzer.calculateTotalMeetingTime(events, {
        handleOverlaps: true,
      });

      expect(totalTime).toBe(90); // Combined duration, not sum
    });

    it('should calculate focus time available', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          title: 'Meeting',
          start: new Date('2024-01-15T10:00:00'),
          end: new Date('2024-01-15T11:00:00'),
        },
        {
          id: '2',
          title: 'Lunch',
          start: new Date('2024-01-15T12:00:00'),
          end: new Date('2024-01-15T13:00:00'),
        },
      ];

      const workDay = {
        start: new Date('2024-01-15T09:00:00'),
        end: new Date('2024-01-15T17:00:00'),
      };

      const focusTime = analyzer.calculateFocusTime(events, workDay);

      expect(focusTime).toBe(360); // 8 hours - 2 hours meetings = 6 hours
    });
  });

  describe('Meeting Load Metrics', () => {
    it('should calculate meetings per day', () => {
      const events: CalendarEvent[] = [
        { id: '1', start: new Date('2024-01-15T10:00:00'), end: new Date('2024-01-15T11:00:00') },
        { id: '2', start: new Date('2024-01-15T14:00:00'), end: new Date('2024-01-15T15:00:00') },
        { id: '3', start: new Date('2024-01-16T10:00:00'), end: new Date('2024-01-16T11:00:00') },
      ];

      const meetingsPerDay = analyzer.calculateMeetingsPerDay(events);

      expect(meetingsPerDay.get('2024-01-15')).toBe(2);
      expect(meetingsPerDay.get('2024-01-16')).toBe(1);
    });

    it('should calculate average meeting duration', () => {
      const events: CalendarEvent[] = [
        { id: '1', start: new Date('2024-01-15T10:00:00'), end: new Date('2024-01-15T10:30:00') }, // 30 min
        { id: '2', start: new Date('2024-01-15T14:00:00'), end: new Date('2024-01-15T15:00:00') }, // 60 min
        { id: '3', start: new Date('2024-01-15T16:00:00'), end: new Date('2024-01-15T16:15:00') }, // 15 min
      ];

      const avgDuration = analyzer.calculateAverageDuration(events);

      expect(avgDuration).toBe(35); // (30 + 60 + 15) / 3
    });

    it('should identify heavy meeting days', () => {
      const events: CalendarEvent[] = [
        // Day 1: 5 meetings
        ...Array(5).fill(null).map((_, i) => ({
          id: `1-${i}`,
          start: new Date(`2024-01-15T${10 + i}:00:00`),
          end: new Date(`2024-01-15T${11 + i}:00:00`),
        })),
        // Day 2: 2 meetings
        ...Array(2).fill(null).map((_, i) => ({
          id: `2-${i}`,
          start: new Date(`2024-01-16T${10 + i}:00:00`),
          end: new Date(`2024-01-16T${11 + i}:00:00`),
        })),
      ];

      const heavyDays = analyzer.identifyHeavyDays(events, { threshold: 4 });

      expect(heavyDays).toContain('2024-01-15');
      expect(heavyDays).not.toContain('2024-01-16');
    });

    it('should calculate meeting fragmentation', () => {
      const events: CalendarEvent[] = [
        { id: '1', start: new Date('2024-01-15T09:00:00'), end: new Date('2024-01-15T10:00:00') },
        { id: '2', start: new Date('2024-01-15T10:30:00'), end: new Date('2024-01-15T11:00:00') },
        { id: '3', start: new Date('2024-01-15T11:15:00'), end: new Date('2024-01-15T12:00:00') },
        { id: '4', start: new Date('2024-01-15T14:00:00'), end: new Date('2024-01-15T16:00:00') },
      ];

      const fragmentation = analyzer.calculateFragmentation(events);

      expect(fragmentation.gaps).toHaveLength(3);
      expect(fragmentation.score).toBeGreaterThan(0);
    });
  });

  describe('Conflict Detection', () => {
    it('should detect overlapping events', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          title: 'Meeting A',
          start: new Date('2024-01-15T10:00:00'),
          end: new Date('2024-01-15T11:00:00'),
        },
        {
          id: '2',
          title: 'Meeting B',
          start: new Date('2024-01-15T10:30:00'),
          end: new Date('2024-01-15T11:30:00'),
        },
      ];

      const conflicts = analyzer.detectConflicts(events);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0]).toMatchObject({
        event1: expect.objectContaining({ id: '1' }),
        event2: expect.objectContaining({ id: '2' }),
        overlapMinutes: 30,
      });
    });

    it('should detect back-to-back meetings without buffer', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          start: new Date('2024-01-15T10:00:00'),
          end: new Date('2024-01-15T11:00:00'),
        },
        {
          id: '2',
          start: new Date('2024-01-15T11:00:00'),
          end: new Date('2024-01-15T12:00:00'),
        },
      ];

      const issues = analyzer.detectBackToBack(events, { bufferMinutes: 5 });

      expect(issues).toHaveLength(1);
      expect(issues[0].reason).toContain('No buffer time');
    });

    it('should handle events across different time zones', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          start: new Date('2024-01-15T10:00:00-08:00'), // PST
          end: new Date('2024-01-15T11:00:00-08:00'),
          timezone: 'America/Los_Angeles',
        },
        {
          id: '2',
          start: new Date('2024-01-15T13:00:00-05:00'), // EST (same time as above)
          end: new Date('2024-01-15T14:00:00-05:00'),
          timezone: 'America/New_York',
        },
      ];

      const conflicts = analyzer.detectConflicts(events);

      expect(conflicts).toHaveLength(1);
    });
  });

  describe('Free Slot Finding', () => {
    it('should find available time slots', () => {
      const events: CalendarEvent[] = [
        { id: '1', start: new Date('2024-01-15T09:00:00'), end: new Date('2024-01-15T10:00:00') },
        { id: '2', start: new Date('2024-01-15T14:00:00'), end: new Date('2024-01-15T15:00:00') },
      ];

      const workDay = {
        start: new Date('2024-01-15T08:00:00'),
        end: new Date('2024-01-15T17:00:00'),
      };

      const freeSlots = analyzer.findFreeSlots(events, workDay, {
        minDuration: 60,
      });

      expect(freeSlots.length).toBeGreaterThanOrEqual(2);
      expect(freeSlots.some(slot =>
        slot.start.getHours() === 10 && slot.end.getHours() === 14
      )).toBe(true);
    });

    it('should respect minimum duration requirement', () => {
      const events: CalendarEvent[] = [
        { id: '1', start: new Date('2024-01-15T10:00:00'), end: new Date('2024-01-15T10:45:00') },
        { id: '2', start: new Date('2024-01-15T11:00:00'), end: new Date('2024-01-15T12:00:00') },
      ];

      const workDay = {
        start: new Date('2024-01-15T09:00:00'),
        end: new Date('2024-01-15T17:00:00'),
      };

      const freeSlots = analyzer.findFreeSlots(events, workDay, {
        minDuration: 30,
      });

      const shortSlots = freeSlots.filter(slot => {
        const duration = (slot.end.getTime() - slot.start.getTime()) / (1000 * 60);
        return duration >= 30;
      });

      expect(shortSlots.length).toBeGreaterThan(0);
    });

    it('should find optimal meeting time for multiple calendars', () => {
      const calendars = [
        {
          id: 'person1',
          events: [
            { start: new Date('2024-01-15T09:00:00'), end: new Date('2024-01-15T10:00:00') },
          ],
        },
        {
          id: 'person2',
          events: [
            { start: new Date('2024-01-15T10:00:00'), end: new Date('2024-01-15T11:00:00') },
          ],
        },
      ];

      const optimalSlots = analyzer.findMutualFreeSlots(calendars, {
        minDuration: 60,
        workHours: { start: 9, end: 17 },
      });

      expect(optimalSlots.length).toBeGreaterThan(0);
      expect(optimalSlots[0].start.getHours()).toBeGreaterThanOrEqual(11);
    });
  });

  describe('Pattern Analysis', () => {
    it('should identify recurring meeting patterns', () => {
      const events: CalendarEvent[] = [
        // Weekly team sync
        { id: '1', title: 'Team Sync', start: new Date('2024-01-08T10:00:00') },
        { id: '2', title: 'Team Sync', start: new Date('2024-01-15T10:00:00') },
        { id: '3', title: 'Team Sync', start: new Date('2024-01-22T10:00:00') },
      ];

      const patterns = analyzer.identifyPatterns(events);

      expect(patterns).toContainEqual(
        expect.objectContaining({
          title: 'Team Sync',
          frequency: 'weekly',
          count: 3,
        })
      );
    });

    it('should identify meeting-heavy time blocks', () => {
      const events: CalendarEvent[] = [
        // Many meetings on Monday mornings
        ...Array(12).fill(null).map((_, i) => ({
          id: `${i}`,
          start: new Date(`2024-01-${8 + Math.floor(i / 4)}T10:00:00`),
          end: new Date(`2024-01-${8 + Math.floor(i / 4)}T11:00:00`),
        })),
      ];

      const heavyBlocks = analyzer.identifyHeavyTimeBlocks(events);

      expect(heavyBlocks).toContainEqual(
        expect.objectContaining({
          dayOfWeek: 'Monday',
          timeBlock: 'morning',
        })
      );
    });

    it('should calculate meeting attendee patterns', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          attendees: ['alice@example.com', 'bob@example.com'],
        },
        {
          id: '2',
          attendees: ['alice@example.com', 'charlie@example.com'],
        },
        {
          id: '3',
          attendees: ['alice@example.com', 'bob@example.com'],
        },
      ];

      const attendeeStats = analyzer.calculateAttendeeStats(events);

      expect(attendeeStats.get('alice@example.com')).toBe(3);
      expect(attendeeStats.get('bob@example.com')).toBe(2);
    });
  });

  describe('Performance Insights', () => {
    it('should calculate meeting efficiency score', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          duration: 30,
          attendees: ['a@example.com', 'b@example.com'],
          hasAgenda: true,
          endedOnTime: true,
        },
        {
          id: '2',
          duration: 120,
          attendees: Array(15).fill(null).map((_, i) => `${i}@example.com`),
          hasAgenda: false,
          endedOnTime: false,
        },
      ];

      const efficiency = analyzer.calculateEfficiencyScore(events);

      expect(efficiency).toBeGreaterThan(0);
      expect(efficiency).toBeLessThanOrEqual(100);
    });

    it('should provide optimization suggestions', () => {
      const events: CalendarEvent[] = [
        { id: '1', duration: 60, attendees: Array(20).fill('x') },
        { id: '2', duration: 30, start: new Date('2024-01-15T11:00:00') },
        { id: '3', duration: 30, start: new Date('2024-01-15T11:30:00') },
      ];

      const suggestions = analyzer.generateOptimizationSuggestions(events);

      expect(suggestions).toContain(expect.stringContaining('large meeting'));
      expect(suggestions).toContain(expect.stringContaining('combine'));
    });
  });
});
