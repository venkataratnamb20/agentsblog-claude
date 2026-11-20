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

const functionalSection = srs.split('## Functional requirements')[1]?.split('\n## ')[0] ?? '';
const block = (id: string) => functionalSection.split(`### ${id} `)[1]?.split('\n### ')[0] ?? '';
const IN_BLOCK: [string, string][] = [
  ['FR-13', 'Posts'],
  ['FR-13', 'Topics'],
  ['FR-13', 'Series'],
  ['FR-13', 'About'],
  ['FR-13', 'Subscribe'],
  ['FR-13', 'footer'],
  ['FR-14', '/posts/'],
  ['FR-15', '/topics/'],
  ['FR-15', '/topics/<pillar-slug>/'],
  ['FR-16', '/series/'],
  ['FR-16', '/series/<slug>/'],
  ['FR-17', '/tags/'],
  ['FR-17', '/tags/<tag>/'],
];

describe('docs/srs/srs.md navigation routes (UX review follow-up, decided 20 Nov 2026)', () => {
  it.each(IN_BLOCK)('%s defines %s', (id, part) => {
    expect(block(id), `${id} ${part}`).toContain(part);
  });

  it('keeps search out of the launch navigation inside FR-13', () => {
    expect(block('FR-13').toLowerCase()).toContain('post-launch');
  });

  it('FR-13 criteria are testable: JavaScript off and a non-colour current-page marker', () => {
    const nav = block('FR-13');
    expect(nav).toContain('JavaScript disabled');
    expect(nav).toMatch(/axe|computed style/);
  });

  it('traces the new requirements to the PRD and no longer lists them as open', () => {
    const trace = srs.split('## Traceability')[1]?.split('\n## ')[0] ?? '';
    for (const id of ['FR-13', 'FR-14', 'FR-15', 'FR-16', 'FR-17']) expect(trace, id).toContain(id);
    expect(srs.split('## Open questions')[1] ?? '').not.toContain(
      'are new requirements still to be added',
    );
  });
});

describe('docs/srs/srs.md settles the questions from the architect review', () => {
  it('FR-16 says where the series display name comes from', () => {
    expect(block('FR-16')).toContain('derived from the `series` slug');
  });

  it('FR-17 says whether pillar tag pages exist', () => {
    expect(block('FR-17').toLowerCase()).toContain('pillar tag');
  });

  it('FR-3 says the series fields were approved and no longer calls them proposals', () => {
    const fr3 = block('FR-3');
    expect(fr3).toContain('approved');
    expect(fr3).not.toContain('proposals for the Solution Architect to confirm');
  });

  it('the architecture lists the same routes', () => {
    const arch = existsSync('docs/architecture.md')
      ? readFileSync('docs/architecture.md', 'utf8')
      : '';
    for (const route of ['/posts/', '/topics/<pillar-slug>/', '/series/<slug>/', '/tags/<tag>/']) {
      expect(arch, route).toContain(route);
    }
  });
});
