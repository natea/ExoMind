# Week 0 Day 5-7 Documentation Fix Checklist

**Review Date**: 2025-10-19
**Priority**: High
**Total Estimated Time**: 3-4 hours

---

## Overview

This checklist addresses documentation inconsistencies identified in the code review. All fixes ensure alignment with the current action plan scope (Todoist, Gmail, Calendar only, with WhatsApp using existing MCP).

---

## File 1: `/docs/life-os-feature-map.md`

**Total Items**: 4 sections
**Estimated Time**: 90 minutes
**Priority Order**: High → Medium → High → High

### Fix 1.1: Correct Directory Structure (Lines 272-306)
**Priority**: High
**Estimated Time**: 20 minutes
**Location**: Lines 272-306

**Current Issue**:
Directory structure shows old paths inconsistent with actual implementation.

**Required Changes**:
```diff
- modules/life-os/
+ /Users/nateaune/Documents/code/ExoMind/modules/life-os/
```

**Specific Line-by-Line Fixes**:
- **Line 273**: Change `modules/life-os/` to `/Users/nateaune/Documents/code/ExoMind/modules/life-os/`
- **Line 274**: Add comment `# Template files (source of truth)`
- **Line 283**: Add comment `# Integration TypeScript files`
- **Line 286**: Change `memory/` to `memory/ (git-ignored, user data)`
- **Line 287**: Add note `# Life area evaluations (quarterly)`
- **Line 288**: Change `gtd/` to `gtd/ # GTD task management files`
- **Lines 289-294**: Keep structure but add inline comments for clarity
- **Line 301**: Add `├── reviews/ # Daily/weekly/monthly reviews`
- **Line 302**: Update to `├── README.md # User documentation (public)`
- **Line 303**: Update to `├── MEMORY.md # System docs (private)`
- **Line 304**: Update to `├── .cursorrules # AI agent rules`
- **Line 305**: Update to `├── .env.example # Config template`
- **Line 306**: Update to `└── package.json # Dependencies & scripts`

**Acceptance Criteria**:
- [ ] All paths are absolute from project root
- [ ] Inline comments explain purpose of each directory
- [ ] User data (memory/) clearly marked as git-ignored
- [ ] Template vs. user data distinction is clear

---

### Fix 1.2: Update GTD File Paths (Lines 53-60, 114-129)
**Priority**: Medium
**Estimated Time**: 15 minutes
**Locations**: Lines 53-60 AND Lines 114-129

**Current Issue**:
References to GTD files don't use absolute paths consistently.

**Section 1 - Lines 53-60**:
```diff
- memory/gtd/inbox.md
+ /Users/nateaune/Documents/code/ExoMind/modules/life-os/memory/gtd/inbox.md

- memory/gtd/projects.md
+ /Users/nateaune/Documents/code/ExoMind/modules/life-os/memory/gtd/projects.md

- memory/gtd/next-actions.md
+ /Users/nateaune/Documents/code/ExoMind/modules/life-os/memory/gtd/next-actions.md

- memory/gtd/upcoming.md
+ /Users/nateaune/Documents/code/ExoMind/modules/life-os/memory/gtd/upcoming.md

- memory/gtd/waiting.md
+ /Users/nateaune/Documents/code/ExoMind/modules/life-os/memory/gtd/waiting.md

- memory/gtd/completed.md
+ /Users/nateaune/Documents/code/ExoMind/modules/life-os/memory/gtd/completed.md
```

**Section 2 - Lines 114-129** (in Review Cycles section):
Same pattern - update all GTD file references to absolute paths.

**Acceptance Criteria**:
- [ ] All GTD file paths are absolute
- [ ] Both sections (lines 53-60 and 114-129) are updated
- [ ] Paths are consistent throughout document

---

### Fix 1.3: Simplify AI Agent Configuration (Lines 475-496)
**Priority**: High
**Estimated Time**: 25 minutes
**Location**: Lines 475-496

**Current Issue**:
Agent configuration section references complex multi-agent setups not in current scope.

**Required Changes**:
```diff
 ### 3.6 Configuration Data (.cursorrules)
-```json
-{
-  "rules": [
-    {
-      "name": "Task Manager | Life Coach | Memory Keeper | Activity Tracker",
-      "triggers": array[string],
-      "responsibilities": array[string],
-      "config": object
-    }
-  ],
-  "commands": {
-    "scripts": object,  // npm run commands
-    "files": object     // File access shortcuts
-  },
-  "user": {
-    "configFile": ".cursor-user",
-    "structure": object,
-    "onboarding": object
-  },
-  "defaults": object
-}
-```
+```yaml
+# .cursorrules - AI Agent Configuration
+# Location: /Users/nateaune/Documents/code/ExoMind/modules/life-os/.cursorrules
+
+agents:
+  - name: "Task Manager"
+    triggers: ["task", "gtd", "inbox", "sync"]
+    integrations: ["todoist", "gmail"]
+
+  - name: "Life Coach"
+    triggers: ["assess", "review", "goals"]
+    integrations: ["calendar"]
+
+  - name: "Memory Keeper"
+    triggers: ["memory", "reference", "status"]
+    integrations: []
+
+commands:
+  scripts:
+    - "npm run todoist import"
+    - "npm run todoist export"
+    - "npm run email:list"
+
+  files:
+    inbox: "memory/gtd/inbox.md"
+    projects: "memory/gtd/projects.md"
+    schedule: "memory/schedule.md"
+
+integrations:
+  todoist:
+    enabled: true
+    token_location: ".env (TODOIST_API_TOKEN)"
+
+  gmail:
+    enabled: true
+    auth_method: "OAuth 2.0"
+    scopes: ["gmail.readonly"]
+
+  calendar:
+    enabled: false  # Future implementation
+
+  whatsapp:
+    enabled: false
+    method: "Uses existing Google Workspace MCP"
+    note: "Not part of Week 0-1 scope"
+```
```

**Acceptance Criteria**:
- [ ] Configuration is in YAML format (simpler than JSON)
- [ ] Only includes 3 core agents (Task Manager, Life Coach, Memory Keeper)
- [ ] Only shows integrations in current scope (Todoist, Gmail, Calendar)
- [ ] WhatsApp explicitly marked as future/MCP-based
- [ ] Includes file paths and command examples
- [ ] Includes absolute path reference in comment

---

### Fix 1.4: Add Technical Setup Steps (After Line 156)
**Priority**: High
**Estimated Time**: 30 minutes
**Location**: Insert after Line 156 (in Onboarding Workflow section)

**Current Issue**:
Onboarding workflow jumps from "Setup external integrations" to practice without technical details.

**Required Addition**:
Insert complete new section after line 156:

```markdown
### 2.1.1 Technical Setup Details

**Step 6 Expanded: External Integration Setup**

#### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git installed and configured
- Cursor editor installed

#### A. Todoist API Setup (15 minutes)
1. **Get API Token**:
   - Visit https://todoist.com/app/settings/integrations
   - Scroll to "Developer" section
   - Copy "API token"

2. **Configure Environment**:
   ```bash
   cd /Users/nateaune/Documents/code/ExoMind/modules/life-os
   cp .env.example .env
   nano .env  # or use your preferred editor
   ```

3. **Add Token**:
   ```bash
   TODOIST_API_TOKEN=your_token_here
   ```

4. **Test Connection**:
   ```bash
   npm install
   npm run todoist import
   ```

5. **Verify**:
   - Should see: "✅ Imported X tasks from Todoist"
   - Check file: `memory/tasks/todoist.yml` (should exist)

#### B. Gmail API Setup (20 minutes)
1. **Enable Gmail API**:
   - Visit https://console.cloud.google.com/
   - Create new project: "Life-OS"
   - Enable Gmail API
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "Desktop app"
   - Name: "Life-OS Gmail Integration"

2. **Download Credentials**:
   - Click "Download JSON"
   - Save as: `modules/life-os/scripts/credentials.json`

3. **First-Time Authorization**:
   ```bash
   npm run email:list
   ```
   - Browser will open for authorization
   - Select your Google account
   - Click "Allow"
   - Token saved to: `scripts/token.json`

4. **Verify**:
   - Should see list of recent emails
   - Check file: `scripts/token.json` (should exist)

#### C. Google Calendar Setup (Future - Not Week 0)
**Status**: Deferred to Week 2+
**Note**: Uses same Google Cloud project as Gmail
**Setup**: Run when implementing Phase 4.3 (Calendar Integration Skill)

#### D. WhatsApp Integration (Uses Existing MCP)
**Status**: Not part of custom development
**Method**: Leverages existing Google Workspace MCP server
**Documentation**: See `/docs/integrations/integration-architecture.md`
**Note**: No additional setup required for basic functionality

#### E. Verification Checklist
After setup, verify all integrations:

```bash
# Check environment variables
cat .env | grep "API_TOKEN"
# Should show: TODOIST_API_TOKEN=xxxxx

# Check Todoist connection
npm run todoist import
# Should import without errors

# Check Gmail connection
npm run email:list
# Should list recent emails

# Check file structure
ls -la memory/gtd/
# Should show: inbox.md, projects.md, next-actions.md, etc.

# Check git ignore
git status
# Should NOT show .env, token.json, credentials.json, memory/
```

#### F. Troubleshooting

**Todoist Import Fails**:
- Error: `401 Unauthorized`
  - Solution: Regenerate API token in Todoist settings
- Error: `503 Service Unavailable`
  - Solution: Wait 60 seconds and retry (Todoist rate limit)

**Gmail Authorization Fails**:
- Error: `redirect_uri_mismatch`
  - Solution: Add `http://localhost:3000/auth/google/callback` to authorized redirects
- Error: `invalid_client`
  - Solution: Re-download credentials.json from Google Cloud Console

**Missing Dependencies**:
```bash
npm install
# Installs: @doist/todoist-api-typescript, googleapis, dotenv, yaml
```

**File Permission Issues**:
```bash
chmod 600 .env
chmod 600 scripts/token.json
chmod 600 scripts/credentials.json
```

#### G. Security Best Practices
- ✅ `.env` is git-ignored (never commit API tokens)
- ✅ `token.json` is git-ignored (contains OAuth refresh token)
- ✅ `credentials.json` is git-ignored (contains OAuth client secret)
- ✅ `memory/` directory is git-ignored (contains personal data)
- ⚠️  Use separate git repository for personal memory data
- ⚠️  Enable 2FA on all connected accounts
- ⚠️  Review OAuth permissions periodically

**Next Step**: Proceed to Step 7 (First Daily Practice Session)
```

**Acceptance Criteria**:
- [ ] Complete step-by-step setup for each integration
- [ ] Includes exact commands to run
- [ ] Provides troubleshooting for common errors
- [ ] Links to external documentation
- [ ] Security best practices included
- [ ] Verification checklist provided
- [ ] WhatsApp explicitly marked as MCP-based (no custom setup)
- [ ] Calendar marked as future implementation

---

## File 2: `/docs/integrations/integration-architecture.md`

**Total Items**: 3 sections
**Estimated Time**: 45 minutes
**Priority Order**: High → Medium → High

### Fix 2.1: Remove Google Tasks References
**Priority**: High
**Estimated Time**: 20 minutes
**Location**: Lines 306-351 (entire section 3)

**Current Issue**:
Section 3 "Google Keep Integration" discusses Google Tasks API as alternative, but this is out of scope.

**Required Changes**:
1. **DELETE** entire "Option B: Google Tasks API (Alternative)" subsection (approx lines 322-327)
2. **UPDATE** section introduction (lines 306-310):

```diff
 ## 3. Google Keep Integration

 ### Purpose
 Quick capture, notes, and idea management.

+**IMPORTANT**: Google Keep has no official API. This integration is **deferred to Phase 5** (Week 5+) pending evaluation of unofficial libraries.
+
+**Week 0-1 Scope**: NOT INCLUDED. Use Todoist for task capture instead.

 ### Available Integration Methods

 #### Limitation: No Official API
-Google Keep does not provide an official public API. Integration options:
+Google Keep does not provide an official public API.

-#### Option A: Unofficial Python Library (Keep API)
+#### Future Option A: Unofficial Python Library (Keep API)
+**Status**: Under evaluation
+**Risk**: High (unofficial, may break)
 ```bash
 pip install keep
 # Use with caution - not officially supported
 ```

-#### Option B: Google Tasks API (Alternative)
-```bash
-# Use Google Tasks as Keep alternative
-# Official API with similar functionality
-```
-
-#### Option C: Chrome Extension Bridge (Recommended)
+#### Future Option B: Chrome Extension Bridge
+**Status**: Potential Week 5+ implementation
 - Develop Chrome extension to capture Keep notes
 - Extension posts to local webhook
 - Webhook forwards to Claude Skills
```

3. **ADD** disclaimer at top of section:

```markdown
> ⚠️ **Week 0-1 Status**: This integration is NOT part of the initial implementation.
> Use **Todoist** for quick capture in Week 0-1.
> Google Keep integration will be evaluated in Phase 5 (Week 5+).
```

**Acceptance Criteria**:
- [ ] Google Tasks API section completely removed
- [ ] "Week 0-1 Status" warning added at top
- [ ] All subsections marked as "Future" or "Under Evaluation"
- [ ] Clear guidance to use Todoist instead
- [ ] Risk assessment included for unofficial library

---

### Fix 2.2: Simplify WhatsApp Section
**Priority**: Medium
**Estimated Time**: 15 minutes
**Location**: Search for "WhatsApp" (likely not in current file, but check)

**Current Issue**:
If WhatsApp is mentioned, it should reference existing MCP only.

**Required Action**:
1. Search document for "WhatsApp" or "Telegram" (they may be confused)
2. If found, replace entire section with:

```markdown
## X. WhatsApp Integration (Via Existing MCP)

### Purpose
Mobile messaging and notifications (uses existing infrastructure).

### Implementation Method
**Status**: Uses Google Workspace MCP server (already available)
**No Custom Development Required**

WhatsApp integration is handled through the existing Google Workspace MCP server, which provides:
- Message sending capabilities
- Notification delivery
- Read-only message access (if configured)

### Configuration
No custom integration code needed. See Google Workspace MCP documentation:
- MCP Server: `mcp__google-workspace`
- Required tools: Already installed
- Authentication: Via existing Google Workspace OAuth

### Week 0-1 Scope
**Not included** in initial implementation. Available as future enhancement using existing MCP tools.

**Alternative**: Use **Telegram Bot** (see Section 5) for mobile messaging in Week 5+.
```

**Acceptance Criteria**:
- [ ] WhatsApp clearly marked as MCP-based
- [ ] No custom code implementation described
- [ ] References existing Google Workspace MCP
- [ ] Notes deferred status (not Week 0-1)
- [ ] Suggests Telegram as alternative for mobile messaging

---

### Fix 2.3: Validate Integration Scope
**Priority**: High
**Estimated Time**: 10 minutes
**Location**: Lines 1-15 (Overview section)

**Current Issue**:
Overview may list integrations not in current scope.

**Required Changes**:
Update overview to reflect ONLY current scope:

```diff
 # Life-OS External Tool Integration Architecture

 ## Overview

-This document outlines the integration patterns for connecting Claude Skills with external productivity tools in the life-os ecosystem. Each integration prioritizes security, reliability, and seamless data synchronization.
+This document outlines the integration patterns for connecting Claude Skills with external productivity tools in the life-os ecosystem.
+
+**Current Implementation Scope (Week 0-1)**:
+- ✅ **Todoist** - Task management (critical path)
+- ✅ **Gmail** - Email processing (high priority)
+- ⏳ **Google Calendar** - Scheduling (Week 2+)
+
+**Deferred Integrations**:
+- ⏸️ **Google Keep** - Quick capture (Week 5+, unofficial API concerns)
+- ⏸️ **Chrome Bookmarks** - Resource management (Week 4+)
+- ⏸️ **Telegram Bot** - Mobile interface (Week 5+)
+- ⏸️ **WhatsApp** - Uses existing Google Workspace MCP (no custom code)
+
+**Integration Priorities**:
+Each integration prioritizes security, reliability, and seamless data synchronization.

+**Document Status**: Updated 2025-10-19 to reflect current action plan scope
```

**Acceptance Criteria**:
- [ ] Overview lists only Todoist and Gmail as current scope
- [ ] Calendar marked as Week 2+
- [ ] All other integrations clearly marked as deferred
- [ ] WhatsApp noted as MCP-based (no custom work)
- [ ] Document update timestamp added

---

## File 3: `/docs/life-os-skills-implementation-plan.md`

**Total Items**: 3 sections
**Estimated Time**: 60 minutes
**Priority Order**: High → High → High

### Fix 3.1: Update Implementation Scope (Lines 1-21)
**Priority**: High
**Estimated Time**: 15 minutes
**Location**: Lines 1-21 (Overview and Architectural Principles)

**Current Issue**:
Overview doesn't match current 6-week phased action plan.

**Required Changes**:

```diff
 # Life OS Skills Implementation Plan

 ## Overview

-This plan outlines the systematic creation of Claude Code skills for the Life OS personal productivity system. The implementation follows a phased approach, building foundational skills first and progressively adding more advanced capabilities.
+This plan outlines the systematic creation of Claude Code skills for the Life OS personal productivity system.
+
+**Implementation Timeline**: 6-week phased approach (Week 0 = Days 1-7)
+**Current Status**: Week 0 Days 5-7 (Documentation Phase)
+
+**Week 0 Deliverables**:
+- Days 1-4: Foundation planning and architecture
+- Days 5-7: Documentation fixes and validation
+- Days 8-14: Core implementation (Todoist + Gmail)
+
+**Scope Prioritization**:
+This implementation follows a **critical path** approach:
+1. **Week 0-1**: Todoist + Gmail integrations (must-have)
+2. **Week 2+**: Google Calendar integration (should-have)
+3. **Week 4+**: Chrome Bookmarks (nice-to-have)
+4. **Week 5+**: Advanced features (Telegram, Pattern Detection)

 ## Architectural Principles
```

**Acceptance Criteria**:
- [ ] Current week status clearly stated
- [ ] 6-week timeline referenced
- [ ] Week 0 deliverables listed
- [ ] Scope prioritization explained (critical path)
- [ ] Deferred features identified

---

### Fix 3.2: Remove Google Tasks from Phase 4 (Lines 374-443)
**Priority**: High
**Estimated Time**: 25 minutes
**Location**: Lines 374-443 (Phase 4: Integration Skills)

**Current Issue**:
Section 4.2 "Gmail Integration Skill" may reference Google Tasks. Section should focus only on Gmail API.

**Required Changes**:

1. **Review Section 4.2** (Gmail Integration Skill):
   - Remove any mention of "Google Tasks"
   - Keep only Gmail-specific features

2. **Update Features List** (around lines 420-427):

```diff
 **Key Features**:
 - Check unread email count
 - Search emails by criteria
 - Create tasks from emails
 - Archive processed emails
 - Track follow-ups
-- Email to waiting list
+- Add email follow-ups to GTD waiting list
+- Extract actionable items from email body
+- Link emails to Todoist tasks
```

3. **Update Acceptance Criteria** (around lines 432-439):

```diff
 **Acceptance Criteria**:
 - ✅ Reads unread count
 - ✅ Searches by sender/subject
-- ✅ Creates tasks from emails
+- ✅ Creates Todoist tasks from emails
 - ✅ Adds to waiting list
 - ✅ Archives emails
 - ✅ Handles API authentication
+- ✅ Uses Google Workspace MCP server
+- ⏸️ No Google Tasks integration (out of scope)
```

4. **Update Example Usage**:

```diff
 **Example Usage**:
 ```
 "Check my email inbox"
-"Create task from email about project"
+"Create Todoist task from this email"
 "Show emails from this week"
+"Add sender to waiting list"
 ```
```

**Acceptance Criteria**:
- [ ] No mention of Google Tasks API
- [ ] Gmail integration focuses on email processing only
- [ ] Task creation goes through Todoist
- [ ] Google Workspace MCP referenced
- [ ] Examples show Todoist integration

---

### Fix 3.3: Simplify WhatsApp/Telegram Section (Lines 515-554)
**Priority**: High
**Estimated Time**: 20 minutes
**Location**: Lines 515-554 (Section 5.1 Telegram Bot Skill)

**Current Issue**:
Telegram section may be confused with WhatsApp or overly detailed for Week 5+ feature.

**Required Changes**:

1. **Rename Section** if needed:
```diff
-### 5.1 Telegram Bot Skill
+### 5.1 Mobile Messaging Integration (Telegram Bot)
```

2. **Add Status Header**:
```markdown
**Implementation Phase**: Week 5+ (Advanced Features)
**Priority**: Medium (after core integrations complete)
**Complexity**: Complex
**Dependencies**: All Phase 4 skills (4.1, 4.2, 4.3)

> ⚠️ **Note**: This skill is deferred to Week 5+. For Week 0-1, mobile capture uses **Todoist mobile app** directly.
```

3. **Add WhatsApp Clarification** (if WhatsApp is mentioned anywhere):
```markdown
### WhatsApp vs. Telegram

**WhatsApp Integration**:
- **Method**: Via existing Google Workspace MCP server
- **Status**: No custom development required
- **Scope**: Not part of this skill implementation
- **Use Case**: Notification delivery only (via MCP)

**Telegram Integration** (This Skill):
- **Method**: Custom bot using Telegram Bot API
- **Status**: Week 5+ implementation
- **Scope**: Full bidirectional messaging and commands
- **Use Case**: Complete mobile interface for Life OS

**Week 0-1 Recommendation**: Use Todoist mobile app for task capture.
```

4. **Update Description** (around line 520):
```diff
 **Description**:
-Telegram bot for mobile capture, briefings, and habit tracking.
+Custom Telegram bot for comprehensive mobile interface to Life OS.
+
+**Week 0-1 Alternative**: Use Todoist mobile app for quick capture.
+**Week 5+ Feature**: Full mobile command interface via Telegram.
```

**Acceptance Criteria**:
- [ ] Clear separation: WhatsApp (MCP-based) vs. Telegram (custom bot)
- [ ] Week 5+ status prominently displayed
- [ ] Week 0-1 alternative provided (Todoist mobile app)
- [ ] No confusion between messaging platforms
- [ ] Dependencies clearly listed

---

## Summary Checklist

### File 1: life-os-feature-map.md (90 min)
- [ ] 1.1: Directory structure uses absolute paths (20 min)
- [ ] 1.2: GTD file paths are absolute (15 min)
- [ ] 1.3: Agent config simplified to scope (25 min)
- [ ] 1.4: Technical setup steps added (30 min)

### File 2: integration-architecture.md (45 min)
- [ ] 2.1: Google Tasks references removed (20 min)
- [ ] 2.2: WhatsApp simplified to MCP (15 min)
- [ ] 2.3: Overview scope validated (10 min)

### File 3: life-os-skills-implementation-plan.md (60 min)
- [ ] 3.1: Implementation scope updated (15 min)
- [ ] 3.2: Google Tasks removed from Phase 4 (25 min)
- [ ] 3.3: WhatsApp/Telegram clarified (20 min)

---

## Validation Checklist

After completing all fixes, verify:

### Consistency Checks
- [ ] All file paths are absolute (no relative paths)
- [ ] Directory structure matches across all 3 files
- [ ] GTD file references are identical in all locations
- [ ] Integration scope matches action plan (Todoist, Gmail, Calendar)

### Scope Accuracy
- [ ] Google Tasks NOT mentioned anywhere
- [ ] WhatsApp clearly marked as MCP-based (no custom code)
- [ ] Google Keep marked as Week 5+ / deferred
- [ ] Telegram marked as Week 5+ / deferred
- [ ] Calendar marked as Week 2+ (not Week 0-1)

### Technical Accuracy
- [ ] API setup instructions are complete and testable
- [ ] Environment variable names match `.env.example`
- [ ] File paths match actual project structure
- [ ] npm commands match `package.json` scripts

### User Experience
- [ ] Onboarding steps are sequential and clear
- [ ] Troubleshooting sections address common errors
- [ ] Security best practices are highlighted
- [ ] Week 0-1 alternatives provided for deferred features

---

## Time Breakdown

| Task | Estimated Time | Priority |
|------|---------------|----------|
| File 1 - Fix 1.1 | 20 min | High |
| File 1 - Fix 1.2 | 15 min | Medium |
| File 1 - Fix 1.3 | 25 min | High |
| File 1 - Fix 1.4 | 30 min | High |
| File 2 - Fix 2.1 | 20 min | High |
| File 2 - Fix 2.2 | 15 min | Medium |
| File 2 - Fix 2.3 | 10 min | High |
| File 3 - Fix 3.1 | 15 min | High |
| File 3 - Fix 3.2 | 25 min | High |
| File 3 - Fix 3.3 | 20 min | High |
| **Total** | **195 min (3h 15min)** | |

---

## Recommended Order of Execution

### Session 1: High Priority Path Fixes (90 min)
1. File 1 - Fix 1.1: Directory structure (20 min)
2. File 1 - Fix 1.3: Agent config (25 min)
3. File 1 - Fix 1.4: Technical setup (30 min)
4. File 3 - Fix 3.1: Scope update (15 min)

### Session 2: Integration Scope Cleanup (70 min)
1. File 2 - Fix 2.1: Remove Google Tasks (20 min)
2. File 2 - Fix 2.3: Validate overview (10 min)
3. File 3 - Fix 3.2: Gmail integration cleanup (25 min)
4. File 3 - Fix 3.3: WhatsApp/Telegram clarity (20 min)

### Session 3: Final Polish (35 min)
1. File 1 - Fix 1.2: GTD paths (15 min)
2. File 2 - Fix 2.2: WhatsApp simplification (15 min)
3. **Validation**: Run all consistency checks (5 min)

---

## TodoWrite Format (For Task Tool)

```json
{
  "todos": [
    {
      "id": "fix-1.1",
      "content": "Fix directory structure in life-os-feature-map.md (lines 272-306)",
      "status": "pending",
      "activeForm": "Fixing directory structure paths",
      "priority": "high",
      "estimatedMinutes": 20,
      "file": "/docs/life-os-feature-map.md",
      "lines": "272-306"
    },
    {
      "id": "fix-1.2",
      "content": "Update GTD file paths to absolute (lines 53-60, 114-129)",
      "status": "pending",
      "activeForm": "Updating GTD file paths",
      "priority": "medium",
      "estimatedMinutes": 15,
      "file": "/docs/life-os-feature-map.md",
      "lines": "53-60, 114-129"
    },
    {
      "id": "fix-1.3",
      "content": "Simplify AI agent configuration (lines 475-496)",
      "status": "pending",
      "activeForm": "Simplifying agent configuration",
      "priority": "high",
      "estimatedMinutes": 25,
      "file": "/docs/life-os-feature-map.md",
      "lines": "475-496"
    },
    {
      "id": "fix-1.4",
      "content": "Add technical setup steps after line 156",
      "status": "pending",
      "activeForm": "Adding technical setup instructions",
      "priority": "high",
      "estimatedMinutes": 30,
      "file": "/docs/life-os-feature-map.md",
      "lines": "after 156"
    },
    {
      "id": "fix-2.1",
      "content": "Remove Google Tasks from integration-architecture.md",
      "status": "pending",
      "activeForm": "Removing Google Tasks references",
      "priority": "high",
      "estimatedMinutes": 20,
      "file": "/docs/integrations/integration-architecture.md",
      "lines": "306-351"
    },
    {
      "id": "fix-2.2",
      "content": "Simplify WhatsApp to MCP reference only",
      "status": "pending",
      "activeForm": "Simplifying WhatsApp section",
      "priority": "medium",
      "estimatedMinutes": 15,
      "file": "/docs/integrations/integration-architecture.md",
      "lines": "search: WhatsApp"
    },
    {
      "id": "fix-2.3",
      "content": "Validate integration scope in overview",
      "status": "pending",
      "activeForm": "Validating integration scope",
      "priority": "high",
      "estimatedMinutes": 10,
      "file": "/docs/integrations/integration-architecture.md",
      "lines": "1-15"
    },
    {
      "id": "fix-3.1",
      "content": "Update implementation scope in skills plan",
      "status": "pending",
      "activeForm": "Updating implementation scope",
      "priority": "high",
      "estimatedMinutes": 15,
      "file": "/docs/life-os-skills-implementation-plan.md",
      "lines": "1-21"
    },
    {
      "id": "fix-3.2",
      "content": "Remove Google Tasks from Phase 4 integrations",
      "status": "pending",
      "activeForm": "Removing Google Tasks from Phase 4",
      "priority": "high",
      "estimatedMinutes": 25,
      "file": "/docs/life-os-skills-implementation-plan.md",
      "lines": "374-443"
    },
    {
      "id": "fix-3.3",
      "content": "Clarify WhatsApp vs Telegram in Section 5.1",
      "status": "pending",
      "activeForm": "Clarifying WhatsApp vs Telegram",
      "priority": "high",
      "estimatedMinutes": 20,
      "file": "/docs/life-os-skills-implementation-plan.md",
      "lines": "515-554"
    }
  ]
}
```

---

## Success Criteria

All fixes are complete when:

1. **Path Consistency**: All file paths are absolute from project root
2. **Scope Alignment**: Documentation matches Week 0-1 action plan (Todoist, Gmail only)
3. **Clear Deferrals**: Calendar (Week 2+), Keep/Telegram (Week 5+) clearly marked
4. **WhatsApp Clarity**: Explicitly noted as MCP-based (no custom development)
5. **Technical Accuracy**: Setup instructions are complete and testable
6. **No Google Tasks**: No references to Google Tasks API anywhere
7. **User-Ready**: Onboarding can be followed step-by-step without confusion

---

**Next Steps After Completion**:
1. Review all changes in git diff
2. Test technical setup instructions (API configuration)
3. Validate file path accuracy (check all referenced files exist)
4. Update action plan progress (Week 0 Day 5-7 → Complete)
5. Prepare for Week 0 Day 8-14 (core implementation)

---

**Checklist Version**: 1.0
**Created**: 2025-10-19
**Status**: Ready for Execution
**Estimated Total Time**: 3-4 hours (including validation)
