import { SkillExecutor } from '../../src/core/skill-executor';
import { MemoryService } from '../../src/services/memory-service';
import { WhatsAppService } from '../../src/services/whatsapp-service';
import { TestHelpers } from '../helpers/test-helpers';

describe('User Journey E2E Tests', () => {
  let skillExecutor: SkillExecutor;
  let memoryService: MemoryService;
  let whatsappService: WhatsAppService;
  let testHelpers: TestHelpers;

  beforeAll(async () => {
    testHelpers = new TestHelpers();
    await testHelpers.setupTestEnvironment();

    skillExecutor = new SkillExecutor();
    memoryService = new MemoryService();
    whatsappService = new WhatsAppService();
  });

  afterAll(async () => {
    await testHelpers.cleanupTestEnvironment();
  });

  describe('New User Onboarding Journey', () => {
    it('should complete full onboarding process', async () => {
      // 1. User signs up
      const user = await testHelpers.createUser({
        name: 'Alex Johnson',
        email: 'alex@example.com',
        phone: '+1234567890',
        timezone: 'America/New_York'
      });

      expect(user.id).toBeDefined();

      // 2. Send welcome message via WhatsApp
      const welcomeResult = await whatsappService.sendMessage(
        user.phone,
        'Welcome to Life OS! Let\'s get you set up.'
      );

      expect(welcomeResult.success).toBe(true);

      // 3. Initial life assessment
      const assessmentResult = await skillExecutor.execute('conducting-life-assessment', {
        user_id: user.id,
        first_time: true,
        guided: true
      });

      expect(assessmentResult.success).toBe(true);
      expect(assessmentResult.data).toHaveProperty('areas_assessed');
      expect(assessmentResult.data.areas_assessed).toContain('career');
      expect(assessmentResult.data.areas_assessed).toContain('health');
      expect(assessmentResult.data.areas_assessed).toContain('relationships');

      // 4. Set initial goals based on assessment
      const goalsResult = await skillExecutor.execute('goal-setting', {
        user_id: user.id,
        source: 'assessment',
        guided: true,
        recommended_count: 3
      });

      expect(goalsResult.success).toBe(true);
      expect(goalsResult.data.goals.length).toBe(3);

      goalsResult.data.goals.forEach((goal: any) => {
        expect(goal).toHaveProperty('name');
        expect(goal).toHaveProperty('category');
        expect(goal).toHaveProperty('target');
        expect(goal).toHaveProperty('timeline');
      });

      // 5. Create first daily plan
      const planningResult = await skillExecutor.execute('daily-planning', {
        user_id: user.id,
        first_time: true,
        tutorial: true
      });

      expect(planningResult.success).toBe(true);
      expect(planningResult.data).toHaveProperty('tutorial_completed');
      expect(planningResult.data.tasks.length).toBeGreaterThan(0);
      expect(planningResult.data.tasks.length).toBeLessThanOrEqual(5); // Start easy

      // 6. Send onboarding completion message
      const completionResult = await whatsappService.sendMessage(
        user.phone,
        '🎉 Onboarding complete! You\'re all set to start your Life OS journey.'
      );

      expect(completionResult.success).toBe(true);

      // 7. Verify onboarding state
      const onboardingState = await memoryService.retrieve(
        `onboarding_${user.id}`,
        'user_data'
      );

      expect(onboardingState).toMatchObject({
        completed: true,
        assessment_done: true,
        goals_set: true,
        first_plan_created: true,
        welcome_sent: true
      });
    });

    it('should handle interrupted onboarding', async () => {
      // 1. Start onboarding
      const user = await testHelpers.createUser({
        name: 'Jordan Smith'
      });

      // 2. Begin assessment but don't complete
      await skillExecutor.execute('conducting-life-assessment', {
        user_id: user.id,
        first_time: true,
        progress: 0.5 // 50% complete
      });

      // 3. User returns later
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. Check onboarding status
      const resumeResult = await skillExecutor.execute('using-life-os', {
        user_id: user.id,
        action: 'check_onboarding'
      });

      expect(resumeResult.data.onboarding_incomplete).toBe(true);
      expect(resumeResult.data.next_step).toBe('complete_assessment');

      // 5. Resume from where they left off
      const continueResult = await skillExecutor.execute('conducting-life-assessment', {
        user_id: user.id,
        resume: true
      });

      expect(continueResult.success).toBe(true);
      expect(continueResult.data.resumed_from_progress).toBe(0.5);
    });
  });

  describe('Daily User Workflow', () => {
    it('should complete typical daily routine', async () => {
      const user = await testHelpers.createRealisticUser({
        name: 'Casey Brown',
        onboarded: true
      });

      // === MORNING ===

      // 1. User wakes up, receives morning briefing
      const morningBriefing = await skillExecutor.execute('whatsapp-message-management', {
        user_id: user.id,
        action: 'send_briefing',
        timing: 'morning',
        time: '07:00'
      });

      expect(morningBriefing.success).toBe(true);
      expect(morningBriefing.data.briefing).toContain('Good morning');

      // 2. User checks inbox
      await testHelpers.addInboxItems(user.id, 10);

      const inboxResult = await skillExecutor.execute('processing-inbox', {
        user_id: user.id,
        mode: 'quick_triage'
      });

      expect(inboxResult.success).toBe(true);
      expect(inboxResult.data.tasks_created).toBeGreaterThan(0);

      // 3. User plans their day
      const planningResult = await skillExecutor.execute('daily-planning', {
        user_id: user.id,
        include_inbox: true,
        time_available: 8 // 8 hours
      });

      expect(planningResult.success).toBe(true);
      expect(planningResult.data.tasks.length).toBeLessThanOrEqual(8);

      // === DURING DAY ===

      // 4. User completes tasks throughout day
      const completedTasks = [];
      for (let i = 0; i < 5; i++) {
        const taskResult = await skillExecutor.execute('daily-planning', {
          user_id: user.id,
          action: 'complete_task',
          task_id: planningResult.data.tasks[i].id
        });

        expect(taskResult.success).toBe(true);
        completedTasks.push(taskResult.data.task_id);
      }

      // 5. User adds new task mid-day
      const newTaskResult = await skillExecutor.execute('daily-planning', {
        user_id: user.id,
        action: 'add_task',
        task: {
          name: 'Urgent: Fix production bug',
          priority: 'high',
          duration: 60
        }
      });

      expect(newTaskResult.success).toBe(true);

      // 6. User checks progress
      const progressResult = await skillExecutor.execute('daily-planning', {
        user_id: user.id,
        action: 'check_progress'
      });

      expect(progressResult.data.completed_count).toBe(5);
      expect(progressResult.data.completion_rate).toBeCloseTo(5/6, 1);

      // === EVENING ===

      // 7. User does evening reflection
      const reflectionResult = await skillExecutor.execute('daily-planning', {
        user_id: user.id,
        action: 'reflection',
        wins: ['Completed major project', 'Good workout'],
        challenges: ['Too many meetings'],
        learnings: ['Need to block focus time']
      });

      expect(reflectionResult.success).toBe(true);

      // 8. User receives evening briefing
      const eveningBriefing = await skillExecutor.execute('whatsapp-message-management', {
        user_id: user.id,
        action: 'send_briefing',
        timing: 'evening',
        time: '19:00'
      });

      expect(eveningBriefing.success).toBe(true);
      expect(eveningBriefing.data.briefing).toContain('completed');

      // 9. Verify day was logged
      const dayLog = await memoryService.retrieve(`day_${user.id}`, 'user_data');
      expect(dayLog).toMatchObject({
        date: expect.any(String),
        tasks_total: 6,
        tasks_completed: 5,
        morning_briefing: true,
        evening_briefing: true,
        reflection_completed: true
      });
    });
  });

  describe('Weekly Power User Workflow', () => {
    it('should complete power user weekly routine', async () => {
      const user = await testHelpers.createRealisticUser({
        name: 'Morgan Lee',
        user_type: 'power_user',
        goals: 15,
        projects: 5
      });

      // Simulate successful week
      for (let day = 0; day < 7; day++) {
        await testHelpers.simulateDay(user.id, {
          date: testHelpers.getDateDaysAgo(7 - day),
          tasks_completed: 10,
          inbox_processed: 20,
          focus_sessions: 3,
          meetings: 4
        });
      }

      // 1. Start weekly review
      const reviewStart = await skillExecutor.execute('weekly-review', {
        user_id: user.id,
        action: 'start'
      });

      expect(reviewStart.success).toBe(true);

      // 2. Review past week
      const pastWeekReview = await skillExecutor.execute('weekly-review', {
        user_id: user.id,
        action: 'review_past_week'
      });

      expect(pastWeekReview.data).toMatchObject({
        days_logged: 7,
        total_tasks_completed: 70,
        total_inbox_processed: 140,
        total_focus_sessions: 21
      });

      // 3. Analyze goal progress
      const goalAnalysis = await skillExecutor.execute('weekly-review', {
        user_id: user.id,
        action: 'analyze_goals'
      });

      expect(goalAnalysis.data.goals_on_track.length).toBeGreaterThan(0);
      expect(goalAnalysis.data).toHaveProperty('progress_by_category');

      // 4. Identify wins and challenges
      const insights = await skillExecutor.execute('weekly-review', {
        user_id: user.id,
        action: 'generate_insights'
      });

      expect(insights.data).toHaveProperty('top_wins');
      expect(insights.data).toHaveProperty('main_challenges');
      expect(insights.data).toHaveProperty('improvement_areas');

      // 5. Plan next week
      const nextWeekPlan = await skillExecutor.execute('weekly-review', {
        user_id: user.id,
        action: 'plan_next_week',
        focus_areas: insights.data.improvement_areas
      });

      expect(nextWeekPlan.data).toHaveProperty('weekly_goals');
      expect(nextWeekPlan.data).toHaveProperty('daily_themes');
      expect(nextWeekPlan.data.daily_themes.length).toBe(7);

      // 6. Adjust goals if needed
      const goalAdjustment = await skillExecutor.execute('goal-setting', {
        user_id: user.id,
        action: 'adjust_based_on_review',
        review_data: insights.data
      });

      expect(goalAdjustment.success).toBe(true);

      // 7. Send weekly summary
      const summaryResult = await skillExecutor.execute('whatsapp-message-management', {
        user_id: user.id,
        action: 'send_weekly_summary',
        review: pastWeekReview.data,
        plan: nextWeekPlan.data
      });

      expect(summaryResult.success).toBe(true);

      // 8. Verify review completion
      const reviewState = await memoryService.retrieve(
        `weekly_review_${user.id}`,
        'user_data'
      );

      expect(reviewState).toMatchObject({
        week_number: expect.any(Number),
        completed: true,
        insights_generated: true,
        next_week_planned: true
      });
    });
  });

  describe('Goal Setting and Tracking Journey', () => {
    it('should complete full goal lifecycle', async () => {
      const user = await testHelpers.createRealisticUser({
        name: 'Riley Taylor'
      });

      // 1. User sets a new goal
      const goalResult = await skillExecutor.execute('goal-setting', {
        user_id: user.id,
        action: 'create_goal',
        goal: {
          name: 'Get promoted to Senior Engineer',
          category: 'career',
          timeline: '6 months',
          metrics: [
            { name: 'Technical projects led', target: 3 },
            { name: 'Team members mentored', target: 2 },
            { name: 'Certifications earned', target: 1 }
          ]
        }
      });

      expect(goalResult.success).toBe(true);
      const goalId = goalResult.data.goal_id;

      // 2. Break down into milestones
      const milestonesResult = await skillExecutor.execute('goal-setting', {
        user_id: user.id,
        action: 'create_milestones',
        goal_id: goalId,
        count: 6 // Monthly milestones
      });

      expect(milestonesResult.data.milestones.length).toBe(6);

      // 3. Create action plan
      const actionPlanResult = await skillExecutor.execute('goal-setting', {
        user_id: user.id,
        action: 'create_action_plan',
        goal_id: goalId
      });

      expect(actionPlanResult.data).toHaveProperty('actions');
      expect(actionPlanResult.data.actions.length).toBeGreaterThan(0);

      // 4. Simulate progress over weeks
      for (let week = 0; week < 12; week++) {
        // Complete some actions
        await skillExecutor.execute('goal-setting', {
          user_id: user.id,
          action: 'update_progress',
          goal_id: goalId,
          progress: {
            'Technical projects led': week < 4 ? 1 : week < 8 ? 2 : 3,
            'Team members mentored': week < 6 ? 0 : week < 10 ? 1 : 2,
            'Certifications earned': week < 11 ? 0 : 1
          }
        });

        // Weekly check-in
        const checkIn = await skillExecutor.execute('goal-setting', {
          user_id: user.id,
          action: 'weekly_check_in',
          goal_id: goalId
        });

        expect(checkIn.success).toBe(true);
      }

      // 5. Mid-point review (3 months)
      await testHelpers.setDate('3 months from start');

      const midReview = await skillExecutor.execute('goal-setting', {
        user_id: user.id,
        action: 'milestone_review',
        goal_id: goalId,
        milestone_index: 2
      });

      expect(midReview.data).toHaveProperty('on_track');
      expect(midReview.data.progress_percentage).toBeGreaterThan(40);

      // 6. Adjust strategy if needed
      if (!midReview.data.on_track) {
        await skillExecutor.execute('goal-setting', {
          user_id: user.id,
          action: 'adjust_strategy',
          goal_id: goalId,
          adjustments: midReview.data.recommendations
        });
      }

      // 7. Final completion (6 months)
      await testHelpers.setDate('6 months from start');

      const completionResult = await skillExecutor.execute('goal-setting', {
        user_id: user.id,
        action: 'complete_goal',
        goal_id: goalId
      });

      expect(completionResult.success).toBe(true);
      expect(completionResult.data.all_metrics_achieved).toBe(true);

      // 8. Reflect on achievement
      const reflectionResult = await skillExecutor.execute('goal-setting', {
        user_id: user.id,
        action: 'reflect_on_goal',
        goal_id: goalId,
        reflection: {
          what_worked: ['Consistent weekly check-ins', 'Breaking into milestones'],
          what_didnt: ['Initial timeline was too aggressive'],
          learnings: ['Need buffer time for unexpected issues'],
          next_steps: ['Set next career goal', 'Continue mentoring']
        }
      });

      expect(reflectionResult.success).toBe(true);

      // 9. Verify goal lifecycle
      const goalHistory = await memoryService.retrieve(
        `goal_${goalId}`,
        'user_data'
      );

      expect(goalHistory).toMatchObject({
        status: 'completed',
        timeline: '6 months',
        milestones_completed: 6,
        metrics_achieved: 3,
        reflection_completed: true
      });
    });
  });
});
