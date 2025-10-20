/**
 * Path Configuration for Life OS
 * Manages file system paths for data storage
 */

import { PathConfig } from '../types/config';
import path from 'path';
import { format } from 'date-fns';

/**
 * Get the base memory directory from environment or use default
 */
export function getMemoryBase(): string {
  return process.env.LIFE_OS_MEMORY_PATH || path.join(process.cwd(), 'memory');
}

/**
 * Create path configuration object
 */
export function createPathConfig(): PathConfig {
  const base = getMemoryBase();

  return {
    memoryBase: base,
    inbox: path.join(base, 'inbox'),
    projects: path.join(base, 'projects'),
    areas: path.join(base, 'areas'),
    resources: path.join(base, 'resources'),
    archive: path.join(base, 'archive'),
    templates: path.join(process.cwd(), 'templates'),
    skills: path.join(process.cwd(), 'skills'),
    daily: path.join(base, 'daily'),
    weekly: path.join(base, 'weekly'),
    monthly: path.join(base, 'monthly'),
    yearly: path.join(base, 'yearly'),
  };
}

/**
 * Path utility functions for date-based files
 */
export class PathUtils {
  constructor(private paths: PathConfig) {}

  /**
   * Get path for daily note
   * @param date - Date for the note (defaults to today)
   * @returns Full path to daily note
   */
  getDailyNotePath(date: Date = new Date()): string {
    const filename = format(date, 'yyyy-MM-dd') + '.md';
    return path.join(this.paths.daily, filename);
  }

  /**
   * Get path for weekly review
   * @param date - Date in the week (defaults to today)
   * @returns Full path to weekly review
   */
  getWeeklyReviewPath(date: Date = new Date()): string {
    const filename = format(date, 'yyyy-\\WW') + '.md';
    return path.join(this.paths.weekly, filename);
  }

  /**
   * Get path for monthly review
   * @param date - Date in the month (defaults to today)
   * @returns Full path to monthly review
   */
  getMonthlyReviewPath(date: Date = new Date()): string {
    const filename = format(date, 'yyyy-MM') + '.md';
    return path.join(this.paths.monthly, filename);
  }

  /**
   * Get path for yearly review
   * @param date - Date in the year (defaults to today)
   * @returns Full path to yearly review
   */
  getYearlyReviewPath(date: Date = new Date()): string {
    const filename = format(date, 'yyyy') + '.md';
    return path.join(this.paths.yearly, filename);
  }

  /**
   * Get path for project
   * @param projectName - Name of the project
   * @returns Full path to project file
   */
  getProjectPath(projectName: string): string {
    const filename = projectName.toLowerCase().replace(/\s+/g, '-') + '.md';
    return path.join(this.paths.projects, filename);
  }

  /**
   * Get path for area
   * @param areaName - Name of the area
   * @returns Full path to area file
   */
  getAreaPath(areaName: string): string {
    const filename = areaName.toLowerCase().replace(/\s+/g, '-') + '.md';
    return path.join(this.paths.areas, filename);
  }

  /**
   * Get path for inbox item
   * @param itemName - Name of the inbox item
   * @returns Full path to inbox file
   */
  getInboxPath(itemName: string): string {
    const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
    const filename = `${timestamp}-${itemName.toLowerCase().replace(/\s+/g, '-')}.md`;
    return path.join(this.paths.inbox, filename);
  }

  /**
   * Get path for archived item
   * @param itemName - Name of the archived item
   * @param date - Date of archival (defaults to today)
   * @returns Full path to archived file
   */
  getArchivePath(itemName: string, date: Date = new Date()): string {
    const yearMonth = format(date, 'yyyy-MM');
    const archiveDir = path.join(this.paths.archive, yearMonth);
    const filename = itemName.toLowerCase().replace(/\s+/g, '-') + '.md';
    return path.join(archiveDir, filename);
  }

  /**
   * Get path for resource
   * @param resourceName - Name of the resource
   * @param category - Optional category/subfolder
   * @returns Full path to resource file
   */
  getResourcePath(resourceName: string, category?: string): string {
    const filename = resourceName.toLowerCase().replace(/\s+/g, '-') + '.md';
    const baseDir = category
      ? path.join(this.paths.resources, category)
      : this.paths.resources;
    return path.join(baseDir, filename);
  }

  /**
   * Get all required directories
   * @returns Array of directory paths that should exist
   */
  getAllDirectories(): string[] {
    return [
      this.paths.memoryBase,
      this.paths.inbox,
      this.paths.projects,
      this.paths.areas,
      this.paths.resources,
      this.paths.archive,
      this.paths.daily,
      this.paths.weekly,
      this.paths.monthly,
      this.paths.yearly,
    ];
  }
}
