# Todoist Integration Tests

Comprehensive test suite for the Todoist integration module, ensuring reliable synchronization between Life OS and Todoist.

## Test Structure

### Unit Tests

#### `client.test.ts`
Tests for the Todoist API client:
- Authentication and API token handling
- CRUD operations (create, read, update, delete tasks)
- Rate limiting and backoff strategies
- Network error handling and retries
- Request deduplication
- Sync token support

**Coverage:** 95%+ of client code

#### `sync.test.ts`
Tests for the sync engine:
- Local to remote synchronization
- Remote to local synchronization
- Bidirectional sync
- Conflict detection
- Sync state persistence
- Offline queue management
- Batch operations

**Coverage:** 90%+ of sync engine code

#### `mapper.test.ts`
Tests for data mapping:
- Life OS → Todoist conversion
- Todoist → Life OS conversion
- Priority mapping
- Context tag transformation
- Date format conversion
- Custom field handling
- Bidirectional consistency

**Coverage:** 95%+ of mapper code

#### `conflict-resolver.test.ts`
Tests for conflict resolution:
- Conflict detection algorithms
- Resolution strategies (local-wins, remote-wins, latest-timestamp, field-level-merge)
- Deletion conflicts
- Conflict history and replay
- Merge algorithms
- Custom resolution rules

**Coverage:** 90%+ of conflict resolver code

### Integration Tests

#### `todoist-full-cycle.test.ts`
End-to-end tests for complete sync cycles:
- Happy path scenarios (no conflicts)
- Concurrent modification handling
- Network failure recovery
- Performance benchmarks (50+ tasks)
- Data integrity verification
- Incremental sync with tokens

**Requirements:**
- Valid Todoist API token (set `TODOIST_API_TOKEN` env var)
- Network connectivity
- Cleanup after each test

## Running Tests

### All Todoist Tests
```bash
npm run test:todoist
```

### Specific Test Suites
```bash
# Client tests only
npm test -- tests/integrations/todoist/client.test.ts

# Sync engine tests
npm test -- tests/integrations/todoist/sync.test.ts

# Mapper tests
npm test -- tests/integrations/todoist/mapper.test.ts

# Conflict resolution tests
npm test -- tests/integrations/todoist/conflict-resolver.test.ts

# E2E integration tests (requires API token)
TODOIST_API_TOKEN=your-token npm test -- tests/integration/todoist-full-cycle.test.ts
```

### With Coverage
```bash
npm run test:todoist -- --coverage
```

### Watch Mode
```bash
npm run test:todoist -- --watch
```

### Debug Mode
```bash
DEBUG=1 npm run test:todoist
```

## Test Configuration

### Environment Variables
- `TODOIST_API_TOKEN` - Required for integration tests
- `DEBUG=1` - Enable console output during tests
- `NODE_ENV=test` - Automatically set by test runner

### Coverage Thresholds
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## Test Scenarios

### Happy Path
- ✅ Create task locally → Sync to Todoist
- ✅ Modify in Todoist → Sync to local
- ✅ Complete task → Sync status
- ✅ Delete task → Remove from both sides

### Conflict Handling
- ✅ Concurrent modifications (both sides changed)
- ✅ Deletion conflicts (one deleted, one modified)
- ✅ Field-level conflicts (different fields changed)
- ✅ Resolution strategies working correctly

### Error Scenarios
- ✅ Network timeout handling
- ✅ Authentication failures
- ✅ Rate limiting (429 errors)
- ✅ Invalid data validation
- ✅ Offline operation queueing

### Performance
- ✅ Batch sync of 50+ tasks < 30s
- ✅ Incremental sync using tokens
- ✅ Efficient conflict detection
- ✅ Memory usage stays reasonable

### Edge Cases
- ✅ Empty task lists
- ✅ Maximum field lengths
- ✅ Invalid date formats
- ✅ Malformed API responses
- ✅ Concurrent sync attempts

## Mocking Strategy

### Unit Tests
- Mock `fetch` globally for API calls
- Mock `LocalTaskStore` for storage operations
- Use in-memory SQLite (`:memory:`) for tests
- No real API calls in unit tests

### Integration Tests
- Real Todoist API (requires token)
- In-memory SQLite for local storage
- Actual network requests
- Cleanup test data after each test

## Best Practices

1. **Isolation**: Each test is independent
2. **Cleanup**: Always remove test data
3. **Naming**: Use `[TEST]` prefix for tasks
4. **Timeouts**: Set appropriate timeouts (30s for integration)
5. **Coverage**: Maintain >80% coverage
6. **Documentation**: Comment complex scenarios
7. **Performance**: Monitor sync durations

## Debugging Failed Tests

### Check API Token
```bash
echo $TODOIST_API_TOKEN
```

### View Detailed Output
```bash
DEBUG=1 npm test -- tests/integrations/todoist/client.test.ts --verbose
```

### Run Single Test
```bash
npm test -- -t "should fetch all tasks successfully"
```

### Check Coverage Report
```bash
npm run test:todoist -- --coverage
open coverage/lcov-report/index.html
```

## Contributing

When adding new features to the Todoist integration:

1. Write tests FIRST (TDD)
2. Ensure all existing tests pass
3. Add new test cases for new scenarios
4. Update this README if adding new test files
5. Maintain coverage thresholds

## Troubleshooting

### Tests timing out
- Increase timeout in test file: `jest.setTimeout(60000)`
- Check network connectivity
- Verify API token is valid

### Flaky tests
- Check for race conditions
- Add proper async/await
- Use `waitFor` helper for timing-sensitive tests

### Coverage drops
- Add tests for uncovered lines
- Check if new code needs tests
- Review coverage report for gaps

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Todoist API Docs](https://developer.todoist.com/rest/v2/)
- [Testing Best Practices](../../../docs/testing-guide.md)
