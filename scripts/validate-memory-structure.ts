#!/usr/bin/env node

/**
 * Memory Structure Validation Script
 * Validates the Life OS memory directory structure and templates
 */

import { readdir, stat, readFile, access } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

const REQUIRED_DIRS = [
  'assessments',
  'objectives',
  'objectives/active-plans',
  'objectives/okrs',
  'gtd',
  'reviews',
  'reviews/daily',
  'reviews/weekly',
  'reviews/monthly',
  'reviews/quarterly',
  'reference',
  'reference/decisions'
];

const REQUIRED_FILES = [
  'README.md',
  '.gitignore',
  'gtd/inbox.md',
  'gtd/next-actions.md',
  'gtd/projects.md',
  'gtd/waiting.md',
  'gtd/someday.md',
  'reviews/daily/.template.md',
  'reviews/weekly/.template.md',
  'reviews/monthly/.template.md',
  'reviews/quarterly/.template.md',
  'assessments/.template.md',
  'objectives/active-plans/.template.md',
  'objectives/okrs/.template.md',
  'reference/decisions/.template.md'
];

// Optional indicators for future use
// const OPTIONAL_INDICATORS = [
//   'reviews/daily/*.md',
//   'reviews/weekly/*.md',
//   'reviews/monthly/*.md',
//   'reviews/quarterly/*.md'
// ];

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function countFilesInDir(dirPath: string): Promise<number> {
  try {
    const files = await readdir(dirPath);
    return files.filter(f => !f.startsWith('.')).length;
  } catch {
    return 0;
  }
}

async function validateDirectoryStructure(
  basePath: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: []
  };

  // Check if base directory exists
  if (!(await fileExists(basePath))) {
    result.valid = false;
    result.errors.push(`Memory directory not found: ${basePath}`);
    return result;
  }

  if (!(await isDirectory(basePath))) {
    result.valid = false;
    result.errors.push(`Path exists but is not a directory: ${basePath}`);
    return result;
  }

  result.info.push(`✓ Base directory exists: ${basePath}`);

  // Validate required directories
  for (const dir of REQUIRED_DIRS) {
    const dirPath = join(basePath, dir);
    if (!(await fileExists(dirPath))) {
      result.valid = false;
      result.errors.push(`Required directory missing: ${dir}`);
    } else if (!(await isDirectory(dirPath))) {
      result.valid = false;
      result.errors.push(`Path exists but is not a directory: ${dir}`);
    } else {
      result.info.push(`✓ Directory exists: ${dir}`);
    }
  }

  return result;
}

async function validateRequiredFiles(
  basePath: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: []
  };

  for (const file of REQUIRED_FILES) {
    const filePath = join(basePath, file);
    if (!(await fileExists(filePath))) {
      result.valid = false;
      result.errors.push(`Required file missing: ${file}`);
    } else {
      // Check if file has content
      const content = await readFile(filePath, 'utf-8');
      if (content.trim().length === 0) {
        result.warnings.push(`File is empty: ${file}`);
      } else {
        result.info.push(`✓ File exists with content: ${file}`);
      }
    }
  }

  return result;
}

async function validateTemplates(basePath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: []
  };

  const templateFiles = REQUIRED_FILES.filter(f => f.includes('.template.md'));

  for (const template of templateFiles) {
    const templatePath = join(basePath, template);
    const content = await readFile(templatePath, 'utf-8');

    // Check for key sections in templates
    const requiredSections = {
      'reviews/daily/.template.md': ['Morning Planning', 'Evening Review'],
      'reviews/weekly/.template.md': ['Get Clear', 'Get Current', 'Get Creative'],
      'reviews/monthly/.template.md': ['Reflection', 'Goal Progress'],
      'reviews/quarterly/.template.md': ['OKR Review', 'Life Assessment'],
      'assessments/.template.md': ['Life Domains Assessment', 'Strategic Insights'],
      'objectives/active-plans/.template.md': ['Vision', 'Success Criteria'],
      'objectives/okrs/.template.md': ['Objective', 'Key Results'],
      'reference/decisions/.template.md': ['Options Considered', 'The Decision']
    };

    const sections = requiredSections[template as keyof typeof requiredSections];
    if (sections) {
      const missingSections = sections.filter(section => !content.includes(section));
      if (missingSections.length > 0) {
        result.warnings.push(
          `Template ${template} missing sections: ${missingSections.join(', ')}`
        );
      } else {
        result.info.push(`✓ Template validated: ${template}`);
      }
    }
  }

  return result;
}

async function checkUsage(basePath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: []
  };

  // Check if any reviews have been created
  const reviewDirs = ['daily', 'weekly', 'monthly', 'quarterly'];
  let hasReviews = false;

  for (const dir of reviewDirs) {
    const dirPath = join(basePath, 'reviews', dir);
    const fileCount = await countFilesInDir(dirPath);
    // Subtract 1 for .template.md
    const reviewCount = fileCount > 0 ? fileCount - 1 : 0;

    if (reviewCount > 0) {
      hasReviews = true;
      result.info.push(`✓ Found ${reviewCount} ${dir} review(s)`);
    }
  }

  if (!hasReviews) {
    result.warnings.push(
      'No reviews found yet. Consider creating your first daily review!'
    );
  }

  // Check GTD usage
  const inboxPath = join(basePath, 'gtd', 'inbox.md');
  const inboxContent = await readFile(inboxPath, 'utf-8');
  const inboxItems = inboxContent.split('\n').filter(line => line.trim().startsWith('-')).length;

  if (inboxItems === 0) {
    result.warnings.push('GTD inbox is empty. Start capturing items!');
  } else {
    result.info.push(`✓ GTD inbox has ${inboxItems} item(s)`);
  }

  // Check for active OKRs
  const okrsDir = join(basePath, 'objectives/okrs');
  const okrsCount = await countFilesInDir(okrsDir);
  if (okrsCount <= 1) {
    // Only .template.md
    result.warnings.push('No OKRs set yet. Consider quarterly planning!');
  } else {
    result.info.push(`✓ Found ${okrsCount - 1} OKR file(s)`);
  }

  return result;
}

async function validateGitIgnore(basePath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: []
  };

  const gitignorePath = join(basePath, '.gitignore');
  const content = await readFile(gitignorePath, 'utf-8');

  // Check for key patterns
  const requiredPatterns = ['*', '!.gitignore', '!README.md', '!*/.template.md'];

  for (const pattern of requiredPatterns) {
    if (!content.includes(pattern)) {
      result.warnings.push(`.gitignore missing pattern: ${pattern}`);
    }
  }

  if (result.warnings.length === 0) {
    result.info.push('✓ .gitignore properly configured');
  }

  return result;
}

function mergeResults(...results: ValidationResult[]): ValidationResult {
  return {
    valid: results.every(r => r.valid),
    errors: results.flatMap(r => r.errors),
    warnings: results.flatMap(r => r.warnings),
    info: results.flatMap(r => r.info)
  };
}

function printResults(result: ValidationResult): void {
  console.log('\n' + '='.repeat(60));
  console.log('MEMORY STRUCTURE VALIDATION RESULTS');
  console.log('='.repeat(60) + '\n');

  if (result.info.length > 0) {
    console.log('📋 Information:');
    result.info.forEach(msg => console.log(`  ${msg}`));
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    result.warnings.forEach(msg => console.log(`  ${msg}`));
    console.log('');
  }

  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(msg => console.log(`  ${msg}`));
    console.log('');
  }

  console.log('='.repeat(60));
  if (result.valid) {
    console.log('✅ VALIDATION PASSED');
    if (result.warnings.length > 0) {
      console.log(`   (with ${result.warnings.length} warning(s))`);
    }
  } else {
    console.log('❌ VALIDATION FAILED');
    console.log(`   ${result.errors.length} error(s) found`);
  }
  console.log('='.repeat(60) + '\n');
}

async function main() {
  const args = process.argv.slice(2);
  const basePath = args[0] || './memory';

  console.log(`\nValidating memory structure at: ${basePath}\n`);

  try {
    const results = await Promise.all([
      validateDirectoryStructure(basePath),
      validateRequiredFiles(basePath),
      validateTemplates(basePath),
      validateGitIgnore(basePath),
      checkUsage(basePath)
    ]);

    const finalResult = mergeResults(...results);
    printResults(finalResult);

    // Exit with appropriate code
    process.exit(finalResult.valid ? 0 : 1);
  } catch (error) {
    console.error('Validation failed with error:', error);
    process.exit(1);
  }
}

main();
