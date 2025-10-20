# Calendar Integration

Intelligent calendar integration with Google Workspace using MCP tools. Provides schedule analysis, time blocking, and task extraction from calendar events.

## Features

### 📅 Calendar Client (`client.ts`)
- **List Calendars**: Get all available calendars
- **Event Management**: Create, read, update, delete events
- **Advanced Queries**: Filter by date, category, attendees
- **Auto-Categorization**: Smart event classification
- **Sync Status**: Track connection health

### 📊 Schedule Analyzer (`analyzer.ts`)
- **Time Allocation**: Break down hours by category
- **Meeting Load**: Calculate meeting percentage
- **Free Slots**: Find available time blocks
- **Conflict Detection**: Identify double-bookings
- **Productivity Metrics**: Measure focus time
- **Work-Life Balance**: Track work vs personal time
- **Smart Recommendations**: Get actionable insights

### ⏰ Time Blocker (`time-blocker.ts`)
- **Focus Time Blocks**: Schedule deep work periods
- **Auto-Schedule Tasks**: Place tasks in optimal slots
- **Weekly Reviews**: Automatic review scheduling
- **Personal Time Protection**: Reserve personal hours
- **Smart Allocation**: Consider energy levels and preferences

### 📋 Event Parser (`event-parser.ts`)
- **Task Extraction**: Parse action items from descriptions
- **Prep Work Detection**: Identify preparation needs
- **Follow-up Tracking**: Extract follow-up tasks
- **Recurring Events**: Handle repeating meetings
- **Attachment Analysis**: Track materials to review

## Usage

### Basic Setup

```typescript
import {
  createCalendarClient,
  createScheduleAnalyzer,
  createTimeBlocker,
  createEventParser,
} from './integrations/calendar';

// Initialize client
const client = createCalendarClient('user@example.com', {
  primaryCalendarId: 'primary',
  timeZone: 'America/New_York',
  weekStart: 1,
  defaultEventDuration: 60,
  defaultReminders: [
    { method: 'popup', minutes: 15 }
  ],
  blockingPreferences: {
    workDayStart: '09:00',
    workDayEnd: '17:00',
    lunchBreak: { start: '12:00', duration: 60 },
    focusTimeBlocks: [
      { days: [1, 2, 3, 4, 5], startTime: '09:00', duration: 120 }
    ],
    bufferBetweenMeetings: 10,
    maxMeetingsPerDay: 6,
    maxConsecutiveMeetings: 3,
    minimumFocusBlockSize: 90,
    preferredMeetingTimes: [
      { day: 1, startTime: '14:00', endTime: '16:00' }
    ],
  },
  categoryColors: {
    'work': '#039BE5',
    'meeting': '#0B8043',
    'personal': '#D50000',
    'learning': '#F4511E',
    'health': '#E67C73',
    'social': '#8E24AA',
    'travel': '#616161',
    'break': '#795548',
    'deep-work': '#3F51B5',
    'admin': '#FF6F00',
    'other': '#7CB342',
  },
  autoCategorizationEnabled: true,
  syncInterval: 30,
});

const analyzer = createScheduleAnalyzer();
const timeBlocker = createTimeBlocker(client, analyzer, client.getSettings().blockingPreferences);
const parser = createEventParser();
```

### Get Events

```typescript
// Get events for next 7 days
const events = await client.getEvents({
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  categories: ['meeting', 'work'],
  excludeAllDay: true,
});

// Get events for specific date
const todayEvents = await client.getEventsForDate(new Date());

// Search events
const searchResults = await client.searchEvents('standup');
```

### Analyze Schedule

```typescript
const startDate = new Date();
const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

// Get comprehensive analysis
const analysis = analyzer.analyzeSchedule(events, startDate, endDate);

console.log('Time Allocation:', analysis.timeAllocation);
console.log('Meeting Load:', analysis.meetingLoad.percentageOfWorkTime);
console.log('Free Slots:', analysis.freeSlots.length);
console.log('Conflicts:', analysis.conflicts);
console.log('Recommendations:', analysis.recommendations);
console.log('Productivity:', analysis.productivity);
console.log('Work-Life Balance:', analysis.workLifeBalance);
```

### Schedule Analysis Output

```typescript
{
  period: { start: Date, end: Date, totalDays: 30 },
  timeAllocation: [
    {
      category: 'meeting',
      totalHours: 45.5,
      percentage: 35,
      eventCount: 32,
      averageDuration: 85, // minutes
      breakdown: {
        weekdays: 42,
        weekends: 3.5,
        mornings: 15,
        afternoons: 25,
        evenings: 5.5
      }
    },
    // ... other categories
  ],
  meetingLoad: {
    totalMeetings: 32,
    totalHours: 45.5,
    averagePerDay: 1.5,
    percentageOfWorkTime: 35,
    backToBackMeetings: 8,
    meetingFreeBlocks: [...],
    meetingsByDay: [...]
  },
  freeSlots: [
    {
      start: Date,
      end: Date,
      duration: 120, // minutes
      dayOfWeek: 'Monday',
      timeOfDay: 'morning',
      isWorkHours: true,
      suggestedUse: 'deep-work'
    },
    // ... more slots
  ],
  conflicts: [
    {
      type: 'double-booking',
      severity: 'high',
      events: [...],
      description: 'Overlap between "Team Sync" and "Client Call"',
      suggestion: 'Reschedule one of these events'
    }
  ],
  recommendations: [
    {
      type: 'reduce-meeting-load',
      priority: 'high',
      title: 'Reduce Meeting Load',
      description: 'Meetings consume 35% of your work time',
      impact: 'Free up time for deep work'
    }
  ]
}
```

### Time Blocking

```typescript
// Create focus time blocks
const focusBlocks = await timeBlocker.createFocusTimeBlocks(
  new Date(),
  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
);

// Reserve deep work periods
const deepWorkBlocks = await timeBlocker.reserveDeepWorkPeriods(
  10, // hours per week
  new Date(),
  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
);

// Schedule weekly reviews
const reviewBlocks = await timeBlocker.scheduleWeeklyReviews(
  new Date(),
  new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
);

// Auto-schedule tasks
const tasks = [
  {
    id: 'task-1',
    title: 'Write project proposal',
    estimatedMinutes: 120,
    category: 'work',
    priority: 'high',
    requiresFocus: true,
    preferredTimeOfDay: 'morning',
  },
  {
    id: 'task-2',
    title: 'Review pull requests',
    estimatedMinutes: 45,
    category: 'work',
    priority: 'medium',
  },
];

const result = await timeBlocker.scheduleTasksAutomatically(
  tasks,
  new Date(),
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
);

console.log('Scheduled:', result.scheduled);
console.log('Unscheduled:', result.unscheduled);
console.log('Recommendations:', result.recommendations);
```

### Extract Tasks from Events

```typescript
// Parse single event
const event = await client.getEvent('event-id');
const parseResult = parser.parseEvent(event);

console.log('Prep Work:', parseResult.prepWork);
console.log('Action Items:', parseResult.actionItems);
console.log('Follow-ups:', parseResult.followups);
console.log('Insights:', parseResult.insights);

// Parse multiple events
const upcomingEvents = await client.getEventsInRange(
  new Date(),
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
);

const allTasks = parser.parseEvents(upcomingEvents);
console.log(`Extracted ${allTasks.tasks.length} tasks from ${upcomingEvents.length} events`);
```

### Event Management

```typescript
// Create event
const newEvent = await client.createEvent({
  summary: 'Team Planning Session',
  description: 'Q1 planning and goal setting',
  location: 'Conference Room A',
  startTime: new Date('2025-01-15T14:00:00'),
  endTime: new Date('2025-01-15T16:00:00'),
  attendees: ['teammate1@example.com', 'teammate2@example.com'],
  category: 'meeting',
  tags: ['planning', 'quarterly'],
  addGoogleMeet: true,
  reminders: [
    { method: 'popup', minutes: 15 },
    { method: 'email', minutes: 60 },
  ],
  transparency: 'opaque',
});

// Modify event
const updated = await client.modifyEvent({
  eventId: 'event-id',
  calendarId: 'primary',
  updates: {
    summary: 'Updated: Team Planning Session',
    startTime: new Date('2025-01-15T15:00:00'),
    endTime: new Date('2025-01-15T17:00:00'),
  },
});

// Delete event
await client.deleteEvent('event-id');
```

## MCP Tools Used

The integration uses these Google Workspace MCP tools:

- `mcp__google-workspace__list_calendars` - List available calendars
- `mcp__google-workspace__get_events` - Query calendar events
- `mcp__google-workspace__create_event` - Create new events
- `mcp__google-workspace__modify_event` - Update existing events
- `mcp__google-workspace__delete_event` - Remove events

## Event Categories

Events are automatically categorized:

- **work** - General work time
- **meeting** - Meetings and calls
- **personal** - Personal activities
- **learning** - Training and education
- **health** - Exercise and health appointments
- **social** - Social events
- **travel** - Travel and commute time
- **break** - Breaks and meals
- **deep-work** - Focus time blocks
- **admin** - Administrative tasks
- **other** - Uncategorized

## Schedule Metrics

### Time Allocation
- Total hours per category
- Percentage distribution
- Weekday vs weekend breakdown
- Morning/afternoon/evening split

### Meeting Load
- Total meetings and hours
- Average meetings per day
- Percentage of work time
- Back-to-back meeting count
- Meeting-free blocks

### Productivity
- Focus time (uninterrupted >= 2 hours)
- Fragmented time (blocks < 1 hour)
- Average block size
- Context switches
- Energy alignment

### Work-Life Balance
- Work vs personal hours
- Weekend work time
- Evening work time
- Break time
- Overworked days (>10 hours)

## Best Practices

1. **Auto-Categorization**: Enable to automatically classify events
2. **Time Blocking**: Schedule focus time proactively
3. **Buffer Time**: Add 10-15 minutes between meetings
4. **Weekly Reviews**: Schedule regular review sessions
5. **Deep Work**: Protect 2+ hour blocks for focused work
6. **Personal Time**: Reserve evenings and weekends
7. **Prep Work**: Review materials before meetings
8. **Action Items**: Extract and track tasks from meetings

## Error Handling

```typescript
try {
  const events = await client.getEvents();
} catch (error) {
  console.error('Failed to fetch events:', error);

  // Check sync status
  const status = client.getSyncStatus();
  console.log('Sync errors:', status.syncErrors);

  // Clear errors
  client.clearSyncErrors();
}
```

## Integration with Other Modules

```typescript
// Task Management
import { taskManager } from '../tasks';
const tasks = parser.parseEvents(events);
tasks.forEach(task => taskManager.createTask(task));

// Goal Tracking
import { goalTracker } from '../goals';
const focusBlocks = timeBlocker.createFocusTimeBlocks(...);
focusBlocks.forEach(block => {
  if (block.goalId) {
    goalTracker.logProgress(block.goalId, block.duration);
  }
});

// Notifications
import { notifier } from '../notifications';
const analysis = analyzer.analyzeSchedule(...);
analysis.recommendations.forEach(rec => {
  if (rec.priority === 'high') {
    notifier.send(rec.title, rec.description);
  }
});
```

## Performance

- Calendar data is cached locally
- Batch operations for multiple events
- Intelligent sync intervals
- Minimal API calls through MCP

## Future Enhancements

- [ ] Machine learning for better time estimates
- [ ] Smart meeting suggestions
- [ ] Travel time calculation
- [ ] Weather integration
- [ ] Location-based recommendations
- [ ] Team availability coordination
- [ ] Automatic meeting notes
- [ ] Voice command integration
