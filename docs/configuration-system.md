# Configuration Management System

## Overview

The Life OS configuration system provides a robust, type-safe approach to managing application settings, paths, integrations, and templates. It uses environment variables for configuration with sensible defaults and comprehensive validation.

## Architecture

### Core Components

1. **src/types/config.ts** - TypeScript type definitions
2. **src/config/index.ts** - Main configuration loader
3. **src/config/paths.ts** - Path management and utilities
4. **src/config/integrations.ts** - External service integrations
5. **src/config/templates.ts** - Template configuration

## Configuration Structure

```typescript
{
  env: 'development' | 'production' | 'test',
  appName: string,
  version: string,
  paths: PathConfig,
  integrations: IntegrationConfig,
  templates: TemplateConfig,
  logging: LoggingConfig,
  features: FeatureFlags
}
```

## Usage

### Basic Usage

```typescript
import { getConfig } from './config';

// Get configuration
const config = getConfig();

console.log(config.paths.memoryBase);
console.log(config.integrations.todoist.enabled);
```

### With Utilities

```typescript
import { getConfigWithUtils } from './config';

const { config, pathUtils, integrationUtils, templateUtils } = getConfigWithUtils();

// Use path utilities
const dailyNotePath = pathUtils.getDailyNotePath();
const projectPath = pathUtils.getProjectPath('My Project');

// Check integrations
const isTodoistAvailable = integrationUtils.isTodoistAvailable();
const availableIntegrations = integrationUtils.getAvailableIntegrations();

// Work with templates
const templatePath = templateUtils.getTemplatePath('dailyNote');
const content = templateUtils.replaceVariables(template, { date: '2024-01-20' });
```

### Loading Configuration

```typescript
import { loadConfig } from './config';

// Load with options
const config = loadConfig({
  ensureDirs: true,    // Create missing directories
  printSummary: true   // Print configuration summary
});
```

## Environment Variables

### Required Variables

None - all variables have sensible defaults

### Optional Variables

#### Application Settings
- `NODE_ENV` - Environment (development/production/test)
- `APP_NAME` - Application name (default: "Life OS")
- `APP_VERSION` - Application version (default: "1.0.0")

#### Paths
- `LIFE_OS_MEMORY_PATH` - Base directory for memory storage (default: ./memory)
- `LIFE_OS_TEMPLATES_PATH` - Template directory (default: ./templates)
- `LOG_DIRECTORY` - Log file directory (default: ./logs)

#### Integrations
- `TODOIST_API_KEY` - Todoist API key
- `TODOIST_PROJECT_ID` - Default project ID
- `TODOIST_INBOX_PROJECT_ID` - Inbox project ID
- `GOOGLE_EMAIL` - Google account email
- `GOOGLE_CALENDAR_ID` - Calendar ID (default: "primary")
- `GOOGLE_DRIVE_FOLDER` - Drive folder ID
- `WHATSAPP_MCP_ENABLED` - Enable WhatsApp (true/false)
- `WHATSAPP_MCP_SERVER` - WhatsApp MCP server URL

#### Logging
- `LOG_LEVEL` - Logging level (debug/info/warn/error, default: info)
- `ENABLE_FILE_LOGGING` - Enable file logging (true/false)

#### Features
- `ENABLE_AI` - Enable AI features (default: true)
- `ENABLE_NOTIFICATIONS` - Enable notifications (default: false)
- `ENABLE_SYNC` - Enable sync features (default: false)

## Path Utilities

The `PathUtils` class provides methods for working with file paths:

```typescript
const pathUtils = new PathUtils(config.paths);

// Daily notes
const today = pathUtils.getDailyNotePath();
const specific = pathUtils.getDailyNotePath(new Date('2024-01-20'));

// Reviews
const weekly = pathUtils.getWeeklyReviewPath();
const monthly = pathUtils.getMonthlyReviewPath();
const yearly = pathUtils.getYearlyReviewPath();

// Projects and areas
const project = pathUtils.getProjectPath('My Project');
const area = pathUtils.getAreaPath('Health');

// Inbox
const inbox = pathUtils.getInboxPath('Quick Note');

// Archive
const archived = pathUtils.getArchivePath('Old Project');

// Resources
const resource = pathUtils.getResourcePath('Article', 'reading');
```

## Integration Utilities

The `IntegrationUtils` class helps check integration availability:

```typescript
const integrationUtils = new IntegrationUtils(config.integrations);

// Check availability
if (integrationUtils.isTodoistAvailable()) {
  // Use Todoist API
}

// Get status
const status = integrationUtils.getIntegrationStatus();
// { todoist: true, google: false, whatsapp: false }

// Get configuration messages
const messages = integrationUtils.getConfigurationMessages();
messages.forEach(msg => console.log(msg));
```

## Template Utilities

The `TemplateUtils` class helps work with templates:

```typescript
const templateUtils = new TemplateUtils(config.templates);

// Get template path
const dailyTemplate = templateUtils.getTemplatePath('dailyNote');

// Replace variables
const content = templateUtils.replaceVariables(
  '# Daily Note - {{date}}\n\n## Tasks\n{{tasks}}',
  {
    date: '2024-01-20',
    tasks: '- [ ] Task 1\n- [ ] Task 2'
  }
);

// Get defaults
const tags = templateUtils.getDefaultTags('daily');
const status = templateUtils.getDefaultStatus('project');
```

## Template Variables

Available template variables:

### Date Variables
- `{{date}}` - Current date
- `{{week}}` - Week number
- `{{month}}` - Month
- `{{year}}` - Year
- `{{time}}` - Current time
- `{{timestamp}}` - ISO timestamp

### Content Variables
- `{{title}}` - Title
- `{{description}}` - Description
- `{{tags}}` - Tags
- `{{status}}` - Status
- `{{priority}}` - Priority

### Reference Variables
- `{{project}}` - Project reference
- `{{area}}` - Area reference
- `{{goal}}` - Goal reference

### User Variables
- `{{name}}` - User name
- `{{email}}` - User email

## Error Handling

The configuration system provides detailed error messages:

```typescript
try {
  const config = loadConfig();
} catch (error) {
  if (error instanceof ConfigValidationError) {
    console.error(`Field: ${error.field}`);
    console.error(`Message: ${error.message}`);
    console.error(`Fix: ${error.details}`);
  }
}
```

## Testing

For testing, you can reset the configuration:

```typescript
import { resetConfig } from './config';

afterEach(() => {
  resetConfig(); // Reset singleton for next test
});
```

## Directory Structure

The configuration system manages these directories:

```
memory/
├── inbox/           # Unprocessed items
├── projects/        # Active projects
├── areas/          # Areas of responsibility
├── resources/      # Reference materials
├── archive/        # Archived items
├── daily/          # Daily notes
├── weekly/         # Weekly reviews
├── monthly/        # Monthly reviews
└── yearly/         # Yearly reviews

templates/          # Template files
skills/             # Skill definitions
logs/              # Application logs (if enabled)
```

## Best Practices

1. **Use Singleton Pattern**: Use `getConfig()` for consistent configuration
2. **Use Utility Classes**: Leverage PathUtils, IntegrationUtils, TemplateUtils
3. **Check Integration Availability**: Always check if integrations are available before using
4. **Handle Errors**: Catch and handle ConfigValidationError appropriately
5. **Use Type Safety**: Leverage TypeScript types for configuration
6. **Environment Variables**: Use .env files for local development
7. **Validation**: Let the system validate configuration at startup

## Example Configuration Flow

```typescript
// 1. Load configuration
import { loadConfig, PathUtils, IntegrationUtils } from './config';

// 2. Initialize
const config = loadConfig({
  ensureDirs: true,    // Create directories
  printSummary: true   // Show configuration
});

// 3. Create utilities
const pathUtils = new PathUtils(config.paths);
const integrationUtils = new IntegrationUtils(config.integrations);

// 4. Use configuration
const dailyNote = pathUtils.getDailyNotePath();

if (integrationUtils.isTodoistAvailable()) {
  // Sync with Todoist
}

// 5. Access typed configuration
console.log(config.features.enableAI);
console.log(config.logging.level);
```

## Summary

The configuration system provides:

- ✅ Type-safe configuration
- ✅ Environment variable loading
- ✅ Sensible defaults
- ✅ Comprehensive validation
- ✅ Helpful error messages
- ✅ Path utilities
- ✅ Integration management
- ✅ Template handling
- ✅ Directory management
- ✅ Singleton pattern for consistency
