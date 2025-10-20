# Life OS Workflows

Complete guide to common Life OS workflows and routines.

## Daily Workflows

### Morning Routine (10-15 minutes)

The most important routine for starting your day with intention.

#### Steps:

```bash
# 1. Receive WhatsApp briefing (automatic at 7 AM)
"Good morning! 🌅 Here's your day..."

# 2. Open Life OS and review
npm run life-os:daily-plan

# 3. Sync with calendar and tasks
npm run calendar:today
npm run todoist:sync

# 4. Set daily intentions
# - Top 3 priorities
# - Energy allocation
# - Time blocks
# - Potential obstacles
```

#### Detailed Morning Planning:

**Step 1: Review Calendar** (2 min)
- Check all scheduled events
- Note meeting prep needed
- Identify time blocks available
- Look for conflicts

**Step 2: Set Top 3 Priorities** (3 min)
- What MUST get done today?
- What moves key goals forward?
- What has deadlines?
- Keep it to 3 maximum

**Step 3: Time Block Schedule** (5 min)
- Block deep work time (2-3 hours)
- Schedule priority tasks
- Add buffer time (20% of day)
- Plan breaks and transitions

**Step 4: Energy Management** (2 min)
- Match tasks to energy levels
- Schedule hard tasks for peak energy
- Plan recovery periods
- Consider sleep quality

**Step 5: Obstacle Planning** (3 min)
- What could go wrong?
- If-then scenarios
- Backup plans
- Support needed

#### Example Morning Plan:

```
Date: Monday, October 20, 2025

Top 3 Priorities:
1. Finish project proposal (2 hours)
2. Team meeting preparation (30 min)
3. Review quarterly goals (45 min)

Energy Level: 7/10 (slept well)

Time Blocks:
09:00-11:00 | Deep Work - Project Proposal
11:00-11:15 | Break + Walk
11:15-12:00 | Email + Admin
12:00-13:00 | Lunch + Rest
13:00-13:30 | Meeting Prep
14:00-15:00 | Team Meeting
15:00-15:15 | Break
15:15-16:00 | Goals Review
16:00-17:00 | Buffer / Catch-up

Potential Obstacles:
- Meeting might run long → Block 15 min buffer after
- Email overload → Batch process at 11:15 only

Notes:
- Deadline for proposal is Wednesday
- Need to follow up with Sarah on Q3 numbers
- Gym session tonight at 18:00
```

---

### Evening Reflection (5-10 minutes)

Close your day with intention and prepare for tomorrow.

#### Steps:

```bash
# 1. Log your day
npm run life-os:daily

# 2. Quick inbox capture
npm run life-os:inbox

# 3. Review accomplishments
# - What got done?
# - What didn't and why?
# - How was energy?
# - Lessons learned?

# 4. Gratitude practice
# - 3 things you're grateful for
# - 1 win from today
# - 1 person who helped

# 5. Tomorrow preview
# - Top 3 priorities
# - Calendar check
# - Preparation needed
```

#### Detailed Evening Reflection:

**Step 1: Review Today** (3 min)
```
Completed:
✓ Finished project proposal draft
✓ Team meeting (productive!)
✓ Gym session

Not Completed:
✗ Goals review (ran out of time)
  → Reschedule to tomorrow morning

Energy Patterns:
- Peak: 9-11 AM (best deep work)
- Dip: 2-3 PM (post-lunch slump)
- Recovery: 6-7 PM (post-gym boost)
```

**Step 2: Capture Thoughts** (2 min)
```
Inbox Items:
- Idea: New approach to team collaboration
- Task: Follow up with Sarah
- Note: Article idea about productivity
- Task: Buy birthday gift for spouse
```

**Step 3: Gratitude** (2 min)
```
Grateful For:
1. Team's support in meeting
2. Good weather for lunch walk
3. Spouse made dinner

Today's Win:
Finished first draft of proposal - on schedule!

Person Who Helped:
John - provided great feedback on proposal
→ Send thank you message
```

**Step 4: Tomorrow Preview** (3 min)
```
Tomorrow's Top 3:
1. Revise proposal based on feedback
2. Goals quarterly review
3. 1-on-1 with team member

Calendar:
- 10:00 AM - Client call
- 15:00 PM - 1-on-1 with Alex

Prep Needed:
- Review Alex's recent work
- Gather client presentation materials
```

---

### Midday Check-in (5 minutes)

Optional but recommended for staying on track.

```bash
# Quick status check
npm run life-os:status

Questions:
- Am I on track with priorities?
- Do I need to adjust plans?
- How's my energy level?
- What needs attention now?
```

---

## Weekly Workflows

### Sunday Weekly Review (60-90 minutes)

The cornerstone of Life OS - comprehensive weekly reflection and planning.

#### Full Weekly Review Process:

**Part 1: Last Week Review** (20 min)

```bash
npm run life-os:weekly
```

1. **Accomplishments** (5 min)
   - List all completed tasks
   - Highlight major wins
   - Note unexpected successes
   - Celebrate progress

2. **Incomplete Tasks** (5 min)
   - What didn't get done?
   - Why not? (honest analysis)
   - Still relevant?
   - Reschedule or delete

3. **Time Analysis** (5 min)
   - Where did time go?
   - Time vs intention alignment
   - Time wasters identified
   - What to change?

4. **Energy Patterns** (5 min)
   - When was energy high/low?
   - What boosted energy?
   - What drained energy?
   - Patterns noticed?

**Part 2: Inbox Processing** (15 min)

```bash
npm run life-os:inbox
```

Process every item to zero:
- Tasks → Todoist with due dates
- Projects → Break into next actions
- Reference → File or delete
- Someday → Move to someday list
- Trash → Delete

**Part 3: Goal Progress** (10 min)

```bash
npm run life-os:goals
```

For each active goal:
- Review progress metrics
- Update completion percentage
- Adjust timeline if needed
- Celebrate milestones
- Identify obstacles
- Plan next steps

**Part 4: Calendar Review** (10 min)

```bash
npm run calendar:week
```

Next week's calendar:
- All commitments noted
- Identify busy days
- Schedule preparation time
- Block focus time
- Check for conflicts
- Add travel time

**Part 5: Life Assessment Update** (10 min)

Quick assessment of each life area:
- Any scores changed significantly?
- What improved this week?
- What declined?
- What needs attention?
- Any patterns?

**Part 6: Next Week Planning** (15 min)

```bash
npm run life-os:daily-plan --week
```

1. **Set Weekly Objectives** (5 min)
   - 3-5 key outcomes
   - Aligned with goals
   - Realistic and specific

2. **Schedule Big Rocks** (5 min)
   - Priority tasks first
   - Deep work blocks
   - Important meetings
   - Self-care time

3. **Prepare Resources** (5 min)
   - Materials needed
   - People to contact
   - Research required
   - Systems to set up

#### Example Weekly Review Output:

```
Week of October 13-19, 2025

LAST WEEK SUMMARY
=================
Accomplishments:
✓ Completed project proposal (major!)
✓ All daily logs maintained
✓ Gym 4x (goal met)
✓ Read 2 chapters of book
✓ Meaningful conversation with spouse
✓ Meal prepped on Sunday

Incomplete:
✗ Blog post draft (deprioritized)
✗ Closet organization (moved to next month)

Time Allocation:
- Work: 45 hours (planned: 40)
- Family: 12 hours (planned: 15)
- Health: 8 hours (planned: 8)
- Personal: 5 hours (planned: 7)

Analysis: Worked overtime, squeezed family and personal time

Energy Patterns:
- Highest: Monday-Tuesday mornings
- Lowest: Thursday afternoon (burnout?)
- Best work: 9-11 AM blocks
- Most creative: Saturday morning

GOALS UPDATE
============
Q4 Goal: Complete Professional Certification
Progress: 45% → 55% (+10%)
Status: On track
Next: Finish module 3 by Oct 27

Q4 Goal: Improve Health Score 6→8
Progress: 6.5/10 (good trend!)
Status: Steady progress
Next: Maintain 4x gym routine

NEXT WEEK FOCUS
===============
Weekly Objectives:
1. Start implementation phase of project
2. Complete certification module 3
3. Plan Q4 personal development
4. Improve family time quality
5. Maintain health routines

Big Rocks Scheduled:
Mon 9-11: Project implementation planning
Tue 9-11: Deep work on implementation
Wed 6-8 PM: Date night with spouse
Thu 9-11: Certification study
Fri 14-17: Team collaboration session
Sat 9-11: Personal development planning
Sun 16-17:30: Weekly review

Calendar Highlights:
- Monday: Client kickoff meeting
- Wednesday: Important presentation
- Friday: Team offsite
- Busy week - protect morning blocks!

Notes:
- Client presentation is high stakes
- Need to prepare thoroughly
- Book babysitter for date night
- Download module 3 materials
```

---

### Mid-Week Check (15 minutes)

Wednesday mini-review to stay on track.

```bash
# Quick check-in
npm run life-os:weekly --quick

Questions:
- Are weekly objectives on track?
- Any adjustments needed?
- What's working well?
- What needs attention?
- Weekend prep needed?
```

---

## Monthly Workflows

### End-of-Month Review (90-120 minutes)

Comprehensive monthly reflection and planning.

#### Month Review Process:

**Part 1: Month in Review** (30 min)

```bash
npm run life-os:monthly
```

1. **Major Accomplishments** (10 min)
   - Significant wins
   - Goals achieved
   - Skills developed
   - Relationships strengthened
   - Health improvements

2. **Challenges & Lessons** (10 min)
   - Major obstacles
   - How handled
   - What learned
   - What would you do differently
   - Growth opportunities

3. **Metrics Review** (10 min)
   - Goal progress percentages
   - Habit consistency rates
   - Time allocation patterns
   - Energy trends
   - Health metrics

**Part 2: Life Assessment** (20 min)

```bash
npm run life-os:assess --quick
```

Quick assessment of each area:
- Rate each area 1-10
- Compare to last month
- Note significant changes
- Identify trends
- Celebrate improvements
- Address declines

**Part 3: Goal Check-in** (20 min)

```bash
npm run life-os:goals --review
```

For each goal:
- Progress update
- On track or behind?
- Obstacles encountered
- Support needed
- Adjust or pivot?
- Next month milestones

**Part 4: Next Month Planning** (20 min)

1. **Set Monthly Objectives** (10 min)
   - 5-7 key outcomes
   - Mix of goal work + maintenance
   - Consider calendar events
   - Balance life areas

2. **Plan Key Projects** (10 min)
   - Project milestones
   - Resource needs
   - Collaboration required
   - Deadlines and buffers

---

## Quarterly Workflows

### Quarterly Review & Planning (3-4 hours)

Deep dive into life assessment and goal setting.

#### Quarter Review Process:

**Part 1: Full Life Assessment** (45 min)

```bash
npm run life-os:assess
```

Complete assessment of all 8 life areas:
1. Health & Fitness
2. Career & Work
3. Relationships
4. Personal Growth
5. Financial Health
6. Life Balance
7. Environment
8. Purpose & Meaning

For each area:
- Current state rating (1-10)
- What's working well
- What needs improvement
- Specific challenges
- Resources available
- Support needed

**Part 2: Quarter in Review** (60 min)

```bash
npm run life-os:quarterly
```

1. **Achievements** (15 min)
   - Major milestones reached
   - Skills mastered
   - Relationships deepened
   - Health improvements
   - Career advances
   - Financial progress

2. **Goal Completion** (15 min)
   - Which goals achieved?
   - Which fell short?
   - Why the differences?
   - What worked?
   - What didn't?

3. **Pattern Analysis** (15 min)
   - Recurring challenges
   - Success patterns
   - Energy cycles
   - Productivity trends
   - Relationship dynamics
   - Health patterns

4. **Lessons Learned** (15 min)
   - Key insights
   - Behavior changes
   - System improvements
   - Mindset shifts
   - What to continue
   - What to stop

**Part 3: Next Quarter Goal Setting** (90 min)

```bash
npm run life-os:goals --quarter
```

1. **Vision Creation** (20 min)
   - Where do you want to be in 3 months?
   - What does success look like?
   - What would you be proud of?
   - Who do you want to become?

2. **Goal Definition** (30 min)
   - Set 3-5 major goals
   - Mix of improvement + maintenance
   - SMART criteria check
   - Balance across life areas
   - Aligned with values

3. **Action Planning** (30 min)
   - Break into monthly milestones
   - Define weekly actions
   - Identify obstacles
   - Plan support systems
   - Schedule reviews

4. **System Design** (10 min)
   - Habits to build
   - Routines to establish
   - Tools needed
   - Accountability setup

---

## Special Workflows

### Inbox Zero Workflow

Weekly inbox processing routine.

```bash
# Step 1: Collect all inputs
npm run life-os:inbox --capture

# Step 2: Process each item
npm run life-os:inbox --process

# Step 3: Sync to systems
npm run todoist:sync
npm run calendar:sync

# Step 4: Clear and archive
npm run life-os:inbox --clear
```

For each inbox item:
1. **What is it?** - Clarify
2. **Is it actionable?** - Yes/No
3. **If yes:** Next action? Project? Task?
4. **If no:** Reference? Someday? Trash?
5. **Organize:** File appropriately
6. **Clear:** Remove from inbox

---

### Goal Sprint Workflow

Intensive focus period on specific goal.

```bash
# Setup (30 min)
npm run life-os:sprint --init

# Daily (10 min)
npm run life-os:sprint --daily

# Weekly (30 min)
npm run life-os:sprint --review

# Complete (60 min)
npm run life-os:sprint --complete
```

**Sprint Structure:**
- Duration: 2-4 weeks
- Focus: 1 primary goal
- Daily tracking
- Weekly adjustments
- Completion review

---

### Life Transition Workflow

For major life changes (job, move, relationship).

```bash
# Initial assessment
npm run life-os:transition --start

# Weekly check-ins
npm run life-os:transition --check

# Integration
npm run life-os:transition --integrate
```

**Transition Support:**
- Capture emotions and thoughts
- Track adjustment progress
- Identify support needs
- Plan integration steps
- Regular reflection
- Celebration milestones

---

### Habit Building Workflow

Establish new habits systematically.

```bash
# Define habit
npm run life-os:habit --create

# Track daily
npm run life-os:habit --log

# Review weekly
npm run life-os:habit --review
```

**Habit Framework:**
- Start tiny (2-minute version)
- Anchor to existing routine
- Track consistently
- Celebrate completions
- Adjust based on data
- Scale gradually

---

## Integration Workflows

### Email to Action

Process emails efficiently.

```bash
# Morning email processing
npm run gmail:process

# Creates tasks automatically
npm run todoist:sync

# Archive processed
npm run gmail:archive
```

---

### Mobile Capture to Planning

WhatsApp to task workflow.

```bash
# Throughout day: Send WhatsApp messages
"Add task: Call dentist"
"Note: Article idea about habits"
"Log mood: 8/10"

# Evening: Process captures
npm run whatsapp:sync
npm run life-os:inbox
npm run todoist:sync
```

---

### Calendar-Based Planning

Plan from calendar reality.

```bash
# Morning planning
npm run calendar:today
npm run life-os:daily-plan

# Weekly planning
npm run calendar:week
npm run life-os:weekly

# Time blocking
npm run calendar:block --duration 120
```

---

## Workflow Customization

### Creating Your Own Workflow

1. **Identify Need**: What's the outcome?
2. **Map Steps**: What's the process?
3. **Choose Tools**: Which skills needed?
4. **Test It**: Run through once
5. **Refine**: Adjust based on experience
6. **Automate**: Create script or shortcut
7. **Document**: Write it down
8. **Share**: Help others

### Example Custom Workflow

```bash
# My Weekly Review + Meal Planning
npm run life-os:weekly
npm run meal-plan
npm run grocery-list
npm run calendar:week
npm run todoist:sync

# Save as custom command
npm run my-sunday-routine
```

---

## Tips for Workflow Mastery

1. **Start Small**: Master daily before weekly
2. **Be Consistent**: Same time, same place
3. **Batch Similar**: Process once, decide once
4. **Use Templates**: Don't start from scratch
5. **Time Box**: Set limits, avoid perfectionism
6. **Review Process**: Improve workflows themselves
7. **Automate**: Remove friction
8. **Stay Flexible**: Adapt to life changes

## Next Steps

- [Getting Started](./getting-started.md) - Setup basics
- [Skills Reference](./skills-reference.md) - All available skills
- [Integration Guide](./integration-guide.md) - Connect services
- [Advanced Guide](./advanced.md) - Power features
- [FAQ](./faq.md) - Common questions
