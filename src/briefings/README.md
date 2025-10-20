# Briefing System

Automated morning, evening, and weekly briefings via WhatsApp for Life OS.

## Features

- **Morning Briefings**: Daily priorities, calendar events, and tasks
- **Evening Briefings**: Daily wins, reflections, and tomorrow's preview
- **Weekly Summaries**: Week overview with statistics and insights
- **WhatsApp Delivery**: Automated message sending with retry logic
- **Flexible Scheduling**: Configurable times and days
- **Delivery Tracking**: Logs and statistics

## Installation

```bash
npm install
```

## Configuration

Create or edit `config/briefing-config.json`:

```json
{
  "morningTime": "08:00",
  "eveningTime": "18:00",
  "weeklyDay": 0,
  "weeklyTime": "09:00",
  "recipient": "14155551234",
  "timezone": "America/Los_Angeles",
  "enabled": {
    "morning": true,
    "evening": true,
    "weekly": true
  }
}
```

## Usage

### CLI Commands

```bash
# Generate a briefing (display only)
npx ts-node src/briefings/cli.ts generate morning
npx ts-node src/briefings/cli.ts generate evening
npx ts-node src/briefings/cli.ts generate weekly

# Send a briefing via WhatsApp
npx ts-node src/briefings/cli.ts send morning
npx ts-node src/briefings/cli.ts send evening 14155551234

# Start automated scheduler
npx ts-node src/briefings/cli.ts schedule

# Check pending briefings
npx ts-node src/briefings/cli.ts check

# View/update configuration
npx ts-node src/briefings/cli.ts config show
npx ts-node src/briefings/cli.ts config set recipient 14155551234
npx ts-node src/briefings/cli.ts config set morningTime 07:30

# View delivery statistics
npx ts-node src/briefings/cli.ts stats 7
npx ts-node src/briefings/cli.ts history 7
```

### Programmatic Usage

```typescript
import {
  generateMorningBriefing,
  generateEveningBriefing,
  generateWeeklySummary,
  startScheduler,
  triggerBriefing,
} from './briefings';

// Generate briefings
const morning = await generateMorningBriefing();
const evening = await generateEveningBriefing();
const weekly = await generateWeeklySummary();

// Send manually
await triggerBriefing('morning', '14155551234');

// Start scheduler
await startScheduler(5); // Check every 5 minutes
```

## Data Sources

Briefings pull data from:

- `memory/daily-logs/*.json` - Daily logs with priorities and wins
- `memory/tasks.json` - Task list with priorities and status
- `memory/calendar.json` - Calendar events

### Example Daily Log Format

```json
{
  "date": "2025-10-20",
  "priorities": [
    "Complete briefing system implementation",
    "Review pull requests",
    "Plan sprint goals"
  ],
  "wins": [
    "Shipped briefing system",
    "Fixed critical bug",
    "Mentored junior developer"
  ],
  "reflections": [
    "Team communication improved significantly",
    "Need to allocate more time for code review"
  ],
  "gratitude": "Grateful for supportive team and productive day",
  "tasks": [...]
}
```

## Scheduling

Default schedules:

- **Morning Briefing**: Monday-Friday at 8:00 AM
- **Evening Briefing**: Monday-Friday at 6:00 PM
- **Weekly Summary**: Sunday at 9:00 AM

Customize in `config/briefing-schedule.json`.

## WhatsApp Integration

Briefings are sent via the WhatsApp MCP tool:

```typescript
// The system automatically calls:
mcp__whatsapp__send_message({
  recipient: "14155551234", // or JID
  message: briefing.formattedMessage
});
```

### Recipient Format

- Phone number: `14155551234` (country code, no + or symbols)
- Direct chat JID: `14155551234@s.whatsapp.net`
- Group chat JID: `123456789@g.us`

## Delivery Tracking

All deliveries are logged to `logs/briefings/*.jsonl`:

```json
{
  "timestamp": "2025-10-20T08:00:00.000Z",
  "briefingId": "morning-2025-10-20T15:00:00.000Z",
  "type": "morning",
  "status": "sent",
  "recipient": "14155551234",
  "retryCount": 0,
  "sentAt": "2025-10-20T08:00:05.123Z"
}
```

## Error Handling

- **Automatic Retries**: Up to 3 attempts with exponential backoff
- **Failure Logging**: All errors logged with details
- **Status Tracking**: Real-time delivery status monitoring

## Development

Run tests:

```bash
npm test
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Architecture

```
src/briefings/
├── types/
│   └── briefing.ts       # TypeScript interfaces
├── generator.ts          # Content generation
├── formatter.ts          # WhatsApp formatting
├── scheduler.ts          # Automated scheduling
├── whatsapp-sender.ts    # Delivery logic
├── cli.ts               # Command-line interface
├── index.ts             # Main exports
└── README.md            # Documentation
```

## Future Enhancements

- [ ] SMS fallback for delivery failures
- [ ] Email delivery option
- [ ] Customizable templates
- [ ] Multi-language support
- [ ] Voice briefings
- [ ] Integration with voice assistant
- [ ] Analytics dashboard
- [ ] A/B testing for message formats

## License

MIT
