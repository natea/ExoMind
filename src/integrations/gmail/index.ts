/**
 * Gmail Integration Module
 * Export all Gmail integration components
 */

export { GmailClient } from './client';
export { EmailParser } from './email-parser';
export { EmailToTaskConverter } from './email-to-task';
export { EmailRulesEngine } from './rules';

export type {
  ParsedEmail,
  ActionItem,
  ExtractedDate,
  MeetingInvite,
} from './email-parser';

export type {
  RuleExecutionResult,
  ActionResult,
} from './rules';
