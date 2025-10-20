# System Coordination Skill

## Quick Start

```bash
# Check system health
bash skills/coordinating-life-os/check-health.sh

# Find the right skill
bash skills/coordinating-life-os/suggest-skill.sh "plan my week"

# Troubleshoot issues
bash skills/coordinating-life-os/troubleshoot.sh
```

## What This Skill Does

The System Coordination skill is your **Life OS control center**. It:

1. **Monitors Health** - Checks all integrations (Todoist, Gmail, Calendar, WhatsApp)
2. **Guides Discovery** - Helps you find the right skill for any task
3. **Suggests Workflows** - Recommends optimal skill sequences
4. **Troubleshoots Issues** - Diagnoses and fixes common problems
5. **Manages Configuration** - Handles system settings and updates

## When to Use

- 🆕 **Starting Out**: First time using Life OS
- 🔧 **Something's Broken**: Integration not working
- 🤔 **Need Guidance**: Unsure which skill to use
- 📊 **Health Check**: Regular system maintenance
- ⚙️ **Configuration**: Changing settings

## Common Commands

### Health Check
```bash
# Quick health check
todoist sync && echo "✓ Todoist OK"
mcp__google-workspace__list_calendars && echo "✓ Google OK"
mcp__whatsapp__list_chats --limit 1 && echo "✓ WhatsApp OK"

# Full system health report
npx claude-flow@alpha hooks system-health
```

### Skill Discovery
```bash
# List all skills
ls -la skills/*/SKILL.md

# Find skill by category
grep -r "## Purpose" skills/*/SKILL.md

# Get skill recommendations
cat skills/coordinating-life-os/SKILL.md | grep "Workflow Guide"
```

### Troubleshooting
```bash
# Check integration status
claude mcp list

# Restart MCP servers
claude mcp restart claude-flow
claude mcp restart google-workspace

# Test connection
mcp__google-workspace__list_task_lists --user_google_email="your@email.com"
```

## Integration Map

```
Life OS Ecosystem:
├── Todoist (Tasks & Projects)
│   ├── daily-planning
│   ├── weekly-planning
│   └── goal-setting
├── Gmail (Email Processing)
│   └── processing-inbox
├── Calendar (Time Blocking)
│   ├── daily-planning
│   └── weekly-planning
└── WhatsApp (Quick Capture)
    └── whatsapp-message-management
```

## Skill Recommendation Matrix

| User Intent | Recommended Skill | Why |
|-------------|------------------|-----|
| "Start my day" | daily-planning | Creates structured day plan |
| "Plan my week" | weekly-planning | Sets weekly priorities |
| "Review my week" | weekly-review | Reflects on progress |
| "Process emails" | processing-inbox | Clears email backlog |
| "Set goals" | goal-setting | Establishes objectives |
| "Grocery shopping" | grocery-shopping | Meal planning + shopping |
| "Find recipes" | recipe-finding | Discovers meal ideas |
| "Check messages" | whatsapp-message-management | Manages WhatsApp |
| "System status" | coordinating-life-os | Health check |

## Workflow Sequences

### 🌅 Morning Routine
1. `processing-inbox` - Clear overnight emails/tasks
2. `daily-planning` - Plan your day
3. `whatsapp-message-management` - Check important messages

### 📅 Weekly Cadence
1. **Sunday Evening**: `weekly-review` → `weekly-planning`
2. **Monday-Friday**: `daily-planning` each morning
3. **End of Day**: Quick inbox processing

### 📊 Monthly Cycle
1. **Last Sunday**: `monthly-review` (review 4 weeks)
2. **First Monday**: `goal-setting` (adjust goals if needed)
3. **Quarterly**: `conducting-life-assessment`

## Troubleshooting Quick Reference

### Issue: Todoist not syncing
```bash
# Check API token
echo $TODOIST_API_TOKEN

# Force sync
todoist sync

# Test API connection
curl -X GET https://api.todoist.com/rest/v2/projects \
  -H "Authorization: Bearer $TODOIST_API_TOKEN"
```

### Issue: Google Workspace not working
```bash
# Check MCP server
claude mcp list | grep google-workspace

# Restart server
claude mcp restart google-workspace

# Test OAuth
mcp__google-workspace__list_calendars --user_google_email="your@email.com"
```

### Issue: Skills not found
```bash
# Verify skill structure
ls -la skills/*/SKILL.md

# Check for errors
cat skills/daily-planning/SKILL.md | head -20

# Update skills
git pull origin main
```

## Configuration

### Environment Variables
```bash
# Required
TODOIST_API_TOKEN=your_token_here
GOOGLE_WORKSPACE_EMAIL=your@email.com

# Optional
WHATSAPP_ENABLED=true
NOTION_ENABLED=false
```

### MCP Servers
```bash
# Required
claude mcp add claude-flow npx claude-flow@alpha mcp start
claude mcp add google-workspace npx google-workspace-mcp

# Optional
claude mcp add whatsapp npx whatsapp-mcp
```

## Output Examples

### Health Report
```
Life OS Health Report
Generated: 2025-10-20

Integration Status:
✓ Todoist: Connected (Last sync: 2 min ago)
✓ Gmail: Connected (23 unread)
✓ Calendar: Connected (3 events today)
⚠ WhatsApp: Slow response (check connection)

Skill Status:
Total Skills: 12
Active Skills: 10
Last Used: daily-planning (2 hours ago)

Recommendations:
1. WhatsApp connection slow - restart MCP server
2. 2 skills not used in 30 days - consider removing
```

### Skill Recommendation
```
Recommended Skill: weekly-planning

Why: This skill helps you:
- Review past week accomplishments
- Set priorities for next week
- Block time for important tasks
- Identify potential obstacles

Workflow:
1. Run weekly-review (assess past week)
2. Run weekly-planning (plan next week)
3. Run daily-planning (Monday) to start week
```

## Next Steps

After system coordination setup:
1. Run your first `daily-planning` skill
2. Try `processing-inbox` to clear email
3. Complete a `weekly-review` this Sunday
4. Explore other skills as needed

## Related Skills
- All skills depend on system coordination
- Use this skill for troubleshooting any other skill
- Run health checks weekly

## Support
- Documentation: See `skills/coordinating-life-os/SKILL.md`
- Issues: Check troubleshooting section
- Updates: `git pull origin main`
