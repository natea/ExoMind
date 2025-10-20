/**
 * Briefing content generator
 */

import * as fs from 'fs';
import * as path from 'path';
import { BriefingContent, CalendarEvent, TaskItem, DailyLog } from '../types/briefing';
import { formatBriefing } from './formatter';

const MEMORY_DIR = path.join(process.cwd(), 'memory');
const DAILY_LOGS_DIR = path.join(MEMORY_DIR, 'daily-logs');
const TASKS_FILE = path.join(MEMORY_DIR, 'tasks.json');
const CALENDAR_FILE = path.join(MEMORY_DIR, 'calendar.json');

/**
 * Generate morning briefing
 */
export async function generateMorningBriefing(date: Date = new Date()): Promise<BriefingContent> {
  const dateStr = formatDateForFile(date);

  // Load today's data
  const priorities = await loadTodaysPriorities(dateStr);
  const events = await loadTodaysEvents(date);
  const tasks = await loadHighPriorityTasks();

  const briefing: BriefingContent = {
    type: 'morning',
    date,
    content: {
      greeting: getTimeBasedGreeting(date),
      priorities: priorities.slice(0, 3),
      events: events.slice(0, 3),
      tasks: tasks.filter(t => t.priority === 'high').slice(0, 5),
    },
    formattedMessage: '',
  };

  briefing.formattedMessage = formatBriefing(briefing);
  return briefing;
}

/**
 * Generate evening briefing
 */
export async function generateEveningBriefing(date: Date = new Date()): Promise<BriefingContent> {
  const dateStr = formatDateForFile(date);

  // Load today's data
  const dailyLog = await loadDailyLog(dateStr);
  const tomorrowPriorities = await loadTomorrowsPriorities(date);
  const unfinishedTasks = await loadUnfinishedTasks();

  const briefing: BriefingContent = {
    type: 'evening',
    date,
    content: {
      wins: dailyLog?.wins || [],
      reflections: dailyLog?.reflections || generateReflectionPrompts(),
      preview: tomorrowPriorities.slice(0, 3),
      tasks: unfinishedTasks.slice(0, 5),
      gratitude: dailyLog?.gratitude,
    },
    formattedMessage: '',
  };

  briefing.formattedMessage = formatBriefing(briefing);
  return briefing;
}

/**
 * Generate weekly summary
 */
export async function generateWeeklySummary(date: Date = new Date()): Promise<BriefingContent> {
  const weekDates = getWeekDates(date);

  // Aggregate week's data
  const weekWins: string[] = [];
  const weekPriorities: string[] = [];
  const weekTasks: TaskItem[] = [];
  const weekReflections: string[] = [];

  for (const weekDate of weekDates) {
    const dateStr = formatDateForFile(weekDate);
    const dailyLog = await loadDailyLog(dateStr);

    if (dailyLog) {
      weekWins.push(...(dailyLog.wins || []));
      weekPriorities.push(...(dailyLog.priorities || []));
      weekTasks.push(...(dailyLog.tasks || []));
      weekReflections.push(...(dailyLog.reflections || []));
    }
  }

  const briefing: BriefingContent = {
    type: 'weekly',
    date,
    content: {
      wins: weekWins.slice(0, 7),
      priorities: weekPriorities.slice(0, 5),
      tasks: weekTasks,
      reflections: weekReflections.slice(0, 3),
    },
    formattedMessage: '',
  };

  briefing.formattedMessage = formatBriefing(briefing);
  return briefing;
}

/**
 * Load today's priorities from daily log
 */
async function loadTodaysPriorities(dateStr: string): Promise<string[]> {
  const dailyLog = await loadDailyLog(dateStr);

  if (dailyLog?.priorities) {
    return dailyLog.priorities;
  }

  // Fallback to high priority tasks
  const tasks = await loadHighPriorityTasks();
  return tasks.map(t => t.title).slice(0, 3);
}

/**
 * Load tomorrow's priorities
 */
async function loadTomorrowsPriorities(today: Date): Promise<string[]> {
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = formatDateForFile(tomorrow);

  const dailyLog = await loadDailyLog(dateStr);

  if (dailyLog?.priorities) {
    return dailyLog.priorities;
  }

  // Generate default preview
  return [
    'Review and prioritize tasks',
    'Check calendar for meetings',
    'Plan deep work sessions',
  ];
}

/**
 * Load today's calendar events
 */
async function loadTodaysEvents(date: Date): Promise<CalendarEvent[]> {
  try {
    if (!fs.existsSync(CALENDAR_FILE)) {
      return [];
    }

    const calendarData = JSON.parse(fs.readFileSync(CALENDAR_FILE, 'utf-8'));
    const todayStr = date.toISOString().split('T')[0];

    // Filter events for today
    const todaysEvents = calendarData.events?.filter((event: any) => {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === todayStr;
    }) || [];

    return todaysEvents.map((event: any) => ({
      title: event.title || event.summary,
      time: formatEventTime(new Date(event.start)),
      location: event.location,
      duration: calculateDuration(new Date(event.start), new Date(event.end)),
    }));
  } catch (error) {
    console.error('Error loading calendar events:', error);
    return [];
  }
}

/**
 * Load high priority tasks
 */
async function loadHighPriorityTasks(): Promise<TaskItem[]> {
  try {
    if (!fs.existsSync(TASKS_FILE)) {
      return [];
    }

    const tasksData = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    const tasks: TaskItem[] = tasksData.tasks || [];

    return tasks.filter(t => t.priority === 'high' && t.status !== 'completed');
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}

/**
 * Load unfinished tasks
 */
async function loadUnfinishedTasks(): Promise<TaskItem[]> {
  try {
    if (!fs.existsSync(TASKS_FILE)) {
      return [];
    }

    const tasksData = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    const tasks: TaskItem[] = tasksData.tasks || [];

    return tasks.filter(t => t.status !== 'completed');
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}

/**
 * Load daily log
 */
async function loadDailyLog(dateStr: string): Promise<DailyLog | null> {
  try {
    const logFile = path.join(DAILY_LOGS_DIR, `${dateStr}.json`);

    if (!fs.existsSync(logFile)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(logFile, 'utf-8'));
  } catch (error) {
    console.error(`Error loading daily log for ${dateStr}:`, error);
    return null;
  }
}

/**
 * Generate reflection prompts
 */
function generateReflectionPrompts(): string[] {
  const prompts = [
    'What went well today?',
    'What could have gone better?',
    'What did you learn?',
    'What are you proud of?',
    'What surprised you today?',
  ];

  // Return 2-3 random prompts
  const shuffled = prompts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}

/**
 * Get time-based greeting
 */
function getTimeBasedGreeting(date: Date): string {
  const hour = date.getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Format date for file name (YYYY-MM-DD)
 */
function formatDateForFile(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format event time
 */
function formatEventTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes).padStart(2, '0');

  return `${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Calculate event duration
 */
function calculateDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 60) {
    return `${diffMins}m`;
  }

  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Get dates for the current week (Sunday to Saturday)
 */
function getWeekDates(date: Date): Date[] {
  const dates: Date[] = [];
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(startOfWeek);
    weekDate.setDate(startOfWeek.getDate() + i);
    dates.push(weekDate);
  }

  return dates;
}

/**
 * Ensure memory directories exist
 */
export function ensureMemoryDirectories(): void {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }

  if (!fs.existsSync(DAILY_LOGS_DIR)) {
    fs.mkdirSync(DAILY_LOGS_DIR, { recursive: true });
  }
}
