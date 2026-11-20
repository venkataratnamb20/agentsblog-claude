import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const text = read('docs/test-strategy.md');
const section = (name: string) => text.split(`## ${name}`)[1]?.split('\n## ')[0] ?? '';
const HEADINGS = [
  'Test pyramid',
  'Tools',
  'Test environments and data',
  'Gates',
  'Code review checklist',
];
const KINDS = ['unit', 'integration', 'E2E', 'visual', 'accessibility', 'performance', 'security'];

describe('docs/test-strategy.md', () => {
  it.each(HEADINGS)('has the section %s', (heading) => {
    expect(text).toContain(`## ${heading}`);
  });

  it('covers every test kind', () => {
    for (const kind of KINDS) expect(text.toLowerCase(), kind).toContain(kind.toLowerCase());
  });

  it('chooses Playwright, Lighthouse CI and axe', () => {
    for (const tool of ['Playwright', 'Lighthouse CI', 'axe'])
      expect(section('Tools'), tool).toContain(tool);
  });

  it('defines entry and exit criteria for M3, M4 and M5', () => {
    const gates = section('Gates');
    for (const gate of ['M3', 'M4', 'M5']) expect(gates, gate).toContain(gate);
    expect((gates.match(/Entry/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect((gates.match(/Exit/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });

  it('links the code review checklist instead of copying it', () => {
    expect(section('Code review checklist')).toContain('docs/guidelines/code-quality.md');
  });
});
