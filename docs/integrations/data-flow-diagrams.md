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

### Chrome Extension Capture Flow

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

### Alternative: Google Tasks API

```mermaid
sequenceDiagram
    participant U as User
    participant CS as Claude Skills
    participant GT as Google Tasks API
    participant K as Keep UI

    Note over CS,K: Workaround for Keep API limitation

    U->>CS: Create Note
    CS->>GT: Create Task with Note Content
    GT-->>CS: Task Created
    CS->>CS: Store Local Copy

    U->>K: View in Google Tasks
    Note over K: Tasks appear in Keep-like interface
```

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

## 5. Telegram Integration Flow

### Command Processing Flow

```mermaid
sequenceDiagram
    participant U as User
    participant T as Telegram Bot
    participant WH as Webhook
    participant CS as Claude Skills
    participant TD as Todoist

    U->>T: /task add "Buy milk"
    T->>WH: Update Event
    WH->>WH: Verify Secret
    WH->>WH: Parse Command
    WH->>CS: Create Task
    CS->>TD: Sync to Todoist
    TD-->>CS: Task Created
    CS-->>WH: Success
    WH->>T: Send Confirmation
    T-->>U: ✅ Task created!
```

### Quick Capture Flow

```mermaid
graph TB
    A[User] -->|Send Message| B[Telegram Bot]
    B --> C{Is Command?}

    C -->|Yes /task| D[Parse Command]
    C -->|Yes /list| E[Query Tasks]
    C -->|No| F[Quick Capture]

    D --> G[Create Task]
    E --> H[Format List]
    F --> I[Create Note]

    G --> J[Claude Skills]
    H --> J
    I --> J

    J --> K[Respond to User]
    K --> B
```

### Interactive Callback Flow

```mermaid
sequenceDiagram
    participant CS as Claude Skills
    participant T as Telegram Bot
    participant U as User

    Note over CS: Task Due Reminder
    CS->>T: Send Notification with Keyboard
    T-->>U: 📋 Task: Buy groceries

    Note over U: Shows Inline Keyboard
    U->>T: Click "✅ Mark Done"
    T->>CS: callback_query: complete:task123
    CS->>CS: Mark Task Complete
    CS-->>T: Answer Callback
    T-->>U: ✅ Task completed!
```

### Multi-Device Sync

```mermaid
graph TB
    A[User's Phone] -->|Telegram| B[Bot API]
    C[User's Desktop] -->|Telegram| B
    D[User's Tablet] -->|Telegram| B

    B --> E[Webhook Handler]
    E --> F[Claude Skills]

    F -->|Broadcast Updates| G[WebSocket Server]
    G -->|Push| H[Web App]
    G -->|Push| I[Mobile App]
    G -->|Push| J[Desktop App]
```

---

## 6. Unified Integration Architecture

### Central Hub Data Flow

```mermaid
graph TB
    subgraph External Services
        A[Todoist]
        B[Gmail]
        C[Keep]
        D[Chrome]
        E[Telegram]
    end

    subgraph Integration Hub
        F[Event Bus]
        G[Sync Queue]
        H[Conflict Resolver]
        I[Error Handler]
    end

    subgraph Claude Skills
        J[Task Manager]
        K[Note Manager]
        L[Resource Manager]
        M[Communication Manager]
    end

    subgraph Storage
        N[(PostgreSQL)]
        O[(Redis Cache)]
        P[File Storage]
    end

    A -->|Webhook| F
    B -->|Pub/Sub| F
    C -->|Extension| F
    D -->|Extension| F
    E -->|Webhook| F

    F --> G
    G --> H
    H --> I

    I --> J
    I --> K
    I --> L
    I --> M

    J --> N
    K --> N
    L --> N
    M --> N

    J --> O
    K --> O
    L --> O
    M --> O
```

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
