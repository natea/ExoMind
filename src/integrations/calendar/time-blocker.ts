/**
 * Time Blocker - Intelligent Time Blocking for Calendar
 * Automatically schedules focus time, deep work, and task execution
 */

import {
  CalendarEvent,
  CreateEventRequest,
  EventCategory,
  FreeSlot,
  TimeBlock,
  TimeBlockingPreferences,
} from '../../types/calendar';
import { CalendarClient } from './client';
import { ScheduleAnalyzer } from './analyzer';

/**
 * Task with time estimate
 */
interface TaskToSchedule {
  id: string;
  title: string;
  description?: string;
  estimatedMinutes: number;
  category: EventCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: Date;
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  requiresFocus?: boolean;
  goalId?: string;
}

/**
 * Time blocking result
 */
interface TimeBlockingResult {
  scheduled: TimeBlock[];
  unscheduled: TaskToSchedule[];
  conflicts: string[];
  recommendations: string[];
}

/**
 * Time blocker for intelligent scheduling
 */
export class TimeBlocker {
  constructor(
    private client: CalendarClient,
    private analyzer: ScheduleAnalyzer,
    private preferences: TimeBlockingPreferences
  ) {}

  /**
   * Create recurring focus time blocks
   */
  async createFocusTimeBlocks(startDate: Date, endDate: Date): Promise<TimeBlock[]> {
    const blocks: TimeBlock[] = [];

    for (const focusBlock of this.preferences.focusTimeBlocks) {
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();

        if (focusBlock.days.includes(dayOfWeek)) {
          const [hours, minutes] = focusBlock.startTime.split(':').map(Number);
          const blockStart = new Date(currentDate);
          blockStart.setHours(hours, minutes, 0, 0);

          const blockEnd = new Date(blockStart);
          blockEnd.setMinutes(blockEnd.getMinutes() + focusBlock.duration);

          // Check if slot is available
          const events = await this.client.getEventsForDate(currentDate);
          if (this.isSlotAvailable(blockStart, blockEnd, events)) {
            const block: TimeBlock = {
              id: `focus-${currentDate.toISOString()}-${focusBlock.startTime}`,
              title: 'Focus Time',
              description: 'Protected time for deep work',
              startTime: blockStart,
              endTime: blockEnd,
              duration: focusBlock.duration,
              category: 'deep-work',
              priority: 'high',
              isRecurring: true,
              status: 'proposed',
              tags: ['focus', 'deep-work', 'protected'],
            };

            blocks.push(block);

            // Create calendar event
            await this.createTimeBlockEvent(block);
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return blocks;
  }

  /**
   * Schedule tasks automatically based on available time
   */
  async scheduleTasksAutomatically(
    tasks: TaskToSchedule[],
    startDate: Date,
    endDate: Date
  ): Promise<TimeBlockingResult> {
    const result: TimeBlockingResult = {
      scheduled: [],
      unscheduled: [],
      conflicts: [],
      recommendations: [],
    };

    // Get existing events
    const existingEvents = await this.client.getEventsInRange(startDate, endDate);

    // Get free slots
    const freeSlots = this.analyzer.findFreeSlots(existingEvents, startDate, endDate);

    // Sort tasks by priority and deadline
    const sortedTasks = this.sortTasksByPriority(tasks);

    // Try to schedule each task
    for (const task of sortedTasks) {
      const scheduled = await this.scheduleTask(task, freeSlots, existingEvents);

      if (scheduled) {
        result.scheduled.push(scheduled);
        // Remove used time from free slots
        this.updateFreeSlots(freeSlots, scheduled);
      } else {
        result.unscheduled.push(task);
        result.conflicts.push(`Could not find slot for: ${task.title}`);
      }
    }

    // Generate recommendations
    result.recommendations = this.generateSchedulingRecommendations(
      result.scheduled,
      result.unscheduled
    );

    return result;
  }

  /**
   * Reserve deep work periods
   */
  async reserveDeepWorkPeriods(
    hoursPerWeek: number,
    startDate: Date,
    endDate: Date
  ): Promise<TimeBlock[]> {
    const blocks: TimeBlock[] = [];
    const hoursPerDay = hoursPerWeek / 5; // Distribute across work week

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const events = await this.client.getEventsForDate(currentDate);
      const freeSlots = this.analyzer.findFreeSlots(events, currentDate, currentDate);

      // Find best slot for deep work (prefer morning, larger blocks)
      const deepWorkSlot = this.findBestDeepWorkSlot(freeSlots, hoursPerDay * 60);

      if (deepWorkSlot) {
        const block: TimeBlock = {
          id: `deep-work-${currentDate.toISOString()}`,
          title: 'Deep Work',
          description: 'Reserved time for focused, uninterrupted work',
          startTime: deepWorkSlot.start,
          endTime: new Date(deepWorkSlot.start.getTime() + hoursPerDay * 60 * 60 * 1000),
          duration: hoursPerDay * 60,
          category: 'deep-work',
          priority: 'high',
          isRecurring: false,
          status: 'proposed',
          tags: ['deep-work', 'focus'],
        };

        blocks.push(block);
        await this.createTimeBlockEvent(block);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return blocks;
  }

  /**
   * Schedule weekly review sessions
   */
  async scheduleWeeklyReviews(startDate: Date, endDate: Date): Promise<TimeBlock[]> {
    const blocks: TimeBlock[] = [];
    const reviewDuration = 60; // 1 hour
    const preferredDay = 5; // Friday

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Find next Friday
      while (currentDate.getDay() !== preferredDay) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (currentDate > endDate) break;

      const events = await this.client.getEventsForDate(currentDate);
      const freeSlots = this.analyzer.findFreeSlots(events, currentDate, currentDate);

      // Prefer afternoon for reviews
      const afternoonSlot = freeSlots.find(
        slot => slot.timeOfDay === 'afternoon' && slot.duration >= reviewDuration
      );

      if (afternoonSlot) {
        const block: TimeBlock = {
          id: `weekly-review-${currentDate.toISOString()}`,
          title: 'Weekly Review',
          description: 'Review week accomplishments and plan next week',
          startTime: afternoonSlot.start,
          endTime: new Date(afternoonSlot.start.getTime() + reviewDuration * 60 * 1000),
          duration: reviewDuration,
          category: 'admin',
          priority: 'high',
          isRecurring: true,
          recurrencePattern: 'RRULE:FREQ=WEEKLY;BYDAY=FR',
          status: 'proposed',
          tags: ['review', 'planning', 'weekly'],
        };

        blocks.push(block);
        await this.createTimeBlockEvent(block);
      }

      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return blocks;
  }

  /**
   * Protect personal time
   */
  async protectPersonalTime(
    hoursPerWeek: number,
    startDate: Date,
    endDate: Date
  ): Promise<TimeBlock[]> {
    const blocks: TimeBlock[] = [];
    const hoursPerDay = hoursPerWeek / 7; // Distribute across all days

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Find evening slot for personal time
      const eveningStart = new Date(currentDate);
      eveningStart.setHours(18, 0, 0, 0);

      const eveningEnd = new Date(currentDate);
      eveningEnd.setHours(18 + Math.ceil(hoursPerDay), 0, 0, 0);

      const events = await this.client.getEventsForDate(currentDate);

      if (this.isSlotAvailable(eveningStart, eveningEnd, events)) {
        const block: TimeBlock = {
          id: `personal-${currentDate.toISOString()}`,
          title: 'Personal Time',
          description: 'Protected time for personal activities',
          startTime: eveningStart,
          endTime: eveningEnd,
          duration: hoursPerDay * 60,
          category: 'personal',
          priority: 'medium',
          isRecurring: true,
          status: 'proposed',
          tags: ['personal', 'protected'],
        };

        blocks.push(block);
        await this.createTimeBlockEvent(block);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return blocks;
  }

  /**
   * Auto-schedule a single task
   */
  async autoScheduleTask(task: TaskToSchedule): Promise<TimeBlock | null> {
    const startDate = new Date();
    const endDate = task.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const existingEvents = await this.client.getEventsInRange(startDate, endDate);
    const freeSlots = this.analyzer.findFreeSlots(existingEvents, startDate, endDate);

    return this.scheduleTask(task, freeSlots, existingEvents);
  }

  // Helper methods

  private async scheduleTask(
    task: TaskToSchedule,
    freeSlots: FreeSlot[],
    existingEvents: CalendarEvent[]
  ): Promise<TimeBlock | null> {
    // Find best slot based on preferences
    const candidateSlots = freeSlots.filter(slot => {
      // Must have enough time
      if (slot.duration < task.estimatedMinutes) return false;

      // Check time of day preference
      if (task.preferredTimeOfDay && slot.timeOfDay !== task.preferredTimeOfDay) return false;

      // Check if requires focus (prefer larger blocks)
      if (task.requiresFocus && slot.duration < 120) return false;

      // Check work hours
      if (task.category === 'work' && !slot.isWorkHours) return false;

      return true;
    });

    if (candidateSlots.length === 0) return null;

    // Sort by preference
    const sortedSlots = candidateSlots.sort((a, b) => {
      // Prefer morning for high priority
      if (task.priority === 'high' || task.priority === 'critical') {
        if (a.timeOfDay === 'morning' && b.timeOfDay !== 'morning') return -1;
        if (b.timeOfDay === 'morning' && a.timeOfDay !== 'morning') return 1;
      }

      // Prefer larger blocks for focus work
      if (task.requiresFocus) {
        return b.duration - a.duration;
      }

      // Default to earliest available
      return a.start.getTime() - b.start.getTime();
    });

    const selectedSlot = sortedSlots[0];

    const block: TimeBlock = {
      id: `task-${task.id}`,
      title: task.title,
      description: task.description,
      startTime: selectedSlot.start,
      endTime: new Date(selectedSlot.start.getTime() + task.estimatedMinutes * 60 * 1000),
      duration: task.estimatedMinutes,
      category: task.category,
      priority: task.priority,
      isRecurring: false,
      status: 'scheduled',
      taskIds: [task.id],
      goalId: task.goalId,
    };

    await this.createTimeBlockEvent(block);

    return block;
  }

  private sortTasksByPriority(tasks: TaskToSchedule[]): TaskToSchedule[] {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

    return [...tasks].sort((a, b) => {
      // First by priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by deadline
      if (a.deadline && b.deadline) {
        return a.deadline.getTime() - b.deadline.getTime();
      }

      if (a.deadline) return -1;
      if (b.deadline) return 1;

      return 0;
    });
  }

  private findBestDeepWorkSlot(freeSlots: FreeSlot[], requiredMinutes: number): FreeSlot | null {
    const suitableSlots = freeSlots.filter(
      slot =>
        slot.duration >= requiredMinutes &&
        slot.isWorkHours &&
        slot.timeOfDay === 'morning' // Prefer morning for deep work
    );

    if (suitableSlots.length === 0) {
      // Fallback to any work hours slot
      return freeSlots.find(slot => slot.duration >= requiredMinutes && slot.isWorkHours) || null;
    }

    // Return largest morning slot
    return suitableSlots.reduce((best, slot) => (slot.duration > best.duration ? slot : best));
  }

  private isSlotAvailable(start: Date, end: Date, events: CalendarEvent[]): boolean {
    return !events.some(
      event =>
        (start >= event.start && start < event.end) || (end > event.start && end <= event.end)
    );
  }

  private updateFreeSlots(freeSlots: FreeSlot[], scheduled: TimeBlock): void {
    const index = freeSlots.findIndex(
      slot =>
        scheduled.startTime >= slot.start &&
        scheduled.endTime <= slot.end
    );

    if (index !== -1) {
      const slot = freeSlots[index];

      // Remove or split the slot
      if (scheduled.startTime.getTime() === slot.start.getTime() &&
          scheduled.endTime.getTime() === slot.end.getTime()) {
        // Exact match - remove slot
        freeSlots.splice(index, 1);
      } else if (scheduled.startTime.getTime() === slot.start.getTime()) {
        // Starts at beginning - adjust start
        slot.start = scheduled.endTime;
        slot.duration = (slot.end.getTime() - slot.start.getTime()) / (1000 * 60);
      } else if (scheduled.endTime.getTime() === slot.end.getTime()) {
        // Ends at end - adjust end
        slot.end = scheduled.startTime;
        slot.duration = (slot.end.getTime() - slot.start.getTime()) / (1000 * 60);
      } else {
        // In middle - split into two slots
        const slot2: FreeSlot = {
          ...slot,
          start: scheduled.endTime,
          duration: (slot.end.getTime() - scheduled.endTime.getTime()) / (1000 * 60),
        };

        slot.end = scheduled.startTime;
        slot.duration = (slot.end.getTime() - slot.start.getTime()) / (1000 * 60);

        freeSlots.splice(index + 1, 0, slot2);
      }
    }
  }

  private generateSchedulingRecommendations(
    scheduled: TimeBlock[],
    unscheduled: TaskToSchedule[]
  ): string[] {
    const recommendations: string[] = [];

    if (unscheduled.length > 0) {
      recommendations.push(
        `${unscheduled.length} tasks could not be scheduled. Consider:`
      );
      recommendations.push('- Reducing meeting load to free up time');
      recommendations.push('- Breaking large tasks into smaller chunks');
      recommendations.push('- Extending deadline or adjusting priorities');
    }

    const highPriorityUnscheduled = unscheduled.filter(
      t => t.priority === 'high' || t.priority === 'critical'
    );

    if (highPriorityUnscheduled.length > 0) {
      recommendations.push(
        `⚠️ ${highPriorityUnscheduled.length} high-priority tasks unscheduled`
      );
    }

    const focusBlocks = scheduled.filter(b => b.category === 'deep-work');
    if (focusBlocks.length < 3) {
      recommendations.push('Consider adding more focus time blocks for productivity');
    }

    return recommendations;
  }

  private async createTimeBlockEvent(block: TimeBlock): Promise<void> {
    const request: CreateEventRequest = {
      summary: block.title,
      description: block.description,
      startTime: block.startTime,
      endTime: block.endTime,
      category: block.category,
      tags: block.tags,
      transparency: block.category === 'break' ? 'transparent' : 'opaque',
    };

    if (block.recurrencePattern) {
      request.recurrence = [block.recurrencePattern];
    }

    await this.client.createEvent(request);
  }

  /**
   * Update preferences
   */
  updatePreferences(preferences: Partial<TimeBlockingPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
  }

  /**
   * Get current preferences
   */
  getPreferences(): TimeBlockingPreferences {
    return { ...this.preferences };
  }
}

/**
 * Create a time blocker instance
 */
export function createTimeBlocker(
  client: CalendarClient,
  analyzer: ScheduleAnalyzer,
  preferences: TimeBlockingPreferences
): TimeBlocker {
  return new TimeBlocker(client, analyzer, preferences);
}
