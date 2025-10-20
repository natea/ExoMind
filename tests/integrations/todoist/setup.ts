/**
 * Test Setup for Todoist Integration Tests
 */

// Extend Jest matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Global test setup
beforeAll(() => {
  // Silence console during tests unless debugging
  if (!process.env.DEBUG) {
    global.console = {
      ...console,
      log: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      // Keep error for important failures
    };
  }
});

// Global test teardown
afterAll(() => {
  // Cleanup any hanging resources
  jest.clearAllTimers();
});

// Mock environment variables for tests
process.env.NODE_ENV = 'test';

// Setup test database
export const setupTestDatabase = async () => {
  // Helper for integration tests
  return {
    url: ':memory:',
    name: 'test-db',
  };
};

// Mock Todoist API responses
export const mockTodoistResponses = {
  task: {
    id: 'todoist-123',
    content: 'Test task',
    description: '',
    priority: 1,
    labels: [],
    project_id: 'inbox',
    created_at: '2025-10-20T10:00:00Z',
  },
  project: {
    id: 'proj-123',
    name: 'Test Project',
    color: 'blue',
    parent_id: null,
    order: 1,
    is_favorite: false,
  },
};

// Helper to create test task
export const createTestTask = (overrides = {}) => ({
  id: `local-${Date.now()}`,
  title: 'Test task',
  status: 'todo',
  priority: 2,
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Helper to create test Todoist task
export const createTestTodoistTask = (overrides = {}) => ({
  id: `todoist-${Date.now()}`,
  content: 'Test task',
  priority: 1,
  labels: [],
  created_at: new Date().toISOString(),
  ...overrides,
});

// Helper for async testing
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper to assert async throws
export const expectAsyncThrow = async (
  fn: () => Promise<any>,
  errorMessage?: string
) => {
  try {
    await fn();
    throw new Error('Expected function to throw');
  } catch (error) {
    if (errorMessage) {
      expect((error as Error).message).toContain(errorMessage);
    }
  }
};
