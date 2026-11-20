import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// Claude Code only blocks a tool call on exit code 2. Any other non-zero exit lets the call through,
// so a crash inside a guard hook must still end in exit 2.
let dir = '';

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'hook-crash-'));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

function runBroken(hook: string, input: string) {
  // Copy only the hook: its ./lib import cannot be found, which is a realistic crash.
  const copy = join(dir, hook);
  copyFileSync(resolve('.claude/hooks', hook), copy);
  return spawnSync('node', [copy], { input, encoding: 'utf8', env: { ...process.env } });
}

describe('guard hooks fail closed on an unexpected crash', () => {
  it.each(['block-secrets.mjs', 'pre-commit-gate.mjs'])(
    '%s exits 2 when it cannot start',
    (hook) => {
      const result = runBroken(hook, '{"tool_input":{"command":"git status","file_path":"a.ts"}}');
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('Blocked by');
    },
  );

  it.each(['block-secrets.mjs', 'pre-commit-gate.mjs'])(
    '%s exits 2 on unreadable input',
    (hook) => {
      const result = spawnSync('node', [resolve('.claude/hooks', hook)], {
        input: 'not json',
        encoding: 'utf8',
      });
      expect(result.status).toBe(2);
    },
  );

  it('log-actions never blocks, even when it crashes', () => {
    const result = runBroken('log-actions.mjs', '{}');
    expect(result.status).not.toBe(2);
  });
});

describe('pre-commit-gate refuses git aliases that could hide a commit', () => {
  const gate = (command: string) =>
    spawnSync('node', [resolve('.claude/hooks/pre-commit-gate.mjs')], {
      input: JSON.stringify({ tool_input: { command } }),
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_GATE_RUNNING: '1' },
    });

  it.each(['git -c alias.x=commit x', 'git config alias.ci commit'])('blocks %s', (command) => {
    const result = gate(command);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('alias');
  });

  it('still allows ordinary non-commit git commands', () => {
    expect(gate('git status').status).toBe(0);
  });
});
