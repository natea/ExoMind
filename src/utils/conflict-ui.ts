/**
 * Conflict Resolution Interactive UI
 *
 * Provides interactive prompts for resolving sync conflicts.
 * Displays conflicts in readable format and guides user through resolution.
 */

import * as readline from 'readline';
import chalk from 'chalk';
import { TaskConflict, ConflictField, ConflictSeverity, ConflictType } from './conflict-detector';

export enum ResolutionStrategy {
  KEEP_LOCAL = 'local',
  KEEP_REMOTE = 'remote',
  MERGE_BOTH = 'merge',
  MANUAL_EDIT = 'manual',
  SKIP = 'skip'
}

export interface ResolutionChoice {
  strategy: ResolutionStrategy;
  manualValue?: any;
  applyToAll?: boolean;
  notes?: string;
}

export interface ResolutionResult {
  taskId: string;
  strategy: ResolutionStrategy;
  finalValues: Record<string, any>;
  userNotes?: string;
  timestamp: Date;
}

/**
 * Display conflict in formatted box with clear visual separation
 */
export function displayConflict(conflict: TaskConflict): void {
  const width = 70;
  const line = '═'.repeat(width);
  const separator = '─'.repeat(width);

  console.log('\n╔' + line + '╗');
  console.log('║' + chalk.bold.red(' SYNC CONFLICT DETECTED').padEnd(width) + '║');
  console.log('╠' + line + '╣');

  // Task info
  console.log('║' + chalk.bold(` Task: "${conflict.localTask.title}"`).padEnd(width + 9) + '║');
  console.log('║' + chalk.yellow(` Conflict Type: ${conflict.conflicts.map(c => c.conflictType).join(', ')}`).padEnd(width + 9) + '║');

  if (conflict.lastSyncedAt) {
    console.log('║' + ` Last Synced: ${formatDate(conflict.lastSyncedAt)}`.padEnd(width) + '║');
  }

  console.log('╠' + line + '╣');

  // Display conflicts side by side
  console.log('║' + chalk.bold(' LOCAL (Your Changes)').padEnd(36) + chalk.bold('REMOTE (Todoist)').padEnd(35) + '║');
  console.log('║' + separator.padEnd(width) + '║');

  conflict.conflicts.forEach(c => {
    displayConflictField(c, width);
  });

  // Severity and metadata
  console.log('╠' + line + '╣');
  console.log('║' + chalk.bold(` Severity: ${getSeverityColor(conflict.overallSeverity)}`).padEnd(width + 9) + '║');
  console.log('║' + ` Auto-Mergeable: ${conflict.autoMergeable ? chalk.green('Yes') : chalk.red('No')}`.padEnd(width + 9) + '║');

  if (conflict.suggestedStrategy) {
    console.log('║' + ` Suggested: ${chalk.cyan(conflict.suggestedStrategy.toUpperCase())}`.padEnd(width + 9) + '║');
  }

  console.log('╚' + line + '╝\n');
}

/**
 * Display individual conflict field
 */
function displayConflictField(conflict: ConflictField, width: number): void {
  const fieldName = chalk.yellow(`${conflict.field}:`);
  console.log('║' + fieldName.padEnd(width + 9) + '║');

  const localValue = formatValue(conflict.localValue);
  const remoteValue = formatValue(conflict.remoteValue);

  // Split into columns
  const leftCol = truncate(localValue, 34);
  const rightCol = truncate(remoteValue, 33);

  console.log('║ ' + leftCol.padEnd(35) + rightCol.padEnd(34) + '║');
}

/**
 * Display resolution options
 */
export function displayResolutionOptions(conflict: TaskConflict): void {
  console.log(chalk.bold('Resolution Options:\n'));

  console.log(chalk.green('[1]') + ' Keep Local (your changes win)');
  console.log(chalk.blue('[2]') + ' Keep Remote (Todoist wins)');
  console.log(chalk.yellow('[3]') + ' Merge Both (combine changes)');
  console.log(chalk.cyan('[4]') + ' Manual Edit (edit directly)');
  console.log(chalk.gray('[5]') + ' Skip (decide later)');

  if (conflict.autoMergeable) {
    console.log(chalk.green('\n✓ This conflict can be auto-merged safely'));
  } else {
    console.log(chalk.red('\n⚠ Manual resolution recommended'));
  }
}

/**
 * Prompt user for resolution choice
 */
export async function promptForResolution(conflict: TaskConflict): Promise<ResolutionChoice> {
  displayConflict(conflict);
  displayResolutionOptions(conflict);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(chalk.bold('\nYour choice [1-5]: '), async (answer) => {
      const choice = answer.trim();

      let strategy: ResolutionStrategy;
      switch (choice) {
        case '1':
          strategy = ResolutionStrategy.KEEP_LOCAL;
          break;
        case '2':
          strategy = ResolutionStrategy.KEEP_REMOTE;
          break;
        case '3':
          strategy = ResolutionStrategy.MERGE_BOTH;
          break;
        case '4':
          strategy = ResolutionStrategy.MANUAL_EDIT;
          break;
        case '5':
          strategy = ResolutionStrategy.SKIP;
          break;
        default:
          console.log(chalk.red('Invalid choice. Please select 1-5.'));
          rl.close();
          resolve(await promptForResolution(conflict));
          return;
      }

      // If manual edit, prompt for values
      let manualValue: any = undefined;
      if (strategy === ResolutionStrategy.MANUAL_EDIT) {
        manualValue = await promptForManualEdit(conflict, rl);
      }

      // Ask if should apply to all similar conflicts
      const applyToAll = await promptYesNo(
        rl,
        'Apply this strategy to all similar conflicts? (y/N): '
      );

      // Optional notes
      const notes = await promptOptional(rl, 'Add notes (optional): ');

      rl.close();
      resolve({
        strategy,
        manualValue,
        applyToAll,
        notes
      });
    });
  });
}

/**
 * Prompt for manual edit of conflict values
 */
async function promptForManualEdit(
  conflict: TaskConflict,
  rl: readline.Interface
): Promise<Record<string, any>> {
  const manualValues: Record<string, any> = {};

  console.log(chalk.bold('\n--- Manual Edit Mode ---'));
  console.log('Enter new values for each conflicting field:\n');

  for (const field of conflict.conflicts) {
    const value = await promptForValue(
      rl,
      `${field.field} (local: ${formatValue(field.localValue)}, remote: ${formatValue(field.remoteValue)}): `
    );
    manualValues[field.field] = value || field.localValue; // Default to local if empty
  }

  return manualValues;
}

/**
 * Prompt for a value
 */
function promptForValue(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Prompt for yes/no
 */
function promptYesNo(rl: readline.Interface, question: string): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const normalized = answer.trim().toLowerCase();
      resolve(normalized === 'y' || normalized === 'yes');
    });
  });
}

/**
 * Prompt for optional input
 */
function promptOptional(rl: readline.Interface, question: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const trimmed = answer.trim();
      resolve(trimmed || undefined);
    });
  });
}

/**
 * Display resolution preview before applying
 */
export function displayResolutionPreview(
  _conflict: TaskConflict,
  choice: ResolutionChoice,
  finalValues: Record<string, any>
): void {
  const width = 70;
  const line = '═'.repeat(width);

  console.log('\n╔' + line + '╗');
  console.log('║' + chalk.bold.green(' RESOLUTION PREVIEW').padEnd(width + 9) + '║');
  console.log('╠' + line + '╣');
  console.log('║' + chalk.yellow(` Selected Strategy: ${choice.strategy.toUpperCase()}`).padEnd(width + 9) + '║');
  console.log('║'.padEnd(width + 2) + '║');
  console.log('║' + chalk.bold(' Final Version:').padEnd(width + 9) + '║');
  console.log('║' + '─'.repeat(width).padEnd(width) + '║');

  Object.entries(finalValues).forEach(([field, value]) => {
    const line = `  ${field}: ${formatValue(value)}`;
    console.log('║ ' + truncate(line, width - 2).padEnd(width - 1) + '║');
  });

  console.log('╠' + line + '╣');
  console.log('║' + ' This will:'.padEnd(width) + '║');
  console.log('║' + chalk.green(' ✓ Update Todoist with merged version').padEnd(width + 9) + '║');
  console.log('║' + chalk.green(' ✓ Update local database').padEnd(width + 9) + '║');
  console.log('║' + chalk.green(' ✓ Mark conflict as resolved').padEnd(width + 9) + '║');

  if (choice.notes) {
    console.log('║'.padEnd(width + 2) + '║');
    console.log('║' + ` Notes: ${choice.notes}`.padEnd(width) + '║');
  }

  console.log('╚' + line + '╝\n');
}

/**
 * Confirm resolution before applying
 */
export async function confirmResolution(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(chalk.bold('Continue? [Y/n]: '), (answer) => {
      const normalized = answer.trim().toLowerCase();
      rl.close();
      resolve(normalized !== 'n' && normalized !== 'no');
    });
  });
}

/**
 * Display batch conflict summary
 */
export function displayConflictSummary(conflicts: TaskConflict[]): void {
  console.log(chalk.bold('\n╔══════════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold('║ CONFLICT SUMMARY                                             ║'));
  console.log(chalk.bold('╠══════════════════════════════════════════════════════════════╣'));

  const total = conflicts.length;
  const low = conflicts.filter(c => c.overallSeverity === ConflictSeverity.LOW).length;
  const medium = conflicts.filter(c => c.overallSeverity === ConflictSeverity.MEDIUM).length;
  const high = conflicts.filter(c => c.overallSeverity === ConflictSeverity.HIGH).length;
  const autoMerge = conflicts.filter(c => c.autoMergeable).length;

  console.log(`║ Total Conflicts: ${chalk.red(total.toString().padStart(3))}                                    ║`);
  console.log(`║ Low Severity:    ${chalk.green(low.toString().padStart(3))}                                    ║`);
  console.log(`║ Medium Severity: ${chalk.yellow(medium.toString().padStart(3))}                                    ║`);
  console.log(`║ High Severity:   ${chalk.red(high.toString().padStart(3))}                                    ║`);
  console.log(`║ Auto-Mergeable:  ${chalk.green(autoMerge.toString().padStart(3))}                                    ║`);
  console.log(chalk.bold('╚══════════════════════════════════════════════════════════════╝\n'));
}

/**
 * Display resolution results
 */
export function displayResolutionResults(results: ResolutionResult[]): void {
  console.log(chalk.bold.green('\n✅ CONFLICT RESOLUTION COMPLETE\n'));

  console.log(chalk.bold('Resolution Summary:'));
  results.forEach((result, index) => {
    console.log(`  ${index + 1}. Task ${result.taskId}: ${chalk.cyan(result.strategy.toUpperCase())}`);
    if (result.userNotes) {
      console.log(`     Notes: ${result.userNotes}`);
    }
  });

  console.log(chalk.green(`\n✓ ${results.length} conflicts resolved successfully\n`));
}

/**
 * Display error during resolution
 */
export function displayResolutionError(error: Error, taskId: string): void {
  console.log(chalk.red(`\n❌ Error resolving conflict for task ${taskId}:`));
  console.log(chalk.red(`   ${error.message}\n`));
  console.log(chalk.yellow('Options:'));
  console.log('  1. Retry resolution');
  console.log('  2. Skip this conflict');
  console.log('  3. Rollback to pre-resolution state\n');
}

// Helper functions

function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return chalk.gray('(none)');
  }
  if (typeof value === 'boolean') {
    return value ? chalk.green('true') : chalk.red('false');
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return String(value);
}

function truncate(text: string, maxLength: number): string {
  // Remove ANSI escape codes for length calculation
  const plainText = text.replace(/\u001b\[\d+m/g, '');
  if (plainText.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

function getSeverityColor(severity: ConflictSeverity): string {
  switch (severity) {
    case ConflictSeverity.LOW:
      return chalk.green(severity);
    case ConflictSeverity.MEDIUM:
      return chalk.yellow(severity);
    case ConflictSeverity.HIGH:
      return chalk.red(severity);
    default:
      return severity;
  }
}

/**
 * Interactive conflict resolution flow
 */
export async function resolveConflictsInteractively(
  conflicts: TaskConflict[]
): Promise<ResolutionResult[]> {
  const results: ResolutionResult[] = [];

  displayConflictSummary(conflicts);

  for (let i = 0; i < conflicts.length; i++) {
    const conflict = conflicts[i];

    console.log(chalk.bold(`\nResolving conflict ${i + 1} of ${conflicts.length}:`));

    const choice = await promptForResolution(conflict);

    if (choice.strategy === ResolutionStrategy.SKIP) {
      console.log(chalk.yellow('⏭  Skipped - will resolve later\n'));
      continue;
    }

    // Calculate final values based on strategy
    const finalValues = calculateFinalValues(conflict, choice);

    // Show preview
    displayResolutionPreview(conflict, choice, finalValues);

    // Confirm
    const confirmed = await confirmResolution();

    if (!confirmed) {
      console.log(chalk.yellow('⏭  Cancelled - trying again...\n'));
      i--; // Retry this conflict
      continue;
    }

    // Record result
    results.push({
      taskId: conflict.taskId,
      strategy: choice.strategy,
      finalValues,
      userNotes: choice.notes,
      timestamp: new Date()
    });

    console.log(chalk.green('✓ Resolution applied\n'));
  }

  return results;
}

/**
 * Calculate final values based on resolution strategy
 */
function calculateFinalValues(
  conflict: TaskConflict,
  choice: ResolutionChoice
): Record<string, any> {
  const finalValues: Record<string, any> = {};

  switch (choice.strategy) {
    case ResolutionStrategy.KEEP_LOCAL:
      conflict.conflicts.forEach(c => {
        finalValues[c.field] = c.localValue;
      });
      break;

    case ResolutionStrategy.KEEP_REMOTE:
      conflict.conflicts.forEach(c => {
        finalValues[c.field] = c.remoteValue;
      });
      break;

    case ResolutionStrategy.MERGE_BOTH:
      conflict.conflicts.forEach(c => {
        finalValues[c.field] = mergeValues(c);
      });
      break;

    case ResolutionStrategy.MANUAL_EDIT:
      Object.assign(finalValues, choice.manualValue);
      break;
  }

  return finalValues;
}

/**
 * Merge values intelligently based on conflict type
 */
function mergeValues(conflict: ConflictField): any {
  switch (conflict.conflictType) {
    case ConflictType.TITLE:
      // Use longer title
      return conflict.localValue.length >= conflict.remoteValue.length
        ? conflict.localValue
        : conflict.remoteValue;

    case ConflictType.DUE_DATE:
      // Use earlier date (more urgent)
      if (!conflict.localValue) return conflict.remoteValue;
      if (!conflict.remoteValue) return conflict.localValue;
      return new Date(conflict.localValue) < new Date(conflict.remoteValue)
        ? conflict.localValue
        : conflict.remoteValue;

    case ConflictType.PRIORITY:
      // Use higher priority (lower number = higher priority)
      return Math.min(conflict.localValue, conflict.remoteValue);

    case ConflictType.LABELS:
      // Combine labels from both
      const localLabels = Array.isArray(conflict.localValue) ? conflict.localValue : [];
      const remoteLabels = Array.isArray(conflict.remoteValue) ? conflict.remoteValue : [];
      return [...new Set([...localLabels, ...remoteLabels])];

    default:
      // Default to local value
      return conflict.localValue;
  }
}
