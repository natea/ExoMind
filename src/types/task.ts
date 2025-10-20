/**
 * Task Type Definitions for Life OS
 *
 * Core task interface used across the application for task management,
 * sync with external services, and coordination between modules.
 */

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'deleted' | 'cancelled';

export type TaskPriority = 1 | 2 | 3 | 4; // 1=low, 2=medium, 3=high, 4=urgent

export interface SyncState {
  remoteId?: string;
  dirty: boolean;
  lastSynced: Date | null;
  queued?: boolean;
}

export interface TaskMetadata {
  [key: string]: any;
  todoist?: {
    project_id?: string;
    section_id?: string;
    parent_id?: string;
    order?: number;
    [key: string]: any;
  };
  energy?: 'low' | 'medium' | 'high';
  estimatedTime?: number; // minutes
}

/**
 * Main Task interface for Life OS
 * Compatible with Todoist integration and other external services
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
  project?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  syncState?: SyncState;
  metadata?: TaskMetadata;
}

/**
 * Task creation parameters (partial Task)
 */
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Task update parameters
 */
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt'>> & {
  id: string;
};

/**
 * Task filter options
 */
export interface TaskFilter {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  tags?: string[];
  project?: string;
  dueDate?: {
    before?: Date;
    after?: Date;
    on?: Date;
  };
  search?: string;
}

/**
 * Task sort options
 */
export interface TaskSort {
  field: 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}
