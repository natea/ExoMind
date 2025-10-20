/**
 * Todoist Data Mapper
 *
 * Maps between Life OS task format and Todoist task format
 */

import { TodoistTask, TodoistProject } from '../../types/todoist';

export interface LifeOSTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  context?: string[];
  tags?: string[];
  project?: string;
  energy?: 'low' | 'medium' | 'high';
  estimatedTime?: number; // minutes
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export class TodoistMapper {
  private readonly priorityMapping: Record<LifeOSTask['priority'], number> = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'urgent': 4
  };

  private readonly reversePriorityMapping: Record<number, LifeOSTask['priority']> = {
    1: 'low',
    2: 'medium',
    3: 'high',
    4: 'urgent'
  };

  private readonly statusMapping: Record<LifeOSTask['status'], boolean> = {
    'todo': false,
    'in-progress': false,
    'done': true,
    'cancelled': true
  };

  /**
   * Convert Life OS task to Todoist task format
   */
  toTodoistTask(
    lifeOSTask: LifeOSTask,
    projectId: string,
    existingTodoistId?: string
  ): Partial<TodoistTask> {
    const todoistTask: Partial<TodoistTask> = {
      content: lifeOSTask.title,
      description: lifeOSTask.description || '',
      project_id: projectId,
      priority: this.priorityMapping[lifeOSTask.priority],
      labels: this.mapLabels(lifeOSTask)
    };

    if (existingTodoistId) {
      todoistTask.id = existingTodoistId;
    }

    // Map due date
    if (lifeOSTask.dueDate) {
      todoistTask.due = {
        date: this.formatDate(lifeOSTask.dueDate),
        is_recurring: false
      };
    }

    // Map duration if available
    if (lifeOSTask.estimatedTime) {
      todoistTask.duration = {
        amount: lifeOSTask.estimatedTime,
        unit: 'minute'
      };
    }

    return todoistTask;
  }

  /**
   * Convert Todoist task to Life OS task format
   */
  fromTodoistTask(
    todoistTask: TodoistTask,
    localId?: string
  ): LifeOSTask {
    const lifeOSTask: LifeOSTask = {
      id: localId || this.generateLocalId(todoistTask.id),
      title: todoistTask.content,
      description: todoistTask.description,
      status: this.mapStatus(todoistTask),
      priority: this.reversePriorityMapping[todoistTask.priority] || 'medium',
      createdAt: todoistTask.created_at,
      updatedAt: todoistTask.created_at, // Todoist doesn't track updated_at in REST API
      context: this.extractContextFromLabels(todoistTask.labels),
      tags: this.extractTagsFromLabels(todoistTask.labels)
    };

    // Map due date
    if (todoistTask.due) {
      lifeOSTask.dueDate = todoistTask.due.datetime || todoistTask.due.date;
    }

    // Map completion date
    if (todoistTask.is_completed && todoistTask.completed_at) {
      lifeOSTask.completedAt = todoistTask.completed_at;
    }

    // Map energy and estimated time from labels
    const energyLabel = todoistTask.labels.find(l => l.startsWith('energy-'));
    if (energyLabel) {
      lifeOSTask.energy = energyLabel.replace('energy-', '') as any;
    }

    const timeLabel = todoistTask.labels.find(l => l.startsWith('time-'));
    if (timeLabel) {
      lifeOSTask.estimatedTime = parseInt(timeLabel.replace('time-', ''));
    }

    // Use duration if available
    if (todoistTask.duration) {
      lifeOSTask.estimatedTime = todoistTask.duration.amount;
    }

    return lifeOSTask;
  }

  /**
   * Map Life OS task labels to Todoist labels
   */
  private mapLabels(lifeOSTask: LifeOSTask): string[] {
    const labels: string[] = [];

    // Add context as labels
    if (lifeOSTask.context) {
      labels.push(...lifeOSTask.context.map(c => `context-${c}`));
    }

    // Add tags as labels
    if (lifeOSTask.tags) {
      labels.push(...lifeOSTask.tags.map(t => `tag-${t}`));
    }

    // Add energy level as label
    if (lifeOSTask.energy) {
      labels.push(`energy-${lifeOSTask.energy}`);
    }

    // Add estimated time as label
    if (lifeOSTask.estimatedTime) {
      labels.push(`time-${lifeOSTask.estimatedTime}`);
    }

    // Add status as label for in-progress tasks
    if (lifeOSTask.status === 'in-progress') {
      labels.push('status-in-progress');
    }

    return labels;
  }

  /**
   * Extract context tags from Todoist labels
   */
  private extractContextFromLabels(labels: string[]): string[] {
    return labels
      .filter(l => l.startsWith('context-'))
      .map(l => l.replace('context-', ''));
  }

  /**
   * Extract regular tags from Todoist labels
   */
  private extractTagsFromLabels(labels: string[]): string[] {
    return labels
      .filter(l => l.startsWith('tag-'))
      .map(l => l.replace('tag-', ''));
  }

  /**
   * Map Todoist task status to Life OS status
   */
  private mapStatus(todoistTask: TodoistTask): LifeOSTask['status'] {
    if (todoistTask.is_completed) {
      return 'done';
    }

    // Check for in-progress label
    if (todoistTask.labels.includes('status-in-progress')) {
      return 'in-progress';
    }

    return 'todo';
  }

  /**
   * Format date for Todoist (YYYY-MM-DD)
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  /**
   * Generate local ID from Todoist ID
   */
  private generateLocalId(todoistId: string): string {
    return `todoist-${todoistId}`;
  }

  /**
   * Extract Todoist ID from local ID
   */
  extractTodoistId(localId: string): string | null {
    if (localId.startsWith('todoist-')) {
      return localId.replace('todoist-', '');
    }
    return null;
  }

  /**
   * Check if task ID is a Todoist ID
   */
  isTodoistId(id: string): boolean {
    return id.startsWith('todoist-');
  }

  /**
   * Map project name to Todoist project
   */
  findProjectByName(projects: TodoistProject[], name: string): TodoistProject | undefined {
    return projects.find(p =>
      p.name.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Create label name from context or tag
   */
  createLabelName(prefix: string, value: string): string {
    return `${prefix}-${value.toLowerCase().replace(/\s+/g, '-')}`;
  }

  /**
   * Parse label name into prefix and value
   */
  parseLabelName(label: string): { prefix: string; value: string } | null {
    const match = label.match(/^([a-z]+)-(.+)$/);
    if (match) {
      return {
        prefix: match[1],
        value: match[2].replace(/-/g, ' ')
      };
    }
    return null;
  }

  /**
   * Detect changes between two tasks
   */
  detectChanges(
    task1: LifeOSTask,
    task2: LifeOSTask
  ): Array<'content' | 'status' | 'priority' | 'due_date' | 'labels'> {
    const changes: Array<'content' | 'status' | 'priority' | 'due_date' | 'labels'> = [];

    if (task1.title !== task2.title || task1.description !== task2.description) {
      changes.push('content');
    }

    if (task1.status !== task2.status) {
      changes.push('status');
    }

    if (task1.priority !== task2.priority) {
      changes.push('priority');
    }

    if (task1.dueDate !== task2.dueDate) {
      changes.push('due_date');
    }

    const labels1 = [...(task1.context || []), ...(task1.tags || [])].sort().join(',');
    const labels2 = [...(task2.context || []), ...(task2.tags || [])].sort().join(',');
    if (labels1 !== labels2) {
      changes.push('labels');
    }

    return changes;
  }
}
