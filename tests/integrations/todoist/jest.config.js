module.exports = {
  displayName: 'todoist-integration',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    '../../../src/integrations/todoist/**/*.ts',
    '!../../../src/integrations/todoist/**/*.d.ts',
    '!../../../src/integrations/todoist/types.ts',
  ],
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  testTimeout: 30000,
  verbose: true,
};
