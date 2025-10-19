# Composio Gmail MCP Integration Guide

## Setup Status ✅

Your Gmail integration is already configured and ready to use!

- **MCP Server**: Configured in `.mcp.json`
- **API Key**: Set in environment
- **Gmail Integration**: Created on Jan 8, 2025
- **Integration ID**: `ab313a81-54f6-4da2-b518-1e190461ce53`

## Available Gmail Actions

Composio provides 23 Gmail actions through MCP tools:

### Email Management
- `GMAIL_FETCH_EMAILS` - Fetch emails from your inbox
- `GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID` - Get specific message
- `GMAIL_FETCH_MESSAGE_BY_THREAD_ID` - Get thread messages
- `GMAIL_SEND_EMAIL` - Send new email
- `GMAIL_REPLY_TO_THREAD` - Reply to email thread
- `GMAIL_DELETE_MESSAGE` - Delete message
- `GMAIL_MOVE_TO_TRASH` - Move to trash

### Drafts
- `GMAIL_CREATE_EMAIL_DRAFT` - Create draft
- `GMAIL_LIST_DRAFTS` - List all drafts
- `GMAIL_SEND_DRAFT` - Send draft
- `GMAIL_DELETE_DRAFT` - Delete draft

### Labels & Organization
- `GMAIL_LIST_LABELS` - List all labels
- `GMAIL_CREATE_LABEL` - Create new label
- `GMAIL_ADD_LABEL_TO_EMAIL` - Add label to email
- `GMAIL_REMOVE_LABEL` - Remove label
- `GMAIL_PATCH_LABEL` - Modify label
- `GMAIL_MODIFY_THREAD_LABELS` - Modify thread labels

### Threads & Contacts
- `GMAIL_LIST_THREADS` - List email threads
- `GMAIL_GET_CONTACTS` - Get contacts
- `GMAIL_GET_PEOPLE` - Get people info
- `GMAIL_SEARCH_PEOPLE` - Search for people
- `GMAIL_GET_PROFILE` - Get account profile
- `GMAIL_GET_ATTACHMENT` - Download attachment

## Using Gmail MCP Tools

### Method 1: Through Claude Code (Recommended)

The MCP tools are automatically available in Claude Code. You can ask me to perform Gmail operations directly:

**Examples:**
- "Fetch my last 10 emails"
- "Send an email to john@example.com"
- "Create a draft email"
- "List all my Gmail labels"
- "Search for emails from specific sender"

### Method 2: Via CLI

```bash
# List all Gmail actions
composio actions --apps gmail --enabled

# Check integration status
composio integrations | grep gmail

# Execute action (with parameters)
composio execute GMAIL_FETCH_EMAILS --params '{"maxResults": 10}'
```

## Common Use Cases

### 1. Fetch Recent Emails
Ask Claude: "Show me my 10 most recent emails"

### 2. Send Email
Ask Claude: "Send an email to [recipient] with subject [subject] and message [message]"

### 3. Manage Labels
Ask Claude: "List all my Gmail labels" or "Create a label called 'Important'"

### 4. Search Emails
Ask Claude: "Find emails from [sender]" or "Search for emails containing [keyword]"

### 5. Draft Management
Ask Claude: "Create a draft email to [recipient]" or "List all my drafts"

## Authentication

Your Gmail account is already authenticated through the Composio integration created on Jan 8, 2025.

To re-authenticate or add another account:
```bash
composio add gmail
```

## MCP Tools Access

The Composio MCP server runs automatically when Claude Code starts. The tools are prefixed with `mcp__composio__` in the MCP protocol.

## Troubleshooting

### If actions fail:
1. Check integration status: `composio integrations`
2. Verify connection: `composio connections --active`
3. Re-authenticate if needed: `composio add gmail`

### Connection Issues:
- Ensure MCP server is running (configured in `.mcp.json`)
- Check API key is set: `COMPOSIO_API_KEY` environment variable
- Verify integration ID in output of `composio integrations`

## Next Steps

Try these commands to test your Gmail integration:
1. "Fetch my recent emails"
2. "List my Gmail labels"
3. "Get my Gmail profile information"

All operations will use your authenticated Gmail account through the Composio MCP integration!
