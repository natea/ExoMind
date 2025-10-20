/**
 * Memory System Health Checks
 *
 * Validates memory directory structure, file permissions, format,
 * and identifies orphaned or corrupted files.
 */

import { MemoryHealth, CheckResult, HealthStatus } from '../types/health.js';
import { promises as fs } from 'fs';
import * as path from 'path';

const MEMORY_DIR = path.join(process.cwd(), '.memory');
const THIRTY_DAYS_AGO = Date.now() - (30 * 24 * 60 * 60 * 1000);

/**
 * Check if memory directory exists and is accessible
 */
async function checkDirectoryAccess(): Promise<{
  exists: boolean;
  readable: boolean;
  writable: boolean;
}> {
  try {
    await fs.access(MEMORY_DIR, fs.constants.F_OK);

    // Check read permission
    let readable = true;
    try {
      await fs.access(MEMORY_DIR, fs.constants.R_OK);
    } catch {
      readable = false;
    }

    // Check write permission
    let writable = true;
    try {
      await fs.access(MEMORY_DIR, fs.constants.W_OK);
    } catch {
      writable = false;
    }

    return { exists: true, readable, writable };
  } catch {
    return { exists: false, readable: false, writable: false };
  }
}

/**
 * Get all memory files recursively
 */
async function getAllMemoryFiles(dir: string = MEMORY_DIR): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively get files from subdirectories
        const subFiles = await getAllMemoryFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist or is inaccessible
  }

  return files;
}

/**
 * Calculate total size of all memory files
 */
async function calculateTotalSize(files: string[]): Promise<number> {
  let totalSize = 0;

  for (const file of files) {
    try {
      const stats = await fs.stat(file);
      totalSize += stats.size;
    } catch {
      // Skip files we can't stat
    }
  }

  return totalSize;
}

/**
 * Count recent files (modified in last 30 days)
 */
async function countRecentFiles(files: string[]): Promise<number> {
  let recentCount = 0;

  for (const file of files) {
    try {
      const stats = await fs.stat(file);
      if (stats.mtimeMs > THIRTY_DAYS_AGO) {
        recentCount++;
      }
    } catch {
      // Skip files we can't stat
    }
  }

  return recentCount;
}

/**
 * Validate JSON file format
 */
async function validateJsonFile(file: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const content = await fs.readFile(file, 'utf-8');
    JSON.parse(content);
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Find corrupted files (invalid JSON)
 */
async function findCorruptedFiles(files: string[]): Promise<string[]> {
  const corrupted: string[] = [];

  for (const file of files) {
    const result = await validateJsonFile(file);
    if (!result.valid) {
      corrupted.push(file);
    }
  }

  return corrupted;
}

/**
 * Find orphaned files (no corresponding memory entry reference)
 * For now, we'll just check for very old files (>90 days)
 */
async function findOrphanedFiles(files: string[]): Promise<string[]> {
  const orphaned: string[] = [];
  const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);

  for (const file of files) {
    try {
      const stats = await fs.stat(file);
      if (stats.mtimeMs < ninetyDaysAgo) {
        orphaned.push(file);
      }
    } catch {
      // Skip files we can't stat
    }
  }

  return orphaned;
}

/**
 * Check memory system health
 */
export async function checkMemoryHealth(): Promise<MemoryHealth> {
  const issues: string[] = [];

  // Check directory access
  const access = await checkDirectoryAccess();

  if (!access.exists) {
    return {
      status: 'unhealthy',
      directoryExists: false,
      permissions: { readable: false, writable: false },
      fileCount: 0,
      totalSizeBytes: 0,
      recentFiles: 0,
      orphanedFiles: [],
      corruptedFiles: [],
      issues: ['Memory directory does not exist']
    };
  }

  if (!access.readable) {
    issues.push('Memory directory is not readable');
  }

  if (!access.writable) {
    issues.push('Memory directory is not writable');
  }

  // Get all memory files
  const files = await getAllMemoryFiles();
  const totalSize = await calculateTotalSize(files);
  const recentFiles = await countRecentFiles(files);
  const corruptedFiles = await findCorruptedFiles(files);
  const orphanedFiles = await findOrphanedFiles(files);

  if (corruptedFiles.length > 0) {
    issues.push(`${corruptedFiles.length} corrupted file(s) detected`);
  }

  if (orphanedFiles.length > 5) {
    issues.push(`${orphanedFiles.length} potentially orphaned file(s) detected`);
  }

  // Determine status
  let status: HealthStatus;
  if (!access.readable || !access.writable || corruptedFiles.length > 0) {
    status = 'unhealthy';
  } else if (issues.length > 0) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }

  return {
    status,
    directoryExists: access.exists,
    permissions: {
      readable: access.readable,
      writable: access.writable
    },
    fileCount: files.length,
    totalSizeBytes: totalSize,
    recentFiles,
    orphanedFiles: orphanedFiles.slice(0, 10), // Limit to first 10
    corruptedFiles: corruptedFiles.slice(0, 10), // Limit to first 10
    issues
  };
}

/**
 * Convert memory health to check result
 */
export function memoryToCheckResult(memory: MemoryHealth): CheckResult {
  const sizeMB = (memory.totalSizeBytes / (1024 * 1024)).toFixed(2);

  return {
    name: 'Memory System',
    category: 'memory',
    status: memory.status,
    message: memory.directoryExists
      ? `Memory system ${memory.status} - ${memory.fileCount} files (${sizeMB} MB)`
      : 'Memory directory does not exist',
    details: {
      directoryExists: memory.directoryExists,
      permissions: memory.permissions,
      fileCount: memory.fileCount,
      totalSizeMB: sizeMB,
      recentFiles: memory.recentFiles,
      orphanedCount: memory.orphanedFiles.length,
      corruptedCount: memory.corruptedFiles.length,
      issues: memory.issues
    },
    timestamp: new Date()
  };
}

/**
 * Check if memory directory needs cleanup
 */
export async function needsCleanup(): Promise<boolean> {
  const health = await checkMemoryHealth();
  return health.orphanedFiles.length > 10 || health.corruptedFiles.length > 0;
}

/**
 * Get memory usage percentage (if there's a limit)
 */
export async function getMemoryUsagePercentage(limitMB: number = 100): Promise<number> {
  const health = await checkMemoryHealth();
  const usedMB = health.totalSizeBytes / (1024 * 1024);
  return (usedMB / limitMB) * 100;
}
