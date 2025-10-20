# Configuration Management System

Type-safe configuration management for Life OS with environment variable support, validation, and local overrides.

## Quick Start

```typescript
import { getConfig } from './config/loader';

// Get configuration instance
const config = getConfig();
const settings = config.getSettings();

// Access specific settings
const apiKey = config.get<string>('api.anthropic.apiKey');
const timezone = config.get<string>('user.timezone');
```

## Architecture

### Files

- **`settings.ts`** - TypeScript interfaces and validation
- **`defaults.ts`** - Default configuration values
- **`loader.ts`** - Configuration loading and merging logic

### Configuration Sources (Priority Order)

1. Built-in defaults (`defaults.ts`)
2. Environment-specific defaults (dev/test/prod)
3. `.env` file
4. `.claude/settings.json`
5. `.claude/settings.local.json`
6. `.env.local` file (highest priority)

## Key Features

### Type Safety

```typescript
import { LifeOSSettings } from './config/settings';

const settings: LifeOSSettings = config.getSettings();
// TypeScript ensures all required fields are present
```

### Validation

```typescript
import { SettingsValidator } from './config/settings';

const validation = SettingsValidator.validate(settings);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}
```

### Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxx
USER_TIMEZONE=America/New_York
DEBUG=true
```

Environment variables automatically override file-based settings.

### Deep Merging

Settings from multiple sources are deeply merged, allowing partial overrides:

```json
// .claude/settings.json
{
  "user": {
    "timezone": "UTC",
    "language": "en"
  }
}

// .claude/settings.local.json
{
  "user": {
    "timezone": "America/New_York"
  }
}

// Result: { user: { timezone: "America/New_York", language: "en" } }
```

## Usage Examples

### Load Configuration

```typescript
import { getConfig } from './config/loader';

const config = getConfig();
const settings = config.getSettings();
```

### Get Setting by Path

```typescript
// Dot notation for nested values
const model = config.get<string>('api.anthropic.model');
const enabled = config.get<boolean>('skills.enabled.meal_planning');
const dietary = config.get<object>('user.dietary');
```

### Update Setting

```typescript
config.set('user.timezone', 'America/Los_Angeles');
config.set('skills.enabled.meal_planning', true);
config.set('api.anthropic.temperature', 0.8);
```

### Save Configuration

```typescript
import { exportConfig } from './config/loader';

// Save current settings to file
exportConfig('.claude/settings.local.json');
```

### Reload Configuration

```typescript
import { reloadConfig } from './config/loader';

// Reload from all sources
const newSettings = reloadConfig();
```

## Configuration Sections

### User Preferences

Personal information and preferences:

```typescript
interface UserPreferences {
  name?: string;
  email?: string;
  timezone: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    whatsapp: boolean;
  };
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    allergies: string[];
    dislikes: string[];
  };
}
```

### Skill Configuration

Enable and configure Life OS skills:

```typescript
interface SkillConfig {
  enabled: Record<string, boolean>;
  settings: Record<string, Record<string, unknown>>;
  autoLoad: boolean;
}
```

### Integration Settings

External service integrations:

```typescript
interface IntegrationConfig {
  whatsapp: {
    enabled: boolean;
    autoSend: boolean;
    defaultRecipient?: string;
  };
  calendar: {
    enabled: boolean;
    provider: 'google' | 'outlook' | 'apple';
    syncInterval: number;
  };
  shopping: {
    costcoEnabled: boolean;
    instacartEnabled: boolean;
    defaultStore: 'costco' | 'instacart' | 'manual';
  };
}
```

### API Configuration

API keys and settings:

```typescript
interface APIConfig {
  anthropic: {
    apiKey?: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  openai?: {
    apiKey?: string;
    model: string;
  };
  google?: {
    apiKey?: string;
    searchEngineId?: string;
  };
}
```

### Memory Settings

Persistent memory configuration:

```typescript
interface MemoryConfig {
  databasePath: string;
  persistent: boolean;
  retentionDays: number;
  compression: boolean;
}
```

### System Settings

System-level configuration:

```typescript
interface SystemConfig {
  debug: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  telemetry: boolean;
  autoUpdate: boolean;
}
```

## Validation

### Automatic Validation

Configuration is automatically validated on load. Validation checks:

- Required fields are present
- Data types match schema
- Values are within valid ranges
- Email format is valid
- Dependencies are met

### Manual Validation

```typescript
import { SettingsValidator } from './config/settings';

const result = SettingsValidator.validate(settings);

if (!result.valid) {
  // Handle errors
  result.errors.forEach(error => console.error(error));
}

if (result.warnings.length > 0) {
  // Handle warnings
  result.warnings.forEach(warning => console.warn(warning));
}
```

## Environment-Specific Defaults

Different defaults for different environments:

```typescript
// Development
{
  system: {
    debug: true,
    logLevel: 'debug',
  },
  memory: {
    databasePath: './.swarm/memory-dev.db',
  }
}

// Production
{
  system: {
    debug: false,
    logLevel: 'warn',
    telemetry: true,
  },
  memory: {
    compression: true,
    retentionDays: 180,
  }
}
```

Set via `NODE_ENV` environment variable.

## Security Best Practices

### API Keys

❌ **DON'T** store in config files:
```json
{
  "api": {
    "anthropic": {
      "apiKey": "sk-ant-xxxxx"
    }
  }
}
```

✅ **DO** use environment variables:
```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### Sensitive Data

Always use `.env.local` for:
- API keys
- Passwords
- Tokens
- Personal information

Add to `.gitignore`:
```
.env.local
.claude/settings.local.json
```

## Testing

### Test Configuration

```typescript
// Use in-memory database for tests
const testSettings = {
  memory: {
    databasePath: ':memory:',
    persistent: false,
  },
  system: {
    logLevel: 'error',
  },
};
```

### Mock Configuration

```typescript
// Create mock config for testing
const mockConfig = new ConfigLoader();
mockConfig.set('api.anthropic.apiKey', 'test-key');
mockConfig.set('user.timezone', 'UTC');
```

## Common Patterns

### Conditional Features

```typescript
const config = getConfig();

if (config.get<boolean>('integrations.whatsapp.enabled')) {
  // Initialize WhatsApp integration
}

if (config.get<boolean>('system.debug')) {
  // Enable debug logging
}
```

### Skill Loading

```typescript
const skillSettings = config.get<SkillConfig>('skills');

if (skillSettings.autoLoad) {
  for (const [skillName, enabled] of Object.entries(skillSettings.enabled)) {
    if (enabled) {
      loadSkill(skillName, skillSettings.settings[skillName]);
    }
  }
}
```

### Dynamic Updates

```typescript
// Update setting at runtime
config.set('user.timezone', newTimezone);

// Save to file
exportConfig('.claude/settings.local.json');

// Reload from all sources
reloadConfig();
```

## Troubleshooting

### Configuration Not Loading

**Problem:** Settings file exists but isn't being applied

**Check:**
1. File path is correct
2. JSON syntax is valid
3. File permissions allow reading
4. Priority order (later sources override earlier)

### Validation Errors

**Problem:** Configuration validation fails

**Solution:**
1. Review error messages
2. Check data types match schema
3. Verify required fields
4. Use TypeScript for type safety

### Environment Variables Not Working

**Problem:** `.env` variables not being read

**Check:**
1. File is in project root
2. Variable names are correct
3. Application has been restarted
4. `.env.local` isn't overriding

## Related Documentation

- [Full Configuration Guide](../../docs/configuration-guide.md)
- [Skills Documentation](../../docs/skills-overview.md)
- [Integration Guide](../../docs/integrations/integration-guide.md)

## API Reference

See TypeScript interfaces in `settings.ts` for complete API documentation.
