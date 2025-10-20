# Life OS Skills Reference

Complete guide to all Life OS skills, when to use them, and how they work together.

## Skills Overview

Life OS includes 20+ specialized skills organized into these categories:

- **Core Skills**: Daily logging, assessments, reviews
- **Planning Skills**: Goal setting, weekly planning, daily planning
- **Processing Skills**: Inbox processing, decision making
- **Integration Skills**: Todoist, Google Workspace, WhatsApp
- **Workflow Skills**: Meal planning, grocery shopping
- **Meta Skills**: Using Life OS effectively

## Core Skills

### conducting-life-assessment

**Purpose**: Evaluate all areas of your life on a scale of 1-10

**When to Use**:
- Initial setup (baseline)
- Quarterly reviews
- Major life transitions
- When feeling stuck or lost

**What It Assesses**:
1. Health & Fitness (physical wellbeing, exercise, nutrition)
2. Career & Work (satisfaction, growth, skills)
3. Relationships (family, friends, romantic)
4. Personal Growth (learning, hobbies, development)
5. Financial Health (income, savings, debt)
6. Life Balance (time management, stress)
7. Environment (living space, community)
8. Purpose & Meaning (goals, values, contribution)

**Usage**:
```bash
npm run life-os:assess
```

**Output**:
- Numerical scores (1-10) for each area
- Written reflections and context
- Overall life satisfaction score
- Saved to `assessments/YYYY-MM-DD-assessment.json`
- Historical tracking for trend analysis

**Best Practices**:
- Be brutally honest
- Focus on current reality
- Add specific notes
- Review previous assessments
- Track quarterly trends
- Celebrate improvements
- Address declining areas

**Time Required**: 15-25 minutes

---

### daily-planning

**Purpose**: Structure your day with intention and clarity

**When to Use**:
- Every morning (5-10 min)
- Sunday evening for week ahead
- After meetings that change priorities

**What It Covers**:
1. Review calendar and commitments
2. Set top 3 priorities for the day
3. Time block your schedule
4. Identify potential obstacles
5. Plan breaks and transitions
6. Set energy management strategy

**Usage**:
```bash
npm run life-os:daily-plan
```

**Features**:
- Calendar integration (Google Calendar)
- Time blocking templates
- Priority ranking
- Energy level matching
- Task batching suggestions
- Buffer time allocation

**Best Practices**:
- Plan evening before or morning of
- Limit to 3 major priorities
- Schedule most important work first
- Include buffer time (20% of day)
- Match tasks to energy levels
- Review previous day first
- Be realistic about time

**Time Required**: 10-15 minutes

---

### weekly-review

**Purpose**: Reflect on the past week and plan the next

**When to Use**:
- Every Sunday (or your chosen day)
- End of sprint/project phase
- Before major planning sessions

**Review Sections**:

1. **Last Week Review**
   - Accomplishments and wins
   - Incomplete tasks analysis
   - Time allocation review
   - Energy patterns
   - Challenges faced

2. **Inbox Processing**
   - Clear captured items
   - Convert to tasks/projects
   - Archive or delete

3. **Goal Progress**
   - Review active goals
   - Update progress metrics
   - Adjust as needed

4. **Calendar Review**
   - Upcoming commitments
   - Scheduling conflicts
   - Preparation needed

5. **Next Week Planning**
   - Set weekly objectives
   - Schedule big rocks first
   - Identify key priorities

**Usage**:
```bash
npm run life-os:weekly
```

**Integration**:
- Pulls from daily logs
- Syncs with Todoist
- Reviews calendar events
- Updates assessment scores

**Best Practices**:
- Block 60 minutes minimum
- Find quiet space
- Review before planning
- Be thorough but not perfectionist
- Celebrate wins
- Learn from challenges
- Plan with realism

**Time Required**: 45-60 minutes

---

### processing-inbox

**Purpose**: Capture and process all inputs systematically

**When to Use**:
- Daily quick capture (ongoing)
- Weekly inbox zero session
- When feeling overwhelmed
- After meetings or brainstorms

**Processing Workflow**:

```
Capture → Clarify → Organize → Reflect → Engage
```

1. **Capture**
   - Brain dump everything
   - No judgment or organization
   - Quick notes only
   - Various input sources

2. **Clarify**
   - What is it?
   - Is it actionable?
   - What's the outcome?
   - Next action?

3. **Organize**
   - Task (to Todoist)
   - Project (multi-step)
   - Reference (documentation)
   - Someday/Maybe (future)
   - Trash (not needed)

4. **Reflect**
   - Review weekly
   - Update priorities
   - Adjust organization

5. **Engage**
   - Do (< 2 minutes)
   - Defer (schedule)
   - Delegate (assign)
   - Delete (not important)

**Usage**:
```bash
npm run life-os:inbox
```

**Features**:
- Quick capture interface
- Batch processing mode
- Smart categorization
- Todoist integration
- Archive management
- Search and filter

**Best Practices**:
- Capture freely, process later
- Process to empty weekly
- 2-minute rule (do it now)
- Keep inbox lightweight
- Review monthly archive
- Use tags for context

**Time Required**: 15-30 minutes (weekly)

---

### goal-setting

**Purpose**: Define, track, and achieve meaningful objectives

**When to Use**:
- Quarterly planning sessions
- New Year or fresh starts
- After life assessments
- Major life transitions

**Goal Framework**: SMART + Alignment

**S**pecific: Clear and well-defined
**M**easurable: Quantifiable progress
**A**chievable: Realistic given resources
**R**elevant: Aligned with values
**T**ime-bound: Clear deadline

**Plus**: Life area alignment and purpose

**Goal Types**:

1. **Outcome Goals**
   - End result focused
   - Example: "Lose 20 pounds"

2. **Process Goals**
   - Behavior focused
   - Example: "Exercise 4x/week"

3. **Performance Goals**
   - Standard improvement
   - Example: "Run 5K under 25 min"

**Usage**:
```bash
npm run life-os:goals
```

**Features**:
- Goal templates by life area
- Progress tracking
- Milestone breakdown
- Habit linking
- Obstacle planning
- Review reminders

**Goal Setting Workflow**:

1. **Assess Current State**
   - Review life assessment
   - Identify low-scoring areas
   - Notice patterns

2. **Envision Desired State**
   - 6-12 months forward
   - Specific outcomes
   - Why it matters

3. **Set 3-5 Goals Max**
   - Quality over quantity
   - Balanced life areas
   - Interconnected when possible

4. **Break Down into Milestones**
   - Monthly checkpoints
   - Measurable indicators
   - Celebration points

5. **Link to Habits**
   - Daily/weekly actions
   - System over goals
   - Consistency focus

6. **Plan for Obstacles**
   - Common challenges
   - If-then scenarios
   - Support needs

7. **Review Quarterly**
   - Progress check
   - Adjust or pivot
   - Celebrate wins

**Best Practices**:
- Focus on process over outcome
- Limit active goals (3-5 max)
- Align with life assessment
- Share with accountability partner
- Review weekly progress
- Adjust based on reality
- Celebrate small wins

**Time Required**: 60-90 minutes (quarterly)

---

## Planning Skills

### using-life-os

**Purpose**: Master the Life OS system itself

**When to Use**:
- Initial setup
- When adding new features
- Troubleshooting issues
- Teaching others

**What It Covers**:
1. System philosophy and principles
2. Skill navigation
3. Integration setup
4. Customization options
5. Best practices
6. Common workflows

**Usage**:
```bash
npm run life-os:help
npm run life-os:tutorial
```

**Features**:
- Interactive tutorials
- Skill discovery
- Configuration wizard
- Health checks
- Usage analytics

**Time Required**: Ongoing reference

---

## Processing Skills

### meal-planning

**Purpose**: Plan healthy, balanced meals for the week

**When to Use**:
- Weekly (usually Sunday)
- Before grocery shopping
- When starting new diet
- Meal prep planning

**Features**:
- Recipe database
- Dietary preferences
- Portion calculation
- Prep time estimation
- Nutrition tracking
- Shopping list generation

**Usage**:
```bash
npm run meal-plan
```

**Workflow**:
1. Review schedule and commitments
2. Select recipes (breakfast, lunch, dinner)
3. Check ingredient inventory
4. Generate shopping list
5. Plan prep schedule

**Best Practices**:
- Plan 5-7 days ahead
- Include variety
- Consider prep time
- Batch cooking when possible
- Check sales/seasonality
- Build recipe library

**Time Required**: 30-45 minutes

---

### grocery-shopping

**Purpose**: Efficient grocery shopping with automation

**When to Use**:
- After meal planning
- Weekly shopping trip
- Quick pantry restocks

**Features**:
- Automated list generation
- Store organization
- Price tracking
- Costco/Instacart integration
- Inventory management
- Budget tracking

**Usage**:
```bash
npm run grocery-list
```

**Integrations**:
- Costco API (optional)
- Instacart API (optional)
- WhatsApp notifications
- Recipe ingredients

**Time Required**: 5-10 minutes (list creation)

---

## Integration Skills

### Integration: Todoist

**Purpose**: Sync tasks and projects with Todoist

**Setup**:
```bash
# Add Todoist API token to .env
TODOIST_API_TOKEN=your_token_here
```

**Features**:
- Bidirectional sync
- Project mapping
- Label automation
- Priority sync
- Due date management

**Usage**:
```bash
npm run todoist:sync
npm run todoist:import
npm run todoist:export
```

**Sync Workflow**:
1. Life OS tasks → Todoist
2. Todoist completions → Life OS
3. Update priorities
4. Sync labels and projects

**Best Practices**:
- Sync daily or real-time
- Use consistent labels
- Map projects properly
- Handle conflicts gracefully

---

### Integration: Google Workspace

**Purpose**: Integrate Gmail and Google Calendar

**Setup**:
```bash
# Add Google credentials to .env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

**Features**:

**Gmail**:
- Inbox processing
- Email to task
- Follow-up reminders
- Archive automation

**Calendar**:
- Event sync
- Time blocking
- Schedule review
- Conflict detection

**Usage**:
```bash
npm run google:auth
npm run google:sync
npm run calendar:review
```

**Best Practices**:
- Regular calendar review
- Time block protected time
- Process email to tasks
- Use labels consistently

---

### Integration: WhatsApp

**Purpose**: Mobile-first life management via WhatsApp

**Setup**:
```bash
# Enable WhatsApp MCP
WHATSAPP_MCP_ENABLED=true

# Scan QR code to authenticate
npm run whatsapp:auth
```

**Features**:
- Quick task capture
- Daily briefings
- Reminder notifications
- Voice note processing
- Mobile-first workflows

**Commands** (via WhatsApp):
- "Add task: [task]"
- "Daily brief"
- "What's next?"
- "Log mood: [mood]"
- "Weekly review reminder"

**Usage**:
```bash
npm run whatsapp:connect
npm run whatsapp:send
npm run whatsapp:receive
```

**Best Practices**:
- Use for quick capture
- Set daily briefing time
- Voice notes for reflection
- Keep messages concise

---

## Quick Reference Commands

### Daily Routine
```bash
# Morning
npm run life-os:daily         # Daily log
npm run life-os:daily-plan     # Plan your day
npm run todoist:sync           # Sync tasks

# Evening
npm run life-os:daily          # Evening reflection
npm run life-os:inbox          # Quick capture
```

### Weekly Routine
```bash
# Sunday
npm run life-os:weekly         # Weekly review
npm run life-os:goals          # Check goal progress
npm run meal-plan              # Plan meals
npm run grocery-list           # Shopping list
npm run calendar:review        # Next week preview
```

### Monthly Routine
```bash
npm run life-os:monthly        # Monthly review
npm run life-os:assess --quick # Mini assessment
npm run life-os:goals          # Goal check-in
```

### Quarterly Routine
```bash
npm run life-os:assess         # Full assessment
npm run life-os:goals          # Goal setting
npm run life-os:quarterly      # Quarterly review
```

## Skill Combinations

### Morning Routine
```bash
daily-planning → calendar-review → todoist-sync → daily-log
```

### Weekly Planning
```bash
weekly-review → goal-progress → meal-planning → daily-planning
```

### Inbox Zero
```bash
inbox-capture → inbox-process → todoist-sync → archive
```

### Goal Sprint
```bash
goal-setting → habit-planning → weekly-planning → daily-tracking
```

## Tips for Maximum Effectiveness

1. **Start Simple**: Daily logs only for first week
2. **Build Gradually**: Add weekly reviews in week 2
3. **Stay Consistent**: Better to log daily than perfect weekly
4. **Use Templates**: Don't start from scratch
5. **Review Regularly**: Weekly minimum, monthly ideal
6. **Adjust Freely**: Customize to your needs
7. **Celebrate Progress**: Acknowledge improvements

## Next Steps

- [Getting Started Guide](./getting-started.md) - Initial setup
- [Integration Guide](./integration-guide.md) - Connect services
- [Workflows Guide](./workflows.md) - Common patterns
- [FAQ](./faq.md) - Troubleshooting
- [Advanced Guide](./advanced.md) - Power features
