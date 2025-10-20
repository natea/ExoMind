import { TodoistMapper } from '../../../src/integrations/todoist/mapper';
import { Task } from '../../../src/types/task';
import { TodoistTask } from '../../../src/integrations/todoist/types';

describe('TodoistMapper', () => {
  let mapper: TodoistMapper;

  beforeEach(() => {
    mapper = new TodoistMapper();
  });

  describe('Life OS to Todoist Conversion', () => {
    it('should map basic task properties', () => {
      const task: Task = {
        id: 'local-1',
        title: 'Test task',
        description: 'Task description',
        status: 'todo',
        priority: 3,
        tags: ['work'],
        createdAt: new Date('2025-10-20T10:00:00Z'),
        updatedAt: new Date('2025-10-20T10:00:00Z'),
      };

      const todoistTask = mapper.toTodoist(task);

      expect(todoistTask).toMatchObject({
        content: 'Test task',
        description: 'Task description',
        priority: 3,
        labels: ['work'],
      });
    });

    it('should convert Life OS priority to Todoist priority', () => {
      const priorities: Array<[number, number]> = [
        [1, 1], // Low -> p4
        [2, 2], // Medium -> p3
        [3, 3], // High -> p2
        [4, 4], // Urgent -> p1
      ];

      priorities.forEach(([lifeOsPriority, todoistPriority]) => {
        const task: Task = {
          id: 'test',
          title: 'Test',
          status: 'todo',
          priority: lifeOsPriority,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = mapper.toTodoist(task);
        expect(result.priority).toBe(todoistPriority);
      });
    });

    it('should map context tags to Todoist labels', () => {
      const task: Task = {
        id: 'local-1',
        title: 'Test task',
        status: 'todo',
        tags: ['@work', '@computer', 'project-alpha'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const todoistTask = mapper.toTodoist(task);

      expect(todoistTask.labels).toEqual(['work', 'computer', 'project-alpha']);
    });

    it('should convert due dates to Todoist format', () => {
      const task: Task = {
        id: 'local-1',
        title: 'Test task',
        status: 'todo',
        dueDate: new Date('2025-10-25T14:30:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const todoistTask = mapper.toTodoist(task);

      expect(todoistTask.due_date).toBe('2025-10-25');
      expect(todoistTask.due_datetime).toBe('2025-10-25T14:30:00Z');
    });

    it('should map project to Todoist project_id', () => {
      const task: Task = {
        id: 'local-1',
        title: 'Test task',
        status: 'todo',
        project: 'Work',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const todoistTask = mapper.toTodoist(task, {
        projectMapping: { Work: 'todoist-proj-123' },
      });

      expect(todoistTask.project_id).toBe('todoist-proj-123');
    });

    it('should handle tasks without optional fields', () => {
      const minimalTask: Task = {
        id: 'local-1',
        title: 'Minimal task',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const todoistTask = mapper.toTodoist(minimalTask);

      expect(todoistTask).toMatchObject({
        content: 'Minimal task',
        priority: 1, // default
      });
      expect(todoistTask.labels).toEqual([]);
      expect(todoistTask.description).toBeUndefined();
      expect(todoistTask.due_date).toBeUndefined();
    });

    it('should preserve custom Todoist fields', () => {
      const task: Task = {
        id: 'local-1',
        title: 'Test task',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          todoist: {
            section_id: 'section-123',
            parent_id: 'parent-456',
            order: 5,
          },
        },
      };

      const todoistTask = mapper.toTodoist(task);

      expect(todoistTask.section_id).toBe('section-123');
      expect(todoistTask.parent_id).toBe('parent-456');
      expect(todoistTask.order).toBe(5);
    });
  });

  describe('Todoist to Life OS Conversion', () => {
    it('should map basic Todoist task properties', () => {
      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Todoist task',
        description: 'Task description',
        priority: 2,
        labels: ['work', 'urgent'],
        created_at: '2025-10-20T10:00:00Z',
      };

      const task = mapper.fromTodoist(todoistTask);

      expect(task).toMatchObject({
        title: 'Todoist task',
        description: 'Task description',
        priority: 2,
        tags: ['work', 'urgent'],
        status: 'todo',
      });
    });

    it('should convert Todoist priority to Life OS priority', () => {
      const priorities: Array<[number, number]> = [
        [4, 4], // p1 -> Urgent
        [3, 3], // p2 -> High
        [2, 2], // p3 -> Medium
        [1, 1], // p4 -> Low
      ];

      priorities.forEach(([todoistPriority, lifeOsPriority]) => {
        const todoistTask: TodoistTask = {
          id: 'test',
          content: 'Test',
          priority: todoistPriority,
          labels: [],
          created_at: new Date().toISOString(),
        };

        const result = mapper.fromTodoist(todoistTask);
        expect(result.priority).toBe(lifeOsPriority);
      });
    });

    it('should parse Todoist due dates', () => {
      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Task with due date',
        priority: 1,
        labels: [],
        due: {
          date: '2025-10-25',
          string: 'Oct 25',
          datetime: '2025-10-25T14:30:00Z',
        },
        created_at: '2025-10-20T10:00:00Z',
      };

      const task = mapper.fromTodoist(todoistTask);

      expect(task.dueDate).toEqual(new Date('2025-10-25T14:30:00Z'));
    });

    it('should handle all-day due dates', () => {
      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'All-day task',
        priority: 1,
        labels: [],
        due: {
          date: '2025-10-25',
          string: 'Oct 25',
        },
        created_at: '2025-10-20T10:00:00Z',
      };

      const task = mapper.fromTodoist(todoistTask);

      expect(task.dueDate).toEqual(new Date('2025-10-25T00:00:00Z'));
    });

    it('should map Todoist labels to Life OS tags', () => {
      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Task with labels',
        priority: 1,
        labels: ['work', 'computer', 'urgent'],
        created_at: '2025-10-20T10:00:00Z',
      };

      const task = mapper.fromTodoist(todoistTask);

      expect(task.tags).toEqual(['work', 'computer', 'urgent']);
    });

    it('should restore context tags format', () => {
      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Task',
        priority: 1,
        labels: ['work', 'computer'],
        created_at: '2025-10-20T10:00:00Z',
      };

      const task = mapper.fromTodoist(todoistTask, {
        restoreContextFormat: true,
      });

      expect(task.tags).toEqual(['@work', '@computer']);
    });

    it('should set sync metadata', () => {
      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Task',
        priority: 1,
        labels: [],
        created_at: '2025-10-20T10:00:00Z',
      };

      const task = mapper.fromTodoist(todoistTask);

      expect(task.syncState).toMatchObject({
        remoteId: 'todoist-123',
        dirty: false,
        lastSynced: expect.any(Date),
      });
    });

    it('should store Todoist-specific metadata', () => {
      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Task',
        priority: 1,
        labels: [],
        project_id: 'proj-456',
        section_id: 'section-789',
        parent_id: 'parent-012',
        order: 3,
        created_at: '2025-10-20T10:00:00Z',
      };

      const task = mapper.fromTodoist(todoistTask);

      expect(task.metadata?.todoist).toMatchObject({
        project_id: 'proj-456',
        section_id: 'section-789',
        parent_id: 'parent-012',
        order: 3,
      });
    });
  });

  describe('Context Tag Mapping', () => {
    it('should map GTD contexts to appropriate tags', () => {
      const contexts = {
        '@work': 'work',
        '@home': 'home',
        '@computer': 'computer',
        '@phone': 'phone',
        '@errands': 'errands',
        '@waiting': 'waiting',
      };

      Object.entries(contexts).forEach(([context, label]) => {
        const task: Task = {
          id: 'test',
          title: 'Test',
          status: 'todo',
          tags: [context],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const todoistTask = mapper.toTodoist(task);
        expect(todoistTask.labels).toContain(label);
      });
    });

    it('should preserve custom tags without @ prefix', () => {
      const task: Task = {
        id: 'test',
        title: 'Test',
        status: 'todo',
        tags: ['project-alpha', 'urgent', 'review'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const todoistTask = mapper.toTodoist(task);
      expect(todoistTask.labels).toEqual(['project-alpha', 'urgent', 'review']);
    });
  });

  describe('Priority Mapping Edge Cases', () => {
    it('should handle out-of-range priorities', () => {
      const task: Task = {
        id: 'test',
        title: 'Test',
        status: 'todo',
        priority: 10, // Invalid, should default
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const todoistTask = mapper.toTodoist(task);
      expect(todoistTask.priority).toBe(1); // Default to low
    });

    it('should handle undefined priority', () => {
      const task: Task = {
        id: 'test',
        title: 'Test',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const todoistTask = mapper.toTodoist(task);
      expect(todoistTask.priority).toBe(1);
    });
  });

  describe('Date Format Conversion', () => {
    it('should convert various date formats', () => {
      const dateFormats = [
        new Date('2025-10-25T14:30:00Z'),
        new Date('2025-10-25'),
        new Date(2025, 9, 25), // Month is 0-indexed
      ];

      dateFormats.forEach((date) => {
        const task: Task = {
          id: 'test',
          title: 'Test',
          status: 'todo',
          dueDate: date,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const todoistTask = mapper.toTodoist(task);
        expect(todoistTask.due_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('should handle timezone conversions', () => {
      const task: Task = {
        id: 'test',
        title: 'Test',
        status: 'todo',
        dueDate: new Date('2025-10-25T23:00:00-05:00'), // EST
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const todoistTask = mapper.toTodoist(task);
      expect(todoistTask.due_datetime).toContain('Z'); // Should be UTC
    });
  });

  describe('Bidirectional Consistency', () => {
    it('should maintain data through round-trip conversion', () => {
      const originalTask: Task = {
        id: 'local-1',
        title: 'Round-trip task',
        description: 'Test description',
        status: 'todo',
        priority: 3,
        tags: ['work', 'urgent'],
        dueDate: new Date('2025-10-25T14:30:00Z'),
        createdAt: new Date('2025-10-20T10:00:00Z'),
        updatedAt: new Date('2025-10-20T10:00:00Z'),
      };

      // Life OS -> Todoist -> Life OS
      const todoistTask = mapper.toTodoist(originalTask);
      const roundTripTask = mapper.fromTodoist({
        ...todoistTask,
        id: 'todoist-123',
        created_at: originalTask.createdAt.toISOString(),
      });

      expect(roundTripTask.title).toBe(originalTask.title);
      expect(roundTripTask.description).toBe(originalTask.description);
      expect(roundTripTask.priority).toBe(originalTask.priority);
      expect(roundTripTask.tags).toEqual(originalTask.tags);
      expect(roundTripTask.dueDate?.getTime()).toBe(originalTask.dueDate?.getTime());
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed Todoist task', () => {
      const malformedTask = {
        id: 'todoist-123',
        // Missing required fields
      } as TodoistTask;

      expect(() => mapper.fromTodoist(malformedTask)).toThrow();
    });

    it('should handle invalid date strings', () => {
      const todoistTask: TodoistTask = {
        id: 'todoist-123',
        content: 'Task',
        priority: 1,
        labels: [],
        due: {
          date: 'invalid-date',
          string: 'invalid',
        },
        created_at: '2025-10-20T10:00:00Z',
      };

      const task = mapper.fromTodoist(todoistTask);
      expect(task.dueDate).toBeUndefined();
    });
  });

  describe('Custom Field Mapping', () => {
    it('should support custom field mappers', () => {
      const customMapper = new TodoistMapper({
        customFields: {
          energy: (task: Task) => task.metadata?.energy || 'medium',
        },
      });

      const task: Task = {
        id: 'test',
        title: 'Test',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { energy: 'high' },
      };

      const todoistTask = customMapper.toTodoist(task);
      expect(todoistTask.description).toContain('Energy: high');
    });
  });
});
