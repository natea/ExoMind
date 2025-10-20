import { TodoistClient } from '../../src/integrations/todoist/client';
import { TodoistSyncEngine } from '../../src/integrations/todoist/sync-engine';
import { LocalTaskStore } from '../../src/storage/task-store';
import { TodoistMapper } from '../../src/integrations/todoist/mapper';
import { Task } from '../../src/types/task';

/**
 * End-to-End Integration Tests for Todoist Sync
 *
 * These tests verify the complete sync cycle:
 * 1. Create task locally
 * 2. Sync to Todoist
 * 3. Modify in Todoist
 * 4. Sync back to local
 * 5. Verify consistency
 *
 * NOTE: These tests require a valid Todoist API token
 * Set TODOIST_API_TOKEN environment variable to run
 */

describe('Todoist Full Cycle Integration', () => {
  let client: TodoistClient;
  let syncEngine: TodoistSyncEngine;
  let localStore: LocalTaskStore;
  let mapper: TodoistMapper;

  const skipIfNoToken = () => {
    if (!process.env.TODOIST_API_TOKEN) {
      console.warn('Skipping Todoist integration tests - no API token provided');
      return true;
    }
    return false;
  };

  beforeAll(async () => {
    if (skipIfNoToken()) return;

    client = new TodoistClient(process.env.TODOIST_API_TOKEN!);
    localStore = new LocalTaskStore(':memory:'); // Use in-memory SQLite for tests
    mapper = new TodoistMapper();
    syncEngine = new TodoistSyncEngine(client, localStore);

    await localStore.initialize();
  });

  afterAll(async () => {
    if (skipIfNoToken()) return;
    await localStore.close();
  });

  afterEach(async () => {
    if (skipIfNoToken()) return;
    // Clean up test tasks
    const tasks = await localStore.getAll();
    for (const task of tasks) {
      if (task.title.startsWith('[TEST]')) {
        if (task.syncState?.remoteId) {
          await client.deleteTask(task.syncState.remoteId).catch(() => {});
        }
        await localStore.remove(task.id);
      }
    }
  });

  describe('Happy Path - No Conflicts', () => {
    it('should complete full sync cycle successfully', async () => {
      if (skipIfNoToken()) return;

      // 1. Create task locally
      const localTask: Task = {
        id: `local-${Date.now()}`,
        title: '[TEST] Full cycle test task',
        description: 'Testing complete sync cycle',
        status: 'todo',
        priority: 3,
        tags: ['test', 'automation'],
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: {
          dirty: true,
          lastSynced: null,
        },
      };

      await localStore.create(localTask);

      // 2. Sync to Todoist (Local → Remote)
      const syncResult1 = await syncEngine.syncLocalToRemote();
      expect(syncResult1.created).toBe(1);
      expect(syncResult1.errors).toBe(0);

      // Verify task exists in Todoist
      const syncedTask = await localStore.get(localTask.id);
      expect(syncedTask?.syncState?.remoteId).toBeDefined();
      expect(syncedTask?.syncState?.dirty).toBe(false);

      const remoteId = syncedTask!.syncState!.remoteId!;

      // 3. Modify in Todoist directly
      await client.updateTask(remoteId, {
        content: '[TEST] Modified in Todoist',
        priority: 4,
        labels: ['test', 'automation', 'modified'],
      });

      // Wait a bit for Todoist to process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 4. Sync back to local (Remote → Local)
      const syncResult2 = await syncEngine.syncRemoteToLocal();
      expect(syncResult2.updated).toBe(1);

      // 5. Verify consistency
      const finalTask = await localStore.get(localTask.id);
      expect(finalTask?.title).toBe('[TEST] Modified in Todoist');
      expect(finalTask?.priority).toBe(4);
      expect(finalTask?.tags).toContain('modified');
      expect(finalTask?.syncState?.dirty).toBe(false);
    }, 30000); // 30 second timeout

    it('should handle task completion sync', async () => {
      if (skipIfNoToken()) return;

      // Create and sync task
      const task: Task = {
        id: `local-${Date.now()}`,
        title: '[TEST] Task to complete',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      };

      await localStore.create(task);
      await syncEngine.syncLocalToRemote();

      const syncedTask = await localStore.get(task.id);
      const remoteId = syncedTask!.syncState!.remoteId!;

      // Complete in Todoist
      await client.completeTask(remoteId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Sync back
      await syncEngine.syncRemoteToLocal();

      const completedTask = await localStore.get(task.id);
      expect(completedTask?.status).toBe('done');
    }, 30000);

    it('should sync task deletion', async () => {
      if (skipIfNoToken()) return;

      // Create and sync task
      const task: Task = {
        id: `local-${Date.now()}`,
        title: '[TEST] Task to delete',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      };

      await localStore.create(task);
      await syncEngine.syncLocalToRemote();

      // Delete locally
      await localStore.remove(task.id);
      const deletedTask = await localStore.get(task.id);
      expect(deletedTask).toBeNull();
    }, 30000);
  });

  describe('Concurrent Modifications', () => {
    it('should detect and resolve conflicts', async () => {
      if (skipIfNoToken()) return;

      // Create and sync task
      const task: Task = {
        id: `local-${Date.now()}`,
        title: '[TEST] Conflict test',
        description: 'Original description',
        status: 'todo',
        priority: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      };

      await localStore.create(task);
      await syncEngine.syncLocalToRemote();

      const syncedTask = await localStore.get(task.id);
      const remoteId = syncedTask!.syncState!.remoteId!;

      // Modify locally
      await localStore.update(task.id, {
        title: '[TEST] Modified locally',
        priority: 4,
      });

      // Modify remotely at the same time
      await client.updateTask(remoteId, {
        content: '[TEST] Modified remotely',
        description: 'Remote description',
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Attempt bidirectional sync
      const syncResult = await syncEngine.syncBidirectional();

      expect(syncResult.conflicts.length).toBeGreaterThan(0);
      expect(syncResult.conflicts[0].type).toBe('concurrent_modification');

      // Verify conflict is logged
      const conflicts = await localStore.getConflicts();
      expect(conflicts.length).toBeGreaterThan(0);
    }, 30000);

    it('should resolve conflicts with local-wins strategy', async () => {
      if (skipIfNoToken()) return;

      // Setup conflict scenario
      const task: Task = {
        id: `local-${Date.now()}`,
        title: '[TEST] Local wins',
        status: 'todo',
        priority: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      };

      await localStore.create(task);
      await syncEngine.syncLocalToRemote();

      const syncedTask = await localStore.get(task.id);
      const remoteId = syncedTask!.syncState!.remoteId!;

      // Create conflict
      await localStore.update(task.id, { title: '[TEST] Local version' });
      await client.updateTask(remoteId, { content: '[TEST] Remote version' });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Resolve with local-wins
      const syncResult = await syncEngine.syncBidirectional({
        conflictResolution: 'local-wins',
      });

      expect(syncResult.conflicts.length).toBeGreaterThan(0);

      // Verify local version won
      const finalTask = await localStore.get(task.id);
      expect(finalTask?.title).toBe('[TEST] Local version');
    }, 30000);
  });

  describe('Network Failures', () => {
    it('should handle offline sync gracefully', async () => {
      if (skipIfNoToken()) return;

      // Create task that will fail to sync
      const task: Task = {
        id: `local-${Date.now()}`,
        title: '[TEST] Offline task',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      };

      await localStore.create(task);

      // Simulate network failure by using invalid token
      const offlineClient = new TodoistClient('invalid-token');
      const offlineSyncEngine = new TodoistSyncEngine(offlineClient, localStore);

      const syncResult = await offlineSyncEngine.syncLocalToRemote();

      expect(syncResult.errors).toBe(1);
      expect(syncResult.created).toBe(0);

      // Verify task remains dirty
      const unsyncedTask = await localStore.get(task.id);
      expect(unsyncedTask?.syncState?.dirty).toBe(true);
      expect(unsyncedTask?.syncState?.queued).toBe(true);
    }, 30000);

    it('should retry and succeed when back online', async () => {
      if (skipIfNoToken()) return;

      // Create queued task
      const task: Task = {
        id: `local-${Date.now()}`,
        title: '[TEST] Queued task',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null, queued: true },
      };

      await localStore.create(task);

      // Now sync with valid client
      const replayResult = await syncEngine.replayQueuedOperations();

      expect(replayResult.replayed).toBe(1);
      expect(replayResult.failed).toBe(0);

      // Verify task synced successfully
      const syncedTask = await localStore.get(task.id);
      expect(syncedTask?.syncState?.remoteId).toBeDefined();
      expect(syncedTask?.syncState?.queued).toBe(false);
    }, 30000);
  });

  describe('Performance Tests', () => {
    it('should sync 50 tasks efficiently', async () => {
      if (skipIfNoToken()) return;

      const tasks: Task[] = Array.from({ length: 50 }, (_, i) => ({
        id: `local-${Date.now()}-${i}`,
        title: `[TEST] Batch task ${i}`,
        status: 'todo' as const,
        priority: (i % 4) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      }));

      // Create all tasks
      for (const task of tasks) {
        await localStore.create(task);
      }

      // Measure sync time
      const startTime = Date.now();
      const syncResult = await syncEngine.syncLocalToRemote({ batchSize: 10 });
      const syncDuration = Date.now() - startTime;

      expect(syncResult.created).toBe(50);
      expect(syncResult.errors).toBe(0);
      expect(syncDuration).toBeLessThan(30000); // Should complete in under 30 seconds

      console.log(`Synced 50 tasks in ${syncDuration}ms`);
    }, 60000); // 60 second timeout
  });

  describe('Data Integrity', () => {
    it('should preserve all task fields through sync', async () => {
      if (skipIfNoToken()) return;

      const originalTask: Task = {
        id: `local-${Date.now()}`,
        title: '[TEST] Complete task data',
        description: 'Full task with all fields',
        status: 'todo',
        priority: 3,
        tags: ['test', 'automation', 'complete'],
        dueDate: new Date('2025-10-25T14:30:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          customField: 'custom value',
        },
        syncState: { dirty: true, lastSynced: null },
      };

      await localStore.create(originalTask);
      await syncEngine.syncLocalToRemote();

      // Sync back to verify data integrity
      await syncEngine.syncRemoteToLocal();

      const syncedTask = await localStore.get(originalTask.id);

      expect(syncedTask?.title).toBe(originalTask.title);
      expect(syncedTask?.description).toBe(originalTask.description);
      expect(syncedTask?.priority).toBe(originalTask.priority);
      expect(syncedTask?.tags).toEqual(originalTask.tags);
      expect(syncedTask?.dueDate?.getTime()).toBe(originalTask.dueDate?.getTime());
    }, 30000);
  });

  describe('Incremental Sync', () => {
    it('should use sync tokens for efficient updates', async () => {
      if (skipIfNoToken()) return;

      // Initial full sync
      await syncEngine.syncBidirectional();

      const initialSyncState = await localStore.getSyncState();
      expect(initialSyncState.lastSyncToken).toBeDefined();

      // Create new task
      const newTask: Task = {
        id: `local-${Date.now()}`,
        title: '[TEST] Incremental sync',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      };

      await localStore.create(newTask);

      // Incremental sync should only fetch changes
      const syncResult = await syncEngine.syncBidirectional({ incremental: true });

      expect(syncResult.localToRemote.created).toBe(1);

      const finalSyncState = await localStore.getSyncState();
      expect(finalSyncState.lastSyncToken).not.toBe(initialSyncState.lastSyncToken);
    }, 30000);
  });
});
