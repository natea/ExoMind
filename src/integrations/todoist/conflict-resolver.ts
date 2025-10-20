/**
 * Todoist Conflict Resolver
 *
 * Handles conflicts during bidirectional sync between Life OS and Todoist
 */

import {
  SyncConflict,
  ConflictResolutionStrategy,
  TodoistTask
} from '../../types/todoist';
import { LifeOSTask, TodoistMapper } from './mapper';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface ConflictResolutionResult {
  resolvedTask: LifeOSTask;
  strategy: ConflictResolutionStrategy;
  timestamp: string;
}

export class ConflictResolver {
  private mapper: TodoistMapper;
  private conflictLog: SyncConflict[] = [];
  private logPath: string;

  constructor(
    private defaultStrategy: ConflictResolutionStrategy = 'most-recent',
    logDirectory: string = '.swarm/sync'
  ) {
    this.mapper = new TodoistMapper();
    this.logPath = path.join(logDirectory, 'conflicts.json');
  }

  /**
   * Resolve a sync conflict between local and remote tasks
   */
  async resolveConflict(
    localTask: LifeOSTask,
    remoteTask: TodoistTask,
    strategy?: ConflictResolutionStrategy
  ): Promise<ConflictResolutionResult> {
    const resolveStrategy = strategy || this.defaultStrategy;

    // Detect conflict type
    const conflictTypes = this.detectConflictTypes(localTask, remoteTask);

    // Create conflict record
    const conflict: SyncConflict = {
      taskId: localTask.id,
      localTask,
      remoteTask,
      localModified: localTask.updatedAt,
      remoteModified: remoteTask.created_at, // Todoist doesn't provide updated_at
      conflictType: conflictTypes[0] || 'content',
      resolution: resolveStrategy
    };

    // Log the conflict
    await this.logConflict(conflict);

    // Resolve based on strategy
    let resolvedTask: LifeOSTask;

    switch (resolveStrategy) {
      case 'local-wins':
        resolvedTask = this.resolveLocalWins(localTask, remoteTask);
        break;

      case 'remote-wins':
        resolvedTask = this.resolveRemoteWins(localTask, remoteTask);
        break;

      case 'most-recent':
        resolvedTask = this.resolveMostRecent(localTask, remoteTask);
        break;

      case 'manual':
        resolvedTask = await this.resolveManual(localTask, remoteTask);
        break;

      default:
        resolvedTask = this.resolveMostRecent(localTask, remoteTask);
    }

    return {
      resolvedTask,
      strategy: resolveStrategy,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Detect types of conflicts between tasks
   */
  private detectConflictTypes(
    localTask: LifeOSTask,
    remoteTask: TodoistTask
  ): SyncConflict['conflictType'][] {
    const conflicts: SyncConflict['conflictType'][] = [];
    const remoteAsLocal = this.mapper.fromTodoistTask(remoteTask, localTask.id);

    if (localTask.title !== remoteAsLocal.title ||
        localTask.description !== remoteAsLocal.description) {
      conflicts.push('content');
    }

    if (localTask.status !== remoteAsLocal.status) {
      conflicts.push('status');
    }

    if (localTask.priority !== remoteAsLocal.priority) {
      conflicts.push('priority');
    }

    if (localTask.dueDate !== remoteAsLocal.dueDate) {
      conflicts.push('due_date');
    }

    const localLabels = [...(localTask.context || []), ...(localTask.tags || [])].sort().join(',');
    const remoteLabels = [...(remoteAsLocal.context || []), ...(remoteAsLocal.tags || [])].sort().join(',');
    if (localLabels !== remoteLabels) {
      conflicts.push('labels');
    }

    return conflicts;
  }

  /**
   * Resolve conflict by keeping local changes
   */
  private resolveLocalWins(
    localTask: LifeOSTask,
    remoteTask: TodoistTask
  ): LifeOSTask {
    console.log(`Conflict resolved: Local wins for task ${localTask.id}`);
    return { ...localTask };
  }

  /**
   * Resolve conflict by keeping remote changes
   */
  private resolveRemoteWins(
    localTask: LifeOSTask,
    remoteTask: TodoistTask
  ): LifeOSTask {
    console.log(`Conflict resolved: Remote wins for task ${localTask.id}`);
    return this.mapper.fromTodoistTask(remoteTask, localTask.id);
  }

  /**
   * Resolve conflict by using most recent changes
   */
  private resolveMostRecent(
    localTask: LifeOSTask,
    remoteTask: TodoistTask
  ): LifeOSTask {
    const localTime = new Date(localTask.updatedAt).getTime();
    const remoteTime = new Date(remoteTask.created_at).getTime();

    if (localTime > remoteTime) {
      console.log(`Conflict resolved: Local is more recent for task ${localTask.id}`);
      return { ...localTask };
    } else {
      console.log(`Conflict resolved: Remote is more recent for task ${localTask.id}`);
      return this.mapper.fromTodoistTask(remoteTask, localTask.id);
    }
  }

  /**
   * Resolve conflict manually (prompts user)
   */
  private async resolveManual(
    localTask: LifeOSTask,
    remoteTask: TodoistTask
  ): Promise<LifeOSTask> {
    console.log('\n=== CONFLICT DETECTED ===');
    console.log(`Task ID: ${localTask.id}`);
    console.log('\nLocal version:');
    console.log(JSON.stringify(localTask, null, 2));
    console.log('\nRemote version:');
    console.log(JSON.stringify(remoteTask, null, 2));

    // In a real implementation, this would prompt the user
    // For now, default to most recent
    console.log('\nAuto-resolving with most-recent strategy...');
    return this.resolveMostRecent(localTask, remoteTask);
  }

  /**
   * Resolve conflicts with smart merging
   */
  async resolveSmart(
    localTask: LifeOSTask,
    remoteTask: TodoistTask
  ): Promise<LifeOSTask> {
    const remoteAsLocal = this.mapper.fromTodoistTask(remoteTask, localTask.id);
    const mergedTask = { ...localTask };

    // Smart merge rules:
    // 1. Status: Prefer 'done' over 'in-progress' over 'todo'
    const statusPriority = ['done', 'in-progress', 'todo', 'cancelled'];
    const localStatusPriority = statusPriority.indexOf(localTask.status);
    const remoteStatusPriority = statusPriority.indexOf(remoteAsLocal.status);

    if (remoteStatusPriority < localStatusPriority) {
      mergedTask.status = remoteAsLocal.status;
      if (remoteAsLocal.completedAt) {
        mergedTask.completedAt = remoteAsLocal.completedAt;
      }
    }

    // 2. Priority: Use higher priority
    const priorityValues = { low: 1, medium: 2, high: 3, urgent: 4 };
    if (priorityValues[remoteAsLocal.priority] > priorityValues[localTask.priority]) {
      mergedTask.priority = remoteAsLocal.priority;
    }

    // 3. Due date: Use earlier due date if both exist
    if (localTask.dueDate && remoteAsLocal.dueDate) {
      const localDue = new Date(localTask.dueDate).getTime();
      const remoteDue = new Date(remoteAsLocal.dueDate).getTime();
      mergedTask.dueDate = localDue < remoteDue ? localTask.dueDate : remoteAsLocal.dueDate;
    } else if (remoteAsLocal.dueDate) {
      mergedTask.dueDate = remoteAsLocal.dueDate;
    }

    // 4. Labels: Merge unique labels
    const localLabels = new Set([...(localTask.context || []), ...(localTask.tags || [])]);
    const remoteLabels = [...(remoteAsLocal.context || []), ...(remoteAsLocal.tags || [])];
    remoteLabels.forEach(label => localLabels.add(label));

    // Split back into context and tags
    const allLabels = Array.from(localLabels);
    mergedTask.context = allLabels.filter(l => localTask.context?.includes(l));
    mergedTask.tags = allLabels.filter(l => localTask.tags?.includes(l));

    // 5. Content: Use most recent
    const localTime = new Date(localTask.updatedAt).getTime();
    const remoteTime = new Date(remoteTask.created_at).getTime();

    if (remoteTime > localTime) {
      mergedTask.title = remoteAsLocal.title;
      mergedTask.description = remoteAsLocal.description;
    }

    mergedTask.updatedAt = new Date().toISOString();

    console.log(`Conflict resolved: Smart merge for task ${localTask.id}`);
    return mergedTask;
  }

  /**
   * Log conflict to file
   */
  private async logConflict(conflict: SyncConflict): Promise<void> {
    this.conflictLog.push(conflict);

    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(this.logPath), { recursive: true });

      // Read existing conflicts
      let existingConflicts: SyncConflict[] = [];
      try {
        const data = await fs.readFile(this.logPath, 'utf-8');
        existingConflicts = JSON.parse(data);
      } catch {
        // File doesn't exist yet
      }

      // Append new conflict
      existingConflicts.push(conflict);

      // Write back to file
      await fs.writeFile(
        this.logPath,
        JSON.stringify(existingConflicts, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Failed to log conflict:', error);
    }
  }

  /**
   * Get all logged conflicts
   */
  async getConflictLog(): Promise<SyncConflict[]> {
    try {
      const data = await fs.readFile(this.logPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Clear conflict log
   */
  async clearConflictLog(): Promise<void> {
    this.conflictLog = [];
    try {
      await fs.unlink(this.logPath);
    } catch {
      // File doesn't exist
    }
  }

  /**
   * Get conflicts for a specific task
   */
  async getTaskConflicts(taskId: string): Promise<SyncConflict[]> {
    const allConflicts = await this.getConflictLog();
    return allConflicts.filter(c => c.taskId === taskId);
  }

  /**
   * Get unresolved conflicts
   */
  async getUnresolvedConflicts(): Promise<SyncConflict[]> {
    const allConflicts = await this.getConflictLog();
    return allConflicts.filter(c => !c.resolution || c.resolution === 'manual');
  }

  /**
   * Batch resolve multiple conflicts
   */
  async batchResolve(
    conflicts: Array<{
      localTask: LifeOSTask;
      remoteTask: TodoistTask;
    }>,
    strategy: ConflictResolutionStrategy
  ): Promise<ConflictResolutionResult[]> {
    const results: ConflictResolutionResult[] = [];

    for (const { localTask, remoteTask } of conflicts) {
      const result = await this.resolveConflict(localTask, remoteTask, strategy);
      results.push(result);
    }

    return results;
  }
}
