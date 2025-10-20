/**
 * TodoistMapper - Maps between Life OS Task and Todoist Task formats
 */

import { Task } from '../../types/task';
import { TodoistTask, MapperOptions } from './types';

export class TodoistMapper {
  private options: MapperOptions;

  constructor(options: MapperOptions = {}) {
    this.options = options;
  }

  /**
   * Convert Life OS Task to Todoist Task format
   */
  toTodoist(task: Task, options: MapperOptions = {}): TodoistTask {
    const mergedOptions = { ...this.options, ...options };

    // Map priority (Life OS 1-4 maps directly to Todoist 1-4)
    const priority = this.mapPriorityToTodoist(task.priority);

    // Map tags to Todoist labels
    const labels = this.mapTagsToLabels(task.tags || []);

    // Build Todoist task
    const todoistTask: TodoistTask = {
      id: task.syncState?.remoteId || '',
      content: task.title,
      description: task.description,
      priority,
      labels,
      created_at: task.createdAt.toISOString(),
    };

    // Map due date
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      todoistTask.due_date = this.formatDate(dueDate);
      todoistTask.due_datetime = dueDate.toISOString();
      todoistTask.due = {
        date: this.formatDate(dueDate),
        datetime: dueDate.toISOString(),
        is_recurring: false,
      };
    }

    // Map project
    if (task.project && mergedOptions.projectMapping) {
      todoistTask.project_id = mergedOptions.projectMapping[task.project];
    }

    // Preserve Todoist-specific metadata
    if (task.metadata?.todoist) {
      if (task.metadata.todoist.section_id) {
        todoistTask.section_id = task.metadata.todoist.section_id;
      }
      if (task.metadata.todoist.parent_id) {
        todoistTask.parent_id = task.metadata.todoist.parent_id;
      }
      if (task.metadata.todoist.order !== undefined) {
        todoistTask.order = task.metadata.todoist.order;
      }
    }

    // Add custom fields if configured
    if (mergedOptions.customFields) {
      const customDescription = Object.entries(mergedOptions.customFields)
        .map(([key, fn]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${fn(task)}`)
        .join('\n');

      if (customDescription) {
        todoistTask.description = todoistTask.description
          ? `${todoistTask.description}\n\n${customDescription}`
          : customDescription;
      }
    }

    return todoistTask;
  }

  /**
   * Convert Todoist Task to Life OS Task format
   */
  fromTodoist(todoistTask: TodoistTask, options: MapperOptions = {}): Task {
    const mergedOptions = { ...this.options, ...options };

    // Map priority
    const priority = this.mapPriorityFromTodoist(todoistTask.priority);

    // Map labels to tags
    let tags = this.mapLabelsToTags(todoistTask.labels);

    // Restore @ context format if requested
    if (mergedOptions.restoreContextFormat) {
      tags = tags.map(tag => {
        // Common contexts that should have @ prefix
        const contexts = ['work', 'home', 'computer', 'phone', 'errands', 'waiting'];
        return contexts.includes(tag.toLowerCase()) ? `@${tag}` : tag;
      });
    }

    // Parse due date
    let dueDate: Date | undefined;
    if (todoistTask.due) {
      if (todoistTask.due.datetime) {
        dueDate = new Date(todoistTask.due.datetime);
      } else if (todoistTask.due.date) {
        dueDate = new Date(todoistTask.due.date + 'T00:00:00Z');
      }
    }

    // Validate date
    if (dueDate && isNaN(dueDate.getTime())) {
      dueDate = undefined;
    }

    // Determine status
    const status = todoistTask.is_completed ? 'done' : 'todo';

    // Build Life OS task
    const task: Task = {
      id: `todoist-${todoistTask.id}`,
      title: todoistTask.content,
      description: todoistTask.description,
      status: status as Task['status'],
      priority,
      tags,
      dueDate,
      createdAt: new Date(todoistTask.created_at),
      updatedAt: new Date(todoistTask.updated_at || todoistTask.created_at),
      syncState: {
        remoteId: todoistTask.id,
        dirty: false,
        lastSynced: new Date(),
      },
      metadata: {
        todoist: {
          project_id: todoistTask.project_id,
          section_id: todoistTask.section_id,
          parent_id: todoistTask.parent_id,
          order: todoistTask.order,
        },
      },
    };

    if (todoistTask.completed_at) {
      task.completedAt = new Date(todoistTask.completed_at);
    }

    return task;
  }

  /**
   * Map Life OS priority to Todoist priority
   */
  private mapPriorityToTodoist(priority?: number): number {
    if (!priority || priority < 1 || priority > 4) {
      return 1; // Default to low priority
    }
    return priority;
  }

  /**
   * Map Todoist priority to Life OS priority
   */
  private mapPriorityFromTodoist(priority: number): Task['priority'] {
    // Todoist: 1=low, 2=medium, 3=high, 4=urgent (p1)
    // Life OS: 1=low, 2=medium, 3=high, 4=urgent
    if (priority < 1 || priority > 4) {
      return 1; // Default to low
    }
    return priority as Task['priority'];
  }

  /**
   * Map tags to Todoist labels (strip @ prefix)
   */
  private mapTagsToLabels(tags: string[]): string[] {
    return tags.map(tag => tag.startsWith('@') ? tag.slice(1) : tag);
  }

  /**
   * Map Todoist labels to tags
   */
  private mapLabelsToTags(labels: string[]): string[] {
    return [...labels]; // Return copy
  }

  /**
   * Format date as YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
