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

// Added after the code review: the gate must say how it is enforced, the sequence must agree with the
// style guide, and Venkat's approval must stay per action (docs/guidelines/approval-gates.md).
const section = (heading: string) => workflow.split(`## ${heading}`)[1]?.split('\n## ')[0] ?? '';
const row = (n: number) => workflow.split('\n').find((line) => line.startsWith(`| ${n} |`)) ?? '';

describe('the gate section says how the rule is enforced', () => {
  const gate = section('The gate rule');

  it('keeps the rule, draft: true and the separate publish change inside the gate section', () => {
    expect(gate).toMatch(/no post publishes without step 3 and step 5 complete/i);
    expect(gate).toContain('draft: true');
    expect(gate.toLowerCase()).toContain('separate pr');
  });

  it('says the rule is procedural today and names the control that is not built', () => {
    expect(gate.toLowerCase()).toContain('not enforced by tooling');
    expect(gate).toContain('check:content');
    expect(gate.toLowerCase()).toContain('needs venkat');
  });

  it('lists the evidence checked before the draft: false change', () => {
    expect(gate).toContain('QA comment');
    expect(gate).toContain('APPROVED');
    expect(gate).toContain('[Venkat]');
  });
});

describe('the stage table agrees with the style guide and the approval gates', () => {
  it('lists the stages in ascending order, one row each', () => {
    const numbers = workflow
      .split('\n')
      .map((line) => /^\| (\d) \|/.exec(line)?.[1])
      .filter(Boolean)
      .map(Number);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('puts Venkat at stage 5 only', () => {
    expect(row(5)).toContain('Venkat');
    for (const n of [1, 2, 3, 4, 6, 7])
      expect(row(n).split('|')[3], `stage ${n}`).not.toContain('Venkat');
  });

  it('stage 3 leaves the SEO item and the approval request to stage 4', () => {
    expect(row(3)).toMatch(/except/i);
    expect(row(4)).toContain('APPROVAL REQUEST');
  });

  it('stage 2 and 3 evidence includes the build', () => {
    expect(row(2) + row(3)).toContain('npm run build');
  });

  it('names the PR reviewer as well as the Technical Editor', () => {
    expect(workflow).toContain('REVIEW: APPROVED');
    expect(workflow).toMatch(/PR reviewer/);
  });
});

describe('stages 6 and 7 keep Venkat approval per action', () => {
  it('stage 6 needs its own approval for deploy, release tag and merge into main', () => {
    const publish = row(6);
    expect(publish).toContain('APPROVAL REQUEST');
    for (const item of ['deploy', 'release tag', 'main']) expect(publish, item).toContain(item);
    expect(workflow).toContain('does not carry over');
  });

  it('stage 7 needs Venkat before anything is posted or sent', () => {
    expect(row(7)).toMatch(/Venkat/);
    expect(row(7)).toMatch(/posted or sent/);
  });

  it('links the approval gates and CLAUDE.md', () => {
    expect(workflow).toContain('docs/guidelines/approval-gates.md');
    expect(workflow).toContain('CLAUDE.md');
  });
});

describe('the workflow is complete and in order', () => {
  it('says the editorial calendar is still to be created', () => {
    expect(workflow).toContain('editorial calendar');
    expect(workflow).toMatch(/still to be created|not written yet/);
  });

  it('keeps subtasks and hand-off fields in order', () => {
    const subtasks = section('Asana subtasks per post');
    const roles = STAGES.map(([, , owner]) => subtasks.indexOf(`[${owner}]`));
    expect(roles.every((at) => at >= 0)).toBe(true);
    expect([...roles].sort((a, b) => a - b)).toEqual(roles);
    const block = section('Hand-off template').split('```')[1] ?? '';
    const fields = [
      'Post:',
      'Stage done:',
      'Branch and PR:',
      'Output:',
      'Evidence:',
      'Open questions:',
      'Next owner:',
    ];
    const at = fields.map((field) => block.indexOf(field));
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    expect(at[0]).toBeGreaterThanOrEqual(0);
  });

  it('agrees with the skill on where briefs live', () => {
    expect(workflow).toContain('research/briefs/');
    expect(skill).toContain('research/briefs/');
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
