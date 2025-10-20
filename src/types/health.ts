/**
 * Health Check System Types
 *
 * Defines interfaces for system health monitoring, integration status,
 * and health reporting.
 */

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

export type IntegrationType = 'todoist' | 'gmail' | 'calendar' | 'whatsapp' | 'claude-flow';

export type CheckCategory = 'integration' | 'memory' | 'config' | 'template' | 'system';

/**
 * Result of a single health check
 */
export interface CheckResult {
  name: string;
  category: CheckCategory;
  status: HealthStatus;
  message: string;
  details?: Record<string, any>;
  error?: string;
  timestamp: Date;
  durationMs?: number;
}

/**
 * Integration-specific status
 */
export interface IntegrationStatus {
  type: IntegrationType;
  status: HealthStatus;
  available: boolean;
  authenticated?: boolean;
  lastChecked: Date;
  responseTimeMs?: number;
  version?: string;
  capabilities?: string[];
  error?: string;
  details?: Record<string, any>;
}

/**
 * Memory system health information
 */
export interface MemoryHealth {
  status: HealthStatus;
  directoryExists: boolean;
  permissions: {
    readable: boolean;
    writable: boolean;
  };
  fileCount: number;
  totalSizeBytes: number;
  recentFiles: number;
  orphanedFiles: string[];
  corruptedFiles: string[];
  issues: string[];
}

/**
 * Configuration health information
 */
export interface ConfigHealth {
  status: HealthStatus;
  requiredEnvVars: Record<string, boolean>;
  optionalEnvVars: Record<string, boolean>;
  configFiles: Record<string, boolean>;
  issues: string[];
}

/**
 * Template system health information
 */
export interface TemplateHealth {
  status: HealthStatus;
  totalTemplates: number;
  validTemplates: number;
  invalidTemplates: string[];
  missingTemplates: string[];
  issues: string[];
}

/**
 * Comprehensive health report
 */
export interface HealthReport {
  timestamp: Date;
  overallStatus: HealthStatus;
  overallScore: number; // 0-100
  checks: CheckResult[];
  integrations: IntegrationStatus[];
  memory: MemoryHealth;
  config: ConfigHealth;
  templates: TemplateHealth;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  summary: {
    totalChecks: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
    unknown: number;
  };
}

/**
 * Health check options
 */
export interface HealthCheckOptions {
  includeIntegrations?: boolean;
  includeMemory?: boolean;
  includeConfig?: boolean;
  includeTemplates?: boolean;
  timeout?: number; // milliseconds
  detailed?: boolean;
}

/**
 * Health check function signature
 */
export type HealthCheckFn = () => Promise<CheckResult>;

/**
 * Suggested fix for a health issue
 */
export interface HealthFix {
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  suggestion: string;
  command?: string;
  documentation?: string;
}
