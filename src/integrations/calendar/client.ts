/**
 * Calendar Client - Google Workspace MCP Integration
 * Wrapper for Google Calendar operations using MCP tools
 */

import {
  CalendarEvent,
  CalendarFilter,
  CalendarSettings,
  CalendarSyncStatus,
  CreateEventRequest,
  EventCategory,
  ModifyEventRequest,
} from '../../types/calendar';

/**
 * Calendar interface for calendar list items
 */
interface Calendar {
  id: string;
  summary: string;
  primary?: boolean;
  backgroundColor?: string;
  timeZone?: string;
}

/**
 * Calendar client for Google Workspace integration
 */
export class CalendarClient {
  private userEmail: string;
  private settings: CalendarSettings;
  private syncStatus: CalendarSyncStatus;

  constructor(userEmail: string, settings: CalendarSettings) {
    this.userEmail = userEmail;
    this.settings = settings;
    this.syncStatus = {
      lastSync: new Date(),
      calendarsConnected: 0,
      eventsLoaded: 0,
      syncErrors: [],
    };
  }

  /**
   * List all available calendars
   */
  async listCalendars(): Promise<Calendar[]> {
    try {
      // MCP tool: mcp__google-workspace__list_calendars
      // This would be called through MCP in actual implementation
      const calendars: Calendar[] = [];

      // Parse calendar list response
      // Format: "Calendar: Name (ID: calendar-id) [Primary]"

      this.syncStatus.calendarsConnected = calendars.length;
      return calendars;
    } catch (error) {
      this.recordSyncError('all', `Failed to list calendars: ${error}`);
      throw error;
    }
  }

  /**
   * Get events with optional filters
   */
  async getEvents(filter: CalendarFilter = {}): Promise<CalendarEvent[]> {
    try {
      const {
        calendarIds = [this.settings.primaryCalendarId],
        startDate = new Date(),
        endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        searchQuery,
        includeRecurring = true,
        excludeAllDay = false,
      } = filter;

      const allEvents: CalendarEvent[] = [];

      // Query each calendar
      for (const calendarId of calendarIds) {
        const events = await this.getCalendarEvents(
          calendarId,
          startDate,
          endDate,
          searchQuery,
          includeRecurring
        );

        // Filter events based on criteria
        let filteredEvents = events;

        if (excludeAllDay) {
          filteredEvents = filteredEvents.filter(event => {
            const duration = event.end.getTime() - event.start.getTime();
            return duration < 24 * 60 * 60 * 1000; // Less than 24 hours
          });
        }

        if (filter.categories && filter.categories.length > 0) {
          filteredEvents = filteredEvents.filter(
            event => event.metadata?.category && filter.categories!.includes(event.metadata.category)
          );
        }

        if (filter.onlyFree) {
          filteredEvents = filteredEvents.filter(event => event.transparency === 'transparent');
        }

        if (filter.onlyBusy) {
          filteredEvents = filteredEvents.filter(
            event => event.transparency === 'opaque' || !event.transparency
          );
        }

        if (filter.attendeeEmail) {
          filteredEvents = filteredEvents.filter(
            event => event.attendees?.includes(filter.attendeeEmail!)
          );
        }

        allEvents.push(...filteredEvents);
      }

      this.syncStatus.eventsLoaded = allEvents.length;
      this.syncStatus.lastSync = new Date();

      return allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
    } catch (error) {
      this.recordSyncError('all', `Failed to get events: ${error}`);
      throw error;
    }
  }

  /**
   * Get events from a specific calendar
   */
  private async getCalendarEvents(
    calendarId: string,
    startDate: Date,
    endDate: Date,
    searchQuery?: string,
    includeRecurring: boolean = true
  ): Promise<CalendarEvent[]> {
    // MCP tool: mcp__google-workspace__get_events
    // Parameters:
    // - user_google_email: this.userEmail
    // - calendar_id: calendarId
    // - time_min: startDate.toISOString()
    // - time_max: endDate.toISOString()
    // - query: searchQuery (optional)
    // - max_results: 250 (can be adjusted)
    // - detailed: true (to get full event details)
    // - include_attachments: true (to get file attachments)

    // This is a placeholder - actual MCP call would be made here
    // Return empty array for now
    return [];
  }

  /**
   * Create a new calendar event
   */
  async createEvent(request: CreateEventRequest): Promise<CalendarEvent> {
    try {
      const calendarId = request.calendarId || this.settings.primaryCalendarId;

      // MCP tool: mcp__google-workspace__create_event
      // Parameters:
      // - user_google_email: this.userEmail
      // - calendar_id: calendarId
      // - summary: request.summary
      // - start_time: request.startTime.toISOString()
      // - end_time: request.endTime.toISOString()
      // - description: request.description (optional)
      // - location: request.location (optional)
      // - attendees: request.attendees (optional)
      // - add_google_meet: request.addGoogleMeet (optional)
      // - reminders: request.reminders (optional)
      // - transparency: request.transparency (optional)

      // Parse response and create CalendarEvent object
      const event: CalendarEvent = {
        id: 'new-event-id', // From MCP response
        summary: request.summary,
        description: request.description,
        location: request.location,
        start: request.startTime,
        end: request.endTime,
        calendarId,
        attendees: request.attendees,
        transparency: request.transparency || 'opaque',
        status: 'confirmed',
        reminders: request.reminders || this.settings.defaultReminders,
        metadata: {
          category: request.category,
          tags: request.tags,
        },
      };

      return event;
    } catch (error) {
      this.recordSyncError(request.calendarId || 'primary', `Failed to create event: ${error}`);
      throw error;
    }
  }

  /**
   * Modify an existing calendar event
   */
  async modifyEvent(request: ModifyEventRequest): Promise<CalendarEvent> {
    try {
      // MCP tool: mcp__google-workspace__modify_event
      // Parameters:
      // - user_google_email: this.userEmail
      // - calendar_id: request.calendarId
      // - event_id: request.eventId
      // - summary: request.updates.summary (optional)
      // - start_time: request.updates.startTime?.toISOString() (optional)
      // - end_time: request.updates.endTime?.toISOString() (optional)
      // - description: request.updates.description (optional)
      // - location: request.updates.location (optional)
      // - attendees: request.updates.attendees (optional)
      // - add_google_meet: request.updates.addGoogleMeet (optional)
      // - reminders: request.updates.reminders (optional)
      // - transparency: request.updates.transparency (optional)

      // Parse response and create updated CalendarEvent object
      const event: CalendarEvent = {
        id: request.eventId,
        summary: request.updates.summary || 'Event',
        description: request.updates.description,
        location: request.updates.location,
        start: request.updates.startTime || new Date(),
        end: request.updates.endTime || new Date(),
        calendarId: request.calendarId,
        attendees: request.updates.attendees,
        transparency: request.updates.transparency,
        status: 'confirmed',
        reminders: request.updates.reminders,
        metadata: {
          category: request.updates.category,
          tags: request.updates.tags,
        },
      };

      return event;
    } catch (error) {
      this.recordSyncError(request.calendarId, `Failed to modify event: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(eventId: string, calendarId?: string): Promise<void> {
    try {
      const targetCalendarId = calendarId || this.settings.primaryCalendarId;

      // MCP tool: mcp__google-workspace__delete_event
      // Parameters:
      // - user_google_email: this.userEmail
      // - calendar_id: targetCalendarId
      // - event_id: eventId

      // No return value needed
    } catch (error) {
      this.recordSyncError(calendarId || 'primary', `Failed to delete event: ${error}`);
      throw error;
    }
  }

  /**
   * Get a single event by ID
   */
  async getEvent(eventId: string, calendarId?: string): Promise<CalendarEvent | null> {
    try {
      const targetCalendarId = calendarId || this.settings.primaryCalendarId;

      // MCP tool: mcp__google-workspace__get_events with event_id parameter
      // Parameters:
      // - user_google_email: this.userEmail
      // - calendar_id: targetCalendarId
      // - event_id: eventId
      // - detailed: true
      // - include_attachments: true

      // Parse response and return CalendarEvent
      return null;
    } catch (error) {
      this.recordSyncError(calendarId || 'primary', `Failed to get event: ${error}`);
      return null;
    }
  }

  /**
   * Search events by query
   */
  async searchEvents(query: string, calendarIds?: string[]): Promise<CalendarEvent[]> {
    return this.getEvents({
      searchQuery: query,
      calendarIds: calendarIds || [this.settings.primaryCalendarId],
    });
  }

  /**
   * Get events for a specific date
   */
  async getEventsForDate(date: Date, calendarIds?: string[]): Promise<CalendarEvent[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.getEvents({
      startDate: startOfDay,
      endDate: endOfDay,
      calendarIds: calendarIds || [this.settings.primaryCalendarId],
    });
  }

  /**
   * Get events for a date range
   */
  async getEventsInRange(
    startDate: Date,
    endDate: Date,
    calendarIds?: string[]
  ): Promise<CalendarEvent[]> {
    return this.getEvents({
      startDate,
      endDate,
      calendarIds: calendarIds || [this.settings.primaryCalendarId],
    });
  }

  /**
   * Auto-categorize an event based on title and description
   */
  categorizeEvent(event: CalendarEvent): EventCategory {
    const text = `${event.summary} ${event.description || ''}`.toLowerCase();

    // Meeting patterns
    if (
      text.includes('meeting') ||
      text.includes('call') ||
      text.includes('sync') ||
      text.includes('standup') ||
      text.includes('1:1') ||
      (event.attendees && event.attendees.length > 1)
    ) {
      return 'meeting';
    }

    // Deep work patterns
    if (
      text.includes('focus') ||
      text.includes('deep work') ||
      text.includes('coding') ||
      text.includes('writing')
    ) {
      return 'deep-work';
    }

    // Learning patterns
    if (
      text.includes('learn') ||
      text.includes('study') ||
      text.includes('course') ||
      text.includes('training') ||
      text.includes('workshop')
    ) {
      return 'learning';
    }

    // Health patterns
    if (
      text.includes('gym') ||
      text.includes('workout') ||
      text.includes('exercise') ||
      text.includes('doctor') ||
      text.includes('health')
    ) {
      return 'health';
    }

    // Break patterns
    if (text.includes('lunch') || text.includes('break') || text.includes('coffee')) {
      return 'break';
    }

    // Travel patterns
    if (text.includes('flight') || text.includes('travel') || text.includes('commute')) {
      return 'travel';
    }

    // Admin patterns
    if (text.includes('admin') || text.includes('email') || text.includes('review')) {
      return 'admin';
    }

    // Default to work if during work hours
    const hour = event.start.getHours();
    if (hour >= 9 && hour <= 17) {
      return 'work';
    }

    return 'personal';
  }

  /**
   * Get sync status
   */
  getSyncStatus(): CalendarSyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Record a sync error
   */
  private recordSyncError(calendarId: string, error: string): void {
    this.syncStatus.syncErrors.push({
      calendarId,
      error,
      timestamp: new Date(),
    });

    // Keep only last 10 errors
    if (this.syncStatus.syncErrors.length > 10) {
      this.syncStatus.syncErrors = this.syncStatus.syncErrors.slice(-10);
    }
  }

  /**
   * Clear sync errors
   */
  clearSyncErrors(): void {
    this.syncStatus.syncErrors = [];
  }

  /**
   * Update settings
   */
  updateSettings(settings: Partial<CalendarSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  /**
   * Get current settings
   */
  getSettings(): CalendarSettings {
    return { ...this.settings };
  }
}

/**
 * Create a calendar client instance
 */
export function createCalendarClient(
  userEmail: string,
  settings: CalendarSettings
): CalendarClient {
  return new CalendarClient(userEmail, settings);
}
