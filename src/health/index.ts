/**
 * Health Check System
 *
 * Comprehensive system health monitoring for Life OS.
 * Exports main functions for checking system health and generating reports.
 */

// Main checker functions
export {
  checkAllSystems,
  runHealthCheck,
  isSystemHealthy,
  getQuickStatus
} from './checker.js';

// Integration checks
export {
  checkTodoistHealth,
  checkGmailHealth,
  checkCalendarHealth,
  checkWhatsAppHealth,
  checkClaudeFlowHealth,
  checkAllIntegrations,
  integrationToCheckResult
} from './integration-checks.js';

// Memory checks
export {
  checkMemoryHealth,
  memoryToCheckResult,
  needsCleanup,
  getMemoryUsagePercentage
} from './memory-checks.js';

// Reporter functions
export {
  calculateHealthScore,
  determineOverallStatus,
  extractCriticalIssues,
  extractWarnings,
  generateRecommendations,
  generateFixes,
  formatForConsole,
  formatForWhatsApp,
  formatAsJson,
  createSummary
} from './reporter.js';

// Re-export types
export type {
  HealthStatus,
  IntegrationType,
  CheckCategory,
  CheckResult,
  IntegrationStatus,
  MemoryHealth,
  ConfigHealth,
  TemplateHealth,
  HealthReport,
  HealthCheckOptions,
  HealthCheckFn,
  HealthFix
} from '../types/health.js';
