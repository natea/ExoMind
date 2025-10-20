# Weekly Review Skill

**Purpose:** Conduct comprehensive GTD weekly review to maintain system integrity, clear your mind, and plan effectively.

**Trigger:** User requests weekly review or "It's time for my weekly review"

---

## GTD Weekly Review Checklist

### Phase 1: Get Clear (Empty Collection Points)

**1.1 Process Physical Inbox**
- Ask: "Have you processed all physical items (mail, notes, business cards)?"
- Capture any items into GTD system

**1.2 Process Digital Inbox**
```bash
# Check inbox.md
- Review all items in inbox.md
- Process each item (What is it? Is it actionable?)
- Move to appropriate list:
  - Next actions → next-actions.md
  - Projects → projects.md
  - Waiting → waiting.md
  - Someday/Maybe → someday.md
  - Reference → Archive
  - Trash → Delete
```

**1.3 Process Email Inbox**
- Use Gmail MCP to check: `mcp__google-workspace__search_gmail_messages`
- Goal: Inbox zero
- Process using GTD workflow

**1.4 Process Notes & Capture Tools**
- Review WhatsApp messages for captured tasks
- Check voice notes/recordings
- Clear any temporary capture locations

---

### Phase 2: Get Current (Update Lists)

**2.1 Review Next Actions (next-actions.md)**
```markdown
For each next action:
- [ ] Still relevant? (Delete if not)
- [ ] Still next action? (Move to projects if multi-step)
- [ ] Context still accurate? (@home, @work, @computer, etc.)
- [ ] Can be done this week? (Move to someday if not)
- [ ] Mark completed items as DONE
```

**2.2 Review Projects (projects.md)**
```markdown
For each project:
- [ ] What's the successful outcome?
- [ ] Is there a next action defined?
- [ ] Is it still active? (Move to someday if stalled)
- [ ] Update status/progress notes
- [ ] Archive if completed (celebrate! 🎉)
```

**2.3 Review Waiting For (waiting.md)**
```markdown
For each waiting item:
- [ ] Still waiting? (Check if received/completed)
- [ ] Need to follow up? (Create next action)
- [ ] How long waiting? (Escalate if needed)
- [ ] Mark completed and remove from list
```

**2.4 Review Someday/Maybe (someday.md)**
```markdown
For each someday item:
- [ ] Ready to activate? (Move to projects/next-actions)
- [ ] Still interested? (Delete if not)
- [ ] Need incubation? (Set reminder for re-review)
- [ ] Add new ideas that came up
```

---

### Phase 3: Review Calendar

**3.1 Review Past Week**
```javascript
// Get events from past 7 days
mcp__google-workspace__get_events({
  user_google_email: "natejaune@gmail.com",
  calendar_id: "primary",
  time_min: "[7 days ago]",
  time_max: "[today]",
  detailed: true
})
```

**Questions to ask:**
- Any follow-up actions from meetings?
- Any commitments made that need capturing?
- Any lessons learned to note?
- Any incomplete items to process?

**3.2 Review Upcoming 2 Weeks**
```javascript
// Get events for next 14 days
mcp__google-workspace__get_events({
  user_google_email: "natejaune@gmail.com",
  calendar_id: "primary",
  time_min: "[today]",
  time_max: "[14 days from now]",
  detailed: true
})
```

**Preparation checklist:**
- [ ] Any prep work needed for upcoming events?
- [ ] Any travel arrangements required?
- [ ] Any materials to prepare?
- [ ] Create next actions for preparation

---

### Phase 4: Get Creative (Big Picture)

**4.1 Review Goals & Horizons**
```markdown
### Runway (Current Actions)
- What needs attention this week?
- Any quick wins available?

### 10,000 ft (Current Projects)
- Which projects are most important?
- Any projects to activate from someday?

### 20,000 ft (Areas of Focus)
- Health, Family, Work, Finance, Personal Growth
- Each area healthy? Any attention needed?

### 30,000 ft (1-2 Year Goals)
- Progress toward major goals?
- Any course corrections needed?

### 40,000 ft (3-5 Year Vision)
- Still aligned with vision?
- Any opportunities to pursue?

### 50,000 ft (Life Purpose)
- Actions aligned with values?
- Living with intention?
```

**4.2 Capture New Ideas**
- Write down any new projects, actions, or ideas
- Process into appropriate lists

---

### Phase 5: Plan Next Week

**5.1 Weekly Priorities**
```markdown
# Week of [DATE]

## Top 3 Outcomes This Week
1. [Most important outcome]
2. [Second priority]
3. [Third priority]

## Key Focus Areas
- [ ] [Focus area 1]
- [ ] [Focus area 2]
- [ ] [Focus area 3]

## Weekly Metrics
- Tasks completed last week: [X]
- Projects advanced: [X]
- Inbox processed: ✓
- Calendar reviewed: ✓
```

**5.2 Time Blocking**
```javascript
// Block focus time for week
mcp__google-workspace__create_event({
  user_google_email: "natejaune@gmail.com",
  summary: "Deep Work - [Project]",
  start_time: "[date/time]",
  end_time: "[date/time]",
  description: "Protected time for focused work",
  transparency: "opaque"
})
```

**Suggested time blocks:**
- Deep work (2-4 hour blocks)
- Admin/email (30-60 min blocks)
- Planning (30 min daily)
- Review sessions (15 min daily)

---

### Phase 6: Clean Up & Complete

**6.1 System Maintenance**
```bash
# Update all GTD files
- [ ] Archive completed items
- [ ] Clean up formatting
- [ ] Update dates/contexts
- [ ] Ensure all lists organized
```

**6.2 Reflection Questions**
```markdown
### What went well last week?
[User reflection]

### What could be improved?
[User reflection]

### What did I learn?
[User reflection]

### What am I grateful for?
[User reflection]
```

**6.3 Weekly Review Complete**
```bash
# Store completion metrics
npx claude-flow@alpha hooks post-edit \
  --file "weekly-review-[date].md" \
  --memory-key "swarm/weekly-review/completed"

# Celebrate completion! 🎉
echo "✅ Weekly Review Complete!"
echo "- Mind cleared"
echo "- System updated"
echo "- Week planned"
echo "- Ready to execute!"
```

---

## Integration Points

### Google Calendar
- Review past week events
- Review next 2 weeks calendar
- Create time blocks for priorities
- Add preparation tasks

### Google Tasks
- Sync next-actions.md with Google Tasks
- Create task lists by context
- Set due dates for time-sensitive items

### Gmail
- Process to inbox zero
- Convert emails to actions/projects
- File or archive processed emails

### WhatsApp
- Check for captured tasks/ideas
- Process voice notes
- Clear conversation capture points

---

## Output Format

```markdown
# Weekly Review - [DATE]

## Completed This Session
✅ Inbox processed: [X items]
✅ Next Actions reviewed: [X items]
✅ Projects updated: [X items]
✅ Waiting For checked: [X items]
✅ Someday/Maybe reviewed: [X items]
✅ Calendar reviewed: Past 7 days + Next 14 days
✅ Weekly plan created

## Statistics
- Tasks completed last week: [X]
- Projects advanced: [X]
- New actions captured: [X]
- Items archived: [X]

## Next Week Focus
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

## Notes & Insights
[User reflections and notes]

---
Next weekly review: [Date + 7 days]
```

---

## Best Practices

**Timing:**
- Schedule same day/time each week (Friday afternoon or Sunday evening)
- Block 1-2 hours uninterrupted
- Use calendar reminder

**Environment:**
- Quiet, distraction-free space
- All capture tools available
- Refreshed and alert

**Mindset:**
- Review without judgment
- Focus on completeness, not perfection
- Celebrate progress

**Frequency:**
- Weekly (non-negotiable)
- Daily mini-reviews (5-10 min)
- Quarterly horizon review (2-3 hours)

---

## Workflow Example

```markdown
User: "Let's do my weekly review"
Assistant: "Great! Let's conduct your weekly review. This will take about 1-2 hours. Ready?"

**Phase 1: Get Clear**
Assistant: "First, let's empty all collection points."
[Checks inbox.md, processes items]
[Reviews Gmail inbox]
[Checks WhatsApp for captured items]

**Phase 2: Get Current**
Assistant: "Now let's update all your GTD lists."
[Reviews next-actions.md - marks completed, updates contexts]
[Reviews projects.md - updates status, defines next actions]
[Reviews waiting.md - checks for responses, creates follow-ups]
[Reviews someday.md - activates ready items]

**Phase 3: Review Calendar**
Assistant: "Let's review your calendar events."
[Pulls past 7 days events]
[Creates follow-up actions from meetings]
[Reviews next 14 days]
[Creates preparation tasks]

**Phase 4: Get Creative**
Assistant: "Time for big picture thinking."
[Reviews GTD horizons: Runway � Purpose]
[Captures new ideas and projects]

**Phase 5: Plan Next Week**
Assistant: "What are your top 3 outcomes for next week?"
User: [Provides priorities]
[Creates weekly plan]
[Blocks focus time in calendar]

**Phase 6: Complete**
Assistant: "Let's wrap up and celebrate!"
[Archives completed items]
[Reflection questions]
[Generates completion summary]
```

---

## Troubleshooting

### "I don't have time for weekly review"
- Start with 30-minute sprint version
- Focus on: inbox, next-actions, calendar
- Expand gradually as habit forms

### "My lists are overwhelming"
- Do initial "brain dump" session
- Process in batches (20-30 min chunks)
- Use "2-minute rule" liberally

### "I fall behind between reviews"
- Add daily mini-reviews (5-10 min)
- Use capture tools more frequently
- Set calendar reminder 3 days before weekly review

### "System feels rigid"
- Customize phases to your needs
- Skip sections that don't apply
- Focus on what gives you clarity

---

## Success Indicators

You'll know the skill is working when:
- Mind feels clear and organized
- Confident about priorities
- Inbox consistently at zero
- No "forgotten" commitments
- Weekly plan execution improves
- Stress levels decrease
- Trust in your system increases

---

## Notes for Claude

When user triggers weekly review:

1. **Start with context check**: "When was your last weekly review? How are you feeling about your system?"

2. **Guide through phases**: Present each phase clearly, don't rush

3. **Be flexible**: Skip or abbreviate phases based on user needs

4. **Use integrations**: Actually call MCP tools for calendar, email, tasks

5. **Capture everything**: Store all processed items properly

6. **Generate summary**: Create completion report with metrics

7. **Schedule next**: Set reminder for next weekly review

8. **Celebrate**: Acknowledge completion - this is hard work!

---

**Implementation Status**:  Complete
**Integration**: Google Calendar, Gmail, Google Tasks, WhatsApp
**GTD Compliance**: Full 6-phase weekly review
**Automation Level**: High (calendar, email, task management)
**Estimated Time**: 1-2 hours initial, 45-60 min once practiced