/**
 * Todoist API Client
 *
 * Handles authentication and API communication with Todoist
 * Rate limit: 50 requests per minute
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  TodoistTask,
  TodoistProject,
  TodoistLabel,
  TodoistComment,
  TodoistSyncResponse,
  TodoistCommand,
  TodoistApiError,
  RateLimitState
} from '../../types/todoist';

export class TodoistClient {
  private client: AxiosInstance;
  private rateLimitState: RateLimitState;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  constructor(private apiToken: string) {
    this.client = axios.create({
      baseURL: 'https://api.todoist.com/rest/v2',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    this.rateLimitState = {
      remaining: 50,
      reset: Date.now() + 60000,
      limit: 50
    };

    // Add response interceptor for rate limit tracking
    this.client.interceptors.response.use(
      (response) => {
        this.updateRateLimitFromHeaders(response.headers);
        return response;
      },
      (error) => {
        if (error.response) {
          this.updateRateLimitFromHeaders(error.response.headers);
        }
        return Promise.reject(error);
      }
    );
  }

  private updateRateLimitFromHeaders(headers: any): void {
    if (headers['x-ratelimit-remaining']) {
      this.rateLimitState.remaining = parseInt(headers['x-ratelimit-remaining']);
    }
    if (headers['x-ratelimit-reset']) {
      this.rateLimitState.reset = parseInt(headers['x-ratelimit-reset']) * 1000;
    }
  }

  private async waitForRateLimit(): Promise<void> {
    if (this.rateLimitState.remaining <= 1) {
      const waitTime = this.rateLimitState.reset - Date.now();
      if (waitTime > 0) {
        console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime + 1000));
        this.rateLimitState.remaining = this.rateLimitState.limit;
      }
    }
  }

  private async queueRequest<T>(fn: () => Promise<T>): Promise<T> {
    await this.waitForRateLimit();

    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        await request();
        // Small delay between requests to avoid hitting rate limit
        await new Promise(resolve => setTimeout(resolve, 1200)); // 50 per minute = 1.2s per request
      }
    }

    this.isProcessingQueue = false;
  }

  private handleApiError(error: AxiosError<TodoistApiError>): never {
    if (error.response) {
      const apiError = error.response.data;
      throw new Error(`Todoist API Error: ${apiError.error} (${apiError.http_code})`);
    } else if (error.request) {
      throw new Error('No response from Todoist API. Check your network connection.');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  // Tasks API

  async getTasks(params?: {
    project_id?: string;
    label?: string;
    filter?: string;
  }): Promise<TodoistTask[]> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.get('/tasks', { params });
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  async getTask(taskId: string): Promise<TodoistTask> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.get(`/tasks/${taskId}`);
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  async createTask(task: Partial<TodoistTask>): Promise<TodoistTask> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.post('/tasks', task);
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  async updateTask(taskId: string, updates: Partial<TodoistTask>): Promise<TodoistTask> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.post(`/tasks/${taskId}`, updates);
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.queueRequest(async () => {
      try {
        await this.client.delete(`/tasks/${taskId}`);
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  async completeTask(taskId: string): Promise<void> {
    return this.queueRequest(async () => {
      try {
        await this.client.post(`/tasks/${taskId}/close`);
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  async reopenTask(taskId: string): Promise<void> {
    return this.queueRequest(async () => {
      try {
        await this.client.post(`/tasks/${taskId}/reopen`);
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  // Projects API

  async getProjects(): Promise<TodoistProject[]> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.get('/projects');
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  async getProject(projectId: string): Promise<TodoistProject> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.get(`/projects/${projectId}`);
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  async createProject(project: Partial<TodoistProject>): Promise<TodoistProject> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.post('/projects', project);
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  // Labels API

  async getLabels(): Promise<TodoistLabel[]> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.get('/labels');
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  async createLabel(label: Partial<TodoistLabel>): Promise<TodoistLabel> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.post('/labels', label);
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  // Comments API

  async getComments(taskId: string): Promise<TodoistComment[]> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.get('/comments', {
          params: { task_id: taskId }
        });
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  async createComment(taskId: string, content: string): Promise<TodoistComment> {
    return this.queueRequest(async () => {
      try {
        const response = await this.client.post('/comments', {
          task_id: taskId,
          content
        });
        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  // Sync API (v9) - for bulk operations and offline sync

  async sync(
    syncToken: string = '*',
    resourceTypes: string[] = ['all'],
    commands: TodoistCommand[] = []
  ): Promise<TodoistSyncResponse> {
    return this.queueRequest(async () => {
      try {
        const syncClient = axios.create({
          baseURL: 'https://api.todoist.com/sync/v9',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        });

        const response = await syncClient.post('/sync', {
          sync_token: syncToken,
          resource_types: resourceTypes,
          commands: commands.length > 0 ? commands : undefined
        });

        return response.data;
      } catch (error) {
        this.handleApiError(error as AxiosError<TodoistApiError>);
      }
    });
  }

  // Utility methods

  getRateLimitState(): RateLimitState {
    return { ...this.rateLimitState };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getProjects();
      return true;
    } catch (error) {
      console.error('Todoist connection test failed:', error);
      return false;
    }
  }
}
