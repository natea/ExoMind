/**
 * Token Bucket Rate Limiter
 * Implements rate limiting with configurable tokens, refill rate, and burst capacity
 */

export interface RateLimiterConfig {
  tokensPerSecond: number;
  burstCapacity: number;
  maxQueueSize?: number;
  timeout?: number;
}

export interface RateLimitStats {
  tokensAvailable: number;
  requestsQueued: number;
  requestsRejected: number;
  averageWaitTime: number;
}

export class RateLimiter {
  private tokens: number;
  private readonly config: Required<RateLimiterConfig>;
  private lastRefillTime: number;
  private queue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
    timestamp: number;
  }> = [];
  private stats = {
    requestsQueued: 0,
    requestsRejected: 0,
    totalWaitTime: 0,
    requestsCompleted: 0,
  };

  constructor(config: RateLimiterConfig) {
    this.config = {
      tokensPerSecond: config.tokensPerSecond,
      burstCapacity: config.burstCapacity,
      maxQueueSize: config.maxQueueSize ?? 100,
      timeout: config.timeout ?? 30000, // 30 seconds default
    };
    this.tokens = this.config.burstCapacity;
    this.lastRefillTime = Date.now();
  }

  /**
   * Acquire a token, waiting if necessary
   * Returns a promise that resolves when a token is available
   */
  async acquire(): Promise<void> {
    this.refillTokens();

    if (this.tokens >= 1) {
      this.tokens--;
      return Promise.resolve();
    }

    // Check queue size
    if (this.queue.length >= this.config.maxQueueSize) {
      this.stats.requestsRejected++;
      throw new Error(`Rate limit queue full (max: ${this.config.maxQueueSize})`);
    }

    // Queue the request
    return new Promise<void>((resolve, reject) => {
      const timestamp = Date.now();
      this.stats.requestsQueued++;

      const timeoutId = setTimeout(() => {
        // Remove from queue and reject
        const index = this.queue.findIndex(item => item.resolve === resolve);
        if (index !== -1) {
          this.queue.splice(index, 1);
          this.stats.requestsRejected++;
          reject(new Error('Rate limit timeout exceeded'));
        }
      }, this.config.timeout);

      this.queue.push({
        resolve: () => {
          clearTimeout(timeoutId);
          const waitTime = Date.now() - timestamp;
          this.stats.totalWaitTime += waitTime;
          this.stats.requestsCompleted++;
          resolve();
        },
        reject: (error: Error) => {
          clearTimeout(timeoutId);
          this.stats.requestsRejected++;
          reject(error);
        },
        timestamp,
      });

      // Try to process queue immediately
      this.processQueue();
    });
  }

  /**
   * Try to acquire a token without waiting
   * Returns true if successful, false if no tokens available
   */
  tryAcquire(): boolean {
    this.refillTokens();

    if (this.tokens >= 1) {
      this.tokens--;
      return true;
    }

    return false;
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now();
    const elapsedMs = now - this.lastRefillTime;
    const elapsedSeconds = elapsedMs / 1000;

    const tokensToAdd = elapsedSeconds * this.config.tokensPerSecond;
    this.tokens = Math.min(this.config.burstCapacity, this.tokens + tokensToAdd);
    this.lastRefillTime = now;

    // Process queue if tokens are available
    if (this.tokens >= 1 && this.queue.length > 0) {
      this.processQueue();
    }
  }

  /**
   * Process queued requests
   */
  private processQueue(): void {
    this.refillTokens();

    while (this.tokens >= 1 && this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        this.tokens--;
        item.resolve();
      }
    }
  }

  /**
   * Get current rate limiter statistics
   */
  getStats(): RateLimitStats {
    this.refillTokens();

    return {
      tokensAvailable: Math.floor(this.tokens),
      requestsQueued: this.queue.length,
      requestsRejected: this.stats.requestsRejected,
      averageWaitTime:
        this.stats.requestsCompleted > 0
          ? this.stats.totalWaitTime / this.stats.requestsCompleted
          : 0,
    };
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.tokens = this.config.burstCapacity;
    this.lastRefillTime = Date.now();

    // Reject all queued requests
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        item.reject(new Error('Rate limiter reset'));
      }
    }

    this.stats = {
      requestsQueued: 0,
      requestsRejected: 0,
      totalWaitTime: 0,
      requestsCompleted: 0,
    };
  }

  /**
   * Get configuration
   */
  getConfig(): Required<RateLimiterConfig> {
    return { ...this.config };
  }
}

/**
 * Exponential backoff helper for retry logic
 */
export class ExponentialBackoff {
  private attempts = 0;
  private readonly maxAttempts: number;
  private readonly baseDelayMs: number;
  private readonly maxDelayMs: number;
  private readonly jitterFactor: number;

  constructor(options: {
    maxAttempts?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    jitterFactor?: number;
  } = {}) {
    this.maxAttempts = options.maxAttempts ?? 5;
    this.baseDelayMs = options.baseDelayMs ?? 1000;
    this.maxDelayMs = options.maxDelayMs ?? 30000;
    this.jitterFactor = options.jitterFactor ?? 0.1;
  }

  /**
   * Calculate delay for current attempt
   */
  getDelay(): number {
    if (this.attempts >= this.maxAttempts) {
      throw new Error(`Max retry attempts (${this.maxAttempts}) exceeded`);
    }

    const exponentialDelay = Math.min(
      this.maxDelayMs,
      this.baseDelayMs * Math.pow(2, this.attempts)
    );

    // Add jitter to prevent thundering herd
    const jitter = exponentialDelay * this.jitterFactor * (Math.random() - 0.5);
    const delay = Math.floor(exponentialDelay + jitter);

    this.attempts++;
    return delay;
  }

  /**
   * Execute a function with exponential backoff retry
   */
  async execute<T>(
    fn: () => Promise<T>,
    shouldRetry: (error: Error) => boolean = () => true
  ): Promise<T> {
    let lastError: Error | undefined;

    while (this.attempts < this.maxAttempts) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (!shouldRetry(lastError)) {
          throw lastError;
        }

        if (this.attempts < this.maxAttempts) {
          const delay = this.getDelay();
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Max retry attempts exceeded');
  }

  /**
   * Reset attempt counter
   */
  reset(): void {
    this.attempts = 0;
  }

  /**
   * Get current attempt number
   */
  getAttempts(): number {
    return this.attempts;
  }

  /**
   * Check if more attempts are available
   */
  canRetry(): boolean {
    return this.attempts < this.maxAttempts;
  }
}

/**
 * Rate limiter pool for managing multiple rate limiters
 */
export class RateLimiterPool {
  private limiters = new Map<string, RateLimiter>();
  private defaultConfig: RateLimiterConfig;

  constructor(defaultConfig: RateLimiterConfig) {
    this.defaultConfig = defaultConfig;
  }

  /**
   * Get or create a rate limiter for a specific key
   */
  getLimiter(key: string, config?: RateLimiterConfig): RateLimiter {
    if (!this.limiters.has(key)) {
      this.limiters.set(
        key,
        new RateLimiter(config || this.defaultConfig)
      );
    }
    return this.limiters.get(key)!;
  }

  /**
   * Acquire token from a specific limiter
   */
  async acquire(key: string): Promise<void> {
    const limiter = this.getLimiter(key);
    return limiter.acquire();
  }

  /**
   * Get stats for all limiters
   */
  getAllStats(): Map<string, RateLimitStats> {
    const stats = new Map<string, RateLimitStats>();
    for (const [key, limiter] of this.limiters.entries()) {
      stats.set(key, limiter.getStats());
    }
    return stats;
  }

  /**
   * Reset all limiters
   */
  resetAll(): void {
    for (const limiter of this.limiters.values()) {
      limiter.reset();
    }
  }

  /**
   * Remove a limiter
   */
  remove(key: string): boolean {
    const limiter = this.limiters.get(key);
    if (limiter) {
      limiter.reset();
      return this.limiters.delete(key);
    }
    return false;
  }

  /**
   * Get all limiter keys
   */
  getKeys(): string[] {
    return Array.from(this.limiters.keys());
  }
}
