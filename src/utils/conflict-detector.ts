/**
 * Conflict Detection Utilities
 *
 * Detects synchronization conflicts between local and remote task data.
 * Analyzes timestamps, content changes, and generates detailed conflict reports.
 */

import { Task } from '../types/task';
import { TodoistTask } from '../types/todoist';

export enum ConflictType {
  TITLE = 'TITLE',
  DUE_DATE = 'DUE_DATE',
  STATUS = 'STATUS',
  PRIORITY = 'PRIORITY',
  PROJECT = 'PROJECT',
  CONTENT = 'CONTENT',
  LABELS = 'LABELS',
  PARENT = 'PARENT',
  SECTION = 'SECTION'
}

export enum ConflictSeverity {
  LOW = 'LOW',       // Safe to auto-merge
  MEDIUM = 'MEDIUM', // Suggest resolution
  HIGH = 'HIGH'      // User decision required
}

export interface ConflictField {
  field: string;
  localValue: any;
  remoteValue: any;
  conflictType: ConflictType;
  severity: ConflictSeverity;
  reason: string;
}

export interface TaskConflict {
  taskId: string;
  localTask: Task;
  remoteTask: TodoistTask;
  lastSyncedAt?: Date;
  conflicts: ConflictField[];
  overallSeverity: ConflictSeverity;
  autoMergeable: boolean;
  suggestedStrategy?: 'local' | 'remote' | 'merge' | 'manual';
}

export interface ConflictReport {
  totalConflicts: number;
  conflictsBySeverity: {
    low: number;
    medium: number;
    high: number;
  };
  conflictsByType: Record<ConflictType, number>;
  conflicts: TaskConflict[];
  autoMergeableCount: number;
  requiresUserDecision: number;
}

/**
 * Compare timestamps to determine if both local and remote have been modified
 */
export function hasBothBeenModified(
  localTask: Task,
  remoteTask: TodoistTask,
  lastSyncedAt?: Date
): boolean {
  if (!lastSyncedAt) {
    // No sync history - check if both have recent modifications
    return true;
  }

  const localModified = new Date(localTask.updatedAt || localTask.createdAt);
  const remoteModified = new Date(remoteTask.updated_at || remoteTask.created_at);

  const localModifiedAfterSync = localModified > lastSyncedAt;
  const remoteModifiedAfterSync = remoteModified > lastSyncedAt;

  return localModifiedAfterSync && remoteModifiedAfterSync;
}

/**
 * Detect conflicts between local and remote task
 */
export function detectTaskConflicts(
  localTask: Task,
  remoteTask: TodoistTask,
  lastSyncedAt?: Date
): TaskConflict | null {
  // First check if both have been modified since last sync
  if (!hasBothBeenModified(localTask, remoteTask, lastSyncedAt)) {
    return null; // No conflict - only one side modified
  }

  const conflicts: ConflictField[] = [];

  // Check title conflict
  if (localTask.title !== remoteTask.content) {
    conflicts.push({
      field: 'title',
      localValue: localTask.title,
      remoteValue: remoteTask.content,
      conflictType: ConflictType.TITLE,
      severity: determineTitleSeverity(localTask.title, remoteTask.content),
      reason: 'Title modified in both local and remote'
    });
  }

  // Check due date conflict
  const localDue = localTask.dueDate?.toISOString().split('T')[0];
  const remoteDue = remoteTask.due?.date;
  if (localDue !== remoteDue) {
    conflicts.push({
      field: 'due_date',
      localValue: localDue,
      remoteValue: remoteDue,
      conflictType: ConflictType.DUE_DATE,
      severity: determineDateSeverity(localDue, remoteDue),
      reason: 'Due date changed in both local and remote'
    });
  }

  // Check status conflict (critical!)
  const localIsCompleted = localTask.status === 'done';
  if (localIsCompleted !== remoteTask.is_completed) {
    conflicts.push({
      field: 'status',
      localValue: localIsCompleted,
      remoteValue: remoteTask.is_completed,
      conflictType: ConflictType.STATUS,
      severity: ConflictSeverity.HIGH,
      reason: 'Status changed in both local and remote - completion state differs'
    });
  }

  // Check priority conflict
  if (localTask.priority !== remoteTask.priority) {
    conflicts.push({
      field: 'priority',
      localValue: localTask.priority,
      remoteValue: remoteTask.priority,
      conflictType: ConflictType.PRIORITY,
      severity: ConflictSeverity.LOW,
      reason: 'Priority adjusted differently'
    });
  }

  // Check project conflict
  if (localTask.project !== remoteTask.project_id) {
    conflicts.push({
      field: 'project',
      localValue: localTask.project,
      remoteValue: remoteTask.project_id,
      conflictType: ConflictType.PROJECT,
      severity: ConflictSeverity.MEDIUM,
      reason: 'Task moved to different project in local and remote'
    });
  }

  // Check description/content conflict
  if (localTask.description !== remoteTask.description) {
    conflicts.push({
      field: 'description',
      localValue: localTask.description,
      remoteValue: remoteTask.description,
      conflictType: ConflictType.CONTENT,
      severity: ConflictSeverity.HIGH,
      reason: 'Task content diverged between local and remote'
    });
  }

  // Check labels conflict
  const localLabels = new Set(localTask.tags || []);
  const remoteLabels = new Set(remoteTask.labels || []);
  const labelsMatch =
    localLabels.size === remoteLabels.size &&
    [...localLabels].every(label => remoteLabels.has(label as string));

  if (!labelsMatch) {
    conflicts.push({
      field: 'labels',
      localValue: Array.from(localLabels),
      remoteValue: Array.from(remoteLabels),
      conflictType: ConflictType.LABELS,
      severity: ConflictSeverity.LOW,
      reason: 'Labels modified differently'
    });
  }

  // Check parent task conflict
  const localParentId = localTask.metadata?.todoist?.parent_id;
  if (localParentId !== remoteTask.parent_id) {
    conflicts.push({
      field: 'parent',
      localValue: localParentId,
      remoteValue: remoteTask.parent_id,
      conflictType: ConflictType.PARENT,
      severity: ConflictSeverity.MEDIUM,
      reason: 'Task hierarchy changed differently'
    });
  }

  // Check section conflict
  const localSectionId = localTask.metadata?.todoist?.section_id;
  if (localSectionId !== remoteTask.section_id) {
    conflicts.push({
      field: 'section',
      localValue: localSectionId,
      remoteValue: remoteTask.section_id,
      conflictType: ConflictType.SECTION,
      severity: ConflictSeverity.LOW,
      reason: 'Task moved to different section'
    });
  }

  if (conflicts.length === 0) {
    return null; // No conflicts detected
  }

  // Determine overall severity
  const overallSeverity = determineOverallSeverity(conflicts);
  const autoMergeable = isAutoMergeable(conflicts);
  const suggestedStrategy = suggestResolutionStrategy(conflicts, localTask, remoteTask);

  return {
    taskId: localTask.id,
    localTask,
    remoteTask,
    lastSyncedAt,
    conflicts,
    overallSeverity,
    autoMergeable,
    suggestedStrategy
  };
}

/**
 * Determine severity of title conflict
 */
function determineTitleSeverity(localTitle: string, remoteTitle: string): ConflictSeverity {
  // If one is substring of other, it's a low severity conflict
  if (localTitle.includes(remoteTitle) || remoteTitle.includes(localTitle)) {
    return ConflictSeverity.LOW;
  }

  // Calculate similarity (simple approach)
  const similarity = calculateStringSimilarity(localTitle, remoteTitle);
  if (similarity > 0.7) {
    return ConflictSeverity.MEDIUM;
  }

  return ConflictSeverity.HIGH;
}

/**
 * Determine severity of date conflict
 */
function determineDateSeverity(localDate?: string, remoteDate?: string): ConflictSeverity {
  if (!localDate || !remoteDate) {
    return ConflictSeverity.MEDIUM;
  }

  const local = new Date(localDate);
  const remote = new Date(remoteDate);
  const diffDays = Math.abs(local.getTime() - remote.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) {
    return ConflictSeverity.LOW; // Within a day
  } else if (diffDays <= 3) {
    return ConflictSeverity.MEDIUM; // Within 3 days
  } else {
    return ConflictSeverity.HIGH; // More than 3 days apart
  }
}

/**
 * Determine overall severity of all conflicts
 */
function determineOverallSeverity(conflicts: ConflictField[]): ConflictSeverity {
  if (conflicts.some(c => c.severity === ConflictSeverity.HIGH)) {
    return ConflictSeverity.HIGH;
  }
  if (conflicts.some(c => c.severity === ConflictSeverity.MEDIUM)) {
    return ConflictSeverity.MEDIUM;
  }
  return ConflictSeverity.LOW;
}

/**
 * Check if conflicts can be auto-merged safely
 */
function isAutoMergeable(conflicts: ConflictField[]): boolean {
  // Never auto-merge if there are any high severity conflicts
  if (conflicts.some(c => c.severity === ConflictSeverity.HIGH)) {
    return false;
  }

  // Check for specific conflict types that should never auto-merge
  const criticalTypes = [ConflictType.STATUS, ConflictType.CONTENT];
  if (conflicts.some(c => criticalTypes.includes(c.conflictType))) {
    return false;
  }

  // Only auto-merge if all conflicts are low severity
  return conflicts.every(c => c.severity === ConflictSeverity.LOW);
}

/**
 * Suggest resolution strategy based on conflict analysis
 */
function suggestResolutionStrategy(
  conflicts: ConflictField[],
  localTask: Task,
  remoteTask: TodoistTask
): 'local' | 'remote' | 'merge' | 'manual' {
  // If auto-mergeable, suggest merge
  if (isAutoMergeable(conflicts)) {
    return 'merge';
  }

  // If high severity, require manual resolution
  if (conflicts.some(c => c.severity === ConflictSeverity.HIGH)) {
    return 'manual';
  }

  // Check timestamps to suggest which is more recent
  const localTime = new Date(localTask.updatedAt || localTask.createdAt);
  const remoteTime = new Date(remoteTask.updated_at || remoteTask.created_at);

  if (localTime > remoteTime) {
    return 'local'; // Local is more recent
  } else if (remoteTime > localTime) {
    return 'remote'; // Remote is more recent
  }

  return 'manual'; // Can't determine, require user decision
}

/**
 * Calculate string similarity (simple Jaccard similarity)
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Detect conflicts across all tasks
 */
export function detectAllConflicts(
  localTasks: Task[],
  remoteTasks: TodoistTask[],
  syncHistory: Map<string, Date>
): ConflictReport {
  const conflicts: TaskConflict[] = [];
  const conflictsByType: Record<ConflictType, number> = {
    [ConflictType.TITLE]: 0,
    [ConflictType.DUE_DATE]: 0,
    [ConflictType.STATUS]: 0,
    [ConflictType.PRIORITY]: 0,
    [ConflictType.PROJECT]: 0,
    [ConflictType.CONTENT]: 0,
    [ConflictType.LABELS]: 0,
    [ConflictType.PARENT]: 0,
    [ConflictType.SECTION]: 0
  };

  // Create a map of remote tasks by ID for quick lookup
  const remoteTaskMap = new Map(remoteTasks.map(t => [t.id, t]));

  // Check each local task for conflicts
  for (const localTask of localTasks) {
    const remoteTask = remoteTaskMap.get(localTask.id);
    if (!remoteTask) continue; // Task only exists locally

    const lastSyncedAt = syncHistory.get(localTask.id);
    const taskConflict = detectTaskConflicts(localTask, remoteTask, lastSyncedAt);

    if (taskConflict) {
      conflicts.push(taskConflict);

      // Count conflicts by type
      taskConflict.conflicts.forEach(conflict => {
        conflictsByType[conflict.conflictType]++;
      });
    }
  }

  // Generate report
  const conflictsBySeverity = {
    low: conflicts.filter(c => c.overallSeverity === ConflictSeverity.LOW).length,
    medium: conflicts.filter(c => c.overallSeverity === ConflictSeverity.MEDIUM).length,
    high: conflicts.filter(c => c.overallSeverity === ConflictSeverity.HIGH).length
  };

  return {
    totalConflicts: conflicts.length,
    conflictsBySeverity,
    conflictsByType,
    conflicts,
    autoMergeableCount: conflicts.filter(c => c.autoMergeable).length,
    requiresUserDecision: conflicts.filter(c => !c.autoMergeable).length
  };
}

/**
 * Generate human-readable conflict summary
 */
export function generateConflictSummary(conflict: TaskConflict): string {
  const lines: string[] = [];
  lines.push(`Task: "${conflict.localTask.title}"`);
  lines.push(`Conflict Count: ${conflict.conflicts.length}`);
  lines.push(`Severity: ${conflict.overallSeverity}`);
  lines.push(`Auto-Mergeable: ${conflict.autoMergeable ? 'Yes' : 'No'}`);

  if (conflict.suggestedStrategy) {
    lines.push(`Suggested Strategy: ${conflict.suggestedStrategy.toUpperCase()}`);
  }

  lines.push('\nConflicts:');
  conflict.conflicts.forEach(c => {
    lines.push(`  • ${c.conflictType}: ${c.reason}`);
    lines.push(`    Local: ${JSON.stringify(c.localValue)}`);
    lines.push(`    Remote: ${JSON.stringify(c.remoteValue)}`);
  });

  return lines.join('\n');
}

/**
 * Export conflict report to JSON
 */
export function exportConflictReport(report: ConflictReport): string {
  return JSON.stringify(report, null, 2);
}
