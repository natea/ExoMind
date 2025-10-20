/**
 * Default Configuration Values for Life OS
 * These defaults are used when no custom configuration is provided
 */

import { LifeOSSettings } from './settings';

/**
 * Default configuration object
 */
export const DEFAULT_SETTINGS: LifeOSSettings = {
  memory: {
    databasePath: './.swarm/memory.db',
    persistent: true,
    retentionDays: 90,
    compression: true,
  },

  skills: {
    enabled: {
      'meal_planning': true,
      'recipe-finding': true,
      'grocery-shopping': true,
      'whatsapp-message-management': true,
      'personality_assessment': true,
    },
    settings: {
      'meal_planning': {
        weeklyPlanDay: 'sunday',
        mealsPerWeek: 7,
        servingsPerMeal: 2,
      },
      'grocery-shopping': {
        checkPantry: true,
        consolidateIngredients: true,
        preferredStores: ['costco', 'instacart'],
      },
      'whatsapp-message-management': {
        autoSendBriefing: false,
        briefingTime: '08:00',
      },
    },
    autoLoad: true,
  },

  integrations: {
    whatsapp: {
      enabled: false,
      autoSend: false,
    },
    calendar: {
      enabled: false,
      provider: 'google',
      syncInterval: 3600, // 1 hour in seconds
    },
    shopping: {
      costcoEnabled: false,
      instacartEnabled: false,
      defaultStore: 'manual',
    },
  },

  api: {
    anthropic: {
      model: 'claude-sonnet-4-5-20250929',
      maxTokens: 4096,
      temperature: 0.7,
    },
  },

  user: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'en',
    notifications: {
      email: false,
      push: false,
      whatsapp: false,
    },
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      allergies: [],
      dislikes: [],
    },
  },

  system: {
    debug: false,
    logLevel: 'info',
    telemetry: false,
    autoUpdate: true,
  },
};

/**
 * Skill-specific default configurations
 */
export const SKILL_DEFAULTS = {
  meal_planning: {
    maxBudget: 200,
    cuisinePreferences: [],
    avoidRepeatDays: 3,
    generateShoppingList: true,
  },

  'recipe-finding': {
    defaultServings: 2,
    preferredSources: ['allrecipes', 'foodnetwork', 'seriouseats'],
    maxPrepTime: 60, // minutes
    maxCookTime: 90, // minutes
  },

  'grocery-shopping': {
    consolidationRules: {
      roundUp: true,
      preferLargerPackages: true,
      bulkThreshold: 3,
    },
    automationPreferences: {
      autoCheckout: false,
      savePreferences: true,
    },
  },

  'whatsapp-message-management': {
    briefingFormat: 'summary',
    includeTasks: true,
    includeReminders: true,
    maxMessagesPerBriefing: 10,
  },

  personality_assessment: {
    assessmentFrequency: 'never', // never, weekly, monthly
    adaptBehavior: true,
  },
};

/**
 * Integration-specific defaults
 */
export const INTEGRATION_DEFAULTS = {
  whatsapp: {
    messageRetention: 30, // days
    autoArchive: true,
    notificationPriority: 'medium',
  },

  calendar: {
    defaultEventDuration: 60, // minutes
    reminderMinutes: 15,
    autoDeclineConflicts: false,
  },

  shopping: {
    costco: {
      storeId: null,
      membershipNumber: null,
      preferredPickupLocation: null,
    },
    instacart: {
      defaultDeliveryWindow: 'next-available',
      tipPercentage: 15,
      replacementPreference: 'contact-me',
    },
  },
};

/**
 * Environment-specific overrides
 */
export const ENVIRONMENT_OVERRIDES = {
  development: {
    system: {
      debug: true,
      logLevel: 'debug' as const,
      telemetry: false,
    },
    memory: {
      databasePath: './.swarm/memory-dev.db',
    },
  },

  test: {
    system: {
      debug: false,
      logLevel: 'error' as const,
      telemetry: false,
    },
    memory: {
      databasePath: ':memory:',
      persistent: false,
    },
  },

  production: {
    system: {
      debug: false,
      logLevel: 'warn' as const,
      telemetry: true,
    },
    memory: {
      compression: true,
      retentionDays: 180,
    },
  },
};

/**
 * Get environment-specific defaults
 */
export function getEnvironmentDefaults(): any {
  const env = process.env.NODE_ENV || 'development';
  return ENVIRONMENT_OVERRIDES[env as keyof typeof ENVIRONMENT_OVERRIDES] || {};
}
