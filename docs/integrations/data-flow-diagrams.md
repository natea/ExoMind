# Integration Data Flow Diagrams

This document provides detailed data flow diagrams for each external tool integration.

---

## 1. Todoist Integration Flow

### Task Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant CS as Claude Skills
    participant SL as Sync Layer
    participant TA as Todoist API
    participant WH as Webhook Handler

    U->>CS: Create Task
    CS->>SL: Store Task Locally
    SL->>SL: Generate Sync Job
    SL->>TA: POST /tasks
    TA-->>SL: Task Created (ID: 123)
    SL->>CS: Update Task with sourceId

    Note over TA,WH: Later: Todoist Edit
    TA->>WH: Webhook: item:updated
    WH->>WH: Verify Signature
    WH->>CS: Update Task (ID: 123)
    CS->>SL: Record Sync
```

### Bidirectional Sync Flow

```mermaid
graph TB
    A[Claude Skills] -->|Create Task| B[Sync Queue]
    B -->|Batch Sync| C[Todoist API]
    C -->|Response| D[Update Local State]

    E[Todoist] -->|Webhook| F[Event Handler]
    F -->|Validate| G{Event Type?}
    G -->|Created| H[Import New Task]
    G -->|Updated| I[Merge Changes]
    G -->|Deleted| J[Mark Deleted]

    H --> A
    I --> A
    J --> A

    K[Conflict Detector] -->|Monitor| A
    K -->|Monitor| E
    K -->|Resolve| L[Conflict Resolution]
    L -->|Last Write Wins| A
```

### Conflict Resolution Flow

```mermaid
flowchart TD
    A[Sync Detected] --> B{Conflict?}
    B -->|No| C[Apply Update]
    B -->|Yes| D{Check Timestamp}

    D -->|Remote Newer| E[Accept Remote]
    D -->|Local Newer| F[Push Local]
    D -->|Same Time| G{Check Priority}

    G -->|User Changed| F
    G -->|API Changed| E
    G -->|Both Changed| H[User Prompt]

    E --> I[Update Local]
    F --> J[Update Remote]
    H --> K[Manual Resolution]
    K --> I
    K --> J
```

---

## 2. Gmail Integration Flow

### Email Processing Pipeline

```mermaid
sequenceDiagram
    participant G as Gmail
    participant PS as Pub/Sub
    participant WH as Webhook
    participant AI as AI Parser
    participant CS as Claude Skills
    participant DB as Database

    Note over G: New Email Arrives
    G->>PS: Push Notification
    PS->>WH: Trigger Webhook
    WH->>WH: Verify Token
    WH->>G: Fetch Full Email
    G-->>WH: Email Content
    WH->>AI: Extract Actions
    AI-->>WH: Actionable Items

    loop For Each Action
        WH->>CS: Create Task
        CS->>DB: Store Task
        CS-->>WH: Task Created
    end

    WH->>G: Apply Label "PROCESSED"
```

### Smart Email Classification

```mermaid
graph TD
    A[Incoming Email] --> B[Extract Features]
    B --> C{AI Classification}

    C -->|Action Required| D[Create Task]
    C -->|Reference| E[Create Note]
    C -->|Newsletter| F[Archive]
    C -->|Spam| G[Mark Spam]

    D --> H[Todoist]
    D --> I[Set Reminder]
    E --> J[Google Keep]
    E --> K[Tag & Store]

    L[Sender Analysis] --> C
    M[Subject Keywords] --> C
    N[Body Content] --> C
    O[Historical Data] --> C
```

### Notification Flow

```mermaid
sequenceDiagram
    participant G as Gmail
    participant CS as Claude Skills
    participant T as Telegram
    participant U as User

    G->>CS: High Priority Email
    CS->>CS: Evaluate Priority
    CS->>T: Send Notification
    T-->>U: Alert

    U->>T: /snooze 1h
    T->>CS: Snooze Command
    CS->>CS: Schedule Reminder

    Note over CS: 1 hour later
    CS->>T: Reminder
    T-->>U: Alert Again
```

---

## 3. Google Keep Integration Flow

> ⏸️ **STATUS: DEFERRED** - Google Keep integration is on hold due to lack of official API. Use Todoist or WhatsApp for quick capture instead.

### Chrome Extension Capture Flow (Deferred)

```mermaid
sequenceDiagram
    participant U as User
    participant K as Keep
    participant CE as Chrome Ext
    participant WH as Webhook
    participant CS as Claude Skills

    U->>K: Create/Edit Note
    K-->>CE: Detect Change
    CE->>CE: Monitor DOM
    U->>CE: Click "Sync to Life-OS"
    CE->>CE: Generate HMAC
    CE->>WH: POST /keep/import
    WH->>WH: Verify Signature
    WH->>CS: Import Note
    CS->>CS: Store Note
    CS-->>CE: Success
    CE-->>U: Notification
```

### Periodic Sync Flow

```mermaid
graph TB
    A[Cron Job] -->|Every 30 min| B[Chrome Extension]
    B --> C{Notes Changed?}
    C -->|Yes| D[Fetch Changed Notes]
    C -->|No| E[Skip]

    D --> F[Generate Payload]
    F --> G[Sign Request]
    G --> H[POST to Webhook]

    H --> I{Signature Valid?}
    I -->|Yes| J[Import Notes]
    I -->|No| K[Reject]

    J --> L[Update Sync Timestamp]
    L --> M[Store in Chrome Storage]
```

### Alternative: Google Tasks API (Also Deferred)

> ⏸️ **NOT IMPLEMENTED** - Todoist already handles task management. Google Tasks integration is not needed.

**Rationale:**
- Todoist provides superior task management (Phase 4 - implemented)
- WhatsApp MCP handles quick capture (Phase 10 - implemented)
- Google Tasks would create redundant functionality
- Complexity not justified for Life-OS use case

---

## 4. Chrome Bookmarks Integration Flow

### Real-time Bookmark Sync

```mermaid
sequenceDiagram
    participant U as User
    participant C as Chrome
    participant CE as Extension
    participant WH as Webhook
    participant CS as Claude Skills

    U->>C: Create Bookmark
    C->>CE: chrome.bookmarks.onCreated
    CE->>CE: Extract Metadata
    CE->>WH: POST /chrome/bookmark
    WH->>CS: Import Bookmark
    CS->>CS: Tag & Categorize
    CS-->>WH: Success

    Note over CS: Later: Add Tags in Life-OS
    CS->>WH: Update Request
    WH->>CE: Push Update
    CE->>C: Update Bookmark Title
```

### Folder Structure Mapping

```mermaid
graph TD
    A[Bookmarks Bar] --> B[Work]
    A --> C[Personal]
    A --> D[Reading List]

    B --> E[Projects]
    B --> F[Resources]

    C --> G[Travel]
    C --> H[Shopping]

    D --> I[Articles]
    D --> J[Papers]

    K[Claude Skills] -->|Map to Tags| A
    E -->|Tag: work, projects| K
    I -->|Tag: reading, articles| K
```

### Bookmark Search & Retrieval

```mermaid
sequenceDiagram
    participant U as User
    participant CS as Claude Skills
    participant DB as Local DB
    participant C as Chrome

    U->>CS: Search "AI papers"
    CS->>DB: Full-text Search
    DB-->>CS: 15 Results
    CS->>CS: Rank by Relevance
    CS-->>U: Display Results

    U->>CS: Open Bookmark #3
    CS->>C: chrome.tabs.create(url)
    C-->>U: Open in New Tab
```

---

## 5. WhatsApp Message Management Flow

> ✅ **IMPLEMENTED** - Uses WhatsApp MCP server with Life-OS skill wrapper (Week 10).

**Note**: This section replaces the original Telegram bot integration. WhatsApp MCP provides equivalent functionality with simplified architecture.

### Command Processing Flow (via WhatsApp MCP)

```mermaid
sequenceDiagram
    participant U as User
    participant WA as WhatsApp
    participant MCP as WhatsApp MCP
    participant SK as Life-OS Skill
    participant CS as Claude Skills
    participant TD as Todoist

    U->>WA: /task "Buy milk"
    WA->>MCP: Message Received
    MCP->>SK: Parse Command
    SK->>SK: Validate Command
    SK->>CS: Create Task
    CS->>TD: Sync to Todoist
    TD-->>CS: Task Created
    CS-->>SK: Success
    SK->>MCP: Format Response
    MCP->>WA: Send Confirmation
    WA-->>U: ✅ Task created!
```

**Key Differences from Telegram:**
- No webhook infrastructure needed
- Authentication handled by MCP
- Skill wrapper coordinates via MCP tools
- Simpler deployment and maintenance

### Quick Capture Flow (Simplified with WhatsApp MCP)

```mermaid
graph TB
    A[User] -->|WhatsApp Message| B[WhatsApp MCP]
    B --> C[Life-OS Skill Wrapper]
    C --> D{Parse Message}

    D -->|Command /task| E[Create Task]
    D -->|Command /review| F[Generate Summary]
    D -->|Command /goals| G[Show Active Plans]
    D -->|Plain Text| H[Add to Inbox]

    E --> I[Update Memory]
    F --> I
    G --> I
    H --> I

    I --> J[Sync to Todoist]
    J --> K[Format Response]
    K --> B
    B -->|WhatsApp| A
```

**Advantages:**
- No bot registration required
- No webhook setup
- MCP handles authentication
- Skill-based command parsing
- Portable across MCP-enabled environments

### Daily Briefing Flow (Morning & Evening Routines)

```mermaid
sequenceDiagram
    participant CRON as Schedule (5:30 AM / 8:30 PM)
    participant SK as Life-OS Skill
    participant CS as Claude Skills
    participant MCP as WhatsApp MCP
    participant U as User

    Note over CRON: Morning Briefing (5:30 AM)
    CRON->>SK: Trigger Morning Routine
    SK->>CS: Fetch Today's Tasks
    SK->>CS: Fetch Active Goals
    SK->>CS: Fetch Habit Reminders
    CS-->>SK: Compiled Data
    SK->>SK: Format Briefing
    SK->>MCP: Send Message
    MCP-->>U: 🌅 Good morning! Here's your day...

    Note over CRON: Evening Review (8:30 PM)
    CRON->>SK: Trigger Evening Routine
    SK->>CS: Fetch Completed Tasks
    SK->>CS: Fetch Tomorrow's Preview
    CS-->>SK: Compiled Data
    SK->>SK: Format Review
    SK->>MCP: Send Message
    MCP-->>U: 🌙 Great work today! Tomorrow: ...

    U->>MCP: /habits log
    MCP->>SK: Process Command
    SK->>CS: Update Habit Tracking
    CS-->>SK: Saved
    SK->>MCP: Format Response
    MCP-->>U: ✅ Habits logged!
```

### Multi-Device Sync (via WhatsApp MCP)

```mermaid
graph TB
    A[User's Phone] -->|WhatsApp| B[WhatsApp MCP]
    C[User's Desktop Web] -->|WhatsApp| B
    D[User's Tablet] -->|WhatsApp| B

    B --> E[Life-OS Skill Wrapper]
    E --> F[Claude Skills]

    F -->|Update| G[Memory Files]
    G -->|Sync| H[Todoist]
    G -->|Sync| I[Google Calendar]

    F -->|Notifications| B
    B -->|Message| A
    B -->|Message| C
    B -->|Message| D
```

**Simplified Architecture:**
- WhatsApp handles multi-device sync natively
- No custom WebSocket server needed
- Memory files are the source of truth
- External tools sync bidirectionally
- WhatsApp MCP broadcasts responses to all devices

---

## 6. Unified Integration Architecture

### Central Hub Data Flow

```mermaid
graph TB
    subgraph External Services
        A[Todoist]
        B[Gmail via Google Workspace MCP]
        C[Keep - Deferred]
        D[Chrome - Future]
        E[WhatsApp via MCP]
        F[Google Calendar via MCP]
    end

    subgraph Integration Layer
        G[Event Bus]
        H[Sync Queue]
        I[Conflict Resolver]
        J[Error Handler]
    end

    subgraph Claude Skills
        K[Task Manager]
        L[Note Manager]
        M[Resource Manager]
        N[WhatsApp Skill Wrapper]
    end

    subgraph Storage
        O[Memory Files - Source of Truth]
        P[Todoist Sync State]
        Q[Google Calendar Cache]
    end

    A -->|REST API| G
    B -->|MCP Tools| K
    E -->|MCP Tools| N
    F -->|MCP Tools| K

    G --> H
    H --> I
    I --> J

    J --> K
    J --> L
    J --> M
    J --> N

    K --> O
    L --> O
    M --> O
    N --> O

    O --> P
    O --> Q
```

**Key Changes from Original:**
- Google Keep marked as deferred
- Telegram replaced with WhatsApp MCP
- Gmail/Calendar via Google Workspace MCP (no webhooks)
- Memory files as central storage (not PostgreSQL)
- Simplified architecture for local-only operation

### Event-Driven Architecture

```mermaid
sequenceDiagram
    participant S as Source Service
    participant EB as Event Bus
    participant H1 as Handler 1
    participant H2 as Handler 2
    participant H3 as Handler 3

    S->>EB: Publish Event
    EB->>EB: Route Event

    par Parallel Handling
        EB->>H1: Process Event
        EB->>H2: Process Event
        EB->>H3: Process Event
    end

    H1-->>EB: Success
    H2-->>EB: Success
    H3-->>EB: Error

    EB->>EB: Aggregate Results
    EB->>H3: Retry Failed
    H3-->>EB: Success
```

### Sync State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Queued: New Change
    Queued --> Syncing: Start Sync
    Syncing --> Success: API Success
    Syncing --> Failed: API Error

    Failed --> Retrying: Retry Policy
    Retrying --> Syncing: Attempt Retry
    Retrying --> Dead: Max Retries

    Success --> Idle: Complete
    Dead --> Manual: Require Action
    Manual --> Queued: User Resolves
```

### Error Handling Flow

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type}

    B -->|Network| C[Exponential Backoff]
    B -->|Auth| D[Token Refresh]
    B -->|Rate Limit| E[Queue & Wait]
    B -->|Invalid Data| F[Log & Skip]
    B -->|Service Down| G[Circuit Breaker]

    C --> H{Retry Success?}
    H -->|Yes| I[Continue]
    H -->|No| J[Dead Letter Queue]

    D --> K{Refresh Success?}
    K -->|Yes| I
    K -->|No| L[User Reauth]

    E --> M[Wait Period]
    M --> I

    G --> N{Service Up?}
    N -->|Yes| O[Close Circuit]
    N -->|No| P[Keep Open]

    J --> Q[Manual Review]
    L --> Q
```

---

## 7. Security & Privacy Flows

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Life-OS App
    participant V as Credential Vault
    participant S as External Service

    U->>A: Access Feature
    A->>V: Request Token
    V->>V: Check Expiry

    alt Token Valid
        V-->>A: Return Token
        A->>S: API Call
        S-->>A: Success
    else Token Expired
        V->>S: Refresh Token
        S-->>V: New Token
        V->>V: Store Token
        V-->>A: Return Token
        A->>S: API Call
    else No Token
        V-->>A: No Credentials
        A->>U: Prompt Auth
        U->>S: OAuth Flow
        S-->>A: Auth Code
        A->>S: Exchange for Token
        S-->>A: Access Token
        A->>V: Store Token
    end
```

### Data Encryption Flow

```mermaid
graph LR
    A[Plain Text Data] --> B[Encryption Service]
    B --> C{Encryption Method}

    C -->|At Rest| D[AES-256]
    C -->|In Transit| E[TLS 1.3]
    C -->|Credentials| F[Keychain API]

    D --> G[Encrypted Storage]
    E --> H[HTTPS Request]
    F --> I[System Keychain]

    G --> J[Backup Service]
    J --> K[Encrypted Backup]
```

### Audit Logging Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Application
    participant L as Audit Logger
    participant DB as Log Database
    participant M as Monitoring

    U->>A: Perform Action
    A->>L: Log Event
    L->>L: Add Metadata
    L->>L: Add Timestamp
    L->>DB: Store Log
    DB-->>L: Confirmed

    alt Suspicious Activity
        L->>M: Alert
        M->>A: Flag for Review
    end
```

---

## Performance Optimization

### Caching Strategy

```mermaid
graph TD
    A[Request] --> B{Cache Hit?}
    B -->|Yes| C[Return Cached]
    B -->|No| D[Fetch from API]

    D --> E[Update Cache]
    E --> F[Set TTL]
    F --> G[Return Data]

    H[Background Job] -->|Invalidate| I{Condition?}
    I -->|Updated| J[Clear Cache]
    I -->|Expired| J
    I -->|Manual| J
```

### Batch Processing

```mermaid
sequenceDiagram
    participant A as Application
    participant Q as Queue
    participant B as Batch Processor
    participant API as External API

    loop Continuous
        A->>Q: Add Item
    end

    Note over B: Every 5 minutes
    B->>Q: Get Batch (100 items)
    Q-->>B: Items
    B->>API: Batch API Call
    API-->>B: Results
    B->>B: Process Results
    B->>Q: Mark Complete
```

---

## Monitoring & Observability

### Metrics Collection Flow

```mermaid
graph TB
    A[Integration Event] --> B[Metrics Collector]
    B --> C[Prometheus]
    B --> D[Custom Metrics]

    C --> E[Grafana Dashboard]
    D --> E

    E --> F{Threshold Exceeded?}
    F -->|Yes| G[Alert Manager]
    F -->|No| H[Continue Monitoring]

    G --> I[Send Notification]
    I --> J[Slack]
    I --> K[Email]
    I --> L[PagerDuty]
```

These diagrams provide a comprehensive view of how data flows through each integration, helping developers understand the system architecture and troubleshoot issues effectively.
