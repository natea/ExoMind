/**
 * Markdown Parser Tests
 * Tests for parsing markdown files and extracting structured data
 */

import {
  parseFrontMatter,
  parseTasks,
  parseTables,
  parseSections,
  parseMarkdown,
  findSection,
  getAllTasks,
  getCompletionRate,
  FrontMatter,
  TaskItem,
} from '../../src/utils/markdown-parser';

describe('Markdown Parser', () => {
  describe('parseFrontMatter', () => {
    it('should parse valid front matter', () => {
      const content = `---
title: Test Document
date: 2025-01-06
published: true
version: 1.5
tags: [test, markdown, parser]
---

# Main Content`;

      const { frontMatter, content: remaining } = parseFrontMatter(content);

      expect(frontMatter.title).toBe('Test Document');
      expect(frontMatter.date).toBeInstanceOf(Date);
      expect(frontMatter.published).toBe(true);
      expect(frontMatter.version).toBe(1.5);
      expect(frontMatter.tags).toEqual(['test', 'markdown', 'parser']);
      expect(remaining).toBe('\n# Main Content');
    });

    it('should handle missing front matter', () => {
      const content = '# Just Content';
      const { frontMatter, content: remaining } = parseFrontMatter(content);

      expect(frontMatter).toEqual({});
      expect(remaining).toBe(content);
    });

    it('should parse different value types correctly', () => {
      const content = `---
string: hello
integer: 42
float: 3.14
boolean_true: true
boolean_false: false
date: 2025-01-06T10:00:00Z
array: [one, two, three]
---`;

      const { frontMatter } = parseFrontMatter(content);

      expect(frontMatter.string).toBe('hello');
      expect(frontMatter.integer).toBe(42);
      expect(frontMatter.float).toBe(3.14);
      expect(frontMatter.boolean_true).toBe(true);
      expect(frontMatter.boolean_false).toBe(false);
      expect(frontMatter.date).toBeInstanceOf(Date);
      expect(frontMatter.array).toEqual(['one', 'two', 'three']);
    });

    it('should handle malformed front matter gracefully', () => {
      const content = `---
no_colon_here
valid: value
---`;

      const { frontMatter } = parseFrontMatter(content);

      expect(frontMatter.valid).toBe('value');
      expect(frontMatter.no_colon_here).toBeUndefined();
    });
  });

  describe('parseTasks', () => {
    it('should parse completed and incomplete tasks', () => {
      const content = `
- [x] Completed task
- [ ] Incomplete task
- [X] Another completed
* [x] Bullet task
* [ ] Another bullet
`;

      const tasks = parseTasks(content);

      expect(tasks).toHaveLength(5);
      expect(tasks[0]).toEqual({ completed: true, text: 'Completed task' });
      expect(tasks[1]).toEqual({ completed: false, text: 'Incomplete task' });
      expect(tasks[2]).toEqual({ completed: true, text: 'Another completed' });
      expect(tasks[3]).toEqual({ completed: true, text: 'Bullet task' });
      expect(tasks[4]).toEqual({ completed: false, text: 'Another bullet' });
    });

    it('should parse task priorities', () => {
      const content = `
- [x] High priority task [!!!]
- [ ] Medium priority [!!]
- [ ] Low priority [!]
- [ ] No priority
`;

      const tasks = parseTasks(content);

      expect(tasks).toHaveLength(4);
      expect(tasks[0].priority).toBe('high');
      expect(tasks[0].text).toBe('High priority task');
      expect(tasks[1].priority).toBe('medium');
      expect(tasks[2].priority).toBe('low');
      expect(tasks[3].priority).toBeUndefined();
    });

    it('should handle empty content', () => {
      const tasks = parseTasks('');
      expect(tasks).toEqual([]);
    });

    it('should ignore non-task list items', () => {
      const content = `
- Regular list item
- [x] Task item
- Another regular item
`;

      const tasks = parseTasks(content);
      expect(tasks).toHaveLength(1);
      expect(tasks[0].text).toBe('Task item');
    });
  });

  describe('parseTables', () => {
    it('should parse markdown table', () => {
      const content = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;

      const tables = parseTables(content);

      expect(tables).toHaveLength(1);
      expect(tables[0].headers).toEqual(['Header 1', 'Header 2', 'Header 3']);
      expect(tables[0].rows).toHaveLength(2);
      expect(tables[0].rows[0]).toEqual(['Cell 1', 'Cell 2', 'Cell 3']);
      expect(tables[0].rows[1]).toEqual(['Cell 4', 'Cell 5', 'Cell 6']);
    });

    it('should handle multiple tables', () => {
      const content = `
| Table 1 | Data |
|---------|------|
| A       | 1    |

Some text in between

| Table 2 | Info |
|---------|------|
| B       | 2    |
`;

      const tables = parseTables(content);
      expect(tables).toHaveLength(2);
      expect(tables[0].headers).toEqual(['Table 1', 'Data']);
      expect(tables[1].headers).toEqual(['Table 2', 'Info']);
    });

    it('should handle tables without outer pipes', () => {
      const content = `
Header 1 | Header 2
---------|----------
Cell 1   | Cell 2
`;

      const tables = parseTables(content);
      expect(tables).toHaveLength(1);
      expect(tables[0].headers).toEqual(['Header 1', 'Header 2']);
    });

    it('should handle empty content', () => {
      const tables = parseTables('');
      expect(tables).toEqual([]);
    });

    it('should ignore malformed tables', () => {
      const content = `
| Header |
This is not a separator
| Cell |
`;

      const tables = parseTables(content);
      expect(tables).toEqual([]);
    });
  });

  describe('parseSections', () => {
    it('should parse sections with different heading levels', () => {
      const content = `
# Level 1

Content for level 1

## Level 2

Content for level 2

### Level 3

Content for level 3
`;

      const sections = parseSections(content);

      expect(sections).toHaveLength(3);
      expect(sections[0].heading).toBe('Level 1');
      expect(sections[0].level).toBe(1);
      expect(sections[0].content).toContain('Content for level 1');
      expect(sections[1].heading).toBe('Level 2');
      expect(sections[1].level).toBe(2);
      expect(sections[2].heading).toBe('Level 3');
      expect(sections[2].level).toBe(3);
    });

    it('should parse tasks within sections', () => {
      const content = `
## Tasks

- [x] Completed task
- [ ] Incomplete task

## Notes

Some notes here
`;

      const sections = parseSections(content);

      expect(sections).toHaveLength(2);
      expect(sections[0].tasks).toHaveLength(2);
      expect(sections[0].tasks![0].completed).toBe(true);
      expect(sections[1].tasks).toEqual([]);
    });

    it('should parse tables within sections', () => {
      const content = `
## Data

| Col1 | Col2 |
|------|------|
| A    | B    |
`;

      const sections = parseSections(content);

      expect(sections).toHaveLength(1);
      expect(sections[0].tables).toHaveLength(1);
      expect(sections[0].tables![0].headers).toEqual(['Col1', 'Col2']);
    });

    it('should handle empty sections', () => {
      const content = `
## Section 1

## Section 2

Content here
`;

      const sections = parseSections(content);
      expect(sections).toHaveLength(2);
      expect(sections[0].content.trim()).toBe('');
      expect(sections[1].content).toContain('Content here');
    });
  });

  describe('parseMarkdown', () => {
    it('should parse complete markdown document', () => {
      const content = `---
title: Test Doc
date: 2025-01-06
---

# Section 1

- [x] Task 1
- [ ] Task 2

## Section 2

| Header | Value |
|--------|-------|
| A      | 1     |
`;

      const parsed = parseMarkdown(content);

      expect(parsed.frontMatter.title).toBe('Test Doc');
      expect(parsed.sections).toHaveLength(2);
      expect(parsed.sections[0].tasks).toHaveLength(2);
      expect(parsed.sections[1].tables).toHaveLength(1);
      expect(parsed.rawContent).toBe(content);
    });

    it('should handle markdown without front matter', () => {
      const content = '# Just a heading\n\nSome content';
      const parsed = parseMarkdown(content);

      expect(parsed.frontMatter).toEqual({});
      expect(parsed.sections).toHaveLength(1);
    });

    it('should handle empty markdown', () => {
      const parsed = parseMarkdown('');

      expect(parsed.frontMatter).toEqual({});
      expect(parsed.sections).toEqual([]);
      expect(parsed.rawContent).toBe('');
    });
  });

  describe('findSection', () => {
    const sections = [
      { heading: 'Introduction', level: 1, content: 'Intro content' },
      { heading: 'Goals', level: 2, content: 'Goals content' },
      { heading: 'Notes', level: 2, content: 'Notes content' },
    ];

    it('should find section by exact heading', () => {
      const section = findSection(sections, 'Goals');
      expect(section).toBeDefined();
      expect(section?.heading).toBe('Goals');
    });

    it('should find section case-insensitively', () => {
      const section = findSection(sections, 'GOALS');
      expect(section).toBeDefined();
      expect(section?.heading).toBe('Goals');
    });

    it('should return undefined for non-existent section', () => {
      const section = findSection(sections, 'NonExistent');
      expect(section).toBeUndefined();
    });
  });

  describe('getAllTasks', () => {
    const sections = [
      {
        heading: 'Section 1',
        level: 1,
        content: '',
        tasks: [
          { completed: true, text: 'Task 1' },
          { completed: false, text: 'Task 2' },
        ],
      },
      {
        heading: 'Section 2',
        level: 1,
        content: '',
        tasks: [{ completed: true, text: 'Task 3' }],
      },
      { heading: 'Section 3', level: 1, content: '' },
    ];

    it('should collect all tasks from sections', () => {
      const tasks = getAllTasks(sections);

      expect(tasks).toHaveLength(3);
      expect(tasks[0].text).toBe('Task 1');
      expect(tasks[1].text).toBe('Task 2');
      expect(tasks[2].text).toBe('Task 3');
    });

    it('should handle sections without tasks', () => {
      const tasks = getAllTasks([sections[2]]);
      expect(tasks).toEqual([]);
    });

    it('should handle empty sections array', () => {
      const tasks = getAllTasks([]);
      expect(tasks).toEqual([]);
    });
  });

  describe('getCompletionRate', () => {
    it('should calculate completion rate correctly', () => {
      const tasks: TaskItem[] = [
        { completed: true, text: 'Task 1' },
        { completed: true, text: 'Task 2' },
        { completed: false, text: 'Task 3' },
        { completed: false, text: 'Task 4' },
      ];

      const rate = getCompletionRate(tasks);
      expect(rate).toBe(50);
    });

    it('should return 100 for all completed tasks', () => {
      const tasks: TaskItem[] = [
        { completed: true, text: 'Task 1' },
        { completed: true, text: 'Task 2' },
      ];

      const rate = getCompletionRate(tasks);
      expect(rate).toBe(100);
    });

    it('should return 0 for no completed tasks', () => {
      const tasks: TaskItem[] = [
        { completed: false, text: 'Task 1' },
        { completed: false, text: 'Task 2' },
      ];

      const rate = getCompletionRate(tasks);
      expect(rate).toBe(0);
    });

    it('should return 0 for empty task list', () => {
      const rate = getCompletionRate([]);
      expect(rate).toBe(0);
    });

    it('should round to nearest integer', () => {
      const tasks: TaskItem[] = [
        { completed: true, text: 'Task 1' },
        { completed: false, text: 'Task 2' },
        { completed: false, text: 'Task 3' },
      ];

      const rate = getCompletionRate(tasks);
      expect(rate).toBe(33); // 33.33 rounds to 33
    });
  });
});
