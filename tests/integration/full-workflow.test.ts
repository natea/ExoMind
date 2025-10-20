import { SkillExecutor } from '../../src/core/skill-executor';
import { MemoryService } from '../../src/services/memory-service';
import { WhatsAppService } from '../../src/services/whatsapp-service';
import { TestHelpers } from '../helpers/test-helpers';

describe('Full Workflow Integration Tests', () => {
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

  describe('Full Morning Routine', () => {
    it('should complete briefing → planning → task scheduling workflow', async () => {
      // 1. Send morning briefing request
      const briefingResult = await skillExecutor.execute('whatsapp-message-management', {
        action: 'send_briefing',
        timing: 'morning',
        include_weather: true,
        include_calendar: true,
        include_priorities: true
      });

      expect(briefingResult.success).toBe(true);
      expect(briefingResult.data).toHaveProperty('briefing_sent');

      // 2. Verify briefing was stored in memory
      const briefingMemory = await memoryService.retrieve('last_briefing', 'user_context');
      expect(briefingMemory).toBeDefined();
      expect(briefingMemory.timing).toBe('morning');

      // 3. Execute daily planning based on briefing
      const planningResult = await skillExecutor.execute('daily-planning', {
        source: 'briefing',
        focus_areas: briefingResult.data.priorities
      });

      expect(planningResult.success).toBe(true);
      expect(planningResult.data).toHaveProperty('tasks_created');
      expect(planningResult.data.tasks_created.length).toBeGreaterThan(0);

      // 4. Schedule tasks in calendar
      for (const task of planningResult.data.tasks_created) {
        const scheduleResult = await skillExecutor.execute('daily-planning', {
          action: 'schedule_task',
          task_id: task.id,
          preferred_time: task.suggested_time
        });

        expect(scheduleResult.success).toBe(true);
      }

      // 5. Verify end-to-end state
      const dailyPlan = await memoryService.retrieve('daily_plan', 'user_context');
      expect(dailyPlan).toBeDefined();
      expect(dailyPlan.tasks.length).toBe(planningResult.data.tasks_created.length);
      expect(dailyPlan.status).toBe('scheduled');
    });

    it('should handle morning routine with inbox processing', async () => {
      // Add test messages to inbox
      await testHelpers.addTestInboxMessages([
        { from: 'work@example.com', subject: 'Project update', priority: 'high' },
        { from: 'friend@example.com', subject: 'Weekend plans', priority: 'low' }
      ]);

      // 1. Process inbox
      const inboxResult = await skillExecutor.execute('processing-inbox', {
        mode: 'morning_triage',
        auto_categorize: true
      });

      expect(inboxResult.success).toBe(true);
      expect(inboxResult.data.processed_count).toBe(2);
      expect(inboxResult.data.tasks_created.length).toBeGreaterThan(0);

      // 2. Integrate inbox tasks into daily plan
      const planningResult = await skillExecutor.execute('daily-planning', {
        source: 'inbox',
        include_new_tasks: true
      });

      expect(planningResult.success).toBe(true);

      // 3. Verify tasks from inbox are in daily plan
      const dailyPlan = await memoryService.retrieve('daily_plan', 'user_context');
      const inboxTaskIds = inboxResult.data.tasks_created.map((t: any) => t.id);
      const planTaskIds = dailyPlan.tasks.map((t: any) => t.id);

      expect(inboxTaskIds.every((id: string) => planTaskIds.includes(id))).toBe(true);
    });
  });

  describe('Full Evening Routine', () => {
    it('should complete reflection → logging → tomorrow preview workflow', async () => {
      // Setup: Simulate completed day
      await testHelpers.setupCompletedDay({
        tasks_completed: 5,
        tasks_total: 7,
        focus_areas: ['work', 'health']
      });

      // 1. Daily reflection
      const reflectionResult = await skillExecutor.execute('daily-planning', {
        action: 'reflection',
        include_wins: true,
        include_learnings: true,
        include_improvements: true
      });

      expect(reflectionResult.success).toBe(true);
      expect(reflectionResult.data).toHaveProperty('wins');
      expect(reflectionResult.data).toHaveProperty('learnings');
      expect(reflectionResult.data).toHaveProperty('improvements');

      // 2. Log day's activities
      const loggingResult = await skillExecutor.execute('whatsapp-message-management', {
        action: 'log_day',
        reflection: reflectionResult.data,
        completion_rate: 5/7
      });

      expect(loggingResult.success).toBe(true);

      // 3. Generate tomorrow preview
      const previewResult = await skillExecutor.execute('daily-planning', {
        action: 'preview_tomorrow',
        carry_over_incomplete: true,
        check_calendar: true
      });

      expect(previewResult.success).toBe(true);
      expect(previewResult.data).toHaveProperty('preview_tasks');
      expect(previewResult.data.preview_tasks.length).toBeGreaterThan(0);

      // 4. Send evening briefing
      const briefingResult = await skillExecutor.execute('whatsapp-message-management', {
        action: 'send_briefing',
        timing: 'evening',
        include_tomorrow: true,
        preview: previewResult.data
      });

      expect(briefingResult.success).toBe(true);

      // 5. Verify evening routine completion
      const routineMemory = await memoryService.retrieve('evening_routine', 'user_context');
      expect(routineMemory).toBeDefined();
      expect(routineMemory.completed_at).toBeDefined();
      expect(routineMemory.tomorrow_prepared).toBe(true);
    });
  });

  describe('Full Weekly Review Workflow', () => {
    it('should complete comprehensive weekly review', async () => {
      // Setup: Simulate completed week
      await testHelpers.setupCompletedWeek({
        days_logged: 7,
        goals_progress: { work: 80, health: 60, personal: 70 },
        total_tasks: 35,
        completed_tasks: 28
      });

      // 1. Gather weekly data
      const dataResult = await skillExecutor.execute('weekly-review', {
        action: 'gather_data',
        week_offset: 0
      });

      expect(dataResult.success).toBe(true);
      expect(dataResult.data).toHaveProperty('task_summary');
      expect(dataResult.data).toHaveProperty('goal_progress');

      // 2. Analyze week
      const analysisResult = await skillExecutor.execute('weekly-review', {
        action: 'analyze',
        data: dataResult.data
      });

      expect(analysisResult.success).toBe(true);
      expect(analysisResult.data).toHaveProperty('wins');
      expect(analysisResult.data).toHaveProperty('challenges');
      expect(analysisResult.data).toHaveProperty('insights');

      // 3. Plan next week
      const planningResult = await skillExecutor.execute('weekly-review', {
        action: 'plan_next_week',
        insights: analysisResult.data.insights,
        adjust_goals: true
      });

      expect(planningResult.success).toBe(true);
      expect(planningResult.data).toHaveProperty('next_week_plan');
      expect(planningResult.data.next_week_plan.focus_areas).toBeDefined();

      // 4. Generate review report
      const reportResult = await skillExecutor.execute('weekly-review', {
        action: 'generate_report',
        analysis: analysisResult.data,
        plan: planningResult.data
      });

      expect(reportResult.success).toBe(true);

      // 5. Send review via WhatsApp
      const sendResult = await skillExecutor.execute('whatsapp-message-management', {
        action: 'send_weekly_review',
        report: reportResult.data
      });

      expect(sendResult.success).toBe(true);

      // 6. Verify review completion
      const reviewMemory = await memoryService.retrieve('weekly_review', 'user_context');
      expect(reviewMemory).toBeDefined();
      expect(reviewMemory.week_number).toBeDefined();
      expect(reviewMemory.completed).toBe(true);
    });
  });

  describe('Full Monthly Review Workflow', () => {
    it('should complete comprehensive monthly review', async () => {
      // Setup: Simulate completed month
      await testHelpers.setupCompletedMonth({
        weeks_reviewed: 4,
        monthly_goals: [
          { id: 'g1', name: 'Health', progress: 85 },
          { id: 'g2', name: 'Career', progress: 70 },
          { id: 'g3', name: 'Learning', progress: 60 }
        ],
        major_achievements: 3
      });

      // 1. Aggregate monthly data
      const dataResult = await skillExecutor.execute('conducting-life-assessment', {
        action: 'aggregate_monthly',
        month_offset: 0
      });

      expect(dataResult.success).toBe(true);
      expect(dataResult.data).toHaveProperty('weekly_summaries');
      expect(dataResult.data.weekly_summaries.length).toBe(4);

      // 2. Assess goal progress
      const assessmentResult = await skillExecutor.execute('conducting-life-assessment', {
        action: 'assess_goals',
        data: dataResult.data
      });

      expect(assessmentResult.success).toBe(true);
      expect(assessmentResult.data).toHaveProperty('goal_scores');
      expect(assessmentResult.data).toHaveProperty('recommendations');

      // 3. Strategic planning
      const planningResult = await skillExecutor.execute('goal-setting', {
        action: 'monthly_planning',
        assessment: assessmentResult.data,
        adjust_strategy: true
      });

      expect(planningResult.success).toBe(true);
      expect(planningResult.data).toHaveProperty('next_month_goals');

      // 4. Generate comprehensive report
      const reportResult = await skillExecutor.execute('conducting-life-assessment', {
        action: 'generate_monthly_report',
        assessment: assessmentResult.data,
        plan: planningResult.data
      });

      expect(reportResult.success).toBe(true);

      // 5. Archive and store
      const archiveResult = await memoryService.store(
        'monthly_review',
        reportResult.data,
        'user_context'
      );

      expect(archiveResult).toBe(true);
    });
  });

  describe('Inbox Processing End-to-End', () => {
    it('should process inbox with full GTD workflow', async () => {
      // Add various inbox items
      await testHelpers.addTestInboxMessages([
        { type: 'email', subject: 'Meeting request', actionable: true },
        { type: 'whatsapp', subject: 'Quick question', actionable: true },
        { type: 'email', subject: 'Newsletter', actionable: false },
        { type: 'whatsapp', subject: 'FYI update', actionable: false }
      ]);

      // 1. Capture all items
      const captureResult = await skillExecutor.execute('processing-inbox', {
        action: 'capture',
        sources: ['email', 'whatsapp']
      });

      expect(captureResult.success).toBe(true);
      expect(captureResult.data.captured_count).toBe(4);

      // 2. Clarify and organize
      const clarifyResult = await skillExecutor.execute('processing-inbox', {
        action: 'clarify',
        items: captureResult.data.items
      });

      expect(clarifyResult.success).toBe(true);
      expect(clarifyResult.data).toHaveProperty('actionable');
      expect(clarifyResult.data).toHaveProperty('reference');
      expect(clarifyResult.data.actionable.length).toBe(2);
      expect(clarifyResult.data.reference.length).toBe(2);

      // 3. Organize actionable items
      const organizeResult = await skillExecutor.execute('processing-inbox', {
        action: 'organize',
        items: clarifyResult.data.actionable
      });

      expect(organizeResult.success).toBe(true);
      expect(organizeResult.data).toHaveProperty('tasks');
      expect(organizeResult.data).toHaveProperty('projects');
      expect(organizeResult.data).toHaveProperty('calendar_items');

      // 4. Reflect on processing
      const reflectResult = await skillExecutor.execute('processing-inbox', {
        action: 'reflect',
        processed: organizeResult.data
      });

      expect(reflectResult.success).toBe(true);
      expect(reflectResult.data).toHaveProperty('inbox_zero');
      expect(reflectResult.data.inbox_zero).toBe(true);

      // 5. Verify inbox state
      const inboxState = await memoryService.retrieve('inbox_state', 'user_context');
      expect(inboxState.items_remaining).toBe(0);
      expect(inboxState.last_processed).toBeDefined();
    });
  });
});
