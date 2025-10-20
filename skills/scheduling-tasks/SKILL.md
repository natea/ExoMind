# Scheduling Tasks

## Overview

This skill bridges the gap between task management and calendar management. It transforms abstract tasks and to-do items into concrete time blocks on your calendar, ensuring that important work actually gets done rather than perpetually remaining on a list. This is the critical link between planning and execution.

## Purpose

- **Convert Intentions to Actions**: Move tasks from lists into actual scheduled time
- **Realistic Planning**: Ensure tasks fit into available time
- **Priority Execution**: Schedule most important tasks first
- **Deep Work Protection**: Block focused time for complex tasks
- **Energy Optimization**: Match tasks to appropriate energy levels
- **Prevent Overcommitment**: Visualize true workload capacity
- **Increase Follow-Through**: Scheduled tasks are 3x more likely to be completed

## Prerequisites

- Google Calendar connected via MCP
- Google Tasks or task list connected via MCP
- Completed "Analyzing Schedule" skill (understand available time)
- Clear priorities and goals

## Core Principles

### 1. Task Types Require Different Scheduling

**Deep Work Tasks** (2-4 hours):
- Complex problem-solving
- Creative work
- Strategic thinking
- Learning new skills
→ Need: Uninterrupted morning blocks, high energy

**Shallow Work Tasks** (30-60 min):
- Email processing
- Admin tasks
- Quick updates
- Routine work
→ Can do: Between meetings, afternoon, lower energy

**Quick Tasks** (< 15 min):
- Quick replies
- Simple updates
- Status checks
→ Can do: Anytime, batch together

**Meeting Prep** (15-30 min before):
- Review agenda
- Prepare materials
- Gather context
→ Must schedule: Before meeting, never skip

### 2. Time Blocking Fundamentals

**Rules**:
1. Deep work needs 90-180 minute blocks minimum
2. Include buffer time between different activities
3. Schedule tasks during appropriate energy levels
4. Always include prep time for meetings
5. Leave 25% of time unscheduled for unexpected items
6. Batch similar tasks together

### 3. Scheduling Priority Order

1. **Fixed Commitments**: Meetings, appointments (already scheduled)
2. **Deep Work**: Most important creative/strategic tasks
3. **Meeting Prep**: Before each meeting
4. **Shallow Work**: Admin, email, routine tasks
5. **Buffer Time**: Transitions, breaks, unexpected
6. **Learning/Development**: If time allows

## Step-by-Step Workflow

### Phase 1: Preparation (5-10 minutes)

#### 1. Gather Your Tasks

Collect all tasks needing scheduling:

```
Ask: "Show me all my tasks for the next week"

MCP Tool: mcp__google-workspace__list_tasks
Parameters:
  task_list_id: "default-list-id"
  show_completed: false
  due_max: "[end of next week]"
  user_google_email: "your-email@gmail.com"
```

Review and capture from multiple sources:
- Task management system
- Email inbox (convert emails to tasks first)
- Notes and ideas
- Project plans
- Commitments from meetings

#### 2. Review Available Time

Check calendar capacity:

```
Ask: "Show me my calendar for next week with time availability analysis"

MCP Tool: mcp__google-workspace__get_events
Parameters:
  calendar_id: "primary"
  time_min: "[next Monday 00:00]"
  time_max: "[next Sunday 23:59]"
  detailed: true
  user_google_email: "your-email@gmail.com"

Then analyze:
"Identify all available time blocks longer than 90 minutes"
```

Calculate available hours:
```
Total work hours: 40 hours/week
- Existing meetings: [X hours]
- Email/admin: 5 hours
- Buffer time: 3 hours
= Available for task work: [Y hours]
```

#### 3. Categorize Tasks

For each task, determine:

**Time Required**:
- Quick: < 15 minutes
- Short: 15-30 minutes
- Medium: 30-90 minutes
- Long: 90-180 minutes
- Project: 180+ minutes (break into subtasks)

**Energy Required**:
- High: Creative, complex, strategic
- Medium: Standard work, routine projects
- Low: Admin, review, organization

**Priority Level**:
- Critical: Must do this week
- High: Should do this week
- Medium: Would like to do this week
- Low: Nice to do if time allows

**Deadline**:
- Fixed: Specific date/time
- Flexible: This week/month
- Someday: No deadline

```
Ask: "Help me categorize my tasks by:
1. Time required (quick/short/medium/long)
2. Energy needed (high/medium/low)
3. Priority (critical/high/medium/low)
4. Deadline (fixed/flexible/someday)"
```

### Phase 2: Strategic Scheduling (15-20 minutes)

Schedule tasks in priority order, matching to appropriate time slots.

#### Step 1: Schedule Fixed-Deadline Critical Tasks

```
Process:
1. Identify all tasks with fixed deadlines this week
2. Work backwards from deadline
3. Schedule prep/work time accordingly

Example:
Task: "Complete board presentation"
Deadline: Thursday 2pm
Schedule:
- Tuesday 9am-11am: Outline and research
- Wednesday 9am-12pm: Create slides
- Wednesday 2pm-3pm: Review and polish
- Thursday 1pm-1:45pm: Final prep and practice

Ask: "Schedule 'Complete board presentation' across multiple days leading up to Thursday 2pm deadline"

MCP Tool: mcp__google-workspace__create_event (for each block)
Parameters:
  summary: "TASK: Complete board presentation (Part 1: Outline)"
  start_time: "2025-10-22T09:00:00-07:00"
  end_time: "2025-10-22T11:00:00-07:00"
  description: "Work on board presentation outline and research. Task ID: [task-id]"
  transparency: "opaque"  # Shows as busy
  user_google_email: "your-email@gmail.com"
```

#### Step 2: Block Deep Work for High-Priority Tasks

```
Identify top 3 most important tasks requiring deep work:
1. [Most important strategic/creative task]
2. [Second most important]
3. [Third most important]

Schedule during your peak energy times (usually mornings):

Ask: "Block my best morning hours (9am-12pm) Tuesday and Thursday for deep work on my top priority tasks"

Create calendar blocks:

MCP Tool: mcp__google-workspace__create_event
Parameters:
  summary: "🎯 DEEP WORK: [Task name]"
  start_time: "2025-10-22T09:00:00-07:00"
  end_time: "2025-10-22T12:00:00-07:00"
  description: "Focus time for [task details]. No meetings, no interruptions. Task ID: [id]"
  transparency: "opaque"
  reminders: [{"method": "popup", "minutes": 15}]
  user_google_email: "your-email@gmail.com"

Best practices:
- Minimum 90 minutes per block
- Schedule 2-3 days before needed
- Add emoji (🎯) to visually distinguish
- Set reminder 15 min before
- Include task details in description
```

#### Step 3: Schedule Meeting Prep Time

```
For each meeting on your calendar:

Ask: "Add 15-30 minute prep time before each of my meetings this week"

Calculate prep time needed:
- Standard meeting: 15 minutes
- Important/complex meeting: 30 minutes
- Presentation/demo: 60 minutes

Create prep blocks:

MCP Tool: mcp__google-workspace__create_event
Parameters:
  summary: "📋 PREP: [Meeting name]"
  start_time: "[30 min before meeting]"
  end_time: "[meeting start time]"
  description: "Prepare for [meeting name]: Review agenda, prepare materials, gather context"
  transparency: "opaque"
  user_google_email: "your-email@gmail.com"

Automation option:
"For all meetings this week, automatically create 30-minute prep blocks before each"
```

#### Step 4: Schedule Medium-Priority Tasks

```
Fit remaining important tasks into available slots:

Strategy:
1. Use afternoon time blocks (post-lunch energy)
2. Fill gaps between meetings (if > 45 minutes)
3. Batch similar tasks together
4. Leave some flexibility

Example scheduling:

Ask: "Schedule these 3 medium-priority tasks in available afternoon slots:
- Review team proposals (60 min)
- Update project documentation (45 min)
- Conduct code review (90 min)"

MCP Tool: mcp__google-workspace__create_event (for each)
Parameters:
  summary: "TASK: [Task name]"
  start_time: "[appropriate afternoon slot]"
  end_time: "[start + duration]"
  description: "[Task details and context]"
  user_google_email: "your-email@gmail.com"
```

#### Step 5: Create Task Batches

```
Group similar low-priority tasks:

Common batches:
- Email processing (30-60 min daily)
- Admin tasks (60 min, once/week)
- Quick updates (30 min, 2x/week)
- Planning/organizing (60 min, Friday)

Ask: "Create daily email processing block at 2pm for 30 minutes"

MCP Tool: mcp__google-workspace__create_event
Parameters:
  summary: "📧 BATCH: Email Processing"
  start_time: "[2pm each day]"
  end_time: "[2:30pm each day]"
  description: "Process inbox, respond to emails, clear to zero. Multiple tasks batched together."
  transparency: "opaque"
  user_google_email: "your-email@gmail.com"
```

### Phase 3: Refinement and Optimization (10 minutes)

Review and adjust your scheduled week.

#### 1. Capacity Check

```
Ask: "Analyze my schedule after adding tasks:
- Total scheduled hours (meetings + tasks)
- Available buffer time remaining
- Any overloaded days?
- Realistic or overcommitted?"

Healthy schedule check:
✅ Total scheduled < 35 hours (leaving 5 hours buffer)
✅ No day with > 8 hours scheduled
✅ At least 90 minutes buffer daily
✅ Lunch breaks present
✅ Some flex time each day

If overcommitted:
- Move lower-priority tasks to next week
- Combine similar tasks
- Reduce task scope
- Decline optional meetings
```

#### 2. Energy Alignment Check

```
Review energy-task matching:

Ask: "Check if my high-energy tasks are scheduled during peak energy times"

Ideal alignment:
Morning (9am-12pm): Deep work, creative tasks
Afternoon (1-4pm): Meetings, collaboration
Late afternoon (4-6pm): Admin, planning, lighter work

Adjust if needed:
"Move [task] from afternoon to morning slot for better energy alignment"
```

#### 3. Create Buffer Blocks

```
Protect time for unexpected items:

Ask: "Add 1-hour buffer blocks on Tuesday and Thursday afternoons"

MCP Tool: mcp__google-workspace__create_event
Parameters:
  summary: "⏸️ BUFFER: Flex time"
  start_time: "[afternoon slot]"
  end_time: "[+1 hour]"
  description: "Buffer time for unexpected tasks, overruns, or breaks. Use if needed, protect if not."
  transparency: "transparent"  # Shows as free
  user_google_email: "your-email@gmail.com"

Note: Set as "free" so urgent meetings can be scheduled if needed, but you still see it as buffer
```

### Phase 4: Integration with Task System (5 minutes)

Link calendar blocks back to task list.

#### 1. Update Tasks with Schedule

```
For each scheduled task:

Ask: "Update task notes with scheduled time"

MCP Tool: mcp__google-workspace__update_task
Parameters:
  task_list_id: "default-list"
  task_id: "[task-id]"
  notes: "Scheduled: Tuesday 9am-11am\nCalendar event: [link to calendar]"
  user_google_email: "your-email@gmail.com"

Benefits:
- See when task is scheduled from task list
- Link between calendar and tasks
- Easy to find and reschedule if needed
```

#### 2. Mark Unscheduled Tasks

```
For tasks that didn't fit this week:

Ask: "Move these unscheduled tasks to next week"

MCP Tool: mcp__google-workspace__update_task
Parameters:
  task_list_id: "default-list"
  task_id: "[task-id]"
  due: "[next week date]"
  notes: "Deferred from this week - no capacity"
  user_google_email: "your-email@gmail.com"

Or move to "Someday/Maybe" list if not truly needed
```

## MCP Integration Usage

### Essential Tools for Task Scheduling

1. **List Tasks to Schedule**
   ```javascript
   // Get all pending tasks
   mcp__google-workspace__list_tasks({
     task_list_id: "default-list",
     show_completed: false,
     due_max: "[end date]",
     user_google_email: "you@gmail.com"
   })

   // Get tasks by priority (filter in app logic)
   // Get tasks without due dates
   // Get overdue tasks
   ```

2. **Check Calendar Availability**
   ```javascript
   // Find available time slots
   mcp__google-workspace__get_events({
     calendar_id: "primary",
     time_min: "[week start]",
     time_max: "[week end]",
     detailed: false,
     user_google_email: "you@gmail.com"
   })

   // Identify gaps between events for task scheduling
   ```

3. **Create Task Calendar Blocks**
   ```javascript
   // Schedule focused work time
   mcp__google-workspace__create_event({
     calendar_id: "primary",
     summary: "TASK: Complete feature implementation",
     start_time: "2025-10-22T09:00:00-07:00",
     end_time: "2025-10-22T11:30:00-07:00",
     description: "Focus time for implementing user authentication. Task ID: task-123. No interruptions.",
     transparency: "opaque",  // Show as busy
     reminders: [{"method": "popup", "minutes": 15}],
     user_google_email: "you@gmail.com"
   })
   ```

4. **Batch Create Multiple Task Blocks**
   ```javascript
   // Schedule multiple related tasks
   // Create recurring task blocks (like daily email processing)
   // Set up weekly deep work sessions

   // Example: Create recurring deep work block
   mcp__google-workspace__create_event({
     summary: "🎯 DEEP WORK: Priority Tasks",
     start_time: "2025-10-22T09:00:00-07:00",
     end_time: "2025-10-22T12:00:00-07:00",
     description: "Protected time for most important work",
     transparency: "opaque",
     // Note: For recurring, create separate events for each occurrence
     // Google Calendar API requires individual creation
     user_google_email: "you@gmail.com"
   })
   ```

5. **Link Tasks to Calendar Events**
   ```javascript
   // Update task with calendar link
   mcp__google-workspace__update_task({
     task_list_id: "default-list",
     task_id: "task-123",
     notes: "Scheduled: Tuesday 9-11:30am\nCalendar: [event link]\nStatus: Ready to work",
     user_google_email: "you@gmail.com"
   })
   ```

6. **Adjust and Reschedule**
   ```javascript
   // Move task to different time
   mcp__google-workspace__modify_event({
     calendar_id: "primary",
     event_id: "event-id",
     start_time: "2025-10-23T14:00:00-07:00",
     end_time: "2025-10-23T16:00:00-07:00",
     user_google_email: "you@gmail.com"
   })

   // Update corresponding task
   mcp__google-workspace__update_task({
     task_list_id: "default-list",
     task_id: "task-123",
     notes: "Rescheduled to: Wednesday 2-4pm\nReason: Conflict arose",
     user_google_email: "you@gmail.com"
   })
   ```

## Example Scenarios

### Scenario 1: Monday Morning Weekly Task Scheduling

**Situation**: Start of week, need to schedule all tasks

**Workflow**:
```
1. "Show me all my tasks for this week"
   - 15 tasks total
   - 3 critical, 7 high priority, 5 medium

2. "Show me my calendar availability this week"
   - 18 hours of meetings scheduled
   - ~22 hours available for task work

3. Schedule in order:
   a. Critical task 1: "Launch feature X"
      → Block Tue 9am-12pm, Wed 9am-12pm (deep work)

   b. Critical task 2: "Finalize Q4 budget"
      → Block Thu 2pm-4pm

   c. Critical task 3: "Complete performance reviews"
      → Block Fri 9am-11am

   d. High priority tasks (7 tasks):
      → Schedule in afternoon slots
      → Batch similar tasks
      → Leave 2 tasks for next week if no room

   e. Meeting prep:
      → Add 30-min blocks before 5 meetings

   f. Email processing:
      → Daily 2pm-2:30pm blocks

4. Final check:
   - Total scheduled: 33 hours (meetings + tasks)
   - Buffer available: 7 hours
   - Reasonable and achievable ✅

5. Review Friday afternoon:
   - Check completion status
   - Reschedule any incomplete tasks
```

**Time**: 25 minutes
**Result**: Complete week scheduled with realistic commitments

### Scenario 2: Urgent Task Arrives Mid-Week

**Situation**: Tuesday afternoon, urgent task assigned due Thursday

**Workflow**:
```
1. Assess new task:
   - Time needed: 4 hours
   - Priority: Critical (deadline-driven)
   - Energy: High (complex problem-solving)

2. "Show me available time blocks before Thursday"
   - Wednesday 9am-12pm: Already scheduled (task A)
   - Wednesday 2pm-4pm: Available
   - Thursday 9am-11am: Available

3. Reschedule existing work:
   - Move task A from Wed 9am-12pm to Friday 9am-12pm
   - Free up Wednesday morning for urgent task

4. Schedule urgent task:
   - Wed 9am-12pm: New urgent task (part 1)
   - Wed 2pm-4pm: New urgent task (part 2)

5. "Update my task list with new schedule"

6. Communicate:
   - Let stakeholders know task A moves to Friday
   - Confirm urgent task is now scheduled
```

**Time**: 10 minutes
**Result**: Urgent work scheduled without overcommitting

### Scenario 3: Task Taking Longer Than Expected

**Situation**: Thursday 10am, scheduled task not complete

**Workflow**:
```
1. Current situation:
   - Task: "Implement API endpoint"
   - Scheduled: Thu 9am-11am (2 hours)
   - Actual: Need 2 more hours

2. "Find available time to complete this task"
   - Option 1: Thu 2pm-4pm (has lower-priority task)
   - Option 2: Fri 9am-11am (buffer time)

3. Decision: Use Thursday afternoon
   - Reschedule lower-priority task to next week
   - Block Thu 2pm-4pm for task completion

4. "Reschedule my 2pm task to next Tuesday"

5. Update task:
   - Note: "Took 4 hours instead of 2"
   - Learn: Underestimated complexity
   - Future: Add buffer for similar tasks
```

**Time**: 5 minutes
**Result**: Task gets completed without disrupting entire week

## Advanced Scheduling Techniques

### 1. Theme Days

Assign specific types of work to specific days:

```
Monday: Planning & Meetings
- Schedule all team meetings
- Weekly planning session
- Review and organize tasks

Tuesday & Thursday: Deep Work Days
- No meetings (or minimal)
- Long focus blocks
- Most important creative work

Wednesday: Collaboration Day
- 1-on-1s
- Team working sessions
- Cross-functional meetings

Friday: Admin & Wrap-up
- Email cleanup
- Documentation
- Planning next week
- Lower-priority tasks

Ask: "Set up theme-based weekly schedule with deep work on Tue/Thu"
```

### 2. Energy-Based Scheduling

Match task difficulty to energy levels:

```
Track your energy:
- When do you feel most creative? → Schedule complex tasks then
- When do you hit afternoon slump? → Schedule routine work then
- When are you most social? → Schedule meetings then

Personal energy map example:
6-8am: Low (waking up)
8-10am: Rising (good for planning)
10am-12pm: Peak (best for deep work)
12-1pm: Low (lunch)
1-3pm: Moderate (good for meetings)
3-4pm: Slump (admin work)
4-6pm: Second wind (collaboration)

Schedule accordingly:
"Schedule my most challenging tasks during my 10am-12pm peak energy window"
```

### 3. Task Time Multipliers

Account for hidden time costs:

```
Real time calculation:
Listed time: 2 hours
Context switching: +15 min
Interruptions: +15 min
Prep/cleanup: +15 min
Buffer: +15 min
Actual time needed: 3 hours

Always multiply estimated time:
- Solo work: × 1.25
- Collaboration: × 1.5
- New/unfamiliar: × 2.0

Ask: "Schedule this 2-hour task but account for realistic time with buffer"
→ Actually block 2.5-3 hours
```

### 4. Progressive Scheduling

Schedule incrementally, not all at once:

```
Monday morning: Schedule Mon-Wed
Wednesday afternoon: Schedule Thu-Fri
Friday afternoon: Plan next week

Benefits:
- Adapt to how week unfolds
- Account for tasks taking longer
- Handle unexpected items
- More realistic planning

Ask: "Schedule my critical tasks for the next 3 days only"
```

### 5. Backwards Scheduling

Work backwards from deadlines:

```
Example: Presentation due Friday 2pm

Friday 2pm: Presentation
Friday 11am-1pm: Final practice run (↑ 2 hours before)
Friday 9am-11am: Finalize slides (↑ 3 hours before)
Thursday 2pm-5pm: Create slides (↑ 1 day, 3 hours)
Thursday 9am-11am: Gather data/research (↑ 4 hours before)
Wednesday 2pm-4pm: Outline structure (↑ 1 day, 2 hours)

Ask: "Work backwards from Friday 2pm deadline and schedule all preparation steps"
```

## Best Practices

### Do's

1. **Schedule Deep Work First**
   - Block most important work before anything else
   - Protect morning hours
   - Treat as unmovable meetings

2. **Always Include Prep Time**
   - Before meetings
   - Before starting complex tasks
   - Before presentations

3. **Batch Similar Tasks**
   - All email processing together
   - All admin work together
   - All calls back-to-back (with breaks)

4. **Build in Buffer Time**
   - 25% of schedule should be flexible
   - 5-10 min between different activities
   - Longer buffer after difficult tasks

5. **Link Tasks to Calendar**
   - Update task with scheduled time
   - Add task details to calendar event
   - Easy to find and adjust

6. **Review and Adjust Daily**
   - Check tomorrow's schedule each afternoon
   - Move incomplete tasks
   - Adjust next day based on energy

### Don'ts

1. **Don't Schedule Every Minute**
   - Leave white space
   - Allow for unexpected
   - Prevent burnout

2. **Don't Ignore Energy Levels**
   - Don't schedule hard tasks when tired
   - Don't schedule creative work after long meetings
   - Don't schedule meetings during peak focus time

3. **Don't Underestimate Task Time**
   - Always add buffer
   - Account for context switching
   - Include prep and wrap-up time

4. **Don't Schedule Back-to-Back Tasks**
   - Always have transition time
   - Mental rest between different types of work
   - Physical breaks

5. **Don't Reschedule Deep Work**
   - Once scheduled, protect it
   - Decline meetings during deep work
   - Only move for true emergencies

## Troubleshooting

### Problem: Tasks Never Get Scheduled

**Cause**: Waiting for "free time" that never comes

**Solution**:
```
1. Accept: Free time won't appear magically
2. Make time: Schedule tasks proactively
3. Protect time: Treat task blocks like meetings
4. Say no: Decline new meetings that conflict

"Block next Tuesday/Thursday mornings for deep work - make it recurring for next 4 weeks"
```

### Problem: Keep Rescheduling Same Tasks

**Cause**: Task not actually a priority OR underestimated difficulty

**Solution**:
```
1. Honest assessment: Is this really important?
   - Yes → Schedule immediately in prime time
   - No → Remove from list or move to "someday"

2. Break it down: Task too large/vague?
   - Make subtasks more concrete
   - Schedule first small step
   - Build momentum

3. Address blockers: What's preventing progress?
   - Missing information
   - Waiting on someone
   - Don't know how to start

"Help me break down this task I keep rescheduling into smaller, concrete steps"
```

### Problem: Scheduled Tasks Don't Get Done

**Cause**: Schedule too optimistic OR interruptions

**Solution**:
```
1. Check schedule realism:
   - Too many tasks scheduled
   - Tasks take longer than allocated
   - No buffer for unexpected

2. Analyze completion rate:
   - < 50%: Drastically overcommitting
   - 50-70%: Somewhat optimistic
   - 70-85%: Good, realistic planning
   - > 85%: Maybe undercommitting

3. Protect scheduled time:
   - Close communication apps
   - Set "Do Not Disturb"
   - Inform team of focus blocks
   - Use website blockers

"Analyze my task completion rate - am I scheduling too much?"
```

### Problem: Tasks Expand to Fill Time

**Cause**: Parkinson's Law - work expands to fill available time

**Solution**:
```
1. Set tighter time limits:
   - Instead of 3 hours → Schedule 2 hours
   - Creates productive pressure
   - Forces focus

2. Use Pomodoro technique:
   - 25-min focused sprints
   - 5-min breaks
   - Track progress

3. Define "done":
   - What does complete look like?
   - Set specific deliverable
   - Stop when reached

"Schedule this task with aggressive deadline - set timer for completion"
```

### Problem: Calendar Looks Overwhelming

**Cause**: Too much visible detail

**Solution**:
```
1. Use visual hierarchy:
   - Different colors for task types
   - Emoji prefixes (🎯 deep work, 📧 email, 📋 prep)
   - Shorter event titles

2. Separate calendars:
   - Work calendar
   - Personal calendar
   - Task calendar (can hide when needed)

3. Simplify view:
   - Hide completed tasks
   - Show only upcoming week
   - Use agenda view instead of calendar grid

"Create separate calendar for scheduled tasks so I can toggle visibility"
```

## Integration with Other Skills

### Weekly Review
- Review last week's scheduled vs actual
- Learn from time estimates
- Plan next week's task schedule

### Daily Planning
- Adjust today's scheduled tasks
- Confirm tomorrow's schedule
- Move incomplete tasks

### Processing Email
- Convert emails to tasks
- Immediately schedule urgent tasks
- Batch schedule routine tasks

### Analyzing Schedule
- Use analysis to find task scheduling time
- Identify best times for different task types
- Protect prime time for important tasks

## Success Metrics

1. **Task Completion Rate**: (Completed scheduled tasks / Total scheduled tasks)
   - Target: > 70%

2. **Schedule Accuracy**: (Actual time / Estimated time)
   - Target: 0.8-1.2 (±20%)

3. **Protected Time**: (Deep work blocks kept / Deep work blocks scheduled)
   - Target: > 85%

4. **Planning Time**: Time spent scheduling tasks
   - Target: < 30 min/week

5. **Scheduling Lag**: (Days between task creation and scheduling)
   - Target: < 2 days for important tasks

## Quick Reference Commands

```
# List Tasks
"Show all my tasks for this week"
"Show high-priority unscheduled tasks"
"What tasks are overdue?"

# Find Time
"When do I have 2+ hour blocks this week?"
"Find time for 3-hour deep work session"
"Show me all available afternoon slots"

# Schedule Tasks
"Schedule [task name] on Tuesday morning"
"Block Thursday 9am-12pm for deep work on [task]"
"Create daily email processing blocks at 2pm"

# Adjust Schedule
"Move [task] from Tuesday to Wednesday"
"Extend [task] by 1 hour"
"Cancel [task block] and reschedule to next week"

# Integration
"Create calendar event for task [task-id]"
"Update task [task-id] with scheduled time"
"Link calendar event to task"

# Review
"Show tasks I scheduled but didn't complete this week"
"Compare scheduled vs actual time for my tasks"
"Which tasks am I consistently rescheduling?"
```

## Resources

- **Books**:
  - "Deep Work" by Cal Newport
  - "Make Time" by Jake Knapp
  - "Time Blocking" by Cal Newport (article)

- **Methods**:
  - Time Blocking
  - Pomodoro Technique
  - Eat That Frog (tackle hardest task first)

## Next Steps

1. Complete schedule analysis (previous skill)
2. Identify available time blocks for task work
3. Schedule your top 3 priorities first
4. Add meeting prep blocks
5. Fill remaining time with other tasks
6. Review daily and adjust as needed
7. Track completion rate and improve estimates

Remember: "A task without a scheduled time is just a wish. Make it real by putting it on your calendar." 📅✅
