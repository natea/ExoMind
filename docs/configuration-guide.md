# Life OS Configuration Guide

Complete guide to configuring Life OS for your personal needs.

## Overview

Life OS uses a layered configuration system that merges settings from multiple sources:

1. **Default settings** - Built-in defaults in `src/config/defaults.ts`
2. **Environment variables** - From `.env` and `.env.local` files
3. **Configuration files** - JSON files in `.claude/` directory
4. **Runtime overrides** - Programmatic configuration changes

## Quick Start

### 1. Create Local Configuration

Copy the template to create your local settings:

```bash
cp .claude/settings.local.json.example .claude/settings.local.json
```

### 2. Set Environment Variables

Create a `.env.local` file in the project root:

```bash
# API Keys (REQUIRED)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional API Keys
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# User Information
USER_NAME="Your Name"
USER_EMAIL=your.email@example.com
USER_TIMEZONE=America/New_York

# System Settings
DEBUG=false
LOG_LEVEL=info

# Integration Settings
WHATSAPP_ENABLED=false
WHATSAPP_DEFAULT_RECIPIENT=1234567890
```

### 3. Customize Settings

Edit `.claude/settings.local.json` to customize your preferences.

## Configuration Sections

### User Preferences

Personal information and preferences:

```json
{
  "user": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "timezone": "America/New_York",
    "language": "en",
    "notifications": {
      "email": false,
      "push": false,
      "whatsapp": false
    },
    "dietary": {
      "vegetarian": false,
      "vegan": false,
      "glutenFree": false,
      "allergies": ["peanuts", "shellfish"],
      "dislikes": ["cilantro", "olives"]
    }
  }
}
```

**Fields:**
- `name`: Your full name
- `email`: Your email address
- `timezone`: IANA timezone (e.g., "America/New_York")
- `language`: ISO language code (e.g., "en", "es")
- `notifications`: Enable/disable notification channels
- `dietary`: Food preferences and restrictions

### Skill Configuration

Enable and configure skills:

```json
{
  "skills": {
    "enabled": {
      "meal_planning": true,
      "recipe-finding": true,
      "grocery-shopping": true,
      "whatsapp-message-management": true,
      "personality_assessment": false
    },
    "settings": {
      "meal_planning": {
        "weeklyPlanDay": "sunday",
        "mealsPerWeek": 7,
        "servingsPerMeal": 2,
        "maxBudget": 200,
        "cuisinePreferences": ["italian", "mexican"]
      },
      "grocery-shopping": {
        "checkPantry": true,
        "consolidateIngredients": true,
        "preferredStores": ["costco", "instacart"]
      }
    },
    "autoLoad": true
  }
}
```

**Available Skills:**
- `meal_planning` - Weekly meal planning and recipe selection
- `recipe-finding` - Recipe search and portion adjustment
- `grocery-shopping` - Shopping list generation and automation
- `whatsapp-message-management` - WhatsApp integration and briefings
- `personality_assessment` - Interaction style adaptation

### Integration Settings

Configure external service integrations:

```json
{
  "integrations": {
    "whatsapp": {
      "enabled": true,
      "autoSend": false,
      "defaultRecipient": "1234567890"
    },
    "calendar": {
      "enabled": true,
      "provider": "google",
      "syncInterval": 3600
    },
    "shopping": {
      "costcoEnabled": true,
      "instacartEnabled": true,
      "defaultStore": "costco"
    }
  }
}
```

**WhatsApp:**
- `enabled`: Enable WhatsApp integration
- `autoSend`: Automatically send briefings
- `defaultRecipient`: Default phone number (without +)

**Calendar:**
- `enabled`: Enable calendar integration
- `provider`: "google", "outlook", or "apple"
- `syncInterval`: Sync frequency in seconds

**Shopping:**
- `costcoEnabled`: Enable Costco automation
- `instacartEnabled`: Enable Instacart automation
- `defaultStore`: Preferred shopping method

### API Configuration

Configure API keys and settings:

```json
{
  "api": {
    "anthropic": {
      "model": "claude-sonnet-4-5-20250929",
      "maxTokens": 4096,
      "temperature": 0.7
    },
    "openai": {
      "model": "gpt-4"
    }
  }
}
```

**Note:** API keys should be set in environment variables, not in configuration files.

**Anthropic:**
- `model`: Claude model to use
- `maxTokens`: Maximum tokens per request
- `temperature`: Response randomness (0-1)

**OpenAI (optional):**
- `model`: GPT model to use

### Memory Configuration

Configure persistent memory:

```json
{
  "memory": {
    "databasePath": "./.swarm/memory.db",
    "persistent": true,
    "retentionDays": 90,
    "compression": true
  }
}
```

**Fields:**
- `databasePath`: Path to SQLite database
- `persistent`: Enable cross-session memory
- `retentionDays`: How long to keep memories
- `compression`: Enable memory compression

### System Settings

System-level configuration:

```json
{
  "system": {
    "debug": false,
    "logLevel": "info",
    "telemetry": false,
    "autoUpdate": true
  }
}
```

**Fields:**
- `debug`: Enable debug mode
- `logLevel`: "error", "warn", "info", or "debug"
- `telemetry`: Send anonymous usage data
- `autoUpdate`: Auto-update dependencies

## Configuration Priority

Settings are merged in this order (later overrides earlier):

1. Built-in defaults (`src/config/defaults.ts`)
2. Environment-specific defaults (dev/test/prod)
3. `.env` file
4. `.claude/settings.json`
5. `.claude/settings.local.json`
6. `.env.local` file (highest priority)

## Environment Variables

### Required Variables

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### Optional Variables

```bash
# Additional APIs
OPENAI_API_KEY=sk-xxxxx
GOOGLE_API_KEY=xxxxx
GOOGLE_SEARCH_ENGINE_ID=xxxxx

# User Info
USER_NAME="John Doe"
USER_EMAIL=john@example.com
USER_TIMEZONE=America/New_York

# System
DEBUG=true
LOG_LEVEL=debug
NODE_ENV=development

# Memory
MEMORY_PATH=./.swarm/memory.db

# Integrations
WHATSAPP_ENABLED=true
WHATSAPP_DEFAULT_RECIPIENT=1234567890
```

## Skill-Specific Settings

### Meal Planning

```json
{
  "meal_planning": {
    "weeklyPlanDay": "sunday",
    "mealsPerWeek": 7,
    "servingsPerMeal": 2,
    "maxBudget": 200,
    "cuisinePreferences": ["italian", "mexican", "thai"],
    "avoidRepeatDays": 3,
    "generateShoppingList": true
  }
}
```

### Recipe Finding

```json
{
  "recipe-finding": {
    "defaultServings": 2,
    "preferredSources": ["allrecipes", "foodnetwork", "seriouseats"],
    "maxPrepTime": 60,
    "maxCookTime": 90
  }
}
```

### Grocery Shopping

```json
{
  "grocery-shopping": {
    "consolidationRules": {
      "roundUp": true,
      "preferLargerPackages": true,
      "bulkThreshold": 3
    },
    "automationPreferences": {
      "autoCheckout": false,
      "savePreferences": true
    }
  }
}
```

### WhatsApp Management

```json
{
  "whatsapp-message-management": {
    "briefingFormat": "summary",
    "includeTasks": true,
    "includeReminders": true,
    "maxMessagesPerBriefing": 10,
    "messageRetention": 30
  }
}
```

## Programmatic Access

### Load Configuration

```typescript
import { getConfig } from './src/config/loader';

const config = getConfig();
const settings = config.getSettings();
```

### Get Specific Setting

```typescript
const apiKey = config.get<string>('api.anthropic.apiKey');
const timezone = config.get<string>('user.timezone');
const enabled = config.get<boolean>('skills.enabled.meal_planning');
```

### Update Setting

```typescript
config.set('user.timezone', 'America/Los_Angeles');
config.set('skills.enabled.meal_planning', true);
```

### Save Configuration

```typescript
import { exportConfig } from './src/config/loader';

// Save to file
exportConfig('.claude/settings.local.json');
```

### Reload Configuration

```typescript
import { reloadConfig } from './src/config/loader';

const newSettings = reloadConfig();
```

## Validation

Configuration is automatically validated on load. Common errors:

### Missing API Key

```
⚠ Configuration warnings:
  - Anthropic API key not configured
```

**Fix:** Set `ANTHROPIC_API_KEY` in `.env.local`

### Invalid Email

```
❌ Configuration validation failed:
  - Invalid email format
```

**Fix:** Use valid email format in `user.email`

### Invalid Temperature

```
❌ Configuration validation failed:
  - Temperature must be between 0 and 1
```

**Fix:** Set `api.anthropic.temperature` between 0 and 1

## Best Practices

### 1. Use Environment Variables for Secrets

✅ **DO:**
```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

❌ **DON'T:**
```json
{
  "api": {
    "anthropic": {
      "apiKey": "sk-ant-xxxxx"
    }
  }
}
```

### 2. Keep Local Settings Private

Add to `.gitignore`:
```
.env.local
.claude/settings.local.json
```

### 3. Document Custom Settings

Add comments in your local settings:
```json
{
  "user": {
    "dietary": {
      "allergies": ["peanuts"],
      "_comment": "Updated after allergy test on 2025-01-15"
    }
  }
}
```

### 4. Use Environment-Specific Configs

```bash
# Development
NODE_ENV=development npm start

# Production
NODE_ENV=production npm start
```

### 5. Validate After Changes

```typescript
import { SettingsValidator } from './src/config/settings';

const validation = SettingsValidator.validate(settings);
if (!validation.valid) {
  console.error(validation.errors);
}
```

## Troubleshooting

### Configuration Not Loading

**Problem:** Settings file exists but isn't being applied

**Solution:**
1. Check file path is correct
2. Verify JSON syntax is valid
3. Check file permissions
4. Review merge priority order

### Environment Variables Not Working

**Problem:** `.env` variables not being read

**Solution:**
1. Ensure `.env` is in project root
2. Restart the application
3. Check for typos in variable names
4. Verify `.env.local` isn't overriding

### Validation Errors

**Problem:** Configuration validation fails

**Solution:**
1. Review error messages carefully
2. Check data types match schema
3. Verify required fields are present
4. Use validation before saving

## Examples

### Minimal Configuration

```json
{
  "user": {
    "timezone": "America/New_York",
    "language": "en"
  },
  "skills": {
    "enabled": {
      "meal_planning": true,
      "recipe-finding": true
    }
  }
}
```

### Full Configuration

```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "timezone": "America/New_York",
    "language": "en",
    "notifications": {
      "email": true,
      "push": false,
      "whatsapp": true
    },
    "dietary": {
      "vegetarian": false,
      "vegan": false,
      "glutenFree": true,
      "allergies": ["peanuts", "shellfish"],
      "dislikes": ["cilantro"]
    }
  },
  "skills": {
    "enabled": {
      "meal_planning": true,
      "recipe-finding": true,
      "grocery-shopping": true,
      "whatsapp-message-management": true
    },
    "settings": {
      "meal_planning": {
        "weeklyPlanDay": "sunday",
        "mealsPerWeek": 7,
        "servingsPerMeal": 2,
        "maxBudget": 200,
        "cuisinePreferences": ["italian", "mexican", "thai"]
      }
    }
  },
  "integrations": {
    "whatsapp": {
      "enabled": true,
      "autoSend": false
    },
    "calendar": {
      "enabled": true,
      "provider": "google",
      "syncInterval": 3600
    },
    "shopping": {
      "costcoEnabled": true,
      "instacartEnabled": true,
      "defaultStore": "costco"
    }
  },
  "system": {
    "debug": false,
    "logLevel": "info"
  }
}
```

## Related Documentation

- [Skills Documentation](./skills-overview.md)
- [Integration Guide](./integrations/integration-guide.md)
- [API Reference](./api-reference.md)
- [Development Setup](../README.md)

## Support

For issues or questions:
1. Check this guide first
2. Review error messages
3. Check GitHub issues
4. Create new issue with configuration details (remove sensitive data)
