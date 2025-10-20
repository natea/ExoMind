# ExoMind Life OS - Project Structure

## Overview
This document describes the project structure for the Life OS Skills implementation in ExoMind.

## Directory Structure

```
ExoMind/
├── .env.example              # Environment configuration template
├── .env.test                 # Test environment configuration
├── package.json              # NPM package configuration
├── tsconfig.json            # TypeScript configuration
├── jest.config.js           # Jest testing framework configuration
│
├── scripts/                 # Utility scripts
│   └── validate-structure.ts # Project structure validation tool
│
├── skills/                  # Life OS Skills
│   ├── using-life-os/      # Getting started with Life OS
│   ├── conducting-life-assessment/  # Life assessment and reflection
│   ├── daily-planning/     # Daily planning and scheduling
│   ├── weekly-review/      # Weekly review and reflection
│   ├── goal-setting/       # Goal setting and tracking
│   └── processing-inbox/   # Inbox processing and task management
│
├── tests/                   # Test suites
│   ├── setup.ts            # Jest global setup
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   ├── skills/             # Skill-specific tests
│   │   └── skill-structure.test.ts
│   └── utils/              # Test utilities
│       └── skill-validator.ts
│
├── memory/                  # Runtime memory storage (git-ignored)
│   └── test/               # Test memory storage
│
└── docs/                    # Documentation
    └── project-structure.md # This file
```

## Configuration Files

### .env.example
Template for environment variables:
- `MEMORY_PATH`: Path to memory storage directory
- Optional integrations: Todoist, Google Calendar, Notion, Evernote

### jest.config.js
Testing framework configuration:
- TypeScript support via ts-jest
- Path aliases (@skills, @tests, @/)
- Coverage thresholds (70% minimum)
- Test patterns and matching

### tsconfig.json
TypeScript compiler configuration:
- Target: ES2022
- Strict type checking enabled
- Path aliases for clean imports
- Declaration files generation

## Skills Directory

Each skill follows a standard structure:

```
skills/skill-name/
├── README.md          # Skill documentation (required)
├── index.ts           # Main skill implementation (required)
├── examples.md        # Usage examples (optional)
├── templates/         # Templates and prompts (optional)
└── config.json       # Skill configuration (optional)
```

### Standard Life OS Skills

1. **using-life-os**: Introduction and getting started guide
2. **conducting-life-assessment**: Life assessment and reflection workflows
3. **daily-planning**: Daily planning and time blocking
4. **weekly-review**: Weekly review and progress tracking
5. **goal-setting**: Goal setting, OKRs, and milestones
6. **processing-inbox**: Inbox processing and task management

## Testing Framework

### Test Structure
```
tests/
├── setup.ts                 # Global test configuration
├── unit/                    # Unit tests for individual components
├── integration/             # Integration tests for workflows
├── skills/                  # Skill validation tests
│   └── skill-structure.test.ts
└── utils/                   # Test utilities and helpers
    └── skill-validator.ts
```

### Test Utilities

**skill-validator.ts** provides:
- `validateSkillStructure()`: Validate skill directory structure
- `validateSkillExports()`: Validate skill module exports
- `createMockSkillContext()`: Create mock context for testing
- `createTestSkill()`: Generate test skills

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run skill-specific tests
npm run test:skills
```

## Validation Scripts

### Structure Validation
```bash
# Validate project structure
npm run validate-structure

# Validate and repair (create missing directories)
npm run validate-structure:repair
```

The validator checks for:
- Required directories (skills, tests, scripts)
- Life OS skill directories
- Required configuration files
- Optional files (with warnings)

## Development Workflow

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Validate structure
npm run validate-structure
```

### 2. Skill Development
```bash
# Create new skill directory
mkdir -p skills/new-skill

# Create required files
touch skills/new-skill/README.md
touch skills/new-skill/index.ts

# Run tests
npm test
```

### 3. Testing
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:skills

# Generate coverage report
npm run test:coverage
```

## Memory Storage

### Development
- Location: `./memory`
- Git-ignored (not committed)
- Stores runtime skill state

### Testing
- Location: `./memory/test`
- Automatically cleaned between test runs
- Isolated from development memory

## Integration Points

### Optional Integrations
The system is designed to support these integrations (can be added later):

1. **Todoist**: Task management integration
2. **Google Calendar**: Calendar and scheduling
3. **Notion**: Note-taking and knowledge management
4. **Evernote**: Note-taking alternative

Configuration is handled via environment variables in `.env` file.

## Best Practices

### File Organization
- Keep skills under 500 lines
- Separate concerns (core logic, templates, examples)
- Use TypeScript for type safety
- Document public APIs

### Testing
- Write tests before implementation (TDD)
- Aim for 70%+ coverage
- Test skill structure and exports
- Use mock contexts for isolation

### Environment Safety
- Never hardcode secrets
- Use environment variables
- Keep .env files git-ignored
- Provide .env.example template

## Next Steps

1. Implement individual Life OS skills
2. Create skill templates and examples
3. Build integration adapters
4. Add comprehensive documentation
5. Set up CI/CD pipeline

## Resources

- TypeScript: https://www.typescriptlang.org/
- Jest: https://jestjs.io/
- Life OS Methodology: [Link to methodology docs]

---

Last Updated: Week 1, Day 3 - Project Structure Setup Complete
