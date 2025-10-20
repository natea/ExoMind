#!/usr/bin/env node

/**
 * CLI for briefing system
 */

import {
  generateMorningBriefing,
  generateEveningBriefing,
  generateWeeklySummary,
  ensureMemoryDirectories,
} from './generator';
import {
  startScheduler,
  triggerBriefing,
  loadConfig,
  saveConfig,
  initializeScheduler,
  checkPendingBriefings,
} from './scheduler';
import {
  getDeliveryHistory,
  getDeliveryStats,
} from './whatsapp-sender';

const command = process.argv[2];
const args = process.argv.slice(3);

async function main() {
  try {
    ensureMemoryDirectories();
    initializeScheduler();

    switch (command) {
      case 'generate': {
        const type = args[0] as 'morning' | 'evening' | 'weekly';

        if (!type || !['morning', 'evening', 'weekly'].includes(type)) {
          console.error('Usage: briefing generate <morning|evening|weekly>');
          process.exit(1);
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
        }

        console.log('\n' + briefing.formattedMessage + '\n');
        break;
      }

      case 'send': {
        const type = args[0] as 'morning' | 'evening' | 'weekly';
        const recipient = args[1];

        if (!type || !['morning', 'evening', 'weekly'].includes(type)) {
          console.error('Usage: briefing send <morning|evening|weekly> [recipient]');
          process.exit(1);
        }

        const status = await triggerBriefing(type, recipient);

        if (status.status === 'sent') {
          console.log(`✅ Briefing sent successfully to ${status.recipient}`);
        } else {
          console.error(`❌ Failed to send briefing: ${status.error}`);
          process.exit(1);
        }
        break;
      }

      case 'schedule': {
        console.log('Starting briefing scheduler...');
        await startScheduler();

        // Keep process running
        process.on('SIGINT', () => {
          console.log('\nScheduler stopped');
          process.exit(0);
        });
        break;
      }

      case 'check': {
        const pending = await checkPendingBriefings();

        if (pending.length === 0) {
          console.log('No pending briefings');
        } else {
          console.log(`Found ${pending.length} pending briefing(s):`);
          pending.forEach(schedule => {
            console.log(`  - ${schedule.type} (${schedule.id})`);
          });
        }
        break;
      }

      case 'config': {
        const subcommand = args[0];

        if (subcommand === 'show') {
          const config = loadConfig();
          console.log(JSON.stringify(config, null, 2));
        } else if (subcommand === 'set') {
          const key = args[1];
          const value = args[2];

          if (!key || !value) {
            console.error('Usage: briefing config set <key> <value>');
            process.exit(1);
          }

          const config = loadConfig();

          // Handle nested keys (e.g., enabled.morning)
          const keys = key.split('.');
          let current: any = config;

          for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) {
              console.error(`Invalid config key: ${key}`);
              process.exit(1);
            }
            current = current[keys[i]];
          }

          const lastKey = keys[keys.length - 1];

          // Parse value
          let parsedValue: any = value;
          if (value === 'true') parsedValue = true;
          else if (value === 'false') parsedValue = false;
          else if (!isNaN(Number(value))) parsedValue = Number(value);

          current[lastKey] = parsedValue;

          saveConfig(config);
          console.log(`✅ Updated ${key} = ${parsedValue}`);
        } else {
          console.error('Usage: briefing config <show|set>');
          process.exit(1);
        }
        break;
      }

      case 'stats': {
        const days = parseInt(args[0]) || 7;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const stats = await getDeliveryStats(startDate, endDate);

        console.log(`\nDelivery Statistics (last ${days} days):`);
        console.log(`  Total: ${stats.total}`);
        console.log(`  Sent: ${stats.sent}`);
        console.log(`  Failed: ${stats.failed}`);
        console.log(`  Retried: ${stats.retried}`);
        console.log(`  Success Rate: ${stats.successRate}%\n`);
        break;
      }

      case 'history': {
        const days = parseInt(args[0]) || 7;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const history = await getDeliveryHistory(startDate, endDate);

        console.log(`\nDelivery History (last ${days} days):\n`);

        if (history.length === 0) {
          console.log('No deliveries found');
        } else {
          history.forEach(entry => {
            const status = entry.status === 'sent' ? '✅' : '❌';
            const date = entry.sentAt ? entry.sentAt.toLocaleString() : 'N/A';
            console.log(`${status} ${entry.briefingId}`);
            console.log(`   To: ${entry.recipient}`);
            console.log(`   When: ${date}`);
            if (entry.error) {
              console.log(`   Error: ${entry.error}`);
            }
            console.log('');
          });
        }
        break;
      }

      default:
        console.log(`
Briefing System CLI

Usage:
  briefing generate <morning|evening|weekly>
    Generate a briefing and display it

  briefing send <morning|evening|weekly> [recipient]
    Generate and send a briefing via WhatsApp

  briefing schedule
    Start the automated briefing scheduler

  briefing check
    Check for pending briefings

  briefing config show
    Show current configuration

  briefing config set <key> <value>
    Update configuration
    Examples:
      briefing config set recipient 14155551234
      briefing config set morningTime 07:30
      briefing config set enabled.morning true

  briefing stats [days]
    Show delivery statistics (default: 7 days)

  briefing history [days]
    Show delivery history (default: 7 days)
        `);
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
