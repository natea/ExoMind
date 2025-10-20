# Quarterly Review Skill

## Quick Start

```bash
# Run quarterly review (end of Q1, Q2, Q3, Q4)
bash skills/quarterly-review/run-review.sh
```

## What This Skill Does

The Quarterly Review skill helps you:

1. **Review 90 Days** - Synthesize 3 monthly reviews into quarterly insights
2. **Score OKRs** - Rate all objectives on 0.0-1.0 scale
3. **Identify Patterns** - Find 90-day trends in productivity, wellbeing, relationships
4. **Plan Next Quarter** - Set strategic OKRs for Q+1
5. **Celebrate Wins** - Acknowledge major accomplishments
6. **Refine Goals** - Adjust based on what worked/didn't work

## When to Use

- 📅 **End of Quarter**: March 31, June 30, September 30, December 31
- 🔄 **Major Transitions**: Job change, move, life event
- 🎯 **Strategic Planning**: Need big-picture perspective
- 📊 **Progress Evaluation**: Multi-month goal assessment

## Quarterly Review Schedule

| Quarter | Months | Review Date | Plan Next Quarter |
|---------|--------|-------------|-------------------|
| Q1 | Jan-Mar | Mar 28-31 | Apr 1-7 (Q2 OKRs) |
| Q2 | Apr-Jun | Jun 28-30 | Jul 1-7 (Q3 OKRs) |
| Q3 | Jul-Sep | Sep 28-30 | Oct 1-7 (Q4 OKRs) |
| Q4 | Oct-Dec | Dec 28-31 | Jan 1-7 (Q1 OKRs) |

## The 5 Phases

### Phase 1: COLLECT (Days 1-2)
Gather all data:
```bash
# Monthly reviews
cat memory/monthly/2025-01.md
cat memory/monthly/2025-02.md
cat memory/monthly/2025-03.md

# Life assessment
cat memory/assessments/2025-Q1.md

# OKRs
cat memory/goals/2025-Q1-okrs.json

# Weekly reviews (for context)
cat memory/weekly/2025-W*.md
```

### Phase 2: SCORE (Day 3)
Rate all OKRs:
```javascript
// Scoring guide
0.0-0.3: Failed
0.4-0.6: Partial Success
0.7-0.9: Success
1.0: Complete Success

// Example
{
  "kr": "Ship MVP to 100 users",
  "target": 100,
  "actual": 87,
  "score": 0.87,
  "status": "success"
}
```

### Phase 3: REFLECT (Days 4-5)
Answer deep questions:
- What were your 3 biggest wins?
- What patterns led to success?
- What challenges emerged?
- What would you do differently?
- What did you learn about yourself?

### Phase 4: PLAN (Day 6)
Set Q+1 OKRs:
```json
{
  "quarter": "2025-Q2",
  "theme": "Sustainable Growth",
  "objectives": [
    {
      "objective": "Scale product to $10k MRR",
      "keyResults": [
        "Increase users from 87 to 250",
        "Improve conversion from 15% to 30%",
        "Achieve $10k MRR"
      ]
    }
  ]
}
```

### Phase 5: DOCUMENT (Day 7)
Save comprehensive review:
```bash
# Generate final document
bash skills/quarterly-review/generate-document.sh

# Store in memory
npx claude-flow@alpha hooks post-edit \
  --file "memory/quarterly/2025-Q1.md" \
  --memory-key "swarm/user/quarterly-review/2025-Q1"
```

## OKR Scoring System

### Scoring Formula
```javascript
function calculateScore(target, actual) {
  if (actual >= target) return 1.0;
  return Math.min(actual / target, 1.0);
}

// Example
calculateScore(100, 87) // 0.87
calculateScore(10, 12) // 1.0 (exceeded)
calculateScore(50, 20) // 0.4 (partial)
```

### Grade Scale
| Score Range | Grade | Interpretation |
|-------------|-------|----------------|
| 0.9-1.0 | A | Exceptional quarter |
| 0.8-0.89 | B+ | Strong quarter |
| 0.7-0.79 | B | Good quarter |
| 0.6-0.69 | C+ | Acceptable quarter |
| 0.5-0.59 | C | Mixed results |
| <0.5 | D/F | Needs major adjustment |

### Objective Scoring
```javascript
// Average all key results
const objectiveScore = average(keyResults.map(kr => kr.score));

// Example
O1: [0.87, 1.0, 0.65] → 0.84 (B+)
O2: [1.0, 0.7, 1.0] → 0.90 (A)
Quarter: [0.84, 0.90] → 0.87 (A)
```

## Pattern Analysis Framework

### SWOT Analysis
```markdown
**Strengths**: What consistently worked
- Morning routine (90-day streak)
- Weekly reviews (13/13 completed)
- Exercise habit (52/48 sessions)

**Weaknesses**: What didn't work
- Evening screen time (3+ hours)
- Social connection (declined 30%)
- Reading goal (60% completed)

**Opportunities**: Emerging positives
- New skill gaining traction
- Side project showing promise
- Network expanding rapidly

**Threats**: Warning signals
- Burnout risk (energy declining)
- Relationship strain (less time together)
- Financial pressure (runway shortening)
```

### Trend Analysis
```javascript
const trends = {
  productivity: {
    month1: 7.5,
    month2: 8.2,
    month3: 7.8,
    trend: 'stable',
    pattern: 'consistent'
  },
  wellbeing: {
    month1: 8.0,
    month2: 7.5,
    month3: 6.8,
    trend: 'declining',
    pattern: 'gradual'
  }
};
```

## Next Quarter Planning

### Theme Selection
Choose 1-2 themes:
- "Build Sustainable Systems"
- "Deepen Relationships"
- "Financial Foundation"
- "Creative Expression"
- "Health Optimization"
- "Career Acceleration"

### Objective Setting
**Format**: [Action Verb] + [Measurable Outcome]

**Good Examples**:
- "Launch V2 product with 500+ active users"
- "Establish financial runway of 6 months"
- "Build meditation habit of 30 consecutive days"

**Bad Examples**:
- "Be more productive" (not measurable)
- "Work on side project" (no outcome)
- "Get healthier" (too vague)

### Key Results
**Format**: [Metric] from [X] to [Y]

**Example**:
```json
{
  "objective": "Scale product to $10k MRR",
  "keyResults": [
    "Increase users from 87 to 250",
    "Improve conversion from 15% to 30%",
    "Reduce churn from 8% to 4%",
    "Achieve $10k MRR"
  ]
}
```

## Celebration Framework

### Major Accomplishments
```markdown
1. **Product Launch**: Shipped V1 to 87 users (4.7/5 rating)
   - Impact: Validated product-market fit
   - Effort: 3 months of focused development
   - Learning: User feedback is invaluable

2. **Fitness Transformation**: Lost 7 lbs, ran personal best 5k
   - Impact: Established sustainable health habits
   - Effort: 52/48 exercise sessions completed
   - Learning: Consistency beats intensity
```

### Planned Rewards
- **Small Wins**: Favorite meal, movie night
- **Medium Wins**: Weekend trip, new gear
- **Big Wins**: Vacation, major purchase

## Output Example

See `skills/quarterly-review/SKILL.md` for full example output including:
- Executive summary
- OKR performance table
- Monthly review synthesis
- Pattern analysis (SWOT)
- Life assessment integration
- Deep reflections
- Next quarter preview

## Integration with Other Skills

### Prerequisites
- **monthly-review** (need 3 months of data)
- **goal-setting** (have OKRs to score)
- **conducting-life-assessment** (optional context)

### Feeds Into
- **goal-setting** (set Q+1 OKRs)
- **weekly-planning** (start Q+1 strong)

### Workflow
```
Month 3 Week 4:
1. Complete monthly-review #3
2. Run quarterly-review (Phase 1-5)
3. Set Q+1 OKRs via goal-setting
4. Plan Week 1 of Q+1 via weekly-planning
```

## Success Metrics
- ✓ Review completed within 7 days of quarter end
- ✓ All OKRs scored with clear rationale
- ✓ Patterns identified across 90 days
- ✓ Q+1 OKRs set before quarter starts
- ✓ Wins celebrated and rewarded
- ✓ Insights stored for future reference

## Common Questions

**Q: How long does a quarterly review take?**
A: Plan 7-10 hours spread over 7 days (1-1.5 hours per day)

**Q: What if I don't have 3 monthly reviews?**
A: Use weekly reviews as input, or start with partial data

**Q: Can I skip the life assessment?**
A: Yes, but it provides valuable context for goal setting

**Q: How do I score subjective goals?**
A: Use 0-10 self-ratings, convert to 0.0-1.0 scale

**Q: What if my quarter score is low?**
A: That's valuable data! Use it to adjust Q+1 approach

## Next Steps

After completing quarterly review:
1. Schedule Q+1 kickoff ritual
2. Share OKRs with accountability partner
3. Set up weekly check-ins for Q+1
4. Plan first week of Q+1
5. Celebrate your wins!

## Related Skills
- **monthly-review** - Prerequisite (3 months)
- **goal-setting** - Set Q+1 OKRs
- **conducting-life-assessment** - Context for planning
- **weekly-planning** - Break Q+1 into weeks

## Support
- Documentation: See `skills/quarterly-review/SKILL.md`
- Examples: See full quarterly review example in SKILL.md
- Questions: Review common questions section
