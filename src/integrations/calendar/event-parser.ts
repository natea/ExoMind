/**
 * Event Parser - Extract tasks and action items from calendar events
 * Analyzes event descriptions, titles, and attachments to create tasks
 */

import { CalendarEvent, EventCategory } from '../../types/calendar';

/**
 * Extracted task from calendar event
 */
export interface ExtractedTask {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: EventCategory;
  sourceEventId: string;
  sourceEventTitle: string;
  tags: string[];
  estimatedMinutes?: number;
  type: 'prep' | 'action' | 'followup';
}

/**
 * Parsing result
 */
export interface ParseResult {
  tasks: ExtractedTask[];
  prepWork: ExtractedTask[];
  actionItems: ExtractedTask[];
  followups: ExtractedTask[];
  insights: string[];
}

/**
 * Event parser for task extraction
 */
export class EventParser {
  /**
   * Parse calendar event for tasks and action items
   */
  parseEvent(event: CalendarEvent): ParseResult {
    const result: ParseResult = {
      tasks: [],
      prepWork: [],
      actionItems: [],
      followups: [],
      insights: [],
    };

    // Extract prep work
    const prep = this.extractPrepWork(event);
    result.prepWork.push(...prep);
    result.tasks.push(...prep);

    // Extract action items from description
    const actions = this.extractActionItems(event);
    result.actionItems.push(...actions);
    result.tasks.push(...actions);

    // Extract follow-ups
    const followups = this.extractFollowups(event);
    result.followups.push(...followups);
    result.tasks.push(...followups);

    // Generate insights
    result.insights = this.generateInsights(event, result);

    return result;
  }

  /**
   * Parse multiple events in bulk
   */
  parseEvents(events: CalendarEvent[]): ParseResult {
    const combined: ParseResult = {
      tasks: [],
      prepWork: [],
      actionItems: [],
      followups: [],
      insights: [],
    };

    events.forEach(event => {
      const result = this.parseEvent(event);
      combined.tasks.push(...result.tasks);
      combined.prepWork.push(...result.prepWork);
      combined.actionItems.push(...result.actionItems);
      combined.followups.push(...result.followups);
      combined.insights.push(...result.insights);
    });

    // Deduplicate tasks
    combined.tasks = this.deduplicateTasks(combined.tasks);
    combined.prepWork = this.deduplicateTasks(combined.prepWork);
    combined.actionItems = this.deduplicateTasks(combined.actionItems);
    combined.followups = this.deduplicateTasks(combined.followups);

    return combined;
  }

  /**
   * Extract preparation tasks
   */
  private extractPrepWork(event: CalendarEvent): ExtractedTask[] {
    const tasks: ExtractedTask[] = [];
    const prepTime = event.metadata?.preparationTime || 30; // Default 30 minutes prep

    // Check if event needs preparation
    if (this.needsPreparation(event)) {
      const prepTask: ExtractedTask = {
        title: `Prepare for: ${event.summary}`,
        description: this.generatePrepDescription(event),
        dueDate: new Date(event.start.getTime() - 60 * 60 * 1000), // 1 hour before
        priority: this.determinePriority(event),
        category: event.metadata?.category || 'work',
        sourceEventId: event.id,
        sourceEventTitle: event.summary,
        tags: ['prep', 'meeting', ...(event.metadata?.tags || [])],
        estimatedMinutes: prepTime,
        type: 'prep',
      };

      tasks.push(prepTask);
    }

    // Check for attachments that need review
    if (event.attachments && event.attachments.length > 0) {
      const reviewTask: ExtractedTask = {
        title: `Review materials for: ${event.summary}`,
        description: `Review ${event.attachments.length} attachment(s):\n${event.attachments.map(a => `- ${a.title}`).join('\n')}`,
        dueDate: new Date(event.start.getTime() - 2 * 60 * 60 * 1000), // 2 hours before
        priority: 'medium',
        category: event.metadata?.category || 'work',
        sourceEventId: event.id,
        sourceEventTitle: event.summary,
        tags: ['review', 'prep', ...(event.metadata?.tags || [])],
        estimatedMinutes: event.attachments.length * 10, // 10 min per attachment
        type: 'prep',
      };

      tasks.push(reviewTask);
    }

    return tasks;
  }

  /**
   * Extract action items from event description
   */
  private extractActionItems(event: CalendarEvent): ExtractedTask[] {
    const tasks: ExtractedTask[] = [];

    if (!event.description) return tasks;

    // Look for action item patterns
    const patterns = [
      /(?:^|\n)\s*[-*•]\s*(.+)/gm, // Bullet points
      /(?:^|\n)\s*\d+\.\s*(.+)/gm, // Numbered lists
      /(?:^|\n)\s*\[\s*\]\s*(.+)/gm, // Checkboxes
      /(?:^|\n)\s*TODO:\s*(.+)/gim, // TODO markers
      /(?:^|\n)\s*Action:\s*(.+)/gim, // Action markers
      /(?:^|\n)\s*@(\w+)\s+(.+)/gm, // @mentions with actions
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(event.description!)) !== null) {
        const actionText = match[1] || match[2];
        if (actionText && this.isActionItem(actionText)) {
          const task: ExtractedTask = {
            title: this.cleanActionText(actionText),
            description: `Action item from: ${event.summary}`,
            dueDate: this.extractDueDate(actionText, event.end),
            priority: this.detectPriority(actionText),
            category: event.metadata?.category || 'work',
            sourceEventId: event.id,
            sourceEventTitle: event.summary,
            tags: ['action-item', ...(event.metadata?.tags || [])],
            estimatedMinutes: this.estimateTaskDuration(actionText),
            type: 'action',
          };

          tasks.push(task);
        }
      }
    });

    return tasks;
  }

  /**
   * Extract follow-up tasks
   */
  private extractFollowups(event: CalendarEvent): ExtractedTask[] {
    const tasks: ExtractedTask[] = [];

    if (!event.description) return tasks;

    const followupPatterns = [
      /follow\s*up\s*(?:with|on)?\s*(.+)/gim,
      /(?:schedule|book)\s*(.+)/gim,
      /(?:send|share|email)\s*(.+)/gim,
      /(?:review|check)\s*(.+)/gim,
    ];

    followupPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(event.description!)) !== null) {
        const followupText = match[1];
        if (followupText && followupText.length > 5) {
          const task: ExtractedTask = {
            title: this.cleanActionText(followupText),
            description: `Follow-up from: ${event.summary}`,
            dueDate: new Date(event.end.getTime() + 24 * 60 * 60 * 1000), // Next day
            priority: 'medium',
            category: event.metadata?.category || 'work',
            sourceEventId: event.id,
            sourceEventTitle: event.summary,
            tags: ['followup', ...(event.metadata?.tags || [])],
            estimatedMinutes: 15,
            type: 'followup',
          };

          tasks.push(task);
        }
      }
    });

    return tasks;
  }

  /**
   * Handle recurring events
   */
  parseRecurringEvent(
    event: CalendarEvent,
    instances: CalendarEvent[]
  ): ParseResult {
    const result: ParseResult = {
      tasks: [],
      prepWork: [],
      actionItems: [],
      followups: [],
      insights: [],
    };

    // Parse master event
    const masterResult = this.parseEvent(event);

    // For prep work, create tasks for each instance
    instances.forEach(instance => {
      const prep = this.extractPrepWork(instance);
      result.prepWork.push(...prep);
      result.tasks.push(...prep);
    });

    // Action items and followups apply to master event only
    result.actionItems.push(...masterResult.actionItems);
    result.followups.push(...masterResult.followups);
    result.tasks.push(...masterResult.actionItems);
    result.tasks.push(...masterResult.followups);

    result.insights.push(
      `Recurring event: ${instances.length} instances found`,
      ...masterResult.insights
    );

    return result;
  }

  // Helper methods

  private needsPreparation(event: CalendarEvent): boolean {
    // Meetings with multiple attendees need prep
    if (event.attendees && event.attendees.length > 2) return true;

    // Events with attachments need prep
    if (event.attachments && event.attachments.length > 0) return true;

    // Important keywords in title
    const importantKeywords = [
      'presentation',
      'demo',
      'review',
      'interview',
      'pitch',
      'workshop',
    ];

    const title = event.summary.toLowerCase();
    return importantKeywords.some(keyword => title.includes(keyword));
  }

  private generatePrepDescription(event: CalendarEvent): string {
    const items: string[] = [];

    items.push(`Event: ${event.summary}`);

    if (event.location) {
      items.push(`Location: ${event.location}`);
    }

    if (event.attendees && event.attendees.length > 0) {
      items.push(`Attendees: ${event.attendees.length} people`);
    }

    items.push('\nPreparation checklist:');
    items.push('- Review agenda');
    items.push('- Prepare any materials');
    items.push('- Review previous notes');

    if (event.hangoutLink) {
      items.push('- Test video conferencing link');
    }

    return items.join('\n');
  }

  private isActionItem(text: string): boolean {
    // Filter out non-actionable items
    if (text.length < 10) return false;

    // Must contain a verb
    const actionVerbs = [
      'send',
      'create',
      'update',
      'review',
      'complete',
      'schedule',
      'book',
      'follow',
      'prepare',
      'analyze',
      'implement',
      'fix',
      'test',
      'deploy',
      'contact',
      'email',
      'call',
      'meet',
      'discuss',
    ];

    const lowerText = text.toLowerCase();
    return actionVerbs.some(verb => lowerText.includes(verb));
  }

  private cleanActionText(text: string): string {
    return text
      .trim()
      .replace(/^[-*•]\s*/, '') // Remove bullet points
      .replace(/^\d+\.\s*/, '') // Remove numbers
      .replace(/^\[\s*\]\s*/, '') // Remove checkboxes
      .replace(/^(TODO|Action):\s*/i, '') // Remove markers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private extractDueDate(text: string, eventEnd: Date): Date | undefined {
    const dueDatePatterns = [
      /by\s+(\w+\s+\d+)/i, // "by Monday 5th"
      /due\s+(\w+\s+\d+)/i, // "due March 15th"
      /before\s+(\w+\s+\d+)/i, // "before Friday 10th"
    ];

    for (const pattern of dueDatePatterns) {
      const match = text.match(pattern);
      if (match) {
        const dateStr = match[1];
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }
    }

    // Default to day after event
    return new Date(eventEnd.getTime() + 24 * 60 * 60 * 1000);
  }

  private detectPriority(text: string): 'low' | 'medium' | 'high' {
    const lowerText = text.toLowerCase();

    const highPriorityKeywords = ['urgent', 'asap', 'critical', 'important', 'priority'];
    if (highPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'high';
    }

    const lowPriorityKeywords = ['when possible', 'eventually', 'consider', 'optional'];
    if (lowPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'low';
    }

    return 'medium';
  }

  private determinePriority(event: CalendarEvent): 'low' | 'medium' | 'high' {
    // Number of attendees
    if (event.attendees && event.attendees.length > 5) return 'high';

    // Event category
    if (event.metadata?.category === 'meeting') return 'high';

    // Keywords in title
    const title = event.summary.toLowerCase();
    if (title.includes('review') || title.includes('important')) return 'high';

    return 'medium';
  }

  private estimateTaskDuration(text: string): number {
    const lowerText = text.toLowerCase();

    // Look for time estimates in text
    const timePattern = /(\d+)\s*(hour|hr|minute|min)/i;
    const match = lowerText.match(timePattern);

    if (match) {
      const amount = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      return unit.startsWith('hour') ? amount * 60 : amount;
    }

    // Estimate based on complexity keywords
    const quickKeywords = ['quick', 'brief', 'short', 'simple'];
    if (quickKeywords.some(keyword => lowerText.includes(keyword))) {
      return 15;
    }

    const longKeywords = ['detailed', 'comprehensive', 'thorough', 'complete'];
    if (longKeywords.some(keyword => lowerText.includes(keyword))) {
      return 120;
    }

    return 30; // Default 30 minutes
  }

  private deduplicateTasks(tasks: ExtractedTask[]): ExtractedTask[] {
    const seen = new Set<string>();
    const unique: ExtractedTask[] = [];

    tasks.forEach(task => {
      const key = `${task.title}-${task.sourceEventId}-${task.type}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(task);
      }
    });

    return unique;
  }

  private generateInsights(event: CalendarEvent, result: ParseResult): string[] {
    const insights: string[] = [];

    if (result.tasks.length > 0) {
      insights.push(`Found ${result.tasks.length} task(s) from this event`);
    }

    if (result.prepWork.length > 0) {
      insights.push(`Preparation needed: ${result.prepWork.length} task(s)`);
    }

    if (event.attendees && event.attendees.length > 10) {
      insights.push('Large meeting - consider agenda and time management');
    }

    if (event.attachments && event.attachments.length > 3) {
      insights.push('Many attachments - allocate sufficient review time');
    }

    const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
    if (duration > 120) {
      insights.push('Long meeting - ensure breaks are scheduled');
    }

    return insights;
  }
}

/**
 * Create an event parser instance
 */
export function createEventParser(): EventParser {
  return new EventParser();
}
