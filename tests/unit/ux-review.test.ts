import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const pillars = read('docs/prd/content-pillars.md');
const srs = read('docs/srs/srs.md');
const PHRASE = 'UX review (20 Nov 2026)';

describe('UX review of the navigation (content-pillars.md)', () => {
  it('records the UX review with a clear outcome', () => {
    expect(pillars).toContain(PHRASE);
    expect(pillars).toMatch(
      /UX review \(20 Nov 2026\)[^\n]*(agreed|agreed with changes|changes requested)/i,
    );
  });

  it('no longer says the UX sign-off is still open without the review', () => {
    expect(pillars).not.toContain('UX has not reviewed');
    expect(pillars).not.toContain('UX sign-off is still open');
  });

  it('covers how pillars, tags and series appear in navigation', () => {
    const nav = pillars.split('navigation').slice(1).join(' ');
    for (const part of ['pillar', 'tag', 'series']) expect(nav.toLowerCase(), part).toContain(part);
  });
});

describe('UX review of the accessibility requirements (srs.md)', () => {
  const ar = srs.split('## Accessibility requirements')[1]?.split('\n## ')[0] ?? '';

  it('records the UX review in the accessibility section', () => {
    expect(ar).toContain(PHRASE);
  });

  it('keeps WCAG 2.2 AA and the core checks', () => {
    for (const part of [
      'WCAG 2.2 AA',
      'contrast',
      'keyboard',
      'focus',
      'alt text',
      'reduced motion',
    ]) {
      expect(ar.toLowerCase(), part).toContain(part.toLowerCase());
    }
  });

  it('has at least eleven numbered requirements', () => {
    expect((ar.match(/AR-\d+/g) ?? []).length).toBeGreaterThanOrEqual(11);
  });
});
