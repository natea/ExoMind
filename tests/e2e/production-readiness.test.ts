import { SkillExecutor } from '../../src/core/skill-executor';
import { MemoryService } from '../../src/services/memory-service';
import { HealthCheckService } from '../../src/services/health-check-service';
import { TestHelpers } from '../helpers/test-helpers';
import { PerformanceMonitor } from '../../src/monitoring/performance-monitor';

describe('Production Readiness E2E Tests', () => {
  let skillExecutor: SkillExecutor;
  let memoryService: MemoryService;
  let healthCheckService: HealthCheckService;
  let performanceMonitor: PerformanceMonitor;
  let testHelpers: TestHelpers;

  beforeAll(async () => {
    testHelpers = new TestHelpers();
    await testHelpers.setupProductionEnvironment();

    skillExecutor = new SkillExecutor();
    memoryService = new MemoryService();
    healthCheckService = new HealthCheckService();
    performanceMonitor = new PerformanceMonitor();
  });

  afterAll(async () => {
    await testHelpers.cleanupProductionEnvironment();
  });

  describe('Real User Data Scenarios', () => {
    it('should handle typical user daily workflow', async () => {
      const user = await testHelpers.createRealisticUser({
        name: 'Test User',
        goals: 5,
        daily_tasks: 15,
        inbox_items: 30
      });

      // Morning routine
      const morningStart = Date.now();

      const briefingResult = await skillExecutor.execute('whatsapp-message-management', {
        user_id: user.id,
        action: 'send_briefing',
        timing: 'morning'
      });
      expect(briefingResult.success).toBe(true);

      const inboxResult = await skillExecutor.execute('processing-inbox', {
        user_id: user.id,
        action: 'process_all'
      });
      expect(inboxResult.success).toBe(true);

      const planningResult = await skillExecutor.execute('daily-planning', {
        user_id: user.id,
        source: 'morning_routine'
      });
      expect(planningResult.success).toBe(true);

      const morningDuration = Date.now() - morningStart;
      expect(morningDuration).toBeLessThan(5000); // < 5 seconds

      // Day execution
      for (let i = 0; i < 15; i++) {
        await skillExecutor.execute('daily-planning', {
          user_id: user.id,
          action: 'complete_task',
          task_index: i
        });
      }

      // Evening routine
      const eveningStart = Date.now();

      const reflectionResult = await skillExecutor.execute('daily-planning', {
        user_id: user.id,
        action: 'reflection'
      });
      expect(reflectionResult.success).toBe(true);

      const eveningBriefing = await skillExecutor.execute('whatsapp-message-management', {
        user_id: user.id,
        action: 'send_briefing',
        timing: 'evening'
      });
      expect(eveningBriefing.success).toBe(true);

      const eveningDuration = Date.now() - eveningStart;
      expect(eveningDuration).toBeLessThan(3000); // < 3 seconds

      // Verify complete day logged
      const dayLog = await memoryService.retrieve(`day_log_${user.id}`, 'user_data');
      expect(dayLog).toBeDefined();
      expect(dayLog.tasks_completed).toBe(15);
      expect(dayLog.morning_routine_completed).toBe(true);
      expect(dayLog.evening_routine_completed).toBe(true);
    });

    it('should handle power user with high activity', async () => {
      const powerUser = await testHelpers.createRealisticUser({
        name: 'Power User',
        goals: 20,
        daily_tasks: 50,
        inbox_items: 100,
        weekly_reviews: true,
        monthly_assessments: true
      });

      // Simulate full week
      for (let day = 0; day < 7; day++) {
        await testHelpers.simulateDay(powerUser.id, {
          tasks: 50,
          inbox_items: 100,
          meetings: 5,
          interruptions: 10
        });
      }

      // Weekly review
      const reviewStart = Date.now();
      const reviewResult = await skillExecutor.execute('weekly-review', {
        user_id: powerUser.id
      });

      expect(reviewResult.success).toBe(true);
      expect(reviewResult.data).toHaveProperty('tasks_summary');
      expect(reviewResult.data.tasks_summary.total).toBe(350); // 50 tasks * 7 days

      const reviewDuration = Date.now() - reviewStart;
      expect(reviewDuration).toBeLessThan(10000); // < 10 seconds for heavy user

      // Verify data consistency
      const weekData = await memoryService.retrieve(`week_${powerUser.id}`, 'user_data');
      expect(weekData).toBeDefined();
      expect(weekData.days.length).toBe(7);
    });

    it('should handle new user onboarding', async () => {
      const newUser = await testHelpers.createUser({
        name: 'New User',
        first_time: true
      });

      // Initial assessment
      const assessmentResult = await skillExecutor.execute('conducting-life-assessment', {
        user_id: newUser.id,
        first_time: true
      });

      expect(assessmentResult.success).toBe(true);
      expect(assessmentResult.data).toHaveProperty('onboarding_completed');

      // First goals
      const goalsResult = await skillExecutor.execute('goal-setting', {
        user_id: newUser.id,
        guided: true
      });

      expect(goalsResult.success).toBe(true);
      expect(goalsResult.data.goals.length).toBeGreaterThan(0);

      // First daily plan
      const planningResult = await skillExecutor.execute('daily-planning', {
        user_id: newUser.id,
        first_time: true
      });

      expect(planningResult.success).toBe(true);
      expect(planningResult.data).toHaveProperty('tutorial_completed');

      // Verify onboarding state
      const onboardingState = await memoryService.retrieve(
        `onboarding_${newUser.id}`,
        'user_data'
      );
      expect(onboardingState.completed).toBe(true);
      expect(onboardingState.steps_completed).toContain('assessment');
      expect(onboardingState.steps_completed).toContain('goals');
      expect(onboardingState.steps_completed).toContain('first_plan');
    });
  });

  describe('Performance Under Load', () => {
    it('should handle concurrent requests from multiple users', async () => {
      const users = await testHelpers.createMultipleUsers(100);

      const startTime = Date.now();

      // Simulate concurrent morning routines
      const promises = users.map(user =>
        skillExecutor.execute('whatsapp-message-management', {
          user_id: user.id,
          action: 'send_briefing',
          timing: 'morning'
        })
      );

      const results = await Promise.all(promises);

      const duration = Date.now() - startTime;

      // All should succeed
      expect(results.every(r => r.success)).toBe(true);

      // Should handle within reasonable time
      expect(duration).toBeLessThan(30000); // < 30 seconds for 100 users

      // Check resource usage
      const metrics = await performanceMonitor.getMetrics();
      expect(metrics.memory_usage).toBeLessThan(512 * 1024 * 1024); // < 512MB
      expect(metrics.cpu_usage).toBeLessThan(80); // < 80%
    });

    it('should maintain performance under sustained load', async () => {
      const user = await testHelpers.createRealisticUser();

      const metrics: any[] = [];

      // Execute operations continuously for 5 minutes
      const testDuration = 5 * 60 * 1000; // 5 minutes
      const startTime = Date.now();

      while (Date.now() - startTime < testDuration) {
        const operationStart = Date.now();

        await skillExecutor.execute('daily-planning', {
          user_id: user.id,
          action: 'update'
        });

        const operationDuration = Date.now() - operationStart;
        metrics.push({
          timestamp: Date.now(),
          duration: operationDuration
        });

        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 req/sec
      }

      // Analyze performance
      const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
      const maxDuration = Math.max(...metrics.map(m => m.duration));
      const p95Duration = metrics.sort((a, b) => a.duration - b.duration)[Math.floor(metrics.length * 0.95)].duration;

      expect(avgDuration).toBeLessThan(200); // < 200ms average
      expect(p95Duration).toBeLessThan(500); // < 500ms p95
      expect(maxDuration).toBeLessThan(1000); // < 1s max

      // Check for memory leaks
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryGrowth = finalMemory - metrics[0].timestamp;
      expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // < 50MB growth
    });
  });

  describe('Concurrent Skill Execution', () => {
    it('should execute multiple skills concurrently for same user', async () => {
      const user = await testHelpers.createRealisticUser();

      const startTime = Date.now();

      // Execute multiple skills simultaneously
      const [briefing, inbox, planning, goals] = await Promise.all([
        skillExecutor.execute('whatsapp-message-management', {
          user_id: user.id,
          action: 'send_briefing'
        }),
        skillExecutor.execute('processing-inbox', {
          user_id: user.id,
          action: 'process_all'
        }),
        skillExecutor.execute('daily-planning', {
          user_id: user.id,
          action: 'update'
        }),
        skillExecutor.execute('goal-setting', {
          user_id: user.id,
          action: 'check_progress'
        })
      ]);

      const duration = Date.now() - startTime;

      // All should succeed
      expect(briefing.success).toBe(true);
      expect(inbox.success).toBe(true);
      expect(planning.success).toBe(true);
      expect(goals.success).toBe(true);

      // Should be faster than sequential
      expect(duration).toBeLessThan(3000); // < 3 seconds

      // Verify no race conditions
      const userData = await memoryService.retrieve(`user_${user.id}`, 'user_data');
      expect(userData).toBeDefined();
      expect(userData.corrupted).toBeFalsy();
    });

    it('should handle skill dependencies correctly under concurrency', async () => {
      const user = await testHelpers.createRealisticUser();

      // Skills with dependencies
      const results = await Promise.all([
        skillExecutor.execute('conducting-life-assessment', { user_id: user.id }),
        skillExecutor.execute('goal-setting', { user_id: user.id, depends_on: 'assessment' }),
        skillExecutor.execute('daily-planning', { user_id: user.id, depends_on: 'goals' })
      ]);

      // Verify execution order was respected
      const executionLog = await memoryService.retrieve('execution_log', 'system');

      const assessmentIndex = executionLog.findIndex((e: any) => e.skill === 'conducting-life-assessment');
      const goalsIndex = executionLog.findIndex((e: any) => e.skill === 'goal-setting');
      const planningIndex = executionLog.findIndex((e: any) => e.skill === 'daily-planning');

      expect(assessmentIndex).toBeLessThan(goalsIndex);
      expect(goalsIndex).toBeLessThan(planningIndex);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain data consistency under concurrent operations', async () => {
      const user = await testHelpers.createRealisticUser();

      // Initialize counter
      await memoryService.store('counter', { value: 0 }, 'test');

      // Concurrent increments
      const incrementPromises = Array(100).fill(null).map(() =>
        skillExecutor.execute('daily-planning', {
          user_id: user.id,
          action: 'increment_counter'
        })
      );

      await Promise.all(incrementPromises);

      // Verify final count
      const counter = await memoryService.retrieve('counter', 'test');
      expect(counter.value).toBe(100);
    });

    it('should prevent data corruption on concurrent writes', async () => {
      const user = await testHelpers.createRealisticUser();

      // Concurrent writes to same data
      const writePromises = Array(50).fill(null).map((_, i) =>
        memoryService.store(`user_${user.id}`, {
          operation: i,
          timestamp: Date.now()
        }, 'user_data')
      );

      await Promise.all(writePromises);

      // Verify data is valid (not corrupted)
      const userData = await memoryService.retrieve(`user_${user.id}`, 'user_data');
      expect(userData).toBeDefined();
      expect(userData.operation).toBeGreaterThanOrEqual(0);
      expect(userData.operation).toBeLessThan(50);
      expect(userData.timestamp).toBeDefined();
    });

    it('should rollback failed transactions', async () => {
      const user = await testHelpers.createRealisticUser();

      // Get initial state
      const initialState = await memoryService.retrieve(`user_${user.id}`, 'user_data');

      try {
        // Start transaction
        await memoryService.beginTransaction('test_transaction');

        // Make changes
        await memoryService.store(`user_${user.id}`, { modified: true }, 'user_data');

        // Simulate error
        throw new Error('Simulated error');
      } catch (error) {
        // Rollback
        await memoryService.rollbackTransaction('test_transaction');
      }

      // Verify rollback
      const finalState = await memoryService.retrieve(`user_${user.id}`, 'user_data');
      expect(finalState).toEqual(initialState);
    });
  });

  describe('Backup and Restore', () => {
    it('should backup all user data', async () => {
      const user = await testHelpers.createRealisticUser();

      // Add significant data
      await testHelpers.addUserData(user.id, {
        goals: 10,
        tasks: 100,
        history: 30 // days
      });

      // Create backup
      const backupResult = await memoryService.backup({
        user_id: user.id,
        include_history: true
      });

      expect(backupResult.success).toBe(true);
      expect(backupResult.backup_id).toBeDefined();
      expect(backupResult.size_bytes).toBeGreaterThan(0);

      // Verify backup contents
      const backupData = await memoryService.getBackupData(backupResult.backup_id);
      expect(backupData).toHaveProperty('goals');
      expect(backupData).toHaveProperty('tasks');
      expect(backupData).toHaveProperty('history');
    });

    it('should restore from backup', async () => {
      const user = await testHelpers.createRealisticUser();

      // Create initial state
      await testHelpers.addUserData(user.id, { goals: 5 });

      // Backup
      const backup1 = await memoryService.backup({ user_id: user.id });

      // Modify data
      await testHelpers.addUserData(user.id, { goals: 10 });

      // Restore from backup
      const restoreResult = await memoryService.restore({
        backup_id: backup1.backup_id
      });

      expect(restoreResult.success).toBe(true);

      // Verify restored state
      const userData = await memoryService.retrieve(`user_${user.id}`, 'user_data');
      expect(userData.goals.length).toBe(5);
    });

    it('should handle incremental backups', async () => {
      const user = await testHelpers.createRealisticUser();

      // Full backup
      await testHelpers.addUserData(user.id, { goals: 5 });
      const fullBackup = await memoryService.backup({
        user_id: user.id,
        type: 'full'
      });

      // Add more data
      await testHelpers.addUserData(user.id, { goals: 3 });

      // Incremental backup
      const incrementalBackup = await memoryService.backup({
        user_id: user.id,
        type: 'incremental',
        base_backup_id: fullBackup.backup_id
      });

      expect(incrementalBackup.size_bytes).toBeLessThan(fullBackup.size_bytes);

      // Restore using both
      await memoryService.restore({
        backup_id: fullBackup.backup_id,
        incremental_backup_id: incrementalBackup.backup_id
      });

      // Verify complete state
      const userData = await memoryService.retrieve(`user_${user.id}`, 'user_data');
      expect(userData.goals.length).toBe(8);
    });
  });
});
