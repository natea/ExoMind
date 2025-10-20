/**
 * Health Report Generator
 *
 * Generates comprehensive health reports with scoring, issue identification,
 * and actionable recommendations.
 */

import {
  HealthReport,
  CheckResult,
  IntegrationStatus,
  MemoryHealth,
  ConfigHealth,
  TemplateHealth,
  HealthStatus,
  HealthFix
} from '../types/health.js';

/**
 * Calculate overall health score (0-100)
 */
export function calculateHealthScore(checks: CheckResult[]): number {
  if (checks.length === 0) return 0;

  let totalScore = 0;
  const weights = {
    healthy: 100,
    degraded: 60,
    unhealthy: 20,
    unknown: 40
  };

  for (const check of checks) {
    totalScore += weights[check.status] || 0;
  }

  return Math.round(totalScore / checks.length);
}

/**
 * Determine overall status from checks
 */
export function determineOverallStatus(checks: CheckResult[]): HealthStatus {
  const unhealthy = checks.filter(c => c.status === 'unhealthy').length;
  const degraded = checks.filter(c => c.status === 'degraded').length;
  const unknown = checks.filter(c => c.status === 'unknown').length;

  // Any critical system unhealthy = overall unhealthy
  if (unhealthy > 0) return 'unhealthy';

  // More than 30% degraded/unknown = overall degraded
  if ((degraded + unknown) / checks.length > 0.3) return 'degraded';

  // Some issues but mostly healthy = degraded
  if (degraded > 0 || unknown > 0) return 'degraded';

  return 'healthy';
}

/**
 * Extract critical issues from checks
 */
export function extractCriticalIssues(checks: CheckResult[]): string[] {
  const critical: string[] = [];

  for (const check of checks) {
    if (check.status === 'unhealthy') {
      critical.push(`${check.name}: ${check.error || check.message}`);
    }
  }

  return critical;
}

/**
 * Extract warnings from checks
 */
export function extractWarnings(checks: CheckResult[]): string[] {
  const warnings: string[] = [];

  for (const check of checks) {
    if (check.status === 'degraded') {
      warnings.push(`${check.name}: ${check.message}`);
    }
  }

  return warnings;
}

/**
 * Generate recommendations based on health status
 */
export function generateRecommendations(report: HealthReport): string[] {
  const recommendations: string[] = [];

  // Integration recommendations
  for (const integration of report.integrations) {
    if (!integration.available) {
      if (integration.type === 'todoist') {
        recommendations.push('Configure Todoist API key in .env file');
      } else if (integration.type === 'gmail' || integration.type === 'calendar') {
        recommendations.push('Install Google Workspace MCP: claude mcp add google-workspace');
      } else if (integration.type === 'whatsapp') {
        recommendations.push('Install WhatsApp MCP: claude mcp add whatsapp');
      } else if (integration.type === 'claude-flow') {
        recommendations.push('Install Claude Flow MCP: claude mcp add claude-flow npx claude-flow@alpha mcp start');
      }
    }
  }

  // Memory recommendations
  if (report.memory.status === 'unhealthy') {
    if (!report.memory.directoryExists) {
      recommendations.push('Create memory directory: mkdir -p .memory');
    }
    if (!report.memory.permissions.readable) {
      recommendations.push('Fix memory directory read permissions: chmod u+r .memory');
    }
    if (!report.memory.permissions.writable) {
      recommendations.push('Fix memory directory write permissions: chmod u+w .memory');
    }
  }

  if (report.memory.corruptedFiles.length > 0) {
    recommendations.push(`Remove ${report.memory.corruptedFiles.length} corrupted memory file(s)`);
  }

  if (report.memory.orphanedFiles.length > 10) {
    recommendations.push('Run memory cleanup to remove orphaned files');
  }

  // Config recommendations
  if (report.config.status === 'unhealthy') {
    for (const [envVar, present] of Object.entries(report.config.requiredEnvVars)) {
      if (!present) {
        recommendations.push(`Set required environment variable: ${envVar}`);
      }
    }
  }

  // Template recommendations
  if (report.templates.status === 'unhealthy') {
    if (report.templates.missingTemplates.length > 0) {
      recommendations.push(`Install missing templates: ${report.templates.missingTemplates.join(', ')}`);
    }
    if (report.templates.invalidTemplates.length > 0) {
      recommendations.push(`Fix invalid templates: ${report.templates.invalidTemplates.join(', ')}`);
    }
  }

  // General recommendations
  if (report.overallScore < 70) {
    recommendations.push('Run full system diagnostics: npm run health:detailed');
  }

  return recommendations;
}

/**
 * Generate suggested fixes for issues
 */
export function generateFixes(report: HealthReport): HealthFix[] {
  const fixes: HealthFix[] = [];

  // Critical issues first
  for (const issue of report.criticalIssues) {
    if (issue.includes('Todoist')) {
      fixes.push({
        issue,
        severity: 'critical',
        suggestion: 'Configure Todoist API key',
        command: 'echo "TODOIST_API_KEY=your_key_here" >> .env',
        documentation: 'https://todoist.com/help/articles/find-your-api-token'
      });
    } else if (issue.includes('Memory directory')) {
      fixes.push({
        issue,
        severity: 'critical',
        suggestion: 'Create memory directory structure',
        command: 'mkdir -p .memory && chmod 755 .memory'
      });
    }
  }

  // Warning level issues
  for (const warning of report.warnings) {
    if (warning.includes('orphaned')) {
      fixes.push({
        issue: warning,
        severity: 'warning',
        suggestion: 'Run memory cleanup utility',
        command: 'npm run memory:cleanup'
      });
    } else if (warning.includes('MCP not configured')) {
      fixes.push({
        issue: warning,
        severity: 'warning',
        suggestion: 'Install missing MCP server',
        documentation: 'See configuration-guide.md for MCP setup'
      });
    }
  }

  return fixes;
}

/**
 * Format health report for console display
 */
export function formatForConsole(report: HealthReport): string {
  const lines: string[] = [];

  // Header
  lines.push('═'.repeat(70));
  lines.push('LIFE OS HEALTH REPORT');
  lines.push(`Generated: ${report.timestamp.toISOString()}`);
  lines.push('═'.repeat(70));
  lines.push('');

  // Overall status
  const statusEmoji = {
    healthy: '✅',
    degraded: '⚠️',
    unhealthy: '❌',
    unknown: '❓'
  };

  lines.push(`Overall Status: ${statusEmoji[report.overallStatus]} ${report.overallStatus.toUpperCase()}`);
  lines.push(`Health Score: ${report.overallScore}/100`);
  lines.push('');

  // Summary
  lines.push('Summary:');
  lines.push(`  Total Checks: ${report.summary.totalChecks}`);
  lines.push(`  ✅ Healthy: ${report.summary.healthy}`);
  lines.push(`  ⚠️  Degraded: ${report.summary.degraded}`);
  lines.push(`  ❌ Unhealthy: ${report.summary.unhealthy}`);
  lines.push(`  ❓ Unknown: ${report.summary.unknown}`);
  lines.push('');

  // Critical issues
  if (report.criticalIssues.length > 0) {
    lines.push('❌ CRITICAL ISSUES:');
    for (const issue of report.criticalIssues) {
      lines.push(`  • ${issue}`);
    }
    lines.push('');
  }

  // Warnings
  if (report.warnings.length > 0) {
    lines.push('⚠️  WARNINGS:');
    for (const warning of report.warnings) {
      lines.push(`  • ${warning}`);
    }
    lines.push('');
  }

  // Integrations
  lines.push('Integrations:');
  for (const integration of report.integrations) {
    const emoji = statusEmoji[integration.status];
    const status = integration.available ? integration.status : 'unavailable';
    lines.push(`  ${emoji} ${integration.type}: ${status}`);
  }
  lines.push('');

  // Memory
  const memEmoji = statusEmoji[report.memory.status];
  const sizeMB = (report.memory.totalSizeBytes / (1024 * 1024)).toFixed(2);
  lines.push(`Memory System: ${memEmoji}`);
  lines.push(`  Files: ${report.memory.fileCount} (${sizeMB} MB)`);
  lines.push(`  Recent: ${report.memory.recentFiles}`);
  if (report.memory.issues.length > 0) {
    lines.push(`  Issues: ${report.memory.issues.join(', ')}`);
  }
  lines.push('');

  // Recommendations
  if (report.recommendations.length > 0) {
    lines.push('💡 RECOMMENDATIONS:');
    for (const rec of report.recommendations) {
      lines.push(`  • ${rec}`);
    }
    lines.push('');
  }

  lines.push('═'.repeat(70));

  return lines.join('\n');
}

/**
 * Format health report for WhatsApp display
 */
export function formatForWhatsApp(report: HealthReport): string {
  const statusEmoji = {
    healthy: '✅',
    degraded: '⚠️',
    unhealthy: '❌',
    unknown: '❓'
  };

  const lines: string[] = [];

  lines.push('*LIFE OS HEALTH CHECK*');
  lines.push('');
  lines.push(`Status: ${statusEmoji[report.overallStatus]} *${report.overallStatus.toUpperCase()}*`);
  lines.push(`Score: *${report.overallScore}/100*`);
  lines.push('');

  if (report.criticalIssues.length > 0) {
    lines.push('*Critical Issues:*');
    for (const issue of report.criticalIssues.slice(0, 3)) {
      lines.push(`❌ ${issue}`);
    }
    lines.push('');
  }

  // Top 3 recommendations
  if (report.recommendations.length > 0) {
    lines.push('*Top Recommendations:*');
    for (const rec of report.recommendations.slice(0, 3)) {
      lines.push(`💡 ${rec}`);
    }
  }

  return lines.join('\n');
}

/**
 * Format health report as JSON
 */
export function formatAsJson(report: HealthReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Create summary object from checks
 */
export function createSummary(checks: CheckResult[]) {
  return {
    totalChecks: checks.length,
    healthy: checks.filter(c => c.status === 'healthy').length,
    degraded: checks.filter(c => c.status === 'degraded').length,
    unhealthy: checks.filter(c => c.status === 'unhealthy').length,
    unknown: checks.filter(c => c.status === 'unknown').length
  };
}
