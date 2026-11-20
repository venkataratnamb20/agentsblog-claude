import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Acceptance tests for the per-post workflow (Asana task 1220688987014029): a hand-off template is
// agreed, and no post publishes without the technical edit (step 3) and Venkat's approval (step 5).
const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const workflow = read('docs/guidelines/post-workflow.md');
const skill = read('.claude/skills/new-post/SKILL.md');

const STAGES: ReadonlyArray<readonly [number, string, string]> = [
  [1, 'Research brief', 'Research Analyst'],
  [2, 'Draft', 'Technical Writer'],
  [3, 'Technical edit', 'Technical Editor'],
  [4, 'SEO', 'SEO & Analytics'],
  [5, 'Final review and approval', 'Venkat'],
  [6, 'Schedule, publish and verify', 'PM Orchestrator'],
  [7, 'Distribute', 'Growth & Community'],
];

describe('the post workflow document', () => {
  it('exists and names the Asana task it comes from', () => {
    expect(workflow.length).toBeGreaterThan(0);
    expect(workflow).toContain('1220688987014029');
  });

  it.each(STAGES)('stage %i (%s) has an owner, an input and an output', (n, name, owner) => {
    const row = workflow.split('\n').find((line) => line.startsWith(`| ${n} |`)) ?? '';
    expect(row, `stage ${n} row`).toContain(name);
    expect(row, `stage ${n} owner`).toContain(owner);
    expect(row.split('|').filter((cell) => cell.trim() !== '').length).toBeGreaterThanOrEqual(5);
  });

  it('lists the Asana subtask for every stage with its role prefix', () => {
    for (const [, , owner] of STAGES) expect(workflow, owner).toContain(`[${owner}]`);
  });

  it('blocks publication without step 3 and step 5', () => {
    expect(workflow).toMatch(/no post publishes without step 3 and step 5/i);
    expect(workflow).toContain('draft: true');
    expect(workflow.toLowerCase()).toContain('separate commit');
  });

  it('keeps Venkat subtasks for Venkat', () => {
    expect(workflow).toMatch(/never completes? a \[Venkat\] subtask/i);
  });
});

describe('the hand-off template', () => {
  const template = workflow.split('## Hand-off template')[1]?.split('\n## ')[0] ?? '';

  it('is a section with every required field', () => {
    expect(template.length).toBeGreaterThan(0);
    for (const field of [
      'Post',
      'Stage done',
      'Branch and PR',
      'Output',
      'Evidence',
      'Open questions',
      'Next owner',
    ]) {
      expect(template, field).toContain(field);
    }
  });
});

describe('the workflow agrees with the new-post skill and the style guide', () => {
  it('links the skill, the style guide, the operating model and the QA checklist', () => {
    for (const link of [
      '.claude/skills/new-post/SKILL.md',
      'docs/guidelines/editorial-style-guide.md',
      'docs/guidelines/operating-model.md',
      'Content QA checklist',
    ]) {
      expect(workflow, link).toContain(link);
    }
  });

  it('uses the same subagents in the same order as the skill', () => {
    const order = ['research-analyst', 'technical-writer', 'technical-editor', 'seo-analytics'];
    let last = -1;
    for (const agent of order) {
      const here = skill.indexOf(agent);
      expect(here, `${agent} in the skill`).toBeGreaterThan(last);
      last = here;
    }
    for (const agent of [...order, 'growth-community']) {
      expect(workflow, agent).toContain(agent);
    }
  });
});
