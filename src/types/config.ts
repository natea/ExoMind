/**
 * Configuration Type Definitions for Life OS
 * Provides type-safe configuration interfaces
 */

/**
 * Integration configuration for external services
 */
export interface IntegrationConfig {
  /**
   * Todoist API configuration
   */
  todoist: {
    apiKey?: string;
    enabled: boolean;
    projectId?: string;
    inboxProjectId?: string;
  };

  /**
   * Google Workspace configuration
   */
  google: {
    email?: string;
    enabled: boolean;
    calendarId?: string;
    driveFolder?: string;
  };

  /**
   * WhatsApp MCP configuration
   */
  whatsapp: {
    enabled: boolean;
    mcpServer?: string;
  };
}

/**
 * Path configuration for data storage
 */
export interface PathConfig {
  /**
   * Base directory for all memory storage
   */
  memoryBase: string;

  /**
   * Directory for inbox items
   */
  inbox: string;

  /**
   * Directory for projects
   */
  projects: string;

  /**
   * Directory for areas of responsibility
   */
  areas: string;

  /**
   * Directory for resources
   */
  resources: string;

  /**
   * Directory for archived items
   */
  archive: string;

  /**
   * Directory for templates
   */
  templates: string;

  /**
   * Directory for skills
   */
  skills: string;

  /**
   * Directory for daily notes
   */
  daily: string;

  /**
   * Directory for weekly reviews
   */
  weekly: string;

  /**
   * Directory for monthly reviews
   */
  monthly: string;

  /**
   * Directory for yearly reviews
   */
  yearly: string;
}

/**
 * Template configuration
 */
export interface TemplateConfig {
  /**
   * Daily note template path
   */
  dailyNote: string;

  /**
   * Weekly review template path
   */
  weeklyReview: string;

  /**
   * Monthly review template path
   */
  monthlyReview: string;

  /**
   * Project template path
   */
  project: string;

  /**
   * Area template path
   */
  area: string;

  /**
   * Goal template path
   */
  goal: string;

  /**
   * Date format for daily notes
   */
  dailyFormat: string;

  /**
   * Date format for weekly reviews
   */
  weeklyFormat: string;

  /**
   * Date format for monthly reviews
   */
  monthlyFormat: string;

  /**
   * Date format for yearly reviews
   */
  yearlyFormat: string;
}

/**
 * Main application configuration
 */
export interface AppConfig {
  /**
   * Environment (development, production, test)
   */
  env: 'development' | 'production' | 'test';

  /**
   * Application name
   */
  appName: string;

  /**
   * Application version
   */
  version: string;

  /**
   * Path configuration
   */
  paths: PathConfig;

  /**
   * Integration configuration
   */
  integrations: IntegrationConfig;

  /**
   * Template configuration
   */
  templates: TemplateConfig;

  /**
   * Logging configuration
   */
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableFileLogging: boolean;
    logDirectory: string;
  };

  /**
   * Feature flags
   */
  features: {
    enableAI: boolean;
    enableNotifications: boolean;
    enableSync: boolean;
  };
}

/**
 * Configuration validation error
 */
export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly details?: string
  ) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}
