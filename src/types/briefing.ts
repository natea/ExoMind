/**
 * Types for the briefing system
 */

export interface BriefingContent {
  type: 'morning' | 'evening' | 'weekly';
  date: Date;
  content: {
    greeting?: string;
    priorities?: string[];
    events?: CalendarEvent[];
    tasks?: TaskItem[];
    wins?: string[];
    reflections?: string[];
    preview?: string[];
    gratitude?: string;
  };
  formattedMessage: string;
}

export interface CalendarEvent {
  title: string;
  time: string;
  location?: string;
  duration?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: Date;
}

export interface BriefingSchedule {
  id: string;
  type: 'morning' | 'evening' | 'weekly';
  scheduledTime: string; // HH:MM format
  daysOfWeek: number[]; // 0-6, Sunday=0
  enabled: boolean;
  lastSent?: Date;
  nextScheduled?: Date;
}

export interface DeliveryStatus {
  briefingId: string;
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'retrying';
  sentAt?: Date;
  recipient: string;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export interface BriefingConfig {
  morningTime: string; // Default: "08:00"
  eveningTime: string; // Default: "18:00"
  weeklyDay: number; // Default: 0 (Sunday)
  weeklyTime: string; // Default: "09:00"
  recipient: string; // WhatsApp recipient (phone number or JID)
  timezone: string; // Default: "America/Los_Angeles"
  enabled: {
    morning: boolean;
    evening: boolean;
    weekly: boolean;
  };
}

export interface DailyLog {
  date: string;
  priorities: string[];
  wins: string[];
  reflections: string[];
  tasks: TaskItem[];
  gratitude?: string;
}
