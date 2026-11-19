import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TASKS, describeTasks } from '../../scripts/lib/tasks.mjs';

const read = (path: string) => readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const REQUIRED = [
  'setup',
  'dev',
  'lint',
  'format',
  'typecheck',
  'test',
  'test-e2e',
  'test-bdd',
  'coverage',
  'build',
  'preview',
  'audit',
  'release',
  'clean',
];

function run(...args: string[]) {
  const result = spawnSync('node', ['scripts/task.mjs', ...args], { encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe('task table (scripts/lib/tasks.mjs)', () => {
  it('has exactly the required targets', () => {
    expect(Object.keys(TASKS).sort()).toEqual([...REQUIRED].sort());
  });

  it.each(REQUIRED)(
    '%s has a description and either an npm command or a reason it is unavailable',
    (name) => {
      const task = TASKS[name];
      expect(task?.description, name).toBeTruthy();
      expect(Boolean(task?.npm) !== Boolean(task?.unavailable), name).toBe(true);
    },
  );

  it('every npm command refers to a script that exists in package.json', () => {
    const scripts = (JSON.parse(read('package.json')) as { scripts: Record<string, string> })
      .scripts;
    for (const [name, task] of Object.entries(TASKS)) {
      if (task.npm?.[0] === 'run') expect(scripts[task.npm[1] ?? ''], name).toBeTruthy();
    }
  });

  it('unavailable targets say which task they wait for', () => {
    for (const [name, task] of Object.entries(TASKS)) {
      if (task.unavailable) expect(task.unavailable, name).toContain('available after');
    }
  });

  it('describeTasks lists every target with its description', () => {
    const text = describeTasks();
    for (const name of REQUIRED) expect(text).toContain(name);
    expect(text).toContain(TASKS['lint']?.description ?? 'missing');
  });
});

describe('scripts/task.mjs', () => {
  it('help lists the targets and exits 0', () => {
    const result = run('help');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('typecheck');
  });

  it('an unavailable target fails with a clear message', () => {
    const result = run('test-e2e');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('not available yet');
    expect(result.stderr).toContain('available after');
  });

  it('an unknown target fails and points at help', () => {
    const result = run('nope');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('help');
  });
});

describe('Makefile and make.ps1 stay in step with the table', () => {
  const makefile = read('Makefile');
  const powershell = read('make.ps1');

  it.each(REQUIRED)('Makefile has an explicit rule for %s that calls the runner', (name) => {
    expect(makefile).toMatch(new RegExp(`^${name}:.*\\n\\t@node scripts/task\\.mjs ${name}$`, 'm'));
  });

  it('Makefile declares every target phony', () => {
    const phony = /^\.PHONY: (.*)$/m.exec(makefile)?.[1]?.split(' ') ?? [];
    for (const name of REQUIRED) expect(phony).toContain(name);
  });

  it('make.ps1 passes the target to the same runner and keeps its exit code', () => {
    expect(powershell).toContain('scripts/task.mjs');
    expect(powershell).toContain('$LASTEXITCODE');
    expect(powershell).not.toContain('sync-agents');
  });
});
