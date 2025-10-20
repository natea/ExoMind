import { HealthCheckService } from '../../src/services/health-check-service';
import { SkillRegistry } from '../../src/core/skill-registry';
import { MemoryService } from '../../src/services/memory-service';
import { WhatsAppService } from '../../src/services/whatsapp-service';
import { TestHelpers } from '../helpers/test-helpers';

describe('Health Check Integration Tests', () => {
  let healthCheckService: HealthCheckService;
  let skillRegistry: SkillRegistry;
  let memoryService: MemoryService;
  let whatsappService: WhatsAppService;
  let testHelpers: TestHelpers;

  beforeAll(async () => {
    testHelpers = new TestHelpers();
    await testHelpers.setupTestEnvironment();

    healthCheckService = new HealthCheckService();
    skillRegistry = new SkillRegistry();
    memoryService = new MemoryService();
    whatsappService = new WhatsAppService();
  });

  afterAll(async () => {
    await testHelpers.cleanupTestEnvironment();
  });

  describe('All Health Checks Pass', () => {
    it('should pass comprehensive system health check', async () => {
      const result = await healthCheckService.runFullCheck();

      expect(result.overall_status).toBe('healthy');
      expect(result.checks).toHaveProperty('skills');
      expect(result.checks).toHaveProperty('memory');
      expect(result.checks).toHaveProperty('whatsapp');
      expect(result.checks).toHaveProperty('integrations');

      // Verify each subsystem
      expect(result.checks.skills.status).toBe('healthy');
      expect(result.checks.memory.status).toBe('healthy');
      expect(result.checks.whatsapp.status).toBe('healthy');
      expect(result.checks.integrations.status).toBe('healthy');
    });

    it('should verify all skills are healthy', async () => {
      const skills = await skillRegistry.getAllSkills();

      for (const skill of skills) {
        const health = await healthCheckService.checkSkillHealth(skill.id);

        expect(health.status).not.toBe('unhealthy');
        expect(health).toHaveProperty('response_time');
        expect(health.response_time).toBeLessThan(1000); // < 1 second
      }
    });

    it('should verify memory service health', async () => {
      const health = await healthCheckService.checkMemoryHealth();

      expect(health.status).toBe('healthy');
      expect(health).toHaveProperty('storage_available');
      expect(health).toHaveProperty('read_latency');
      expect(health).toHaveProperty('write_latency');

      expect(health.read_latency).toBeLessThan(100); // < 100ms
      expect(health.write_latency).toBeLessThan(100);
    });

    it('should verify WhatsApp service health', async () => {
      const health = await healthCheckService.checkWhatsAppHealth();

      expect(health.status).toBe('healthy');
      expect(health).toHaveProperty('connection_status');
      expect(health.connection_status).toBe('connected');
      expect(health).toHaveProperty('message_queue_size');
      expect(health.message_queue_size).toBeLessThan(100);
    });
  });

  describe('Degraded Mode Handling', () => {
    it('should detect and handle degraded memory service', async () => {
      // Simulate high latency
      await testHelpers.simulateMemoryLatency(500); // 500ms

      const health = await healthCheckService.checkMemoryHealth();

      expect(health.status).toBe('degraded');
      expect(health.read_latency).toBeGreaterThan(200);

      // Verify system adapts
      const systemStatus = await healthCheckService.getSystemStatus();
      expect(systemStatus.mode).toBe('degraded');
      expect(systemStatus.adaptations).toContain('reduced_memory_usage');
    });

    it('should handle WhatsApp connectivity issues', async () => {
      // Simulate connection issues
      await testHelpers.simulateWhatsAppDisconnect();

      const health = await healthCheckService.checkWhatsAppHealth();

      expect(health.status).toBe('degraded');
      expect(health.connection_status).toBe('reconnecting');

      // Verify fallback behavior
      const systemStatus = await healthCheckService.getSystemStatus();
      expect(systemStatus.adaptations).toContain('queue_messages');
    });

    it('should operate with reduced functionality', async () => {
      // Simulate multiple degraded services
      await testHelpers.simulateMemoryLatency(500);
      await testHelpers.simulateWhatsAppDisconnect();

      const systemStatus = await healthCheckService.getSystemStatus();

      expect(systemStatus.mode).toBe('degraded');
      expect(systemStatus.available_features).toBeDefined();

      // Essential features should still work
      expect(systemStatus.available_features).toContain('core_skills');
      expect(systemStatus.available_features).not.toContain('realtime_messaging');
    });
  });

  describe('Error Recovery', () => {
    it('should recover from transient errors', async () => {
      // Inject transient error
      await testHelpers.injectTransientError('memory_service', 'TIMEOUT');

      // Check status
      let health = await healthCheckService.checkMemoryHealth();
      expect(health.status).toBe('unhealthy');

      // Wait for recovery
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify recovery
      health = await healthCheckService.checkMemoryHealth();
      expect(health.status).toBe('healthy');
      expect(health.recovered_from_error).toBe(true);
    });

    it('should handle skill execution errors gracefully', async () => {
      // Execute skill with error injection
      const result = await skillRegistry.executeSkill('daily-planning', {
        inject_error: true
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      // Verify skill is still healthy
      const health = await healthCheckService.checkSkillHealth('daily-planning');
      expect(health.status).not.toBe('unhealthy');
      expect(health.error_rate).toBeLessThan(0.1); // < 10% error rate
    });

    it('should retry failed operations', async () => {
      let attempt = 0;

      const result = await healthCheckService.withRetry(async () => {
        attempt++;
        if (attempt < 3) {
          throw new Error('Simulated failure');
        }
        return { success: true };
      }, {
        max_attempts: 5,
        backoff: 'exponential'
      });

      expect(result.success).toBe(true);
      expect(attempt).toBe(3);
    });

    it('should circuit break on persistent errors', async () => {
      // Simulate persistent errors
      for (let i = 0; i < 10; i++) {
        await testHelpers.injectError('skill_service', 'EXECUTION_ERROR');
      }

      const circuitState = await healthCheckService.getCircuitBreakerState('skill_service');

      expect(circuitState.state).toBe('open');
      expect(circuitState.consecutive_failures).toBeGreaterThanOrEqual(5);

      // Verify fallback behavior
      const result = await skillRegistry.executeSkill('daily-planning', {});
      expect(result.used_fallback).toBe(true);
    });
  });

  describe('Health Reporting', () => {
    it('should generate comprehensive health report', async () => {
      const report = await healthCheckService.generateReport();

      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('overall_status');
      expect(report).toHaveProperty('subsystems');
      expect(report).toHaveProperty('metrics');
      expect(report).toHaveProperty('recommendations');

      // Verify subsystems
      expect(report.subsystems).toHaveProperty('skills');
      expect(report.subsystems).toHaveProperty('memory');
      expect(report.subsystems).toHaveProperty('integrations');

      // Verify metrics
      expect(report.metrics).toHaveProperty('uptime');
      expect(report.metrics).toHaveProperty('error_rate');
      expect(report.metrics).toHaveProperty('response_times');
    });

    it('should track health metrics over time', async () => {
      // Run health checks periodically
      for (let i = 0; i < 5; i++) {
        await healthCheckService.runFullCheck();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const metrics = await healthCheckService.getHistoricalMetrics({
        duration: '5m'
      });

      expect(metrics).toHaveProperty('samples');
      expect(metrics.samples.length).toBe(5);

      expect(metrics).toHaveProperty('trends');
      expect(metrics.trends).toHaveProperty('error_rate_trend');
      expect(metrics.trends).toHaveProperty('latency_trend');
    });

    it('should alert on health degradation', async () => {
      const alerts: any[] = [];

      healthCheckService.onAlert((alert) => {
        alerts.push(alert);
      });

      // Simulate degradation
      await testHelpers.simulateMemoryLatency(1000);

      // Wait for alert
      await new Promise(resolve => setTimeout(resolve, 2000));

      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0]).toHaveProperty('severity');
      expect(alerts[0]).toHaveProperty('message');
      expect(alerts[0].severity).toBe('warning');
    });

    it('should provide actionable recommendations', async () => {
      // Simulate various issues
      await testHelpers.simulateHighMemoryUsage();
      await testHelpers.simulateSlowSkillExecution('daily-planning');

      const report = await healthCheckService.generateReport();

      expect(report.recommendations).toBeDefined();
      expect(report.recommendations.length).toBeGreaterThan(0);

      // Verify recommendations are actionable
      report.recommendations.forEach((rec: any) => {
        expect(rec).toHaveProperty('issue');
        expect(rec).toHaveProperty('severity');
        expect(rec).toHaveProperty('action');
        expect(rec).toHaveProperty('priority');
      });
    });
  });

  describe('Integration Health', () => {
    it('should verify all integrations are healthy', async () => {
      const integrations = ['whatsapp', 'calendar', 'notes', 'tasks'];

      for (const integration of integrations) {
        const health = await healthCheckService.checkIntegrationHealth(integration);

        expect(health.status).not.toBe('unhealthy');
        expect(health).toHaveProperty('last_sync');
        expect(health).toHaveProperty('sync_status');
      }
    });

    it('should handle integration failures gracefully', async () => {
      // Simulate integration failure
      await testHelpers.disableIntegration('calendar');

      const health = await healthCheckService.checkIntegrationHealth('calendar');

      expect(health.status).toBe('unhealthy');
      expect(health.error).toBeDefined();

      // Verify system continues working
      const systemStatus = await healthCheckService.getSystemStatus();
      expect(systemStatus.overall_status).toBe('degraded');
      expect(systemStatus.disabled_integrations).toContain('calendar');
    });
  });
});
