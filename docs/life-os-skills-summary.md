# Life-OS Claude Skills - Quick Reference

**Total Skills:** 20
**Implementation Status:** Planning Phase
**Integration:** ExoMind, Claude Flow, MCP Tools

---

## Skills by Category

### Assessment (1 skill)
1. **conducting-life-assessment** - Level 10 Life quarterly evaluation

### Planning (4 skills)
2. **planning-from-assessment** - Transform assessment into 90-day plans
9. **managing-life-projects** - Project documentation and breakdown
10. **scheduling-focus-areas** - Time blocking and energy optimization
12. **setting-life-objectives** - OKR creation and tracking

### Tracking (5 skills)
3. **daily-life-check-in** - Morning/evening routines and progress
8. **tracking-delegated-items** - Follow-up on waiting items
13. **building-life-habits** - Habit formation and tracking
14. **managing-life-energy** - Energy pattern optimization
18. **managing-life-health** - Health metrics and wellness

### Task Management (3 skills)
6. **managing-life-tasks** - GTD workflow and Todoist sync
7. **processing-life-inbox** - Capture and processing system
19. **curating-life-knowledge** - Personal knowledge management

### Review (3 skills)
4. **weekly-life-review** - Weekly progress tracking
5. **monthly-life-review** - Monthly plan evaluation
15. **reflecting-on-life-progress** - Deep reflection and insights

### Integration (4 skills)
11. **capturing-life-decisions** - Decision documentation
16. **managing-life-relationships** - Relationship tracking
17. **tracking-life-finances** - Financial goal monitoring
20. **coordinating-life-system** - System health and alignment

---

## Implementation Phases

### ✅ Phase 1: Core Foundation (Week 1-2)
- Skills: 1, 2, 3, 6, 7
- Focus: Assessment → Planning → Execution
- Priority: **CRITICAL**

### ⏳ Phase 2: Review System (Week 3-4)
- Skills: 4, 5, 8, 9, 10
- Focus: Tracking and optimization
- Priority: **HIGH**

### 📋 Phase 3: Enhancement (Week 5-6)
- Skills: 11, 12, 13, 14, 15
- Focus: Depth and insights
- Priority: **MEDIUM**

### 🔮 Phase 4: Advanced Integration (Week 7-8)
- Skills: 16, 17, 18, 19, 20
- Focus: External integrations
- Priority: **FUTURE**

---

## Quick Skill Lookup

| # | Skill Name | Category | Priority | Key Trigger |
|---|------------|----------|----------|-------------|
| 1 | conducting-life-assessment | Assessment | High | "assess", "hi" |
| 2 | planning-from-assessment | Planning | High | After assessment |
| 3 | daily-life-check-in | Tracking | High | Morning/evening |
| 4 | weekly-life-review | Review | High | "review week" |
| 5 | monthly-life-review | Review | High | End of month |
| 6 | managing-life-tasks | Task Mgmt | Critical | "task", "gtd" |
| 7 | processing-life-inbox | Task Mgmt | Critical | "process inbox" |
| 8 | tracking-delegated-items | Tracking | Medium | "waiting for" |
| 9 | managing-life-projects | Planning | High | "plan project" |
| 10 | scheduling-focus-areas | Planning | High | "schedule" |
| 11 | capturing-life-decisions | Integration | Medium | Major decisions |
| 12 | setting-life-objectives | Planning | High | "set goals" |
| 13 | building-life-habits | Tracking | High | Habit formation |
| 14 | managing-life-energy | Tracking | Medium | Energy tracking |
| 15 | reflecting-on-life-progress | Review | Medium | "reflect" |
| 16 | managing-life-relationships | Integration | Medium | Relationships |
| 17 | tracking-life-finances | Integration | Medium | Finances |
| 18 | managing-life-health | Tracking | High | Health goals |
| 19 | curating-life-knowledge | Task Mgmt | Medium | Learning |
| 20 | coordinating-life-system | Integration | High | "status" |

---

## Integration Requirements

### MCP Tools
- **Todoist:** Skills 3, 6, 7, 9 (task management)
- **Gmail:** Skills 7, 8 (inbox processing, follow-up)
- **Calendar:** Skills 3, 8, 10 (scheduling, reminders)
- **Health APIs:** Skills 14, 18 (future - Apple Health/Google Fit)
- **Finance APIs:** Skill 17 (future - Plaid/YNAB)

### Memory Structure
```
memory/
├── assessments/          # Skill 1
├── objectives/
│   └── active-plans/     # Skill 2
├── reviews/
│   ├── weekly/           # Skill 4
│   └── monthly/          # Skill 5
├── gtd/                  # Skills 6, 7, 8, 9
├── decisions/            # Skill 11
├── reference/            # Skill 19
├── schedule.md           # Skill 10
└── system-state.json     # Skill 20
```

### Claude Flow Agents
- `goal-planner` → Skills 2, 12
- `reviewer` → Skills 4, 5, 15
- `task-orchestrator` → Skills 6, 9
- `planner` → Skills 3, 10
- `analyst` → Skill 20

---

## Key Workflows

### 1. Assessment → Planning → Execution
```
conducting-life-assessment (Skill 1)
    ↓
planning-from-assessment (Skill 2)
    ↓
daily-life-check-in (Skill 3)
    ↓
managing-life-tasks (Skill 6)
```

### 2. Capture → Process → Execute
```
Quick Capture (multiple sources)
    ↓
processing-life-inbox (Skill 7)
    ↓
managing-life-tasks (Skill 6)
    ↓
tracking-delegated-items (Skill 8)
```

### 3. Track → Review → Adjust
```
daily-life-check-in (Skill 3)
    ↓
weekly-life-review (Skill 4)
    ↓
monthly-life-review (Skill 5)
    ↓
conducting-life-assessment (Skill 1)
```

---

## Success Metrics

### Phase 1 Success (Core Foundation)
- [ ] User completes initial life assessment
- [ ] 3 active plans created from assessment
- [ ] Daily check-ins happening consistently
- [ ] Tasks syncing with Todoist successfully
- [ ] Inbox reaching zero regularly

### Phase 2 Success (Review System)
- [ ] Weekly reviews completed on schedule
- [ ] Monthly reviews show measurable progress
- [ ] Projects tracked and updated
- [ ] Schedule optimized for energy patterns
- [ ] User reports improved focus

### Phase 3 Success (Enhancement)
- [ ] Major decisions documented
- [ ] OKRs tracked and progressing
- [ ] Habits forming consistently
- [ ] Energy patterns understood
- [ ] Regular reflection insights captured

### Phase 4 Success (Advanced Integration)
- [ ] All life areas actively managed
- [ ] External tools integrated
- [ ] System health monitored
- [ ] Knowledge base growing
- [ ] System requires minimal maintenance

---

## Migration from Cursor

### Before (Cursor .cursorrules)
- 4 hard-coded rules
- Limited flexibility
- Manual trigger detection
- No coordination with other tools

### After (Claude Code Skills)
- 20 systematic skills
- Dynamic and composable
- Automatic trigger detection
- Full MCP and Claude Flow integration
- TodoWrite batch operations
- Memory system coordination

---

## Next Steps

1. **Review** this specification with team
2. **Prioritize** based on immediate user needs
3. **Implement** Phase 1 skills (5 skills)
4. **Test** with real users
5. **Iterate** based on feedback
6. **Expand** to Phases 2-4

---

## Resources

- **Full Specification:** `docs/life-os-claude-skills-mapping.md`
- **Life-OS Source:** `modules/life-os/`
- **Templates:** `modules/life-os/templates/`
- **Superpowers:** `modules/superpowers/`
- **Claude Flow:** `npx claude-flow@alpha`

---

**Status:** 📋 Planning Phase
**Last Updated:** 2025-10-19
**Next Review:** After Phase 1 Implementation
