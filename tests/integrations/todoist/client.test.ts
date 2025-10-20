import { TodoistClient } from '../../../src/integrations/todoist/client';
import { TodoistTask, TodoistProject } from '../../../src/integrations/todoist/types';

// Mock fetch globally
global.fetch = jest.fn();

describe('TodoistClient', () => {
  let client: TodoistClient;
  const mockApiToken = 'test-api-token-12345';
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    client = new TodoistClient(mockApiToken);
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should include API token in request headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await client.getTasks();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockApiToken}`,
          }),
        })
      );
    });

    it('should throw error on 401 unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Invalid token' }),
      } as Response);

      await expect(client.getTasks()).rejects.toThrow('Authentication failed');
    });

    it('should validate API token format', () => {
      expect(() => new TodoistClient('')).toThrow('API token is required');
      expect(() => new TodoistClient('   ')).toThrow('API token is required');
    });
  });

  describe('getTasks', () => {
    const mockTasks: TodoistTask[] = [
      {
        id: '1',
        content: 'Test task 1',
        description: 'Task description',
        project_id: 'proj-1',
        due: { date: '2025-10-21', string: 'tomorrow' },
        priority: 4,
        labels: ['work', 'urgent'],
        created_at: '2025-10-20T00:00:00Z',
      },
      {
        id: '2',
        content: 'Test task 2',
        project_id: 'proj-2',
        priority: 1,
        labels: [],
        created_at: '2025-10-20T00:00:00Z',
      },
    ];

    it('should fetch all tasks successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      const tasks = await client.getTasks();

      expect(tasks).toEqual(mockTasks);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/rest/v2/tasks',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should filter tasks by project', async () => {
      const projectId = 'proj-1';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTasks[0]],
      } as Response);

      await client.getTasks({ project_id: projectId });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`project_id=${projectId}`),
        expect.any(Object)
      );
    });

    it('should filter tasks by label', async () => {
      const label = 'work';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTasks[0]],
      } as Response);

      await client.getTasks({ label });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`label=${label}`),
        expect.any(Object)
      );
    });

    it('should handle empty task list', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const tasks = await client.getTasks();

      expect(tasks).toEqual([]);
    });
  });

  describe('createTask', () => {
    const newTask = {
      content: 'New test task',
      description: 'Task description',
      project_id: 'proj-1',
      due_string: 'tomorrow',
      priority: 3,
      labels: ['work'],
    };

    it('should create task successfully', async () => {
      const createdTask: TodoistTask = {
        id: '123',
        ...newTask,
        due: { date: '2025-10-21', string: 'tomorrow' },
        created_at: '2025-10-20T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdTask,
      } as Response);

      const result = await client.createTask(newTask);

      expect(result).toEqual(createdTask);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/rest/v2/tasks',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(newTask),
        })
      );
    });

    it('should create task with minimal data', async () => {
      const minimalTask = { content: 'Minimal task' };
      const createdTask: TodoistTask = {
        id: '124',
        content: 'Minimal task',
        project_id: 'inbox',
        priority: 1,
        labels: [],
        created_at: '2025-10-20T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdTask,
      } as Response);

      const result = await client.createTask(minimalTask);

      expect(result).toEqual(createdTask);
    });

    it('should handle validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid project_id' }),
      } as Response);

      await expect(client.createTask(newTask)).rejects.toThrow('Invalid project_id');
    });
  });

  describe('updateTask', () => {
    const taskId = '123';
    const updates = {
      content: 'Updated content',
      priority: 4,
      labels: ['urgent'],
    };

    it('should update task successfully', async () => {
      const updatedTask: TodoistTask = {
        id: taskId,
        content: updates.content,
        project_id: 'proj-1',
        priority: updates.priority,
        labels: updates.labels,
        created_at: '2025-10-20T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedTask,
      } as Response);

      const result = await client.updateTask(taskId, updates);

      expect(result).toEqual(updatedTask);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.todoist.com/rest/v2/tasks/${taskId}`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(updates),
        })
      );
    });

    it('should handle task not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Task not found' }),
      } as Response);

      await expect(client.updateTask(taskId, updates)).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    const taskId = '123';

    it('should delete task successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);

      await expect(client.deleteTask(taskId)).resolves.not.toThrow();

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.todoist.com/rest/v2/tasks/${taskId}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should handle task not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Task not found' }),
      } as Response);

      await expect(client.deleteTask(taskId)).rejects.toThrow('Task not found');
    });
  });

  describe('completeTask', () => {
    const taskId = '123';

    it('should complete task successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);

      await expect(client.completeTask(taskId)).resolves.not.toThrow();

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.todoist.com/rest/v2/tasks/${taskId}/close`,
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('getProjects', () => {
    const mockProjects: TodoistProject[] = [
      {
        id: 'proj-1',
        name: 'Work',
        color: 'blue',
        parent_id: null,
        order: 1,
        is_favorite: true,
      },
      {
        id: 'proj-2',
        name: 'Personal',
        color: 'green',
        parent_id: null,
        order: 2,
        is_favorite: false,
      },
    ];

    it('should fetch all projects successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjects,
      } as Response);

      const projects = await client.getProjects();

      expect(projects).toEqual(mockProjects);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/rest/v2/projects',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('Rate Limiting', () => {
    it('should handle rate limit errors (429)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Headers({
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + 60000),
        }),
        json: async () => ({ error: 'Rate limit exceeded' }),
      } as Response);

      await expect(client.getTasks()).rejects.toThrow('Rate limit exceeded');
    });

    it('should respect rate limit headers', async () => {
      const resetTime = Date.now() + 60000;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({
          'X-RateLimit-Remaining': '5',
          'X-RateLimit-Reset': String(resetTime),
        }),
        json: async () => [],
      } as Response);

      await client.getTasks();

      const rateLimitInfo = client.getRateLimitInfo();
      expect(rateLimitInfo.remaining).toBe(5);
      expect(rateLimitInfo.reset).toBe(resetTime);
    });

    it('should implement exponential backoff on rate limit', async () => {
      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.resolve({
            ok: false,
            status: 429,
            json: async () => ({ error: 'Rate limit exceeded' }),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          json: async () => [],
        } as Response);
      });

      const clientWithRetry = new TodoistClient(mockApiToken, { maxRetries: 3 });
      await clientWithRetry.getTasks();

      expect(callCount).toBe(3);
    });
  });

  describe('Network Error Handling', () => {
    it('should handle network timeout', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

      await expect(client.getTasks()).rejects.toThrow('Network timeout');
    });

    it('should handle connection refused', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      await expect(client.getTasks()).rejects.toThrow('Connection refused');
    });

    it('should retry on network errors', async () => {
      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount < 2) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: async () => [],
        } as Response);
      });

      const clientWithRetry = new TodoistClient(mockApiToken, { maxRetries: 3 });
      await clientWithRetry.getTasks();

      expect(callCount).toBe(2);
    });
  });

  describe('Error Response Handling', () => {
    it('should handle 500 internal server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' }),
      } as Response);

      await expect(client.getTasks()).rejects.toThrow('Server error');
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      } as Response);

      await expect(client.getTasks()).rejects.toThrow('Unexpected token');
    });

    it('should provide detailed error messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          details: { content: 'Content is required' },
        }),
      } as Response);

      await expect(client.createTask({ content: '' })).rejects.toThrow('Validation failed');
    });
  });

  describe('Request Deduplication', () => {
    it('should deduplicate concurrent identical requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      const clientWithDedup = new TodoistClient(mockApiToken, { deduplicateRequests: true });

      // Make 3 identical concurrent requests
      await Promise.all([
        clientWithDedup.getTasks(),
        clientWithDedup.getTasks(),
        clientWithDedup.getTasks(),
      ]);

      // Should only make 1 actual API call
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Sync Token Support', () => {
    it('should support sync token for incremental sync', async () => {
      const syncToken = 'sync-token-123';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({
          'X-Sync-Token': 'sync-token-124',
        }),
        json: async () => [],
      } as Response);

      const result = await client.getTasks({ sync_token: syncToken });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`sync_token=${syncToken}`),
        expect.any(Object)
      );
    });
  });
});
