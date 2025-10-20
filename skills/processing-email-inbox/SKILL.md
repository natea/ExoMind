# Processing Email Inbox

## Overview

This skill implements the Getting Things Done (GTD) methodology for email processing, helping you achieve and maintain inbox zero. It transforms your inbox from a stress source into a trusted system by systematically converting emails into actionable tasks, reference materials, or archived items.

## Purpose

- **Achieve Inbox Zero**: Systematically process all emails to empty state
- **Capture Actions**: Convert emails to tasks in your task management system
- **Organize Information**: Label, file, and archive emails appropriately
- **Reduce Cognitive Load**: Make immediate decisions instead of re-reading emails
- **Maintain Focus**: Process email in dedicated sessions, not constantly

## Prerequisites

- Google Workspace account connected via MCP
- Task management system (Google Tasks recommended)
- Understanding of GTD principles (optional but helpful)

## Step-by-Step Workflow

### Phase 1: Preparation (5 minutes)

1. **Set Processing Time Block**
   - Schedule dedicated time (20-30 minutes minimum)
   - Close other applications
   - Disable notifications
   - Use timer to maintain focus

2. **Review Current State**
   ```
   Ask: "Show me my inbox summary - how many unread emails by sender"

   MCP Tool: mcp__google-workspace__search_gmail_messages
   Parameters:
     query: "in:inbox"
     page_size: 100
     user_google_email: "your-email@gmail.com"
   ```

3. **Set Processing Goal**
   - Aim for complete inbox zero
   - Or set realistic target (e.g., "process 50 emails")

### Phase 2: Bulk Actions (10 minutes)

Process similar emails in batches for efficiency.

1. **Newsletters & Subscriptions**
   ```
   Ask: "Find all newsletter emails in my inbox"

   Then decide:
   - Unsubscribe if not reading regularly
   - Create filter for auto-archive
   - Add to "Read Later" list if valuable

   Action: "Archive all newsletter emails and create filter for future"

   MCP Tool: mcp__google-workspace__batch_modify_gmail_message_labels
   Parameters:
     message_ids: [list of newsletter email IDs]
     remove_label_ids: ["INBOX"]
     add_label_ids: ["Archive/Newsletters"]
   ```

2. **Notifications & Updates**
   ```
   Ask: "Find all automated notification emails (shipping, social media, etc.)"

   Quick scan and archive:
   - Archive if no action needed
   - Create task if action required
   - Unsubscribe if unwanted
   ```

3. **Calendar Invites**
   ```
   Ask: "Show calendar invitation emails"

   Process each:
   - Accept/decline in calendar
   - Archive email after responding
   ```

### Phase 3: Individual Email Processing (Main Phase)

Use the GTD decision tree for each remaining email:

```
For each email, ask: "What is it?"
↓
Can I delete it? → YES → Archive/Delete
↓ NO
Is it actionable? → NO → Archive as Reference / Someday-Maybe
↓ YES
Can I do it in < 2 minutes? → YES → Do it now, then archive
↓ NO
Is it a project (multiple steps)? → YES → Create project in task system
↓ NO
Create single task → Defer to task list
```

#### Decision 1: Delete/Archive

```
Non-actionable emails that don't need reference:
- Old notifications
- Resolved conversations
- Spam that got through

Action: "Archive these 5 emails: [email IDs]"

MCP Tool: mcp__google-workspace__batch_modify_gmail_message_labels
Parameters:
  message_ids: [email IDs]
  remove_label_ids: ["INBOX", "UNREAD"]
```

#### Decision 2: Reference Material

```
Emails to keep for future reference:
- Important documents
- Receipts and confirmations
- Information you might need later

Action: "Label this email as 'Reference/Receipts' and archive"

MCP Tool: mcp__google-workspace__modify_gmail_message_labels
Parameters:
  message_id: "email-id"
  add_label_ids: ["Reference/Receipts"]
  remove_label_ids: ["INBOX"]
```

#### Decision 3: Two-Minute Rule

```
Quick actions you can do immediately:
- Simple replies
- Quick approvals
- Fast information lookup

Action: "Reply to this email and archive"

MCP Tool: mcp__google-workspace__send_gmail_message
Parameters:
  to: "sender@example.com"
  subject: "Re: Original Subject"
  body: "Your response"
  thread_id: "thread-id"

Then archive:
MCP Tool: mcp__google-workspace__modify_gmail_message_labels
```

#### Decision 4: Create Task

```
Actions requiring > 2 minutes:
- Research requests
- Document reviews
- Meeting preparations

Action: "Create task from this email"

Process:
1. Extract key information:
   - What needs to be done?
   - When is it due?
   - What's the context?

2. Create task:
   MCP Tool: mcp__google-workspace__create_task
   Parameters:
     task_list_id: "default-list-id"
     title: "Review Q4 budget proposal"
     notes: "From: john@company.com\nDue: End of week\nEmail: [link to email]"
     due: "2025-10-24T17:00:00Z"

3. Label and archive email:
   MCP Tool: mcp__google-workspace__modify_gmail_message_labels
   Parameters:
     message_id: "email-id"
     add_label_ids: ["Action/Waiting For Task"]
     remove_label_ids: ["INBOX"]
```

#### Decision 5: Create Project

```
Multi-step initiatives requiring multiple actions:
- Event planning
- Complex proposals
- Ongoing collaborations

Action: "Create project and break down into tasks"

Process:
1. Identify all required steps
2. Create parent task for project
3. Create subtasks for each step
4. Link email as reference

Example:
MCP Tool: mcp__google-workspace__create_task (for each step)
```

### Phase 4: Review and Organize (5 minutes)

1. **Verify Inbox Zero**
   ```
   Ask: "How many emails remain in my inbox?"

   Target: 0 emails
   If any remain: Process or defer to next session
   ```

2. **Review Created Tasks**
   ```
   Ask: "Show me tasks I just created from emails"

   MCP Tool: mcp__google-workspace__list_tasks
   Parameters:
     task_list_id: "default-list-id"
     updated_min: "[session start time]"

   Verify:
   - All have clear next actions
   - Due dates are set
   - Priority is assigned
   ```

3. **Check Waiting For List**
   ```
   Emails where you're waiting for response:

   Action: "Show emails labeled 'Waiting For'"

   Review and set reminders for follow-up
   ```

## MCP Integration Usage

### Essential Tools for Email Processing

1. **Search and Filter**
   ```javascript
   // Find emails by criteria
   mcp__google-workspace__search_gmail_messages({
     query: "in:inbox is:unread",
     page_size: 50,
     user_google_email: "you@gmail.com"
   })

   // Common search queries:
   // - "from:sender@domain.com"
   // - "has:attachment"
   // - "newer_than:7d"
   // - "subject:invoice"
   // - "label:newsletters"
   ```

2. **Read Email Content**
   ```javascript
   // Get full email details
   mcp__google-workspace__get_gmail_message_content({
     message_id: "msg-id",
     user_google_email: "you@gmail.com"
   })

   // Batch read multiple emails
   mcp__google-workspace__get_gmail_messages_content_batch({
     message_ids: ["id1", "id2", "id3"],
     user_google_email: "you@gmail.com"
   })
   ```

3. **Send Replies**
   ```javascript
   // Reply to email
   mcp__google-workspace__send_gmail_message({
     to: "recipient@example.com",
     subject: "Re: Original Subject",
     body: "Your response",
     thread_id: "thread-id",
     in_reply_to: "message-id",
     user_google_email: "you@gmail.com"
   })
   ```

4. **Label Management**
   ```javascript
   // Create GTD labels
   mcp__google-workspace__manage_gmail_label({
     action: "create",
     name: "Action/Next",
     user_google_email: "you@gmail.com"
   })

   // Apply labels to emails
   mcp__google-workspace__modify_gmail_message_labels({
     message_id: "msg-id",
     add_label_ids: ["Action/Next"],
     remove_label_ids: ["INBOX"],
     user_google_email: "you@gmail.com"
   })

   // Batch label multiple emails
   mcp__google-workspace__batch_modify_gmail_message_labels({
     message_ids: ["id1", "id2"],
     add_label_ids: ["Processed"],
     remove_label_ids: ["INBOX"],
     user_google_email: "you@gmail.com"
   })
   ```

5. **Task Creation**
   ```javascript
   // Create task from email
   mcp__google-workspace__create_task({
     task_list_id: "default-list",
     title: "Review document",
     notes: "From email: [link]\nContext: [summary]",
     due: "2025-10-25T17:00:00Z",
     user_google_email: "you@gmail.com"
   })
   ```

## Example Scenarios

### Scenario 1: Monday Morning Inbox Processing

**Situation**: 47 emails accumulated over weekend

**Workflow**:
1. "Show me my inbox - how many emails by category?"
2. Bulk archive newsletters (15 emails)
3. Archive automated notifications (12 emails)
4. Process 20 remaining emails:
   - 5 quick replies (2-min rule)
   - 10 converted to tasks
   - 3 archived as reference
   - 2 deleted as spam

**Time**: 25 minutes
**Result**: Inbox zero, 10 actionable tasks in system

### Scenario 2: Post-Vacation Email Mountain

**Situation**: 200+ emails after 2-week vacation

**Strategy**:
1. **Day 1 - Triage** (45 min)
   - Search for urgent: "is:important OR is:starred"
   - Process urgent emails first
   - Bulk archive obvious non-actions
   - Target: Reduce to 50-75 emails

2. **Day 2 - Categories** (45 min)
   - Process by sender/project
   - Use batch operations aggressively
   - Create tasks for actions
   - Target: Reduce to 20-30 emails

3. **Day 3 - Finish** (30 min)
   - Process remaining emails
   - Review created tasks
   - Achieve inbox zero

### Scenario 3: Daily Maintenance

**Situation**: Regular daily email flow (15-30 emails/day)

**Workflow**:
1. **Morning** (10 min)
   - Process overnight emails
   - Quick replies to urgent items
   - Create tasks for the day

2. **Midday** (5 min)
   - Quick scan and urgent responses
   - Archive non-actions

3. **End of Day** (10 min)
   - Final inbox zero push
   - Review tasks created
   - Prepare for tomorrow

## Recommended GTD Label Structure

Create these labels for effective email management:

```
📥 Action/
   ├── Next (immediate actions)
   ├── Waiting For (awaiting response)
   └── Someday Maybe (future possibilities)

📁 Reference/
   ├── Projects
   ├── Receipts
   ├── Documents
   └── Archive

🔄 Processing/
   ├── To Process (needs decision)
   └── To Review (needs deeper thought)
```

Create labels with:
```
Ask: "Create these GTD labels for my email system: [list above]"
```

## Best Practices

### Processing Rules

1. **Never Re-Read**: Make decision on first read
2. **Process Top-Down**: Start with oldest emails
3. **Batch Similar Items**: Handle similar emails together
4. **Trust Your System**: Once filed, trust it's captured
5. **One Touch**: Handle each email once if possible

### Time Management

1. **Schedule Processing**: Fixed times, not reactive
2. **Use Timer**: Stay focused with time limits
3. **Take Breaks**: Process in 25-minute chunks
4. **Morning Priority**: Process early for clear day
5. **Protect Time**: Close email outside processing windows

### Decision Making

1. **Quick Decisions**: Don't overthink simple emails
2. **Default to Archive**: When in doubt, archive
3. **Clear Next Actions**: Tasks must be actionable
4. **Context in Tasks**: Include enough info to act later
5. **Weekly Review**: Refine system weekly

### Automation Opportunities

```
Create filters for:
1. Newsletters → Auto-label and skip inbox
2. Receipts → Auto-label "Reference/Receipts"
3. Notifications → Auto-archive low-priority
4. Team updates → Auto-label by project
5. Specific senders → Auto-label by context

Ask: "Create Gmail filter that auto-archives newsletters and applies label 'Reference/Newsletters'"
```

## Troubleshooting

### Problem: Can't Reach Inbox Zero

**Solutions**:
1. Lower initial target (process 25 emails)
2. Use more aggressive archiving
3. Declare "email bankruptcy" for old emails
4. Set aside dedicated 2-hour session
5. Get help: "Help me triage my inbox - show oldest emails and suggest bulk actions"

### Problem: Taking Too Long

**Solutions**:
1. Stop re-reading emails
2. Make faster decisions
3. Archive more, worry less
4. Use 2-minute rule strictly
5. Batch process similar emails
6. Use voice replies for speed

### Problem: Tasks Piling Up

**Solutions**:
1. Review task creation criteria
2. Break large tasks into steps
3. Schedule task processing time
4. Delegate when possible
5. Say no to non-essential requests

### Problem: Important Emails Lost

**Solutions**:
1. Use stars for critical items
2. Create "Hot" label for urgent
3. Set up important sender filters
4. Check archived items regularly
5. Use search to find anything: "from:boss@company.com"

### Problem: Decision Fatigue

**Solutions**:
1. Process when energy is high (morning)
2. Take breaks every 20 minutes
3. Use default actions (when uncertain, archive)
4. Create decision templates
5. Limit processing sessions to 30 minutes

## Integration with Other Skills

### Weekly Review
- Review "Waiting For" labeled emails
- Check old "Action" labeled emails
- Ensure inbox is zero before review
- Archive completed task emails

### Daily Planning
- Process inbox before planning day
- Convert urgent emails to today's tasks
- Review upcoming deadlines from emails

### Goal Setting
- Use emails to identify recurring themes
- Create projects from email patterns
- Set boundaries based on email volume

## Success Metrics

Track these to measure improvement:

1. **Inbox Count**: Target = 0 (always)
2. **Processing Time**: Target < 30 min/day
3. **Email-to-Task Ratio**: What % become tasks?
4. **Oldest Email Age**: Keep under 3 days
5. **Waiting For Review**: Weekly review rate
6. **Stress Level**: Subjective but important

## Quick Reference Commands

```
# Daily Processing
"Show my inbox summary"
"Process my inbox following GTD method"
"Archive all newsletter emails"
"Create task from this email: [email subject]"

# Searching
"Find emails from [person] in last week"
"Show all emails with attachments in inbox"
"Find emails labeled 'Waiting For' older than 7 days"

# Organization
"Create GTD label structure"
"Apply label 'Action/Next' to this email and archive"
"Show all tasks I created from emails today"

# Maintenance
"How many emails in my inbox?"
"Achieve inbox zero - help me process systematically"
"Create filter for automated newsletters"
```

## Advanced Techniques

### Email Templates

Create draft templates for common responses:
```
Ask: "Create Gmail draft templates for: meeting request response, project update request, delegation email"
```

### Smart Filters

Automate common patterns:
```
1. Auto-archive read receipts
2. Auto-label by project keywords
3. Auto-star from VIP senders
4. Auto-forward to task system
```

### Batch Processing Scripts

For power users:
```
Ask: "Create workflow that:
1. Finds all newsletter emails
2. Applies 'Reference/Newsletters' label
3. Removes from inbox
4. Creates filter for future emails from same senders"
```

## Resources

- **GTD Book**: "Getting Things Done" by David Allen
- **Inbox Zero**: Merlin Mann's original concept
- **Email Charter**: emailcharter.org for better email practices
- **Gmail Search**: support.google.com/mail/answer/7190

## Next Steps

1. Create your GTD label structure
2. Schedule first processing session (30 min)
3. Commit to processing at fixed times daily
4. Review and refine system weekly
5. Celebrate inbox zero achievement! 🎉
