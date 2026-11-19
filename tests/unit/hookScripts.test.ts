import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// Runs the real hook scripts the way Claude Code does: hook JSON on stdin, exit code and stderr out.
function run(script: string, input: string) {
  const result = spawnSync('node', [script], { input, encoding: 'utf8' });
  return { status: result.status, stderr: result.stderr };
}

const awsKey = 'AKIA' + 'IOSFODNN7EXAMPLE';
const write = (filePath: string, content: string) =>
  JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath, content } });
const bash = (command: string) => JSON.stringify({ tool_name: 'Bash', tool_input: { command } });

describe('block-secrets.mjs', () => {
  const script = '.claude/hooks/block-secrets.mjs';

  it('allows an ordinary write', () => {
    expect(run(script, write('src/lib/a.ts', 'export const a = 1;')).status).toBe(0);
  });
  it('blocks a secret file path regardless of case', () => {
    expect(run(script, write('C:/repo/.ENV', 'A=1')).status).toBe(2);
  });
  it('blocks secret-looking content and names the pattern, not the value', () => {
    const result = run(script, write('src/a.ts', `const k = "${awsKey}";`));
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('aws-access-key');
    expect(result.stderr).not.toContain(awsKey);
  });
  it('fails closed on input that is not valid JSON', () => {
    expect(run(script, 'not json').status).toBe(2);
  });
});

describe('pre-commit-gate.mjs', () => {
  const script = '.claude/hooks/pre-commit-gate.mjs';

  it('ignores commands that are not commits', () => {
    expect(run(script, bash('git status')).status).toBe(0);
  });
  it('blocks a commit that skips hooks with --no-verify', () => {
    const result = run(script, bash('git commit --no-verify -m "x"'));
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('--no-verify');
  });
  it('blocks a commit that skips hooks with -n', () => {
    expect(run(script, bash('git commit -n -m "x"')).status).toBe(2);
  });
  it('detects a commit hidden inside bash -c', () => {
    expect(run(script, bash('bash -c "git commit --no-verify -m x"')).status).toBe(2);
  });
  it('fails closed on input that is not valid JSON', () => {
    expect(run(script, 'not json').status).toBe(2);
  });
});

describe('pre-commit-gate.mjs secret scan', () => {
  const script = resolve('.claude/hooks/pre-commit-gate.mjs');
  let repo = '';

  const git = (...args: string[]) => spawnSync('git', args, { cwd: repo, encoding: 'utf8' });
  const gate = (command: string) =>
    spawnSync('node', [script], {
      cwd: repo,
      input: bash(command),
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_PROJECT_DIR: repo },
    });

  beforeEach(() => {
    repo = mkdtempSync(join(tmpdir(), 'gate-'));
    git('init', '-q');
    git('config', 'user.email', 'test@example.com');
    git('config', 'user.name', 'Test');
    writeFileSync(join(repo, 'a.ts'), 'export const a = 1;\n');
    git('add', 'a.ts');
    git('commit', '-q', '-m', 'init');
  });

  afterEach(() => {
    rmSync(repo, { recursive: true, force: true });
  });

  it('blocks a commit when the staged diff contains a secret', () => {
    writeFileSync(join(repo, 'a.ts'), `const k = "${awsKey}";\n`);
    git('add', 'a.ts');
    const result = gate('git commit -m "x"');
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('aws-access-key');
  });

  it('with -am also scans changes that are not staged yet', () => {
    writeFileSync(join(repo, 'a.ts'), `const k = "${awsKey}";\n`);
    const result = gate('git commit -am "x"');
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('aws-access-key');
  });
});
