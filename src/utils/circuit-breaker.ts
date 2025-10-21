/**
 * Circuit Breaker Pattern Implementation
 *
 * Prevents cascading failures by tracking errors and temporarily blocking calls
 * when a service is failing. Automatically tests recovery and restores service.
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Service failing, requests rejected immediately
 * - HALF_OPEN: Testing if service has recovered
 */

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerConfig {
  /**
   * Number of failures before opening the circuit
   */
  failureThreshold?: number;

  /**
   * Time window in milliseconds for counting failures
   */
  failureWindow?: number;

  /**
   * Time to wait before attempting recovery (milliseconds)
   */
  resetTimeout?: number;

  /**
   * Number of successful calls needed to close circuit from half-open
   */
  successThreshold?: number;

  /**
   * Name for logging/metrics
   */
  name?: string;

  /**
   * Custom error filter - return true to count as failure
   */
  isFailure?: (error: Error) => boolean;

  /**
   * Callback when state changes
   */
  onStateChange?: (from: CircuitState, to: CircuitState) => void;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  rejections: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  nextAttemptTime?: Date;
}

interface FailureRecord {
  timestamp: number;
  error: Error;
}

/**
 * Circuit Breaker implementation
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: FailureRecord[] = [];
  private consecutiveSuccesses = 0;
  private stats = {
    totalFailures: 0,
    totalSuccesses: 0,
    totalRejections: 0,
    lastFailureTime: undefined as Date | undefined,
    lastSuccessTime: undefined as Date | undefined,
  };
  private openedAt?: number;
  private readonly config: Required<CircuitBreakerConfig>;

  constructor(config: CircuitBreakerConfig = {}) {
    this.config = {
      failureThreshold: config.failureThreshold ?? 5,
      failureWindow: config.failureWindow ?? 60000, // 60 seconds
      resetTimeout: config.resetTimeout ?? 30000, // 30 seconds
      successThreshold: config.successThreshold ?? 2,
      name: config.name ?? 'CircuitBreaker',
      isFailure: config.isFailure ?? (() => true),
      onStateChange: config.onStateChange ?? (() => {}),
    };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should reject calls
    if (this.state === CircuitState.OPEN) {
      const shouldAttemptReset = this.shouldAttemptReset();

      if (shouldAttemptReset) {
        this.transitionTo(CircuitState.HALF_OPEN);
      } else {
        this.stats.totalRejections++;
        const nextAttempt = this.openedAt! + this.config.resetTimeout;
        throw new CircuitOpenError(
          `Circuit breaker "${this.config.name}" is OPEN. Next attempt at ${new Date(nextAttempt).toISOString()}`,
          nextAttempt
        );
      }
    }

    // Execute the function
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }

  /**
   * Execute with fallback on circuit open
   */
  async executeWithFallback<T>(
    fn: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> {
    try {
      return await this.execute(fn);
    } catch (error) {
      if (error instanceof CircuitOpenError) {
        console.warn(`${this.config.name}: Circuit open, using fallback`);
        return await fallback();
      }
      throw error;
    }
  }

  /**
   * Get current circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures.length,
      successes: this.consecutiveSuccesses,
      rejections: this.stats.totalRejections,
      lastFailureTime: this.stats.lastFailureTime,
      lastSuccessTime: this.stats.lastSuccessTime,
      nextAttemptTime: this.openedAt
        ? new Date(this.openedAt + this.config.resetTimeout)
        : undefined,
    };
  }

  /**
   * Get current state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Check if circuit is open
   */
  isOpen(): boolean {
    return this.state === CircuitState.OPEN;
  }

  /**
   * Manually reset the circuit breaker
   */
  reset(): void {
    this.failures = [];
    this.consecutiveSuccesses = 0;
    this.openedAt = undefined;
    this.transitionTo(CircuitState.CLOSED);
  }

  /**
   * Manually open the circuit breaker
   */
  forceOpen(): void {
    this.openedAt = Date.now();
    this.transitionTo(CircuitState.OPEN);
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.stats.totalSuccesses++;
    this.stats.lastSuccessTime = new Date();

    if (this.state === CircuitState.HALF_OPEN) {
      this.consecutiveSuccesses++;

      if (this.consecutiveSuccesses >= this.config.successThreshold) {
        console.log(`${this.config.name}: Recovery successful, closing circuit`);
        this.reset();
      }
    } else {
      this.consecutiveSuccesses = 0;
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(error: Error): void {
    // Check if this error should count as a failure
    if (!this.config.isFailure(error)) {
      return;
    }

    const now = Date.now();
    this.stats.totalFailures++;
    this.stats.lastFailureTime = new Date();

    // Add to failure records
    this.failures.push({ timestamp: now, error });

    // Remove old failures outside the window
    this.cleanupOldFailures();

    // If in half-open state, immediately open on failure
    if (this.state === CircuitState.HALF_OPEN) {
      console.warn(`${this.config.name}: Failed during half-open state, reopening circuit`);
      this.openedAt = now;
      this.consecutiveSuccesses = 0;
      this.transitionTo(CircuitState.OPEN);
      return;
    }

    // Check if we should open the circuit
    if (this.state === CircuitState.CLOSED && this.failures.length >= this.config.failureThreshold) {
      console.warn(
        `${this.config.name}: Failure threshold reached (${this.failures.length}/${this.config.failureThreshold}), opening circuit`
      );
      this.openedAt = now;
      this.consecutiveSuccesses = 0;
      this.transitionTo(CircuitState.OPEN);
    }
  }

  /**
   * Check if enough time has passed to attempt reset
   */
  private shouldAttemptReset(): boolean {
    if (!this.openedAt) {
      return false;
    }

    const timeOpen = Date.now() - this.openedAt;
    return timeOpen >= this.config.resetTimeout;
  }

  /**
   * Remove failure records outside the time window
   */
  private cleanupOldFailures(): void {
    const cutoff = Date.now() - this.config.failureWindow;
    this.failures = this.failures.filter(f => f.timestamp >= cutoff);
  }

  /**
   * Transition to a new state
   */
  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;

    if (oldState !== newState) {
      this.state = newState;
      console.log(`${this.config.name}: State transition ${oldState} -> ${newState}`);
      this.config.onStateChange(oldState, newState);
    }
  }
}

/**
 * Error thrown when circuit is open
 */
export class CircuitOpenError extends Error {
  constructor(
    message: string,
    public readonly nextAttemptTime: number
  ) {
    super(message);
    this.name = 'CircuitOpenError';
  }
}

/**
 * Circuit Breaker Manager for managing multiple circuit breakers
 */
export class CircuitBreakerManager {
  private breakers = new Map<string, CircuitBreaker>();
  private defaultConfig: CircuitBreakerConfig;

  constructor(defaultConfig: CircuitBreakerConfig = {}) {
    this.defaultConfig = defaultConfig;
  }

  /**
   * Get or create a circuit breaker
   */
  getBreaker(name: string, config?: CircuitBreakerConfig): CircuitBreaker {
    if (!this.breakers.has(name)) {
      const breaker = new CircuitBreaker({
        ...this.defaultConfig,
        ...config,
        name,
      });
      this.breakers.set(name, breaker);
    }
    return this.breakers.get(name)!;
  }

  /**
   * Execute with a named circuit breaker
   */
  async execute<T>(name: string, fn: () => Promise<T>, config?: CircuitBreakerConfig): Promise<T> {
    const breaker = this.getBreaker(name, config);
    return breaker.execute(fn);
  }

  /**
   * Execute with fallback
   */
  async executeWithFallback<T>(
    name: string,
    fn: () => Promise<T>,
    fallback: () => Promise<T>,
    config?: CircuitBreakerConfig
  ): Promise<T> {
    const breaker = this.getBreaker(name, config);
    return breaker.executeWithFallback(fn, fallback);
  }

  /**
   * Get all circuit breaker stats
   */
  getAllStats(): Map<string, CircuitBreakerStats> {
    const stats = new Map<string, CircuitBreakerStats>();
    for (const [name, breaker] of this.breakers) {
      stats.set(name, breaker.getStats());
    }
    return stats;
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }

  /**
   * Remove a circuit breaker
   */
  remove(name: string): boolean {
    return this.breakers.delete(name);
  }

  /**
   * Get all breaker names
   */
  getNames(): string[] {
    return Array.from(this.breakers.keys());
  }

  /**
   * Check if any breakers are open
   */
  hasOpenBreakers(): boolean {
    for (const breaker of this.breakers.values()) {
      if (breaker.isOpen()) {
        return true;
      }
    }
    return false;
  }
}
