import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8').replace(/\r\n/g, '\n');

const ROLE_TITLES = [
  'PM Orchestrator',
  'Product Strategist',
  'Solution Architect',
  'UX/UI Designer',
  'Frontend Engineer',
  'DevOps & SRE',
  'QA Engineer',
  'Security Engineer',
  'Code Reviewer',
  'SEO & Analytics',
  'Research Analyst',
  'Technical Writer',
  'Technical Editor',
  'Growth & Community',
];
const ROLE_SLUGS = [
  'pm-orchestrator',
  'product-strategist',
  'solution-architect',
  'ux-ui-designer',
  'frontend-engineer',
  'devops-sre',
  'qa-engineer',
  'security-engineer',
  'code-reviewer',
  'seo-analytics',
  'research-analyst',
  'technical-writer',
  'technical-editor',
  'growth-community',
];

describe('CLAUDE.md is the single rules file', () => {
  const text = read('CLAUDE.md');
  const lines = text.trimEnd().split('\n');

  it('is between 100 and 150 lines', () => {
    expect(lines.length).toBeGreaterThanOrEqual(100);
    expect(lines.length).toBeLessThanOrEqual(150);
  });

  it('has AGENTS.md merged and removed', () => {
    expect(existsSync('AGENTS.md')).toBe(false);
    expect(text).not.toContain('@AGENTS.md');
  });

  it.each([
    '## Purpose',
    '## Stack',
    '## Folder map',
    '## Commands',
    '## Git workflow',
    '## Coding standards',
    '## Definition of Done',
    '## Agent completion protocol',
    '## Approval gates',
    '## Do not touch',
    '## Docs',
  ])('has the section %s', (heading) => {
    expect(text).toContain(heading);
  });

  it('states the dependency rule and the review rule', () => {
    expect(text).toContain('Check dependencies first');
    expect(text).toContain('never the session that did the work');
  });

  it('keeps the coding standards summary to 10 lines or fewer', () => {
    const section = /## Coding standards\n([\s\S]*?)\n## /.exec(text)?.[1] ?? '';
    const bullets = section.split('\n').filter((l) => l.trim() !== '');
    expect(bullets.length).toBeGreaterThan(0);
    expect(bullets.length).toBeLessThanOrEqual(10);
  });
});

describe('CLAUDE.md links and leftovers', () => {
  const text = read('CLAUDE.md');

  it.each([
    'docs/team.md',
    'docs/guidelines/operating-model.md',
    'docs/guidelines/approval-gates.md',
    'docs/guidelines/secrets-and-access.md',
    'docs/guidelines/code-quality.md',
    'docs/guidelines/git-workflow.md',
    'docs/adr/0001-core-tech-stack.md',
  ])('links %s and the file exists', (path) => {
    expect(text).toContain(path);
    expect(existsSync(path)).toBe(true);
  });

  it('no other tool rules files remain', () => {
    for (const path of ['GEMINI.md', '.cursor', '.agents', '.codex']) {
      expect(existsSync(path)).toBe(false);
    }
  });
});

describe('docs/team.md (roster and RACI)', () => {
  const text = read('docs/team.md');

  it.each(ROLE_TITLES)('describes the role %s with its subagent', (title) => {
    expect(text).toContain(title);
  });

  it.each(ROLE_SLUGS)('names the subagent %s', (slug) => {
    expect(text).toContain(`\`${slug}\``);
  });

  it('has a RACI table with Responsible, Accountable, Consulted and Informed for every stage', () => {
    expect(text).toContain('## RACI by stage');
    for (const stage of ['0A', '0B', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      expect(text, `stage ${stage}`).toMatch(new RegExp(`^\\| ${stage}\\. `, 'm'));
    }
    for (const word of ['Responsible', 'Accountable', 'Consulted', 'Informed']) {
      expect(text).toContain(word);
    }
  });

  it('defines the escalation path to Venkat with response times', () => {
    expect(text).toContain('## Escalation path');
    expect(text).toMatch(/24 hours/);
  });
});

describe('docs/guidelines/approval-gates.md', () => {
  const text = read('docs/guidelines/approval-gates.md');

  it.each([
    'spending money',
    'creating accounts',
    'production deploys',
    'DNS changes',
    'publishing posts',
    'posting on social',
  ])('requires approval for %s', (action) => {
    expect(text).toContain(action);
  });

  it('states least privilege, no secrets in prompts and action logging', () => {
    expect(text).toContain('## Guardrails');
    expect(text).toMatch(/least[- ]privilege/i);
    expect(text).toMatch(/no secrets in prompts/i);
    expect(text).toMatch(/action log/i);
  });
});

describe('docs/guidelines/secrets-and-access.md', () => {
  const text = read('docs/guidelines/secrets-and-access.md');

  it('covers the secret store, scanning and rotation', () => {
    expect(text).toContain('## Secret store');
    expect(text).toContain('## Secret scanning');
    expect(text).toContain('## Rotation schedule');
  });

  it.each(ROLE_SLUGS)('scopes access for %s', (slug) => {
    expect(text).toContain(`\`${slug}\``);
  });

  it('lists the accounts that need a human', () => {
    expect(text).toContain('## Accounts that need a human');
  });
});

describe('docs/guidelines/operating-model.md', () => {
  const text = read('docs/guidelines/operating-model.md');

  it.each([
    '## Task template',
    '## Hand-off protocol',
    '## Definition of Done',
    '## Daily stand-up',
  ])('has %s', (heading) => {
    expect(text).toContain(heading);
  });
});

describe('secret scanning is wired in', () => {
  it('has a scan script, a pre-commit hook, an npm script and a CI step', () => {
    expect(existsSync('scripts/scan-secrets.mjs')).toBe(true);
    expect(existsSync('.husky/pre-commit')).toBe(true);
    expect(read('.husky/pre-commit')).toContain('scan-secrets');
    const pkg = JSON.parse(read('package.json')) as { scripts: Record<string, string> };
    expect(pkg.scripts['secrets:scan']).toContain('scan-secrets');
    expect(read('.github/workflows/ci.yml')).toContain('secrets:scan');
  });
});
