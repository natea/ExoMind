/**
 * Gmail Integration Types
 * TypeScript interfaces for Gmail integration via Google Workspace MCP
 */

export interface EmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  date: Date;
  body: string;
  bodyHtml?: string;
  snippet: string;
  labels: string[];
  attachments: EmailAttachment[];
  inReplyTo?: string;
  references?: string[];
}

export interface EmailAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  data?: string;
}

export interface EmailTask {
  title: string;
  description: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  project?: string;
  context?: string;
  tags: string[];
  sourceEmail: {
    messageId: string;
    threadId: string;
    subject: string;
    from: string;
    date: Date;
  };
}

export interface ProcessingRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
}

export interface RuleCondition {
  type: 'from' | 'to' | 'subject' | 'body' | 'hasAttachment' | 'label' | 'age';
  operator: 'contains' | 'equals' | 'matches' | 'greaterThan' | 'lessThan';
  value: string | number;
  caseSensitive?: boolean;
}

export interface RuleAction {
  type: 'createTask' | 'addLabel' | 'archive' | 'markRead' | 'forward' | 'delete';
  params?: Record<string, any>;
}

export interface EmailFilter {
  query?: string;
  from?: string;
  to?: string;
  subject?: string;
  hasAttachment?: boolean;
  labels?: string[];
  after?: Date;
  before?: Date;
  isUnread?: boolean;
  maxResults?: number;
}

export interface EmailSearchResult {
  messages: EmailMessage[];
  totalCount: number;
  nextPageToken?: string;
}

export interface EmailProcessingResult {
  processed: number;
  tasksCreated: number;
  errors: EmailProcessingError[];
  summary: string;
}

export interface EmailProcessingError {
  messageId: string;
  error: string;
  timestamp: Date;
}

export interface EmailToTaskOptions {
  autoArchive?: boolean;
  addLabel?: string;
  extractDates?: boolean;
  extractPriority?: boolean;
  defaultProject?: string;
  defaultContext?: string;
}

export interface EmailThread {
  threadId: string;
  messages: EmailMessage[];
  subject: string;
  participants: string[];
  labels: string[];
  firstMessageDate: Date;
  lastMessageDate: Date;
  messageCount: number;
}

export interface GmailClientConfig {
  userGoogleEmail: string;
  batchSize?: number;
  defaultLabels?: string[];
  autoSync?: boolean;
}
