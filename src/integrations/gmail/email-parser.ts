/**
 * Email Parser
 * Extract actionable items, dates, and metadata from emails
 */

import { EmailMessage } from '../../types/gmail';

export interface ParsedEmail {
  message: EmailMessage;
  actionItems: ActionItem[];
  dates: ExtractedDate[];
  meetingInvite?: MeetingInvite;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActionable: boolean;
  categories: string[];
}

export interface ActionItem {
  text: string;
  type: 'task' | 'question' | 'request' | 'reminder';
  confidence: number;
}

export interface ExtractedDate {
  date: Date;
  text: string;
  type: 'deadline' | 'meeting' | 'reminder' | 'reference';
  confidence: number;
}

export interface MeetingInvite {
  title: string;
  startTime?: Date;
  endTime?: Date;
  location?: string;
  attendees: string[];
  description: string;
}

export class EmailParser {
  /**
   * Parse email for actionable items and metadata
   */
  parseEmail(message: EmailMessage): ParsedEmail {
    const bodyText = this.cleanHtmlToText(message.bodyHtml || message.body);

    return {
      message,
      actionItems: this.extractActionItems(bodyText),
      dates: this.extractDates(bodyText, message.subject),
      meetingInvite: this.parseMeetingInvite(message),
      priority: this.detectPriority(message, bodyText),
      isActionable: this.isActionableEmail(message, bodyText),
      categories: this.categorizeEmail(message, bodyText),
    };
  }

  /**
   * Convert HTML to plain text
   */
  cleanHtmlToText(html: string): string {
    let text = html;

    // Remove script and style tags
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Convert common HTML elements
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n\n');
    text = text.replace(/<li[^>]*>/gi, '\n• ');
    text = text.replace(/<\/li>/gi, '');

    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec));

    // Clean up whitespace
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.trim();

    return text;
  }

  /**
   * Extract action items from email text
   */
  private extractActionItems(text: string): ActionItem[] {
    const actionItems: ActionItem[] = [];

    // Patterns for action items
    const patterns = [
      // Explicit action verbs
      /(?:please|kindly|could you|can you|would you)\s+([^.?!]+)/gi,
      // Question format
      /([^.?!]*\?)/gi,
      // Task format
      /(?:todo|to do|action item|need to|must|should)\s+([^.?!]+)/gi,
      // Deadline format
      /(?:by|due|deadline|before)\s+([^.?!]+)/gi,
    ];

    patterns.forEach((pattern, index) => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const text = match[1]?.trim() || match[0]?.trim();
        if (text && text.length > 10 && text.length < 200) {
          actionItems.push({
            text,
            type: this.determineActionType(text, index),
            confidence: this.calculateConfidence(text, index),
          });
        }
      }
    });

    return actionItems;
  }

  /**
   * Extract dates from email text
   */
  private extractDates(bodyText: string, subject: string): ExtractedDate[] {
    const dates: ExtractedDate[] = [];
    const text = `${subject} ${bodyText}`;

    // Date patterns
    const patterns = [
      // ISO format: 2024-03-15
      /\b(\d{4}-\d{2}-\d{2})\b/g,
      // US format: 03/15/2024 or 3/15/24
      /\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/g,
      // Relative dates: tomorrow, next week, etc.
      /\b(tomorrow|today|tonight|next\s+(?:week|month|monday|tuesday|wednesday|thursday|friday))\b/gi,
      // Month day: March 15, Mar 15
      /\b((?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)\b/gi,
    ];

    patterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const dateText = match[1];
        const parsedDate = this.parseDate(dateText);

        if (parsedDate) {
          dates.push({
            date: parsedDate,
            text: dateText,
            type: this.determineDateType(text, dateText),
            confidence: 0.8,
          });
        }
      }
    });

    return dates;
  }

  /**
   * Parse meeting invite from email
   */
  private parseMeetingInvite(message: EmailMessage): MeetingInvite | undefined {
    const subject = message.subject.toLowerCase();
    const body = message.body.toLowerCase();

    // Check if it's a meeting invite
    const isMeeting =
      subject.includes('meeting') ||
      subject.includes('invitation') ||
      subject.includes('calendar') ||
      body.includes('join zoom') ||
      body.includes('google meet') ||
      body.includes('teams meeting');

    if (!isMeeting) {
      return undefined;
    }

    // Extract meeting details
    return {
      title: message.subject,
      attendees: [message.from, ...message.to],
      description: message.snippet,
    };
  }

  /**
   * Detect email priority
   */
  private detectPriority(message: EmailMessage, bodyText: string): 'low' | 'medium' | 'high' | 'urgent' {
    const text = `${message.subject} ${bodyText}`.toLowerCase();

    // Urgent indicators
    if (
      text.includes('urgent') ||
      text.includes('asap') ||
      text.includes('emergency') ||
      text.includes('critical') ||
      message.subject.includes('!')
    ) {
      return 'urgent';
    }

    // High priority indicators
    if (
      text.includes('important') ||
      text.includes('priority') ||
      text.includes('deadline today') ||
      text.includes('by eod')
    ) {
      return 'high';
    }

    // Low priority indicators
    if (
      text.includes('fyi') ||
      text.includes('for your information') ||
      text.includes('no rush') ||
      message.subject.toLowerCase().startsWith('re:')
    ) {
      return 'low';
    }

    return 'medium';
  }

  /**
   * Check if email is actionable
   */
  private isActionableEmail(message: EmailMessage, bodyText: string): boolean {
    const text = `${message.subject} ${bodyText}`.toLowerCase();

    // Non-actionable patterns
    const nonActionablePatterns = [
      /newsletter/i,
      /unsubscribe/i,
      /automated/i,
      /no-?reply/i,
      /notification/i,
    ];

    if (nonActionablePatterns.some(pattern => pattern.test(text))) {
      return false;
    }

    // Actionable patterns
    const actionablePatterns = [
      /\?/,  // Contains question
      /please/i,
      /could you/i,
      /can you/i,
      /need/i,
      /request/i,
      /deadline/i,
      /due/i,
    ];

    return actionablePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Categorize email
   */
  private categorizeEmail(message: EmailMessage, bodyText: string): string[] {
    const categories: string[] = [];
    const text = `${message.subject} ${bodyText}`.toLowerCase();

    // Category patterns
    const categoryPatterns: Record<string, RegExp[]> = {
      meeting: [/meeting/i, /calendar/i, /zoom/i, /teams/i],
      task: [/task/i, /todo/i, /action item/i, /follow up/i],
      question: [/\?/, /question/i, /clarification/i],
      deadline: [/deadline/i, /due/i, /by \w+day/i],
      project: [/project/i, /proposal/i, /plan/i],
      feedback: [/feedback/i, /review/i, /thoughts/i],
      notification: [/notification/i, /alert/i, /update/i],
    };

    Object.entries(categoryPatterns).forEach(([category, patterns]) => {
      if (patterns.some(pattern => pattern.test(text))) {
        categories.push(category);
      }
    });

    return categories;
  }

  /**
   * Determine action item type
   */
  private determineActionType(text: string, patternIndex: number): 'task' | 'question' | 'request' | 'reminder' {
    if (text.includes('?')) return 'question';
    if (patternIndex === 0) return 'request';
    if (patternIndex === 3) return 'reminder';
    return 'task';
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(text: string, patternIndex: number): number {
    let confidence = 0.5;

    // Boost confidence based on pattern type
    if (patternIndex === 0) confidence += 0.3; // Explicit request
    if (text.includes('?')) confidence += 0.2; // Question

    // Reduce confidence for vague text
    if (text.length < 20) confidence -= 0.2;

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Determine date type from context
   */
  private determineDateType(text: string, dateText: string): 'deadline' | 'meeting' | 'reminder' | 'reference' {
    const context = text.toLowerCase();
    const beforeDate = context.substring(Math.max(0, context.indexOf(dateText.toLowerCase()) - 50), context.indexOf(dateText.toLowerCase()));

    if (beforeDate.includes('deadline') || beforeDate.includes('due')) {
      return 'deadline';
    }
    if (beforeDate.includes('meeting') || beforeDate.includes('call')) {
      return 'meeting';
    }
    if (beforeDate.includes('remind')) {
      return 'reminder';
    }
    return 'reference';
  }

  /**
   * Parse date string to Date object
   */
  private parseDate(dateText: string): Date | null {
    try {
      // Handle relative dates
      const now = new Date();
      const lowerText = dateText.toLowerCase();

      if (lowerText === 'today') {
        return now;
      }
      if (lowerText === 'tomorrow') {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      }
      if (lowerText.startsWith('next week')) {
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;
      }

      // Try to parse absolute dates
      const parsed = new Date(dateText);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }

      return null;
    } catch {
      return null;
    }
  }
}
