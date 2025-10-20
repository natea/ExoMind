# Conducting Life Assessment Skill

## Overview

Interactive questionnaire system to assess satisfaction across 10 key life areas, identify priorities, and generate actionable recommendations for improvement. Saves quarterly assessments for tracking progress over time.

## Purpose

This skill helps you:
- Conduct comprehensive life assessments
- Identify which life areas need attention
- Set priorities for personal development
- Track satisfaction over time (quarterly)
- Generate personalized improvement recommendations

## When to Use

- **Quarterly Review**: Start of each quarter (Jan, Apr, Jul, Oct)
- **Feeling Stuck**: When lacking focus or direction
- **Goal Setting**: Before making major decisions or setting new goals
- **Life Transitions**: During major changes in life circumstances
- **Balanced Development**: Ensuring all life areas get attention

## The 10 Life Areas

1. **Health & Fitness** - Physical health, energy, exercise, nutrition, sleep
2. **Personal Growth** - Learning, skills development, self-awareness
3. **Career/Business** - Work satisfaction, professional development, impact
4. **Finances** - Income, savings, investments, financial security
5. **Relationships** - Romantic, family, friendships, social connections
6. **Fun & Recreation** - Hobbies, leisure, play, work-life balance
7. **Physical Environment** - Home, workspace, organization, aesthetics
8. **Contribution/Service** - Giving back, volunteering, community involvement
9. **Spirituality/Meaning** - Purpose, values, beliefs, inner peace
10. **Life Vision** - Long-term goals, dreams, direction, alignment

## Assessment Process

### 1. Introduction (5 minutes)
- Explain the 10 life areas
- Set expectations for honest self-reflection
- Ask context questions about current state

### 2. Area Evaluation (30-40 minutes)
For each of the 10 areas:
- Explain what the area encompasses
- Ask 2-3 reflective questions
- Request rating on 1-10 scale
- Probe deeper: "What would move this to [score + 2]?"
- Capture key insights

### 3. Analysis (10 minutes)
- Calculate overall average score
- Identify top 3 performing areas (strengths)
- Identify bottom 3 areas (priorities)
- Look for patterns and interdependencies

### 4. Recommendations (15-20 minutes)
For each priority area:
- Explain why it matters
- Suggest quick wins (2-3 actions)
- Propose long-term strategies
- Identify how it affects other areas
- Define specific next steps

### 5. Save Assessment (5 minutes)
- Create file: `memory/assessments/YYYY-QN-assessment.md`
- Include all scores, notes, and recommendations
- Set reminder for next quarterly assessment

## Output Format

### Assessment File Structure
```markdown
# Life Assessment - Q1 2025

**Date Completed**: 2025-01-15
**Overall Average**: 7.2/10

## Assessment Scores

| Life Area | Score | Notes |
|-----------|-------|-------|
| Health & Fitness | 8/10 | Regular exercise, good energy |
| Personal Growth | 6/10 | Need more learning time |
...

## Priority Areas (Bottom 3)
1. Personal Growth - 6/10
2. Finances - 6/10
3. Physical Environment - 5/10

## Strengths (Top 3)
1. Relationships - 9/10
2. Health & Fitness - 8/10
3. Contribution - 8/10

## Recommendations & Action Plan
...
```

## Success Metrics

- ✅ All 10 areas assessed with scores and notes
- ✅ Top 3 priorities clearly identified
- ✅ Specific, actionable recommendations provided
- ✅ Assessment saved to correct location
- ✅ User feels motivated and clear about next steps
- ✅ At least 1 concrete action to take immediately

## Integration with Life OS

- **Goal Setting**: Use assessment results to set quarterly goals
- **Weekly Review**: Check progress on priority areas weekly
- **Habit Tracking**: Build habits to improve low-scoring areas
- **Time Blocking**: Allocate time for improvement activities

## Tips for Best Results

1. **Be Honest**: This is for you - raw honesty gets best results
2. **Take Your Time**: Don't rush through the questions
3. **Think Deeply**: Consider each area thoughtfully
4. **Context Matters**: Your scores are personal, not compared to others
5. **Track Progress**: Compare quarterly to see trends
6. **Act on Results**: Pick 1-3 priority areas maximum
7. **Celebrate Wins**: Notice what's working well

## Common Questions

**How often should I do this?**
- Quarterly (every 3 months) is ideal for tracking progress without over-analysis.

**What if everything scores low?**
- That's valuable data! Start with the single lowest area and work up from there.

**Can I change my scores later?**
- These are snapshots in time. Each quarter is a new assessment. Watch trends, not individual scores.

**What's a good overall average?**
- 7.0+ is solid. But what matters more is: are your priority areas improving quarter over quarter?

## Related Skills

- **Goal Setting** (`goal-setting/`) - Set goals based on assessment
- **Weekly Review** (`weekly-review/`) - Track weekly progress on priorities
- **Monthly Review** (`monthly-review/`) - Monthly check-ins on life areas
- **Quarterly Review** (`quarterly-review/`) - Deep dive every 3 months

## Quick Start

```bash
# Run the assessment
Use the skill: "Let's conduct my quarterly life assessment"

# Or specify if it's your first time
Use the skill: "This is my first life assessment"
```

## Support

For detailed instructions, see `SKILL.md` in this directory.

---

**Version**: 1.0
**Last Updated**: 2025-10-20
**Part of**: Life OS Skills Suite
