# Credential Setup Guide

This guide walks through obtaining credentials for each integration service.

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

## 2. Gmail / Google Workspace

### OAuth 2.0 Setup (Required)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Gmail API**:
   - Navigate to **APIs & Services** → **Library**
   - Search "Gmail API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Choose **Desktop app** or **Web application**
   - Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
5. Download the JSON credentials file
6. Store credentials:
   ```bash
   export GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com"
   export GOOGLE_CLIENT_SECRET="your_client_secret"
   ```

### Required Scopes

```
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/gmail.modify
https://www.googleapis.com/auth/gmail.send
```

### Initial OAuth Flow

Run the authentication script:
```bash
npm run auth:google
```

This will:
1. Open browser for Google login
2. Request permissions
3. Save refresh token to `~/.config/life-os/credentials/google-oauth.json`

---

## 3. Google Keep

### Warning: No Official API

Google Keep does not have an official public API. Choose one of these approaches:

### Option A: Use Google Tasks Instead (Recommended)

1. Follow Gmail OAuth setup above
2. Enable **Google Tasks API** in Cloud Console
3. Use same credentials
4. Add scope: `https://www.googleapis.com/auth/tasks`

### Option B: Chrome Extension (Custom Solution)

1. No API credentials needed
2. Extension uses Chrome's `bookmarks` permission
3. Data transferred via local webhook

### Option C: Unofficial Keep API (Use at Own Risk)

1. Enable 2FA on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Store credentials:
   ```bash
   export GOOGLE_KEEP_EMAIL="your_email@gmail.com"
   export GOOGLE_KEEP_APP_PASSWORD="16_character_password"
   ```

**⚠️ Not recommended for production use**

---

## 4. Chrome Bookmarks

### Method 1: Chrome Extension (Recommended)

No API credentials needed. Extension installation:

1. Download extension from `/extensions/chrome-bookmarks`
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the extension folder

### Method 2: Remote Debugging Protocol (Advanced)

Launch Chrome with debugging enabled:
```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Linux
google-chrome --remote-debugging-port=9222

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

Configure:
```bash
export CHROME_DEBUGGING_PORT=9222
```

---

## 5. Telegram Bot

### Create Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Choose a name and username for your bot
4. Copy the **API Token** provided
5. Store token:
   ```bash
   export TELEGRAM_BOT_TOKEN="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
   ```

### Get Your User ID

1. Search for [@userinfobot](https://t.me/userinfobot) in Telegram
2. Start a chat
3. Bot will send your numeric user ID
4. Store ID:
   ```bash
   export TELEGRAM_USER_ID="123456789"
   ```

### Configure Webhook (Production)

```bash
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/telegram/webhook",
    "secret_token": "your_random_secret_here"
  }'
```

Store webhook secret:
```bash
export TELEGRAM_WEBHOOK_SECRET="your_random_secret_here"
```

### Test Bot

Send `/start` to your bot in Telegram to verify it's working.

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
# Todoist
TODOIST_API_TOKEN=your_token

# Google
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_USER_ID=your_user_id
TELEGRAM_WEBHOOK_SECRET=your_secret

# Chrome
CHROME_DEBUGGING_PORT=9222

# Security
WEBHOOK_SECRET=random_secret_for_chrome_extension
```

Load in application:
```typescript
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
```

### Encrypted Config File (Production)

```typescript
// config/credentials.encrypted.json (committed)
{
  "todoist": "U2FsdGVkX1...",  // Encrypted token
  "google": "U2FsdGVkX1...",
  "telegram": "U2FsdGVkX1..."
}

// Decrypt at runtime
const credentials = await decryptConfig(
  'config/credentials.encrypted.json',
  process.env.ENCRYPTION_KEY
);
```

---

## Security Checklist

- [ ] Never commit credentials to git
- [ ] Add `.env.local` to `.gitignore`
- [ ] Use OAuth 2.0 when available
- [ ] Enable 2FA on all accounts
- [ ] Rotate tokens every 90 days
- [ ] Use app passwords instead of account passwords
- [ ] Restrict API permissions to minimum required
- [ ] Monitor API usage for anomalies
- [ ] Use HTTPS for all webhook endpoints
- [ ] Implement rate limiting
- [ ] Log all authentication attempts
- [ ] Encrypt credentials at rest
- [ ] Use secrets management in production (Vault, AWS Secrets Manager)

---

## Verification Script

Run this to verify all credentials are working:

```bash
npm run verify-credentials
```

This will check:
- ✅ Todoist API connectivity
- ✅ Gmail OAuth token validity
- ✅ Chrome extension installation
- ✅ Telegram bot responsiveness
- ✅ Webhook endpoint availability

---

## Troubleshooting

### "Invalid token" errors
- Check token hasn't expired
- Verify correct token copied
- Try regenerating token

### OAuth "redirect_uri_mismatch"
- Ensure redirect URI matches exactly in Cloud Console
- Include protocol (`http://` or `https://`)
- Check for trailing slashes

### Webhook not receiving events
- Verify HTTPS endpoint (required for Telegram)
- Check firewall rules
- Test with `ngrok` for local development
- Verify webhook secret matches

### Rate limiting
- Implement exponential backoff
- Cache responses when possible
- Use batch API endpoints

---

## Next Steps

1. Complete credential setup for all services
2. Run verification script
3. Test each integration individually
4. Configure webhooks for real-time updates
5. Set up monitoring and alerts

For integration code examples, see `/docs/integrations/integration-architecture.md`
