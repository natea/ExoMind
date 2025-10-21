/**
 * Resilient Client Wrapper
 *
 * Provides circuit breaker, retry, and offline support for all API clients
 */

import { CircuitBreaker, CircuitBreakerManager } from '../utils/circuit-breaker';
import { OfflineManager, OperationType } from '../utils/offline-manager';
import { DegradationManager, ServiceMode } from '../utils/degradation-manager';
import { EnhancedRetry } from '../utils/enhanced-retry';

export interface ResilientClientConfig {
  serviceName: string;

  /**
   * Circuit breaker configuration
   */
  circuitBreaker?: {
    failureThreshold?: number;
    resetTimeout?: number;
    successThreshold?: number;
  };

  /**
   * Retry configuration
   */
  retry?: {
    maxAttempts?: number;
    baseDelayMs?: number;
    retryBudget?: {
      maxRetries: number;
      windowMs: number;
    };
  };

  /**
   * Enable offline queue
   */
  enableOffline?: boolean;

  /**
   * Enable graceful degradation
   */
  enableDegradation?: boolean;

  /**
   * Cache TTL in milliseconds
   */
  cacheTTL?: number;
}

/**
 * Resilient Client for API calls with error handling
 */
export class ResilientClient {
  private circuitBreaker: CircuitBreaker;
  private offlineManager?: OfflineManager;
  private degradationManager?: DegradationManager;
  private readonly serviceName: string;
  private readonly config: ResilientClientConfig;

  constructor(
    config: ResilientClientConfig,
    circuitBreakerManager?: CircuitBreakerManager,
    offlineManager?: OfflineManager,
    degradationManager?: DegradationManager
  ) {
    this.serviceName = config.serviceName;
    this.config = config;

    // Initialize circuit breaker
    if (circuitBreakerManager) {
      this.circuitBreaker = circuitBreakerManager.getBreaker(
        config.serviceName,
        config.circuitBreaker
      );
    } else {
      this.circuitBreaker = new CircuitBreaker({
        ...config.circuitBreaker,
        name: config.serviceName,
      });
    }

    // Set up offline manager if enabled
    if (config.enableOffline && offlineManager) {
      this.offlineManager = offlineManager;
    }

    // Set up degradation manager if enabled
    if (config.enableDegradation && degradationManager) {
      this.degradationManager = degradationManager;
      this.degradationManager.registerService(config.serviceName);
    }
  }

  /**
   * Execute a read operation with resilience
   */
  async executeRead<T>(
    operation: string,
    fn: () => Promise<T>,
    options: {
      cacheKey?: string;
      fallback?: () => Promise<T>;
    } = {}
  ): Promise<T> {
    // Check if service can read
    if (this.degradationManager && !this.degradationManager.canRead(this.serviceName)) {
      if (options.fallback) {
        console.warn(`${this.serviceName}: Service degraded, using fallback for read`);
        return await options.fallback();
      }
      throw new Error(`Service ${this.serviceName} is in offline mode`);
    }

    // Try to get from cache first if offline
    if (options.cacheKey && this.offlineManager && !this.offlineManager.isOnlineNow()) {
      const cached = this.offlineManager.getCachedData<T>(options.cacheKey);
      if (cached !== null) {
        console.log(`${this.serviceName}: Using cached data (offline)`);
        return cached;
      }
    }

    // Execute with retry and circuit breaker
    const retry = new EnhancedRetry({
      ...this.config.retry,
      circuitBreaker: this.circuitBreaker,
      onRetry: (error, attempt, delay) => {
        console.warn(
          `${this.serviceName}.${operation}: Retry attempt ${attempt} after ${delay}ms (${error.message})`
        );
      },
    });

    try {
      const result = await retry.execute(fn);

      // Cache the result if we have a cache key
      if (options.cacheKey && this.offlineManager) {
        this.offlineManager.cacheData(options.cacheKey, result, this.config.cacheTTL);
      }

      // Report health
      if (this.degradationManager) {
        this.degradationManager.reportHealth(this.serviceName, true);
      }

      return result;
    } catch (error) {
      // Report unhealthy
      if (this.degradationManager) {
        this.degradationManager.reportHealth(
          this.serviceName,
          false,
          error instanceof Error ? error.message : String(error)
        );
      }

      // Try fallback or cached data
      if (options.fallback) {
        console.warn(`${this.serviceName}.${operation}: Using fallback after failure`);
        return await options.fallback();
      }

      if (options.cacheKey && this.offlineManager) {
        const cached = this.offlineManager.getCachedData<T>(options.cacheKey);
        if (cached !== null) {
          console.warn(`${this.serviceName}.${operation}: Using stale cached data after failure`);
          return cached;
        }
      }

      throw error;
    }
  }

  /**
   * Execute a write operation with resilience
   */
  async executeWrite<T>(
    operation: string,
    fn: () => Promise<T>,
    options: {
      queueIfOffline?: boolean;
      queueData?: any;
      priority?: number;
    } = {}
  ): Promise<T> {
    // Check if service can write
    if (this.degradationManager && !this.degradationManager.canWrite(this.serviceName)) {
      // Queue if offline mode is enabled
      if (options.queueIfOffline && this.offlineManager && options.queueData) {
        console.warn(`${this.serviceName}.${operation}: Service degraded, queuing write operation`);
        await this.offlineManager.queueOperation(
          this.serviceName,
          operation,
          OperationType.UPDATE,
          options.queueData,
          { priority: options.priority }
        );
        throw new Error(`Service ${this.serviceName} is in read-only mode, operation queued`);
      }
      throw new Error(`Service ${this.serviceName} is in read-only mode`);
    }

    // Check if we're offline
    if (this.offlineManager && !this.offlineManager.isOnlineNow()) {
      if (options.queueIfOffline && options.queueData) {
        console.log(`${this.serviceName}.${operation}: Offline, queuing write operation`);
        await this.offlineManager.queueOperation(
          this.serviceName,
          operation,
          OperationType.UPDATE,
          options.queueData,
          { priority: options.priority }
        );
        throw new Error('Offline: operation queued for later sync');
      }
      throw new Error('Cannot perform write operation while offline');
    }

    // Execute with retry and circuit breaker
    const retry = new EnhancedRetry({
      ...this.config.retry,
      circuitBreaker: this.circuitBreaker,
      onRetry: (error, attempt, delay) => {
        console.warn(
          `${this.serviceName}.${operation}: Retry attempt ${attempt} after ${delay}ms (${error.message})`
        );
      },
    });

    try {
      const result = await retry.execute(fn);

      // Report health
      if (this.degradationManager) {
        this.degradationManager.reportHealth(this.serviceName, true);
      }

      return result;
    } catch (error) {
      // Report unhealthy
      if (this.degradationManager) {
        this.degradationManager.reportHealth(
          this.serviceName,
          false,
          error instanceof Error ? error.message : String(error)
        );
      }

      // Queue if offline and requested
      if (options.queueIfOffline && this.offlineManager && options.queueData) {
        console.warn(`${this.serviceName}.${operation}: Failed, queuing for retry`);
        await this.offlineManager.queueOperation(
          this.serviceName,
          operation,
          OperationType.UPDATE,
          options.queueData,
          { priority: options.priority }
        );
      }

      throw error;
    }
  }

  /**
   * Get service health information
   */
  getHealth(): {
    serviceName: string;
    circuitState: string;
    mode: ServiceMode | null;
    online: boolean;
    queueSize: number;
  } {
    return {
      serviceName: this.serviceName,
      circuitState: this.circuitBreaker.getState(),
      mode: this.degradationManager?.getServiceHealth(this.serviceName)?.mode || null,
      online: this.offlineManager?.isOnlineNow() ?? true,
      queueSize: this.offlineManager?.getQueueSize(this.serviceName) ?? 0,
    };
  }

  /**
   * Get queued operations
   */
  getQueuedOperations() {
    return this.offlineManager?.getQueuedOperations(this.serviceName) ?? [];
  }

  /**
   * Clear service queue
   */
  async clearQueue(): Promise<void> {
    if (this.offlineManager) {
      await this.offlineManager.clearQueue(this.serviceName);
    }
  }
}
