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
