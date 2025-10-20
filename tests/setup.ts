/**
 * Jest Setup File
 * Global test configuration and utilities
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

// Set default test environment variables
process.env.MEMORY_PATH = process.env.MEMORY_PATH || './memory/test';
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods for cleaner test output (optional)
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test utilities
export const testUtils = {
  /**
   * Wait for a specified number of milliseconds
   */
  wait: (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Create a mock skill context
   */
  createMockSkillContext: () => ({
    memory: {
      store: jest.fn().mockResolvedValue(undefined),
      retrieve: jest.fn().mockResolvedValue(null),
      search: jest.fn().mockResolvedValue([]),
    },
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    },
    config: {
      memoryPath: process.env.MEMORY_PATH || './memory/test',
    },
  }),

  /**
   * Clean up test memory directory
   */
  cleanupTestMemory: async (): Promise<void> => {
    const fs = await import('fs/promises');
    const memoryPath = process.env.MEMORY_PATH || './memory/test';
    try {
      await fs.rm(memoryPath, { recursive: true, force: true });
    } catch (error) {
      // Ignore if directory doesn't exist
    }
  },
};

// Cleanup after all tests
afterAll(async () => {
  await testUtils.cleanupTestMemory();
});
