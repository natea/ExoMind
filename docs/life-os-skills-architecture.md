# Life-OS Skills Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     LIFE-OS CLAUDE SKILLS                        │
│                    (20 Systematic Skills)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌──────────────────┐                    ┌──────────────────┐
│   ASSESSMENT     │                    │    EXECUTION     │
│    & PLANNING    │                    │   & TRACKING     │
│                  │                    │                  │
│  Skill 1: Assess │                    │ Skill 3: Daily   │
│  Skill 2: Plan   │◄───────────────────┤ Skill 6: Tasks   │
│  Skill 12: OKRs  │                    │ Skill 7: Inbox   │
│  Skill 9: Projects│                   │ Skill 8: Waiting │
│  Skill 10: Schedule│                  │ Skill 13: Habits │
└────────┬──────────┘                   └────────┬─────────┘
         │                                        │
         │                                        │
         │     ┌────────────────────┐            │
         └─────►    REVIEW &        ◄────────────┘
               │   REFLECTION       │
               │                    │
               │ Skill 4: Weekly    │
               │ Skill 5: Monthly   │
               │ Skill 15: Reflect  │
               └──────────┬─────────┘
                          │
                          │
                          ▼
               ┌────────────────────┐
               │   INTEGRATION &    │
               │   COORDINATION     │
               │                    │
               │ Skill 11: Decisions│
               │ Skill 20: System   │
               │ Skill 16-19: Areas │
               └────────────────────┘
```

---

## Detailed Skill Flow

### Primary Flow: Assessment → Planning → Execution → Review

```
START: User needs direction
        │
        ▼
┌─────────────────────────────────────┐
│ Skill 1: conducting-life-assessment │
│ - 10 life areas scored              │
│ - Top 3 focus areas identified      │
│ - Stored in memory/assessments/     │
└────────────────┬────────────────────┘
                 │ (assessment complete)
                 ▼
┌─────────────────────────────────────┐
│ Skill 2: planning-from-assessment   │
│ - 3 active plans created (90-day)   │
│ - Objectives and milestones set     │
│ - Stored in memory/objectives/      │
└────────────────┬────────────────────┘
                 │ (plans created)
                 ▼
┌─────────────────────────────────────┐
│ Skill 3: daily-life-check-in        │
│ - Morning: priorities identified     │
│ - Evening: progress tracked          │
│ - Progress markers logged            │
└────────────────┬────────────────────┘
                 │ (daily execution)
                 ▼
┌─────────────────────────────────────┐
│ Skill 6: managing-life-tasks        │
│ - Tasks synced with Todoist          │
│ - GTD workflow maintained            │
│ - Tasks aligned with plans           │
└────────────────┬────────────────────┘
                 │ (after 7 days)
                 ▼
┌─────────────────────────────────────┐
│ Skill 4: weekly-life-review         │
│ - Progress analyzed                  │
│ - Patterns identified                │
│ - Next week planned                  │
└────────────────┬────────────────────┘
                 │ (after 4 weeks)
                 ▼
┌─────────────────────────────────────┐
│ Skill 5: monthly-life-review        │
│ - Plan progress evaluated            │
│ - Plans adjusted if needed           │
│ - System health checked              │
└────────────────┬────────────────────┘
                 │ (after 3 months)
                 ▼
┌─────────────────────────────────────┐
│ Skill 1: conducting-life-assessment │
│ - New assessment                     │
│ - Compare to previous                │
│ - Celebrate progress!                │
└─────────────────────────────────────┘
```

---

## Supporting Flows

### Flow A: Inbox Processing

```
Multiple Sources
├── Email (Gmail MCP)
├── Todoist Quick Capture
├── Telegram Messages
├── Google Keep Notes
└── Manual Entry
        │
        ▼
┌─────────────────────────────────────┐
│ Skill 7: processing-life-inbox      │
│ - Apply GTD decision tree            │
│ - Categorize items                   │
│ - Clear inbox to zero                │
└────────────────┬────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│ Actionable   │  │  Not Actionable  │
│              │  │                  │
│ → Skill 6    │  │ → Reference      │
│   (Tasks)    │  │ → Someday/Maybe  │
│              │  │ → Trash          │
└──────┬───────┘  └──────────────────┘
       │
       ├─► Do Now (< 2 min)
       ├─► Delegate → Skill 8 (waiting)
       ├─► Project → Skill 9 (projects)
       └─► Next Action → Todoist
```

### Flow B: Project Management

```
┌─────────────────────────────────────┐
│ Skill 9: managing-life-projects     │
│ - Define project outcome             │
│ - Break into actions                 │
│ - Link to active plan                │
└────────────────┬────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│ Next Actions │  │ Project Plan     │
│              │  │                  │
│ → Skill 6    │  │ → memory/gtd/    │
│   (Tasks)    │  │   projects.md    │
│ → Todoist    │  │                  │
└──────────────┘  └──────────────────┘
```

### Flow C: Energy Optimization

```
┌─────────────────────────────────────┐
│ Skill 10: scheduling-focus-areas    │
│ - Map weekly schedule                │
│ - Identify energy patterns           │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Skill 14: managing-life-energy      │
│ - Track energy throughout day        │
│ - Correlate with activities          │
│ - Identify optimal times             │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Skill 3: daily-life-check-in        │
│ - Schedule tasks in peak times       │
│ - Match task energy to time energy   │
│ - Optimize for effectiveness         │
└─────────────────────────────────────┘
```

---

## Integration Architecture

### Layer 1: Skills (Coordination Layer)

```
┌──────────────────────────────────────────────────────────┐
│              CLAUDE CODE SKILLS (20)                     │
│  [Assessment] [Planning] [Tracking] [Review] [Integration]│
└────────────────────────────┬─────────────────────────────┘
                             │ Coordinate workflows
                             │
```

### Layer 2: Core System (Data & Logic Layer)

```
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                    LIFE-OS CORE                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Templates│  │  Memory  │  │  Rules   │              │
│  │          │  │          │  │          │              │
│  │ *.md     │  │ memory/* │  │.cursorrules│            │
│  └──────────┘  └──────────┘  └──────────┘             │
└────────────────────────────┬─────────────────────────────┘
                             │ Data storage & retrieval
                             │
```

### Layer 3: MCP Tools (Integration Layer)

```
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                    MCP INTEGRATIONS                      │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│  │Todoist │ │ Gmail  │ │Calendar│ │ Health │ (future)│
│  │  API   │ │  API   │ │  API   │ │  APIs  │          │
│  └────────┘ └────────┘ └────────┘ └────────┘          │
└────────────────────────────┬─────────────────────────────┘
                             │ External tool sync
                             │
```

### Layer 4: Claude Flow (Orchestration Layer)

```
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                  CLAUDE FLOW AGENTS                      │
│  ┌────────────┐ ┌──────────┐ ┌───────────────┐        │
│  │goal-planner│ │ reviewer │ │task-orchestrator│        │
│  │            │ │          │ │               │        │
│  └────────────┘ └──────────┘ └───────────────┘        │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### Example 1: Morning Check-in

```
User: "What should I focus on today?"
        │
        ▼
Skill 3: daily-life-check-in
        │
        ├─► Read: memory/objectives/active-plans/*.md
        ├─► Call: Todoist MCP (fetch today's tasks)
        ├─► Read: memory/schedule.md (energy patterns)
        │
        ▼
Analysis: Match tasks to energy, prioritize by plan
        │
        ▼
Output:
├─► 3-5 priority tasks
├─► Time blocks suggested
├─► Energy-matched schedule
└─► Daily intention set
```

### Example 2: Weekly Review

```
User: "Let's do my weekly review"
        │
        ▼
Skill 4: weekly-life-review
        │
        ├─► Read: memory/objectives/active-plans/*.md
        ├─► Read: memory/reviews/daily/* (past 7 days)
        ├─► Call: Todoist MCP (completed tasks)
        ├─► Call: Calendar MCP (past week events)
        │
        ▼
Analysis:
├─► Progress on each active plan
├─► Milestone tracking
├─► Pattern identification
├─► Wins and challenges
│
        ▼
Output:
├─► Weekly review document
├─► Next week priorities
├─► Plan adjustments (if needed)
└─► TodoWrite: Next week action items
```

### Example 3: Full Assessment Cycle

```
Quarter Start: User triggers assessment
        │
        ▼
Skill 1: conducting-life-assessment
├─► Load: templates/assessment.md
├─► Read: memory/assessments/*.md (previous)
└─► Guide user through 10 areas
        │
        ▼
Total: 67/100, Focus: Health(4), Career(5), Growth(6)
        │
        ▼
Skill 2: planning-from-assessment
├─► Create: 3 active plans (90-day)
├─► Define: Objectives & milestones
├─► Generate: Initial next actions
├─► Call: Todoist MCP (sync tasks)
└─► Call: Calendar MCP (schedule reviews)
        │
        ▼
3 Active Plans Created:
├─► Health & Fitness Plan
├─► Career & Work Plan
└─► Personal Growth Plan
        │
        ▼
Daily Execution Loop:
        ├─► Skill 3 (check-in) [daily]
        ├─► Skill 6 (tasks) [daily]
        ├─► Skill 4 (weekly review) [weekly]
        ├─► Skill 5 (monthly review) [monthly]
        └─► Skill 1 (reassess) [quarterly] ──┐
                                              │
                                              └─► LOOP
```

---

## Cross-References Between Skills

### Primary Dependencies

```
Skill 1 (assessment)
    ├─► Skill 2 (planning)
    │       ├─► Skill 3 (daily check-in)
    │       ├─► Skill 6 (tasks)
    │       ├─► Skill 9 (projects)
    │       └─► Skill 10 (schedule)
    │
    └─► Skill 4 (weekly review)
            └─► Skill 5 (monthly review)
                    └─► Skill 1 (reassess)
```

### Supporting Dependencies

```
Skill 6 (tasks)
    ├─► Skill 7 (inbox) [source]
    ├─► Skill 8 (waiting) [delegates]
    └─► Skill 9 (projects) [breaks down]

Skill 10 (schedule)
    └─► Skill 14 (energy) [optimizes]
            └─► Skill 3 (daily) [applies]

Skill 11 (decisions)
    └─► Links to: Skills 2, 5, 9 [documents]

Skill 15 (reflection)
    └─► Feeds: Skills 1, 4, 5 [insights]
```

### Integration Skills (Support All)

```
Skill 20 (coordination)
    ├─► Monitors: All skills
    ├─► Health: System state
    └─► Aligns: Cross-references

Skill 16 (relationships)
Skill 17 (finances)
Skill 18 (health)
Skill 19 (knowledge)
    └─► All integrate with relevant primary skills
```

---

## Memory Structure & Skills Mapping

```
memory/
│
├── assessments/              ← Skill 1
│   ├── 2025-Q1.md
│   ├── 2025-Q2.md
│   ├── 2025-Q3.md
│   └── 2025-Q4.md
│
├── objectives/
│   ├── active-plans/         ← Skill 2
│   │   ├── health-fitness.md
│   │   ├── career-work.md
│   │   └── personal-growth.md
│   │
│   └── okrs/                 ← Skill 12
│       └── 2025-Q4-okrs.md
│
├── reviews/
│   ├── weekly/               ← Skill 4
│   │   ├── 2025-W42.md
│   │   └── 2025-W43.md
│   │
│   ├── monthly/              ← Skill 5
│   │   ├── 2025-10.md
│   │   └── 2025-11.md
│   │
│   └── reflections/          ← Skill 15
│       └── 2025-10-insights.md
│
├── gtd/
│   ├── inbox.md              ← Skill 7
│   ├── next-actions.md       ← Skill 6
│   ├── projects.md           ← Skill 9
│   ├── upcoming.md           ← Skill 6
│   ├── waiting.md            ← Skill 8
│   └── completed.md          ← Skill 6
│
├── decisions/                ← Skill 11
│   └── 2025-career-change.md
│
├── reference/                ← Skill 19
│   ├── learning/
│   ├── resources/
│   └── notes/
│
├── schedule.md               ← Skill 10
└── system-state.json         ← Skill 20
```

---

## Skill Coordination Patterns

### Pattern 1: Sequential Execution

```
Skill A (completes)
    → Triggers Skill B (starts)
        → Triggers Skill C (starts)
            → Returns to Skill A (next cycle)
```

Example: Assessment → Planning → Execution → Review

### Pattern 2: Parallel Support

```
        Skill X (primary)
            ↓
    ┌───────┼───────┐
    ▼       ▼       ▼
Skill A  Skill B  Skill C (supporting)
    └───────┼───────┘
            ▼
        Result
```

Example: Daily check-in uses Tasks, Schedule, and Energy simultaneously

### Pattern 3: Feedback Loop

```
Skill A → Skill B → Skill C
    ↑                   ↓
    └───────────────────┘
```

Example: Assessment → Plans → Reviews → Assessment

### Pattern 4: Hub & Spoke

```
        Skill 20 (hub)
            ↓
    ┌───┬───┼───┬───┐
    ▼   ▼   ▼   ▼   ▼
    1   2   3   4   5 (spokes)
    └───┴───┴───┴───┘
            ↑
        Reports
```

Example: System Coordination monitors all skills

---

## Success Flow Visualization

### Ideal User Journey (First 90 Days)

```
Day 1: Initial Assessment
├─► Skill 1: Complete assessment
├─► Skill 2: Create 3 active plans
└─► Skill 3: First daily check-in

Week 1: Building Rhythm
├─► Skill 3: Daily check-ins (7x)
├─► Skill 6: Task management daily
├─► Skill 7: Inbox processing daily
└─► Skill 4: First weekly review

Month 1: Establishing Patterns
├─► Skill 3: Daily check-ins (30x)
├─► Skill 4: Weekly reviews (4x)
├─► Skill 9: Projects defined
├─► Skill 10: Schedule optimized
└─► Skill 5: First monthly review

Quarter 1 (90 days): Full Cycle
├─► Skill 3: 90 daily check-ins
├─► Skill 4: 13 weekly reviews
├─► Skill 5: 3 monthly reviews
├─► Skills 11-19: Additional tracking
└─► Skill 1: Reassessment
        │
        ├─► Health: 4 → 7 (+3) ✓
        ├─► Career: 5 → 8 (+3) ✓
        └─► Growth: 6 → 8 (+2) ✓
```

---

## Error Handling & Recovery

### Common Failure Points

```
┌────────────────────────────┐
│ User misses daily check-in │
├────────────────────────────┤
│ Recovery: Skill 4 (weekly) │
│ catches up on missed days  │
└────────────────────────────┘

┌────────────────────────────┐
│ Todoist sync fails         │
├────────────────────────────┤
│ Recovery: Skill 6 uses     │
│ memory/gtd as source       │
│ of truth, re-syncs later   │
└────────────────────────────┘

┌────────────────────────────┐
│ Plans get off track        │
├────────────────────────────┤
│ Recovery: Skill 5 (monthly)│
│ identifies drift, adjusts  │
│ plans, resets expectations │
└────────────────────────────┘
```

---

## Skill Activation Matrix

| Trigger Type | Skills Activated | Priority |
|--------------|------------------|----------|
| Time-based | 3, 4, 5, 8 | Auto |
| User command | 1, 2, 6, 7, 9-20 | On-demand |
| System event | 20 | Background |
| Completion event | 2→1, 7→6, 9→6 | Auto |
| MCP callback | 6, 7, 8 | Event-driven |

---

**Legend:**
- ✅ Implemented
- ⏳ In Progress
- 📋 Planned
- 🔮 Future

**Last Updated:** 2025-10-19
**Next Review:** After Phase 1 Implementation
