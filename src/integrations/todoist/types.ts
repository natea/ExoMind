/**
 * Todoist Integration Type Definitions
 *
 * Complete type definitions for Todoist API and synchronization
 */

export interface TodoistTask {
  id: string;
  content: string;
  description?: string;
  project_id?: string;
  section_id?: string;
  parent_id?: string;
  order?: number;
  labels: string[];
  priority: number; // 1-4 (4 is highest)
  due?: {
    date: string; // YYYY-MM-DD
    datetime?: string; // RFC3339 format
    string?: string; // Human readable
    timezone?: string;
    is_recurring?: boolean;
  };
  due_date?: string; // YYYY-MM-DD format (for mapper compatibility)
  due_datetime?: string; // ISO format (for mapper compatibility)
  url?: string;
  comment_count?: number;
  created_at: string;
  updated_at?: string;
  creator_id?: string;
  assignee_id?: string;
  assigner_id?: string;
  is_completed?: boolean;
  completed_at?: string;
  duration?: {
    amount: number;
    unit: 'minute' | 'day';
  };
}

export interface TodoistProject {
  id: string;
  name: string;
  color?: string;
  parent_id?: string | null;
  order: number;
  comment_count?: number;
  is_shared?: boolean;
  is_favorite: boolean;
  is_inbox_project?: boolean;
  is_team_inbox?: boolean;
  view_style?: 'list' | 'board';
  url?: string;
}

export interface TodoistLabel {
  id: string;
  name: string;
  color?: string;
  order: number;
  is_favorite: boolean;
}

export interface SyncConflict {
  taskId: string;
  remoteId: string;
  type: 'concurrent_modification' | 'deletion_conflict';
  detectedAt: Date;
  localData: any;
  remoteData: any;
  conflictingFields?: string[];
}

export type ResolutionStrategy =
  | 'local-wins'
  | 'remote-wins'
  | 'latest-timestamp'
  | 'field-level-merge'
  | 'manual'
  | 'custom-rules';

export interface SyncConfig {
  apiToken: string;
  syncInterval?: number;
  autoSync?: boolean;
  conflictResolution?: ResolutionStrategy;
  defaultProject?: string;
}

export interface MapperOptions {
  projectMapping?: Record<string, string>;
  restoreContextFormat?: boolean;
  customFields?: Record<string, (task: any) => any>;
}

export interface ConflictResolverOptions {
  rules?: {
    priority?: 'always-higher' | 'always-lower';
    dueDate?: 'always-earlier' | 'always-later';
    [key: string]: any;
  };
}
