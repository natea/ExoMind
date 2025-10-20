/**
 * MCP Client Wrapper
 * Provides type-safe interface to Google Workspace MCP tools
 */

import { RateLimiter, ExponentialBackoff } from './rate-limiter';

export interface MCPClientConfig {
  rateLimiter?: RateLimiter;
  retryConfig?: {
    maxAttempts?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
  };
  timeout?: number;
}

export interface MCPError extends Error {
  code?: string;
  statusCode?: number;
  retryable?: boolean;
}

/**
 * MCP Client for calling Google Workspace MCP tools
 */
export class MCPClient {
  private config: MCPClientConfig;
  private rateLimiter?: RateLimiter;

  constructor(config: MCPClientConfig = {}) {
    this.config = config;
    this.rateLimiter = config.rateLimiter;
  }

  /**
   * Call an MCP tool with rate limiting and retry logic
   */
  async call<T = any>(
    toolName: string,
    params: Record<string, any>
  ): Promise<T> {
    // Apply rate limiting if configured
    if (this.rateLimiter) {
      await this.rateLimiter.acquire();
    }

    // Create backoff strategy
    const backoff = new ExponentialBackoff(this.config.retryConfig);

    // Execute with retry
    return backoff.execute(
      async () => {
        try {
          // In production, this would call the actual MCP tool
          // For now, we'll use dynamic import to call the tool
          const result = await this.invokeMCPTool(toolName, params);
          return result as T;
        } catch (error) {
          const mcpError = this.createMCPError(error);
          throw mcpError;
        }
      },
      (error: Error) => {
        // Determine if error is retryable
        return this.isRetryableError(error as MCPError);
      }
    );
  }

  /**
   * Invoke actual MCP tool (to be implemented with real MCP integration)
   */
  private async invokeMCPTool(
    toolName: string,
    params: Record<string, any>
  ): Promise<any> {
    // TODO: Replace with actual MCP tool invocation
    // This is a placeholder that should be replaced with:
    // - Dynamic import of MCP tool
    // - Proper parameter validation
    // - Response parsing

    // Example implementation:
    // const tool = await import(`mcp__google-workspace__${toolName}`);
    // return await tool.invoke(params);

    throw new Error(`MCP tool ${toolName} not yet integrated. Params: ${JSON.stringify(params)}`);
  }

  /**
   * Create typed MCP error from generic error
   */
  private createMCPError(error: any): MCPError {
    const mcpError: MCPError = new Error(error.message || 'Unknown MCP error');
    mcpError.name = 'MCPError';
    mcpError.code = error.code;
    mcpError.statusCode = error.statusCode;
    mcpError.retryable = this.isRetryableError(error);
    mcpError.stack = error.stack;

    return mcpError;
  }

  /**
   * Determine if error is retryable
   */
  private isRetryableError(error: MCPError): boolean {
    // Already marked as retryable/non-retryable
    if (error.retryable !== undefined) {
      return error.retryable;
    }

    // Rate limit errors (429)
    if (error.statusCode === 429) {
      return true;
    }

    // Server errors (5xx)
    if (error.statusCode && error.statusCode >= 500 && error.statusCode < 600) {
      return true;
    }

    // Timeout errors
    if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      return true;
    }

    // Connection errors
    if (
      error.code === 'ECONNRESET' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND'
    ) {
      return true;
    }

    // Client errors (4xx) are generally not retryable
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return false;
    }

    // Default to not retryable
    return false;
  }

  /**
   * Check if MCP tool is available
   */
  async isToolAvailable(_toolName: string): Promise<boolean> {
    try {
      // In production, this would check if the MCP tool exists
      // For now, return false to indicate not yet integrated
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Get client statistics
   */
  getStats(): {
    rateLimiter?: any;
  } {
    return {
      rateLimiter: this.rateLimiter?.getStats(),
    };
  }

  /**
   * Reset client state
   */
  reset(): void {
    this.rateLimiter?.reset();
  }
}

/**
 * Create an MCP client with default configuration
 */
export function createMCPClient(config?: MCPClientConfig): MCPClient {
  return new MCPClient(config);
}
