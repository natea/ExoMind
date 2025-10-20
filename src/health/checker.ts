/**
 * Health Check Orchestrator
 *
 * Main entry point for running comprehensive system health checks.
 * Coordinates checks across integrations, memory, config, and templates.
 */

import {
  HealthReport,
  CheckResult,
  HealthCheckOptions,
  ConfigHealth,
  TemplateHealth,
  HealthStatus
} from '../types/health.js';
import {
  checkAllIntegrations,
  integrationToCheckResult
} from './integration-checks.js';
import {
  checkMemoryHealth,
  memoryToCheckResult
} from './memory-checks.js';
import {
  calculateHealthScore,
  determineOverallStatus,
  extractCriticalIssues,
  extractWarnings,
  generateRecommendations,
  createSummary,
  formatForConsole,
  formatForWhatsApp,
  formatAsJson
} from './reporter.js';
import { promises as fs } from 'fs';
import * as path from 'path';

const REQUIRED_ENV_VARS = ['TODOIST_API_KEY'];
const OPTIONAL_ENV_VARS = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY'];
const CONFIG_FILES = ['.env', 'package.json', 'tsconfig.json'];
const TEMPLATE_DIRS = ['templates/inbox', 'templates/tasks', 'templates/calendar'];

/**
 * Check configuration health
 */
async function checkConfigHealth(): Promise<ConfigHealth> {
  const issues: string[] = [];

  // Check environment variables
  const requiredEnvVars: Record<string, boolean> = {};
  for (const envVar of REQUIRED_ENV_VARS) {
    const present = !!process.env[envVar];
    requiredEnvVars[envVar] = present;
    if (!present) {
      issues.push(`Missing required environment variable: ${envVar}`);
    }
  }

  const optionalEnvVars: Record<string, boolean> = {};
  for (const envVar of OPTIONAL_ENV_VARS) {
    optionalEnvVars[envVar] = !!process.env[envVar];
  }

  // Check config files
  const configFiles: Record<string, boolean> = {};
  for (const file of CONFIG_FILES) {
    const filePath = path.join(process.cwd(), file);
    try {
      await fs.access(filePath);
      configFiles[file] = true;
    } catch {
      configFiles[file] = false;
      if (file === '.env') {
        issues.push('Missing .env file');
      }
    }
  }

  // Determine status
  let status: HealthStatus;
  const missingRequired = Object.values(requiredEnvVars).filter(v => !v).length;
  if (missingRequired > 0 || !configFiles['.env']) {
    status = 'unhealthy';
  } else if (issues.length > 0) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }

  return {
    status,
    requiredEnvVars,
    optionalEnvVars,
    configFiles,
    issues
  };
}

/**
 * Convert config health to check result
 */
function configToCheckResult(config: ConfigHealth): CheckResult {
  const missingRequired = Object.entries(config.requiredEnvVars)
    .filter(([_, present]) => !present)
    .map(([name]) => name);

  return {
    name: 'Configuration',
    category: 'config',
    status: config.status,
    message: config.status === 'healthy'
      ? 'Configuration is healthy'
      : `Configuration issues: ${missingRequired.join(', ')}`,
    details: {
      requiredEnvVars: config.requiredEnvVars,
      optionalEnvVars: config.optionalEnvVars,
      configFiles: config.configFiles,
      issues: config.issues
    },
    timestamp: new Date()
  };
}

/**
 * Check template health
 */
async function checkTemplateHealth(): Promise<TemplateHealth> {
  const issues: string[] = [];
  const missingTemplates: string[] = [];
  const invalidTemplates: string[] = [];
  let validCount = 0;

  for (const templateDir of TEMPLATE_DIRS) {
    const dirPath = path.join(process.cwd(), templateDir);

    try {
      await fs.access(dirPath);

      // Check if directory has any template files
      const files = await fs.readdir(dirPath);
      const templateFiles = files.filter(f => f.endsWith('.json') || f.endsWith('.md'));

      if (templateFiles.length === 0) {
        missingTemplates.push(templateDir);
        issues.push(`No templates found in ${templateDir}`);
      } else {
        validCount += templateFiles.length;
      }
    } catch {
      missingTemplates.push(templateDir);
      issues.push(`Template directory not found: ${templateDir}`);
    }
  }

  // Determine status
  let status: HealthStatus;
  if (missingTemplates.length === TEMPLATE_DIRS.length) {
    status = 'unhealthy';
  } else if (missingTemplates.length > 0 || invalidTemplates.length > 0) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }

  return {
    status,
    totalTemplates: TEMPLATE_DIRS.length,
    validTemplates: validCount,
    invalidTemplates,
    missingTemplates,
    issues
  };
}

/**
 * Convert template health to check result
 */
function templateToCheckResult(templates: TemplateHealth): CheckResult {
  return {
    name: 'Templates',
    category: 'template',
    status: templates.status,
    message: templates.status === 'healthy'
      ? `All ${templates.validTemplates} templates are valid`
      : `Template issues: ${templates.missingTemplates.length} missing`,
    details: {
      totalTemplates: templates.totalTemplates,
      validTemplates: templates.validTemplates,
      invalidTemplates: templates.invalidTemplates,
      missingTemplates: templates.missingTemplates,
      issues: templates.issues
    },
    timestamp: new Date()
  };
}

/**
 * Run all system health checks
 */
export async function checkAllSystems(
  options: HealthCheckOptions = {}
): Promise<HealthReport> {
  const startTime = Date.now();

  // Set defaults
  const opts = {
    includeIntegrations: true,
    includeMemory: true,
    includeConfig: true,
    includeTemplates: true,
    timeout: 30000,
    detailed: true,
    ...options
  };

  // Run checks in parallel
  const [integrations, memory, config, templates] = await Promise.all([
    opts.includeIntegrations ? checkAllIntegrations() : Promise.resolve([]),
    opts.includeMemory ? checkMemoryHealth() : Promise.resolve({
      status: 'unknown' as HealthStatus,
      directoryExists: false,
      permissions: { readable: false, writable: false },
      fileCount: 0,
      totalSizeBytes: 0,
      recentFiles: 0,
      orphanedFiles: [],
      corruptedFiles: [],
      issues: []
    }),
    opts.includeConfig ? checkConfigHealth() : Promise.resolve({
      status: 'unknown' as HealthStatus,
      requiredEnvVars: {},
      optionalEnvVars: {},
      configFiles: {},
      issues: []
    }),
    opts.includeTemplates ? checkTemplateHealth() : Promise.resolve({
      status: 'unknown' as HealthStatus,
      totalTemplates: 0,
      validTemplates: 0,
      invalidTemplates: [],
      missingTemplates: [],
      issues: []
    })
  ]);

  // Convert to check results
  const checks: CheckResult[] = [
    ...integrations.map(integrationToCheckResult),
    memoryToCheckResult(memory),
    configToCheckResult(config),
    templateToCheckResult(templates)
  ];

  // Calculate overall health
  const overallScore = calculateHealthScore(checks);
  const overallStatus = determineOverallStatus(checks);
  const criticalIssues = extractCriticalIssues(checks);
  const warnings = extractWarnings(checks);
  const summary = createSummary(checks);

  // Build report
  const report: HealthReport = {
    timestamp: new Date(),
    overallStatus,
    overallScore,
    checks,
    integrations,
    memory,
    config,
    templates,
    criticalIssues,
    warnings,
    recommendations: [],
    summary
  };

  // Generate recommendations
  report.recommendations = generateRecommendations(report);

  const duration = Date.now() - startTime;
  console.log(`Health check completed in ${duration}ms`);

  return report;
}

/**
 * Run health check and format output
 */
export async function runHealthCheck(
  format: 'console' | 'whatsapp' | 'json' = 'console',
  options?: HealthCheckOptions
): Promise<string> {
  const report = await checkAllSystems(options);

  switch (format) {
    case 'console':
      return formatForConsole(report);
    case 'whatsapp':
      return formatForWhatsApp(report);
    case 'json':
      return formatAsJson(report);
    default:
      return formatForConsole(report);
  }
}

/**
 * Check if system is healthy
 */
export async function isSystemHealthy(): Promise<boolean> {
  const report = await checkAllSystems({ detailed: false });
  return report.overallStatus === 'healthy' && report.criticalIssues.length === 0;
}

/**
 * Get quick health status
 */
export async function getQuickStatus(): Promise<{
  status: HealthStatus;
  score: number;
  criticalIssues: number;
  warnings: number;
}> {
  const report = await checkAllSystems({ detailed: false });

  return {
    status: report.overallStatus,
    score: report.overallScore,
    criticalIssues: report.criticalIssues.length,
    warnings: report.warnings.length
  };
}
