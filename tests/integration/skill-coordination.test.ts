import { SkillExecutor } from '../../src/core/skill-executor';
import { SkillRegistry } from '../../src/core/skill-registry';
import { MemoryService } from '../../src/services/memory-service';
import { TestHelpers } from '../helpers/test-helpers';

describe('Skill Coordination Integration Tests', () => {
  let skillExecutor: SkillExecutor;
  let skillRegistry: SkillRegistry;
  let memoryService: MemoryService;
  let testHelpers: TestHelpers;

  beforeAll(async () => {
    testHelpers = new TestHelpers();
    await testHelpers.setupTestEnvironment();

    skillExecutor = new SkillExecutor();
    skillRegistry = new SkillRegistry();
    memoryService = new MemoryService();
  });

  afterAll(async () => {
    await testHelpers.cleanupTestEnvironment();
  });

  describe('Skill Chaining', () => {
    it('should chain assessment → goals → daily planning', async () => {
      // 1. Conduct life assessment
      const assessmentResult = await skillExecutor.execute('conducting-life-assessment', {
        areas: ['career', 'health', 'relationships', 'personal_growth'],
        depth: 'comprehensive'
      });

      expect(assessmentResult.success).toBe(true);
      expect(assessmentResult.data).toHaveProperty('scores');

      // Store assessment in memory
      await memoryService.store(
        'life_assessment',
        assessmentResult.data,
        'user_context'
      );

      // 2. Set goals based on assessment
      const goalsResult = await skillExecutor.execute('goal-setting', {
        source: 'assessment',
        assessment_key: 'life_assessment',
        time_horizon: 'quarterly'
      });

      expect(goalsResult.success).toBe(true);
      expect(goalsResult.data).toHaveProperty('goals');
      expect(goalsResult.data.goals.length).toBeGreaterThan(0);

      // Verify goals reference assessment
      const goals = goalsResult.data.goals;
      goals.forEach((goal: any) => {
        expect(goal).toHaveProperty('area');
        expect(goal).toHaveProperty('target_metric');
        expect(assessmentResult.data.scores[goal.area]).toBeDefined();
      });

      // 3. Create daily plan aligned with goals
      const planningResult = await skillExecutor.execute('daily-planning', {
        source: 'goals',
        goals_key: 'current_goals',
        prioritize_by: 'goal_alignment'
      });

      expect(planningResult.success).toBe(true);
      expect(planningResult.data).toHaveProperty('tasks');

      // Verify tasks align with goals
      const goalIds = goals.map((g: any) => g.id);
      planningResult.data.tasks.forEach((task: any) => {
        expect(task).toHaveProperty('goal_id');
        expect(goalIds).toContain(task.goal_id);
      });

      // 4. Verify complete chain in memory
      const chainMemory = await memoryService.retrieve('skill_chain', 'coordination');
      expect(chainMemory).toMatchObject({
        chain: ['conducting-life-assessment', 'goal-setting', 'daily-planning'],
        completed: true,
        results_stored: true
      });
    });

    it('should chain inbox → daily planning → weekly review', async () => {
      // 1. Process inbox
      await testHelpers.addTestInboxMessages([
        { subject: 'Project deadline', priority: 'high' },
        { subject: 'Team meeting', priority: 'medium' }
      ]);

      const inboxResult = await skillExecutor.execute('processing-inbox', {
        action: 'process_all'
      });

      expect(inboxResult.success).toBe(true);

      // 2. Integrate into daily plan
      const planningResult = await skillExecutor.execute('daily-planning', {
        source: 'inbox',
        inbox_key: 'processed_inbox'
      });

      expect(planningResult.success).toBe(true);

      // 3. Track for weekly review
      await testHelpers.simulateDaysCompleted(7);

      const reviewResult = await skillExecutor.execute('weekly-review', {
        include_inbox_metrics: true
      });

      expect(reviewResult.success).toBe(true);
      expect(reviewResult.data).toHaveProperty('inbox_processed_this_week');
      expect(reviewResult.data.inbox_processed_this_week).toBeGreaterThan(0);
    });
  });

  describe('Data Flow Between Skills', () => {
    it('should pass data correctly through skill pipeline', async () => {
      // Create data in first skill
      const skill1Result = await skillExecutor.execute('goal-setting', {
        action: 'create_goal',
        goal: {
          name: 'Learn TypeScript',
          category: 'learning',
          target: 100,
          unit: 'hours'
        }
      });

      expect(skill1Result.success).toBe(true);
      const goalId = skill1Result.data.goal_id;

      // Pass to second skill via memory
      await memoryService.store('active_goal', { goal_id: goalId }, 'user_context');

      const skill2Result = await skillExecutor.execute('daily-planning', {
        action: 'create_goal_tasks',
        goal_key: 'active_goal'
      });

      expect(skill2Result.success).toBe(true);
      expect(skill2Result.data.tasks[0].goal_id).toBe(goalId);

      // Pass to third skill
      const skill3Result = await skillExecutor.execute('weekly-review', {
        action: 'review_goal_progress',
        goal_id: goalId
      });

      expect(skill3Result.success).toBe(true);
      expect(skill3Result.data).toHaveProperty('progress_percentage');
      expect(skill3Result.data.goal_id).toBe(goalId);
    });

    it('should maintain data consistency across skills', async () => {
      const testData = {
        user_id: 'test-user',
        timestamp: new Date().toISOString(),
        value: 42
      };

      // Write from skill 1
      await skillExecutor.execute('whatsapp-message-management', {
        action: 'store_context',
        key: 'test_data',
        data: testData
      });

      // Read from skill 2
      const skill2Result = await skillExecutor.execute('daily-planning', {
        action: 'retrieve_context',
        key: 'test_data'
      });

      expect(skill2Result.data).toEqual(testData);

      // Modify from skill 3
      testData.value = 84;
      await skillExecutor.execute('goal-setting', {
        action: 'update_context',
        key: 'test_data',
        data: testData
      });

      // Verify from skill 4
      const skill4Result = await skillExecutor.execute('weekly-review', {
        action: 'retrieve_context',
        key: 'test_data'
      });

      expect(skill4Result.data.value).toBe(84);
    });
  });

  describe('Memory Persistence Across Skills', () => {
    it('should persist memory with proper namespacing', async () => {
      // Write from different skills to same namespace
      await skillExecutor.execute('goal-setting', {
        action: 'store',
        namespace: 'user_goals',
        key: 'career_goal',
        value: { target: 'Senior Dev' }
      });

      await skillExecutor.execute('daily-planning', {
        action: 'store',
        namespace: 'user_goals',
        key: 'daily_goal',
        value: { target: 'Complete feature' }
      });

      // Retrieve all from namespace
      const allGoals = await memoryService.listByNamespace('user_goals');

      expect(allGoals).toHaveLength(2);
      expect(allGoals.map((g: any) => g.key)).toContain('career_goal');
      expect(allGoals.map((g: any) => g.key)).toContain('daily_goal');
    });

    it('should handle memory TTL correctly', async () => {
      // Store with short TTL
      await skillExecutor.execute('whatsapp-message-management', {
        action: 'store',
        key: 'temporary_data',
        value: { temp: true },
        ttl: 1 // 1 second
      });

      // Verify it exists
      const immediate = await memoryService.retrieve('temporary_data', 'user_context');
      expect(immediate).toBeDefined();

      // Wait for expiry
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verify it's gone
      const expired = await memoryService.retrieve('temporary_data', 'user_context');
      expect(expired).toBeNull();
    });
  });

  describe('Skill Discovery and Suggestions', () => {
    it('should suggest relevant skills based on context', async () => {
      // Execute a skill
      await skillExecutor.execute('goal-setting', {
        action: 'create_goal',
        goal: { name: 'Fitness goal', category: 'health' }
      });

      // Get suggestions
      const suggestions = await skillRegistry.suggestSkills({
        current_skill: 'goal-setting',
        context: { category: 'health' }
      });

      expect(suggestions).toBeDefined();
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions).toContain('daily-planning'); // For breaking down goal
      expect(suggestions).toContain('weekly-review'); // For tracking progress
    });

    it('should handle skill dependencies', async () => {
      // Check dependencies for a skill
      const dependencies = await skillRegistry.getDependencies('weekly-review');

      expect(dependencies).toContain('daily-planning');
      expect(dependencies).toContain('goal-setting');

      // Verify all dependencies are available
      for (const dep of dependencies) {
        const skill = await skillRegistry.getSkill(dep);
        expect(skill).toBeDefined();
        expect(skill.health_status).not.toBe('unhealthy');
      }
    });

    it('should suggest skill chains for complex goals', async () => {
      const chains = await skillRegistry.suggestChain({
        goal: 'Improve productivity',
        starting_point: 'assessment'
      });

      expect(chains).toBeDefined();
      expect(chains.length).toBeGreaterThan(0);

      // Example expected chain
      const expectedChain = [
        'conducting-life-assessment',
        'goal-setting',
        'daily-planning',
        'weekly-review'
      ];

      expect(chains[0].skills).toEqual(expectedChain);
    });
  });

  describe('Error Propagation Across Skills', () => {
    it('should handle errors gracefully in skill chains', async () => {
      // Cause an error in first skill
      const skill1Result = await skillExecutor.execute('goal-setting', {
        action: 'create_goal',
        goal: null // Invalid input
      });

      expect(skill1Result.success).toBe(false);
      expect(skill1Result.error).toBeDefined();

      // Second skill should handle missing data
      const skill2Result = await skillExecutor.execute('daily-planning', {
        source: 'goals',
        goals_key: 'nonexistent_key',
        fallback: 'use_defaults'
      });

      expect(skill2Result.success).toBe(true); // Should succeed with fallback
      expect(skill2Result.data.used_fallback).toBe(true);
    });

    it('should rollback on critical errors', async () => {
      // Start transaction-like operation
      await skillExecutor.beginTransaction('test_transaction');

      try {
        // Execute multiple skills
        await skillExecutor.execute('goal-setting', {
          transaction: 'test_transaction',
          action: 'create'
        });

        await skillExecutor.execute('daily-planning', {
          transaction: 'test_transaction',
          action: 'create'
        });

        // Simulate error
        throw new Error('Simulated error');
      } catch (error) {
        // Rollback
        await skillExecutor.rollbackTransaction('test_transaction');
      }

      // Verify rollback
      const memory = await memoryService.retrieve('test_transaction', 'transactions');
      expect(memory).toBeNull();
    });
  });
});
