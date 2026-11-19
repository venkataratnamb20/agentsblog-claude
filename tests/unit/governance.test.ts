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

function tableRows(markdown: string, heading: string): string[][] {
  const section = markdown.split(`## ${heading}`)[1]?.split('\n## ')[0] ?? '';
  return section
    .split('\n')
    .filter((line) => line.startsWith('|') && !/^\|[-| ]+\|$/.test(line))
    .slice(1)
    .map((line) =>
      line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );
}

describe('roster and RACI are complete', () => {
  const text = read('docs/team.md');

  it('every roster row has purpose, inputs, outputs, tools and limits filled in', () => {
    const rows = tableRows(text, 'Roster');
    expect(rows.length).toBe(15);
    for (const row of rows) {
      expect(row.length, row[0]).toBe(7);
      expect(
        row.every((cell) => cell !== ''),
        row[0],
      ).toBe(true);
    }
  });

  it('every RACI row has all four roles filled in', () => {
    const rows = tableRows(text, 'RACI by stage');
    expect(rows.length).toBe(11);
    for (const row of rows) {
      expect(row.length, row[0]).toBe(5);
      expect(
        row.every((cell) => cell !== ''),
        row[0],
      ).toBe(true);
    }
  });

  it('uses the daily stand-up as the status channel, consistent with the operating model', () => {
    expect(read('docs/guidelines/operating-model.md')).toContain('## Fortnightly status update');
    expect(text).toContain('daily stand-up');
  });
});

describe('no rule is copied between CLAUDE.md and the guidelines', () => {
  const claude = read('CLAUDE.md')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length >= 50);

  it.each([
    'docs/guidelines/operating-model.md',
    'docs/guidelines/approval-gates.md',
    'docs/guidelines/secrets-and-access.md',
    'docs/guidelines/code-quality.md',
    'docs/guidelines/git-workflow.md',
    'docs/team.md',
  ])('%s shares no long line with CLAUDE.md', (path) => {
    const lines = new Set(
      read(path)
        .split('\n')
        .map((line) => line.trim()),
    );
    expect(claude.filter((line) => lines.has(line))).toEqual([]);
  });

  it('the subagents point at the approval doc instead of repeating the list', () => {
    for (const slug of ROLE_SLUGS) {
      const text = read(`.claude/agents/${slug}.md`);
      expect(text, slug).toContain('docs/guidelines/approval-gates.md');
      expect(text, slug).not.toContain('production deploys, DNS changes');
    }
  });
});

describe('docs/guidelines/code-quality.md has the numeric limits and the full structure', () => {
  const text = read('docs/guidelines/code-quality.md');

  it.each([
    '## Clean Code and SOLID',
    '## TDD workflow',
    '## BDD',
    '## Data structures and algorithms',
    '## Language standards',
    '## Thresholds',
    '## Review checklist',
  ])('has %s', (heading) => {
    expect(text).toContain(heading);
  });

  it('states the thresholds as numbers', () => {
    for (const phrase of ['40 lines', 'complexity of 10', '100%', '80%', 'zero lint warnings']) {
      expect(text).toContain(phrase);
    }
  });

  it('has one Gherkin example', () => {
    expect(text).toContain('Feature:');
    expect(text).toContain('Scenario:');
  });
});

describe('the docs do not overstate what is enforced', () => {
  it('approval-gates says read-only and logging are limited', () => {
    const text = read('docs/guidelines/approval-gates.md');
    expect(text).toContain('by instruction and tool list');
    expect(text).toContain('best-effort');
  });

  it('secrets-and-access says shell access is not prevented and has no opt-out marker', () => {
    const text = read('docs/guidelines/secrets-and-access.md');
    expect(text).toContain('shell access is not prevented');
    expect(text).not.toContain('secret-scan-ignore');
  });

  it('CI has least-privilege permissions', () => {
    const ci = read('.github/workflows/ci.yml');
    expect(ci).toContain('permissions:');
    expect(ci).toContain('contents: read');
  });
});

describe('docs/agents/capability-matrix.md is current', () => {
  const text = read('docs/agents/capability-matrix.md');

  it('has an intact role-by-feature table header and separator', () => {
    expect(text).toContain('| Role | A | S | C | MCP | H | P | M |');
    expect(text).toContain('|---|---|---|---|---|---|---|---|');
  });

  it('no longer says the harness files do not exist', () => {
    expect(text).not.toContain('no `.claude/agents/` definitions');
    expect(text).not.toContain('They are not in the repo, so a fresh clone does not carry them');
  });
});

describe('the guardrail docs state their limits', () => {
  it('approval-gates explains server-side protection and the skip-hook limitation', () => {
    const text = read('docs/guidelines/approval-gates.md');
    expect(text).toContain('enforced on the server');
    expect(text).toContain('speed bump');
    expect(text).toContain('-F');
  });

  it('secrets-and-access says which env variants the Read tool denies', () => {
    expect(read('docs/guidelines/secrets-and-access.md')).toContain('common variants');
  });
});

describe('coverage config encodes the documented thresholds (vitest.config.ts)', () => {
  const text = read('vitest.config.ts');

  it('measures all of src, so the 80% floor is overall and not only src/lib', () => {
    expect(text).toContain("include: ['src/**/*.ts']");
  });

  it('excludes only the Astro-only glue file, with a reason', () => {
    expect(text).toContain("exclude: ['src/content.config.ts']");
    expect(text).toContain('CI');
  });

  it('keeps 100% on src/lib and an 80% floor', () => {
    expect(text).toContain("'src/lib/**': { lines: 100, functions: 100, branches: 100");
    for (const metric of ['lines', 'functions', 'branches', 'statements']) {
      expect(text).toContain(`${metric}: 80`);
    }
  });
});

describe('code-quality guide is accurate about what is enforced', () => {
  const text = read('docs/guidelines/code-quality.md');

  it('names the full path of the PATTERNS list', () => {
    expect(text).toContain('`.claude/hooks/lib/secrets.mjs`');
  });

  it('names where strict comes from and says return types are a review convention', () => {
    expect(text).toContain('astro/tsconfigs/strictest');
    expect(text).toContain('explicit return types on exported functions (a review convention');
  });

  it('has a Prettier row in the thresholds table', () => {
    expect(text).toMatch(/\| Formatting \|[^\n]*Prettier[^\n]*\|/);
  });

  it('says Python tooling and the BDD runner are not installed yet', () => {
    expect(text).toContain('`ruff` is not installed and has no config yet');
    expect(text).toContain('not installed yet');
  });
});

describe('CLAUDE.md links the quality guide without copying its numbers', () => {
  const section = /## Coding standards\n([\s\S]*?)\n## /.exec(read('CLAUDE.md'))?.[1] ?? '';

  it('has no numeric limits (they live in docs/guidelines/code-quality.md)', () => {
    expect(section).toContain('docs/guidelines/code-quality.md');
    expect(section).not.toMatch(/\d+\s*(lines|%)|complexity (of|at most) \d+|zero lint warnings/i);
  });
});

describe('the review checklist exists once in the guide and once in the PR template', () => {
  const items = (text: string) =>
    text
      .split('\n')
      .filter((line) => line.startsWith('- [ ] '))
      .map((line) => line.replace('- [ ] ', ''));

  it('has the same items in both, so they cannot drift', () => {
    const guide = items(read('docs/guidelines/code-quality.md'));
    const template = items(read('.github/pull_request_template.md'));
    expect(guide.length).toBeGreaterThan(0);
    for (const item of guide) expect(template).toContain(item);
  });

  it('says the template mirrors the guide', () => {
    expect(read('docs/guidelines/code-quality.md')).toContain('.github/pull_request_template.md');
  });
});
