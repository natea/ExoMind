/**
 * Template Configuration for Life OS
 * Manages template files and formatting
 */

import { TemplateConfig } from '../types/config';
import path from 'path';

/**
 * Create template configuration
 */
export function createTemplateConfig(): TemplateConfig {
  const templatesDir = process.env.LIFE_OS_TEMPLATES_PATH || path.join(process.cwd(), 'templates');

  return {
    // Template file paths
    dailyNote: path.join(templatesDir, 'daily-note.md'),
    weeklyReview: path.join(templatesDir, 'weekly-review.md'),
    monthlyReview: path.join(templatesDir, 'monthly-review.md'),
    project: path.join(templatesDir, 'project.md'),
    area: path.join(templatesDir, 'area.md'),
    goal: path.join(templatesDir, 'goal.md'),

    // Date formats
    dailyFormat: 'yyyy-MM-dd',
    weeklyFormat: 'yyyy-\\WW',
    monthlyFormat: 'yyyy-MM',
    yearlyFormat: 'yyyy',
  };
}

/**
 * Template naming conventions
 */
export const TEMPLATE_NAMING = {
  /**
   * Project naming convention
   * @param name - Project name
   * @returns Formatted filename
   */
  project: (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-') + '.md';
  },

  /**
   * Area naming convention
   * @param name - Area name
   * @returns Formatted filename
   */
  area: (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-') + '.md';
  },

  /**
   * Resource naming convention
   * @param name - Resource name
   * @returns Formatted filename
   */
  resource: (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-') + '.md';
  },

  /**
   * Inbox item naming convention
   * @param name - Item name
   * @param timestamp - Optional timestamp
   * @returns Formatted filename
   */
  inbox: (name: string, timestamp?: string): string => {
    const prefix = timestamp || new Date().toISOString().split('T')[0];
    return `${prefix}-${name.toLowerCase().replace(/\s+/g, '-')}.md`;
  },
};

/**
 * Template variable definitions
 */
export const TEMPLATE_VARIABLES = {
  // Date variables
  TODAY: '{{date}}',
  WEEK: '{{week}}',
  MONTH: '{{month}}',
  YEAR: '{{year}}',
  TIME: '{{time}}',
  TIMESTAMP: '{{timestamp}}',

  // Content variables
  TITLE: '{{title}}',
  DESCRIPTION: '{{description}}',
  TAGS: '{{tags}}',
  STATUS: '{{status}}',
  PRIORITY: '{{priority}}',

  // Reference variables
  PROJECT: '{{project}}',
  AREA: '{{area}}',
  GOAL: '{{goal}}',

  // User variables
  NAME: '{{name}}',
  EMAIL: '{{email}}',
};

/**
 * Default template values
 */
export const DEFAULT_VALUES = {
  status: {
    project: 'Active',
    task: 'Todo',
    goal: 'In Progress',
    area: 'Active',
  },
  priority: {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },
  tags: {
    inbox: ['inbox', 'unprocessed'],
    daily: ['daily', 'review'],
    weekly: ['weekly', 'review'],
    monthly: ['monthly', 'review'],
    yearly: ['yearly', 'review'],
  },
};

/**
 * Template utility class for working with templates
 */
export class TemplateUtils {
  constructor(private config: TemplateConfig) {}

  /**
   * Get template path by type
   * @param type - Template type
   * @returns Full path to template file
   */
  getTemplatePath(type: keyof Omit<TemplateConfig, 'dailyFormat' | 'weeklyFormat' | 'monthlyFormat' | 'yearlyFormat'>): string {
    return this.config[type];
  }

  /**
   * Get date format by type
   * @param type - Date format type
   * @returns Date format string
   */
  getDateFormat(type: 'daily' | 'weekly' | 'monthly' | 'yearly'): string {
    return this.config[`${type}Format`];
  }

  /**
   * Replace template variables in content
   * @param content - Template content with variables
   * @param variables - Variable values to replace
   * @returns Content with replaced variables
   */
  replaceVariables(content: string, variables: Record<string, string>): string {
    let result = content;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }

    return result;
  }

  /**
   * Get default tags for template type
   * @param type - Template type
   * @returns Array of default tags
   */
  getDefaultTags(type: keyof typeof DEFAULT_VALUES.tags): string[] {
    return DEFAULT_VALUES.tags[type] || [];
  }

  /**
   * Get default status for template type
   * @param type - Template type
   * @returns Default status string
   */
  getDefaultStatus(type: keyof typeof DEFAULT_VALUES.status): string {
    return DEFAULT_VALUES.status[type] || 'Active';
  }
}

/**
 * Template file contents (fallback if files don't exist)
 */
export const FALLBACK_TEMPLATES = {
  dailyNote: `# Daily Note - {{date}}

## Today's Focus
-

## Tasks
- [ ]

## Notes


## Reflections


---
Created: {{timestamp}}
Tags: {{tags}}
`,

  weeklyReview: `# Weekly Review - {{week}}

## Week Overview
Date Range: {{date}}

## Accomplishments
-

## Challenges
-

## Lessons Learned
-

## Next Week's Focus
-

---
Created: {{timestamp}}
Tags: {{tags}}
`,

  project: `# {{title}}

## Overview
{{description}}

## Status
Status: {{status}}
Priority: {{priority}}

## Goals
-

## Tasks
- [ ]

## Resources
-

## Notes


---
Created: {{timestamp}}
Tags: {{tags}}
Area: {{area}}
`,

  area: `# {{title}}

## Overview
{{description}}

## Purpose


## Goals
-

## Projects
-

## Resources
-

## Notes


---
Created: {{timestamp}}
Tags: {{tags}}
Status: {{status}}
`,

  goal: `# {{title}}

## Overview
{{description}}

## Status
Status: {{status}}
Priority: {{priority}}

## Target Date
{{date}}

## Milestones
- [ ]

## Action Steps
- [ ]

## Progress


## Notes


---
Created: {{timestamp}}
Tags: {{tags}}
Area: {{area}}
`,
};
