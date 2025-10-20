# Pattern Detection Skill

## Overview
Detect and analyze patterns in your productivity, habits, energy levels, and behaviors to generate actionable insights for optimization and improvement.

## Trigger
- Monthly during life assessment
- Weekly during weekly review
- On-demand when seeking insights
- After significant life changes

## Inputs
- Daily logs from `memory/daily/`
- Weekly reviews from `memory/weekly/`
- Monthly reviews from `memory/monthly/`
- Calendar events and meeting data
- Task completion records
- Energy and mood tracking data
- Goal progress metrics

## Pattern Types

### 1. Productivity Patterns
**What to detect:**
- Peak productivity hours (morning/afternoon/evening)
- High-performance days of the week
- Task completion velocity patterns
- Deep work session duration patterns
- Context switching frequency

**Analysis approach:**
```
FOR each time_of_day in [morning, afternoon, evening]:
  CALCULATE average_tasks_completed
  CALCULATE average_quality_score
  CALCULATE average_energy_level

FOR each day_of_week:
  CALCULATE completion_rate
  CALCULATE focus_duration
  IDENTIFY recurring_blockers
```

### 2. Task Completion Patterns
**What to detect:**
- Tasks that consistently get done vs. delayed
- Task types that flow easily vs. create resistance
- Completion patterns by context (location, time, people)
- Procrastination triggers
- Task batching effectiveness

**Analysis approach:**
```
GROUP tasks BY [type, priority, context]
FOR each group:
  CALCULATE completion_rate
  CALCULATE average_delay
  IDENTIFY success_factors
  DETECT resistance_patterns
```

### 3. Meeting Patterns
**What to detect:**
- Productive vs. draining meeting types
- Optimal meeting times
- Meeting frequency impact on productivity
- Pre/post-meeting energy patterns
- Meeting preparation effectiveness

**Analysis approach:**
```
FOR each meeting:
  MEASURE pre_energy vs post_energy
  TRACK post_meeting_productivity
  CATEGORIZE by [type, duration, participants]
  CALCULATE roi_score
```

### 4. Habit Consistency Patterns
**What to detect:**
- Streak lengths and break patterns
- Trigger effectiveness
- Context dependencies
- Seasonal variations
- Recovery patterns after breaks

**Analysis approach:**
```
FOR each habit:
  CALCULATE streak_length
  IDENTIFY break_triggers
  DETECT optimal_contexts
  MEASURE recovery_time
  TRACK consistency_score
```

### 5. Goal Progress Patterns
**What to detect:**
- Sprint vs. steady progress patterns
- Momentum building factors
- Plateau triggers and durations
- Breakthrough moments
- Support system correlation

**Analysis approach:**
```
FOR each goal:
  PLOT progress_over_time
  IDENTIFY acceleration_points
  DETECT plateau_patterns
  CORRELATE with external_factors
  MEASURE milestone_velocity
```

### 6. Energy Drain Patterns
**What to detect:**
- Activities that consistently drain energy
- People or contexts that affect energy
- Recovery time requirements
- Energy management effectiveness
- Warning signs of burnout

**Analysis approach:**
```
FOR each activity:
  MEASURE energy_cost
  TRACK recovery_duration
  IDENTIFY draining_factors
  DETECT early_warning_signs
  CORRELATE with sleep_quality
```

## Data Sources Configuration

### Daily Log Structure
```yaml
date: YYYY-MM-DD
energy_levels:
  morning: 1-10
  afternoon: 1-10
  evening: 1-10
tasks_completed:
  - id: task_id
    type: [deep_work, admin, creative, social]
    duration: minutes
    quality: 1-10
    context: location
meetings:
  - type: [1-on-1, team, client, internal]
    duration: minutes
    energy_before: 1-10
    energy_after: 1-10
    productivity_rating: 1-10
habits:
  - name: habit_name
    completed: boolean
    context: description
mood: [energized, focused, anxious, calm, drained]
notes: free_text
```

### Weekly Review Structure
```yaml
week_ending: YYYY-MM-DD
wins:
  - description
  - impact_level: 1-10
challenges:
  - description
  - energy_cost: 1-10
patterns_noticed:
  - observation
goal_progress:
  - goal_id
  - progress_percentage
  - momentum: [building, steady, stalled]
energy_assessment:
  overall: 1-10
  work_life_balance: 1-10
```

### Monthly Review Structure
```yaml
month: YYYY-MM
achievements:
  - milestone
  - satisfaction: 1-10
trends_identified:
  - pattern_description
areas_for_improvement:
  - area
  - priority: 1-10
habit_tracking:
  - habit_name
  - consistency_percentage
  - longest_streak
goal_status:
  - goal_id
  - progress
  - on_track: boolean
```

## Analysis Methods

### 1. Time-of-Day Analysis
**Purpose:** Identify optimal times for different work types

**Method:**
```python
def analyze_time_of_day(daily_logs):
    time_blocks = {
        'morning': (6, 12),
        'afternoon': (12, 18),
        'evening': (18, 24)
    }

    results = {}
    for block_name, (start, end) in time_blocks.items():
        results[block_name] = {
            'average_energy': calculate_avg_energy(logs, start, end),
            'tasks_completed': count_tasks(logs, start, end),
            'deep_work_duration': sum_deep_work(logs, start, end),
            'quality_score': avg_quality(logs, start, end)
        }

    return identify_peaks(results)
```

**Output:**
- Best time for deep work
- Optimal meeting times
- Low-energy periods for routine tasks
- Creative work windows

### 2. Day-of-Week Patterns
**Purpose:** Optimize weekly schedule structure

**Method:**
```python
def analyze_weekly_patterns(data):
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    patterns = {}
    for day in days:
        day_data = filter_by_day(data, day)
        patterns[day] = {
            'productivity_score': calculate_productivity(day_data),
            'energy_level': avg_energy(day_data),
            'completion_rate': task_completion_rate(day_data),
            'focus_duration': avg_focus_time(day_data),
            'interruptions': count_interruptions(day_data)
        }

    return generate_day_recommendations(patterns)
```

**Output:**
- Best days for strategic work
- Meeting-heavy vs. focus-heavy days
- Energy recovery patterns
- Weekend spillover effects

### 3. Context Correlation Analysis
**Purpose:** Understand environmental and situational impacts

**Method:**
```python
def analyze_context_correlation(tasks, contexts):
    correlations = {}

    for context in ['location', 'people', 'time', 'tools']:
        correlations[context] = {
            'success_rate': completion_rate_by_context(tasks, context),
            'energy_impact': avg_energy_by_context(tasks, context),
            'quality_score': avg_quality_by_context(tasks, context),
            'flow_state_frequency': flow_count_by_context(tasks, context)
        }

    return identify_optimal_contexts(correlations)
```

**Output:**
- Best working locations
- Productive collaborator patterns
- Tool effectiveness
- Environment optimization tips

### 4. Energy Level Tracking
**Purpose:** Optimize energy management and recovery

**Method:**
```python
def analyze_energy_patterns(daily_logs):
    energy_data = extract_energy_levels(daily_logs)

    analysis = {
        'daily_curve': plot_average_energy_curve(energy_data),
        'recovery_patterns': identify_recovery_activities(energy_data),
        'drain_sources': detect_energy_drains(energy_data),
        'recharge_activities': find_recharge_patterns(energy_data),
        'burnout_indicators': check_burnout_signals(energy_data)
    }

    return generate_energy_recommendations(analysis)
```

**Output:**
- Energy peaks and valleys
- Effective recovery activities
- Warning signs to monitor
- Sustainable pace guidelines

### 5. Mood Correlation
**Purpose:** Link emotional states to performance and decisions

**Method:**
```python
def analyze_mood_correlation(logs):
    mood_impacts = {}

    for mood in ['energized', 'focused', 'anxious', 'calm', 'drained']:
        mood_impacts[mood] = {
            'task_quality': avg_quality_by_mood(logs, mood),
            'completion_rate': completion_by_mood(logs, mood),
            'decision_quality': decision_outcomes_by_mood(logs, mood),
            'creativity_score': creativity_by_mood(logs, mood),
            'triggers': identify_mood_triggers(logs, mood)
        }

    return generate_mood_management_tips(mood_impacts)
```

**Output:**
- Mood-task matching guidelines
- Emotional trigger awareness
- Decision-making timing
- State management strategies

### 6. Success Factor Identification
**Purpose:** Replicate winning conditions

**Method:**
```python
def identify_success_factors(achievements):
    factors = {
        'contextual': [],
        'behavioral': [],
        'environmental': [],
        'social': []
    }

    for achievement in high_quality_outcomes(achievements):
        factors['contextual'].extend(extract_context(achievement))
        factors['behavioral'].extend(extract_behaviors(achievement))
        factors['environmental'].extend(extract_environment(achievement))
        factors['social'].extend(extract_social_factors(achievement))

    return prioritize_factors_by_impact(factors)
```

**Output:**
- Repeatable success patterns
- Critical success factors
- Winning combinations
- Conditions to replicate

## Insights Generation

### 1. Optimal Work Times
**Template:**
```
Your peak productivity windows:
- Deep Work: {time_range} on {days}
  - Average energy: {score}/10
  - Average quality: {score}/10
  - Success rate: {percentage}%

- Creative Work: {time_range} on {days}
  - Flow state frequency: {count} times/week
  - Breakthrough moments: most common at {time}

- Routine Tasks: {time_range} on {days}
  - Best for low-energy periods
  - Batch processing recommended

Recommendation: Schedule according to energy patterns, not arbitrary times.
```

### 2. Energy Drain Detection
**Template:**
```
Activities draining your energy:
1. {activity_type}
   - Energy cost: {score}/10
   - Recovery time: {duration}
   - Frequency: {times}/week
   - Total impact: {cumulative_cost}
   - Alternatives: {suggestions}

Warning signs detected:
- {pattern_1}: observed {frequency}
- {pattern_2}: trending {direction}

Recovery optimization:
- Current recovery time: {current}
- Optimal recovery time: {optimal}
- Gap: {difference} - {recommendation}
```

### 3. Productivity Blocker Analysis
**Template:**
```
Top productivity blockers:
1. {blocker_name}
   - Frequency: {times}/week
   - Impact: {lost_hours} hours lost
   - Pattern: {when_it_occurs}
   - Mitigation: {specific_action}

2. {blocker_name}
   - Context: {situation}
   - Trigger: {what_causes_it}
   - Prevention: {preventive_measure}

Quick wins:
- {easy_fix_1}: saves {time}/week
- {easy_fix_2}: reduces {blocker} by {percentage}%
```

### 4. Success Pattern Recognition
**Template:**
```
Your winning patterns:
1. {pattern_name}
   - Observed: {frequency} times
   - Success rate: {percentage}%
   - Key factors:
     * {factor_1}
     * {factor_2}
     * {factor_3}
   - How to replicate: {steps}

2. {pattern_name}
   - Context: {when_where}
   - Trigger: {what_starts_it}
   - Sustain: {how_to_maintain}

Breakthrough moments:
- Most common: {time/context}
- Prerequisites: {conditions}
- How to create more: {actionable_steps}
```

### 5. Habit Streak Analysis
**Template:**
```
Habit consistency insights:
{habit_name}:
- Current streak: {days} days
- Longest streak: {days} days
- Consistency: {percentage}% over {timeframe}
- Break patterns: most common on {days/contexts}
- Recovery: average {days} to restart
- Optimal conditions: {context_description}

Recommendations:
- Protect your streak by: {specific_actions}
- Warning signs: {early_indicators}
- Recovery plan: {if_break_occurs}
```

## Recommendations Engine

### 1. Schedule Optimization
**Algorithm:**
```python
def optimize_schedule(patterns):
    recommendations = []

    # Deep work blocks
    peak_times = patterns['productivity']['peak_hours']
    recommendations.append({
        'type': 'deep_work',
        'schedule': peak_times,
        'duration': patterns['optimal_session_length'],
        'protect': 'Block calendar, disable notifications'
    })

    # Meeting placement
    meeting_windows = patterns['meetings']['optimal_times']
    recommendations.append({
        'type': 'meetings',
        'schedule': meeting_windows,
        'max_per_day': patterns['meetings']['sustainable_count'],
        'buffer': 'Add 15-min recovery after'
    })

    # Routine tasks
    low_energy_times = patterns['energy']['valleys']
    recommendations.append({
        'type': 'routine',
        'schedule': low_energy_times,
        'batch': 'Group similar tasks',
        'automate': 'Consider automation for {repetitive_tasks}'
    })

    return recommendations
```

### 2. Task Type Allocation
**Algorithm:**
```python
def allocate_task_types(patterns):
    allocations = {}

    # Match task types to optimal conditions
    for task_type in ['deep_work', 'creative', 'admin', 'social', 'strategic']:
        optimal_conditions = patterns[task_type]['success_factors']

        allocations[task_type] = {
            'best_time': optimal_conditions['time'],
            'best_day': optimal_conditions['day'],
            'best_location': optimal_conditions['location'],
            'best_duration': optimal_conditions['session_length'],
            'prerequisites': optimal_conditions['setup_needed'],
            'avoid': optimal_conditions['anti_patterns']
        }

    return allocations
```

### 3. Meeting Time Adjustments
**Algorithm:**
```python
def adjust_meeting_times(patterns):
    adjustments = []

    # Analyze current meetings
    current_meetings = patterns['meetings']['current']
    impact_analysis = patterns['meetings']['impact']

    for meeting in current_meetings:
        if meeting['energy_drain'] > 7:
            adjustments.append({
                'meeting': meeting['type'],
                'current_time': meeting['time'],
                'issue': 'High energy drain',
                'suggested_time': find_better_time(meeting, patterns),
                'alternative': consider_async(meeting),
                'frequency': optimize_frequency(meeting, patterns)
            })

    return prioritize_adjustments(adjustments)
```

### 4. Habit Trigger Suggestions
**Algorithm:**
```python
def suggest_habit_triggers(patterns):
    suggestions = []

    for habit in patterns['habits']:
        success_contexts = habit['successful_completions']

        # Implementation intention
        trigger = {
            'habit': habit['name'],
            'trigger_type': identify_best_trigger_type(success_contexts),
            'specific_trigger': create_if_then_plan(success_contexts),
            'location': success_contexts['most_common_location'],
            'time': success_contexts['most_common_time'],
            'preceding_action': success_contexts['common_previous_activity'],
            'accountability': suggest_accountability_mechanism(habit)
        }

        suggestions.append(trigger)

    return suggestions
```

### 5. Environment Change Recommendations
**Algorithm:**
```python
def recommend_environment_changes(patterns):
    changes = []

    # Physical environment
    workspace_impact = patterns['context']['location_performance']
    changes.append({
        'category': 'workspace',
        'current_performance': workspace_impact['home']['score'],
        'improvements': identify_workspace_gaps(workspace_impact),
        'quick_wins': ['Noise reduction', 'Lighting optimization', 'Ergonomics'],
        'investment': prioritize_by_roi(improvements)
    })

    # Digital environment
    tool_effectiveness = patterns['context']['tool_usage']
    changes.append({
        'category': 'digital',
        'bottlenecks': identify_tool_bottlenecks(tool_effectiveness),
        'additions': suggest_tools(patterns['gaps']),
        'removals': identify_unused_tools(tool_effectiveness),
        'integrations': suggest_automation(patterns['repetitive_tasks'])
    })

    # Social environment
    collaboration_patterns = patterns['context']['people']
    changes.append({
        'category': 'social',
        'productive_collaborations': collaboration_patterns['high_impact'],
        'draining_interactions': collaboration_patterns['low_impact'],
        'boundary_suggestions': create_boundary_plan(collaboration_patterns),
        'collaboration_times': optimize_social_schedule(collaboration_patterns)
    })

    return changes
```

## Output Format

### Monthly Pattern Report
```markdown
# Pattern Detection Report: {Month YYYY}

## Executive Summary
- Data analyzed: {number} days of logs
- Patterns detected: {count}
- Confidence level: {percentage}%
- Key insight: {most_significant_finding}

## Productivity Patterns
{time_of_day_analysis}
{day_of_week_patterns}
{peak_performance_windows}

## Energy Management
{energy_curve_visualization}
{drain_sources}
{recovery_effectiveness}
{optimization_opportunities}

## Task Completion
{completion_rate_trends}
{resistance_patterns}
{success_factors}

## Meeting Analysis
{meeting_effectiveness}
{time_recommendations}
{format_suggestions}

## Habit Tracking
{consistency_scores}
{streak_analysis}
{trigger_optimization}

## Goal Progress
{velocity_trends}
{momentum_indicators}
{adjustment_recommendations}

## Action Items
1. {high_priority_change}
2. {medium_priority_change}
3. {low_hanging_fruit}

## Experiments to Try
- {hypothesis_1}
- {hypothesis_2}
- {hypothesis_3}

## Next Review
Schedule: {date}
Focus areas: {areas_to_monitor}
```

## Integration with Other Skills

### With Life Assessment
- Provide data-driven insights for annual assessment
- Track year-over-year pattern evolution
- Identify seasonal variations

### With Weekly Review
- Auto-generate pattern observations
- Highlight anomalies for reflection
- Track pattern consistency week-over-week

### With Goal Setting
- Inform realistic goal timelines based on patterns
- Suggest optimal approaches based on success patterns
- Identify blockers to address

### With Daily Planning
- Optimize daily schedule based on patterns
- Suggest task types for each time block
- Predict energy levels for planning

## Implementation Checklist

- [ ] Set up data collection in daily logs
- [ ] Configure weekly review to capture patterns
- [ ] Create monthly review pattern section
- [ ] Define minimum data requirements (4+ weeks)
- [ ] Implement analysis scripts
- [ ] Create visualization templates
- [ ] Build recommendation engine
- [ ] Test with historical data
- [ ] Schedule first pattern detection session
- [ ] Integrate with other Life OS skills

## Success Metrics

- Pattern detection accuracy: >80%
- Actionable insights per report: >5
- Implemented recommendations: >50%
- Measured improvement in areas addressed: >20%
- User satisfaction with insights: >8/10

## Continuous Improvement

### Monthly
- Refine pattern detection algorithms
- Add new pattern types based on discoveries
- Improve recommendation accuracy

### Quarterly
- Validate pattern predictions against outcomes
- Update analysis methods
- Expand data sources

### Annually
- Major algorithm updates
- Add machine learning models
- Comprehensive effectiveness review

---

*This skill helps you understand yourself better through data, leading to more intentional and optimized life design.*
