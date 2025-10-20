/**
 * ConflictResolver - Handles synchronization conflicts between local and remote tasks
 */

import { Task } from '../../types/task';
import { TodoistTask, SyncConflict, ResolutionStrategy, ConflictResolverOptions } from './types';
import { TodoistMapper } from './TodoistMapper';

interface ConflictHistory {
  taskId: string;
  strategy: ResolutionStrategy;
  timestamp: Date;
}

export class ConflictResolver {
  private mapper: TodoistMapper;
  private options: ConflictResolverOptions;
  private history: ConflictHistory[] = [];

  constructor(options: ConflictResolverOptions = {}) {
    this.mapper = new TodoistMapper();
    this.options = options;
  }

  /**
   * Detect if there's a conflict between local and remote task
   */
  detectConflict(local: Task, remote: TodoistTask | null): SyncConflict | null {
    // Check for deletion conflict
    if (!remote && local.syncState?.dirty) {
      return {
        taskId: local.id,
        remoteId: local.syncState.remoteId || '',
        type: 'deletion_conflict',
        detectedAt: new Date(),
        localData: local,
        remoteData: null,
        conflictingFields: [],
      };
    }

    // No remote task means it was deleted or never existed
    if (!remote) {
      return null;
    }

    // If local is not dirty, no conflict
    if (!local.syncState?.dirty) {
      return null;
    }

    // Convert remote to local format for comparison
    const remoteAsLocal = this.mapper.fromTodoist(remote);

    // Detect conflicting fields
    const conflictingFields: string[] = [];

    if (local.title !== remoteAsLocal.title) {
      conflictingFields.push('title');
    }

    if (local.description !== remoteAsLocal.description) {
      conflictingFields.push('description');
    }

    if (local.priority !== remoteAsLocal.priority) {
      conflictingFields.push('priority');
    }

    if (local.status !== remoteAsLocal.status) {
      conflictingFields.push('status');
    }

    // Compare tags
    const localTags = (local.tags || []).sort().join(',');
    const remoteTags = (remoteAsLocal.tags || []).sort().join(',');
    if (localTags !== remoteTags) {
      conflictingFields.push('tags');
    }

    // Compare due dates
    const localDue = local.dueDate?.getTime() || 0;
    const remoteDue = remoteAsLocal.dueDate?.getTime() || 0;
    if (localDue !== remoteDue) {
      conflictingFields.push('dueDate');
    }

    // If no fields conflict, return null
    if (conflictingFields.length === 0) {
      return null;
    }

    return {
      taskId: local.id,
      remoteId: remote.id,
      type: 'concurrent_modification',
      detectedAt: new Date(),
      localData: local,
      remoteData: remote,
      conflictingFields,
    };
  }

  /**
   * Resolve conflict using specified strategy
   */
  resolve(
    conflict: SyncConflict,
    strategy: ResolutionStrategy,
    manualResolver?: (conflict: SyncConflict) => Task
  ): Task {
    // Record in history
    this.history.push({
      taskId: conflict.taskId,
      strategy,
      timestamp: new Date(),
    });

    switch (strategy) {
      case 'local-wins':
        return this.resolveLocalWins(conflict);

      case 'remote-wins':
        return this.resolveRemoteWins(conflict);

      case 'latest-timestamp':
        return this.resolveLatestTimestamp(conflict);

      case 'field-level-merge':
        return this.resolveFieldLevelMerge(conflict);

      case 'custom-rules':
        return this.resolveCustomRules(conflict);

      case 'manual':
        if (!manualResolver) {
          throw new Error('Manual resolver function is required for manual strategy');
        }
        return manualResolver(conflict);

      default:
        // Default to latest timestamp
        return this.resolveLatestTimestamp(conflict);
    }
  }

  /**
   * Get resolution suggestions for a conflict
   */
  getSuggestions(_conflict: SyncConflict): string[] {
    const suggestions: string[] = [];

    // Always suggest basic strategies
    suggestions.push('local-wins', 'remote-wins', 'latest-timestamp', 'field-level-merge');

    // Suggest custom rules if configured
    if (this.options.rules) {
      suggestions.push('custom-rules');
    }

    return suggestions;
  }

  /**
   * Resolve by keeping local version
   */
  private resolveLocalWins(conflict: SyncConflict): Task {
    const local = conflict.localData as Task;
    return { ...local };
  }

  /**
   * Resolve by keeping remote version
   */
  private resolveRemoteWins(conflict: SyncConflict): Task {
    if (conflict.type === 'deletion_conflict' && !conflict.remoteData) {
      // Remote was deleted
      const local = conflict.localData as Task;
      return { ...local, status: 'deleted' };
    }

    const remote = conflict.remoteData as TodoistTask;
    return this.mapper.fromTodoist(remote);
  }

  /**
   * Resolve by using latest timestamp
   */
  private resolveLatestTimestamp(conflict: SyncConflict): Task {
    const local = conflict.localData as Task;

    if (conflict.type === 'deletion_conflict') {
      return conflict.remoteData ? this.resolveRemoteWins(conflict) : { ...local, status: 'deleted' };
    }

    const remote = conflict.remoteData as TodoistTask;
    const localTime = new Date(local.updatedAt).getTime();
    const remoteTime = new Date(remote.created_at).getTime();

    return localTime > remoteTime ? this.resolveLocalWins(conflict) : this.resolveRemoteWins(conflict);
  }

  /**
   * Resolve by merging non-conflicting fields
   */
  private resolveFieldLevelMerge(conflict: SyncConflict): Task {
    const local = conflict.localData as Task;

    if (conflict.type === 'deletion_conflict') {
      return conflict.remoteData ? this.resolveRemoteWins(conflict) : { ...local, status: 'deleted' };
    }

    const remote = conflict.remoteData as TodoistTask;
    const remoteAsLocal = this.mapper.fromTodoist(remote);

    const merged: Task = { ...local };

    // For each conflicting field, use the latest
    const localTime = new Date(local.updatedAt).getTime();
    const remoteTime = new Date(remote.created_at).getTime();
    const useLocal = localTime >= remoteTime;

    if (conflict.conflictingFields?.includes('title')) {
      merged.title = useLocal ? local.title : remoteAsLocal.title;
    }

    if (conflict.conflictingFields?.includes('description')) {
      merged.description = useLocal ? local.description : remoteAsLocal.description;
    }

    if (conflict.conflictingFields?.includes('priority')) {
      merged.priority = useLocal ? local.priority : remoteAsLocal.priority;
    }

    if (conflict.conflictingFields?.includes('status')) {
      merged.status = useLocal ? local.status : remoteAsLocal.status;
    }

    if (conflict.conflictingFields?.includes('dueDate')) {
      merged.dueDate = useLocal ? local.dueDate : remoteAsLocal.dueDate;
    }

    // Merge tags (combine unique tags from both)
    if (conflict.conflictingFields?.includes('tags')) {
      const allTags = [...(local.tags || []), ...(remoteAsLocal.tags || [])];
      merged.tags = Array.from(new Set(allTags));
    }

    return merged;
  }

  /**
   * Resolve using custom rules
   */
  private resolveCustomRules(conflict: SyncConflict): Task {
    const local = conflict.localData as Task;

    if (conflict.type === 'deletion_conflict') {
      return conflict.remoteData ? this.resolveRemoteWins(conflict) : { ...local, status: 'deleted' };
    }

    const remote = conflict.remoteData as TodoistTask;
    const remoteAsLocal = this.mapper.fromTodoist(remote);

    const merged: Task = { ...local };

    // Apply custom rules if configured
    if (this.options.rules) {
      // Priority rule
      if (this.options.rules.priority === 'always-higher' && conflict.conflictingFields?.includes('priority')) {
        merged.priority = Math.max(local.priority || 1, remoteAsLocal.priority || 1) as Task['priority'];
      } else if (this.options.rules.priority === 'always-lower' && conflict.conflictingFields?.includes('priority')) {
        merged.priority = Math.min(local.priority || 1, remoteAsLocal.priority || 1) as Task['priority'];
      }

      // Due date rule
      if (this.options.rules.dueDate === 'always-earlier' && conflict.conflictingFields?.includes('dueDate')) {
        if (local.dueDate && remoteAsLocal.dueDate) {
          merged.dueDate = local.dueDate < remoteAsLocal.dueDate ? local.dueDate : remoteAsLocal.dueDate;
        } else {
          merged.dueDate = local.dueDate || remoteAsLocal.dueDate;
        }
      } else if (this.options.rules.dueDate === 'always-later' && conflict.conflictingFields?.includes('dueDate')) {
        if (local.dueDate && remoteAsLocal.dueDate) {
          merged.dueDate = local.dueDate > remoteAsLocal.dueDate ? local.dueDate : remoteAsLocal.dueDate;
        } else {
          merged.dueDate = local.dueDate || remoteAsLocal.dueDate;
        }
      }
    }

    return merged;
  }

  /**
   * Get conflict resolution history for a task
   */
  getHistory(taskId: string): ConflictHistory[] {
    return this.history.filter(h => h.taskId === taskId);
  }

  /**
   * Replay multiple conflict resolutions
   */
  replayResolutions(conflicts: SyncConflict[], strategy: ResolutionStrategy): Task[] {
    return conflicts.map(conflict => this.resolve(conflict, strategy));
  }

  /**
   * Resolve multiple conflicts in batch
   */
  resolveBatch(conflicts: SyncConflict[], strategy: ResolutionStrategy): Task[] {
    return conflicts.map(conflict => this.resolve(conflict, strategy));
  }

  /**
   * Log conflict details
   */
  logConflict(conflict: SyncConflict): string {
    const lines = [
      `Conflict detected for task: ${conflict.taskId}`,
      `Remote ID: ${conflict.remoteId}`,
      `Type: ${conflict.type}`,
      `Detected at: ${conflict.detectedAt.toISOString()}`,
    ];

    if (conflict.conflictingFields && conflict.conflictingFields.length > 0) {
      lines.push(`Conflicting fields: ${conflict.conflictingFields.join(', ')}`);
    }

    return lines.join('\n');
  }

  /**
   * Three-way merge for text fields
   */
  threeWayMerge(base: string, local: string, remote: string): string {
    // Simple implementation: if both changed the same line, throw conflict
    if (base === local) {
      return remote;
    }
    if (base === remote) {
      return local;
    }
    if (local === remote) {
      return local;
    }

    // Both changed - check if changes conflict
    const baseLines = base.split('\n');
    const localLines = local.split('\n');
    const remoteLines = remote.split('\n');

    // If line counts match and only one line differs, merge
    if (baseLines.length === localLines.length && baseLines.length === remoteLines.length) {
      const merged: string[] = [];
      for (let i = 0; i < baseLines.length; i++) {
        if (localLines[i] === remoteLines[i]) {
          merged.push(localLines[i]);
        } else if (baseLines[i] === localLines[i]) {
          merged.push(remoteLines[i]);
        } else if (baseLines[i] === remoteLines[i]) {
          merged.push(localLines[i]);
        } else {
          throw new Error('Merge conflict: both sides modified the same line');
        }
      }
      return merged.join('\n');
    }

    // Complex merge needed
    throw new Error('Merge conflict: complex changes detected');
  }
}
