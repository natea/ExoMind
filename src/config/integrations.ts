/**
 * Integration Configuration for Life OS
 * Manages external service integrations
 */

import { IntegrationConfig } from '../types/config';
import { ConfigValidationError } from '../types/config';

/**
 * Create integration configuration from environment variables
 */
export function createIntegrationConfig(): IntegrationConfig {
  return {
    todoist: {
      apiKey: process.env.TODOIST_API_KEY,
      enabled: !!process.env.TODOIST_API_KEY,
      projectId: process.env.TODOIST_PROJECT_ID,
      inboxProjectId: process.env.TODOIST_INBOX_PROJECT_ID,
    },
    google: {
      email: process.env.GOOGLE_EMAIL,
      enabled: !!process.env.GOOGLE_EMAIL,
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      driveFolder: process.env.GOOGLE_DRIVE_FOLDER,
    },
    whatsapp: {
      enabled: process.env.WHATSAPP_MCP_ENABLED === 'true',
      mcpServer: process.env.WHATSAPP_MCP_SERVER,
    },
  };
}

/**
 * Validate integration configuration
 * @param config - Integration configuration to validate
 * @throws {ConfigValidationError} If configuration is invalid
 */
export function validateIntegrationConfig(config: IntegrationConfig): void {
  // Todoist validation
  if (config.todoist.enabled && !config.todoist.apiKey) {
    throw new ConfigValidationError(
      'Todoist API key is required when Todoist is enabled',
      'todoist.apiKey',
      'Set TODOIST_API_KEY environment variable'
    );
  }

  // Google validation
  if (config.google.enabled && !config.google.email) {
    throw new ConfigValidationError(
      'Google email is required when Google integration is enabled',
      'google.email',
      'Set GOOGLE_EMAIL environment variable'
    );
  }

  // WhatsApp validation
  if (config.whatsapp.enabled && !config.whatsapp.mcpServer) {
    throw new ConfigValidationError(
      'WhatsApp MCP server URL is required when WhatsApp is enabled',
      'whatsapp.mcpServer',
      'Set WHATSAPP_MCP_SERVER environment variable'
    );
  }
}

/**
 * Integration utility class for checking service availability
 */
export class IntegrationUtils {
  constructor(private config: IntegrationConfig) {}

  /**
   * Check if Todoist is available
   */
  isTodoistAvailable(): boolean {
    return this.config.todoist.enabled && !!this.config.todoist.apiKey;
  }

  /**
   * Check if Google Workspace is available
   */
  isGoogleAvailable(): boolean {
    return this.config.google.enabled && !!this.config.google.email;
  }

  /**
   * Check if WhatsApp is available
   */
  isWhatsAppAvailable(): boolean {
    return this.config.whatsapp.enabled && !!this.config.whatsapp.mcpServer;
  }

  /**
   * Get list of available integrations
   */
  getAvailableIntegrations(): string[] {
    const available: string[] = [];

    if (this.isTodoistAvailable()) {
      available.push('todoist');
    }
    if (this.isGoogleAvailable()) {
      available.push('google');
    }
    if (this.isWhatsAppAvailable()) {
      available.push('whatsapp');
    }

    return available;
  }

  /**
   * Get list of missing required integrations
   */
  getMissingIntegrations(): string[] {
    const missing: string[] = [];

    // No integrations are strictly required, they're all optional
    // This method is here for future use if some integrations become required

    return missing;
  }

  /**
   * Get integration status summary
   */
  getIntegrationStatus(): Record<string, boolean> {
    return {
      todoist: this.isTodoistAvailable(),
      google: this.isGoogleAvailable(),
      whatsapp: this.isWhatsAppAvailable(),
    };
  }

  /**
   * Get helpful configuration messages
   */
  getConfigurationMessages(): string[] {
    const messages: string[] = [];

    if (!this.isTodoistAvailable()) {
      messages.push(
        'Todoist integration not configured. Set TODOIST_API_KEY to enable task management.'
      );
    }

    if (!this.isGoogleAvailable()) {
      messages.push(
        'Google Workspace integration not configured. Set GOOGLE_EMAIL to enable calendar and drive features.'
      );
    }

    if (!this.isWhatsAppAvailable()) {
      messages.push(
        'WhatsApp integration not configured. Set WHATSAPP_MCP_ENABLED=true and WHATSAPP_MCP_SERVER to enable messaging.'
      );
    }

    if (messages.length === 0) {
      messages.push('All integrations configured successfully!');
    }

    return messages;
  }
}
