import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const guide = read('docs/guidelines/editorial-style-guide.md');
const template = read('.claude/skills/new-post/post-template.md');
const section = (name: string) => guide.split(`## ${name}`)[1]?.split('\n## ')[0] ?? '';
const HEADINGS = [
  'Voice and tone',
  'Structure of a post',
  'Titles and descriptions',
  'Code samples',
  'Diagrams and images',
  'Sources and citations',
  'Accessibility',
  'Content QA checklist',
];

describe('docs/guidelines/editorial-style-guide.md', () => {
  it.each(HEADINGS)('has the section %s', (heading) => {
    expect(guide).toContain(`## ${heading}`);
  });

  it('matches the front-matter limits of the content schema', () => {
    const rules = section('Titles and descriptions');
    expect(rules).toContain('70');
    expect(rules).toContain('160');
    expect(rules).toContain('draft: true');
  });

  it('requires TL;DR, diagrams, code and sources in a post', () => {
    const structure = section('Structure of a post');
    for (const part of ['TL;DR', 'Sources', 'diagram', 'code']) {
      expect(structure.toLowerCase(), part).toContain(part.toLowerCase());
    }
  });

  it('says every code sample was run and names what to record', () => {
    const code = section('Code samples');
    expect(code).toContain('run');
    expect(code).toContain('version');
  });

  it('requires alt text and sources for every claim', () => {
    expect(section('Diagrams and images')).toContain('alt text');
    expect(section('Sources and citations')).toContain('every claim');
  });

  it('has a checklist the Technical Editor ticks before approval', () => {
    const items = section('Content QA checklist')
      .split('\n')
      .filter((line) => line.startsWith('- [ ] '));
    expect(items.length).toBeGreaterThanOrEqual(8);
  });

  it('is linked from CLAUDE.md and from the new-post skill', () => {
    expect(read('CLAUDE.md')).toContain('docs/guidelines/editorial-style-guide.md');
    expect(read('.claude/skills/new-post/SKILL.md')).toContain('editorial-style-guide.md');
  });
});

describe('the post template follows the style guide', () => {
  it('has a TL;DR and a Sources section and still starts as a draft', () => {
    expect(template).toContain('## TL;DR');
    expect(template).toContain('## Sources');
    expect(template).toContain('draft: true');
  });
});
