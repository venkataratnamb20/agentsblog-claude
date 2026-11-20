import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const text = read('docs/architecture.md');
const section = (name: string) => text.split(`## ${name}`)[1]?.split('\n## ')[0] ?? '';
const HEADINGS = [
  'Architecture diagram',
  'Data flows',
  'Content model',
  'Environments',
  'Integration points',
];
const MODEL = [
  'Post',
  'Author',
  'Tag',
  'Series',
  'front-matter',
  'title',
  'description',
  'date',
  'tags',
  'draft',
];

describe('docs/architecture.md', () => {
  it.each(HEADINGS)('has the section %s', (heading) => {
    expect(text).toContain(`## ${heading}`);
  });

  it('has a diagram', () => {
    expect(text).toContain('```mermaid');
  });

  it('defines the content model: post, author, tag, series and the front-matter schema', () => {
    for (const part of MODEL) expect(section('Content model'), part).toContain(part);
  });

  it('plans local, preview, staging and production', () => {
    for (const env of ['local', 'preview', 'staging', 'production']) {
      expect(section('Environments').toLowerCase(), env).toContain(env);
    }
  });

  it('defines integration points for newsletter, analytics and search', () => {
    for (const part of ['newsletter', 'analytics', 'search']) {
      expect(section('Integration points').toLowerCase(), part).toContain(part);
    }
  });
});
