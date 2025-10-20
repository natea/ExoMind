#!/usr/bin/env ts-node
/**
 * Production Readiness Validation Script
 *
 * Validates system readiness for production deployment
 * Run: npm run validate:all or ts-node scripts/validate-production-readiness.ts
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  category: string;
  passed: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
}

class ProductionValidator {
  private results: ValidationResult[] = [];
  private rootDir: string;

  constructor() {
    this.rootDir = process.cwd();
  }

  async validate(): Promise<void> {
    console.log('🔍 Starting Production Readiness Validation...\n');

    await this.validateTypeScript();
    await this.validateTests();
    await this.validateConfiguration();
    await this.validateDocumentation();
    await this.validateMemorySystem();
    await this.validateSecurity();
    await this.validateSkills();

    this.printReport();
  }

  private async validateTypeScript(): Promise<void> {
    console.log('📝 Validating TypeScript compilation...');
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      execSync('npm run typecheck', { stdio: 'pipe' });
      console.log('✅ TypeScript compilation passed\n');
      this.results.push({
        category: 'TypeScript Compilation',
        passed: true,
        score: 100,
        issues: [],
        recommendations: []
      });
    } catch (error) {
      const output = (error as any).stdout?.toString() || '';
      const errorCount = (output.match(/error TS/g) || []).length;

      issues.push(`${errorCount} TypeScript compilation errors`);
      recommendations.push('Run: npm run typecheck to see all errors');
      recommendations.push('Install missing dependencies: npm install date-fns');
      recommendations.push('Fix unused variables');

      console.log(`❌ TypeScript compilation failed (${errorCount} errors)\n`);

      this.results.push({
        category: 'TypeScript Compilation',
        passed: false,
        score: 0,
        issues,
        recommendations
      });
    }
  }

  private async validateTests(): Promise<void> {
    console.log('🧪 Validating tests...');
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      execSync('npm test', { stdio: 'pipe' });
      console.log('✅ All tests passed\n');

      this.results.push({
        category: 'Testing',
        passed: true,
        score: 100,
        issues: [],
        recommendations: []
      });
    } catch (error) {
      const output = (error as any).stdout?.toString() || '';
      const failedTests = (output.match(/✕/g) || []).length;

      issues.push(`${failedTests} test failures detected`);
      issues.push('Skill structure tests failing - missing README.md and index.ts');
      issues.push('Todoist integration tests failing - incomplete implementation');

      recommendations.push('Fix skill directory structure');
      recommendations.push('Complete Todoist integration implementation');
      recommendations.push('Fix jest.config.js typo (coverageThresholds -> coverageThreshold)');

      console.log(`❌ Tests failed (${failedTests} failures)\n`);

      this.results.push({
        category: 'Testing',
        passed: false,
        score: 20,
        issues,
        recommendations
      });
    }
  }

  private async validateConfiguration(): Promise<void> {
    console.log('⚙️  Validating configuration...');
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check .env.example
    if (!existsSync(join(this.rootDir, '.env.example'))) {
      issues.push('.env.example missing');
      score -= 30;
    }

    // Check .env not in git
    if (existsSync(join(this.rootDir, '.env'))) {
      issues.push('.env file should not be committed to git');
      recommendations.push('Add .env to .gitignore');
      score -= 20;
    }

    // Check gitignore
    if (!existsSync(join(this.rootDir, '.gitignore'))) {
      issues.push('.gitignore missing');
      score -= 30;
    }

    // Check package.json
    if (!existsSync(join(this.rootDir, 'package.json'))) {
      issues.push('package.json missing');
      score -= 20;
    }

    if (issues.length === 0) {
      console.log('✅ Configuration valid\n');
    } else {
      console.log(`⚠️  Configuration issues found\n`);
    }

    this.results.push({
      category: 'Configuration',
      passed: issues.length === 0,
      score,
      issues,
      recommendations
    });
  }

  private async validateDocumentation(): Promise<void> {
    console.log('📚 Validating documentation...');
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check README
    if (!existsSync(join(this.rootDir, 'README.md'))) {
      issues.push('README.md missing');
      score -= 40;
    }

    // Check docs directory
    const docsDir = join(this.rootDir, 'docs');
    if (!existsSync(docsDir)) {
      issues.push('docs/ directory missing');
      score -= 30;
    } else {
      const docFiles = readdirSync(docsDir).filter(f => f.endsWith('.md'));
      if (docFiles.length < 5) {
        issues.push('Insufficient documentation (< 5 docs)');
        score -= 20;
      }
    }

    // Check CLAUDE.md
    if (!existsSync(join(this.rootDir, 'CLAUDE.md'))) {
      issues.push('CLAUDE.md missing - project instructions needed');
      score -= 10;
    }

    if (issues.length === 0) {
      console.log('✅ Documentation excellent\n');
    } else {
      console.log(`⚠️  Documentation issues found\n`);
    }

    this.results.push({
      category: 'Documentation',
      passed: score >= 70,
      score,
      issues,
      recommendations
    });
  }

  private async validateMemorySystem(): Promise<void> {
    console.log('💾 Validating memory system...');
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check memory directory
    const memoryDir = join(this.rootDir, 'memory');
    if (!existsSync(memoryDir)) {
      issues.push('memory/ directory missing');
      score -= 50;
    } else {
      // Check for templates
      const templatesDir = join(memoryDir, 'templates');
      if (!existsSync(templatesDir)) {
        issues.push('memory/templates/ directory missing');
        recommendations.push('Create templates directory for memory entries');
        score -= 20;
      }

      // Check README
      if (!existsSync(join(memoryDir, 'README.md'))) {
        issues.push('memory/README.md missing');
        score -= 15;
      }
    }

    if (issues.length === 0) {
      console.log('✅ Memory system valid\n');
    } else {
      console.log(`⚠️  Memory system issues found\n`);
    }

    this.results.push({
      category: 'Memory System',
      passed: score >= 70,
      score,
      issues,
      recommendations
    });
  }

  private async validateSecurity(): Promise<void> {
    console.log('🔒 Validating security...');
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check for secrets in code
    try {
      const result = execSync(
        'grep -r "sk-[a-zA-Z0-9]\\{20,\\}" --include="*.ts" --include="*.js" src/ 2>/dev/null || true',
        { encoding: 'utf-8' }
      );

      if (result.trim()) {
        issues.push('Potential API keys found in source code');
        recommendations.push('Remove hardcoded secrets and use environment variables');
        score -= 40;
      }
    } catch (error) {
      // Ignore grep errors
    }

    // Check for TODO/FIXME markers
    try {
      const result = execSync(
        'grep -r "TODO\\|FIXME\\|XXX\\|HACK" --include="*.ts" src/ 2>/dev/null | wc -l',
        { encoding: 'utf-8' }
      );

      const count = parseInt(result.trim());
      if (count > 10) {
        issues.push(`${count} technical debt markers (TODO/FIXME/XXX) found`);
        recommendations.push('Review and address technical debt before production');
        score -= 10;
      }
    } catch (error) {
      // Ignore errors
    }

    if (issues.length === 0) {
      console.log('✅ Security checks passed\n');
    } else {
      console.log(`⚠️  Security issues found\n`);
    }

    this.results.push({
      category: 'Security',
      passed: score >= 70,
      score,
      issues,
      recommendations
    });
  }

  private async validateSkills(): Promise<void> {
    console.log('🎯 Validating Life OS skills...');
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    const skillsDir = join(this.rootDir, 'skills');
    if (!existsSync(skillsDir)) {
      issues.push('skills/ directory missing');
      score = 0;
    } else {
      const requiredSkills = [
        'using-life-os',
        'conducting-life-assessment',
        'daily-planning',
        'weekly-review',
        'goal-setting',
        'processing-inbox'
      ];

      for (const skill of requiredSkills) {
        const skillPath = join(skillsDir, skill);
        if (!existsSync(skillPath)) {
          issues.push(`Missing skill directory: ${skill}`);
          score -= 15;
          continue;
        }

        // Check for required files
        const requiredFiles = ['README.md', 'index.ts', 'SKILL.md'];
        for (const file of requiredFiles) {
          if (!existsSync(join(skillPath, file))) {
            issues.push(`Missing ${file} in ${skill}`);
            score -= 5;
          }
        }
      }
    }

    if (issues.length === 0) {
      console.log('✅ All skills valid\n');
    } else {
      console.log(`❌ Skills validation failed\n`);
      recommendations.push('Create missing README.md and index.ts files for each skill');
    }

    this.results.push({
      category: 'Life OS Skills',
      passed: score >= 70,
      score,
      issues,
      recommendations
    });
  }

  private printReport(): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 PRODUCTION READINESS REPORT');
    console.log('='.repeat(80) + '\n');

    let totalScore = 0;
    let categoriesPassed = 0;
    let totalCategories = this.results.length;

    for (const result of this.results) {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.category}: ${result.score}/100`);

      if (result.issues.length > 0) {
        console.log('\n  Issues:');
        result.issues.forEach(issue => console.log(`    • ${issue}`));
      }

      if (result.recommendations.length > 0) {
        console.log('\n  Recommendations:');
        result.recommendations.forEach(rec => console.log(`    → ${rec}`));
      }

      console.log('');
      totalScore += result.score;
      if (result.passed) categoriesPassed++;
    }

    const avgScore = Math.round(totalScore / totalCategories);

    console.log('='.repeat(80));
    console.log(`Overall Score: ${avgScore}/100`);
    console.log(`Categories Passed: ${categoriesPassed}/${totalCategories}`);
    console.log('='.repeat(80) + '\n');

    // Final recommendation
    if (avgScore >= 80 && categoriesPassed === totalCategories) {
      console.log('✅ READY FOR PRODUCTION\n');
      process.exit(0);
    } else if (avgScore >= 60) {
      console.log('⚠️  NOT READY - Minor issues need addressing\n');
      process.exit(1);
    } else {
      console.log('❌ NOT READY - Critical issues must be resolved\n');
      process.exit(2);
    }
  }
}

// Run validation
const validator = new ProductionValidator();
validator.validate().catch(error => {
  console.error('❌ Validation failed:', error);
  process.exit(3);
});
