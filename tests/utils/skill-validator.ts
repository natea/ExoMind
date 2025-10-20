/**
 * Skill Validation Utilities
 * Helper functions for testing Life OS skills
 */

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Skill structure requirements
 */
export interface SkillStructure {
  name: string;
  description: string;
  requiredFiles: string[];
  optionalFiles: string[];
}

/**
 * Validate that a skill directory has the correct structure
 */
export async function validateSkillStructure(
  skillPath: string,
  structure: SkillStructure
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if skill directory exists
  try {
    const stats = await fs.stat(skillPath);
    if (!stats.isDirectory()) {
      errors.push(`${skillPath} is not a directory`);
      return { valid: false, errors, warnings };
    }
  } catch (error) {
    errors.push(`Skill directory not found: ${skillPath}`);
    return { valid: false, errors, warnings };
  }

  // Check required files
  for (const file of structure.requiredFiles) {
    const filePath = path.join(skillPath, file);
    try {
      await fs.access(filePath);
    } catch (error) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  // Check optional files
  for (const file of structure.optionalFiles) {
    const filePath = path.join(skillPath, file);
    try {
      await fs.access(filePath);
    } catch (error) {
      warnings.push(`Optional file not found: ${file}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Standard Life OS skill structure
 */
export const STANDARD_SKILL_STRUCTURE: Omit<SkillStructure, 'name' | 'description'> = {
  requiredFiles: [
    'README.md',
    'index.ts',
  ],
  optionalFiles: [
    'examples.md',
    'templates/',
    'config.json',
  ],
};

/**
 * Validate skill exports
 */
export function validateSkillExports(skillModule: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for required exports
  if (typeof skillModule.default !== 'function') {
    errors.push('Skill must have a default export function');
  }

  if (!skillModule.metadata || typeof skillModule.metadata !== 'object') {
    errors.push('Skill must export metadata object');
  } else {
    // Validate metadata structure
    const requiredMetadataFields = ['name', 'description', 'version'];
    for (const field of requiredMetadataFields) {
      if (!(field in skillModule.metadata)) {
        errors.push(`Skill metadata missing required field: ${field}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Mock skill execution context for testing
 */
export function createMockSkillContext() {
  const memoryStore = new Map<string, any>();

  return {
    memory: {
      store: jest.fn(async (key: string, value: any) => {
        memoryStore.set(key, value);
      }),
      retrieve: jest.fn(async (key: string) => {
        return memoryStore.get(key) || null;
      }),
      search: jest.fn(async (pattern: string) => {
        const results: Array<{ key: string; value: any }> = [];
        for (const [key, value] of memoryStore.entries()) {
          if (key.includes(pattern)) {
            results.push({ key, value });
          }
        }
        return results;
      }),
      delete: jest.fn(async (key: string) => {
        memoryStore.delete(key);
      }),
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
    user: {
      preferences: {},
    },
  };
}

/**
 * Create a test skill for validation
 */
export function createTestSkill(name: string, handler: (context: any, input: any) => Promise<any>) {
  return {
    default: handler,
    metadata: {
      name,
      description: `Test skill: ${name}`,
      version: '1.0.0',
      author: 'Test',
    },
  };
}
