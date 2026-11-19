import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = resolve('scripts/scan-secrets.mjs');
const awsKey = 'AKIA' + 'IOSFODNN7EXAMPLE';

let repo = '';

function git(...args: string[]) {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8' });
  expect(result.status, `git ${args.join(' ')}: ${result.stderr}`).toBe(0);
}

function scan(...args: string[]) {
  const result = spawnSync('node', [SCRIPT, ...args], { cwd: repo, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'scan-secrets-'));
  git('init', '-q');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'Test');
});

afterEach(() => {
  rmSync(repo, { recursive: true, force: true });
});

describe('scripts/scan-secrets.mjs', () => {
  it('passes on a clean repository', () => {
    writeFileSync(join(repo, 'a.ts'), 'export const a = 1;\n');
    git('add', 'a.ts');
    const result = scan();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('secret scan passed');
  });

  it('fails on a tracked file with a secret and reports file, line and pattern only', () => {
    writeFileSync(join(repo, 'config.ts'), `export const a = 1;\nconst k = "${awsKey}";\n`);
    git('add', 'config.ts');
    const result = scan();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('config.ts:2');
    expect(result.stderr).toContain('aws-access-key');
    expect(result.stderr).not.toContain(awsKey);
  });

  it('in --staged mode reads the staged content, not the working copy', () => {
    writeFileSync(join(repo, 'config.ts'), `const k = "${awsKey}";\n`);
    git('add', 'config.ts');
    writeFileSync(join(repo, 'config.ts'), 'const k = "removed from the working copy";\n');
    expect(scan('--staged').status).toBe(1);
  });

  it('in --staged mode ignores files that are not staged', () => {
    writeFileSync(join(repo, 'ok.ts'), 'export const ok = 1;\n');
    git('add', 'ok.ts');
    writeFileSync(join(repo, 'untracked.ts'), `const k = "${awsKey}";\n`);
    expect(scan('--staged').status).toBe(0);
  });
});
