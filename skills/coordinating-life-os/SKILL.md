# System Coordination Skill

## Purpose
Orchestrate and maintain the Life OS ecosystem - verify integrations, guide workflow discovery, troubleshoot issues, and ensure all systems work together harmoniously.

## When to Use This Skill
- Starting your Life OS journey (onboarding)
- System feels disconnected or out of sync
- Unsure which skill to use for a task
- Troubleshooting integration issues
- Checking system health
- Need workflow guidance
- Managing system configuration
- Checking for updates

## Core Functions

### 1. Health Checks
Verify all integrations are functioning:
```bash
# Check Todoist integration
todoist sync

# Check Gmail/Calendar (via Google Workspace MCP)
mcp__google-workspace__list_task_lists

# Check WhatsApp integration
mcp__whatsapp__list_chats --limit 5

# Check skill availability
ls -la skills/*/SKILL.md
```

### 2. Data Sync Status
Monitor synchronization across systems:
- Todoist ↔ Memory (tasks, projects, goals)
- Gmail ↔ Memory (emails, follow-ups)
- Calendar ↔ Memory (events, schedules)
- WhatsApp ↔ Memory (messages, briefs)
- Skills ↔ Workflows (execution history)

### 3. Skill Discovery
Help users find the right skill:
```javascript
// Skill map by category
const SKILL_MAP = {
  planning: ['daily-planning', 'weekly-planning', 'monthly-review', 'quarterly-review'],
  productivity: ['processing-inbox', 'recipe-finding', 'grocery-shopping'],
  reflection: ['conducting-life-assessment', 'weekly-review', 'quarterly-review'],
  goals: ['goal-setting', 'weekly-planning', 'quarterly-review'],
  communication: ['whatsapp-message-management'],
  system: ['coordinating-life-os']
};

// Skill selection guide
function suggestSkill(userIntent) {
  const intentMap = {
    'start my day': 'daily-planning',
    'plan my week': 'weekly-planning',
    'process emails': 'processing-inbox',
    'review my week': 'weekly-review',
    'review my month': 'monthly-review',
    'review my quarter': 'quarterly-review',
    'set new goals': 'goal-setting',
    'assess my life': 'conducting-life-assessment',
    'grocery shopping': 'grocery-shopping',
    'find recipes': 'recipe-finding',
    'manage whatsapp': 'whatsapp-message-management',
    'system status': 'coordinating-life-os'
  };
  return intentMap[userIntent.toLowerCase()] || 'coordinating-life-os';
}
```

### 4. Workflow Guidance
Suggest optimal skill sequences:

**Daily Workflow:**
1. `processing-inbox` → Clear email/tasks
2. `daily-planning` → Plan your day
3. `whatsapp-message-management` → Check messages

**Weekly Workflow:**
1. `weekly-review` → Reflect on past week
2. `weekly-planning` → Plan next week
3. `processing-inbox` → Clear backlogs

**Monthly Workflow:**
1. `monthly-review` → Review 4 weekly reviews
2. `goal-setting` → Adjust goals if needed
3. `conducting-life-assessment` → Assess life areas (optional)

**Quarterly Workflow:**
1. `quarterly-review` → Review 3 monthly reviews
2. `conducting-life-assessment` → Full life assessment
3. `goal-setting` → Set Q+1 OKRs

**Special Purpose:**
- Meal planning → `recipe-finding` → `grocery-shopping`
- Quick task capture → `whatsapp-message-management`
- System issues → `coordinating-life-os`

### 5. Troubleshooting Guide

**Common Issues:**

**Issue: Todoist not syncing**
```bash
# Solution 1: Force sync
todoist sync

# Solution 2: Check API token
echo $TODOIST_API_TOKEN

# Solution 3: Verify connection
curl -X GET https://api.todoist.com/rest/v2/projects \
  -H "Authorization: Bearer $TODOIST_API_TOKEN"
```

**Issue: Skills not working**
```bash
# Check skill structure
ls -la skills/*/SKILL.md

# Verify skill format
cat skills/daily-planning/SKILL.md | head -20

# Check for syntax errors
npx claude-flow@alpha validate-skills
```

**Issue: Memory not persisting**
```bash
# Check memory database
ls -la .swarm/memory.db

# Test memory operations
npx claude-flow@alpha hooks test-memory

# Check memory usage
du -sh .swarm/
```

**Issue: Integration timeouts**
```bash
# Check MCP server status
claude mcp list

# Restart MCP servers
claude mcp restart claude-flow
claude mcp restart google-workspace
claude mcp restart whatsapp

# Test connectivity
mcp__google-workspace__list_calendars --user_google_email="your@email.com"
```

### 6. Configuration Management

**Environment Setup:**
```bash
# Create .env from example
cp .env.example .env

# Required variables
TODOIST_API_TOKEN=your_token_here
GOOGLE_WORKSPACE_EMAIL=your@email.com

# Optional integrations
WHATSAPP_ENABLED=true
NOTION_ENABLED=false
```

**MCP Server Configuration:**
```bash
# Add required MCP servers
claude mcp add claude-flow npx claude-flow@alpha mcp start
claude mcp add google-workspace npx google-workspace-mcp

# Optional servers
claude mcp add whatsapp npx whatsapp-mcp
claude mcp add flow-nexus npx flow-nexus@latest mcp start

# List active servers
claude mcp list

# Test server
claude mcp test claude-flow
```

**Skills Configuration:**
```javascript
// ~/.config/life-os/config.json
{
  "skills": {
    "daily-planning": { "enabled": true, "startTime": "06:00" },
    "weekly-review": { "enabled": true, "dayOfWeek": "Sunday" },
    "monthly-review": { "enabled": true, "dayOfMonth": 28 },
    "quarterly-review": { "enabled": true, "months": [3, 6, 9, 12] }
  },
  "integrations": {
    "todoist": { "enabled": true, "autoSync": true },
    "gmail": { "enabled": true, "labels": ["action", "waiting"] },
    "calendar": { "enabled": true, "defaultCalendar": "primary" },
    "whatsapp": { "enabled": true, "autoCapture": false }
  },
  "memory": {
    "provider": "local",
    "path": ".swarm/memory.db",
    "maxSize": "100MB"
  }
}
```

### 7. System Updates

**Check for Updates:**
```bash
# Check skill versions
git pull origin main

# Update MCP servers
npm update -g claude-flow@alpha
npm update -g google-workspace-mcp
npm update -g whatsapp-mcp

# Check for new features
npx claude-flow@alpha changelog

# Update dependencies
npm install
npm audit fix
```

**Skill Updates:**
```bash
# List available skills
ls -la skills/

# Check for new skills
git fetch origin
git diff main origin/main -- skills/

# Update all skills
git pull origin main

# Verify skill integrity
npx claude-flow@alpha validate-skills
```

## Coordination Protocol

### System Health Check Routine
```bash
# 1. Check integrations
echo "=== INTEGRATION STATUS ==="
todoist sync && echo "✓ Todoist OK" || echo "✗ Todoist FAIL"
mcp__google-workspace__list_calendars && echo "✓ Google OK" || echo "✗ Google FAIL"
mcp__whatsapp__list_chats --limit 1 && echo "✓ WhatsApp OK" || echo "✗ WhatsApp FAIL"

# 2. Check skills
echo "=== SKILLS STATUS ==="
ls skills/*/SKILL.md | wc -l
echo "skills available"

# 3. Check memory
echo "=== MEMORY STATUS ==="
du -sh .swarm/memory.db
sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM memories;"

# 4. Check hooks
echo "=== HOOKS STATUS ==="
npx claude-flow@alpha hooks list

# 5. Generate report
npx claude-flow@alpha hooks system-health
```

### Onboarding Checklist
```markdown
# Life OS Onboarding

## Phase 1: Environment Setup
- [ ] Install Claude Code
- [ ] Install MCP servers (claude-flow, google-workspace, whatsapp)
- [ ] Configure .env file
- [ ] Test integrations

## Phase 2: Integration Configuration
- [ ] Connect Todoist (API token)
- [ ] Connect Gmail (OAuth)
- [ ] Connect Calendar (OAuth)
- [ ] Connect WhatsApp (optional)

## Phase 3: Skill Discovery
- [ ] Read skills/README.md
- [ ] Try daily-planning skill
- [ ] Try processing-inbox skill
- [ ] Try weekly-review skill

## Phase 4: First Workflows
- [ ] Complete first daily plan
- [ ] Process inbox to zero
- [ ] Complete first weekly review
- [ ] Set initial goals

## Phase 5: System Mastery
- [ ] Complete conducting-life-assessment
- [ ] Complete first monthly review
- [ ] Set up automated workflows
- [ ] Customize configuration
```

## Memory Integration

Store system state and diagnostics:
```bash
# Store system health
npx claude-flow@alpha hooks post-edit \
  --file "system/health-check.json" \
  --memory-key "swarm/system/health"

# Store configuration
npx claude-flow@alpha hooks post-edit \
  --file "config/life-os.json" \
  --memory-key "swarm/system/config"

# Store troubleshooting history
npx claude-flow@alpha hooks post-edit \
  --file "logs/issues.log" \
  --memory-key "swarm/system/issues"
```

## Output Format

### System Health Report
```markdown
# Life OS Health Report
**Generated**: 2025-10-20

## Integration Status
- ✓ Todoist: Connected (Last sync: 2 min ago)
- ✓ Gmail: Connected (23 unread)
- ✓ Calendar: Connected (3 events today)
- ⚠ WhatsApp: Slow response (check connection)

## Skill Status
- Total Skills: 12
- Active Skills: 10
- Last Used: daily-planning (2 hours ago)

## Memory Status
- Database Size: 45 MB / 100 MB
- Total Memories: 1,247
- Last Updated: 5 min ago

## System Performance
- Average Response Time: 1.2s
- Memory Usage: 45%
- Disk Usage: 67%

## Recommendations
1. WhatsApp connection slow - restart MCP server
2. Memory database growing - consider archiving old data
3. 2 skills not used in 30 days - consider removing
```

### Skill Recommendation
```markdown
# Skill Recommendation

**Your Intent**: "I want to plan my week"

**Recommended Skill**: weekly-planning

**Why**: This skill helps you:
- Review past week accomplishments
- Set priorities for next week
- Block time for important tasks
- Identify potential obstacles

**Prerequisite Skills**:
1. processing-inbox (clear email/task backlog)
2. weekly-review (reflect on past week first)

**Related Skills**:
- daily-planning (break week into daily plans)
- goal-setting (align week with larger goals)
- monthly-review (see big picture context)

**Workflow**:
1. Run weekly-review (assess past week)
2. Run weekly-planning (plan next week)
3. Run daily-planning (Monday) to start week
```

## Success Metrics
- All integrations connected and syncing
- Users can find the right skill quickly
- System health checks pass regularly
- Zero unresolved integration issues
- Configuration matches user needs
- Skills stay up-to-date

## Example Usage

**Scenario 1: New User Onboarding**
```
User: "I just installed Life OS, what should I do first?"