# Processing Inbox - GTD Workflow

## Overview
Process inbox items systematically using David Allen's Getting Things Done (GTD) methodology. Transform raw inputs into actionable outcomes through a structured clarification and organization process.

## When to Use
- Daily inbox review (email, messages, notes)
- Weekly review preparation
- When inbox has 5+ unprocessed items
- After capture sessions
- Before planning sessions

## Processing Workflow

### Step 1: Capture
Collect all inbox items in one place before processing.

**Prompt:**
```
I have [NUMBER] inbox items to process. Let's work through them systematically using GTD principles.

Inbox sources:
- Email inbox: [count]
- WhatsApp messages: [count]
- Voice notes: [count]
- Quick captures: [count]
- Physical inbox: [count]

Ready to start processing item by item.
```

### Step 2: Clarify (Per Item)
For each item, work through the decision tree:

**Initial Questions:**
1. **What is it?** - Describe the item clearly
2. **Is it actionable?** - Can you do something about it?

**Decision Tree:**

```
┌─────────────────────┐
│   Inbox Item        │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │ Actionable?  │
    └──┬────────┬──┘
       │        │
      NO       YES
       │        │
       ▼        ▼
  ┌────────┐  ┌──────────────┐
  │ TRASH? │  │ What's next? │
  └───┬────┘  └──────┬───────┘
      │              │
      NO            ▼
      │        ┌─────────────────┐
      ▼        │ Will it take    │
  ┌─────────┐ │ < 2 minutes?    │
  │REFERENCE│ └────┬──────┬─────┘
  │(file it)│     YES     NO
  └─────────┘      │      │
                   ▼      ▼
              ┌─────────┐ ┌──────────────┐
              │ DO NOW  │ │ Single step? │
              └─────────┘ └───┬────┬─────┘
                             YES   NO
                              │    │
                              ▼    ▼
                         ┌────────┐ ┌─────────┐
                         │SCHEDULE│ │ PROJECT │
                         │ or ADD │ │(multi-  │
                         │   TO   │ │ step)   │
                         │ NEXT   │ └─────────┘
                         │ACTIONS │
                         └────────┘
```

### Step 3: Organize
Route items to appropriate lists/systems:

#### Non-Actionable Items

**TRASH** - Delete immediately
- Criteria: No value, outdated, irrelevant
- Action: Delete/archive permanently

**REFERENCE** - File for later
- Criteria: Useful information, no action needed
- Storage:
  - Google Drive folders
  - Notion reference database
  - Email labels/folders
  - Physical filing system

**SOMEDAY/MAYBE** - Defer indefinitely
- Criteria: Interesting but not now
- Storage:
  - Notion Someday/Maybe list
  - Tickler file (review monthly)
  - Future projects list

#### Actionable Items

**DO NOW** (< 2 minutes)
- Execute immediately
- Don't defer quick wins
- Complete before moving to next item

**NEXT ACTIONS** (single-step, > 2 minutes)
- Add to context-specific lists:
  - @home
  - @work
  - @computer
  - @phone
  - @errands
  - @waiting-for (delegated)
- Include: Verb + specific outcome
- Example: "Call dentist to schedule cleaning"

**PROJECTS** (multi-step)
- Criteria: Requires 2+ actions to complete
- Create project entry with:
  - Desired outcome
  - Next action (first step)
  - Context/location
  - Due date (if any)
- Store in: Notion Projects database

**CALENDAR** (time-specific)
- Schedule only if:
  - Specific date/time required
  - Appointment/meeting
  - Deadline-driven
- Don't schedule: Flexible next actions

**WAITING FOR**
- Delegated items
- Track: Who, What, When
- Review weekly
- Follow-up system

## Processing Prompts

### Starting Session
```
Let's process my inbox using GTD. I have [NUMBER] items.

Process one at a time:
1. Show me the item
2. Ask clarifying questions
3. Help me decide: trash, reference, action, project, or someday/maybe
4. Route to appropriate list/system
5. Move to next item

Ready for item #1.
```

### Per-Item Processing
```
Inbox Item #[N]:
[ITEM CONTENT]

Questions:
- What is this about?
- Is it actionable?
- If yes: What's the next physical action?
- How long will it take?
- Is it single-step or multi-step?
- Does it need a specific date/time?
- Context required (@home, @work, @computer, etc.)?

Decision: [TRASH / REFERENCE / DO NOW / NEXT ACTION / PROJECT / SOMEDAY/MAYBE / WAITING FOR]
```

### Quick Decision Framework
```
For this inbox item, apply 2-minute rule:

IF not actionable:
  → Trash or Reference?

IF actionable AND < 2 min:
  → DO NOW

IF actionable AND > 2 min AND single-step:
  → Add to Next Actions with context

IF actionable AND multi-step:
  → Create Project + define next action

IF actionable AND delegated:
  → Add to Waiting For with follow-up date
```

### Batch Processing
```
Process these [NUMBER] similar items in batch:

For each:
1. Quick scan: actionable?
2. Group by outcome type
3. Batch similar actions together
4. Create appropriate entries

Examples:
- Multiple emails → Batch respond in 1 session
- Multiple bills → Batch pay
- Multiple calls → Schedule phone time
```

## Integration Points

### Email Inbox
```
Process email inbox to zero:

For each email:
- 2-min rule: Reply now or defer
- Reference: Archive with label
- Action: Convert to task with link
- Project: Add to project list
- Delete: Spam/irrelevant

Target: Inbox zero daily
```

### WhatsApp Messages
```
Process important WhatsApp messages:

Use WhatsApp MCP integration:
1. Search messages: mcp__whatsapp__list_messages
2. For each important message:
   - Capture key info
   - Decide action needed
   - Send confirmation if delegated
   - Archive/delete
```

### Voice Notes
```
Process voice notes/recordings:

1. Listen to each note
2. Transcribe key points (if needed)
3. Apply GTD decision tree
4. Delete audio after processing
5. Create next action or reference
```

### Physical Inbox
```
Process paper/physical items:

1. Handle each piece once
2. Scan important documents → Google Drive
3. Shred/recycle processed items
4. File reference materials
5. Create digital next actions
```

## Best Practices

### The 2-Minute Rule
- If it takes < 2 minutes, do it now
- Don't defer quick wins
- Reduces decision fatigue
- Prevents small tasks from piling up

### Touch It Once
- Process each item completely
- Don't skip or partially process
- Make clear decision every time
- Move to completion or next system

### Context-Based Organization
Organize next actions by context:
- **@home**: Chores, family tasks
- **@work**: Office tasks, meetings
- **@computer**: Email, research, writing
- **@phone**: Calls to make
- **@errands**: Shopping, pickups
- **@waiting-for**: Delegated items

### Time Blocking
Schedule processing sessions:
- **Daily**: 15-30 min morning review
- **Weekly**: 60-90 min full review
- **Monthly**: 2-3 hours deep review

### Completion Criteria
Item is processed when:
- ✓ Clear decision made
- ✓ Routed to appropriate system
- ✓ Next action defined (if needed)
- ✓ Removed from inbox
- ✓ Nothing left to decide

## Example Processing Session

```
USER: I have 12 inbox items to process

ASSISTANT: Great! Let's process them systematically using GTD.
I'll help you with each item. Ready for item #1?

USER: Item #1: Email from dentist about scheduling checkup

ASSISTANT:
What is it? → Dentist appointment scheduling
Actionable? → Yes
Next action? → Call dentist to schedule
< 2 minutes? → Yes, quick call
Decision: DO NOW

Action: Call dentist right now (< 2 min)
Once done, archive email.

Ready for item #2?

USER: Done. Item #2: Article about productivity I want to read

ASSISTANT:
What is it? → Productivity article
Actionable? → Not immediately, but want to read
Interest level? → High
Decision: SOMEDAY/MAYBE or REFERENCE

Options:
1. Save to "Read Later" (Pocket/Instapaper) → REFERENCE
2. Add to "Articles to read" list → SOMEDAY/MAYBE
3. Schedule reading time → CALENDAR

Which approach?

USER: Save to Pocket for later

ASSISTANT:
✓ Decision: REFERENCE (Pocket)
✓ Action: Save to Pocket
✓ Archive original

Ready for item #3?
```

## Troubleshooting

### Can't Decide
If stuck on categorization:
1. Ask: "What would done look like?"
2. Ask: "What's preventing me from deciding?"
3. Consider: Is this really actionable?
4. When in doubt: File as SOMEDAY/MAYBE for weekly review

### Too Many Items
If overwhelmed:
1. Time-box processing (30-60 min)
2. Prioritize by source (email first, etc.)
3. Apply triage: Urgent/Important first
4. Batch similar items
5. Schedule continuation session

### Recurring Items
For repeating inbox items:
1. Create template/checklist
2. Set up automation (if possible)
3. Build habit/routine
4. Reduce capture of duplicates

## Success Metrics
- Inbox zero achieved daily/weekly
- All items have clear next action
- Nothing in inbox > 48 hours
- Weekly review catches all items
- Reduced decision fatigue
- Increased focus on actual work

## Related Skills
- `capture-quick-note` - Fast inbox capture
- `weekly-review` - Systematic review process
- `task-prioritization` - Focus on important items
- `calendar-blocking` - Schedule next actions
- `whatsapp-message-management` - Process messages

## References
- "Getting Things Done" by David Allen
- GTD workflow diagram
- Context-based lists
- Two-minute rule principle
