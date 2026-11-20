import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const FILES = [
  'docs/adr/0004-hosting-and-cdn.md',
  'docs/adr/0005-newsletter-provider.md',
  'docs/adr/0006-analytics.md',
  'docs/adr/0007-search.md',
  'docs/adr/0008-monthly-cost-estimate.md',
];

describe.each(FILES)('%s', (path) => {
  const text = read(path);

  it('exists and has status, options, cost and decision', () => {
    expect(text, path).not.toBe('');
    for (const part of ['**Status:**', '## Options considered', '## Cost', '## Decision']) {
      expect(text, part).toContain(part);
    }
  });

  it('compares at least two options in a table and checks the SRS targets', () => {
    expect(text.split('\n').filter((l) => l.startsWith('|')).length).toBeGreaterThanOrEqual(4);
    expect(text).toContain('SRS');
  });
});

describe('ADR specifics', () => {
  it('the hosting ADR confirms that ADR 0001 (Astro, static output) fits', () => {
    const text = read('docs/adr/0004-hosting-and-cdn.md');
    expect(text).toContain('ADR 0001');
    expect(text).toContain('static');
  });

  it('every ADR with a paid option waits for Venkat, and the estimate is per month', () => {
    for (const path of FILES.slice(0, 4)) expect(read(path), path).toContain('Venkat');
    expect(read('docs/adr/0008-monthly-cost-estimate.md')).toContain('per month');
  });
});
