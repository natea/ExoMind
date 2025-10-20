/**
 * Life OS Configuration Settings
 * Type-safe configuration interface for the entire system
 */

/**
 * Memory Configuration
 */
export interface MemoryConfig {
  /** Path to memory database */
  databasePath: string;
  /** Enable persistent memory across sessions */
  persistent: boolean;
  /** Memory retention in days */
  retentionDays: number;
  /** Enable memory compression */
  compression: boolean;
}

/**
 * Skill Configuration
 */
export interface SkillConfig {
  /** Enable/disable specific skills */
  enabled: Record<string, boolean>;
  /** Skill-specific settings */
  settings: Record<string, Record<string, unknown>>;
  /** Auto-load skills on startup */
  autoLoad: boolean;
}

/**
 * Integration Configuration
 */
export interface IntegrationConfig {
  whatsapp: {
    enabled: boolean;
    autoSend: boolean;
    defaultRecipient?: string;
  };
  calendar: {
    enabled: boolean;
    provider: 'google' | 'outlook' | 'apple';
    syncInterval: number;
  };
  shopping: {
    costcoEnabled: boolean;
    instacartEnabled: boolean;
    defaultStore: 'costco' | 'instacart' | 'manual';
  };
}

/**
 * API Configuration
 */
export interface APIConfig {
  anthropic: {
    apiKey?: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  openai?: {
    apiKey?: string;
    model: string;
  };
  google?: {
    apiKey?: string;
    searchEngineId?: string;
  };
}

/**
 * User Preferences
 */
export interface UserPreferences {
  /** User's name */
  name?: string;
  /** User's email */
  email?: string;
  /** Preferred timezone */
  timezone: string;
  /** Language preference */
  language: string;
  /** Notification preferences */
  notifications: {
    email: boolean;
    push: boolean;
    whatsapp: boolean;
  };
  /** Dietary restrictions */
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    allergies: string[];
    dislikes: string[];
  };
}

/**
 * System Configuration
 */
export interface SystemConfig {
  /** Enable debug mode */
  debug: boolean;
  /** Log level */
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  /** Enable telemetry */
  telemetry: boolean;
  /** Auto-update settings */
  autoUpdate: boolean;
}

/**
 * Complete Life OS Settings
 */
export interface LifeOSSettings {
  memory: MemoryConfig;
  skills: SkillConfig;
  integrations: IntegrationConfig;
  api: APIConfig;
  user: UserPreferences;
  system: SystemConfig;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Settings validator
 */
export class SettingsValidator {
  /**
   * Validate complete settings object
   */
  static validate(settings: Partial<LifeOSSettings>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate memory settings
    if (settings.memory) {
      if (!settings.memory.databasePath) {
        errors.push('Memory database path is required');
      }
      if (settings.memory.retentionDays < 1) {
        errors.push('Memory retention must be at least 1 day');
      }
    }

    // Validate API settings
    if (settings.api) {
      if (!settings.api.anthropic.apiKey && !process.env.ANTHROPIC_API_KEY) {
        warnings.push('Anthropic API key not configured');
      }
      if (settings.api.anthropic.maxTokens < 100) {
        errors.push('Max tokens must be at least 100');
      }
      if (settings.api.anthropic.temperature < 0 || settings.api.anthropic.temperature > 1) {
        errors.push('Temperature must be between 0 and 1');
      }
    }

    // Validate user preferences
    if (settings.user) {
      if (settings.user.email && !this.isValidEmail(settings.user.email)) {
        errors.push('Invalid email format');
      }
      if (!settings.user.timezone) {
        warnings.push('Timezone not set, using system default');
      }
    }

    // Validate integrations
    if (settings.integrations) {
      if (settings.integrations.calendar.enabled && !settings.integrations.calendar.provider) {
        errors.push('Calendar provider must be specified when calendar is enabled');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
