/**
 * Message formatting for WhatsApp briefings
 */

import { BriefingContent, CalendarEvent, TaskItem } from '../types/briefing';

const MAX_WHATSAPP_LENGTH = 4096; // WhatsApp message limit
const EMOJI_MAP = {
  morning: '☀️',
  evening: '🌙',
  weekly: '📊',
  calendar: '📅',
  task: '✅',
  priority: '🎯',
  win: '🏆',
  reflection: '💭',
  preview: '👀',
  gratitude: '🙏',
  time: '⏰',
  location: '📍',
};

/**
 * Format briefing content for WhatsApp
 */
export function formatBriefing(briefing: BriefingContent): string {
  switch (briefing.type) {
    case 'morning':
      return formatMorningBriefing(briefing);
    case 'evening':
      return formatEveningBriefing(briefing);
    case 'weekly':
      return formatWeeklySummary(briefing);
    default:
      throw new Error(`Unknown briefing type: ${briefing.type}`);
  }
}

/**
 * Format morning briefing
 */
function formatMorningBriefing(briefing: BriefingContent): string {
  const lines: string[] = [];
  const date = formatDate(briefing.date);

  lines.push(`${EMOJI_MAP.morning} *Good Morning!*`);
  lines.push(`${date}\n`);

  // Top priorities
  if (briefing.content.priorities && briefing.content.priorities.length > 0) {
    lines.push(`${EMOJI_MAP.priority} *Top Priorities Today:*`);
    briefing.content.priorities.slice(0, 3).forEach((priority, idx) => {
      lines.push(`${idx + 1}. ${priority}`);
    });
    lines.push('');
  }

  // Calendar events
  if (briefing.content.events && briefing.content.events.length > 0) {
    lines.push(`${EMOJI_MAP.calendar} *Upcoming Events:*`);
    briefing.content.events.slice(0, 3).forEach(event => {
      lines.push(formatEvent(event));
    });
    lines.push('');
  }

  // High priority tasks
  if (briefing.content.tasks && briefing.content.tasks.length > 0) {
    const highPriorityTasks = briefing.content.tasks.filter(t => t.priority === 'high');
    if (highPriorityTasks.length > 0) {
      lines.push(`${EMOJI_MAP.task} *High Priority Tasks:*`);
      highPriorityTasks.slice(0, 3).forEach(task => {
        lines.push(`• ${task.title}`);
      });
      lines.push('');
    }
  }

  lines.push('Have a productive day! 💪');

  return truncateMessage(lines.join('\n'));
}

/**
 * Format evening briefing
 */
function formatEveningBriefing(briefing: BriefingContent): string {
  const lines: string[] = [];
  const date = formatDate(briefing.date);

  lines.push(`${EMOJI_MAP.evening} *Good Evening!*`);
  lines.push(`${date}\n`);

  // Today's wins
  if (briefing.content.wins && briefing.content.wins.length > 0) {
    lines.push(`${EMOJI_MAP.win} *Today's Wins:*`);
    briefing.content.wins.forEach((win, idx) => {
      lines.push(`${idx + 1}. ${win}`);
    });
    lines.push('');
  } else {
    lines.push(`${EMOJI_MAP.win} *Today's Wins:*`);
    lines.push('_What were your biggest achievements today?_\n');
  }

  // Reflection prompts
  if (briefing.content.reflections && briefing.content.reflections.length > 0) {
    lines.push(`${EMOJI_MAP.reflection} *Reflection:*`);
    briefing.content.reflections.forEach(reflection => {
      lines.push(`• ${reflection}`);
    });
    lines.push('');
  }

  // Tomorrow's preview
  if (briefing.content.preview && briefing.content.preview.length > 0) {
    lines.push(`${EMOJI_MAP.preview} *Tomorrow's Preview:*`);
    briefing.content.preview.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item}`);
    });
    lines.push('');
  }

  // Unfinished tasks
  if (briefing.content.tasks && briefing.content.tasks.length > 0) {
    const unfinishedTasks = briefing.content.tasks.filter(t => t.status !== 'completed');
    if (unfinishedTasks.length > 0) {
      lines.push(`${EMOJI_MAP.task} *Unfinished Tasks (${unfinishedTasks.length}):*`);
      unfinishedTasks.slice(0, 3).forEach(task => {
        lines.push(`• ${task.title}`);
      });
      if (unfinishedTasks.length > 3) {
        lines.push(`  _...and ${unfinishedTasks.length - 3} more_`);
      }
      lines.push('');
    }
  }

  // Gratitude prompt
  if (briefing.content.gratitude) {
    lines.push(`${EMOJI_MAP.gratitude} *Gratitude:*`);
    lines.push(briefing.content.gratitude);
  } else {
    lines.push(`${EMOJI_MAP.gratitude} *What are you grateful for today?*`);
  }

  lines.push('\nRest well! 😴');

  return truncateMessage(lines.join('\n'));
}

/**
 * Format weekly summary
 */
function formatWeeklySummary(briefing: BriefingContent): string {
  const lines: string[] = [];
  const weekRange = getWeekRange(briefing.date);

  lines.push(`${EMOJI_MAP.weekly} *Weekly Summary*`);
  lines.push(`${weekRange}\n`);

  // Week's wins
  if (briefing.content.wins && briefing.content.wins.length > 0) {
    lines.push(`${EMOJI_MAP.win} *This Week's Highlights:*`);
    briefing.content.wins.forEach((win, idx) => {
      lines.push(`${idx + 1}. ${win}`);
    });
    lines.push('');
  }

  // Week's priorities
  if (briefing.content.priorities && briefing.content.priorities.length > 0) {
    lines.push(`${EMOJI_MAP.priority} *Top Accomplishments:*`);
    briefing.content.priorities.forEach((priority, idx) => {
      lines.push(`${idx + 1}. ${priority}`);
    });
    lines.push('');
  }

  // Task statistics
  if (briefing.content.tasks && briefing.content.tasks.length > 0) {
    const completed = briefing.content.tasks.filter(t => t.status === 'completed').length;
    const total = briefing.content.tasks.length;
    const percentage = Math.round((completed / total) * 100);

    lines.push(`${EMOJI_MAP.task} *Task Completion:*`);
    lines.push(`${completed}/${total} tasks completed (${percentage}%)`);
    lines.push('');
  }

  // Reflections
  if (briefing.content.reflections && briefing.content.reflections.length > 0) {
    lines.push(`${EMOJI_MAP.reflection} *Key Insights:*`);
    briefing.content.reflections.forEach(reflection => {
      lines.push(`• ${reflection}`);
    });
    lines.push('');
  }

  lines.push('Have a great week ahead! 🚀');

  return truncateMessage(lines.join('\n'));
}

/**
 * Format calendar event
 */
function formatEvent(event: CalendarEvent): string {
  let formatted = `${EMOJI_MAP.time} ${event.time} - ${event.title}`;
  if (event.location) {
    formatted += `\n  ${EMOJI_MAP.location} ${event.location}`;
  }
  if (event.duration) {
    formatted += ` (${event.duration})`;
  }
  return formatted;
}

/**
 * Format date string
 */
function formatDate(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${dayName}, ${month} ${day}`;
}

/**
 * Get week range string
 */
function getWeekRange(date: Date): string {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const formatShort = (d: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  return `${formatShort(startOfWeek)} - ${formatShort(endOfWeek)}`;
}

/**
 * Truncate message if it exceeds WhatsApp limit
 */
function truncateMessage(message: string): string {
  if (message.length <= MAX_WHATSAPP_LENGTH) {
    return message;
  }

  const truncated = message.substring(0, MAX_WHATSAPP_LENGTH - 50);
  return truncated + '\n\n_Message truncated due to length..._';
}

/**
 * Strip markdown formatting for plain text
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Bold
    .replace(/\*(.*?)\*/g, '$1')      // Italic
    .replace(/_(.*?)_/g, '$1')        // Underline
    .replace(/`(.*?)`/g, '$1')        // Code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Links
}

/**
 * Add bullet points to list items
 */
export function formatList(items: string[]): string {
  return items.map(item => `• ${item}`).join('\n');
}
