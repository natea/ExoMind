# Getting Started with Life OS

Welcome to Life OS! This guide will help you get started with your personal operating system for life management.

## What is Life OS?

Life OS is a comprehensive life management system that helps you:
- Track your daily activities and habits
- Conduct regular life assessments
- Set and achieve meaningful goals
- Process your inbox efficiently
- Perform weekly and monthly reviews
- Plan your days and weeks intentionally

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Text editor or IDE
- Active email and calendar accounts (for integrations)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ExoMind.git
cd ExoMind
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Required
NODE_ENV=development

# Optional Integrations
TODOIST_API_TOKEN=your_todoist_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
WHATSAPP_MCP_ENABLED=true
```

### 4. Initialize Your Life OS

Run the initialization command:

```bash
npm run life-os:init
```

This will:
- Create your user profile
- Set up initial directories
- Initialize your assessment history
- Configure default settings

## Your First Steps

### 1. Conduct Your First Assessment

Understanding where you are is the first step to improvement.

```bash
npm run life-os:assess
```

This interactive assessment covers:
- **Health & Fitness**: Physical wellbeing, exercise, nutrition
- **Career & Work**: Job satisfaction, skills, growth
- **Relationships**: Family, friends, romantic relationships
- **Personal Growth**: Learning, hobbies, self-improvement
- **Financial Health**: Income, savings, debt management
- **Life Balance**: Time management, stress levels
- **Environment**: Living space, community
- **Purpose & Meaning**: Life goals, values alignment

**Tips for Your First Assessment:**
- Be honest with yourself
- Don't aim for perfection
- Focus on current reality, not ideals
- Rate on a scale of 1-10
- Add notes for context
- This is your baseline - you'll see progress over time

**Time Required:** 15-20 minutes

### 2. Create Your First Daily Log

Track your day and build awareness.

```bash
npm run life-os:daily
```

Daily logging includes:
- Morning routine setup
- Daily goals (3 max)
- Time block planning
- Energy level tracking
- Evening reflection
- Gratitude practice
- Tomorrow's preparation

**Best Practices:**
- Log in the morning to plan
- Log in the evening to reflect
- Keep it simple at first
- Be consistent over detailed
- Review weekly patterns

**Time Required:** 5-10 minutes (morning + evening)

### 3. Process Your Inbox

Clear mental clutter by capturing everything.

```bash
npm run life-os:inbox
```

The inbox is for:
- Quick thoughts and ideas
- Tasks to process later
- Things you don't want to forget
- Input from various sources

**Processing Workflow:**
1. Capture everything without judgment
2. Process regularly (daily or weekly)
3. Decide: Do, Defer, Delegate, or Delete
4. Convert to tasks, projects, or reference

**Time Required:** 5-15 minutes

### 4. Your First Weekly Review

Every Sunday (or your chosen day), reflect and plan.

```bash
npm run life-os:weekly
```

Weekly review covers:
- Last week's accomplishments
- Incomplete tasks and why
- Upcoming week's priorities
- Calendar review
- Goal progress check
- Assessment updates
- Next week planning

**Tips:**
- Schedule a specific time
- Find a quiet space
- Have your calendar ready
- Be thorough but not perfectionist
- Celebrate wins
- Learn from challenges

**Time Required:** 30-45 minutes

## Quick Start Checklist

Use this checklist for your first week:

**Day 1:**
- [ ] Install Life OS
- [ ] Configure environment
- [ ] Complete first assessment
- [ ] Create user profile

**Day 2-3:**
- [ ] Morning daily log
- [ ] Evening reflection
- [ ] Add items to inbox
- [ ] Explore skills reference

**Day 4-5:**
- [ ] Continue daily logging
- [ ] Process inbox items
- [ ] Set 1-3 weekly goals
- [ ] Review getting-started guide

**Day 6-7:**
- [ ] Complete first weekly review
- [ ] Plan next week
- [ ] Update assessment if needed
- [ ] Set up integrations (optional)

## Understanding the Workflow

Life OS follows a hierarchical workflow:

```
Daily Logs → Weekly Reviews → Monthly Reviews → Quarterly Planning → Annual Review
     ↓            ↓                  ↓                   ↓                ↓
 Habits      Adjustments        Course         Strategic         Major
 & Tasks     & Planning       Correction       Planning        Decisions
```

### Daily (5-10 min)
- Morning planning
- Evening reflection
- Quick inbox capture

### Weekly (30-45 min)
- Review past week
- Process inbox
- Plan next week
- Update goals

### Monthly (1-2 hours)
- Month in review
- Goal progress
- Mini-assessment
- Next month planning

### Quarterly (2-3 hours)
- Full assessment
- Goal setting
- Strategic planning
- Life adjustments

## Common First-Time Challenges

### "I don't have time for this"

Start with just 5 minutes of daily logging. The time you invest in planning saves multiples in execution.

### "I don't know what to write"

Use the prompts! Every skill has built-in questions and templates. Just answer them honestly.

### "I'm not consistent"

That's normal. Life OS tracks your patterns and helps you build habits gradually. Missing a day is fine - just resume tomorrow.

### "My scores are low"

Good! That means you're being honest. The first assessment is your baseline. You'll improve over time.

### "There's too much to learn"

Start with daily logs only. Add weekly reviews after a week. Add other features as you're ready. Build gradually.

## Next Steps

Once you're comfortable with the basics:

1. **Explore Skills**: Check out all available skills in [Skills Reference](./skills-reference.md)
2. **Set Up Integrations**: Connect Todoist, Google, WhatsApp in [Integration Guide](./integration-guide.md)
3. **Learn Workflows**: Discover common workflows in [Workflows Guide](./workflows.md)
4. **Advanced Features**: Explore pattern detection and automation in [Advanced Guide](./advanced.md)

## Getting Help

- **FAQ**: Check [Frequently Asked Questions](./faq.md)
- **Skills Reference**: See [Skills Reference](./skills-reference.md)
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Explore `/docs` directory

## Philosophy

Life OS is based on these principles:

1. **Awareness**: You can't improve what you don't measure
2. **Intention**: Plan your life or someone else will
3. **Reflection**: Learning comes from reviewing experience
4. **Iteration**: Small, consistent improvements compound
5. **Balance**: All life areas deserve attention
6. **Flexibility**: Systems serve you, not vice versa

## Welcome to Your Life OS!

You're now ready to take control of your life with intention and clarity. Remember:

- Start small and build gradually
- Consistency beats intensity
- Progress, not perfection
- This is YOUR system - customize it

Ready to dive deeper? Continue to the [Skills Reference](./skills-reference.md) to explore all available features.
