# Life-OS Claude Skills Architecture

## Overview

This document defines the organizational structure for life-os functionality as Claude Skills, mirroring the proven patterns from the superpowers module. The life-os skills will enable personal productivity, life management, and goal tracking capabilities within Claude Code.

## Analysis of Superpowers Structure

### Key Patterns Identified

1. **Directory Organization**
   - Flat skills directory with descriptive folder names
   - Each skill has its own subdirectory containing `SKILL.md`
   - Commands directory for slash command wrappers
   - Hooks directory for session automation
   - Plugin configuration in `.claude-plugin/`

2. **SKILL.md Format**
   ```yaml
   ---
   name: skill-name
   description: One-line description for when to use this skill
   ---

   # Skill Name

   ## Overview
   ## When to Use
   ## The Iron Law (for rigid workflows)
   ## Step-by-Step Instructions
   ## Examples
   ## Red Flags
   ## Common Rationalizations
   ## Verification Checklist
   ```

3. **Skill Categories** (implicit, not directory-based)
   - **Testing**: TDD, async patterns, anti-patterns
   - **Debugging**: Systematic debugging, root cause tracing, verification
   - **Collaboration**: Brainstorming, planning, code review, parallel agents
   - **Development**: Git worktrees, finishing branches, subagent workflows
   - **Meta**: Creating, testing, and sharing skills

4. **Activation Patterns**
   - **SessionStart hooks**: Auto-load core skills (`using-superpowers`)
   - **Automatic discovery**: Skills activate when relevant to task
   - **Slash commands**: Explicit invocation (`/superpowers:brainstorm`)
   - **Mandatory workflows**: Required when skill exists for task

## Proposed Life-OS Skills Structure

### Directory Layout

```
modules/life-os/
├── .claude-plugin/
│   └── plugin.json                    # Plugin metadata
├── hooks/
│   ├── hooks.json                     # Hook configuration
│   └── session-start.sh               # Session initialization
├── commands/
│   ├── daily-review.md                # /life-os:daily-review
│   ├── weekly-planning.md             # /life-os:weekly-planning
│   ├── goal-tracking.md               # /life-os:goal-tracking
│   └── time-blocking.md               # /life-os:time-blocking
├── skills/
│   # Productivity Skills
│   ├── using-life-os/
│   │   └── SKILL.md                   # Core introduction skill
│   ├── daily-planning/
│   │   └── SKILL.md
│   ├── weekly-review/
│   │   └── SKILL.md
│   ├── monthly-reflection/
│   │   └── SKILL.md
│   ├── time-blocking/
│   │   └── SKILL.md
│   ├── energy-management/
│   │   └── SKILL.md
│   ├── focus-sessions/
│   │   └── SKILL.md
│   │
│   # Goal Management Skills
│   ├── goal-setting/
│   │   └── SKILL.md
│   ├── milestone-tracking/
│   │   └── SKILL.md
│   ├── habit-formation/
│   │   └── SKILL.md
│   ├── progress-review/
│   │   └── SKILL.md
│   ├── obstacle-analysis/
│   │   └── SKILL.md
│   │
│   # Decision Making Skills
│   ├── priority-matrix/
│   │   └── SKILL.md
│   ├── decision-framework/
│   │   └── SKILL.md
│   ├── tradeoff-analysis/
│   │   └── SKILL.md
│   ├── commitment-evaluation/
│   │   └── SKILL.md
│   │
│   # Health & Wellbeing Skills
│   ├── sleep-tracking/
│   │   └── SKILL.md
│   ├── exercise-planning/
│   │   └── SKILL.md
│   ├── stress-management/
│   │   └── SKILL.md
│   ├── boundary-setting/
│   │   └── SKILL.md
│   │
│   # Relationship Skills
│   ├── social-energy-audit/
│   │   └── SKILL.md
│   ├── communication-planning/
│   │   └── SKILL.md
│   ├── conflict-preparation/
│   │   └── SKILL.md
│   │
│   # Financial Skills
│   ├── expense-analysis/
│   │   └── SKILL.md
│   ├── budget-planning/
│   │   └── SKILL.md
│   ├── financial-goals/
│   │   └── SKILL.md
│   │
│   # Learning Skills
│   ├── learning-goals/
│   │   └── SKILL.md
│   ├── knowledge-synthesis/
│   │   └── SKILL.md
│   ├── skill-development/
│   │   └── SKILL.md
│   │
│   # Meta Skills
│   ├── creating-life-os-skills/
│   │   └── SKILL.md
│   ├── sharing-life-os-skills/
│   │   └── SKILL.md
│   └── testing-life-os-skills/
│       └── SKILL.md
├── lib/
│   └── shared-utilities.sh            # Shared helper functions
├── README.md                           # Module documentation
└── LICENSE                             # License file
```

### Skill Categories

#### 1. Productivity Skills (7 skills)
**Purpose**: Daily execution and time management

- **using-life-os** - Core introduction to life-os system (mandatory, SessionStart)
- **daily-planning** - Morning planning routine with MIT identification
- **weekly-review** - GTD-style weekly review process
- **monthly-reflection** - Higher-level strategic review
- **time-blocking** - Calendar-based task allocation
- **energy-management** - Match tasks to energy levels
- **focus-sessions** - Deep work session structure

**Activation**: Auto-discover based on time-of-day or planning keywords

#### 2. Goal Management Skills (5 skills)
**Purpose**: Long-term direction and progress

- **goal-setting** - SMART goal creation and breakdown
- **milestone-tracking** - Progress monitoring and adjustment
- **habit-formation** - Systematic habit building (Atomic Habits-inspired)
- **progress-review** - Regular goal check-ins
- **obstacle-analysis** - Identify and resolve blockers

**Activation**: Keywords like "goal", "progress", "habit"

#### 3. Decision Making Skills (4 skills)
**Purpose**: Structured decision processes

- **priority-matrix** - Eisenhower matrix application
- **decision-framework** - Systematic decision-making process
- **tradeoff-analysis** - Structured comparison of options
- **commitment-evaluation** - Say yes/no decision process

**Activation**: Keywords like "decide", "choose", "priority", "should I"

#### 4. Health & Wellbeing Skills (4 skills)
**Purpose**: Physical and mental health maintenance

- **sleep-tracking** - Sleep optimization patterns
- **exercise-planning** - Fitness goal and routine creation
- **stress-management** - Stress identification and mitigation
- **boundary-setting** - Healthy boundary establishment

**Activation**: Keywords related to health, stress, boundaries

#### 5. Relationship Skills (3 skills)
**Purpose**: Social connection and communication

- **social-energy-audit** - Relationship energy analysis
- **communication-planning** - Difficult conversation preparation
- **conflict-preparation** - Structured conflict resolution approach

**Activation**: Keywords like "conversation", "relationship", "conflict"

#### 6. Financial Skills (3 skills)
**Purpose**: Financial planning and awareness

- **expense-analysis** - Spending pattern identification
- **budget-planning** - Budget creation and tracking
- **financial-goals** - Financial goal setting and tracking

**Activation**: Keywords like "money", "budget", "expense", "save"

#### 7. Learning Skills (3 skills)
**Purpose**: Continuous learning and skill development

- **learning-goals** - Learning objective setting
- **knowledge-synthesis** - Connect and integrate learning
- **skill-development** - Deliberate practice planning

**Activation**: Keywords like "learn", "study", "skill", "practice"

#### 8. Meta Skills (3 skills)
**Purpose**: Extending and maintaining life-os

- **creating-life-os-skills** - How to create new life-os skills
- **sharing-life-os-skills** - Contributing skills back
- **testing-life-os-skills** - Validating skill quality

**Activation**: Explicit when working on life-os itself

## Skill Structure Template

Every life-os skill follows this template:

```markdown
---
name: skill-name
description: One-line description of when to use this skill
---

# Skill Name

## Overview

Brief explanation of the skill's purpose and value.

## When to Use

Specific situations where this skill applies:
- Trigger condition 1
- Trigger condition 2
- Trigger condition 3

## The Framework/Process

Step-by-step instructions (numbered or phased):

### Phase 1: Name
Specific actions...

### Phase 2: Name
Specific actions...

## Examples

### Example 1: [Scenario]
Concrete walkthrough...

### Example 2: [Scenario]
Concrete walkthrough...

## Templates/Checklists

Reusable templates or checklists (use TodoWrite format).

## Red Flags

Warning signs that you need to use this skill:
- "I'll just..."
- "This is too simple for..."
- Rationalization pattern

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "..." | ... |

## Integration with Other Skills

- **Complementary**: Skills that work well together
- **Prerequisites**: Skills to use first
- **Follow-up**: Skills to use after

## Verification Checklist

- [ ] Checkpoint 1
- [ ] Checkpoint 2
- [ ] Checkpoint 3

## Metrics/Reflection

How to measure effectiveness of this skill application.
```

## Plugin Configuration

### plugin.json
```json
{
  "name": "life-os",
  "description": "Personal productivity and life management skills for Claude Code",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your@email.com"
  },
  "homepage": "https://github.com/yourusername/life-os",
  "repository": "https://github.com/yourusername/life-os",
  "license": "MIT",
  "keywords": [
    "productivity",
    "gtd",
    "life-management",
    "goals",
    "habits",
    "wellbeing"
  ]
}
```

### hooks.json
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

### session-start.sh
```bash
#!/bin/bash
# Load core life-os skill at session start
cat "${CLAUDE_PLUGIN_ROOT}/skills/using-life-os/SKILL.md"
```

## Slash Commands

Commands provide explicit entry points:

1. **/life-os:daily-review** - Run morning planning routine
2. **/life-os:weekly-planning** - Weekly review and planning
3. **/life-os:goal-tracking** - Review goals and progress
4. **/life-os:time-blocking** - Create time-blocked schedule
5. **/life-os:decision** - Run decision-making framework
6. **/life-os:habit-check** - Review habit tracking
7. **/life-os:energy-audit** - Analyze energy patterns

## Integration Philosophy

### With Superpowers
Life-os skills complement superpowers:
- Superpowers = HOW to code effectively
- Life-os = HOW to live and plan effectively

Both use same skill structure for consistency.

### With External Systems
Life-os skills are system-agnostic but can guide interaction with:
- Calendar apps (Google Calendar, Notion)
- Task managers (Todoist, Things, Omnifocus)
- Note systems (Obsidian, Roam)
- Habit trackers (Streaks, Habitica)
- Financial tools (YNAB, Mint)

Skills provide the PROCESS, not the tool integration.

## Skill Creation Guidelines

### Characteristics of Good Life-OS Skills

1. **Process-oriented**: Focus on HOW to think, not WHAT to think
2. **Repeatable**: Can be applied multiple times with consistent benefit
3. **Measurable**: Has clear success criteria or verification points
4. **Actionable**: Provides concrete steps, not abstract advice
5. **Framework-based**: Structured approach, not ad-hoc suggestions

### Anti-patterns to Avoid

- **Prescriptive content**: Don't dictate specific goals/values
- **Tool-dependent**: Don't require specific apps
- **One-time advice**: Skills should be reusable
- **Vague guidance**: Must have concrete steps
- **Motivational content**: Focus on process, not inspiration

### Skill Scope

**Good skill scope:**
- Daily planning routine (repeatable process)
- Decision-making framework (structured approach)
- Goal setting methodology (systematic method)

**Bad skill scope:**
- "How to be productive" (too broad)
- "My morning routine" (too specific/personal)
- "Get motivated" (not actionable)

## Priority for Initial Development

### Phase 1: Core Foundation (6 skills)
1. **using-life-os** - Entry point (mandatory)
2. **daily-planning** - Most frequently used
3. **weekly-review** - Core rhythm
4. **goal-setting** - Foundation for tracking
5. **priority-matrix** - Essential decision tool
6. **time-blocking** - Daily execution

### Phase 2: Goal & Habit System (5 skills)
7. **milestone-tracking**
8. **habit-formation**
9. **progress-review**
10. **obstacle-analysis**
11. **energy-management**

### Phase 3: Decision & Wellbeing (6 skills)
12. **decision-framework**
13. **tradeoff-analysis**
14. **commitment-evaluation**
15. **stress-management**
16. **boundary-setting**
17. **focus-sessions**

### Phase 4: Extended Domains (10 skills)
18-20. Relationship skills (3)
21-23. Financial skills (3)
24-26. Learning skills (3)
27. **monthly-reflection**

### Phase 5: Meta (3 skills)
28-30. Creating, sharing, testing skills

## Example Skill: Daily Planning

Here's what a complete life-os skill looks like:

```markdown
---
name: daily-planning
description: Use at start of each day to identify priorities, schedule tasks, and set intentions - structured morning planning that takes 10-15 minutes
---

# Daily Planning

## Overview

Consistent morning planning prevents reactive days and ensures focus on what matters.

**Core principle:** Plan before executing. Reactive days scatter focus.

## When to Use

**Always:**
- First thing in morning (before checking email/messages)
- After standup/first meeting
- When returning from long break

**Especially when:**
- Feeling overwhelmed
- Many competing demands
- Unclear priorities
- Recovering from distraction

## The Five-Step Process

### Step 1: Brain Dump (2 minutes)

Write everything you're thinking about:
- Tasks you remember
- Worries
- Ideas
- Communications needed

Don't organize. Just capture.

### Step 2: Identify MITs (3 minutes)

MIT = Most Important Task

**Choose 3 MITs** for today using criteria:
1. Moves a goal forward
2. Has a deadline
3. Blocks other work
4. You'll regret not doing it

**Not MITs:**
- Routine tasks
- Email processing
- Nice-to-haves
- Could wait until tomorrow

### Step 3: Schedule Deep Work (4 minutes)

Block calendar time for MITs:
- MIT 1: [Time block] - [specific outcome]
- MIT 2: [Time block] - [specific outcome]
- MIT 3: [Time block] - [specific outcome]

**Rules:**
- Morning blocks for hardest work
- Match task to energy level
- 90-minute maximum per block
- Buffer between blocks

### Step 4: Batch Shallow Work (2 minutes)

Group similar tasks:
- Email/messages: [time]
- Calls: [time]
- Admin: [time]
- Planning: [time]

Assign single batch time, don't scatter.

### Step 5: Set Intention (2 minutes)

Complete: "Today I will feel successful if..."

**Good intentions:**
- "I ship the MVP to staging"
- "I make progress on the architecture doc"
- "I have 3 focused work blocks"

**Bad intentions:**
- "I get through my todo list" (endless)
- "I'm productive" (vague)
- "I don't stress" (not actionable)

## Templates

### Daily Plan Template

```
## [Date] - Daily Plan

### Brain Dump
- [everything on mind]

### MITs (Most Important Tasks)
1. [MIT 1 - specific outcome]
2. [MIT 2 - specific outcome]
3. [MIT 3 - specific outcome]

### Schedule
08:00 - MIT 1 - [outcome]
10:00 - Break
10:30 - MIT 2 - [outcome]
12:30 - Lunch
13:30 - Email batch
14:00 - MIT 3 - [outcome]
16:00 - Admin batch
17:00 - Plan tomorrow

### Intention
Today I will feel successful if: [specific completion]
```

## Examples

### Example 1: Engineering Manager

**Brain Dump:**
- Review PR from Sarah
- 1:1 with John (performance concern)
- Q4 planning doc
- Hiring pipeline review
- Bug triage
- Team morale feels off
- Need to schedule team building
- Architecture decision on database

**MITs:**
1. Have constructive 1:1 with John (deadline: today, blocks team progress)
2. Review and merge Sarah's PR (blocks her next work)
3. Draft Q4 planning doc (due Friday)

**Schedule:**
- 09:00-10:30: Q4 planning doc (fresh mind, creative work)
- 11:00-12:00: 1:1 with John (after planning, before lunch)
- 14:00-15:00: Sarah's PR review (post-lunch focus)
- 15:30-16:30: Email/admin batch

**Intention:**
"Today I will feel successful if John leaves the 1:1 with clarity and motivation, and Sarah can start her next feature."

### Example 2: Overwhelmed Founder

**Brain Dump:**
[30 items including fundraising, hiring, product, customer issues]

**MITs:**
1. Send investor update (weekly commitment)
2. Interview top engineering candidate (loses interest if delayed)
3. Fix critical customer bug (revenue at risk)

**Schedule:**
- 08:00-09:30: Investor update (important but not urgent, do first)
- 10:00-11:30: Customer bug (deep focus needed)
- 14:00-15:30: Engineering interview (afternoon energy ok)

**Intention:**
"Today I will feel successful if I maintain investor confidence, keep our top candidate engaged, and prevent customer churn."

## Red Flags - Use This Skill

Catch yourself thinking:
- "I'll just check email first"
- "I know what I need to do"
- "Planning wastes time, I'll just start"
- "Too much to plan, need to execute"
- "My day is all meetings anyway"

**All of these mean: STOP. Run daily planning.**

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I know my priorities" | Then write them down. Takes 30 seconds. |
| "Planning wastes time" | 15 minutes planning saves 2 hours of distraction. |
| "Day is too packed" | That's why you need to plan. Reactive days waste time. |
| "I'll plan after email" | Email derails you. Plan first. |
| "I'm already late" | 10 minutes now saves being late all day. |

## Integration with Other Skills

**Prerequisites:**
- **goal-setting** - Know your goals before prioritizing
- **weekly-review** - Context from weekly helps daily

**Complementary:**
- **time-blocking** - Extended scheduling technique
- **energy-management** - Match tasks to energy
- **focus-sessions** - Structure for MIT work blocks

**Follow-up:**
- **daily-review** (end of day) - Reflect on execution
- **obstacle-analysis** - If MITs weren't completed

## Verification Checklist

Before starting work, check:
- [ ] Brain dump completed (captured everything)
- [ ] 3 MITs identified (not 5, not 1)
- [ ] MITs scheduled on calendar
- [ ] Shallow work batched
- [ ] Intention written
- [ ] TodoWrite created for MITs

## Metrics

Track over 30 days:
- **MIT completion rate**: % of days all 3 MITs done
- **Planning consistency**: % of days planned
- **Reactive time**: % of day spent on unplanned work

**Good metrics:**
- 80%+ MIT completion
- 90%+ planning consistency
- <20% reactive time

**If metrics poor:**
- Are MITs too ambitious?
- Is calendar accurately reflecting reality?
- Are interruptions excessive? (→ boundary-setting skill)
```

## Implementation Roadmap

### Week 1-2: Foundation
- [ ] Create directory structure
- [ ] Write plugin.json and hooks configuration
- [ ] Implement using-life-os skill
- [ ] Create README

### Week 3-4: Core Skills (Phase 1)
- [ ] daily-planning skill
- [ ] weekly-review skill
- [ ] goal-setting skill
- [ ] priority-matrix skill
- [ ] time-blocking skill

### Week 5-6: Testing & Refinement
- [ ] Test skills with real scenarios
- [ ] Refine based on usage
- [ ] Create example workflows
- [ ] Write documentation

### Week 7-8: Phase 2 Skills
- [ ] Habit and goal tracking skills
- [ ] Energy management
- [ ] Progress review

### Ongoing: Community & Extension
- [ ] Gather user feedback
- [ ] Create additional skills based on demand
- [ ] Build community contributions

## Success Metrics

### Adoption Metrics
- Number of active users
- Daily/weekly skill usage frequency
- Most commonly used skills

### Effectiveness Metrics
- User-reported productivity improvements
- Skill completion rates (via TodoWrite)
- User retention over 30/60/90 days

### Quality Metrics
- Skill clarity scores (user surveys)
- Error rate (users not understanding skill)
- Time to complete skill workflows

## Appendix: Skill Naming Conventions

### Guidelines
- Use present participle or noun form
- Be descriptive but concise (2-3 words max)
- Action-oriented for process skills
- Domain-oriented for topic skills

### Examples
**Good:**
- `daily-planning` (action + scope)
- `goal-setting` (action + domain)
- `priority-matrix` (tool + domain)
- `energy-management` (domain + action)

**Bad:**
- `plan-day` (too terse)
- `how-to-plan-your-daily-schedule` (too verbose)
- `productivity` (too vague)
- `be-more-focused` (not actionable)

## Conclusion

This architecture mirrors the proven superpowers pattern while adapting to life management domain. The structure prioritizes:

1. **Discoverability** - Clear naming and categorization
2. **Consistency** - Same format as superpowers
3. **Actionability** - Process-oriented, not advice-oriented
4. **Extensibility** - Easy to add new skills
5. **Integration** - Works with existing Claude Code workflows

The flat directory structure with descriptive names scales well and maintains simplicity while allowing rich categorization through skill descriptions and relationships.
