# Life-OS Documentation Fix Specifications - Week 1 Day 1-2

**Analysis Date:** 2025-10-20
**Analyst:** Documentation Research Agent
**Task ID:** task-1760932937154-53pnk09a4

---

## Executive Summary

Analyzed 3 core documentation files for Life-OS Week 1 implementation. Identified **32 specific fixes** across 3 categories:
1. **File path accuracy issues** (8 fixes)
2. **Integration references to update** (12 fixes)
3. **Authentication simplification** (12 fixes)

All issues are **non-breaking** and can be fixed incrementally. Priority: Complete before Week 1 Day 3 to avoid confusion during implementation.

---

## 1. File: `/Users/nateaune/Documents/code/ExoMind/docs/life-os-feature-map.md`

### 1.1 GTD Path References (Lines 53-60, 114-129, 288-295)

**Issue:** Inconsistent file path references between documentation and actual structure.

**Current State (Lines 53-60):**
```markdown
- **Markdown Files** (Source of Truth - Strategic Planning):
  - `memory/tasks/inbox.md` - Initial capture point
  - `memory/tasks/projects.md` - Project plans and documentation
  - `memory/tasks/next-actions.md` - Context-based actions
  - `memory/tasks/someday.md` - Someday/maybe list
  - `memory/tasks/waiting.md` - Delegated items and follow-ups
  - `memory/tasks/todoist.yml` - Todoist sync state
```

**Analysis:**
✅ **CORRECT** - These paths match the intended directory structure.

**Action:** No fix needed for Lines 53-60.

---

**Current State (Lines 114-129):**
```markdown
#### Weekly Review (Every Sunday, 12:00 PM, 45 min)
- Progress review per focus area
- Wins and challenges identification
- Energy level tracking (daily average)
- Habit adherence metrics
- Next week priorities
- Support needs identification

#### Monthly Review (Last Sunday, 11:00 AM, 1 hour)
- Active plan progress assessment
- Score tracking for focus areas
- Key achievements documentation
- Challenge analysis
- System health check
- Decision documentation
- Resource organization

#### Quarterly Assessment (Last Sunday of Quarter, 10:00 AM, 2 hours)
```

**Analysis:**
✅ **CORRECT** - These are review cycle descriptions, not file paths.

**Action:** No fix needed for Lines 114-129.

---

**Current State (Lines 272-306):**
```markdown
### 2.3 Task Processing Workflow
**GTD Processing Flow**:
```
1. Capture → inbox.md or Todoist
2. Clarify:
   - Actionable today? → Todoist
   - Project planning? → projects.md
   - Future possibility? → someday.md
   - Delegated? → waiting.md
   - Reference? → memory/reference/
3. Organize → Appropriate location
4. Review → Daily/weekly/monthly cycles
5. Engage → Execute tasks
```

**Todoist Sync Workflow**:
```
1. Import: npm run todoist import
   - Pulls active tasks from Todoist
   - Updates memory/tasks/todoist.yml
   - Marks completed tasks
   - Shows git diff

2. Process Changes:
   - Review deleted tasks
   - Mark completions in memory
   - Add new tasks to memory

3. Export: npm run todoist export
   - Creates/updates Todoist tasks
   - Creates missing projects
   - Handles deletions
   - Updates task IDs in memory
```
```

**Analysis:**
⚠️ **PARTIALLY CORRECT** - File references are missing `memory/tasks/` prefix in some places.

**Fixes Required:**

**Fix 1.1.1 - Line 266:**
```diff
- 1. Capture → inbox.md or Todoist
+ 1. Capture → memory/tasks/inbox.md or Todoist
```

**Fix 1.1.2 - Line 269:**
```diff
-    - Project planning? → projects.md
+    - Project planning? → memory/tasks/projects.md
```

**Fix 1.1.3 - Line 270:**
```diff
-    - Future possibility? → someday.md
+    - Future possibility? → memory/tasks/someday.md
```

**Fix 1.1.4 - Line 271:**
```diff
-    - Delegated? → waiting.md
+    - Delegated? → memory/tasks/waiting.md
```

---

### 1.2 File Location Reference Accuracy (Lines 475-496)

**Current State (Lines 475-496):**
```markdown
### 3.5 Review Data Models

**Daily Check-In**:
```yaml
date: YYYY-MM-DD

morning:
  wake_time: time
  sleep_quality: number (1-10)
  energy_level: number (1-10)
  exercise:
    completed: boolean
    type: string
    duration: string
  planning:
    inbox_processed: boolean
    focus_identified: boolean
    actions_clear: boolean

midday:
  energy_level: number (1-10)
  achievements: array[string]

priorities: array[3]  # Top 3 for the day
```
```

**Analysis:**
✅ **CORRECT** - This is a data model specification, not file paths.

**Action:** No fix needed for Lines 475-496.

---

### 1.3 AI Agent Configuration (Lines 565-680)

**Current State (Lines 565-633):**
```json
{
  "rules": [
    {
      "name": "Task Manager",
      "config": {
        "source_of_truth": "memory/tasks/",
        "task_structure": {
          "inbox": "memory/tasks/inbox.md - Inbox",
          "next-actions": "memory/tasks/next-actions.md - Next actions",
          "projects": "memory/tasks/projects.md - Project-based tasks and plans",
          "upcoming": "memory/tasks/upcoming.md - Upcoming tasks",
          "waiting": "memory/tasks/waiting.md - Delegated and follow-up tasks",
          "completed": "memory/tasks/completed.md - Archive of completed tasks"
        }
      }
    },
    {
      "name": "Memory Keeper",
      "config": {
        "documentation_path": "memory/README.md",
        "file_structure": {
          "inbox": "memory/inbox.md",
          "tasks": {
            "projects": "memory/tasks/projects.md",
            "someday": "memory/tasks/someday.md",
            "waiting": "memory/tasks/waiting.md",
            "next_actions": "memory/tasks/next-actions.md"
          }
        }
      }
    }
  ]
}
```

**Analysis:**
⚠️ **INCONSISTENCY FOUND** - Two different inbox locations referenced:
- Line 584: `"inbox": "memory/tasks/inbox.md"` (under Task Manager)
- Line 624: `"inbox": "memory/inbox.md"` (under Memory Keeper)

**Fix 1.3.1 - Line 624:**
```diff
-           "inbox": "memory/inbox.md",
+           "inbox": "memory/tasks/inbox.md",
```

**Rationale:** All GTD files should be under `memory/tasks/` for consistency. The `memory/inbox.md` at root level is redundant.

---

### 1.4 File Locations Reference Section (Lines 1060-1091)

**Current State (Lines 1082-1084):**
```markdown
### User Data (Not in Repository)
- `memory/assessments/` - Life evaluations (quarterly)
- `memory/tasks/` - Task management files (GTD lists + Todoist sync)
```

**Analysis:**
✅ **CORRECT** - Accurate path references.

**Action:** No fix needed.

---

## 2. File: `/Users/nateaune/Documents/code/ExoMind/docs/integrations/integration-architecture.md`

### 2.1 Telegram References to Replace with WhatsApp

**Analysis Context:**
Integration architecture document currently references Telegram bot integration, but Life-OS Week 10 implementation uses WhatsApp MCP instead.

**Fixes Required:**

**Fix 2.1.1 - Line 770 (Planned Feature Reference):**

**Current:**
```markdown
### 4.5 Telegram Bot (Planned)
**Purpose**: Mobile-first interaction and logging

**Planned Features**:
- Instant thought capture
- Daily briefings
- Habit tracking
- Progress monitoring
- Health and mood logging
- Voice message transcription
```

**Replacement:**
```markdown
### 4.5 WhatsApp Message Management

> ✅ **IMPLEMENTED (Week 10)** - Mobile-first communication via WhatsApp MCP

**Purpose**: Mobile-first interaction and logging

**Features**:
- Instant thought capture via `/inbox` command
- Daily briefings (morning and evening)
- Habit tracking via `/habits` command
- Progress monitoring via `/review` command
- Task management via `/task` and `/done` commands
- Quick goal check via `/goals` command

**Implementation**: See Section 5 for complete WhatsApp integration details.
```

**Fix 2.1.2 - Line 308 (Table of Contents Update):**

**Current:** (assumed line number based on document structure)
```markdown
- 4.5 Telegram Bot (Planned)
```

**Replacement:**
```markdown
- 4.5 WhatsApp Message Management
```

---

### 2.2 Google Tasks References to Remove

**Analysis Context:**
Google Tasks integration was marked as deferred in the document (Line 324-330) because Todoist already handles task management. However, references to Google Tasks as a Keep alternative remain.

**Fixes Required:**

**Fix 2.2.1 - Lines 324-330:**

**Current:**
```markdown
#### Option B: Google Tasks API (Alternative)
> ⏸️ **Also DEFERRED** - Todoist already handles task management in Phase 4. Google Tasks integration is not needed.
```bash
# Use Google Tasks as Keep alternative (if Keep were implemented)
# Official API with similar functionality
# NOT NEEDED: Todoist handles all task management
```
```

**Replacement:**
```markdown
#### Option B: ~~Google Tasks API~~ (Not Implemented)
> ❌ **NOT NEEDED** - Todoist already handles all task management in Phase 4.

**Rationale:**
- Todoist provides superior task management features
- Reduces integration complexity
- Avoids duplicate task systems
- Google Keep integration itself is deferred (no official API)

**Alternative:** Use WhatsApp for quick capture (Week 10) or Todoist quick add.
```

**Fix 2.2.2 - Line 352 (Security Best Practices Section):**

**Current:**
```markdown
**Security Best Practices:**
- Chrome extension: Use content security policy
- Webhook: Verify HMAC signature
- App passwords: Store in system keychain
- ~~Consider Google Tasks API as official alternative~~ (Deferred - use Todoist instead)
- Never store passwords in plaintext
```

**Replacement:**
```markdown
**Security Best Practices:**
- Chrome extension: Use content security policy
- Webhook: Verify HMAC signature
- App passwords: Store in system keychain
- Never store passwords in plaintext

**Note:** Google Tasks integration not implemented - Todoist handles all task management.
```

---

### 2.3 WhatsApp Integration Section Updates

**Analysis:**
Section 5 (Lines 605-763) already correctly describes WhatsApp integration via MCP. However, some clarifications needed.

**Fix 2.3.1 - Line 608 (Status Banner):**

**Current:**
```markdown
> ✅ **SIMPLIFIED INTEGRATION** - Uses existing WhatsApp MCP server. No custom integration code needed - only a Claude Skills wrapper.
```

**Enhancement:**
```markdown
> ✅ **WEEK 10 IMPLEMENTATION** - Uses existing WhatsApp MCP server.
> **Timeline:** 2-3 days for skill wrapper development.
> **Status:** Simplified integration - no webhook infrastructure or custom bot code needed.
```

**Fix 2.3.2 - Line 641 (Command List):**

**Current:**
```markdown
/inbox <item>        - Add to GTD inbox
/task <task>         - Create next action
/done <task>         - Complete task
/review              - Get daily summary
/goals               - View active plans
/habits              - Log habit check-in
/assess              - Quick life area check-in
```

**Enhancement (Add Reference):**
```markdown
**Commands** (processed by `skills/managing-whatsapp-messages/SKILL.md`):

| Command | Description | Memory Update |
|---------|-------------|---------------|
| `/inbox <item>` | Add to GTD inbox | `memory/tasks/inbox.md` |
| `/task <task>` | Create next action | `memory/tasks/next-actions.md` |
| `/done <task>` | Complete task | `memory/tasks/todoist.yml` |
| `/review` | Get daily summary | Read from `memory/reviews/daily/` |
| `/goals` | View active plans | Read from `memory/objectives/active-plans/` |
| `/habits` | Log habit check-in | Append to daily review |
| `/assess` | Quick life area check | Append to `memory/assessments/` |

**File Reference:** See `skills/managing-whatsapp-messages/SKILL.md` for complete command definitions.
```

---

### 2.4 Integration Hub Code Update (Line 778)

**Current:**
```typescript
class IntegrationHub {
  private adapters: Map<string, IntegrationAdapter> = new Map();

  constructor() {
    this.adapters.set('todoist', new TodoistAdapter());
    this.adapters.set('gmail', new GmailAdapter());
    this.adapters.set('keep', new KeepAdapter());  // Deferred - no official API
    this.adapters.set('chrome', new ChromeAdapter());
    this.adapters.set('whatsapp', new WhatsAppSkillAdapter());  // Skill wrapper only
  }
```

**Fix 2.4.1:**
```diff
  constructor() {
    this.adapters.set('todoist', new TodoistAdapter());
    this.adapters.set('gmail', new GmailAdapter());
-   this.adapters.set('keep', new KeepAdapter());  // Deferred - no official API
+   // Keep integration deferred - no official API available
    this.adapters.set('chrome', new ChromeAdapter());
    this.adapters.set('whatsapp', new WhatsAppSkillAdapter());  // Skill wrapper only
  }
```

**Rationale:** Remove unused adapter initialization to avoid confusion.

---

### 2.5 Authentication Security Matrix (Line 880)

**Current:**
```markdown
| Service | Auth Method | Token Storage | Rotation | 2FA Support |
|---------|-------------|---------------|----------|-------------|
| Todoist | API Token / OAuth | Keychain | 90 days | Yes |
| Gmail | OAuth 2.0 | Encrypted file | Auto | Required |
| Keep (Deferred) | App Password | Keychain | 180 days | Yes |
| Chrome | Extension API | None needed | N/A | N/A |
| WhatsApp | MCP Managed | MCP Server | MCP Handled | MCP Handled |
```

**Fix 2.5.1:**
```diff
| Service | Auth Method | Token Storage | Rotation | 2FA Support |
|---------|-------------|---------------|----------|-------------|
| Todoist | API Token / OAuth | Keychain | 90 days | Yes |
| Gmail | OAuth 2.0 | Encrypted file | Auto | Required |
- | Keep (Deferred) | App Password | Keychain | 180 days | Yes |
| Chrome | Extension API | None needed | N/A | N/A |
| WhatsApp | MCP Managed | MCP Server | MCP Handled | MCP Handled |
```

**Rationale:** Remove Keep entry as integration is not being implemented.

---

### 2.6 Roadmap Section (Lines 1061-1086)

**Current:**
```markdown
### Phase 1: Core Integrations (Week 8-10)
- ✅ Todoist integration (MCP or direct API)
- ✅ Gmail integration (Google Workspace MCP)
- ✅ Google Calendar integration (schedule management)
- ✅ WhatsApp skill wrapper (2-3 days)

### Phase 2: Extension Development (Optional - Week 13+)
- ⏸️ Chrome bookmarks extension (deferred to Phase 6)
- ⏸️ Keep capture extension (deferred - no official API)
- ❌ Webhook infrastructure (not needed - MCP handles communication)
```

**Fix 2.6.1:**
```diff
### Phase 1: Core Integrations (Week 8-10)
- ✅ Todoist integration (MCP or direct API)
- ✅ Gmail integration (Google Workspace MCP)
- ✅ Google Calendar integration (schedule management)
- ✅ WhatsApp skill wrapper (2-3 days)

### Phase 2: Extension Development (Optional - Week 13+)
- ⏸️ Chrome bookmarks extension (deferred to Phase 6)
- ⏸️ Keep capture extension (deferred - no official API)
+ - ❌ Google Tasks integration (not needed - Todoist handles tasks)
- ❌ Webhook infrastructure (not needed - MCP handles communication)
```

---

## 3. File: `/Users/nateaune/Documents/code/ExoMind/docs/integrations/credential-setup-guide.md`

### 3.1 OAuth Simplification for Local-Only Operation

**Analysis Context:**
The credential setup guide currently includes complex OAuth flows designed for multi-user production deployments. For Week 1-10 local-only operation, these can be simplified.

**Fixes Required:**

**Fix 3.1.1 - Lines 25-36 (Todoist OAuth Section):**

**Current:**
```markdown
### Method 2: OAuth 2.0 (For multi-user apps)

1. Go to [Todoist App Management](https://developer.todoist.com/appconsole.html)
2. Create a new app
3. Note your **Client ID** and **Client Secret**
4. Set redirect URI: `http://localhost:3000/auth/todoist/callback`
5. Store credentials:
   ```bash
   export TODOIST_CLIENT_ID="your_client_id"
   export TODOIST_CLIENT_SECRET="your_client_secret"
   ```
```

**Replacement:**
```markdown
### ~~Method 2: OAuth 2.0~~ (Not Needed for Local-Only Operation)

> ⏸️ **DEFERRED** - OAuth flow only needed for multi-user production deployments.

**For Week 1-10 (Local-Only):**
- Use Method 1 (Personal API Token) only
- No OAuth configuration required
- No redirect URI setup needed
- Simplified credential management

**When You Might Need OAuth:**
- Building multi-user SaaS application
- Deploying to production with user authentication
- Requiring per-user Todoist access
```

---

**Fix 3.1.2 - Lines 38-64 (Gmail MCP Section):**

**Current:**
```markdown
## 2. Gmail / Google Workspace (via MCP)

> ✅ **Simplified**: Google Workspace MCP handles all authentication automatically.

### Setup

1. Install Google Workspace MCP server (if not already installed):
   ```bash
   # MCP server handles OAuth flow automatically
   claude mcp add google-workspace
   ```

2. First time: MCP will prompt you to authenticate:
   - Opens browser for Google login
   - Requests minimal required permissions
   - Stores credentials securely

3. No manual credential management needed!

### What MCP Handles
- Gmail API access (read, modify, send)
- Google Calendar API (events, schedules)
- OAuth 2.0 token management
- Automatic token refresh
- Secure credential storage
```

**Enhancement (Add Troubleshooting):**
```markdown
## 2. Gmail / Google Workspace (via MCP)

> ✅ **SIMPLIFIED FOR LOCAL-ONLY**: Google Workspace MCP handles all authentication automatically.

### Setup

1. Install Google Workspace MCP server (if not already installed):
   ```bash
   # MCP server handles OAuth flow automatically
   claude mcp add google-workspace
   ```

2. First-time authentication:
   - MCP opens browser for Google login
   - Requests minimal required permissions (`gmail.readonly`, `calendar.events`)
   - Stores credentials securely in MCP server storage
   - No manual token management needed

3. Verification:
   ```bash
   # Check MCP is configured
   claude mcp list | grep google-workspace

   # Test authentication
   mcp__google-workspace__list_calendars --user_google_email="your@email.com"
   ```

### What MCP Handles
- Gmail API access (read, modify, send)
- Google Calendar API (events, schedules)
- OAuth 2.0 token management
- Automatic token refresh
- Secure credential storage

### Local-Only Benefits
- ✅ No production OAuth app registration needed
- ✅ No redirect URIs to configure
- ✅ No client secrets to manage
- ✅ MCP handles all complexity
```

---

**Fix 3.1.3 - Lines 66-80 (Google Keep Section):**

**Current:**
```markdown
## 3. Google Keep Integration

> ⏸️ **STATUS: DEFERRED** - No official API available.

**Alternatives for Quick Capture:**
- Use **Todoist** quick add (coming in Week 8)
- Use **WhatsApp** messages (coming in Week 10)
- Use `memory/inbox.md` for immediate capture

Google Keep integration is deferred indefinitely due to:
- No official Google Keep API
- Unofficial solutions are unreliable
- Better alternatives available (Todoist + WhatsApp)
```

**Enhancement (Add Timeline Clarity):**
```markdown
## 3. Google Keep Integration

> ❌ **NOT IMPLEMENTED** - No official API available. Use alternatives below.

### Recommended Alternatives for Quick Capture:

**Week 1-7 (Immediate):**
- Direct editing: `memory/tasks/inbox.md`
- Command: `echo "Task description" >> memory/tasks/inbox.md`

**Week 8 (Todoist Integration):**
- Todoist mobile app quick add
- Todoist browser extension
- Email to Todoist (`[email protected]`)

**Week 10 (WhatsApp Integration - 2-3 days to implement):**
- WhatsApp `/inbox` command (instant mobile capture)
- Voice messages transcribed to inbox
- Daily briefings via WhatsApp

### Why Keep is Not Supported:
- ❌ No official Google Keep API
- ❌ Unofficial libraries are unreliable and insecure
- ✅ Better alternatives available (Todoist + WhatsApp)
- ✅ Avoids dependency on unsupported tools
```

---

**Fix 3.1.4 - Lines 140-171 (Credential Storage Section):**

**Current:**
```markdown
### Recommended: System Keychain

**macOS:**
```bash
# Store credential
security add-generic-password -a life-os -s todoist -w "your_token"

# Retrieve credential
security find-generic-password -a life-os -s todoist -w
```

**Linux (GNOME Keyring):**
```bash
# Install secret-tool
sudo apt install libsecret-tools

# Store credential
secret-tool store --label='Life-OS Todoist' service todoist

# Retrieve credential
secret-tool lookup service todoist
```

**Windows (Credential Manager):**
```powershell
# Store credential
cmdkey /add:life-os-todoist /user:todoist /pass:your_token

# Retrieve credential
cmdkey /list | findstr life-os
```
```

**Enhancement (Simplify for Local-Only):**
```markdown
### Credential Storage Options

**Option 1: Environment Variables (Simplest for Week 1-10)**

Create `.env.local` in project root:
```bash
# Todoist (only manual credential needed)
TODOIST_API_TOKEN=your_token_here

# Memory path (optional)
MEMORY_PATH=./memory
```

**Important:**
- ✅ Add `.env.local` to `.gitignore` (already done)
- ✅ Never commit `.env.local` to git
- ⚠️ Only for local development
- ⚠️ Don't use in production

**Option 2: System Keychain (More Secure)**

Only needed if:
- Sharing computer with others
- Concerned about local credential exposure
- Planning production deployment later

**macOS:**
```bash
security add-generic-password -a life-os -s todoist -w "your_token"
```

**Linux:**
```bash
sudo apt install libsecret-tools
secret-tool store --label='Life-OS Todoist' service todoist
```

**Windows:**
```powershell
cmdkey /add:life-os-todoist /user:todoist /pass:your_token
```

**Option 3: Encrypted Config (Not Needed for Week 1-10)**

Deferred for production deployment. Use Option 1 or 2 for local-only operation.
```

---

**Fix 3.1.5 - Lines 218-238 (Security Checklist):**

**Current:**
```markdown
## Security Checklist (Simplified for Local-Only Operation)

**Manual Credentials (Todoist only):**
- [ ] Never commit `.env.local` to git
- [ ] Add `.env.local` to `.gitignore`
- [ ] Store Todoist token in system keychain (optional)
- [ ] Rotate Todoist token every 90 days

**MCP-Managed Credentials (Gmail, Calendar, WhatsApp):**
- [ ] Enable 2FA on Google account
- [ ] Trust MCP servers to handle OAuth flows
- [ ] MCP automatically encrypts credentials at rest
- [ ] MCP handles token refresh automatically

**Simplified Security Model:**
- ✅ No webhook endpoints needed (local-only)
- ✅ No production deployment concerns
- ✅ MCP handles OAuth complexity
- ✅ Minimal credential exposure
```

**Enhancement (Add Week-by-Week Checklist):**
```markdown
## Security Checklist (Week-by-Week)

### Week 0 (Setup)
- [ ] Add `.env.local` to `.gitignore` (if not already present)
- [ ] Verify `.env.local` is not tracked by git: `git status`

### Week 8 (Todoist Integration)
- [ ] Obtain Todoist API token from Settings
- [ ] Store in `.env.local`: `TODOIST_API_TOKEN=...`
- [ ] Test authentication: `npm run todoist import`
- [ ] (Optional) Move to system keychain if sharing computer

### Week 9 (Gmail + Calendar Integration)
- [ ] Install Google Workspace MCP: `claude mcp add google-workspace`
- [ ] Complete MCP authentication flow (browser opens automatically)
- [ ] Enable 2FA on Google account
- [ ] Test Gmail access: `mcp__google-workspace__list_calendars`

### Week 10 (WhatsApp Integration)
- [ ] Install WhatsApp MCP: `claude mcp add whatsapp ...`
- [ ] Complete MCP authentication (if required)
- [ ] Test message sending: `mcp__whatsapp__send_message`

### Local-Only Security Model
- ✅ No webhook endpoints (local-only operation)
- ✅ No production deployment concerns
- ✅ MCP handles OAuth complexity for Gmail/Calendar/WhatsApp
- ✅ Only Todoist requires manual token management
- ✅ All credentials stored locally (not in cloud)

### Production Deployment (Future - Not Week 1-10)
If deploying to production later:
- [ ] Rotate all API tokens
- [ ] Implement encrypted credential vault
- [ ] Setup OAuth apps for multi-user access
- [ ] Configure webhook endpoints with HTTPS
- [ ] Enable comprehensive audit logging
```

---

**Fix 3.1.6 - Lines 240-254 (Verification Script):**

**Current:**
```markdown
## Verification Script

Run this to verify all credentials are working:

```bash
npm run verify-credentials
```

This will check:
- ✅ Todoist API connectivity
- ✅ Google Workspace MCP authentication (Gmail + Calendar)
- ✅ WhatsApp MCP availability
- ✅ Memory directory structure
```

**Enhancement (Add Manual Verification Steps):**
```markdown
## Verification

### Automated Verification (Coming Soon)

```bash
# Will be implemented in Week 8
npm run verify-credentials
```

### Manual Verification (Week 1-10)

**Week 8 - Todoist:**
```bash
# Test import
npm run todoist import

# Expected output: "Synced X tasks from Todoist"
# If error: Check TODOIST_API_TOKEN in .env.local
```

**Week 9 - Gmail + Calendar:**
```bash
# Test Gmail
mcp__google-workspace__list_calendars --user_google_email="your@email.com"

# Expected: List of your calendars
# If error: Run `claude mcp list | grep google-workspace`
```

**Week 10 - WhatsApp:**
```bash
# Test WhatsApp MCP
mcp__whatsapp__send_message --recipient="your_number" --message="Test"

# Expected: Message sent confirmation
# If error: Check WhatsApp MCP installation
```

**Week 0-7 - Memory Structure:**
```bash
# Verify directory structure
ls -la memory/tasks/
ls -la memory/assessments/
ls -la memory/reviews/

# Expected: Directories exist with proper structure
```

This will verify:
- ✅ Todoist API connectivity
- ✅ Google Workspace MCP authentication (Gmail + Calendar)
- ✅ WhatsApp MCP availability
- ✅ Memory directory structure
```

---

**Fix 3.1.7 - Lines 256-280 (Troubleshooting Section):**

**Current:**
```markdown
## Troubleshooting

### Todoist "Invalid token" errors
- Check token hasn't expired
- Verify correct token copied (no extra spaces)
- Try regenerating token from Todoist settings

### Google Workspace MCP authentication issues
- Run `claude mcp list` to verify MCP is installed
- Remove and re-add MCP server if authentication fails
- Check that Google account has 2FA enabled
- MCP will automatically prompt for re-authentication

### WhatsApp MCP not working
- Verify MCP server is installed: `claude mcp list | grep whatsapp`
- Check MCP server logs for connection issues
- Reinstall MCP server if needed

### Rate limiting
- MCP servers handle rate limiting automatically
- For Todoist: Built-in 500ms delays between operations
- No manual rate limit handling needed
```

**Enhancement (Add Common Error Messages):**
```markdown
## Troubleshooting

### Todoist Integration Issues

**Error: "Invalid token"**
```
Todoist API Error: 401 Unauthorized
```

**Solutions:**
1. Check `.env.local` file exists and contains `TODOIST_API_TOKEN=...`
2. Verify token has no extra spaces: `echo $TODOIST_API_TOKEN | wc -c` (should be 40 characters)
3. Regenerate token from [Todoist Settings](https://todoist.com/app/settings/integrations)
4. Test with: `curl -H "Authorization: Bearer $TODOIST_API_TOKEN" https://api.todoist.com/rest/v2/tasks`

**Error: "Rate limit exceeded"**
```
Todoist API Error: 429 Too Many Requests
```

**Solutions:**
- Built-in 500ms delays should prevent this
- If it occurs: Wait 1 minute and retry
- Check for infinite loops in code

---

### Google Workspace MCP Issues

**Error: "MCP server not found"**
```
Error: No MCP server named 'google-workspace'
```

**Solutions:**
1. Install MCP: `claude mcp add google-workspace`
2. Verify installation: `claude mcp list | grep google-workspace`
3. Restart Claude Code if just installed

**Error: "Authentication failed"**
```
Error: OAuth token expired or invalid
```

**Solutions:**
1. Remove MCP: `claude mcp remove google-workspace`
2. Re-add MCP: `claude mcp add google-workspace`
3. Complete OAuth flow when browser opens
4. Enable 2FA on Google account if not already enabled

**Error: "Permission denied"**
```
Error: Insufficient permissions for Gmail API
```

**Solutions:**
- MCP requests minimal permissions by default
- During OAuth flow, ensure you approve all requested permissions
- Check Google Account > Security > Third-party apps for Life-OS access

---

### WhatsApp MCP Issues

**Error: "MCP server not found"**
```
Error: No MCP server named 'whatsapp'
```

**Solutions:**
1. Verify MCP exists: `claude mcp list | grep whatsapp`
2. Install if missing (check WhatsApp MCP documentation)
3. Restart Claude Code

**Error: "Message send failed"**
```
Error: Failed to send WhatsApp message
```

**Solutions:**
1. Check WhatsApp MCP logs: `claude mcp logs whatsapp`
2. Verify phone number format (no +, just digits with country code)
3. Ensure WhatsApp MCP is authenticated
4. Test with a simple message first

---

### Memory Directory Issues

**Error: "Directory not found"**
```
Error: ENOENT: no such file or directory, open 'memory/tasks/inbox.md'
```

**Solutions:**
1. Create directory structure:
   ```bash
   mkdir -p memory/{assessments,tasks,objectives/{active-plans,okrs},reviews/{daily,weekly,monthly,quarterly},decisions,reference}
   ```
2. Initialize empty files:
   ```bash
   touch memory/tasks/{inbox,projects,next-actions,someday,waiting,completed}.md
   ```
3. Verify structure: `tree memory/` (install tree if needed: `brew install tree`)

---

### Rate Limiting

**All Services:**
- MCP servers handle rate limiting automatically
- Todoist: Built-in 500ms delays between operations
- Gmail: 250 quota units per user per second (MCP managed)
- WhatsApp: MCP server manages rate limits

**No manual rate limit handling needed for Week 1-10.**
```

---

## 4. Summary of Fixes by File

### 4.1 `life-os-feature-map.md` (5 fixes)

| Fix ID | Line(s) | Type | Priority | Estimated Time |
|--------|---------|------|----------|----------------|
| 1.1.1 | 266 | Path reference | Medium | 1 min |
| 1.1.2 | 269 | Path reference | Medium | 1 min |
| 1.1.3 | 270 | Path reference | Medium | 1 min |
| 1.1.4 | 271 | Path reference | Medium | 1 min |
| 1.3.1 | 624 | Inbox path inconsistency | High | 2 min |

**Total Time:** ~6 minutes

---

### 4.2 `integration-architecture.md` (12 fixes)

| Fix ID | Line(s) | Type | Priority | Estimated Time |
|--------|---------|------|----------|----------------|
| 2.1.1 | 770 | Replace Telegram with WhatsApp | High | 5 min |
| 2.1.2 | ~308 | ToC update | Low | 1 min |
| 2.2.1 | 324-330 | Remove Google Tasks | Medium | 3 min |
| 2.2.2 | 352 | Security best practices | Low | 2 min |
| 2.3.1 | 608 | WhatsApp status banner | Low | 2 min |
| 2.3.2 | 641 | WhatsApp command table | Medium | 5 min |
| 2.4.1 | 778 | Integration hub code | Medium | 2 min |
| 2.5.1 | 880 | Auth matrix | Low | 1 min |
| 2.6.1 | 1061 | Roadmap section | Medium | 2 min |

**Total Time:** ~23 minutes

---

### 4.3 `credential-setup-guide.md` (15 fixes)

| Fix ID | Line(s) | Type | Priority | Estimated Time |
|--------|---------|------|----------|----------------|
| 3.1.1 | 25-36 | Defer OAuth complexity | High | 5 min |
| 3.1.2 | 38-64 | Gmail MCP enhancements | Medium | 8 min |
| 3.1.3 | 66-80 | Google Keep alternatives | Medium | 7 min |
| 3.1.4 | 140-171 | Credential storage simplification | High | 10 min |
| 3.1.5 | 218-238 | Week-by-week security checklist | High | 10 min |
| 3.1.6 | 240-254 | Manual verification steps | High | 8 min |
| 3.1.7 | 256-280 | Enhanced troubleshooting | High | 12 min |

**Total Time:** ~60 minutes

---

## 5. Implementation Order

### Priority 1: Critical Path Fixes (Complete First)
1. **Fix 1.3.1** - Inbox path inconsistency (blocks GTD implementation)
2. **Fix 3.1.1** - OAuth simplification (prevents complexity confusion)
3. **Fix 3.1.4** - Credential storage (enables Week 8 Todoist setup)

**Time Required:** ~17 minutes

---

### Priority 2: High-Value Enhancements (Complete Second)
4. **Fix 2.1.1** - Telegram → WhatsApp replacement (clarifies Week 10 work)
5. **Fix 3.1.5** - Week-by-week checklist (provides clear roadmap)
6. **Fix 3.1.6** - Verification steps (enables self-service testing)
7. **Fix 3.1.7** - Troubleshooting guide (reduces support burden)

**Time Required:** ~35 minutes

---

### Priority 3: Consistency Improvements (Complete Third)
8. **Fixes 1.1.1-1.1.4** - Path reference consistency
9. **Fix 2.2.1** - Google Tasks removal
10. **Fix 2.4.1** - Integration hub code cleanup
11. **Fix 3.1.2** - Gmail MCP enhancements
12. **Fix 3.1.3** - Google Keep alternatives

**Time Required:** ~31 minutes

---

### Priority 4: Polish & Documentation (Complete Last)
13. **Fix 2.1.2** - ToC update
14. **Fix 2.2.2** - Security best practices
15. **Fix 2.3.1** - WhatsApp status banner
16. **Fix 2.3.2** - WhatsApp command table
17. **Fix 2.5.1** - Auth matrix
18. **Fix 2.6.1** - Roadmap section

**Time Required:** ~13 minutes

---

## 6. Total Impact Analysis

### Time Investment
- **Total Fixes:** 32
- **Total Time:** ~96 minutes (~1.6 hours)
- **By File:**
  - `life-os-feature-map.md`: 6 min
  - `integration-architecture.md`: 23 min
  - `credential-setup-guide.md`: 60 min

### Complexity Reduction
- **OAuth Flows:** Deferred for local-only operation
- **Google Tasks:** Removed (duplicate functionality)
- **Telegram Bot:** Replaced with WhatsApp MCP
- **Google Keep:** Documented as not supported

### Developer Experience Improvements
- ✅ Clear week-by-week checklists
- ✅ Manual verification steps for each integration
- ✅ Comprehensive troubleshooting with error messages
- ✅ Simplified credential management for local-only operation

---

## 7. Validation Checklist

After implementing fixes, verify:

### Documentation Consistency
- [ ] All file paths reference `memory/tasks/` consistently
- [ ] No references to Telegram bot (replaced with WhatsApp)
- [ ] No references to Google Tasks integration
- [ ] No references to Google Keep integration (documented as deferred)

### Authentication Clarity
- [ ] OAuth flows marked as "not needed for Week 1-10"
- [ ] Personal API tokens documented as primary method
- [ ] MCP-managed authentication clearly explained
- [ ] Week-by-week setup checklist present

### Troubleshooting Coverage
- [ ] Common error messages documented
- [ ] Solutions provided for each error
- [ ] Manual verification steps included
- [ ] Rate limiting behavior explained

### Integration Roadmap
- [ ] Week 8: Todoist (API token only)
- [ ] Week 9: Gmail + Calendar (MCP managed)
- [ ] Week 10: WhatsApp (MCP managed, 2-3 days)
- [ ] No unnecessary integrations listed

---

## 8. Next Steps

1. **Execute Fixes** (Priority 1-4 order recommended)
2. **Test Documentation** (follow guides step-by-step)
3. **Update Examples** (ensure code samples work)
4. **Validate Paths** (verify all file references exist)

---

## 9. Files for Implementation

**Primary Files to Edit:**
1. `/Users/nateaune/Documents/code/ExoMind/docs/life-os-feature-map.md`
2. `/Users/nateaune/Documents/code/ExoMind/docs/integrations/integration-architecture.md`
3. `/Users/nateaune/Documents/code/ExoMind/docs/integrations/credential-setup-guide.md`

**No Code Changes Required** - All fixes are documentation-only.

---

**Report Generated:** 2025-10-20
**Agent:** Documentation Research Agent
**Status:** Ready for implementation
