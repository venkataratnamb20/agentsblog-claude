import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const WHO = 'Venkat, 20 Nov 2026';
const prd = read('docs/prd/prd.md');
const srs = read('docs/srs/srs.md');
const pillars = read('docs/prd/content-pillars.md');
const seo = read('docs/seo-analytics-spec.md');
const threat = read('docs/threat-model.md');
const adrs = [
  'docs/adr/0004-hosting-and-cdn.md',
  'docs/adr/0005-newsletter-provider.md',
  'docs/adr/0006-analytics.md',
  'docs/adr/0007-search.md',
];

describe('PRD records the decisions', () => {
  const section = prd.split('## Decisions')[1]?.split('\n## ')[0] ?? '';

  it('has a Decisions section dated and attributed', () => {
    expect(section).toContain(WHO);
  });

  it.each([
    ['roundups count toward the 10 posts of G2', 'roundups count'],
    ['user accounts and logins stay out of scope', 'User accounts and logins'],
    ['search is post-launch', 'post-launch'],
    ['a post needs an explicit draft field', 'explicit `draft` field'],
  ])('records that %s', (_name, phrase) => {
    expect(section).toContain(phrase);
  });

  it('stays a draft until Venkat approves it in Asana', () => {
    expect(prd.split('## Approval')[1] ?? '').toContain('awaiting');
  });
});

describe('SRS, pillars and SEO spec record their decisions', () => {
  it('SRS: assumptions approved, JSON-LD author is the site, no HSTS preload at launch', () => {
    expect(srs).toContain(`Decision (${WHO})`);
    expect(srs).toContain('assumptions approved');
    expect(srs.toLowerCase()).toContain('no `preload`');
  });

  it('pillars: fields, tag rule, Subscribe label and series plan approved', () => {
    expect(pillars).toContain(`Decision (${WHO})`);
    for (const part of ['seriesOrder', 'Subscribe', 'series plan']) {
      expect(pillars, part).toContain(part);
    }
  });

  it('SEO spec: JSON-LD author is the site Agents Blog', () => {
    expect(seo).toContain(`Decision (${WHO})`);
    expect(seo).toContain('Agents Blog');
  });
});

describe('ADRs record the approved direction without approving spend', () => {
  it.each(adrs)('%s', (path) => {
    const text = read(path);
    expect(text).toContain(`Direction approved by ${WHO}`);
    expect(text.toLowerCase()).toContain('account');
    expect(text).toContain('still need');
  });

  it('records the three service choices and the staging decision', () => {
    expect(read(adrs[0] as string)).toContain('Cloudflare Pages');
    expect(read(adrs[0] as string).toLowerCase()).toContain('no custom staging domain');
    expect(read(adrs[1] as string)).toContain('Buttondown');
    expect(read(adrs[2] as string)).toContain('Cloudflare Web Analytics');
  });
});

describe('threat model records the accepted risks', () => {
  it('accepts R01 and R02 and keeps R03 and R12 open', () => {
    expect(threat).toContain(`Accepted by ${WHO}`);
    expect(threat).toMatch(/Accepted by[^\n]*R01[^\n]*R02/);
    expect(threat).toMatch(/still open[^\n]*R03[^\n]*R12/i);
  });
});
