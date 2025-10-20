/**
 * Date utility functions for review aggregation
 */

/**
 * Get ISO week number for a date
 * Returns week number (1-53) and year
 */
export function getISOWeek(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week: weekNum, year: d.getUTCFullYear() };
}

/**
 * Get start and end dates for a given ISO week
 */
export function getWeekBounds(year: number, week: number): { start: Date; end: Date } {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const weekStart = new Date(jan4);
  weekStart.setUTCDate(jan4.getUTCDate() - jan4Day + 1 + (week - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

  return { start: weekStart, end: weekEnd };
}

/**
 * Get all dates in a week (Monday to Sunday)
 */
export function getDatesInWeek(year: number, week: number): string[] {
  const { start } = getWeekBounds(year, week);
  const dates: string[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + i);
    dates.push(formatDate(date));
  }

  return dates;
}

/**
 * Get all week identifiers in a month
 */
export function getWeeksInMonth(year: number, month: number): string[] {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const weeks = new Set<string>();
  const current = new Date(firstDay);

  while (current <= lastDay) {
    const { week, year: weekYear } = getISOWeek(current);
    weeks.add(formatWeek(weekYear, week));
    current.setDate(current.getDate() + 1);
  }

  return Array.from(weeks).sort();
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format week as YYYY-Www (e.g., 2025-W01)
 */
export function formatWeek(year: number, week: number): string {
  return `${year}-W${String(week).padStart(2, '0')}`;
}

/**
 * Format month as YYYY-MM
 */
export function formatMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Parse date string (YYYY-MM-DD) to Date object
 */
export function parseDate(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Parse week string (YYYY-Www) to year and week number
 */
export function parseWeek(weekStr: string): { year: number; week: number } | null {
  const match = weekStr.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return null;

  const [, year, week] = match;
  return { year: parseInt(year), week: parseInt(week) };
}

/**
 * Parse month string (YYYY-MM) to year and month
 */
export function parseMonth(monthStr: string): { year: number; month: number } | null {
  const match = monthStr.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;

  const [, year, month] = match;
  return { year: parseInt(year), month: parseInt(month) };
}

/**
 * Get month name from month number (1-12)
 */
export function getMonthName(month: number): string {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return names[month - 1] || '';
}

/**
 * Get day name from Date object
 */
export function getDayName(date: Date): string {
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return names[date.getDay()];
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return formatDate(date) === formatDate(today);
}

/**
 * Check if date is in current week
 */
export function isCurrentWeek(date: Date): boolean {
  const today = new Date();
  const { week: currentWeek, year: currentYear } = getISOWeek(today);
  const { week, year } = getISOWeek(date);
  return week === currentWeek && year === currentYear;
}

/**
 * Get relative date description (e.g., "today", "yesterday", "2 days ago")
 */
export function getRelativeDateDescription(date: Date): string {
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays === -1) return 'tomorrow';
  if (diffDays > 0 && diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays < 0 && diffDays >= -7) return `in ${Math.abs(diffDays)} days`;

  return formatDate(date);
}

/**
 * Calculate date range between two dates
 */
export function getDateRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Get date from days offset (positive = future, negative = past)
 */
export function getDateWithOffset(date: Date, daysOffset: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + daysOffset);
  return result;
}
