import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const text = read('docs/prd/content-pillars.md');
const pillars = text.split(/\n### Pillar \d: /).slice(1);
const NAMES = [
  'Architectures',
  'Tools and MCP',
  'Memory and RAG',
  'Multi-agent',
  'Evals and safety',
];

describe('docs/prd/content-pillars.md', () => {
  it('has exactly five pillars with the agreed names', () => {
    expect(pillars.length).toBe(5);
    NAMES.forEach((name, i) => expect(pillars[i]?.startsWith(name), name).toBe(true));
  });

  it('gives each pillar an audience need, five or more topic ideas and target keywords', () => {
    for (const pillar of pillars) {
      expect(pillar).toContain('**Audience need**');
      expect(pillar).toContain('**Target keywords**');
      const ideas = pillar.split('**Topic ideas**')[1]?.split('**Target keywords**')[0] ?? '';
      expect(ideas.split('\n').filter((l) => l.startsWith('- ')).length).toBeGreaterThanOrEqual(5);
    }
  });

  it('defines tags and series, and how they appear in navigation', () => {
    expect(text).toContain('## Tags and series');
    expect(text).toContain('navigation');
    expect(text).toContain('slug');
  });
});
