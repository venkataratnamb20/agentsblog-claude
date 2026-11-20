import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const text = read('docs/seo-analytics-spec.md');
const section = (name: string) => text.split(`## ${name}`)[1]?.split('\n## ')[0] ?? '';
const PILLARS = [
  'Architectures',
  'Tools and MCP',
  'Memory and RAG',
  'Multi-agent',
  'Evals and safety',
];
const HEADINGS = [
  'Keyword map',
  'URL and slug rules',
  'Metadata and schema.org',
  'Event tracking plan',
];
const MEASURES = [
  'Lighthouse',
  'uptime',
  'cadence hit rate',
  'draft-to-publish',
  'confirmed subscribers',
  'conversion',
  'open rate',
  'click rate',
  'unsubscribes',
  'unique visitors',
  'returning readers',
  'engaged time',
  'backlinks',
  'organic search clicks',
  'indexed',
];

describe('docs/seo-analytics-spec.md', () => {
  it.each(HEADINGS)('has the section %s', (heading) => {
    expect(text).toContain(`## ${heading}`);
  });

  it('maps keywords for every pillar', () => {
    for (const pillar of PILLARS) expect(section('Keyword map'), pillar).toContain(pillar);
  });

  it('plans BlogPosting schema, canonical URLs and slug rules', () => {
    for (const part of ['BlogPosting', 'canonical', 'slug', 'src/lib/seo.ts']) {
      expect(text, part).toContain(part);
    }
  });

  it('gives every charter KPI and KPM a data source and an event or report', () => {
    const plan = section('Event tracking plan');
    expect(plan).toContain('Data source');
    expect(plan).toContain('Event or report');
    for (const m of MEASURES) expect(plan.toLowerCase(), m).toContain(m.toLowerCase());
  });
});
