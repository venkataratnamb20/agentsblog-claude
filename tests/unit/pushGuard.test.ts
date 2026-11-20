import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// push-guard.mjs blocks a push (exit 2) while main or develop is checked out, and any push that names
// main or develop as its target. It fails closed: if it cannot tell the branch, it blocks.
const HOOK = resolve('.claude/hooks/push-guard.mjs');
let repo = '';

function git(...args: string[]) {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8' });
  expect(result.status, `git ${args.join(' ')}: ${result.stderr}`).toBe(0);
}

function guard(command: string, projectDir = repo) {
  const input = JSON.stringify({ tool_name: 'Bash', tool_input: { command } });
  return spawnSync('node', [HOOK], {
    input,
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
  });
}

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'push-guard-'));
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'Test');
  writeFileSync(join(repo, 'a.txt'), 'a\n');
  git('add', 'a.txt');
  git('commit', '-q', '-m', 'init');
});

afterEach(() => {
  rmSync(repo, { recursive: true, force: true });
});

describe('push-guard on a protected branch', () => {
  it.each(['git push', 'git push origin HEAD', 'git push -u origin HEAD'])(
    'blocks %s while main is checked out',
    (command) => {
      const result = guard(command);
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('Blocked by push-guard');
    },
  );

  it('blocks a push while develop is checked out', () => {
    git('checkout', '-q', '-b', 'develop');
    expect(guard('git push origin HEAD').status).toBe(2);
  });

  it('allows commands that are not pushes', () => {
    expect(guard('git status').status).toBe(0);
    expect(guard('npm test').status).toBe(0);
  });
});

describe('push-guard on a feature branch', () => {
  beforeEach(() => git('checkout', '-q', '-b', 'feature/123-x'));

  it('allows pushing the feature branch', () => {
    expect(guard('git push -u origin HEAD').status).toBe(0);
    expect(guard('git push origin feature/123-x').status).toBe(0);
  });

  it.each([
    'git push origin HEAD:main',
    'git push origin HEAD:develop',
    'git push origin feature/123-x:refs/heads/main',
    'git push origin +HEAD:main',
  ])('blocks %s because it names a protected target', (command) => {
    expect(guard(command).status).toBe(2);
  });

  it('blocks a push from a detached HEAD', () => {
    git('checkout', '-q', '--detach');
    expect(guard('git push origin HEAD').status).toBe(2);
  });

  it.each([
    'git push --all',
    'git push --all origin',
    'git push origin --mirror',
    'git push --mirror',
    'env git push origin "main"',
    "git push origin 'develop'",
    'git \\\npush origin HEAD:main',
  ])('blocks %s', (command) => {
    expect(guard(command).status).toBe(2);
  });
});

describe('push-guard on a feature branch that tracks a protected branch', () => {
  let remote = '';

  beforeEach(() => {
    remote = mkdtempSync(join(tmpdir(), 'push-guard-remote-'));
    spawnSync('git', ['init', '-q', '--bare', remote], { encoding: 'utf8' });
    git('remote', 'add', 'origin', remote);
    git('push', '-q', 'origin', 'main');
    git('checkout', '-q', '-b', 'feature/456-y', '--track', 'origin/main');
  });

  afterEach(() => {
    rmSync(remote, { recursive: true, force: true });
  });

  it.each(['git push', 'git push origin', 'env git push -v'])(
    'blocks the bare push %s because its upstream is protected',
    (command) => {
      const result = guard(command);
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('upstream');
    },
  );

  it('still allows an explicit push of the feature branch', () => {
    expect(guard('git push -u origin HEAD').status).toBe(0);
    expect(guard('git push origin feature/456-y').status).toBe(0);
  });
});

describe('push-guard fails closed', () => {
  it('blocks a push when the project folder is not a git repository', () => {
    const plain = mkdtempSync(join(tmpdir(), 'push-guard-plain-'));
    try {
      expect(guard('git push', plain).status).toBe(2);
    } finally {
      rmSync(plain, { recursive: true, force: true });
    }
  });

  it('exits 2 on unreadable input', () => {
    const result = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
    expect(result.status).toBe(2);
  });

  it('exits 2 when it cannot start (its library import is missing)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'push-guard-crash-'));
    try {
      const copy = join(dir, 'push-guard.mjs');
      copyFileSync(HOOK, copy);
      const result = spawnSync('node', [copy], {
        input: JSON.stringify({ tool_input: { command: 'git status' } }),
        encoding: 'utf8',
      });
      expect(result.status).toBe(2);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
