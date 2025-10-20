/**
 * Automated briefing scheduler
 */

import * as fs from 'fs';
import * as path from 'path';
import { BriefingSchedule, BriefingConfig, DeliveryStatus } from '../types/briefing';
import { generateMorningBriefing, generateEveningBriefing, generateWeeklySummary } from './generator';
import { sendBriefing } from './whatsapp-sender';

const CONFIG_DIR = path.join(process.cwd(), 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'briefing-config.json');
const SCHEDULE_FILE = path.join(CONFIG_DIR, 'briefing-schedule.json');

const DEFAULT_CONFIG: BriefingConfig = {
  morningTime: '08:00',
  eveningTime: '18:00',
  weeklyDay: 0, // Sunday
  weeklyTime: '09:00',
  recipient: '', // Must be set by user
  timezone: 'America/Los_Angeles',
  enabled: {
    morning: true,
    evening: true,
    weekly: true,
  },
};

const DEFAULT_SCHEDULES: BriefingSchedule[] = [
  {
    id: 'morning-briefing',
    type: 'morning',
    scheduledTime: '08:00',
    daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday
    enabled: true,
  },
  {
    id: 'evening-briefing',
    type: 'evening',
    scheduledTime: '18:00',
    daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday
    enabled: true,
  },
  {
    id: 'weekly-summary',
    type: 'weekly',
    scheduledTime: '09:00',
    daysOfWeek: [0], // Sunday
    enabled: true,
  },
];

/**
 * Initialize scheduler configuration
 */
export function initializeScheduler(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
  }

  if (!fs.existsSync(SCHEDULE_FILE)) {
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(DEFAULT_SCHEDULES, null, 2));
  }
}

/**
 * Load configuration
 */
export function loadConfig(): BriefingConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return DEFAULT_CONFIG;
    }

    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  } catch (error) {
    console.error('Error loading config:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save configuration
 */
export function saveConfig(config: BriefingConfig): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
}

/**
 * Load schedules
 */
export function loadSchedules(): BriefingSchedule[] {
  try {
    if (!fs.existsSync(SCHEDULE_FILE)) {
      return DEFAULT_SCHEDULES;
    }

    return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf-8'));
  } catch (error) {
    console.error('Error loading schedules:', error);
    return DEFAULT_SCHEDULES;
  }
}

/**
 * Save schedules
 */
export function saveSchedules(schedules: BriefingSchedule[]): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }

    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
  } catch (error) {
    console.error('Error saving schedules:', error);
    throw error;
  }
}

/**
 * Check for pending briefings
 */
export async function checkPendingBriefings(): Promise<BriefingSchedule[]> {
  const config = loadConfig();
  const schedules = loadSchedules();
  const now = new Date();
  const pending: BriefingSchedule[] = [];

  for (const schedule of schedules) {
    if (!schedule.enabled) {
      continue;
    }

    // Check if briefing is enabled in config
    if (!config.enabled[schedule.type]) {
      continue;
    }

    // Check if today is a scheduled day
    const dayOfWeek = now.getDay();
    if (!schedule.daysOfWeek.includes(dayOfWeek)) {
      continue;
    }

    // Check if it's time to send
    const [scheduleHour, scheduleMinute] = schedule.scheduledTime.split(':').map(Number);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check if we're within 5 minutes of scheduled time
    if (
      currentHour === scheduleHour &&
      Math.abs(currentMinute - scheduleMinute) <= 5
    ) {
      // Check if already sent today
      if (!wasAlreadySentToday(schedule)) {
        pending.push(schedule);
      }
    }
  }

  return pending;
}

/**
 * Check if briefing was already sent today
 */
function wasAlreadySentToday(schedule: BriefingSchedule): boolean {
  if (!schedule.lastSent) {
    return false;
  }

  const lastSent = new Date(schedule.lastSent);
  const now = new Date();

  return (
    lastSent.getFullYear() === now.getFullYear() &&
    lastSent.getMonth() === now.getMonth() &&
    lastSent.getDate() === now.getDate()
  );
}

/**
 * Update schedule last sent time
 */
export function updateScheduleLastSent(scheduleId: string): void {
  const schedules = loadSchedules();
  const schedule = schedules.find(s => s.id === scheduleId);

  if (schedule) {
    schedule.lastSent = new Date();
    saveSchedules(schedules);
  }
}

/**
 * Process pending briefings
 */
export async function processPendingBriefings(): Promise<DeliveryStatus[]> {
  const config = loadConfig();
  const pending = await checkPendingBriefings();
  const statuses: DeliveryStatus[] = [];

  if (!config.recipient) {
    console.warn('No recipient configured for briefings');
    return statuses;
  }

  for (const schedule of pending) {
    try {
      let briefing;

      switch (schedule.type) {
        case 'morning':
          briefing = await generateMorningBriefing();
          break;
        case 'evening':
          briefing = await generateEveningBriefing();
          break;
        case 'weekly':
          briefing = await generateWeeklySummary();
          break;
        default:
          console.error(`Unknown briefing type: ${schedule.type}`);
          continue;
      }

      const status = await sendBriefing(briefing, config.recipient);

      if (status.status === 'sent') {
        updateScheduleLastSent(schedule.id);
      }

      statuses.push(status);
    } catch (error) {
      console.error(`Error processing briefing ${schedule.id}:`, error);
      statuses.push({
        briefingId: schedule.id,
        status: 'failed',
        recipient: config.recipient,
        error: error instanceof Error ? error.message : 'Unknown error',
        retryCount: 0,
        maxRetries: 3,
      });
    }
  }

  return statuses;
}

/**
 * Get next scheduled briefing time
 */
export function getNextScheduledTime(schedule: BriefingSchedule): Date | null {
  const now = new Date();
  const [hour, minute] = schedule.scheduledTime.split(':').map(Number);

  // Find next scheduled day
  let daysToAdd = 0;
  const currentDay = now.getDay();

  // Sort days and find next occurrence
  const sortedDays = [...schedule.daysOfWeek].sort((a, b) => a - b);

  for (const day of sortedDays) {
    if (day > currentDay) {
      daysToAdd = day - currentDay;
      break;
    }
  }

  // If no day found in current week, use first day of next week
  if (daysToAdd === 0 && sortedDays.length > 0) {
    daysToAdd = 7 - currentDay + sortedDays[0];
  }

  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysToAdd);
  nextDate.setHours(hour, minute, 0, 0);

  return nextDate;
}

/**
 * Start scheduler (runs in background)
 */
export async function startScheduler(intervalMinutes: number = 5): Promise<void> {
  console.log('Starting briefing scheduler...');
  initializeScheduler();

  // Initial check
  await processPendingBriefings();

  // Set up interval
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(async () => {
    try {
      await processPendingBriefings();
    } catch (error) {
      console.error('Error in scheduler interval:', error);
    }
  }, intervalMs);

  console.log(`Scheduler running (checking every ${intervalMinutes} minutes)`);
}

/**
 * Manually trigger a briefing
 */
export async function triggerBriefing(
  type: 'morning' | 'evening' | 'weekly',
  recipient?: string
): Promise<DeliveryStatus> {
  const config = loadConfig();
  const targetRecipient = recipient || config.recipient;

  if (!targetRecipient) {
    throw new Error('No recipient specified');
  }

  let briefing;

  switch (type) {
    case 'morning':
      briefing = await generateMorningBriefing();
      break;
    case 'evening':
      briefing = await generateEveningBriefing();
      break;
    case 'weekly':
      briefing = await generateWeeklySummary();
      break;
    default:
      throw new Error(`Unknown briefing type: ${type}`);
  }

  return await sendBriefing(briefing, targetRecipient);
}
