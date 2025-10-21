/**
 * Graceful Degradation Manager
 *
 * Manages service degradation and fallback strategies when dependencies fail
 */

export enum ServiceMode {
  FULL = 'FULL',
  DEGRADED = 'DEGRADED',
  READ_ONLY = 'READ_ONLY',
  OFFLINE = 'OFFLINE',
}

export interface ServiceHealth {
  service: string;
  mode: ServiceMode;
  healthy: boolean;
  lastCheck: Date;
  lastError?: string;
  features: Map<string, boolean>;
}

export interface DegradationConfig {
  /**
   * Features that can be disabled
   */
  features?: string[];

  /**
   * Critical features that cannot be disabled
   */
  criticalFeatures?: string[];

  /**
   * Health check interval (ms)
   */
  healthCheckInterval?: number;

  /**
   * Auto-recover when health improves
   */
  autoRecover?: boolean;

  /**
   * Callback when mode changes
   */
  onModeChange?: (service: string, mode: ServiceMode) => void;
}

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  critical: boolean;
  description?: string;
}

/**
 * Graceful Degradation Manager
 */
export class DegradationManager {
  private services = new Map<string, ServiceHealth>();
  private featureFlags = new Map<string, FeatureFlag>();
  private readonly config: Required<DegradationConfig>;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(config: DegradationConfig = {}) {
    this.config = {
      features: config.features ?? [],
      criticalFeatures: config.criticalFeatures ?? [],
      healthCheckInterval: config.healthCheckInterval ?? 60000, // 1 minute
      autoRecover: config.autoRecover ?? true,
      onModeChange: config.onModeChange ?? (() => {}),
    };

    // Initialize feature flags
    for (const feature of this.config.features) {
      this.featureFlags.set(feature, {
        name: feature,
        enabled: true,
        critical: this.config.criticalFeatures.includes(feature),
      });
    }
  }

  /**
   * Initialize the degradation manager
   */
  initialize(): void {
    if (this.config.healthCheckInterval > 0) {
      this.startHealthChecks();
    }
    console.log('Degradation manager initialized');
  }

  /**
   * Shutdown the degradation manager
   */
  shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
    console.log('Degradation manager shutdown');
  }

  /**
   * Register a service for monitoring
   */
  registerService(serviceName: string): void {
    if (!this.services.has(serviceName)) {
      this.services.set(serviceName, {
        service: serviceName,
        mode: ServiceMode.FULL,
        healthy: true,
        lastCheck: new Date(),
        features: new Map(),
      });
    }
  }

  /**
   * Report service health
   */
  reportHealth(serviceName: string, healthy: boolean, error?: string): void {
    const service = this.services.get(serviceName);

    if (!service) {
      this.registerService(serviceName);
      return this.reportHealth(serviceName, healthy, error);
    }

    const wasHealthy = service.healthy;
    service.healthy = healthy;
    service.lastCheck = new Date();
    service.lastError = error;

    // Update mode based on health
    if (!healthy && wasHealthy) {
      this.degradeService(serviceName, error);
    } else if (healthy && !wasHealthy && this.config.autoRecover) {
      this.recoverService(serviceName);
    }
  }

  /**
   * Degrade a service to a lower mode
   */
  degradeService(serviceName: string, reason?: string): void {
    const service = this.services.get(serviceName);
    if (!service) {
      return;
    }

    const currentMode = service.mode;
    let newMode: ServiceMode;

    // Determine new mode based on current mode
    switch (currentMode) {
      case ServiceMode.FULL:
        newMode = ServiceMode.DEGRADED;
        break;
      case ServiceMode.DEGRADED:
        newMode = ServiceMode.READ_ONLY;
        break;
      case ServiceMode.READ_ONLY:
        newMode = ServiceMode.OFFLINE;
        break;
      default:
        newMode = ServiceMode.OFFLINE;
    }

    this.setServiceMode(serviceName, newMode, reason);
  }

  /**
   * Recover a service to a higher mode
   */
  recoverService(serviceName: string): void {
    const service = this.services.get(serviceName);
    if (!service) {
      return;
    }

    const currentMode = service.mode;
    let newMode: ServiceMode;

    // Determine new mode based on current mode
    switch (currentMode) {
      case ServiceMode.OFFLINE:
        newMode = ServiceMode.READ_ONLY;
        break;
      case ServiceMode.READ_ONLY:
        newMode = ServiceMode.DEGRADED;
        break;
      case ServiceMode.DEGRADED:
        newMode = ServiceMode.FULL;
        break;
      default:
        newMode = ServiceMode.FULL;
    }

    this.setServiceMode(serviceName, newMode, 'Health recovered');
  }

  /**
   * Set service mode explicitly
   */
  setServiceMode(serviceName: string, mode: ServiceMode, reason?: string): void {
    const service = this.services.get(serviceName);
    if (!service) {
      return;
    }

    const oldMode = service.mode;
    if (oldMode === mode) {
      return;
    }

    service.mode = mode;

    console.log(
      `Service "${serviceName}" mode: ${oldMode} -> ${mode}${reason ? ` (${reason})` : ''}`
    );

    this.config.onModeChange(serviceName, mode);

    // Disable features based on mode
    this.updateFeatureFlags(serviceName, mode);
  }

  /**
   * Check if a service is in a specific mode or better
   */
  isServiceMode(serviceName: string, minMode: ServiceMode): boolean {
    const service = this.services.get(serviceName);
    if (!service) {
      return false;
    }

    const modeOrder = [
      ServiceMode.OFFLINE,
      ServiceMode.READ_ONLY,
      ServiceMode.DEGRADED,
      ServiceMode.FULL,
    ];

    const currentIndex = modeOrder.indexOf(service.mode);
    const minIndex = modeOrder.indexOf(minMode);

    return currentIndex >= minIndex;
  }

  /**
   * Check if writes are allowed for a service
   */
  canWrite(serviceName: string): boolean {
    return this.isServiceMode(serviceName, ServiceMode.DEGRADED);
  }

  /**
   * Check if reads are allowed for a service
   */
  canRead(serviceName: string): boolean {
    return this.isServiceMode(serviceName, ServiceMode.READ_ONLY);
  }

  /**
   * Get service health status
   */
  getServiceHealth(serviceName: string): ServiceHealth | null {
    return this.services.get(serviceName) || null;
  }

  /**
   * Get all service health statuses
   */
  getAllServiceHealth(): ServiceHealth[] {
    return Array.from(this.services.values());
  }

  /**
   * Enable or disable a feature
   */
  setFeatureFlag(featureName: string, enabled: boolean): void {
    const flag = this.featureFlags.get(featureName);

    if (!flag) {
      this.featureFlags.set(featureName, {
        name: featureName,
        enabled,
        critical: false,
      });
      return;
    }

    // Cannot disable critical features
    if (flag.critical && !enabled) {
      console.warn(`Cannot disable critical feature: ${featureName}`);
      return;
    }

    flag.enabled = enabled;
    console.log(`Feature "${featureName}" ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featureName: string): boolean {
    const flag = this.featureFlags.get(featureName);
    return flag ? flag.enabled : false;
  }

  /**
   * Get all feature flags
   */
  getFeatureFlags(): FeatureFlag[] {
    return Array.from(this.featureFlags.values());
  }

  /**
   * Get overall system health
   */
  getSystemHealth(): {
    healthy: boolean;
    mode: ServiceMode;
    services: number;
    healthyServices: number;
    degradedServices: number;
  } {
    const services = Array.from(this.services.values());
    const healthyServices = services.filter(s => s.healthy).length;
    const degradedServices = services.filter(s => s.mode !== ServiceMode.FULL).length;

    // Determine overall mode
    let mode = ServiceMode.FULL;
    if (degradedServices > 0) {
      const modes = services.map(s => s.mode);
      if (modes.some(m => m === ServiceMode.OFFLINE)) {
        mode = ServiceMode.OFFLINE;
      } else if (modes.some(m => m === ServiceMode.READ_ONLY)) {
        mode = ServiceMode.READ_ONLY;
      } else if (modes.some(m => m === ServiceMode.DEGRADED)) {
        mode = ServiceMode.DEGRADED;
      }
    }

    return {
      healthy: healthyServices === services.length,
      mode,
      services: services.length,
      healthyServices,
      degradedServices,
    };
  }

  /**
   * Update feature flags based on service mode
   */
  private updateFeatureFlags(serviceName: string, mode: ServiceMode): void {
    const service = this.services.get(serviceName);
    if (!service) {
      return;
    }

    // Define which features are available in each mode
    const featuresByMode: Record<ServiceMode, string[]> = {
      [ServiceMode.FULL]: this.config.features,
      [ServiceMode.DEGRADED]: this.config.criticalFeatures,
      [ServiceMode.READ_ONLY]: [],
      [ServiceMode.OFFLINE]: [],
    };

    const allowedFeatures = featuresByMode[mode];

    // Update feature availability for this service
    for (const feature of this.config.features) {
      const isAllowed = allowedFeatures.includes(feature);
      service.features.set(feature, isAllowed);

      // Update global feature flag if this affects it
      if (!isAllowed) {
        const flag = this.featureFlags.get(feature);
        if (flag && !flag.critical) {
          this.setFeatureFlag(feature, false);
        }
      }
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      // Health checks would be performed by the application
      // This just cleans up stale data
      this.cleanupStaleData();
    }, this.config.healthCheckInterval);
  }

  /**
   * Clean up stale health data
   */
  private cleanupStaleData(): void {
    const staleThreshold = this.config.healthCheckInterval * 3;
    const now = Date.now();

    for (const [serviceName, service] of this.services) {
      const age = now - service.lastCheck.getTime();

      if (age > staleThreshold) {
        console.warn(
          `Service "${serviceName}" health data is stale (${Math.round(age / 1000)}s old)`
        );

        // Mark as unhealthy if too stale
        if (service.healthy) {
          this.reportHealth(serviceName, false, 'Stale health data');
        }
      }
    }
  }
}
