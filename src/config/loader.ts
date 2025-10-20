/**
 * Configuration Loader for Life OS
 * Handles loading, merging, and validating configuration from multiple sources
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { LifeOSSettings, SettingsValidator } from './settings';
import { DEFAULT_SETTINGS, getEnvironmentDefaults } from './defaults';

/**
 * Configuration loader class
 */
export class ConfigLoader {
  private settings: LifeOSSettings;
  private configPaths: string[];

  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.configPaths = [
      './.claude/settings.json',
      './.claude/settings.local.json',
      './settings.json',
      './settings.local.json',
    ];
  }

  /**
   * Load configuration from all sources
   */
  load(): LifeOSSettings {
    // 1. Start with defaults
    this.settings = { ...DEFAULT_SETTINGS };

    // 2. Apply environment-specific defaults
    this.mergeSettings(getEnvironmentDefaults());

    // 3. Load environment variables
    this.loadEnvironment();

    // 4. Load from config files
    this.loadConfigFiles();

    // 5. Apply environment variable overrides
    this.applyEnvironmentOverrides();

    // 6. Validate final configuration
    this.validate();

    return this.settings;
  }

  /**
   * Load environment variables from .env file
   */
  private loadEnvironment(): void {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }

    // Also try .env.local for local overrides
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      dotenv.config({ path: envLocalPath, override: true });
    }
  }

  /**
   * Load configuration from JSON files
   */
  private loadConfigFiles(): void {
    for (const configPath of this.configPaths) {
      const fullPath = path.resolve(process.cwd(), configPath);
      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const config = JSON.parse(content);
          this.mergeSettings(config);
          console.log(`✓ Loaded config from ${configPath}`);
        } catch (error) {
          console.warn(`⚠ Failed to load ${configPath}:`, error);
        }
      }
    }
  }

  /**
   * Apply environment variable overrides
   */
  private applyEnvironmentOverrides(): void {
    // API Keys
    if (process.env.ANTHROPIC_API_KEY) {
      this.settings.api.anthropic.apiKey = process.env.ANTHROPIC_API_KEY;
    }
    if (process.env.OPENAI_API_KEY) {
      if (!this.settings.api.openai) {
        this.settings.api.openai = { apiKey: '', model: 'gpt-4' };
      }
      this.settings.api.openai.apiKey = process.env.OPENAI_API_KEY;
    }
    if (process.env.GOOGLE_API_KEY) {
      if (!this.settings.api.google) {
        this.settings.api.google = {};
      }
      this.settings.api.google.apiKey = process.env.GOOGLE_API_KEY;
    }
    if (process.env.GOOGLE_SEARCH_ENGINE_ID) {
      if (!this.settings.api.google) {
        this.settings.api.google = {};
      }
      this.settings.api.google.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    }

    // User preferences
    if (process.env.USER_NAME) {
      this.settings.user.name = process.env.USER_NAME;
    }
    if (process.env.USER_EMAIL) {
      this.settings.user.email = process.env.USER_EMAIL;
    }
    if (process.env.USER_TIMEZONE) {
      this.settings.user.timezone = process.env.USER_TIMEZONE;
    }

    // System settings
    if (process.env.DEBUG === 'true') {
      this.settings.system.debug = true;
      this.settings.system.logLevel = 'debug';
    }
    if (process.env.LOG_LEVEL) {
      this.settings.system.logLevel = process.env.LOG_LEVEL as any;
    }

    // Memory settings
    if (process.env.MEMORY_PATH) {
      this.settings.memory.databasePath = process.env.MEMORY_PATH;
    }

    // Integration settings
    if (process.env.WHATSAPP_ENABLED === 'true') {
      this.settings.integrations.whatsapp.enabled = true;
    }
    if (process.env.WHATSAPP_DEFAULT_RECIPIENT) {
      this.settings.integrations.whatsapp.defaultRecipient = process.env.WHATSAPP_DEFAULT_RECIPIENT;
    }
  }

  /**
   * Deep merge settings objects
   */
  private mergeSettings(overrides: Partial<LifeOSSettings>): void {
    this.settings = this.deepMerge(this.settings, overrides);
  }

  /**
   * Deep merge two objects
   */
  private deepMerge<T>(target: T, source: Partial<T>): T {
    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (this.isObject(sourceValue) && this.isObject(targetValue)) {
          result[key] = this.deepMerge(targetValue, sourceValue as any);
        } else if (sourceValue !== undefined) {
          result[key] = sourceValue as any;
        }
      }
    }

    return result;
  }

  /**
   * Check if value is an object
   */
  private isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * Validate configuration
   */
  private validate(): void {
    const validation = SettingsValidator.validate(this.settings);

    if (!validation.valid) {
      console.error('❌ Configuration validation failed:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      throw new Error('Invalid configuration');
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠ Configuration warnings:');
      validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
  }

  /**
   * Save current settings to a file
   */
  save(filePath: string): void {
    const fullPath = path.resolve(process.cwd(), filePath);
    const dir = path.dirname(fullPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Don't save API keys to file
    const settingsToSave = { ...this.settings };
    if (settingsToSave.api.anthropic.apiKey) {
      settingsToSave.api.anthropic.apiKey = undefined;
    }
    if (settingsToSave.api.openai?.apiKey) {
      settingsToSave.api.openai.apiKey = undefined;
    }
    if (settingsToSave.api.google?.apiKey) {
      settingsToSave.api.google.apiKey = undefined;
    }

    fs.writeFileSync(fullPath, JSON.stringify(settingsToSave, null, 2));
    console.log(`✓ Settings saved to ${filePath}`);
  }

  /**
   * Get current settings
   */
  getSettings(): LifeOSSettings {
    return this.settings;
  }

  /**
   * Get a specific setting by path
   */
  get<T>(path: string): T | undefined {
    const parts = path.split('.');
    let current: any = this.settings;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return current as T;
  }

  /**
   * Set a specific setting by path
   */
  set(path: string, value: any): void {
    const parts = path.split('.');
    const lastPart = parts.pop()!;
    let current: any = this.settings;

    for (const part of parts) {
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    current[lastPart] = value;
  }
}

/**
 * Singleton instance
 */
let configInstance: ConfigLoader | null = null;

/**
 * Get configuration loader instance
 */
export function getConfig(): ConfigLoader {
  if (!configInstance) {
    configInstance = new ConfigLoader();
    configInstance.load();
  }
  return configInstance;
}

/**
 * Reload configuration
 */
export function reloadConfig(): LifeOSSettings {
  configInstance = new ConfigLoader();
  return configInstance.load();
}

/**
 * Export current configuration
 */
export function exportConfig(filePath: string): void {
  const config = getConfig();
  config.save(filePath);
}
