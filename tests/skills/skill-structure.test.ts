/**
 * Skill Structure Tests
 * Validates that all Life OS skills have the correct directory structure
 */

import * as path from 'path';
import { validateSkillStructure, STANDARD_SKILL_STRUCTURE } from '../utils/skill-validator';

const SKILLS_DIR = path.join(__dirname, '../../skills');

const LIFE_OS_SKILLS = [
  {
    name: 'using-life-os',
    description: 'Using Life OS skill for getting started',
  },
  {
    name: 'conducting-life-assessment',
    description: 'Life assessment and reflection skill',
  },
  {
    name: 'daily-planning',
    description: 'Daily planning and scheduling skill',
  },
  {
    name: 'weekly-review',
    description: 'Weekly review and reflection skill',
  },
  {
    name: 'goal-setting',
    description: 'Goal setting and tracking skill',
  },
  {
    name: 'processing-inbox',
    description: 'Inbox processing and task management skill',
  },
];

describe('Life OS Skills Structure', () => {
  describe('Skill Directory Structure', () => {
    LIFE_OS_SKILLS.forEach(({ name, description }) => {
      describe(name, () => {
        const skillPath = path.join(SKILLS_DIR, name);

        it('should have valid directory structure', async () => {
          const result = await validateSkillStructure(skillPath, {
            name,
            description,
            ...STANDARD_SKILL_STRUCTURE,
          });

          if (!result.valid) {
            console.error(`Validation errors for ${name}:`, result.errors);
          }

          expect(result.valid).toBe(true);
          expect(result.errors).toHaveLength(0);
        });

        it('should have README.md', async () => {
          const result = await validateSkillStructure(skillPath, {
            name,
            description,
            requiredFiles: ['README.md'],
            optionalFiles: [],
          });

          expect(result.errors).not.toContain('Missing required file: README.md');
        });

        it('should have index.ts', async () => {
          const result = await validateSkillStructure(skillPath, {
            name,
            description,
            requiredFiles: ['index.ts'],
            optionalFiles: [],
          });

          expect(result.errors).not.toContain('Missing required file: index.ts');
        });
      });
    });
  });

  describe('Skills Directory', () => {
    it('should exist', async () => {
      const fs = await import('fs/promises');
      const stats = await fs.stat(SKILLS_DIR);
      expect(stats.isDirectory()).toBe(true);
    });

    it('should contain all Life OS skills', async () => {
      const fs = await import('fs/promises');
      const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
      const directories = entries.filter(e => e.isDirectory()).map(e => e.name);

      LIFE_OS_SKILLS.forEach(({ name }) => {
        expect(directories).toContain(name);
      });
    });
  });
});
