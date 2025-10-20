/**
 * Todoist Integration Types
 *
 * Type definitions for Todoist API integration and bidirectional sync
 */

export interface TodoistTask {
  id: string;
  content: string;
  description: string;
  project_id: string;
  section_id?: string;
  parent_id?: string;
  order: number;
  labels: string[];
  priority: number; // 1-4 (4 is highest)
  due?: {
    date: string; // YYYY-MM-DD
    datetime?: string; // RFC3339 format
    string?: string; // Human readable
    timezone?: string;
    is_recurring?: boolean;
  };
  url: string;
  comment_count: number;
  created_at: string;
  updated_at?: string; // Added for conflict detection
  creator_id: string;
  assignee_id?: string;
  assigner_id?: string;
  is_completed: boolean;
  completed_at?: string;
  duration?: {
    amount: number;
    unit: 'minute' | 'day';
  };
}

export interface TodoistProject {
  id: string;
  name: string;
  color: string;
  parent_id?: string;
  order: number;
  comment_count: number;
  is_shared: boolean;
  is_favorite: boolean;
  is_inbox_project: boolean;
  is_team_inbox: boolean;
  view_style: 'list' | 'board';
  url: string;
}

export interface TodoistLabel {
  id: string;
  name: string;
  color: string;
  order: number;
  is_favorite: boolean;
}

export interface TodoistComment {
  id: string;
  task_id: string;
  project_id?: string;
  posted_at: string;
  content: string;
  attachment?: {
    file_name: string;
    file_type: string;
    file_url: string;
    resource_type: string;
  };
}

export interface TodoistSyncState {
  lastSyncTimestamp: string;
  syncToken?: string;
  taskIdMapping: Record<string, string>; // localId -> todoistId
  projectIdMapping: Record<string, string>;
  labelIdMapping: Record<string, string>;
  pendingChanges: {
    created: string[];
    updated: string[];
    deleted: string[];
  };
}

export interface SyncConfig {
  apiToken: string;
  syncInterval: number; // minutes
  autoSync: boolean;
  conflictResolution: ConflictResolutionStrategy;
  defaultProject?: string;
  syncLabels: boolean;
  syncComments: boolean;
  offline: boolean;
}

export type ConflictResolutionStrategy =
  | 'local-wins'
  | 'remote-wins'
  | 'most-recent'
  | 'manual';

export interface SyncConflict {
  taskId: string;
  localTask: any;
  remoteTask: TodoistTask;
  localModified: string;
  remoteModified: string;
  conflictType: 'content' | 'status' | 'priority' | 'due_date' | 'labels';
  resolution?: ConflictResolutionStrategy;
}

export interface SyncResult {
  success: boolean;
  timestamp: string;
  stats: {
    created: number;
    updated: number;
    deleted: number;
    conflicts: number;
  };
  conflicts?: SyncConflict[];
  errors?: Array<{
    operation: string;
    taskId?: string;
    error: string;
  }>;
}

export interface TodoistApiError {
  error: string;
  error_code?: number;
  error_tag?: string;
  http_code: number;
}

export interface TodoistSyncResponse {
  sync_token: string;
  full_sync: boolean;
  items: TodoistTask[];
  projects: TodoistProject[];
  labels: TodoistLabel[];
  temp_id_mapping?: Record<string, string>;
}

export interface TodoistCommand {
  type: 'item_add' | 'item_update' | 'item_delete' | 'item_complete' | 'item_uncomplete';
  uuid: string;
  args: any;
  temp_id?: string;
}

export interface RateLimitState {
  remaining: number;
  reset: number; // timestamp
  limit: number;
}
