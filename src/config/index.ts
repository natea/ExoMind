/**
 * Main Configuration Module for Life OS
 * Central configuration loader and validator
 */

import { config as dotenvConfig } from 'dotenv';
import { AppConfig, ConfigValidationError } from '../types/config';
import { createPathConfig, PathUtils } from './paths';
import { createIntegrationConfig, validateIntegrationConfig, IntegrationUtils } from './integrations';
import { createTemplateConfig, TemplateUtils } from './templates';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenvConfig();

/**
 * Create application configuration
 */
function createConfig(): AppConfig {
  const env = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
  const paths = createPathConfig();
  const integrations = createIntegrationConfig();
  const templates = createTemplateConfig();

  return {
    env,
    appName: process.env.APP_NAME || 'Life OS',
    version: process.env.APP_VERSION || '1.0.0',
    paths,
    integrations,
    templates,
    logging: {
      level: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
      enableFileLogging: process.env.ENABLE_FILE_LOGGING === 'true',
      logDirectory: process.env.LOG_DIRECTORY || path.join(process.cwd(), 'logs'),
    },
    features: {
      enableAI: process.env.ENABLE_AI !== 'false', // Enabled by default
      enableNotifications: process.env.ENABLE_NOTIFICATIONS === 'true',
      enableSync: process.env.ENABLE_SYNC === 'true',
    },
  };
}

/**
 * Validate configuration
 * @param config - Configuration to validate
 * @throws {ConfigValidationError} If configuration is invalid
 */
function validateConfig(config: AppConfig): void {
  // Validate required fields
  if (!config.appName) {
    throw new ConfigValidationError(
      'Application name is required',
      'appName',
      'Set APP_NAME environment variable'
    );
  }

  if (!config.version) {
    throw new ConfigValidationError(
      'Application version is required',
      'version',
      'Set APP_VERSION environment variable'
    );
  }

  // Validate paths
  if (!config.paths.memoryBase) {
    throw new ConfigValidationError(
      'Memory base path is required',
      'paths.memoryBase',
      'Set LIFE_OS_MEMORY_PATH environment variable'
    );
  }

  // Validate integrations
  validateIntegrationConfig(config.integrations);

  // Validate logging
  const validLogLevels = ['debug', 'info', 'warn', 'error'];
  if (!validLogLevels.includes(config.logging.level)) {
    throw new ConfigValidationError(
      `Invalid log level: ${config.logging.level}`,
      'logging.level',
      `Must be one of: ${validLogLevels.join(', ')}`
    );
  }
}

/**
 * Ensure required directories exist
 * @param config - Configuration containing paths
 */
function ensureDirectories(config: AppConfig): void {
  const pathUtils = new PathUtils(config.paths);
  const directories = pathUtils.getAllDirectories();

  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Ensure log directory exists if file logging is enabled
  if (config.logging.enableFileLogging && !fs.existsSync(config.logging.logDirectory)) {
    fs.mkdirSync(config.logging.logDirectory, { recursive: true });
  }
}

/**
 * Print configuration summary
 * @param config - Configuration to summarize
 */
function printConfigSummary(config: AppConfig): void {
  console.log('\n=== Life OS Configuration ===');
  console.log(`Environment: ${config.env}`);
  console.log(`App Name: ${config.appName}`);
  console.log(`Version: ${config.version}`);
  console.log(`\nMemory Path: ${config.paths.memoryBase}`);

  const integrationUtils = new IntegrationUtils(config.integrations);
  const availableIntegrations = integrationUtils.getAvailableIntegrations();

  console.log(`\nAvailable Integrations: ${availableIntegrations.length > 0 ? availableIntegrations.join(', ') : 'None'}`);

  const messages = integrationUtils.getConfigurationMessages();
  if (messages.length > 0 && messages[0] !== 'All integrations configured successfully!') {
    console.log('\nConfiguration Notes:');
    messages.forEach(msg => console.log(`  - ${msg}`));
  }

  console.log(`\nFeatures:`);
  console.log(`  - AI: ${config.features.enableAI ? 'Enabled' : 'Disabled'}`);
  console.log(`  - Notifications: ${config.features.enableNotifications ? 'Enabled' : 'Disabled'}`);
  console.log(`  - Sync: ${config.features.enableSync ? 'Enabled' : 'Disabled'}`);
  console.log('=============================\n');
}

/**
 * Load and validate configuration
 * @param options - Configuration options
 * @returns Validated application configuration
 */
export function loadConfig(options: {
  ensureDirs?: boolean;
  printSummary?: boolean;
} = {}): AppConfig {
  const { ensureDirs = true, printSummary = false } = options;

  try {
    // Create configuration
    const config = createConfig();

    // Validate configuration
    validateConfig(config);

    // Ensure directories exist
    if (ensureDirs) {
      ensureDirectories(config);
    }

    // Print summary if requested
    if (printSummary) {
      printConfigSummary(config);
    }

    return config;
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error(`\n❌ Configuration Error: ${error.message}`);
      console.error(`   Field: ${error.field}`);
      if (error.details) {
        console.error(`   Fix: ${error.details}\n`);
      }
      throw error;
    }
    throw error;
  }
}

/**
 * Get configuration with utility classes
 */
export function getConfigWithUtils() {
  const config = loadConfig({ printSummary: false });

  return {
    config,
    pathUtils: new PathUtils(config.paths),
    integrationUtils: new IntegrationUtils(config.integrations),
    templateUtils: new TemplateUtils(config.templates),
  };
}

// Export singleton configuration instance
let configInstance: AppConfig | null = null;

/**
 * Get singleton configuration instance
 * @returns Application configuration
 */
export function getConfig(): AppConfig {
  if (!configInstance) {
    configInstance = loadConfig({ printSummary: false });
  }
  return configInstance;
}

/**
 * Reset configuration (useful for testing)
 */
export function resetConfig(): void {
  configInstance = null;
}

// Export all configuration types and utilities
export * from '../types/config';
export * from './paths';
export * from './integrations';
export * from './templates';

// Export default configuration
export default getConfig;
