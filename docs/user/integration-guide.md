# Integration Guide

Life OS becomes more powerful when integrated with your existing tools. This guide covers setting up and using all available integrations.

## Integration Overview

Life OS supports these integrations:

- **Todoist**: Task and project management
- **Google Workspace**: Gmail and Calendar
- **WhatsApp**: Mobile-first messaging
- **GitHub**: Code and project tracking (developer-focused)

## Todoist Integration

### Why Integrate Todoist?

- Sync tasks across devices
- Use existing Todoist workflows
- Leverage Todoist's mobile apps
- Access Todoist's rich ecosystem
- Keep Life OS as single source of truth

### Setup Steps

#### 1. Get Your API Token

1. Go to [Todoist Settings](https://todoist.com/prefs/integrations)
2. Scroll to "Developer" section
3. Copy your API token

#### 2. Configure Life OS

Add to your `.env` file:

```env
TODOIST_API_TOKEN=your_api_token_here
TODOIST_SYNC_ENABLED=true
TODOIST_SYNC_INTERVAL=300  # 5 minutes
```

#### 3. Initialize Connection

```bash
npm run todoist:init
```

This will:
- Test API connection
- Create project mappings
- Set up label structure
- Configure sync preferences

### Project Mapping

Map Life OS categories to Todoist projects:

```json
{
  "lifeAreas": {
    "health": "Life OS - Health",
    "career": "Life OS - Career",
    "relationships": "Life OS - Relationships",
    "personal": "Life OS - Personal",
    "financial": "Life OS - Financial"
  }
}
```

Customize in `config/todoist-mapping.json`

### Sync Configuration

#### Sync Modes

**Manual Sync**:
```bash
npm run todoist:sync
```

**Automatic Sync**:
Set in `.env`:
```env
TODOIST_AUTO_SYNC=true
TODOIST_SYNC_INTERVAL=300  # seconds
```

**Real-time Sync** (Advanced):
```env
TODOIST_REALTIME_SYNC=true
```

#### Sync Direction

Configure what syncs:

```json
{
  "syncDirection": {
    "tasks": "bidirectional",    // both ways
    "projects": "to_todoist",    // Life OS → Todoist
    "labels": "from_todoist",    // Todoist → Life OS
    "priorities": "bidirectional"
  }
}
```

### Task Mapping

#### Priority Mapping

```
Life OS Priority → Todoist Priority
High (P1)        → p1 (urgent)
Medium (P2)      → p2 (high)
Low (P3)         → p3 (medium)
None (P4)        → p4 (low)
```

#### Label Mapping

Life OS labels automatically sync:

```
@health     → @health
@work       → @work
@personal   → @personal
@waiting    → @waiting
@someday    → @someday
```

### Common Commands

```bash
# Sync all tasks
npm run todoist:sync

# Import from Todoist
npm run todoist:import

# Export to Todoist
npm run todoist:export

# View sync status
npm run todoist:status

# Resolve conflicts
npm run todoist:conflicts

# Test connection
npm run todoist:test
```

### Troubleshooting Todoist

**Issue**: Duplicate tasks appearing

**Solution**:
```bash
npm run todoist:deduplicate
npm run todoist:sync --force
```

**Issue**: Sync conflicts

**Solution**:
```bash
npm run todoist:conflicts --resolve
# Choose: use_local, use_remote, or merge
```

**Issue**: Connection errors

**Solution**:
```bash
npm run todoist:test
# Check API token validity
# Verify network connection
```

---

## Google Workspace Integration

### Why Integrate Google?

- Calendar-based planning
- Email to task conversion
- Meeting preparation
- Schedule optimization
- Time tracking

### Setup Steps

#### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "Life OS Integration"
3. Enable these APIs:
   - Gmail API
   - Google Calendar API
   - Google Drive API (optional)

#### 2. Create OAuth Credentials

1. Go to "Credentials" section
2. Create OAuth 2.0 Client ID
3. Application type: "Desktop app"
4. Download credentials JSON
5. Save as `config/google-credentials.json`

#### 3. Configure Life OS

Add to `.env`:

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth/google
GOOGLE_SYNC_ENABLED=true
```

#### 4. Authenticate

```bash
npm run google:auth
```

This will:
- Open browser for OAuth
- Request permissions
- Save refresh token
- Test connection

### Gmail Integration

#### Features

- **Inbox Processing**: Convert emails to tasks
- **Follow-up Tracking**: Automatic reminders
- **Email Templates**: Quick responses
- **Label Automation**: Smart categorization

#### Commands

```bash
# Process inbox
npm run gmail:process

# Create task from email
npm run gmail:to-task --email-id <id>

# Search emails
npm run gmail:search --query "is:unread"

# Archive processed
npm run gmail:archive
```

#### Email to Task Workflow

1. **Flag Email**: Star or label in Gmail
2. **Run Processor**: `npm run gmail:process`
3. **Review Tasks**: Tasks created in Life OS
4. **Email Archived**: Automatically archived

#### Configuration

`config/gmail-rules.json`:

```json
{
  "autoCreateTasks": {
    "labels": ["action-required", "follow-up"],
    "fromAddresses": ["boss@company.com"],
    "keywords": ["urgent", "deadline", "please review"]
  },
  "autoArchive": {
    "afterTaskCreation": true,
    "newsletters": true
  }
}
```

### Google Calendar Integration

#### Features

- **Event Sync**: Import to daily planning
- **Time Blocking**: Protected focus time
- **Conflict Detection**: Scheduling conflicts
- **Meeting Prep**: Auto-generated prep tasks

#### Commands

```bash
# Sync calendar
npm run calendar:sync

# Review today
npm run calendar:today

# Review week
npm run calendar:week

# Block focus time
npm run calendar:block --duration 120

# Find free time
npm run calendar:free --duration 60
```

#### Calendar Review Workflow

Part of daily planning:

```bash
npm run life-os:daily-plan
# Automatically:
# 1. Fetches today's events
# 2. Shows conflicts
# 3. Suggests time blocks
# 4. Creates meeting prep tasks
```

#### Time Blocking

Block focus time for important work:

```bash
# Block 2 hours morning
npm run calendar:block \
  --title "Deep Work" \
  --duration 120 \
  --time "09:00"

# Recurring blocks
npm run calendar:block \
  --title "Weekly Review" \
  --duration 60 \
  --time "Sun 16:00" \
  --recurring "weekly"
```

### Google Drive (Optional)

Store documents and templates:

```bash
# Upload assessment
npm run drive:upload --file assessment.json

# Download templates
npm run drive:download --folder "Life OS Templates"
```

### Troubleshooting Google

**Issue**: OAuth errors

**Solution**:
```bash
npm run google:reauth
# Re-authenticate completely
```

**Issue**: Calendar not syncing

**Solution**:
```bash
npm run calendar:sync --force
npm run calendar:test
```

**Issue**: Permission errors

**Solution**:
- Check API is enabled
- Verify OAuth scopes
- Re-authenticate

---

## WhatsApp Integration

### Why Integrate WhatsApp?

- Mobile-first access
- Quick task capture
- Voice note logging
- Daily briefings
- No app switching

### Setup Steps

#### 1. Install WhatsApp MCP

Already included in Life OS, just enable:

```env
WHATSAPP_MCP_ENABLED=true
WHATSAPP_PHONE_NUMBER=+1234567890  # Your number
```

#### 2. Authenticate

```bash
npm run whatsapp:auth
```

Scan QR code with WhatsApp mobile app.

#### 3. Test Connection

```bash
npm run whatsapp:test
# Sends test message to yourself
```

### Features

#### Quick Capture

Send messages to yourself:

```
Add task: Buy groceries
Note: Great idea for article
Log mood: 7/10 - feeling productive
```

Life OS automatically:
- Creates task in Todoist
- Adds note to inbox
- Logs mood in daily log

#### Daily Briefing

Receive daily summary via WhatsApp:

```bash
# Configure briefing time
npm run whatsapp:briefing --time "07:00"
```

Briefing includes:
- Today's agenda
- Top 3 priorities
- Upcoming deadlines
- Goal progress
- Weather and commute

#### Voice Notes

Record reflections on-the-go:

1. Send voice note to yourself
2. Auto-transcribed
3. Added to daily log
4. Searchable in Life OS

#### Commands via WhatsApp

Message yourself commands:

```
help                    # Show available commands
today                   # Today's agenda
next                    # Next task
done [task]            # Complete task
log [entry]            # Daily log entry
goals                  # Goal progress
weekly                 # Weekly review reminder
```

### Configuration

`config/whatsapp-settings.json`:

```json
{
  "briefing": {
    "enabled": true,
    "time": "07:00",
    "timezone": "America/New_York",
    "content": ["agenda", "priorities", "goals", "weather"]
  },
  "voiceNotes": {
    "autoTranscribe": true,
    "language": "en-US",
    "addToLog": true
  },
  "quickCapture": {
    "patterns": {
      "task": "^(add task|todo):",
      "note": "^(note|idea):",
      "mood": "^(log mood|mood):"
    }
  }
}
```

### Automation Examples

#### Morning Routine Trigger

```bash
# Receive at 7 AM:
"Good morning! 🌅

Today's Focus:
1. Finish project proposal
2. Team meeting at 2 PM
3. Gym session

Calendar:
• 9:00 - Deep work block
• 14:00 - Team meeting
• 18:00 - Personal time

Have a great day!"
```

#### Task Completion Celebration

```bash
# When you complete a major task:
"🎉 Great job! You completed 'Finish project proposal'

Tasks today: 3/5 done
Weekly progress: 67%

Keep up the momentum!"
```

### Troubleshooting WhatsApp

**Issue**: QR code won't scan

**Solution**:
```bash
npm run whatsapp:auth --refresh
# Generate new QR code
```

**Issue**: Messages not received

**Solution**:
- Check WhatsApp is connected
- Verify phone number
- Test with: `npm run whatsapp:test`

**Issue**: Voice notes not transcribing

**Solution**:
```bash
npm run whatsapp:test-transcription
# Check transcription service
```

---

## Integration Best Practices

### General Tips

1. **Start with One**: Master one integration before adding more
2. **Sync Regularly**: Daily minimum, real-time for power users
3. **Test Thoroughly**: Use test commands before relying on automation
4. **Backup First**: Export data before major sync operations
5. **Monitor Conflicts**: Check sync status regularly

### Security

1. **Protect Credentials**: Never commit `.env` to git
2. **Use App Passwords**: When available (Gmail)
3. **Rotate Tokens**: Quarterly token refresh
4. **Limit Scopes**: Only request needed permissions
5. **Review Access**: Check authorized apps regularly

### Performance

1. **Batch Operations**: Sync multiple items at once
2. **Schedule Syncs**: Off-peak hours for large syncs
3. **Use Webhooks**: Real-time updates when possible
4. **Cache Results**: Reduce API calls
5. **Monitor Quotas**: Track API usage limits

### Maintenance

```bash
# Weekly integration health check
npm run integrations:health

# Monthly token refresh
npm run integrations:refresh-tokens

# Quarterly full resync
npm run integrations:resync --full
```

## Integration Workflows

### Morning Routine with Integrations

```bash
1. WhatsApp sends daily briefing (automatic)
2. Review calendar via Life OS (automatic)
3. Daily planning with calendar data
4. Todoist tasks sync to mobile
5. Ready for the day!
```

### Inbox Zero with Integrations

```bash
1. Process Gmail inbox → tasks
2. Capture thoughts via WhatsApp
3. Process Life OS inbox
4. Sync all to Todoist
5. Archive and clear
```

### Weekly Review with Integrations

```bash
1. Pull completed Todoist tasks
2. Review calendar week
3. Export WhatsApp daily logs
4. Run weekly review process
5. Sync next week's plan to all services
```

## Troubleshooting All Integrations

### General Debugging

```bash
# Test all integrations
npm run integrations:test

# View integration logs
npm run integrations:logs

# Reset integration
npm run integrations:reset --service todoist

# Full diagnostic
npm run integrations:diagnose
```

### Common Issues

**Issue**: Rate limiting errors

**Solution**:
- Reduce sync frequency
- Use batch operations
- Implement exponential backoff

**Issue**: Data inconsistencies

**Solution**:
```bash
npm run integrations:compare
npm run integrations:reconcile
```

**Issue**: Multiple services out of sync

**Solution**:
```bash
npm run integrations:pause
# Fix issues one service at a time
npm run integrations:resume
```

## Next Steps

- [Workflows Guide](./workflows.md) - Integration-powered workflows
- [Advanced Guide](./advanced.md) - Custom integrations
- [FAQ](./faq.md) - Common questions
- [Getting Started](./getting-started.md) - Back to basics
