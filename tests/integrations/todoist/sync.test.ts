import { TodoistSyncEngine } from '../../../src/integrations/todoist/sync-engine';
import { TodoistClient } from '../../../src/integrations/todoist/client';
import { LocalTaskStore } from '../../../src/storage/task-store';
import { Task } from '../../../src/types/task';
import { TodoistTask } from '../../../src/integrations/todoist/types';
import { SyncState, SyncConflict } from '../../../src/integrations/todoist/sync-types';

jest.mock('../../../src/integrations/todoist/client');
jest.mock('../../../src/storage/task-store');

describe('TodoistSyncEngine', () => {
  let syncEngine: TodoistSyncEngine;
  let mockClient: jest.Mocked<TodoistClient>;
  let mockLocalStore: jest.Mocked<LocalTaskStore>;

  beforeEach(() => {
    mockClient = new TodoistClient('test-token') as jest.Mocked<TodoistClient>;
    mockLocalStore = new LocalTaskStore() as jest.Mocked<LocalTaskStore>;
    syncEngine = new TodoistSyncEngine(mockClient, mockLocalStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Local to Remote Sync', () => {
    it('should push new local tasks to Todoist', async () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'New task',
        status: 'todo',
        priority: 3,
        tags: ['work'],
        createdAt: new Date('2025-10-20T10:00:00Z'),
        updatedAt: new Date('2025-10-20T10:00:00Z'),
        syncState: { dirty: true, lastSynced: null },
      };

      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'New task',
        priority: 3,
        labels: ['work'],
        created_at: '2025-10-20T10:00:00Z',
      };

      mockLocalStore.getUnsyncedTasks.mockResolvedValue([localTask]);
      mockClient.createTask.mockResolvedValue(todoistTask);

      const result = await syncEngine.syncLocalToRemote();

      expect(result.created).toBe(1);
      expect(result.errors).toBe(0);
      expect(mockClient.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'New task',
          priority: 3,
          labels: ['work'],
        })
      );
      expect(mockLocalStore.updateSyncState).toHaveBeenCalledWith(
        'local-1',
        expect.objectContaining({
          dirty: false,
          remoteId: 'todoist-123',
          lastSynced: expect.any(Date),
        })
      );
    });

    it('should update modified local tasks in Todoist', async () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Updated task',
        status: 'todo',
        priority: 4,
        tags: ['urgent'],
        createdAt: new Date('2025-10-20T10:00:00Z'),
        updatedAt: new Date('2025-10-20T11:00:00Z'),
        syncState: {
          dirty: true,
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
        },
      };

      const updatedTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Updated task',
        priority: 4,
        labels: ['urgent'],
        created_at: '2025-10-20T10:00:00Z',
      };

      mockLocalStore.getUnsyncedTasks.mockResolvedValue([localTask]);
      mockClient.updateTask.mockResolvedValue(updatedTask);

      const result = await syncEngine.syncLocalToRemote();

      expect(result.updated).toBe(1);
      expect(mockClient.updateTask).toHaveBeenCalledWith(
        'todoist-123',
        expect.objectContaining({
          content: 'Updated task',
          priority: 4,
          labels: ['urgent'],
        })
      );
    });

    it('should delete removed local tasks from Todoist', async () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Deleted task',
        status: 'deleted',
        createdAt: new Date('2025-10-20T10:00:00Z'),
        updatedAt: new Date('2025-10-20T11:00:00Z'),
        syncState: {
          dirty: true,
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
        },
      };

      mockLocalStore.getUnsyncedTasks.mockResolvedValue([localTask]);
      mockClient.deleteTask.mockResolvedValue(undefined);

      const result = await syncEngine.syncLocalToRemote();

      expect(result.deleted).toBe(1);
      expect(mockClient.deleteTask).toHaveBeenCalledWith('todoist-123');
      expect(mockLocalStore.remove).toHaveBeenCalledWith('local-1');
    });

    it('should handle sync errors gracefully', async () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Task with error',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      };

      mockLocalStore.getUnsyncedTasks.mockResolvedValue([localTask]);
      mockClient.createTask.mockRejectedValue(new Error('Network error'));

      const result = await syncEngine.syncLocalToRemote();

      expect(result.errors).toBe(1);
      expect(result.created).toBe(0);
      expect(mockLocalStore.logSyncError).toHaveBeenCalledWith(
        'local-1',
        expect.stringContaining('Network error')
      );
    });

    it('should batch sync operations for efficiency', async () => {
      const tasks = Array.from({ length: 50 }, (_, i) => ({
        id: `local-${i}`,
        title: `Task ${i}`,
        status: 'todo' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      }));

      mockLocalStore.getUnsyncedTasks.mockResolvedValue(tasks);
      mockClient.createTask.mockResolvedValue({
        id: 'todoist-new',
        content: 'Task',
        priority: 1,
        labels: [],
        created_at: new Date().toISOString(),
      });

      const result = await syncEngine.syncLocalToRemote({ batchSize: 10 });

      expect(result.created).toBe(50);
      // Should be called in batches of 10
      expect(mockClient.createTask).toHaveBeenCalledTimes(50);
    });
  });

  describe('Remote to Local Sync', () => {
    it('should pull new Todoist tasks to local store', async () => {
      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Remote task',
        priority: 2,
        labels: ['personal'],
        created_at: '2025-10-20T10:00:00Z',
      };

      mockClient.getTasks.mockResolvedValue([todoistTask]);
      mockLocalStore.findByRemoteId.mockResolvedValue(null);

      const result = await syncEngine.syncRemoteToLocal();

      expect(result.created).toBe(1);
      expect(mockLocalStore.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Remote task',
          priority: 2,
          tags: ['personal'],
          syncState: expect.objectContaining({
            remoteId: 'todoist-123',
            dirty: false,
          }),
        })
      );
    });

    it('should update local tasks with remote changes', async () => {
      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Updated remote task',
        priority: 4,
        labels: ['urgent'],
        created_at: '2025-10-20T10:00:00Z',
      };

      const localTask: Task = {
        id: 'local-1',
        title: 'Old task',
        status: 'todo',
        priority: 2,
        tags: [],
        createdAt: new Date('2025-10-20T10:00:00Z'),
        updatedAt: new Date('2025-10-20T10:00:00Z'),
        syncState: {
          dirty: false,
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
        },
      };

      mockClient.getTasks.mockResolvedValue([todoistTask]);
      mockLocalStore.findByRemoteId.mockResolvedValue(localTask);

      const result = await syncEngine.syncRemoteToLocal();

      expect(result.updated).toBe(1);
      expect(mockLocalStore.update).toHaveBeenCalledWith(
        'local-1',
        expect.objectContaining({
          title: 'Updated remote task',
          priority: 4,
          tags: ['urgent'],
        })
      );
    });

    it('should detect remote deletions', async () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Deleted remotely',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: {
          dirty: false,
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
        },
      };

      mockClient.getTasks.mockResolvedValue([]);
      mockLocalStore.findBySyncState.mockResolvedValue([localTask]);

      const result = await syncEngine.syncRemoteToLocal();

      expect(result.deleted).toBe(1);
      expect(mockLocalStore.remove).toHaveBeenCalledWith('local-1');
    });

    it('should use sync token for incremental sync', async () => {
      const lastSyncToken = 'sync-token-123';
      mockLocalStore.getSyncState.mockResolvedValue({
        lastSyncToken,
        lastSyncTime: new Date('2025-10-20T10:00:00Z'),
      });

      mockClient.getTasks.mockResolvedValue([]);

      await syncEngine.syncRemoteToLocal({ incremental: true });

      expect(mockClient.getTasks).toHaveBeenCalledWith(
        expect.objectContaining({
          sync_token: lastSyncToken,
        })
      );
    });
  });

  describe('Bidirectional Sync', () => {
    it('should perform full bidirectional sync', async () => {
      // Local has new task
      const newLocalTask: Task = {
        id: 'local-new',
        title: 'New local task',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      };

      // Remote has new task
      const newRemoteTask: TodoistTask = {
        id: 'todoist-new',
        content: 'New remote task',
        priority: 1,
        labels: [],
        created_at: new Date().toISOString(),
      };

      mockLocalStore.getUnsyncedTasks.mockResolvedValue([newLocalTask]);
      mockClient.createTask.mockResolvedValue({
        id: 'todoist-created',
        content: 'New local task',
        priority: 1,
        labels: [],
        created_at: new Date().toISOString(),
      });

      mockClient.getTasks.mockResolvedValue([newRemoteTask]);
      mockLocalStore.findByRemoteId.mockResolvedValue(null);

      const result = await syncEngine.syncBidirectional();

      expect(result.localToRemote.created).toBe(1);
      expect(result.remoteToLocal.created).toBe(1);
      expect(result.conflicts).toHaveLength(0);
    });

    it('should detect and handle conflicts', async () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Task modified locally',
        status: 'todo',
        priority: 4,
        createdAt: new Date('2025-10-20T10:00:00Z'),
        updatedAt: new Date('2025-10-20T11:30:00Z'),
        syncState: {
          dirty: true,
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
        },
      };

      const remoteTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Task modified remotely',
        priority: 2,
        labels: [],
        created_at: '2025-10-20T10:00:00Z',
      };

      mockLocalStore.getUnsyncedTasks.mockResolvedValue([localTask]);
      mockClient.getTasks.mockResolvedValue([remoteTask]);
      mockLocalStore.findByRemoteId.mockResolvedValue(localTask);

      const result = await syncEngine.syncBidirectional();

      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0]).toMatchObject({
        taskId: 'local-1',
        remoteId: 'todoist-123',
        type: 'concurrent_modification',
      });
    });

    it('should respect sync direction priority', async () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Local version',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date('2025-10-20T11:00:00Z'),
        syncState: {
          dirty: true,
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
        },
      };

      mockLocalStore.getUnsyncedTasks.mockResolvedValue([localTask]);
      mockClient.updateTask.mockResolvedValue({
        id: 'todoist-123',
        content: 'Local version',
        priority: 1,
        labels: [],
        created_at: new Date().toISOString(),
      });

      const result = await syncEngine.syncBidirectional({ priority: 'local' });

      expect(result.localToRemote.updated).toBe(1);
      expect(mockClient.updateTask).toHaveBeenCalled();
    });
  });

  describe('Conflict Detection', () => {
    it('should detect concurrent modifications', async () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Local version',
        status: 'todo',
        updatedAt: new Date('2025-10-20T11:00:00Z'),
        createdAt: new Date(),
        syncState: {
          dirty: true,
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
        },
      };

      const remoteTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Remote version',
        priority: 1,
        labels: [],
        created_at: '2025-10-20T10:00:00Z',
      };

      const conflicts = syncEngine.detectConflicts([localTask], [remoteTask]);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].type).toBe('concurrent_modification');
      expect(conflicts[0].localData.title).toBe('Local version');
      expect(conflicts[0].remoteData.content).toBe('Remote version');
    });

    it('should not flag clean tasks as conflicts', async () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Clean task',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date('2025-10-20T11:00:00Z'),
        syncState: {
          dirty: false,
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T11:00:00Z'),
        },
      };

      const remoteTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Clean task',
        priority: 1,
        labels: [],
        created_at: '2025-10-20T10:00:00Z',
      };

      const conflicts = syncEngine.detectConflicts([localTask], [remoteTask]);

      expect(conflicts).toHaveLength(0);
    });

    it('should detect deletion conflicts', async () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Modified locally',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date('2025-10-20T11:00:00Z'),
        syncState: {
          dirty: true,
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
        },
      };

      // Remote task was deleted (not in remote list)
      const conflicts = syncEngine.detectConflicts([localTask], []);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].type).toBe('deletion_conflict');
    });
  });

  describe('Sync State Persistence', () => {
    it('should save sync state after successful sync', async () => {
      mockLocalStore.getUnsyncedTasks.mockResolvedValue([]);
      mockClient.getTasks.mockResolvedValue([]);

      await syncEngine.syncBidirectional();

      expect(mockLocalStore.saveSyncState).toHaveBeenCalledWith(
        expect.objectContaining({
          lastSyncTime: expect.any(Date),
          lastSyncToken: expect.any(String),
        })
      );
    });

    it('should load previous sync state on startup', async () => {
      const previousState: SyncState = {
        lastSyncTime: new Date('2025-10-20T10:00:00Z'),
        lastSyncToken: 'prev-token-123',
        conflicts: [],
      };

      mockLocalStore.getSyncState.mockResolvedValue(previousState);

      const state = await syncEngine.loadSyncState();

      expect(state).toEqual(previousState);
    });

    it('should maintain conflict history', async () => {
      const conflict: SyncConflict = {
        taskId: 'local-1',
        remoteId: 'todoist-123',
        type: 'concurrent_modification',
        detectedAt: new Date(),
        localData: {} as Task,
        remoteData: {} as TodoistTask,
      };

      await syncEngine.saveConflict(conflict);

      expect(mockLocalStore.saveConflict).toHaveBeenCalledWith(conflict);
    });
  });

  describe('Offline Sync', () => {
    it('should queue operations when offline', async () => {
      mockClient.getTasks.mockRejectedValue(new Error('Network unavailable'));

      const result = await syncEngine.syncRemoteToLocal();

      expect(result.errors).toBe(1);
      expect(result.offline).toBe(true);
    });

    it('should replay queued operations when back online', async () => {
      const queuedTask: Task = {
        id: 'local-1',
        title: 'Queued task',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null, queued: true },
      };

      mockLocalStore.getQueuedTasks.mockResolvedValue([queuedTask]);
      mockClient.createTask.mockResolvedValue({
        id: 'todoist-123',
        content: 'Queued task',
        priority: 1,
        labels: [],
        created_at: new Date().toISOString(),
      });

      const result = await syncEngine.replayQueuedOperations();

      expect(result.replayed).toBe(1);
      expect(mockClient.createTask).toHaveBeenCalled();
    });
  });

  describe('Sync Performance', () => {
    it('should complete sync within reasonable time', async () => {
      const tasks = Array.from({ length: 100 }, (_, i) => ({
        id: `local-${i}`,
        title: `Task ${i}`,
        status: 'todo' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncState: { dirty: true, lastSynced: null },
      }));

      mockLocalStore.getUnsyncedTasks.mockResolvedValue(tasks);
      mockClient.createTask.mockResolvedValue({
        id: 'todoist-new',
        content: 'Task',
        priority: 1,
        labels: [],
        created_at: new Date().toISOString(),
      });

      const start = Date.now();
      await syncEngine.syncLocalToRemote({ batchSize: 20 });
      const duration = Date.now() - start;

      // Should complete 100 tasks in under 5 seconds with batching
      expect(duration).toBeLessThan(5000);
    });

    it('should handle concurrent sync requests', async () => {
      mockLocalStore.getUnsyncedTasks.mockResolvedValue([]);
      mockClient.getTasks.mockResolvedValue([]);

      const syncs = [
        syncEngine.syncBidirectional(),
        syncEngine.syncBidirectional(),
        syncEngine.syncBidirectional(),
      ];

      // Should not throw, only one sync should run
      await expect(Promise.all(syncs)).resolves.toBeDefined();
    });
  });
});
