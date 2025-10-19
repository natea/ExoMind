# Life OS Skills - Implementation Action Plan
## Updated: 2025-10-19

**Based on**: Comprehensive documentation review by hierarchical swarm
**Scope Changes**:
- ✅ Use **WhatsApp MCP** instead of Telegram
- ⏸️ **Pause Google Keep** integration (no official API)

---

## 🎯 Revised Integration Stack

### Core Integrations (Phase 4)
1. **Todoist** - Task management (bidirectional sync)
2. **Gmail** - Email processing (via Google Workspace MCP)
3. **Google Calendar** - Schedule management
4. **WhatsApp** - Mobile capture and notifications (replaces Telegram)
5. **Google Tasks** - Quick capture (replaces Google Keep)

### Rationale for Changes
- **WhatsApp MCP**: More widely used than Telegram, better international reach
- **Google Tasks**: Official Google API vs Keep's unofficial Chrome extension hack
- **Chrome Bookmarks**: Deferred to Phase 5 (optional)

---

## 🚨 Critical Path - Week 0 (DO NOT SKIP)

### Priority 0: Security & Prerequisites
**Duration**: 5-7 days
**Must complete before ANY implementation work**

#### Day 1-2: Security Emergency
**Owner**: Backend developer with security expertise

**Tasks**:
1. ✅ **Revoke exposed OAuth credentials**
   - Google Cloud Console → API & Services → Credentials
   - Revoke client ID: `366028768449-kng73ddo42j3gtdqbvjk2j1p48bnbr0b.apps.googleusercontent.com`
   - Regenerate new credentials

2. ✅ **Remove credentials from version control**
   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch .mcp-composio.json' \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. ✅ **Implement secure credential storage**
   - Create `scripts/keychain-manager.ts` for macOS Keychain integration
   - Add fallback for Linux (libsecret) and Windows (Credential Manager)
   - Update all integration scripts to use keychain

4. ✅ **Remove insecure transport**
   - Delete `OAUTHLIB_INSECURE_TRANSPORT=1` from `.env.example`
   - Update OAuth flows to require HTTPS

5. ✅ **Add `.mcp.json` to `.gitignore`**
   ```gitignore
   # Credentials and secrets
   .mcp.json
   .mcp-*.json
   .env
   .env.local
   credentials.json
   token.json
   ```

6. ✅ **Document secure setup**
   - Create `/docs/security/CREDENTIAL-MANAGEMENT.md`
   - Add security checklist to README

**Deliverable**: Credentials secured, secure storage implemented

---

#### Day 3-5: API Setup (Phase 0)

**Owner**: Backend developer + DevOps

**Todoist API** (Day 3 AM):
1. Register app at https://developer.todoist.com/
2. Get API token
3. Test API connection
4. Document in `.env.example`:
   ```
   TODOIST_API_TOKEN=your_token_here
   ```

**Google Workspace APIs** (Day 3 PM):
1. Create Google Cloud Project
2. Enable APIs:
   - Gmail API
   - Google Calendar API
   - Google Tasks API (replaces Keep)
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials
5. Set redirect URI: `http://localhost:8080/oauth2callback`
6. Download `credentials.json`

**WhatsApp MCP** (Day 4 AM):
1. Check available WhatsApp MCP server
2. Install MCP server:
   ```bash
   npm install @modelcontextprotocol/whatsapp-server
   ```
3. Configure connection
4. Test message sending/receiving
5. Set up webhook server (if needed)

**Environment Setup** (Day 4 PM):
1. Create `.env.example` template:
   ```env
   # Todoist
   TODOIST_API_TOKEN=

   # Google Workspace
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_REDIRECT_URI=http://localhost:8080/oauth2callback

   # WhatsApp MCP
   WHATSAPP_MCP_ENDPOINT=
   WHATSAPP_API_KEY=

   # Memory
   MEMORY_PATH=./memory
   ```

2. Create credential validation script:
   ```bash
   npm run validate:credentials
   ```

**Documentation** (Day 5):
1. Update `/docs/integrations/credential-setup-guide.md`
2. Add WhatsApp MCP setup instructions
3. Remove Telegram and Keep references
4. Create quick start video/guide

**Deliverable**: All APIs registered, credentials configured, validation passing

---

#### Day 5-7: Documentation Fixes

**Owner**: Technical writer

**File Path Corrections** (Day 5 AM):
1. ✅ Fix `/docs/life-os-feature-map.md` Lines 272-306
   - Update directory structure to match actual repository
   - Clarify that `memory/` is user-created
   - Correct GTD subdirectory paths

2. ✅ Fix GTD path references (Lines 53-60, 114-129, 288-295)
   - Standardize on paths from `.cursorrules`
   - Update all cross-references

3. ✅ Fix AI agent configuration (Lines 475-496)
   - Show four separate agent definitions
   - Include actual JSON structure with `identify` fields

**Onboarding Steps** (Day 5 PM):
1. Add to Feature Map (after Line 156):
   ```markdown
   ## Technical Setup Steps
   1. Clone repository
   2. Run `npm install`
   3. Create `memory/` directory structure
   4. Copy `.env.example` to `.env`
   5. Run `npm run setup:credentials`
   6. Run `npm run validate:setup`
   7. Initialize git in `memory/` for version control
   ```

**Integration Updates** (Day 6):
1. Update `/docs/integrations/integration-architecture.md`
   - Replace Telegram with WhatsApp MCP
   - Replace Google Keep with Google Tasks
   - Add WhatsApp webhook architecture
   - Update sequence diagrams

2. Update `/docs/integrations/credential-setup-guide.md`
   - Add WhatsApp MCP section
   - Add Google Tasks section
   - Remove Telegram Bot registration
   - Remove Chrome extension for Keep

3. Update `/docs/integrations/data-flow-diagrams.md`
   - Replace Telegram diagrams with WhatsApp
   - Add Google Tasks flows
   - Update capture workflows

**Plan Updates** (Day 7):
1. Update `/docs/life-os-skills-implementation-plan.md`
   - Add Phase 0 (this week)
   - Extend to 12-week timeline
   - Update Phase 4 integrations:
     - 4.1: Todoist (unchanged)
     - 4.2: Gmail (unchanged)
     - 4.3: Calendar + Tasks (merged schedule + quick capture)
     - 4.4: WhatsApp (replaces 5.1 Telegram)
   - Move Chrome Bookmarks to Phase 5 (optional)

**Deliverable**: All documentation accurate and updated

---

## 📋 Week 1-2: Phase 1 - Foundation (Revised)

### Reduce to 6 Core Skills (YAGNI Principle)

**Owner**: System architect + skill developers

**Day 1-2: Skill 1 - using-life-os**
- Entry point skill (SessionStart hook)
- Introduces available skills
- Provides command reference
- Status**: Simple complexity
- **Effort**: 8-10 hours

**Day 3-4: Skill 2 - conducting-life-assessment**
- 10 life areas evaluation
- Quarterly cadence
- **Status**: Already well-specified
- **Effort**: 12-14 hours (includes templates)

**Day 5-6: Skill 3 - daily-planning**
- Morning routine
- Task prioritization
- Energy management
- **Status**: Already well-specified
- **Effort**: 10-12 hours

**Day 7-8: Skill 4 - weekly-review**
- GTD methodology
- Task cleanup
- Plan adjustment
- **Status**: Already well-specified
- **Effort**: 10-12 hours

**Day 9-10: Skill 5 - goal-setting**
- SMART goals from assessment
- OKR framework
- Milestone tracking
- **Status**: Already well-specified
- **Effort**: 10-12 hours

**Day 11-12: Skill 6 - processing-inbox**
- GTD inbox processing
- Capture → Clarify → Organize
- Quick decisions
- **Status**: NEW - needs specification
- **Effort**: 12-14 hours

**Week 1-2 Deliverable**: 6 core skills implemented and tested

---

## 📋 Week 3-4: Phase 2 - Memory & Templates

**Owner**: Full-stack developer

**Core Templates** (Week 3):
1. `templates/assessment.md`
2. `templates/active-plan.md`
3. `templates/daily-check-in.md`
4. `templates/weekly-review.md`
5. `templates/monthly-review.md`
6. `templates/quarterly-review.md`

**Memory Structure** (Week 3-4):
```
memory/
├── assessments/
│   └── YYYY-QN-assessment.md
├── objectives/
│   ├── active-plans/
│   └── okrs/
├── gtd/
│   ├── inbox.md
│   ├── next-actions.md
│   ├── projects.md
│   ├── waiting.md
│   └── someday.md
├── reviews/
│   ├── daily/
│   ├── weekly/
│   ├── monthly/
│   └── quarterly/
└── reference/
    └── decisions/
```

**Configuration Management**:
- User preferences
- Skill settings
- API credentials (keychain refs)
- Sync state

**Deliverable**: Complete memory system and templates

---

## 📋 Week 5-6: Phase 3 - Review System

**Owner**: Skill developer

**Monthly Review Skill**:
- OKR progress tracking
- Goal adjustment
- Plan refinement
- Links to weekly reviews

**Quarterly Review Skill** (Deferred to Week 11):
- Full life re-assessment
- Major goal pivots
- Annual planning

**Integration with Core Skills**:
- Daily → Weekly aggregation
- Weekly → Monthly aggregation
- Monthly → Quarterly trigger

**Deliverable**: Complete review cycle

---

## 📋 Week 7-9: Phase 4 - External Integrations

### Week 7: Todoist Integration

**Owner**: Backend developer

**Bidirectional Sync**:
1. Import from Todoist (read tasks)
2. Export to Todoist (create/update tasks)
3. Conflict resolution (last-write-wins with user override)
4. Recurring task handling
5. Project mapping (active plans → Todoist projects)

**Webhook Setup**:
- Real-time sync on Todoist changes
- Event processing queue
- Retry logic with exponential backoff

**Testing**:
- Create test Todoist project
- Mock API responses for unit tests
- Integration test suite

**Deliverable**: Todoist fully integrated with bidirectional sync

---

### Week 8: Gmail + Calendar + Tasks Integration

**Owner**: Backend developer + Frontend developer

**Gmail Integration**:
- Use Google Workspace MCP
- Read emails matching filters
- Extract actionable items
- Create tasks from emails
- Track delegation (waiting-for list)

**Calendar Integration + Schedule Analysis** (Merged Skill):
- Fetch calendar events
- Map weekly schedule
- Identify peak energy times
- Block focus time
- Detect conflicts
- Analyze time usage

**Google Tasks** (Quick Capture):
- Replace Google Keep
- Capture thoughts instantly
- Sync to GTD inbox
- Voice note transcription (future)

**OAuth Flow**:
- Implement server-side OAuth
- Token storage in keychain
- Auto-refresh on expiration
- Scope management

**Deliverable**: Gmail, Calendar, and Tasks integrated

---

### Week 9: WhatsApp Integration

**Owner**: Backend developer + Mobile specialist

**WhatsApp MCP Setup**:
1. Configure WhatsApp MCP server
2. Set up webhook receiver
3. Implement command parsing
4. Handle message formatting

**Core Features**:
- Daily briefing messages (morning summary)
- Quick capture via WhatsApp
- Task creation from messages
- Habit check-ins
- Progress notifications

**Commands**:
```
/inbox <item>        - Add to GTD inbox
/task <task>         - Create next action
/done <task>         - Complete task
/review              - Get daily summary
/goals               - View active plans
```

**Testing**:
- Webhook testing with WhatsApp simulator
- Message parsing unit tests
- End-to-end flow testing

**Deliverable**: WhatsApp bot fully functional

---

## 📋 Week 10-11: Phase 5 - Advanced Features

### Week 10: Pattern Detection & Insights

**Owner**: Data scientist / ML engineer

**Pattern Analysis**:
- Task completion patterns
- Energy level trends
- Goal progress velocity
- Time allocation analysis
- Bottleneck identification

**Smart Recommendations**:
- Best time for specific tasks
- Overcommitment warnings
- Goal re-prioritization suggestions
- Energy optimization

**Implementation**:
- Use simple heuristics first (no ML required initially)
- Aggregate review data
- Statistical analysis
- User feedback loop

**Deliverable**: Pattern detection and smart recommendations

---

### Week 11: Habit Tracking & System Coordination

**Owner**: Full-stack developer

**Habit Tracking**:
- Daily habit check-ins (via WhatsApp)
- Streak tracking
- Completion visualization
- Reminder system

**System Coordination Skill**:
- Health check across all integrations
- Sync status monitoring
- Conflict detection
- Auto-repair suggestions
- Backup verification

**Quarterly Review Integration**:
- Trigger from monthly reviews (3-month cadence)
- Full life re-assessment
- Major goal adjustments

**Deliverable**: Habits + system coordination

---

### Week 12: Polish & Validation

**Owner**: QA lead + Product manager

**Testing**:
- Full end-to-end user workflows
- Integration test coverage > 80%
- Performance benchmarks
- Load testing (multiple users)

**Documentation**:
- User guide videos
- Troubleshooting FAQ
- API documentation
- Architecture diagrams

**Onboarding**:
- Setup wizard
- First-run experience
- Sample data seeding
- Interactive tutorials

**Production Readiness**:
- Error monitoring setup
- Logging infrastructure
- Analytics tracking
- Backup automation

**Deliverable**: Production-ready Life OS Skills

---

## 📋 Optional Phase 6: Future Enhancements (Week 13+)

### Lower Priority Integrations
- **Chrome Bookmarks**: Resource library management
- **Notion/Obsidian**: Knowledge base integration
- **Apple Health**: Health metric tracking
- **Finance APIs**: Budget tracking
- **Reading Apps**: Reading list management

### Advanced Features
- **Analytics Dashboard**: Visual progress tracking
- **Decision Journal**: Decision documentation and analysis
- **Team Coordination**: Shared goals and projects
- **Mobile App**: Native iOS/Android clients
- **Voice Assistant**: Alexa/Google Home integration

---

## 🎯 Success Metrics (Updated)

### Functional Metrics
```yaml
Skill Quality:
  - 90%+ acceptance criteria met
  - < 5% error rate in production
  - < 500ms skill load time
  - All APIs respond < 2s

Integration Health:
  - 99%+ API success rate (Todoist, Gmail, Calendar, Tasks, WhatsApp)
  - < 1% sync conflicts
  - Zero data loss incidents
  - < 100ms webhook response time
```

### User Metrics
```yaml
Adoption:
  - 80% complete Phase 1-2 setup within week 1
  - 60% enable at least 2 integrations (Todoist + Gmail/WhatsApp)
  - 40% use WhatsApp bot daily

Engagement:
  - Daily Planning: 70% completion rate
  - Weekly Review: 80% completion rate
  - Monthly Review: 60% completion rate
  - Quarterly Review: 80% completion rate
  - WhatsApp Capture: 50% of inbox items
```

### Integration-Specific Metrics
```yaml
Todoist:
  - Sync success rate: > 99%
  - Sync latency: < 2 seconds
  - Conflict rate: < 1%

Gmail:
  - Email processing: > 95% accuracy
  - Actionable item extraction: > 80% precision
  - False positives: < 5%

WhatsApp:
  - Message delivery: 100%
  - Command recognition: > 95%
  - Response time: < 3 seconds

Calendar:
  - Event fetch: < 1 second
  - Conflict detection: 100% accuracy
  - Timezone handling: Zero errors
```

---

## 🚨 Risk Mitigation (Updated)

### High-Risk Areas

**1. WhatsApp MCP Reliability**
- **Risk**: MCP server downtime or rate limits
- **Mitigation**:
  - Implement message queue for async processing
  - Fallback to email notifications
  - Polling mode if webhook fails
  - Circuit breaker pattern

**2. OAuth Token Expiration**
- **Risk**: Users lose access when tokens expire
- **Mitigation**:
  - Auto-refresh tokens before expiration
  - Graceful re-authentication prompt
  - Token expiry monitoring
  - User notification 24h before expiry

**3. Sync Conflicts**
- **Risk**: Todoist and memory diverge
- **Mitigation**:
  - Last-write-wins with user override option
  - Conflict detection UI
  - Manual resolution workflow
  - Atomic transaction writes

**4. Data Loss**
- **Risk**: Memory files corrupted or deleted
- **Mitigation**:
  - Automatic git commits after changes
  - Daily backup to cloud storage
  - Schema validation before writes
  - Crash recovery mechanism

**5. API Rate Limits**
- **Risk**: Exceed API limits during heavy usage
- **Mitigation**:
  - Redis cache for frequently accessed data
  - Request queuing with priority
  - Exponential backoff on 429 errors
  - User notification on approaching limits

---

## 📊 Revised Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Week 0** | 5-7 days | Security fix, API setup, doc corrections |
| **Week 1-2** | 2 weeks | 6 core skills |
| **Week 3-4** | 2 weeks | Memory system, templates |
| **Week 5-6** | 2 weeks | Review cycle |
| **Week 7** | 1 week | Todoist integration |
| **Week 8** | 1 week | Gmail + Calendar + Tasks |
| **Week 9** | 1 week | WhatsApp bot |
| **Week 10** | 1 week | Pattern detection |
| **Week 11** | 1 week | Habits + system coordination |
| **Week 12** | 1 week | Polish + validation |
| **TOTAL** | **12-13 weeks** | **Production-ready Life OS Skills** |

---

## ✅ Next Immediate Actions

### This Week (Week 0):
1. ✅ **DAY 1-2**: Fix security vulnerability (revoke credentials, keychain storage)
2. ✅ **DAY 3-4**: Register APIs (Todoist, Google Workspace, WhatsApp MCP)
3. ✅ **DAY 5**: Correct documentation (file paths, AI config, onboarding)
4. ✅ **DAY 6**: Update integration docs (WhatsApp, Tasks, remove Telegram/Keep)
5. ✅ **DAY 7**: Revise implementation plan (add Phase 0, extend timeline)

### Next Week (Week 1):
1. Begin Phase 1: Implement `using-life-os` skill
2. Start `conducting-life-assessment` skill
3. Set up testing framework
4. Create CI pipeline

### Week 2:
1. Complete remaining 4 core skills
2. Integration testing
3. Documentation
4. User acceptance testing

---

**Action Plan Created**: 2025-10-19
**Last Updated**: 2025-10-19 (WhatsApp MCP change)
**Status**: Ready for execution
**Next Review**: After Week 0 completion