/**
 * Enhanced Retry Logic with Circuit Breaker Integration
 *
 * Improves upon ExponentialBackoff with circuit breaker support,
 * jitter, retry budgets, and intelligent error classification
 */

import { CircuitBreaker, CircuitOpenError } from './circuit-breaker';

export interface RetryConfig {
  /**
   * Maximum number of retry attempts
   */
  maxAttempts?: number;

  /**
   * Base delay in milliseconds
   */
  baseDelayMs?: number;

  /**
   * Maximum delay cap in milliseconds
   */
  maxDelayMs?: number;

  /**
   * Jitter factor (0-1) to add randomness
   */
  jitterFactor?: number;

  /**
   * Multiplier for exponential backoff
   */
  backoffMultiplier?: number;

  /**
   * Circuit breaker to use (optional)
   */
  circuitBreaker?: CircuitBreaker;

  /**
   * Retry budget - max retries per time window
   */
  retryBudget?: {
    maxRetries: number;
    windowMs: number;
  };

  /**
   * Custom error classifier
   */
  shouldRetry?: (error: Error, attempt: number) => boolean;

  /**
   * Callback before each retry
   */
  onRetry?: (error: Error, attempt: number, delay: number) => void;

  /**
   * Callback when max attempts exceeded
   */
  onMaxAttemptsExceeded?: (error: Error) => void;
}

interface RetryAttempt {
  timestamp: number;
  error: Error;
}

/**
 * Enhanced Retry with Circuit Breaker and Budget Tracking
 */
export class EnhancedRetry {
  private attempts = 0;
  private retryHistory: RetryAttempt[] = [];
  private readonly config: Required<Omit<RetryConfig, 'circuitBreaker' | 'retryBudget'>> & {
    circuitBreaker?: CircuitBreaker;
    retryBudget?: { maxRetries: number; windowMs: number };
  };

  constructor(config: RetryConfig = {}) {
    this.config = {
      maxAttempts: config.maxAttempts ?? 5,
      baseDelayMs: config.baseDelayMs ?? 1000,
      maxDelayMs: config.maxDelayMs ?? 60000, // 1 minute max
      jitterFactor: config.jitterFactor ?? 0.3,
      backoffMultiplier: config.backoffMultiplier ?? 2,
      circuitBreaker: config.circuitBreaker,
      retryBudget: config.retryBudget,
      shouldRetry: config.shouldRetry ?? this.defaultShouldRetry.bind(this),
      onRetry: config.onRetry ?? (() => {}),
      onMaxAttemptsExceeded: config.onMaxAttemptsExceeded ?? (() => {}),
    };
  }

  /**
   * Execute function with retry logic
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;

    while (this.attempts < this.config.maxAttempts) {
      try {
        // Use circuit breaker if provided
        if (this.config.circuitBreaker) {
          return await this.config.circuitBreaker.execute(fn);
        }

        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on circuit open errors
        if (error instanceof CircuitOpenError) {
          throw error;
        }

        // Check retry budget
        if (!this.hasRetryBudget()) {
          throw new RetryBudgetExceededError('Retry budget exceeded');
        }

        // Record attempt
        this.retryHistory.push({
          timestamp: Date.now(),
          error: lastError,
        });

        // Check if should retry
        if (!this.config.shouldRetry(lastError, this.attempts)) {
          throw lastError;
        }

        // Check if more attempts available
        this.attempts++;
        if (this.attempts >= this.config.maxAttempts) {
          this.config.onMaxAttemptsExceeded(lastError);
          break;
        }

        // Calculate delay with jitter
        const delay = this.calculateDelay();

        // Notify before retry
        this.config.onRetry(lastError, this.attempts, delay);

        // Wait before retry
        await this.sleep(delay);
      }
    }

    throw lastError || new Error('Max retry attempts exceeded');
  }

  /**
   * Execute with custom fallback
   */
  async executeWithFallback<T>(
    fn: () => Promise<T>,
    fallback: (error: Error) => Promise<T>
  ): Promise<T> {
    try {
      return await this.execute(fn);
    } catch (error) {
      return await fallback(error as Error);
    }
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private calculateDelay(): number {
    // Exponential backoff
    const exponentialDelay = Math.min(
      this.config.maxDelayMs,
      this.config.baseDelayMs * Math.pow(this.config.backoffMultiplier, this.attempts)
    );

    // Add jitter to prevent thundering herd
    const jitterRange = exponentialDelay * this.config.jitterFactor;
    const jitter = (Math.random() - 0.5) * jitterRange;

    return Math.max(0, Math.floor(exponentialDelay + jitter));
  }

  /**
   * Check if retry budget allows more retries
   */
  private hasRetryBudget(): boolean {
    if (!this.config.retryBudget) {
      return true;
    }

    const cutoff = Date.now() - this.config.retryBudget.windowMs;
    const recentRetries = this.retryHistory.filter(r => r.timestamp >= cutoff).length;

    return recentRetries < this.config.retryBudget.maxRetries;
  }

  /**
   * Default retry logic based on error type
   */
  private defaultShouldRetry(error: Error, attempt: number): boolean {
    // Don't retry on circuit open
    if (error instanceof CircuitOpenError) {
      return false;
    }

    // Don't retry on non-retriable errors
    if (error instanceof NonRetriableError) {
      return false;
    }

    // Retry on network errors
    if (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('Network') ||
      error.message.includes('timeout')
    ) {
      return true;
    }

    // Retry on rate limit errors (with backoff)
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return true;
    }

    // Retry on server errors (5xx)
    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return true;
    }

    // Don't retry on client errors (4xx) except 429
    if (error.message.match(/4\d\d/)) {
      return false;
    }

    // Default: retry if attempts remaining
    return attempt < this.config.maxAttempts;
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reset retry state
   */
  reset(): void {
    this.attempts = 0;
    this.retryHistory = [];
  }

  /**
   * Get retry statistics
   */
  getStats(): {
    attempts: number;
    retryHistory: RetryAttempt[];
    budgetRemaining: number | null;
  } {
    let budgetRemaining: number | null = null;

    if (this.config.retryBudget) {
      const cutoff = Date.now() - this.config.retryBudget.windowMs;
      const recentRetries = this.retryHistory.filter(r => r.timestamp >= cutoff).length;
      budgetRemaining = this.config.retryBudget.maxRetries - recentRetries;
    }

    return {
      attempts: this.attempts,
      retryHistory: [...this.retryHistory],
      budgetRemaining,
    };
  }
}

/**
 * Error indicating retry budget exceeded
 */
export class RetryBudgetExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RetryBudgetExceededError';
  }
}

/**
 * Error that should not be retried
 */
export class NonRetriableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NonRetriableError';
  }
}

/**
 * Retry with simple configuration
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config?: RetryConfig
): Promise<T> {
  const retry = new EnhancedRetry(config);
  return retry.execute(fn);
}

/**
 * Retry with circuit breaker
 */
export async function withRetryAndCircuitBreaker<T>(
  fn: () => Promise<T>,
  circuitBreaker: CircuitBreaker,
  config?: Omit<RetryConfig, 'circuitBreaker'>
): Promise<T> {
  const retry = new EnhancedRetry({
    ...config,
    circuitBreaker,
  });
  return retry.execute(fn);
}
