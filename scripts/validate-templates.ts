#!/usr/bin/env ts-node
/**
 * Template Validation Script
 *
 * Validates all Life OS templates for:
 * - File existence
 * - Markdown structure
 * - Required sections
 * - Front matter format (if present)
 * - Directory structure
 *
 * Usage:
 *   npm run validate-templates           # Run validation
 *   npm run validate-templates --repair  # Auto-fix issues
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  repaired: string[];
}

interface TemplateDefinition {
  path: string;
  requiredSections: string[];
  frontMatter?: boolean;
  description: string;
}

const MEMORY_ROOT = path.resolve(__dirname, '../memory');

const TEMPLATES: TemplateDefinition[] = [
  {
    path: 'reviews/daily/.template.md',
    requiredSections: ['Morning Planning', 'Today\'s Priorities', 'Evening Review', 'What Got Done'],
    description: 'Daily check-in template',
  },
  {
    path: 'reviews/weekly/.template.md',
    requiredSections: ['Week Review', 'Accomplishments', 'Challenges', 'Next Week'],
    description: 'Weekly review template',
  },
  {
    path: 'reviews/monthly/.template.md',
    requiredSections: ['Month Review', 'Progress', 'Goals', 'Focus Areas'],
    description: 'Monthly review template',
  },
  {
    path: 'reviews/quarterly/.template.md',
    requiredSections: ['Quarter Review', 'Major Wins', 'Lessons Learned', 'Strategic Focus'],
    description: 'Quarterly review template',
  },
  {
    path: 'assessments/.template.md',
    requiredSections: [
      'Life Domains Assessment',
      'Career & Work',
      'Financial Health',
      'Health & Fitness',
      'Relationships',
      'Personal Growth',
      'Strategic Insights',
      'Action Planning',
    ],
    description: 'Life assessment template',
  },
  {
    path: 'objectives/okrs/.template.md',
    requiredSections: ['Objectives', 'Key Results', 'Timeline'],
    description: 'OKR template',
  },
  {
    path: 'objectives/active-plans/.template.md',
    requiredSections: ['Plan Overview', 'Goals', 'Actions', 'Timeline'],
    description: 'Active plan template',
  },
  {
    path: 'reference/decisions/.template.md',
    requiredSections: ['Decision', 'Context', 'Options Considered', 'Outcome'],
    description: 'Decision log template',
  },
];

const REQUIRED_DIRECTORIES = [
  'reviews/daily',
  'reviews/weekly',
  'reviews/monthly',
  'reviews/quarterly',
  'assessments',
  'objectives/okrs',
  'objectives/active-plans',
  'reference/decisions',
  'inbox',
  'goals',
  'projects',
  'areas',
  'archive',
];

class TemplateValidator {
  private results: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    repaired: [],
  };

  private repairMode: boolean;

  constructor(repairMode: boolean = false) {
    this.repairMode = repairMode;
  }

  /**
   * Run full validation
   */
  validate(): ValidationResult {
    console.log('🔍 Validating Life OS Templates...\n');

    // 1. Check directory structure
    this.validateDirectoryStructure();

    // 2. Check each template
    for (const template of TEMPLATES) {
      this.validateTemplate(template);
    }

    // 3. Generate report
    this.printReport();

    return this.results;
  }

  /**
   * Validate directory structure
   */
  private validateDirectoryStructure(): void {
    console.log('📁 Checking directory structure...');

    for (const dir of REQUIRED_DIRECTORIES) {
      const dirPath = path.join(MEMORY_ROOT, dir);

      if (!fs.existsSync(dirPath)) {
        this.results.errors.push(`Missing directory: ${dir}`);
        this.results.valid = false;

        if (this.repairMode) {
          try {
            fs.mkdirSync(dirPath, { recursive: true });
            this.results.repaired.push(`Created directory: ${dir}`);
            console.log(`  ✓ Created: ${dir}`);
          } catch (error) {
            console.error(`  ✗ Failed to create: ${dir}`, error);
          }
        }
      } else {
        // Check for .gitkeep file
        const gitkeepPath = path.join(dirPath, '.gitkeep');
        if (!fs.existsSync(gitkeepPath)) {
          this.results.warnings.push(`Missing .gitkeep in: ${dir}`);

          if (this.repairMode) {
            try {
              fs.writeFileSync(gitkeepPath, '');
              this.results.repaired.push(`Created .gitkeep in: ${dir}`);
              console.log(`  ✓ Added .gitkeep to: ${dir}`);
            } catch (error) {
              console.error(`  ✗ Failed to add .gitkeep to: ${dir}`, error);
            }
          }
        }
      }
    }

    console.log();
  }

  /**
   * Validate a single template
   */
  private validateTemplate(template: TemplateDefinition): void {
    const templatePath = path.join(MEMORY_ROOT, template.path);
    console.log(`📄 Validating: ${template.description}`);
    console.log(`   Path: ${template.path}`);

    // Check file exists
    if (!fs.existsSync(templatePath)) {
      this.results.errors.push(`Template not found: ${template.path}`);
      this.results.valid = false;
      console.log('   ✗ File does not exist\n');
      return;
    }

    try {
      const content = fs.readFileSync(templatePath, 'utf-8');

      // Check not empty
      if (!content.trim()) {
        this.results.errors.push(`Template is empty: ${template.path}`);
        this.results.valid = false;
        console.log('   ✗ File is empty\n');
        return;
      }

      // Check markdown structure
      this.validateMarkdownStructure(template, content);

      // Check required sections
      this.validateSections(template, content);

      // Check front matter if required
      if (template.frontMatter) {
        this.validateFrontMatter(template, content);
      }

      console.log('   ✓ Valid\n');
    } catch (error) {
      this.results.errors.push(`Error reading template ${template.path}: ${error}`);
      this.results.valid = false;
      console.log(`   ✗ Error: ${error}\n`);
    }
  }

  /**
   * Validate markdown structure
   */
  private validateMarkdownStructure(template: TemplateDefinition, content: string): void {
    // Check for headers
    const headers = content.match(/^#+\s+.+$/gm);
    if (!headers || headers.length === 0) {
      this.results.warnings.push(`No markdown headers found in: ${template.path}`);
      console.log('   ⚠ No headers found');
    }

    // Check for reasonable length
    const lines = content.split('\n').length;
    if (lines < 10) {
      this.results.warnings.push(`Template seems too short (${lines} lines): ${template.path}`);
      console.log(`   ⚠ Short template (${lines} lines)`);
    }
  }

  /**
   * Validate required sections
   */
  private validateSections(template: TemplateDefinition, content: string): void {
    const missingSections: string[] = [];

    for (const section of template.requiredSections) {
      // Case-insensitive search for section headers
      const sectionRegex = new RegExp(`^#+\\s+.*${section}.*$`, 'im');
      if (!sectionRegex.test(content)) {
        missingSections.push(section);
      }
    }

    if (missingSections.length > 0) {
      this.results.errors.push(
        `Missing sections in ${template.path}: ${missingSections.join(', ')}`
      );
      this.results.valid = false;
      console.log(`   ✗ Missing sections: ${missingSections.join(', ')}`);
    }
  }

  /**
   * Validate front matter format
   */
  private validateFrontMatter(template: TemplateDefinition, content: string): void {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontMatterRegex);

    if (!match) {
      this.results.warnings.push(`No front matter found in: ${template.path}`);
      console.log('   ⚠ No front matter');
      return;
    }

    const frontMatter = match[1];

    // Check for required front matter fields
    const requiredFields = ['title', 'date'];
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      const fieldRegex = new RegExp(`^${field}:`, 'm');
      if (!fieldRegex.test(frontMatter)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      this.results.warnings.push(
        `Missing front matter fields in ${template.path}: ${missingFields.join(', ')}`
      );
      console.log(`   ⚠ Missing front matter fields: ${missingFields.join(', ')}`);
    }
  }

  /**
   * Print validation report
   */
  private printReport(): void {
    console.log('═══════════════════════════════════════════════');
    console.log('📊 VALIDATION REPORT');
    console.log('═══════════════════════════════════════════════\n');

    if (this.results.valid && this.results.warnings.length === 0) {
      console.log('✅ All templates are valid!\n');
    } else {
      if (this.results.errors.length > 0) {
        console.log('❌ ERRORS:\n');
        this.results.errors.forEach(error => {
          console.log(`  • ${error}`);
        });
        console.log();
      }

      if (this.results.warnings.length > 0) {
        console.log('⚠️  WARNINGS:\n');
        this.results.warnings.forEach(warning => {
          console.log(`  • ${warning}`);
        });
        console.log();
      }

      if (this.results.repaired.length > 0) {
        console.log('🔧 AUTO-REPAIRED:\n');
        this.results.repaired.forEach(repair => {
          console.log(`  • ${repair}`);
        });
        console.log();
      }
    }

    console.log('SUMMARY:');
    console.log(`  Templates checked: ${TEMPLATES.length}`);
    console.log(`  Directories checked: ${REQUIRED_DIRECTORIES.length}`);
    console.log(`  Errors: ${this.results.errors.length}`);
    console.log(`  Warnings: ${this.results.warnings.length}`);
    console.log(`  Auto-repaired: ${this.results.repaired.length}`);
    console.log();
  }
}

// Run validation
const args = process.argv.slice(2);
const repairMode = args.includes('--repair');

const validator = new TemplateValidator(repairMode);
const results = validator.validate();

// Exit with appropriate code
process.exit(results.valid ? 0 : 1);
