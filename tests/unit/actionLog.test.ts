import { describe, expect, it } from 'vitest';
import { buildLogEntry } from '../../.claude/hooks/lib/actionLog.mjs';
import { redactSecrets } from '../../.claude/hooks/lib/secrets.mjs';

const awsKey = 'AKIA' + 'IOSFODNN7EXAMPLE';
const now = new Date('2026-11-19T12:00:00.000Z');

describe('redactSecrets', () => {
  it('replaces secrets with a marker that names the pattern', () => {
    expect(redactSecrets(`deploy --key ${awsKey}`)).toBe('deploy --key [REDACTED:aws-access-key]');
  });
  it('leaves clean text unchanged', () => {
    expect(redactSecrets('npm test')).toBe('npm test');
  });
});

describe('buildLogEntry', () => {
  it('logs a shell command with time, tool and target', () => {
    const entry = buildLogEntry({ tool_name: 'Bash', tool_input: { command: 'npm test' } }, now);
    expect(entry).toEqual({ time: '2026-11-19T12:00:00.000Z', tool: 'Bash', target: 'npm test' });
  });
  it('logs the file path for edits and writes, not the content', () => {
    const entry = buildLogEntry(
      { tool_name: 'Write', tool_input: { file_path: 'src/lib/seo.ts', content: 'secret body' } },
      now,
    );
    expect(entry.target).toBe('src/lib/seo.ts');
    expect(JSON.stringify(entry)).not.toContain('secret body');
  });
  it('redacts secrets inside commands', () => {
    const entry = buildLogEntry({ tool_name: 'Bash', tool_input: { command: `x ${awsKey}` } }, now);
    expect(entry.target).toBe('x [REDACTED:aws-access-key]');
  });
  it('truncates long targets', () => {
    const entry = buildLogEntry(
      { tool_name: 'Bash', tool_input: { command: 'a'.repeat(1000) } },
      now,
    );
    expect(entry.target.length).toBeLessThanOrEqual(300);
  });
  it('handles a missing tool name or input', () => {
    expect(buildLogEntry({}, now)).toEqual({
      time: '2026-11-19T12:00:00.000Z',
      tool: 'unknown',
      target: '',
    });
  });
});
