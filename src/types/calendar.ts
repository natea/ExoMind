/**
 * Calendar Integration Types
 * TypeScript interfaces for Calendar events, time blocks, and schedule analysis
 */

/**
 * Calendar event representation
 */
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  calendarId: string;
  attendees?: string[];
  recurrence?: string[];
  transparency?: 'opaque' | 'transparent'; // opaque = busy, transparent = free
  status?: 'confirmed' | 'tentative' | 'cancelled';
  organizer?: {
    email: string;
    displayName?: string;
  };
  hangoutLink?: string;
  attachments?: Array<{
    fileUrl: string;
    title: string;
    mimeType: string;
  }>;
  reminders?: Array<{
    method: 'email' | 'popup';
    minutes: number;
  }>;
  metadata?: {
    category?: EventCategory;
    tags?: string[];
    preparationTime?: number; // minutes
    travelTime?: number; // minutes
  };
}

/**
 * Event categories for classification
 */
export type EventCategory =
  | 'work'
  | 'meeting'
  | 'personal'
  | 'learning'
  | 'health'
  | 'social'
  | 'travel'
  | 'break'
  | 'deep-work'
  | 'admin'
  | 'other';

/**
 * Time block for scheduling
 */
export interface TimeBlock {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  category: EventCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRecurring: boolean;
  recurrencePattern?: string;
  tags?: string[];
  goalId?: string; // Link to goal if applicable
  taskIds?: string[]; // Associated tasks
  status: 'proposed' | 'scheduled' | 'completed' | 'cancelled';
}

/**
 * Schedule analysis results
 */
export interface ScheduleAnalysis {
  period: {
    start: Date;
    end: Date;
    totalDays: number;
  };
  timeAllocation: TimeAllocation[];
  meetingLoad: MeetingLoad;
  freeSlots: FreeSlot[];
  conflicts: ScheduleConflict[];
  recommendations: ScheduleRecommendation[];
  productivity: ProductivityMetrics;
  workLifeBalance: WorkLifeBalance;
}

/**
 * Time allocation by category
 */
export interface TimeAllocation {
  category: EventCategory;
  totalHours: number;
  percentage: number;
  eventCount: number;
  averageDuration: number; // minutes
  breakdown: {
    weekdays: number; // hours
    weekends: number; // hours
    mornings: number; // 6am-12pm
    afternoons: number; // 12pm-6pm
    evenings: number; // 6pm-12am
  };
}

/**
 * Meeting load metrics
 */
export interface MeetingLoad {
  totalMeetings: number;
  totalHours: number;
  averagePerDay: number;
  percentageOfWorkTime: number;
  largestMeetingBlock: {
    duration: number; // minutes
    date: Date;
  };
  meetingFreeBlocks: Array<{
    start: Date;
    end: Date;
    duration: number; // minutes
  }>;
  backToBackMeetings: number;
  meetingsByDay: Array<{
    date: Date;
    count: number;
    hours: number;
  }>;
}

/**
 * Free time slot
 */
export interface FreeSlot {
  start: Date;
  end: Date;
  duration: number; // minutes
  dayOfWeek: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  isWorkHours: boolean;
  suggestedUse?: 'deep-work' | 'meetings' | 'admin' | 'break' | 'personal';
}

/**
 * Schedule conflict
 */
export interface ScheduleConflict {
  type: 'double-booking' | 'overlap' | 'insufficient-buffer' | 'overload';
  severity: 'low' | 'medium' | 'high';
  events: CalendarEvent[];
  start: Date;
  end: Date;
  description: string;
  suggestion?: string;
}

/**
 * Schedule recommendation
 */
export interface ScheduleRecommendation {
  type:
    | 'add-break'
    | 'consolidate-meetings'
    | 'protect-focus-time'
    | 'reduce-meeting-load'
    | 'add-buffer'
    | 'balance-categories'
    | 'move-event';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impact: string;
  action?: {
    type: 'create-event' | 'modify-event' | 'delete-event' | 'block-time';
    data: any;
  };
}

/**
 * Productivity metrics
 */
export interface ProductivityMetrics {
  focusTimeHours: number; // Uninterrupted blocks >= 2 hours
  fragmentedHours: number; // Blocks < 1 hour
  averageBlockSize: number; // minutes
  largestFocusBlock: {
    duration: number;
    date: Date;
  };
  contextSwitches: number; // Category changes per day
  energyAlignment: {
    highEnergyWork: number; // % of deep work in mornings
    lowEnergyWork: number; // % of admin in afternoons
  };
}

/**
 * Work-life balance metrics
 */
export interface WorkLifeBalance {
  workHours: number;
  personalHours: number;
  workPercentage: number;
  personalPercentage: number;
  weekendWorkHours: number;
  eveningWorkHours: number; // After 6pm
  breakTime: number;
  overworkedDays: number; // Days with >10 hours work
  recommendation: string;
}

/**
 * Calendar filter options
 */
export interface CalendarFilter {
  calendarIds?: string[];
  categories?: EventCategory[];
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
  includeRecurring?: boolean;
  attendeeEmail?: string;
  excludeAllDay?: boolean;
  onlyFree?: boolean;
  onlyBusy?: boolean;
}

/**
 * Time blocking preferences
 */
export interface TimeBlockingPreferences {
  workDayStart: string; // HH:mm format
  workDayEnd: string; // HH:mm format
  lunchBreak: {
    start: string;
    duration: number; // minutes
  };
  focusTimeBlocks: Array<{
    days: number[]; // 0-6 (Sunday-Saturday)
    startTime: string;
    duration: number; // minutes
  }>;
  bufferBetweenMeetings: number; // minutes
  maxMeetingsPerDay: number;
  maxConsecutiveMeetings: number;
  minimumFocusBlockSize: number; // minutes
  preferredMeetingTimes: Array<{
    day: number;
    startTime: string;
    endTime: string;
  }>;
}

/**
 * Calendar sync status
 */
export interface CalendarSyncStatus {
  lastSync: Date;
  calendarsConnected: number;
  eventsLoaded: number;
  syncErrors: Array<{
    calendarId: string;
    error: string;
    timestamp: Date;
  }>;
  nextSync?: Date;
}

/**
 * Event creation request
 */
export interface CreateEventRequest {
  summary: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  calendarId?: string;
  attendees?: string[];
  category?: EventCategory;
  tags?: string[];
  addGoogleMeet?: boolean;
  reminders?: Array<{
    method: 'email' | 'popup';
    minutes: number;
  }>;
  transparency?: 'opaque' | 'transparent';
  recurrence?: string[];
}

/**
 * Event modification request
 */
export interface ModifyEventRequest {
  eventId: string;
  calendarId: string;
  updates: {
    summary?: string;
    description?: string;
    location?: string;
    startTime?: Date;
    endTime?: Date;
    attendees?: string[];
    category?: EventCategory;
    tags?: string[];
    addGoogleMeet?: boolean;
    removeGoogleMeet?: boolean;
    reminders?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
    transparency?: 'opaque' | 'transparent';
  };
}

/**
 * Bulk event operation
 */
export interface BulkEventOperation {
  type: 'create' | 'modify' | 'delete';
  events: Array<CreateEventRequest | ModifyEventRequest | { eventId: string; calendarId: string }>;
  validateConflicts?: boolean;
  dryRun?: boolean;
}

/**
 * Calendar settings
 */
export interface CalendarSettings {
  primaryCalendarId: string;
  workCalendarId?: string;
  personalCalendarId?: string;
  timeZone: string;
  weekStart: 0 | 1; // 0 = Sunday, 1 = Monday
  defaultEventDuration: number; // minutes
  defaultReminders: Array<{
    method: 'email' | 'popup';
    minutes: number;
  }>;
  blockingPreferences: TimeBlockingPreferences;
  categoryColors: Record<EventCategory, string>;
  autoCategorizationEnabled: boolean;
  syncInterval: number; // minutes
}
