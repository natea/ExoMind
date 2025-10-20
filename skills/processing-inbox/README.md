# Processing Inbox Skill

## Overview

Process inbox items systematically using David Allen's Getting Things Done (GTD) methodology. Transform raw inputs into actionable outcomes through a structured clarification and organization process.

## Purpose

This skill helps you:
- Empty all collection points to zero
- Apply GTD decision tree to each item
- Route items to appropriate lists/systems
- Maintain inbox zero consistently
- Reduce decision fatigue
- Build trust in your system

## When to Use

- **Daily**: 15-30 min morning review
- **Weekly**: 60-90 min full review (part of weekly review)
- **As Needed**: When inbox has 5+ unprocessed items
- **After Capture**: Following meeting notes, brainstorming, etc.

## The GTD Processing Workflow

### Step 1: Capture
Collect all inbox items in one place before processing.

**Collection Points**:
- Physical inbox (mail, notes, business cards)
- Digital inbox (`inbox.md`)
- Email inbox
- WhatsApp/messaging apps
- Voice notes/recordings
- Quick capture tools

### Step 2: Clarify (Per Item)

For each item, work through the decision tree:

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
- No value, outdated, irrelevant
- Action: Delete/archive permanently

**REFERENCE** - File for later
- Useful information, no action needed
- Storage: Google Drive, Notion, email folders

**SOMEDAY/MAYBE** - Defer indefinitely
- Interesting but not now
- Storage: Someday/Maybe list, tickler file
- Review monthly

#### Actionable Items

**DO NOW** (< 2 minutes)
- Execute immediately
- Don't defer quick wins
- Complete before moving to next item

**NEXT ACTIONS** (single-step, > 2 minutes)
- Add to context-specific lists:
  - @home, @work, @computer, @phone, @errands
- Include: Verb + specific outcome
- Example: "Call dentist to schedule cleaning"

**PROJECTS** (multi-step)
- Requires 2+ actions to complete
- Create project entry with:
  - Desired outcome
  - Next action (first step)
  - Context/location
  - Due date (if any)

**CALENDAR** (time-specific)
- Schedule only if specific date/time required
- Don't schedule flexible next actions

**WAITING FOR**
- Delegated items
- Track: Who, What, When
- Review weekly, follow up as needed

## The 2-Minute Rule

**If it takes less than 2 minutes, do it now.**

Why?
- Reduces decision fatigue
- Prevents small tasks from piling up
- Faster than tracking it in system

When to apply:
- Email replies
- Quick calls
- Simple confirmations
- Short responses

## Context-Based Organization

Organize next actions by context:

- **@home**: Chores, family tasks, home maintenance
- **@work**: Office tasks, meetings, work projects
- **@computer**: Email, research, writing, data entry
- **@phone**: Calls to make, voicemails
- **@errands**: Shopping, pickups, errands
- **@waiting-for**: Delegated items, pending responses

## Processing Prompts

### Starting Session
```
Let's process my inbox using GTD. I have [NUMBER] items.

Process one at a time:
1. Show me the item
2. Ask clarifying questions
3. Help me decide: trash, reference, action, project, or someday
4. Route to appropriate list/system
5. Move to next item
```

### Per-Item Processing
```
Inbox Item #[N]: [ITEM CONTENT]

Questions:
- What is this about?
- Is it actionable?
- If yes: What's the next physical action?
- How long will it take?
- Single-step or multi-step?
- Needs specific date/time?
- Context required?

Decision: [TRASH / REFERENCE / DO NOW / NEXT ACTION / PROJECT / SOMEDAY/MAYBE / WAITING FOR]
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
```

### WhatsApp Messages
```
Use WhatsApp MCP integration:
1. List important messages
2. Capture key info
3. Decide action needed
4. Send confirmation if delegated
5. Archive/delete
```

### Voice Notes
```
1. Listen to each note
2. Transcribe key points (if needed)
3. Apply GTD decision tree
4. Delete audio after processing
5. Create next action or reference
```

### Physical Inbox
```
1. Handle each piece once
2. Scan important documents → Google Drive
3. Shred/recycle processed items
4. File reference materials
5. Create digital next actions
```

## Best Practices

### Touch It Once
- Process each item completely
- Don't skip or partially process
- Make clear decision every time
- Move to completion or next system

### Time Blocking
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

ASSISTANT: Great! Let's process them systematically.
Ready for item #1?

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
Actionable? → Not immediately
Interest level? → High
Decision: REFERENCE

Save to Pocket → REFERENCE
Archive original

Ready for item #3?
```

## Troubleshooting

### Can't Decide
If stuck on categorization:
1. Ask: "What would done look like?"
2. Ask: "What's preventing me from deciding?"
3. Consider: Is this really actionable?
4. When in doubt: SOMEDAY/MAYBE for weekly review

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

## Integration with Life OS

- **Weekly Review**: Comprehensive inbox processing
- **Daily Planning**: Morning inbox check
- **Capture Tools**: WhatsApp, voice notes, quick capture
- **Task Management**: Route actions to appropriate lists

## Quick Start

```bash
# Daily inbox processing
1. Collect all inbox items
2. Process using GTD decision tree
3. Route to appropriate lists
4. Achieve inbox zero
5. Start actual work

# Target: 15-30 minutes daily
```

## Related Skills

- **Weekly Review** (`weekly-review/`) - Full GTD review
- **Daily Planning** (`daily-planning/`) - Daily priorities
- **WhatsApp Management** (`whatsapp-message-management/`) - Message processing
- **Task Prioritization** - Focus on important items

## Support

For detailed instructions and decision tree, see `SKILL.md` in this directory.

---

**Version**: 1.0
**Last Updated**: 2025-10-20
**Part of**: Life OS Skills Suite
**Based on**: David Allen's Getting Things Done (GTD)

**Remember**: Your inbox is for collecting, not for storing. Process everything to zero regularly. Trust the system, not your memory.
