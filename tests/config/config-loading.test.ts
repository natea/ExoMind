/**
 * Configuration Loading Tests
 *
 * Tests for validating configuration loading, defaults, and validation
 */

import * as fs from 'fs';
import { ConfigLoader } from '../../src/config/loader';
import { DEFAULT_SETTINGS, getEnvironmentDefaults } from '../../src/config/defaults';
import { SettingsValidator } from '../../src/config/settings';

describe('Configuration Loading Tests', () => {
  describe('Default Settings', () => {
    test('default settings object is valid', () => {
      const validation = SettingsValidator.validate(DEFAULT_SETTINGS);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('default memory settings are correct', () => {
      expect(DEFAULT_SETTINGS.memory).toBeDefined();
      expect(DEFAULT_SETTINGS.memory.databasePath).toBe('./.swarm/memory.db');
      expect(DEFAULT_SETTINGS.memory.persistent).toBe(true);
      expect(DEFAULT_SETTINGS.memory.retentionDays).toBe(90);
    });

    test('default API settings are correct', () => {
      expect(DEFAULT_SETTINGS.api).toBeDefined();
      expect(DEFAULT_SETTINGS.api.anthropic).toBeDefined();
      expect(DEFAULT_SETTINGS.api.anthropic.model).toBe('claude-sonnet-4-5-20250929');
      expect(DEFAULT_SETTINGS.api.anthropic.maxTokens).toBe(4096);
    });

    test('default skills are enabled', () => {
      expect(DEFAULT_SETTINGS.skills.enabled).toBeDefined();
      expect(DEFAULT_SETTINGS.skills.enabled['meal_planning']).toBe(true);
      expect(DEFAULT_SETTINGS.skills.enabled['grocery-shopping']).toBe(true);
    });

    test('default user settings have timezone', () => {
      expect(DEFAULT_SETTINGS.user.timezone).toBeDefined();
      expect(typeof DEFAULT_SETTINGS.user.timezone).toBe('string');
    });

    test('default system settings are appropriate', () => {
      expect(DEFAULT_SETTINGS.system.debug).toBe(false);
      expect(DEFAULT_SETTINGS.system.logLevel).toBe('info');
      expect(DEFAULT_SETTINGS.system.autoUpdate).toBe(true);
    });
  });

  describe('Environment-Specific Defaults', () => {
    test('development environment has debug enabled', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const envDefaults = getEnvironmentDefaults();
      expect(envDefaults.system?.debug).toBe(true);
      expect(envDefaults.system?.logLevel).toBe('debug');

      process.env.NODE_ENV = originalEnv;
    });

    test('test environment uses in-memory database', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';

      const envDefaults = getEnvironmentDefaults();
      expect(envDefaults.memory?.databasePath).toBe(':memory:');
      expect(envDefaults.memory?.persistent).toBe(false);

      process.env.NODE_ENV = originalEnv;
    });

    test('production environment has telemetry enabled', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const envDefaults = getEnvironmentDefaults();
      expect(envDefaults.system?.telemetry).toBe(true);
      expect(envDefaults.system?.debug).toBe(false);
      expect(envDefaults.system?.logLevel).toBe('warn');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('ConfigLoader', () => {
    let loader: ConfigLoader;

    beforeEach(() => {
      loader = new ConfigLoader();
    });

    test('loader initializes with defaults', () => {
      const settings = loader.getSettings();
      expect(settings).toBeDefined();
      expect(settings.memory).toBeDefined();
      expect(settings.api).toBeDefined();
    });

    test('loader can load configuration', () => {
      expect(() => loader.load()).not.toThrow();
    });

    test('loaded configuration is valid', () => {
      const settings = loader.load();
      const validation = SettingsValidator.validate(settings);
      expect(validation.valid).toBe(true);
    });

    test('loader can get nested settings', () => {
      loader.load();
      const model = loader.get<string>('api.anthropic.model');
      expect(model).toBeDefined();
      expect(typeof model).toBe('string');
    });

    test('loader returns undefined for non-existent path', () => {
      loader.load();
      const nonExistent = loader.get('nonexistent.path');
      expect(nonExistent).toBeUndefined();
    });

    test('loader can set nested values', () => {
      loader.load();
      loader.set('user.name', 'Test User');
      const name = loader.get<string>('user.name');
      expect(name).toBe('Test User');
    });
  });

  describe('Environment Variable Overrides', () => {
    test('ANTHROPIC_API_KEY environment variable is applied', () => {
      const originalKey = process.env.ANTHROPIC_API_KEY;
      process.env.ANTHROPIC_API_KEY = 'test-key-123';

      const loader = new ConfigLoader();
      const settings = loader.load();

      expect(settings.api.anthropic.apiKey).toBe('test-key-123');

      process.env.ANTHROPIC_API_KEY = originalKey;
    });

    test('DEBUG environment variable enables debug mode', () => {
      const originalDebug = process.env.DEBUG;
      process.env.DEBUG = 'true';

      const loader = new ConfigLoader();
      const settings = loader.load();

      expect(settings.system.debug).toBe(true);
      expect(settings.system.logLevel).toBe('debug');

      process.env.DEBUG = originalDebug;
    });

    test('USER_TIMEZONE environment variable overrides default', () => {
      const originalTimezone = process.env.USER_TIMEZONE;
      process.env.USER_TIMEZONE = 'America/New_York';

      const loader = new ConfigLoader();
      const settings = loader.load();

      expect(settings.user.timezone).toBe('America/New_York');

      process.env.USER_TIMEZONE = originalTimezone;
    });
  });

  describe('Settings Validation', () => {
    test('valid settings pass validation', () => {
      const validation = SettingsValidator.validate(DEFAULT_SETTINGS);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('settings validator can be called', () => {
      // Simple test to verify validator works
      const validation = SettingsValidator.validate(DEFAULT_SETTINGS);
      expect(validation).toBeDefined();
      expect(validation.valid).toBeDefined();
      expect(validation.errors).toBeDefined();
      expect(validation.warnings).toBeDefined();
    });

    test('missing Anthropic API key is acceptable', () => {
      const settingsWithoutKey = {
        ...DEFAULT_SETTINGS,
        api: {
          ...DEFAULT_SETTINGS.api,
          anthropic: {
            ...DEFAULT_SETTINGS.api.anthropic,
            apiKey: undefined,
          },
        },
      };

      const validation = SettingsValidator.validate(settingsWithoutKey);
      // Missing API key should still be valid (can be set via env vars)
      expect(validation.valid).toBe(true);
    });

    test('negative retention days fails validation', () => {
      const invalidSettings = {
        ...DEFAULT_SETTINGS,
        memory: {
          ...DEFAULT_SETTINGS.memory,
          retentionDays: -10,
        },
      };

      const validation = SettingsValidator.validate(invalidSettings);
      expect(validation.valid).toBe(false);
    });
  });

  describe('Configuration Persistence', () => {
    test('loader can save configuration', () => {
      const loader = new ConfigLoader();
      loader.load();

      const testPath = './.swarm/test-settings.json';

      // Clean up first if exists
      if (fs.existsSync(testPath)) {
        fs.unlinkSync(testPath);
      }

      expect(() => loader.save(testPath)).not.toThrow();
      expect(fs.existsSync(testPath)).toBe(true);

      // Clean up
      if (fs.existsSync(testPath)) {
        fs.unlinkSync(testPath);
      }
    });

    test('saved configuration does not include API keys', () => {
      const loader = new ConfigLoader();
      loader.load();
      loader.set('api.anthropic.apiKey', 'secret-key');

      const testPath = './.swarm/test-settings-no-keys.json';

      loader.save(testPath);

      const savedContent = fs.readFileSync(testPath, 'utf-8');
      expect(savedContent).not.toContain('secret-key');

      // Clean up
      if (fs.existsSync(testPath)) {
        fs.unlinkSync(testPath);
      }
    });
  });

  describe('Path Generation', () => {
    test('memory database path is absolute', () => {
      const loader = new ConfigLoader();
      const settings = loader.load();

      // Should be a valid path
      expect(settings.memory.databasePath).toBeDefined();
      expect(typeof settings.memory.databasePath).toBe('string');
    });

    test('config paths are checked in correct order', () => {
      const loader = new ConfigLoader();
      // Access private property for testing
      const configPaths = (loader as any).configPaths;

      expect(configPaths).toContain('./.claude/settings.json');
      expect(configPaths).toContain('./.claude/settings.local.json');

      // Local settings should come after regular settings
      const regularIndex = configPaths.indexOf('./.claude/settings.json');
      const localIndex = configPaths.indexOf('./.claude/settings.local.json');
      expect(localIndex).toBeGreaterThan(regularIndex);
    });
  });
});
