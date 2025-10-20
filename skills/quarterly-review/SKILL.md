# Quarterly Review Skill

## Purpose
Conduct comprehensive 90-day retrospectives, score OKRs, identify patterns, and plan the next quarter with strategic focus.

## When to Use This Skill
- End of each quarter (March, June, September, December)
- Major life transitions or changes
- Before setting new strategic goals
- When needing big-picture perspective
- Evaluating multi-month progress

## Core Functions

### 1. Three-Month Retrospective
Synthesize all monthly reviews from the quarter:
```bash
# Gather monthly reviews
cat memory/monthly/2025-01.md
cat memory/monthly/2025-02.md
cat memory/monthly/2025-03.md

# Extract key themes
grep -E "^## (Wins|Challenges|Lessons)" memory/monthly/2025-*.md

# Identify patterns
grep -E "^- \*\*" memory/monthly/2025-*.md | sort | uniq -c | sort -rn
```

### 2. Life Assessment Integration
Link to latest comprehensive life assessment:
```bash
# Find most recent life assessment
ls -lt memory/assessments/*.md | head -1

# Extract scores and insights
grep -E "^### (Career|Health|Relationships|Personal Growth|Finance|Environment)" \
  memory/assessments/2025-Q1.md

# Compare to previous quarter
diff memory/assessments/2024-Q4.md memory/assessments/2025-Q1.md
```

### 3. OKR Scoring
Score all quarterly OKRs on 0.0-1.0 scale:

**Scoring Guide:**
- **0.0-0.3**: Failed - Did not make meaningful progress
- **0.4-0.6**: Partial Success - Made progress but fell short
- **0.7-0.9**: Success - Achieved most of the objective
- **1.0**: Complete Success - Exceeded expectations

**OKR Structure:**
```javascript
{
  "quarter": "2025-Q1",
  "objectives": [
    {
      "id": "O1",
      "objective": "Launch new product feature",
      "keyResults": [
        {
          "kr": "KR1: Ship MVP to 100 beta users",
          "target": 100,
          "actual": 87,
          "score": 0.87,
          "notes": "Strong start, slightly behind target"
        },
        {
          "kr": "KR2: Achieve 4.5+ average rating",
          "target": 4.5,
          "actual": 4.7,
          "score": 1.0,
          "notes": "Exceeded expectations, users love it"
        },
        {
          "kr": "KR3: Generate $10k MRR",
          "target": 10000,
          "actual": 6500,
          "score": 0.65,
          "notes": "Good traction but conversion needs work"
        }
      ],
      "overallScore": 0.84,
      "status": "success"
    },
    {
      "id": "O2",
      "objective": "Improve health and fitness",
      "keyResults": [
        {
          "kr": "KR1: Exercise 4x per week",
          "target": 48,
          "actual": 52,
          "score": 1.0,
          "notes": "Consistent routine established"
        },
        {
          "kr": "KR2: Reduce weight by 10 lbs",
          "target": 10,
          "actual": 7,
          "score": 0.7,
          "notes": "Good progress, sustainable pace"
        },
        {
          "kr": "KR3: Complete 5k race",
          "target": 1,
          "actual": 1,
          "score": 1.0,
          "notes": "Completed with personal best time"
        }
      ],
      "overallScore": 0.90,
      "status": "success"
    }
  ],
  "quarterScore": 0.87,
  "quarterGrade": "A"
}
```

### 4. Pattern Analysis
Identify 90-day trends and insights:

**Analysis Framework:**
```javascript
const ANALYSIS_DIMENSIONS = {
  productivity: {
    metrics: ['tasks_completed', 'goals_achieved', 'projects_shipped'],
    trends: ['improving', 'stable', 'declining'],
    patterns: ['consistent', 'cyclical', 'random']
  },
  wellbeing: {
    metrics: ['energy_level', 'stress_level', 'satisfaction'],
    trends: ['improving', 'stable', 'declining'],
    patterns: ['seasonal', 'work-related', 'lifestyle']
  },
  relationships: {
    metrics: ['connection_quality', 'time_with_loved_ones', 'conflict_resolution'],
    trends: ['strengthening', 'stable', 'weakening'],
    patterns: ['consistent', 'event-driven', 'seasonal']
  },
  growth: {
    metrics: ['skills_learned', 'books_read', 'experiments_tried'],
    trends: ['accelerating', 'steady', 'stagnating'],
    patterns: ['intentional', 'opportunistic', 'reactive']
  }
};

// Pattern detection
function detectPatterns(monthlyData) {
  return {
    strengths: identifyConsistentWins(monthlyData),
    weaknesses: identifyRecurringChallenges(monthlyData),
    opportunities: identifyEmergingTrends(monthlyData),
    threats: identifyWarningSignals(monthlyData)
  };
}

// Trend analysis
function analyzeTrends(data) {
  const months = ['month1', 'month2', 'month3'];
  return months.map((month, idx) => ({
    month,
    score: calculateMonthScore(data[month]),
    trend: idx > 0 ? compareToPrevious(data[month], data[months[idx-1]]) : null,
    momentum: calculateMomentum(data, idx)
  }));
}
```

**Pattern Report:**
```markdown
## Quarterly Patterns

### Strengths (What Worked)
- **Consistent Exercise**: Hit target 13/13 weeks
- **Morning Routine**: Established and maintained
- **Focused Work Blocks**: Productivity increased 40%
- **Weekly Reviews**: Never missed one

### Weaknesses (What Didn't Work)
- **Evening Habits**: Struggled with screen time
- **Deep Work**: Often interrupted by meetings
- **Social Connection**: Declined in Month 3
- **Reading Goal**: Only completed 60% of target

### Opportunities (Emerging Positives)
- **New Skill**: Coding proficiency improving rapidly
- **Side Project**: Gaining traction unexpectedly
- **Meditation**: Starting to feel real benefits
- **Network**: New connections opening doors

### Threats (Warning Signals)
- **Burnout Risk**: Energy declining end of quarter
- **Relationship Strain**: Less quality time with partner
- **Financial Pressure**: Expenses creeping up
- **Health**: Minor issues need attention
```

### 5. Next Quarter Planning
Set OKRs and focus areas for Q+1:

**Planning Process:**
```markdown
## Q+1 Planning Framework

### Step 1: Review Q0 Performance
- What was your quarter score? (0.87 - Grade A)
- Which objectives succeeded? (2/2 - both successful)
- Which fell short? (Revenue KR needs work)
- What surprised you? (Exercise consistency!)

### Step 2: Life Assessment Check-In
- Which life areas need attention? (Relationships: 6/10)
- What's out of balance? (Work-life balance)
- What areas are thriving? (Health: 8/10, Career: 9/10)
- What's changing? (New role starting)

### Step 3: Theme Selection
Choose 1-2 themes for next quarter:
- **Theme Examples**:
  - "Build Sustainable Systems"
  - "Deepen Relationships"
  - "Financial Foundation"
  - "Creative Expression"
  - "Health Optimization"
  - "Career Acceleration"

### Step 4: Objective Setting (3-5 Objectives)
**Format**: [Action Verb] + [Measurable Outcome]

**Good Examples**:
- "Launch V2 product with 500+ active users"
- "Establish financial runway of 6 months"
- "Build meditation habit of 30 consecutive days"
- "Strengthen relationship through weekly date nights"

**Bad Examples**:
- "Be more productive" (not measurable)
- "Work on side project" (no outcome)
- "Get healthier" (too vague)

### Step 5: Key Results (3-5 per Objective)
**Format**: [Metric] from [X] to [Y]

**Criteria**:
- Measurable (numbers, percentages, completions)
- Ambitious but achievable (60-70% confidence)
- Time-bound (quarter deadline)
- Leading indicators (actions you control)

**Example Objective**: "Establish financial runway of 6 months"
- KR1: Increase income from $5k/mo to $7k/mo
- KR2: Reduce expenses from $4k/mo to $3k/mo
- KR3: Build emergency fund from $2k to $15k
- KR4: Diversify income with 2 new revenue streams
```

### 6. Goal Refinement
Adjust based on what worked/didn't work:

**Refinement Checklist:**
```markdown
## Goal Refinement Process

### Review Previous Quarter OKRs
- [ ] Which OKRs scored 0.7+? (keep similar approach)
- [ ] Which OKRs scored <0.6? (revise or remove)
- [ ] Were OKRs too ambitious? (scale back)
- [ ] Were OKRs too easy? (increase ambition)
- [ ] Did OKRs align with priorities? (realign)

### Analyze Root Causes
**For Successful OKRs:**
- What specific actions drove success?
- What systems/habits enabled progress?
- What resources were key?
- What skills/knowledge helped?

**For Failed OKRs:**
- What blocked progress? (time, skill, motivation, resources)
- Was the goal poorly defined?
- Did priorities shift?
- Were dependencies missing?
- Was it the wrong goal entirely?

### Refine for Next Quarter
**Keep:**
- Goals that are working (scored 0.7+)
- Successful habits and systems
- Effective workflows and routines
- High-leverage activities

**Change:**
- Goals that aren't working (<0.6)
- Ineffective approaches
- Low-leverage activities
- Unrealistic expectations

**Add:**
- New opportunities discovered
- Skills/knowledge gaps identified
- Systems that need building
- Relationships to strengthen

**Remove:**
- Goals no longer relevant
- Activities with no impact
- Commitments draining energy
- Projects with low ROI
```

### 7. Celebrate Wins
Acknowledge major accomplishments:

**Celebration Framework:**
```markdown
## Quarterly Wins Celebration

### Major Accomplishments
1. **[Achievement]**: [Why it matters]
   - Impact: [Measurable result]
   - Effort: [What it took]
   - Learning: [What you learned]

### Personal Bests
- New skills mastered
- Challenges overcome
- Fears conquered
- Habits established

### Gratitude
- People who helped
- Opportunities received
- Lessons learned
- Growth experienced

### Rewards
Plan meaningful rewards for achievements:
- Small wins: [Immediate treat]
- Medium wins: [Weekend experience]
- Big wins: [Major celebration]
```

## Quarterly Review Phases

### Phase 1: COLLECT (Week 13, Day 1-2)
Gather all relevant data:
```bash
# Monthly reviews
cat memory/monthly/2025-01.md > temp/quarterly-review-input.md
cat memory/monthly/2025-02.md >> temp/quarterly-review-input.md
cat memory/monthly/2025-03.md >> temp/quarterly-review-input.md

# Life assessment
cat memory/assessments/2025-Q1.md >> temp/quarterly-review-input.md

# OKRs
cat memory/goals/2025-Q1-okrs.json >> temp/quarterly-review-input.md

# Weekly reviews (for additional context)
cat memory/weekly/2025-W*.md >> temp/quarterly-review-input.md

# Key metrics
npx claude-flow@alpha hooks memory-search --pattern "metrics/2025-Q1"
```

### Phase 2: SCORE (Week 13, Day 3)
Rate all OKRs:
```javascript
// Load OKRs
const okrs = require('./memory/goals/2025-Q1-okrs.json');

// Score each key result
okrs.objectives.forEach(obj => {
  obj.keyResults.forEach(kr => {
    kr.score = calculateScore(kr.target, kr.actual);
    kr.status = kr.score >= 0.7 ? 'success' : kr.score >= 0.4 ? 'partial' : 'failed';
  });

  // Calculate objective score (average of KRs)
  obj.overallScore = average(obj.keyResults.map(kr => kr.score));
  obj.status = obj.overallScore >= 0.7 ? 'success' : obj.overallScore >= 0.4 ? 'partial' : 'failed';
});

// Calculate quarter score
const quarterScore = average(okrs.objectives.map(obj => obj.overallScore));
const quarterGrade = scoreToGrade(quarterScore);

// Save scored OKRs
fs.writeFileSync(
  './memory/quarterly/2025-Q1-scored.json',
  JSON.stringify({ ...okrs, quarterScore, quarterGrade }, null, 2)
);
```

### Phase 3: REFLECT (Week 13, Day 4-5)
Identify patterns and insights:
```bash
# Generate reflection prompts
cat <<EOF > temp/reflection-prompts.md
# Q1 2025 Reflection

## Objective Analysis
- Quarter Score: ${QUARTER_SCORE}
- Grade: ${QUARTER_GRADE}
- Successful Objectives: ${SUCCESS_COUNT}/${TOTAL_OBJECTIVES}

## Deep Reflection Questions

### Success Analysis
1. What were your 3 biggest wins this quarter?
2. What patterns led to these successes?
3. What surprised you about what worked?
4. What skills/knowledge proved most valuable?

### Challenge Analysis
1. What were your 3 biggest challenges?
2. What patterns contributed to struggles?
3. What would you do differently?
4. What support/resources were missing?

### Pattern Recognition
1. What themes emerged across the quarter?
2. What habits served you well?
3. What habits held you back?
4. What relationships strengthened/weakened?

### Life Balance
1. Which life areas thrived? Why?
2. Which life areas struggled? Why?
3. What trade-offs did you make?
4. What needs rebalancing?

### Learning & Growth
1. What did you learn about yourself?
2. What skills did you develop?
3. What beliefs/assumptions changed?
4. What do you want to learn next?

### Energy & Wellbeing
1. When did you feel most alive/energized?
2. When did you feel drained/depleted?
3. What activities gave you energy?
4. What activities drained energy?

### Future Implications
1. What should you do more of?
2. What should you do less of?
3. What should you start doing?
4. What should you stop doing?
EOF
```

### Phase 4: PLAN (Week 13, Day 6)
Set next quarter OKRs:
```bash
# Create Q+1 OKR template
cat <<EOF > memory/goals/2025-Q2-okrs.json
{
  "quarter": "2025-Q2",
  "theme": "[Your chosen theme]",
  "focus": "[1-2 sentence focus statement]",
  "objectives": [
    {
      "id": "O1",
      "objective": "[Action verb] + [Measurable outcome]",
      "category": "career|health|relationships|growth|finance",
      "rationale": "[Why this objective matters]",
      "keyResults": [
        {
          "kr": "KR1: [Metric] from [X] to [Y]",
          "target": 0,
          "baseline": 0,
          "measurement": "[How you'll track this]"
        }
      ]
    }
  ],
  "commitments": [
    "I will...",
    "I will not...",
    "I will focus on..."
  ]
}
EOF

# Link to life assessment
echo "See memory/assessments/2025-Q1.md for context"

# Review and refine
nano memory/goals/2025-Q2-okrs.json
```

### Phase 5: DOCUMENT (Week 13, Day 7)
Save comprehensive quarterly review:
```bash
# Generate final document
cat <<EOF > memory/quarterly/2025-Q1.md
# Q1 2025 Quarterly Review
**Date**: $(date +%Y-%m-%d)
**Quarter Score**: ${QUARTER_SCORE}
**Grade**: ${QUARTER_GRADE}

## Executive Summary
[2-3 paragraph overview of the quarter]

## OKR Performance
$(cat memory/quarterly/2025-Q1-scored.json)

## Monthly Review Summary
### January
- Key wins: ...
- Key challenges: ...
- Lessons learned: ...

### February
- Key wins: ...
- Key challenges: ...
- Lessons learned: ...

### March
- Key wins: ...
- Key challenges: ...
- Lessons learned: ...

## Pattern Analysis
### Strengths
- ...

### Weaknesses
- ...

### Opportunities
- ...

### Threats
- ...

## Life Assessment Integration
$(cat memory/assessments/2025-Q1.md | grep -A 50 "## Life Scores")

## Deep Reflections
[Answers to reflection questions]

## Major Wins & Celebrations
1. ...
2. ...
3. ...

## Next Quarter Preview
**Theme**: ...
**Focus**: ...
**Top 3 Priorities**:
1. ...
2. ...
3. ...

## Action Items
- [ ] Finalize Q2 OKRs
- [ ] Schedule Q2 kickoff
- [ ] Archive Q1 materials
- [ ] Celebrate quarter!
EOF

# Store in memory
npx claude-flow@alpha hooks post-edit \
  --file "memory/quarterly/2025-Q1.md" \
  --memory-key "swarm/user/quarterly-review/2025-Q1"
```

## Memory Integration

Store quarterly data for long-term tracking:
```bash
# Store quarterly review
npx claude-flow@alpha hooks post-edit \
  --file "memory/quarterly/2025-Q1.md" \
  --memory-key "swarm/user/quarterly-review/2025-Q1"

# Store scored OKRs
npx claude-flow@alpha hooks post-edit \
  --file "memory/quarterly/2025-Q1-scored.json" \
  --memory-key "swarm/user/okrs/2025-Q1"

# Store next quarter OKRs
npx claude-flow@alpha hooks post-edit \
  --file "memory/goals/2025-Q2-okrs.json" \
  --memory-key "swarm/user/okrs/2025-Q2"

# Store patterns and insights
npx claude-flow@alpha hooks post-edit \
  --file "memory/quarterly/2025-Q1-insights.json" \
  --memory-key "swarm/user/insights/2025-Q1"
```

## Output Format

### Quarterly Review Document
```markdown
# Q1 2025 Quarterly Review
**Date**: 2025-03-31
**Quarter Score**: 0.87
**Grade**: A

## Executive Summary
Q1 was a strong quarter marked by significant professional growth and consistent health habits. Launched new product feature to 87 beta users with excellent feedback (4.7/5 rating). Established sustainable exercise routine with perfect attendance (52/48 sessions). Revenue generation fell short of target but showed promising traction. Overall, exceeded expectations in most areas while identifying clear opportunities for improvement in work-life balance and revenue conversion.

## OKR Performance

### O1: Launch New Product Feature (Score: 0.84)
**Status**: ✅ SUCCESS

| Key Result | Target | Actual | Score | Status |
|------------|--------|--------|-------|--------|
| Ship MVP to 100 beta users | 100 | 87 | 0.87 | ⚠️ Partial |
| Achieve 4.5+ average rating | 4.5 | 4.7 | 1.0 | ✅ Success |
| Generate $10k MRR | $10k | $6.5k | 0.65 | ⚠️ Partial |

**Analysis**: Strong product-market fit evidenced by exceptional user ratings. User acquisition paced well but conversion optimization needed for revenue targets.

### O2: Improve Health and Fitness (Score: 0.90)
**Status**: ✅ SUCCESS

| Key Result | Target | Actual | Score | Status |
|------------|--------|--------|-------|--------|
| Exercise 4x per week | 48 | 52 | 1.0 | ✅ Success |
| Reduce weight by 10 lbs | 10 lbs | 7 lbs | 0.7 | ⚠️ Partial |
| Complete 5k race | 1 | 1 | 1.0 | ✅ Success |

**Analysis**: Established sustainable fitness routine that exceeded targets. Weight loss progressed steadily at healthy pace. Achieved personal best in 5k race.

## Pattern Analysis

### 🌟 Strengths (What Worked)
1. **Morning Routine**: 90-day streak of 6am wake-ups enabled consistent exercise
2. **Focused Work Blocks**: 3-hour deep work sessions increased productivity 40%
3. **Weekly Reviews**: Never missed one, drove continuous improvement
4. **User Feedback Loop**: Regular user interviews improved product rapidly

### ⚠️ Weaknesses (What Didn't Work)
1. **Revenue Conversion**: Need better onboarding and pricing strategy
2. **Evening Habits**: Screen time averaged 3+ hours, impacting sleep
3. **Social Connection**: Time with friends declined 30% vs Q4
4. **Reading Goal**: Only completed 6/10 planned books

### 🚀 Opportunities (Emerging Positives)
1. **Coding Skills**: Proficiency improving rapidly, opening new possibilities
2. **Side Project**: Unexpected traction suggests scalable opportunity
3. **Meditation**: 30-day streak showing real benefits in focus
4. **Network**: New connections from beta users opening doors

### 🚨 Threats (Warning Signals)
1. **Burnout Risk**: Energy levels declining end of quarter
2. **Relationship Strain**: Partner expressed concern about work hours
3. **Financial Pressure**: Runway shortening with lower revenue
4. **Health**: Minor back pain from desk setup needs addressing

## Life Assessment Integration

### Life Scores (Q1 2025)
| Area | Score | Change | Notes |
|------|-------|--------|-------|
| Career | 9/10 | +2 | Product launch success, skill growth |
| Health | 8/10 | +1 | Consistent exercise, good nutrition |
| Relationships | 6/10 | -1 | Less time with loved ones |
| Personal Growth | 8/10 | +1 | New skills, self-awareness |
| Finance | 6/10 | 0 | Revenue below target, runway concern |
| Environment | 7/10 | 0 | Stable, ergonomics need work |

**Overall Balance**: 7.3/10 (Good, but work-life balance needs attention)

## Deep Reflections

### What I Learned About Myself
- I thrive with consistent routines and structure
- I can build sustainable habits when I start small
- I underestimate how much energy relationships require
- I'm more resilient than I thought when facing setbacks
- I need to be more intentional about rest and recovery

### What I Want to Do Differently
- Set firmer boundaries between work and personal time
- Schedule relationship time as non-negotiable
- Focus on fewer goals with deeper execution
- Invest more in systems vs grinding through effort
- Practice saying "no" to protect energy and focus

## Major Wins & Celebrations

### 🏆 Top Achievements
1. **Product Launch**: Shipped V1 to real users with excellent feedback
2. **Fitness Transformation**: Lost 7 lbs, ran personal best 5k
3. **Consistency Mastery**: 90-day morning routine streak
4. **Skill Development**: Went from beginner to intermediate in coding
5. **User Love**: 4.7/5 rating shows product solving real problems

### 🎉 Planned Celebrations
- Weekend getaway with partner (addressing relationship gap)
- New running shoes (reward for fitness achievement)
- Dinner with beta users (thank them for support)

## Next Quarter Preview (Q2 2025)

### Theme: "Sustainable Growth"
**Focus**: Build systems and relationships that enable long-term success without burnout

### Top 3 Priorities
1. **Revenue Systems**: Implement onboarding flow and pricing strategy to hit $10k MRR
2. **Relationship Investment**: Weekly date nights and monthly friend gatherings
3. **Energy Management**: Establish sustainable pace with clear work boundaries

### Q2 OKRs (Draft)
**O1**: Scale product to $10k MRR with improved systems
- KR1: Increase user base from 87 to 250
- KR2: Improve conversion from 15% to 30%
- KR3: Reduce churn from 8% to 4%
- KR4: Achieve $10k MRR

**O2**: Strengthen relationships and life balance
- KR1: Weekly date nights (13/13)
- KR2: Monthly friend gatherings (3/3)
- KR3: Daily end-of-work ritual by 6pm
- KR4: Increase relationship score from 6/10 to 8/10

**O3**: Maintain health while optimizing energy
- KR1: Continue 4x/week exercise (52/52)
- KR2: Reduce evening screen time to <1.5hr
- KR3: Achieve 7.5hr average sleep
- KR4: Fix ergonomics setup (eliminate back pain)

## Action Items

### This Week
- [x] Complete quarterly review
- [ ] Finalize Q2 OKRs with partner input
- [ ] Schedule Q2 kickoff ritual
- [ ] Book weekend getaway
- [ ] Order ergonomic chair

### Next Week
- [ ] Launch improved onboarding flow
- [ ] Schedule first Q2 date night
- [ ] Start work-end ritual experiment
- [ ] First Q2 weekly review

---
**Reflection Complete**: Ready for Q2! 🚀
```

## Success Metrics
- Quarterly review completed within 7 days of quarter end
- All OKRs scored with clear rationale
- Patterns identified across 90 days
- Next quarter OKRs set before quarter starts
- Life assessment integrated for context
- Wins celebrated and rewarded
- Insights stored in memory for future reference

## Integration with Other Skills
- **Prerequisite**: monthly-review (need 3 months of data)
- **Feeds Into**: goal-setting (Q+1 OKRs), conducting-life-assessment
- **Related**: weekly-review (builds to monthly to quarterly)

## Example Usage

**Scenario: End of Q1 2025**
```
User: "Time to review my quarter"