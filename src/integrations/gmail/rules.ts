/**
 * Email Processing Rules Engine
 * Define and execute rules for automated email processing
 */

import {
  ProcessingRule,
  RuleCondition,
  RuleAction,
  EmailMessage,
} from '../../types/gmail';
import { GmailClient } from './client';
import { EmailToTaskConverter } from './email-to-task';

export interface RuleExecutionResult {
  ruleId: string;
  ruleName: string;
  matched: boolean;
  actions: ActionResult[];
}

export interface ActionResult {
  action: string;
  success: boolean;
  error?: string;
}

export class EmailRulesEngine {
  private rules: Map<string, ProcessingRule>;
  private gmailClient: GmailClient;
  private taskConverter: EmailToTaskConverter;

  constructor(gmailClient: GmailClient) {
    this.rules = new Map();
    this.gmailClient = gmailClient;
    this.taskConverter = new EmailToTaskConverter();
    this.initializeDefaultRules();
  }

  /**
   * Add a processing rule
   */
  addRule(rule: ProcessingRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove a processing rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Get all rules
   */
  getRules(): ProcessingRule[] {
    return Array.from(this.rules.values()).sort((a, b) => b.priority - a.priority);
  }

  /**
   * Process email against all rules
   */
  async processEmail(message: EmailMessage): Promise<RuleExecutionResult[]> {
    const results: RuleExecutionResult[] = [];
    const sortedRules = this.getRules().filter(r => r.enabled);

    for (const rule of sortedRules) {
      const result = await this.executeRule(rule, message);
      results.push(result);

      // Stop processing if a rule matches and is terminal
      if (result.matched && this.isTerminalRule(rule)) {
        break;
      }
    }

    return results;
  }

  /**
   * Execute a single rule
   */
  private async executeRule(rule: ProcessingRule, message: EmailMessage): Promise<RuleExecutionResult> {
    const matched = this.evaluateConditions(rule.conditions, message);
    const actions: ActionResult[] = [];

    if (matched) {
      for (const action of rule.actions) {
        const result = await this.executeAction(action, message);
        actions.push(result);
      }
    }

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      matched,
      actions,
    };
  }

  /**
   * Evaluate rule conditions
   */
  private evaluateConditions(conditions: RuleCondition[], message: EmailMessage): boolean {
    return conditions.every(condition => this.evaluateCondition(condition, message));
  }

  /**
   * Evaluate single condition
   */
  private evaluateCondition(condition: RuleCondition, message: EmailMessage): boolean {
    const { type, operator, value, caseSensitive } = condition;

    let fieldValue: string | number | boolean = '';

    // Get field value
    switch (type) {
      case 'from':
        fieldValue = message.from;
        break;
      case 'to':
        fieldValue = message.to.join(',');
        break;
      case 'subject':
        fieldValue = message.subject;
        break;
      case 'body':
        fieldValue = message.body;
        break;
      case 'hasAttachment':
        fieldValue = message.attachments.length > 0;
        break;
      case 'label':
        fieldValue = message.labels.join(',');
        break;
      case 'age':
        const ageInDays = (Date.now() - message.date.getTime()) / (1000 * 60 * 60 * 24);
        fieldValue = ageInDays;
        break;
    }

    // Apply case sensitivity for string comparisons
    let processedFieldValue = fieldValue;
    let processedValue = value;
    if (typeof fieldValue === 'string' && typeof value === 'string') {
      if (!caseSensitive) {
        processedFieldValue = fieldValue.toLowerCase();
        processedValue = value.toLowerCase();
      }
    }

    // Evaluate operator
    switch (operator) {
      case 'contains':
        return String(processedFieldValue).includes(String(processedValue));
      case 'equals':
        return processedFieldValue === processedValue;
      case 'matches':
        return new RegExp(String(processedValue)).test(String(processedFieldValue));
      case 'greaterThan':
        return Number(fieldValue) > Number(value);
      case 'lessThan':
        return Number(fieldValue) < Number(value);
      default:
        return false;
    }
  }

  /**
   * Execute action
   */
  private async executeAction(action: RuleAction, message: EmailMessage): Promise<ActionResult> {
    try {
      switch (action.type) {
        case 'createTask':
          await this.createTaskFromEmail(message, action.params);
          break;
        case 'addLabel':
          await this.gmailClient.addLabels(message.id, [action.params?.labelId]);
          break;
        case 'archive':
          await this.gmailClient.archiveMessage(message.id);
          break;
        case 'markRead':
          await this.gmailClient.markAsRead(message.id);
          break;
        case 'forward':
          await this.forwardEmail(message, action.params?.to);
          break;
        case 'delete':
          await this.gmailClient.addLabels(message.id, ['TRASH']);
          break;
      }

      return {
        action: action.type,
        success: true,
      };
    } catch (error) {
      return {
        action: action.type,
        success: false,
        error: String(error),
      };
    }
  }

  /**
   * Create task from email
   */
  private async createTaskFromEmail(message: EmailMessage, params?: any): Promise<void> {
    const task = this.taskConverter.convertToTask(message, params);
    if (task) {
      // TODO: Integrate with task management system
      console.log('Task created:', task);
    }
  }

  /**
   * Forward email
   */
  private async forwardEmail(message: EmailMessage, to: string): Promise<void> {
    await this.gmailClient.sendMessage({
      to,
      subject: `Fwd: ${message.subject}`,
      body: `---------- Forwarded message ---------\nFrom: ${message.from}\nDate: ${message.date}\nSubject: ${message.subject}\n\n${message.body}`,
    });
  }

  /**
   * Check if rule is terminal (stops processing)
   */
  private isTerminalRule(rule: ProcessingRule): boolean {
    return rule.actions.some(action => action.type === 'archive' || action.type === 'delete');
  }

  /**
   * Initialize default rules
   */
  private initializeDefaultRules(): void {
    // Rule 1: Auto-archive newsletters
    this.addRule({
      id: 'auto-archive-newsletters',
      name: 'Auto-archive newsletters',
      description: 'Automatically archive newsletter emails',
      enabled: true,
      priority: 10,
      conditions: [
        {
          type: 'subject',
          operator: 'contains',
          value: 'newsletter',
        },
      ],
      actions: [
        { type: 'markRead' },
        { type: 'archive' },
      ],
    });

    // Rule 2: Create tasks from urgent emails
    this.addRule({
      id: 'urgent-to-task',
      name: 'Create tasks from urgent emails',
      description: 'Convert urgent emails to high-priority tasks',
      enabled: true,
      priority: 100,
      conditions: [
        {
          type: 'subject',
          operator: 'contains',
          value: 'urgent',
        },
      ],
      actions: [
        {
          type: 'createTask',
          params: { priority: 'urgent' },
        },
      ],
    });

    // Rule 3: Auto-label emails from boss
    this.addRule({
      id: 'label-from-boss',
      name: 'Label emails from manager',
      description: 'Add "Important" label to emails from manager',
      enabled: true,
      priority: 90,
      conditions: [
        {
          type: 'from',
          operator: 'contains',
          value: 'manager@company.com',
        },
      ],
      actions: [
        {
          type: 'addLabel',
          params: { labelId: 'IMPORTANT' },
        },
      ],
    });

    // Rule 4: Create tasks from deadline emails
    this.addRule({
      id: 'deadline-to-task',
      name: 'Create tasks from emails with deadlines',
      description: 'Convert emails containing deadline to tasks',
      enabled: true,
      priority: 80,
      conditions: [
        {
          type: 'body',
          operator: 'matches',
          value: 'deadline|due|by \\w+day',
        },
      ],
      actions: [
        {
          type: 'createTask',
          params: { extractDates: true },
        },
      ],
    });

    // Rule 5: Archive old read emails
    this.addRule({
      id: 'archive-old-read',
      name: 'Archive old read emails',
      description: 'Archive emails older than 30 days that have been read',
      enabled: false, // Disabled by default
      priority: 5,
      conditions: [
        {
          type: 'age',
          operator: 'greaterThan',
          value: 30,
        },
        {
          type: 'label',
          operator: 'contains',
          value: 'UNREAD',
        },
      ],
      actions: [
        { type: 'archive' },
      ],
    });
  }

  /**
   * Export rules to JSON
   */
  exportRules(): string {
    return JSON.stringify(Array.from(this.rules.values()), null, 2);
  }

  /**
   * Import rules from JSON
   */
  importRules(json: string): void {
    try {
      const rules = JSON.parse(json) as ProcessingRule[];
      rules.forEach(rule => this.addRule(rule));
    } catch (error) {
      throw new Error(`Failed to import rules: ${error}`);
    }
  }
}
