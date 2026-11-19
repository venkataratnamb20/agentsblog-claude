import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';
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

  it('describeTasks has one line per target: name, then its description', () => {
    const lines = describeTasks().split('\n');
    for (const [name, task] of Object.entries(TASKS)) {
      const line = lines.find((l) => l.trimStart().startsWith(`${name} `));
      expect(line, name).toBeDefined();
      expect(line, name).toContain(task.description);
    }
    expect(lines.length).toBe(REQUIRED.length);
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

  it('make.ps1 runs the runner from its own folder and passes the exit code on', () => {
    expect(powershell).toMatch(/^node "\$PSScriptRoot\/scripts\/task\.mjs" \$Target$/m);
    expect(powershell).toMatch(/^exit \$LASTEXITCODE$/m);
    expect(powershell).not.toContain('sync-agents');
  });

  it('make.ps1 stops on errors and never exits 0 when the runner did not run', () => {
    expect(powershell).toMatch(/^\$ErrorActionPreference = 'Stop'$/m);
    expect(powershell).toMatch(/^if \(\$null -eq \$LASTEXITCODE\) \{ exit 1 \}$/m);
  });
});

describe('each target runs exactly the expected command', () => {
  const EXPECTED: Record<string, string[]> = {
    setup: ['ci'],
    dev: ['run', 'dev'],
    lint: ['run', 'lint'],
    format: ['run', 'format'],
    typecheck: ['run', 'typecheck'],
    test: ['test'],
    coverage: ['run', 'coverage'],
    build: ['run', 'build'],
    preview: ['run', 'preview'],
    audit: ['audit', '--audit-level=high'],
    clean: ['run', 'clean'],
  };

  it.each(Object.entries(EXPECTED))('%s runs npm %j', (name, args) => {
    expect(TASKS[name]?.npm).toEqual(args);
  });
});

describe('scripts/task.mjs rejects names that only exist on Object.prototype', () => {
  it.each(['constructor', '__proto__', 'toString', 'hasOwnProperty'])('%s', (name) => {
    const result = run(name);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Unknown target');
  });
});

describe.skipIf(process.platform !== 'win32')('make.ps1 on Windows PowerShell', () => {
  const ps = (command: string) =>
    spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command], {
      encoding: 'utf8',
    });

  it('works from a sub folder', () => {
    const result = ps('Set-Location docs; & ../make.ps1 help; exit $LASTEXITCODE');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('typecheck');
  }, 30_000);

  it('fails instead of passing when node cannot be found', () => {
    const root = process.env.SystemRoot ?? 'C:/Windows';
    const powershell = join(root, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
    const withoutNode = (process.env.PATH ?? '')
      .split(delimiter)
      .filter((dir) => dir && !existsSync(join(dir, 'node.exe')))
      .join(delimiter);
    const result = spawnSync(
      powershell,
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'make.ps1', 'help'],
      { encoding: 'utf8', env: { ...process.env, PATH: withoutNode } },
    );
    expect(result.status).not.toBe(0);
  }, 60_000);
});
