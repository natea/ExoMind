/**
 * Using Life OS Skill
 *
 * Entry point skill that introduces available Life OS skills,
 * provides command reference, and guides users through the system.
 *
 * @module using-life-os
 */

/**
 * Skill categories in Life OS
 */
export enum SkillCategory {
  PRODUCTIVITY = "Productivity & Task Management",
  PLANNING = "Planning & Goal Setting",
  REVIEW = "Review & Reflection",
  INTEGRATION = "Integration & Automation",
  COORDINATION = "Coordination & System Management",
}

/**
 * Available Life OS skill definition
 */
export interface LifeOSSkill {
  name: string;
  category: SkillCategory;
  description: string;
  command: string;
  useCases: string[];
  dependencies?: string[];
}

/**
 * Comprehensive catalog of all available Life OS skills
 */
export const LIFE_OS_SKILLS: LifeOSSkill[] = [
  {
    name: "using-life-os",
    category: SkillCategory.COORDINATION,
    description: "Entry point - introduces skills, provides command reference, guides users",
    command: "/skill using-life-os",
    useCases: [
      "Getting started with Life OS",
      "Exploring available capabilities",
      "Learning command syntax",
      "Understanding skill integration",
    ],
  },
  {
    name: "daily-planning",
    category: SkillCategory.PLANNING,
    description: "Morning intention-setting and evening reflection for daily productivity",
    command: "/skill daily-planning",
    useCases: [
      "Start each day with clarity",
      "End day with reflection",
      "Set top 3 priorities",
      "Manage energy levels",
    ],
  },
  {
    name: "weekly-review",
    category: SkillCategory.REVIEW,
    description: "Weekly reflection and planning following GTD methodology",
    command: "/skill weekly-review",
    useCases: [
      "End-of-week review",
      "Plan upcoming week",
      "Process inbox items",
      "Update project status",
    ],
  },
  {
    name: "goal-setting",
    category: SkillCategory.PLANNING,
    description: "OKR-based goal setting framework for quarterly and annual planning",
    command: "/skill goal-setting",
    useCases: [
      "Set quarterly objectives",
      "Define key results",
      "Track goal progress",
      "Align priorities with goals",
    ],
  },
  {
    name: "processing-inbox",
    category: SkillCategory.PRODUCTIVITY,
    description: "Process inbox items using GTD methodology",
    command: "/skill processing-inbox",
    useCases: [
      "Clear inbox to zero",
      "Apply 2-minute rule",
      "Route items to correct lists",
      "Maintain clean inbox",
    ],
  },
  {
    name: "coordinating-life-os",
    category: SkillCategory.COORDINATION,
    description: "System coordinator that manages cross-skill workflows and integration",
    command: "/skill coordinating-life-os",
    useCases: [
      "Orchestrate multi-skill workflows",
      "Manage skill dependencies",
      "Handle cross-skill data flow",
      "Coordinate scheduled tasks",
    ],
  },
];

/**
 * Get skill by name
 */
export function getSkill(name: string): LifeOSSkill | undefined {
  return LIFE_OS_SKILLS.find((skill) => skill.name === name);
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: SkillCategory): LifeOSSkill[] {
  return LIFE_OS_SKILLS.filter((skill) => skill.category === category);
}

/**
 * Get all skill names
 */
export function getAllSkillNames(): string[] {
  return LIFE_OS_SKILLS.map((skill) => skill.name);
}

/**
 * Search skills by keyword
 */
export function searchSkills(keyword: string): LifeOSSkill[] {
  const lowerKeyword = keyword.toLowerCase();
  return LIFE_OS_SKILLS.filter(
    (skill) =>
      skill.name.toLowerCase().includes(lowerKeyword) ||
      skill.description.toLowerCase().includes(lowerKeyword) ||
      skill.useCases.some((useCase) =>
        useCase.toLowerCase().includes(lowerKeyword)
      )
  );
}

/**
 * Get getting started workflow
 */
export function getGettingStartedWorkflow(): string[] {
  return [
    "1. Read using-life-os skill guide (/skill using-life-os)",
    "2. Set up daily planning routine (/skill daily-planning)",
    "3. Configure weekly review schedule (/skill weekly-review)",
    "4. Define quarterly goals (/skill goal-setting)",
    "5. Process initial inbox items (/skill processing-inbox)",
  ];
}

/**
 * Main skill export for integration
 */
export default {
  name: "using-life-os",
  category: SkillCategory.COORDINATION,
  skills: LIFE_OS_SKILLS,
  getSkill,
  getSkillsByCategory,
  getAllSkillNames,
  searchSkills,
  getGettingStartedWorkflow,
};
