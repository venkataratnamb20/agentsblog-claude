import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8').replace(/\r\n/g, '\n');

describe('folder layout matches the target', () => {
  it.each([
    'src',
    'content/posts',
    'tests/unit',
    'tests/integration',
    'tests/e2e',
    'tests/features',
    'docs/prd',
    'docs/srs',
    'docs/adr',
    'docs/guidelines',
    'docs/runbooks',
    'docs/agents',
    'research/sources',
    'research/briefs',
    'research/notes',
    'scripts',
    '.claude',
    '.github/workflows',
  ])('%s exists', (path) => {
    expect(existsSync(path)).toBe(true);
  });

  it.each(['tests/bdd', 'docs/specs', '.agents', '.codex', '.cursor'])('%s is gone', (path) => {
    expect(existsSync(path)).toBe(false);
  });

  it.each([
    'tests/integration/.gitkeep',
    'tests/e2e/.gitkeep',
    'tests/features/.gitkeep',
    'docs/prd/.gitkeep',
    'docs/srs/.gitkeep',
    'docs/runbooks/.gitkeep',
    'research/sources/.gitkeep',
    'research/briefs/.gitkeep',
    'research/notes/.gitkeep',
  ])('empty folder keeps %s', (path) => {
    expect(existsSync(path)).toBe(true);
  });
});

describe('project files', () => {
  it.each([
    '.editorconfig',
    '.gitattributes',
    '.gitignore',
    'CONTRIBUTING.md',
    'CHANGELOG.md',
    'SECURITY.md',
  ])('%s is committed', (path) => {
    expect(existsSync(path)).toBe(true);
  });

  it('.editorconfig sets LF endings, UTF-8 and a final newline', () => {
    const text = read('.editorconfig');
    expect(text).toContain('root = true');
    expect(text).toContain('end_of_line = lf');
    expect(text).toContain('charset = utf-8');
    expect(text).toContain('insert_final_newline = true');
  });

  it('.gitattributes enforces LF line endings', () => {
    expect(read('.gitattributes')).toContain('eol=lf');
  });

  it('SECURITY.md says how to report a vulnerability without publishing details', () => {
    const text = read('SECURITY.md');
    expect(text).toContain('private');
    expect(text).toContain('Supported versions');
  });

  it('CONTRIBUTING.md links the workflow docs and states the rules', () => {
    const text = read('CONTRIBUTING.md');
    for (const phrase of [
      'docs/guidelines/git-workflow.md',
      'Conventional Commits',
      'make setup',
      'tests first',
    ]) {
      expect(text).toContain(phrase);
    }
  });
});

describe('README', () => {
  const text = read('README.md');

  it('has a layout table, a quick start and per-OS install steps', () => {
    for (const heading of [
      '## Layout',
      '## Quick start',
      '## Install',
      '### Windows',
      '### macOS',
      '### Linux',
    ]) {
      expect(text).toContain(heading);
    }
    expect(text).toContain('make setup');
    expect(text).toContain('make test');
  });

  it('lists every target and the unavailable ones as available after a task', () => {
    for (const name of [
      'setup',
      'lint',
      'format',
      'typecheck',
      'test',
      'coverage',
      'build',
      'clean',
    ]) {
      expect(text, name).toContain(`\`${name}\``);
    }
    for (const name of ['test-e2e', 'test-bdd', 'release']) {
      expect(text, name).toMatch(new RegExp(`\`${name}\`.*available after`));
    }
  });
});

describe('README layout', () => {
  const text = read('README.md');

  it('mentions the layout folders that exist', () => {
    for (const path of [
      'docs/prd/',
      'docs/srs/',
      'docs/runbooks/',
      'tests/features/',
      'research/',
    ]) {
      expect(text, path).toContain(path);
    }
  });
});

describe('docs and ADR', () => {
  it('ADR 0002 records the task runner decision with options and consequences', () => {
    expect(existsSync('docs/adr/0002-task-runner.md')).toBe(true);
    const text = read('docs/adr/0002-task-runner.md');
    for (const phrase of [
      '## Options considered',
      '## Decision',
      '## Consequences',
      'make.ps1',
      'just',
    ]) {
      expect(text).toContain(phrase);
    }
  });

  it('references to renamed folders are updated', () => {
    for (const path of [
      '.claude/agents/product-strategist.md',
      'docs/guidelines/code-quality.md',
      'docs/guidelines/secrets-and-access.md',
      'docs/team.md',
      'docs/agents/capability-matrix.md',
    ]) {
      const text = read(path);
      expect(text, path).not.toContain('docs/specs');
      expect(text, path).not.toContain('tests/bdd');
    }
  });
});

describe('CI and PR template', () => {
  const workflow = () => read('.github/workflows/bootstrap-check.yml');

  it('bootstrap-check runs setup, lint, typecheck and test on ubuntu, macOS and Windows', () => {
    const text = workflow();
    expect(text).toContain('name: bootstrap-check');
    for (const os of ['ubuntu-latest', 'macos-latest', 'windows-latest'])
      expect(text).toContain(os);
    for (const target of ['setup', 'lint', 'typecheck', 'test']) expect(text).toContain(target);
    expect(text).toContain('make.ps1');
    expect(text).toContain('contents: read');
  });

  it('workflows use Node 24 capable action versions', () => {
    for (const path of ['.github/workflows/ci.yml', '.github/workflows/bootstrap-check.yml']) {
      const text = read(path);
      expect(text, path).not.toContain('actions/checkout@v4');
      expect(text, path).not.toContain('actions/setup-node@v4');
    }
  });

  it('the PR template carries the review checklist from the code-quality guide', () => {
    const text = read('.github/pull_request_template.md');
    expect(text).toContain('Review checklist');
    for (const phrase of ['Tests came first', 'thresholds', 'No secrets']) {
      expect(text).toContain(phrase);
    }
  });
});

describe('no tracked file points at a removed folder', () => {
  const TEXT = /\.(md|ts|mjs|json|ya?ml|ps1|mdc)$|(^|\/)(Makefile|CODEOWNERS)$/;
  const SKIP = /^(progress\/|package-lock\.json|CHANGELOG\.md|tests\/unit\/scaffold\.test\.ts)/;
  const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .split('\n')
    .filter((f) => f && TEXT.test(f) && !SKIP.test(f));

  it.each(['docs/specs', 'tests/bdd'])('%s is not mentioned anywhere', (removed) => {
    const offenders = files.filter((f) => read(f).includes(removed));
    expect(offenders).toEqual([]);
  });

  it('CODEOWNERS covers the new docs folders', () => {
    const text = read('.github/CODEOWNERS');
    expect(text).toContain('/docs/prd/');
    expect(text).toContain('/docs/srs/');
  });
});

describe('review follow-ups', () => {
  it('research/ has no redundant .gitkeep next to its sub folders', () => {
    expect(existsSync('research/.gitkeep')).toBe(false);
  });

  it('the package and the README say the project is under the Apache License 2.0', () => {
    const pkg = JSON.parse(read('package.json')) as { license?: string };
    expect(pkg.license).toBe('Apache-2.0');
    expect(read('README.md')).toContain('Apache License 2.0');
    expect(read('README.md')).not.toContain('all rights reserved');
  });

  it('the README documents public/, loose docs files and the PowerShell execution policy', () => {
    const text = read('README.md');
    expect(text).toContain('`public/`');
    expect(text).toContain('ExecutionPolicy');
    expect(text).toContain('cross-cutting');
  });

  it('the README no longer says the audit reports advisories, and names the Linux server target', () => {
    const text = read('README.md');
    expect(text).not.toContain('currently reports advisories');
    expect(text).toContain('Linux server');
  });
});

describe('ADR 0002 weighs the simplest option and states cost and reversibility', () => {
  const text = read('docs/adr/0002-task-runner.md');

  it('lists calling npm run directly and why it was not chosen', () => {
    expect(text).toContain('call `npm run` directly');
  });

  it('has a cost and reversibility section', () => {
    expect(text).toContain('## Cost and reversibility');
    expect(text).toContain('reversible');
  });
});

describe('CI covers format, clean and the dependency audit', () => {
  it('bootstrap-check also runs format and clean on every OS', () => {
    const text = read('.github/workflows/bootstrap-check.yml');
    expect(text).toContain('make setup lint format typecheck test clean');
    expect(text).toContain("'setup', 'lint', 'format', 'typecheck', 'test', 'clean'");
  });

  it('ci.yml runs the dependency audit and fails the build on high severity', () => {
    const text = read('.github/workflows/ci.yml');
    expect(text).toContain('node scripts/task.mjs audit');
    expect(text).not.toContain('continue-on-error');
    expect(text).not.toContain('informational');
  });
});

describe('Astro 7 (security upgrade, Venkat approved 20 Nov 2026)', () => {
  it('depends on Astro 7 and the matching MDX integration', () => {
    const pkg = JSON.parse(read('package.json')) as { dependencies: Record<string, string> };
    expect(pkg.dependencies['astro']).toMatch(/^\^7\./);
    expect(pkg.dependencies['@astrojs/mdx']).toMatch(/^\^8\./);
  });

  it('CLAUDE.md and ADR 0001 say Astro 7 and that Linux is the target', () => {
    expect(read('CLAUDE.md')).toContain('Astro 7');
    const adr = read('docs/adr/0001-core-tech-stack.md');
    expect(adr).toContain('Astro 7.4');
    expect(adr).toContain('Update 20 Nov 2026');
    expect(adr).toContain('Linux server');
  });
});

describe('LICENSE (Apache License 2.0, chosen by Venkat on 20 Nov 2026)', () => {
  const text = existsSync('LICENSE') ? read('LICENSE') : '';

  it('is the unmodified standard text', () => {
    expect(text).toContain('Apache License');
    expect(text).toContain('Version 2.0, January 2004');
    expect(text).toContain('TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION');
    expect(text).toContain('APPENDIX: How to apply the Apache License to your work.');
  });

  it('is mentioned by CONTRIBUTING so contributors know what they agree to', () => {
    expect(read('CONTRIBUTING.md')).toContain('Apache License 2.0');
  });
});

describe('document templates and the research index', () => {
  it.each([
    ['docs/prd/_template.md', ['## Problem', '## Goals', '## Non-goals', '## Requirements']],
    [
      'docs/adr/0000-template.md',
      ['## Context', '## Options considered', '## Decision', '## Consequences'],
    ],
    [
      'docs/runbooks/_template.md',
      ['## When to use', '## Steps', '## Rollback', '## Approver of changes'],
    ],
    [
      '.claude/skills/new-post/post-template.md',
      ['draft: true', 'title:', 'description:', 'tags:'],
    ],
    [
      'research/README.md',
      ['## Reference index', '| Source |', 'research/sources/', 'research/briefs/'],
    ],
  ])('%s exists with its required sections', (path, sections) => {
    expect(existsSync(path), path).toBe(true);
    const content = read(path);
    for (const section of sections) expect(content, `${path}: ${section}`).toContain(section);
  });

  it('the new-post skill points at its template', () => {
    expect(read('.claude/skills/new-post/SKILL.md')).toContain('post-template.md');
  });

  it('the post template is not inside content/posts, where it would be built as a post', () => {
    expect(existsSync('content/posts/_template.md')).toBe(false);
  });
});

describe('template fixes from the Solution Architect review', () => {
  it('the ADR template has date, reviewers, supersedes and a cost prompt', () => {
    const text = read('docs/adr/0000-template.md');
    for (const part of ['**Date:**', '**Reviewers:**', '**Supersedes:**', 'Cost (money']) {
      expect(text, part).toContain(part);
    }
  });

  it('the PRD template names owner, reviewer and approver, like the Asana task fields', () => {
    const text = read('docs/prd/_template.md');
    for (const part of ['**Owner:**', '**Reviewer:**', '**Approver:**']) {
      expect(text, part).toContain(part);
    }
  });

  it('the runbook template verifies itself and names who approves changes', () => {
    const text = read('docs/runbooks/_template.md');
    expect(text).toContain('## Verification');
    expect(text).toContain('## Approver of changes');
    expect(text).not.toContain('## Owner');
  });

  it('the post template has no committable sample date', () => {
    const text = read('.claude/skills/new-post/post-template.md');
    expect(text).toContain('date: <YYYY-MM-DD>');
    expect(text).not.toContain('2026-01-01');
  });

  it('the licence is stated the same way in LICENSE, package.json, README and ADR 0003', () => {
    expect(read('LICENSE')).toContain('Apache License');
    expect(read('package.json')).toContain('"license": "Apache-2.0"');
    expect(read('README.md')).toContain('Apache License 2.0');
    const adr = read('docs/adr/0003-licence.md');
    for (const part of ['Apache License 2.0', 'CC BY 4.0', '## Cost and reversibility', 'Venkat']) {
      expect(adr, part).toContain(part);
    }
  });
});
