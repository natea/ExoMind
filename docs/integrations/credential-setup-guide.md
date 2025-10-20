# Credential Setup Guide

> **Local-Only Operation**: Life-OS runs locally with simplified authentication. No OAuth flows or webhook infrastructure needed.

This guide walks through obtaining credentials for the 4 core integrations:
1. **Todoist** - Task management
2. **Gmail** - Email processing (Google Workspace MCP)
3. **Google Calendar** - Schedule management (Google Workspace MCP)
4. **WhatsApp** - Mobile messaging (WhatsApp MCP handles authentication)

---

## 1. Todoist API Token

### Method 1: Personal API Token (Recommended for single user)

1. Log in to [Todoist](https://todoist.com)
2. Go to **Settings** → **Integrations** → **Developer**
3. Copy your **API Token**
4. Store in environment:
   ```bash
   export TODOIST_API_TOKEN="your_token_here"
   ```

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

---

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

---

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

---

## 4. Google Calendar (via MCP)

> ✅ **Included with Google Workspace MCP** - Same authentication as Gmail.

### Setup

Automatically configured when you set up Google Workspace MCP (Section 2).

### Features Available
- Fetch calendar events
- Create/modify events
- Schedule analysis
- Time blocking
- Conflict detection

No additional credentials needed!

---

## 5. WhatsApp Message Management (via MCP)

> ✅ **Simplified**: WhatsApp MCP handles all authentication and messaging.

### Setup

1. Install WhatsApp MCP server:
   ```bash
   # Check if available
   claude mcp list | grep whatsapp

   # Install if needed
   claude mcp add whatsapp <installation-command>
   ```

2. MCP handles authentication:
   - No bot token needed
   - No webhook configuration
   - Authentication managed by MCP server

3. Life-OS provides skill wrapper only:
   - Located at: `skills/managing-whatsapp-messages/SKILL.md`
   - No credential management in Life-OS code
   - Coordinates via MCP tool calls

### No Manual Configuration Required!

WhatsApp MCP manages all:
- Authentication
- Message sending/receiving
- Rate limiting
- Error handling

Life-OS skill just defines commands and workflows.

---

## Credential Storage

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

### Environment Variables (Development)

Create `.env.local` (DO NOT COMMIT):

```bash
# Todoist (only integration requiring manual token)
TODOIST_API_TOKEN=your_token

# Google Workspace MCP manages these automatically:
# - Gmail authentication
# - Calendar authentication

# WhatsApp MCP manages authentication automatically

# Memory path (optional)
MEMORY_PATH=./memory
```

Load in application:
```typescript
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
```

### Encrypted Config File (Optional for Production)

```typescript
// config/credentials.encrypted.json (committed)
{
  "todoist": "U2FsdGVkX1..."  // Only Todoist needs manual token
}

// MCP-based integrations (Gmail, Calendar, WhatsApp):
// - Credentials managed by respective MCP servers
// - No manual encryption needed
// - Automatic secure storage

// Decrypt Todoist token at runtime
const credentials = await decryptConfig(
  'config/credentials.encrypted.json',
  process.env.ENCRYPTION_KEY
);
```

---

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

---

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

---

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

---

## Next Steps

1. Set up Todoist API token (Week 8)
2. Install Google Workspace MCP (Week 9)
3. Install WhatsApp MCP (Week 10)
4. Run verification script
5. Test each integration individually

**Timeline:**
- Week 8: Todoist integration
- Week 9: Gmail + Calendar (Google Workspace MCP)
- Week 10: WhatsApp skill (2-3 days)

For integration architecture details, see `/docs/integrations/integration-architecture.md`
