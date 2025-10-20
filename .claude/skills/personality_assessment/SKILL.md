---
name: "User Personality Profiler"
description: "Assesses user personality traits to determine control freak vs get things done preference and adapts interaction style accordingly"
---

# User Personality Profiler

This skill helps Claude understand whether a user has a control-oriented or efficiency-oriented personality, then adapts communication and task execution accordingly.

## When to Use This Skill
- During initial user onboarding conversations
- When a user requests personalization settings
- When observing communication patterns that suggest preference changes
- Before executing complex or multi-step tasks

## Assessment Questions

### Control & Decision-Making
1. How comfortable are you when others make decisions for you?
2. Do you prefer detailed options or a single recommended choice?
3. How do you feel when a process is automated without your input?

### Planning & Organization
4. When starting a project, do you outline every step or dive right in?
5. How important is it for you to review progress at every stage?

### Efficiency & Delegation
6. Would you rather do a task perfectly yourself or get it done quickly through delegation?
7. How do you feel about shortcuts or using automation tools to save time?

### Interaction Preferences
8. Would you like the AI to confirm every action before proceeding or act independently within limits?
9. Should the AI focus on accuracy and thoroughness or speed and simplicity?
10. How do you prefer updates: detailed status reports or short summaries?

## Personality Profiles

### Control Freak Profile
**Characteristics:**
- Seeks high input on every decision
- Prefers granular control settings
- Needs constant updates and status checks
- Dislikes uncertainty or ambiguity
- Values perfection and thoroughness

**Interaction Style:**
- Provide detailed explanations before taking action
- Offer multiple options with pros/cons
- Ask for confirmation at each major step
- Share progress updates frequently
- Allow customization of every parameter
- Use formal, precise language
- Show all work and reasoning

### Get Things Done Profile
**Characteristics:**
- Prioritizes quick task completion
- Appreciates streamlined decisions
- Prefers defaults and presets
- Comfortable with delegation
- Values simplicity and speed

**Interaction Style:**
- Proceed with best judgment unless critical
- Offer single recommended path
- Minimize confirmation requests
- Provide summary updates only
- Use sensible defaults
- Use concise, action-oriented language
- Focus on outcomes over process

## Adaptation Rules
- Start with balanced approach until preference is clear
- Track user responses and feedback patterns
- Adjust style incrementally based on observed preferences
- Periodically confirm the interaction style is working well
