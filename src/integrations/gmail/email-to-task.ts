/**
 * Email to Task Converter
 * Convert actionable emails into tasks with auto-categorization
 */

import { EmailMessage, EmailTask, EmailToTaskOptions } from '../../types/gmail';
import { EmailParser, ParsedEmail } from './email-parser';

export class EmailToTaskConverter {
  private parser: EmailParser;

  constructor() {
    this.parser = new EmailParser();
  }

  /**
   * Convert email to task
   */
  convertToTask(message: EmailMessage, options: EmailToTaskOptions = {}): EmailTask | null {
    const parsed = this.parser.parseEmail(message);

    // Skip non-actionable emails
    if (!parsed.isActionable && !options.extractDates) {
      return null;
    }

    const task = this.createTask(parsed, options);
    return task;
  }

  /**
   * Convert multiple emails to tasks
   */
  convertBatch(messages: EmailMessage[], options: EmailToTaskOptions = {}): EmailTask[] {
    const tasks: EmailTask[] = [];

    for (const message of messages) {
      const task = this.convertToTask(message, options);
      if (task) {
        tasks.push(task);
      }
    }

    return tasks;
  }

  /**
   * Create task from parsed email
   */
  private createTask(parsed: ParsedEmail, options: EmailToTaskOptions): EmailTask {
    const message = parsed.message;

    // Generate task title
    const title = this.generateTitle(parsed);

    // Generate task description
    const description = this.generateDescription(parsed);

    // Extract due date
    const dueDate = this.extractDueDate(parsed);

    // Determine priority
    const priority = options.extractPriority !== false
      ? parsed.priority
      : 'medium';

    // Auto-categorize
    const project = this.determineProject(parsed, options);
    const context = this.determineContext(parsed, options);
    const tags = this.generateTags(parsed);

    return {
      title,
      description,
      dueDate,
      priority,
      project,
      context,
      tags,
      sourceEmail: {
        messageId: message.id,
        threadId: message.threadId,
        subject: message.subject,
        from: message.from,
        date: message.date,
      },
    };
  }

  /**
   * Generate task title from email
   */
  private generateTitle(parsed: ParsedEmail): string {
    const { message, actionItems } = parsed;

    // Use first action item if available
    if (actionItems.length > 0) {
      const firstAction = actionItems[0].text;
      if (firstAction.length < 100) {
        return this.cleanTitle(firstAction);
      }
    }

    // Use email subject
    let title = message.subject;

    // Clean up common prefixes
    title = title.replace(/^(re:|fwd?:|fw:)\s*/gi, '').trim();

    // Truncate if too long
    if (title.length > 100) {
      title = title.substring(0, 97) + '...';
    }

    return title;
  }

  /**
   * Generate task description
   */
  private generateDescription(parsed: ParsedEmail): string {
    const { message, actionItems, dates } = parsed;
    const parts: string[] = [];

    // Add snippet
    parts.push(message.snippet);
    parts.push('');

    // Add action items
    if (actionItems.length > 0) {
      parts.push('Action Items:');
      actionItems.forEach(item => {
        parts.push(`• ${item.text} (${item.type})`);
      });
      parts.push('');
    }

    // Add dates
    if (dates.length > 0) {
      parts.push('Important Dates:');
      dates.forEach(date => {
        parts.push(`• ${date.text} (${date.type})`);
      });
      parts.push('');
    }

    // Add email metadata
    parts.push(`From: ${message.from}`);
    parts.push(`Date: ${message.date.toLocaleString()}`);
    parts.push(`Email: ${message.id}`);

    return parts.join('\n');
  }

  /**
   * Extract due date from parsed email
   */
  private extractDueDate(parsed: ParsedEmail): Date | undefined {
    const deadlines = parsed.dates.filter(d => d.type === 'deadline');

    if (deadlines.length > 0) {
      // Use earliest deadline
      return deadlines.sort((a, b) => a.date.getTime() - b.date.getTime())[0].date;
    }

    // Use meeting time as due date
    if (parsed.meetingInvite?.startTime) {
      return parsed.meetingInvite.startTime;
    }

    return undefined;
  }

  /**
   * Determine project from email
   */
  private determineProject(parsed: ParsedEmail, options: EmailToTaskOptions): string | undefined {
    // Use default project if provided
    if (options.defaultProject) {
      return options.defaultProject;
    }

    const { message, categories } = parsed;

    // Extract project from subject line
    const projectMatch = message.subject.match(/\[([^\]]+)\]/);
    if (projectMatch) {
      return projectMatch[1];
    }

    // Infer from categories
    if (categories.includes('project')) {
      // Extract project name from subject or body
      const words = message.subject.split(/\s+/);
      for (const word of words) {
        if (word.length > 3 && /^[A-Z]/.test(word)) {
          return word;
        }
      }
    }

    return undefined;
  }

  /**
   * Determine context from email
   */
  private determineContext(parsed: ParsedEmail, options: EmailToTaskOptions): string | undefined {
    // Use default context if provided
    if (options.defaultContext) {
      return options.defaultContext;
    }

    const { categories, message } = parsed;

    // Map categories to contexts
    const contextMap: Record<string, string> = {
      meeting: '@meeting',
      task: '@work',
      question: '@waiting',
      deadline: '@urgent',
      project: '@project',
    };

    for (const category of categories) {
      if (contextMap[category]) {
        return contextMap[category];
      }
    }

    // Infer from sender
    if (message.from.includes('noreply') || message.from.includes('notification')) {
      return '@reference';
    }

    return '@email';
  }

  /**
   * Generate tags from parsed email
   */
  private generateTags(parsed: ParsedEmail): string[] {
    const tags: string[] = ['email'];

    // Add category tags
    tags.push(...parsed.categories);

    // Add priority tag
    if (parsed.priority === 'urgent' || parsed.priority === 'high') {
      tags.push(parsed.priority);
    }

    // Add sender domain
    const senderDomain = this.extractDomain(parsed.message.from);
    if (senderDomain) {
      tags.push(senderDomain);
    }

    // Deduplicate
    return [...new Set(tags)];
  }

  /**
   * Clean up title text
   */
  private cleanTitle(text: string): string {
    return text
      .replace(/^(please|kindly|could you|can you|would you)\s+/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract domain from email address
   */
  private extractDomain(email: string): string | null {
    const match = email.match(/@([^>]+)/);
    if (match) {
      const domain = match[1].toLowerCase();
      // Remove common TLDs for cleaner tags
      return domain.replace(/\.(com|org|net|io)$/, '');
    }
    return null;
  }

  /**
   * Check if email should be converted to task
   */
  shouldConvertToTask(message: EmailMessage): boolean {
    const parsed = this.parser.parseEmail(message);
    return parsed.isActionable || parsed.actionItems.length > 0 || parsed.dates.some(d => d.type === 'deadline');
  }

  /**
   * Get conversion statistics
   */
  getConversionStats(messages: EmailMessage[]): {
    total: number;
    actionable: number;
    converted: number;
    skipped: number;
  } {
    let actionable = 0;
    let converted = 0;

    for (const message of messages) {
      const task = this.convertToTask(message);
      if (task) {
        converted++;
        actionable++;
      } else if (this.parser.parseEmail(message).isActionable) {
        actionable++;
      }
    }

    return {
      total: messages.length,
      actionable,
      converted,
      skipped: messages.length - converted,
    };
  }
}
