/**
 * Integration Health Checks
 *
 * Verifies external service connectivity and authentication status
 * for Todoist, Gmail, Calendar, WhatsApp, and Claude Flow.
 */

import { IntegrationStatus, CheckResult, HealthStatus } from '../types/health.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Check Todoist API connectivity and sync status
 */
export async function checkTodoistHealth(): Promise<IntegrationStatus> {
  const startTime = Date.now();

  try {
    // Check if API key is configured
    if (!process.env.TODOIST_API_KEY) {
      return {
        type: 'todoist',
        status: 'unhealthy',
        available: false,
        authenticated: false,
        lastChecked: new Date(),
        error: 'TODOIST_API_KEY not configured',
        details: { configMissing: true }
      };
    }

    // Test API connection with minimal request
    const response = await fetch('https://api.todoist.com/rest/v2/projects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TODOIST_API_KEY}`
      },
      signal: AbortSignal.timeout(5000)
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      return {
        type: 'todoist',
        status: 'unhealthy',
        available: false,
        authenticated: false,
        lastChecked: new Date(),
        responseTimeMs: responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const projects = await response.json();

    return {
      type: 'todoist',
      status: 'healthy',
      available: true,
      authenticated: true,
      lastChecked: new Date(),
      responseTimeMs: responseTime,
      details: {
        projectCount: projects.length,
        apiVersion: 'v2'
      }
    };
  } catch (error: any) {
    return {
      type: 'todoist',
      status: 'unhealthy',
      available: false,
      authenticated: false,
      lastChecked: new Date(),
      responseTimeMs: Date.now() - startTime,
      error: error.message
    };
  }
}

/**
 * Check Gmail MCP availability and authentication
 */
export async function checkGmailHealth(): Promise<IntegrationStatus> {
  const startTime = Date.now();

  try {
    // Check if Google Workspace MCP is configured
    const result = await execAsync(
      'claude mcp list | grep -q "google-workspace"',
      { timeout: 5000 }
    ).catch(() => ({ stdout: '', stderr: 'not found' }));

    const available = !result.stderr.includes('not found');

    if (!available) {
      return {
        type: 'gmail',
        status: 'degraded',
        available: false,
        lastChecked: new Date(),
        responseTimeMs: Date.now() - startTime,
        error: 'Google Workspace MCP not configured',
        details: { mcpMissing: true }
      };
    }

    // MCP is configured - assume healthy if reachable
    return {
      type: 'gmail',
      status: 'healthy',
      available: true,
      authenticated: true, // MCP handles auth
      lastChecked: new Date(),
      responseTimeMs: Date.now() - startTime,
      capabilities: ['search', 'send', 'read', 'labels']
    };
  } catch (error: any) {
    return {
      type: 'gmail',
      status: 'unknown',
      available: false,
      lastChecked: new Date(),
      responseTimeMs: Date.now() - startTime,
      error: error.message
    };
  }
}

/**
 * Check Calendar MCP availability
 */
export async function checkCalendarHealth(): Promise<IntegrationStatus> {
  const startTime = Date.now();

  try {
    // Check if Google Workspace MCP is configured (includes Calendar)
    const result = await execAsync(
      'claude mcp list | grep -q "google-workspace"',
      { timeout: 5000 }
    ).catch(() => ({ stdout: '', stderr: 'not found' }));

    const available = !result.stderr.includes('not found');

    if (!available) {
      return {
        type: 'calendar',
        status: 'degraded',
        available: false,
        lastChecked: new Date(),
        responseTimeMs: Date.now() - startTime,
        error: 'Google Workspace MCP not configured'
      };
    }

    return {
      type: 'calendar',
      status: 'healthy',
      available: true,
      authenticated: true,
      lastChecked: new Date(),
      responseTimeMs: Date.now() - startTime,
      capabilities: ['events', 'create', 'update', 'delete']
    };
  } catch (error: any) {
    return {
      type: 'calendar',
      status: 'unknown',
      available: false,
      lastChecked: new Date(),
      responseTimeMs: Date.now() - startTime,
      error: error.message
    };
  }
}

/**
 * Check WhatsApp MCP availability
 */
export async function checkWhatsAppHealth(): Promise<IntegrationStatus> {
  const startTime = Date.now();

  try {
    // Check if WhatsApp MCP is configured
    const result = await execAsync(
      'claude mcp list | grep -q "whatsapp"',
      { timeout: 5000 }
    ).catch(() => ({ stdout: '', stderr: 'not found' }));

    const available = !result.stderr.includes('not found');

    if (!available) {
      return {
        type: 'whatsapp',
        status: 'degraded',
        available: false,
        lastChecked: new Date(),
        responseTimeMs: Date.now() - startTime,
        error: 'WhatsApp MCP not configured',
        details: { mcpMissing: true }
      };
    }

    return {
      type: 'whatsapp',
      status: 'healthy',
      available: true,
      authenticated: true, // Assume authenticated if MCP is available
      lastChecked: new Date(),
      responseTimeMs: Date.now() - startTime,
      capabilities: ['send', 'receive', 'search', 'contacts']
    };
  } catch (error: any) {
    return {
      type: 'whatsapp',
      status: 'unknown',
      available: false,
      lastChecked: new Date(),
      responseTimeMs: Date.now() - startTime,
      error: error.message
    };
  }
}

/**
 * Check Claude Flow availability
 */
export async function checkClaudeFlowHealth(): Promise<IntegrationStatus> {
  const startTime = Date.now();

  try {
    // Check if claude-flow is installed and MCP is configured
    const [installCheck, mcpCheck] = await Promise.all([
      execAsync('which npx', { timeout: 5000 }),
      execAsync('claude mcp list | grep -q "claude-flow"', { timeout: 5000 })
        .catch(() => ({ stdout: '', stderr: 'not found' }))
    ]);

    const npxAvailable = !!installCheck.stdout.trim();
    const mcpConfigured = !mcpCheck.stderr.includes('not found');

    if (!npxAvailable) {
      return {
        type: 'claude-flow',
        status: 'unhealthy',
        available: false,
        lastChecked: new Date(),
        responseTimeMs: Date.now() - startTime,
        error: 'npx not available'
      };
    }

    if (!mcpConfigured) {
      return {
        type: 'claude-flow',
        status: 'degraded',
        available: false,
        lastChecked: new Date(),
        responseTimeMs: Date.now() - startTime,
        error: 'Claude Flow MCP not configured'
      };
    }

    // Try to get version
    try {
      const versionCheck = await execAsync('npx claude-flow@alpha --version', { timeout: 5000 });
      const version = versionCheck.stdout.trim();

      return {
        type: 'claude-flow',
        status: 'healthy',
        available: true,
        lastChecked: new Date(),
        responseTimeMs: Date.now() - startTime,
        version,
        capabilities: ['hooks', 'swarm', 'memory', 'sparc']
      };
    } catch {
      return {
        type: 'claude-flow',
        status: 'healthy',
        available: true,
        lastChecked: new Date(),
        responseTimeMs: Date.now() - startTime,
        capabilities: ['hooks', 'swarm', 'memory', 'sparc']
      };
    }
  } catch (error: any) {
    return {
      type: 'claude-flow',
      status: 'unknown',
      available: false,
      lastChecked: new Date(),
      responseTimeMs: Date.now() - startTime,
      error: error.message
    };
  }
}

/**
 * Check all integrations
 */
export async function checkAllIntegrations(): Promise<IntegrationStatus[]> {
  const checks = await Promise.all([
    checkTodoistHealth(),
    checkGmailHealth(),
    checkCalendarHealth(),
    checkWhatsAppHealth(),
    checkClaudeFlowHealth()
  ]);

  return checks;
}

/**
 * Convert integration status to check result
 */
export function integrationToCheckResult(integration: IntegrationStatus): CheckResult {
  return {
    name: `${integration.type} Integration`,
    category: 'integration',
    status: integration.status,
    message: integration.available
      ? `${integration.type} is ${integration.status}`
      : `${integration.type} is unavailable: ${integration.error}`,
    details: {
      available: integration.available,
      authenticated: integration.authenticated,
      responseTimeMs: integration.responseTimeMs,
      ...integration.details
    },
    error: integration.error,
    timestamp: integration.lastChecked,
    durationMs: integration.responseTimeMs
  };
}
