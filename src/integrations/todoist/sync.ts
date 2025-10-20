/**
 * Todoist Bidirectional Sync Engine
 *
 * Handles synchronization between Life OS and Todoist
 */

import { TodoistClient } from './client';
import { TodoistMapper, LifeOSTask } from './mapper';
import { ConflictResolver } from './conflict-resolver';
import {
  TodoistTask,
  TodoistSyncState,
  SyncConfig,
  SyncResult
} from '../../types/todoist';
import * as fs from 'fs/promises';
import * as path from 'path';

export class TodoistSync {
  private client: TodoistClient;
  private mapper: TodoistMapper;
  private resolver: ConflictResolver;
  private syncState: TodoistSyncState;
  private syncStatePath: string;

  constructor(
    private config: SyncConfig,
    syncStateDirectory: string = '.swarm/sync'
  ) {
    this.client = new TodoistClient(config.apiToken);
    this.mapper = new TodoistMapper();
    this.resolver = new ConflictResolver(config.conflictResolution, syncStateDirectory);
    this.syncStatePath = path.join(syncStateDirectory, 'todoist-state.json');

    // Initialize empty sync state
    this.syncState = {
      lastSyncTimestamp: new Date(0).toISOString(),
      taskIdMapping: {},
      projectIdMapping: {},
      labelIdMapping: {},
      pendingChanges: {
        created: [],
        updated: [],
        deleted: []
      }
    };
  }

  /**
   * Initialize sync state from file
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.syncStatePath), { recursive: true });

      try {
        const data = await fs.readFile(this.syncStatePath, 'utf-8');
        this.syncState = JSON.parse(data);
        console.log('Loaded sync state from', this.syncStatePath);
      } catch {
        console.log('No existing sync state found, initializing new state');
        await this.saveSyncState();
      }

      // Test connection
      const connected = await this.client.testConnection();
      if (!connected) {
        throw new Error('Failed to connect to Todoist API');
      }

      console.log('Todoist sync initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Todoist sync:', error);
      throw error;
    }
  }

  /**
   * Push local tasks to Todoist
   */
  async syncToTodoist(localTasks: LifeOSTask[]): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: { created: 0, updated: 0, deleted: 0, conflicts: 0 },
      errors: []
    };

    try {
      console.log(`Syncing ${localTasks.length} tasks to Todoist...`);

      // Get or create default project
      const projects = await this.client.getProjects();
      let defaultProject = this.mapper.findProjectByName(projects, 'Life OS');

      if (!defaultProject) {
        defaultProject = await this.client.createProject({
          name: 'Life OS',
          color: 'blue'
        });
        console.log('Created default "Life OS" project');
      }

      // Process each task
      for (const localTask of localTasks) {
        try {
          const todoistId = this.syncState.taskIdMapping[localTask.id];

          if (todoistId) {
            // Update existing task
            await this.updateTodoistTask(localTask, todoistId, defaultProject.id);
            result.stats.updated++;
          } else {
            // Create new task
            await this.createTodoistTask(localTask, defaultProject.id);
            result.stats.created++;
          }
        } catch (error) {
          result.errors?.push({
            operation: 'sync-to-todoist',
            taskId: localTask.id,
            error: error instanceof Error ? error.message : String(error)
          });
          result.success = false;
        }
      }

      // Handle deleted tasks
      await this.handleDeletedTasks(localTasks, result);

      // Update sync timestamp
      this.syncState.lastSyncTimestamp = result.timestamp;
      await this.saveSyncState();

      console.log('Sync to Todoist completed:', result.stats);
      return result;
    } catch (error) {
      result.success = false;
      result.errors?.push({
        operation: 'sync-to-todoist',
        error: error instanceof Error ? error.message : String(error)
      });
      return result;
    }
  }

  /**
   * Pull Todoist updates to local
   */
  async syncFromTodoist(): Promise<{ tasks: LifeOSTask[]; result: SyncResult }> {
    const result: SyncResult = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: { created: 0, updated: 0, deleted: 0, conflicts: 0 },
      errors: []
    };

    try {
      console.log('Syncing tasks from Todoist...');

      // Get all tasks from Todoist
      const todoistTasks = await this.client.getTasks();
      const localTasks: LifeOSTask[] = [];

      for (const todoistTask of todoistTasks) {
        try {
          // Find corresponding local task
          const localId = Object.keys(this.syncState.taskIdMapping).find(
            key => this.syncState.taskIdMapping[key] === todoistTask.id
          );

          // Convert to Life OS format
          const lifeOSTask = this.mapper.fromTodoistTask(todoistTask, localId);
          localTasks.push(lifeOSTask);

          // Update mapping
          if (!localId) {
            this.syncState.taskIdMapping[lifeOSTask.id] = todoistTask.id;
            result.stats.created++;
          } else {
            result.stats.updated++;
          }
        } catch (error) {
          result.errors?.push({
            operation: 'sync-from-todoist',
            taskId: todoistTask.id,
            error: error instanceof Error ? error.message : String(error)
          });
          result.success = false;
        }
      }

      // Update sync timestamp
      this.syncState.lastSyncTimestamp = result.timestamp;
      await this.saveSyncState();

      console.log('Sync from Todoist completed:', result.stats);
      return { tasks: localTasks, result };
    } catch (error) {
      result.success = false;
      result.errors?.push({
        operation: 'sync-from-todoist',
        error: error instanceof Error ? error.message : String(error)
      });
      return { tasks: [], result };
    }
  }

  /**
   * Perform bidirectional sync with conflict detection
   */
  async bidirectionalSync(localTasks: LifeOSTask[]): Promise<{
    tasks: LifeOSTask[];
    result: SyncResult;
  }> {
    const result: SyncResult = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: { created: 0, updated: 0, deleted: 0, conflicts: 0 },
      conflicts: [],
      errors: []
    };

    try {
      console.log('Starting bidirectional sync...');

      // Step 1: Get remote tasks
      const todoistTasks = await this.client.getTasks();
      const todoistTasksMap = new Map(todoistTasks.map(t => [t.id, t]));

      // Step 2: Detect conflicts and changes
      // Local tasks map not used in current implementation
      const _localTasksMap = new Map(localTasks.map(t => [t.id, t]));
      void _localTasksMap; // Acknowledge unused variable
      const resolvedTasks: LifeOSTask[] = [];
      const tasksToSync: LifeOSTask[] = [];

      // Get or create default project
      const projects = await this.client.getProjects();
      let defaultProject = this.mapper.findProjectByName(projects, 'Life OS');
      if (!defaultProject) {
        defaultProject = await this.client.createProject({
          name: 'Life OS',
          color: 'blue'
        });
      }

      // Process local tasks
      for (const localTask of localTasks) {
        const todoistId = this.syncState.taskIdMapping[localTask.id];

        if (todoistId && todoistTasksMap.has(todoistId)) {
          // Task exists in both - check for conflicts
          const remoteTask = todoistTasksMap.get(todoistId)!;
          const hasConflict = await this.detectConflict(localTask, remoteTask);

          if (hasConflict) {
            // Resolve conflict
            const resolution = await this.resolver.resolveConflict(
              localTask,
              remoteTask,
              this.config.conflictResolution
            );
            resolvedTasks.push(resolution.resolvedTask);
            tasksToSync.push(resolution.resolvedTask);
            result.stats.conflicts++;

            result.conflicts?.push({
              taskId: localTask.id,
              localTask,
              remoteTask,
              localModified: localTask.updatedAt,
              remoteModified: remoteTask.created_at,
              conflictType: 'content',
              resolution: resolution.strategy
            });
          } else {
            // No conflict, use local version
            resolvedTasks.push(localTask);
          }

          // Remove from map to track what's left
          todoistTasksMap.delete(todoistId);
        } else {
          // New local task - sync to Todoist
          await this.createTodoistTask(localTask, defaultProject.id);
          resolvedTasks.push(localTask);
          tasksToSync.push(localTask);
          result.stats.created++;
        }
      }

      // Step 3: Process remaining remote tasks (new from Todoist)
      for (const [todoistId, remoteTask] of todoistTasksMap) {
        const lifeOSTask = this.mapper.fromTodoistTask(remoteTask);
        this.syncState.taskIdMapping[lifeOSTask.id] = todoistId;
        resolvedTasks.push(lifeOSTask);
        result.stats.created++;
      }

      // Step 4: Update changed tasks on Todoist
      for (const task of tasksToSync) {
        const todoistId = this.syncState.taskIdMapping[task.id];
        if (todoistId) {
          try {
            await this.updateTodoistTask(task, todoistId, defaultProject.id);
            result.stats.updated++;
          } catch (error) {
            result.errors?.push({
              operation: 'update-todoist',
              taskId: task.id,
              error: error instanceof Error ? error.message : String(error)
            });
          }
        }
      }

      // Step 5: Handle deleted tasks
      await this.handleDeletedTasks(localTasks, result);

      // Update sync timestamp
      this.syncState.lastSyncTimestamp = result.timestamp;
      await this.saveSyncState();

      console.log('Bidirectional sync completed:', result.stats);
      return { tasks: resolvedTasks, result };
    } catch (error) {
      result.success = false;
      result.errors?.push({
        operation: 'bidirectional-sync',
        error: error instanceof Error ? error.message : String(error)
      });
      return { tasks: localTasks, result };
    }
  }

  /**
   * Create new task in Todoist
   */
  private async createTodoistTask(
    localTask: LifeOSTask,
    projectId: string
  ): Promise<void> {
    const todoistTask = this.mapper.toTodoistTask(localTask, projectId);
    const created = await this.client.createTask(todoistTask);

    // Update mapping
    this.syncState.taskIdMapping[localTask.id] = created.id;

    console.log(`Created task in Todoist: ${created.content} (${created.id})`);
  }

  /**
   * Update existing task in Todoist
   */
  private async updateTodoistTask(
    localTask: LifeOSTask,
    todoistId: string,
    projectId: string
  ): Promise<void> {
    const todoistTask = this.mapper.toTodoistTask(localTask, projectId, todoistId);

    // Handle completion status separately
    if (localTask.status === 'done') {
      await this.client.completeTask(todoistId);
    } else {
      await this.client.updateTask(todoistId, todoistTask);
    }

    console.log(`Updated task in Todoist: ${localTask.title} (${todoistId})`);
  }

  /**
   * Detect if there's a conflict between local and remote task
   */
  private async detectConflict(
    localTask: LifeOSTask,
    remoteTask: TodoistTask
  ): Promise<boolean> {
    const remoteAsLocal = this.mapper.fromTodoistTask(remoteTask, localTask.id);

    // Compare key fields
    const hasContentChange =
      localTask.title !== remoteAsLocal.title ||
      localTask.description !== remoteAsLocal.description;

    const hasStatusChange = localTask.status !== remoteAsLocal.status;
    const hasPriorityChange = localTask.priority !== remoteAsLocal.priority;
    const hasDueDateChange = localTask.dueDate !== remoteAsLocal.dueDate;

    return hasContentChange || hasStatusChange || hasPriorityChange || hasDueDateChange;
  }

  /**
   * Handle tasks that were deleted locally
   */
  private async handleDeletedTasks(
    localTasks: LifeOSTask[],
    result: SyncResult
  ): Promise<void> {
    const localTaskIds = new Set(localTasks.map(t => t.id));
    const mappedIds = Object.keys(this.syncState.taskIdMapping);

    for (const localId of mappedIds) {
      if (!localTaskIds.has(localId)) {
        // Task was deleted locally
        const todoistId = this.syncState.taskIdMapping[localId];

        try {
          await this.client.deleteTask(todoistId);
          delete this.syncState.taskIdMapping[localId];
          result.stats.deleted++;
          console.log(`Deleted task from Todoist: ${todoistId}`);
        } catch (error) {
          result.errors?.push({
            operation: 'delete-todoist',
            taskId: localId,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }
    }
  }

  /**
   * Save sync state to disk
   */
  private async saveSyncState(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.syncStatePath), { recursive: true });
      await fs.writeFile(
        this.syncStatePath,
        JSON.stringify(this.syncState, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Failed to save sync state:', error);
    }
  }

  /**
   * Get current sync state
   */
  getSyncState(): TodoistSyncState {
    return { ...this.syncState };
  }

  /**
   * Get time since last sync
   */
  getTimeSinceLastSync(): number {
    const lastSync = new Date(this.syncState.lastSyncTimestamp).getTime();
    return Date.now() - lastSync;
  }

  /**
   * Check if sync is needed based on interval
   */
  shouldSync(): boolean {
    if (!this.config.autoSync) {
      return false;
    }

    const timeSinceLastSync = this.getTimeSinceLastSync();
    const syncIntervalMs = this.config.syncInterval * 60 * 1000;

    return timeSinceLastSync >= syncIntervalMs;
  }

  /**
   * Reset sync state (use with caution)
   */
  async resetSyncState(): Promise<void> {
    this.syncState = {
      lastSyncTimestamp: new Date(0).toISOString(),
      taskIdMapping: {},
      projectIdMapping: {},
      labelIdMapping: {},
      pendingChanges: {
        created: [],
        updated: [],
        deleted: []
      }
    };
    await this.saveSyncState();
    console.log('Sync state has been reset');
  }
}
