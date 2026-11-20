import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const prd = read('docs/prd/prd.md');
const charter = read('docs/prd/charter.md');
const features = prd.split(/\n### F\d+/).slice(1);

describe('docs/prd/charter.md (copy of the Asana charter)', () => {
  it('holds the four SMART goals and their KPIs and KPMs', () => {
    for (const part of ['G1', 'G2', 'G3', 'G4', 'KPIs', 'KPMs', '14 Dec 2026']) {
      expect(charter, part).toContain(part);
    }
  });
});

describe('docs/prd/prd.md', () => {
  it.each([
    '## Problem',
    '## Audience',
    '## Goals',
    '## KPIs and KPMs',
    '## In scope',
    '## Out of scope',
    '## MVP features',
    '## Post formats',
    '## Publishing cadence',
    '## Approval',
  ])('has the section %s', (heading) => {
    expect(prd).toContain(heading);
  });

  it('states the four SMART goals with their dates', () => {
    for (const part of ['G1', 'G2', 'G3', 'G4', '14 Dec 2026', '15 Feb 2027', '26 Feb 2027']) {
      expect(prd, part).toContain(part);
    }
  });

  it('keeps comments, sponsorships and paid ads out of scope', () => {
    const out = (prd.split('## Out of scope')[1] ?? '').toLowerCase();
    for (const part of ['comments', 'sponsorships', 'paid ads']) expect(out, part).toContain(part);
  });
});

describe('PRD feature list', () => {
  it('has at least eight MVP features', () => {
    expect(features.length).toBeGreaterThanOrEqual(8);
  });

  it('gives every feature a priority and acceptance criteria', () => {
    for (const feature of features) {
      expect(feature).toMatch(/Priority: P[012]/);
      expect(feature).toContain('**Acceptance criteria**');
    }
  });

  it('is waiting for Venkat to approve it', () => {
    expect(prd.split('## Approval')[1] ?? '').toContain('Venkat');
  });
});
