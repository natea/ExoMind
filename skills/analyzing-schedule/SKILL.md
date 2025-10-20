# Analyzing Schedule

## Overview

This skill helps you gain clarity and control over your time by systematically analyzing your calendar. It reveals patterns in how you spend time, identifies potential problems like overcommitment or misalignment with priorities, and provides insights for better time management decisions.

## Purpose

- **Understand Time Allocation**: See how time is actually spent vs. intended
- **Detect Overcommitment**: Identify scheduling conflicts and unrealistic expectations
- **Assess Priority Alignment**: Check if calendar reflects your true priorities
- **Find Focus Time**: Locate opportunities for deep work and strategic thinking
- **Prevent Burnout**: Recognize unsustainable patterns before they cause problems
- **Optimize Energy**: Align tasks with your energy levels throughout day/week

## Prerequisites

- Google Calendar connected via MCP
- Understanding of your priorities and goals
- Defined categories for time allocation (optional but helpful)

## Step-by-Step Workflow

### Phase 1: Data Collection (5-10 minutes)

Gather calendar data for analysis period.

#### 1. Define Analysis Period

Choose appropriate timeframe:
- **Daily Review**: Today and tomorrow
- **Weekly Review**: This week and next week
- **Monthly Planning**: Next 30 days
- **Quarterly Planning**: Next 90 days

```
Ask: "Show me all calendar events for the next 7 days"

MCP Tool: mcp__google-workspace__get_events
Parameters:
  calendar_id: "primary"
  time_min: "2025-10-20T00:00:00Z"
  time_max: "2025-10-27T23:59:59Z"
  max_results: 100
  detailed: true
  user_google_email: "your-email@gmail.com"
```

#### 2. Collect Metrics

Ask for key calendar statistics:
```
Questions to ask:
1. "How many hours of meetings do I have this week?"
2. "What's my longest consecutive meeting block?"
3. "How many hours of free time remain?"
4. "What types of meetings dominate my schedule?"
5. "Which days are most/least packed?"
```

### Phase 2: Time Allocation Analysis (10-15 minutes)

Categorize and quantify how time is distributed.

#### 1. Categorize Events

Standard categories for time analysis:
- **Strategic Work**: Planning, thinking, creating
- **Meetings**: 1-on-1s, team meetings, calls
- **Collaboration**: Working sessions, pair programming
- **Administrative**: Email, paperwork, logistics
- **Personal**: Breaks, meals, exercise, family
- **Learning**: Training, courses, reading
- **Deep Work**: Focused, uninterrupted work time

```
Ask: "Analyze my calendar and break down time by category: meetings, deep work, personal, admin"

Process manually or request:
"For each event, tell me:
- Duration
- Type (meeting/focus/personal/admin)
- Who's involved
- Is it recurring?"
```

#### 2. Calculate Time Distribution

```
Ask: "What percentage of my week is spent in:
- Meetings (1-on-1 vs group)
- Focus time (unscheduled blocks)
- Personal time (breaks, meals)
- Buffer time (transition periods)"

Expected healthy distribution:
- Meetings: 30-40% (15-20 hours/week)
- Focus Work: 40-50% (20-25 hours/week)
- Personal/Breaks: 10-15% (5-7 hours/week)
- Buffer/Admin: 10% (4-5 hours/week)
```

#### 3. Identify Patterns

Look for recurring patterns:
```
Questions to explore:
1. "Which days have the most meetings?"
2. "When are my longest uninterrupted blocks?"
3. "How many meetings start right after another (no buffer)?"
4. "What's my average meeting length?"
5. "How many meetings include more than 5 people?"
```

### Phase 3: Problem Detection (10-15 minutes)

Identify scheduling issues that impact productivity.

#### 1. Overcommitment Indicators

**Back-to-back meetings**:
```
Ask: "Show me any consecutive meetings without breaks between them"

Red flags:
- 3+ hours of consecutive meetings
- No lunch break scheduled
- Meetings before 9am or after 6pm
- Weekend events creeping in
```

**Double-bookings**:
```
Ask: "Are there any time conflicts in my calendar?"

Check for:
- Overlapping events
- Travel time not accounted for
- Recurring events that conflict
```

**Unrealistic workload**:
```
Calculate available work hours:
- Total hours in week: 168
- Sleep (8h × 7): 56 hours
- Personal time (2h × 7): 14 hours
- Available for work: ~98 hours
- Sustainable work time: 40-50 hours

If scheduled work > 50 hours = overcommitted
```

#### 2. Focus Time Deficiency

**Fragmented schedule**:
```
Ask: "What's my longest uninterrupted block this week?"

Minimum requirements:
- Need at least 2-3 blocks of 2+ hours for deep work
- Should have 1 block of 4+ hours weekly
- Morning blocks preferred (highest energy)

Red flags:
- Longest block < 90 minutes
- No uninterrupted time for 3+ days
- All focus time at end of day (low energy)
```

**Meeting-heavy days**:
```
Ask: "Which days have more than 5 hours of meetings?"

Impact assessment:
- 5+ hours meetings = minimal deep work possible
- All-day meetings = zero strategic work
- Back-to-back days of heavy meetings = burnout risk
```

#### 3. Priority Misalignment

Compare calendar to stated priorities:
```
Ask yourself:
1. "What are my top 3 priorities this quarter?"
2. "How much calendar time is allocated to each?"
3. "Is there a mismatch?"

Example misalignment:
- Priority: "Launch new product"
- Calendar reality: 90% meetings, 10% building
- Problem: No time allocated to priority work
```

#### 4. Energy Mismatch

Consider your energy patterns:
```
Personal energy assessment:
- When are you most creative/focused?
- When do you hit energy slumps?
- What drains vs. energizes you?

Calendar check:
Ask: "Show me what types of activities are scheduled during my peak energy hours"

Ideal alignment:
- Peak hours (9am-12pm): Deep work, creative tasks
- Mid-afternoon slump (2-3pm): Admin, email
- Lower energy (after 4pm): Meetings, collaboration
```

### Phase 4: Insights and Recommendations (10 minutes)

Synthesize findings into actionable insights.

#### 1. Time Allocation Summary

```
Create summary report:

Ask: "Summarize my schedule analysis:
- Total meeting hours
- Available focus time
- Busiest vs lightest days
- Time category breakdown
- Top 3 concerns"

Example output:
"This week analysis:
- 22 hours meetings (44% of work time)
- 15 hours focus time (30% of work time)
- 8 hours admin/email (16% of work time)
- 5 hours buffer/personal (10% of work time)

Concerns:
1. Wednesday: 7 hours straight meetings (no breaks)
2. Only 1 block > 2 hours for deep work
3. No morning focus time (all pushed to afternoons)"
```

#### 2. Health Check

Rate your schedule health:
```
Scoring criteria:

✅ Healthy Schedule (8-10/10):
- Meetings < 40% of time
- 3+ blocks of 2+ hours focus time
- Daily breaks scheduled
- Energy-aligned activities
- Buffer time between meetings
- Clear boundaries (work hours)

⚠️ Warning Signs (5-7/10):
- Meetings 40-60% of time
- 1-2 focus blocks per week
- Some back-to-back meetings
- Occasional overload days
- Limited buffer time

🚨 Critical Issues (< 5/10):
- Meetings > 60% of time
- No focus blocks
- Constant back-to-back meetings
- No breaks scheduled
- Working outside normal hours
- Weekend work required
```

#### 3. Specific Recommendations

Generate actionable suggestions:
```
Ask: "Based on my schedule analysis, what specific changes should I make?"

Common recommendations:

Time Protection:
- "Block 9am-11am Tuesday/Thursday for deep work"
- "Add 30-min buffer after long meetings"
- "Move weekly team meeting to afternoon"

Meeting Optimization:
- "Decline recurring meeting X (low value)"
- "Suggest 25-min instead of 30-min meetings"
- "Combine two similar meetings"

Energy Alignment:
- "Move creative work to mornings"
- "Schedule admin tasks for 2-3pm"
- "Reserve Friday afternoons for planning"

Boundaries:
- "Set 'no meetings before 9am' rule"
- "Block lunch hour daily"
- "Protect one meeting-free day weekly"
```

## MCP Integration Usage

### Essential Tools for Schedule Analysis

1. **Retrieve Events**
   ```javascript
   // Get events for analysis period
   mcp__google-workspace__get_events({
     calendar_id: "primary",
     time_min: "2025-10-20T00:00:00Z",
     time_max: "2025-10-27T23:59:59Z",
     max_results: 100,
     detailed: true,
     user_google_email: "you@gmail.com"
   })

   // Get events with attendee information
   mcp__google-workspace__get_events({
     calendar_id: "primary",
     detailed: true,  // Includes attendees, location, description
     time_min: "[start-time]",
     time_max: "[end-time]",
     user_google_email: "you@gmail.com"
   })
   ```

2. **Search Events by Criteria**
   ```javascript
   // Find specific types of meetings
   mcp__google-workspace__get_events({
     calendar_id: "primary",
     query: "1-on-1",  // Search in title/description
     time_min: "[start]",
     time_max: "[end]",
     user_google_email: "you@gmail.com"
   })

   // Common search patterns:
   // - "meeting" - All meetings
   // - "standup" - Daily standups
   // - "review" - Review meetings
   // - "[person-name]" - Meetings with specific person
   ```

3. **Analyze Multiple Calendars**
   ```javascript
   // List all calendars
   mcp__google-workspace__list_calendars({
     user_google_email: "you@gmail.com"
   })

   // Analyze work vs personal
   // First get work calendar events
   mcp__google-workspace__get_events({
     calendar_id: "work-calendar-id",
     ...
   })

   // Then get personal calendar events
   mcp__google-workspace__get_events({
     calendar_id: "personal-calendar-id",
     ...
   })
   ```

4. **Event Details for Deep Analysis**
   ```javascript
   // Get specific event with full details
   mcp__google-workspace__get_events({
     calendar_id: "primary",
     event_id: "event-id",
     detailed: true,
     user_google_email: "you@gmail.com"
   })

   // Useful details returned:
   // - Attendees list and count
   // - Location (in-person vs remote)
   // - Description and agenda
   // - Transparency (busy vs free)
   // - Attachments
   ```

## Example Scenarios

### Scenario 1: Weekly Review Schedule Analysis

**Situation**: Sunday evening, preparing for upcoming week

**Workflow**:
```
1. "Show me all events for this coming week"

2. "Analyze my week:
   - How many hours of meetings?
   - When are my focus time blocks?
   - Any back-to-back meeting days?"

3. "Compare to ideal:
   - Meetings should be < 20 hours
   - Need at least 3 blocks of 2+ hours
   - Should have lunch breaks daily"

4. "What adjustments should I make?"

5. Identify actions:
   - Reschedule conflicting meetings
   - Block focus time
   - Decline optional meetings
   - Add buffer time
```

**Result**: Proactive schedule optimization before week starts

### Scenario 2: Quarterly Planning Review

**Situation**: End of quarter, planning next 90 days

**Workflow**:
```
1. "Show me my calendar for the last 90 days"

2. "Analyze patterns:
   - What types of meetings dominated?
   - How much focus time did I actually get?
   - Which days were consistently overloaded?
   - What's my meeting-to-execution ratio?"

3. "Compare to goals:
   - Goal was to ship 3 features
   - Reality: Only 1 shipped
   - Why? Too many meetings, not enough build time"

4. "Plan next quarter differently:
   - Block 2 days/week for building (no meetings)
   - Reduce standing meetings by 30%
   - Set 'focus Friday' policy
   - Protect morning hours"

5. Make structural changes:
   - Cancel low-value recurring meetings
   - Create focus time blocks for next 90 days
   - Communicate new meeting policies
```

**Result**: Strategic calendar restructuring aligned with goals

### Scenario 3: Burnout Prevention Check

**Situation**: Feeling overwhelmed and exhausted

**Workflow**:
```
1. "Analyze my last 2 weeks of calendar"

2. "Health check:
   - Average hours per day?
   - Any days with breaks?
   - Longest stretch without downtime?
   - Weekend work?"

3. Findings reveal:
   - Averaging 11-hour days
   - No lunch breaks for 8 days
   - 3+ hours back-to-back meetings daily
   - Worked both Saturdays

4. "This is unsustainable. What needs to change?"

5. Emergency interventions:
   - Cancel all optional meetings this week
   - Block next Friday as recovery day
   - Set hard stop at 6pm daily
   - Schedule lunch breaks in calendar
   - Decline new meeting requests

6. Long-term fixes:
   - Evaluate all recurring meetings
   - Implement 'no meeting' blocks
   - Hire help or delegate
   - Reset expectations with team
```

**Result**: Prevent burnout through data-driven intervention

## Analysis Frameworks

### 1. Maker's Schedule vs Manager's Schedule

**Manager's Schedule**: Hour-by-hour blocks, many meetings
**Maker's Schedule**: Half-day blocks, focus time

```
Analyze your role requirements:
- What % should be maker time?
- What % should be manager time?
- Does your calendar reflect this?

Ask: "Break down my schedule: how much is maker time (deep work) vs manager time (meetings/coordination)?"

Ideal ratios by role:
- Individual contributor: 70% maker / 30% manager
- Tech lead: 50% maker / 50% manager
- Engineering manager: 30% maker / 70% manager
- Executive: 10% maker / 90% manager
```

### 2. Energy Management Framework

Map activities to energy levels:

```
Peak Energy (9am-12pm):
✅ Should have: Creative work, strategic thinking, complex problems
❌ Often has: Meetings, email, admin

Moderate Energy (1pm-5pm):
✅ Good for: Meetings, collaboration, communication
❌ Not ideal for: Deep focus, learning new concepts

Low Energy (after 5pm):
✅ Best for: Planning, organizing, light admin
❌ Avoid: Important decisions, complex work

Ask: "When are my most important/creative tasks scheduled? Do they align with my peak energy times?"
```

### 3. Priority Quadrant Analysis

Map calendar events to Eisenhower Matrix:

```
Analyze each event:

Important & Urgent (Quadrant 1):
- Crisis management
- Deadline-driven projects
- Target: < 25% of time

Important & Not Urgent (Quadrant 2):
- Strategic planning
- Skill development
- Relationship building
- Target: 50-60% of time

Not Important & Urgent (Quadrant 3):
- Interruptions
- Some meetings
- Low-value requests
- Target: < 15% of time

Not Important & Not Urgent (Quadrant 4):
- Time wasters
- Busy work
- Target: Eliminate

Ask: "Which quadrant does most of my calendar time fall into? Am I spending enough time in Quadrant 2?"
```

## Best Practices

### Analysis Frequency

1. **Daily** (2 minutes): Quick check of next day
   - Any surprises?
   - Prepared for meetings?
   - Focus time protected?

2. **Weekly** (15 minutes): This skill in full
   - Review upcoming week
   - Optimize schedule
   - Protect priorities

3. **Monthly** (30 minutes): Pattern analysis
   - Look at last month
   - Identify trends
   - Make structural changes

4. **Quarterly** (60 minutes): Strategic review
   - Analyze 90 days
   - Align with goals
   - Major calendar redesign

### Red Flags to Watch For

**Immediate Action Required**:
- 5+ hours consecutive meetings (no breaks)
- Working more than 10 hours daily for 3+ days
- Zero focus blocks for entire week
- Back-to-back meetings every day
- Weekend work becoming regular
- Declining personal/family events for work

**Warning Signs**:
- Meetings increasing 10%+ month-over-month
- Focus time decreasing consistently
- Saying "I'll do it after hours" frequently
- Lunch break becoming working lunch
- First meeting before 9am regularly
- Last meeting after 6pm regularly

### Optimization Techniques

1. **Meeting Clustering**
   - Group meetings on specific days
   - Leave other days meeting-free
   - Example: "Meeting Monday/Wednesday, Maker Tuesday/Thursday"

2. **Time Blocking**
   - Block focus time weeks in advance
   - Treat focus blocks like meetings
   - Decline meeting requests during focus time

3. **Buffer Time**
   - Always 5-10 minutes between meetings
   - 30 minutes after long/difficult meetings
   - Hour lunch break (truly free, not working lunch)

4. **Theme Days**
   - Monday: Planning and 1-on-1s
   - Tuesday: Deep work
   - Wednesday: Team meetings
   - Thursday: Deep work
   - Friday: Admin and planning

## Troubleshooting

### Problem: Can't Find Focus Time

**Diagnosis**: Calendar dominated by meetings

**Solutions**:
1. Block focus time 2-4 weeks ahead
2. Make focus blocks recurring (harder to override)
3. Set "no meeting" policy for certain days/times
4. Decline optional meetings ruthlessly
5. Suggest alternative times when invited to focus blocks

**Implementation**:
```
Ask: "Block 9am-12pm every Tuesday and Thursday for the next 4 weeks for deep work"

MCP Tool: mcp__google-workspace__create_event
Parameters:
  summary: "Deep Work - Do Not Book"
  start_time: "2025-10-22T09:00:00-07:00"
  end_time: "2025-10-22T12:00:00-07:00"
  transparency: "opaque"  # Shows as busy
  description: "Protected time for focused work. Please schedule meetings at other times."
```

### Problem: Always Feeling Overcommitted

**Diagnosis**: Saying yes to everything

**Solutions**:
1. Calculate available hours realistically
2. Count prep time for meetings (not just meeting time)
3. Include buffer time in calculations
4. Set hard limits (e.g., max 15 hours meetings/week)
5. Create decision criteria for accepting meetings

**Available Time Formula**:
```
Weekly available hours =
  40 total work hours
  - (Meeting hours × 1.25)  // Include prep time
  - (Admin/email: 5 hours)
  - (Buffer time: 3 hours)
  = Focus work hours remaining

If remaining < 15 hours = overcommitted
```

### Problem: Schedule Doesn't Match Priorities

**Diagnosis**: Reactive scheduling, not proactive

**Solutions**:
1. Start with priorities, then add meetings
2. Block time for top priorities first
3. Make priority work "meetings with yourself"
4. Review: "Does this meeting serve my priorities?"
5. Quarterly audit: priority time vs actual time

**Priority Time Blocking**:
```
1. List top 3 priorities for quarter
2. Calculate time needed for each (hours/week)
3. Block that time in calendar first
4. Only schedule meetings in remaining time

Example:
Priority 1: Ship feature X (20 hrs/week)
Priority 2: Mentor team (5 hrs/week)
Priority 3: Learn new framework (5 hrs/week)
Total: 30 hrs/week blocked before any meetings
```

### Problem: Analysis Paralysis

**Diagnosis**: Spending too much time analyzing

**Solutions**:
1. Set timer for analysis (15 minutes max)
2. Focus on top 3 issues only
3. Make one change per week
4. Use templates for recurring analysis
5. Automate metrics collection

**Quick Analysis Template**:
```
1. Total meeting hours: [number]
2. Longest focus block: [duration]
3. Days with no breaks: [count]
4. Top concern: [issue]
5. One action: [change]

Total time: 5 minutes
```

## Integration with Other Skills

### Weekly Review
- Schedule analysis is part of weekly review
- Use findings to plan next week
- Track trends over time

### Daily Planning
- Quick schedule check every morning
- Adjust day based on energy/meetings
- Prepare for upcoming events

### Goal Setting
- Align calendar with quarterly goals
- Ensure priority time is protected
- Track execution time vs planning time

### Processing Email
- Schedule email processing time in calendar
- Don't process outside scheduled time
- Protect focus time from email interruptions

## Success Metrics

Track these over time:

1. **Focus Time Ratio**: (Focus hours / Total work hours)
   - Target: > 40%

2. **Meeting Efficiency**: (Meeting hours / Total work hours)
   - Target: < 40%

3. **Back-to-Back Ratio**: (Meetings with no buffer / Total meetings)
   - Target: < 20%

4. **Calendar vs Priority Alignment**: (Priority time scheduled / Priority time needed)
   - Target: 100%

5. **Weekly Schedule Quality Score**: See health check above
   - Target: > 8/10

6. **Calendar Predictability**: (Actual vs planned)
   - Target: > 80% of scheduled time used as planned

## Quick Reference Commands

```
# Daily Quick Check
"What's on my calendar tomorrow?"
"Any back-to-back meetings tomorrow?"
"When is my first free block tomorrow?"

# Weekly Analysis
"Analyze my schedule for next week"
"How many meeting hours next week?"
"Show me my longest focus blocks this week"

# Problem Detection
"Do I have any scheduling conflicts?"
"Which days are overloaded this week?"
"Am I overcommitted based on my schedule?"

# Pattern Analysis
"What types of meetings dominate my calendar?"
"When are my most productive hours typically free?"
"How much meeting time is recurring vs ad-hoc?"

# Recommendations
"What should I change about my schedule?"
"How can I create more focus time?"
"Which meetings should I consider declining?"
```

## Advanced Techniques

### Calendar Heatmap Analysis

Visualize your time allocation:
```
Ask: "Create heatmap view of my calendar:
- X-axis: Days of week
- Y-axis: Hours of day
- Color: Type of activity

Show patterns:
- When are meetings clustered?
- Where are the white spaces (free time)?
- What's my busiest day/time?"
```

### Recurring Meeting Audit

Systematically review all recurring meetings:
```
Ask: "List all my recurring meetings with:
- Frequency
- Duration
- Attendees
- Last time I found it valuable"

For each, ask:
- Is this still necessary?
- Could it be shorter?
- Could it be less frequent?
- Should someone else attend instead?

Goal: Reduce recurring meeting load by 20-30%
```

### Meeting Preparation Time Tracking

Factor in prep time:
```
For each meeting, estimate:
- Prep time needed
- Meeting time
- Follow-up time
- Total time commitment

Example:
1-hour meeting might actually be:
- 30 min prep
- 60 min meeting
- 20 min follow-up
= 110 minutes total (1.8x meeting time)

Adjust time calculations accordingly
```

## Resources

- **Books**:
  - "168 Hours" by Laura Vanderkam
  - "When" by Daniel Pink (timing and energy)
  - "Deep Work" by Cal Newport

- **Tools**:
  - Time tracking apps for reality check
  - Calendar analytics tools
  - Energy tracking journals

## Next Steps

1. Complete first schedule analysis (this week)
2. Identify your top 3 scheduling issues
3. Make one structural change (block focus time, cancel meeting, etc.)
4. Set weekly calendar review reminder
5. Track improvement over 4 weeks
