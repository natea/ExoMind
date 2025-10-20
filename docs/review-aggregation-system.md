# Review Aggregation System

Complete implementation of the review aggregation system for Life OS.

## Files Created

### 1. Type Definitions
**File:** `/src/types/reviews.ts`

Comprehensive TypeScript interfaces for:
- `DailyLog` - Daily log structure with tasks, wins, notes
- `WeeklyData` - Aggregated weekly data from daily logs
- `WeeklyReview` - Weekly review structure
- `MonthlyData` - Aggregated monthly data from weekly reviews
- `MonthlyReview` - Monthly review structure
- `AggregationResult<T>` - Result wrapper with errors and metadata
- `Pattern` - Detected patterns across reviews
- `Win` - Achievement/win structure
- `Task` - Task item with status and priority
- `AggregationConfig` - Configuration options
- `PeriodStats` - Statistics for a period

### 2. Date Utilities
**File:** `/src/utils/date-helpers.ts`

Date manipulation functions:
- `getISOWeek(date)` - Get ISO week number and year
- `getWeekBounds(year, week)` - Get start/end dates for a week
- `getDatesInWeek(year, week)` - Get all 7 dates in a week
- `getWeeksInMonth(year, month)` - Get all week identifiers in a month
- `formatDate(date)` - Format as YYYY-MM-DD
- `formatWeek(year, week)` - Format as YYYY-Www
- `formatMonth(year, month)` - Format as YYYY-MM
- `parseDate(dateStr)` - Parse date string
- `parseWeek(weekStr)` - Parse week string
- `parseMonth(monthStr)` - Parse month string
- `getMonthName(month)` - Get month name
- `getDayName(date)` - Get day name
- `isToday(date)` - Check if date is today
- `isCurrentWeek(date)` - Check if date is in current week
- `getRelativeDateDescription(date)` - Get relative description
- `getDateRange(start, end)` - Get dates between two dates
- `getDateWithOffset(date, offset)` - Get date with offset

### 3. Markdown Parser
**File:** `/src/utils/markdown-parser.ts`

Markdown parsing utilities:
- `parseFrontMatter(content)` - Extract YAML front matter
- `parseSections(content)` - Parse into hierarchical sections
- `extractTasks(content)` - Extract task lists with status
- `extractWins(content, date, source)` - Extract wins/achievements
- `extractBulletPoints(content)` - Extract list items
- `findSection(sections, pattern)` - Find section by heading (regex support)
- `extractHeadings(content)` - Extract all headings
- `parseTable(content)` - Parse markdown tables
- `stripMarkdown(text)` - Remove markdown formatting
- `getWordCount(content)` - Calculate word count
- `validateMarkdown(content)` - Validate markdown structure

### 4. Review Aggregator
**File:** `/src/utils/review-aggregator.ts`

Core aggregation logic:
- `parseDailyLog(filePath)` - Parse daily log file
- `parseWeeklyReview(filePath)` - Parse weekly review file
- `aggregateDaily(dates, logsDir, config)` - Aggregate daily logs into weekly data
- `aggregateWeekly(weeks, reviewsDir, config)` - Aggregate weekly reviews into monthly data
- `generateWeeklyReview(year, week, logsDir, config)` - Generate weekly review from daily logs
- `generateMonthlyReview(year, month, reviewsDir, config)` - Generate monthly review from weekly reviews

## Features

### Robust Markdown Parsing
- Front matter extraction with type inference
- Hierarchical section organization
- Task list parsing with status and priority
- Win/achievement extraction
- Bullet point extraction
- Table parsing
- Markdown validation

### Smart Deduplication
- Levenshtein distance algorithm
- Configurable similarity threshold (default 0.85)
- Preserves most recent wins
- Handles variations in wording

### Pattern Recognition
- N-gram extraction (2-4 words)
- Common phrase filtering
- Frequency-based detection
- Confidence scoring
- Pattern categorization (productivity, challenge, habit, goal, blocker)

### Statistical Aggregation
- Task completion rates
- Mood and energy trends
- Focus area extraction
- Goal progress tracking
- Period statistics (logging rate, average tasks, etc.)

### Error Handling
- Graceful handling of missing files
- Detailed error reporting with severity levels
- Warning collection for incomplete data
- Processing metadata (time, files processed, errors)

## Configuration Options

```typescript
interface AggregationConfig {
  includeIncomplete?: boolean;        // Default: true
  patternThreshold?: number;          // Default: 2
  deduplicationSimilarity?: number;   // Default: 0.85
  maxWins?: number;                   // Default: 10
  sortBy?: 'date' | 'importance' | 'category';  // Default: 'date'
}
```

## Usage Examples

### Generate Weekly Review
```typescript
import { generateWeeklyReview } from './src/utils/review-aggregator';

const result = generateWeeklyReview(
  2025,                    // year
  42,                      // week number
  '/path/to/life-os',     // logs directory
  {
    maxWins: 15,
    patternThreshold: 3
  }
);

if (result.success) {
  console.log('Weekly Review:', result.data);
  console.log('Wins:', result.data.wins);
  console.log('Patterns:', result.data.aggregatedData.commonPatterns);
}
```

### Generate Monthly Review
```typescript
import { generateMonthlyReview } from './src/utils/review-aggregator';

const result = generateMonthlyReview(
  2025,                    // year
  10,                      // month
  '/path/to/life-os',     // reviews directory
  {
    deduplicationSimilarity: 0.90,
    includeIncomplete: false
  }
);

if (result.success) {
  console.log('Monthly Review:', result.data);
  console.log('Top Wins:', result.data.wins);
  console.log('Insights:', result.data.aggregatedData.insights);
}
```

### Parse Individual Files
```typescript
import { parseDailyLog, parseWeeklyReview } from './src/utils/review-aggregator';

// Parse daily log
const dailyLog = parseDailyLog('/path/to/2025-10-20.md');
if (dailyLog) {
  console.log('Tasks:', dailyLog.tasks);
  console.log('Wins:', dailyLog.wins);
  console.log('Mood:', dailyLog.mood);
}

// Parse weekly review
const weeklyReview = parseWeeklyReview('/path/to/2025-W42.md');
if (weeklyReview) {
  console.log('Wins:', weeklyReview.wins);
  console.log('Lessons:', weeklyReview.lessons);
  console.log('Goals:', weeklyReview.goals);
}
```

## Integration Points

### API Endpoints (Next Steps)
- `GET /api/reviews/weekly/:year/:week` - Get or generate weekly review
- `GET /api/reviews/monthly/:year/:month` - Get or generate monthly review
- `POST /api/reviews/regenerate` - Regenerate reviews with new config
- `GET /api/stats/period/:start/:end` - Get period statistics

### CLI Commands (Next Steps)
- `life-os review weekly` - Generate current week's review
- `life-os review monthly` - Generate current month's review
- `life-os review backfill` - Generate missing reviews
- `life-os stats` - Show statistics dashboard

### Template Generator (Next Steps)
Use aggregated data to populate review templates:
- Weekly review markdown
- Monthly review markdown
- Year-in-review report
- Custom report formats

## Testing Strategy

### Unit Tests Needed
- Date utility functions
- Markdown parsing edge cases
- Similarity calculation
- Pattern detection
- Deduplication logic
- Error handling

### Integration Tests Needed
- Full aggregation pipeline
- Multi-file processing
- Missing file handling
- Large dataset performance

### Test Data
- Sample daily logs (7 days)
- Sample weekly reviews (4 weeks)
- Malformed markdown files
- Empty files
- Missing files

## Performance Considerations

- Synchronous file I/O (consider async for large datasets)
- In-memory processing (suitable for typical usage)
- Pattern detection complexity: O(n*m) where n=items, m=phrase length
- Levenshtein distance: O(n*m) for each comparison pair
- Efficient for <1000 items per aggregation

## Next Steps

1. **Create API endpoints** - Express routes for review generation
2. **Add tests** - Comprehensive test suite
3. **CLI integration** - Command-line interface
4. **Template generation** - Markdown output formatters
5. **Async operations** - Convert to async for scalability
6. **Caching layer** - Cache parsed files for performance
7. **Database storage** - Optional SQLite/PostgreSQL persistence

## Maintenance Notes

- Keep type definitions in sync with markdown structure
- Update pattern detection keywords as needed
- Monitor performance with large datasets
- Add new aggregation metrics as requirements evolve
- Document any breaking changes to file formats

---

**Status:** Complete and ready for integration
**Last Updated:** 2025-10-20
**Coordination:** Saved to swarm memory at `swarm/backend/aggregation`
