# Life-OS to Claude Skills Mapping Specification

**Version:** 1.0
**Date:** 2025-10-19
**Purpose:** Comprehensive mapping of life-os features to Claude Code skills following superpowers conventions

---

## Executive Summary

This document maps life-os features (personal operating system for productivity and life management) to Claude Code skills. Each skill follows the superpowers naming convention and integrates with existing ExoMind agents, MCP tools, and memory systems.

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Claude Code Skills                       │
├─────────────────────────────────────────────────────────────┤
│  Life Assessment │ Goal Planning │ Task Management │ Review  │
└──────────┬──────────────┬─────────────────┬────────────┬────┘
           │              │                 │            │
┌──────────▼──────────────▼─────────────────▼────────────▼────┐
│                   Life-OS Core System                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Templates │  │ Memory   │  │  Rules   │  │Integration│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────┬──────────────┬─────────────────┬────────────┬────┘
           │              │                 │            │
┌──────────▼──────────────▼─────────────────▼────────────▼────┐
│              External Tool Integrations (MCP)                 │
│  Gmail │ Calendar │ Todoist │ Keep │ Telegram │ Health APIs │
└──────────────────────────────────────────────────────────────┘
```

---

## Skills Specification Table

| # | Skill Name | Category | Priority | Triggers | Required Data | Integration Needs |
|---|------------|----------|----------|----------|---------------|-------------------|
| 1 | conducting-life-assessment | Assessment | High | Life assessment request, quarterly review, "assess" command | assessment.md template, 10 life areas scoring system | Memory storage, progress tracking |
| 2 | planning-from-assessment | Planning | High | Assessment completion, goal setting request | Active assessment results, goal templates | TodoWrite, memory cross-reference |
| 3 | daily-life-check-in | Tracking | High | Morning/evening routine, "check-in" command | daily-check-in.md template, current focus areas | Todoist MCP, calendar integration |
| 4 | weekly-life-review | Review | High | Weekly review trigger, "review" command | weekly-review.md template, habit trackers | Todoist sync, memory aggregation |
| 5 | monthly-life-review | Review | High | Monthly cycle, progress tracking | monthly-review.md template, active plans | Goal tracking, decision records |
| 6 | managing-life-tasks | Task Management | Critical | Task operations, GTD workflow | GTD structure, Todoist integration | Todoist MCP, inbox processing |
| 7 | processing-life-inbox | Capture | Critical | Inbox review, "process inbox" | inbox.md, processing rules | Email MCP, Todoist sync |
| 8 | tracking-delegated-items | Tracking | Medium | Follow-up needed, waiting list | waiting.md template | Email tracking, reminders |
| 9 | managing-life-projects | Planning | High | Project planning, documentation | projects.md, project templates | Task breakdown, resource links |
| 10 | scheduling-focus-areas | Planning | High | Time blocking, schedule updates | schedule.md, energy patterns | Calendar MCP, time analysis |
| 11 | capturing-life-decisions | Knowledge | Medium | Major decision, choice points | decision templates, reasoning docs | Memory cross-reference |
| 12 | setting-life-objectives | Goal Setting | High | OKR creation, goal setting | objectives templates, SMART framework | Progress tracking, milestone alerts |
| 13 | building-life-habits | Behavior Change | High | Habit formation, routine building | Habit tracking templates | Daily reminders, streak tracking |
| 14 | managing-life-energy | Optimization | Medium | Energy tracking, peak hours | Energy log templates | Health data integration |
| 15 | reflecting-on-life-progress | Reflection | Medium | Reflection prompts, journaling | Reflection templates, prompts | Pattern analysis, insights |
| 16 | managing-life-relationships | Relationships | Medium | Relationship tracking, nurturing | Contact management, interaction logs | Calendar integration, reminders |
| 17 | tracking-life-finances | Finance | Medium | Financial goals, budget tracking | Budget templates, expense tracking | Finance API integration (future) |
| 18 | managing-life-health | Health | High | Health goals, wellness tracking | Health templates, metrics | Apple Health/Google Fit (future) |
| 19 | curating-life-knowledge | Knowledge | Medium | Learning, knowledge capture | Reference system, note templates | Obsidian/Notion integration (future) |
| 20 | coordinating-life-system | Meta | High | System health, alignment checks | All templates, system state | Cross-tool synchronization |

---

## Detailed Skill Specifications

### 1. conducting-life-assessment

**Skill Name:** `conducting-life-assessment`
**Category:** Assessment
**Priority:** High

**Purpose:**
Systematically guide users through a comprehensive life evaluation using the Level 10 Life framework. This skill ensures consistent, structured assessments that provide actionable insights and establish baseline metrics for focused improvement.

**Trigger Conditions:**
- User requests "life assessment" or "assess my life"
- Quarterly review cycle reached
- Initial onboarding phase
- User says "hi" to Life Coach
- Explicit "assess" command

**Required Data/Templates:**
- `templates/assessment.md` - Level 10 Life assessment template
- 10 life areas with scoring criteria (1-10 scale):
  1. Personal Growth & Learning
  2. Career & Work
  3. Finance & Wealth
  4. Health & Fitness
  5. Relationships & Family
  6. Fun & Recreation
  7. Physical Environment
  8. Mental & Emotional
  9. Spirituality & Purpose
  10. Community & Giving
- Scoring interpretation guidelines
- Follow-up questions for each area

**Integration Requirements:**
- **Memory System:** Store assessments in `memory/assessments/` with date stamps
- **TodoWrite:** Create action items from top 3 focus areas
- **Claude Flow:** Spawn `goal-planner` agent for next steps
- **Cross-reference:** Link to previous assessments for trend analysis

**Workflow:**
1. Check if previous assessment exists (`memory/assessments/*.md`)
2. Load assessment template with current date/quarter/year
3. Guide user through each of 10 life areas with questions
4. Calculate total score and identify lowest 3 areas
5. Prompt for "Top 3 Areas for Focus" selection
6. Generate initial action items
7. Store assessment with metadata
8. Trigger `planning-from-assessment` skill

**Output Format:**
```markdown
---
date: 2025-10-19
type: assessment
quarter: Q4
year: 2025
total_score: 67/100
---

# Level 10 Life Assessment

[Completed assessment with scores and insights]

## Top 3 Areas for Focus
1. Health & Fitness (4/10)
2. Career & Work (5/10)
3. Personal Growth (6/10)

## Next Steps
- [Auto-generated from planning-from-assessment skill]
```

**Success Criteria:**
- All 10 areas scored
- Clear insights documented
- Top 3 focus areas identified
- Action items generated
- Assessment stored in memory
- Next review date scheduled

---

### 2. planning-from-assessment

**Skill Name:** `planning-from-assessment`
**Category:** Planning
**Priority:** High

**Purpose:**
Transform assessment insights into actionable 90-day plans for the top 3 focus areas. This skill creates structured, measurable plans that connect life assessments to daily tasks and weekly progress tracking.

**Trigger Conditions:**
- Assessment completion detected
- User requests "create plan from assessment"
- User asks "what should I focus on?"
- After top 3 areas identified

**Required Data/Templates:**
- `templates/active-plan.md` - 90-day plan template
- Latest assessment results from `memory/assessments/`
- Goal setting frameworks (SMART, OKRs)
- Milestone templates

**Integration Requirements:**
- **Memory System:** Store plans in `memory/objectives/active-plans/`
- **TodoWrite:** Break down plans into actionable tasks
- **Todoist MCP:** Sync initial next actions
- **Claude Flow:** Coordinate with `goal-planner` and `task-orchestrator` agents
- **Cross-reference:** Link plans to assessment, weekly reviews, and tasks

**Workflow:**
1. Load latest assessment from memory
2. For each of top 3 focus areas:
   - Analyze current score and gap to goal score
   - Generate 3-5 key objectives (90-day timeframe)
   - Break objectives into 2-week milestones
   - Create immediate next actions
3. Check for conflicts/dependencies between plans
4. Validate with user
5. Store active plans with metadata
6. Sync next actions to Todoist
7. Schedule first weekly review

**Output Format:**
```markdown
---
area: Health & Fitness
type: active-plan
start_date: 2025-10-19
end_date: 2026-01-19
initial_score: 4/10
target_score: 8/10
assessment_link: [[2025-Q4-assessment]]
---

# 90-Day Plan: Health & Fitness

## Objectives
1. Establish consistent exercise routine (3x/week)
2. Improve sleep schedule (7-8 hours nightly)
3. Develop meal planning system

## Milestones
- Week 2: Exercise routine defined, first 3 sessions completed
- Week 4: Sleep tracking baseline established
- Week 6: Meal planning system implemented

## Next Actions (Synced to Todoist)
- [ ] Schedule doctor's appointment for physical
- [ ] Research gyms in area
- [ ] Buy fitness tracker
```

**Success Criteria:**
- 3 active plans created (one per focus area)
- Each plan has clear objectives and milestones
- Next actions synced to Todoist
- Plans cross-referenced with assessment
- First weekly review scheduled
- User understands plan structure

---

### 3. daily-life-check-in

**Skill Name:** `daily-life-check-in`
**Category:** Tracking
**Priority:** High

**Purpose:**
Facilitate quick daily check-ins that maintain alignment with active plans and provide supportive guidance. This skill is the primary interface for daily interaction with the life-os system.

**Trigger Conditions:**
- Morning routine ("What should I focus on today?")
- Evening routine ("Let's review my day")
- User says "check-in" or "daily review"
- Scheduled reminder (if calendar integration active)

**Required Data/Templates:**
- `templates/daily-check-in.md` - Daily check-in structure
- `templates/evening-routine.md` - Evening reflection template
- Active plans from `memory/objectives/active-plans/`
- Today's tasks from Todoist
- Recent progress markers

**Integration Requirements:**
- **Todoist MCP:** Fetch today's tasks and priorities
- **Calendar MCP:** Check today's schedule (if available)
- **Memory System:** Access active plans and recent reviews
- **Claude Flow:** Coordinate with `planner` agent for daily planning
- **Progress Tracking:** Log daily markers in memory

**Workflow:**

**Morning Check-in:**
1. Greet user and check current time
2. Load active plans (3 focus areas)
3. Review today's Todoist tasks
4. Check calendar for time constraints
5. Identify 3-5 priority tasks aligned with active plans
6. Suggest time blocks based on energy patterns (from schedule.md)
7. Set daily intention

**Evening Check-in:**
1. Review completed tasks from Todoist
2. Quick wins celebration
3. Note any blockers or challenges
4. Log progress markers for active plans
5. Prepare tomorrow's priorities
6. Brief reflection prompt

**Output Format:**
```markdown
# Daily Check-in: 2025-10-19

## Morning Plan
**Active Focus Areas:**
- Health & Fitness: Exercise session (Milestone: Week 2)
- Career & Work: Complete project proposal
- Personal Growth: 30min reading

**Today's Priorities:**
1. [Todoist] 9am Gym session
2. [Todoist] 10-12pm Project proposal work (focused)
3. [Todoist] 3pm Team meeting
4. [Active Plan] Evening reading (30min)
5. [Active Plan] Log food choices

**Energy Plan:**
- Peak focus: 10am-12pm (use for project work)
- Low energy: 2-3pm (admin tasks, meeting okay)

---

## Evening Reflection
**Completed:** ✅ 4/5 tasks
**Progress Markers:**
- Health: Gym session completed ✅
- Career: Proposal 80% complete ✅
- Growth: Reading session done ✅

**Challenges:**
- Team meeting ran long, cut into focused work time

**Tomorrow's Prep:**
- Finish project proposal (20% remaining)
- Schedule follow-up meeting
```

**Success Criteria:**
- Clear daily priorities identified
- Tasks aligned with active plans
- Progress markers logged
- Energy patterns utilized
- User feels supported and focused

---

### 4. weekly-life-review

**Skill Name:** `weekly-life-review`
**Category:** Review
**Priority:** High

**Purpose:**
Conduct comprehensive weekly reviews that track progress across all active focus areas, identify patterns, and adjust plans. This skill ensures consistent progress tracking and early detection of issues.

**Trigger Conditions:**
- Weekly review cycle (typically Sunday evening or Monday morning)
- User says "weekly review" or "review week"
- 7 days since last weekly review
- Explicit "review" command with weekly context

**Required Data/Templates:**
- `templates/weekly-review.md` - Structured review template
- Active plans from `memory/objectives/active-plans/`
- Past week's daily check-ins
- Completed tasks from Todoist (past 7 days)
- Previous weekly review for comparison

**Integration Requirements:**
- **Todoist MCP:** Fetch completed tasks for the week
- **Memory System:** Access daily check-ins and progress markers
- **Calendar MCP:** Review past week's events
- **TodoWrite:** Generate action items for next week
- **Claude Flow:** Coordinate with `reviewer` agent for analysis
- **Progress Tracking:** Update milestone progress in active plans

**Workflow:**
1. Load previous weekly review for comparison
2. For each active focus area:
   - Review progress markers from daily check-ins
   - Analyze completed vs planned tasks
   - Calculate milestone progress percentage
   - Identify wins and challenges
3. Review habit tracking (if applicable)
4. Analyze energy levels throughout week
5. Identify patterns (what worked, what didn't)
6. Generate insights and adjustments
7. Plan next week's priorities
8. Update active plans if needed
9. Store weekly review with metadata

**Output Format:**
```markdown
# Weekly Review: 2025-W42 (Oct 13-19)

## Health & Fitness
### Progress
- Exercise sessions: 3/3 ✅
- Sleep schedule: 6/7 nights ✅
- Meal planning: Started, 3/7 days

### Milestone Tracking
- Milestone: Week 2 checkpoint
- Target: Exercise routine established
- Status: ON TRACK ✅ (100%)

### Wins
- Completed all planned exercise sessions
- Found gym that works with schedule
- Sleep quality improved

### Challenges
- Meal planning inconsistent on weekends
- Tired after exercise (energy management)

### Next Week Focus
- Maintain 3x exercise routine
- Implement weekend meal prep
- Adjust exercise timing to optimize energy

## Career & Work
[Similar structure for second focus area]

## Personal Growth
[Similar structure for third focus area]

## Overall Reflection
### Energy Patterns
- High energy: Mon, Wed, Fri mornings
- Low energy: Tue, Thu afternoons
- Best for focus: 10am-12pm consistently

### Key Insights
- Exercise timing affects afternoon energy
- Need buffer time after meetings before focused work
- Weekend structure needs improvement

### Habits Tracking
- Exercise: 3/3 sessions ✅
- Sleep: 6/7 nights ✅
- Meal planning: 3/7 days ⚠️
- Reading: 5/7 days ✅

### Next Week Priorities
1. Maintain momentum in health area
2. Finish project proposal (carry-over)
3. Implement weekend meal prep system

### Support Needed
- Recipe ideas for meal prep
- Energy management strategies
```

**Success Criteria:**
- All 3 focus areas reviewed
- Progress markers analyzed
- Patterns identified
- Wins celebrated
- Challenges documented
- Next week priorities clear
- Milestone progress updated
- User feels awareness of progress

---

### 5. monthly-life-review

**Skill Name:** `monthly-life-review`
**Category:** Review
**Priority:** High

**Purpose:**
Conduct comprehensive monthly reviews that evaluate overall progress on 90-day plans, make plan adjustments, and ensure system health. This skill provides the mid-level review cadence between daily/weekly tracking and quarterly assessments.

**Trigger Conditions:**
- Monthly review cycle (end of month or start of new month)
- User says "monthly review"
- 30 days since last monthly review
- Milestone checkpoint reached in active plans

**Required Data/Templates:**
- `templates/monthly-review.md` - Monthly review structure
- All active plans with progress data
- Past month's weekly reviews (aggregated)
- Decision records from `memory/decisions/`
- System health metrics

**Integration Requirements:**
- **Memory System:** Access all active plans, weekly reviews, decisions
- **TodoWrite:** Generate monthly action items
- **Todoist MCP:** Review completed projects
- **Claude Flow:** Coordinate with `reviewer` and `analyst` agents
- **Progress Tracking:** Update plan scores and milestone status
- **Cross-reference:** Link to assessment, plans, and decisions

**Workflow:**
1. Load all active plans (3 focus areas)
2. For each active plan:
   - Calculate progress (current score vs initial score)
   - Review milestone completion
   - Aggregate weekly wins and challenges
   - Identify patterns over 4 weeks
   - Determine if plan adjustments needed
3. System health check:
   - All plans updated? ✓
   - Todoist tasks aligned? ✓
   - Documentation current? ✓
4. Review major decisions made during month
5. Identify next month's priorities
6. Generate plan adjustment recommendations
7. Store monthly review with metadata
8. Update active plan scores

**Output Format:**
```markdown
# Monthly Review: 2025-10

## Active Focus Areas

### 1. Health & Fitness - [Link to Plan]
- **Initial Score:** 4/10 (Oct 1)
- **Current Score:** 6/10 (Oct 31)
- **Progress:** +2 ✅

**Key Achievements:**
- Established 3x/week exercise routine (100% consistency)
- Improved sleep schedule (avg 7.5 hours)
- Meal planning system implemented

**Challenges:**
- Weekend consistency still difficult
- Energy management after exercise
- Social events disrupt routine

**Milestone Progress:**
- ✅ Week 2: Exercise routine established
- ✅ Week 4: Sleep tracking baseline
- 🔄 Week 6: Meal planning system (80% complete)

**Next Steps:**
- [ ] Optimize exercise timing for energy
- [ ] Create flexible weekend routine
- [ ] Develop social event strategies

**Plan Adjustment:** On track, minor timing optimization needed

---

### 2. Career & Work - [Link to Plan]
- **Initial Score:** 5/10
- **Current Score:** 6/10
- **Progress:** +1 ✅

[Similar detailed breakdown]

---

### 3. Personal Growth - [Link to Plan]
- **Initial Score:** 6/10
- **Current Score:** 7/10
- **Progress:** +1 ✅

[Similar detailed breakdown]

---

## System Health Check
- ✅ All active plans updated
- ✅ Progress markers tracked (28/30 days)
- ✅ Todoist tasks aligned
- ⚠️ Some reference docs outdated
- ✅ Documentation current

## Decisions Made
- Decision 1: Switch to morning exercise schedule [Link]
- Decision 2: Decline new project to focus on health [Link]

## Patterns & Insights
- Morning routines more successful than evening
- Progress accelerates after first 2 weeks
- Support system crucial for consistency

## Next Month Focus (November)
1. **Health:** Maintain momentum, add flexibility for social events
2. **Career:** Complete certification, apply new skills
3. **Growth:** Start writing practice, join book club

## Plan Adjustments Needed
- Health plan: Add "flexible routine" section
- Career plan: Accelerate based on faster progress
- Growth plan: Add social learning component

## Next Review Due
2025-11-30
```

**Success Criteria:**
- Progress calculated for all 3 areas
- Milestone status updated
- Patterns identified across 4 weeks
- Plan adjustments recommended
- Decisions documented
- System health verified
- Next month priorities clear
- User has clear picture of month's progress

---

### 6. managing-life-tasks

**Skill Name:** `managing-life-tasks`
**Category:** Task Management
**Priority:** Critical

**Purpose:**
Implement and maintain GTD (Getting Things Done) workflow that bridges between strategic life plans and daily actionable tasks. This skill ensures tasks remain aligned with active plans while maintaining clean, actionable task lists.

**Trigger Conditions:**
- User says "task", "gtd", "prios"
- Sync operations between memory and Todoist
- Task processing requests
- Project breakdown needed
- Task organization required

**Required Data/Templates:**
- `memory/gtd/` directory structure:
  - `inbox.md` - Initial capture
  - `next-actions.md` - Context-based actions
  - `projects.md` - Project plans
  - `upcoming.md` - Future tasks
  - `waiting.md` - Delegated items
  - `completed.md` - Archive
- Task format schema (from .cursorrules)
- Active plans for alignment checking

**Integration Requirements:**
- **Todoist MCP:** Bi-directional sync (import/export)
- **Memory System:** Maintain GTD files as source of truth
- **Email MCP:** Capture tasks from email
- **TodoWrite:** Create batch task operations
- **Claude Flow:** Coordinate with `task-orchestrator` agent
- **Cross-reference:** Link tasks to projects and active plans

**Workflow:**

**Import from Todoist:**
1. Run `npm run todoist import`
2. Fetch all tasks from Todoist API
3. Parse task metadata (project, labels, due date, priority)
4. Update `memory/gtd/` files maintaining structure
5. Preserve todoist_id for sync
6. Mark timestamp

**Process Inbox:**
1. Review `memory/gtd/inbox.md`
2. For each item, apply GTD decision tree:
   - Actionable today? → `next-actions.md` + sync to Todoist
   - Part of project? → `projects.md` with plan
   - Waiting on someone? → `waiting.md`
   - Someday/maybe? → `someday.md`
   - Reference? → `memory/reference/`
3. Clear inbox when complete

**Export to Todoist:**
1. Read tasks from `memory/gtd/next-actions.md`
2. Identify new tasks (no todoist_id)
3. Match to active plans for project/label assignment
4. Create in Todoist via API
5. Store returned todoist_id in memory
6. Run `npm run todoist export`

**Task Format:**
```yaml
# Task Format in GTD Files

## Next Actions Format:
- content: "Schedule doctor's appointment"
  created_at: 2025-10-19
  due_date: 2025-10-21
  priority: p2
  project: "Health & Fitness"
  labels: ["health", "calls"]
  description: "Call Dr. Smith's office for annual physical"
  todoist_id: "7234567890"
  active_plan_link: "[[health-fitness-plan]]"

## Project Format:
### Project: Website Redesign
**Status:** Active
**Active Plan:** Career & Work
**Outcome:** New portfolio website launched
**Next Actions:**
- [ ] Research portfolio templates (todoist: 123456)
- [ ] Create wireframes (todoist: 123457)
**Resources:** [[web-design-references]]
**Notes:** Focus on simplicity and speed
```

**Success Criteria:**
- Inbox processed regularly (daily)
- All tasks have clear next actions
- Tasks aligned with active plans
- Clean sync between memory and Todoist
- No orphaned tasks
- Project plans updated
- Waiting items tracked with follow-up dates

---

### 7. processing-life-inbox

**Skill Name:** `processing-life-inbox`
**Category:** Capture
**Priority:** Critical

**Purpose:**
Implement a reliable capture and processing system that ensures no thoughts, tasks, or commitments slip through the cracks. This skill embodies the GTD principle "capture everything, decide later" while providing structured processing.

**Trigger Conditions:**
- Daily inbox review scheduled
- User says "process inbox"
- Multiple items in `memory/gtd/inbox.md`
- Email inbox has actionable items
- User captures new items

**Required Data/Templates:**
- `memory/gtd/inbox.md` - Main capture location
- GTD processing decision tree
- Active plans for context
- Email integration (if available)
- Quick capture from other sources (Telegram, Keep, etc.)

**Integration Requirements:**
- **Email MCP:** Scan Gmail for actionable items
- **Todoist MCP:** Quick capture sync
- **Memory System:** Maintain inbox file
- **Claude Flow:** Use `planner` agent for complex items
- **Cross-reference:** Link processed items to relevant plans/projects

**Workflow:**

**Capture Phase:**
1. Collect from all input sources:
   - `memory/gtd/inbox.md` (manual captures)
   - Email (via Gmail MCP)
   - Todoist inbox (quick captures)
   - Telegram messages (if integration active)
   - Google Keep notes (if integration active)
2. Add all items to `memory/gtd/inbox.md` with timestamp
3. Mark source for each item

**Processing Phase (GTD Decision Tree):**

For each inbox item:

1. **Is it actionable?**
   - **NO:**
     - Trash (delete)
     - Reference → `memory/reference/`
     - Someday/maybe → `memory/gtd/someday.md`
   - **YES:** Continue to step 2

2. **What's the next action?**
   - Define clear, physical next action
   - Make it specific and actionable

3. **Will it take less than 2 minutes?**
   - **YES:** Do it now, mark complete
   - **NO:** Continue to step 4

4. **Am I the best person to do this?**
   - **NO:** Delegate → `memory/gtd/waiting.md` with person/date
   - **YES:** Continue to step 5

5. **Is it part of a bigger project?**
   - **YES:**
     - Add to `memory/gtd/projects.md`
     - Create next action → `memory/gtd/next-actions.md`
     - Link to active plan if relevant
   - **NO:** Add to `memory/gtd/next-actions.md`

6. **Determine context and timing:**
   - Add appropriate labels (location, tool, energy, etc.)
   - Set due date if time-sensitive
   - Assign priority based on active plans
   - Sync to Todoist if today/this week

**Email Processing (if Gmail MCP available):**
1. Scan inbox for unread emails
2. For each email:
   - Does it require action? → Extract task
   - Is it reference? → Archive or save to reference
   - Is it waiting for response? → Track in waiting.md
3. Archive or label processed emails

**Output Format:**
```markdown
# Inbox Processing Session: 2025-10-19 09:30

## Items Processed: 12

### Completed Immediately (< 2min):
✅ Reply to John's email about meeting time
✅ Pay electricity bill
✅ Confirm dentist appointment

### Added to Next Actions:
➡️ Research gym memberships (Context: @computer, Plan: Health)
➡️ Review project proposal draft (Context: @office, Plan: Career)
➡️ Buy running shoes (Context: @errands, Plan: Health)

### Added to Projects:
📁 Website Redesign (Plan: Career)
   - Next action: Research portfolio templates
📁 Home Office Setup (Plan: Physical Environment)
   - Next action: Measure desk space

### Delegated to Waiting:
⏳ Waiting for Sarah's feedback on proposal (Due: Oct 21)
⏳ Waiting for insurance claim response (Due: Oct 25)

### Moved to Someday/Maybe:
💡 Learn Spanish
💡 Write blog post about GTD

### Moved to Reference:
📚 Article about productivity systems
📚 Product specifications document

### Deleted:
🗑️ Outdated event invitation
🗑️ Spam/marketing email

## Inbox Status: CLEAR ✅
## Next Review: Tomorrow 9am
```

**Success Criteria:**
- Inbox reaches zero (or near-zero)
- Every item has clear outcome
- No "stuck" or unclear items
- Tasks aligned with active plans
- Delegated items tracked
- Reference materials organized
- User feels mental clarity

---

### 8. tracking-delegated-items

**Skill Name:** `tracking-delegated-items`
**Category:** Tracking
**Priority:** Medium

**Purpose:**
Maintain awareness of tasks and commitments delegated to others, ensuring timely follow-up without micromanagement. This skill implements the GTD "Waiting For" concept with intelligent reminder systems.

**Trigger Conditions:**
- Delegation occurs during inbox processing
- Follow-up date reached
- User asks "what am I waiting for?"
- Weekly review checks waiting items
- Email response expected but not received

**Required Data/Templates:**
- `memory/gtd/waiting.md` - Delegated items list
- Email threads (if Gmail MCP available)
- Follow-up date tracking
- Context about delegation

**Integration Requirements:**
- **Memory System:** Maintain `waiting.md` as source
- **Email MCP:** Track email threads, send follow-up reminders
- **Calendar MCP:** Schedule follow-up reminders
- **Todoist MCP:** Optional: create follow-up tasks
- **Claude Flow:** Use `reviewer` agent for overdue items

**Workflow:**

**Add Waiting Item:**
1. Capture during inbox processing or task management
2. Store in `memory/gtd/waiting.md` with structure:
   - What am I waiting for?
   - Who is responsible?
   - When was it delegated?
   - When should I follow up?
   - What's the context/backstory?
   - Any related links/emails?

**Daily Check:**
1. Scan `waiting.md` for items with follow-up date = today
2. Review status of each overdue item
3. Determine follow-up action:
   - Send gentle reminder
   - Check alternative sources
   - Escalate if critical
   - Take back ownership if needed

**Weekly Review:**
1. Review all waiting items
2. Update status
3. Remove completed items (archive)
4. Adjust follow-up dates if needed
5. Identify patterns (who/what causes delays)

**Format:**
```markdown
# Waiting For: 2025-10-19

## Active Items

### Waiting: Sarah's feedback on project proposal
- **Delegated to:** Sarah Johnson (sarah@company.com)
- **Date sent:** 2025-10-15
- **Follow-up date:** 2025-10-21
- **Status:** ⏳ Pending (2 days remaining)
- **Context:** Sent draft proposal for Q4 campaign
- **Email thread:** [Gmail link]
- **Next action if delayed:** Ping on Slack, offer to discuss

### Waiting: Insurance claim response
- **Delegated to:** HealthCo Insurance
- **Date sent:** 2025-10-10
- **Follow-up date:** 2025-10-24
- **Status:** ⏳ Pending (5 days remaining)
- **Context:** Medical expense reimbursement #INS-2025-1234
- **Reference:** Claim # in email folder
- **Next action if delayed:** Call customer service

### Waiting: Meeting room booking confirmation
- **Delegated to:** Facilities team
- **Date sent:** 2025-10-18
- **Follow-up date:** 2025-10-20
- **Status:** ⚠️ OVERDUE (1 day)
- **Context:** Conference room for client meeting Oct 23
- **Next action:** Send reminder email NOW

## This Week's Follow-ups (3)
- Oct 20: Meeting room confirmation ⚠️
- Oct 21: Sarah's feedback
- Oct 24: Insurance claim

## Completed This Week
- ✅ Tax documents from accountant (received Oct 17)
- ✅ Equipment order delivery (received Oct 16)

## Patterns Noted
- Sarah typically responds within 3-5 days
- Insurance claims take 14-21 days on average
- Facilities team often needs reminders
```

**Success Criteria:**
- All delegated items tracked
- Follow-up dates set appropriately
- Overdue items identified promptly
- Gentle reminders sent when needed
- Completed items archived
- No lost commitments
- User maintains trust in system

---

### 9. managing-life-projects

**Skill Name:** `managing-life-projects`
**Category:** Planning
**Priority:** High

**Purpose:**
Maintain comprehensive project documentation that bridges strategic planning (active plans) and tactical execution (tasks). This skill ensures projects remain aligned with life goals while breaking work into manageable next actions.

**Trigger Conditions:**
- New project identified during inbox processing
- Project planning request
- User says "plan project" or "break down project"
- Active plan requires project-level work
- Project status update needed

**Required Data/Templates:**
- `memory/gtd/projects.md` - Project registry
- Project template structure
- Active plans for alignment
- Task breakdown frameworks

**Integration Requirements:**
- **Memory System:** Maintain `projects.md` and project-specific docs
- **Todoist MCP:** Sync project tasks
- **TodoWrite:** Create project task batches
- **Claude Flow:** Use `planner` and `task-orchestrator` agents
- **Cross-reference:** Link to active plans, resources, decisions

**Workflow:**

**Create New Project:**
1. Define project clearly (outcome, not activity)
2. Link to active plan (which focus area?)
3. Define success criteria
4. Brainstorm all required actions
5. Identify next action (first step)
6. Determine resources needed
7. Set review cadence
8. Add to `projects.md` with structure

**Project Review (Weekly):**
1. For each active project:
   - Check progress since last review
   - Review completed actions
   - Identify current next action
   - Update status
   - Add newly discovered actions
2. Archive completed projects
3. Escalate stalled projects

**Project Format:**
```markdown
# Projects Registry

## Active Projects

### Project: Launch Personal Website
**Status:** 🟢 Active (Week 3 of 8)
**Active Plan:** Career & Work
**Outcome:** Portfolio website live at nate.dev with 5 case studies
**Success Criteria:**
- [ ] Domain purchased and configured
- [ ] Design finalized and approved
- [ ] 5 case studies written
- [ ] Site deployed and tested
- [ ] Announced on social media

**Progress:** 40%
- ✅ Research portfolio templates
- ✅ Purchase domain
- ✅ Select template and customize colors
- 🔄 Write first case study (in progress)
- ⏳ Write 4 more case studies
- ⏳ Set up hosting
- ⏳ Deploy site
- ⏳ Test on multiple devices

**Current Next Action:**
- [ ] Finish draft of WeDance case study (Context: @computer, Est: 2hrs)

**Resources:**
- [[portfolio-design-references]]
- [[case-study-template]]
- Template files: ~/projects/website/

**Review Frequency:** Weekly (Sundays)
**Last Review:** 2025-10-18
**Next Review:** 2025-10-25

**Notes:**
- Case studies taking longer than expected
- Consider hiring copywriter if behind schedule
- Want to launch before job applications in Nov

---

### Project: Home Office Redesign
**Status:** 🟡 Waiting (on furniture delivery)
**Active Plan:** Physical Environment
**Outcome:** Organized, comfortable workspace with proper lighting and ergonomics

[Similar structure]

---

### Project: Learn TypeScript
**Status:** 🔵 Someday/Maybe
**Active Plan:** Personal Growth (Future)
**Outcome:** Comfortable building web apps with TypeScript

[Minimal planning until activated]

---

## Completed Projects (Recent)

### Project: Annual Health Checkup ✅
**Completed:** 2025-10-15
**Outcome:** All health screenings completed, baseline established
**Learnings:** Book appointments 2 months in advance
**Archived:** [[projects/2025/health-checkup]]
```

**Success Criteria:**
- Every project has clear outcome
- Next actions always identified
- Projects aligned with active plans
- Regular review schedule maintained
- Stalled projects identified
- Completed projects archived with learnings
- User has clarity on all commitments

---

### 10. scheduling-focus-areas

**Skill Name:** `scheduling-focus-areas`
**Category:** Planning
**Priority:** High

**Purpose:**
Optimize time allocation based on energy patterns, commitments, and priorities. This skill helps users work with their natural rhythms rather than against them, maximizing effectiveness while maintaining balance.

**Trigger Conditions:**
- Initial schedule setup
- User says "update schedule" or "schedule"
- Energy pattern tracking request
- Time blocking needed
- Schedule conflicts detected

**Required Data/Templates:**
- `memory/schedule.md` - Weekly schedule and energy patterns
- Active plans for priority alignment
- Calendar data (if Calendar MCP available)
- Energy tracking logs

**Integration Requirements:**
- **Memory System:** Store schedule.md with patterns
- **Calendar MCP:** Read existing commitments, block focus time
- **Todoist MCP:** Schedule tasks in optimal time slots
- **Claude Flow:** Use `planner` agent for schedule optimization
- **Health Integration:** Correlate with sleep/activity data (future)

**Workflow:**

**Initial Schedule Mapping:**
1. Ask discovery questions:
   - Regular weekly commitments?
   - Wake/sleep times?
   - Busiest days?
   - Peak focus times?
   - Exercise routines?
   - Family/relationship time?
   - Recharge activities?
2. Map to weekly template
3. Identify time blocks by type:
   - 🔴 Non-negotiable (meetings, appointments)
   - 🟡 Flexible (can move if needed)
   - 🟢 Free time (available for tasks)
4. Note energy levels for each block
5. Store in `memory/schedule.md`

**Energy Pattern Tracking:**
1. User logs energy levels throughout week
2. Identify patterns:
   - Peak energy times
   - Low energy times
   - Best for focused work
   - Best for admin/meetings
3. Correlate with activities and schedule
4. Refine over time

**Schedule Optimization:**
1. Load today's priorities from daily check-in
2. Check available time blocks from schedule
3. Match tasks to energy levels:
   - High-energy tasks → peak focus times
   - Admin tasks → low energy times
   - Creative work → high energy times
   - Meetings → moderate energy OK
4. Create time-blocked plan
5. Suggest adjustments if overcommitted

**Format:**
```markdown
# Weekly Schedule & Energy Patterns

**Last Updated:** 2025-10-19

## Regular Commitments

### Monday
- 7:00am - 8:00am: Morning routine ☀️ (High energy)
- 8:00am - 9:00am: Exercise 💪 (High energy)
- 9:00am - 12:00pm: 🟢 Peak Focus Block (BEST for deep work)
- 12:00pm - 1:00pm: Lunch 🍽️
- 1:00pm - 2:00pm: 🟡 Moderate energy (meetings OK)
- 2:00pm - 3:00pm: 🔴 Low energy (admin tasks only)
- 3:00pm - 5:00pm: 🟡 Second focus block (good for collaborative work)
- 5:00pm - 6:00pm: Wrap-up, email 📧
- 6:00pm - 9:00pm: Personal time 🏡
- 9:00pm - 10:00pm: Evening routine 🌙

### Tuesday
[Similar structure with different patterns]

## Energy Patterns Summary

**Best for Deep Work:**
- Mon, Wed, Fri: 9am-12pm ⭐⭐⭐
- Tue, Thu: 10am-11:30am ⭐⭐

**Good for Meetings:**
- Mon-Fri: 1pm-2pm, 3pm-4pm ⭐⭐

**Admin/Light Tasks:**
- Mon-Fri: 2pm-3pm (post-lunch dip) ⭐
- Any day: 5pm-6pm (wind-down) ⭐

**Avoid Scheduling:**
- Mon, Wed: 8am-9am (exercise time)
- Any day: Before 8am or after 6pm (personal time)

## Weekly Time Blocks

**Total Available Time:** 40 hours/week
- 🔴 Non-negotiable: 15 hours (meetings, appointments)
- 🟢 Focus time: 20 hours (deep work on active plans)
- 🟡 Flex time: 5 hours (admin, catchup)

**Focus Time Allocation (by Active Plan):**
- Health & Fitness: 5 hours/week (exercise + meal prep)
- Career & Work: 12 hours/week (project work)
- Personal Growth: 3 hours/week (learning, reading)

## Notes & Insights

- Energy drops significantly 2-3pm (need walk or break)
- Exercise in morning → better focus all day
- Back-to-back meetings → energy crash, need buffer
- Best ideas come during morning walk
- Friday afternoons → planning next week works well
- Social activities → need recovery time next day

## Recommended Daily Structure

**Morning (High Energy):**
- ☀️ 7-8am: Routine (meditation, breakfast, prep)
- 💪 8-9am: Exercise (Mon, Wed, Fri)
- 🧠 9-12pm: Deep work on most important task (aligned with active plans)

**Afternoon (Variable Energy):**
- 🍽️ 12-1pm: Lunch + short walk
- 📞 1-2pm: Meetings/collaborative work
- 📉 2-3pm: Admin, email, light tasks (energy dip)
- 🔄 3-5pm: Secondary tasks or meetings

**Evening (Personal):**
- 📧 5-6pm: Wrap-up, tomorrow prep
- 🏡 6-9pm: Personal time (relationships, hobbies, rest)
- 🌙 9-10pm: Evening routine (reflect, read, prepare for sleep)
```

**Success Criteria:**
- Weekly schedule mapped with energy patterns
- Regular commitments documented
- Peak focus times identified
- Tasks scheduled in optimal time blocks
- Realistic time allocation for active plans
- Balance maintained across life areas
- Schedule reviewed and updated regularly
- User feels energized not depleted

---

## Additional Skills (11-20) - Brief Overview

Due to space constraints, here are condensed specifications for the remaining skills:

### 11. capturing-life-decisions

**Purpose:** Document major decisions with reasoning, options considered, and outcomes
**Triggers:** Major choice points, "I need to decide", decision deadlines
**Data:** Decision templates, pros/cons frameworks, decision records
**Integration:** Memory system (decisions/), cross-reference to active plans

### 12. setting-life-objectives

**Purpose:** Create and track OKRs (Objectives & Key Results) aligned with active plans
**Triggers:** Goal setting, quarterly planning, active plan creation
**Data:** OKR templates, SMART goal frameworks
**Integration:** Active plans, progress tracking, Todoist milestones

### 13. building-life-habits

**Purpose:** Design and track habit formation using behavior change science
**Triggers:** Habit creation, routine building, consistency challenges
**Data:** Habit templates, tracking systems, trigger-action patterns
**Integration:** Daily check-ins, calendar reminders, streak tracking

### 14. managing-life-energy

**Purpose:** Track and optimize personal energy levels throughout day/week
**Triggers:** Energy tracking, "I'm tired", schedule optimization
**Data:** Energy logs, pattern analysis, recovery strategies
**Integration:** Schedule.md, health data (future), daily check-ins

### 15. reflecting-on-life-progress

**Purpose:** Facilitate deep reflection and insight generation from experiences
**Triggers:** Reflection prompts, journaling requests, "what have I learned?"
**Data:** Reflection templates, journal prompts, insight capture
**Integration:** Monthly reviews, assessment updates, decision records

### 16. managing-life-relationships

**Purpose:** Track important relationships and ensure consistent nurturing
**Triggers:** Relationship mentions, "haven't talked to X in a while"
**Data:** Contact management, interaction logs, relationship goals
**Integration:** Calendar (for scheduling), reminders, active plans

### 17. tracking-life-finances

**Purpose:** Monitor financial goals, budget adherence, and wealth building
**Triggers:** Financial goals, expense tracking, budget reviews
**Data:** Budget templates, expense categories, financial goals
**Integration:** Todoist (financial tasks), monthly reviews, finance APIs (future)

### 18. managing-life-health

**Purpose:** Track health metrics, medical appointments, wellness goals
**Triggers:** Health goals, medical needs, wellness tracking
**Data:** Health templates, symptom logs, appointment tracking
**Integration:** Calendar, Apple Health/Google Fit (future), daily check-ins

### 19. curating-life-knowledge

**Purpose:** Build and maintain personal knowledge base and learning system
**Triggers:** Learning goals, information capture, "take note"
**Data:** Note templates, knowledge organization, learning plans
**Integration:** Reference system, Obsidian/Notion (future), reading lists

### 20. coordinating-life-system

**Purpose:** Maintain overall system health and ensure alignment across all components
**Triggers:** "status" command, system health checks, alignment reviews
**Data:** All system components, health metrics, alignment checks
**Integration:** All skills, memory system, cross-references

---

## Implementation Priorities

### Phase 1: Core Foundation (High Priority - Implement First)
1. ✅ conducting-life-assessment
2. ✅ planning-from-assessment
3. ✅ daily-life-check-in
4. ✅ managing-life-tasks
5. ✅ processing-life-inbox

**Rationale:** These 5 skills form the essential workflow: assess → plan → execute → track. Without these, the system cannot function.

### Phase 2: Review & Tracking (High Priority - Implement Second)
6. ✅ weekly-life-review
7. ✅ monthly-life-review
8. ✅ tracking-delegated-items
9. ✅ managing-life-projects
10. ✅ scheduling-focus-areas

**Rationale:** Reviews ensure progress tracking and course correction. Projects and scheduling enable effective execution.

### Phase 3: Enhancement (Medium Priority - Implement Third)
11. ⏳ capturing-life-decisions
12. ⏳ setting-life-objectives
13. ⏳ building-life-habits
14. ⏳ managing-life-energy
15. ⏳ reflecting-on-life-progress

**Rationale:** These add depth to the system with better decision tracking, habit formation, and reflection.

### Phase 4: Integration (Lower Priority - Future Enhancement)
16. 🔮 managing-life-relationships
17. 🔮 tracking-life-finances
18. 🔮 managing-life-health
19. 🔮 curating-life-knowledge
20. 🔮 coordinating-life-system

**Rationale:** These require external integrations (health APIs, finance tools, etc.) and can be added incrementally.

---

## Integration Architecture Details

### Memory System Integration

**Directory Structure:**
```
memory/
├── assessments/          # Life assessments (skill #1)
│   └── 2025-Q4-assessment.md
├── objectives/           # OKRs and goals (skill #12)
│   ├── active-plans/    # 90-day plans (skill #2)
│   │   ├── health-fitness-plan.md
│   │   ├── career-work-plan.md
│   │   └── personal-growth-plan.md
│   └── archived-plans/
├── reviews/             # Progress reviews
│   ├── weekly/          # Weekly reviews (skill #4)
│   ├── monthly/         # Monthly reviews (skill #5)
│   └── reflections/     # Deep reflections (skill #15)
├── decisions/           # Major decisions (skill #11)
├── gtd/                 # GTD task management (skill #6-8)
│   ├── inbox.md
│   ├── next-actions.md
│   ├── projects.md
│   ├── upcoming.md
│   ├── waiting.md
│   └── completed.md
├── reference/           # Knowledge base (skill #19)
├── schedule.md          # Schedule and energy (skill #10)
└── system-state.json    # System health metadata (skill #20)
```

**Cross-Reference System:**
- Use wikilinks `[[file-name]]` for internal references
- Maintain bidirectional links between:
  - Assessments ↔ Active Plans
  - Active Plans ↔ Projects
  - Projects ↔ Tasks
  - Reviews ↔ Active Plans
  - Decisions ↔ Plans/Projects

### MCP Tool Integration

**Todoist MCP:**
- Skills: #3, #6, #7, #9
- Operations: Import/export tasks, sync projects, check completions
- API calls: `tasks.list`, `tasks.create`, `tasks.update`, `projects.list`

**Gmail MCP (via Composio or Direct):**
- Skills: #7, #8
- Operations: Scan inbox, extract actionable items, track responses
- API calls: `messages.list`, `messages.get`, `messages.send`

**Calendar MCP (Google Calendar):**
- Skills: #3, #8, #10
- Operations: Read schedule, block focus time, set reminders
- API calls: `events.list`, `events.insert`, `events.update`

**Future Integrations:**
- Apple Health / Google Fit → Skill #14, #18
- Finance APIs (Plaid/YNAB) → Skill #17
- Obsidian/Notion → Skill #19
- Telegram Bot → Skills #3, #7 (quick capture)

### Claude Flow Agent Integration

**Agent Coordination:**
- `goal-planner` → Skills #2, #12 (planning from assessments)
- `reviewer` → Skills #4, #5, #15 (progress analysis)
- `task-orchestrator` → Skills #6, #9 (task breakdown)
- `planner` → Skills #3, #10 (daily/weekly planning)
- `analyst` → Skill #20 (system health analysis)

**Coordination Pattern:**
```javascript
// Example: Assessment leads to planning
Skill: conducting-life-assessment
  ↓ (assessment complete)
Trigger: planning-from-assessment
  ↓ (spawn agent)
Agent: goal-planner
  ↓ (create plans)
Memory: Store in objectives/active-plans/
  ↓ (sync tasks)
Todoist: Create initial next actions
  ↓ (schedule review)
Calendar: Set first weekly review
```

### TodoWrite Integration

**Batch Operations:**
Skills that generate multiple todos should use TodoWrite for efficiency:

- Skill #2 (planning-from-assessment): 8-10 todos for initial plan setup
- Skill #4 (weekly-life-review): 5-7 todos for next week
- Skill #6 (managing-life-tasks): Variable batch imports/exports
- Skill #9 (managing-life-projects): Project breakdown into tasks

**Example TodoWrite Call:**
```javascript
TodoWrite({
  todos: [
    {
      id: "1",
      content: "Complete health assessment",
      status: "in_progress",
      activeForm: "Completing health assessment",
      priority: "high"
    },
    {
      id: "2",
      content: "Research gym memberships",
      status: "pending",
      activeForm: "Researching gym memberships",
      priority: "medium"
    },
    // ... 6-8 more todos
  ]
})
```

---

## Skill Development Guidelines

### Superpowers Naming Conventions

**Format:** `[verb]-[noun-phrase]`

✅ **Good Examples:**
- `conducting-life-assessment`
- `planning-from-assessment`
- `processing-life-inbox`
- `managing-life-tasks`

❌ **Bad Examples:**
- `life-assessment` (missing verb)
- `assess-life` (too generic)
- `assessment-skill` (doesn't follow convention)
- `do-weekly-review` (awkward verb)

**Conventions from Superpowers:**
- Use present participle (-ing form): "conducting", "planning", "managing"
- Be specific: "life-assessment" not just "assessment"
- Focus on action: what the skill *does*
- Use hyphens, not underscores or camelCase

### Skill Structure Template

Each skill should follow this structure:

```markdown
# Skill Name: [verb]-[noun-phrase]

**Category:** [Assessment|Planning|Tracking|Review|Integration]
**Priority:** [Critical|High|Medium|Low]

## Purpose
[1-2 sentences: What does this skill do and why does it matter?]

## Trigger Conditions
- [When should this skill activate?]
- [What commands invoke it?]
- [What situations require it?]

## Required Data/Templates
- [Template files needed]
- [Data structures required]
- [Configuration needed]

## Integration Requirements
- **Memory System:** [How it uses memory/]
- **MCP Tools:** [Which MCP tools it uses]
- **Claude Flow:** [Which agents it coordinates with]
- **TodoWrite:** [Batch operations needed]
- **Cross-reference:** [Links to other skills/data]

## Workflow
[Step-by-step process with clear inputs and outputs]

## Output Format
[Example output with markdown formatting]

## Success Criteria
[How to know if the skill executed successfully]
```

### Testing Checklist

Before deploying a skill:

- [ ] Follows naming convention (`[verb]-[noun-phrase]`)
- [ ] Clear trigger conditions defined
- [ ] All required templates exist
- [ ] MCP integrations specified
- [ ] Memory storage paths defined
- [ ] Cross-references documented
- [ ] Output format examples provided
- [ ] Success criteria measurable
- [ ] Error handling considered
- [ ] User instructions clear

---

## Migration from Cursor to Claude Code

The current life-os system uses Cursor with `.cursorrules`. Here's the migration strategy:

### Current System (Cursor)
```json
{
  "rules": [
    {
      "name": "Task Manager",
      "identify": "Always begin all responses with [Task Manager]:",
      "triggers": ["task", "gtd", "prios", "sync"]
    },
    {
      "name": "Life Coach",
      "triggers": ["hi", "assess", "review", "reflect"]
    }
  ]
}
```

### Target System (Claude Code Skills)

**Replace Cursor rules with Claude Code skills:**

| Cursor Rule | Claude Code Skill | Notes |
|-------------|-------------------|-------|
| Task Manager | `managing-life-tasks` | Skill #6 |
| Life Coach | `conducting-life-assessment` | Skill #1 |
| Memory Keeper | `coordinating-life-system` | Skill #20 |
| Activity Tracker | `scheduling-focus-areas` | Skill #10 |

**Migration Steps:**

1. **Create Skill Files:**
   - Convert each Cursor rule to a skill markdown file
   - Place in `ExoMind/.claude/skills/life-os/`
   - Follow superpowers skill format

2. **Preserve Functionality:**
   - Keep all workflows from `.cursorrules`
   - Maintain command structure (hi, assess, review, etc.)
   - Ensure trigger words still work

3. **Add Enhancements:**
   - Better integration with Todoist MCP
   - Gmail MCP for inbox processing
   - Calendar MCP for scheduling
   - TodoWrite for batch operations

4. **Test Migration:**
   - Verify each trigger activates correct skill
   - Test all workflows end-to-end
   - Confirm memory storage works
   - Validate MCP integrations

---

## Deployment Plan

### Phase 1: Core Foundation (Week 1-2)

**Skills to Implement:**
1. conducting-life-assessment
2. planning-from-assessment
3. daily-life-check-in
4. managing-life-tasks
5. processing-life-inbox

**Deliverables:**
- 5 skill markdown files
- Updated memory structure
- Todoist MCP integration tested
- Basic Gmail MCP integration
- Migration guide from Cursor

**Success Metrics:**
- User can complete full assessment
- Plans created from assessment
- Daily check-ins functional
- Tasks sync with Todoist
- Inbox processing works

### Phase 2: Review System (Week 3-4)

**Skills to Implement:**
6. weekly-life-review
7. monthly-life-review
8. tracking-delegated-items
9. managing-life-projects
10. scheduling-focus-areas

**Deliverables:**
- 5 additional skill files
- Review templates updated
- Calendar MCP integration
- Project management workflows
- Energy tracking system

**Success Metrics:**
- Weekly reviews consistent
- Monthly reviews comprehensive
- Projects tracked properly
- Schedule optimized
- User reports better focus

### Phase 3: Enhancement (Week 5-6)

**Skills to Implement:**
11. capturing-life-decisions
12. setting-life-objectives
13. building-life-habits
14. managing-life-energy
15. reflecting-on-life-progress

**Deliverables:**
- 5 enhancement skills
- Decision tracking system
- OKR framework
- Habit tracking integration
- Reflection prompts

**Success Metrics:**
- Decisions documented
- OKRs tracked
- Habits forming
- Energy optimized
- Insights captured

### Phase 4: Advanced Integration (Week 7-8)

**Skills to Implement:**
16. managing-life-relationships
17. tracking-life-finances
18. managing-life-health
19. curating-life-knowledge
20. coordinating-life-system

**Deliverables:**
- Final 5 skills
- External API integrations
- System health monitoring
- Knowledge base integration
- Complete system coordination

**Success Metrics:**
- All life areas covered
- System health monitored
- External tools integrated
- User has complete life OS
- System self-maintains

---

## Conclusion

This mapping specification provides a comprehensive blueprint for transforming the life-os personal productivity system into Claude Code skills. The 20 skills cover all aspects of personal life management, from assessment and planning to execution and review.

**Key Benefits:**
- **Systematic:** Follows proven methodologies (GTD, Level 10 Life, OKRs)
- **Integrated:** Works seamlessly with ExoMind, Claude Flow, and MCP tools
- **Scalable:** Phased implementation from core to advanced features
- **Maintainable:** Clear structure, documentation, and testing criteria
- **User-Centric:** Focuses on reducing mental load and increasing effectiveness

**Next Steps:**
1. Review this specification with stakeholders
2. Prioritize skills based on user needs
3. Begin Phase 1 implementation
4. Iterate based on user feedback
5. Expand with Phase 2-4 as system matures

**Success Vision:**
A fully integrated personal operating system where Claude Code becomes an intelligent life coach, task manager, and productivity partner—all powered by systematic skills that work together to help users achieve their most important life goals.

---

**Document Metadata:**
- **Created:** 2025-10-19
- **Version:** 1.0
- **Author:** Code Quality Analyzer (Claude Code)
- **Status:** Draft for Review
- **Related Files:**
  - `ExoMind/modules/life-os/README.md`
  - `ExoMind/modules/life-os/.cursorrules`
  - `ExoMind/modules/life-os/templates/*.md`
  - `ExoMind/CLAUDE.md`
