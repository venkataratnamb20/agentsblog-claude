import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

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
