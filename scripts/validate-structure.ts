#!/usr/bin/env node
/**
 * Directory Structure Validation Script
 * Validates that the Life OS Skills project has the correct directory structure
 */

import * as fs from 'fs';
import * as path from 'path';

interface DirectoryCheck {
  path: string;
  required: boolean;
  description: string;
}

const requiredStructure: DirectoryCheck[] = [
  // Core directories
  { path: 'skills', required: true, description: 'Skills directory' },
  { path: 'tests', required: true, description: 'Tests directory' },
  { path: 'tests/unit', required: true, description: 'Unit tests' },
  { path: 'tests/integration', required: true, description: 'Integration tests' },
  { path: 'tests/skills', required: true, description: 'Skill-specific tests' },
  { path: 'scripts', required: true, description: 'Utility scripts' },
  { path: 'memory', required: false, description: 'Memory storage (created at runtime)' },

  // Life OS Skill directories
  { path: 'skills/using-life-os', required: true, description: 'Using Life OS skill' },
  { path: 'skills/conducting-life-assessment', required: true, description: 'Life Assessment skill' },
  { path: 'skills/daily-planning', required: true, description: 'Daily Planning skill' },
  { path: 'skills/weekly-review', required: true, description: 'Weekly Review skill' },
  { path: 'skills/goal-setting', required: true, description: 'Goal Setting skill' },
  { path: 'skills/processing-inbox', required: true, description: 'Processing Inbox skill' },
];

const requiredFiles: DirectoryCheck[] = [
  { path: '.env.example', required: true, description: 'Environment template' },
  { path: 'package.json', required: true, description: 'Package configuration' },
  { path: 'tsconfig.json', required: false, description: 'TypeScript configuration' },
  { path: 'jest.config.js', required: false, description: 'Jest configuration' },
];

class StructureValidator {
  private rootDir: string;
  private errors: string[] = [];
  private warnings: string[] = [];
  private success: string[] = [];

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = rootDir;
  }

  /**
   * Validate the entire project structure
   */
  validate(): boolean {
    console.log('🔍 Validating Life OS Skills project structure...\n');

    this.validateDirectories();
    this.validateFiles();

    this.printResults();

    return this.errors.length === 0;
  }

  /**
   * Validate directory structure
   */
  private validateDirectories(): void {
    for (const dir of requiredStructure) {
      const fullPath = path.join(this.rootDir, dir.path);

      if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
          this.success.push(`✅ ${dir.path} - ${dir.description}`);
        } else {
          this.errors.push(`❌ ${dir.path} exists but is not a directory`);
        }
      } else {
        if (dir.required) {
          this.errors.push(`❌ Missing required directory: ${dir.path} - ${dir.description}`);
        } else {
          this.warnings.push(`⚠️  Optional directory missing: ${dir.path} - ${dir.description}`);
        }
      }
    }
  }

  /**
   * Validate required files
   */
  private validateFiles(): void {
    for (const file of requiredFiles) {
      const fullPath = path.join(this.rootDir, file.path);

      if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isFile()) {
          this.success.push(`✅ ${file.path} - ${file.description}`);
        } else {
          this.errors.push(`❌ ${file.path} exists but is not a file`);
        }
      } else {
        if (file.required) {
          this.errors.push(`❌ Missing required file: ${file.path} - ${file.description}`);
        } else {
          this.warnings.push(`⚠️  Optional file missing: ${file.path} - ${file.description}`);
        }
      }
    }
  }

  /**
   * Print validation results
   */
  private printResults(): void {
    console.log('\n📊 Validation Results:\n');

    if (this.success.length > 0) {
      console.log('✅ Valid Structure:\n');
      this.success.forEach(msg => console.log(`  ${msg}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:\n');
      this.warnings.forEach(msg => console.log(`  ${msg}`));
      console.log('');
    }

    if (this.errors.length > 0) {
      console.log('❌ Errors:\n');
      this.errors.forEach(msg => console.log(`  ${msg}`));
      console.log('');
    }

    console.log('━'.repeat(60));

    if (this.errors.length === 0) {
      console.log('✅ Project structure is valid!');
      console.log(`   ${this.success.length} checks passed`);
      if (this.warnings.length > 0) {
        console.log(`   ${this.warnings.length} optional items missing`);
      }
    } else {
      console.log('❌ Project structure validation failed!');
      console.log(`   ${this.errors.length} errors found`);
      console.log(`   ${this.warnings.length} warnings`);
    }

    console.log('━'.repeat(60) + '\n');
  }

  /**
   * Create missing directories (repair mode)
   */
  createMissingDirectories(): void {
    console.log('🔧 Creating missing directories...\n');

    for (const dir of requiredStructure) {
      const fullPath = path.join(this.rootDir, dir.path);

      if (!fs.existsSync(fullPath)) {
        try {
          fs.mkdirSync(fullPath, { recursive: true });
          console.log(`✅ Created: ${dir.path}`);
        } catch (error) {
          console.error(`❌ Failed to create ${dir.path}:`, error);
        }
      }
    }

    console.log('\n✅ Directory creation complete!\n');
  }
}

// CLI execution
const args = process.argv.slice(2);
const repairMode = args.includes('--repair') || args.includes('-r');
const helpMode = args.includes('--help') || args.includes('-h');

if (helpMode) {
  console.log(`
Life OS Skills Structure Validator

Usage:
  npm run validate-structure           Validate project structure
  npm run validate-structure --repair  Create missing directories
  npm run validate-structure --help    Show this help message

Options:
  --repair, -r    Create missing directories
  --help, -h      Show help message
  `);
  process.exit(0);
}

const validator = new StructureValidator();

if (repairMode) {
  validator.createMissingDirectories();
}

const isValid = validator.validate();
process.exit(isValid ? 0 : 1);
