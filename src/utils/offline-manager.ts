/**
 * Offline Manager
 *
 * Handles offline mode with operation queuing and automatic sync when online
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export enum OperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CUSTOM = 'CUSTOM',
}

export interface QueuedOperation {
  id: string;
  type: OperationType;
  service: string;
  operation: string;
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
  priority: number;
}

export interface OfflineConfig {
  /**
   * Directory to store offline queue
   */
  queueDirectory?: string;

  /**
   * Maximum queue size
   */
  maxQueueSize?: number;

  /**
   * Time to live for cached items (ms)
   */
  cacheTTL?: number;

  /**
   * Interval to check connectivity (ms)
   */
  connectivityCheckInterval?: number;

  /**
   * Auto-sync when connection restored
   */
  autoSync?: boolean;

  /**
   * Callback when connectivity changes
   */
  onConnectivityChange?: (isOnline: boolean) => void;

  /**
   * Callback when sync completes
   */
  onSyncComplete?: (results: SyncResult[]) => void;
}

export interface CachedData<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface SyncResult {
  operationId: string;
  success: boolean;
  error?: string;
}

/**
 * Offline Manager for handling connectivity and offline operations
 */
export class OfflineManager {
  private queue: QueuedOperation[] = [];
  private cache = new Map<string, CachedData>();
  private isOnline = true;
  private queuePath: string;
  private checkInterval?: NodeJS.Timeout;
  private readonly config: Required<OfflineConfig>;

  constructor(config: OfflineConfig = {}) {
    this.config = {
      queueDirectory: config.queueDirectory ?? '.swarm/offline',
      maxQueueSize: config.maxQueueSize ?? 1000,
      cacheTTL: config.cacheTTL ?? 3600000, // 1 hour
      connectivityCheckInterval: config.connectivityCheckInterval ?? 30000, // 30 seconds
      autoSync: config.autoSync ?? true,
      onConnectivityChange: config.onConnectivityChange ?? (() => {}),
      onSyncComplete: config.onSyncComplete ?? (() => {}),
    };

    this.queuePath = path.join(this.config.queueDirectory, 'queue.json');
  }

  /**
   * Initialize the offline manager
   */
  async initialize(): Promise<void> {
    // Load persisted queue
    await this.loadQueue();

    // Start connectivity monitoring
    if (this.config.connectivityCheckInterval > 0) {
      this.startConnectivityMonitoring();
    }

    console.log('Offline manager initialized');
  }

  /**
   * Shutdown the offline manager
   */
  async shutdown(): Promise<void> {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }

    // Save queue before shutdown
    await this.saveQueue();
    console.log('Offline manager shutdown');
  }

  /**
   * Check if currently online
   */
  isOnlineNow(): boolean {
    return this.isOnline;
  }

  /**
   * Queue an operation for later execution
   */
  async queueOperation(
    service: string,
    operation: string,
    type: OperationType,
    data: any,
    options: {
      maxRetries?: number;
      priority?: number;
    } = {}
  ): Promise<string> {
    if (this.queue.length >= this.config.maxQueueSize) {
      throw new Error(`Queue full (max: ${this.config.maxQueueSize})`);
    }

    const op: QueuedOperation = {
      id: this.generateId(),
      type,
      service,
      operation,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: options.maxRetries ?? 3,
      priority: options.priority ?? 0,
    };

    this.queue.push(op);

    // Sort by priority (higher first) then timestamp (older first)
    this.queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.timestamp - b.timestamp;
    });

    await this.saveQueue();

    console.log(`Queued ${type} operation for ${service}.${operation} (id: ${op.id})`);
    return op.id;
  }

  /**
   * Get queued operations for a service
   */
  getQueuedOperations(service?: string): QueuedOperation[] {
    if (service) {
      return this.queue.filter(op => op.service === service);
    }
    return [...this.queue];
  }

  /**
   * Get queue size
   */
  getQueueSize(service?: string): number {
    if (service) {
      return this.queue.filter(op => op.service === service).length;
    }
    return this.queue.length;
  }

  /**
   * Cache data with TTL
   */
  cacheData<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.config.cacheTTL,
    });
  }

  /**
   * Get cached data
   */
  getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if expired
    const age = Date.now() - cached.timestamp;
    if (age > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache) {
      const age = now - cached.timestamp;
      if (age > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Sync queued operations
   */
  async sync(
    executor: (operation: QueuedOperation) => Promise<void>
  ): Promise<SyncResult[]> {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    const results: SyncResult[] = [];
    const failedOps: QueuedOperation[] = [];

    console.log(`Syncing ${this.queue.length} queued operations...`);

    for (const op of this.queue) {
      try {
        await executor(op);
        results.push({
          operationId: op.id,
          success: true,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        results.push({
          operationId: op.id,
          success: false,
          error: errorMessage,
        });

        // Check if should retry
        op.retries++;
        if (op.retries < op.maxRetries) {
          failedOps.push(op);
          console.warn(
            `Operation ${op.id} failed (retry ${op.retries}/${op.maxRetries}): ${errorMessage}`
          );
        } else {
          console.error(
            `Operation ${op.id} failed permanently after ${op.retries} retries: ${errorMessage}`
          );
        }
      }
    }

    // Update queue with only failed operations that can retry
    this.queue = failedOps;
    await this.saveQueue();

    console.log(
      `Sync complete: ${results.filter(r => r.success).length} succeeded, ${results.filter(r => !r.success).length} failed`
    );

    this.config.onSyncComplete(results);
    return results;
  }

  /**
   * Remove operation from queue
   */
  async removeOperation(operationId: string): Promise<boolean> {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter(op => op.id !== operationId);

    if (this.queue.length < initialLength) {
      await this.saveQueue();
      return true;
    }

    return false;
  }

  /**
   * Clear all queued operations
   */
  async clearQueue(service?: string): Promise<void> {
    if (service) {
      this.queue = this.queue.filter(op => op.service !== service);
    } else {
      this.queue = [];
    }
    await this.saveQueue();
  }

  /**
   * Manually set online/offline status
   */
  async setOnlineStatus(isOnline: boolean): Promise<void> {
    if (this.isOnline !== isOnline) {
      const wasOnline = this.isOnline;
      this.isOnline = isOnline;

      console.log(`Connectivity changed: ${wasOnline ? 'online' : 'offline'} -> ${isOnline ? 'online' : 'offline'}`);
      this.config.onConnectivityChange(isOnline);

      // Auto-sync when coming back online
      if (isOnline && !wasOnline && this.config.autoSync && this.queue.length > 0) {
        console.log('Connection restored, auto-sync will be triggered by application');
      }
    }
  }

  /**
   * Start monitoring connectivity
   */
  private startConnectivityMonitoring(): void {
    this.checkInterval = setInterval(async () => {
      const wasOnline = this.isOnline;
      const isOnline = await this.checkConnectivity();

      if (wasOnline !== isOnline) {
        await this.setOnlineStatus(isOnline);
      }
    }, this.config.connectivityCheckInterval);
  }

  /**
   * Check network connectivity
   */
  private async checkConnectivity(): Promise<boolean> {
    try {
      // Try to resolve a known host (using DNS)
      // In Node.js, we can use dns.lookup
      const dns = await import('dns').then(m => m.promises);
      await dns.lookup('google.com');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Load queue from disk
   */
  private async loadQueue(): Promise<void> {
    try {
      await fs.mkdir(this.config.queueDirectory, { recursive: true });

      try {
        const data = await fs.readFile(this.queuePath, 'utf-8');
        this.queue = JSON.parse(data);
        console.log(`Loaded ${this.queue.length} queued operations`);
      } catch {
        // Queue file doesn't exist yet
        this.queue = [];
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  /**
   * Save queue to disk
   */
  private async saveQueue(): Promise<void> {
    try {
      await fs.mkdir(this.config.queueDirectory, { recursive: true });
      await fs.writeFile(this.queuePath, JSON.stringify(this.queue, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  /**
   * Generate unique operation ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
