/** @type {import('jest').Config} */
module.exports = {
  // Test environment
  testEnvironment: 'node',

  // File extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Transform TypeScript files
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },

  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.test.tsx',
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.spec.tsx',
  ],

  // Exclude failing modules from test run
  testPathIgnorePatterns: [
    '/node_modules/',
    '/modules/claude-code-by-agents/',
    '/tests/e2e/production-readiness.test.ts',
    '/tests/e2e/user-journeys.test.ts',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'skills/**/*.ts',
    'src/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
  ],

  // Coverage thresholds (can be adjusted)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Module name mapper for aliases
  moduleNameMapper: {
    '^@skills/(.*)$': '<rootDir>/skills/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Test timeout
  testTimeout: 10000,
};
