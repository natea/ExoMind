import { ConflictResolver } from '../../../src/integrations/todoist/conflict-resolver';
import { Task } from '../../../src/types/task';
import { TodoistTask } from '../../../src/integrations/todoist/types';
import { SyncConflict, ResolutionStrategy } from '../../../src/integrations/todoist/sync-types';

describe('ConflictResolver', () => {
  let resolver: ConflictResolver;

  beforeEach(() => {
    resolver = new ConflictResolver();
  });

  describe('Conflict Detection', () => {
    it('should detect concurrent modifications', () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Local version',
        status: 'todo',
        priority: 4,
        createdAt: new Date('2025-10-20T10:00:00Z'),
        updatedAt: new Date('2025-10-20T11:00:00Z'),
        syncState: {
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
          dirty: true,
        },
      };

      const remoteTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Remote version',
        priority: 2,
        labels: [],
        created_at: '2025-10-20T10:00:00Z',
      };

      const conflict = resolver.detectConflict(localTask, remoteTask);

      expect(conflict).toBeDefined();
      expect(conflict?.type).toBe('concurrent_modification');
      expect(conflict?.taskId).toBe('local-1');
      expect(conflict?.remoteId).toBe('todoist-123');
    });

    it('should not detect conflict for clean local task', () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Same version',
        status: 'todo',
        createdAt: new Date('2025-10-20T10:00:00Z'),
        updatedAt: new Date('2025-10-20T10:00:00Z'),
        syncState: {
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
          dirty: false,
        },
      };

      const remoteTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Same version',
        priority: 1,
        labels: [],
        created_at: '2025-10-20T10:00:00Z',
      };

      const conflict = resolver.detectConflict(localTask, remoteTask);

      expect(conflict).toBeNull();
    });

    it('should detect deletion conflicts', () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Modified locally',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date('2025-10-20T11:00:00Z'),
        syncState: {
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
          dirty: true,
        },
      };

      const conflict = resolver.detectConflict(localTask, null);

      expect(conflict).toBeDefined();
      expect(conflict?.type).toBe('deletion_conflict');
    });

    it('should identify specific conflicting fields', () => {
      const localTask: Task = {
        id: 'local-1',
        title: 'Different title',
        description: 'Same description',
        status: 'todo',
        priority: 4,
        tags: ['work'],
        createdAt: new Date(),
        updatedAt: new Date('2025-10-20T11:00:00Z'),
        syncState: {
          remoteId: 'todoist-123',
          lastSynced: new Date('2025-10-20T10:00:00Z'),
          dirty: true,
        },
      };

      const remoteTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Different remote title',
        description: 'Same description',
        priority: 2,
        labels: ['personal'],
        created_at: '2025-10-20T10:00:00Z',
      };

      const conflict = resolver.detectConflict(localTask, remoteTask);

      expect(conflict?.conflictingFields).toContain('title');
      expect(conflict?.conflictingFields).toContain('priority');
      expect(conflict?.conflictingFields).toContain('tags');
      expect(conflict?.conflictingFields).not.toContain('description');
    });
  });

  describe('Resolution Strategies', () => {
    const localTask: Task = {
      id: 'local-1',
      title: 'Local version',
      description: 'Local desc',
      status: 'todo',
      priority: 4,
      tags: ['work'],
      createdAt: new Date('2025-10-20T10:00:00Z'),
      updatedAt: new Date('2025-10-20T11:00:00Z'),
      syncState: {
        remoteId: 'todoist-123',
        lastSynced: new Date('2025-10-20T10:00:00Z'),
        dirty: true,
      },
    };

    const remoteTask: TodoistTask = {
      id: 'todoist-123',
      content: 'Remote version',
      description: 'Remote desc',
      priority: 2,
      labels: ['personal'],
      created_at: '2025-10-20T10:00:00Z',
    };

    const conflict: SyncConflict = {
      taskId: 'local-1',
      remoteId: 'todoist-123',
      type: 'concurrent_modification',
      detectedAt: new Date(),
      localData: localTask,
      remoteData: remoteTask,
      conflictingFields: ['title', 'description', 'priority', 'tags'],
    };

    describe('Local Wins Strategy', () => {
      it('should keep local version', () => {
        const resolved = resolver.resolve(conflict, 'local-wins');

        expect(resolved.title).toBe('Local version');
        expect(resolved.description).toBe('Local desc');
        expect(resolved.priority).toBe(4);
        expect(resolved.tags).toEqual(['work']);
      });
    });

    describe('Remote Wins Strategy', () => {
      it('should keep remote version', () => {
        const resolved = resolver.resolve(conflict, 'remote-wins');

        expect(resolved.title).toBe('Remote version');
        expect(resolved.description).toBe('Remote desc');
        expect(resolved.priority).toBe(2);
        expect(resolved.tags).toEqual(['personal']);
      });
    });

    describe('Latest Timestamp Strategy', () => {
      it('should keep version with latest timestamp', () => {
        const resolved = resolver.resolve(conflict, 'latest-timestamp');

        // Local task has later updatedAt
        expect(resolved.title).toBe('Local version');
      });

      it('should prefer remote when remote is newer', () => {
        const newerConflict = {
          ...conflict,
          localData: {
            ...localTask,
            updatedAt: new Date('2025-10-20T09:00:00Z'),
          },
        };

        const resolved = resolver.resolve(newerConflict, 'latest-timestamp');
        expect(resolved.title).toBe('Remote version');
      });
    });

    describe('Field-Level Merge Strategy', () => {
      it('should merge non-conflicting fields', () => {
        const partialConflict: SyncConflict = {
          ...conflict,
          conflictingFields: ['title'],
          localData: {
            ...localTask,
            description: 'Local only field',
          },
          remoteData: {
            ...remoteTask,
            description: undefined,
          },
        };

        const resolved = resolver.resolve(partialConflict, 'field-level-merge');

        expect(resolved.description).toBe('Local only field');
      });

      it('should keep latest for each conflicting field', () => {
        const resolved = resolver.resolve(conflict, 'field-level-merge');

        // Latest local changes should be preferred
        expect(resolved.title).toBe('Local version');
        expect(resolved.priority).toBe(4);
      });

      it('should merge array fields', () => {
        const arrayConflict: SyncConflict = {
          ...conflict,
          localData: {
            ...localTask,
            tags: ['work', 'urgent'],
          },
          remoteData: {
            ...remoteTask,
            labels: ['personal', 'important'],
          },
        };

        const resolved = resolver.resolve(arrayConflict, 'field-level-merge');
        expect(resolved.tags).toEqual(['work', 'urgent', 'personal', 'important']);
      });
    });

    describe('Manual Resolution', () => {
      it('should support manual resolution callback', () => {
        const manualResolver = (conflict: SyncConflict): Task => {
          return {
            ...conflict.localData,
            title: 'Manually resolved',
            description: conflict.remoteData.description,
          };
        };

        const resolved = resolver.resolve(conflict, 'manual', manualResolver);

        expect(resolved.title).toBe('Manually resolved');
        expect(resolved.description).toBe('Remote desc');
      });

      it('should throw if manual resolver not provided', () => {
        expect(() => resolver.resolve(conflict, 'manual')).toThrow();
      });
    });
  });

  describe('Conflict Logging', () => {
    it('should log conflict details', () => {
      const conflict: SyncConflict = {
        taskId: 'local-1',
        remoteId: 'todoist-123',
        type: 'concurrent_modification',
        detectedAt: new Date(),
        localData: {} as Task,
        remoteData: {} as TodoistTask,
        conflictingFields: ['title', 'priority'],
      };

      const log = resolver.logConflict(conflict);

      expect(log).toContain('local-1');
      expect(log).toContain('todoist-123');
      expect(log).toContain('concurrent_modification');
      expect(log).toContain('title');
      expect(log).toContain('priority');
    });

    it('should provide resolution suggestions', () => {
      const conflict: SyncConflict = {
        taskId: 'local-1',
        remoteId: 'todoist-123',
        type: 'concurrent_modification',
        detectedAt: new Date(),
        localData: {
          updatedAt: new Date('2025-10-20T11:00:00Z'),
        } as Task,
        remoteData: {} as TodoistTask,
        conflictingFields: ['title'],
      };

      const suggestions = resolver.getSuggestions(conflict);

      expect(suggestions).toContain('local-wins');
      expect(suggestions).toContain('remote-wins');
      expect(suggestions).toContain('latest-timestamp');
      expect(suggestions).toContain('field-level-merge');
    });
  });

  describe('Deletion Conflicts', () => {
    it('should handle local deletion vs remote modification', () => {
      const conflict: SyncConflict = {
        taskId: 'local-1',
        remoteId: 'todoist-123',
        type: 'deletion_conflict',
        detectedAt: new Date(),
        localData: {
          status: 'deleted',
          updatedAt: new Date('2025-10-20T11:00:00Z'),
        } as Task,
        remoteData: {
          id: 'todoist-123',
          content: 'Modified remotely',
          priority: 4,
          labels: [],
          created_at: '2025-10-20T10:00:00Z',
        },
        conflictingFields: [],
      };

      const resolved = resolver.resolve(conflict, 'local-wins');
      expect(resolved.status).toBe('deleted');

      const resolvedRemote = resolver.resolve(conflict, 'remote-wins');
      expect(resolvedRemote.status).toBe('todo');
    });

    it('should handle remote deletion vs local modification', () => {
      const conflict: SyncConflict = {
        taskId: 'local-1',
        remoteId: 'todoist-123',
        type: 'deletion_conflict',
        detectedAt: new Date(),
        localData: {
          title: 'Modified locally',
          status: 'todo',
          updatedAt: new Date('2025-10-20T11:00:00Z'),
        } as Task,
        remoteData: null,
        conflictingFields: [],
      };

      const resolved = resolver.resolve(conflict, 'local-wins');
      expect(resolved.status).toBe('todo');

      const resolvedRemote = resolver.resolve(conflict, 'remote-wins');
      expect(resolvedRemote.status).toBe('deleted');
    });
  });

  describe('Conflict History', () => {
    it('should maintain conflict resolution history', () => {
      const conflict: SyncConflict = {
        taskId: 'local-1',
        remoteId: 'todoist-123',
        type: 'concurrent_modification',
        detectedAt: new Date(),
        localData: {} as Task,
        remoteData: {} as TodoistTask,
        conflictingFields: ['title'],
      };

      resolver.resolve(conflict, 'local-wins');

      const history = resolver.getHistory('local-1');
      expect(history).toHaveLength(1);
      expect(history[0].strategy).toBe('local-wins');
      expect(history[0].timestamp).toBeDefined();
    });

    it('should support conflict resolution replay', () => {
      const conflicts: SyncConflict[] = [
        {
          taskId: 'local-1',
          remoteId: 'todoist-123',
          type: 'concurrent_modification',
          detectedAt: new Date(),
          localData: { title: 'V1' } as Task,
          remoteData: { content: 'V1-remote' } as TodoistTask,
          conflictingFields: ['title'],
        },
        {
          taskId: 'local-1',
          remoteId: 'todoist-123',
          type: 'concurrent_modification',
          detectedAt: new Date(),
          localData: { title: 'V2' } as Task,
          remoteData: { content: 'V2-remote' } as TodoistTask,
          conflictingFields: ['title'],
        },
      ];

      const resolved = resolver.replayResolutions(conflicts, 'local-wins');

      expect(resolved).toHaveLength(2);
      expect(resolved[1].title).toBe('V2');
    });
  });

  describe('Merge Algorithms', () => {
    it('should perform three-way merge for text fields', () => {
      const base = 'Original text';
      const local = 'Original text with local changes';
      const remote = 'Original text with remote changes';

      const merged = resolver.threeWayMerge(base, local, remote);

      expect(merged).toContain('local changes');
      expect(merged).toContain('remote changes');
    });

    it('should detect merge conflicts in text', () => {
      const base = 'Line 1\nLine 2\nLine 3';
      const local = 'Line 1\nLocal Line 2\nLine 3';
      const remote = 'Line 1\nRemote Line 2\nLine 3';

      expect(() => resolver.threeWayMerge(base, local, remote)).toThrow('Merge conflict');
    });
  });

  describe('Custom Resolution Rules', () => {
    it('should support priority-based resolution', () => {
      const resolverWithRules = new ConflictResolver({
        rules: {
          priority: 'always-higher',
          dueDate: 'always-earlier',
        },
      });

      const conflict: SyncConflict = {
        taskId: 'local-1',
        remoteId: 'todoist-123',
        type: 'concurrent_modification',
        detectedAt: new Date(),
        localData: {
          priority: 4,
          dueDate: new Date('2025-10-25'),
        } as Task,
        remoteData: {
          priority: 2,
          due: { date: '2025-10-22' },
        } as TodoistTask,
        conflictingFields: ['priority', 'dueDate'],
      };

      const resolved = resolverWithRules.resolve(conflict, 'custom-rules');

      expect(resolved.priority).toBe(4); // Higher priority
      expect(resolved.dueDate).toEqual(new Date('2025-10-22')); // Earlier date
    });
  });

  describe('Batch Conflict Resolution', () => {
    it('should resolve multiple conflicts efficiently', () => {
      const conflicts: SyncConflict[] = Array.from({ length: 10 }, (_, i) => ({
        taskId: `local-${i}`,
        remoteId: `todoist-${i}`,
        type: 'concurrent_modification' as const,
        detectedAt: new Date(),
        localData: { title: `Local ${i}` } as Task,
        remoteData: { content: `Remote ${i}` } as TodoistTask,
        conflictingFields: ['title'],
      }));

      const resolved = resolver.resolveBatch(conflicts, 'local-wins');

      expect(resolved).toHaveLength(10);
      resolved.forEach((task, i) => {
        expect(task.title).toBe(`Local ${i}`);
      });
    });
  });
});
