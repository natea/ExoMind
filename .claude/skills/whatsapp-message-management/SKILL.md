---
name: whatsapp-message-management
description: Use when user wants to capture tasks, send briefings, or manage life via WhatsApp - leverages existing WhatsApp MCP for mobile-first workflow
---

# WhatsApp Message Management

## Overview

Transform WhatsApp into a powerful life management interface that works seamlessly with ExoMind's task, habit, and knowledge systems. This skill enables mobile-first workflows where you can capture thoughts, receive daily briefings, check in on habits, and manage your life through natural WhatsApp conversations.

**Core principle:** Meet users where they are (on their phone) with quick, actionable messages that integrate with the broader ExoMind ecosystem.

**Announce at start:** "I'm using the WhatsApp message management skill to help you manage your life via mobile messaging."

## Quick Reference

| Phase | Key Activities | Tool Usage | Output |
|-------|---------------|------------|--------|
| **1. Setup** | Configure WhatsApp MCP connection | Check MCP server status | Connected messaging channel |
| **2. Quick Capture** | Parse incoming messages for tasks/notes | WhatsApp MCP receive, Task creation | Captured items in system |
| **3. Daily Briefing** | Generate and send morning/evening updates | Read tasks/habits, WhatsApp MCP send | Timely briefings delivered |
| **4. Habit Check-ins** | Send reminders and log responses | Habit tracking, WhatsApp MCP | Habit streaks maintained |
| **5. Contextual Queries** | Answer questions using ExoMind knowledge | RAG search, WhatsApp MCP | Informed responses |

## When to Use

- User mentions "send me" or "message me on WhatsApp"
- Daily briefing requests ("morning summary", "evening recap")
- Quick capture scenarios ("I'll message you the task")
- Habit tracking reminders ("remind me to...")
- Mobile-first workflows
- Time-sensitive notifications
- On-the-go task management

## The Pattern

Copy this checklist to track progress:

```
WhatsApp Management Progress:
- [ ] Phase 1: Setup (WhatsApp MCP configured and tested)
- [ ] Phase 2: Quick Capture (message parsing and task creation working)
- [ ] Phase 3: Daily Briefing (scheduled briefings configured)
- [ ] Phase 4: Habit Check-ins (reminder system active)
- [ ] Phase 5: Contextual Queries (RAG integration functional)
```

### Phase 1: Setup & Connection

**Verify WhatsApp MCP is available:**
- Check MCP server connection status
- Test send/receive capabilities
- Configure user's phone number if needed
- Set up Do Not Disturb hours (default: 22:00-07:00)

**Example verification:**
```bash
# Check if WhatsApp MCP is available
claude mcp list | grep whatsapp

# Test connection with a ping message
# Use appropriate WhatsApp MCP tool to send test message
```

### Phase 2: Quick Capture

**Parse incoming WhatsApp messages for tasks and notes:**

**Capture patterns to recognize:**
- Task indicators: "remind me", "todo", "task:", "I need to"
- Note indicators: "note:", "remember", "idea:"
- Context indicators: "@work", "@home", "#project-name"
- Priority indicators: "urgent", "important", "!!!"

**Processing workflow:**
1. Receive message via WhatsApp MCP
2. Parse for task/note/habit signals
3. Extract metadata (tags, priority, context)
4. Create appropriate item in ExoMind system
5. Send confirmation back to WhatsApp

**Example exchange:**
```
User (WhatsApp): "Remind me to call dentist tomorrow @health"
ExoMind: "✓ Task created: Call dentist (Due: Tomorrow, Context: health)"

User (WhatsApp): "Note: Great book recommendation from Sarah - Atomic Habits"
ExoMind: "✓ Note saved to your knowledge base"
```

### Phase 3: Daily Briefing

**Morning Briefing (07:00-09:00):**
- Today's scheduled tasks (top 5 priority)
- Active habits to complete today
- Any overdue items (gentle reminder)
- Weather/calendar integration (if available)

**Evening Recap (18:00-20:00):**
- Tasks completed today (celebrate wins)
- Habits checked off
- Tomorrow's top priorities preview
- Reflection prompt (optional)

**Message format:**
```
☀️ Good morning! Here's your day:

📋 Top Tasks:
1. ⚡ Finish project proposal (Due today)
2. 📞 Call dentist (Due today)
3. 📧 Review emails from team

🎯 Habits:
• Morning meditation
• Drink 8 glasses of water
• Read 30 minutes

Reply "done" + number to mark complete (e.g., "done 1")
```

### Phase 4: Habit Check-ins

**Reminder scheduling:**
- Send reminders at configured times
- Track responses for habit completion
- Maintain streak counts
- Send encouragement for milestones

**Smart reminder logic:**
- Don't remind if already completed today
- Adjust timing based on completion patterns
- Scale back frequency if consistently completed
- Send encouragement on long streaks

**Example interaction:**
```
ExoMind (15:00): "🏃 Time for your afternoon walk! 7-day streak 🔥"
User: "done"
ExoMind: "✅ Walk logged! Streak: 8 days. You're crushing it!"

ExoMind (21:00): "📖 Evening reading reminder - 30 minutes to hit your goal"
User: "skip today, busy"
ExoMind: "No problem! Your 12-day streak is safe. We'll catch up tomorrow."
```

### Phase 5: Contextual Queries

**Handle questions and requests:**
- Use RAG to search knowledge base
- Pull relevant task/habit context
- Provide concise, mobile-friendly answers
- Offer follow-up actions

**Query patterns:**
- "What tasks do I have for [project]?"
- "Show me my [habit] streak"
- "What did I note about [topic]?"
- "When is [task] due?"

**Example:**
```
User: "What tasks do I have for the website project?"
ExoMind: "🌐 Website Project (3 tasks):
1. ⚡ Design homepage mockup (Due: Fri)
2. Write copy for About page (Due: Next week)
3. Set up hosting (No due date)

Want to see details for any of these?"
```

## Integration

### WhatsApp MCP Server
**Primary interface for all messaging:**
- `send_message(phone_number, text)` - Send messages to user
- `receive_messages()` - Poll for incoming messages
- `format_message(content, style)` - Format with emojis/markdown
- `check_connection()` - Verify server status

### ExoMind Components
- **Task Manager**: Create, update, complete tasks from messages
- **Habit Tracker**: Log completions, check streaks, send reminders
- **Knowledge Base (RAG)**: Search notes and context for queries
- **Calendar Integration**: Pull events for briefings
- **User Preferences**: DND hours, notification frequency, message style

## Common Use Cases

### Use Case 1: Morning Commute Quick Capture
**Scenario:** User is on the train, thinks of three tasks
```
User: "todo: buy groceries, call mom, schedule dentist @personal"
ExoMind: "✓ Created 3 tasks in Personal context:
1. Buy groceries
2. Call mom
3. Schedule dentist

All added to your inbox for processing."
```

### Use Case 2: Daily Briefing Workflow
**Morning (07:30):**
```
ExoMind: "☀️ Good morning! Tuesday, Jan 15

📋 Today's Focus (3 tasks):
1. ⚡ Submit quarterly report (Due today)
2. Review team feedback
3. Prep for 2pm client call

🎯 Habits: Meditation, Exercise, Reading

Ready to crush it? Reply 'done 1' to check off tasks."
```

**Evening (19:00):**
```
ExoMind: "🌙 Evening recap:

✅ Completed: 2 tasks, 3 habits
🔥 Streaks maintained: Meditation (45d), Reading (12d)

Tomorrow's priority: Finish marketing presentation

How did today go? (Great/Good/Tough)"
```

### Use Case 3: Habit Accountability
**Scenario:** User building a meditation habit
```
Day 1 (07:00): "🧘 Morning meditation time! Starting your new habit."
User: "done"
ExoMind: "✅ Great start! Day 1 complete."

Day 7 (07:00): "🧘 Morning meditation - 7 day streak! 🔥"
User: "done"
ExoMind: "✅ Week 1 complete! You're building a solid habit."

Day 30 (07:00): "🧘 Meditation time! 30-DAY MILESTONE! 🎉"
User: "done"
ExoMind: "✅ 30 DAYS! This is now part of who you are. Amazing work!"
```

### Use Case 4: Context-Aware Note Capture
**Scenario:** User learns something valuable
```
User: "Note: React useCallback only needed when passing callbacks to optimized child components - don't overuse #dev #react"

ExoMind: "✓ Note saved with tags: dev, react
Connected to 3 related notes in your knowledge base.
Want to see related content?"

User: "yes"

ExoMind: "Related notes:
1. React performance optimization patterns
2. When to use useMemo vs useCallback
3. React re-render debugging guide

Reply with number to view full note."
```

### Use Case 5: Project Context Switching
**Scenario:** User needs to focus on specific project
```
User: "Show me everything for website redesign project"

ExoMind: "🌐 Website Redesign Project:

📋 Tasks (5):
• Design homepage (Due: Thu) ⚡
• Write new copy (Due: Next week)
• Set up hosting (No due date)
• Configure analytics (No due date)
• Mobile testing (Blocked - needs design)

📝 Recent Notes: 2
🔗 Related Habits: Daily design review

What would you like to focus on?"
```

## Red Flags

### Do Not:
- **Spam messages** - Respect user's attention and DND hours
- **Send long messages** - Keep everything scannable on mobile
- **Ignore context** - Remember conversation history within session
- **Be overly formal** - Match user's communication style
- **Send during DND hours** - Default 22:00-07:00, user configurable
- **Over-notify** - Bundle related updates together
- **Lose messages** - Always confirm receipt and action taken

### Warning Signs:
- User says "too many messages" → Reduce frequency
- Messages go unread for days → Adjust timing or format
- User always uses "skip" on habits → Habit may not be right
- Repeated "I already did this" → Check for duplicate tracking
- User stops responding → Too much noise, dial back

## Message Style Guide

### Tone:
- **Encouraging but not pushy:** "Time for your walk 🏃" not "You MUST walk now!"
- **Celebratory on wins:** "7-day streak! 🔥" with emojis
- **Understanding on misses:** "No problem, we'll catch up tomorrow"
- **Concise and scannable:** Bullets, numbers, emojis for quick reading

### Formatting:
- **Emojis for context:** ✅ (done), ⚡ (urgent), 🔥 (streak), 📋 (tasks)
- **Numbers for quick action:** "Reply 'done 1' to mark complete"
- **Line breaks for readability:** Never send walls of text
- **Bold for key info:** Limited use, important items only

### Response Patterns:
```
Confirmation: "✓ [Action completed]"
Celebration: "✅ [Achievement] 🎉"
Reminder: "🔔 [Habit/Task] - [Context]"
Query result: "📋 [Category]: [List]"
Error: "❌ [Issue] - [What to do]"
```

## Technical Implementation Notes

### Message Parsing
```javascript
function parseQuickCapture(message) {
  const patterns = {
    task: /^(todo:|task:|remind me to)/i,
    note: /^(note:|remember:|idea:)/i,
    habit: /^(done|complete|skip|did)/i,
    query: /^(show|what|when|find)/i,
    context: /@(\w+)/g,
    tags: /#(\w+)/g,
    priority: /(!{1,3}|urgent|important|asap)/i
  };

  // Extract type, content, metadata
  // Return structured object for processing
}
```

### Scheduling
- Use cron jobs or scheduled tasks for briefings
- Store user timezone for correct timing
- Respect Do Not Disturb windows
- Queue messages if user is inactive

### State Management
- Track conversation context within session
- Remember last 10 interactions for continuity
- Clear session after 30 minutes of inactivity
- Persist user preferences across sessions

## Privacy & Security

- **No message logging** - Process and discard, don't store full messages
- **Secure MCP connection** - Encrypted transport
- **User data stays local** - Only send what's necessary to WhatsApp
- **Opt-in by default** - User must enable WhatsApp integration
- **Easy opt-out** - "pause notifications" command anytime

## Examples

### Example 1: Full Morning Routine
```
[07:30 - Automated briefing]
ExoMind: "☀️ Good morning! Wednesday, Jan 16

📋 Today's Focus (4 tasks):
1. ⚡ Submit budget review (Due today)
2. Team standup at 10am
3. Review marketing materials
4. Plan weekend trip

🎯 Habits: Meditation, Exercise, Reading, Water intake
🌤️ Weather: Sunny, 72°F

Reply 'done' + number to check off tasks."

[07:45 - User interaction]
User: "done meditation"
ExoMind: "✅ Meditation complete! 46-day streak 🔥"

[08:30 - Quick capture]
User: "todo: book restaurant for anniversary @personal !!"
ExoMind: "✓ High priority task created: Book restaurant for anniversary
Added to Personal context. Due date?"

User: "friday"
ExoMind: "✓ Due date set: This Friday, Jan 18"

[12:00 - Contextual query]
User: "what's my afternoon looking like?"
ExoMind: "📋 Afternoon (3 items):
• Team standup at 10am ✅ (passed)
• Review marketing materials (Due today)
• Plan weekend trip (No due date)

You're on track! 🎯"
```

### Example 2: Habit Building Journey
```
[Week 1]
Day 1: "🏃 Afternoon walk reminder - let's start strong!"
User: "done"
ExoMind: "✅ Day 1 complete! Great start."

Day 3: "🏃 Walk time! You're 3 for 3 🔥"
User: "skip today, raining"
ExoMind: "No problem! Weather happens. Tomorrow's a new day."

Day 4: "🏃 Back at it! 3-day streak still alive."
User: "done"
ExoMind: "✅ Resilience! That's how habits stick."

[Week 4]
Day 28: "🏃 Walk time - almost at 30 days! 🔥"
User: "done"
ExoMind: "✅ 28 days! Weekend milestone coming up! 🎉"

[Month 2]
Day 60: "🏃 2-MONTH MILESTONE! 🎉 You've walked 60 days!"
User: "done"
ExoMind: "✅ 60 DAYS! This is officially who you are now. Incredible!"
```

### Example 3: Project-Based Workflow
```
User: "Starting work on mobile app project"
ExoMind: "📱 Mobile App Project activated.

Current status:
📋 5 tasks (2 urgent)
📝 8 notes in knowledge base
🔗 Related: UI design habit

Want the task breakdown?"

User: "yes"

ExoMind: "📋 Mobile App Tasks:
1. ⚡ Fix login bug (Due today)
2. ⚡ Review PR #234 (Due today)
3. Design settings screen (Due Fri)
4. Write API docs (Next week)
5. User testing prep (No date)

Start with #1? Reply 'done 1' when complete."

[Later that day]
User: "done 1"
ExoMind: "✅ Login bug fixed!
⚡ Next up: Review PR #234
4 tasks remaining on Mobile App"

User: "note: Login issue was OAuth token expiration, fixed by refreshing tokens every 55min instead of 60min #mobile-app #auth"

ExoMind: "✓ Technical note saved!
Auto-tagged: mobile-app, auth
Connected to 2 related notes.

Back to PR #234 review?"
```

---

## Success Metrics

**Track these to optimize the system:**
- Message response rate (target: >80%)
- Time to task capture (<30 seconds)
- Briefing read rate (target: >90%)
- Habit completion rate improvement
- User satisfaction with notification timing
- Average session length
- "Too many messages" complaints (target: <5%)

**Iterate based on:**
- User feedback on timing and frequency
- Completion patterns (morning vs evening people)
- Response times (adjust send times)
- Habit streaks (celebrate more, remind less as habits stick)
