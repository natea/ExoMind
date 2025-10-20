# Smart Recommendations Skill

## Purpose
AI-powered recommendation engine that analyzes patterns in your life data to provide intelligent suggestions for optimizing schedule, tasks, meetings, energy management, and goal achievement.

## Core Capabilities

### 1. Schedule Optimization
- **Best Times for Tasks**: Analyzes completion history to suggest optimal time blocks
- **Energy-Based Scheduling**: Recommends high-focus tasks during peak energy periods
- **Context Switching Reduction**: Suggests task batching by context/type
- **Buffer Time Insertion**: Identifies where breathing room is needed
- **Deadline Alignment**: Recommends when to start tasks based on historical velocity

### 2. Task Prioritization Intelligence
- **Eisenhower Matrix Auto-Assignment**: Suggests urgency/importance quadrants
- **Impact Scoring**: Estimates task value based on goals and dependencies
- **Effort Estimation**: Predicts realistic time requirements from similar tasks
- **Procrastination Detection**: Flags repeatedly postponed tasks with suggestions
- **Quick Win Identification**: Highlights high-impact, low-effort opportunities

### 3. Meeting Optimization
- **Meeting Value Assessment**: Analyzes if your presence is truly needed
- **Decline Suggestions**: Recommends meetings to skip with reasoning
- **Reschedule Opportunities**: Suggests better timing for recurring meetings
- **Meeting-Free Day Protection**: Identifies days needing full focus time
- **Preparation Time Blocking**: Auto-suggests prep time before important meetings

### 4. Focus Time Protection
- **Deep Work Block Suggestions**: Recommends when to schedule uninterrupted time
- **Distraction Pattern Analysis**: Identifies common interruption sources
- **Communication Batching**: Suggests specific times for email/chat checking
- **Context Preservation**: Recommends how to minimize task switching
- **Flow State Triggers**: Identifies conditions that enable your best work

### 5. Energy Management
- **Break Reminders**: Suggests breaks based on work intensity and duration
- **Energy Dip Detection**: Identifies low-energy periods and suggests appropriate activities
- **Recovery Time Calculation**: Recommends downtime after intense periods
- **Burnout Prevention**: Flags unsustainable pace before it's too late
- **Ultradian Rhythm Alignment**: Suggests work/rest cycles matching natural patterns

### 6. Goal Adjustment Intelligence
- **Progress Velocity Analysis**: Compares actual vs planned progress
- **Goal Realism Scoring**: Assesses if goals are achievable given current data
- **Milestone Recommendations**: Suggests intermediate checkpoints
- **Pivot Suggestions**: Recommends when to adjust or abandon goals
- **Resource Reallocation**: Identifies where to shift time/energy

### 7. Habit Trigger Suggestions
- **Implementation Intentions**: Suggests "if-then" habit triggers
- **Habit Stacking Opportunities**: Recommends linking new habits to existing ones
- **Environmental Cues**: Suggests physical reminders and setup changes
- **Time-Based Triggers**: Identifies best times for habit execution
- **Obstacle Removal**: Recommends ways to reduce friction

## Pattern Recognition

### Data Sources Analyzed
```yaml
schedule_patterns:
  - Task completion times and durations
  - Meeting attendance and outcomes
  - Calendar density and white space
  - Recurring event effectiveness

productivity_patterns:
  - High-output time periods
  - Task completion velocity
  - Procrastination triggers
  - Context switching frequency

energy_patterns:
  - Daily energy fluctuations
  - Break taking consistency
  - Recovery time needs
  - Burnout warning signs

goal_patterns:
  - Progress trajectory
  - Obstacle frequency
  - Effort distribution
  - Achievement rate
```

## Recommendation Types

### Immediate Actions
```yaml
format: "RIGHT NOW: [Action]"
examples:
  - "RIGHT NOW: Take a 10-minute break - you've been in flow for 2.5 hours"
  - "RIGHT NOW: Decline the 3pm standup - no action items for you this sprint"
  - "RIGHT NOW: Block tomorrow 9-11am for deep work - your highest energy window"
```

### Daily Suggestions
```yaml
format: "TODAY: [Suggestion]"
examples:
  - "TODAY: Start the budget proposal now - historically you need 3 hours for financial docs"
  - "TODAY: Move the client call to afternoon - you're 40% more patient after lunch"
  - "TODAY: Batch all email responses to 4-4:30pm window"
```

### Weekly Strategies
```yaml
format: "THIS WEEK: [Strategy]"
examples:
  - "THIS WEEK: Protect Tuesday for focused work - only 2 meetings currently scheduled"
  - "THIS WEEK: Reduce meeting load by 3 hours - you're at 75% meeting time vs 60% target"
  - "THIS WEEK: Reschedule Friday 1-on-1s to Thursday - Friday energy typically drops"
```

### Strategic Insights
```yaml
format: "INSIGHT: [Pattern]"
examples:
  - "INSIGHT: You complete 3x more tasks when starting before 10am"
  - "INSIGHT: Monday meetings result in 50% more action items than other days"
  - "INSIGHT: Your creative work quality peaks Tuesday/Wednesday mornings"
```

## Implementation

### When to Request Recommendations
```bash
# Morning routine - get daily recommendations
"What should I focus on today?"
"Any schedule optimizations for today?"

# Weekly planning - get strategic suggestions
"What are my recommendations for this week?"
"How should I adjust my schedule this week?"

# Task planning - get prioritization help
"Which tasks should I tackle first?"
"What's the best time to work on [task]?"

# Meeting review - get optimization suggestions
"Which meetings should I decline this week?"
"How can I optimize my meeting schedule?"

# Energy management - get break/rest suggestions
"When should I take breaks today?"
"Am I at risk of burnout?"

# Goal review - get adjustment recommendations
"How are my goals tracking?"
"Should I adjust any goals based on my progress?"
```

### Recommendation Confidence Levels
```yaml
HIGH_CONFIDENCE:
  - Based on 10+ data points
  - Pattern repeated consistently
  - Strong statistical correlation
  - Example: "You're 85% more productive working on reports before 10am"

MEDIUM_CONFIDENCE:
  - Based on 5-9 data points
  - Pattern emerging but not fully established
  - Moderate correlation
  - Example: "You tend to complete creative tasks faster on Tuesdays"

LOW_CONFIDENCE:
  - Based on 2-4 data points
  - Hypothesis for testing
  - Weak but interesting correlation
  - Example: "You might be more focused after morning walks"

EXPERIMENTAL:
  - Based on general research/best practices
  - No personal data yet
  - Worth trying to gather data
  - Example: "Studies show 90-minute work blocks optimize focus"
```

## Recommendation Categories

### A. Schedule Recommendations
```yaml
time_blocking:
  - Optimal task start times
  - Best meeting windows
  - Focus block placement
  - Buffer time insertion

batching:
  - Similar task grouping
  - Context consolidation
  - Communication batching
  - Administrative task blocks

protection:
  - Deep work preservation
  - Meeting-free days
  - Recovery time blocking
  - No-interruption periods
```

### B. Task Recommendations
```yaml
prioritization:
  - Impact vs effort scoring
  - Deadline urgency ranking
  - Dependency ordering
  - Quick win identification

execution:
  - Best time to start
  - Estimated duration
  - Required energy level
  - Optimal context

delegation:
  - Tasks to offload
  - Automation opportunities
  - Collaboration suggestions
  - Outsourcing candidates
```

### C. Meeting Recommendations
```yaml
attendance:
  - Meetings to decline
  - Optional vs required
  - Alternative participation (async)
  - Representative delegation

scheduling:
  - Better time slots
  - Shorter duration opportunities
  - Format changes (async, email)
  - Frequency adjustments

effectiveness:
  - Preparation suggestions
  - Agenda improvements
  - Follow-up automation
  - Outcome tracking
```

### D. Energy Recommendations
```yaml
breaks:
  - Optimal break timing
  - Break duration suggestions
  - Break activity ideas
  - Movement reminders

recovery:
  - End-of-day wind-down
  - Weekend recharge plans
  - Vacation timing
  - Sabbatical consideration

prevention:
  - Burnout warning signs
  - Overcommitment flags
  - Rest deficit alerts
  - Boundary violations
```

## Integration with Life OS

### Daily Planning Integration
```yaml
morning_recommendations:
  - Review overnight insights
  - Adjust daily plan based on suggestions
  - Accept/defer/reject recommendations
  - Track recommendation accuracy

real_time_suggestions:
  - Pop-up notifications (optional)
  - Calendar blocks with reasoning
  - Task list reordering
  - Energy level adjustments
```

### Weekly Review Integration
```yaml
recommendation_review:
  - Accuracy assessment
  - Accepted vs rejected recommendations
  - Impact of followed suggestions
  - Pattern refinement feedback

learning_loop:
  - Update recommendation models
  - Incorporate new patterns
  - Adjust confidence levels
  - Refine algorithms
```

### Goal Review Integration
```yaml
goal_recommendations:
  - Progress trajectory analysis
  - Milestone adjustment suggestions
  - Resource reallocation ideas
  - Goal abandonment signals

quarterly_insights:
  - Major pattern discoveries
  - Successful recommendation types
  - Areas for improvement
  - New recommendation categories
```

## Privacy and Control

### Recommendation Settings
```yaml
frequency:
  - real_time: Enable/disable live suggestions
  - daily: Morning recommendation summary
  - weekly: Sunday night strategy brief
  - monthly: Pattern insight report

categories:
  - schedule_optimization: true/false
  - task_prioritization: true/false
  - meeting_management: true/false
  - energy_management: true/false
  - goal_adjustments: true/false

notification_style:
  - subtle: Show in review only
  - moderate: Daily digest
  - active: Real-time suggestions
  - aggressive: Proactive interruptions
```

### Data Privacy
- All analysis happens locally
- No external AI model calls for sensitive data
- User can delete recommendation history
- Opt-in for specific data sources
- Export recommendation logs for review

## Recommendation Quality Metrics

### Track Effectiveness
```yaml
metrics:
  acceptance_rate:
    - Percentage of recommendations followed
    - By category and confidence level

  outcome_tracking:
    - Did following recommendation improve results?
    - Task completion, energy levels, goal progress

  false_positives:
    - Recommendations that seemed good but weren't
    - Reasons for rejection

  missed_opportunities:
    - Patterns you noticed that weren't recommended
    - Gaps in recommendation coverage
```

### Continuous Improvement
```yaml
learning_mechanisms:
  - User feedback (thumbs up/down)
  - Outcome correlation analysis
  - A/B testing different recommendation types
  - Pattern discovery algorithms
  - Confidence level calibration
```

## Example Recommendation Scenarios

### Scenario 1: Morning Energy Optimization
```
DATA PATTERN:
- Task completion 40% higher before 10am
- Creative work quality highest 8-10am
- Deep work sessions most successful early morning
- Energy dips significantly after lunch

RECOMMENDATIONS:
HIGH CONFIDENCE:
✓ Schedule all creative work between 8-10am
✓ Block 8-11am for deep work (no meetings)
✓ Move recurring team standup to 2pm
✓ Batch email responses to afternoon

MEDIUM CONFIDENCE:
• Consider earlier wake time (7am vs 8am)
• Experiment with morning exercise before work
• Limit coffee to one cup before focus blocks

EXPERIMENTAL:
? Try cold shower before creative work
? Test 90-minute focus blocks vs 60-minute
```

### Scenario 2: Meeting Overload
```
DATA PATTERN:
- 28 hours of meetings last week (70% of work time)
- Only 4 meetings had actionable outcomes
- 60% of meeting time spent listening to updates
- Productivity 3x lower on heavy meeting days

RECOMMENDATIONS:
HIGH CONFIDENCE:
✓ DECLINE: Daily standups Mon/Wed/Fri (contribute async)
✓ DECLINE: Project review meeting (get recording + notes)
✓ SHORTEN: Weekly 1-on-1s from 60min to 30min
✓ RESCHEDULE: Client calls to Tuesday/Thursday (better energy)

MEDIUM CONFIDENCE:
• Propose alternating weekly all-hands attendance
• Batch all internal meetings to Monday/Friday
• Request agenda + materials 24hrs before joining

ACTION PLAN:
1. This week: Decline 3 lowest-value recurring meetings
2. Next week: Test async participation for standups
3. Track: Productivity gain from reclaimed time
```

### Scenario 3: Procrastination Pattern
```
DATA PATTERN:
- "Write Q4 proposal" rescheduled 7 times
- All writing tasks delayed until deadline pressure
- 3x more time spent on writing when under pressure
- Better quality when given 2-3 day buffer

RECOMMENDATIONS:
HIGH CONFIDENCE:
✓ START NOW: Block tomorrow 9-11am for proposal draft
✓ Break into smaller tasks (outline, draft sections, review)
✓ Set fake deadline 3 days before real deadline
✓ Schedule accountability check-in with peer

MEDIUM CONFIDENCE:
• Work on proposal in 25-minute Pomodoro sessions
• Change environment (coffee shop, library)
• Reward completion with something you enjoy

ROOT CAUSE ANALYSIS:
- Task feels overwhelming (need smaller chunks)
- Unclear requirements (need to clarify scope)
- Perfectionism (need to embrace "good enough" draft)
- Low interest (consider if this is right work)

PREVENTION:
→ For future writing tasks, start 5 days before deadline
→ Create proposal template to reduce cognitive load
→ Partner with colleague who enjoys writing
```

### Scenario 4: Burnout Prevention
```
DATA PATTERN:
- Working 60+ hours/week for 4 consecutive weeks
- Zero days completely off in 3 weeks
- Sleep quality decreased 30%
- Completion rate dropped despite more hours
- Irritability and decision fatigue increasing

RECOMMENDATIONS:
HIGH CONFIDENCE:
✓ URGENT: Take full day off this weekend (no laptop)
✓ Reduce work hours to 45/week for next 2 weeks
✓ Decline all new commitments until recovery
✓ Schedule 7+ hours sleep nightly (track with alarm)

IMMEDIATE ACTIONS:
✓ Cancel tomorrow's optional meetings
✓ Delegate project X to team member
✓ Push deadline for proposal Y by 1 week
✓ Block Friday afternoon as "recovery time"

STRATEGIC CHANGES:
• Audit all commitments and eliminate 20%
• Establish "shutdown ritual" at 6pm daily
• Schedule weekly sabbath (full day off)
• Set up burnout early warning system

WARNING SIGNS TO MONITOR:
- Continued poor sleep
- Rising irritability
- Decreased task completion
- Physical symptoms (headaches, tension)
- Loss of interest in previously enjoyed activities

If burnout continues despite interventions:
→ Consider taking 1-2 week vacation
→ Discuss workload with manager
→ Evaluate if role/job is sustainable
```

## Advanced Features

### Predictive Recommendations
```yaml
anticipatory_suggestions:
  - "Big deadline next month - start blocking focus time now"
  - "Travel next week - batch meetings before/after"
  - "Typical Q4 crunch coming - frontload important projects"
  - "Energy usually dips in winter - adjust expectations"
```

### Comparative Analysis
```yaml
compare_to:
  - Your past self (last quarter, last year)
  - Anonymized peer patterns (similar roles)
  - Research-based best practices
  - Your stated ideal schedule

insights:
  - "You're having 40% more meetings than last quarter"
  - "Your focus time is 2x higher than typical for role"
  - "Sleep pattern optimal compared to circadian research"
```

### Scenario Testing
```yaml
what_if_analysis:
  - "What if I decline recurring meeting X?"
  - "What if I shift wake time to 6am?"
  - "What if I batch all meetings to 2 days/week?"
  - "What if I work 4-day weeks?"

estimated_impact:
  - Reclaimed time calculation
  - Energy level prediction
  - Productivity change estimate
  - Goal progress trajectory
```

## Success Metrics

### Recommendation Adoption
- % of recommendations viewed
- % of recommendations accepted
- Time to act on recommendations
- Category-specific adoption rates

### Impact Measures
- Task completion rate change
- Goal progress velocity change
- Meeting time reduction
- Focus time increase
- Energy level improvement
- Burnout risk reduction

### System Learning
- Recommendation accuracy over time
- Pattern discovery rate
- False positive reduction
- User satisfaction scores
- Recommendation diversity

## Getting Started

1. **Enable Recommendations**: Turn on recommendation engine in settings
2. **Configure Preferences**: Set notification level and categories
3. **Build Data Foundation**: 2-4 weeks of tracking for initial patterns
4. **Review First Recommendations**: Start with daily digest
5. **Provide Feedback**: Rate recommendations to improve accuracy
6. **Iterate**: Adjust settings based on what's helpful vs noisy

## Related Skills
- [Daily Planning](../daily-planning/SKILL.md) - Apply recommendations during planning
- [Weekly Review](../weekly-review/SKILL.md) - Assess recommendation effectiveness
- [Tracking Habits](../tracking-habits/SKILL.md) - Get habit optimization suggestions
- [Processing Inbox](../processing-inbox/SKILL.md) - Prioritization recommendations
- [Goal Setting](../goal-setting/SKILL.md) - Goal adjustment recommendations

---

*Smart recommendations transform data into actionable intelligence. Let patterns guide your optimization.*
