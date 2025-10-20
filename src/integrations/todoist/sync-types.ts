/**
 * Sync-specific type definitions for Todoist integration
 */

import { Task } from '../../types/task';
import { TodoistTask } from './types';

export interface SyncConflict {
  taskId: string;
  remoteId: string;
  type: 'concurrent_modification' | 'deletion_conflict';
  detectedAt: Date;
  localData: Task;
  remoteData: TodoistTask | null;
  conflictingFields?: string[];
}

export type ResolutionStrategy =
  | 'local-wins'
  | 'remote-wins'
  | 'latest-timestamp'
  | 'field-level-merge'
  | 'manual'
  | 'custom-rules';
