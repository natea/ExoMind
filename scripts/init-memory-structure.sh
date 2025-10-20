#!/bin/bash

# Life OS Memory Structure Initialization Script
# Creates the complete memory directory structure for Life OS

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="${1:-./memory}"

echo -e "${GREEN}Initializing Life OS Memory Structure...${NC}"

# Create main directory structure
echo "Creating directory structure..."
mkdir -p "$BASE_DIR"/{assessments,objectives/{active-plans,okrs},gtd,reviews/{daily,weekly,monthly,quarterly},reference/decisions}

# Create GTD template files
echo "Creating GTD template files..."

cat > "$BASE_DIR/gtd/inbox.md" << 'EOF'
# GTD Inbox

Last updated: $(date +%Y-%m-%d)

## Items to Process

<!-- Add new items here. Process regularly during daily review. -->

---

## Processing Guidelines

1. **Clarify**: What is this item? What does it mean?
2. **Is it actionable?**
   - NO → Trash, Reference, or Someday/Maybe
   - YES → Next step?
3. **What's the next action?**
   - < 2 minutes → Do it now
   - Single action → Add to next-actions.md
   - Multiple steps → Create project in projects.md
   - Delegate → Add to waiting.md
   - Schedule → Add to calendar

## Archive

Processed items moved here:
EOF

cat > "$BASE_DIR/gtd/next-actions.md" << 'EOF'
# Next Actions

Last updated: $(date +%Y-%m-%d)

## By Context

### @computer
- [ ]

### @phone
- [ ]

### @errands
- [ ]

### @home
- [ ]

### @work
- [ ]

### @anywhere
- [ ]

---

## Completed This Week
<!-- Move completed items here during weekly review -->
EOF

cat > "$BASE_DIR/gtd/projects.md" << 'EOF'
# Active Projects

Last updated: $(date +%Y-%m-%d)

## Project Template
```markdown
### [Project Name]
**Goal**: [What does success look like?]
**Deadline**: [Target completion date]
**Next Action**: [Very next physical action]
**Status**: Active | On Hold | Review Needed

#### Actions
- [ ] [Next action]
- [ ] [Subsequent actions]

#### Notes
[Supporting information, dependencies, etc.]
```

---

## Active Projects

---

## On Hold Projects

---

## Completed This Quarter
<!-- Archive completed projects here -->
EOF

cat > "$BASE_DIR/gtd/waiting.md" << 'EOF'
# Waiting For

Last updated: $(date +%Y-%m-%d)

## Template
```markdown
- [ ] [What you're waiting for] - @[Person/Entity] - [Date logged] - [Follow-up date]
```

## Active Items

---

## Resolved This Month
<!-- Move resolved items here during monthly review -->
EOF

cat > "$BASE_DIR/gtd/someday.md" << 'EOF'
# Someday/Maybe

Last updated: $(date +%Y-%m-%d)

## Ideas & Aspirations

### Personal Development
-

### Career
-

### Creative
-

### Learning
-

### Travel
-

### Projects
-

---

## Review Schedule
Review this list during monthly reviews to see if any items should become active projects.
EOF

# Create review templates
echo "Creating review templates..."

cat > "$BASE_DIR/reviews/daily/.template.md" << 'EOF'
# Daily Check-in: YYYY-MM-DD

## Morning Planning (5 min)
**Time**:
**Energy Level**: 1-10:

### Today's Priorities (Max 3)
1.
2.
3.

### Schedule Review
- [ ] Check calendar for appointments
- [ ] Block time for deep work
- [ ] Identify potential interruptions

---

## Evening Review (5 min)
**Time**:
**Completed**:

### What Got Done
-

### What Didn't (and why)
-

### Tomorrow's Top Priority
1.

### Gratitude
-

### Energy/Mood Notes
-
EOF

cat > "$BASE_DIR/reviews/weekly/.template.md" << 'EOF'
# Weekly Review: Week of YYYY-MM-DD

**Duration**: ~1 hour
**Location**:

## 1. Get Clear (15 min)

### Process Inbox
- [ ] GTD inbox → 0 items
- [ ] Email inbox → processed
- [ ] Physical inbox → processed
- [ ] Notes/ideas → captured

### Review Calendar
- [ ] Last week - capture loose ends
- [ ] This week - prepare for upcoming
- [ ] Next 2-4 weeks - anticipate

---

## 2. Get Current (30 min)

### Next Actions Review
- [ ] Mark completed items
- [ ] Remove/delegate stale items
- [ ] Add new next actions from projects

### Projects Review
For each active project:
- [ ] Clear outcome defined?
- [ ] Next action identified?
- [ ] Still active/relevant?

### Waiting For Review
- [ ] Follow up on overdue items
- [ ] Remove resolved items
- [ ] Update expected dates

---

## 3. Get Creative (15 min)

### Someday/Maybe Review
- [ ] Any items ready to activate?
- [ ] New ideas to capture?
- [ ] Items to remove?

### Weekly Reflection
**What went well this week?**
-

**What could be improved?**
-

**Key learnings:**
-

**Next week's focus:**
-

---

## 4. Weekly Metrics

### Time Distribution
- Deep work: ____ hours
- Meetings: ____ hours
- Admin: ____ hours
- Learning: ____ hours

### Progress on Goals
- [ ] Goal 1: ____%
- [ ] Goal 2: ____%
- [ ] Goal 3: ____%

### Energy Levels
Average: __/10
Patterns noticed:
EOF

cat > "$BASE_DIR/reviews/monthly/.template.md" << 'EOF'
# Monthly Review: YYYY-MM

**Date**:
**Duration**: ~2 hours

## 1. Reflection (30 min)

### Month Highlights
**Major accomplishments:**
-

**Challenges faced:**
-

**Key learnings:**
-

**Memorable moments:**
-

---

## 2. Goal Progress Review (30 min)

### Personal Goals
| Goal | Target | Actual | Status | Notes |
|------|--------|--------|--------|-------|
|      |        |        |        |       |

### Professional Goals
| Goal | Target | Actual | Status | Notes |
|------|--------|--------|--------|-------|
|      |        |        |        |       |

### Health & Wellness
| Area | Goal | Progress | Notes |
|------|------|----------|-------|
| Exercise | | | |
| Nutrition | | | |
| Sleep | | | |
| Mental Health | | | |

---

## 3. Systems Review (20 min)

### What's Working Well
-

### What Needs Adjustment
-

### Habits to Start/Stop/Continue
**Start:**
-

**Stop:**
-

**Continue:**
-

---

## 4. Projects & Areas Review (30 min)

### Completed Projects
-

### Active Projects Health Check
- [ ] All projects have clear next actions
- [ ] Projects aligned with current goals
- [ ] Projects appropriately prioritized

### Areas of Responsibility
| Area | Health (1-10) | What's Needed |
|------|---------------|---------------|
| Career | | |
| Finances | | |
| Relationships | | |
| Health | | |
| Personal Growth | | |
| Home/Environment | | |

---

## 5. Look Ahead (10 min)

### Next Month Focus
**Top 3 Priorities:**
1.
2.
3.

**Key Events/Deadlines:**
-

**Potential Obstacles:**
-

**Support Needed:**
-
EOF

cat > "$BASE_DIR/reviews/quarterly/.template.md" << 'EOF'
# Quarterly Review: QX YYYY

**Date**:
**Duration**: ~4 hours (can be split across multiple sessions)

## Executive Summary

**Quarter Theme**:
**Overall Rating**: __/10

### Quick Stats
- Projects completed:
- Goals achieved:
- Key metrics:

---

## Part 1: Reflection & Assessment (60 min)

### Quarterly Achievements

**Personal Wins:**
1.
2.
3.

**Professional Wins:**
1.
2.
3.

**Unexpected Positives:**
-

### Challenges & Learnings

**Major obstacles:**
-

**How I overcame them:**
-

**What I learned:**
-

**What I'd do differently:**
-

### Identity & Values Check-in

**How well did I live my values this quarter?**
| Value | Rating (1-10) | Evidence | Improvements Needed |
|-------|---------------|----------|-------------------|
|       |               |          |                   |

**Did my actions align with who I want to be?**
-

---

## Part 2: OKR Review (60 min)

### Objective 1: [Name]
**Overall Progress**: ____%

| Key Result | Target | Actual | % | Status | Notes |
|------------|--------|--------|---|--------|-------|
| KR1 |  |  |  |  |  |
| KR2 |  |  |  |  |  |
| KR3 |  |  |  |  |  |

**What worked:**
-

**What didn't:**
-

**Lessons learned:**
-

*(Repeat for each objective)*

---

## Part 3: Life Assessment (45 min)

### Wheel of Life
Rate each area 1-10:

| Area | Score | Trend | What would make it a 10? |
|------|-------|-------|-------------------------|
| Career/Work | | ↑↓→ | |
| Finances | | ↑↓→ | |
| Health/Fitness | | ↑↓→ | |
| Relationships | | ↑↓→ | |
| Personal Growth | | ↑↓→ | |
| Fun/Recreation | | ↑↓→ | |
| Environment | | ↑↓→ | |
| Contribution | | ↑↓→ | |

### Deep Dive
**Highest scoring area - what's working?**
-

**Lowest scoring area - root cause analysis:**
-

**Biggest opportunity for improvement:**
-

---

## Part 4: Systems & Habits (30 min)

### Productivity Systems
**What's working:**
-

**What's not working:**
-

**Experiments to try:**
-

### Habit Tracking
| Habit | Target | Actual | Success Rate | Keep/Modify/Drop |
|-------|--------|--------|--------------|------------------|
|       |        |        |              |                  |

---

## Part 5: Planning Next Quarter (45 min)

### Vision for Next Quarter
**Theme/Focus**:

**What I want to achieve:**
-

**Who I want to become:**
-

### Draft OKRs
*(To be refined in separate OKR planning session)*

**Objective 1**:
- KR1:
- KR2:
- KR3:

**Objective 2**:
- KR1:
- KR2:
- KR3:

### Top 3 Projects for Next Quarter
1.
2.
3.

### Commitments to Self
**I will start:**
-

**I will stop:**
-

**I will continue:**
-

---

## Part 6: Gratitude & Closure (10 min)

### Gratitude
**People I'm grateful for:**
-

**Experiences I'm grateful for:**
-

**Things I'm grateful for:**
-

### Final Thoughts
**One sentence summary of this quarter:**


**Energy going into next quarter**: __/10

---

## Action Items from This Review
- [ ]
- [ ]
- [ ]

**Next Quarterly Review**: [Date]
EOF

# Create objectives templates
echo "Creating objectives templates..."

cat > "$BASE_DIR/objectives/active-plans/.template.md" << 'EOF'
# Active Plan: [Plan Name]

**Created**: YYYY-MM-DD
**Owner**:
**Status**: Planning | In Progress | Review | Complete

## Vision
[What does success look like? Paint the picture.]

## Why This Matters
[Connection to larger goals, values, or strategy]

---

## Goals & Success Criteria

### Primary Goal
[Clear, measurable outcome]

### Success Criteria
- [ ]
- [ ]
- [ ]

### Success Metrics
| Metric | Current | Target | Deadline |
|--------|---------|--------|----------|
|        |         |        |          |

---

## Approach

### Strategy
[High-level approach]

### Key Milestones
- [ ] Milestone 1 - [Date]
- [ ] Milestone 2 - [Date]
- [ ] Milestone 3 - [Date]

### Resources Needed
**People:**
-

**Tools/Systems:**
-

**Time Investment:**
-

**Budget:**
-

---

## Execution

### Current Phase
[What phase are you in?]

### Next Actions
- [ ]
- [ ]
- [ ]

### Blockers
-

### Decisions Needed
-

---

## Tracking

### Weekly Progress Log
**Week of [Date]:**
- Progress:
- Challenges:
- Next week focus:

---

## Review & Learnings

### What's Working
-

### What's Not Working
-

### Adjustments Made
-

### Key Learnings
-
EOF

cat > "$BASE_DIR/objectives/okrs/.template.md" << 'EOF'
# OKRs: QX YYYY

**Quarter**:
**Created**:
**Review Date**: [End of quarter]

## Guidelines
- **Objectives**: Aspirational, qualitative goals (3-5 max)
- **Key Results**: Measurable outcomes that prove objective achieved (3-4 per objective)
- **Grading**: 0.0 - 1.0 scale (0.7 = success, 1.0 = extraordinary)

---

## Objective 1: [Inspiring Goal Statement]

**Why this matters**: [Connection to bigger picture]
**Confidence**: __/10

### Key Results
1. [Measurable outcome 1]
   - **Baseline**:
   - **Target**:
   - **Current**:
   - **Score**: ___/1.0

2. [Measurable outcome 2]
   - **Baseline**:
   - **Target**:
   - **Current**:
   - **Score**: ___/1.0

3. [Measurable outcome 3]
   - **Baseline**:
   - **Target**:
   - **Current**:
   - **Score**: ___/1.0

**Overall Objective Score**: ___/1.0

### Initiatives/Projects
- [ ] [Project supporting KR1]
- [ ] [Project supporting KR2]
- [ ] [Project supporting KR3]

---

## Objective 2: [Inspiring Goal Statement]

**Why this matters**:
**Confidence**: __/10

### Key Results
1. [Measurable outcome 1]
   - **Baseline**:
   - **Target**:
   - **Current**:
   - **Score**: ___/1.0

2. [Measurable outcome 2]
   - **Baseline**:
   - **Target**:
   - **Current**:
   - **Score**: ___/1.0

3. [Measurable outcome 3]
   - **Baseline**:
   - **Target**:
   - **Current**:
   - **Score**: ___/1.0

**Overall Objective Score**: ___/1.0

### Initiatives/Projects
- [ ]
- [ ]
- [ ]

---

## Objective 3: [Inspiring Goal Statement]

**Why this matters**:
**Confidence**: __/10

### Key Results
1. [Measurable outcome 1]
   - **Baseline**:
   - **Target**:
   - **Current**:
   - **Score**: ___/1.0

2. [Measurable outcome 2]
   - **Baseline**:
   - **Target**:
   - **Current**:
   - **Score**: ___/1.0

3. [Measurable outcome 3]
   - **Baseline**:
   - **Target**:
   - **Current**:
   - **Score**: ___/1.0

**Overall Objective Score**: ___/1.0

### Initiatives/Projects
- [ ]
- [ ]
- [ ]

---

## Progress Tracking

### Weekly Check-ins
**Week of [Date]:**
- OKR updates:
- Blockers:
- Adjustments needed:

### Mid-Quarter Review
**Date**:
**Overall Progress**: ____%
**What's working**:
**What needs adjustment**:
**Course corrections**:

---

## End of Quarter Review

### Final Scores
- Objective 1: ___/1.0
- Objective 2: ___/1.0
- Objective 3: ___/1.0
- **Overall**: ___/1.0

### Retrospective
**What went well:**
-

**What could be improved:**
-

**Key learnings:**
-

**Carry forward to next quarter:**
-
EOF

# Create assessments template
echo "Creating assessments templates..."

cat > "$BASE_DIR/assessments/.template.md" << 'EOF'
# Life Assessment: QX YYYY

**Date**:
**Time Investment**: 2-3 hours (can be split into sessions)

## Purpose
This deep assessment helps you:
- Gain clarity on all life areas
- Identify what's working and what's not
- Make strategic decisions about where to focus
- Track long-term patterns and growth

---

## Part 1: Life Domains Assessment

### Career & Work
**Current Rating**: __/10
**Trend**: ↑ Improving | → Stable | ↓ Declining

**Current state:**
-

**Achievements this quarter:**
-

**Challenges/Frustrations:**
-

**What would make this a 10:**
-

**Next quarter focus:**
-

---

### Financial Health
**Current Rating**: __/10
**Trend**: ↑ Improving | → Stable | ↓ Declining

**Key metrics:**
- Income:
- Savings rate:
- Debt:
- Net worth trend:

**Financial goals progress:**
-

**Money mindset/relationship:**
-

**What would make this a 10:**
-

**Next quarter focus:**
-

---

### Health & Fitness
**Current Rating**: __/10
**Trend**: ↑ Improving | → Stable | ↓ Declining

**Physical health:**
- Energy levels: __/10
- Sleep quality: __/10
- Exercise consistency:
- Nutrition quality:

**Mental health:**
- Stress level: __/10
- Anxiety/Depression:
- Therapy/Support:

**What would make this a 10:**
-

**Next quarter focus:**
-

---

### Relationships
**Current Rating**: __/10
**Trend**: ↑ Improving | → Stable | ↓ Declining

**Romantic relationship:**
- Quality: __/10
- Communication:
- Challenges:
- Highlights:

**Family:**
- Connection level: __/10
- Quality time:
- Challenges:

**Friendships:**
- Depth: __/10
- Frequency:
- New connections:

**What would make this a 10:**
-

**Next quarter focus:**
-

---

### Personal Growth & Learning
**Current Rating**: __/10
**Trend**: ↑ Improving | → Stable | ↓ Declining

**Skills developed:**
-

**Books read / Courses taken:**
-

**New experiences:**
-

**Self-awareness growth:**
-

**What would make this a 10:**
-

**Next quarter focus:**
-

---

### Fun & Recreation
**Current Rating**: __/10
**Trend**: ↑ Improving | → Stable | ↓ Declining

**Hobbies engaged in:**
-

**Memorable fun experiences:**
-

**Play/Joy ratio:**
-

**What would make this a 10:**
-

**Next quarter focus:**
-

---

### Environment & Space
**Current Rating**: __/10
**Trend**: ↑ Improving | → Stable | ↓ Declining

**Home environment:**
- Organization: __/10
- Comfort: __/10
- Aesthetics: __/10

**Work environment:**
- Conducive to productivity: __/10
- Inspiring: __/10

**What would make this a 10:**
-

**Next quarter focus:**
-

---

### Contribution & Purpose
**Current Rating**: __/10
**Trend**: ↑ Improving | → Stable | ↓ Declining

**How I've contributed:**
-

**Impact made:**
-

**Alignment with purpose:**
-

**Volunteering/Giving:**
-

**What would make this a 10:**
-

**Next quarter focus:**
-

---

## Part 2: Cross-Domain Analysis

### Overall Life Satisfaction
**Rating**: __/10

### Balance Analysis
[Create visual if helpful - which areas are oversized/undersized?]

**Most out of balance:**
-

**Root cause:**
-

**Integration opportunities:**
[How can progress in one area support another?]
-

---

## Part 3: Strategic Insights

### Patterns Noticed
**Positive patterns to reinforce:**
-

**Negative patterns to break:**
-

**Energy drains to eliminate:**
-

**Energy sources to amplify:**
-

### Values Alignment
**My core values:**
1.
2.
3.
4.
5.

**How well am I living them?**
| Value | Rating (1-10) | Evidence | Gaps |
|-------|---------------|----------|------|
|       |               |          |      |

### Decision Priorities
**Based on this assessment, my top 3 priorities for next quarter:**
1.
2.
3.

**Things to say NO to:**
-

**Things to say YES to:**
-

---

## Part 4: Action Planning

### Quick Wins (Next 30 days)
- [ ]
- [ ]
- [ ]

### Major Projects (Next 90 days)
1.
2.
3.

### Support Needed
**Resources:**
-

**People:**
-

**Accountability:**
-

---

## Part 5: Reflection

### Gratitude
**What I'm most grateful for this quarter:**
1.
2.
3.

### Growth
**How I've grown:**
-

**Who I'm becoming:**
-

### Intention
**My intention for next quarter:**


---

**Next Assessment Date**: [3 months from now]
EOF

# Create reference/decisions template
echo "Creating decision journal template..."

cat > "$BASE_DIR/reference/decisions/.template.md" << 'EOF'
# Decision: [Decision Name]

**Date**: YYYY-MM-DD
**Category**: Career | Financial | Personal | Health | Relationship | Other
**Importance**: High | Medium | Low
**Reversibility**: Reversible | Hard to Reverse | Irreversible

## Context

### Situation
[What prompted this decision? What's the current state?]

### Timeframe
- Decision deadline:
- Expected impact timeline:

---

## Options Considered

### Option 1: [Name]
**Pros:**
-
-

**Cons:**
-
-

**Estimated outcome:**
-

---

### Option 2: [Name]
**Pros:**
-
-

**Cons:**
-
-

**Estimated outcome:**
-

---

### Option 3: [Name]
*(Add as many options as considered)*

---

## Analysis

### Key Criteria
| Criterion | Weight | Option 1 | Option 2 | Option 3 |
|-----------|--------|----------|----------|----------|
|           | (1-10) | (1-10)   | (1-10)   | (1-10)   |

### Assumptions
-
-

### Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
|      |             |        |            |

### Advice Sought
**Who I consulted:**
- [Name]: [Their perspective]
- [Name]: [Their perspective]

---

## The Decision

### What I Decided
[Clear statement of the decision]

### Reasoning
**Why this option:**
-

**Key factors:**
1.
2.
3.

**What I'm trading off:**
-

### Confidence Level
__/10

**Main uncertainties:**
-

---

## Implementation Plan

### Immediate Actions
- [ ]
- [ ]
- [ ]

### Success Metrics
[How will I know if this was the right decision?]
-

### Review Date
[When will I evaluate how this turned out?]
**Date**:

---

## Future Review

### 30-Day Check-in
**Date**:
**Status**:
**Learning**:

### 90-Day Check-in
**Date**:
**Status**:
**Learning**:

### Final Review
**Date**:
**Outcome**:
**Would I make the same decision again?**:
**What I learned**:
EOF

# Create memory directory README
echo "Creating memory directory README..."

cat > "$BASE_DIR/README.md" << 'EOF'
# Life OS Memory System

This directory contains your Life OS memory structure - the persistent storage layer for your personal operating system.

## Directory Structure

```
memory/
├── assessments/          # Quarterly life assessments (deep reviews)
├── objectives/
│   ├── active-plans/    # Current active plans and initiatives
│   └── okrs/            # Quarterly OKRs (Objectives & Key Results)
├── gtd/                 # Getting Things Done system
│   ├── inbox.md         # Capture everything here first
│   ├── next-actions.md  # Context-based action lists
│   ├── projects.md      # Multi-step projects
│   ├── waiting.md       # Delegated items
│   └── someday.md       # Ideas for the future
├── reviews/             # Periodic reviews at all levels
│   ├── daily/           # Daily check-ins (5 min morning/evening)
│   ├── weekly/          # Weekly reviews (~1 hour)
│   ├── monthly/         # Monthly reviews (~2 hours)
│   └── quarterly/       # Quarterly reviews (~4 hours)
└── reference/
    └── decisions/       # Decision journal (track major decisions)
```

## Quick Start

### 1. Daily Practice (10 min/day)
```bash
# Morning (5 min)
cp memory/reviews/daily/.template.md memory/reviews/daily/$(date +%Y-%m-%d).md
# Fill in: Today's priorities, schedule review

# Evening (5 min)
# Fill in: What got done, tomorrow's priority, gratitude
```

### 2. Weekly Review (1 hour, Friday afternoon)
```bash
cp memory/reviews/weekly/.template.md memory/reviews/weekly/week-$(date +%Y-W%V).md
# Process: Clear inbox → Review projects → Update next actions
```

### 3. Monthly Review (2 hours, last Sunday of month)
```bash
cp memory/reviews/monthly/.template.md memory/reviews/monthly/$(date +%Y-%m).md
# Reflect on month → Review goals → Adjust systems
```

### 4. Quarterly Review (4 hours, split across week before quarter starts)
```bash
cp memory/reviews/quarterly/.template.md memory/reviews/quarterly/$(date +%Y)-Q[1-4].md
cp memory/assessments/.template.md memory/assessments/$(date +%Y)-Q[1-4]-assessment.md
cp memory/objectives/okrs/.template.md memory/objectives/okrs/$(date +%Y)-Q[1-4].md
# Deep reflection → Life assessment → Set OKRs
```

## Core Workflows

### GTD Processing (Daily)
1. **Capture** → Add everything to `gtd/inbox.md`
2. **Clarify** → Is it actionable?
   - No → Delete, Reference, or Someday
   - Yes → What's the next action?
3. **Organize** → Move to appropriate list
   - < 2 min → Do now
   - Single action → `next-actions.md`
   - Project → `projects.md`
   - Delegated → `waiting.md`
4. **Review** → Weekly review keeps system current
5. **Engage** → Work from `next-actions.md` by context

### Goal Setting Cascade
```
Quarterly Life Assessment
         ↓
    Quarterly OKRs (3-5 objectives)
         ↓
  Active Plans (Major initiatives)
         ↓
    GTD Projects (Execution)
         ↓
   Next Actions (Daily work)
```

### Review Cadence
- **Daily** (10 min): Plan morning, reflect evening
- **Weekly** (1 hour): Get clear, current, creative
- **Monthly** (2 hours): Goals, systems, areas of life
- **Quarterly** (4 hours): Deep assessment, OKRs, strategic planning

## Template Usage

### Create New Items
All subdirectories have a `.template.md` file. Copy and rename for new items:

```bash
# Daily review
cp memory/reviews/daily/.template.md memory/reviews/daily/2025-01-15.md

# New project
cp memory/objectives/active-plans/.template.md memory/objectives/active-plans/project-name.md

# Major decision
cp memory/reference/decisions/.template.md memory/reference/decisions/2025-01-decision-name.md
```

### File Naming Conventions
- **Daily reviews**: `YYYY-MM-DD.md` (e.g., `2025-01-15.md`)
- **Weekly reviews**: `week-YYYY-WXX.md` (e.g., `week-2025-W03.md`)
- **Monthly reviews**: `YYYY-MM.md` (e.g., `2025-01.md`)
- **Quarterly reviews**: `YYYY-QX.md` (e.g., `2025-Q1.md`)
- **Assessments**: `YYYY-QX-assessment.md`
- **OKRs**: `YYYY-QX.md`
- **Active plans**: `descriptive-name.md`
- **Decisions**: `YYYY-MM-decision-name.md`

## Integration with Life OS

This memory structure integrates with:
- **Skills**: Meal planning, grocery shopping, message management reference this data
- **Prompts**: Agent prompts can access historical patterns and decisions
- **Workflows**: Automation workflows can create/update reviews automatically

## Best Practices

### 1. Start Small
- Begin with just GTD inbox and daily reviews
- Add weekly reviews after 2 weeks
- Add monthly/quarterly as you build the habit

### 2. Consistency Over Perfection
- Better to do a quick 5-min daily review than skip it
- Templates are guides, not rigid requirements
- Adapt to what works for you

### 3. Review Before Creating
- Check existing active plans before starting new ones
- Review last quarter's OKRs before setting new ones
- Read last month's reflection before writing this month's

### 4. Keep It Current
- Archive completed projects monthly
- Clean up someday/maybe quarterly
- Update decision outcomes when you have data

### 5. Link and Connect
- Reference decisions in active plans
- Link projects to OKR key results
- Note patterns across reviews

## Maintenance

### Weekly
- Process inbox to zero
- Update project next actions
- Archive completed items

### Monthly
- Move completed projects to archive section
- Review and prune waiting-for list
- Check someday/maybe for activations

### Quarterly
- Archive previous quarter's reviews
- Clean up old reference materials
- Update template improvements

## Getting Help

- Each template includes inline instructions
- Uncomment example sections as needed
- Refer to GTD or OKR methodology docs for deeper guidance

---

**Remember**: This is YOUR operating system. Adapt templates and workflows to fit your life, not the other way around.
EOF

# Create .gitignore for memory directory
echo "Creating .gitignore for memory directory..."

cat > "$BASE_DIR/.gitignore" << 'EOF'
# Ignore all files in memory/ by default
*

# But track templates and README
!.gitignore
!README.md
!*/.template.md
!.template.md

# Track directory structure
!*/
EOF

# Initialize git if in a git repo
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Setting up git tracking..."
    git add "$BASE_DIR/.gitignore"
    git add "$BASE_DIR/README.md"
    git add "$BASE_DIR"/*/.template.md
    git add "$BASE_DIR"/reviews/*/.template.md
    git add "$BASE_DIR"/objectives/*/.template.md
    git add "$BASE_DIR"/reference/*/.template.md
fi

echo -e "${GREEN}✓ Memory structure initialized successfully!${NC}"
echo ""
echo "Directory structure created at: $BASE_DIR"
echo ""
echo "Next steps:"
echo "1. Review the README: cat $BASE_DIR/README.md"
echo "2. Start with daily review: cp $BASE_DIR/reviews/daily/.template.md $BASE_DIR/reviews/daily/\$(date +%Y-%m-%d).md"
echo "3. Set up GTD inbox: Open $BASE_DIR/gtd/inbox.md"
echo ""
echo -e "${YELLOW}Pro tip: Run weekly review every Friday to keep the system current!${NC}"
EOF

chmod +x /Users/nateaune/Documents/code/ExoMind/scripts/init-memory-structure.sh
