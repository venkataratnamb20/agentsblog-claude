import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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

describe('scripts/scan-secrets.mjs fails closed (security review round)', () => {
  it('fails when a tracked secret file is present, even with a harmless value', () => {
    writeFileSync(join(repo, '.env'), 'NAME=value\n');
    git('add', '-f', '.env');
    const result = scan();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('.env is a secret file');
  });

  it('fails when a staged secret file is present in --staged mode', () => {
    writeFileSync(join(repo, 'server.pem'), 'harmless\n');
    git('add', 'server.pem');
    const result = scan('--staged');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('server.pem is a secret file');
  });

  it('allows .env.example', () => {
    writeFileSync(join(repo, '.env.example'), 'NAME=\n');
    git('add', '.env.example');
    expect(scan().status).toBe(0);
  });

  it('fails instead of skipping a tracked path it cannot read', () => {
    writeFileSync(join(repo, 'a.ts'), 'export const a = 1;\n');
    git('add', 'a.ts');
    rmSync(join(repo, 'a.ts'));
    mkdirSync(join(repo, 'a.ts'));
    const result = scan();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('a.ts could not be read');
  });

  it('still passes when a tracked file was simply deleted from the working tree', () => {
    writeFileSync(join(repo, 'gone.ts'), 'export const a = 1;\n');
    git('add', 'gone.ts');
    rmSync(join(repo, 'gone.ts'));
    expect(scan().status).toBe(0);
  });
});
