import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const matrix = readFileSync('docs/agents/capability-matrix.md', 'utf8').replace(/\r\n/g, '\n');
const section = matrix.split('## Smoke test results')[1] ?? '';

describe('capability matrix: smoke test results', () => {
  it('has a results section', () => {
    expect(section).not.toBe('');
  });

  it.each([
    'CLAUDE.md rules load',
    'Settings parsed',
    'Skill listed and run',
    'Subagent discovered and run',
    'Hook fires',
    'Pilot',
  ])('records the check "%s" with a result', (check) => {
    const row = section.split('\n').find((line) => line.startsWith(`| ${check}`));
    expect(row, check).toBeDefined();
    expect(row, check).toMatch(/\| (Pass|Fail|Partly|Open) \|/);
  });

  it('logs the failures it found as a task', () => {
    expect(section).toContain('1220712312159337');
  });

  it('states what the check could not cover', () => {
    expect(section).toContain('not logged in');
  });
});
