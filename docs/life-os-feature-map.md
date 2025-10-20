# Life-OS Feature Map

## Executive Summary

Life-OS is a personal AI-powered life management system built as a module for ExoMind. It provides comprehensive life coaching, task management, and personal development tracking through a structured workflow system integrated with external tools like Todoist and Gmail.

---

## 1. Core Features

### 1.1 Life Assessment System
**Purpose**: Quarterly comprehensive evaluation of life satisfaction across 10 key areas

**Capabilities**:
- **Level 10 Life Assessment** - Score-based evaluation (1-10 scale) across:
  - Personal Growth & Learning
  - Career & Work
  - Finance & Wealth
  - Health & Fitness
  - Relationships & Family
  - Fun & Recreation
  - Physical Environment
  - Mental & Emotional
  - Spirituality & Purpose
  - Community & Giving
- Structured reflection questions for each life area
- Total score calculation (out of 100)
- Top 3 focus areas identification
- Action item generation from insights

**Data Storage**: `memory/assessments/` directory

### 1.2 Goal Management & Planning
**Purpose**: Track and manage life improvement initiatives

**Components**:
- **Active Plans**: Maximum 3 concurrent focus areas
  - Start/target dates and scores
  - Context and key challenges
  - Specific goals (1-3 per area)
  - Progress markers (milestones with due dates)
  - Action items linked to Todoist
  - Monthly review tracking
- **OKR System**: Objectives and Key Results tracking
- **Resource Management**: Links to relevant materials

**Data Storage**: Individual plan files in `memory/` with cross-references

### 1.3 Task Management (GTD-Based)
**Purpose**: Implement Getting Things Done methodology with dual-system approach

**Architecture**:
- **Markdown Files** (Source of Truth - Strategic Planning):
  - `memory/tasks/inbox.md` - Initial capture point
  - `memory/tasks/projects.md` - Project plans and documentation
  - `memory/tasks/next-actions.md` - Context-based actions
  - `memory/tasks/someday.md` - Someday/maybe list
  - `memory/tasks/waiting.md` - Delegated items and follow-ups
  - `memory/tasks/todoist.yml` - Todoist sync state

- **Todoist Integration** (Operational - Daily Actions):
  - Bi-directional sync (import/export)
  - Project mapping and creation
  - Label management
  - Priority levels (1-4)
  - Due date handling (natural language)
  - Task completion tracking
  - Rate-limited API operations

**Task Data Structure**:
```yaml
tasks:
  - content: string          # Required
    created_at: string       # Required (ISO 8601)
    due_date: string         # Optional
    priority: number         # Optional (1-4)
    project: string          # Optional
    labels: array           # Optional
    description: string     # Optional
    todoist_id: string      # Auto-generated on sync
    completed_at: string    # Auto-tracked
    to_delete: boolean      # Flag for deletion
    deleted_at: string      # Deletion timestamp
    deleted_from: string    # Deletion source
```

### 1.4 Review & Reflection System
**Purpose**: Multi-tiered progress tracking and reflection

**Review Cycles**:

#### Daily Check-In (5:30 AM & 9:00 AM)
- Morning routine tracking
- Energy level monitoring (1-10 scale)
- Sleep quality assessment
- Exercise/movement logging
- Inbox processing
- Priority identification (top 3)
- Habit tracking (6 core habits)
- Personal development progress

#### Evening Routine (8:30 PM - 9:30 PM)
- Day review and achievements
- Development area check-ins
- Environment preparation
- Physical wind-down
- Screen-free time (9:00 PM onwards)
- Sleep preparation (lights out 9:30 PM)
- Tomorrow's focus planning

#### Weekly Review (Every Sunday, 12:00 PM, 45 min)
- Progress review per focus area
- Wins and challenges identification
- Energy level tracking (daily average)
- Habit adherence metrics
- Next week priorities
- Support needs identification

#### Monthly Review (Last Sunday, 11:00 AM, 1 hour)
- Active plan progress assessment
- Score tracking for focus areas
- Key achievements documentation
- Challenge analysis
- System health check
- Decision documentation
- Resource organization

#### Quarterly Assessment (Last Sunday of Quarter, 10:00 AM, 2 hours)
- Complete Level 10 Life assessment
- OKR review and setting
- Major strategy adjustments
- Focus area selection (max 3)
- System-wide review

**Template Files**:
- `templates/daily-check-in.md`
- `templates/evening-routine.md`
- `templates/weekly-review.md`
- `templates/monthly-review.md`
- `templates/assessment.md`

---

## 2. User Workflows

### 2.1 Onboarding Workflow
**Steps**:
1. Install Cursor editor
2. Initial life assessment (all 10 areas)
3. Identify top 3 priority areas
4. Set initial goals for priority areas
5. Setup external integrations (Todoist, Gmail)
6. Create API tokens and environment variables
7. First daily practice session

### 2.2 Technical Setup Steps

**Prerequisites:**
- Git installed
- Node.js 18+ installed
- Text editor or IDE (VSCode recommended)

**Initial Setup (15-20 minutes):**

1. **Clone repository**
   ```bash
   git clone https://github.com/[username]/ExoMind.git
   cd ExoMind
   git submodule update --init --recursive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create memory directory structure**
   ```bash
   mkdir -p memory/{assessments,tasks,objectives/{active-plans,okrs},reviews/{daily,weekly,monthly,quarterly},decisions,reference}
   ```

4. **Initialize memory files**
   ```bash
   # Create initial GTD files
   touch memory/inbox.md
   touch memory/tasks/{inbox,projects,next-actions,someday,waiting,completed}.md

   # Create schedule file
   touch memory/schedule.md

   # Create README
   touch memory/README.md
   ```

5. **Setup version control for memory** (optional but recommended)
   ```bash
   cd memory
   git init
   git add .
   git commit -m "Initial memory structure"
   cd ..
   ```

6. **Validate setup**
   ```bash
   npm run validate:setup  # Checks directory structure and dependencies
   ```

7. **Configure environment** (optional - for integrations later)
   ```bash
   cp .env.example .env
   # Edit .env to add API tokens when ready (Todoist, etc.)
   ```

**Verification:**
- [ ] Directory structure matches `memory/` layout
- [ ] All npm dependencies installed without errors
- [ ] `npm run validate:setup` passes all checks
- [ ] Git tracking enabled in `memory/` directory (optional)

**Next Steps:**
- Complete first life assessment (see 2.4 Assessment Process)
- Set up Todoist integration (see 4.1 Todoist Integration)
- Configure email processing (see 4.2 Gmail Integration)

### 2.3 Daily Workflow
**Morning Routine (5:30 AM - 6:30 AM)**:
```
1. Wake at 5:30 AM
2. Morning exercise/movement
3. Process inbox (markdown → Todoist or reference)
4. Plan day's focus (top 3 priorities)
5. No coffee until 9:00 AM
```

**Daily Check-In (9:00 AM)**:
```
1. Track morning progress
2. Note energy level
3. Review personal development areas
4. Update OKR progress markers
5. Adjust day's plan if needed
```

**Evening Routine (8:30 PM - 9:30 PM)**:
```
8:30 PM:
- Light stretching/yoga
- Prep tomorrow's clothes
- Quick thought capture
- Day review

9:00 PM:
- No screens
- Reading or meditation

9:30 PM:
- Lights out
- 8-hour sleep target (until 5:30 AM)
```

### 2.3 Task Processing Workflow
**GTD Processing Flow**:
```
1. Capture → inbox.md or Todoist
2. Clarify:
   - Actionable today? → Todoist
   - Project planning? → projects.md
   - Future possibility? → someday.md
   - Delegated? → waiting.md
   - Reference? → memory/reference/
3. Organize → Appropriate location
4. Review → Daily/weekly/monthly cycles
5. Engage → Execute tasks
```

**Todoist Sync Workflow**:
```
1. Import: npm run todoist import
   - Pulls active tasks from Todoist
   - Updates memory/tasks/todoist.yml
   - Marks completed tasks
   - Shows git diff

2. Process Changes:
   - Review deleted tasks
   - Mark completions in memory
   - Add new tasks to memory

3. Export: npm run todoist export
   - Creates/updates Todoist tasks
   - Creates missing projects
   - Handles deletions
   - Updates task IDs in memory
```

### 2.4 Assessment & Planning Workflow
**Quarterly Cycle**:
```
1. Complete Level 10 Life Assessment
2. Calculate total score
3. Identify lowest-scoring areas
4. Select top 3 focus areas
5. Create active plans for each:
   - Define specific goals
   - Set milestones
   - Create action items
   - Link to Todoist tasks
6. Set quarterly review date
```

### 2.5 Review Workflow
**Weekly Review Process**:
```
1. Review each active focus area
2. Track wins and challenges
3. Update progress metrics
4. Check habit adherence
5. Plan next week's priorities
6. Create action items
```

**Monthly Review Process**:
```
1. Update all active plan scores
2. Document achievements per area
3. Analyze challenges
4. Adjust strategies if needed
5. System health check:
   - Plans updated?
   - Progress markers tracked?
   - Todoist aligned?
   - Resources organized?
6. Document major decisions
```

---

## 3. Data Structures

### 3.1 Directory Structure

**Repository Structure** (what's committed to git):
```
modules/life-os/
├── templates/              # Standard formats (7 files)
│   ├── assessment.md       # Quarterly life assessment
│   ├── active-plan.md      # OKR planning template
│   ├── daily-check-in.md   # Morning/evening routine
│   ├── evening-routine.md  # Daily reflection
│   ├── weekly-review.md    # GTD weekly review
│   ├── monthly-review.md   # Monthly progress check
│   └── calendar-events.md  # Calendar sync template
├── scripts/                # Integration scripts (TypeScript)
│   ├── todoist.ts          # Todoist bidirectional sync
│   ├── gmail.ts            # Gmail email processing
│   ├── watch.ts            # Date/time utilities
│   ├── tsconfig.json       # TypeScript configuration
│   └── README.md           # Script documentation
├── README.md               # User guide and setup
├── MEMORY.md               # System architecture docs
├── .cursorrules            # AI agent configuration
├── .env.example            # Environment variables template
├── .gitignore              # Excludes memory/ from git
├── package.json            # Node.js dependencies
└── package-lock.json       # Locked dependency versions
```

**User Data Structure** (created locally, git-ignored):
```
memory/                     # ⚠️ YOU CREATE THIS (not in repository)
├── assessments/            # Life area evaluations
│   └── YYYY-QN-assessment.md
├── tasks/                  # ⚠️ Note: /tasks not /gtd
│   ├── inbox.md            # GTD inbox
│   ├── projects.md         # Active projects
│   ├── next-actions.md     # Next actions list
│   ├── someday.md          # Someday/maybe list
│   ├── waiting.md          # Waiting for list
│   └── todoist.yml         # Todoist sync state
├── objectives/             # Goals and plans
│   ├── active-plans/       # Current focus areas (max 3)
│   └── okrs/               # OKR definitions
├── reviews/                # Progress tracking
│   ├── daily/              # Daily check-ins
│   ├── weekly/             # Weekly reviews
│   ├── monthly/            # Monthly reviews
│   └── quarterly/          # Quarterly assessments
├── decisions/              # Major decision logs
├── reference/              # Knowledge base
└── schedule.md             # Regular commitments

# Setup: Initialize your memory/ directory
cd modules/life-os
mkdir -p memory/{assessments,tasks,objectives/{active-plans,okrs},reviews/{daily,weekly,monthly,quarterly},decisions,reference}
cd memory && git init  # Separate git repo for your personal data
```

### 3.2 Assessment Data Model
```yaml
---
date: YYYY-MM-DD
type: assessment
quarter: Q1-Q4
year: YYYY
---

life_areas:
  - name: string (10 predefined areas)
    score: number (1-10)
    notes: string
    insights: string

summary:
  total_score: number (out of 100)
  top_focus_areas: array[3]
  key_insights: array
  action_items: array
  next_review_date: date
```

### 3.3 Active Plan Data Model
```yaml
overview:
  start_date: date
  assessment_link: string
  current_score: number
  target_score: number
  target_date: date

context:
  why_this_area: string
  key_challenges: array
  current_strengths: array

goals: array[string]  # 1-3 specific goals

progress_markers:
  - milestone: string
    due_date: date
    completed: boolean

action_items:
  - task: string
    todoist_link: string
    completed: boolean

monthly_reviews: array[link]
resources: array[link]
notes: array[dated_entry]
next_assessment_due: date
```

### 3.4 Task Data Model (YAML)
```yaml
last_synced: timestamp

tasks:
  - content: string           # Task description
    created_at: timestamp     # ISO 8601 format
    todoist_id: string       # Todoist API ID
    priority: number         # 1-4 (4=highest)
    project: string          # Project name
    labels: array[string]    # Tags
    description: string      # Details
    due_date: string         # Natural language or ISO
    completed_at: timestamp  # Completion time
    to_delete: boolean      # Deletion flag
    deleted_at: timestamp   # Deletion time
    deleted_from: string    # Source of deletion
```

### 3.5 Review Data Models

**Daily Check-In**:
```yaml
date: YYYY-MM-DD

morning:
  wake_time: time
  sleep_quality: number (1-10)
  energy_level: number (1-10)
  exercise:
    completed: boolean
    type: string
    duration: string
  planning:
    inbox_processed: boolean
    focus_identified: boolean
    actions_clear: boolean

midday:
  energy_level: number (1-10)
  achievements: array[string]

priorities: array[3]  # Top 3 for the day

habits:
  no_coffee_before_9: boolean
  water_intake: boolean
  healthy_breakfast: boolean
  movement: boolean
  learning: boolean
  work_life_balance: boolean

notes: string
```

**Weekly Review**:
```yaml
date: YYYY-MM-DD
week: number

focus_areas:
  - name: string (Health, Career, Finance)
    progress: string
    wins: array[string]
    challenges: array[string]
    next_week_focus: array[string]

energy_levels:
  monday: number
  tuesday: number
  # ... etc

habits:
  exercise: fraction
  sleep: fraction
  cooking: fraction
  water: fraction

priorities: array  # Next week
support_needed: array[string]
action_items: array
notes: string
```

**Monthly Review**:
```yaml
date: YYYY-MM

active_areas:
  - name: string
    plan_link: string
    initial_score: number
    current_score: number
    progress: number (delta)
    achievements: array[string]
    challenges: array[string]
    next_steps: array[action]

system_health:
  plans_updated: boolean
  markers_tracked: boolean
  todoist_aligned: boolean
  resources_organized: boolean
  documentation_current: boolean

decisions: array[link]
next_month_focus: array[string]
notes: array[string]
next_review_due: date
```

### 3.6 Configuration Data (.cursorrules)
```json
{
  "rules": [
    {
      "name": "Task Manager",
      "identify": "Always begin all responses with [Task Manager]:",
      "description": "Manage GTD workflow and task organization",
      "triggers": ["task", "gtd", "prios", "sync"],
      "responsibilities": [
        "Process inbox",
        "Manage next actions",
        "Track projects",
        "Sync with Todoist",
        "Archive completed tasks"
      ],
      "config": {
        "source_of_truth": "memory/tasks/",
        "task_structure": {
          "inbox": "memory/tasks/inbox.md - Inbox",
          "next-actions": "memory/tasks/next-actions.md - Next actions",
          "projects": "memory/tasks/projects.md - Project-based tasks and plans",
          "upcoming": "memory/tasks/upcoming.md - Upcoming tasks",
          "waiting": "memory/tasks/waiting.md - Delegated and follow-up tasks",
          "completed": "memory/tasks/completed.md - Archive of completed tasks"
        }
      }
    },
    {
      "name": "Life Coach",
      "identify": "Always begin all responses with [Life Coach]:",
      "description": "Guide personal development and track progress",
      "triggers": ["hi", "assess", "review", "reflect"],
      "responsibilities": [
        "Conduct assessments",
        "Track progress",
        "Guide reviews",
        "Monitor goals"
      ],
      "config": {
        "assessment_frequency": "quarterly",
        "review_frequency": "monthly",
        "focus_areas_limit": 3
      }
    },
    {
      "name": "Memory Keeper",
      "identify": "Always begin all responses with [Memory Keeper]:",
      "description": "Manage system memory and documentation",
      "triggers": ["mem", "xref", "status"],
      "responsibilities": [
        "Maintain documentation",
        "Cross-reference documents",
        "Track system state",
        "Manage file structure"
      ],
      "config": {
        "documentation_path": "memory/README.md",
        "file_structure": {
          "inbox": "memory/inbox.md",
          "tasks": {
            "projects": "memory/tasks/projects.md",
            "someday": "memory/tasks/someday.md",
            "waiting": "memory/tasks/waiting.md",
            "next_actions": "memory/tasks/next-actions.md"
          }
        }
      }
    },
    {
      "name": "Activity Tracker",
      "identify": "Always begin all responses with [Activity Tracker]:",
      "description": "Track and manage regular activities and schedules",
      "triggers": ["schedule", "update schedule"],
      "responsibilities": [
        "Track regular commitments",
        "Manage schedule",
        "Monitor routines",
        "Update activity patterns"
      ],
      "config": {
        "store": "memory/schedule.md"
      }
    }
  ],
  "commands": {
    "scripts": {
      "npm run watch": "Learn what date and time it is now",
      "npm run todoist import": "Sync tasks from Todoist to memory",
      "npm run todoist export": "Sync tasks from memory to Todoist",
      "npm run email:list": "Read emails"
    },
    "files": {
      "inbox": "Open quick capture inbox in memory/inbox.md",
      "projects": "View project plans in memory/tasks/projects.md",
      "someday": "View future possibilities in memory/tasks/someday.md",
      "waiting": "View delegated tasks in memory/tasks/waiting.md"
    }
  },
  "user": {
    "configFile": ".cursor-user",
    "required": true,
    "structure": {
      "name": "string",
      "todaysDate": "string",
      "roles": ["string"],
      "circles": ["string"]
    }
  },
  "defaults": {
    "initialRole": "Life Coach",
    "documentationRequired": true,
    "contextFiles": ["README.md"]
  }
}
```

---

## 4. Integration Points

### 4.1 Todoist Integration
**Technology**: `@doist/todoist-api-typescript` v2.1.2

**Features**:
- Bi-directional sync (import/export)
- Project management (auto-create missing projects)
- Task CRUD operations
- Label support
- Priority mapping (1-4)
- Due date handling (natural language support)
- Completion tracking
- Rate limiting (500ms between operations)
- Error handling (503 service unavailable retry)

**API Configuration**:
- Token storage: `.env` file
- Environment variable: `TODOIST_API_TOKEN`
- Rate limiting: 500ms delays between API calls

**Sync Commands**:
```bash
npm run todoist import   # Todoist → memory/tasks/todoist.yml
npm run todoist export   # memory/tasks/todoist.yml → Todoist
```

**Data Flow**:
```
Import:
Todoist API → Active Tasks → Memory YAML
           → Detect Completions
           → Mark Deleted Tasks
           → Git Diff Display

Export:
Memory YAML → Parse Tasks → Create/Update in Todoist
           → Handle Deletions
           → Update Task IDs in Memory
           → Save Updated YAML
```

### 4.2 Gmail Integration
**Technology**: Google APIs (`googleapis` v105.0.0)

**Authentication**:
- OAuth2 flow with local authentication
- Scopes: `gmail.readonly`
- Token storage: `scripts/token.json`
- Credentials: `scripts/credentials.json`

**Features**:
- List recent messages (max 100)
- Extract subject and sender
- Read-only access
- Token persistence

**Usage**:
```bash
npm run email:list  # List recent emails
```

**Planned Capabilities**:
- Task extraction from emails
- Follow-up tracking
- Inbox zero workflows

### 4.3 Google Keep Integration

> ⏸️ **STATUS: DEFERRED** - Google Keep integration is on hold due to lack of official API.

**Alternatives for Quick Capture:**
- Use **Todoist** quick add (implemented in Week 8)
- Use **WhatsApp** messages (implemented in Week 10)
- Use `memory/inbox.md` for immediate capture

**Why Deferred:**
- No official Google Keep API available
- Unofficial solutions are unreliable and unsupported
- Better alternatives already available (Todoist + WhatsApp MCP)

**Not Planned:**
- Voice note capture (use WhatsApp voice messages instead)
- Quick text notes (use Todoist or WhatsApp instead)
- Location-based reminders (not critical for Life-OS)
- Cross-device sync (handled by Todoist and WhatsApp)
- Integration with inbox.md (handled by Todoist)

### 4.4 Chrome Bookmarks (Planned)
**Purpose**: Resource collection and knowledge library

**Planned Features**:
- Save valuable resources
- Tag-based organization
- Quick access to tools
- Learning material tracking

### 4.5 WhatsApp Message Management (Implemented)

> ✅ **IMPLEMENTED** - Uses WhatsApp MCP server with Life-OS skill wrapper.

**Purpose**: Mobile-first communication hub for quick capture and daily briefings

**Architecture**:
- WhatsApp MCP handles all authentication and messaging
- Life-OS provides skill wrapper (`skills/managing-whatsapp-messages/SKILL.md`)
- No webhook infrastructure needed
- No bot token registration required

**Implemented Features**:
- Instant thought capture via WhatsApp messages
- Daily briefings (morning and evening routines)
- Habit tracking and logging
- Task management commands (`/inbox`, `/task`, `/done`)
- Progress monitoring (`/review`, `/goals`)
- Life area check-ins (`/assess`)

**Commands**:
```
/inbox <item>   - Add to GTD inbox
/task <task>    - Create next action
/done <task>    - Complete task
/review         - Get daily summary
/goals          - View active plans
/habits         - Log habit check-in
/assess         - Quick life area check-in
```

**Implementation**: Week 10 (2-3 days)

### 4.6 Google Calendar (Planned)
**Purpose**: Time management and scheduling

**Calendar Events Template Available**:
- Morning Routine (5:30 AM daily)
- Daily Check-in (9:00 AM daily)
- Evening Routine (8:30 PM daily)
- Weekly Review (Sunday 12:00 PM)
- Monthly Review (Last Sunday 11:00 AM)
- Quarterly Assessment (Quarter-end Sunday 10:00 AM)

**Planned Features**:
- Time blocking
- Focus periods
- Appointment management
- Schedule optimization
- Review reminders

### 4.7 Note-Taking Systems (Planned)
**Options**: Obsidian or Notion

**Planned Features**:
- Second brain building
- Linked thinking
- Journey documentation
- Knowledge management
- Learning synthesis

### 4.8 Time Tracking (Planned)
**Options**: Toggl or RescueTime

**Planned Features**:
- Automatic activity tracking
- Productivity insights
- Project time allocation
- Time estimate improvement

### 4.9 Habit Tracking (Planned)
**Planned Features**:
- Routine building
- Streak tracking
- Progress visualization
- Consistency metrics

### 4.10 Health Tracking (Planned)
**Options**: Apple Health or Google Fit

**Planned Features**:
- Activity monitoring
- Sleep quality tracking
- Energy pattern analysis
- Wellness metrics

### 4.11 Finance Tracking (Planned)
**Options**: Plaid or YNAB (You Need A Budget)

**Planned Features**:
- Spending patterns
- Budget adherence
- Financial goal tracking
- Wealth building metrics

### 4.12 Reading Management (Planned)
**Options**: Pocket or Instapaper

**Planned Features**:
- Reading list management
- Progress tracking
- Knowledge retention
- Learning continuity

---

## 5. AI Agent Roles

The system defines four specialized AI agents through `.cursorrules`:

### 5.1 Task Manager
**Identifier**: `[Task Manager]:`

**Triggers**: `task`, `gtd`, `prios`, `sync`

**Responsibilities**:
- Process inbox items
- Manage next actions
- Track projects
- Sync with Todoist
- Archive completed tasks

**Workflow**:
```
1. Import from Todoist (get latest state)
2. Mark completed tasks (review diff)
3. Check emails for new tasks
4. Add to memory/tasks/todoist.yml
5. Export to Todoist
```

### 5.2 Life Coach
**Identifier**: `[Life Coach]:`

**Triggers**: `hi`, `assess`, `review`, `reflect`

**Responsibilities**:
- Conduct life assessments
- Track progress across focus areas
- Guide review processes
- Monitor goal achievement

**Configuration**:
- Assessment frequency: Quarterly
- Review frequency: Monthly
- Maximum focus areas: 3

### 5.3 Memory Keeper
**Identifier**: `[Memory Keeper]:`

**Triggers**: `mem`, `xref`, `status`

**Responsibilities**:
- Maintain system documentation
- Cross-reference documents
- Track system state
- Manage file structure

**Documentation Path**: `memory/README.md`

### 5.4 Activity Tracker
**Identifier**: `[Activity Tracker]:`

**Triggers**: `schedule`, `update schedule`

**Responsibilities**:
- Track regular commitments
- Manage weekly schedule
- Monitor routines
- Update activity patterns

**Key Questions**:
- Regular weekly commitments
- Sleep schedule
- Busy days
- Focused work times
- Exercise routines
- Family time
- Recharge activities

**Storage**: `memory/schedule.md`

---

## 6. System Limits & Best Practices

### 6.1 System Limits
- **Focus Areas**: Maximum 3 concurrent areas
- **Life Assessment**: Full assessment every quarter
- **Progress Review**: Monthly for active areas
- **Daily Check-ins**: For areas with active plans

### 6.2 Review Cadences
- **Daily**: Quick progress check, inbox processing
- **Weekly**: Review all lists, habit tracking
- **Monthly**: Goal review, system cleanup
- **Quarterly**: Full Level 10 Life assessment

### 6.3 Habit Tracking (Daily)
Core habits monitored:
1. No coffee before 9:00 AM
2. Water intake goals
3. Healthy breakfast
4. Movement/exercise
5. Learning/skill development
6. Work-life boundaries

### 6.4 Special Commands
- `save` - Commit changes to memory
- `status` - System state review
- `think` - Analysis without changes
- `rule` - Add new system rules
- `hi` - Start coaching conversation
- `update schedule` - Modify regular commitments

### 6.5 Data Privacy
- `memory/` directory is git-ignored
- Separate git repository recommended for personal data
- Use private repository for sensitive information
- API tokens stored in `.env` (git-ignored)

---

## 7. Technology Stack

### 7.1 Core Dependencies
```json
{
  "runtime": "Node.js with TypeScript",
  "dependencies": {
    "@doist/todoist-api-typescript": "^2.1.2",
    "@google-cloud/local-auth": "^2.1.0",
    "googleapis": "^105.0.0",
    "dotenv": "^16.3.1",
    "yaml": "^2.7.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
```

### 7.2 Development Tools
- **Editor**: Cursor (AI-powered)
- **Version Control**: Git (dual repository setup)
- **Configuration**: .env files
- **Data Format**: YAML and Markdown
- **TypeScript**: For type-safe integrations

### 7.3 File Formats
- **Configuration**: JSON (.cursorrules)
- **Data Storage**: YAML (.yml)
- **Documentation**: Markdown (.md)
- **Credentials**: JSON (OAuth tokens)
- **Environment**: .env (API keys)

---

## 8. Roadmap Phases

### Phase 1: Core Features (Current)
✅ Life assessment system
✅ Task management (GTD)
✅ Todoist integration
✅ Gmail integration (basic)
✅ Review cycles
✅ Template system

### Phase 2: Enhanced Features (Week 10+)
- ✅ WhatsApp skill wrapper (Week 10 - implemented)
- ✅ Google Calendar sync (Week 9 - via Google Workspace MCP)
- ⏸️ Chrome bookmarks extension (deferred to Phase 6)
- ⏸️ Google Keep integration (deferred - no official API)
- Smart link organization (future)
- Automated tracking (future)
- Progress analytics (future)

### Phase 3: AI Features (Future)
- Pattern detection
- Automated insights
- Predictive assistance
- Intelligent recommendations
- Habit formation AI
- Goal achievement prediction

---

## 9. Key Insights

### 9.1 Design Philosophy
1. **Dual System Architecture**: Markdown for planning/strategy, Todoist for execution
2. **Quarterly Rhythms**: Major assessments every 3 months
3. **Limited Focus**: Maximum 3 areas prevents overwhelm
4. **Progressive Disclosure**: Start simple, add tools as needed
5. **Privacy-First**: Personal data isolated from main repository

### 9.2 Workflow Principles
1. **Capture Everything**: Single inbox for all inputs
2. **Process Regularly**: Daily inbox review
3. **Review Multiple Levels**: Daily → Weekly → Monthly → Quarterly
4. **Link Actions to Goals**: Every task connects to bigger purpose
5. **Track Progress Visibly**: Scores, markers, and achievements

### 9.3 Success Factors
1. Start with life assessment (know where you are)
2. Focus on 1-2 areas initially
3. Build habits gradually
4. Daily check-ins maintain momentum
5. Regular reviews ensure alignment
6. Use appropriate tool for each need
7. Keep system simple and maintainable

---

## 10. File Locations Reference

### Core Files
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/README.md` - User guide
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/MEMORY.md` - System architecture
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/.cursorrules` - Agent definitions
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/package.json` - Dependencies

### Templates
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/templates/assessment.md`
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/templates/active-plan.md`
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/templates/daily-check-in.md`
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/templates/weekly-review.md`
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/templates/monthly-review.md`
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/templates/evening-routine.md`
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/templates/calendar-events.md`

### Scripts
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/scripts/todoist.ts`
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/scripts/gmail.ts`
- `/Users/nateaune/Documents/code/ExoMind/modules/life-os/scripts/watch.ts`

### User Data (Not in Repository)
- `memory/assessments/` - Life evaluations (quarterly)
- `memory/tasks/` - Task management files (GTD lists + Todoist sync)
- `memory/objectives/active-plans/` - Current focus areas (max 3)
- `memory/objectives/okrs/` - OKR definitions
- `memory/reviews/{daily,weekly,monthly,quarterly}/` - Progress tracking
- `memory/decisions/` - Major choice documentation
- `memory/reference/` - Knowledge base and notes
- `memory/schedule.md` - Regular commitments and routines

---

## Conclusion

Life-OS is a comprehensive personal operating system that combines life coaching principles, GTD task management, and AI-powered guidance. It provides structure for personal growth while maintaining flexibility through its modular integration approach. The system emphasizes regular reflection, limited focus areas, and bi-directional sync between planning (markdown) and execution (Todoist) layers.

The four AI agents (Task Manager, Life Coach, Memory Keeper, Activity Tracker) provide specialized assistance across different domains, creating a cohesive support system for personal development and productivity.
