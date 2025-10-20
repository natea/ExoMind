# Monthly Review

## Overview
Conduct comprehensive monthly reviews that aggregate insights from weekly reviews, track goal progress, assess life areas, and plan for the next month. This skill implements a 4-phase process that transforms weekly data into actionable monthly insights.

## Purpose
- Aggregate and analyze patterns from 4-5 weekly reviews
- Measure progress on quarterly OKRs and monthly goals
- Check in on all life areas from latest assessment
- Identify trends, wins, and recurring challenges
- Plan priorities and focus areas for next month
- Build momentum through pattern recognition

## Prerequisites
- At least 3-4 completed weekly reviews for current month
- Active quarterly goals/OKRs in memory/plans/active-plan.md
- Latest life assessment in memory/assessments/
- Access to memory/weekly/YYYY-WNN.md files

## Trigger Timing
- **Last day of month**: Comprehensive monthly review
- **Emergency review**: Any time when significant course correction needed
- **Quarterly alignment**: Month 3 review includes quarterly assessment

## The 4 Monthly Review Phases

### Phase 1: COLLECT - Gather Monthly Data (10-15 min)

**Objective**: Aggregate all weekly reviews and relevant data for the month.

**Steps**:

1. **Pull all weekly reviews**:
   - Read memory/weekly/YYYY-W{01-05}.md for current month
   - Extract: wins, challenges, completions, habits, insights
   - Note which weeks had patterns

2. **Gather goal tracking**:
   - Read memory/plans/active-plan.md
   - List all OKRs and monthly goals
   - Pull completion percentages from weekly reviews

3. **Collect life area data**:
   - Read memory/assessments/latest.md
   - Review scores for all 10 life areas
   - Note any red flags (<5) or improvements

4. **Review calendar highlights**:
   - Significant events, meetings, milestones
   - Time off, travel, major disruptions
   - Energy patterns (high/low weeks)

**Output**: Aggregated data file ready for analysis

### Phase 2: ANALYZE - Identify Patterns (15-20 min)

**Objective**: Find patterns, trends, and insights across the entire month.

**Analyses**:

1. **Win Pattern Detection**:
   ```
   - What types of wins repeated across weeks?
   - Which goals had consistent progress?
   - What behaviors led to multiple wins?
   - Which life areas showed improvement?
   ```

2. **Challenge Pattern Analysis**:
   ```
   - Which challenges appeared in 2+ weekly reviews?
   - Are challenges systemic or situational?
   - What blockers keep reappearing?
   - Which life areas need attention?
   ```

3. **Completion Rate Calculations**:
   ```
   - Weekly review completion: X/4 weeks (goal: 4/4)
   - Daily planning completion: Y/20 days (goal: 16+/20)
   - Habit consistency: % for each tracked habit
   - Goal progress: % completion for each OKR/goal
   ```

4. **Energy & Productivity Patterns**:
   ```
   - Best performing weeks (why?)
   - Low energy weeks (what happened?)
   - Time allocation by life area
   - Focus vs. firefighting ratio
   ```

5. **Life Area Momentum**:
   ```
   For each of 10 life areas:
   - Trending up ↗️, flat →, or down ↘️
   - Key wins this month
   - Attention needed
   ```

**Output**: Pattern summary with insights

### Phase 3: ASSESS - Goal & Life Progress Check (15-20 min)

**Objective**: Evaluate progress against goals and life vision.

**Assessment Components**:

1. **OKR Progress Scoring** (0-1.0 scale):
   ```
   For each Objective:
   - List all Key Results
   - Score each KR (0.0 = no progress, 1.0 = complete)
   - Calculate objective score (average of KRs)
   - Note blockers and accelerators

   Example:
   Objective: Launch Product MVP (Score: 0.7)
   ├─ KR1: Complete core features (0.9)
   ├─ KR2: 50 beta users (0.6)
   └─ KR3: <100ms response time (0.6)
   ```

2. **Monthly Goals Review**:
   ```
   For each monthly goal:
   - ✅ Completed
   - 🔄 In Progress (%)
   - ❌ Not Started
   - 🚫 Dropped (with reason)
   ```

3. **Life Area Check-In** (1-10 scale):
   ```
   Compare to last assessment:
   - Health & Fitness: 7 → 8 ✅ (+1)
   - Career & Work: 6 → 6 → (stable)
   - Relationships: 8 → 7 ❌ (-1, needs attention)
   - [continue for all 10 areas]

   Identify:
   - Areas improving (celebrate!)
   - Areas declining (investigate why)
   - Areas stagnant (need fresh approach?)
   ```

4. **Time Allocation vs. Priorities**:
   ```
   Where did time actually go?
   - Planned priority work: X%
   - Reactive/unplanned: Y%
   - Life maintenance: Z%

   Does this match stated priorities?
   ```

5. **Habit Consistency**:
   ```
   For each tracked habit:
   - Days completed / days possible
   - Percentage completion
   - Streaks maintained
   - Habit strength: 🟢 Strong (80%+) | 🟡 Building (50-79%) | 🔴 Weak (<50%)
   ```

**Output**: Scored assessment with improvement opportunities

### Phase 4: PLAN - Next Month Strategy (20-25 min)

**Objective**: Design next month's focus, priorities, and tactical plans.

**Planning Components**:

1. **Month Theme Selection**:
   ```
   Based on patterns and assessment, choose ONE theme:
   - "Building Momentum" (after strong month)
   - "Course Correction" (after challenges)
   - "Deep Focus" (on critical goal)
   - "Balance Restoration" (after imbalance)
   - "Experimentation" (trying new approaches)
   - "Consolidation" (solidifying gains)
   ```

2. **Top 3-5 Priorities**:
   ```
   What MUST happen next month for it to be successful?

   Priority 1: [Specific, measurable outcome]
   Priority 2: [Specific, measurable outcome]
   Priority 3: [Specific, measurable outcome]
   Priority 4: [Optional - only if realistic]
   Priority 5: [Optional - only if realistic]

   Link each to OKR or life area goal
   ```

3. **Habit Adjustments**:
   ```
   Based on consistency data:
   - Habits to KEEP (working well)
   - Habits to MODIFY (not working, need change)
   - Habits to DROP (not serving you)
   - Habits to ADD (1-2 max, to support priorities)
   ```

4. **Process Improvements**:
   ```
   What can be optimized?
   - Planning: What would make reviews easier?
   - Execution: What removes friction?
   - Tracking: What metrics actually matter?
   - Energy: What gives vs. drains energy?
   ```

5. **Challenge Mitigation**:
   ```
   For recurring challenges:
   - What's the root cause?
   - What's one experiment to try?
   - How will you measure success?
   ```

6. **Calendar Pre-Planning**:
   ```
   Block time in next month for:
   - Weekly reviews (4-5 slots)
   - Deep work blocks (for top priorities)
   - Life area attention (relationships, health, etc.)
   - Buffer time (unexpected, recharge)
   ```

7. **Success Metrics**:
   ```
   How will you know next month was successful?
   - Metric 1: [Specific number/outcome]
   - Metric 2: [Specific number/outcome]
   - Metric 3: [Specific number/outcome]
   - Feeling: [How you want to feel]
   ```

**Output**: Next month action plan

## Monthly Review Template

Save to: `memory/monthly/YYYY-MM.md`

```markdown
# Monthly Review: [Month] [Year]

**Review Date**: [Date]
**Review Duration**: [Minutes]
**Life OS Version**: v1.0

---

## 📊 MONTH SNAPSHOT

**Overall Rating**: ⭐⭐⭐⭐☆ (4/5)
**Month Theme**: [Theme name]
**Key Outcome**: [One sentence summary]

### Quick Stats
- Weekly Reviews Completed: X/4-5
- Daily Plans Completed: X/20
- Goals Achieved: X/Y
- Habit Average: X%
- Life Area Average: X.X/10

---

## 🎯 PHASE 1: COLLECTED DATA

### Weekly Review Summary

**Week 1** (YYYY-W01):
- Top Win: [Win]
- Main Challenge: [Challenge]
- Completion: [X/Y goals]
- Energy: [High/Medium/Low]

**Week 2** (YYYY-W02):
- Top Win: [Win]
- Main Challenge: [Challenge]
- Completion: [X/Y goals]
- Energy: [High/Medium/Low]

**Week 3** (YYYY-W03):
- Top Win: [Win]
- Main Challenge: [Challenge]
- Completion: [X/Y goals]
- Energy: [High/Medium/Low]

**Week 4** (YYYY-W04):
- Top Win: [Win]
- Main Challenge: [Challenge]
- Completion: [X/Y goals]
- Energy: [High/Medium/Low]

**Week 5** (YYYY-W05) [if applicable]:
- Top Win: [Win]
- Main Challenge: [Challenge]
- Completion: [X/Y goals]
- Energy: [High/Medium/Low]

### Goal Progress Snapshot
```
OKR 1: [Name] - X% complete
OKR 2: [Name] - X% complete
OKR 3: [Name] - X% complete
Monthly Goal 1: [Status]
Monthly Goal 2: [Status]
```

### Life Area Scores (from latest assessment)
```
1. Health & Fitness: X/10
2. Career & Work: X/10
3. Finances: X/10
4. Relationships: X/10
5. Personal Growth: X/10
6. Environment: X/10
7. Recreation: X/10
8. Contribution: X/10
9. Spirituality: X/10
10. Life Vision: X/10
```

---

## 🔍 PHASE 2: PATTERN ANALYSIS

### 🏆 Win Patterns

**Consistent Winners** (appeared 2+ weeks):
- [Pattern 1]: [What worked and why]
- [Pattern 2]: [What worked and why]
- [Pattern 3]: [What worked and why]

**Life Areas with Momentum**:
- [Area]: [What's trending up]
- [Area]: [What's trending up]

**Success Factors**:
- [Factor 1]: [Why this contributed to wins]
- [Factor 2]: [Why this contributed to wins]

### 🚧 Challenge Patterns

**Recurring Challenges** (appeared 2+ weeks):
- [Challenge 1]: [Root cause analysis]
- [Challenge 2]: [Root cause analysis]
- [Challenge 3]: [Root cause analysis]

**Life Areas Needing Attention**:
- [Area]: [Why this needs focus]
- [Area]: [Why this needs focus]

**Systemic Issues**:
- [Issue 1]: [Underlying problem]
- [Issue 2]: [Underlying problem]

### 📈 Completion Metrics

**Consistency Scores**:
```
Weekly Reviews: X/4 = Y% (Goal: 100%)
Daily Planning: X/20 = Y% (Goal: 80%+)

Habit Streaks:
├─ [Habit 1]: X/31 days = Y% 🟢
├─ [Habit 2]: X/31 days = Y% 🟡
└─ [Habit 3]: X/31 days = Y% 🔴
```

**Energy & Productivity**:
```
High Energy Weeks: [List weeks]
Low Energy Weeks: [List weeks]

Productivity Drivers:
- [Factor that boosted productivity]
- [Factor that boosted productivity]

Productivity Drains:
- [Factor that reduced productivity]
- [Factor that reduced productivity]
```

### 🎨 Life Area Momentum

```
[Area 1]: ↗️ Trending Up
  └─ Wins: [Key improvements]
  └─ Keep doing: [What's working]

[Area 2]: → Flat
  └─ Status: [Why no change]
  └─ Need: [What would help]

[Area 3]: ↘️ Trending Down
  └─ Issue: [What's declining]
  └─ Action: [What to do]
```

---

## ✅ PHASE 3: GOAL & LIFE ASSESSMENT

### OKR Progress (0.0-1.0 scale)

**Objective 1**: [Name] | Score: X.X
```
├─ KR1: [Key Result] | X.X
│   └─ Status: [On track/Behind/Ahead]
│   └─ Blocker: [If any]
├─ KR2: [Key Result] | X.X
│   └─ Status: [On track/Behind/Ahead]
│   └─ Blocker: [If any]
└─ KR3: [Key Result] | X.X
    └─ Status: [On track/Behind/Ahead]
    └─ Blocker: [If any]

Overall: [Assessment of objective progress]
Next Month Focus: [What needs attention]
```

**Objective 2**: [Name] | Score: X.X
```
[Same structure as above]
```

**Objective 3**: [Name] | Score: X.X
```
[Same structure as above]
```

### Monthly Goals Review

✅ **Completed** (X/Y):
- [Goal 1]: [Outcome/result]
- [Goal 2]: [Outcome/result]

🔄 **In Progress** (X/Y):
- [Goal 1]: X% complete - [Status]
- [Goal 2]: X% complete - [Status]

❌ **Not Started** (X/Y):
- [Goal 1]: [Why not started, still relevant?]

🚫 **Dropped** (X/Y):
- [Goal 1]: [Reason for dropping]

### Life Area Comparison

Compare to last month/assessment:

```
[Area 1]: X → Y (±Z)
├─ Change: [Why the change]
├─ Wins: [What went well]
└─ Needs: [What needs attention]

[Area 2]: X → Y (±Z)
├─ Change: [Why the change]
├─ Wins: [What went well]
└─ Needs: [What needs attention]

[Continue for all 10 areas]
```

**Areas Improving** (↗️):
- [Area]: [Celebrate what's working]

**Areas Declining** (↘️):
- [Area]: [Why declining, plan to address]

**Areas Stagnant** (→):
- [Area]: [Why stuck, what to try differently]

### Time Allocation Analysis

```
Planned Priority Work: X% (Target: 60-70%)
Reactive/Unplanned: Y% (Target: <20%)
Life Maintenance: Z% (Target: 10-20%)
Miscellaneous: W% (Target: <10%)

Alignment Check:
✅ Time matches priorities
⚠️ Too much reactive time
❌ Priority work underfunded
```

### Habit Consistency Report

```
[Habit 1]: X/31 days (Y%)
├─ Strength: 🟢 Strong | 🟡 Building | 🔴 Weak
├─ Best Streak: X days
├─ Pattern: [When it worked best]
└─ Decision: KEEP | MODIFY | DROP

[Habit 2]: X/31 days (Y%)
[Same structure]

[Habit 3]: X/31 days (Y%)
[Same structure]
```

---

## 🚀 PHASE 4: NEXT MONTH PLAN

### Month Theme: [Theme Name]

**Why This Theme?**
[1-2 sentences explaining the choice based on patterns and assessment]

### Top 3-5 Priorities

**Priority 1**: [Specific outcome]
- Links to: [OKR/Goal/Life Area]
- Success looks like: [Measurable result]
- Key actions: [2-3 actions]

**Priority 2**: [Specific outcome]
- Links to: [OKR/Goal/Life Area]
- Success looks like: [Measurable result]
- Key actions: [2-3 actions]

**Priority 3**: [Specific outcome]
- Links to: [OKR/Goal/Life Area]
- Success looks like: [Measurable result]
- Key actions: [2-3 actions]

**Priority 4** [Optional]: [Specific outcome]
- Links to: [OKR/Goal/Life Area]
- Success looks like: [Measurable result]
- Key actions: [2-3 actions]

### Habit Adjustments

**KEEP** (Working well, X%+ consistency):
- [Habit 1]: [Why it's working]
- [Habit 2]: [Why it's working]

**MODIFY** (Needs tweaking):
- [Habit]: Change from [old] to [new]
  - Why: [Reason for change]

**DROP** (Not serving me):
- [Habit]: [Why dropping]

**ADD** (To support priorities - 1-2 max):
- [New Habit 1]: [Why adding, how it helps]
- [New Habit 2]: [Why adding, how it helps]

### Process Improvements

**Planning**:
- Experiment: [What to try for better planning]
- Expected benefit: [What this should improve]

**Execution**:
- Remove friction: [What to streamline]
- Add support: [What to add for easier execution]

**Tracking**:
- Simplify: [What metrics to drop/change]
- Focus: [What really matters]

**Energy Management**:
- Protect: [Energy-giving activities to prioritize]
- Minimize: [Energy-draining activities to reduce]

### Challenge Mitigation Plans

**Challenge 1**: [Recurring challenge]
- Root cause: [Why it keeps happening]
- Experiment: [One thing to try]
- Success metric: [How to measure if it worked]

**Challenge 2**: [Recurring challenge]
- Root cause: [Why it keeps happening]
- Experiment: [One thing to try]
- Success metric: [How to measure if it worked]

### Calendar Pre-Planning

**Blocked Time**:
```
Week 1: [Key events, reviews, deep work]
Week 2: [Key events, reviews, deep work]
Week 3: [Key events, reviews, deep work]
Week 4: [Key events, reviews, deep work]
Week 5: [If applicable]

Weekly Review Slots:
- [Day/Time] for weekly reviews

Deep Work Blocks:
- [Day/Time] for [Priority 1]
- [Day/Time] for [Priority 2]

Life Area Time:
- [Day/Time] for [Relationships/Health/etc]

Buffer:
- [Time for unexpected + recharge]
```

### Success Metrics for Next Month

**Quantitative**:
- Metric 1: [Specific number, e.g., "Ship 2 features"]
- Metric 2: [Specific number, e.g., "Run 40 miles"]
- Metric 3: [Specific number, e.g., "Save $2000"]

**Qualitative**:
- Feeling: [How I want to feel, e.g., "Energized and in control"]
- Progress: [Directional sense, e.g., "Momentum on career goals"]

**Habit**:
- Target: [X% consistency on key habits]

**Balance**:
- [Life area] raised from X to Y
- No life area below [threshold]

---

## 💭 REFLECTIONS

### What I Learned This Month
- [Insight 1]
- [Insight 2]
- [Insight 3]

### What Surprised Me
- [Surprise 1]
- [Surprise 2]

### What I'm Grateful For
- [Gratitude 1]
- [Gratitude 2]
- [Gratitude 3]

### What I'm Looking Forward To
- [Anticipation 1]
- [Anticipation 2]

---

## 🔗 LINKS & REFERENCES

- **Previous Monthly Review**: memory/monthly/[YYYY-MM].md
- **Next Monthly Review**: memory/monthly/[YYYY-MM].md
- **This Month's Weeklies**: memory/weekly/YYYY-W{01-05}.md
- **Active Plan**: memory/plans/active-plan.md
- **Latest Assessment**: memory/assessments/latest.md

---

## 📝 NEXT ACTIONS

### Immediate (This Week)
- [ ] Update active-plan.md with new priorities
- [ ] Adjust habit tracking based on decisions
- [ ] Block calendar for next month
- [ ] [Other immediate action]

### Next Month
- [ ] Complete weekly reviews 4/4 weeks
- [ ] Ship Priority 1: [Outcome]
- [ ] Ship Priority 2: [Outcome]
- [ ] Ship Priority 3: [Outcome]
- [ ] Maintain habit consistency X%+

---

**Review Completed**: [Date & Time]
**Next Review Due**: [Last day of next month]
**Life OS Status**: 🟢 Active
```

## Aggregation Logic & Algorithms

### Win Aggregation Algorithm

```javascript
/**
 * Aggregate wins from all weekly reviews in a month
 * Groups similar wins and identifies patterns
 */
function aggregateWins(weeklyReviews) {
  const allWins = weeklyReviews.flatMap(review => review.wins);

  // Group by life area or goal category
  const grouped = groupByCategory(allWins);

  // Identify recurring wins (appeared 2+ weeks)
  const recurring = findRecurring(allWins, threshold = 2);

  // Calculate win momentum by area
  const momentum = calculateMomentum(grouped);

  return {
    totalWins: allWins.length,
    byCategory: grouped,
    recurring: recurring,
    momentum: momentum,
    topWin: identifyTopWin(allWins)
  };
}
```

### Challenge Pattern Detection

```javascript
/**
 * Identify recurring challenges across weekly reviews
 * Classifies as systemic vs. situational
 */
function detectChallengePatterns(weeklyReviews) {
  const allChallenges = weeklyReviews.flatMap(review => review.challenges);

  // Find challenges appearing in multiple weeks
  const recurring = allChallenges.filter(challenge =>
    appearanceCount(challenge, allChallenges) >= 2
  );

  // Classify each recurring challenge
  const classified = recurring.map(challenge => ({
    challenge: challenge.text,
    frequency: appearanceCount(challenge, allChallenges),
    weeks: weeksAppeared(challenge, weeklyReviews),
    type: isSystemic(challenge) ? 'systemic' : 'situational',
    rootCause: inferRootCause(challenge, weeklyReviews)
  }));

  return {
    total: allChallenges.length,
    recurring: classified,
    systemic: classified.filter(c => c.type === 'systemic'),
    needsAction: classified.filter(c => c.frequency >= 3)
  };
}
```

### Completion Rate Calculator

```javascript
/**
 * Calculate completion rates for reviews, goals, and habits
 */
function calculateCompletionRates(weeklyReviews, month) {
  const weeksInMonth = weeklyReviews.length;
  const daysInMonth = getDaysInMonth(month);

  // Weekly review completion
  const weeklyRate = weeksInMonth / expectedWeeks(month);

  // Daily planning completion (from weekly reviews)
  const dailyCompletions = weeklyReviews.reduce((sum, review) =>
    sum + review.dailyPlansCompleted, 0
  );
  const dailyRate = dailyCompletions / daysInMonth;

  // Goal completion
  const goals = extractGoals(weeklyReviews);
  const goalRate = goals.completed / goals.total;

  // Habit consistency (average across all habits)
  const habits = aggregateHabits(weeklyReviews);
  const habitRate = calculateAverageConsistency(habits);

  return {
    weekly: { rate: weeklyRate, target: 1.0 },
    daily: { rate: dailyRate, target: 0.8 },
    goals: { rate: goalRate, completed: goals.completed, total: goals.total },
    habits: { averageRate: habitRate, byHabit: habits }
  };
}
```

### Life Area Momentum Tracker

```javascript
/**
 * Track momentum for each life area across the month
 * Compares to previous month/assessment
 */
function trackLifeAreaMomentum(weeklyReviews, currentAssessment, previousAssessment) {
  const lifeAreas = [
    'Health & Fitness', 'Career & Work', 'Finances',
    'Relationships', 'Personal Growth', 'Environment',
    'Recreation', 'Contribution', 'Spirituality', 'Life Vision'
  ];

  return lifeAreas.map(area => {
    const currentScore = currentAssessment.scores[area];
    const previousScore = previousAssessment?.scores[area] || currentScore;
    const change = currentScore - previousScore;

    // Extract wins/challenges related to this area from weeklies
    const areaWins = extractByLifeArea(weeklyReviews, area, 'wins');
    const areaChallenges = extractByLifeArea(weeklyReviews, area, 'challenges');

    return {
      area: area,
      currentScore: currentScore,
      previousScore: previousScore,
      change: change,
      trend: change > 0 ? '↗️' : change < 0 ? '↘️' : '→',
      wins: areaWins,
      challenges: areaChallenges,
      status: classifyStatus(currentScore, change)
    };
  });
}
```

### OKR Progress Calculator

```javascript
/**
 * Calculate OKR progress from weekly data
 * Scores on 0.0-1.0 scale
 */
function calculateOKRProgress(activePlan, weeklyReviews) {
  const objectives = activePlan.objectives;

  return objectives.map(objective => {
    const keyResults = objective.keyResults.map(kr => {
      // Get latest progress from most recent weekly
      const latestProgress = getLatestKRProgress(kr, weeklyReviews);

      // Calculate score based on target vs. actual
      const score = latestProgress.actual / kr.target;

      // Identify blockers from challenges
      const blockers = identifyBlockers(kr, weeklyReviews);

      return {
        keyResult: kr.name,
        target: kr.target,
        actual: latestProgress.actual,
        score: Math.min(score, 1.0), // Cap at 1.0
        status: scoreToStatus(score),
        blockers: blockers
      };
    });

    // Objective score is average of KR scores
    const objectiveScore = average(keyResults.map(kr => kr.score));

    return {
      objective: objective.name,
      score: objectiveScore,
      keyResults: keyResults,
      onTrack: objectiveScore >= 0.7,
      needsAttention: objectiveScore < 0.5
    };
  });
}
```

### Energy Pattern Analyzer

```javascript
/**
 * Analyze energy and productivity patterns across weeks
 */
function analyzeEnergyPatterns(weeklyReviews) {
  const weeklyData = weeklyReviews.map(review => ({
    week: review.week,
    energy: review.energyLevel, // 'High', 'Medium', 'Low'
    productivity: review.completionRate,
    wins: review.wins.length,
    challenges: review.challenges.length
  }));

  // Identify high/low energy weeks
  const highEnergyWeeks = weeklyData.filter(w => w.energy === 'High');
  const lowEnergyWeeks = weeklyData.filter(w => w.energy === 'Low');

  // Find productivity drivers (common to high-energy weeks)
  const drivers = identifyCommonFactors(highEnergyWeeks, weeklyReviews);

  // Find productivity drains (common to low-energy weeks)
  const drains = identifyCommonFactors(lowEnergyWeeks, weeklyReviews);

  return {
    highEnergyWeeks: highEnergyWeeks.map(w => w.week),
    lowEnergyWeeks: lowEnergyWeeks.map(w => w.week),
    averageEnergy: calculateAverageEnergy(weeklyData),
    productivityDrivers: drivers,
    productivityDrains: drains,
    bestWeek: identifyBestWeek(weeklyData),
    recommendation: generateEnergyRecommendation(weeklyData)
  };
}
```

### Habit Consistency Aggregator

```javascript
/**
 * Aggregate habit consistency across all weeks in month
 */
function aggregateHabitConsistency(weeklyReviews, daysInMonth) {
  // Extract all tracked habits
  const habits = extractAllHabits(weeklyReviews);

  return habits.map(habit => {
    // Count completions from all weekly reviews
    const completions = countHabitCompletions(habit, weeklyReviews);
    const percentage = (completions / daysInMonth) * 100;

    // Find best streak
    const bestStreak = findBestStreak(habit, weeklyReviews);

    // Identify patterns (when it worked best)
    const patterns = identifyHabitPatterns(habit, weeklyReviews);

    // Classify strength
    const strength = percentage >= 80 ? '🟢 Strong' :
                     percentage >= 50 ? '🟡 Building' :
                     '🔴 Weak';

    // Recommendation
    const decision = percentage >= 80 ? 'KEEP' :
                     percentage >= 50 ? 'MODIFY' :
                     'DROP or REDESIGN';

    return {
      habit: habit.name,
      completions: completions,
      daysInMonth: daysInMonth,
      percentage: percentage,
      strength: strength,
      bestStreak: bestStreak,
      patterns: patterns,
      decision: decision
    };
  });
}
```

### Time Allocation Analyzer

```javascript
/**
 * Analyze how time was actually allocated vs. priorities
 */
function analyzeTimeAllocation(weeklyReviews, activePlan) {
  // Extract time logs from weekly reviews
  const timeLogs = weeklyReviews.flatMap(review => review.timeLogs || []);

  // Categorize time
  const categories = {
    priorityWork: 0,
    reactive: 0,
    maintenance: 0,
    misc: 0
  };

  timeLogs.forEach(log => {
    const category = categorizeTimeEntry(log, activePlan);
    categories[category] += log.hours;
  });

  const totalHours = Object.values(categories).reduce((a, b) => a + b, 0);

  const percentages = {
    priorityWork: (categories.priorityWork / totalHours) * 100,
    reactive: (categories.reactive / totalHours) * 100,
    maintenance: (categories.maintenance / totalHours) * 100,
    misc: (categories.misc / totalHours) * 100
  };

  // Check alignment with priorities
  const alignment =
    percentages.priorityWork >= 60 ? '✅ Time matches priorities' :
    percentages.reactive > 20 ? '⚠️ Too much reactive time' :
    '❌ Priority work underfunded';

  return {
    percentages: percentages,
    totalHours: totalHours,
    alignment: alignment,
    recommendation: generateTimeRecommendation(percentages)
  };
}
```

## Integration Specifications

### Input Files

1. **Weekly Reviews**: `memory/weekly/YYYY-WNN.md`
   - Extract: wins, challenges, completions, habits, insights, energy
   - Minimum required: 3 weekly reviews for meaningful analysis

2. **Active Plan**: `memory/plans/active-plan.md`
   - Extract: OKRs, key results, monthly goals, priorities

3. **Life Assessment**: `memory/assessments/latest.md`
   - Extract: Life area scores (10 areas)
   - Compare to previous assessment if available

### Output File

**Location**: `memory/monthly/YYYY-MM.md`

**Naming Convention**:
- Format: `YYYY-MM.md` (e.g., `2025-01.md`, `2025-02.md`)
- Links to: Previous month, next month, all weekly reviews

### Data Flow

```
Weekly Reviews (4-5 files)
         ↓
    Aggregation
         ↓
  Pattern Detection
         ↓
     Assessment
         ↓
   Planning Phase
         ↓
Monthly Review Output
         ↓
   Update Active Plan
         ↓
   Next Month Execution
```

## Prompts for AI Assistance

### Prompt 1: Data Collection

```
Aggregate monthly review data from the following weekly reviews:
- memory/weekly/2025-W01.md
- memory/weekly/2025-W02.md
- memory/weekly/2025-W03.md
- memory/weekly/2025-W04.md

Also read:
- memory/plans/active-plan.md
- memory/assessments/latest.md

Extract:
1. All wins and challenges from each week
2. Completion rates for goals and habits
3. Energy levels per week
4. Current OKR progress
5. Life area scores

Format the output for Phase 1 (COLLECT) of the monthly review.
```

### Prompt 2: Pattern Analysis

```
Analyze the following aggregated monthly data and identify patterns:

[Paste aggregated data from Phase 1]

Provide:
1. Win patterns (recurring across 2+ weeks)
2. Challenge patterns (systemic vs. situational)
3. Completion metrics calculations
4. Energy and productivity patterns
5. Life area momentum (trending up/flat/down)

Format the output for Phase 2 (ANALYZE) of the monthly review.
```

### Prompt 3: Progress Assessment

```
Score OKR and goal progress for the month:

Active Plan: [Paste from active-plan.md]
Weekly Data: [Paste relevant progress data]
Life Assessment: [Paste life area scores]

Calculate:
1. OKR scores (0.0-1.0 scale) for each Key Result
2. Monthly goal status (completed/in progress/not started)
3. Life area changes (compare to previous month)
4. Time allocation vs. priorities
5. Habit consistency (percentage for each habit)

Format the output for Phase 3 (ASSESS) of the monthly review.
```

### Prompt 4: Next Month Planning

```
Create next month's plan based on patterns and assessment:

Patterns: [Paste from Phase 2]
Assessment: [Paste from Phase 3]

Generate:
1. Month theme (based on patterns)
2. Top 3-5 priorities (specific, measurable)
3. Habit adjustments (keep/modify/drop/add)
4. Process improvements
5. Challenge mitigation plans
6. Calendar pre-planning
7. Success metrics

Format the output for Phase 4 (PLAN) of the monthly review.
```

### Prompt 5: Complete Monthly Review

```
Generate a complete monthly review for [Month] [Year]:

Input files:
- memory/weekly/YYYY-W{01-05}.md (all weeks)
- memory/plans/active-plan.md
- memory/assessments/latest.md

Execute all 4 phases:
1. COLLECT - Aggregate all weekly data
2. ANALYZE - Identify patterns and trends
3. ASSESS - Score OKR/goal/life progress
4. PLAN - Design next month strategy

Output to: memory/monthly/YYYY-MM.md

Use the monthly review template and apply all aggregation algorithms.
```

## Success Criteria

A successful monthly review includes:

✅ **Completeness**:
- All 4 phases executed thoroughly
- Data from all weekly reviews aggregated
- All life areas and goals addressed

✅ **Insight Quality**:
- Patterns identified with evidence
- Root causes analyzed
- Clear trends established

✅ **Actionability**:
- Specific next month priorities
- Measurable success metrics
- Concrete process improvements
- Realistic habit adjustments

✅ **Integration**:
- Links to weekly reviews maintained
- Active plan updated with new priorities
- Next month calendar pre-planned

✅ **Momentum**:
- Celebrates wins and progress
- Addresses challenges constructively
- Builds on successful patterns
- Maintains motivation

## Tips for Effective Monthly Reviews

1. **Schedule 60-90 minutes**: Don't rush this process
2. **Quiet environment**: Minimize distractions for reflection
3. **Be honest**: Face challenges and setbacks truthfully
4. **Celebrate wins**: Recognize progress, even small wins
5. **Look for patterns**: This is the key insight source
6. **Be specific**: Vague plans lead to vague results
7. **Realistic priorities**: 3-5 max, linked to goals
8. **Update as you go**: Don't wait until month end to track
9. **Compare trends**: Month-to-month comparison is valuable
10. **Act immediately**: Update plans and calendar right after review

## Common Pitfalls to Avoid

❌ Skipping monthly reviews (momentum loss)
❌ Only reviewing at quarter end (too infrequent)
❌ Focusing only on what went wrong (demotivating)
❌ Setting too many priorities (dilution)
❌ Not connecting to weekly/daily systems (disconnect)
❌ Ignoring patterns (missing insights)
❌ Not updating active plans (stale goals)
❌ Being vague about next month (no direction)
❌ Forgetting to celebrate wins (burnout risk)
❌ Rushing through phases (shallow insights)

## Quarterly Integration

On **Month 3** of each quarter, add quarterly assessment:

**Additional Section**:
```markdown
## 🎯 QUARTERLY CHECKPOINT

### 90-Day Progress Review
- Quarter Goal: [Original quarterly objective]
- Progress: X% complete
- Key Wins: [Top 3 wins of quarter]
- Key Learnings: [Top 3 insights]

### OKR Final Scores
[Complete scoring of all quarterly OKRs]

### Next Quarter Theme
[Based on 3-month patterns, set next quarter theme]

### Adjustments for Next Quarter
[Major strategy or priority shifts needed]
```

## Version History

- **v1.0** (2025-01): Initial monthly review skill with full aggregation
- Future: Add quarterly review integration
- Future: Add annual review workflow
- Future: Add predictive insights based on patterns

---

**Remember**: Monthly reviews are where daily and weekly efforts transform into sustained progress. This is your strategic checkpoint to ensure all the small steps are leading toward your bigger vision.
