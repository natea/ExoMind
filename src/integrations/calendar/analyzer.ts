/**
 * Calendar Schedule Analyzer
 * Analyzes calendar events to provide insights and recommendations
 */

import {
  CalendarEvent,
  EventCategory,
  FreeSlot,
  MeetingLoad,
  ProductivityMetrics,
  ScheduleAnalysis,
  ScheduleConflict,
  ScheduleRecommendation,
  TimeAllocation,
  WorkLifeBalance,
} from '../../types/calendar';

/**
 * Schedule analyzer for calendar events
 */
export class ScheduleAnalyzer {
  /**
   * Analyze schedule for a given period
   */
  analyzeSchedule(events: CalendarEvent[], startDate: Date, endDate: Date): ScheduleAnalysis {
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      period: {
        start: startDate,
        end: endDate,
        totalDays,
      },
      timeAllocation: this.calculateTimeAllocation(events, startDate, endDate),
      meetingLoad: this.analyzeMeetingLoad(events, startDate, endDate),
      freeSlots: this.findFreeSlots(events, startDate, endDate),
      conflicts: this.detectConflicts(events),
      recommendations: this.generateRecommendations(events, startDate, endDate),
      productivity: this.analyzeProductivity(events),
      workLifeBalance: this.analyzeWorkLifeBalance(events, startDate, endDate),
    };
  }

  /**
   * Calculate time allocation by category
   */
  calculateTimeAllocation(
    events: CalendarEvent[],
    startDate: Date,
    endDate: Date
  ): TimeAllocation[] {
    const categoryMap = new Map<EventCategory, TimeAllocation>();

    // Initialize categories
    const categories: EventCategory[] = [
      'work',
      'meeting',
      'personal',
      'learning',
      'health',
      'social',
      'travel',
      'break',
      'deep-work',
      'admin',
      'other',
    ];

    categories.forEach(category => {
      categoryMap.set(category, {
        category,
        totalHours: 0,
        percentage: 0,
        eventCount: 0,
        averageDuration: 0,
        breakdown: {
          weekdays: 0,
          weekends: 0,
          mornings: 0,
          afternoons: 0,
          evenings: 0,
        },
      });
    });

    // Process events
    events.forEach(event => {
      const category = event.metadata?.category || 'other';
      const allocation = categoryMap.get(category)!;

      const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60); // hours
      allocation.totalHours += duration;
      allocation.eventCount += 1;

      // Weekend vs weekday
      const dayOfWeek = event.start.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        allocation.breakdown.weekends += duration;
      } else {
        allocation.breakdown.weekdays += duration;
      }

      // Time of day
      const hour = event.start.getHours();
      if (hour >= 6 && hour < 12) {
        allocation.breakdown.mornings += duration;
      } else if (hour >= 12 && hour < 18) {
        allocation.breakdown.afternoons += duration;
      } else if (hour >= 18 && hour < 24) {
        allocation.breakdown.evenings += duration;
      }
    });

    // Calculate totals and percentages
    const totalHours = Array.from(categoryMap.values()).reduce(
      (sum, alloc) => sum + alloc.totalHours,
      0
    );

    categoryMap.forEach(allocation => {
      allocation.percentage = totalHours > 0 ? (allocation.totalHours / totalHours) * 100 : 0;
      allocation.averageDuration =
        allocation.eventCount > 0 ? (allocation.totalHours * 60) / allocation.eventCount : 0;
    });

    return Array.from(categoryMap.values())
      .filter(alloc => alloc.totalHours > 0)
      .sort((a, b) => b.totalHours - a.totalHours);
  }

  /**
   * Analyze meeting load
   */
  analyzeMeetingLoad(events: CalendarEvent[], startDate: Date, endDate: Date): MeetingLoad {
    const meetings = events.filter(
      event => event.metadata?.category === 'meeting' || (event.attendees && event.attendees.length > 1)
    );

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalHours = meetings.reduce((sum, event) => {
      return sum + (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
    }, 0);

    // Find largest meeting block
    let largestBlock = { duration: 0, date: new Date() };
    meetings.forEach(event => {
      const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
      if (duration > largestBlock.duration) {
        largestBlock = { duration, date: event.start };
      }
    });

    // Find meeting-free blocks
    const meetingFreeBlocks = this.findMeetingFreeBlocks(meetings, startDate, endDate);

    // Count back-to-back meetings (less than 15 minutes between)
    let backToBackCount = 0;
    const sortedMeetings = [...meetings].sort((a, b) => a.start.getTime() - b.start.getTime());
    for (let i = 0; i < sortedMeetings.length - 1; i++) {
      const gap =
        (sortedMeetings[i + 1].start.getTime() - sortedMeetings[i].end.getTime()) / (1000 * 60);
      if (gap < 15) {
        backToBackCount++;
      }
    }

    // Group by day
    const meetingsByDay = this.groupMeetingsByDay(meetings);

    // Calculate work time (assuming 8 hours per work day)
    const workDays = Math.ceil(totalDays * (5 / 7)); // Approximate work days
    const totalWorkHours = workDays * 8;
    const percentageOfWorkTime = totalWorkHours > 0 ? (totalHours / totalWorkHours) * 100 : 0;

    return {
      totalMeetings: meetings.length,
      totalHours,
      averagePerDay: totalDays > 0 ? meetings.length / totalDays : 0,
      percentageOfWorkTime,
      largestMeetingBlock: largestBlock,
      meetingFreeBlocks,
      backToBackMeetings: backToBackCount,
      meetingsByDay,
    };
  }

  /**
   * Find free time slots
   */
  findFreeSlots(events: CalendarEvent[], startDate: Date, endDate: Date): FreeSlot[] {
    const freeSlots: FreeSlot[] = [];
    const workHours = { start: 9, end: 17 }; // 9 AM to 5 PM

    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

    // Scan each day
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Skip weekends
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Get events for this day
      const dayStart = new Date(currentDate);
      dayStart.setHours(workHours.start, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(workHours.end, 0, 0, 0);

      const dayEvents = sortedEvents.filter(
        event => event.start >= dayStart && event.start < dayEnd
      );

      // Find gaps between events
      let currentTime = dayStart;

      dayEvents.forEach(event => {
        if (currentTime < event.start) {
          const duration = (event.start.getTime() - currentTime.getTime()) / (1000 * 60);
          if (duration >= 30) {
            // At least 30 minutes
            freeSlots.push(this.createFreeSlot(currentTime, event.start, duration));
          }
        }
        currentTime = new Date(Math.max(currentTime.getTime(), event.end.getTime()));
      });

      // Check for time at end of day
      if (currentTime < dayEnd) {
        const duration = (dayEnd.getTime() - currentTime.getTime()) / (1000 * 60);
        if (duration >= 30) {
          freeSlots.push(this.createFreeSlot(currentTime, dayEnd, duration));
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return freeSlots.sort((a, b) => b.duration - a.duration);
  }

  /**
   * Detect schedule conflicts
   */
  detectConflicts(events: CalendarEvent[]): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];
    const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

    // Check for overlaps
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      for (let j = i + 1; j < sortedEvents.length; j++) {
        const event1 = sortedEvents[i];
        const event2 = sortedEvents[j];

        // Check if events overlap
        if (event1.end > event2.start && event1.start < event2.end) {
          conflicts.push({
            type: 'double-booking',
            severity: 'high',
            events: [event1, event2],
            start: new Date(Math.max(event1.start.getTime(), event2.start.getTime())),
            end: new Date(Math.min(event1.end.getTime(), event2.end.getTime())),
            description: `Overlap between "${event1.summary}" and "${event2.summary}"`,
            suggestion: 'Reschedule one of these events to avoid conflict',
          });
        }

        // Check for insufficient buffer (less than 5 minutes between meetings)
        if (event1.end > event2.start) {
          const buffer = (event2.start.getTime() - event1.end.getTime()) / (1000 * 60);
          if (buffer > 0 && buffer < 5) {
            conflicts.push({
              type: 'insufficient-buffer',
              severity: 'medium',
              events: [event1, event2],
              start: event1.end,
              end: event2.start,
              description: `Only ${Math.round(buffer)} minutes between meetings`,
              suggestion: 'Add at least 5 minutes buffer between meetings',
            });
          }
        }
      }
    }

    // Check for overload (more than 6 meetings in a day)
    const eventsByDay = this.groupEventsByDay(events);
    eventsByDay.forEach(({ date, events: dayEvents }) => {
      if (dayEvents.length > 6) {
        conflicts.push({
          type: 'overload',
          severity: 'high',
          events: dayEvents,
          start: date,
          end: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          description: `${dayEvents.length} events scheduled in one day`,
          suggestion: 'Consider moving some events to other days',
        });
      }
    });

    return conflicts;
  }

  /**
   * Generate schedule recommendations
   */
  generateRecommendations(
    events: CalendarEvent[],
    startDate: Date,
    endDate: Date
  ): ScheduleRecommendation[] {
    const recommendations: ScheduleRecommendation[] = [];
    const meetingLoad = this.analyzeMeetingLoad(events, startDate, endDate);
    const productivity = this.analyzeProductivity(events);

    // Too many meetings
    if (meetingLoad.percentageOfWorkTime > 50) {
      recommendations.push({
        type: 'reduce-meeting-load',
        priority: 'high',
        title: 'Reduce Meeting Load',
        description: `Meetings consume ${Math.round(meetingLoad.percentageOfWorkTime)}% of your work time`,
        impact: 'Free up time for deep work and increase productivity',
      });
    }

    // Back-to-back meetings
    if (meetingLoad.backToBackMeetings > 5) {
      recommendations.push({
        type: 'add-buffer',
        priority: 'high',
        title: 'Add Buffer Between Meetings',
        description: `${meetingLoad.backToBackMeetings} back-to-back meetings detected`,
        impact: 'Reduce context switching and meeting fatigue',
      });
    }

    // Low focus time
    if (productivity.focusTimeHours < 10) {
      recommendations.push({
        type: 'protect-focus-time',
        priority: 'high',
        title: 'Protect More Focus Time',
        description: `Only ${Math.round(productivity.focusTimeHours)} hours of uninterrupted focus time`,
        impact: 'Improve deep work and project completion',
      });
    }

    // High fragmentation
    if (productivity.fragmentedHours > productivity.focusTimeHours) {
      recommendations.push({
        type: 'consolidate-meetings',
        priority: 'medium',
        title: 'Consolidate Meetings',
        description: 'Schedule is highly fragmented with many short blocks',
        impact: 'Create larger blocks of time for meaningful work',
      });
    }

    // No breaks
    const breakEvents = events.filter(e => e.metadata?.category === 'break');
    if (breakEvents.length === 0) {
      recommendations.push({
        type: 'add-break',
        priority: 'medium',
        title: 'Schedule Regular Breaks',
        description: 'No breaks scheduled in your calendar',
        impact: 'Improve focus and prevent burnout',
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Analyze productivity metrics
   */
  analyzeProductivity(events: CalendarEvent[]): ProductivityMetrics {
    // Find focus time blocks (uninterrupted >= 2 hours)
    const focusBlocks = this.findFocusBlocks(events, 120);
    const focusTimeHours = focusBlocks.reduce((sum, block) => sum + block.duration / 60, 0);

    // Find fragmented time (blocks < 1 hour)
    const fragmentedBlocks = this.findFocusBlocks(events, 0, 60);
    const fragmentedHours = fragmentedBlocks.reduce((sum, block) => sum + block.duration / 60, 0);

    // Calculate average block size
    const allBlocks = this.findFocusBlocks(events, 0);
    const averageBlockSize =
      allBlocks.length > 0
        ? allBlocks.reduce((sum, block) => sum + block.duration, 0) / allBlocks.length
        : 0;

    // Find largest focus block
    let largestFocusBlock = { duration: 0, date: new Date() };
    focusBlocks.forEach(block => {
      if (block.duration > largestFocusBlock.duration) {
        largestFocusBlock = { duration: block.duration, date: block.start };
      }
    });

    // Count context switches (category changes per day)
    const contextSwitches = this.countContextSwitches(events);

    // Analyze energy alignment
    const deepWorkEvents = events.filter(e => e.metadata?.category === 'deep-work');
    const morningDeepWork = deepWorkEvents.filter(e => e.start.getHours() >= 6 && e.start.getHours() < 12).length;
    const highEnergyWork = deepWorkEvents.length > 0 ? (morningDeepWork / deepWorkEvents.length) * 100 : 0;

    const adminEvents = events.filter(e => e.metadata?.category === 'admin');
    const afternoonAdmin = adminEvents.filter(e => e.start.getHours() >= 12 && e.start.getHours() < 18).length;
    const lowEnergyWork = adminEvents.length > 0 ? (afternoonAdmin / adminEvents.length) * 100 : 0;

    return {
      focusTimeHours,
      fragmentedHours,
      averageBlockSize,
      largestFocusBlock,
      contextSwitches,
      energyAlignment: {
        highEnergyWork,
        lowEnergyWork,
      },
    };
  }

  /**
   * Analyze work-life balance
   */
  analyzeWorkLifeBalance(
    events: CalendarEvent[],
    startDate: Date,
    endDate: Date
  ): WorkLifeBalance {
    const workCategories: EventCategory[] = ['work', 'meeting', 'deep-work', 'admin'];
    const personalCategories: EventCategory[] = ['personal', 'health', 'social', 'break'];

    let workHours = 0;
    let personalHours = 0;
    let weekendWorkHours = 0;
    let eveningWorkHours = 0;
    let breakTime = 0;
    let overworkedDays = 0;

    // Group events by day
    const eventsByDay = this.groupEventsByDay(events);

    eventsByDay.forEach(({ date, events: dayEvents }) => {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      let dayWorkHours = 0;

      dayEvents.forEach(event => {
        const category = event.metadata?.category || 'other';
        const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
        const isEvening = event.start.getHours() >= 18;

        if (workCategories.includes(category)) {
          workHours += duration;
          dayWorkHours += duration;

          if (isWeekend) {
            weekendWorkHours += duration;
          }

          if (isEvening) {
            eveningWorkHours += duration;
          }
        } else if (personalCategories.includes(category)) {
          personalHours += duration;

          if (category === 'break') {
            breakTime += duration;
          }
        }
      });

      if (dayWorkHours > 10) {
        overworkedDays++;
      }
    });

    const totalHours = workHours + personalHours;
    const workPercentage = totalHours > 0 ? (workHours / totalHours) * 100 : 0;
    const personalPercentage = totalHours > 0 ? (personalHours / totalHours) * 100 : 0;

    let recommendation = 'Your work-life balance looks healthy.';
    if (workPercentage > 70) {
      recommendation = 'Consider scheduling more personal time and breaks.';
    } else if (weekendWorkHours > 5) {
      recommendation = 'Try to reduce weekend work to maintain better boundaries.';
    } else if (overworkedDays > 2) {
      recommendation = 'Several overworked days detected. Consider spreading work more evenly.';
    }

    return {
      workHours,
      personalHours,
      workPercentage,
      personalPercentage,
      weekendWorkHours,
      eveningWorkHours,
      breakTime,
      overworkedDays,
      recommendation,
    };
  }

  // Helper methods

  private createFreeSlot(start: Date, end: Date, duration: number): FreeSlot {
    const hour = start.getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening';
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    const isWorkHours = hour >= 9 && hour < 17;

    let suggestedUse: FreeSlot['suggestedUse'];
    if (duration >= 120) {
      suggestedUse = 'deep-work';
    } else if (duration >= 60) {
      suggestedUse = 'meetings';
    } else if (duration >= 30) {
      suggestedUse = 'admin';
    } else {
      suggestedUse = 'break';
    }

    return {
      start,
      end,
      duration,
      dayOfWeek: start.toLocaleDateString('en-US', { weekday: 'long' }),
      timeOfDay,
      isWorkHours,
      suggestedUse,
    };
  }

  private findMeetingFreeBlocks(
    meetings: CalendarEvent[],
    startDate: Date,
    endDate: Date
  ): Array<{ start: Date; end: Date; duration: number }> {
    const blocks: Array<{ start: Date; end: Date; duration: number }> = [];
    const sortedMeetings = [...meetings].sort((a, b) => a.start.getTime() - b.start.getTime());

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(9, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(17, 0, 0, 0);

      const dayMeetings = sortedMeetings.filter(
        m => m.start >= dayStart && m.start < dayEnd
      );

      let currentTime = dayStart;

      dayMeetings.forEach(meeting => {
        if (currentTime < meeting.start) {
          const duration = (meeting.start.getTime() - currentTime.getTime()) / (1000 * 60);
          if (duration >= 60) {
            blocks.push({
              start: new Date(currentTime),
              end: new Date(meeting.start),
              duration,
            });
          }
        }
        currentTime = new Date(Math.max(currentTime.getTime(), meeting.end.getTime()));
      });

      if (currentTime < dayEnd) {
        const duration = (dayEnd.getTime() - currentTime.getTime()) / (1000 * 60);
        if (duration >= 60) {
          blocks.push({
            start: new Date(currentTime),
            end: new Date(dayEnd),
            duration,
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return blocks;
  }

  private groupMeetingsByDay(
    meetings: CalendarEvent[]
  ): Array<{ date: Date; count: number; hours: number }> {
    const dayMap = new Map<string, { date: Date; count: number; hours: number }>();

    meetings.forEach(meeting => {
      const dateKey = meeting.start.toISOString().split('T')[0];
      const existing = dayMap.get(dateKey);
      const hours = (meeting.end.getTime() - meeting.start.getTime()) / (1000 * 60 * 60);

      if (existing) {
        existing.count++;
        existing.hours += hours;
      } else {
        const date = new Date(meeting.start);
        date.setHours(0, 0, 0, 0);
        dayMap.set(dateKey, { date, count: 1, hours });
      }
    });

    return Array.from(dayMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private groupEventsByDay(
    events: CalendarEvent[]
  ): Array<{ date: Date; events: CalendarEvent[] }> {
    const dayMap = new Map<string, CalendarEvent[]>();

    events.forEach(event => {
      const dateKey = event.start.toISOString().split('T')[0];
      const existing = dayMap.get(dateKey) || [];
      existing.push(event);
      dayMap.set(dateKey, existing);
    });

    return Array.from(dayMap.entries())
      .map(([dateKey, events]) => {
        const date = new Date(dateKey);
        return { date, events };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private findFocusBlocks(
    events: CalendarEvent[],
    minDuration: number,
    maxDuration?: number
  ): Array<{ start: Date; end: Date; duration: number }> {
    const blocks: Array<{ start: Date; end: Date; duration: number }> = [];
    const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const gap = (sortedEvents[i + 1].start.getTime() - sortedEvents[i].end.getTime()) / (1000 * 60);

      if (gap >= minDuration && (!maxDuration || gap <= maxDuration)) {
        blocks.push({
          start: sortedEvents[i].end,
          end: sortedEvents[i + 1].start,
          duration: gap,
        });
      }
    }

    return blocks;
  }

  private countContextSwitches(events: CalendarEvent[]): number {
    const eventsByDay = this.groupEventsByDay(events);
    let totalSwitches = 0;

    eventsByDay.forEach(({ events: dayEvents }) => {
      const sortedDayEvents = [...dayEvents].sort((a, b) => a.start.getTime() - b.start.getTime());

      for (let i = 0; i < sortedDayEvents.length - 1; i++) {
        if (sortedDayEvents[i].metadata?.category !== sortedDayEvents[i + 1].metadata?.category) {
          totalSwitches++;
        }
      }
    });

    return totalSwitches;
  }
}

/**
 * Create a schedule analyzer instance
 */
export function createScheduleAnalyzer(): ScheduleAnalyzer {
  return new ScheduleAnalyzer();
}
