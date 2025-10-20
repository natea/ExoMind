/**
 * Calendar Integration - Main Entry Point
 * Google Workspace Calendar integration with intelligent schedule analysis
 */

export { CalendarClient, createCalendarClient } from './client';
export { ScheduleAnalyzer, createScheduleAnalyzer } from './analyzer';
export { TimeBlocker, createTimeBlocker } from './time-blocker';
export { EventParser, createEventParser } from './event-parser';
export type { ExtractedTask, ParseResult } from './event-parser';

export {
  CalendarEvent,
  CalendarFilter,
  CalendarSettings,
  CalendarSyncStatus,
  CreateEventRequest,
  EventCategory,
  FreeSlot,
  MeetingLoad,
  ModifyEventRequest,
  ProductivityMetrics,
  ScheduleAnalysis,
  ScheduleConflict,
  ScheduleRecommendation,
  TimeAllocation,
  TimeBlock,
  TimeBlockingPreferences,
  WorkLifeBalance,
} from '../../types/calendar';
