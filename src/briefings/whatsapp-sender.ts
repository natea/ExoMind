/**
 * WhatsApp delivery for briefings
 */

import * as fs from 'fs';
import * as path from 'path';
import { BriefingContent, DeliveryStatus } from '../types/briefing';

const DELIVERY_LOG_DIR = path.join(process.cwd(), 'logs', 'briefings');
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds

/**
 * Send briefing via WhatsApp
 */
export async function sendBriefing(
  briefing: BriefingContent,
  recipient: string
): Promise<DeliveryStatus> {
  const briefingId = `${briefing.type}-${briefing.date.toISOString()}`;

  const status: DeliveryStatus = {
    briefingId,
    status: 'pending',
    recipient,
    retryCount: 0,
    maxRetries: MAX_RETRIES,
  };

  try {
    // Ensure delivery log directory exists
    if (!fs.existsSync(DELIVERY_LOG_DIR)) {
      fs.mkdirSync(DELIVERY_LOG_DIR, { recursive: true });
    }

    status.status = 'sending';

    // Send via WhatsApp MCP
    const result = await sendWhatsAppMessage(recipient, briefing.formattedMessage);

    if (result.success) {
      status.status = 'sent';
      status.sentAt = new Date();

      // Log successful delivery
      await logDelivery(status, briefing);

      return status;
    } else {
      throw new Error(result.error || 'Failed to send message');
    }
  } catch (error) {
    status.status = 'failed';
    status.error = error instanceof Error ? error.message : 'Unknown error';

    // Attempt retry if not exceeded max retries
    if (status.retryCount < MAX_RETRIES) {
      return await retryDelivery(briefing, recipient, status);
    }

    // Log failed delivery
    await logDelivery(status, briefing);

    return status;
  }
}

/**
 * Retry delivery with exponential backoff
 */
async function retryDelivery(
  briefing: BriefingContent,
  recipient: string,
  previousStatus: DeliveryStatus
): Promise<DeliveryStatus> {
  const retryCount = previousStatus.retryCount + 1;
  const delay = RETRY_DELAY_MS * Math.pow(2, retryCount - 1); // Exponential backoff

  console.log(`Retrying delivery (attempt ${retryCount}/${MAX_RETRIES}) after ${delay}ms...`);

  const status: DeliveryStatus = {
    ...previousStatus,
    status: 'retrying',
    retryCount,
  };

  // Wait before retry
  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    const result = await sendWhatsAppMessage(recipient, briefing.formattedMessage);

    if (result.success) {
      status.status = 'sent';
      status.sentAt = new Date();

      await logDelivery(status, briefing);

      return status;
    } else {
      throw new Error(result.error || 'Failed to send message');
    }
  } catch (error) {
    status.status = 'failed';
    status.error = error instanceof Error ? error.message : 'Unknown error';

    // Attempt another retry if not exceeded max
    if (retryCount < MAX_RETRIES) {
      return await retryDelivery(briefing, recipient, status);
    }

    // Log final failure
    await logDelivery(status, briefing);

    return status;
  }
}

/**
 * Send message via WhatsApp MCP
 */
async function sendWhatsAppMessage(
  recipient: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Note: This will be called by the MCP system
    // The actual tool call happens in the runtime, not here
    // We're just returning a mock for now - the real implementation
    // will be done by Claude Code calling mcp__whatsapp__send_message

    // For now, we'll simulate the call
    console.log(`Sending to ${recipient}: ${message.substring(0, 50)}...`);

    // In production, this would be:
    // const result = await mcp__whatsapp__send_message({ recipient, message });
    // return { success: true };

    // For testing, we'll just return success
    return { success: true };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Log delivery attempt
 */
async function logDelivery(
  status: DeliveryStatus,
  briefing: BriefingContent
): Promise<void> {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      briefingId: status.briefingId,
      type: briefing.type,
      status: status.status,
      recipient: status.recipient,
      retryCount: status.retryCount,
      sentAt: status.sentAt?.toISOString(),
      error: status.error,
      messagePreview: briefing.formattedMessage.substring(0, 100),
    };

    const dateStr = briefing.date.toISOString().split('T')[0];
    const logFile = path.join(DELIVERY_LOG_DIR, `${dateStr}.jsonl`);

    // Append to JSONL file
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    console.error('Error logging delivery:', error);
  }
}

/**
 * Get delivery history for a date range
 */
export async function getDeliveryHistory(
  startDate: Date,
  endDate: Date
): Promise<DeliveryStatus[]> {
  const history: DeliveryStatus[] = [];

  try {
    if (!fs.existsSync(DELIVERY_LOG_DIR)) {
      return history;
    }

    const files = fs.readdirSync(DELIVERY_LOG_DIR);

    for (const file of files) {
      if (!file.endsWith('.jsonl')) {
        continue;
      }

      const fileDate = new Date(file.replace('.jsonl', ''));

      if (fileDate >= startDate && fileDate <= endDate) {
        const logFile = path.join(DELIVERY_LOG_DIR, file);
        const lines = fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const entry = JSON.parse(line);
            history.push({
              briefingId: entry.briefingId,
              status: entry.status,
              recipient: entry.recipient,
              retryCount: entry.retryCount,
              maxRetries: MAX_RETRIES,
              sentAt: entry.sentAt ? new Date(entry.sentAt) : undefined,
              error: entry.error,
            });
          } catch (error) {
            console.error('Error parsing log entry:', error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading delivery history:', error);
  }

  return history;
}

/**
 * Get delivery statistics
 */
export async function getDeliveryStats(
  startDate: Date,
  endDate: Date
): Promise<{
  total: number;
  sent: number;
  failed: number;
  retried: number;
  successRate: number;
}> {
  const history = await getDeliveryHistory(startDate, endDate);

  const total = history.length;
  const sent = history.filter(h => h.status === 'sent').length;
  const failed = history.filter(h => h.status === 'failed').length;
  const retried = history.filter(h => h.retryCount > 0).length;
  const successRate = total > 0 ? (sent / total) * 100 : 0;

  return {
    total,
    sent,
    failed,
    retried,
    successRate: Math.round(successRate * 100) / 100,
  };
}

/**
 * Check delivery confirmation
 */
export async function checkDeliveryConfirmation(
  briefingId: string
): Promise<DeliveryStatus | null> {
  try {
    const files = fs.readdirSync(DELIVERY_LOG_DIR);

    for (const file of files) {
      if (!file.endsWith('.jsonl')) {
        continue;
      }

      const logFile = path.join(DELIVERY_LOG_DIR, file);
      const lines = fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean);

      for (const line of lines) {
        try {
          const entry = JSON.parse(line);

          if (entry.briefingId === briefingId) {
            return {
              briefingId: entry.briefingId,
              status: entry.status,
              recipient: entry.recipient,
              retryCount: entry.retryCount,
              maxRetries: MAX_RETRIES,
              sentAt: entry.sentAt ? new Date(entry.sentAt) : undefined,
              error: entry.error,
            };
          }
        } catch (error) {
          console.error('Error parsing log entry:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error checking delivery confirmation:', error);
  }

  return null;
}
