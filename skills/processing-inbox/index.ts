/**
 * Processing Inbox Skill
 *
 * Process inbox items systematically using David Allen's Getting Things Done (GTD)
 * methodology. Transform raw inputs into actionable outcomes.
 *
 * @module processing-inbox
 */

/**
 * Inbox item decision outcomes
 */
export enum ItemDecision {
  TRASH = "Trash - Delete immediately",
  REFERENCE = "Reference - File for later",
  SOMEDAY_MAYBE = "Someday/Maybe - Defer indefinitely",
  DO_NOW = "Do Now - Action < 2 minutes",
  NEXT_ACTION = "Next Action - Single-step task",
  PROJECT = "Project - Multi-step task",
  CALENDAR = "Calendar - Time-specific event",
  WAITING_FOR = "Waiting For - Delegated item",
}

/**
 * Context tags for next actions
 */
export enum ActionContext {
  HOME = "@home",
  WORK = "@work",
  COMPUTER = "@computer",
  PHONE = "@phone",
  ERRANDS = "@errands",
  WAITING_FOR = "@waiting-for",
}

/**
 * Collection point type
 */
export enum CollectionPoint {
  PHYSICAL = "Physical inbox",
  DIGITAL = "Digital inbox (inbox.md)",
  EMAIL = "Email inbox",
  WHATSAPP = "WhatsApp messages",
  VOICE_NOTES = "Voice notes",
  QUICK_CAPTURE = "Quick capture tool",
}

/**
 * Inbox item to process
 */
export interface InboxItem {
  id: string;
  content: string;
  source: CollectionPoint;
  capturedAt: string; // ISO date string
  processedAt?: string; // ISO date string
  decision?: ItemDecision;
  routed?: {
    list: string; // e.g., "next-actions", "projects", "someday"
    context?: ActionContext;
    details?: string;
  };
}

/**
 * Processing statistics
 */
export interface ProcessingStats {
  totalItems: number;
  processed: number;
  remaining: number;
  decisions: {
    trash: number;
    reference: number;
    somedayMaybe: number;
    doNow: number;
    nextAction: number;
    project: number;
    calendar: number;
    waitingFor: number;
  };
  duration: number; // Minutes
  inboxZeroAchieved: boolean;
}

/**
 * Processing session
 */
export interface ProcessingSession {
  date: string; // ISO date string
  collectionPoints: CollectionPoint[];
  items: InboxItem[];
  stats: ProcessingStats;
  notes?: string;
}

/**
 * GTD clarifying questions for an inbox item
 */
export interface ClarifyingQuestions {
  whatIsIt: string;
  isActionable: boolean;
  nextAction?: string;
  estimatedMinutes?: number;
  isSingleStep?: boolean;
  needsSpecificTime?: boolean;
  context?: ActionContext;
}

/**
 * Apply GTD decision tree to determine routing
 */
export function applyGTDDecisionTree(item: InboxItem, answers: ClarifyingQuestions): ItemDecision {
  // Not actionable path
  if (!answers.isActionable) {
    // Check if it has any value
    if (item.content.includes("spam") || item.content.includes("junk")) {
      return ItemDecision.TRASH;
    }
    // Has value but no action needed
    return ItemDecision.REFERENCE;
  }

  // Actionable path
  if (answers.estimatedMinutes && answers.estimatedMinutes < 2) {
    return ItemDecision.DO_NOW;
  }

  if (answers.needsSpecificTime) {
    return ItemDecision.CALENDAR;
  }

  if (answers.isSingleStep === false) {
    return ItemDecision.PROJECT;
  }

  // Single-step action > 2 minutes
  return ItemDecision.NEXT_ACTION;
}

/**
 * Check if item meets 2-minute rule
 */
export function meetsTwoMinuteRule(estimatedMinutes: number): boolean {
  return estimatedMinutes < 2;
}

/**
 * Route item to appropriate list based on decision
 */
export function routeItem(
  _item: InboxItem,
  decision: ItemDecision,
  context?: ActionContext
): {
  list: string;
  context?: ActionContext;
} {
  switch (decision) {
    case ItemDecision.TRASH:
      return { list: "trash" };
    case ItemDecision.REFERENCE:
      return { list: "reference" };
    case ItemDecision.SOMEDAY_MAYBE:
      return { list: "someday" };
    case ItemDecision.NEXT_ACTION:
      return { list: "next-actions", context };
    case ItemDecision.PROJECT:
      return { list: "projects", context };
    case ItemDecision.CALENDAR:
      return { list: "calendar" };
    case ItemDecision.WAITING_FOR:
      return { list: "waiting", context: ActionContext.WAITING_FOR };
    case ItemDecision.DO_NOW:
      return { list: "do-now" }; // Special temporary list
    default:
      return { list: "inbox" }; // Keep in inbox if unclear
  }
}

/**
 * Calculate processing statistics
 */
export function calculateStats(items: InboxItem[], duration: number): ProcessingStats {
  const processed = items.filter((i) => i.decision !== undefined).length;
  const remaining = items.length - processed;

  const decisions = items.reduce(
    (acc, item) => {
      if (!item.decision) return acc;

      switch (item.decision) {
        case ItemDecision.TRASH:
          acc.trash++;
          break;
        case ItemDecision.REFERENCE:
          acc.reference++;
          break;
        case ItemDecision.SOMEDAY_MAYBE:
          acc.somedayMaybe++;
          break;
        case ItemDecision.DO_NOW:
          acc.doNow++;
          break;
        case ItemDecision.NEXT_ACTION:
          acc.nextAction++;
          break;
        case ItemDecision.PROJECT:
          acc.project++;
          break;
        case ItemDecision.CALENDAR:
          acc.calendar++;
          break;
        case ItemDecision.WAITING_FOR:
          acc.waitingFor++;
          break;
      }
      return acc;
    },
    {
      trash: 0,
      reference: 0,
      somedayMaybe: 0,
      doNow: 0,
      nextAction: 0,
      project: 0,
      calendar: 0,
      waitingFor: 0,
    }
  );

  return {
    totalItems: items.length,
    processed,
    remaining,
    decisions,
    duration,
    inboxZeroAchieved: remaining === 0,
  };
}

/**
 * Format processing session as markdown
 */
export function formatProcessingSessionMarkdown(session: ProcessingSession): string {
  const { stats } = session;

  return `# Inbox Processing Session - ${session.date}

## Collection Points Processed
${session.collectionPoints.map((cp) => `- ${cp}`).join("\n")}

## Statistics

**Total Items**: ${stats.totalItems}
**Processed**: ${stats.processed}
**Remaining**: ${stats.remaining}
**Duration**: ${stats.duration} minutes
**Inbox Zero**: ${stats.inboxZeroAchieved ? "✅ Achieved" : "❌ Not yet"}

### Decisions Made

- **Trash**: ${stats.decisions.trash} items
- **Reference**: ${stats.decisions.reference} items
- **Someday/Maybe**: ${stats.decisions.somedayMaybe} items
- **Do Now (< 2 min)**: ${stats.decisions.doNow} items
- **Next Actions**: ${stats.decisions.nextAction} items
- **Projects**: ${stats.decisions.project} items
- **Calendar**: ${stats.decisions.calendar} items
- **Waiting For**: ${stats.decisions.waitingFor} items

## Items Processed

${session.items
  .filter((item) => item.decision)
  .map(
    (item) => `### ${item.id}
**Source**: ${item.source}
**Content**: ${item.content.substring(0, 100)}${item.content.length > 100 ? "..." : ""}
**Decision**: ${item.decision}
${item.routed ? `**Routed to**: ${item.routed.list}${item.routed.context ? ` (${item.routed.context})` : ""}` : ""}
`
  )
  .join("\n")}

${session.notes ? `## Notes\n\n${session.notes}` : ""}

---

**Processing completed**: ${stats.inboxZeroAchieved ? "All items processed ✅" : `${stats.remaining} items remaining`}
`;
}

/**
 * Validate inbox item
 */
export function validateInboxItem(item: InboxItem): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!item.id || item.id.trim().length === 0) {
    errors.push("Item ID is required");
  }

  if (!item.content || item.content.trim().length === 0) {
    errors.push("Item content is required");
  }

  if (!item.source) {
    errors.push("Item source is required");
  }

  if (!item.capturedAt) {
    errors.push("Captured date is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if inbox is at zero
 */
export function isInboxZero(items: InboxItem[]): boolean {
  return items.every((item) => item.decision !== undefined);
}

/**
 * Get unprocessed items
 */
export function getUnprocessedItems(items: InboxItem[]): InboxItem[] {
  return items.filter((item) => item.decision === undefined);
}

/**
 * Get items by decision type
 */
export function getItemsByDecision(items: InboxItem[], decision: ItemDecision): InboxItem[] {
  return items.filter((item) => item.decision === decision);
}

/**
 * Calculate average processing time per item
 */
export function calculateAverageProcessingTime(stats: ProcessingStats): number {
  if (stats.processed === 0) return 0;
  return Math.round((stats.duration / stats.processed) * 10) / 10; // Round to 1 decimal
}

/**
 * Main skill export
 */
export default {
  name: "Processing Inbox",
  version: "1.0.0",
  description: "GTD inbox processing for systematic clarification and organization",
  applyGTDDecisionTree,
  meetsTwoMinuteRule,
  routeItem,
  calculateStats,
  formatProcessingSessionMarkdown,
  validateInboxItem,
  isInboxZero,
  getUnprocessedItems,
  getItemsByDecision,
  calculateAverageProcessingTime,
  ItemDecision,
  ActionContext,
  CollectionPoint,
};
