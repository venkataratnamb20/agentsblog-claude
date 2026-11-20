import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const srs = read('docs/srs/srs.md');
const reqs = srs.split(/\n### FR-\d+/).slice(1);
const NFR = [
  'LCP',
  '2.5 s',
  'INP',
  '200 ms',
  'CLS',
  '0.1',
  '99.9%',
  'WCAG 2.2 AA',
  'OWASP',
  'UK GDPR',
  'PECR',
];
const FEATURES = [
  'posts',
  'tags',
  'series',
  'rss',
  'search',
  'newsletter',
  'code block',
  'dark mode',
  'related posts',
];

describe('docs/srs/srs.md functional requirements', () => {
  it('has the two main sections', () => {
    expect(srs).toContain('## Functional requirements');
    expect(srs).toContain('## Non-functional requirements');
  });

  it('covers every feature the task lists', () => {
    const lower = srs.toLowerCase();
    for (const f of FEATURES) expect(lower, f).toContain(f);
  });

  it('gives every requirement Given, When and Then criteria', () => {
    expect(reqs.length).toBeGreaterThanOrEqual(9);
    for (const req of reqs) {
      for (const word of ['Given', 'When', 'Then']) expect(req, word).toContain(word);
    }
  });
});

describe('docs/srs/srs.md non-functional requirements', () => {
  it.each(NFR)('states %s', (part) => {
    expect(srs.split('## Non-functional requirements')[1] ?? '').toContain(part);
  });

  it('has security and privacy and accessibility sections', () => {
    expect(srs).toContain('## Security and privacy requirements');
    expect(srs).toContain('## Accessibility requirements');
  });
});

describe('docs/srs/srs.md navigation routes (UX review follow-up, decided 20 Nov 2026)', () => {
  const functional = srs.split('## Functional requirements')[1]?.split('\n## ')[0] ?? '';
  const ROUTES = ['/posts/', '/topics/', '/series/', '/series/<slug>/', '/tags/', '/tags/<tag>/'];

  it.each(ROUTES)('defines the route %s as a functional requirement', (route) => {
    expect(functional, route).toContain(route);
  });

  it('defines the main navigation items and the footer links', () => {
    for (const part of ['Posts', 'Topics', 'Series', 'About', 'Subscribe', 'footer']) {
      expect(functional, part).toContain(part);
    }
  });

  it('keeps search out of the launch navigation', () => {
    const nav = functional.split('### FR-13')[1]?.split('\n### ')[0] ?? '';
    expect(nav.toLowerCase()).toContain('post-launch');
  });

  it('traces the new requirements to the PRD and no longer lists them as open', () => {
    const trace = srs.split('## Traceability')[1]?.split('\n## ')[0] ?? '';
    expect(trace).toMatch(/FR-1[3-9]/);
    expect(srs.split('## Open questions')[1] ?? '').not.toContain(
      'are new requirements still to be added',
    );
  });
});
